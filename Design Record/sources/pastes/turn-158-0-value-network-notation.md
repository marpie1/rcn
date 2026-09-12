# Value network notation — what we decided and why

**Date:** 2026-08-31. **Participants:** Marc Pierson, Claude. **Status:** notation adopted, two rules enforced, three working drawings. Formalization deliberately unfinished.

## Where this came from

We started by asking what social network graphs would add to the RCN Graph Tool. Researching how David Snowden uses networks in the complex domain led to Verna Allee's Value Network Analysis, and that turned out to be a method we were already half practising: Allee's tangible/intangible split is Odum's counterflow generalized past money, and her completion rule is what SODOTO badges already implement. So the answer to the original question was not a new capability. It was a name and a discipline for something we had been drawing without rules.

## The decision

**We draw value networks, not tie maps.** A node is a role. An arrow is a deliverable moving from one role to another. Solid arrows are tangible, dashed arrows are intangible, and an arrow that ought to exist and does not is drawn dotted and red. A transaction is complete only when the receiving role accepts it.

This needs no new mode in the Graph Tool. It is a legend preset over existing machinery, plus two rules the validator enforces. That is the useful surprise of the whole exercise: the notation cost nothing to build, and the value is entirely in the discipline.

## The notation

| Element | Drawn as | Means |
|---|---|---|
| Role | Icon node, short uppercase label | What gets done here — not who does it |
| Tangible deliverable | Solid arrow, labelled | Goods, service, money — contractual, countable |
| Intangible deliverable | Dashed arrow, labelled | Knowledge, trust, information, benefit |
| Money | Solid amber | The counterflow circuit, kept visually distinct from service |
| Absent return | Dotted red, labelled | A return that ought to exist and does not — always a claim, never a measurement |
| Acceptance | The badge, contract, or signature that closes a pair | Value converts on acceptance, not on offer |

Deliverables that fail independently get separate arrows. A CHW can keep delivering rides long after the trust is gone, so "rides, forms, follow-up" and "trust, translation, advocacy" are two arrows into the same household, not one.

## The two rules, and why they are enforced

**Rule 1 — every arrow names its deliverable.** An unlabelled arrow asserts only that a tie exists. The label is what makes an arrow checkable: "CHW → what's actually going on at home → Clinic" can be wrong and can be corrected, where a bare connection cannot. It is also what makes reciprocity legible without computing anything — you read the asymmetry off the arrowheads and their labels.

**Rule 2 — every arrow declares its evidence.** `props.evidence` is either `observed` (a badge, contract, or log says so) or `asserted` (somebody reasoned it out). Both are legitimate. The problem is that drawn in the same ink they are indistinguishable, so a hypothesis reads as a finding. This rule exists because the first Whatcom drawing shipped with two invented red arrows rendered exactly like the contractual ones.

`--fix` writes `asserted` on any arrow missing the field. Under-claiming is the safe direction: it makes a file valid without ever promoting a guess to a finding, and leaves the author to upgrade the arrows that are real.

**Since 2026-09-01 `props.evidence` is available to every mode, not only value networks.** Value networks still require it; every other mode may use it, and the validator enforces only that partial adoption is worse than none — an undeclared edge sitting beside declared ones reads as observed by default. The rule of thumb for the value: `observed` needs a source you could hand to somebody else to check, and a page of the RCN Constitution counts; your own reasoning, however good, does not.

Both rules are gated behind an opt-in — a file declares `graphAttrs.method: "vna"`, or you force the check with `--vna`. All 39 existing graph files pass unchanged. Adopting the discipline is a per-drawing decision, never a repo migration.

## Roles, not people

A node is what gets done, not who does it. `CHW` is one node though six people do the job.

Two independent reasons converge on this. Allee's is that the role is the unit of value conversion, and confusing the role with whoever fills it this month makes the analysis unstable. Snowden's is that person-level data about relationships is unreliable at collection, because people cannot afford to describe their ties candidly. Working at role level answers a better question and needs no survey.

Person-as-node stays available for exactly one case: an ego network drawn *with* its subject, held in their own site under their own key. My Support Network is that case. Everything else is roles.

## Acceptance, and why SODOTO is our strongest data

Allee's completion rule is that value is offered at the role level and converts only when another role accepts it. SODOTO already implements this: the badge is the acceptance, it is signed, and it is held by the learner in their own site.

The consequence is worth stating plainly. **A teach chain is a transaction record, not a self-report.** Nobody was asked who they trust or who they learn from; a badge is a thing that happened. That makes SODOTO data `observed` all the way down, and it is the strongest material we hold for this notation — stronger than anything we could collect by asking.

It also changes what the data means. A mentor who ran four sessions and issued one badge has one completed transaction and three dangling offers, not four successes.

## What you read off a drawing

These are Allee's exchange-analysis questions. All are answered by looking, none by computing.

