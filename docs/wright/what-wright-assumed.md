# What Wright Assumed

Composition analysis is worth taking into RCN work, which means it is worth being honest about where its assumptions do not survive contact with real groups.

## Conditional independence is the load-bearing assumption

Every derivation assumes members succeed or fail independently, given ability `B` and difficulty `D`. Real groups have correlated errors, and correlated error is not a minor perturbation — it is the one correction that changes the numbers materially.

The usual way to write it is a design-effect deflation: `N_eff = N / (1 + ρ(N − 1))`, where `ρ` is the correlation in *approach* — how likely two members are to try the same thing. Pack gain is then `ln(N_eff · W)` rather than `ln(N · W)`.

What matters is which groups this actually penalises. For a group of five:

| ρ | effective N | pack gain | who this describes |
|---|---|---|---|
| 0.1 | 3.57 | +1.27 | diverse neighbours in a shared locale |
| 0.3 | 2.27 | +0.82 | same locale, some shared habits |
| 0.5 | 1.67 | +0.51 | same employer, same orientation |
| 0.7 | 1.32 | +0.27 | an identically trained cohort |

**The correction bites hardest on professionals.** Five people trained on one protocol, supervised by one person, working from one evidence base are close to `ρ = 0.7` — worth about a quarter of a logit between them, barely more than one person acting alone. Five neighbours who share a locale but not a training, a class position, a network or a livelihood sit near the top of that table.

So the honest reading is the opposite of the one usually offered. Diversity is not a nicety to be engineered into a pack after the fact; it is the thing that makes a pack a pack, and the professionalised team is the degenerate case. Wright's `W` term points the same way — pack strength rises with member heterogeneity, and a cohort selected for uniformity has `W ≈ 1` while a genuinely mixed neighborhood group has `W > 1`.

This is why [[Civil Society Back In The Game]] is a composition argument rather than a political preference. A local group of five out-packs a trained team of five on Wright's own arithmetic, by about a logit, for exactly the reason the trained team was assembled.

The correction runs the other way for Chains, with the same sign of surprise. Correlated links fail together — one funding cut, one outage, one policy change takes out several at once — so `−ln N` *understates* chain fragility rather than overstating it.

## The model is silent about time

There is no cost of delay anywhere in the arithmetic. A Pack of eight all trying different things takes longer than a Chain of five executing a known process, and in clinical work the delay is itself harm.

Wright is comparing probabilities of success on a single task, not throughput or latency. Any operational use has to add that separately.

## Ability is one number

`Bn` is a scalar on one variable. The whole apparatus rests on a Rasch model in which the persons and the tasks are on a single dimension. Community health problems are conspicuously not unidimensional, and a person strong on one facet may be weak on another. In a diverse local group that is a feature — it is most of where the low `ρ` comes from — but it does mean a single `B̄` is a coarse summary.

Many-facet Rasch measurement is Wright's own answer to this, and MESA Memo 67 works the compositions through it — Packs and Chains turn out not to care about the levels of other facets, which is convenient. But the single-number version used on the other pages here is a simplification, and worth flagging as one.

## Nobody has calibrated D

Every practical statement of the form "this group is 0.6 logits below this problem" presumes a calibration nobody has performed. In the absence of one, the results still carry ordinal weight — chains get worse with length, packs get better, teams need to out-match their problem — but the specific numbers are illustrative.

This is an argument for the Pack default rather than against the framework. Pack strength is the only one of the three that does not require knowing `D`.

## What survives all of that

The ordinal claims are robust to every objection above. Adding a link always weakens a chain. Adding a member always strengthens a pack, though correlation may make the gain much smaller than `ln N` suggests. A member below the problem always weakens a team. Consensus on a hard problem is always the worst of the three.

Those hold under any plausible correction, and they are enough to change how a neighborhood organises itself. The precise logits are for later, and probably for the SPC work rather than for this paper.
