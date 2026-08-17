# Claude-Guided RCN Tool Pre-Population — Learning Log

Purpose: capture what works, what breaks, and what generalizes as Marc and Claude develop the pattern of Claude guiding people to select and pre-populate RCN tools from LLM-available data. Keep this file in ~/rcn and re-upload (or paste) at the start of future sessions so learning compounds.

Convention: dated entries, newest at top. Three sections per entry: DID / LEARNED / OPEN.

---

## 2026-08-17 — Session 7 (Claude Code): the Chat-authoring workflow in the docs

Audit of whether the Claude-Chat Wardley workflow and Rent Band Analysis had reached the intro, the manual, and the deck. One of three.

### DID
- Manual: already thorough (§9d, four steps, axis warning, troubleshooting table). Gave its two new subsections anchors and renamed the contents entry to "9d. Wardley mode — Chat authoring, rent bands", since nothing in the sidebar hinted the section had grown.
- Intro: split one overloaded Wardley card into three — Wardley mode, Wardley maps written by Claude Chat, Rent Band Analysis. Chat authoring is about how content arrives, not about a mode, and it was buried as the middle paragraph of a card doing three jobs.
- Deck (`docs/make_graph_tool_intro_pptx.py`): two new slides — Wardley/RBA, and the four-step Chat workflow with the axis trap in a dark strip at the foot. 15 slides to 17. Rebuilt and rendered to PDF to check for overflow.
- Modes slide said "Eight analytical modes" and listed eight; the tool has LOP and SFD as well. Added LOP from Marc's own intro copy and dropped the count from the title rather than assert a number I could not stand behind.

### LEARNED
1. **A card that gains a third paragraph has become three cards.** The Wardley card was carrying the grid, the authoring workflow, and a whole analytic method. Length is the symptom; the cure is asking what each paragraph is really about — two of those three were not about Wardley mode at all.
2. **Docs drift in a pattern worth naming.** The manual was complete, the intro was a line, the deck had nothing. Effort tracks proximity to the code: the manual is edited while building, the deck is a separate build step nobody remembers. Assume the deck is the stale one and check it first.
3. **A count in a slide title is a maintenance liability.** "Eight analytical modes" was wrong before this session started and would have gone wrong again at the next mode. Removing the number costs nothing and cannot rot.
4. **Render the deck, always.** python-pptx reports nothing when text overflows its box. Keynote needs to be running before the AppleScript export — a cold `tell application` fails with -600 and no file.

### OPEN
- [ ] **SFD mode is undocumented everywhere** — not in the intro, not in the manual, not in the deck, though the button is in the tool. The largest doc gap found in this audit and out of scope for it
- [ ] The intro is a flat grid of 23 cards with no grouping; modes, authoring paths, and export features all read at the same weight. Worth a pass at structure rather than more cards
- [ ] Chat authoring is Wardley-only today. If the card pattern generalises to CLD or EIP, the intro card and the deck slide both need rewording away from "Wardley maps"

---

## 2026-08-11 — Session 6 (Claude Code): Wardley maps from Claude Chat

Marc's Chat session produced a bicycle-production map that would not load. Handed off as an auto-load debugging task; it was neither an auto-load problem nor a debugging one.

### DID
- Diagnosed the real break. Chat emitted the bare `{title, query, components, dependencies}` shape, which the Graph Tool did not recognise, and the generator has no paste-JSON button at all — so the handoff's stated fallback did not exist. Separately, Chat wrote the evolution axis the standard way (commodity right) while the generator's format runs the other way, so the map would have rendered mirrored even if it had loaded.
- Found `exportForRCN()` already present in the claude.ai artifact copy of the generator and absent from `tools/wardley-map-generator.html`. Ported just that function, since the two copies have deliberately diverged (the repo one hides the AI banner for `file://`, the artifact one needs `window.claude`).
- `tools/graph-tool-v22.html`: bare shape now loads **if** it declares `axis`; generator imports now carry `evolution`/`visibility`; `w`/`h` default on load; unpositioned nodes get gridded with a toast instead of NaN.
- `tools/wardley-chat-to-rcn.js` — converter with an explicit `--axis`, which prints the leftmost and rightmost component by name so a mirrored map is caught at the command line.
- `tools/wardley-chat-card.md` — the card a user pastes into Chat.
- `tools/wardley-bicycle-production.rcn.json` — Marc's map, converted, validator-clean, verified rendering.
- Validator: x/y optional when `evolution`/`visibility` are present in Wardley mode; w/h demoted to a warning; both rolled up so a correct file no longer draws nine warnings.
- Manual §9d gained "Building a map with Claude Chat" with a troubleshooting table; intro and schema doc updated.

