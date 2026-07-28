# RCN — ReLocalize Creativity Network
## Project orientation for Claude Code sessions

**Read this first. It replaces the need to re-explain the project each session.**

---

## Who and what

Marc Pierson, co-founder of the ReLocalize Creativity Network (RCN), Bellingham WA.
Core collaborators: Kerry Turner (RCN co-founder), Robin Asby (systems/Metaphorum),
Chris Casillas (Superior AZ), Jerry (Lansing MI), Carl (Whatcom County).

The project: neighborhood-scale community development using systems thinking,
cooperative economics, and civic infrastructure. The "one million neighborhoods" vision —
viable, humane governance designed to scale to every neighborhood on earth.

NDCs (Neighborhood Development Cooperatives) are the atomic unit.

---

## Intellectual stack (operating frameworks, not references)

- **Christopher Alexander** — patterns, aliveness, beauty as real test
- **Stafford Beer / VSM** — recursive governance, requisite variety
- **Donella Meadows** — leverage points (extended by Marc to include time and place)
- **Elinor Ostrom** — polycentric governance, commons design
- **Fernando Flores** — speech acts, commitment-based coordination
- **Vester** — sensitivity model, biokybernetik
- **Ward Cunningham** — FedWiki as living pattern repository
- **Dov Dori** — OPM (Object Process Methodology)

---

## Directory structure

```
~/rcn/
  tools/      standalone HTML tools (see below)
  maps/       rcn_map.html — NDC map (the live page); rcn_static_data.js — baseline data (loaded by flat name from same folder); build_standalone_map.py → rcn_map_standalone.html — single-file handout (data+issues inlined; NOT the live site); rcn-map-intro.html, rcn-map-manual.html — docs; rcn-ndc-map.pptx — deck; rcn-map-components.graph.json — component graph; rcn-region-federation-spec.md (+ .graph.json/.svg) — region federation
  data/       PostGIS Python load scripts
  docs/       tool documentation (nrm-tripod-beta.md, vester-manual.html, sodoto-manual.html)
  deploy/     deployment artifacts — docker/ (SODOTO Docker package, handed to Wiki Café), scp/ (SCP+Groove Docker package, hosted/WikiCafe track), home/ (SCP 3.0 personal-computer stack), fedwiki-personal/ (bare personal FedWiki, no SCP parts), launchd plists, handoff-sodoto.md
  vester/     Vester Influence Analysis — Vite/React app (the only tool with a build step); also Vester chapter notes
  archive/    old numbered drafts
  veramo/     SODOTO credential infrastructure (see SODOTO section below)
  scp/        Shared Care Plan: plugins/ (19 wiki-plugin-scp-* repos), pages/ (17 canonical page templates)
  scp-coupler/ standalone My Health Picture tool + experiment integration files (data/people.json = patient registry with wiki_site)
  scp-optionbox/ My Health Choices decision support (port 8770)
  coupler-proxy.py  My Health Picture AI proxy (port 8766) — per-patient wiki routing
  database.rules.json   Firebase Realtime DB security rules (scoped to sessions/ and topics/ paths)
  SODOTO-CLAUDE-CODE-CONTEXT.md   full SODOTO onboarding doc (authoritative)
```

---

## Tools (`~/rcn/tools/`)

