# EIP Stage & Substrate — To Do

Working list from the EIP Stage design conversation, Aug 8 2026. Nothing here is built unless marked done. Items are grouped by what they block, not by size.

## Decide first — these gate other work

- [ ] **Action situation as a node type, or implicit in a subgraph?** Marc names it "problem" in some diagrams. Explicit is codeable and comparable; implicit (institution + function + zone joined by edges) is less to draw at a fire. This is the one structural gap between what exists and IAD-codeable data.
- [ ] **Rules-in-form vs rules-in-use: two properties on one node, or two nodes with an edge?** Two nodes lets evidence and disagreement attach to the gap itself, which is where the argument lives. Note "de facto vs. de jure" is already a node in the Ostrom CPR reference diagram.
- [ ] **P → E direct arrow: obligation or mechanism?** Marc's triangle draws "Protect & Sustain" directly. Proposal: draw it dashed as *is responsible for*, distinct from solid *acts on*, so the emblem states the duty without teaching that politics reaches the river without passing through institutions.
- [ ] **Where do common rules live — P or I?** Marc's sketch puts common rules in P and actors & actions in I; Ostrom's definition makes an institution the rules-in-use. Reconcile before anything is coded, because it decides where a rule node goes. Marc's note: all political entities are institutions, with a distinction, and all institutions have roles and every aspect of IAD.
- [ ] **Does the person appear on the stage?** RESOLVED by Marc: the right side is a list of political entity *types*, each prompting "do you need to add particular instances?" — so CLDs carry named individuals or roles as appropriate. The campfire attendees are the **audience** looking at the stage, not nodes on it. Remaining work is expressing this so a newcomer reads it that way.

## EIP Stage — rendering

- [ ] **Can the underlay be implemented in the RCN Graph tool? Yes or no.** Answer this first; everything visual downstream depends on it.
- [ ] Move the E/I/P wash beneath the content. `#eip-overlay` is currently an HTML div at `z-index:2` with `opacity:.13` painting over everything. One change fixes two symptoms: the statement panel reading green-then-purple, and node fills desaturating once fill carries meaning.
- [ ] Bands as SVG rects in canvas coordinates, in a layer below `lines-layer`. Today `positionEIPOverlay()` measures screen pixels and `eipColForX()` converts through zoom and pan, so panning changes a node's column and the bands vanish from every export.
- [ ] Change the split from equal thirds to 25/50/25 (`EIP_COLS` x1/x2 plus the thresholds in `eipColForX`).
- [ ] Consider the two grounds as overlapping washes rather than three tiled bands: 25% E only, 50% both, 25% P only — because you live in both while solving problems, so the middle is the double-membership zone.
- [ ] Store band boundaries in `graphAttrs` so they are part of the document, and consider draggable band edges.
- [ ] Drop the EIP fill override at line ~4194. Once the bands are visible, position already says the column, and fill is freed for condition.
- [ ] **A way to display hysteresis.** E is a slow stock with long delays and asymmetric recovery — fast to break, slow to build. A balancing loop through E with no delay mark reads as though it corrects promptly, which is how a group talks itself into thinking there is time. Not widely understood; worth doing well.
- [ ] Indicate the four failing-to-solve states distinctly: nobody is doing it (start something) · someone is doing it badly (fix or help) · someone is making it worse (stop them) · nobody here knows who is doing it (go find out). The last is a knowledge gap, not a governance gap, and must not render the same as the first.
- [ ] The E-I-P emblem — small fixed glyph in the SVG, six arrows: E→I Source & Sink · I→E Sustain · P→I Constrain & Support · I→P Follow Norms & Laws · P→E Protect & Sustain · E→P Support Life.
- [ ] Ghost edge as a **hand** tool: a faint marked-missing arrow carrying the question, who asked, and at which gathering. Not a detector — the group does the noticing.
- [ ] Express "citizens at every level, residents of many scales." No rung is where you live; a ladder invites "find your rung" and there isn't one.
- [ ] Decide what the 9 magenta `#e53fd7` w8 nodes mean (Temperature, Land, Water, Food, Medical Services, Behavioral Health, Jobs, Social Services and Care, Transportation). Only unexplained code left in the file.
- [x] Display Marc's framing sentence whenever EIP mode is entered, rendered into the SVG so it survives PNG/SVG export and printing, with (E)/(P)/(I) coloured to their band colours.

