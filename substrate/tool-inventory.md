# RCN tool inventory — the schema coverage checklist

Working file. Marc + Claude Code, started 2026-07-28.

**Purpose.** Before designing the substrate schema, list every tool RCN has built
or discussed, and record *what each one demands of the schema*. Then the schema
can be checked against the list: does it **cover** this, is it **modified** to
cover it, or does it at least stay **open** to covering it later?

**How to use.** When a schema decision is proposed, walk the Layer Demands table
(§4) and mark it. A decision that closes off a row without saying so is the
failure mode this file exists to prevent. Update the changelog (§6) each session.

Status vocabulary used throughout:

| Mark | Meaning |
|---|---|
| **COVERED** | The current schema design carries this today |
| **PLANNED** | Agreed it goes in; not yet built |
| **OPEN** | Real demand, no decision yet — must not be accidentally closed off |
| **SEPARATE** | Deliberately not in this substrate |
| **LEGACY** | Exists, not a target for substrate integration |

Entries marked *(inferred)* were read from filenames and titles only — confirm
with Marc before relying on them.

---

## 1. Decisions locked so far

1. **Mode lives in the substrate**, not only in the lens. A graph declares its
   grammar (CLD / EIP / NRM / OPM / SFD / IBIS / Wardley / CfA…), because the
   node type vocabularies genuinely differ — a stock is not an EIP family.
   Rationale: avoids repeating the Composer generality gap one layer down.
2. **Patient health information gets a separate substrate with the same shape.**
   SCP and Epic FHIR data live in their own database, same node/edge/layer
   design, with federation and gold-node merging switched off. A cross-patient
   merge becomes structurally impossible rather than policy-forbidden.
3. **The harness provenance pane becomes data-driven** so the n=6 acceptance
   test can actually fail. See `substrate/` build notes.
4. **n=6 reference graph lives in the default `neo4j` database.** The Stage 2
   composite gets its own database later. Enterprise edition (5.26.4, Desktop)
   makes this free.
5. **Four levels = Option C.** family/schema/variable are vocabulary and live as
   fields on `:Concept`; an instance is a thing that happened and gets its own
   node, carrying the geometry and time a vocabulary level cannot hold.
6. **MORE does not belong in the substrate.** It stays a file tool. Removes the
   only demand for ordered relationships.
7. **Meta-edges resolve by lookup, not traversal.** `(:MetaEdge {tgtEdgeId})`
   referencing the edge by id. No universal reification.
8. **Relation families are declared, not drawn.** `tools/edge-families.js` is the
   one source; the substrate holds a generated copy. Local edge styling always
   wins — declaring a family changes no colour, width or dash.

---

## 2. Environment as verified 2026-07-28

- Neo4j **5.26.4 Enterprise**, Neo4j Desktop 1.6.1, bolt `localhost:7687`,
  HTTP `localhost:7474`. Server name "RCN SCHEMA".
- Databases: `neo4j` (default, empty at time of writing) and `system`. No APOC.
- Credentials in `~/rcn/.env.neo4j` (mode 600, gitignored).
- Claude Code has full admin over HTTP and does not need Marc to run queries.
  It **cannot** start or stop the DBMS — if queries fail, check Desktop first.

---

## 3. The inventory

### 3a. Graph-shaped — nodes and edges

| Tool | What it is | Demands of the schema |
|---|---|---|
| `tools/graph-tool-v22.html` | The main diagram tool. Five modes, each a distinct grammar | Mode; per-mode node/edge type vocabularies; polarity; layers; trace paths; icons |
| — mode **CLD** | Causal loop diagrams | `polarity` +/−/none; loop detection |
| — mode **EIP** | Variabilized aspect graphs. 8 families in the real data: `fam_doing, fam_aim, fam_person, fam_setting, fam_institution, fam_resource, fam_outcome, fam_issue` | Family vocabulary; variabilized labels |
| — mode **NRM** | Neighborhood Risk Management, Tripod Beta | Tripod node types; `ndc_id` → `place_geo` link |
| — mode **OPM** | Object-Process Methodology | Objects vs processes; **9 typed link types**; OPL sentences; in-zooming |
| — mode **SFD** | Stock & flow, Stella approach | Stock/valve/aux/cloud types; flow pipes; rates; lookup tables; XMILE |
| `tools/graph-composer.html` | Composes graphs from `families.js` + `graph-sets.js` | **Four levels: family / schema / variable / instance** |
| `tools/ibis-map-rcn.html` | IBIS argument map | Issue / position / argument; supports & objects-to edges |
| `tools/wardley-map-generator.html` | Wardley maps | Value chain position × evolution axis (2 continuous coords with meaning) |
| `tools/sfd-stella-approach.html` | Stock & flow | As SFD above |
| `tools/cfa-dsc-creator.html` | Conversation for Action → digital smart contract | CfA speech-act states (request/promise/assert/declare); commitment lifecycle |
| `tools/eip_integration_explorer.html` | EIP explorer | EIP vocabulary |
| `tools/eip_local_finance_diagram.html` | EIP local finance | EIP vocabulary |
| `tools/conversation-navigator-flow.html` | Conversation flow *(inferred)* | Flow/sequence |
| `tools/graphjson_to_vensim_cld.html` | Exporter, graph JSON → Vensim | Read-only consumer of CLD layer |
| `tools/create-rcn-graph-tool-page.html` | FedWiki page generator for graphs | Federation/publishing |
| `wiki-plugin-rcn-graph` | FedWiki plugin rendering graphs | Federation; Frame postMessage |
| `Network Graph HTML files/` ×12 | Early experiments — **LEGACY** | none |

