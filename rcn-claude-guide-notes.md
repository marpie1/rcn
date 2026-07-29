# Claude-Guided RCN Tool Pre-Population — Learning Log

Purpose: capture what works, what breaks, and what generalizes as Marc and Claude
develop the pattern of Claude guiding people to select and pre-populate RCN tools
from LLM-available data. Keep this file in ~/rcn and re-upload (or paste) at the
start of future sessions so learning compounds.

Convention: dated entries, newest at top. Three sections per entry:
DID / LEARNED / OPEN.

---

## 2026-07-28/29 — Sessions 3–4 (Claude Code): the RCN Substrate

One Neo4j graph carrying every layer; the diagram tools become lenses over it.
Full reference: `substrate/ROUND-TRIP.md` and `substrate/README.md`.

### DID
- Stood up the substrate on Neo4j **5.26.4 Enterprise** (Neo4j Desktop 1.6.1,
  server "RCN SCHEMA"). Three databases: `neo4j` (the n=6 reference),
  `composite26` (the signed 26-node CLD), `aspects16` (the 16 aspect drawings
  with exact provenance).
- `substrate/db.py` (Cypher over HTTP, stdlib only), `seed.py`, `api.py`
  (projections, port 8768), `load_composite.py`, `load_aspects.py`,
  `aspect_file.py` (write-back to source files).
- Two projections through two renderers: `/projection/causal` into
  graph-tool via its existing `?url=` path, `/projection/gold` into the harness.
- Stage 2 held: the 26-node composite loaded behind **byte-identical Cypher**.
  `?db=` selects which graph, never which query.
- `tools/edge-families.js` — seven relation families, declared not drawn.
- Round trip: Composer and graph-tool read the substrate; `→ Substrate` writes
  the database *and* the source file.
- `tools/schemas/graph-tool-v22.md` updated for the substrate additions.

### LEARNED
- **A merge key that does not normalise is not a merge key.** One drawing writes
  `Active Goal`, another `ActiveGoal`. `families.js` warned about exactly this.
  Unnormalised, it is one concept splitting into two nodes that never merge and
  never go gold.
- **Silent success is the failure mode to design against.** A projection that
  omitted `x`/`y` made graph-tool report a clean load of 6 nodes and 7 edges and
  draw nothing. NaN centres, no error. Four of the seven bugs in ROUND-TRIP §7
  presented as working code.
- **The stated acceptance test could not fail.** The harness's provenance pane
  was hardcoded SVG, and against the real data it was wrong on two of five
  nodes. It would have passed against an empty database. A test that cannot fail
  is worse than no test.
- **`sources` as a LIST is load-bearing** — it is why gold is computable, why a
  subgraph is a filter rather than a stored thing, and why write-back cannot
  delete a collaborator's work.
- **Verify at the layer Marc sees.** Two of my own checks were wrong: a CSS
  selector that reported a working dropdown as missing, and a claim that layout
  round-tripped when only half of it did.
- **Data findings.** The two self-loops in `eip-cld-subgraph-mismatches.md` are
  merge artefacts of duplicate node placements, not decisions — 2 of its 23
  items close. And its groups 1 and 2 are *exactly* the 16 unsigned edges: 9
  reversed relative to the CLD, 7 absent from it, **0** agreeing. The missing
  sign and the unresolved direction are the same fact.
- **The anomalous edge-direction switching is not a bug.** Tested: 54 edges
  agree with the CLD, 11 reversed, scattered across 8 drawings with correct
  edges alongside. A `reverseAll()` flips a whole drawing. What looks like
  switching is composing from the subgraphs versus reading the signed CLD.

### OPEN
- Marc + Kerry: the 16 unsigned edges (`substrate/unsigned-edges.md`) and the 22
  edges with no relation family (`substrate/eip-composite-edge-families.md`).
- Four coverage rows still open in `substrate/tool-inventory.md`: polygons,
  flow quantities, icon binding, layers/traces, credentials.
- No concurrent-edit protection on write-back; last write wins silently.
- Provenance grain is "which drawing", not who or when. A `(:Contribution)`
  node is the eventual shape.
- `constitute`/`constitutes` and `create`/`creates` still split in the data. The
  typeahead prevents new drift; these two pairs need fixing by hand.

---

## 2026-07-25 — Session 2 (Claude Code): validator round-trip on the v22 JSON

### DID
- Located `validate-rcn-graph.js`. **It is not in ~/rcn** — three byte-identical
  copies live in ~/Downloads (`validate-rcn-graph.js`, `files (17)/`, `files (10)/`,
  all md5 `26077f17…`). Ran the ~/Downloads copy.