## EIP Stage — vocabulary and semantics

- [ ] Adopt "Adequacy of &lt;essential function&gt;" as the third naming convention, completing Aliveness of / Viability of. It is what makes the 26 functions play as variables rather than decoration, and it supplies the missing middle link: Viability of institutions → Adequacy of functions → Aliveness of zones.
- [ ] Note the convention is polarity normalization, not just naming: all three are oriented up = good, so every + edge reads "supports" and every − edge "undermines" with no mental flipping. Lint any variable that is not so oriented.
- [ ] Make polarity mandatory on new edges in EIP mode, or at minimum surface the gap. All 69 edges in the current file are `polarity: "none"` and unlabelled, so no loop can be detected.
- [ ] Keep Viability and Aliveness distinct. A payday lender is highly viable and detrimental; a struggling co-op is barely viable and working well for all. The divergence is what the stage exists to show.
- [ ] Fix the middle cap: "Aliveness of Institutinal Systems" → "Viability of Institutional Systems" (convention plus typo).
- [ ] Rename to remove the "Public" / "Publicly Traded" hazard — near-antonyms sharing a word. Government/State versus Investor-Owned, or similar.
- [ ] Treat the five ownership forms as rule bundles (boundary, aggregation, payoff) rather than a taxonomy of entity types. Payoff rules are the mechanism, so an icon should depict where the surplus goes.
- [ ] Define Local/Distant as participation, not proximity: whether those affected take part in making the rules. A firm headquartered in town but owned by distant shareholders is correctly Distant, and it is the same fact as the missing return arrow.
- [ ] Teach distant/local as topology, not only colour: local viability is coupled to local aliveness (closed balancing loop); distant is the absence of the return arrow (open loop).
- [ ] Score the condition axis against Ostrom's design principles instead of by gut, so two people code the same institution the same way.
- [ ] One axis per fire. Make the encoding switchable rather than showing ownership, locus and condition at once.
- [ ] Make the encoding a first-class object (which property drives which channel) so the legend generates itself and views become nameable and reusable.
- [ ] Split visual channels: **signature** (icon, hue) belongs to the thing and is identical in every viewer; **analysis channels** (fill, border, width) belong to the view.
- [ ] Structural "is part of" edges must be excluded from CLD loop detection, or feedback will route through containment and produce loops that do not exist.

## Campfire and room

- [ ] Wall legibility as a hard bound. Read from ten to fifteen feet standing, a stage is roughly fifteen to twenty nodes, not sixty. Bounds everything else.
- [ ] Print path that is genuinely wall-legible, and a fast way to enter what came back — including ghost edges someone drew in pen. Print → the room marks it up → photograph → enter.
- [ ] Campfire claims recorded as claims, not facts. "Carl said so at the Superior fire, March 2026" is a legitimate and complete basis, not a placeholder for a citation.
- [ ] Keep a channel for what does **not** fit the grammar. Those are the only observations that could disconfirm; a substrate that normalizes them away will look increasingly right while learning nothing.
- [ ] Storyboard — a time series of EIP sketches around one situated problem set, showing what changed in a neighborhood. Different object from versioning a single sketch; the timeline tool is the sibling.
- [ ] Nothing is precomputed unless the group asks for it. No batch overlap job, no automatic gap flags, no computed layout — placement and noticing are the group's learning.
- [ ] Most sketches get thrown away once the learning has happened. The sketch is disposable; the learning is not. Decide what that means for what the substrate keeps.

## Substrate, Neo4j, geography

