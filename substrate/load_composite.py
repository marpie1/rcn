#!/usr/bin/env python3
"""
load_composite.py — Stage 2. The 26-node signed EIP CLD, behind the SAME
endpoints as the n=6 reference.

    python3 substrate/load_composite.py --verify

THE CLAIM BEING TESTED: only the data grows. No projection query changes, no
renderer changes. If this needs either, the architecture was not proven at n=6
and we should know that now rather than at n=260.

It loads into its OWN database (`composite26`), so the six-node reference stays
intact as the permanent conformance test. Enterprise edition makes that free.
Reach it with ?db=composite26 on any projection.

PROVENANCE IS COMPUTED, NOT ASSERTED. `tools/eip-schema-cld.json` carries no
per-node source list. But 16 independent aspect drawings live in
`tools/eip-aspects-variabilized/`, and a concept drawn in several of them is
exactly what a gold node means. So sources are derived by matching on
schemaLabel — the merge key, doing the job it exists for. The aspect files use
generic node ids (n0, n1…), so id matching finds nothing; only the schema label
crosses the boundary.

CAVEAT worth knowing: because the aspect files key on schemaLabel, the two
Affect variables (Positive AFFECT, Negative AFFECT) necessarily receive the
same source set. Provenance here is resolved at schema level, not variable
level. Real per-variable provenance needs the aspect drawings to carry
variabilized labels, which is a data question, not a schema one.
"""
import json, os, sys, glob, argparse
from collections import defaultdict
from db import run, BASE
from seed import read_families, read_edge_families

CLD = os.path.join(BASE, 'tools', 'eip-schema-cld.json')
ASPECTS = os.path.join(BASE, 'tools', 'eip-aspects-variabilized', '*.json')
DB = 'composite26'
MODE = 'EIP'


def aspect_sources():
    """schemaLabel -> the aspect drawings that contain it."""
    srcs = defaultdict(set)
    for path in sorted(glob.glob(ASPECTS)):
        name = os.path.basename(path)[:-5]
        for n in json.load(open(path)).get('nodes', []):
            sl = n.get('schemaLabel') or (n.get('props') or {}).get('_schemaLabel')
            if sl:
                srcs[sl].add(name)
    return {k: sorted(v) for k, v in srcs.items()}


def suggest_family(label, efam):
    """Propose a relation family from the author's wording. Never applied
    silently — unmatched edges are left null and counted, exactly as
    eip-cld-subgraph-mismatches.md leaves its 23 items for a human."""
    if not label:
        return None
    t = label.lower().strip()
    for name in efam['order']:
        if t in [v.lower() for v in efam['families'][name].get('verbs', [])]:
            return name
    for name in efam['order']:
        for v in efam['families'][name].get('verbs', []):
            if len(v) > 3 and v.lower() in t:
                return name
    return None


def ensure_db():
    existing = {r['name'] for r in
                run("SHOW DATABASES YIELD name RETURN name", database='system')}
    if DB not in existing:
        print(f"creating database {DB} …")
        run(f"CREATE DATABASE {DB} WAIT", database='system')
    else:
        print(f"database {DB} exists")


