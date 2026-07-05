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
  maps/       rcn_map.html — NDC map; rcn-map-intro.html, rcn-map-manual.html — docs
  data/       PostGIS Python load scripts
  docs/       tool documentation (nrm-tripod-beta.md, graph-tool-intro.html, graph-tool-manual.html)
  vester/     Vester chapter notes and SensiMod context
  archive/    old numbered drafts
  veramo/     SODOTO credential infrastructure (see SODOTO section below)
  scp-coupler/ standalone PKC tool + experiment integration files
  coupler-proxy.py  PKC proxy (port 8766)
  database.rules.json   Firebase Realtime DB security rules (scoped to sessions/ and topics/ paths)
  SODOTO-CLAUDE-CODE-CONTEXT.md   full SODOTO onboarding doc (authoritative)

~/sensimod/   Vite/React app — Vester Sensitivity Model (keep separate, has node_modules)
```

---

## Tools (`~/rcn/tools/`)

| File | Purpose | Status |
|------|---------|--------|
| `graph-tool-v22.html` | CLD/EIP/NRM/OPM/Trace/Wardley/Triples graph diagramming, MDL/.dot/XMILE/Cypher/Wardley JSON I/O, multi-trace edges, reifiable triples with meta-edges, canvas legend, node+edge layers, Print; **→ Wiki** button sends enriched SVG ghost page to FedWiki lineup (node labels become clickable internal links) | **Active** |
| `nrm-tripod-beta.html` | Standalone Tripod Beta / NRM incident analysis tool — full canvas, barriers, save/load | **Active** |
| `evsm-aggregator.html` | eVSM 11-sphere visualizer, multi-respondent synthesis, Claude API streaming (direct browser→Anthropic, user's own key); Synthesize All (sequential Claude across all spheres/edges), Full Report (standalone HTML with diagram + syntheses), Export/restore session as JSON bundle | Active |
| `evsm-svg-v3.html` | eVSM directed edge assessment (Agree/Disagree/Unknown); Snapshot button bakes config into a single distributable HTML file; Print My Report generates blob-based individual report | Active |
| `evsm-report.html` | eVSM individual respondent report — one person's assessment data; opened via blob URL from Survey Tool or by drag-drop; for aggregate reports across all respondents use Aggregator's Full Report | Active |
| `ibis-map-rcn.html` | IBIS argument mapping (post-hoc mode preferred) | Active |
| `rcn_map.html` (in maps/) | Leaflet NDC map — 7 NDCs, 7 base layers, geographic context layers, issue overlay, shift+click legend, custom location pins, NDC location correction, user boundary layer builder (OSM search + Claude bridge); all user data in localStorage | Active |
| `issue-polygon-map.html` | Polycentric governance / Issue Polygon viewer — data-driven via `?issue=` URL param; loads `issue-data/*.json`; parcel stances, layer toggles, draw polygon, GeoJSON export | Active |
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

Leaflet map served from a live FastAPI/PostGIS backend. Requires the API server running.

**Start API server:**
```bash
cd ~/Desktop && source ~/rcn-venv/bin/activate
uvicorn rcn_api:app --reload --port 8000
```
Open `~/rcn/maps/rcn_map.html` directly in browser (file://). The map fetches from `http://127.0.0.1:8000`.

**PostGIS:** localhost:5432, db `rcn_geo`, table `place_geo`
**API canonical source:** `~/rcn/data/rcn_api.py` (repo copy is authoritative — Desktop copy may be stale)
**Virtual env:** `~/rcn-venv/` (python3.14 also has required packages installed system-wide)

### NDC locations (7)

| NDC | Address | State |
|-----|---------|-------|
| Leo's NDC | 52 N Pinal Ave, Superior AZ | AZ |
| The Fledge | 1300 Eureka St, Lansing MI | MI |
| East Whatcom RRC | 8251 Kendall Rd, Maple Falls WA | WA |
| Green Gate Farms | 8254 Canoga Ave, Austin TX | TX |
| Green Gate Farms Bastrop | 156 Howard Lane, Bastrop TX | TX |
| Carter Center Library | 453 Freedom Parkway NE, Atlanta GA | GA |
| Porthmadog | Gwynedd, Wales UK | WLS |

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
- **Popups:** name, type, area in mi², data source; copper deposits show individual name + dev status; churches show denomination
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

## SensiMod (`~/sensimod/`)

Vite/React app implementing Vester's Sensitivity Model.
Steps 0–2 built. localStorage auto-save. Neo4j Cypher export.
Run: `cd ~/sensimod && npm run dev`
Kept outside ~/rcn/ because of node_modules size.

---

## Infrastructure

| System | Details |
|--------|---------|
| PostGIS | localhost:5432, db `rcn_geo`, table `place_geo` (venv: `~/rcn-venv/`) |
| FastAPI | uvicorn from `~/Desktop/rcn_api.py`, port 8000, auto-reload |
| Neo4j | Relational/temporal truth, point types, H3 arrays |
| FedWiki | `localfedwiki.relocalizecreativity.net`, launchd auto-start, port 3000 |
| sofi-proxy | `~/rcn/sofi-proxy.py`, port 8765 — Anthropic API relay + FedWiki filesystem write API + static file server for `~/rcn/` |
| coupler-proxy | `~/rcn/coupler-proxy.py`, port 8766 — PKC AI proxy + FedWiki write API; serves `~/rcn/scp-coupler/` |

Spatial architecture: PostGIS (precise polygon operations) + Neo4j (point types, H3 arrays)
linked via shared `place_id` UUID.

---

## Active threads (as of June 2026)

- **Foothills Outlook automation**: Convert monthly local newspaper (PDF) into FedWiki newspaper pages, going back 2 years. Goal: put the tool in the hands of the writers and editor by end of Summer 2026.

- **Vester's Sensitivity Model platform**: SensiMod — Vite/React app at `~/sensimod/`. Steps 0–2 built (variable definition, influence matrix, active/passive/critical/buffering classification). Next: multi-group Impact Matrix workflow.

- **Haier Group Workbench**: A platform of tools to collect and share information that makes RenDanHeYi work at scale across the Haier Group (multinational enterprise), tuned for neighborhood entrepreneurship. Early stage.

- **eVSM survey tool**: Port to Wiki Café.

- **SCP + Groove**: Shared Care Plan as native FedWiki plugins + Groove workspace (port 3001). 12 typed item plugins built and working on localhost (June 2026). Pilot: Superior AZ NDC (Leo's). See `scp-groove-handoff.md` and the FedWiki SCP Plugins section below.

- **SCP + PKC Integration Experiment**: Three-way integration between the Problem-Knowledge Coupler (port 8766), the Shared Care Plan FedWiki plugins, and a local experimental wiki site (`scp-experiment.localhost`). PKC reads from and writes to the SCP wiki. Coupler frames push as collapsible FedWiki pages. Narratives push to pre-visit-summary. Experiment site isolated from WikiCafe production. See `scp-coupler/experiment-intro.html` and `scp-coupler/experiment-manual.html`.

- **SODOTO Mac Mini deployment**: issuer tool and FedWiki running on shared Mac Mini. Each issuer accesses sodoto-issuer.html through their own browser; keys never leave the signer's machine. Next steps: launchd plists for auto-start, network config, private key storage (out of plain JSON), people registry portability (localStorage → SEED_PEOPLE or server-side file), PROXY constant in sodoto-issuer.html updated from localhost to Mac Mini hostname.

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

Current symlinks (both point to same repo dir `~/rcn/wiki-plugin-rcn-graph`):
```
wiki-plugin-rcngraph  → ~/rcn/wiki-plugin-rcn-graph
wiki-plugin-rcn-graph → ~/rcn/wiki-plugin-rcn-graph   (backward compat for old items)
wiki-plugin-rcn-outliner → ~/rcn/wiki-plugin-rcn-outliner
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

| npm package | Item type | Tool opened | GitHub | Notes |
|------------|-----------|------------|--------|-------|
| `wiki-plugin-rcngraph` | `rcngraph` | `graph-tool-v22.html` (popup) | [marpie1/wiki-plugin-rcngraph](https://github.com/marpie1/wiki-plugin-rcngraph) | Also handles legacy `rcn-graph` items via `client/rcn-graph.js` shim |
| `wiki-plugin-rcnoutliner` | `rcnoutliner` | `more-outliner.html` (popup) | [marpie1/wiki-plugin-rcnoutliner](https://github.com/marpie1/wiki-plugin-rcnoutliner) | localhost only for now |

### Solo popup pattern (graph tool, outliner)

`window.open()` named popup → tool signals ready via `postMessage({toolType:'...', action:'graphToolReady'})` → plugin sends `loadGraph` with saved data + page title → user edits → tool posts `saveGraph` back → plugin calls `wiki.pageHandler.put` → re-renders item with SVG preview.

**sofi-proxy** (port 8765, launchd `com.evsm.proxy`) serves `~/rcn/` as static files. Tools must be opened via `http://localhost:8765/tools/` — not `file://`. Plugin URLs point to `http://localhost:8765/tools/{tool}.html`.

**SVG enrichment:** before sending to wiki, all `<text>` elements in the graph SVG are wrapped in `<a class="internal" data-title="...">` anchors following Ward Cunningham's Enrich Any SVG pattern. Node labels become clickable wiki internal links.

### SCP plugins (Shared Care Plan health record)

12 typed item plugins for the Shared Care Plan. All route through one JS file (`wiki-plugin-scp-medication/client/scp-medication.js`) via `server/server.js` alias routes.

**Design principles:**
- Uses FedWiki's native factory system — items created via the factory menu, not pre-loaded JSON
- All saves via `wiki.pageHandler.put()` — the correct FedWiki API
- `item.text` populated on every save so FedWiki's built-in search indexes all SCP content
- Log-style items (vitals, symptoms, visits, history, access) use a commit button → one journal entry per completed card, reverse chronological ordering via `move` action
- Record-style items (medications, diagnoses, providers, etc.) save on focusout or commit

| Plugin type | SCP page | Notes |
|---|---|---|
| `scp-medication` | Medications | Focusout saves; persistent record |
| `scp-vital` | Health Log | Commit + fold; thumb events for chart data flow |
| `scp-symptom` | Health Log | Commit + fold |
| `scp-visit` | Health Log | Commit + fold |
| `scp-about` | About Me | Commit + fold |
| `scp-provider` | Care Team | Commit + fold |
| `scp-diagnosis` | Diagnoses | Commit + fold |
| `scp-reaction` | Reactions | Commit + fold |
| `scp-history` | History | Commit + fold + reverse chron |
| `scp-next-step` | Next Steps | Commit + fold |
| `scp-directive` | Advanced Directives | Commit + fold |
| `scp-access` | Who's Accessed My Plan | Commit + fold + reverse chron |

**Remaining before pilot:** backend-driven access log, federation, Wiki Café deployment.

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
| 8765 | sofi-proxy (Python) | Anthropic API relay + FedWiki write API + static file server for ~/rcn/; `python3 sofi-proxy.py` — **always use http://localhost:8765/ to open tools, never file://** |
| 3000 | FedWiki (Node) | launchd |
| 5173 | Vite dev server | sensimod only |

**Known apps not yet fully in repo** (some built in Claude.ai Chat, not Claude Code):
- All 13 tools in `rcn/tools/` are here
- `graph-tool-v22UPDATE.html` on Desktop — not yet merged
- Unknown number of Chat-built apps not yet inventoried
- `~/sensimod/` — React/Vite app, kept separate

### Architecture decisions (made, don't revisit)

**Docker Compose** is the packaging unit. One `docker-compose.yml` defines the full stack. Run it on Mac Mini, push to Wiki Café, shrink for Pi. Write once, deploy everywhere.

**nginx as single entry point** — all apps under one domain, no more hardcoded `localhost:8000`:
```
/              → map (rcn_map.html)
/tools/        → all HTML tools (static)
/api/          → FastAPI
/proxy/        → evsm-proxy (Anthropic relay)
/sensimod/     → Vite build output (static)
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
- [ ] Merge `graph-tool-v22UPDATE.html` from Desktop into repo
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
