# RCN Rasch Introduction

Why a total score is not a measurement, and what a Wright map adds. Companion to the RCN Rasch tool and its user manual. Every number here is real output from the two demo datasets shipped inside the tool.

**A total score tells you how many. It does not tell you how much.**

## The problem the Rasch model solves

Suppose the SODOTO ledger shows that Dorothy holds two badges and Nina holds ten. Nina has more. But is she five times as capable? Which two does Dorothy hold — the two easiest, or two that half the mentors cannot do? Is the gap between the second badge and the third the same size as the gap between the ninth and the tenth? A count of badges cannot say. It reports the number of rungs climbed on a ladder whose rungs are unevenly spaced, and nobody has measured the spacing.

The same is true of every questionnaire that adds up its answers. A resident who circles *agree* four times and *strongly agree* three times gets a score of 32 out of 35. That is a count of circles, weighted by the numbers printed beside them. It assumes every statement is equally hard to agree with and every step of the scale is the same size everywhere. Neither is ever checked, and both are usually false.

In 1960 the Danish mathematician Georg Rasch wrote down a model in which the two things that matter — how capable a person is, and how hard an item is — sit on a single ruler, and the odds of success depend only on the distance between them. Benjamin Wright at the University of Chicago spent the next forty years turning that model into a working measurement practice. RCN Rasch is that practice, reduced to one file.

**A person's raw score is enough to place them on the ruler. The Rasch model is the only model in which "adding up the right answers" is defensible — and it tells you the spacing of the rungs as it goes.**

## One ruler, two kinds of thing on it

The model is short enough to say in a sentence. The probability that person B succeeds at item D is `exp(B − D) / (1 + exp(B − D))`. When the person's ability equals the item's difficulty the odds are even; a person one unit above an item succeeds about 73% of the time, two units above about 88%. The unit is the **logit**, and the ruler runs from roughly −5 to +5 in most real data.

What makes this a measurement rather than a score is that persons and items land on the *same* ruler. A skill at +1.9 logits is not "hard" in the abstract; it is hard relative to these people, and a person at +1.9 has even odds on it. That is a claim you can check in a room, and the picture that shows it is the whole product of this tool.

## The Wright map

This is the tool's own output for the badge demo it ships with: 24 people, 12 SODOTO skills, badged or not. Persons on the left, more able above. Skills on the right, harder above. One vertical ruler in logits between them.

<!--WRIGHT-MAP-->

The badge demo, as exported by the tool. Blue dots are people, amber bars are skills, a red bar is a skill that misfits. The hollow dot at the top is a person who holds every badge and therefore has no measure — only a position beyond the hardest skill. The hollow amber bar at the top is a skill whose fit would be flagged but only 2 of 23 people hold it — too few responses to read fit either way, so the map calls it *provisional* rather than red. Dashed lines mark the mean person and the mean skill; skills are centred at zero by construction.

**Read across, not down.** A skill beside a person is one that person has about even odds on. Skills far above everyone are out of reach; skills far below everyone are already universal and tell you nothing new about differences. Whether the items you wrote actually reach the people you have is the question almost every instrument gets wrong, and it is answered here at a glance — no training, no statistics, one picture.

The tool reports **targeting** as the gap between the mean person and the mean item. Here it is −0.01 logits: the skills are aimed at where the people are. A targeting of +2 would mean the skills are all too easy for this group and mostly confirm what you already know; −2 would mean they are out of reach and most of the information is in whether anyone succeeded at all.

## Misfit is information, not an error code

The model makes a prediction for every cell in the matrix — this person, this skill, this probability. Where the responses disagree with the predictions more than chance allows, the model reports **misfit**, as a mean-square that should sit near 1.0. Two versions are computed. **Infit** weights responses near a person's own level, so it reflects the item as a whole. **Outfit** is unweighted, so it is dominated by the few responses far from a person's level — the lucky guess, the careless slip.