def build():
    cld = json.load(open(CLD))
    fam = read_families()
    efam = read_edge_families()
    member_of = {m: fname for fname, f in fam['families'].items() for m in f['members']}
    srcs = aspect_sources()

    ensure_db()

    print("wiping …")
    run("MATCH (n) WHERE n:Concept OR n:Instance OR n:Family OR n:LinkFamily "
        "DETACH DELETE n", database=DB)
    for stmt in [
        "CREATE CONSTRAINT concept_id IF NOT EXISTS FOR (n:Concept) REQUIRE n.id IS UNIQUE",
        "CREATE CONSTRAINT instance_id IF NOT EXISTS FOR (n:Instance) REQUIRE n.id IS UNIQUE",
        "CREATE CONSTRAINT family_name IF NOT EXISTS FOR (n:Family) REQUIRE n.name IS UNIQUE",
        "CREATE CONSTRAINT linkfamily_name IF NOT EXISTS FOR (n:LinkFamily) REQUIRE n.name IS UNIQUE",
    ]:
        run(stmt, database=DB)

    for i, name in enumerate(fam['order']):
        f = fam['families'][name]
        run("""CREATE (n:Family {name:$name, color:$color, fill:$fill,
                                 fontColor:$fontColor, ord:$ord})""",
            dict(name=name, color=f['color'], fill=f['fill'],
                 fontColor=f.get('fontColor', '#000000'), ord=i), database=DB)
    for i, name in enumerate(efam['order']):
        f = efam['families'][name]
        run("""CREATE (n:LinkFamily {name:$name, gloss:$gloss, note:$note,
                                     transitive:$transitive, ord:$ord})""",
            dict(name=name, gloss=f['gloss'], note=f['note'],
                 transitive=f['transitive'], ord=i), database=DB)
    print(f"families ({len(fam['order'])})  link families ({len(efam['order'])})")

    # Concepts. source_note is an annotation on the drawing, not a concept.
    skipped, loaded = [], 0
    for n in cld['nodes']:
        sl = n.get('schemaLabel')
        if not sl or sl == 'SOURCE':
            skipped.append(n.get('id'))
            continue
        family = member_of.get(sl)
        if not family:
            sys.exit(f"schemaLabel {sl!r} is in no family in families.js")
        run(f"""
            CREATE (c:Concept:{sl} {{
              id:$id, schemaLabel:$sl, variableLabel:$label, mode:$mode,
              sources:$sources, gloss:$gloss,
              w:$w, h:$h, shape:$shape}})
            WITH c MATCH (f:Family {{name:$family}}) CREATE (c)-[:IN_FAMILY]->(f)
        """, dict(id=n['id'], sl=sl, label=n.get('label', sl), mode=MODE,
                  sources=srcs.get(sl, []),
                  gloss=(n.get('props') or {}).get('_gloss', ''),
                  w=n.get('w', 144), h=n.get('h', 90),
                  shape=n.get('shape', 'rect'), family=family), database=DB)
        loaded += 1
    print(f"concepts ({loaded}), skipped {skipped}")

    ids = {n['id'] for n in cld['nodes']}
    unmapped, dropped, e_loaded = [], [], 0
    for e in cld['edges']:
        if e.get('src') not in ids or e.get('tgt') not in ids:
            dropped.append(e.get('id'))
            continue
        lf = suggest_family(e.get('label', ''), efam)
        if not lf:
            unmapped.append((e.get('id'), e.get('label')))
        src_prop = (e.get('props') or {}).get('source', '')
        e_sources = sorted({s.strip() for s in src_prop.split(',') if s.strip()})
        res = run("""MATCH (s:Concept {id:$src}), (t:Concept {id:$tgt})
               CREATE (s)-[:REL {id:$id, label:$label, mode:$mode,
                 linkFamily:$lf, polarity:$pol, rel:'before', sources:$sources}]->(t)
               RETURN 1 AS ok""",
            dict(src=e['src'], tgt=e['tgt'], id=e['id'], label=e.get('label', ''),
                 mode=MODE, lf=lf, pol=e.get('polarity', 'none'),
                 sources=e_sources), database=DB)
        if res:
            e_loaded += 1
        else:
            dropped.append(e.get('id'))
    print(f"edges ({e_loaded}), dropped {len(dropped)} touching skipped nodes")
    return unmapped, e_loaded


def verify(unmapped):
    print("\n--- gold: concepts drawn in more than one aspect ---")
    for r in run("""MATCH (c:Concept) WHERE size(c.sources) > 1
                    RETURN c.variableLabel AS label, size(c.sources) AS n
                    ORDER BY n DESC, label""", database=DB):
        print(f"  {r['n']:>2} aspects  {r['label']}")

    orph = run("""MATCH (c:Concept) WHERE size(c.sources) = 0
                  RETURN collect(c.variableLabel) AS names""", database=DB)[0]['names']
    print(f"\n  orphans — in the CLD, in no aspect drawing: {orph or 'none'}")

    print("\n--- schema/family consistency ---")
    bad = run("""MATCH (c:Concept)-[:IN_FAMILY]->(f:Family)
                 WITH c.schemaLabel AS s, collect(DISTINCT f.name) AS fams
                 WHERE size(fams) > 1 RETURN s, fams""", database=DB)
    print("  " + ("ok — every schemaLabel maps to exactly one family"
                  if not bad else f"MISMATCH {bad}"))

    print("\n--- relation families assigned from the authors' own words ---")
    for r in run("""MATCH ()-[r:REL]->() RETURN r.linkFamily AS fam, count(*) AS n
                    ORDER BY n DESC""", database=DB):
        print(f"  {str(r['fam'] or '(none — needs a human)'):<24}{r['n']}")
    if unmapped:
        print(f"\n  {len(unmapped)} edges need a family decision. Nothing was guessed:")
        for eid, lbl in unmapped[:12]:
            print(f"    {eid:<6} {lbl!r}")
        if len(unmapped) > 12:
            print(f"    … and {len(unmapped)-12} more")

    print("\n--- feedback loops (canonicalised) ---")
    seen = set()
    for r in run("""MATCH path=(n:Concept)-[:REL*2..4]->(n)
                    RETURN [x IN nodes(path) | x.schemaLabel] AS cyc
                    LIMIT 400""", database=DB):
        cyc = r['cyc'][:-1]
        key = frozenset(cyc)
        if len(key) == len(cyc) and key not in seen:
            seen.add(key)
            print("  " + " -> ".join(cyc))
    print(f"  {len(seen)} distinct loops of length 2-4")

    tot = run("MATCH (c:Concept) RETURN count(c) AS c", database=DB)[0]['c']
    rel = run("MATCH ()-[r:REL]->() RETURN count(r) AS c", database=DB)[0]['c']
    print(f"\n{tot} concepts, {rel} edges in `{DB}`")


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--verify', action='store_true')
    a = ap.parse_args()
    unmapped, _ = build()
    if a.verify:
        verify(unmapped)
