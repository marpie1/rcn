# Rent Band Analysis (RBA)

**Status:** Method definition v1.2 — 20 July 2026
**v1.2 changes:** Fit Grid rebuilt on Wardley's own evolution stages (base grid) with Robertson's nomenclature in the rows and Microsoft as the single running example, cell by cell; the four positions restated as the derived compound view; the dam identified as a column-straddle; split-cell reading of Pioneers × Commodity (terrain vs substrate); new Part 4 on the vertical axis and transmission (RenDanHeYi); five-image teaching sequence noted in Part 6.
**v1.1 changes:** "Two Clocks" renamed **Two Progressions**; pinning-test failure clause disambiguated; shadow claim reworded as forecast ("when the dam breaks"); structured `rent` object and display location; `pressure` upgraded to an object carrying resisting mechanisms and their costs.
**Origin:** Marc Pierson + Claude session on Wardley Maps and Peter Robertson's *Always Change a Winning Team*. Marc and Kerry Turner know Robertson personally; the Robertson terminology and the attachment reading below should be validated with him before the method is treated as settled.
**Purpose:** (1) canonical method reference for RCN and future Claude sessions; (2) implementation spec for Claude Code to extend the RCN Graph Tool.

---

## One-paragraph summary

Rent Band Analysis diagnoses and depicts *pinning*: the deliberate, costly prevention of a component's evolution toward commodity in order to preserve economic rent. Its instruments: the **Two Progressions** diagnostic reads the phase relationship between an organization's position on Robertson's growth curve and its components' positions on Wardley's evolution axis; the **Fit Grid** evaluates whether the crew matches the terrain and names the misfit when it doesn't; the **rent band notation** extends the Wardley map to draw the gap between a component's actual (pinned) position and its forecast (unpinned) position as a first-class, measurable object; and the **transmission reading** of the map's vertical axis locates where pinning can nest and why direct contracting breaks it.

---

## Part 1 — Vocabulary

**Economic rent.** Payment above what is needed to keep a resource in its current use.

**Legitimate rent.** Self-liquidating rent. The innovator's premium: created by moving ahead of the evolution wave, eroded by competition as the component evolves. Everyone understands going in that it expires. This is the incentive that funds genesis work (Schumpeter).

**Pinning rent.** Rent preserved by sabotaging the expiration mechanism — holding a component left of where competition would carry it. Same gap as legitimate rent, opposite maintenance: one is paid for creating the gap by advancing, the other for preserving it by blocking.

**The pinning test** — all three conditions must hold:
1. Someone profits from the gap between actual and evolved position.
2. They actively spend resources keeping the gap open.
3. The spending targets the buyer's blindness, not the product's genuine difficulty.