| Skill | Badged | Measure | Infit | Outfit | Reading |
|---|---|---|---|---|---|
| stand up an NDC server | 2 of 23 | +4.27 | 1.36 | 2.31 | Provisional. Only 2 of 23 succeeded — too few to read fit either way. |
| build a value network | 4 of 23 | +2.98 | 0.71 | 0.28 | Provisional. Only 4 of 23 succeeded. |
| assign an IAD level | 6 of 23 | +1.91 | 0.40 | 0.18 | Too predictable — closely tracks the neighbouring skills. |
| fork from another site | 12 of 23 | −0.44 | 0.93 | 0.84 | Behaves as expected. |
| **run a campfire conversation** | 15 of 23 | −1.37 | **2.07** | **11.61** | **Badly noisy. Measuring something else.** |
| comment on a page | 19 of 23 | −2.76 | 1.05 | 0.66 | Provisional. Only 4 of 23 failed. |

Eleven of the twelve skills either behave or sit on too little evidence to say. One does not behave, and it is not close: *run a campfire conversation* has an outfit of 11.6 against an expected 1.0. The demo generator built it that way on purpose — whether someone can run a campfire depends on temperament, not on the FedWiki-and-graph capability the other eleven share — and the model found it without being told. Some of the least able people in the ledger hold that badge and some of the most able do not. In a real ledger that is not a nuisance to be suppressed. It is the finding: this badge belongs to a different construct, and a person's standing on it should be reported separately, not folded into the total.

The provisional readings are the other half of the same honesty. A fit statistic on a skill that only two people hold, or only four people lack, is a mean over a handful of cells, and one surprise swings it. Below five responses on the minority side the tool refuses to call a flagged fit a misfit: the pill goes grey, the reading says *provisional*, and on the map the bar is drawn hollow rather than red. It is not saying the skill is fine. It is saying it cannot tell yet, which is different.

**A misfitting person is worth a look too.** Ray holds eleven of twelve badges and has an outfit of 19.7. The one he is missing is the campfire badge, which is one of the easiest — so the model's prediction for that cell was a near-certain success and the miss counts heavily. That is exactly what outfit is for. A high-outfit person usually has one anomalous response, and the question is what happened there, not whether the person is "unreliable".

## Extreme scores are named, not extrapolated

Omar holds all twelve badges. He is somewhere above *stand up an NDC server* and the data cannot say where. Winsteps, the standard commercial program, places such a person by treating a perfect score as if it were a fractional one — 11.7 of 12 by default — which yields a precise-looking measure with a standard error. Change the setting and the person moves with no new data.

This tool refuses that. Omar is drawn at the top of the map in a hollow marker with no number, the persons table says `12 of 12 · maximum`, and nothing about him enters a mean, a reliability, or a control chart. The pile-up stays visible — if a third of the group tops out, that is a ceiling effect and it should be the most obvious thing on the page — and the fiction stays out.

## The case a summed score can never show you

The tool's second demo is a neighbourhood participation questionnaire: 140 residents, seven statements from *I know who to call when something goes wrong* to *I would take a problem to the council myself*, each answered 1 to 5. With more than two categories the tool switches automatically to the **Andrich rating-scale model**, which estimates one extra thing: where on the ruler each step of the scale is crossed. These are the **thresholds**, and they should climb.

| Category | Used | % | Threshold | Reading |
|---|---|---|---|---|
| 1 | 215 | 21.9 | baseline | — |
| 2 | 276 | 28.2 | −1.81 | Used as expected |
| 3 | 95 | 9.7 | +0.63 | Used as expected |
| 4 | 205 | 20.9 | −0.31 | **Disordered** — sits below the one beneath it |
| 5 | 189 | 19.3 | +1.48 | Used as expected |

**What a summed score shows:** nothing. Every resident gets a number between 7 and 35. The distribution looks normal. Reliability computed the usual way looks fine. The report goes to the board.

