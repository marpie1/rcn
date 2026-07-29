# RCN tools — live or parked? A checklist for Marc

**Why this exists.** `tool-inventory.md` lists every tool and what each one
demands of the substrate schema. It is exhaustive, not prioritised. The schema
should not pay a design cost for something abandoned — but it also must not
quietly close off something that matters. Only Marc knows which is which.

## How to fill it in

Mark each line. Two independent questions:

- **`[x]`** — **live.** You care about this; the schema should cover it.
  Leave `[ ]` for parked. Delete the line for dead.
- **`!`** at the end of a line — **must federate.** It has to read from or write
  to the shared substrate, not just exist. A tool can be live and still be
  perfectly happy as a standalone file tool.

So `- [x] **rcn-timeline** — temporal layer !` means live *and* must federate.
`- [x] **bias-checker** — …` means live, standalone, leave it alone.

Anything you are unsure of, put `?` and we will talk about it.

---

## 1. Graph tools

- [ ] **graph-tool-v22** — the main diagram tool. CLD, EIP, NRM, OPM, SFD modes
- [ ] **graph-composer** — composes graphs from families.js + graph-sets.js; the four levels
- [ ] **ibis-map-rcn** — IBIS argument map (issue / position / argument)
- [ ] **wardley-map-generator** — value chain × evolution axis
- [ ] **sfd-stella-approach** — stock & flow, Stella style
- [ ] **cfa-dsc-creator** — Conversation for Action → digital smart contract
- [ ] **eip_integration_explorer** — EIP explorer
- [ ] **eip_local_finance_diagram** — EIP local finance
- [ ] **conversation-navigator-flow** — conversation flow
- [ ] **graphjson_to_vensim_cld** — exporter, graph JSON → Vensim
- [ ] **create-rcn-graph-tool-page** — FedWiki page generator for graphs
- [ ] **wiki-plugin-rcn-graph** — FedWiki plugin that renders graphs
- [ ] **Network Graph HTML files** ×12 — early experiments, `Network Graph HTML files/`

## 2. Time

- [ ] **rcn-timeline** — intervals, fuzzy dates, before/meets. Sibling of graph + map

## 3. Place

- [ ] **rcn_map** + `rcn_static_data.js` — the live RCN/NDC map
- [ ] **issue-polygon-map** — editable parcels, GeoJSON, deep links
- [ ] **regions.json / region federation + forking specs** — how regions federate

## 4. Quantity and measurement

- [ ] **vester (SensiMod)** — impact matrix, active/passive sums. React app
- [ ] **evsm-aggregator** — value stream survey aggregation
- [ ] **evsm-report** — eVSM reporting
- [ ] **evsm-svg-v3** — eVSM drawing
- [ ] **evsm_excel_tool** — eVSM spreadsheet path
- [ ] **bias-checker** (+ intro, manual) — hosted at Wiki Café, Firebase for DB.
      **Not graph-shaped** (Marc, 2026-07-28) — never needs a projection

## 5. Health and the person record

> Decision already taken: PHI gets a **separate substrate**, same shape,
> federation and gold-node merging off. Mark these for *live*, not federate.

- [ ] **SCP plugins** ×19 — about, access, agent, diagnosis, directive, factory, field, goal, history, lab, medication, next-step, polst, provider, reaction, symptom, visit, vital, wishes
- [ ] **my-health-picture** — PHS
- [ ] **my-health-choices** — PHS
- [ ] **my-support-network** — PHS
- [ ] **scp-optionbox** — option box / decision aid
- [ ] **scp-coupler** — Problem-Knowledge Coupler, port 8766
- [ ] **scp-fhir** — Epic FHIR connector, port 8767, PeaceHealth
- [ ] **patient-admin** — admin surface
- [ ] **scp-chat** — chat surface

## 6. Credentials, identity, trust

- [ ] **sodoto-issuer** — See One, Do One, Teach One badge issuer
- [ ] **wiki-plugin-sodoto-badge** — FedWiki badge plugin
- [ ] **veramo** — DIDs, keys, verifiable credentials
- [ ] **sodoto-crypto-test** — crypto test harness
- [ ] **contract-creator** — contracts / commitments

## 7. Text, outline, deliberation

- [ ] **more-outliner** + **wiki-plugin-rcn-outliner** — MORE outliner, npm v0.2.0
- [ ] **groove-workspace** — Groove, port 3001
- [ ] **conversation_index** — LLM session index
- [ ] **session-builder** — session instruction builder
- [ ] **checklist-test** — checklist layout test

## 8. Shared vocabularies — probably all live, confirm anyway

- [ ] **families.js** — the eight node families. One source
- [ ] **edge-families.js** — the seven relation families. New, this session
- [ ] **rcn-icons.js** + **rcn-icon-sheet** — the icon library
- [ ] **graph-sets.js** — one-click graph sets
- [ ] **tools/schemas/*.md** — written schemas for chat-Claude

## 9. Infrastructure

- [ ] **fedwiki-page/scripts** — importer bundle generation
- [ ] **sofi-proxy.py** — SODOTO proxy, port 8765
- [ ] **data/rcn_api.py** + Superior AZ loaders
- [ ] **deploy/** — Caddy, plists, FedWiki hosting

---

## Reference data (not tools — no checkbox needed)

`eip-schema-cld.json` (26 nodes, the Stage 2 target) · `eip-aspects/` and
`eip-aspects-variabilized/` (16 each) · `eip-cld-subgraph-mismatches.md`
(23 open decisions) · `bgte-12-triples.json` · `pomr-*.json` ×5 ·
`neighborhood-cave-drawing.json` (the Cave Drawings exemplar) ·
`education-human-becoming-cld.json` · `southern-louisiana-actor-map-v22.json`

---

## What your answers change

- **Anything unchecked** — the schema stops stretching for it. Rows in
  `tool-inventory.md` §4 that only that tool demanded can be closed.
- **Anything marked `!`** — it needs a projection, which means a Cypher query
  plus a fetch path in the tool. That is the real cost, roughly a day each.
- **Wardley, bias-checker, the 12 legacy graphs, session-builder, checklist-test**
  are the five I most suspect are parked. If they are, several open coverage
  rows close immediately.

## Already answered — no need to revisit

- ~~Does MORE federate?~~ **No.** MORE stays a file tool. That removed the only
  demand for ordered relationships and closed most of row 9.
- ~~Reification?~~ **Lookup, not traversal.** `(:MetaEdge {tgtEdgeId})`
  referencing the edge by id, as graph-tool already does with `tripleId`.

- ~~Is bias-checker graph-shaped?~~ **No.** It never needs a projection.
- ~~Family on `:Concept` vs a `:Schema` node?~~ **Consistency check added to
  `seed.py`**, `:Schema` node deferred until write-back. Family is derived from
  `families.js` on every load, so today a mismatch is unreachable; the check
  catches the day that stops being true.

Row 9 (containment) is now **closed**.

## Still waiting

1. Does **Wardley** belong in the substrate, or is it a standalone lens?
2. Everything above — the actual checkboxes.