**The test is conjunctive.** If a component sits farther left on the evolution axis than expected, but one or more of the three conditions is absent, do not diagnose pinning. The slowness is real but has a different cause — honest complexity, safety regimes, coordination cost, or status inertia (Weed's physicians resisting knowledge tools: self-deceiving, but not engineered). Each cause takes a different remedy: education and generational turnover for inertia; patience and standards work for coordination cost; fiduciary enforcement, transparency mandates, buyer coalitions, or direct contracting for pinning. Pinning requires all three conditions; anything less is a different disease with a different cure.

**Key correction to the naive framing.** Pinning is not "getting paid for doing nothing." It is enormously laborious (Tullock's rent-seeking cost): Discount Kabuki employs armies of negotiators; PBM rebate structures are engineering marvels of obfuscation. The activity is real; its entire product is prevented evolution. This is why people inside the dam experience themselves as diligent experts — within the pinned frame, they are.

---

## Part 2 — The Two Progressions diagnostic

Two independent progressions, read jointly. Each has a direction and an order; nothing requires them to advance at the same rate — reading their phase relationship is the diagnostic.

- **Progression 1 (Robertson):** where is the *organization* on its own growth curve? Front of curve (exploration) → mid-curve (growth, optimization) → late curve (consolidation). Mechanism: attachment theory — people have natural homes on the curve.
- **Progression 2 (Wardley):** where are the *components it depends on* on the evolution axis? Genesis → Custom-built → Product (+rental) → Commodity (+utility). Mechanism: supply/demand competition; drift rightward is climate, not choice.

These are different curves — Robertson's is one traveler's lifecycle, Wardley's is market-wide component maturation. Keeping them distinct is the point.

### Robertson's nomenclature (to be validated with Peter)

- **Growth curve** (S-curve): the organization's own lifecycle.
- **Second curve:** the jump a winning organization must prepare before the first curve tops out. The book's title is the instruction to make that jump early — change the team while it is still winning.
- **Strategic diversity:** a team distributed across the whole curve rather than clustered at one segment. A team of all-explorers or all-stabilizers is fragile even when every member is excellent.
- **AEM-Cube axes:** **Attachment** (people ↔ matter — where a person finds the security that licenses risk-taking); **Exploration** (explorative ↔ stability-seeking — which curve segment they naturally serve); **Managing Complexity** (specialist ↔ generalist — how wide a slice they hold).

The Exploration axis maps directly onto Wardley's crews. The Attachment axis has no Wardley counterpart and splits each crew into two flavors: matter-attached pioneers explore through content — tools, systems, ideas; people-attached pioneers explore through relationships — new social arrangements, new groups. Likewise for settlers and town planners (a people-attached town planner stabilizes institutions and rituals; a matter-attached one stabilizes infrastructure). Strategic diversity therefore requires coverage on both axes.

Crews carry three lineages of names, converging on the same three temperaments: Wardley's Pioneers–Settlers–Town Planners (named by terrain), Robertson's explorative–optimizing–stability-seeking (named by mechanism), Cringely's commandos–infantry–police (the acknowledged ancestor of Wardley's set). Three independent derivations of one structure is evidence the structure is real.

### The base Fit Grid (crew × Wardley stage)

Columns are Wardley's own evolution stages. Rows are the crews with Robertson's labels. The running example is Microsoft, whose fifty-year history visits nearly every cell — a single well-known case so the grid teaches itself.

| Crew | Genesis (novel, uncertain) | Custom-built (bespoke, rare) | Product (standard, scaling) | Commodity (utility, assumed) |
|---|---|---|---|---|
| **Pioneers** — explorative, front of curve | **FIT — home terrain.** Explorers thrive where nothing is settled. *Altair BASIC, 1975: written before a PC market existed.* | **FIT — first harvest.** Pioneers harvest the first custom applications of a novelty. *MS-DOS, 1981: a hurried bespoke build for one client, IBM.* | Misfit: *creative sabotage.* Explorers rebuild what only needs shipping. *Longhorn reset, 2004: pioneering ambitions (WinFS) collapsed a product-stage OS; Vista shipped years late.* | **Split cell.** As terrain: misfit — nothing left to explore. As substrate: **FIT ★** — *Microsoft's founding bet: let hardware commoditize, invent the layer above.* See "riding the wave" below. |
| **Settlers** — optimizing, mid-curve | Misfit: *premature hardening.* Standardizing before exploration finishes. *Windows Mobile: the desktop paradigm hardened onto phones while the phone question was still open; the iPhone reopened it.* | **FIT — steal and improve** (Wardley's phrase). Settlers productize rough early work, theirs or others'. *Excel and Word out-refined VisiCalc, Lotus 1-2-3, WordPerfect.* | **FIT — home terrain.** Scale, polish, margin. *The Office suite through the 1990s.* | Partial fit: *kaizen only.* Real value in a narrow seam. *Office 365 continuous improvement.* |
| **Town planners** — stability-seeking, late curve | Misfit: *process kills exploration.* Stage gates measure what genesis can't yet show. *Courier tablet, 2010: killed in a portfolio review, never tested by a market.* | Conditional: *standards too early.* *OS/2 with IBM: productivity measured in thousands of lines while the architecture was still being discovered.* | **FIT — industrialize.** *Volume licensing, certification, update infrastructure.* | **FIT — home terrain.** Reliability at scale. *Azure datacenter operations today.* |

Reading the grid: the fit cells trace the **handoff diagonal** — pioneers open Genesis and Custom, settlers steal and carry Custom into Product, town planners industrialize Product into Commodity. A healthy organization moves work down-and-right along this diagonal, re-crewing ahead of the movement (Robertson's rule: while still winning, not after the misfit hurts).

**The dam on this grid: a column-straddle.** The dam does not occupy a column; its components are held in Custom-built while belonging in Commodity, and the rent band is exactly that straddle drawn on a map. Microsoft's instance: the browser wars. Windows profited from the gap between where the web-application layer was and where it was heading; Internet Explorer was given away free and web standards deliberately fragmented — spending aimed at keeping buyers and developers from seeing the browser as a neutral commodity runtime. The DOJ trial documented the pinning budget in discovery: one of the few dams whose maintenance costs became public record. The arc also shows dam failure and the second curve in one story — the pin held a decade, broke anyway (Firefox, Chrome, the cloud), and the company survived only by jumping to a new curve, riding the commodity-cloud wave it had once resisted.

### The four positions (derived view)

The positions from earlier drafts are compound states: a region of the base grid crossed with the organization's own curve position.

| | Components still evolving | Components commoditized |
|---|---|---|
| **Org late on its curve** | **The dam** — the Custom↔Commodity straddle, held. No crew fits it: pioneers are exiled inside (or become the attackers outside), settlers become the kabuki workforce, town planners its engineers. Lucrative and fragile. *Ex: brokers, TPAs, PBMs; IE-era Microsoft.* | **The utility** — town-planner home cells, organization in phase. Healthy if chosen knowingly. *Ex: FedWiki farm, self-hosted Keycloak, Azure operations.* |
| **Org early on its curve** | **Double frontier** — pioneers row over Genesis/Custom when the substrate is also unsettled. Uncertainties multiply; smallest bets; loose coupling to substrate. *Ex: SODOTO on Veramo.* | **Riding the wave** — the split cell: Genesis work sitting vertically on Commodity components in the value chain. Fast, cheap experiments; all uncertainty budget on the novel thing. *Ex: SCP Coupler on SMART on FHIR; software atop commodity x86.* |

The dam column of the crew view contains no fit at all — every temperament placed there is expelled, corrupted, or wasted. That is itself a diagnosis: the dam is not a stage of organizational life but a place organizations get stuck, and the stuck-ness manifests as talent misapplied.

### Dynamics

- Everything drifts: components rightward (Wardley), organizations along their own curve (Robertson). Wave-riders become utilities benignly; frontier successes become **dams by default** unless the winning team is deliberately changed. Today's pinners were often yesterday's genuine innovators.
- Standing diagnostic questions per project: (a) where is this effort on its own curve? (b) where is each component it depends on, and where is it going? (c) are these the positions we would choose? (d) does the crew match the terrain (Fit Grid), on both the exploration and attachment axes?

RCN portfolio reading: deliberate presence in three positions; the fourth (the dam) is the adversary's home square in the Chase work.

---

## Part 3 — The rent band notation (Wardley map extension)

Standard Wardley maps show where components are. This notation adds where a pinned component *will be* when pinning fails, and renders the gap.

### Elements and the claim each one makes

1. **Pinned node** (solid, coral family): the component's actual position. Ordinary Wardley node with a flag.

2. **Shadow node** (dashed outline, teal family, no fill): the forecast position — **"when the pinning investment stops — when the dam breaks — competition will locate the component here."** The shadow reads two ways at once: counterfactual present (where it would already be, absent pinning) and forecast (where it lands when the dam fails). Lead with the forecast reading: it converts the map into a prediction the defenders must publicly bet against, which is rhetorically stronger than disputing a hypothetical. Falsifiable and estimable from comparables (see evidence bases).

3. **Rent band** (translucent coral band spanning pinned→shadow at the node's visibility level): the excess rent, rendered as a measurable object. **Display:** the rent figure appears as a label at the band's midpoint (e.g., "$1,850 / employee / yr"); hover reveals the evidence basis and as-of date; the FedWiki export carries the full rent object into the node's page. Data source example: for a self-funded employer the pricing band is the spread between billed-through-TPA and reference-based pricing.

4. **Pin glyph** (small pushpin above the pinned node) carrying a **loop ID** referencing the CLD mechanism maintaining the pin (e.g., pricing pinned by R2 Discount Kabuki; claims data by R5 Profitable Blindness). The Wardley map shows where the dam is and how much head of water it holds; the CLD shows the machinery holding it closed. In FedWiki: pin glyph links to the loop page. Hover: the pinnedBy loop names.

5. **Pressure arrow** (dashed, teal, inside the band, pointing right): demonstrated evolutionary pressure being actively resisted. Distinguishes pinning from mere immaturity: an immature component has no arrow; a pinned one has a taut arrow. **Hover annotation (required):** the arrow carries a note listing (a) the *forces* pushing rightward — buyer demand, statutes, commodity-form competitors — and (b) the *resisting mechanisms*, each with its CLD loop reference and its **annual cost to the resistor** (the Tullock cost). Surfacing resistance costs does double duty: they measure how laboriously the rent is maintained, and they gauge fragility — a dam whose maintenance budget grows faster than its rent is a dam near failure. Track this as a leading indicator.

### Evidence bases for shadow placement

- Comparable components that were allowed to evolve (airline tickets, LASIK — same industry logics, unpinned, fully commodity).
- Cash prices; Medicare reference rates; RAND hospital price transparency studies; reference-based pricing spreads.
- Any market where the component commoditized the moment buyers could see it.

Record the basis with the shadow position. The shadow is an argued inference, not decoration.

### Rhetorical function

Moves the argument from "your prices are too high" (deniable, endless) to "here is where this component sits, here is where its comparables sit, and here is where it lands when the pinning stops — explain the gap." The defender must now argue the shadow is misplaced (an empirical claim they lose) or bet publicly against the forecast, rather than fog a values argument. This is Wardley's own case for maps — assumptions made challengeable — aimed at the assumption that matters.

---

## Part 4 — The vertical axis and transmission (RenDanHeYi)

Wardley's y-axis measures **structural distance from the user**: position in the value chain, anchored at a user need at the top, each component placed by its visibility to that user. Ordinal, not metric. It describes terrain.

The pathology this distance creates in conventional organizations is **signal attenuation**: the user's pull is felt strongly at the top of the map and decays with every managerial layer downward. Deep components become cost centers — paid from budgets, evaluated by internal metrics, insulated from the user. By the bottom of the map, nobody's compensation depends on whether a real person was served.

**RenDanHeYi** (Haier; Zhang Ruimin — "the unity of employee and user value") is a transmission mechanism for this axis. User-facing microenterprises earn from users; node microenterprises (the deep-chain components) earn by contract from the user-facing MEs they supply, with terms that pass user outcomes through; platform MEs provide the commodity substrate. Every ME's revenue is traceable, link by link, to a user.

**The relationship, stated once: the y-axis measures distance; RenDanHeYi governs transmission along it.** Zero distance to the user does not move components up the map — Haier's compressor plants stay exactly as invisible to the refrigerator buyer as before. What changes is conductivity: the user's pull travels the full depth of the chain as a price signal instead of dying in middle management. The map's geometry is untouched; its physics are different.

**Where pinning nests.** Buyer blindness — pinning condition three — is not uniformly available along the vertical axis. It is scarce at the top (users see what they touch) and useless at the bottom (pure commodity leaves no gap to hide). Pinning nests at **middle depths**: components important enough to carry cost, invisible enough to escape user scrutiny. The Chase intermediaries — TPAs, PBMs, brokers — all occupy the mid-chain twilight where the employee never looks and the employer can't see through. **The dam is a mid-altitude structure.**

**The remedy this yields.** Pinning survives on attenuation. Anything that makes the vertical axis conductive is dam-breaking infrastructure: direct contracting (Chase's core remedy is precisely the Haier move — replacing opaque managed intermediation with contracts whose terms trace to user value), transparent pass-through terms, Weed's records readable by the patient. Fiduciary duty then reads as law forcing conductivity onto a chain whose middle profits from resistance. Add "conductivity" to the remedies column of the pinning test.

---

## Part 5 — Graph Tool implementation spec (for Claude Code)

**Target:** `~/rcn/tools/graph-tool-v22.html` (canonical Graph Tool; confirm current filename/version on disk first). Companion: `~/rcn/tools/wardley-map-generator.html` (v10). Validator: `~/rcn/rcn-graph-json/scripts/validate-rcn-graph.js` (authoritative).

### Step 0 — Discovery (do before writing code)

1. `ls ~/rcn/tools/` and confirm current Graph Tool version and whether v23 work has landed.
2. Inspect how the Graph Tool represents diagram types/modes (CLD vs others) and whether a Wardley mode exists inside it, or whether Wardley lives only in the standalone generator. Implement in the Graph Tool's Wardley mode if present; otherwise implement in the generator and plan Graph Tool convergence as part of v23.
3. Read the wardley-map-generator JSON structure (`aiOriginal` / `userEdited` pair, `components` array) and the v22 node/edge schema rules (nodes: `label`, numeric `w`/`h`; edges: `src`/`tgt`, `polarity`, `delay`; `cldLoopNames` keyed by lexically sorted comma-joined node ID sets).

### Step 1 — Schema extension (v23-adjacent; coordinate with the pending v23 proposal: `variable` flag, `U` loop type)

Optional per-node fields, additive only, ignored by other modes:

```json
{
  "id": "pricing",
  "label": "Pricing",
  "evolution": 0.38,
  "shadow": {
    "evolution": 0.85,
    "basis": "RAND hospital price studies; RBP spread; LASIK/airline comparables",
    "rent": {
      "label": "$1,850 / employee / yr",
      "unit": "employee",
      "period": "year",
      "basis": "TPA-billed vs reference-based pricing spread, WWHA 2025 data",
      "asOf": "2026-07"
    }
  },
  "pinnedBy": ["R2"],
  "pressure": {
    "forces": ["CAA fiduciary exposure", "state price-transparency rules", "RBP competitors"],
    "resistance": [
      {
        "mechanism": "Discount Kabuki negotiation apparatus",
        "loop": "R2",
        "annualCost": "negotiation staff + PPO network fees, est. $X",
        "basis": "cite source"
      }
    ]
  }
}
```

- `shadow.evolution`: 0–1 on the evolution axis, same visibility (y) as the node. Required if `shadow` present.
- `shadow.basis`: free-text evidence citation. Strongly encouraged; validator warns if absent.
- `shadow.rent`: optional structured object. If present, `label` and `basis` required; `asOf` strongly encouraged (rent figures go stale and get contested — the band must always answer "says who, and when").
- `pinnedBy`: array of loop names. When the map JSON and a CLD JSON share a workspace, these should match names in the CLD's `cldLoopNames`; validator warns on dangling references if a linked CLD is provided.
- `pressure`: object as above. Each `resistance` entry should reference a `pinnedBy` loop. **Backward compatibility:** `pressure: true` remains accepted and renders a bare arrow with no annotation.

### Step 2 — Renderer

- Shadow node: same shape as node, `fill: none`, dashed stroke (teal ramp), at (`shadow.evolution`, node y).
- Rent band: translucent rounded band (coral, ~0.25 opacity) from node x to shadow x, height ≈ node height + small margin, behind both nodes.
- Rent label: `shadow.rent.label` at band midpoint; hover/tooltip → `rent.basis` + `rent.asOf`.
- Pressure arrow: dashed teal line inside band, arrowhead toward shadow. Hover/tooltip → two-part note: forces (pushing) and resistance mechanisms with loop refs and annual costs (holding). In SVG export use `<title>` elements; in the live tool use the existing tooltip/inspector convention.
- Pin glyph: short stem + dot above the pinned node, coral; hover → `pinnedBy` IDs; FedWiki export emits link to the loop page.
- Respect existing house style (light background, black text/lines default per RCN convention; coral/teal accents are the deliberate exception this notation introduces — confirmed direction, but check palette details with Marc).

### Step 3 — Editor UI

- Node inspector: "Add shadow position" toggle → drag ghost horizontally (y locked to node), fields for `basis`, rent object, `pinnedBy`, and pressure forces/resistance entries.
- Keep the aiOriginal/userEdited discipline: Claude proposes shadow positions, rents, and pressure annotations with bases; Marc/Kerry drag and correct. The correction is the strategy conversation.

### Step 4 — Validator

Extend `validate-rcn-graph.js`: accept the new optional fields; error on `shadow` without numeric `evolution` in [0,1]; error on `shadow.rent` missing `label` or `basis`; warn on missing `shadow.basis`; warn on `shadow.evolution` ≤ node evolution (a shadow left of the node is almost certainly an entry error); warn on `pressure.resistance` entries whose `loop` is not in `pinnedBy`; warn on dangling `pinnedBy` refs when a CLD is supplied for cross-checking; accept legacy `pressure: true`.

### Step 5 — Round-trip

Confirm import/export symmetry: generator JSON ↔ Graph Tool JSON with shadow/rent/pressure fields preserved; FedWiki page export carries pin→loop links, the rent object, and the pressure annotation into the node's page.

---

## Part 6 — Session workflow for future Claude use

When Marc invokes Rent Band Analysis (or when analyzing any market/system for RCN):

1. Run Two Progressions first: place the organization(s) and each load-bearing component. Name the position occupied and the position drifted-toward.
2. Check the Fit Grid: does the crew match the terrain, on both the exploration and attachment axes? Name any misfit by its grid diagnosis (creative sabotage, premature hardening, process kills exploration, kabuki workforce, dam's engineers).
3. For any component suspected pinned, apply the three-condition pinning test explicitly. Say which conditions hold and on what evidence. If any condition fails, do not diagnose pinning — name the alternative cause (inertia, complexity, safety, coordination) and the matching remedy.
4. Read the vertical axis for transmission: where does the user's pull attenuate, and who lives in the mid-chain twilight? Mid-depth, low-visibility components with high cost are the pinning habitat.
5. Place shadows with cited bases, phrased as forecasts: when the dam breaks, here is where competition locates it. Propose, don't assert — shadows go in `aiOriginal` for Marc/Kerry to correct.
6. Cross-link every pin to a CLD loop. If no loop exists yet, that's the next CLD to draw — a pin without a mechanism is an unfinished analysis.
7. Annotate every pressure arrow: forces pushing, mechanisms resisting, and the resistors' annual costs (Tullock costs). Quantify at least one rent band where data permits, with basis and as-of date.
8. Output discipline: v22+ schema JSON, validator-clean; FedWiki pages per house conventions; prose to the Mark Twain standard.

**Teaching sequence (five images, one idea each):** (1) the position quadrant — where you stand; (2) the Fit Grid — who works where; (3) the Wardley map with rent bands — what is held back and what it costs; (4) the CLD — the machinery holding it; (5) the vertical axis — whether the user's pull gets through. Walking the five pictures in order teaches the whole method; a natural SODOTO curriculum.

**Naming, fixed:** the method is **Rent Band Analysis**. The phase diagnostic is **Two Progressions**. The crew-match table is the **Fit Grid** (base grid = crew × Wardley stage; positions = derived compound view). The notation elements are: shadow node, rent band, pin (with loop ID), pressure arrow (with annotation). The pathological position is **the dam**; on the base grid it is a **column-straddle** (Custom-built ↔ Commodity). The vertical-axis principle: **distance is measured, transmission is governed** — pinning nests at middle depths; conductivity breaks dams.

---

## Part 7 — Implementation notes (Claude Code, 10 August 2026)

Build A of the spec landed in `tools/graph-tool-v22.html` (renderer + schema), `tools/validate-rcn-graph.js` (validator), and `tools/rba-hospital-pricing.rcn.json` (the worked example, reconciled). Step 3 (editor UI — drag the ghost, inspector fields) is deliberately not built yet. Every deviation from Part 5 is listed here.

**Wardley mode already existed in the Graph Tool, so Step 0.2 decided the consolidation question by its own rule.** `renderWardleyLayer()` was already drawing the evolution grid and the value-chain axis, and the generator's JSON already imported into it. RBA was built there. `wardley-map-generator.html` was left alone; whether it retires is a separate call with no bearing on this work.

**Two axis conventions, reconciled at the boundary.** The method's `evolution` runs 0=Genesis → 1=Commodity, increasing rightward — the standard Wardley direction, and the one the shadow-right-of-node rule assumes. The Graph Tool's own `wardleyX`, inherited from the generator's export format, runs the other way: 1=Genesis, at the left. Nothing was renamed. `rbaX()` and `rbaEvFromX()` are the only two functions that know about the flip, and everything stored in the file uses the method's direction. This conflict was not visible in the spec, and it is the one that would have silently mirrored every map.

**`evolution`/`visibility` are authoritative; `x`/`y` are derived.** The example arrived carrying both, disagreeing by about 200px, which is what two independent copies of a position always eventually do. In Wardley mode the px pair is now recomputed from the 0–1 pair on load, and the 0–1 pair is written back from px when a drag ends. Consequence worth knowing: dragging any node in Wardley mode stamps `evolution` and `visibility` onto it, including nodes that had neither.

**`pressure.resistance` is canonical; `resistors` is read but warned.** Part 5 Step 1 and Step 4 both say `resistance`; the handoff summary and the original example said `resistors`. The renderer accepts either. The validator accepts either and warns on `resistors`, so the two spellings cannot quietly diverge.

**`pinnedBy` should carry loop NAMES, not `R#`/`B#` labels.** Those labels are assigned in loop-detection order (`cldLoopCounter` in the CLD engine) and renumber whenever the CLD is edited, so a pin written as `"R2"` points at a different loop after the next edit. The stable identity is the user-set name in `cldLoopNames`. The validator warns on any bare `R#`/`B#` pin, and the example was rewritten to `"R2 Discount Kabuki"` and friends. `--cld <file.json>` cross-checks pins against a supplied CLD.

**`mode` is now persisted at the top level of the file, and `meta.mode` is honoured on load.** Nothing previously recorded which mode a diagram belonged to, which is survivable for CLD and fatal for a Wardley map — open it in the wrong mode and the grid is gone and the rent bands with it. Top-level `meta.name`/`meta.notes` are also rescued into `modelName`/`modelNote` on load, since a top-level `meta` block is dropped on export.

**The band encloses both boxes rather than running centre to centre.** A band that stops at the shadow's centre draws a hard edge down the middle of the shadow, and the result reads as two boxes rather than one forecast position. The rent label still sits at the midpoint of the pinned→shadow span, which lands in the open gap.

**The pressure arrow carries a transparent 18px hit band.** A 1.8px dashed line cannot be hovered, and the arrow's annotation — forces, mechanisms, Tullock costs — is the thing that distinguishes pinning from immaturity. Same trick every edge in the tool already uses.

**Hover text and SVG `<title>` come from one function.** `rbaTipLines()` feeds both, so a printed or federated map answers "says who, and when" in exactly the words the screen does.

**Two spec rules were tightened to errors, not warnings.** `shadow.rent` missing `label` or `basis` is an error per Step 1's "if present, label and basis required" — the original example's rent object had no basis and now does. A `shadow` on a node with no numeric `evolution` is also an error: the band has no near end and nothing renders.

**Deferred, with reasons.** Step 3's editor UI is a second pass. The FedWiki half of Step 5 is unbuilt: the method wants a pin glyph linking to its loop page and the rent object carried into the node's page, but the tool's wiki path (`sendToWikiSVG` / `sendToWikiItem`) emits an SVG ghost page and a JSON round-trip, not per-node pages — that is a FedWiki-side design question, not a renderer one.

**Two things the spec left open, still open.** The coral/teal hexes were chosen as `#e2725b` and `#2a9d8f` (with `#8c3520` for coral text on the band, for contrast); Part 5 says to check the palette with Marc. And the example's `visibility` values order the value chain upside down relative to its own px layout — claims data reads as more user-visible than broker advisory. They were kept as written, since `evolution`/`visibility` are now authoritative and inventing numbers would be worse; dragging the nodes and re-exporting fixes the file.