### LEARNED
1. **Refusing to guess is a feature, and it belongs at the door.** Two axis conventions, both 0–1, both called the evolution axis, running opposite ways. No heuristic separates them — a map is not more likely to be one than the other. The tool now declines to load a bare file that does not say, with the two options in the toast. Cheaper than any amount of cleverness, and it teaches the convention on first contact.
2. **The failure the user reports is rarely the failure.** The handoff spent four hypotheses on canvas timing and `DOMContentLoaded`. The map could not have rendered correctly under any of them, because the data was mirrored and the shape was unreadable. Reproduce before theorising.
3. **Make the target forgiving before writing the instructions.** The context card got shorter every time the loader got more tolerant. Defaulting `w`/`h` and deriving `x`/`y` cut a Wardley node from twelve fields to four — and four fields is a thing an LLM gets right every time, with no card at all.
4. **Nine identical warnings teach people to skip warnings.** A three-node file written exactly as instructed drew nine. Rolled up to one, plus a `note` line for the case that is correct rather than merely tolerable.
5. **A converter should read its own output back in the user's terms.** `--axis` prints "most Genesis: E-bike Powertrain / most Commodity: Global Container Shipping". That single line catches the mirror before anything is opened, which is three steps earlier than a screenshot would.
6. **Two copies of a tool diverging on purpose is not the same as one being stale.** The Downloads generator was a superset by function count, which argued for overwriting. It was also the artifact build, with the AI-unavailable banner shown and `window.claude` calls the local copy cannot make. Diff the intent, not the line count.

### OPEN
- [ ] Both generator copies call model ids that predate the Claude 5 family (`claude-sonnet-4-20250514` local, `claude-sonnet-4-6` artifact). The AI-generate path only works inside claude.ai anyway, so this is dormant, not broken
- [ ] `justifyPositionInline()` was not ported — it calls the artifact-only completion API and cannot work on `file://`
- [ ] Consider a paste-JSON path in the generator, so a Chat file can be opened there for visual editing without a round trip through the Graph Tool
- [ ] The card asks Chat for RCN native JSON; worth testing whether a long conversation drifts back to the bare shape, and whether the axis line survives that drift

---

## 2026-08-10 — Session 5 (Claude Code): Rent Band Analysis in the Graph Tool

Build A of `Rent-Band-Analysis-Method.md` v1.2 Part 5 — renderer, schema, validator. Deviations are logged in that document as Part 7; this entry is what the session learned.

### DID
- Read the handoff and the method doc, ran the spec's own Step 0 discovery, and reported three wrong premises before writing code: Wardley mode already existed inside the Graph Tool (so the consolidation question was settled by the spec's own rule), the validator is at `tools/validate-rcn-graph.js` not `rcn-graph-json/scripts/`, and the example did not in fact fail the current validator.
- `tools/graph-tool-v22.html`: RBA fields on nodes (`evolution`, `visibility`, `shadow`, `pinnedBy`, `pressure`); rent band, shadow node, pin glyph, pressure arrow, rent label rendered in Wardley mode; hover annotations; `<title>` injection so the annotations survive SVG export; `mode` persisted in `buildState()` and honoured on load.
- `tools/validate-rcn-graph.js`: all of Step 4's rules plus a bare-`R#` pin warning and a `--cld` cross-check flag.
- `tools/rba-hospital-pricing.rcn.json`: the worked example, reconciled — validator-clean, 0 warnings.
- Verified in the browser at real zoom: load, render, hover the arrow and the pin, drag a node and confirm the write-back, export and diff. Round-trip preserves every RBA field.
- Copied the method doc into `~/rcn` (it was only in Downloads) and appended Part 7.