### 3b. Temporal

| Tool | What it is | Demands |
|---|---|---|
| `tools/rcn-timeline.html` | Temporal layer, sibling to graph + map | **Intervals with fuzzy start/end**; only two relations (before, meets) — *not* the 13 Allen relations; dates as `Mon D YYYY`; links use `from`/`to` not `src`/`tgt` |

### 3c. Spatial

| Tool | What it is | Demands |
|---|---|---|
| `maps/rcn_map.html` + `rcn_static_data.js` | The live RCN/NDC map. Deploys as two files in one flat FedWiki asset folder | Point geometry; NDC identity; layers |
| `maps/regions.json` | Region definitions | Region containment |
| `tools/issue-polygon-map.html` | Editable parcels, GeoJSON export, deep links | **Polygon geometry**; named/renamable polygons; issue↔place binding |
| `tools/issue-data/` | Issue records bound to places | Issue identity; `issue-index.json` |
| `maps/rcn-region-federation.*`, `rcn-region-forking.*` | Specs + graphs for how regions federate and fork | Federation topology; forking semantics |

### 3d. Quantitative / matrix

| Tool | What it is | Demands |
|---|---|---|
| `vester/` (SensiMod) | Vester sensitivity model. React/Vite app | **Magnitude 0–3**; active-sum / passive-sum computed; 3-groups-of-3 impact matrix |
| `tools/evsm-aggregator.html`, `evsm-report.html`, `evsm-svg-v3.html`, `evsm_excel_tool.html` | Enterprise value stream mapping | **Flow quantities** — cycle times, rates; survey aggregation |
| `tools/bias-checker.html` (+ intro/manual) | Bias checking. Hosted at Wiki Café; Firebase for DB only | Response records; not obviously graph-shaped *(inferred)* |

### 3e. Person / health record — **SEPARATE SUBSTRATE**

| Tool | What it is | Demands |
|---|---|---|
| `scp/plugins/` — **19 typed FedWiki plugins** | SCP 2.0. `about, access, agent, diagnosis, directive, factory, field, goal, history, lab, medication, next-step, polst, provider, reaction, symptom, visit, vital, wishes` | Typed person-record items; commit+fold; search via `item.text`; access control |
| `tools/my-health-picture.html` | PHS — My Health Picture | Person record view |
| `tools/my-health-choices.html` | PHS — My Health Choices | Decision records |
| `tools/my-support-network.html` | PHS — My Support Network | Person↔person relationships |
| `scp-optionbox/` | Option box / decision aid. `optionbox-schema.json` | Choice sets with evidence |
| `scp-coupler/` | Problem-Knowledge Coupler. `coupler-proxy.py` :8766 | Problem↔knowledge linking |
| `scp-fhir/` | Epic FHIR connector. `smart-proxy.py` :8767, PeaceHealth production | FHIR resource mapping |
| `tools/patient-admin.html`, `tools/scp-chat.html` | Admin + chat surfaces | — |
| `tools/pomr-*.json` ×5 | Problem-Oriented Medical Record CLDs (graph JSON) | These are **graphs about** care, not patient data — belong in the main substrate |

### 3f. Credential / identity / trust

