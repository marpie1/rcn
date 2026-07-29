#!/usr/bin/env python3
"""
load_aspects.py — the 16 aspect drawings, with EXACT provenance.

    python3 substrate/load_aspects.py --verify

Loads into its own database, `aspects16`.

WHY THIS EXISTS SEPARATELY FROM composite26. `composite26` holds the signed CLD
— a curated artifact whose node provenance had to be reconstructed and whose
edge provenance came from the CLD's own `props.source` field, in a different
naming scheme, with 12 edges carrying none at all. Good enough to show gold;
not good enough to slice back apart.

Here provenance is exact, because it is read from the drawings themselves: a
node or edge carries the aspect files it actually appeared in. That exactness
is what makes a subgraph addressable —

    a subgraph is not stored, it is a FILTER: WHERE 'org' IN c.sources

— which is the payoff of keeping `sources` as a list rather than a scalar. The
16 drawings and their union are the same data, read two ways. Nothing is
duplicated to make both work.

It is also what makes write-back safe. Replacing the `org` drawing means:
drop 'org' from every sources list, delete whatever is left with no sources at
all, then insert the new content carrying 'org'. Nodes another aspect also drew
survive, because they still have a witness. One contributor can never delete
another's work.

MERGE KEYS
  nodes  schemaLabel            — the merge key, doing the job it exists for
  edges  (srcSchema, tgtSchema, label)
"""
import json, os, sys, glob, argparse
from collections import defaultdict
from db import run
from seed import read_families, read_edge_families, BASE
from load_composite import suggest_family

ASPECTS = os.path.join(BASE, 'tools', 'eip-aspects-variabilized', '*.json')
DB = 'aspects16'
MODE = 'EIP'


def slug(s):
    return ''.join(ch if ch.isalnum() else '_' for ch in s)


def canon(schema_label):
    """Canonicalise the merge key.

    families.js: "Concepts are keyed spacelessly (ActiveGoal, SideEffect)
    because sources disagree about the spaces." The aspect drawings prove it —
    one writes `Active Goal`, another `ActiveGoal`. Left alone that is not a
    cosmetic difference: it is the SAME CONCEPT SPLITTING IN TWO, appearing as
    two nodes that never merge and never go gold. A merge key that does not
    normalise is not a merge key.
    """
    return ''.join(schema_label.split())


def read_aspects():
    """-> (concepts, edges). Each carries the aspect files it appeared in."""
    concepts, edges = {}, {}
    for path in sorted(glob.glob(ASPECTS)):
        aspect = os.path.basename(path)[:-5]
        d = json.load(open(path))
        local = {}
        for n in d.get('nodes', []):
            raw = n.get('schemaLabel') or (n.get('props') or {}).get('_schemaLabel')
            if not raw:
                continue
            sl = canon(raw)
            local[n['id']] = sl
            c = concepts.setdefault(sl, {
                'schemaLabel': sl, 'variableLabel': n.get('label', sl),
                'w': n.get('w', 110), 'h': n.get('h', 60),
                'shape': n.get('shape', 'ellipse'), 'sources': set()})
            c['sources'].add(aspect)
            # Prefer a variabilized label over a bare one-word concept name.
            if len(n.get('label', '')) > len(c['variableLabel']):
                c['variableLabel'] = n['label']
        for e in d.get('edges', []):
            s, t = local.get(e.get('src')), local.get(e.get('tgt'))
            if not s or not t:
                continue
            label = (e.get('label') or '').strip()
            key = (s, t, label)
            ed = edges.setdefault(key, {
                'src': s, 'tgt': t, 'label': label,
                'polarity': e.get('polarity', 'none'), 'sources': set()})
            ed['sources'].add(aspect)
            # A signed reading beats an unsigned one; don't let 'none' win.
            if ed['polarity'] == 'none' and e.get('polarity', 'none') != 'none':
                ed['polarity'] = e['polarity']
    return concepts, edges


def ensure_db():
    existing = {r['name'] for r in
                run("SHOW DATABASES YIELD name RETURN name", database='system')}
    if DB not in existing:
        print(f"creating database {DB} …")
        run(f"CREATE DATABASE {DB} WAIT", database='system')