- First run against `southern-louisiana-actor-map-v22.json` — verbatim output:

```
WARN  node[0] "crowley": shape "0" unknown, falls back to ellipse
WARN  node[1] "etcfe": shape "0" unknown, falls back to ellipse
WARN  node[2] "crowleyMainSt": shape "0" unknown, falls back to ellipse
WARN  node[3] "crowleyChurchPantries": shape "0" unknown, falls back to ellipse
WARN  node[4] "postSignal": shape "0" unknown, falls back to ellipse
WARN  node[5] "newIberia": shape "0" unknown, falls back to ellipse
WARN  node[6] "smha": shape "0" unknown, falls back to ellipse
WARN  node[7] "wecna": shape "0" unknown, falls back to ellipse
WARN  node[8] "westEndAssocs": shape "0" unknown, falls back to ellipse
WARN  node[9] "envisionDaBerry": shape "0" unknown, falls back to ellipse
WARN  node[10] "daBerryMarket": shape "0" unknown, falls back to ellipse
WARN  node[11] "westEndPark": shape "0" unknown, falls back to ellipse
WARN  node[12] "jeanerette": shape "0" unknown, falls back to ellipse
WARN  node[13] "cityJeanerette": shape "0" unknown, falls back to ellipse
WARN  node[14] "ward4": shape "0" unknown, falls back to ellipse
WARN  node[15] "railroadAve": shape "0" unknown, falls back to ellipse
WARN  node[16] "landmarkSociety": shape "0" unknown, falls back to ellipse
WARN  node[17] "kinder": shape "0" unknown, falls back to ellipse
WARN  node[18] "coushatta": shape "0" unknown, falls back to ellipse
WARN  node[19] "koasatiProject": shape "0" unknown, falls back to ellipse
WARN  node[20] "coushattaCasino": shape "0" unknown, falls back to ellipse
WARN  node[21] "allenHealthcare": shape "0" unknown, falls back to ellipse
WARN  node[22] "allenLibraries": shape "0" unknown, falls back to ellipse
ERROR edge[0]: missing string id
ERROR edge[1]: missing string id
ERROR edge[2]: missing string id
ERROR edge[3]: missing string id
ERROR edge[4]: missing string id
ERROR edge[5]: missing string id
ERROR edge[6]: missing string id
ERROR edge[7]: missing string id
ERROR edge[8]: missing string id
ERROR edge[9]: missing string id
ERROR edge[10]: missing string id
ERROR edge[11]: missing string id
ERROR edge[12]: missing string id
ERROR edge[13]: missing string id
ERROR edge[14]: missing string id
ERROR edge[15]: missing string id
ERROR edge[16]: missing string id
ERROR edge[17]: missing string id
ERROR edge[18]: missing string id
ERROR edge[19]: missing string id
ERROR edge[20]: missing string id
ERROR edge[21]: missing string id
ERROR edge[22]: missing string id

FAIL: 23 error(s), 23 warning(s)
```

- Applied three fixes to the JSON, then re-ran — verbatim output:

```
OK: renders in RCN Graph Tool (23 nodes, 23 edges). 0 warning(s).
```

- Wrote `tools/schemas/` — authoritative schema references for the three tools
  chat-Claude is actually asked to pre-populate (Graph Tool, Timeline, Issue
  Polygon Map), each derived from that tool's own load/save functions and
  stamped with the commit it was verified against.
- Upgraded `validate-rcn-graph.js`: round-trip survival check on top-level keys,
  a specific diagnostic for numeric `shape`, and `--fix` now migrates a `meta`
  block into `modelName`/`modelNote`.

### LEARNED
1. **Closes Session 1 OPEN #5 — there is no shape-code mapping.** `shape` is a
   STRING, not a numeric code. Authoritative list, `tools/graph-tool-v22.html:875`:

   ```js
   var SHAPES=['ellipse','rect','rounded','diamond','hexagon','cylinder','barrel'];
   ```

   `'rounded'` is the tool's own default for new nodes (`makeNode`, line 3892).
   Any unrecognised value silently falls back to `ellipse` in `shapeHTML`
   (line 3186) — so `shape: 0` would have *loaded and rendered*, just as the
   wrong shape, with no error. Set all 23 nodes to `'rounded'`, preserving the
   original intent: one uniform placeholder meant "no shape distinction
   intended," not "four towns differ from their orgs." Making the town anchors
   `'hexagon'` is a reasonable later choice, but it is a new decision, not a fix.

