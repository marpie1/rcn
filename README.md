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
  maps/       rcn_map.html — civic infrastructure campfire
  data/       PostGIS Python load scripts
  vester/     Vester chapter notes and SensiMod context
  archive/    old numbered drafts
  veramo/     SODOTO credential infrastructure (see SODOTO section below)
  SODOTO-CLAUDE-CODE-CONTEXT.md   full SODOTO onboarding doc (authoritative)

~/sensimod/   Vite/React app — Vester Sensitivity Model (keep separate, has node_modules)
```

---

## Tools (`~/rcn/tools/`)

| File | Purpose | Status |
|------|---------|--------|
| `graph-tool-v22.html` | CLD/EIP/OPM/VSM graph diagramming, MDL/.dot/XMILE/Cypher I/O | **Active** |
| `sofi-aggregator.html` | SOFI 11-sphere visualizer, multi-respondent synthesis, Claude API streaming | Active |
| `sofi-svg-v3.html` | SOFI-VSM directed edge assessment (Agree/Disagree/Unknown) | Active |
| `sofi-report.html` | SOFI survey report generator | Active |
| `ibis-map-rcn.html` | IBIS argument mapping (post-hoc mode preferred) | Active |
| `rcn_map.html` (in maps/) | Leaflet map, embedded PostGIS GeoJSON, 4 NDC locations | Active |
| `graphjson_to_vensim_cld.html` | Canonical MDL format reference — read before fixing MDL bugs | Reference |
| `wardley-map-generator.html` | Wardley mapping tool | Active |
| `eip_integration_explorer.html` | EIP sketch explorer | Active |
| `eip_local_finance_diagram.html` | EIP applied to local finance | Active |
| `cfa-dsc-creator.html` | Conversations for Action / Dyadic Smart Contract creator | Active |
| `contract-creator.html` | Contract UI | Active |
| `sofi_excel_tool.html` | SOFI Excel export | Active |

---

## Map (`~/rcn/maps/rcn_map.html`)

Self-contained HTML, all GeoJSON embedded. No server required.
PostGIS source: Docker container `rcn-postgis`, database `rcn_geo`, table `place_geo`.
Connection: `docker exec rcn-postgis psql -U postgres -d rcn_geo`

NDC locations loaded:
- Leo's NDC — 52 N Pinal Ave, Superior AZ
- The Fledge — 1300 Eureka St, Lansing MI
- East Whatcom RRC — 8251 Kendall Rd, Maple Falls WA
- Green Gate Farms — Austin TX + Bastrop TX

Boundaries loaded: Superior AZ, Lansing MI, Whatcom County WA, Austin TX,
Bastrop TX, Queen Creek Watershed, Upper Grand River Watershed, Nooksack Watershed,
Kendall CDP, Mt Baker School District, Austin-Travis Lakes HUC8, Lower Colorado-Cummins HUC8,
Bastrop County.

To update map: dump GeoJSON from PostGIS → upload here → rebuild HTML.
Load scripts: `~/rcn/data/load_austin.py`, `load_lansing.py`, `load_superior.py`

---

## Data scripts (`~/rcn/data/`)

| File | Purpose |
|------|---------|
| `load_austin.py` | Load Austin/Green Gate Farms TX boundaries into PostGIS |
| `load_lansing.py` | Load Lansing MI boundaries |
| `load_superior.py` | Load Superior AZ boundaries |
| `fetch_boundaries.py` | Fetch boundary geometries from external sources |
| `find_superior.py` | Locate Superior AZ geometry |
| `rcn_api.py` | RCN API utilities |
| `sofi-proxy.py` | Anthropic API proxy for SOFI aggregator (launchd: com.sofi.proxy.plist) |

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
| PostGIS | Docker: `rcn-postgis`, port 5432, db `rcn_geo` |
| Neo4j | Relational/temporal truth, point types, H3 arrays |
| FedWiki | `localfedwiki.relocalizecreativity.net`, launchd auto-start |
| SOFI proxy | launchd: `~/Library/LaunchAgents/com.sofi.proxy.plist` |

Spatial architecture: PostGIS (precise polygon operations) + Neo4j (point types, H3 arrays)
linked via shared `place_id` UUID.

---

## Active threads (as of April 2026)

- Graph tool v22: EIP mode, .dot import/export added. Next: OPM node types, SODOTO credential export
  - DOT import/export fidelity substantially improved (April 2026):
    - Named colors (purple, orange, blue, etc.) map to real CSS hex on import
    - Node/edge label `\n`/`\l`/`\r` Graphviz escapes stripped on import
    - Edge colors and penwidths round-trip correctly
    - `pos=` stripped from export (use JSON/SVG for layout preservation)
    - Graph-level attrs (`rankdir`, `splines`, `overlap`, etc.) parsed on import into `graphAttrs` global, re-exported in `graph []` block, persisted in JSON/URL state
    - `node [...]` defaults block parsed — `shape=circle` etc. apply to nodes without explicit shape
    - `dotNodeId` simplified to `n{id}` — no label mangling
    - Export uses one attribute per line (readable, diff-friendly)
    - Export uses `labelLines(n)` to write actual wrapped lines joined with Graphviz `\n` — Graphviz renders same line breaks as the tool
    - graph-tool-v22 replaces Arrows for Neo4j import workflow
    - Dagre layout engine added (LR↔TB toggle, lazy CDN load); picks up `rankdir` from import
    - Canvas background color selector added (picker + presets, persists in JSON/URL/exports)
    - Edge label font color picker added (separate from edge line color, Auto revert)
    - PNG export arrowheads fixed — drawn as filled triangles sized to match SVG markers (length=sw×8, half-width=sw×3.2); handles straight, curved, and self-loop edges
    - Long-press node highlight renders connected edges in their assigned colors (was hardcoded black); stroke width increase retained
    - Graphviz Brewer color scheme not supported — unknown colors fall back to default blue on import; decision: leave as-is (hand-authored graphs unlikely to use Brewer)
- RCN map: 4 NDC locations live. Next: connect PostGIS boundaries to Neo4j via place_id
- SOFI: municipal + neighborhood versions designed. Next: FedWiki EIP page template
- SensiMod: Steps 0–2 built. Next: multi-group Impact Matrix workflow
- SODOTO credentials: 8 credentials issued to Marc (CLD, e-VSM Basic/Intermediate/Site Manager, EIP Basic/Intermediate/Expert, Stock and Flow Diagramming), all cryptographically valid. Keys persistent in ~/rcn/veramo/. Next: real gate histories for e-VSM/EIP/SFD; v0.4 (learner JWT, student JWT, Neo4j debt record)
- Meadows leverage points: extended to 16 (added time + place). Next: variable name registry, FedWiki book

---

## SODOTO — credential infrastructure

**See One, Do One, Teach One** — federated apprenticeship credentialing via W3C Verifiable Credentials (signed JWTs), rendered as badges in FedWiki pages, verifiable in browser with no server call.

Full detail in `SODOTO-CLAUDE-CODE-CONTEXT.md`. Orientation summary:

| Item | Location |
|------|----------|
| Private keys (gitignored) | `~/rcn/veramo/keys.json` |
| Public DIDs | `~/rcn/veramo/dids.json` |
| People records | `~/rcn/veramo/people.json` |
| Signed credential JSON | `~/rcn/veramo/credentials/` (8 files) |
| FedWiki plugin (active) | `~/.wiki/localhost/assets/wiki-plugin-sodoto-badge/client/sodoto-badge.js` |
| FedWiki plugin (npm) | `~/node_modules/wiki-plugin-sodoto-badge/client/sodoto-badge.js` |
| Marc's portfolio | `~/.wiki/localhost/pages/marc-pierson-sodoto-portfolio` |

**5 NDC issuers registered:** RCN (Bellingham WA), Columbia Valley NDC, The Fledge (Lansing MI), Leo's, Kula. All have Ed25519 key pairs. DIDs are `did:key` — public key is self-contained in the DID string, no external registry.

**Signing:** Node.js built-in `crypto` (Ed25519). JWT format: `header.payload.signature`, all base64url. Verify via Web Crypto API in browser.

**keys.json is gitignored. Never commit it.** If lost, generate new key pairs, update `dids.json`, re-sign affected credentials, update plugin ISSUER_REGISTRY.

---

## Working method

Campfire (deliberation) → cave drawings (CLDs, EIP sketches) → encoded infrastructure.
Documents are conversation substrates, not finished deliverables.
Hamilton's Law: systems take the lowest energy path — ease of use is a design requirement.
Mark Twain discipline: say the thing once, plainly, then stop.