def build():
    fam, efam = read_families(), read_edge_families()
    member_of = {m: f for f, d in fam['families'].items() for m in d['members']}
    concepts, edges = read_aspects()
    ensure_db()

    run("MATCH (n) WHERE n:Concept OR n:Family OR n:LinkFamily OR n:Aspect "
        "DETACH DELETE n", database=DB)
    for stmt in [
        "CREATE CONSTRAINT concept_id IF NOT EXISTS FOR (n:Concept) REQUIRE n.id IS UNIQUE",
        "CREATE CONSTRAINT family_name IF NOT EXISTS FOR (n:Family) REQUIRE n.name IS UNIQUE",
        "CREATE CONSTRAINT linkfamily_name IF NOT EXISTS FOR (n:LinkFamily) REQUIRE n.name IS UNIQUE",
        "CREATE CONSTRAINT aspect_name IF NOT EXISTS FOR (n:Aspect) REQUIRE n.name IS UNIQUE",
    ]:
        run(stmt, database=DB)

    for i, name in enumerate(fam['order']):
        f = fam['families'][name]
        run("""CREATE (n:Family {name:$n, color:$c, fill:$fl, fontColor:$fc, ord:$o})""",
            dict(n=name, c=f['color'], fl=f['fill'],
                 fc=f.get('fontColor', '#000000'), o=i), database=DB)
    for i, name in enumerate(efam['order']):
        f = efam['families'][name]
        run("""CREATE (n:LinkFamily {name:$n, gloss:$g, note:$nt, transitive:$t, ord:$o})""",
            dict(n=name, g=f['gloss'], nt=f['note'], t=f['transitive'], o=i), database=DB)

    aspects = sorted({a for c in concepts.values() for a in c['sources']})
    for a in aspects:
        run("CREATE (n:Aspect {name:$n})", dict(n=a), database=DB)

    for sl, c in concepts.items():
        family = member_of.get(sl)
        if not family:
            sys.exit(f"schemaLabel {sl!r} is in no family in families.js")
        run(f"""CREATE (x:Concept:{slug(sl)} {{
                  id:$id, schemaLabel:$sl, variableLabel:$vl, mode:$m,
                  sources:$src, w:$w, h:$h, shape:$sh}})
                WITH x MATCH (f:Family {{name:$fam}}) CREATE (x)-[:IN_FAMILY]->(f)""",
            dict(id=sl.lower(), sl=sl, vl=c['variableLabel'], m=MODE,
                 src=sorted(c['sources']), w=c['w'], h=c['h'],
                 sh=c['shape'], fam=family), database=DB)

    unmapped = 0
    for i, ((s, t, label), e) in enumerate(edges.items()):
        lf = suggest_family(label, efam)
        if not lf:
            unmapped += 1
        run("""MATCH (a:Concept {id:$s}), (b:Concept {id:$t})
               CREATE (a)-[:REL {id:$id, label:$label, mode:$m, linkFamily:$lf,
                 polarity:$pol, rel:'before', sources:$src}]->(b)""",
            dict(s=s.lower(), t=t.lower(), id=f'a{i:03d}', label=label, m=MODE,
                 lf=lf, pol=e['polarity'], src=sorted(e['sources'])), database=DB)

    print(f"{len(aspects)} aspects · {len(concepts)} concepts · {len(edges)} edges "
          f"· {unmapped} edges with no relation family")
    return aspects


def verify(aspects):
    print("\n--- each drawing, as a filter on the union ---")
    print(f"  {'aspect':<22}{'concepts':>9}{'edges':>7}")
    for a in aspects:
        n = run("MATCH (c:Concept) WHERE $a IN c.sources RETURN count(c) AS c",
                dict(a=a), database=DB)[0]['c']
        m = run("MATCH ()-[r:REL]->() WHERE $a IN r.sources RETURN count(r) AS c",
                dict(a=a), database=DB)[0]['c']
        print(f"  {a:<22}{n:>9}{m:>7}")

    print("\n--- gold: drawn by more than one hand ---")
    for r in run("""MATCH (c:Concept) WHERE size(c.sources) > 1
                    RETURN c.variableLabel AS l, size(c.sources) AS n
                    ORDER BY n DESC, l LIMIT 8""", database=DB):
        print(f"  {r['n']:>2}  {r['l']}")
    g = run("""MATCH (c:Concept) RETURN
               count(CASE WHEN size(c.sources) > 1 THEN 1 END) AS gold,
               count(c) AS total""", database=DB)[0]
    ge = run("""MATCH ()-[r:REL]->() RETURN
                count(CASE WHEN size(r.sources) > 1 THEN 1 END) AS gold,
                count(r) AS total""", database=DB)[0]
    print(f"\n  {g['gold']}/{g['total']} concepts and {ge['gold']}/{ge['total']} "
          f"edges have more than one witness")

    print("\n--- schema/family consistency ---")
    bad = run("""MATCH (c:Concept)-[:IN_FAMILY]->(f:Family)
                 WITH c.schemaLabel AS s, collect(DISTINCT f.name) AS fams
                 WHERE size(fams) > 1 RETURN s, fams""", database=DB)
    print("  " + ("ok — every schemaLabel maps to exactly one family"
                  if not bad else f"MISMATCH {bad}"))


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--verify', action='store_true')
    a = ap.parse_args()
    aspects = build()
    if a.verify:
        verify(aspects)
