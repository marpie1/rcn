# RCN Substrate

One Neo4j graph holding every layer at once. Projections read the layers a lens needs; the renderers stay dumb. See `tool-inventory.md` for the schema coverage checklist and the decisions log.

## Files

| File | What it does |
|---|---|
| `db.py` | The one way this project talks to Neo4j. Cypher over HTTP, stdlib only |
| `seed.py` | Builds the n=6 reference graph from scratch. Idempotent |
| `api.py` | The projection layer, port 8768. Serves the tools too, so one origin and no CORS |
| `load_composite.py` | Stage 2 — the 26-node signed EIP CLD into its own database |
| `load_vna.py` | Loads the value-network and action-situation drawings into database `vna`, in substrate vocabulary. Reports every merge |
| `project_iad.py` | **The IAD lens — a read-only projection over `vna`, not a copy.** See `iad-crosswalk.md` |
| `iad-crosswalk.md` | **The RCN-to-IAD crosswalk** — what we can claim in Ostrom's terms and what we cannot |
| `load_aspects.py` | The 16 aspect drawings with EXACT provenance, into `aspects16` |
| `aspect_file.py` | Writes a drawing back to its source file, so nothing silently reverts |
| `ROUND-TRIP.md` | **How the round trip works, how to use it, and what can go wrong** |
| `tool-inventory.md` | Every RCN tool, what it demands of the schema, and coverage status |
| `tool-status-checklist.md` | The live-vs-parked pass — one checkbox per tool, for Marc |
| `edge-families-proposal.md` | The seven relation families, and why they are declared not drawn |

## Prerequisites

**Neo4j Desktop must be running.** Claude Code has full admin over the database but *cannot start or stop the DBMS.* If commands fail with "cannot reach", open Neo4j Desktop and start the **RCN SCHEMA** server.

Credentials live in `~/rcn/.env.neo4j` (mode 600, gitignored — the `.env.*` pattern was added to `.gitignore` because plain `.env` does not match it).

## Commands

```bash
cd ~/rcn/substrate

python3 db.py --check                  # is it up, and what is in it
python3 seed.py --verify               # rebuild n=6 and print the eyeball check
python3 db.py -q "MATCH (n) RETURN count(n)"

python3 api.py                         # projections + the tools, port 8768

python3 export.py whatcom              # static folder for a site's assets (Layer 1)
python3 export.py whatcomcoops --prefix whatcom-coops-export
                                       # same, as whatcom-coops-export-*.json for a flat folder
```

Then: <http://localhost:8768/> lists the projections and the rendered views.

## Two graphs, one set of queries

| database | what | how to read it |
|---|---|---|
| `neo4j` | the n=6 reference — the permanent conformance test. 6 concepts, 6 states, 7 edges (5 causal, 2 structural). The only graph whose sources are **people** | `/projection/causal` |
| `composite26` | the signed EIP CLD — 25 concepts, 25 states, 57 edges (12 causal, 45 structural). Note it holds `Affect` as **two concepts** where `aspects16` holds one concept with two states | `/projection/causal?db=composite26` |
| `aspects16` | the 16 aspect drawings, exact provenance — 24 concepts, 25 states, 70 edges (20 causal, 50 structural) | `/projection/subgraph/org` |
| `vna` | the value-network and action-situation drawings — 6 drawings, 37 positions, 9 participants, 7 resources, 1 outcome, 75 deliverables. The IAD view is a projection over this, holding no data of its own | `python3 load_vna.py --verify` then `python3 project_iad.py` |

`?db=` selects **which graph, never which query.** Both are read by byte-identical Cypher. That is the Stage 2 claim — only the data grows — and if it ever stops being true, the architecture was not proven at n=6.

    python3 load_composite.py --verify

## Layout is not stored, and must still be emitted

`x`/`y` are a rendering concern — the substrate has no business holding where a node sits on somebody's canvas. But graph-tool **requires** them: a node with no `x`/`y` gets a NaN centre, paints nothing, and the file still reports a successful load. That silent failure caught this build once. The brief's §5 contract omits `x`/`y`; `tools/schemas/graph-tool-v22.md` is the authority and lists them as required — trust the schema doc.

So the ring is the **fallback**, not the answer. Where a drawing exists, `/projection/subgraph/<name>` overlays that file's own coordinates, so a drawing opens in the arrangement its author made. The ring is what a concept gets when no file has ever placed it — and `/projection/causal`, which spans all drawings and therefore has no single arrangement to honour.

Layout travels **file → tool → file** and never passes through Neo4j. See `ROUND-TRIP.md`.

## The model (Option C)