### LEARNED
1. **Two axis conventions can agree on the field name and disagree on the direction.** The method's `evolution` runs 0=Genesis→1=Commodity; the tool's `wardleyX`, inherited from the generator, runs 1=Genesis. Both are 0–1, both are "the evolution axis", and nothing in either document says which way. Read the *comparables* to settle it: airline fares and LASIK at 0.95 are fully commodity, so 1 is commodity. A spec that names a range without naming its direction has not specified the axis.
2. **Two copies of a position always drift.** The example carried `x`/`y` and `evolution`/`visibility` disagreeing by ~200px. Pick the copy that carries meaning, derive the other, and write it back on edit — otherwise the bands render somewhere the nodes are not.
3. **An identifier assigned in detection order is not an identifier.** `pinnedBy: ["R2"]` looked stable and is not: CLD loop labels renumber whenever the graph is edited. Every cross-file reference in this toolset needs the same audit.
4. **A 1.8px line is not a hover target.** The pressure arrow's whole job is to carry the annotation that separates pinning from immaturity, and it was effectively unreachable until it got a transparent hit band. The tool already knew this — every edge carries one — and the lesson did not transfer on its own.
5. **The prettiest bug was a band edge.** A rent band drawn centre-to-centre cuts a hard line down the middle of the shadow box and the eye reads two boxes. Nothing was numerically wrong; it only showed up in a screenshot at real zoom.
6. **The handoff's confident claims about disk state were mostly wrong, and cheap to check.** Three of them, five minutes of `ls` and `grep`. Step 0 of that spec exists for a reason and it earned its place.

### OPEN
- [ ] Step 3 — editor UI: node inspector "add shadow position", drag the ghost horizontally with y locked, fields for basis, rent object, pinnedBy, forces and resistance entries
- [ ] Confirm the coral/teal palette (`#e2725b` / `#2a9d8f` / `#8c3520` text) — the method says check with Marc
- [ ] The example's `visibility` values order the value chain upside down relative to its own px layout; kept as written, needs Marc's call
- [ ] FedWiki half of Step 5: pin glyph linking to its loop page, rent object into the node's page — needs a FedWiki-side design decision, since the tool's wiki path emits an SVG ghost page, not per-node pages
- [ ] `modelName()` strips every non-alphanumeric character before `buildState()` stores it, so an em dash in a diagram title is lost on export. Pre-existing, affects every saved file, fix is to sanitize at filename time only
- [ ] Decide whether `wardley-map-generator.html` retires now that RBA lives in the Graph Tool

---

## 2026-07-28/29 — Sessions 3–4 (Claude Code): the RCN Substrate

One Neo4j graph carrying every layer; the diagram tools become lenses over it. Full reference: `substrate/ROUND-TRIP.md` and `substrate/README.md`.

### DID
- Stood up the substrate on Neo4j **5.26.4 Enterprise** (Neo4j Desktop 1.6.1, server "RCN SCHEMA"). Three databases: `neo4j` (the n=6 reference), `composite26` (the signed 26-node CLD), `aspects16` (the 16 aspect drawings with exact provenance).
- `substrate/db.py` (Cypher over HTTP, stdlib only), `seed.py`, `api.py` (projections, port 8768), `load_composite.py`, `load_aspects.py`, `aspect_file.py` (write-back to source files).
- Two projections through two renderers: `/projection/causal` into graph-tool via its existing `?url=` path, `/projection/gold` into the harness.
- Stage 2 held: the 26-node composite loaded behind **byte-identical Cypher**. `?db=` selects which graph, never which query.
- `tools/edge-families.js` — seven relation families, declared not drawn.
- Round trip: Composer and graph-tool read the substrate; `→ Substrate` writes the database *and* the source file.
- `tools/schemas/graph-tool-v22.md` updated for the substrate additions.

