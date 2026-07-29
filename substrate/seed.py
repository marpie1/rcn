#!/usr/bin/env python3
"""
seed.py — build the n=6 reference graph from scratch.

Idempotent: wipes Concept/Instance/Family and rebuilds. Safe to re-run.

    python3 substrate/seed.py            # build
    python3 substrate/seed.py --verify   # rebuild, then print the eyeball check

MODEL (Option C — see substrate/tool-inventory.md §4)

  (:Concept:<SchemaLabel>)   the primary identity. Carries the VOCABULARY levels:
                             schemaLabel ('Problem') and variableLabel
                             ('Seriousness of PROBLEM'). Family is derived, not
                             stored as a string — it is an edge to a :Family node
                             generated from tools/families.js, the one source.
  (:Family)                  the 8 families, with the validated palette.
  (:Instance)                a thing that HAPPENED. Carries the world-facts a
                             vocabulary level cannot hold: dates, places, who
                             reported it. This is where geometry and time
                             intervals attach.
  [:REL]                     concept-to-concept. Carries every lens layer at
                             once: polarity, magnitude, temporal rel, sources.

Every node and edge carries `mode` so a lens can filter its own grammar and
non-EIP graphs (SFD, OPM, NRM) can later share the substrate without collision.
"""
import json, os, re, sys, argparse
from db import run, BASE

FAMILIES_JS = os.path.join(BASE, 'tools', 'families.js')
EDGE_FAMILIES_JS = os.path.join(BASE, 'tools', 'edge-families.js')
MODE = 'EIP'


def read_families():
    """Parse tools/families.js — the ONE source for the family vocabulary.

    The file is a .js (not .json) so it loads over file://. Everything after
    the assignment is plain JSON, per its own header comment.
    """
    with open(FAMILIES_JS) as fh:
        text = fh.read()
    start = text.index('window.FAMILIES_DATA')
    text = text[text.index('=', start) + 1:]
    data = json.loads(text.strip().rstrip(';'))
    return data


def read_edge_families():
    """Parse tools/edge-families.js — the ONE source for relation families.

    Same one-directional rule as families.js: the .js is the source and the
    database holds a GENERATED copy. Editing :LinkFamily in the Neo4j Browser
    is never correct. Vocabulary changes rarely and deliberately, so it belongs
    under version control where it gets history, diff, review and rollback —
    none of which Neo4j gives a node edited in place.
    """
    with open(EDGE_FAMILIES_JS) as fh:
        text = fh.read()
    start = text.index('window.EDGE_FAMILIES_DATA')
    text = text[text.index('=', start) + 1:]
    return json.loads(text.strip().rstrip(';'))


# The six. variableLabel is what a person reads; schemaLabel is the merge key.
# sources is a LIST so that two contributors drawing the same concept is
# recorded as evidence rather than resolved as a conflict — size(sources) > 1
# is the gold test.
CONCEPTS = [
    dict(id='problem',    schemaLabel='Problem',    variableLabel='Seriousness of PROBLEM',   sources=['merchant', 'organizer']),
    dict(id='motivation', schemaLabel='Motivation', variableLabel='MOTIVATION',               sources=['organizer']),
    dict(id='action',     schemaLabel='Action',     variableLabel='Effectiveness of ACTION',  sources=['merchant', 'organizer']),
    dict(id='result',     schemaLabel='Result',     variableLabel='Q of RESULT',              sources=['organizer']),
    dict(id='person',     schemaLabel='Person',     variableLabel='PERSON Participation',     sources=['merchant']),
    dict(id='org',        schemaLabel='Org',        variableLabel='Effectiveness of ORG',     sources=['merchant', 'organizer']),
]

# magnitude 0-3 is the Vester layer and is PLACEHOLDER — real values come from
# Marc + Kerry via SensiMod's 3-groups-of-3 impact matrix.
# linkFamily is the SHARED vocabulary that lets two neighborhoods' differently
# worded edges merge; label keeps the author's own words. Note the spread here
# is deliberate — the reference graph should exercise more than one family, or
# it proves nothing about the vocabulary.
EDGES = [
    dict(id='e_pm', src='problem',    tgt='motivation', label='create',     linkFamily='Influence',      polarity='none', magnitude=2, rel='before', sources=['organizer']),
    dict(id='e_ma', src='motivation', tgt='action',     label='consider',   linkFamily='Influence',      polarity='+',    magnitude=2, rel='before', sources=['organizer']),
    dict(id='e_pa', src='person',     tgt='action',     label='take',       linkFamily='Agency',         polarity='+',    magnitude=3, rel='before', sources=['merchant']),
    dict(id='e_oa', src='org',        tgt='action',     label='facilitate', linkFamily='Provision',      polarity='+',    magnitude=2, rel='before', sources=['merchant', 'organizer']),
    dict(id='e_ar', src='action',     tgt='result',     label='yield',      linkFamily='Transformation', polarity='+',    magnitude=3, rel='before', sources=['organizer']),
    dict(id='e_ap', src='action',     tgt='problem',    label='address',    linkFamily='Influence',      polarity='-',    magnitude=3, rel='before', sources=['merchant']),
    dict(id='e_rp', src='result',     tgt='problem',    label='resolve',    linkFamily='Influence',      polarity='-',    magnitude=2, rel='meets',  sources=['organizer']),
]

