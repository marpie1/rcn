# Talking IAD — the crosswalk from RCN value networks to Ostrom's framework

**Date:** 2026-08-31. **Purpose:** make the RCN substrate legible to researchers at the Ostrom Workshop at Indiana University, using their vocabulary, without claiming more than our data supports.

## Why the crosswalk exists at all

Allee's *role*, Snowden's *identity* and Ostrom's *position* are the same move made independently by three traditions: the unit of analysis is the seat, not the person sitting in it. Once you see that, IAD stops being a neighbouring framework and becomes the one our value networks were already an incomplete instance of.

Ostrom's own definition is a schema:

> Participants, who can either be individuals or any of a wide diversity of organized entities, are assigned to positions. In these positions, they choose among actions in light of their information, the control they have over action-outcome linkages, and the benefits and costs assigned to actions and outcomes. — *Understanding Institutional Diversity* (2005), p. 188

That sentence names seven **working components**, and IAD's seven **rule types** configure them one-to-one. It is unusually formalizable for a social-science framework, which is why it maps onto a property graph with almost no violence.

## The IAD skeleton we encode

| Working component | The rule type that configures it |
|---|---|
| Participants — who may take part | Boundary rules |
| Positions — the seats they are assigned to | Position rules |
| Actions — what a seat may choose to do | Choice rules |
| Information — what a seat knows when it chooses | Information rules |
| Control — how choices combine into a decision | Aggregation rules |
| Costs and benefits — what a seat pays and receives | Payoff rules |
| Outcomes — what the situation can produce | Scope rules |

Three **levels of analysis**: operational-choice (actions directly affect tangible outcomes), collective-choice (actors shape the rules constraining operational actors), constitutional-choice (who has standing, and which institutional mechanisms are available).

**Adjacency**, after McGinnis: two action situations are adjacent when outcomes generated in one determine a working component — or the rules — of the other. A network of action situations (NAS) is therefore a graph, which is why this belongs in Neo4j rather than in prose.

## The crosswalk

| RCN | IAD | Notes |
|---|---|---|
| VNA drawing (one file) | `:ActionSituation` | One file, one situation — unless it spans levels, see below |
| Role node | `:Position` | The default reading of a legend row |
| Person node (ego network, teach chain) | `:Participant` | Declared, never inferred — this is the distinction the whole crosswalk turns on |
| Fund, till, pot, reserve | `:Resource` | A till is not a seat anyone occupies |
| Badge, signed artifact | `:Outcome` | The realized product of a transaction |
| Labelled arrow | `[:DELIVERS {deliverable, valueKind, evidence}]` | Populates the costs-and-benefits component |
| `props.valueKind` tangible/intangible | payoff character | Allee's split; IAD has no native term for it and benefits from one |
| `props.evidence` observed/asserted | empirical grounding | Observed = a badge, contract or log; asserted = reasoned. See below |
| Legend row `iadElement` | which of the above a node kind is | position \| participant \| resource \| outcome |
| Edge legend row `iadLevel` | level of analysis for that transaction | operational \| collective-choice \| constitutional |

## What we can honestly claim, and what we cannot

A value network populates **two of the seven working components**: positions (or participants) and costs-and-benefits. It supplies nothing about actions, information, control, or the rules that configure any of them. Nothing in a labelled arrow says what the boundary rule is.

That is not a defect to hide. It is the empirical skeleton IAD coding normally has to be built on top of, and stating the limit precisely is what makes it usable. So the projection emits **all seven working components and all seven rule types as explicit nodes for every situation**, each marked `specified` or `unspecified`. The gap is queryable rather than silent, and an absence in our data never reads as an absence in the world.

The same discipline governs `props.evidence`. Ostrom Workshop researchers already distinguish rules-in-form from rules-in-use; our observed/asserted flag is the analogous distinction one level down, on individual transactions. Every arrow we currently hold is `asserted`. Badge-derived teach chains will be `observed`, and that is the first thing worth showing IU: a transaction record with a signature, not a survey response.

## Two things the projection found

**A till is not a position.** The first run projected `THE TILL` and `NET SURPLUS` as positions, and they duly appeared in the payoff-asymmetry query as roles giving more than they receive — which is meaningless for a pot of money. Legend rows now declare `iadElement`, and resources are excluded from position-level analysis. This is the crosswalk earning its keep: an error invisible in RCN's own vocabulary was obvious in Ostrom's.

**`hybrid-coop-money-and-value` is not one action situation.** Four of its 27 arrows are unambiguously collective-choice — *elect the consumer seats*, *elect the worker seats*, *sets the split*, *sets PRICE and WAGE* — while the other 23 are operational exchange. The projection now flags it as spanning two levels. In McGinnis's terms these are two adjacent action situations, and the adjacency is drawn right there in the file: the board's outcomes (price, wage, split) set the payoff rules of the operational situation below it.