### LEARNED
- **A merge key that does not normalise is not a merge key.** One drawing writes `Active Goal`, another `ActiveGoal`. `families.js` warned about exactly this. Unnormalised, it is one concept splitting into two nodes that never merge and never go gold.
- **Silent success is the failure mode to design against.** A projection that omitted `x`/`y` made graph-tool report a clean load of 6 nodes and 7 edges and draw nothing. NaN centres, no error. Four of the seven bugs in ROUND-TRIP §7 presented as working code.
- **The stated acceptance test could not fail.** The harness's provenance pane was hardcoded SVG, and against the real data it was wrong on two of five nodes. It would have passed against an empty database. A test that cannot fail is worse than no test.
- **`sources` as a LIST is load-bearing** — it is why gold is computable, why a subgraph is a filter rather than a stored thing, and why write-back cannot delete a collaborator's work.
- **Verify at the layer Marc sees.** Two of my own checks were wrong: a CSS selector that reported a working dropdown as missing, and a claim that layout round-tripped when only half of it did.
- **Data findings.** The two self-loops in `eip-cld-subgraph-mismatches.md` are merge artefacts of duplicate node placements, not decisions — 2 of its 23 items close. And its groups 1 and 2 are *exactly* the 16 unsigned edges: 9 reversed relative to the CLD, 7 absent from it, **0** agreeing. The missing sign and the unresolved direction are the same fact.
- **The anomalous edge-direction switching is not a bug.** Tested: 54 edges agree with the CLD, 11 reversed, scattered across 8 drawings with correct edges alongside. A `reverseAll()` flips a whole drawing. What looks like switching is composing from the subgraphs versus reading the signed CLD.

### OPEN
- Marc + Kerry: the 16 unsigned edges (`substrate/unsigned-edges.md`) and the 22 edges with no relation family (`substrate/eip-composite-edge-families.md`).
- Four coverage rows still open in `substrate/tool-inventory.md`: polygons, flow quantities, icon binding, layers/traces, credentials.
- No concurrent-edit protection on write-back; last write wins silently.
- Provenance grain is "which drawing", not who or when. A `(:Contribution)` node is the eventual shape.
- `constitute`/`constitutes` and `create`/`creates` still split in the data. The typeahead prevents new drift; these two pairs need fixing by hand.

---

## 2026-07-25 — Session 2 (Claude Code): validator round-trip on the v22 JSON

### DID
- Located `validate-rcn-graph.js`. **It is not in ~/rcn** — three byte-identical copies live in ~/Downloads (`validate-rcn-graph.js`, `files (17)/`, `files (10)/`, all md5 `26077f17…`). Ran the ~/Downloads copy.
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

- Wrote `tools/schemas/` — authoritative schema references for the three tools chat-Claude is actually asked to pre-populate (Graph Tool, Timeline, Issue Polygon Map), each derived from that tool's own load/save functions and stamped with the commit it was verified against.
- Upgraded `validate-rcn-graph.js`: round-trip survival check on top-level keys, a specific diagnostic for numeric `shape`, and `--fix` now migrates a `meta` block into `modelName`/`modelNote`.

### LEARNED
1. **Closes Session 1 OPEN #5 — there is no shape-code mapping.** `shape` is a STRING, not a numeric code. Authoritative list, `tools/graph-tool-v22.html:875`:

   ```js
   var SHAPES=['ellipse','rect','rounded','diamond','hexagon','cylinder','barrel'];
   ```

   `'rounded'` is the tool's own default for new nodes (`makeNode`, line 3892). Any unrecognised value silently falls back to `ellipse` in `shapeHTML` (line 3186) — so `shape: 0` would have *loaded and rendered*, just as the wrong shape, with no error. Set all 23 nodes to `'rounded'`, preserving the original intent: one uniform placeholder meant "no shape distinction intended," not "four towns differ from their orgs." Making the town anchors `'hexagon'` is a reasonable later choice, but it is a new decision, not a fix.

2. **The only hard failure was missing edge `id`s** — Session 1's self-checks verified unique *node* ids and no dangling edges, but never checked that edges carried ids at all. Added `e1`–`e23`. Worth adding to the pre-flight list: *every edge needs its own string id*, not just valid src/tgt.