**What the thresholds show:** the step into category 4 is crossed at −0.31 logits, *below* the step into category 3 at +0.63. Residents are not distinguishing "neutral" from "agree" in the order the form wrote them — category 3 is used less than 10% of the time and there is no point on the ruler where it is the most likely answer. Collapse 3 and 4 and re-run.

The demo was generated from a model whose middle thresholds were deliberately reversed, so this is a recovery, not a discovery. But it is the shape of the real finding, and it is the main reason to run a Rasch analysis before trusting a questionnaire: a scale can be wrong in a way that no amount of careful wording fixes after the fact, and the only way to see it is to estimate the thresholds.

**Two honest limits.** Detecting a subtle disordering needs respondents, not cleverness: an earlier version of this demo had 60 residents and a 0.2-logit reversal, and the estimator reported the thresholds as ordered — the reversal was real but smaller than the sampling noise. That is the estimator being honest. With 1,500 respondents it recovers a 0.2-logit reversal reliably. And the spacing of the thresholds is approximate while the sequence is reliable: the estimation method spreads its estimates 10–20% wider than the truth with few items. Winsteps applies a correction factor; this tool does not. The disordering diagnostic depends only on the sequence, which is unaffected.

## How many groups can the data tell apart?

Every measure comes with a standard error, and the ratio of the spread of measures to the size of those errors says how finely the instrument can cut. The tool reports it three ways because each is useful to a different reader. For the badge demo — 23 measurable people, 12 skills — person reliability is 0.84, separation 2.32, strata 3.4, SD 2.31 logits, RMSE 0.92.

**Strata** is the number in plain language: about three distinguishable groups of people. That is enough to sort the ledger into levels, and it is not enough to rank people individually — the standing of two neighbours in the same stratum is noise. Reporting a rank order from an instrument with two or three strata is the standard misuse, and the tool says so in words beside the number.

Neither reliability nor separation says whether the instrument is *good*. They say how finely it cuts. A dozen badges cannot cut finely; twelve items rarely do. Adding skills near the middle of the ruler, where most of the people are, is what buys resolution.

## Why this matters for RCN

**The badge ledger is already the data.** Persons × skills, badged or not, is the classic dichotomous design. It needs no survey, and a badge is *observed* by a mentor rather than self-reported. This is the likeliest route to RCN's first genuinely measured construct.

**A measure can go on a control chart.** A total of ordinal responses is not on an interval scale and must not be charted. A Rasch measure is, and can. The intended path is badge ledger → Rasch measure → RCN Process Behavior Charts.

**Comparable across neighbourhoods.** Measures are person-free and item-free. A construct measured with one set of items in Superior, Arizona and a different set in Whatcom County stays on one ruler, provided some items are shared.

**It can be wrong, and says so.** Data fit the model or they do not. Misfit is reported per item and per person, in words. A summed score cannot fail; that is its weakness, not its strength.

The lineage runs from Rasch to Wright and Mike Linacre at Chicago, and the applied case Marc keeps returning to is Bill Mahoney finding measures in Judy Hibbard's data, which became the Patient Activation Measure — the instrument the health-care world now uses to ask how far a person is from managing their own care. The same method, on a badge ledger, asks how far a person is from running a neighbourhood.

## What the tool leaves out

The whole vocabulary is seven words: measure, SE, infit, outfit, reliability, separation, strata.

Deliberately absent: partial credit model, many-facet Rasch, differential item functioning, principal components of residuals, extreme-score extrapolation, bias correction, anchoring.

All are legitimate and some are important. They are absent because the first version of a measurement tool should be the version a co-op board can read, and every addition is something the board has to learn. The rating-scale model was added because Likert questionnaires need it and the disordering check is the single most valuable thing Rasch offers a survey. If a real need appears — a badge that different mentors award at different standards, say, which is what many-facet Rasch is for — it can be added on top of an estimator that has been verified to recover known parameters.

## The Wright map must be readable

A picture a group can gather around, point at, and argue about without any training. Persons on one side, items on the other, one ruler between them. Everything else in the tool exists to produce that picture honestly.