| Tool | What it is | Demands |
|---|---|---|
| `tools/sodoto-issuer.html` + `sodoto/plugins/wiki-plugin-sodoto-badge` | SODOTO — See One, Do One, Teach One. Badge upsert | Verifiable credentials; badge chains; **signing is the user's job, never programmatic** |
| `veramo/` | DIDs, keys, credentials, people | DID identity; VC issuance |
| `tools/sodoto-crypto-test.html` | Crypto test harness | — |
| `tools/contract-creator.html` | Contract creation | Commitment/obligation records |
| `sofi-proxy.py` | SODOTO proxy :8765, badge upsert + wiki write | Infrastructure |

### 3g. Text / deliberation / narrative

| Tool | What it is | Demands |
|---|---|---|
| `tools/more-outliner.html` + `wiki-plugin-rcn-outliner` | MORE-style outliner, npm v0.2.0 | **Tree / containment** — parent-child nesting |
| `groove-workspace/` | Groove workspace, port 3001. `groove-workflow.json` | Workflow states; deliberation |
| `tools/conversation_index.html` | LLM Session Index | Session/provenance records |
| `tools/session-builder (1).html` | Session Instruction Builder | — |
| `tools/checklist-test.html` | Checklist layout test — **LEGACY** | — |

### 3h. Reference vocabularies and seed data

| File | What it is | Demands |
|---|---|---|
| `tools/families.js` | Family vocabulary the Composer reads | Family taxonomy — `.js` not `.json`, for `file://` |
| `tools/graph-sets.js` | One-click graph sets | Graph collection identity |
| `tools/rcn-icons.js` + `rcn-icon-sheet.html` | **The icon vocabulary.** Cave Drawings: meaning = icon + border colour + edge style | Node → icon binding |
| `tools/eip-schema-cld.json` | The signed EIP CLD — 26 nodes, 57 edges | The Stage 2 target |
| `tools/eip-aspects/`, `eip-aspects-variabilized/` | 16 aspect subgraphs each | Subgraph → composite merge |
| `tools/eip-cld-subgraph-mismatches.md` | 23 open Marc+Kerry decisions blocking the composite | Not code work |
| `tools/bgte-12-triples.json` | 12 triples, graph JSON | *(inferred)* |
| `tools/neighborhood-cave-drawing.json` | "A Resident and the Two Systems Around Them", 10 nodes | The Cave Drawings exemplar |
| `tools/education-human-becoming-cld.json` | CLD | — |
| `tools/schemas/*.md` | Written schemas for chat-Claude: graph-tool-v22, rcn-timeline, issue-polygon-map, ward-graph | **Assume every single-file tool has a silent round-trip loss** |

### 3i. Infrastructure (not schema targets, but constrain deployment)

FedWiki (`deploy/`, Caddy, plists) · `data/rcn_api.py` · Superior AZ loaders ·
`fedwiki-page/scripts/` importer bundles · Wiki Café hosting

---

## 4. Layer demands — the coverage table

This is the checklist. Rows 1–6 are what the original brief covered.

| # | Layer | Demanded by | Status |
|---|---|---|---|
| 1 | **Identity** — schema label, the merge key | everything | COVERED |
| 2 | **Name** — variabilized human label | EIP, all views | COVERED |
| 3 | **Polarity** +/− | CLD, EIP | COVERED |
| 4 | **Magnitude** 0–3 | Vester / SensiMod | COVERED |
| 5 | **Timing** | timeline | COVERED — `rel` on edges, intervals on `:Instance` |
| 6 | **Provenance** — `sources` as a list | federation, gold nodes | COVERED |
| 7 | **Mode** — which grammar this graph speaks | all 5 graph modes + IBIS + Wardley + CfA | COVERED — property on nodes and edges |
| 8 | **Four levels** — family / schema / variable / instance | Composer; Superior AZ real instances | COVERED — Option C |
| 9 | **Containment / hierarchy** | ~~MORE tree~~, OPM in-zoom, regions | **CLOSED** — see below |
| 10 | **Geometry** — points and polygons | rcn_map, issue-polygon-map, NRM `ndc_id` | **partial** — lat/lng on `:Instance`; polygons still open |
| 11 | **Intervals with fuzzy dates** | rcn-timeline | COVERED — on `:Instance` |
| 12 | **Typed edge vocabularies** | OPM ×10, IBIS, SFD flows, CfA speech acts | OPEN — see `edge-families-proposal.md` |
| 13 | **Flow quantities** — rates, cycle times | SFD, eVSM | OPEN |
| 14 | **Icon binding** | Cave Drawings, `rcn-icons.js` | OPEN |
| 15 | **Layers + trace paths** | graph-tool-v22 | OPEN |
| 16 | **Credentials / signatures** | SODOTO, veramo | OPEN |
| 17 | **Access control** | SCP | SEPARATE substrate |