```
(:Concept:<SchemaLabel>)  the primary identity — the merge key
    schemaLabel      'Problem'                  what two drawings agree on
    variableLabel    'Seriousness of PROBLEM'   A state, kept for the
                                                structure lens. NOT the
                                                authority — see :Variable
    opmType          'Object' | 'Process' | null   declared in families.js
    mode             'EIP'                      which grammar this speaks
    sources          ['merchant','organizer']   a LIST — see below
    w, h, shape                                 render hints

(:Variable)               a STATE of a concept — one of the ways it is measured
    label            'Seriousness of PROBLEM'   what a person reads
    schemaLabel, mode, sources
(:Concept)-[:HAS_STATE]->(:Variable)

(:Family)                 the 8 families from tools/families.js, with palette
(:Concept)-[:IN_FAMILY]->(:Family)

(:Aspect)                 the source registry — one per contributor or topic
    name, kind       'person' | 'topic'         DECLARED, never inferred

(:Instance)               a thing that HAPPENED — the world-facts layer
    name, place, lat, lng, startDate, endDate, fuzzyStart, sources
(:Instance)-[:INSTANCE_OF]->(:Concept)

(:LinkFamily)             the 7 relation families from tools/edge-families.js

[:REL]                    every lens layer on one edge, but attached by the
                          KIND OF CLAIM IT MAKES:

  (:Variable)-[:REL]->(:Variable)   CAUSAL — Influence, Transformation
  (:Concept)-[:REL]->(:Concept)     STRUCTURAL — everything else, plus the
                                    edges with no relation family yet
    label        the author's own words — never rewritten
    linkFamily   the SHARED vocabulary, so two neighborhoods' differently
                 worded edges can merge. Declared, never drawn
    srcState/tgtState   on structural edges only: the states the author
                        actually drew between, so a drawing reopens as drawn
    polarity, magnitude, rel, mode, sources
```

### Why causal edges attach to states and structural ones do not

"Coherence of PURPOSE raises Effectiveness of ORG" is a claim about two **measured quantities**. "An Org exists for a Purpose" is true however effective that org is — a claim about the **concepts**. Both are true, both are in here, and they attach at different levels.

The cost of not splitting them was real. `affect.json` draws two states of one concept, and they push motivation in opposite directions:

```
Positive AFFECT --modify (+)--> MOTIVATION
Negative AFFECT --modify (-)--> MOTIVATION
```

While both hung off `:Concept {schemaLabel:'Affect'}` they collapsed to one edge keyed `('Affect','Motivation','modify')`, and the negative claim lost the collision. It was in the file and in no database.

The 17 edges with no relation family stay on concepts and stay counted. A missing family is somebody's decision still to make, not a licence to guess.

### Why the four levels are split this way

The Composer treats family / schema / variable / instance as a strict contraction — "zooming out merges; zooming in never invents" (`graph-composer.html:1100`). The first three are **vocabulary**: progressively longer names for the same idea, which is why prefix-grouping works on them.

Variable is a **node**, not a property, because a concept can be measured several ways at once. In OPM terms these are the states of an object, and an object is expected to have several. Storing it as a single string meant only one could exist, and which one survived was decided by `len(label)` — longest string wins, ties to whichever was read first.

An instance is not a longer name. It is a thing that happened, with a date, a place, and someone who reported it. So it gets its own node. That is also where geometry and time intervals attach — *"Seriousness of PROBLEM"* has no location; *"the backyard chicken ordinance dispute, Superior AZ, March 2026"* does.

### Why `sources` is a list

Two people drawing the same concept is recorded as **evidence**, not resolved as a conflict. `size(c.sources) > 1` is the gold test. A scalar author field would force one contributor to overwrite the other; separate nodes would hide the agreement, which is the one thing worth seeing.

**But what a source IS differs per graph, and no lens may infer it.** Nothing in a list of strings distinguishes `merchant` from `action`. So each loader declares it on the `:Aspect` registry: `neo4j` sources are `kind:'person'` and the gold test there means agreement; `aspects16` and `composite26` sources are `kind:'topic'` — sixteen topic decompositions of one schema — where a high count means the concept is **cross-cutting**, not agreed. Reading the second as the first is how a claim that sixteen people drew these drawings got into three documents.

### Why family is derived, not stored

`tools/families.js` says it is the ONE source with no JSON twin to drift from. Storing `family:'Issue'` on each node would create exactly that twin, so `seed.py` parses `families.js` and builds `:Family` nodes and `:IN_FAMILY` edges from it. Change families there; re-run the seed.

## Verify by eye in Neo4j Browser