# Two instances, so the fourth level is REAL at n=6 rather than theoretical.
# Note what lives here and cannot live on a Concept: a place and a date.
# "Seriousness of PROBLEM" has no location. A chicken ordinance dispute does.
INSTANCES = [
    dict(id='i_chickens', concept='problem',
         name='Backyard chicken ordinance dispute',
         place='Superior, AZ', lat=33.2942, lng=-111.0982,
         startDate='Mar 2026', endDate=None, fuzzyStart=True,
         reportedBy='organizer'),
    dict(id='i_petition', concept='action',
         name='Residents petition the town council',
         place='Superior, AZ', lat=33.2937, lng=-111.0975,
         startDate='May 2026', endDate='Jun 2026', fuzzyStart=False,
         reportedBy='merchant'),
]


def build():
    fam = read_families()
    order = fam['order']
    families = fam['families']

    # schemaLabel -> family name, derived from families.js membership lists.
    member_of = {}
    for fname, f in families.items():
        for m in f['members']:
            member_of[m] = fname

    efam = read_edge_families()

    print("wiping Concept / Instance / Family / LinkFamily …")
    run("MATCH (n) WHERE n:Concept OR n:Instance OR n:Family OR n:LinkFamily "
        "DETACH DELETE n")

    # Constraints. The brief omitted these; without them nothing stops a
    # duplicate id when Stage 2 loads the 26-node composite, which would
    # silently double every edge.
    print("constraints …")
    for stmt in [
        "CREATE CONSTRAINT concept_id IF NOT EXISTS FOR (n:Concept) REQUIRE n.id IS UNIQUE",
        "CREATE CONSTRAINT instance_id IF NOT EXISTS FOR (n:Instance) REQUIRE n.id IS UNIQUE",
        "CREATE CONSTRAINT family_name IF NOT EXISTS FOR (n:Family) REQUIRE n.name IS UNIQUE",
        "CREATE CONSTRAINT linkfamily_name IF NOT EXISTS FOR (n:LinkFamily) REQUIRE n.name IS UNIQUE",
    ]:
        run(stmt)

    # Relation families — a GENERATED copy of tools/edge-families.js.
    # fallbackStyle is deliberately NOT loaded: it exists only for a possible
    # future opt-in that renders unstyled edges, and an author's own styling
    # must always win. Nothing in the substrate should be able to restyle a
    # drawing because of the family it declared.
    print(f"link families ({len(efam['order'])}) …")
    for i, name in enumerate(efam['order']):
        f = efam['families'][name]
        run("""CREATE (n:LinkFamily {name:$name, gloss:$gloss, note:$note,
                                     transitive:$transitive, ord:$ord})""",
            dict(name=name, gloss=f['gloss'], note=f['note'],
                 transitive=f['transitive'], ord=i))

    print(f"families ({len(order)}) …")
    for i, name in enumerate(order):
        f = families[name]
        run("""CREATE (n:Family {name:$name, color:$color, fill:$fill,
                                 fontColor:$fontColor, ord:$ord})""",
            dict(name=name, color=f['color'], fill=f['fill'],
                 fontColor=f.get('fontColor', '#000000'), ord=i))

    print(f"concepts ({len(CONCEPTS)}) …")
    for c in CONCEPTS:
        family = member_of.get(c['schemaLabel'])
        if not family:
            sys.exit(f"schemaLabel {c['schemaLabel']!r} is in no family in families.js")
        # Second label = schemaLabel, so the Neo4j Browser is readable while
        # every projection can still MATCH the uniform :Concept.
        run(f"""
            CREATE (n:Concept:{c['schemaLabel']} {{
              id:$id, schemaLabel:$schemaLabel, variableLabel:$variableLabel,
              mode:$mode, sources:$sources, w:112, h:54, shape:'ellipse'}})
            WITH n MATCH (f:Family {{name:$family}}) CREATE (n)-[:IN_FAMILY]->(f)
        """, dict(mode=MODE, family=family, **c))

    print(f"edges ({len(EDGES)}) …")
    known = set(efam['order'])
    for e in EDGES:
        if e['linkFamily'] not in known:
            sys.exit(f"edge {e['id']}: linkFamily {e['linkFamily']!r} "
                     f"is not in edge-families.js")
        run("""MATCH (s:Concept {id:$src}), (t:Concept {id:$tgt})
               CREATE (s)-[r:REL {id:$id, label:$label, mode:$mode,
                 linkFamily:$linkFamily,
                 polarity:$polarity, magnitude:$magnitude, rel:$rel,
                 sources:$sources}]->(t)""", dict(mode=MODE, **e))

    print(f"instances ({len(INSTANCES)}) …")
    for i in INSTANCES:
        run("""MATCH (c:Concept {id:$concept})
               CREATE (n:Instance {id:$id, name:$name, mode:$mode,
                 place:$place, lat:$lat, lng:$lng,
                 startDate:$startDate, endDate:$endDate, fuzzyStart:$fuzzyStart,
                 sources:[$reportedBy]})
               CREATE (n)-[:INSTANCE_OF]->(c)""", dict(mode=MODE, **i))

    print("done.")


