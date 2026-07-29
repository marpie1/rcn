# RCN Substrate

One Neo4j graph holding every layer at once. Projections read the layers a lens
needs; the renderers stay dumb. See `tool-inventory.md` for the schema coverage
checklist and the decisions log.

## Files

| File | What it does |
|---|---|
| `db.py` | The one way this project talks to Neo4j. Cypher over HTTP, stdlib only |
| `seed.py` | Builds the n=6 reference graph from scratch. Idempotent |
| `api.py` | The projection layer, port 8768. Serves the tools too, so one origin and no CORS |
| `tool-inventory.md` | Every RCN tool, what it demands of the schema, and coverage status |
| `tool-status-checklist.md` | The live-vs-parked pass — one checkbox per tool, for Marc |
| `edge-families-proposal.md` | The seven relation families, and why they are declared not drawn |

## Prerequisites

**Neo4j Desktop must be running.** Claude Code has full admin over the database
but *cannot start or stop the DBMS.* If commands fail with "cannot reach", open
Neo4j Desktop and start the **RCN SCHEMA** server.

Credentials live in `~/rcn/.env.neo4j` (mode 600, gitignored — the `.env.*`
pattern was added to `.gitignore` because plain `.env` does not match it).

## Commands

```bash
cd ~/rcn/substrate

python3 db.py --check                  # is it up, and what is in it
python3 seed.py --verify               # rebuild n=6 and print the eyeball check
python3 db.py -q "MATCH (n) RETURN count(n)"

python3 api.py                         # projections + the tools, port 8768
```

Then: <http://localhost:8768/> lists the projections and the rendered views.

## Layout is not stored, and must still be emitted

`x`/`y` are a rendering concern — the substrate has no business holding where a
node sits on somebody's canvas. But graph-tool **requires** them: a node with no
`x`/`y` gets a NaN centre, paints nothing, and the file still reports a
successful load. That silent failure caught this build once. The brief's §5
contract omits `x`/`y`; `tools/schemas/graph-tool-v22.md` is the authority and
lists them as required — trust the schema doc.

So every projection emits a deterministic ring. Same graph, same positions, every
time; the renderer's own Dagre/Force buttons take it from there.

## The model (Option C)

```
(:Concept:<SchemaLabel>)  the primary identity — the VOCABULARY levels
    schemaLabel      'Problem'                  the merge key
    variableLabel    'Seriousness of PROBLEM'   what a person reads
    mode             'EIP'                      which grammar this speaks
    sources          ['merchant','organizer']   a LIST — see below
    w, h, shape                                 render hints

(:Family)                 the 8 families from tools/families.js, with palette
(:Concept)-[:IN_FAMILY]->(:Family)

(:Instance)               a thing that HAPPENED — the world-facts layer
    name, place, lat, lng, startDate, endDate, fuzzyStart, sources
(:Instance)-[:INSTANCE_OF]->(:Concept)

(:LinkFamily)             the 7 relation families from tools/edge-families.js
(:Concept)-[:REL]->(:Concept)     every lens layer on one edge
    label        the author's own words — never rewritten
    linkFamily   the SHARED vocabulary, so two neighborhoods' differently
                 worded edges can merge. Declared, never drawn
    polarity, magnitude, rel, mode, sources
```

### Why the four levels are split this way

The Composer treats family / schema / variable / instance as a strict
contraction — "zooming out merges; zooming in never invents"
(`graph-composer.html:1100`). The first three are **vocabulary**: progressively
longer names for the same idea, which is why prefix-grouping works on them.

An instance is not a longer name. It is a thing that happened, with a date, a
place, and someone who reported it. So it gets its own node. That is also where
geometry and time intervals attach — *"Seriousness of PROBLEM"* has no location;
*"the backyard chicken ordinance dispute, Superior AZ, March 2026"* does.

### Why `sources` is a list

Two people drawing the same concept is recorded as **evidence**, not resolved as
a conflict. `size(c.sources) > 1` is the gold test. A scalar author field would
force one contributor to overwrite the other; separate nodes would hide the
agreement, which is the one thing worth seeing.

### Why family is derived, not stored

`tools/families.js` says it is the ONE source with no JSON twin to drift from.
Storing `family:'Issue'` on each node would create exactly that twin, so
`seed.py` parses `families.js` and builds `:Family` nodes and `:IN_FAMILY`
edges from it. Change families there; re-run the seed.

## Verify by eye in Neo4j Browser

Open Neo4j Desktop → **RCN SCHEMA** → Open with **Neo4j Browser**, then:

```cypher
MATCH (c:Concept)-[r:REL]->(m:Concept) RETURN c, r, m
```

You should see Person, Org and Motivation feeding Action; Action yielding
Result; and `address` and `resolve` (both negative) closing a loop back to
Problem. That loop is the Fixes-that-Fail structure — it is meant to be there.

Then the four levels and the instance layer:

```cypher
MATCH (i:Instance)-[:INSTANCE_OF]->(c:Concept)-[:IN_FAMILY]->(f:Family)
RETURN i, c, f
```

## Known wrinkle

The loop query `MATCH path=(n)-[:REL*]->(n)` returns each cycle once per
starting node — 7 rows for 2 distinct cycles at n=6. The eventual `loops`
projection has to canonicalise before reporting, or the loop count will be
wrong in a way that looks plausible.