**Trace → Timeline.** The Graph Tool and the Timeline are meant to be used in
sequence, and this is expected to be the common path: **see and discuss the
logic, then see and discuss the effects across time.** A trace in the Graph Tool
(edges tagged `T1`–`T4`) is already a partial order — its animation says *this,
then this*, at a fixed millisecond speed that makes a week and four years look
identical. Carrying the same trace into the Timeline gives it dates, durations,
gaps, and confidence. Two edges drawn identically on the graph turn out to be
one welded to its cause and one trailing it by `slack 2 yr 2 mo`, which is a
different claim entirely. **Trace mode has a "Send trace to Timeline" row (⏳ T1–T4)** that does the
conversion and opens it: node → interval (keeping the graph's node id), trace
edge → `before` link. Intervals arrive as one-year placeholders at `conf` 0.3
with an empty `who` — the dates are nobody's yet; the links carry a real `who`
and `conf` 0.8, because the order *is* attributed. See
`schemas/graph-tool-v22.md` §"A trace is a partial order" and the worked pair
`eip-schema-cld.json` T1 → `t1-trace-timeline-demo.json`.

| File | Purpose | Status |
|------|---------|--------|
| `graph-tool-v22.html` | CLD/EIP/NRM/OPM/Trace/Wardley/Triples graph diagramming, MDL/.dot/XMILE/Cypher/Wardley JSON I/O, multi-trace edges, reifiable triples with meta-edges, canvas legend, node+edge layers, Force/Grid/Dagre/Untangle layouts (Untangle = swap-based edge-crossing reduction, cyclic-safe, one-Undo), Vester custom symbols, Print; canvas hint strip advertising the gestures (dbl-click = edit, click+hold = highlight a node's edges, alt+drag = pan, ctrl/pinch+scroll = zoom); SVG download injects `<title>` into each node/edge group so browsers show note + props on hover (no JS required); exported SVG is clean and embeddable — `buildExportSVG()` strips the live canvas's `id` and inline mouse handlers and sets a `viewBox`, so two exports can sit in one page without colliding; **→ Wiki** button sends enriched SVG ghost page to FedWiki lineup (node labels become clickable internal links — multi-line labels get correct space-separated titles); **legend-as-registry** — legend rows DEFINE styles and nodes/edges point at them via `node.legend`/`edge.type` with per-element `ovr` overrides, legend renders inside the SVG so it survives PNG/SVG export (it used to be an HTML div and vanished); **icon nodes** — `node.icon` draws a glyph from the `rcn-icons.js` house library, caption below, white fill + coloured border (the Vera-chart pattern); **`_`-prefixed props are display-only** — shown on hover, never exported to Cypher, following Arrows' throwaway caption; `note` is display-only too; Arrows import now puts labels in `extraLabels` instead of a junk `props._labels` string; unknown node/edge fields (e.g. `schemaLabel`, used by the Composer) survive a load/save round trip untouched; **Routes** — select two nodes and get the count of simple directed routes between them, broken down by step count, with the reverse direction `B → A` below a divider (bounded DFS, cap 50k; all 650 ordered pairs of the 26-node EIP CLD in 39ms); **?± Gaps** — view-only toggle flagging every edge whose polarity is still unset with an amber `?`, because CLD mode counts those as neutral *silently* and greys out real loops; **polarity is not CLD-only** — it always drew in the base diagram, the panel heading just said "CLD — Polarity" and made it look otherwise; **clear a whole trace** (✕ T1–T4) strips one trace from every edge regardless of selection, unlike the selection-scoped ∅; **legend collapse chevron built into the legend's own SVG** — collapses to a `LEGEND (n)` bar pinned to the same corner, `legendCollapsed` persists in the JSON; **edge direction is no longer silently mutable** — `Rev.all` confirms with the edge count, Alt+drag pans over edges instead of reversing whatever is under the 20px hit band, and the Alt arrow-cycle round-trips so the no-arrowhead state holds the authored `src`/`tgt` | **Active** |
| `graph-composer.html` | **RCN Graph Composer** — assembles many small subgraphs into one graph, merging nodes that appear in more than one. Beam (checkbox list of loaded subgraphs), one-click **graph sets** from `graph-sets.js`, Composite, Bridge (which unselected piece would *connect* two selected), Partition (split into connected components), graded shared-node highlighting that accumulates as you tick, **Open in Graph Tool ↗** converts to Graph Tool native JSON and hands it over via `#graph=` with the Graphviz layout preserved (coordinates read back out of the rendered SVG — Ward's format has no geometry); exports: Graph Tool JSON (default), Ward JSON, DOT, all carrying the chosen canvas colour. **Detail = four nested levels** — `family` → `schemaLabel` → `label` → `props.name`, each key extending the last, so a coarser view is a genuine *contraction* of a finer one and switching level **re-composites** rather than relabelling (16 EIP aspects → 8 / 24 / 25 / 25 nodes). Polarity is dropped at family and schema level and parallel edges fold there, because a bare concept has no magnitude — only a variable *of* it does. **One meaning per visual channel**: node fill = family as a pale tint (black text always, worst contrast 12.7:1), ring colour = the same family at full strength (the channel that actually separates eight of them), ring width = merge depth, `+`/`−` **glyph at the arrowhead** = polarity with red for negative, heavy dotted = unsigned (*not* a claim of positive) thinning to normal once signed. Reciprocal pairs draw as two edges, never folded to one `dir=both` line that discards the reverse verb. **Click a node = details; click-and-hold = highlight its neighbourhood** — incident edges thicken, everything else dims to 10%; listens on *pointer* events, since svg-pan-zoom's `preventDefault()` on `pointerdown` suppresses `mousedown` entirely over the canvas. User-settable canvas colour with edge ink following it. `"?"`/`""`/absent all mean UNNAMED. Reimplements Ward Cunningham's Solo Super Collaborator — see `schemas/ward-graph.md` | **Active** |
| `graph-composer-intro.html` | Graph Composer — Introduction & positioning | Docs |
| `graph-composer-manual.html` | Graph Composer — User Manual | Docs |
| `rcn-graph-composer-intro.pptx` | Graph Composer — deck (14 slides) | Docs |
| `families.js` | **The supracategorisation** — every schemaLabel to one of 8 families (Setting, Institution, Aim, Doing, Outcome, Issue, Resource, Person), each carrying the note arguing its assignment. Family is the only property invariant under the Composer's detail zoom, which is why colour is keyed to it. Paired ramps: saturated `color` for the ring, pale `fill` for the node. Okabe-Ito with black→violet and yellow→maroon, validated all-pairs on `#f5f4f1` — normal-vision floor 15.6, CVD worst 6.9. **Not an EIP construct**; worked out against EIP but meant to travel | **Active** |
| `graph-sets.js` | Named sets of subgraphs the Composer loads in one click. HTTP cannot list a directory, so this is the one place to register a new subgraph | **Active** |
| `eip-aspects/*.json` | The 16 curated EIP subgraphs (Action, Affect, Asset, Commitment, Conversation, Culture, Function Objective, Motivation, Org, Person, Place, Power, Problem, Purpose, Role, Solution). Bare one-word labels; compose to the 24-node skeleton. The worked example for the Composer | **Active** |
| `eip-aspects-variabilized/*.json` | The same 16 with humanised **variable** labels (`Action` → `Effectiveness of ACTION`) and the CLD's signs ported in. Affect is split into Positive/Negative under one schemaLabel — the first concept carrying two variables. Composes to 8 / 24 / 25 / 25 across the four detail levels | **Active** |
| `eip-schema-cld.json` | EIP schema as one graph — 26 nodes, **57 fully signed edges** (54 `+`, 3 `−`), 8 families, Neo4j labels in `extraLabels`, field templates in `props`, display-only `_gloss`/`_family` on every node. The repo carried an unsigned pre-signing snapshot until July 2026. Read by people, **not** by the Composer | **Active** |
| `eip-cld-subgraph-mismatches.md` | The 31 edges where the CLD and the aspect subgraphs disagree, sorted into 9 direction disagreements (4 with the identical verb), 7 subgraph-only and 7 CLD-only. For Marc + Kerry; nothing guessed at | Open |
| `rcn-icons.js` | **RCN house icon library** — 49 neighborhood-focused icons in 8 categories (People, Place, Institution, Resource, Care, Harm, Process, System). Sidecar file loaded beside a tool, same pattern as `rcn_static_data.js`. 24×24, `currentColor`, drawing rules in the header | **Active** |
| `rcn-icon-sheet.html` | Icon library contact sheet — Vera-style node preview, 22px cave test, category grids, click to copy key | Docs |
| `neighborhood-cave-drawing.json` | Worked example of legend-as-registry + icon nodes — a resident and the two systems around them | Reference |
| `rcn-timeline.html` | **RCN Timeline** — the temporal sibling of the Graph Tool (structure) and the Map (place). Intervals with fuzzy ends (`startFuzz`/`endFuzz` render as gradients), `pinned` anchors, `conf` and `who` on every interval *and* every link, natural-language entry ("say it"), whole model encoded in a shareable URL hash. **Import and export are separate doors** — `Import` takes a drop, a file picker, or pasted text (a `.json` dropped anywhere on the window works too) and shows a **validity report before anything loads**: red blocks the load (unparseable JSON, links pointing at ids that don't exist, duplicate ids), amber warns (unknown `rel`, missing `end`, unreadable date, or a link across an overlap that will make the solver move things); `JSON`/`SVG`/`PNG` download files. Only **two** relations — `meets` and `before` — not the 13 Allen relations; both require disjoint intervals, and `before` links are labelled with their slack. See `schemas/rcn-timeline.md` | **Active** |
| `t1-trace-timeline-demo.json` | Timeline worked example — the EIP schema's **T1 TRACE** in time. Same causal chain the Graph Tool draws, but the side effect visibly arrives 2 yr 2 mo after the result that caused it. One pinned interval (the deed), everything else floating with fuzz and `conf` 0.45–1. Illustrative, not a record of actual events | Reference |
| `timeline-during-broken.json` / `-fixed.json` | Teaching pair for the one trap in the Timeline: neither `meets` nor `before` can say **during**, so a link out of a long-running state pushes everything downstream past its end (2023 → 2031) and your dates vanish. `-broken` shows the damage; `-fixed` bounds the interval to the causing event. Load them back to back | Reference |
| `rcn-timeline-intro.html` / `-manual.html` / `-intro.pptx` | Timeline — introduction, user manual, deck | Docs |
| `nrm-tripod-beta.html` | Standalone Tripod Beta / NRM incident analysis tool — full canvas, barriers, save/load | **Active** |
| `evsm-aggregator.html` | eVSM 11-sphere visualizer, multi-respondent synthesis, Claude API streaming (direct browser→Anthropic, user's own key); Synthesize All (sequential Claude across all spheres/edges), Full Report (standalone HTML with diagram + syntheses), Export/restore session as JSON bundle | Active |
| `evsm-svg-v3.html` | eVSM directed edge assessment (Agree/Disagree/Unknown); Snapshot button bakes config into a single distributable HTML file; Print My Report generates blob-based individual report | Active |
| `evsm-report.html` | eVSM individual respondent report — one person's assessment data; opened via blob URL from Survey Tool or by drag-drop; for aggregate reports across all respondents use Aggregator's Full Report | Active |
| `ibis-map-rcn.html` | IBIS argument mapping (post-hoc mode preferred) | Active |
| `rcn_map.html` (in maps/) | Leaflet NDC map — 9 built-in NDCs, 7 base layers, geographic context layers, issue overlay, shift+click legend, custom location pins, add-NDC (**editable** name/location via Edit link in Saved NDCs), NDC location correction, user boundary layer builder (OSM search + Claude bridge); **boundary nesting** — an "Under NDC" dropdown files a drawn/pasted boundary inside that NDC's accordion section, reassignable any time (unassigned boundaries stay in "My additions & layers"); **group buckets** — the CODE field accepts up to 32 chars in any case (e.g. `Whatcom`, `Nooksack`), grouping is exact-string match; loads `rcn_static_data.js` by flat name from the same folder; SVG/PNG/Print export; all user data in localStorage with top-level **⬇ Export my data (JSON)** one-file backup (+ per-dataset exports in Saved tab); **region federation** — `loadRegions()` merges steward-published region bundles from a `regions.json` manifest (or `?regions=URL`) as read-only namespaced overlay layers; **deep links**: `?highlight=NAME` zooms to any named polygon/NDC, `?openissue=KEY` loads an issue overlay, `?lat=&lng=&zoom=` flies to coordinates; every polygon popup has **🔗 Copy link**; floating **🔗 Copy view link** button captures current view | Active |
| `issue-polygon-map.html` | Polycentric governance / Issue Polygon viewer — data-driven via `?issue=` URL param; loads `issue-data/*.json`; parcel stances, layer toggles, draw/name/rename custom polygons, GeoJSON export; **deep links**: `?parcel=ID` flies to a parcel and opens its popup, `?lat=&lng=&zoom=` flies to a view; every parcel and issue polygon popup has **↗ Copy link**; toolbar **↗ Copy view link** button | Active |
| `more-outliner.html` | Outliner with autosave, MD/HTML/FedWiki export, Hoist; **→ Wiki Ghost** button sends outline as ghost page to FedWiki lineup | Active |
| `graphjson_to_vensim_cld.html` | Canonical MDL format reference — read before fixing MDL bugs | Reference |
| `wardley-map-generator.html` | Wardley mapping tool | Active |
| `eip_integration_explorer.html` | EIP sketch explorer | Active |
| `eip_local_finance_diagram.html` | EIP applied to local finance | Active |
| `bias-checker.html` | Conversation Navigator — real-time multi-participant intent/bias self-reporting, conflict detection, interactive framework models (Cynefin/eVSM/15Ps/Six Hats/Six Questions), custom graph upload, Firebase Realtime DB | **Active** — hosted at Wiki Café: `https://ndcgroup.relocalizecreativity.net/assets/NDC/bias-checker%20(1).html`; Firebase rules scoped to valid session IDs only (`database.rules.json`) |
| `bias-checker-intro.html` | Conversation Navigator — Introduction & positioning | Docs |
| `bias-checker-manual.html` | Conversation Navigator — User Manual | Docs |
| `cfa-dsc-creator.html` | Conversations for Action / Dyadic Smart Contract creator | Active |
| `contract-creator.html` | Contract UI | Active |
| `evsm_excel_tool.html` | eVSM JSON↔Excel conversion; drag-and-drop import (Excel onto Import card) and export (JSON onto Export card); round-trip auto-loads import result into Export textarea; navy header styling + word-wrap; cross-sheet formula linking in Edges sheet | Active |
| `sodoto-issuer.html` | SODOTO credential issuance — gate-by-gate workflow, people registry, Ed25519 signing, FedWiki portfolio + ledger writes | **Active** |

---

## Map (`~/rcn/maps/rcn_map.html`)

Leaflet map that runs from static data — **no API server required**. All NDCs and geographic context
layers live in `rcn_static_data.js` (loaded via `<script src>` by flat filename), so the map works
once its data file sits beside it. Serve the `maps/` folder statically (or open via `file://`). The
only network calls are the OSM tiles/geocoder, the optional Claude bridge (`api.anthropic.com`, for
generating boundary layers and issues), and the optional issue-write proxy (`localhost:8765`, for
saving a new issue to disk).

**Deployment model (two-file, since 2026-07-25).** The live site is **two files in one flat FedWiki
asset folder**: `rcn_map.html` (the page you open) + `rcn_static_data.js` (the ~5.5 MB baseline).
FedWiki asset folders hold many files but no sub-folders, so flat companions work; the page fetches
data/issues/regions by flat name (`rcn_static_data.js`, `issue-index.json`, `regions.json`). Canonical
live URL: `https://ndcgroup.relocalizecreativity.net/assets/NDC/rcn_map.html`. Editing loop: after a
code change, re-upload only `rcn_map.html` (~250 KB); re-upload the data file only when data changes —
**no build step for the live site.** localStorage is per-origin, so user NDCs/polygons/corrections
survive a filename change automatically.

**Standalone build (handout only, not the live site).** `python3 maps/build_standalone_map.py` inlines
`rcn_static_data.js` + issues into one self-contained `rcn_map_standalone.html` (~5.9 MB, gitignored).
Use it to hand a steward the tool+data in a single file (opens from `file://`) — the map's analog of
the Graph Tool snapshot export. Leaflet + tiles still come from the network, so "self-contained" means
"no companion files," not "offline."

**User data & export:** custom locations, added NDCs, boundary layers, and NDC corrections are all
saved in the browser's `localStorage`. The top-level **⬇ Export my data (JSON)** button downloads all
of it as one `rcn-map-data.json` bundle; per-dataset export buttons (locations / polygons / NDCs /
corrections) live in the **Add boundary layer → Saved** tab.

**Region federation:** the map merges regional data published by stewards (e.g. Jerry/MI, Chris/AZ,
Marc/WA) to their own FedWiki (or any host). `loadRegions()` fetches a manifest (`regions.json`
beside the map, or `?regions=<URL>`), pulls each region bundle (the same file the **⬇ Export my
data** button writes), and merges its NDCs/boundaries/locations as **read-only, region-namespaced**
overlay layers under a "Federated regions (read-only)" legend section — skipping any unreachable
region gracefully. Design + flow: `rcn-region-federation-spec.md`, `rcn-region-federation.graph.json`
(RCN Graph Tool source), `rcn-region-federation.svg` (exported diagram).

**Docs:** `rcn-map-intro.html` (overview), `rcn-map-manual.html` (user manual), `rcn-ndc-map.pptx`
(deck), `rcn-map-components.graph.json` (component graph for the RCN graph tool).

**Regenerating the static data:** `rcn_static_data.js` is rebuilt by `generate_static_data.py` from
the geo database — only needed when NDC boundaries or context layers change at the source.

```bash
# Only for regenerating rcn_static_data.js (not for running the map):
cd ~/Desktop && source ~/rcn-venv/bin/activate
uvicorn rcn_api:app --reload --port 8000   # FastAPI/PostGIS backend, then run generate_static_data.py
```
**PostGIS:** localhost:5432, db `rcn_geo`, table `place_geo`
**API canonical source:** `~/rcn/data/rcn_api.py` (repo copy is authoritative — Desktop copy may be stale)
**Virtual env:** `~/rcn-venv/` (python3.14 also has required packages installed system-wide)

### NDC locations (9 built-in)

Hardcoded in `NDC_LIST` (`rcn_map.html`). The first six carry only name/state/label and get their
point from `rcn_static_data.js`; the rest also carry `lat/lng/address` and are injected into
`RCN_NDCS.features` at startup by `injectExtraNDCs()`. User-added NDCs (localStorage) are folded into
the same list at runtime.

| NDC | Address | Code (bucket) |
|-----|---------|-------|
| Leo's NDC | 52 N Pinal Ave, Superior AZ | AZ |
| The Fledge | 1300 Eureka St, Lansing MI | MI |
| East Whatcom RRC | 8251 Kendall Rd, Maple Falls WA | WA |
| Green Gate Farms | 8254 Canoga Ave, Austin TX | TX |
| Green Gate Farms Bastrop | 156 Howard Lane, Bastrop TX | TX |
| Carter Center Library | 453 Freedom Parkway NE, Atlanta GA | GA |
| Porthmadog | Gwynedd, Wales UK | WLS |
| Alpujarra NDC | Órgiva, Alpujarras, Spain | ES |
| Main Street Neighborhood Bellingham | Bellingham, WA | WA |

**Code / group bucket:** the `state` field is a free-text grouping key, not a validated geography.
NDCs and boundaries sharing the **exact same** bucket string are grouped together in the legend. Use a
US state, a country, or any label (`Whatcom`, `Nooksack`) — up to 32 chars, case preserved.

### Boundaries loaded per state

**AZ — Leo's NDC (Superior)**
Superior city, Pinal County, Queen Creek Watershed (HUC8 15050100),
Middle Gila Watershed (HUC6 150501), Lower Gila Watershed (HUC4 1507 — extends to Yuma),
484 copper deposits (USGS MRDS, ~30mi radius, individual named points with dev status),
3 churches (OpenStreetMap Overpass: St Francis of Assisi, El Camino Baptist, Jehovah's Witnesses)

**MI — The Fledge (Lansing)**
Lansing city, Upper Grand River Watershed

**WA — East Whatcom RRC (Maple Falls)**
Whatcom County, Kendall CDP, Mount Baker School District, Nooksack Watershed

**TX — Green Gate Farms (Austin + Bastrop)**
Austin city, Bastrop city, Bastrop County, Austin-Travis Lakes (HUC8), Lower Colorado-Cummins (HUC8)

**GA — Carter Center Library (Atlanta)**
Atlanta city, Upper Chattahoochee Watershed (HUC8 03130001 — contains Lake Lanier, primary water supply),
Middle Chattahoochee Watershed (HUC8 03130002 — west Atlanta / river corridor),
Upper Ocmulgee Watershed (HUC8 03070103 — east Atlanta / Carter Center drainage)

**WLS — Porthmadog (Wales)**
Porthmadog town boundary, Gwynedd county boundary

### Map features

- **7 base layers:** Topo (default), Light, OpenStreetMap Voyager, Satellite, CyclOSM, Transport, Dark
- **5 data layer types:** admin_boundary (blue), ecological_zone (purple), ndc_zone (red), mineral_deposit (bronze), church (purple #7B5EA7 — radius 11, high-visibility)
- **Legend:** named features grouped by NDC/state, click to highlight + zoom, Shift+click to multi-select; custom user layers appear with U or + badge
- **Popups:** name, type, area in mi², data source; copper deposits show individual name + dev status; churches show denomination; all polygon and marker popups include **🔗 Copy link** button
- **Deep links:** `?highlight=NAME` zooms to any registered polygon/NDC by name; `?openissue=KEY` loads an issue overlay; `?lat=&lng=&zoom=` flies to coordinates. Floating **🔗 Copy view link** button (bottom-right) captures the current center + zoom as a shareable URL.
- **Render order:** largest polygons drawn first so smaller ones (e.g. Porthmadog inside Gwynedd) stay clickable
- **Areas:** displayed in mi²

### User-editable data (localStorage, no server)

All user data is stored in `localStorage` under three keys. Export buttons in the Saved tab download JSON for permanent backup.

| Feature | How | localStorage key |
|---------|-----|-----------------|
| **Custom location pins** | Click **+ Add location** in sidebar → click anywhere on map (works over polygons) → name it → sky-blue marker placed and saved | `rcn_user_locations` |
| **NDC location correction** | Click any red NDC marker → popup → **📍 Correct location** → click correct spot | `rcn_ndc_corrections` |
| **Custom location correction** | Click any sky-blue custom marker → popup → **📍 Correct location** → click correct spot | `rcn_user_locations` (lat/lng updated in-place) |
| **Boundary layer (OSM)** | Add boundary layer panel → Search OSM → pick result → name + type → Add to map | `rcn_user_polygons` |
| **Boundary layer (Claude)** | Add boundary layer panel → Ask Claude tab → describe boundary → copy prompt → paste response → Import polygon | `rcn_user_polygons` |
| **Boundary → under an NDC** | On the Draw/Paste form, pick an NDC in **Under NDC**; or use the assign dropdown on any boundary row in the legend. Assigned boundaries render inside that NDC's section (`p.ndc` field); unassigned stay in "My additions & layers" | `rcn_user_polygons` (`ndc` field) |
| **Add / edit an NDC** | **Add NDC** panel → set name / location / code (group bucket) + pin; **Edit** link in Saved NDCs renames name/location | `rcn_user_ndcs` |

### place_geo schema

| Column | Type | Notes |
|--------|------|-------|
| place_id | serial PK | |
| name | text | |
| place_type | text | ndc_zone, admin_boundary, ecological_zone, mineral_deposit, church |
| street_address, city, state, postal_code | text | |
| location | geometry(Point, 4326) | NDC address pin |
| boundary | geometry(*, 4326) | polygon/multipolygon/multipoint |
| boundary_source | text | census_tiger, usgs_wbd, openstreetmap_nominatim, usgs_mrds |
| boundary_updated | date | |
| site_data | jsonb | per-point metadata (copper deposit names, dev status) |

---

## Data scripts (`~/rcn/data/`)

| File | Purpose |
|------|---------|
| `rcn_api.py` | FastAPI server — `/places`, `/ndc/{name}`, `/ndcs` endpoints |
| `load_superior.py` | Initial Superior AZ city + Queen Creek Watershed |
| `load_superior_layers.py` | Pinal County, Gila watersheds, copper deposits (MRDS) |
| `update_superior_layers.py` | Middle/Lower Gila rename, deposit names → site_data JSONB |
| `load_superior_churches.py` | 3 churches from OSM Overpass API → place_type='church', site_data with denomination |
| `load_austin.py` | Austin/Green Gate Farms TX boundaries |
| `load_lansing.py` | Lansing MI boundaries |
| `load_atlanta.py` | Carter Center Library NDC, Atlanta city, 3 GA watersheds |
| `fetch_boundaries.py` | Utility: fetch boundary geometries from TIGER/WBD |
| `find_superior.py` | Locate Superior AZ geometry (reference) |
| `evsm-proxy.py` | Anthropic API proxy for eVSM aggregator (launchd: com.evsm.proxy.plist) |

**Porthmadog + Gwynedd** boundaries loaded inline (no separate script) — Nominatim polygons.

### Deployment checklist (to go beyond localhost)

```
□ Consolidate rcn_api.py — single copy in repo, not ~/Desktop
□ Make API base URL configurable (env var)
□ Serve map HTML as static file through FastAPI
□ pg_dump rcn_geo → restore to cloud Postgres + PostGIS
□ Deploy to VPS or Railway/Render (~$10-20/mo)
□ Domain name + Let's Encrypt SSL
□ Switch to Gunicorn + uvicorn workers (production mode)
```

---

## Graph tool decisions log

The graph tool HTML file contains a full technical decisions log in an HTML comment
at the top of the file. **Read it before editing the graph tool.** It documents:
- MDL/Vensim format details (hard-won, don't rediscover)
- Modal system pattern (never override modal-ok.onclick)
- str_replace safety rules (always run node --check after every edit)
- EIP mode architecture
- Graphviz .dot import/export

**Syntax check after every graph tool edit:**
```bash
python3 << 'EOF'
content = open('tools/graph-tool-v22.html').read()
first = content.find('<script src=')
after = content.find('</script>', first) + 9
s = content.find('<script>', after)
e = content.rfind('</script>')
open('/tmp/test.js','w').write(content[s+8:e])
EOF
node --check /tmp/test.js
```

---

## Vester Influence Analysis (`vester/`)

Vite/React app implementing Vester's Sensitivity Model. Formerly called
SensiMod; renamed Jul 2026. The only tool in the repo with a build step —
everything in `tools/` is single-file HTML served straight off sofi-proxy.

Steps 0–5 built: System Description, Variable Set, System Criteria,
Impact Matrix, System Roles, Partial Scenario (transfer-curve editor +
simulation). localStorage auto-save, JSON save/load, Neo4j Cypher export,
SFD export into `tools/graph-tool-v22.html`.

### The one URL — http://localhost:8765/vester/

Same sofi-proxy that serves every other tool, always running under launchd.
Nothing to start. This is the URL to hand to anyone.

sofi-proxy aliases `/vester/` → `vester/dist/`, and `vite.config.js` sets
`base: '/vester/'` so the built asset paths match. The nginx plan routes
`/vester/` the same way, so this URL is identical in deployment.

**It serves the build, not the source. After changing anything under
`vester/src/`, run `npm run build` or the URL keeps showing the old app.**

```
cd ~/rcn/vester && npm run build      # refresh what /vester/ serves
```

### Developing (hot reload)

`cd ~/rcn/vester && npm run dev` → http://localhost:5173/vester/
(note the `/vester/` path — `base` applies to the dev server too).

**Models saved on :5173 do not appear on :8765 and vice versa.** localStorage
is per-origin and a different port is a different origin. To move a model
between them, use ↓ Save on one and ↑ Load on the other. Do the real work on
the 8765 URL; treat 5173 as a scratch origin.

`LS_KEY` is still `"sensimod_v1"` on purpose — changing it would orphan
every model already saved in a user's browser.

### Reloading sofi-proxy after editing it

launchd (`com.evsm.proxy`) restarts it automatically, so `kill <pid>` is the
whole procedure — do not start it by hand or you race launchd and get
"Address already in use".

---

## Infrastructure

| System | Details |
|--------|---------|
| PostGIS | localhost:5432, db `rcn_geo`, table `place_geo` (venv: `~/rcn-venv/`) |
| FastAPI | uvicorn from `~/Desktop/rcn_api.py`, port 8000, auto-reload |
| Neo4j | Relational/temporal truth, point types, H3 arrays |
| FedWiki | `localfedwiki.relocalizecreativity.net`, launchd auto-start, port 3000 |
| sofi-proxy | `~/rcn/sofi-proxy.py`, port 8765 — Anthropic API relay + FedWiki filesystem write API + static file server for `~/rcn/`; aliases `/vester/` → `vester/dist/` |
| coupler-proxy | `~/rcn/coupler-proxy.py`, port 8766 — My Health Picture AI proxy + FedWiki write API; serves `~/rcn/scp-coupler/`; resolves per-patient wiki site from `people.json` (`get_wiki_host`) |

### coupler-proxy environment variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `ANTHROPIC_API_KEY` | — | AI endpoints fail without it |
| `WIKI_URL` | `http://localhost:3000` | How the proxy reaches the wiki server. The site is chosen by the `Host` header, so this is the transport address only — set to `http://fedwiki:3000` inside Docker. |
| `ALLOWED_ORIGINS` | unset | Comma-separated origins allowed to call the API. **Unset = this machine only** (localhost / `*.localhost` on ports 8766, 8770, 3000), which is correct for a personal install. Set it to real addresses for a hosted deployment; a leading `*.` matches subdomains. Implied ports are filled in, so `https://x.net` and `https://x.net:443` are the same address. |

Origins not on the list are refused with 403 and logged as `BLOCKED`. `null`
(sandboxed frames) is never allowed — any page can claim it. Before this
allowlist existed the proxy echoed back whatever origin asked, which meant any
website the person visited could read and write the health record.

**Page writes go through the wiki's action API** (`wiki_put_page`), not the
filesystem — `create` for a new page, `fork` push to replace one, journal
preserved. Only writes that go through the server update the search index; a
page written as a file is viewable by direct link but invisible to search, and
on a fresh site is never indexed at all. If the wiki refuses the write (403 —
a claimed site, or the default read-only security module) the proxy falls back
to writing the file, which is what keeps the native dev setup working.

---

## Deployment tracks

Two deployments, one codebase. Differences live in compose files and
environment variables — **never in `if` branches inside the Python.**

| | Personal computer | WikiCafe (hosted) |
|---|---|---|
| Directory | `deploy/home/` | `deploy/scp/` |
| Containers | FedWiki + coupler + optionbox | FedWiki + Groove + sofi-proxy + Caddy |
| Reachable from | `127.0.0.1` only | internet, TLS, Keycloak |
| Users | one person, own Anthropic key | many |
| Wiki writes | wiki HTTP API | direct filesystem writes |

`deploy/fedwiki-personal/` is a third, standalone thing: a bare personal
FedWiki with no SCP components. See its README.

### Personal stack notes (`deploy/home/`)

- **One gate in front of all three services.** Caddy is the only container that
  publishes ports; the wiki, coupler and optionbox are `expose:` only and
  unreachable except through it. It listens on the ports the tools already use
  (8766, 8770, 3000) so no tool URLs change. Set the passphrase with
  `./set-passphrase.sh` — never by editing `.env` by hand: bcrypt hashes are
  full of `$`, docker compose reads `$` as a variable reference, and it will
  silently eat part of the hash so the passphrase never matches. The script
  escapes them.
  A gate over all three is necessary rather than tidy: the record lives in the
  wiki, and `--security_legacy` makes the wiki editable by anyone who can reach
  it, so protecting only the coupler would leave the record open on `:3000`.
  Basic auth is scoped per origin, so a browser asks once per address
  (`localhost:8766`, `localhost:8770`, `<person>.localhost:3000`) and remembers
  for the session.
- **Encrypted backups** — `./backup.sh` writes one encrypted file per run
  (AES-256, PBKDF2 600k rounds); `./restore.sh --verify <file>` opens it and
  reports what is inside without touching the live record; `./restore.sh
  <file>` replaces the record, saving the current one first. Because the file
  is unreadable without the passphrase, `BACKUP_DIR` can point at a Dropbox or
  iCloud folder — that is the point. Retention keeps `BACKUP_KEEP` (default 8),
  because overwriting the only good copy with a corrupted one is a real way to
  lose everything. Losing a backup passphrase costs the backup, not the record.
- **Encryption at rest beyond FileVault is not available on Docker Desktop.**
  An encrypted disk image under the data volumes was built and abandoned: the
  Mac's folder sharing into Docker's Linux VM is established when Docker starts,
  and a filesystem mounted afterwards never propagates (`Operation not
  permitted` from inside the VM). It works once, then fails after every
  lock/unlock. On a Linux host — WikiCafe — the same pattern works normally.
  Rely on FileVault plus the gate plus encrypted backups instead.
- Every port is bound `127.0.0.1`. `coupler-proxy.py` binds `0.0.0.0` *inside*
  the container by design — the publish spec is the boundary, not the bind
  address. Do not "fix" it.
- FedWiki runs `--farm --security_legacy`. Both are required on a fresh volume:
  farm mode normally comes from `~/.wiki/config.json`, which does not exist yet,
  and without it every person's pages collapse into one shared site. Without
  `security_legacy` the wiki is read-only over HTTP and page writes 403.
  `security_legacy` is safe **only** while the port stays on `127.0.0.1`.
- `Dockerfile.coupler` deletes `scp-coupler/data` and `scp-fhir/data`. Docker
  seeds a new named volume from whatever the image holds at the mount path, so
  without this every install would start out containing the pilot records.
  The root `.dockerignore` does not cover these: its `data/` pattern matches
  only the top-level directory.
- `PYTHONUNBUFFERED=1` — without it Python block-buffers stdout when not on a
  terminal and nothing reaches `docker compose logs`, including `BLOCKED` lines.

See `docs/scp3-work-list.docx` for outstanding work on both tracks and
`docs/scp3-deployment-findings.docx` for the findings behind these notes,
including open security items on the WikiCafe deployment.

Spatial architecture: PostGIS (precise polygon operations) + Neo4j (point types, H3 arrays)
linked via shared `place_id` UUID.

---

## Presentation and demo capture pipeline

Slides and documentation for My Personal Health Supporter live in `docs/`.

### Deliverables

| File | What |
|------|------|
| `docs/my-phs-stack-overview.html` | Concise single-page reference for the full tool suite — quick-ref table, data flows, per-tool detail, infrastructure table |
| `docs/my-phs-intro.pptx` | 13-slide intro deck with embedded live screenshots and videos |
| `docs/whatcom-coop-slides-berwick.pptx` | 13-slide deck for Don Berwick — "Where Health Actually Lives" |
| `docs/whatcom-coop-overview.html` | Whatcom Wealth and Health cooperative overview |
| `docs/my-phs-intro.html` | My PHS introduction for health partners |

### Screenshot capture

`docs/capture_screenshots.py` — uses **Playwright** to automate a headless Chromium browser, navigate to each live tool, and take PNG screenshots.

```bash
# Requires coupler-proxy.py running on port 8766 and FedWiki on port 3000
python3 docs/capture_screenshots.py
# → docs/screenshots/{my-health-picture,my-health-choices,my-support-network,sodoto-issuer,my-shared-care-plan,scp-diagnoses}.png
```

Why Playwright and not just `screencapture`: static tools (Support Network, SODOTO, FedWiki pages) can be captured with Chrome headless alone. The Health Picture requires interaction — select patient from dropdown, click a problem, wait for the AI frame to render — which Playwright scripts as code.

### Video recording

`docs/record_videos.py` — records interactive demos as video, converts to MP4, ready to embed in PowerPoint.

```bash
python3 docs/record_videos.py
# → docs/videos/{my-health-picture,my-health-choices}.mp4
```

**Pipeline:**

1. **Playwright** launches headless Chromium with `record_video_dir` set. It performs the scripted interaction (select Alex Rivera → click hypertension → wait for Claude frame → slow scroll) while recording everything to a `.webm` file. `slow_mo=400` adds 400ms between actions so the demo reads clearly.

2. **ffmpeg** converts `.webm` → `.mp4` with H.264 + `yuv420p`. Required because:
   - Playwright only outputs WebM (VP8 codec)
   - PowerPoint on Mac requires MP4/H.264 — it will not play WebM
   - macOS's built-in `avconvert` cannot read WebM (AVFoundation gap)
   - Install once: `brew install ffmpeg`

3. **python-pptx** `shapes.add_movie()` embeds the `.mp4` directly inside the `.pptx` file. The screenshot for that slide becomes the `poster_frame_image` — shown before the presenter clicks play. Videos travel with the deck; no external files needed.

### Regenerating the deck

```bash
# 1. Capture fresh screenshots (proxy must be running)
python3 docs/capture_screenshots.py

# 2. Record fresh videos (proxy must be running)
python3 docs/record_videos.py

# 3. Rebuild the PPTX
python3 docs/make_phs_intro_pptx.py
```

The Berwick deck has its own script: `python3 docs/make_berwick_pptx.py`

### Dependencies

| Tool | Install | Purpose |
|------|---------|---------|
| `playwright` | `pip3 install playwright --break-system-packages` then `python3 -m playwright install chromium` | Browser automation + headless screenshots + video recording |
| `ffmpeg` | `brew install ffmpeg` | WebM → MP4 conversion |
| `python-pptx` | `pip3 install python-pptx` | PPTX generation + image/video embedding |

---

## Active threads (as of June 2026)

- **SCP 3.0 on a personal computer** (July 2026): running the whole stack on the person's own machine, so the person — not RCN — is the data controller. Every person uses their own Anthropic API key; this is what keeps it outside HIPAA and must not be centralised. Stack built and tested (`deploy/home/`); browser hole closed. Outstanding: proxy passphrase, disk-encryption check, encrypted backup, local AI audit log, consent text. Raspberry Pi variant considered and parked. See `docs/scp3-work-list.docx`.

- **WikiCafe SCP hardening**: open security items before real patient data — Keycloak in front of the proxy subdomain, per-user authorization on the `site` parameter, `/config` no longer returning the shared secret. Keycloak protects the wiki but not sofi-proxy, which reads the same files directly. See `docs/scp3-deployment-findings.docx`.

- **Foothills Outlook automation**: Convert monthly local newspaper (PDF) into FedWiki newspaper pages, going back 2 years. Goal: put the tool in the hands of the writers and editor by end of Summer 2026.

- **Vester's Sensitivity Model platform**: Vester Influence Analysis — Vite/React app at `vester/`. Steps 0–5 built, through Partial Scenario simulation. Next: multi-group Impact Matrix workflow.

- **Haier Group Workbench**: A platform of tools to collect and share information that makes RenDanHeYi work at scale across the Haier Group (multinational enterprise), tuned for neighborhood entrepreneurship. Early stage.

- **eVSM survey tool**: Port to Wiki Café.

- **SCP + Groove**: Shared Care Plan as native FedWiki plugins + Groove workspace (port 3001). 19 typed item plugins built and working on localhost. Pilot: Superior AZ NDC (Leo's), first tester Mary Martha (CHW). Docker hand-off package at `deploy/scp/` — four containers (fedwiki, groove, sofi-proxy, caddy), data volumes separate from software, sysops README included. See `scp-groove-handoff.md` and the FedWiki SCP Plugins section below.

- **SCP + My Health Picture Integration Experiment (My PHS)**: Three-way integration between My Health Picture (port 8766), the Shared Care Plan FedWiki plugins, and **per-patient wiki sites** (`{slug}.localhost` — e.g. `rosa-delgado.localhost`, `alex-rivera.localhost`). Each patient in `scp-coupler/data/people.json` carries `wiki_slug`/`wiki_site`; coupler-proxy resolves the wiki host per-request via `get_wiki_host(person_id)` (fallback: `scp-experiment.localhost`). My Health Picture reads from and writes to the patient's SCP wiki. Coupler frames push as collapsible FedWiki pages. Narratives push to pre-visit-summary. New patient sites are provisioned via sofi-proxy's `/api/provision-patient`, which seeds all 17 canonical templates from `~/rcn/scp/pages/` (personalizing welcome-visitors and about-me) and registers the site in `~/.wiki/config.json` wikiDomains. See `scp-coupler/experiment-intro.html` and `scp-coupler/experiment-manual.html`.

- **My PHS — Cross-tool navigation (July 2026)**: All three health tools are now connected with a consistent orientation bar.

  | From | Navigation available |
  |------|---------------------|
  | **My Health Picture** (8766) | "My Support Network ↗" in header — grayed until a person is selected, then links to `localhost:8765/tools/my-support-network.html?site={person}.localhost`. Toolbar shows "My Health Choices ↗" and "View My Shared Care Plan ↗" when a problem is active. |
  | **My Health Choices** (8770) | "← My Health Picture" back link in header — always visible, links to `localhost:8766/` when opened directly, updates to `localhost:8766/?person={id}` when opened from Health Picture with context. Sub-header shows **person name · problem title** instead of generic tagline. "My Support Network ↗" appears in header when person context is present. |
  | **My Support Network** (8765) | "Health Picture ↗" button links correctly to `localhost:8766/?person={id}` (the full coupler, not the older tools stub). |

  Deep-linking: Health Picture's `boot()` reads `?person=` URL param and auto-selects + loads the person on arrival — so back-navigation from any tool returns the user to the right patient without re-selecting. Person name (`pname`) is passed in the URL when Health Picture opens Health Choices, so the sub-header shows the patient's name.

- **My Health Choices** (`scp-optionbox/`): Shared decision support tool served at port 8770. Presents treatment options as icon arrays of 1,000 dots (NNT/NNH visualization). Drug safety data pipeline: openFDA label + FAERS adverse event counts + MedlinePlus plain-language term definitions. Three fact boxes: AF anticoagulation, statin primary prevention, hypertension medication vs. lifestyle. When the coupler detects a keyword match between a problem and the library, a purple **My Health Choices ↗** button appears in the toolbar. Opening the My Health Choices from the coupler passes person/problem context; a **Document this choice** button on each option card writes a structured `shared-decision` record entry back to the coupler via `POST /api/record-entry`. Shared decisions surface at the top of the coupler's Plan section (purple card), are incorporated into Narrate output, and appear in the FedWiki wiki push. Clinical curators: see `scp-optionbox/authoring-guide.html` for the JSON schema and 8-step evidence pipeline.

- **SODOTO → Wiki Café deployment**: Docker Compose packaging complete (`deploy/docker/`). Three containers: sofi-proxy (Python/8765), fedwiki (Node/3000), caddy (HTTPS). Shared `wiki-data` volume. Handoff doc at `deploy/handoff-sodoto.md`. Coordination step before first build: Wiki Café generates `SODOTO_PROXY_SECRET`, shares with Marc; Marc bakes it + their domain into `sodoto-issuer.html` three-line config block, then they build. Keys never on server — each issuer enters 64-char hex seed in their own browser.

---

## FedWiki Plugins (`~/rcn/wiki-plugin-*/`)

### Naming convention

FedWiki plugin npm packages **must** use the form `wiki-plugin-singleword` — no hyphens after the `wiki-plugin-` prefix. The word after `wiki-plugin-` becomes the FedWiki item type and the URL path (`/plugins/singleword/singleword.js`). Example: `wiki-plugin-rcngraph` → item type `rcngraph` → served at `/plugins/rcngraph/rcngraph.js`.

### Localhost dev (symlink pattern — set up once per machine)

Each plugin repo is symlinked directly into the wiki's node_modules. Edits to the source are live immediately — no copy step.

```bash
# For each plugin:
ln -sf ~/rcn/wiki-plugin-{name} /usr/local/lib/node_modules/wiki/node_modules/wiki-plugin-{name}
```

Current symlinks:
```
wiki-plugin-rcngraph     → ~/rcn/wiki-plugin-rcn-graph      (graph tool)
wiki-plugin-rcn-graph    → ~/rcn/wiki-plugin-rcn-graph      (backward compat for old items)
wiki-plugin-rcnoutliner  → ~/rcn/wiki-plugin-rcn-outliner   (outliner)
wiki-plugin-rcn-outliner → ~/rcn/wiki-plugin-rcn-outliner   (backward compat for old items)
```

### WikiCafe farm deployment (npm)

Plugins are published to npm and installed on the server. npm account: `marcpierson`.

```bash
# Publish a new version (bump version in package.json first):
cd ~/rcn/wiki-plugin-{name}
npm publish --access=public

# On WikiCafe server — install or update:
npm install -g wiki-plugin-{name}
npm update -g wiki-plugin-{name}
# Then restart the wiki process.
```

### Plugin structure (required files)

```
wiki-plugin-{name}/
  client/{name}.js    ← registers window.plugins['{name}'] = { emit, bind }
  factory.json        ← {"name":"Pluginname","title":"...","category":"..."}
  index.js            ← module.exports = {}  (server-side stub, usually empty)
  package.json        ← "name": "wiki-plugin-{name}", "files": ["client/...","factory.json","index.js"]
```

`pageHandler.put` must receive a jQuery object: `$item.parents('.page:first')` — not a raw DOM element (`[0]`).

### Published plugins

| npm package | Version | Item type | Tool opened | GitHub | Notes |
|------------|---------|-----------|------------|--------|-------|
| `wiki-plugin-rcngraph` | 0.1.8 | `rcngraph` | `graph-tool-v22.html` (popup) | [marpie1/wiki-plugin-rcngraph](https://github.com/marpie1/wiki-plugin-rcngraph) | Also handles legacy `rcn-graph` items via `client/rcn-graph.js` shim. Tool URL: `marc.relocalizecreativity.net/assets/Drag/graph-tool-v22.html` — deploy updated HTML there to push fixes to remote wikis. |
| `wiki-plugin-rcnoutliner` | 0.2.0 | `rcnoutliner` | `more-outliner.html` (popup) | [marpie1/wiki-plugin-rcnoutliner](https://github.com/marpie1/wiki-plugin-rcnoutliner) | Also handles legacy `rcn-outliner` items. Inline outliner works on any wiki via native `wiki.pageHandler.put` — no proxy required. MORE popup: localhost uses `localhost:8765/tools/more-outliner.html`; remote uses `marc.relocalizecreativity.net/assets/Drag/more-outliner.html` — deploy `more-outliner.html` there to enable MORE popup on remote wikis. |

### Solo popup pattern (graph tool, outliner)

`window.open()` named popup → tool signals ready via `postMessage({toolType:'...', action:'graphToolReady'})` → plugin sends `loadGraph` with saved data + page title → user edits → tool posts `saveGraph` back → plugin calls `wiki.pageHandler.put` → re-renders item with SVG preview.

**sofi-proxy** (port 8765, launchd `com.evsm.proxy`) serves `~/rcn/` as static files. Tools must be opened via `http://localhost:8765/tools/` — not `file://`. Plugin URLs point to `http://localhost:8765/tools/{tool}.html`.

**SVG enrichment:** before sending to wiki, all `<text>` elements in the graph SVG are wrapped in `<a class="internal" data-title="...">` anchors following Ward Cunningham's Enrich Any SVG pattern. Node labels become clickable wiki internal links.

### SCP plugins (Shared Care Plan health record)

Plugin repos live at `~/rcn/scp/plugins/wiki-plugin-scp-*/`. 19 typed item plugins for the Shared Care Plan. All route through one JS file (`wiki-plugin-scp-medication/client/scp-medication.js`) via `server/server.js` alias routes.

**Design principles:**
- Uses FedWiki's native factory system — items created via the factory menu, not pre-loaded JSON
- Pages carry an `scp-factory` item (`types` array + `position: "top"`) that renders the green "Add entry" button
- All saves via `wiki.pageHandler.put()` — the correct FedWiki API
- `item.text` populated on every save so FedWiki's built-in search indexes all SCP content
- Log-style items (vitals, symptoms, visits, history, access) use a commit button → one journal entry per completed card, reverse chronological ordering via `move` action
- Record-style items (medications, diagnoses, providers, etc.) save on focusout or commit
- **Example/dismiss pattern:** template items carry `"example": true` — rendered with an amber banner ("Example — this is not your data") and a ✕ Dismiss button that removes the item via a journal `remove` action. Example items are excluded from reports and data analysis. Wired into all 19 plugin types.
- **Journal baseline:** all canonical page templates carry a `create` journal entry with the full story as baseline, enabling FedWiki's revert function to restore to the original seeded state.

| Plugin type | SCP page | Notes |
|---|---|---|
| `scp-medication` | Medications | Focusout saves; persistent record |
| `scp-vital` | Vitals / Health Log | Commit + fold; thumb events for chart data flow |
| `scp-symptom` | Symptoms / Health Log | Commit + fold |
| `scp-visit` | Visits / Health Log | Commit + fold |
| `scp-lab` | Lab Results | FHIR Observation-aligned: LOINC code, valueQuantity, interpretation H/L/N/A/B/P |
| `scp-about` | About Me | Commit + fold |
| `scp-provider` | My Care Team | Commit + fold |
| `scp-diagnosis` | Diagnoses | Commit + fold |
| `scp-reaction` | Allergies & Reactions | Commit + fold |
| `scp-history` | Medical History | Commit + fold + reverse chron |
| `scp-next-step` | Next Steps | Commit + fold |
| `scp-directive` | Health Directives | Commit + fold |
| `scp-access` | Who's Accessed My Plan | Commit + fold + reverse chron |
| `scp-care-member` | My Care Team | Commit + fold; roles: Family, Friend, Primary Care, Other |
| `scp-goal` | Next Steps | Commit + fold; status: Active / Achieved / Paused / Dropped |
| `scp-next-step` | Next Steps | Commit + fold; status: Planned / In Progress / Done |
| `scp-polst` | Health Directives | Commit + fold; CPR preference + medical interventions |
| `scp-agent` | Health Directives | Commit + fold; healthcare agent name, relationship, authorization |
| `scp-wishes` | Health Directives | Commit + fold; where to be cared for, what matters most |
| `scp-factory` | All pages | Persistent "Add entry" widget; `types` array scopes choices to that page |
| `scp-field` | Various | Fixed questionnaire fields (multiselect, snapshot-card); not a list type |

**Canonical page templates:** `~/rcn/scp/pages/*.json` — 17 pages with example items, the master set for provisioning new patient sites. The `/api/provision-patient` endpoint in sofi-proxy seeds all 17 templates into a new patient site (personalizing `welcome-visitors` and `about-me`) and reports the `seeded` list in its response. Live patient data lives at `~/.wiki/{site}.localhost/pages/`; changes to canonical templates do **not** auto-deploy to existing sites.

**Remaining before pilot:** backend-driven access log, federation. Docker hand-off package ready at `deploy/scp/` — sysops extracts archive, fills in `.env`, runs one command.

---

## SODOTO — credential infrastructure

**See One, Do One, Teach One** — federated apprenticeship credentialing via W3C Verifiable Credentials (signed JWTs), rendered as badges in FedWiki pages, verifiable in browser with no server call.

Full detail in `SODOTO-CLAUDE-CODE-CONTEXT.md`. Orientation summary:

| Item | Location |
|------|----------|
| Private keys (gitignored) | `~/rcn/veramo/keys.json` |
| Public DIDs | `~/rcn/veramo/dids.json` |
| People records | `~/rcn/veramo/people.json` |
| Signed credentials (reference) | `~/rcn/veramo/credentials/` |
| Issuer tool | `~/rcn/tools/sodoto-issuer.html` — served via sofi-proxy at `http://localhost:8765/tools/sodoto-issuer.html` |
| FedWiki badge plugin | `/usr/local/lib/node_modules/wiki/node_modules/wiki-plugin-sodoto-badge/client/sodoto-badge.js` — this is the file FedWiki actually serves; **not** `~/.wiki/localhost/assets/` |
| Marc's portfolio | `~/.wiki/localhost/pages/marc-pierson-sodoto-portfolio` |
| Kerry's portfolio | `~/.wiki/localhost/pages/kerry-turner-sodoto-portfolio` |
| RCN SODOTO Ledger | `~/.wiki/localhost/pages/rcn-sodoto-ledger` |

**5 NDC issuers registered:** RCN (Bellingham WA), Columbia Valley NDC, The Fledge (Lansing MI), Leo's, Kula. All have Ed25519 key pairs. DIDs are `did:key` — public key is self-contained in the DID string, no external registry.

**Signing:** purely client-side in browser via Web Crypto API (Ed25519). User enters 64-char hex private key seed into sodoto-issuer.html. Key is used once and immediately cleared. JWT format: `header.payload.signature`, all base64url. **Never sign programmatically on the user's behalf.**

**Verification:** purely client-side. Public key decoded directly from DID string. Zero server calls.

**Badge upsert pattern:** sofi-proxy `/api/wiki-write-badge` searches the portfolio for an existing `sodoto-badge` with matching `contractId`. If found, replaces in-place (journal `edit`). If not found, appends (journal `add`). One badge per contract — updated as gates complete.

**sofi-proxy FedWiki API routes:** `GET /api/wiki-read-page`, `POST /api/wiki-write-badge`, `POST /api/wiki-update-item`, `POST /api/wiki-add-items`, `POST /api/wiki-write-page`

**keys.json is gitignored. Never commit it.**

---

## Server migration plan

Three deployment targets in sequence: **Mac Mini → Wiki Café → Raspberry Pi**.
The Mac Mini is new hardware available now. Wiki Café hosts existing FedWiki sites.
Pi is the long-term neighborhood distribution target.

### Full stack inventory (current Mac, all running services)

| Port | Service | Notes |
|------|---------|-------|
| 5432 | PostgreSQL + PostGIS (Docker) | db `rcn_geo` |
| 7474/7687 | Neo4j | graph DB, Java |
| 8000 | FastAPI/uvicorn | map API, `~/Desktop/rcn_api.py` |
| 8765 | sofi-proxy (Python) | Anthropic API relay + FedWiki write API + static file server for ~/rcn/; runs under launchd as `com.evsm.proxy` (kill it to reload, don't start by hand) — **always use http://localhost:8765/ to open tools, never file://**; aliases `/vester/` → `vester/dist/` |
| 3000 | FedWiki (Node) | launchd |
| 5173 | Vite dev server | vester/ only, development — the shareable URL is http://localhost:8765/vester/ |

**Known apps not yet fully in repo** (some built in Claude.ai Chat, not Claude Code):
- All tools in `rcn/tools/` are here
- ~~`graph-tool-v22UPDATE.html` on Desktop~~ — **nothing to merge.** Despite the name it is titled "Graph Diagramming Tool **v20**", 1,228 lines against the repo's 5,596, with zero function or `const` definitions the repo lacks and none of Wardley/OPM/SFD/Trace/NRM/triples/Untangle/Dagre/legend/icons. Strictly a subset — safe to archive (verified 2026-07-25)
- Unknown number of Chat-built apps not yet inventoried
- ~~`~/sensimod/`~~ — **now in the repo** at `vester/`, history preserved (2026-07-27)

### Architecture decisions (made, don't revisit)

**Docker Compose** is the packaging unit. One `docker-compose.yml` defines the full stack. Run it on Mac Mini, push to Wiki Café, shrink for Pi. Write once, deploy everywhere.

**nginx as single entry point** — all apps under one domain, no more hardcoded `localhost:8000`:
```
/              → map (rcn_map.html)
/tools/        → all HTML tools (static)
/api/          → FastAPI
/proxy/        → evsm-proxy (Anthropic relay)
/vester/       → Vite build output (static)
/wiki/         → FedWiki (proxied)
```

**Raspberry Pi sovereignty model** — Pi runs full local stack (not thin client). Neighborhoods own their data. Sync to Wiki Café when online, operate offline when not. Pi 4 (4GB) can run everything except Neo4j (too heavy — skip or replace for Pi).

### Phase 0 — Inventory (Claude Chat → Claude Code handoff)

**Do this before writing any infrastructure code.**

In Claude Chat, produce for every app built there:
1. Name and one-line purpose
2. External calls (Anthropic API — which model/endpoint? PostGIS? Neo4j? evsm-proxy port?)
3. State — does it save anything, where?
4. Latest version location

Bring that list to Claude Code. Then:
- [x] ~~Merge `graph-tool-v22UPDATE.html` from Desktop~~ — checked 2026-07-25, it is an older v20 and a strict subset. Nothing to merge; archive or delete it
- [ ] Consolidate `rcn_api.py` from Desktop into `rcn/api/`
- [ ] All Chat-built tools into `rcn/tools/`
- [ ] Audit evsm-proxy.py — port, what it accepts, key handling
- [ ] Single inventory table: every app, its deps, its home

### Phase 1 — Mac Mini

- Repo consolidated (Phase 0 done)
- `docker-compose.yml` for full stack
- nginx routing all apps
- PostGIS + Neo4j data volumes migrated from current Mac
- `.env` for secrets (Anthropic key, DB password) — gitignored
- `docker-compose up` starts everything; auto-restart on boot
- Mac Mini at fixed LAN IP → `http://[mini-ip]/` serves full toolkit

### Phase 2 — Wiki Café (public)

- Same Docker Compose, production `.env`
- Domain + Let's Encrypt SSL (free, auto-renew via certbot)
- Deploy: `git pull && docker-compose up -d`
- FedWiki decision: stay on own subdomain or merge into this stack
- `pg_dump` + Neo4j dump migrated to production DB volumes

### Phase 3 — Raspberry Pi neighborhood kit

- ARM64 Docker images for all services (available for Postgres, nginx, Node)
- Neo4j omitted (too heavy) or replaced with lighter graph DB
- `./setup.sh --neighborhood "Superior AZ"` — one command seeds local data
  (pulls city boundary, watershed, NDC location from TIGER/WBD/Nominatim automatically)
- Pi advertises as `http://rcn.local` on local network
- Sync protocol: push changes to Wiki Café when online (FedWiki federation for wiki content)
- Goal: flash SD card, plug in, full RCN toolkit available to neighborhood

---

## Working method

Campfire (deliberation) → cave drawings (CLDs, EIP sketches) → encoded infrastructure.
Documents are conversation substrates, not finished deliverables.
Hamilton's Law: systems take the lowest energy path — ease of use is a design requirement.
Mark Twain discipline: say the thing once, plainly, then stop.