- [ ] **Confirm or refute: is the Neo4j schema EIP-only?** Marc does not believe it is. Check and report.
- [ ] **Reconcile mode-in-substrate.** Locked decision 1 in `substrate/tool-inventory.md` says mode lives in the substrate. Marc has never thought Neo4j needs awareness of graph mode — it should work the other way: a Cypher query returns data and *we* choose the tools and modes that make best sense of it. Hard, but even approximating it is worth trying.
- [ ] Composer generality gap — it assumes EIP because it has no notion of mode, and `schemaLabel` is EIP-only. Same gap one layer down if it reaches Neo4j.
- [ ] On-demand geography query path only: someone asks "what is this place inside?" and PostGIS answers. No ETL, no N², no staleness — fresh because computed when asked.
- [ ] Whenever an overlap is computed it is **two percentages, not one**. The watershed is 4% covered by the town; the town is 90% inside the watershed. Same intersection.
- [ ] Direction convention for symmetric OVERLAPS if anything is ever stored, since Neo4j edges are directed.
- [ ] If anything is written back, store it as the record that this room asked this question on this date — a trace of attention, not a cache of geometry.
- [ ] Domain as a first-class property on a zone (hydrological, geological, ecological, climatic, airshed, foodshed). The interesting overlaps are cross-domain, and you cannot ask for them if domain is buried in a name string.
- [ ] Which tool owns which property, so round trips do not become last-save-wins.
- [ ] Freeze vocabulary earlier than feels comfortable. One neighborhood is a story; forty coded the same way are a finding, and a vocabulary that drifts across rooms cannot be compared.

## Ostrom crosswalk

- [ ] Make the design principles path queries rather than judgments — DP3: is there a path from the affected actor to the rule-making arena? DP4: is there an information edge from the resource back to the arena? DP2: does the arena setting the rule have any edge to the local biophysical node? DP8: are arenas connected across levels or isolated?
- [ ] Express the sustaining balancing loop — resource condition → monitoring → collective choice → operational rules → appropriation → resource condition — so that "why does governance kill the commons here" becomes "which edge is missing."
- [ ] Keep the Ostrom CPR influence diagram (`~/Downloads/eip-sketching.svg` companion) in the thinking for the crosswalk.
- [ ] Use the story grammar as the capture frame for a "problem": Beliefs (6 Answers) — who, where, when, why, how, what — is what an action situation needs, in words a room already uses. The de facto/de jure gap falls out of a mismatch between the rule as stated and the action as told.
- [ ] E cannot reach P without crossing the middle either — the condition of the world informs rule-making only through institutions, which makes "nobody is monitoring" an institutional failure you can point at.

## Housekeeping and docs

- [ ] Close inventory row 10 and record the two-database decision: PostGIS authoritative for geography, Neo4j holding pointers. Currently written nowhere in `substrate/`, and row 10 still reads "polygons still open" while federal boundaries are loaded.
- [ ] Add a new layer demand to the inventory: action situations and rule coding.
- [ ] Find a way to bring Claude Chat–side context into the repo. A large amount of the work's history lives there and does not reach Claude Code.

## Framing and language

- [ ] Draft the RCN byline. Starting point: "We know how to turn deserts into forests" — but more than that. Through local collective action we can make our lives meaningful and purposeful and vibrant. The bottleneck is governance failure, and it is THE problem standing in the way of collective action.
- [ ] Keep the E/P asymmetry as stated: both change, by different means. **E changes by work** — you can turn a desert into a forest, but only by doing what hydrology and biology permit, over the time they take; you cannot negotiate with it or declare it. **P changes by agreement** — a vote, a signature, a ruling, in an afternoon or never.
- [ ] Institutions are the transducer between agreement and work. P produces agreements, E responds only to work, and I is where one becomes the other. An institution that receives an agreement and produces no work is a visible, specific failure.
- [ ] Put the framing sentence in the upfront explanation along with the reason the stage has a left side at all: an externality is just a cloud someone chose to draw.
