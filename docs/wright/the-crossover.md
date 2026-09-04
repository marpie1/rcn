# The Crossover

Wright's three laws each say "more" or "less", but the useful question is *when*. At what point does one composition overtake another? The algebra answers exactly, and the answer is a single expression that turns out to be the most portable thing in the paper.

DIAGRAM_wright-crossover

## The threshold

Setting Team strength equal to Pack strength and solving gives the condition under which a Team is worth building at all.

A Team beats a Pack when `B̄ − D > ln N / (N − 1)`. Below `−ln N / (N − 1)`, the Team is not merely second best — it is the *worst* of the three, behind even the Chain.

Between those two curves is Pack country, and it is wider than anyone's instinct suggests. Note what the threshold is not: it is not zero. Being merely as able as the problem is not enough to justify consensus. A group must be measurably *better* than its problem before agreement outperforms diversity.

## The size rule

Marc's marginal note on the figure reads: **chain ↑ · Team ← Magic # 3 · ↓ packs maybe (too small)**. That is a size rule read off a chart drawn about difficulty, and the arithmetic supports all three arrows.

**Chains: as short as possible.** Every link costs `ln N`. Three links is −1.10 logits, five is −1.61, ten is −2.30. The penalty is unbounded and there is no length at which it stops. The only design move available is fewer links.

**Teams: around three.** A team of three must average 0.55 logits above the problem to beat a pack of three. That threshold actually *falls* as N grows — a group of ten needs only 0.26 — but the binding constraint is the other law: `Σ(Bn − D)` subtracts the full deficit of every member below the problem. Big teams survive only on easy problems. Three is about where teams stay honest.

**Packs: bigger than three.** Marc's scepticism is right and there is a number for it. Pack gain is `ln N`, so covering a problem two logits above the group's mean ability requires `ln N > 2`, meaning **N ≥ 8**. Three logits needs N ≥ 20. A pack of three buys 1.10 logits and no more.

The counterweight is diminishing returns. Going from two to three members buys 0.41 logits; going from nine to ten buys 0.11. Packs are cheap to build up to about eight and expensive past it.

## The one to keep in front of you

Pack strength contains no `D` term at all. Team strength contains `D` N times over.

This is the practical difference. **A Pack is the only composition whose strength you can state without knowing how hard the problem is.** In neighborhood work, where nobody can honestly calibrate difficulty in advance, that is not a technicality — it is the argument for defaulting to Pack organisation whenever you are genuinely uncertain, and reserving Team organisation for problems you have already made easy.

See [[Discovering Standard Processes]] for what "already made easy" costs.