### Row 9 resolved — it was four problems, not one

Investigating what actually nests found four different structures wearing one
name. Three needed nothing; the fourth got a decision.

| Sub-problem | Resolution |
|---|---|
| **part-of as meaning** ("Main St is part of downtown") | The **Composition** family in `edge-families.js`. Transitive, and one of the two candidates for a genuinely typed Neo4j relationship. No new schema |
| **ordered trees** (MORE — `children[]`, and `cloneId` ×36) | **Marc 2026-07-28: MORE does not belong in the substrate.** It stays a file tool. This was the only demand for ordered relationships, which Neo4j does not have natively — so no `ord` property is needed |
| **federation by reference** (`regions.json`) | Not containment at all — a flat list of `{region, steward, url}` pointing at other documents. It is a *boundary*: which database, which steward. Modelling a region as a parent node would have made cross-region queries strange for no gain |
| **reification** (graph-tool's `metaEdges` — `tgt` is a `tripleId`, a claim about a claim) | **Marc 2026-07-28: lookup, not traversal.** A `(:MetaEdge {tgtEdgeId})` node referencing the edge by its `id`, matching what graph-tool already does. True reification would promote every edge to a node — doubling the graph, destroying the uniform single-MATCH all five projections depend on, and making the n=6 eyeball test unreadable. The cost is that a meta-claim reaches its edge by lookup rather than by hop |

Note graph-tool has essentially **no** data containment today: `n.parent` appears
5 times against 10 uses of DOM `parentNode`, `layer` is a flat named string, and
there is no in-zoom code. OPM in-zooming exists in the standard, not the tool.

### The remaining rows that need a decision before building

**Row 8 — four levels.** The brief's `schemaLabel` + `name` covers two of the
four. Without the other two there is no way to say "the chicken ordinance in
Superior AZ" *is an instance of* "Seriousness of PROBLEM." That is the join
between the EIP schema and real neighborhoods — arguably the whole point.

**Row 9 — containment.** A flat node/edge model has no parent. Four separate
tools already nest.

**Row 12 — typed edges.** Generic `:REL` with a `label` string keeps every
projection to one MATCH pattern, which is why the brief chose it. But it throws
away OPM's 9-link grammar and IBIS's argument structure. The compromise is
probably a `linkType` property on `:REL` rather than typed relationships — keeps
the uniform MATCH, keeps the grammar.

---

## 5. Open questions for Marc

1. **Row 8** — how do the Composer's four levels map onto the graph? Separate
   nodes joined by an `INSTANCE_OF` edge, or properties on one node?
2. **Row 12** — `linkType` property, or genuinely typed Neo4j relationships?
3. Does **Wardley** belong in the substrate at all, or is it a standalone lens?
4. Is **bias-checker** graph-shaped, or a survey instrument that only feeds the
   graph aggregates?
5. Which of the 45+ tools are **live and cared about** vs. parked? This list is
   exhaustive, not prioritised — the schema should not pay a cost for something
   abandoned.
6. **Write-back**: read-only substrate is a nicer file loader. When does
   write-back land, and does it change the schema now?

---

## 6. Changelog

- **2026-07-28** — Created. Inventory of 45+ tools taken from `~/rcn` filesystem
  scan plus prior sessions. Environment verified against live Neo4j. Decisions
  1–4 recorded. Layer table established; 11 of 17 rows OPEN.
- **2026-07-28** — Four levels resolved as **Option C** (decision 5): vocabulary
  levels are fields on `:Concept`, instance is its own node. Stage 0 built and
  loaded — `substrate/seed.py`, 8 families + 6 concepts + 7 edges + 2 instances.
  Rows 5, 7, 8, 11 now COVERED; row 10 partial (points yes, polygons no).
  Six rows remain OPEN: 9, 10, 12, 13, 14, 15, 16.
- **2026-07-28** — Row 9 (containment) **CLOSED**. Split into four structures;
  Marc ruled MORE out of the substrate (removing the only ordered-tree demand)
  and chose lookup over traversal for meta-edges. Decisions 6 and 7.
  `tool-status-checklist.md` created for the live-vs-parked pass.
- **2026-07-28** — Edge vocabulary corpus harvested: **202 distinct labels across
  375 edges, 115 used exactly once**, with `create`/`creates`,
  `support`/`supports`/`Supports`, `constitute`/`constitutes` already drifting.
  Proposal written: `substrate/edge-families-proposal.md` — seven relation
  families encoded on the ARROWHEAD (not hue, which `families.js` already owns).
  Not built; awaiting the Cave Drawing read-test.
