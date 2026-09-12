# Claude Chat's account-level memory (export of 2026-09-11)

**Work context**

Marc Pierson is co-founder of the ReLocalize Creativity Network (RCN), an unincorporated federation focused on neighborhood-scale community development, governance, and mutual aid. His primary collaborator is Kerry Turner. Active NDC practitioners include Chris Casillas (Superior, AZ), Jerry (Lansing, MI), and Carl (Maple Falls, WA). All active work is on the MacBook Air; the Mac Mini is retired. Claude Code is installed at `~/rcn` with alias `rcn`; a `CLAUDE.md` carries project context.

**Personal context**

Marc is a physician (emergency medicine background) with deep roots in Whatcom County, WA, and ancestral connections to southern Louisiana. He cycles seriously and owns multiple bikes. He has a longstanding interest in film theory, philosophy of mind, and systems thinking as intellectual pursuits alongside his civic work. Mark Twain's prose discipline — say it once, plainly, stop — is a standing standard for all work products.

**Top of mind**

Marc has been actively building out Rent Band Analysis (RBA v1.2), the Wardley map / RCN Graph Tool pipeline, and the Interactive Wardley Map Generator export-for-RCN integration, with a bicycle production map as a recent test case. He is researching single-location health and wellbeing service aggregation models in Atlanta (The DEN at Jean Childs Young, Mercy Care, HEALing Community) as reference points for an initiative referred to as "RCN." The WWHA cooperative health structure and its RenDanHeYi mapping remain active, as does the Chase extraction project (sessions complete through Session 6, with Diagram #6 virtuous-loop work pending). The Systems as a Second Language (SSL) curriculum and FedWiki module production (Modules 1–2 delivered) are in progress with Kerry.

**Brief history**

*Recent months*

**Chase extraction / WWHA:** Six structured sessions extracting Dave Chase's *CEO's Guide* and *Relocalizing Health* into Six Contexts files, CLDs (R1–R5 loops named), actor maps (Diagrams 1–5), and context syntheses. Diagram #6 (virtuous community-ownership loops) is the outstanding deliverable. Key standing finding: R1 Broker Loyalty and R5 Profitable Blindness fall only to ERISA fiduciary practice. WWHA cooperative structure mapped to RenDanHeYi with a v22 Graph Tool JSON (17 nodes, 27 edges). Dave Chase is a WWHA member.

**RCN Graph Tool (v22) and tooling ecosystem:** Graph tool iterated to v22 with CLD loop detection, EIP mode, Dagre layout, Graphviz DOT import/export, XMILE import, `.mdl` Vensim import/export, polarity encoding, driver tree export, and a v23 schema proposal (variable boolean, linkType for loop exclusion, U-type loop badge). Validator `validate-rcn-graph.js` lives at `~/rcn/rcn-graph-json/scripts/`. CLD viewer at `~/rcn/tools/cld_viewer.html`. Canonical RCN Graph Tool JSON rules (src/tgt, full node objects with numeric w/h/shape, cldLoopNames as sorted comma-joined key objects) are standing.

**Rent Band Analysis (RBA v1.2):** Co-developed method combining Wardley evolution with Robertson's growth curve. Three instruments: Two Progressions diagnostic, Fit Grid (BASE: crew × Wardley stages; DERIVED: four positions), rent band notation (pinned/shadow nodes, coral rent band, pin glyph linked to CLD loop ID, pressure arrow with Tullock costs). Pinning test is conjunctive. Full spec at `~/rcn/Rent-Band-Analysis-Method.md`. Wardley map generator HTML adapted for RCN context; Export for RCN Graph Tool button implemented; AI justification prompt strengthened.

**Bellingham downtown / Christopher Alexander pattern work:** Applied *A Pattern Language* to downtown Bellingham merchants using Six Questions flip-chart sessions. Delivered: 30-pattern subset by agency tier, crosswalk against merchant sessions, three-way alignment with City Downtown Urban Village Plan (2014/2025), PDF versions. Key finding: Arcades (pattern 119) is highest-leverage gap; rain/weather protection absent from City plan. Comparable projects in Superior and Lansing noted. FedWiki site `apl.localhost:3000` holds all 253 pattern texts (accessible to Claude Code only).

**Systems as a Second Language (SSL) curriculum:** Ashby's Law and Conant-Ashby Theorem as foundational (named explicitly at Module 5). Six-level European framework with Brunerian spiral. Two FedWiki modules delivered (rcngraph item type for in-page drawing slots, answer-space markdown blocks, Graph Tool available from start). FedWiki import format confirmed: slug-keyed wrapper, minified single line, `markdown` items.

**Shared Care Plan (SCP) Coupler:** Patient-controlled record built on Lawrence Weed's POMR/PKC. SMART on FHIR patient-launch module (port 8767, Epic/PeaceHealth endpoint), Option Box module (port 8768, natural frequencies, RAC matrix for harms), PANAS PA-10 as activation proxy. Handoff documents produced for Claude Code. AGPL-3.0 / CC-BY-4.0 IP strategy; HIPAA boundary analysis completed; Washington My Health My Data Act and FTC HBNR noted as operative regimes.

**SODOTO credentialing:** Five NDC issuers with Ed25519 keys in `~/rcn/veramo/`. Portfolio pages for Marc, Kerry, Noah Williams. `wiki-plugin-sodoto-badge` installed. Symmetric three-handshake model confirmed; dual-purpose witnessing (Kerry's witness of Noah's Do One closes two gates simultaneously). **Standing next-session task:** issue credentials for e-VSM Basic/Intermediate/Site Manager, EIP Basic/Intermediate/Expert, Stock and Flow Diagramming using v0.4 format with attempt arrays.

**Foothills Outlook FedWiki:** Converting monthly PDFs to FedWiki at `foothillsoutlook.relocalizecreativity.net`. Sept 2025 done; April 2026 in progress. Image URL pattern: `/assets/pages/image-assets/img-NNN.png`. Tier 1 resource pages must carry forward. Workflow: one chat per issue, PDF + prior issue resources JSON + TFO-FedWiki-Conversion-Guide.md as inputs.

**Overall Schema (RCN):** v0.1 produced (32 nodes, 63 edges). 14 node labels established. Graphviz EIP schema cleanup done. Open decisions for v0.2 flagged for Kerry review.

**Causal Loop Diagram methodology:** CLD edge conventions locked: black (#444444), +/− polarity, `//` delay marks, no color encoding. Sailed-with-Rob-B narrative used as test case. Vensim `.mdl` round-trip confirmed. OPM integration handoff document produced for Claude Code.

*Earlier context*

**e-VSM (formerly SOFI/SOFI-VSM):** Renamed April 2026. Family: e-VSM/Survey, Diagram, Dialogue. FedWiki aggregator plugin with Claude API synthesis, world-set filter (Exclusive/Inclusive), compare mode, sofi-proxy.py (port 8765), launchd agent. Generic Neighborhood Development Center survey: 11 spheres, 66 directed edges, Markov Blanket layer mapping. Municipal SOFI design (28 world categories) initiated. SODOTO SOFI Certificate program planned.

**SensiMod (Vester):** Vite/React app at `~/sensimod`. Steps 0–2 implemented (System Description, Variable Set, System Criteria). Impact Matrix design (multi-group workflow, consensus on high-variance cells) planned. Nine Domains of Neighborhood Life established. Combination operators (Accumulate, Equal weight, Loudest voice, Weakest link) designed. Part 1–4 chapter summaries of *The Art of Interconnected Thinking* produced and saved.

**Neo4j / PostGIS GIS architecture:** Hybrid: Neo4j for graph relationships, PostGIS (Docker) for authoritative spatial operations. `place_geo` table with geography(Point) and geometry(Geometry) columns. NDC boundaries loaded (Superior AZ, Lansing MI, Maple Falls WA). FastAPI server (`rcn_api.py`) and Leaflet map (`rcn_map.html`) built. CONTAINS/OVERLAPS relationships mirrored to Neo4j.

**CfA-dSC (Conversations for Action / Dyadic Smart Contracts):** State machine, JSON schema, TypeScript validator (25 tests), HTML contract creator UI. Veramo DIDs for Marc, Kerry, Patient A, CHW A. Three-currency model (fiat, time-dollars, gift) with `time_max_pct` and Ed25519 signing. FedWiki write route via sofi-proxy.

**Whatcom Court FedWiki:** `court.relocalizecreativity.net`. 145-page SVG-derived site. Decision Maker annotation system (🪢 Shared, 🔒 DOC, 🎯 Prosecutor, etc.) with index page. Import format confirmed. Concordance audit and typo-fix bundles produced.

**Civic Activation Measure (CAM):** 40-item candidate pool (v0.1) modeled on PAM methodology. Rasch measurement approach. Open-governance clause: all items, calibration data, control files published in commons. Next step: review with Kerry, field to 50+ respondents, run through Winsteps. Marc trained in Rasch by Benjamin Wright and Mike Linacre.

**RCN Map tool:** Leaflet + PostGIS + FastAPI. Mac Mini retired; hosting path TBD. Issue polygon system designed (Neo4j IssuePolygon, Parcel, Preference, GovernanceAction nodes). Backyard chicken test case in Superior (ARS §9-462.10 preempts municipal prohibition).

*Long-term background*

Marc has spent decades working at the intersection of community health, cooperative economics, and systems thinking. His core organizing principle — freedom and solidarity require participation in all decision-making affecting others — emerged ~20 years ago. He co-founded RCN with Kerry Turner around a "one million neighborhoods" vision (7,000–10,000 person scale as the primary governance unit). He has 27 years of TheBrain use. He helped implement Epic systems ~20 years ago and led a whole-community medical record project in Whatcom County. He was personally trained in Rasch measurement at the University of Chicago and helped field-test the PAM through the Robert Wood Johnson Foundation's Pursuing Perfection program.

Key long-term intellectual anchors: Beer's VSM, Ostrom's polycentric governance, Alexander's pattern language, Vester's biocybernetics, Meadows' leverage points (extended with Kerry to 14+2 including Time and Place), Ashby's Law and ERT (Mick Ashby), Friston's Free Energy Principle, Follett's group ontology, RenDanHeYi (Haier/Zhang Ruimin), Weed's POMR/PKC, and Fernando Flores' speech acts. Ward Cunningham (FedWiki creator) is a collaborator; Michael Mehaffy connects Alexander's work to Marc's pattern commons interest.

**Other instructions**

- Never use the word "legible" except in its literal sense (ability to read printed/handwritten text).
- Avoid the negation-correction frame ("This isn't X, it's Y"). State points directly.
- Ask Marc every time before choosing a document format (FedWiki Format, HTML, docx, PDF, or .md). Exception: pipeline/session files stay .md. Never default to .docx. Always call present_files on deliverables. RTF is off the menu.
- e-VSM naming: never use SOFI or SOFI-VSM going forward. All prior work is continuous with e-VSM.
- Marc uses "Research Prompt" to trigger the structured research session mode (two-part prompt stored in prior memory items 16–17).
- FedWiki conversation transcripts: `markdown` type items only, bold speaker labels, full turns from first prompt, inline provenance tags [H]/[C]/[C→H]/[H→C]/[H↔C], no separate provenance paragraphs.
- RCN tools: light backgrounds, dark text by default. Pure black (#000000) for text/lines/edges/borders unless deliberate design reason. Dark themes as explicit toggle only.
- Mac Mini is retired; all work is on the MacBook Air.
- Do not include "Sunday night" or "Mornings with Marc and Claude" framing.
- Proactively route tasks and tell Marc when to switch to Claude Code (validation, filesystem, ~/rcn integration) vs. chat (web research, synthesis, drafts, cross-project connections). Flag the switch point explicitly.
- Running learning log: `rcn-claude-guide-notes.md` (DID/LEARNED/OPEN format) in `~/rcn`; Marc re-uploads or pastes in future sessions.