2. **The only hard failure was missing edge `id`s** — Session 1's self-checks
   verified unique *node* ids and no dangling edges, but never checked that
   edges carried ids at all. Added `e1`–`e23`. Worth adding to the pre-flight
   list: *every edge needs its own string id*, not just valid src/tgt.

3. **`basis` DECISION: moved from a top-level edge field into `props.basis`.**
   Both survive a round-trip — the importer does
   `Object.assign({dash,note}, e, {...})` (line 4563) and `buildState` does
   `Object.assign({}, e, {props:…})` (line 4330), so *any* unknown top-level key
   is preserved. Round-tripping was never the question. The question is whether
   the field is **reachable**, and top-level `basis` is not:
   - `props` is the schema's designated extension bag, with real UI affordances
     — add/rename/reorder/delete per edge (`aEP`/`uEPK`/`moveEProp`/`rEP`,
     lines 4274–4315). A top-level `basis` has no editor; a human could never
     correct or add a citation without hand-editing JSON.
   - `props` is **searchable** — `renderEdge` (line 3233) matches the search
     term against prop keys and values. Provenance you cannot search is not
     auditable.
   - `props` is what the DOT / Cypher / CSV exporters carry out. A top-level
     field is dropped at every boundary.

   So the Session 1 proposal ("adopt `basis` into the schema") should be
   **withdrawn, not implemented**: the schema already has the right home for it
   and no tool change is needed. The generalisable rule for LLM pre-population:
   **provenance goes in `props`, never in a bare top-level key.** Same likely
   applies to the proposed `linkType` (OPEN, below).