def verify():
    print("\n--- the six, with derived family and gold flag ---")
    rows = run("""
        MATCH (c:Concept)-[:IN_FAMILY]->(f:Family)
        OPTIONAL MATCH (c)<-[:INSTANCE_OF]-(i:Instance)
        RETURN c.variableLabel AS label, c.schemaLabel AS schema,
               f.name AS family, f.ord AS ord, size(c.sources) > 1 AS gold,
               count(i) AS instances
        ORDER BY ord, schema""")
    print(f"{'variableLabel':<32}{'schema':<12}{'family':<13}{'gold':<7}inst")
    for r in rows:
        print(f"{r['label']:<32}{r['schema']:<12}{r['family']:<13}"
              f"{'GOLD' if r['gold'] else '-':<7}{r['instances']}")

    print("\n--- edges: the author's words, and the shared family ---")
    for r in run("""MATCH (s:Concept)-[r:REL]->(t:Concept)
                    RETURN s.schemaLabel AS s, r.label AS l, r.polarity AS p,
                           r.magnitude AS m, r.linkFamily AS fam,
                           t.schemaLabel AS t ORDER BY r.id"""):
        print(f"  {r['s']:<11} --{r['l']:<11}({r['p']}, mag {r['m']})--> "
              f"{r['t']:<11} [{r['fam']}]")

    print("\n--- relation families in use ---")
    for r in run("""MATCH ()-[r:REL]->()
                    WITH r.linkFamily AS fam, count(*) AS n
                    MATCH (lf:LinkFamily {name:fam})
                    RETURN fam, n, lf.gloss AS gloss, lf.transitive AS transitive
                    ORDER BY n DESC, fam"""):
        t = ' (transitive)' if r['transitive'] else ''
        print(f"  {r['fam']:<15} {r['n']}  — {r['gloss']}{t}")
    unused = run("""MATCH (lf:LinkFamily) WHERE NOT EXISTS {
                        MATCH ()-[r:REL]->() WHERE r.linkFamily = lf.name }
                    RETURN collect(lf.name) AS names""")[0]['names']
    if unused:
        print(f"  (not exercised at n=6: {', '.join(unused)})")

    print("\n--- the loop the CLD is supposed to have ---")
    for r in run("""MATCH path=(n:Concept)-[:REL*1..4]->(n)
                    RETURN [x IN nodes(path) | x.schemaLabel] AS cycle"""):
        print("  " + " -> ".join(r['cycle']))

    # Family belongs to the SCHEMA LABEL, not to the concept — families.js says
    # Affect is in Person, full stop. But the family edge hangs on :Concept, so
    # the fact is stored once per concept and nothing makes the copies agree.
    # Harmless while seed.py derives family from families.js on every load; the
    # moment write-back lets a person set a family directly, two variables of
    # one schema could disagree. The 26-node composite already has such a pair:
    # Affect carries both Positive AFFECT and Negative AFFECT.
    # Cannot be a Neo4j constraint — "same X implies same Y" is not expressible.
    print("\n--- schema/family consistency ---")
    bad = run("""
        MATCH (c:Concept)-[:IN_FAMILY]->(f:Family)
        WITH c.schemaLabel AS schema, collect(DISTINCT f.name) AS fams
        WHERE size(fams) > 1
        RETURN schema, fams""")
    if bad:
        for r in bad:
            print(f"  MISMATCH  {r['schema']} is in {r['fams']}")
    else:
        print("  ok — every schemaLabel maps to exactly one family")

    print("\n--- instances: what a Concept cannot carry ---")
    for r in run("""MATCH (i:Instance)-[:INSTANCE_OF]->(c:Concept)
                    RETURN i.name AS name, c.variableLabel AS of,
                           i.place AS place, i.startDate AS start"""):
        print(f"  {r['name']}\n      is an instance of: {r['of']}"
              f"\n      place: {r['place']}   start: {r['start']}")


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--verify', action='store_true')
    a = ap.parse_args()
    build()
    if a.verify:
        verify()