3. **`basis` DECISION: moved from a top-level edge field into `props.basis`.** Both survive a round-trip — the importer does `Object.assign({dash,note}, e, {...})` (line 4563) and `buildState` does `Object.assign({}, e, {props:…})` (line 4330), so *any* unknown top-level key is preserved. Round-tripping was never the question. The question is whether the field is **reachable**, and top-level `basis` is not:
   - `props` is the schema's designated extension bag, with real UI affordances — add/rename/reorder/delete per edge (`aEP`/`uEPK`/`moveEProp`/`rEP`, lines 4274–4315). A top-level `basis` has no editor; a human could never correct or add a citation without hand-editing JSON.
   - `props` is **searchable** — `renderEdge` (line 3233) matches the search term against prop keys and values. Provenance you cannot search is not auditable.
   - `props` is what the DOT / Cypher / CSV exporters carry out. A top-level field is dropped at every boundary.

   So the Session 1 proposal ("adopt `basis` into the schema") should be **withdrawn, not implemented**: the schema already has the right home for it and no tool change is needed. The generalisable rule for LLM pre-population: **provenance goes in `props`, never in a bare top-level key.** Same likely applies to the proposed `linkType` (OPEN, below).

4. **The confidence gap was real but inverted.** Session 1 flagged shape codes as the "known schema gap" and it was the *harmless* one — wrong shape, still renders. The unflagged assumption (edges don't need ids) was the one that failed. Recall correctly identified that it was uncertain; it did not identify *where* it was wrong. Argues for running the validator on every pre-populated artifact regardless of how confident the self-check was.

5. **VISUAL LOAD TEST PASSED — and found a bug the validator cannot see.** Served ~/rcn over `python3 -m http.server` and loaded the file into graph-tool-v22.html (the Chrome extension refuses `file://` URLs — use a local server for any future visual test). All 23 nodes and 23 edges paint; `props.basis` survives the full import→`buildState` round-trip on all 23 edges. But: **the entire `meta` block is silently dropped on export.** `buildState` (line 4330) emits exactly `version, modelName, modelNote, canvasBg, graphAttrs, cldLoopNames, legendEntries, legendVisible, customSymbols, nodes, edges, lines, metaEdges` — no `meta`. Title, description, schema version, created date, and author all vanish the first time anyone exports from the tool. Confirmed live: `metaSurvivesExport: false`, and the Model Name field read "Untitled".

   Fixed the same way as `basis` — by using the field the tool already has, not by proposing a schema change: added top-level `modelName` (from `meta.title`) and `modelNote` (description + schema version + created + author), both of which `buildState` preserves. `meta` is kept as well, since it is still useful in the source-of-truth file. Verified: reloading now populates Model Name and Note/Source, and both survive re-export.

   **This generalises the Session 1 provenance rule.** It is not just that provenance belongs in `props` — it is that *the tool's round-trip, not the validator, defines what is real*. The validator passed this file with 0 warnings while five fields of authorship metadata were set to evaporate. Pre-flight for LLM-populated artifacts needs both: validator for structure, `buildState` round-trip for survival.

6. **A validator per tool is the wrong shape for the fix — schemas are.** Marc's question: shouldn't every tool get a validator, so chat makes fewer mistakes? Three things argue for schema references first.
   - **Validators encode yesterday's failures.** Ours passed this file with 0 warnings while `meta` evaporated (LEARNED #5). It can only catch what someone already got wrong.
   - **They drift silently.** The June validator knew 34 node/edge fields; the tool had since added `opmType`, `tripleId`, `opmMarker`, `graphAttrs`, `legendEntries`, `customSymbols`, `modelName`, `modelNote`. Twelve hand-written validators would be twelve artifacts each quietly wrong within a month — and chat would trust all of them.
   - **A schema prevents; a validator only detects.** If chat has the schema, most of what a validator catches never gets generated. Also correcting a premise: chat-Claude is not *barred* from the tool code. It has no live filesystem access, but the code can be uploaded, put in a Project's knowledge, or wrapped in a Skill. The gap was never a hard limitation — nobody had handed it the reference. So: `tools/schemas/*.md` first, one *generic* validator driven by them later, and a round-trip diff as the check that catches the `meta` class.

7. **Writing the schemas found two more silent-loss bugs**, both the same shape as the `meta` drop — structurally valid, no error, data gone:
   - **Issue Polygon Map: the issue polygon does not survive its own export.** `exportData` writes `type:"IssuePolygon"` (line 1021); `loadFromGeoJSON` handles only `Parcel` and `CustomIssuePolygon` (line 1126), and `ISSUE.polygon` is never assigned on import. Export, re-import, and the boundary that *defines the issue* is gone. Parcels come back, so it looks like it worked.
   - **Timeline: `rel` supports two relations, not thirteen.** `solve()` tests `rel==="meets"` and treats everything else as `before`. `"overlaps"`, `"during"`, `"equals"` are accepted silently and behave as `before`. The trap is the *label*: notes and memory describe the tool as using "Allen relations", which is true of its design intent and false of its implementation. A Claude that reads the phrase and reaches for the canonical thirteen will emit relations the tool misreads without complaint. Fixed the memory entry to name the two. Both are now documented in the schema files. Neither is fixed.

8. **Three for three.** Every tool examined closely this session had a silent round-trip loss. That is no longer a coincidence to note — it is the expected defect for this family of single-file HTML tools, where export is hand-written per tool and nothing tests that import is its inverse. Assume it is present in any tool not yet checked.

9. **The validator lives outside the repo.** It is the ground truth for the chat-Claude → Claude Code handoff (Session 1 LEARNED #7) but currently survives only as duplicate downloads. Should move into ~/rcn/tools and be committed before the `rcn-tools` skill is drafted around it.

### OPEN
- [x] Validator verdict on the v22 JSON — PASSES, 0 warnings, after fixes above
- [x] Visual load test in graph-tool-v22.html — PASSED, 23/23 nodes and edges paint; surfaced the dropped-`meta` bug (LEARNED #5)
- [ ] **Layout is the weak point, not the data.** Edge labels overlap each other and run across node boxes; several are clipped off the top of the canvas (the Crowley cluster's "downtown revitalization" and "public-private partnership"). The four town clusters read clearly, but the inter-cluster edges do not. Try Dagre LR or Force from the LAYOUT row, or shorten the edge labels and move the detail into `props`. Deliberately left as-is — re-laying out is a design decision, not a fix.
- [x] Extend the validator to check round-trip survival, not just structure — done: warns on any top-level key `buildState` does not emit, names the `meta` fix, flags numeric `shape`, and `--fix` migrates meta
- [ ] Fix the Issue Polygon Map import gap (LEARNED #7) — `loadFromGeoJSON` should handle `type:"IssuePolygon"`, or export should stop writing a feature nothing reads
- [x] Decide whether the Timeline should support more Allen relations — **answered 2026-08-05: partly.** Step one shipped: five definite relations (`before`, `meets`, `overlaps`, `during`, `equals`), which kills the long-running-state trap. Direction does the work of Allen's six inverses, so five stored relations cover seven named ones; `starts` and `finishes` are the two left out. Solver invariant preserved: it translates, never resizes, so authored dates survive. `node tools/test-timeline-solver.js`.
- [ ] **STEP TWO PENDING** — relation *sets* + Allen's composition table, so a link can hold `{before, meets}` and two people's partial knowledge intersects into something tighter than either had. That is the formal version of "accuracy is a group activity" and the actual prize in Allen. Deliberately deferred: full consistency is NP-complete, path consistency is incomplete, and it collides with the dual-face design (dragging asserts one definite arrangement and would collapse the set). Full write-up in the `project_timeline_allen_step_two` memory and in the tool's header comment.
- [ ] Check the remaining JSON-consuming tools for the same round-trip loss (LEARNED #8): NRM, IBIS, Wardley, e-VSM, MORE Outliner
- [ ] Generic schema-driven validator to replace per-tool scripts; wrap `tools/schemas/` in the `rcn-tools` skill
- [x] Move `validate-rcn-graph.js` into ~/rcn/tools and commit it — now `tools/validate-rcn-graph.js` (md5 `26077f17…`). The three byte-identical ~/Downloads copies were deleted afterwards — the repo is now the single reference copy.
- [ ] Extend the validator: flag `basis`/provenance sitting at top level on an edge, and warn on shape values that are numbers (the `shape: 0` case currently only warns as "unknown")
- [ ] `linkType` proposal (Session 1 LEARNED #4) — re-examine as `props.linkType` before asking for a schema change; check whether CLD loop detection can be made to respect it
- [ ] Decide whether town anchors should be visually distinct (`hexagon`)

---

## 2026-07-25 — Session 1: Southern Louisiana pilot

### DID
- Web research on four towns: Crowley, New Iberia (West End), Jeanerette, Kinder.
- Produced the four-stage teaching gradient: SEEDS (Crowley) / STRUCTURE (New Iberia) / NECESSITY (Jeanerette) / SOVEREIGNTY & RHYTHM (Kinder + Coushatta).
- Pre-populated first artifact: `southern-louisiana-actor-map-v22.json` (23 nodes, 23 edges, 1 loop) targeting Graph Tool v22 schema.
- Ran structural self-checks (unique ids, no dangling edges, valid polarity, numeric w/h/shape, lexically sorted cldLoopNames key). All passed.
- Status: awaiting verdict from validate-rcn-graph.js and visual load test.

### LEARNED
1. **Predetermined context does three jobs**: SELECT (which instrument fits the data), CONFORM (schema facts make output loadable, not approximate), and SEQUENCE (which tools need no one's consent vs. which need a relationship first). All three must be in a future skill/context package.
2. **Research→tool fit**: web research naturally yields an ACTOR map (orgs, relations, provenance), not a causal map. Graph Tool was the right first instrument; CLD would have forced invented causality.
3. **Provenance is non-negotiable for LLM-populated data.** Added a `basis` field to every edge citing the public source. Proposal: adopt `basis` (or `source`) into the schema so human-entered and LLM-entered claims are distinguishable and auditable.
4. **Live argument for v23 fields**: SMHA→WECNA "dissolving scaffold" and the Jeanerette receivership edge are structural/historical relations that should be excluded from loop detection → supports proposed `linkType` field.
5. **Known schema gap**: shape-code mapping unknown to Claude; used shape: 0 placeholder. ACTION: record the real shape codes in this log / future skill.
6. **Tool-selection sequencing that emerged** (reusable heuristic):
   - No-consent-needed first: Graph Tool, EIP sketch, FedWiki pages, RCN Map layer.
   - First-contact instrument: Six Questions/Six Contexts.
   - Relationship-gated: e-VSM Survey, CAM field test, Vester, SODOTO, CfA-dSC.
7. **Architecture clarification (important)**: chat-Claude has NO live access to ~/rcn. Its schema knowledge is *memory of past conversations* — accurate but recall, not reference. Consequences: (a) validator round-trips are the ground truth, not Claude's confidence; (b) the future rcn-tools skill should contain the authoritative schema so no Claude needs to rely on recall; (c) Claude Code running on Marc's own machines (MacBook Air / Mac Mini) DOES have real ~/rcn access — a natural division of labor: chat-Claude researches and pre-populates, Claude Code validates, integrates, and commits.
8. **Provenance applies to the conversation, not just the data.** Session 1's two confusions (Claude asserting the rcn folder was on the Mac Mini; Marc inferring Claude had live access to ~/rcn) shared one root: memory detailed enough to be mistaken for something else. Rule going forward — distinguish REMEMBERED / OBSERVED / INFERRED in claims about Marc's environment, exactly as the `basis` field distinguishes sources in graph edges. Predetermined context's failure mode is confident claims with invisible provenance.
9. **Environment correction (2026-07-25)**: The Mac Mini is NOT in use — not now, not in the foreseeable future. All work happens on the MacBook Air. Treat any remembered Mac Mini references (production server, Caddy, FedWiki hosting) as historical until Marc says otherwise.
10. **Research quality note**: town-level civic activity is discoverable via local press, chamber calendars, LLA audit reports, nonprofit registries, Facebook org pages, cultural district resolutions. State auditor documents (LLA) were the key source for institutional-failure detection (Jeanerette).

### OPEN
- [ ] Validator verdict on the v22 JSON (does `basis` survive? shape codes?)
- [ ] EIP four-column one-pager from same research (next pre-population rung)
- [ ] FedWiki page set for the Louisiana neighborhood (forkable for NDC leads)
- [ ] Four new places in PostGIS /places layer (TIGER boundaries)
- [ ] Draft `rcn-tools` skill: schemas + instrument-selection logic + this session as worked example
- [ ] Far rung: artifact app (Claude-in-Claude) — Six Questions form → valid Graph Tool JSON for any town
- [ ] Candidate outreach: Audry Spencer (ETCFE, Crowley), WECNA/Lorna Bourg (New Iberia), Ward 4 org (Jeanerette), Coushatta Heritage Dept (learn from, not credential), Allen Parish Community Healthcare (WWHA resonance)

---
