# Composing A Neighborhood

The three laws are worth applying to work already underway, because they make specific and checkable claims about arrangements currently taken for granted.

DIAGRAM_wright-neighborhood-composition

## A referral pathway is a Chain, and coordination lengthens it

Primary care to specialty to prior authorisation to scheduling to the person actually arriving is five links. `BC = B̄ − ln 5 = B̄ − 1.61` logits. One break loses the person, and every link is a place to break.

The important consequence is counter-intuitive and it is why so many pathway fixes disappoint. **Adding a care coordinator makes it six links: −1.79.** The coordinator is another link. A role introduced to strengthen a pathway lengthens the thing it was hired to strengthen. The only moves the arithmetic permits are removing links, or converting a segment into a Pack — several routes, first success wins.

This is directly encodable in LOP mode: composition as an edge property, with the `ln N` cost computed along each serial run.

## A CHW deployment is a Pack, and eight is the number

The same person, the same need, composed as a Pack of eight community health workers: `+ln 8 = +2.08` logits. A 3.7 logit swing over the chain, from the same people and the same problem.

Eight is not arbitrary. To cover a problem two logits above the group's mean ability you need `ln N > 2`, so `N ≥ 8`. That is the sizing question answered in a form a budget conversation can use.

The Pack also does something the Chain cannot: its strength is independent of problem difficulty. Nobody has to estimate `D` correctly in advance for the arrangement to work.

## Coalitions are Teams pointed at the wrong problems

Community coalitions, task forces and steering committees are Teams. They are convened against precisely the problems where `B̄ − D` is most negative — the region [[The Crossover]] shows to be the one place Teams perform worst of the three.

This is a mathematical case for the NDC and CHW model over the coalition model, and it does not depend on anyone's opinion of coalitions. A Team below `−ln N / (N − 1)` is the worst available option, and its failure mode has a name.

## The standardisation caveat

Pack strength rises with member heterogeneity through the `W` term. Wright also observes that "the homeostasis of most groups induces homogeneity" — groups spontaneously decay into bad Packs.

Healthcare quality machinery pushes uniformly toward homogeneity. That is correct for Chains and for Teams, and destructive for Packs. Knowing which composition you are standardising is the difference between raising `B` and collapsing `W`.

## One care plan holds all three

Inside a single Shared Care Plan all three compositions are present, and confusing them is the standard failure.

Medication reconciliation is a **Chain** — one break harms, danger looms, and Wright's guidance is explicit that when danger looms, commitment to maintained agreement is safer. Finding what actually helps this particular person is a **Pack** — a hard problem, upside-dominated, where people should be trying different things. Agreeing the goals the person themselves holds is a **Team**, and it is legitimate only to the degree the person genuinely participated in it — see [[Freedom Participation Solidarity]].

Running discovery through chain-governance kills it. Running safety through pack-autonomy hurts people. Treating a plan the person did not participate in as consensus produces a mob of two. That distinction is nameable, and it is enforceable in the SCP plugins.

The same argument at the scale of governance and property, rather than of care, is [[Civil Society Back In The Game]].