- **Reciprocity** — is a role extending several intangibles without a similar return? That is a burnout shape, and it showed up independently in the coop value network and in the teach chain, which suggests it is a fact about how the work is organised rather than about either individual.
- **Dead ends** — did the deliverable arrive somewhere and stop? On a teach chain this is the propagation question SODOTO exists to answer.
- **Bottleneck** — does every path run through one role? This is the coordinatorless test for an NDC, and it is answered by pointing rather than by a score.
- **Circuit shape** — do the money circuit and the service circuit close on each other, or are they different shapes? Where they diverge is where every design problem in health finance lives.
- **Hop depth** — how far has a capability actually travelled? Snowden's design target is no more than three degrees of separation, which gives us a countable goal.

Two of these yield statistics worth putting on a control chart: completed transactions per month, and how many people sit two or more hops from the origin.

## Triples

Noticing that `role —deliverable→ role` is subject–predicate–object is not a coincidence, and the Graph Tool got there first. The triple system built in May 2026 for BGTE already makes edges first-class entities: `isTriple`, `tripleId`, `tripleLabel`, `tripleStatus` (healthy/degraded/broken), `tripleStrength`, and a `metaEdges[]` array whose edges point at a *triple* rather than at a node.

That is reification — statements about statements — and it is the missing half of what we built today. `props.evidence` is a claim about an arrow, stuffed into a property bag because that was the cheap move. In the triple system it would be first-class, and `tripleStatus` is already close to the vocabulary we need: an absent return is a broken triple, and `tripleStrength` is the tie-strength binding we listed as a missing capability.

Two consequences.

**Neo4j falls straight out.** A property graph is triples with attributes. `(:Role)-[:DELIVERS {deliverable, valueKind, evidence}]->(:Role)` is a direct translation, and the OPM→Cypher exporter already proves the path. Badge records are natively triples and each arrives with a signature, which is exactly the `evidence: observed` the notation wants. A large SODOTO network in the substrate, rendered with these visual distinctions, is the obvious next real use.

**Provenance could become drawable.** If a value network were built *as* triples, evidence would be a meta-edge from whoever attests the transaction — the badge pointing at the exchange it certifies — rather than a hidden property. That is the more elegant design.

**We are not building it yet.** It is the right shape and it is worth nothing until several more real drawings say it is needed. Noted, not scheduled.

## What is built

- `tools/vna-whatcom-coop.rcn.json` — 6 roles, 15 labelled deliverables. Shows the two circuits failing to close, and the CHW reciprocity asymmetry.
- `tools/vna-sodoto-acceptance.rcn.json` — the acceptance rule: four sessions, one completed transaction.
- `tools/sodoto-teach-chain-readings.rcn.json` — dead ends, bottleneck, reciprocity and hop depth read off one shape.
- `tools/validate-rcn-graph.js` — both rules, opt-in by `graphAttrs.method: "vna"` or `--vna`, with `--fix` defaulting evidence to `asserted` and a note reporting the observed/asserted split.
- `tools/schemas/graph-tool-v22.md` — the contract chat-Claude reads, carrying the rules *and their reasons*, so a rule survives being questioned.
- `substrate/load_vna.py` — the drawings into the substrate itself, in the existing Option-C vocabulary, with every schemaLabel merge printed.
- `substrate/project_iad.py` — the Ostrom IAD lens: a read-only projection over that data, holding no state of its own. See `substrate/iad-crosswalk.md` and `docs/three-bands.md`.
- `tools/band-state.js` — the standing state of Ostrom's three bands and repo-wide evidence adoption.

## What we deliberately did not build

- **Centrality and other person-level metrics.** Not needed; every reading we wanted came off the shape.
- **A VNA mode.** The notation is a legend preset. A mode button would add a control without adding a capability.
- **The triple-based formalization.** Right shape, wrong time.

Still open from the same conversation, not yet decided: neighborhood filtering by hop count, edge-list import, data-driven style binding, the role/name toggle for ego networks, and running a social-network-stimulation round in an NDC — which needs no code at all.

## What happened next

The notation went into the substrate and out again through Ostrom's vocabulary, and the translation caught three errors the RCN vocabulary alone did not: a till projected as a position, an undrawn arena turning up in a payoff query, and three placeholder participants wrongly merged across two drawings. That is the argument for a second vocabulary in one line — it is not that Ostrom's terms are better, it is that they cut differently, and errors invisible under one cut are obvious under the other.

Ostrom's three levels of analysis are now a standing lens on all RCN work rather than a one-off exercise; see `docs/three-bands.md` for what the bands mean and how they map onto Meadows' leverage points.

## Next

Draw two more from real data — the actual badge ledger, and a Whatcom value network built from what Marc and the broker actually know rather than what was inferred. Whatever repeats across five drawings is the notation. Whatever does not was invention.

## Sources

- Verna Allee, "Value network analysis and value conversion of tangible and intangible assets," *Journal of Intellectual Capital* 9(1), 2008 — the compact statement of the method. Books: *The Future of Knowledge* (2002) and *Value Networks and the True Nature of Collaboration* (2011).
- Smith & Snowden, "From atomism to networks in social systems," *The Learning Organization* 12(6), 2005.
- Cynthia Kurtz, "Collective Network Analysis," white paper, 2009.
- Social network stimulation — https://cynefin.io/wiki/Social_network_stimulation