Open Neo4j Desktop → **RCN SCHEMA** → Open with **Neo4j Browser**, then:

```cypher
MATCH (v:Variable)-[r:REL]->(w:Variable) RETURN v, r, w
```

You should see Person, Org and Motivation feeding Action; Action yielding Result; and `address` and `resolve` (both negative) closing a loop back to Problem. That loop is the Fixes-that-Fail structure — it is meant to be there.

Then the four levels and the instance layer:

```cypher
MATCH (i:Instance)-[:INSTANCE_OF]->(c:Concept)-[:IN_FAMILY]->(f:Family)
RETURN i, c, f
```

## Known wrinkle

The loop query `MATCH path=(n)-[:REL*]->(n)` returns each cycle once per starting node — 7 rows for 2 distinct cycles at n=6. The eventual `loops` projection has to canonicalise before reporting, or the loop count will be wrong in a way that looks plausible.

## A subgraph is a filter, not a thing

`aspects16` holds the 16 drawings and their union in one graph. A subgraph is not stored:

```cypher
MATCH (c:Concept) WHERE 'org' IN c.sources
```

**is** the `org` drawing. The drawings and the composite are the same rows read two ways — which is the whole payoff of keeping `sources` as a list rather than a scalar, and it means nothing is duplicated to make both readings work.

| endpoint | what |
|---|---|
| `GET /projection/schema` | **the substrate describing itself** — node kinds, their properties, and the relationships between them, with live counts. Derived from the database, so it cannot go stale |
| `GET /projection/causal` | the CLD reading. Its nodes are **states**, because a causal claim is about measured quantities |
| `GET /projection/vocabulary` | family → concept → states, as a tree. Feeds the Sunburst. Arc weight is the source count |
| `GET /projection/drivers?root=X&dir=causes\|effects&depth=N` | causality unrolled into a tree from one state. A concept may appear in several places — that is what a driver tree is. Carries `net`, the sign accumulated along the path, and marks a node already on its own path as `loop` rather than following it |
| `GET /projection/structure` | the ERD reading: part-of, is-a, acts-in, depends-on. No signs |
| `GET /projection/subgraphs` | the 16, with concept and edge counts |
| `GET /projection/subgraph/<name>` | one drawing, in graph-tool's native schema — **exactly what a save would write**, because it and the file writer are one code path |
| `PUT /subgraph/<name>` | replace that drawing — **and only that drawing** |

## The round trip

    graph-tool-v22.html?url=/projection/subgraph/org   →  edit  →  "→ Substrate"

Loading by that URL records which drawing this is, so saving replaces the right one without being asked. Composer reads the same 16 through the **EIP aspects — from the substrate** set.

### Files stay canonical — both stores move together

**The drawing lens returns the drawing.** `subgraph()` delegates to `build_file()`, so what you open and what a save would write cannot drift apart. They used to be two reconstructions and they disagreed: `org` places `Effectiveness of ORG` twice so its edges do not cross, and merging those placements INVENTED a self-loop — `n0 --relate_with--> n1` runs between two different nodes that share a label. The substrate owns what a node means; the file owns how many times it appears and where.

`→ Substrate` does two things, always:

    PUT  /subgraph/role        the database
    POST /subgraph/role/file   tools/eip-aspects-variabilized/role.json

Saving to the database alone would leave the file saying something else, and the next `load_aspects.py` would silently revert the edit. Two answers to one question is the failure this substrate exists to end, not to introduce. The file stays canonical so git keeps the history of a governance-grade artifact; the database is always rebuildable from disk.

`GET /subgraph/<name>/file` previews the JSON without writing it. Writing is a POST — a GET that changes the world is a GET something will eventually prefetch.

**Order is part of the diff.** The database has no opinion about the order of a set, so emitting rows in Cypher's order rewrote whole files on every save — 44 insertions for a one-character change, and a diff nobody reads. The writer keeps the file's own node and edge order, and its ids, coordinates, colours and untouched props. Fixing one polarity now produces:

```diff
-      "polarity": "none",
+      "polarity": "+",
```

### Why write-back cannot destroy a collaborator's work

`PUT` retracts, then re-asserts:

1. drop this aspect from every `sources` list
2. delete only what is left with **no witness at all**
3. upsert what was sent, carrying this aspect

A concept another drawing also contains keeps its other witnesses and survives step 2. Verified by submitting an **empty** `org` drawing: 0 concepts left the union — all six had other witnesses — while the 5 edges only `org` had drawn were correctly retired. One contributor cannot delete another's work, even by saving an empty canvas. Gold recomputes for free, because it was never stored.