4. **The confidence gap was real but inverted.** Session 1 flagged shape codes
   as the "known schema gap" and it was the *harmless* one — wrong shape, still
   renders. The unflagged assumption (edges don't need ids) was the one that
   failed. Recall correctly identified that it was uncertain; it did not
   identify *where* it was wrong. Argues for running the validator on every
   pre-populated artifact regardless of how confident the self-check was.

5. **VISUAL LOAD TEST PASSED — and found a bug the validator cannot see.**
   Served ~/rcn over `python3 -m http.server` and loaded the file into
   graph-tool-v22.html (the Chrome extension refuses `file://` URLs — use a
   local server for any future visual test). All 23 nodes and 23 edges paint;
   `props.basis` survives the full import→`buildState` round-trip on all 23
   edges. But: **the entire `meta` block is silently dropped on export.**
   `buildState` (line 4330) emits exactly
   `version, modelName, modelNote, canvasBg, graphAttrs, cldLoopNames,
   legendEntries, legendVisible, customSymbols, nodes, edges, lines, metaEdges`
   — no `meta`. Title, description, schema version, created date, and author
   all vanish the first time anyone exports from the tool. Confirmed live:
   `metaSurvivesExport: false`, and the Model Name field read "Untitled".

   Fixed the same way as `basis` — by using the field the tool already has,
   not by proposing a schema change: added top-level `modelName` (from
   `meta.title`) and `modelNote` (description + schema version + created +
   author), both of which `buildState` preserves. `meta` is kept as well, since
   it is still useful in the source-of-truth file. Verified: reloading now
   populates Model Name and Note/Source, and both survive re-export.

   **This generalises the Session 1 provenance rule.** It is not just that
   provenance belongs in `props` — it is that *the tool's round-trip, not the
   validator, defines what is real*. The validator passed this file with 0
   warnings while five fields of authorship metadata were set to evaporate.
   Pre-flight for LLM-populated artifacts needs both: validator for structure,
   `buildState` round-trip for survival.

6. **A validator per tool is the wrong shape for the fix — schemas are.**
   Marc's question: shouldn't every tool get a validator, so chat makes fewer
   mistakes? Three things argue for schema references first.
   - **Validators encode yesterday's failures.** Ours passed this file with 0
     warnings while `meta` evaporated (LEARNED #5). It can only catch what
     someone already got wrong.
   - **They drift silently.** The June validator knew 34 node/edge fields; the
     tool had since added `opmType`, `tripleId`, `opmMarker`, `graphAttrs`,
     `legendEntries`, `customSymbols`, `modelName`, `modelNote`. Twelve
     hand-written validators would be twelve artifacts each quietly wrong
     within a month — and chat would trust all of them.
   - **A schema prevents; a validator only detects.** If chat has the schema,
     most of what a validator catches never gets generated.
   Also correcting a premise: chat-Claude is not *barred* from the tool code.
   It has no live filesystem access, but the code can be uploaded, put in a
   Project's knowledge, or wrapped in a Skill. The gap was never a hard
   limitation — nobody had handed it the reference.
   So: `tools/schemas/*.md` first, one *generic* validator driven by them
   later, and a round-trip diff as the check that catches the `meta` class.

7. **Writing the schemas found two more silent-loss bugs**, both the same shape
   as the `meta` drop — structurally valid, no error, data gone:
   - **Issue Polygon Map: the issue polygon does not survive its own export.**
     `exportData` writes `type:"IssuePolygon"` (line 1021); `loadFromGeoJSON`
     handles only `Parcel` and `CustomIssuePolygon` (line 1126), and
     `ISSUE.polygon` is never assigned on import. Export, re-import, and the
     boundary that *defines the issue* is gone. Parcels come back, so it looks
     like it worked.
   - **Timeline: `rel` supports two relations, not thirteen.** `solve()` tests
     `rel==="meets"` and treats everything else as `before`. `"overlaps"`,
     `"during"`, `"equals"` are accepted silently and behave as `before`. The
     trap is the *label*: notes and memory describe the tool as using "Allen
     relations", which is true of its design intent and false of its
     implementation. A Claude that reads the phrase and reaches for the
     canonical thirteen will emit relations the tool misreads without
     complaint. Fixed the memory entry to name the two.
   Both are now documented in the schema files. Neither is fixed.

8. **Three for three.** Every tool examined closely this session had a silent
   round-trip loss. That is no longer a coincidence to note — it is the
   expected defect for this family of single-file HTML tools, where export is
   hand-written per tool and nothing tests that import is its inverse. Assume
   it is present in any tool not yet checked.

9. **The validator lives outside the repo.** It is the ground truth for the
   chat-Claude → Claude Code handoff (Session 1 LEARNED #7) but currently
   survives only as duplicate downloads. Should move into ~/rcn/tools and be
   committed before the `rcn-tools` skill is drafted around it.

### OPEN
- [x] Validator verdict on the v22 JSON — PASSES, 0 warnings, after fixes above
- [x] Visual load test in graph-tool-v22.html — PASSED, 23/23 nodes and edges
      paint; surfaced the dropped-`meta` bug (LEARNED #5)
- [ ] **Layout is the weak point, not the data.** Edge labels overlap each other
      and run across node boxes; several are clipped off the top of the canvas
      (the Crowley cluster's "downtown revitalization" and "public-private
      partnership"). The four town clusters read clearly, but the inter-cluster
      edges do not. Try Dagre LR or Force from the LAYOUT row, or shorten the
      edge labels and move the detail into `props`. Deliberately left as-is —
      re-laying out is a design decision, not a fix.
- [x] Extend the validator to check round-trip survival, not just structure —
      done: warns on any top-level key `buildState` does not emit, names the
      `meta` fix, flags numeric `shape`, and `--fix` migrates meta
- [ ] Fix the Issue Polygon Map import gap (LEARNED #7) — `loadFromGeoJSON`
      should handle `type:"IssuePolygon"`, or export should stop writing a
      feature nothing reads
- [ ] Decide whether the Timeline should support more Allen relations or
      whether two is the honest answer; either way stop calling it "Allen
      relations" in notes and memory
- [ ] Check the remaining JSON-consuming tools for the same round-trip loss
      (LEARNED #8): NRM, IBIS, Wardley, e-VSM, MORE Outliner
- [ ] Generic schema-driven validator to replace per-tool scripts; wrap
      `tools/schemas/` in the `rcn-tools` skill
- [x] Move `validate-rcn-graph.js` into ~/rcn/tools and commit it — now
      `tools/validate-rcn-graph.js` (md5 `26077f17…`). The three byte-identical
      ~/Downloads copies were deleted afterwards — the repo is now the single
      reference copy.
- [ ] Extend the validator: flag `basis`/provenance sitting at top level on an
      edge, and warn on shape values that are numbers (the `shape: 0` case
      currently only warns as "unknown")
- [ ] `linkType` proposal (Session 1 LEARNED #4) — re-examine as `props.linkType`
      before asking for a schema change; check whether CLD loop detection can be
      made to respect it
- [ ] Decide whether town anchors should be visually distinct (`hexagon`)

---

## 2026-07-25 — Session 1: Southern Louisiana pilot

### DID
- Web research on four towns: Crowley, New Iberia (West End), Jeanerette, Kinder.
- Produced the four-stage teaching gradient: SEEDS (Crowley) / STRUCTURE (New
  Iberia) / NECESSITY (Jeanerette) / SOVEREIGNTY & RHYTHM (Kinder + Coushatta).
- Pre-populated first artifact: `southern-louisiana-actor-map-v22.json`
  (23 nodes, 23 edges, 1 loop) targeting Graph Tool v22 schema.
- Ran structural self-checks (unique ids, no dangling edges, valid polarity,
  numeric w/h/shape, lexically sorted cldLoopNames key). All passed.
- Status: awaiting verdict from validate-rcn-graph.js and visual load test.

### LEARNED
1. **Predetermined context does three jobs**: SELECT (which instrument fits the
   data), CONFORM (schema facts make output loadable, not approximate), and
   SEQUENCE (which tools need no one's consent vs. which need a relationship
   first). All three must be in a future skill/context package.
2. **Research→tool fit**: web research naturally yields an ACTOR map (orgs,
   relations, provenance), not a causal map. Graph Tool was the right first
   instrument; CLD would have forced invented causality.
3. **Provenance is non-negotiable for LLM-populated data.** Added a `basis`
   field to every edge citing the public source. Proposal: adopt `basis` (or
   `source`) into the schema so human-entered and LLM-entered claims are
   distinguishable and auditable.
4. **Live argument for v23 fields**: SMHA→WECNA "dissolving scaffold" and the
   Jeanerette receivership edge are structural/historical relations that should
   be excluded from loop detection → supports proposed `linkType` field.
5. **Known schema gap**: shape-code mapping unknown to Claude; used shape: 0
   placeholder. ACTION: record the real shape codes in this log / future skill.
6. **Tool-selection sequencing that emerged** (reusable heuristic):
   - No-consent-needed first: Graph Tool, EIP sketch, FedWiki pages, RCN Map layer.
   - First-contact instrument: Six Questions/Six Contexts.
   - Relationship-gated: e-VSM Survey, CAM field test, SensiMod, SODOTO, CfA-dSC.
7. **Architecture clarification (important)**: chat-Claude has NO live access
   to ~/rcn. Its schema knowledge is *memory of past conversations* — accurate
   but recall, not reference. Consequences: (a) validator round-trips are the
   ground truth, not Claude's confidence; (b) the future rcn-tools skill should
   contain the authoritative schema so no Claude needs to rely on recall;
   (c) Claude Code running on Marc's own machines (MacBook Air / Mac Mini)
   DOES have real ~/rcn access — a
   natural division of labor: chat-Claude researches and pre-populates,
   Claude Code validates, integrates, and commits.
8. **Provenance applies to the conversation, not just the data.** Session 1's
   two confusions (Claude asserting the rcn folder was on the Mac Mini; Marc
   inferring Claude had live access to ~/rcn) shared one root: memory detailed
   enough to be mistaken for something else. Rule going forward — distinguish
   REMEMBERED / OBSERVED / INFERRED in claims about Marc's environment, exactly
   as the `basis` field distinguishes sources in graph edges. Predetermined
   context's failure mode is confident claims with invisible provenance.
9. **Environment correction (2026-07-25)**: The Mac Mini is NOT in use — not
   now, not in the foreseeable future. All work happens on the MacBook Air.
   Treat any remembered Mac Mini references (production server, Caddy, FedWiki
   hosting) as historical until Marc says otherwise.
10. **Research quality note**: town-level civic activity is discoverable via
   local press, chamber calendars, LLA audit reports, nonprofit registries,
   Facebook org pages, cultural district resolutions. State auditor documents
   (LLA) were the key source for institutional-failure detection (Jeanerette).

### OPEN
- [ ] Validator verdict on the v22 JSON (does `basis` survive? shape codes?)
- [ ] EIP four-column one-pager from same research (next pre-population rung)
- [ ] FedWiki page set for the Louisiana neighborhood (forkable for NDC leads)
- [ ] Four new places in PostGIS /places layer (TIGER boundaries)
- [ ] Draft `rcn-tools` skill: schemas + instrument-selection logic + this
      session as worked example
- [ ] Far rung: artifact app (Claude-in-Claude) — Six Questions form → valid
      Graph Tool JSON for any town
- [ ] Candidate outreach: Audry Spencer (ETCFE, Crowley), WECNA/Lorna Bourg
      (New Iberia), Ward 4 org (Jeanerette), Coushatta Heritage Dept (learn
      from, not credential), Allen Parish Community Healthcare (WWHA resonance)

---
