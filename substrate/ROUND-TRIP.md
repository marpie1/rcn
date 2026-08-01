# The round trip — how a drawing gets from Neo4j to the canvas and back

Reference. Written 2026-07-29 by Marc + Claude Code, after building it and breaking it several times. Everything stated here was verified against the running system; the checks are named so they can be re-run.

Read `README.md` first for the model. This file is about the *trip*.

---

## 1. The one rule

> **The substrate owns meaning. The file owns appearance. Neither pretends to own the other, and anything derivable is computed rather than stored.**

Almost every design question in this system answers itself from that sentence, and every bug found so far was a violation of it.

| what | lives where | why |
|---|---|---|
| `schemaLabel` (the merge key), `variableLabel`, `polarity`, `linkFamily`, `sources`, `mode` | **Neo4j** | meaning — it must merge across drawings |
| `x`, `y`, `color`, `fontSize`, duplicate placements, node ids (`n0`…), instance props | **the file** | appearance — it belongs to one drawing |
| `gold`, family colour, the fallback ring layout | **nowhere** — computed at read time | derivable, so storing it would create a second answer that can drift |

The third row is the one people skip. `gold` is never stored: it is `size(sources) > 1`, evaluated fresh on every request. Family colour is looked up from `families.js`. Storing either would mean two answers to one question.

---

## 2. The trip

```
  ┌── Neo4j ──────────┐        ┌── the file ───────────────┐
  │ meaning:          │        │ appearance:               │
  │ label, polarity,  │        │ x/y, colour, node ids,    │
  │ linkFamily,       │        │ duplicate placements      │
  │ sources           │        │                           │
  └─────────┬─────────┘        └─────────────┬─────────────┘
            │                                │
            └────────────┬───────────────────┘
                         ▼
        GET /projection/subgraph/<name>      ← merged at read time
                         ▼
              graph-tool-v22.html            ← you edit here
                         ▼
                  "→ Substrate"
                         ├─ PUT  /subgraph/<name>        → the database
                         └─ POST /subgraph/<name>/file   → the file
                                (carries the arrangement)
```

**Layout never passes through Neo4j.** It goes file → tool → file. The database has no coordinate columns and should never get any: the same concept sits in nine different places across the sixteen drawings, so there is no single right answer to store.

---

## 3. Doing it

Neo4j Desktop must be running — start the **RCN SCHEMA** server. Then:

```bash
cd ~/rcn && python3 substrate/api.py     # port 8768
```

Open a drawing:

```
http://localhost:8768/tools/graph-tool-v22.html?url=/projection/subgraph/role
```

It arrives in **your** layout, with gold nodes the file never knew about.

1. **`?± Gaps`** — flags every edge with no `+`/`−`. Fix a whole drawing in one pass.
2. Click an edge → **PROPERTIES** → **Polarity + / − / ∅**.
3. Alt+click an edge to flip its direction.
4. **`Aa Text`** cycles the edge text: label / family / both / none. `both` is the mode for assigning relation families.
5. Typing a label that already exists in another spelling offers it — headed *"Already in use with a different spelling."*
6. **→ Substrate** writes the database *and* the file, and reports both:

```
✓ role: 4n/4e to the database · file updated · constitute ∅→+
```

Then `git diff` and commit. The file is canonical, so git is the history.

### Where things are

| | |
|---|---|
| source drawings | `tools/eip-aspects-variabilized/*.json` (16) |
| registered for Composer | `tools/graph-sets.js` |
| list what exists | `GET /projection/subgraphs` |
| the union of all 16 | `/projection/causal?db=aspects16` |
| the signed 26-node CLD | `/projection/causal?db=composite26` |
| the n=6 reference | `/projection/causal` (default `neo4j` db) |
| rebuild from files | `python3 substrate/load_aspects.py --verify` |

Composer reads the same drawings through its **EIP aspects — from the substrate** set. It needed no code change: the set simply points at `/projection/subgraph`.

---

## 4. Why it cannot eat a collaborator's work

`PUT` **retracts, then re-asserts**:

1. drop this aspect from every `sources` list
2. delete only what is left with **no witness at all**
3. upsert what was sent, carrying this aspect

A concept another drawing also contains keeps its other witnesses and survives step 2.

**Verified the worst case:** submitting an *empty* `org` drawing removed **0** concepts from the union — all six had other witnesses — while correctly retiring the 5 edges only `org` had drawn. One contributor cannot delete another's work, even by saving a blank canvas. `gold` recomputes for free because it was never stored.

---

## 5. Honest limits

