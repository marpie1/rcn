# RCN Rasch — input CSV and session JSON

Derived from `tools/rcn-rasch.html`, 2026-09-01. Verified by parameter recovery on simulated data and by rendering the exported SVG, not only by reading the code.

Two models, chosen automatically from the data: the **simple dichotomous Rasch model** when responses are 0/1, and the **Andrich rating-scale model** when there are more categories. There is one estimator — the dichotomous case is the rating-scale model with m = 1, and the two were verified identical to 1e-15 on 400×12 simulated data before the separate dichotomous implementation was deleted.

## The CSV contract

First column is the person. Every other column is an item. One row per person.

```csv
person,edit a wiki page,publish a page,stand up a server
dorothy,1,1,0
marc,1,1,1
luis,1,0,
```

Values are whole numbers. `0`/`1` for dichotomous; `0–3`, `1–5` or similar for a rating scale. **The lowest category present is shifted to 0 for estimation and the shift is reported**, so a 1–5 Likert is estimated as 0–4 but displayed in your original numbering — silently renumbering somebody's scale is how it ends up meaning something other than what they wrote. **An empty cell is missing and is handled, not imputed** — the person simply contributes no observation for that item. Anything else — a decimal, a negative, a value above 20, unparseable text — becomes missing, loudly rather than coerced; a short row is padded with missing.

Column order is item order in every table; row order does not matter.

## What comes back

| Field | Meaning |
|---|---|
| `measure` | Logits. Person ability and item difficulty on **one** scale — that is the whole point of the model |
| `se` | Standard error of the measure, `1/sqrt(Σ P(1-P))` |
| `infit` | Information-weighted mean square. Sensitive to responses near a person's own level, so it reflects the item |
| `outfit` | Unweighted mean square. Dominated by responses far from a person's level, so it catches lucky guesses and careless slips |
| `infit_zstd`, `outfit_zstd` | The same, standardised by the Wilson-Hilferty cube-root transform |
| `extreme` | `minimum` / `maximum` for persons, `nobody` / `everybody` for items, `empty` for no data |

MNSQ near 1.0 is what the model expects. Above 1.5 is noisy — the item is probably measuring something else, which is the finding worth chasing. Below 0.7 is too predictable, usually a near-duplicate.

## The rating scale — thresholds and disordering

With more than two categories the tool estimates **Andrich thresholds**, shared across all items. That sharing is what makes it the rating-scale model rather than partial credit: every item uses the same scale, so the categories mean the same thing everywhere — which is exactly the assumption a Likert questionnaire makes whether or not anybody checks it.

A threshold is the point on the ruler where the next category up becomes the more likely answer. **They should climb.** If threshold 3 sits below threshold 2, the categories are not being used in the order they were written — respondents are not really distinguishing those two answers. The remedy is to collapse the adjacent categories and re-run.

This is the finding a summed score can never show you, and it is the main argument for running a Rasch analysis before trusting a questionnaire.

Two honest limits on it, both reported in the tool:

**Detecting subtle disordering needs respondents, not cleverness.** An early version of the Likert demo had 60 respondents and a 0.2-logit disordering, and the estimator correctly reported the thresholds as ordered — the disordering was real but smaller than the sampling noise. Verified: at n = 1500 the estimator recovers disordering reliably, including a 0.2-logit case.

**JMLE spreads estimates slightly wider than the truth**, a known bias of the method, roughly 10–20% with few items. Winsteps applies a correction factor; this tool does not. Read the *spacing* as approximate and the *sequence* as reliable — and the sequence is what the disordering diagnostic depends on.

A category with zero observations has no estimable threshold and is named as such; a category under 10 observations is flagged as unstable.

## Two things this tool refuses to do quietly

**Extreme scores get no measure, but they are still drawn.** A person who succeeded at everything is somewhere above the hardest item and the data cannot say where. Winsteps extrapolates to a fractional score (`EXTRSC`, default 0.3) which places them precisely but by convention — change the setting and the person moves with no new data, and the reported standard error implies a sampling distribution around a quantity that has none.

This tool instead plots them **at the edges of the Wright map in hollow markers with no number**: above the top tick for a maximum score, below the bottom for a minimum, and the same for items nobody or everybody passed. That keeps the one thing Winsteps' approach is genuinely better at — a ceiling effect is visible as a pile-up rather than buried in a footnote — while refusing the fictional precision. Nothing numeric leaks into a mean, a reliability, or a control chart.

**Elimination of extremes is iterative, and the margins are recomputed over the surviving submatrix each pass.** Removing an extreme item can push a borderline person to an extreme score, and vice versa. Getting this wrong is the bug that nearly shipped: observed item scores counted responses from removed persons while expected scores did not, the two never reconciled, and item measures were biased by up to 1.5 raw score points — silently, with a plausible-looking answer. The check that catches it is that observed and expected margins must agree at the solution.

## Estimation

JMLE (UCON): Newton-Raphson alternately on both margins, items recentred to mean zero each pass to give the scale an origin, steps clamped to ±2 logits, convergence at max change < 0.0001. A person's raw score is a sufficient statistic for their measure, which is what makes "adding up the right answers" defensible — and the Rasch model is the only one in which it is.

Thresholds are updated from the count of responses reaching each category or above, then recentred to sum to zero.

Verified by parameter recovery on simulated data:

| Model | Design | Recovery r | RMS error | Converged |
|---|---|---|---|---|
| Dichotomous | 400 persons × 12 items | 0.995 | 0.20 logits | 11 iterations |
| Rating scale, 4 categories | 500 × 10 | 0.999 | 0.19 logits | 29 iterations |

Worst margin residual 1.5e-5 dichotomous, 2e-3 polytomous. Threshold ordering recovered correctly in three separate conditions — strongly disordered, mildly disordered, and ordered.

## Separation, and how to read it

`reliability = (SD² − MSE) / SD²`, `separation G = sqrt(reliability/(1−reliability))`, `strata = (4G+1)/3`.

Strata is the number in plain language: how many groups the data can actually tell apart. Around 3 is common and honest — enough to sort people into levels, not enough to rank them individually. Reporting a rank order from an instrument with 2 strata is the standard misuse.

## The exported SVG is XML, not HTML

Everything the Wright map emits must be valid XML. XML predefines only `amp`, `lt`, `gt`, `quot` and `apos` — a named entity like `&mdash;` renders fine inside the page and makes the exported `.svg` refuse to open. Caught by rendering the export, not by reading it. Use the character itself.

## Session JSON

`Save session` writes the CSV, the labels, and every estimated measure with fit. It is for reproducibility, not for authoring — `Open session` restores the CSV and re-estimates rather than trusting the stored numbers.

## Choosing this tool

Use it when you have a person-by-item matrix of successes and want a **measure** rather than a total. A total of ordinal responses is not a measurement and must not go on a control chart; a Rasch measure is on an interval scale and can. That is the intended path: badge ledger → Rasch measure → `tools/rcn-spc.html`.

Do not use it to rank individuals unless separation supports it, and do not use it on data that is not attempting to measure one thing. Multidimensionality shows up as misfit, which is the model doing its job.