That second finding is the strongest evidence that the crosswalk is doing analytic work rather than relabelling. Nobody drew that file thinking about levels of analysis.

## How to run it

```bash
cd ~/rcn/substrate
python3 load_vna.py --verify    # drawings into the substrate, database `vna`
python3 project_iad.py          # the IAD lens — reads only, writes nothing
```

**Corrected 2026-09-01.** The first version of this loader read `tools/*.json` and wrote its own `iad` database, which made the IAD view a parallel copy standing beside the substrate rather than a view onto it — so the architecture claim that tools become lenses on one graph was aspirational for this layer. `load_vna.py` now puts the drawings into the substrate in the substrate's own vocabulary (`:Concept:<IADElement>` merged on schemaLabel, deliverables as structural `[:REL]`, one `:Aspect {kind:'drawing'}` per drawing carrying the action-situation facts), and `project_iad.py` queries them. The `iad` database has been dropped: the lens needs no copy, and holds no state to go stale.

Merges are printed on every load, because the substrate merges on schemaLabel and a merge nobody sees is the failure this design exists to prevent. `BADGE ISSUANCE` appearing in two drawings is a correct merge and the gold-node case working. Three placeholder participants named `A`, `B` and `C` in two different SODOTO drawings were an incorrect merge, flagged by the loader and fixed in the data by renaming.

Queries an IAD reviewer would actually run:

```cypher
// which working components of this situation are unspecified?
MATCH (a:ActionSituation)-[:HAS_COMPONENT]->(c:WorkingComponent)
WHERE c.status = 'unspecified'
RETURN a.slug, collect(c.key) ORDER BY a.slug

// payoff asymmetry — a position extending more than it receives
MATCH (p:IADElement) WHERE p:Position OR p:Participant
OPTIONAL MATCH (p)-[o:DELIVERS]->()
OPTIONAL MATCH ()-[i:DELIVERS]->(p)
WITH p, count(DISTINCT o) AS out, count(DISTINCT i) AS inn
WHERE out - inn >= 2 RETURN p.situation, p.name, out, inn ORDER BY out - inn DESC

// what is empirically grounded rather than theorised
MATCH ()-[d:DELIVERS]->() RETURN d.evidence, count(*)

// situations that are really more than one
MATCH (a:ActionSituation) WHERE a.spansLevels RETURN a.slug, a.levelsPresent
```

Current state, in database `vna`: 6 drawings, 37 positions, 9 participants, 7 resources, 1 outcome, 75 deliverables. Evidence stands at 6 observed and 61 asserted — the six are constitutional facts citable to a page of the RCN Constitution, and they are the first observed claims this project has held.

## Open questions for the Workshop

These are genuine, not rhetorical. Each is a place where we have made a provisional choice that an IAD specialist would improve.

- **Level assignment.** All four situations are currently `unspecified` at file level. Assigning a level is an analytic judgment, not data entry, and we would rather be corrected than guess.
- **Is a value-network arrow an action, an outcome, or a transaction?** We treat it as a transaction populating costs-and-benefits. It could equally be modelled as an action yielding an outcome consumed elsewhere, which would populate three components instead of one — at the cost of inventing structure we did not observe.
- **Does the Institutional Grammar belong here?** ADICO (Attribute, Deontic, aIm, Condition, Or-else) would let a rule statement be parsed and stored rather than merely marked `unspecified`. It is the obvious next layer, and we have not built it.
- **Adjacency as a first-class edge.** We currently flag a situation that spans levels. We do not yet emit `(:ActionSituation)-[:ADJACENT_TO {via}]->(:ActionSituation)`, because deciding *which* outcome sets *which* component is exactly the judgment we would want to make with a Workshop reader rather than alone.
- **Design principles.** Ostrom's eight are a checklist over a governance system, not a graph structure. Whether they belong as queries over this schema or as a separate annotation layer is undecided.

## Sources

- Elinor Ostrom, *Understanding Institutional Diversity* (Princeton, 2005) — especially p. 188 on working components and the seven rule types.
- Michael D. McGinnis, "Connecting Commons and the IAD Framework" (rev. Nov 2017) — https://mcginnis.pages.iu.edu/
- Michael D. McGinnis, "SES Framework: Initial Changes and Continuing Challenges" — https://mcginnis.pages.iu.edu/ses_intro.pdf
- Crawford & Ostrom, the Institutional Grammar (ADICO); see the Institutional Grammar 1.0 review in *International Journal of the Commons*.
- Networks of action situations — https://link.springer.com/article/10.1007/s11625-020-00814-w