- **Provenance grain is "which drawing", not who or when.** `sources: ['org','person']` means the concept appears in those two files. It cannot become "Kerry, 3 July" without the drawings carrying that — a data-collection change, not a schema one. The eventual shape is a `(:Contribution)` node.
- **No concurrent-edit protection.** Two people saving the same drawing: last write wins, silently. Fine for two people talking to each other; not fine for a public commons.
- **Per-drawing granularity.** You replace a whole drawing, not one edge.
- **A drawing with no file gets the ring.** Layout lives in the file, so a subgraph created purely through `PUT` has no arrangement until someone saves one.
- **`composite26` is read-only in practice.** Its provenance was reconstructed (node sources inferred by matching `schemaLabel`; edge sources came from the CLD's own `props.source` in a different naming scheme, 12 edges with none). Good enough to show gold, not good enough to slice apart. Round-trip against `aspects16`.
- **PHI is out of scope.** SCP and Epic FHIR data get a separate database with federation and gold-merging off. Nothing here applies to them.

---

## 6. Troubleshooting

| symptom | cause |
|---|---|
| **Blank canvas, no error**, and the tool says it loaded N nodes | the projection omitted `x`/`y`. A node with no coordinates gets a NaN centre and paints nothing. `tools/schemas/graph-tool-v22.md` is the authority — it lists them as required |
| `cannot reach http://localhost:7474` | the DBMS is stopped. Only you can start it, in Neo4j Desktop |
| An edge loaded but never draws | it used `from`/`to` instead of `src`/`tgt`. The tool reads `src`/`tgt` only, and imports the rest without complaint |
| A change you made isn't there | check `git diff` first. If the file changed but the tool disagrees, something is cached — `api.py` sends `no-store` on static files, so suspect a proxy or a hard-reload issue |
| CLD loops look wrong | `MATCH path=(n)-[:REL*]->(n)` returns each cycle once **per starting node** — 7 rows for 2 real cycles at n=6. Canonicalise before counting |
| Two spellings of one verb | they are two edges and neither can go gold. The suggester prevents new drift; existing pairs need fixing by hand |

---

## 7. Bugs already found here — do not re-introduce them

Each of these shipped, was caught, and is now guarded. They are recorded because every one of them *looked like working code*.

1. **`x`/`y` omitted from the projection.** graph-tool reported a clean load of 6 nodes and 7 edges and drew nothing. The brief's contract omits `x`/`y`; the schema doc requires them. Trust the schema doc.
2. **Row order churned the file.** The database has no opinion about the order of a set, so emitting rows in Cypher order rewrote whole files — 44 insertions for a one-character change. A diff that size does not get reviewed. The writer keeps the file's own node and edge order.
3. **Duplicate placements collapsed.** `org` draws `Effectiveness of ORG` twice so its edges do not cross. Merging by `schemaLabel` is right — it is one concept — but write-back emitted the merged count and would have cut the file from 8 nodes to 6. Duplication belongs to the drawing.
4. **Layout was not preserved in either direction.** Opening from the substrate gave the synthetic ring, and rearranging then saving discarded the new arrangement. Fixed by overlaying the file's coordinates on read and sending the canvas arrangement on write.
5. **A new drawing was invisible.** `PUT` wrote real content but created no `:Aspect` node, so nothing listed it — present in the data, absent from every tool. `PUT` now merges the `:Aspect`.
6. **The merge key did not normalise.** One drawing writes `Active Goal`, another `ActiveGoal`. `families.js` warned about exactly this. Unnormalised, that is one concept splitting into two nodes that never merge and never go gold. **A merge key that does not normalise is not a merge key.**
7. **Verb drift split relations.** `constitute` and `constitutes` are two edges, `Org → Role`, one signed and one not. The edge merge key includes the raw verb. The fix was deliberately *not* to normalise labels — that rewrites what an author wrote — but to suggest existing spellings while typing.

---

## 8. Two findings this work produced about the data

**The two self-loops in `eip-cld-subgraph-mismatches.md` are merge artefacts, as that document suspected.** `Org --relate_with--> Org` and `ActiveGoal --require--> ActiveGoal` run, in the file, between two *different* nodes that share a label (`n0 → n1`, `n5 → n4`). Nobody drew a self-loop. That closes 2 of its 23 open items — they are not decisions.

**The 16 unsigned edges are that document's groups 1 and 2, exactly.** Of them, 9 are signed by the CLD but *reversed*, 7 the CLD does not have, and **0** agree with the CLD's direction. The missing sign and the unresolved direction are the same fact. So for those 9, setting a sign before settling the direction is the wrong order: in a CLD the arrow decides which loops exist, and a sign on a backwards arrow is a confident wrong answer. See `unsigned-edges.md`, which splits them into 7 same-verb (a transcription slip — read the verb aloud) and 4 different-verb (a genuine editorial reading, for Marc and Kerry).
