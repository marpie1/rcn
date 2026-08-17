# Process Behavior Charts — User Manual

The tool is one HTML file. Open it in any browser — no install, no server, no account, and nothing you load ever leaves your machine.

## 1 · Opening the tool

Double-click `rcn-spc.html`, or drag it onto a browser window. The panel down the left side runs top to bottom in the order you will actually use it: load data, pick a chart, decide on subgrouping, adjust limits, export.

Nothing is saved automatically. Reloading the page loses your work. Use **Save session as JSON** before you close the tab.

## 2 · Loading data

The first dropdown loads a synthetic dataset shaped like something the co-op will really collect. Each one demonstrates a specific way numbers mislead. Start with **Referral turnaround days**.

**Paste CSV** opens a box you can paste into; **Open CSV file…** reads a file from disk. The first row must be column names. Numbers with `$`, `%`, or thousands separators are read as numbers.

Rows are charted **in the order they appear in the file**. The tool does not sort them. If your rows are not already in time order, sort them before loading — an out-of-order series produces a moving range that is meaningless, and therefore limits that are meaningless.

### Long format, not wide

One row per observation. If you have several clinics, do *not* put each clinic in its own column — put a `clinic` column beside the value, so subgrouping has something to group by.

```
month,clinic,days
2025-01,North,4.1
2025-01,South,10.9
2025-02,North,3.8
2025-02,South,11.3
```

For a proportion or a rate, give the numerator and denominator as separate columns. Never pre-compute the percentage — the tool needs the denominator to compute limits at all.

```
month,enrolled,completed
M01,820,426
M02,905,498
```

**Never load a pre-averaged column.** If the number reaching you is already a monthly average of daily figures, the daily variation has been thrown away and the limits you compute will be far too tight — the chart will signal constantly. Get the underlying values if you possibly can. If you cannot, say so out loud when you show the chart.

## 3 · Choosing a chart

| Your data | Chart | Example |
|---|---|---|
| One number per period | XmR | Turnaround days, cost per member month, visits per week, average wait |
| A count out of a total, where the total moves | p chart | Share of enrolled members with a completed care plan |
| A count over an area of opportunity | u chart | ED visits per 1,000 member-months; falls per 1,000 patient days |
| Very few points, or you want no assumptions | Run chart | The first eight weeks of anything |

When in doubt, XmR. An XmR chart on the rate itself is legitimate for almost any measure and makes no distributional assumption at all. It is less powerful than a correctly specified p or u chart, and more robust than an incorrectly specified one. If the p chart and the XmR chart of the same rates disagree dramatically, that disagreement is itself the finding.

## 4 · Reading an XmR chart

Two charts stacked. The top plots the individual values; the bottom plots the moving range — the absolute gap between each point and the one before it.

| Element | What it means |
|---|---|
| Solid blue line (CL) | The average of the values used to set the limits. |
| Dashed red lines | Natural process limits — how far this measure wanders when nothing has changed. Labelled UNPL and LNPL rather than UCL/LCL, because nothing is being controlled. |
| Red filled points | Signals. Hover for the rule and what it means; a short rule tag prints above the point. |
| Moving range chart | Read this *first*. If the moving range is out of control, the limits on the chart above were computed from an unstable estimate and cannot be trusted. |

### Why the limits are not mean ± 3 SD

The limits come from the *average moving range*, never from the standard deviation of all the values. This is the most consequential detail in the whole method.

The standard deviation of all the values already contains any shift, trend, or outlier you are trying to detect. Using it to build the limits means the signal inflates the very yardstick meant to find it, and the chart goes quiet exactly when something is happening. The moving range only ever looks at neighbouring pairs, so a shift halfway through the series barely affects it.

A spreadsheet "control chart" built on `=AVERAGE()±3*STDEV()` is not a control chart. It is the single most common error in the field.

## 5 · Reading p and u charts

Pick the **numerator** (events) and the **denominator** (the area of opportunity). For a u chart, **Report rate per** sets the axis units — 1,000 for "per 1,000 member-months". Scaling changes the axis only; the arithmetic underneath is unaffected.

The limits are recomputed at every point from that point's own denominator, so they widen where the denominator is small and narrow where it is large. This produces a stepped, staircase look that surprises people the first time. It is correct: a rate built on 300 member-months genuinely can wander further than the same rate built on 9,000, and a chart with flat limits would call the small month a signal purely for being small.

The centre line is `Σ numerator ÷ Σ denominator` — not the mean of the individual rates. Averaging the rates gives a small month the same weight as a large one and puts the centre line in the wrong place. Some spreadsheet templates get this wrong.

## 6 · Overdispersion and the Laney correction

A p chart assumes each period's count is binomial: same underlying probability, independent observations. With a denominator of 1,200 that assumption implies a sigma of roughly 1.4 percentage points. Real monthly figures for anything involving people move much more than that, for entirely ordinary reasons — case mix, staffing, weather, who was on holiday.

When the assumption fails, the limits are far too tight and nearly every point is flagged. The chart is not finding problems; it is finding that the binomial model was wrong.

The tool reports **sigma z** in the stats row under each p or u chart. Standardise every point against its own theoretical sigma, then measure how much that standardised series actually moves.

| Sigma z | Reading | Do |
|---|---|---|
| About 1.0 | The binomial or Poisson model holds. | Use the classical chart. Laney would change almost nothing. |
| Above 1.2 | Overdispersion. Real between-period variation the model does not allow for. | Turn on Laney p′/u′. The tool says so in a red banner. |
| Below 0.75 | Under-dispersion — points move *less* than chance permits. | Suspect the data. Usually a wrong denominator, pre-smoothing, or numbers adjusted before reporting. |

With Laney on, the three-sigma half-width is multiplied by sigma z. If the data really were binomial, sigma z lands near 1 and the correction does nothing — which is why it is safe to leave on when you are unsure.

Donald Wheeler's advice for the same situation is to skip attribute charts and put an **XmR chart on the rates**. It reaches a similar place with less explaining and is a perfectly defensible choice, especially with a lay audience. Laney keeps more information when the denominators vary a lot; XmR is easier to defend in a room. Both are in the tool. Pick one and be consistent.

## 7 · Run charts

Median centre line, no limits, no distributional assumptions. Useful for the first handful of points, before there is enough history to estimate limits honestly. The tool applies the Perla / Provost rules.

| Rule | Triggers on |
|---|---|
| Shift | Six or more consecutive points on the same side of the median. Points exactly on the median are skipped, not counted as either side. |
| Trend | Five or more points moving the same direction in a row. |
| Too few runs | Fewer crossings of the median than chance would produce — usually a shift or a trend already underway. |
| Too many runs | More crossings than chance allows. Often a mixture: two alternating sources. |

A run chart cannot tell you a single point is unusual — it has no limits. That is the tradeoff for making no assumptions.

## 8 · Rational subgrouping

This is the reason the tool exists, and the panel renders above the chart because the choice comes before the picture.

Choosing a column in **Subgrouping** is not a display option. It is a claim about cause. You are declaring that variation *inside* a group is noise — that becomes the yardstick — and that anything worth detecting shows up *between* groups instead.

| Reading | Meaning |
|---|---|
| Sigma within | Pooled standard deviation inside the groups. This is what a chart built on this subgrouping would treat as noise. |
| Sigma overall | Standard deviation of everything, ignoring the grouping. |
| Ratio | Overall ÷ within. Near 1 means the grouping explains nothing. Large means the groups are genuinely different populations. |
| F and p | One-way analysis of variance. Is the between-group difference bigger than chance? With many observations even trivial differences reach significance, so read F alongside the share, never alone. |
| Share between and within | The orange-and-blue bar. Of all the variation present, how much lives between the groups. This is the number to act on. |

### How to read the share

| Share between | What it means and what to do |
|---|---|
| Under 15% | The grouping explains almost nothing. Pool them; one chart is the honest picture. Note what this rules out — an intervention aimed at differences between these groups is aimed at almost nothing. |
| 15 to 40% | Enough to matter, not the whole story. Chart it both ways. A difference this size will show up in a league table as a stable-looking ranking that is mostly noise. |
| Over 40% | These are separate processes sharing a spreadsheet. Tick **Chart each subgroup separately**. A pooled chart here is actively misleading. |

### The two failure modes to recognise

**Mixture.** Two or more different sources alternating in one series. The point-to-point movement is huge, so the limits are enormous and nothing ever signals. Symptom: a chart that looks impossibly calm, with points scattered widely inside them. Nelson rule 8 is aimed at this. The referral turnaround example is a pure case.

**Stratification.** The opposite. The subgroup straddles two sources in a way that inflates the *within*-group estimate, making the limits too wide and the points cling to the centre line. Symptom: a chart where everything sits in the middle third and nothing ever comes close to a limit. Nelson rule 7 catches it.

Both look like good news. A mixture and a stratification both produce a chart with no signals. That is why "no signals" is never sufficient on its own — check the subgrouping panel before you believe a quiet chart.

## 9 · Marking process changes

When you deliberately change a process — add a worker, change a form, move a clinic — the numbers before and after are not one process. Charting them as one produces a centre line that describes a state of affairs that never existed, and limits wide enough to hide what happened next.

**Click the chart where the change happened.** A purple marker appears, and everything from that point on becomes a new phase with its own centre line and its own limits, computed only from its own points. Click the same place again to remove it. You can also type row numbers into **New phase begins at row…** — `19, 34` gives three phases — and you can mark as many changes as the series really had.

Three things happen at every boundary, and software that skips any of them produces a chart that looks right and is wrong.

- Each phase gets its own centre line and limits, from its own points only.
- The run rules restart. A run of nine on one side of the centre line means nothing if it straddles a change you made on purpose.
- The moving range that spans the boundary is dropped. It measures the change you already know about, and leaving it in would inflate the limits of whichever phase claimed it — the exact error the change point was drawn to avoid. It is shown faded on the moving range chart and never flagged.

### Say what changed

Every change point carries a **note** and, optionally, a **link**. Type them into the box that appears under the row number, or click the chart and start typing — the note field takes focus straight away.

Both are drawn *into the chart itself*, in a numbered block below the plot. This matters: a chart that leaves the tool as an SVG, a PNG, a slide, or a sheet of paper still says what happened at week 19. A marked change with no reason attached is half a record — six months later nobody remembers, and the phase boundary becomes an unexplainable kink in the data.

The link is printed as readable text as well as being clickable, because a printed link that is not spelled out is no link at all. Only `http://` and `https://` addresses are turned into links; anything else stays as plain text, and the field turns pink to tell you so.

Each phase also reports its own numbers **on the chart itself**. The centre line and both limits are labelled at the right-hand end of the phase they belong to — the last phase in the right margin, earlier phases just inside the plot, right-aligned against the boundary and set with a white outline so they stay readable over the data. You never have to go to a table to find out what the line in front of you is worth.

On p and u charts the limits step with the denominator, so a limit label shows the value at that point — the last point of its phase. The centre line is pooled across the phase and is exact everywhere in it.

Under the charts you get a phase table as well: where each phase runs, how many points, its centre line, its limits, how many points fall outside, and what changed. A phase whose reason has not been written yet says so in red.

### Worked case — the CHW example

A second community health worker joins at week 19 and weekly visits rise from about 42 to about 55.

| Charted as | Centre line | Limits | Points outside |
|---|---|---|---|
| One process, all 30 weeks | 47.3 | 37.0 to 57.7 | 3 |
| Change point at week 19 | 41.9 then 55.5 | 31.7–52.1, then 46.1–64.9 | 0 |

Read the second row carefully, because it is the whole point. **Zero.** Once the change is accounted for, both phases are stable on their own. The process behaved predictably before, behaved predictably after, and the jump between them was the thing you did — not a signal to investigate.

The first row is worse than useless. Its centre line of 47.3 describes a level the process never actually ran at, and its three flagged points invite you to investigate weeks that were entirely ordinary for the period they belong to.

### The baseline window, and how it differs

**Baseline window** freezes the limits on rows 1 to N and extends them forward unchanged. A dashed grey marker shows where.

These two features answer opposite questions and should not be confused:

- A **baseline window** *tests* whether later points still belong to the same process. You do not yet know that anything changed, and you are asking the chart.
- A **change point** *declares* that they do not. You already know what happened and when, and you are telling the chart.

So use a baseline when you suspect a change and want evidence: freeze on the stable stretch and see whether later points break out. Use a change point when the change is a matter of record. Setting change points disables the baseline field, because running both at once has no coherent meaning.

One discipline applies to both: choose the row from knowledge of what happened, not by trying rows until the chart looks the way you want. Picking the boundary after seeing the answer is how honest charting turns into decoration. Say out loud which row you used and why.

## 10 · Signals and the Nelson rules

Rule 1 — a point outside the limits — always applies. The checkbox **Apply Nelson rules 2–8** adds the pattern rules, on by default.

| Rule | Pattern | Usually means |
|---|---|---|
| 1 | One point beyond three sigma | Something specific and datable happened |
| 2 | Nine in a row on one side of the centre | The average has shifted |
| 3 | Six steadily increasing or decreasing | A trend — drift, wear, seasonal climb |
| 4 | Fourteen alternating up and down | Over-adjustment, or two sources taking turns |
| 5 | Two of three beyond two sigma, same side | A shift beginning |
| 6 | Four of five beyond one sigma, same side | A smaller shift |
| 7 | Fifteen in a row within one sigma | Stratification, or limits computed too wide |
| 8 | Eight in a row all beyond one sigma | A mixture of two processes |

Extra rules are not free. Rule 1 alone gives roughly one false alarm in every 370 points. Running all eight together brings that to roughly one in 90 — about four times as many false alarms. With a monthly measure and eight rules, expect a spurious signal a little more than once a decade per chart; with fifteen charts on a dashboard, expect one most years.

That is often a fair trade for the extra sensitivity. It is not free, and anyone presenting a chart should know which rules were on.

## 11 · Median moving range

On XmR charts only. Uses the median of the moving ranges instead of the average, with the constant 3.145 in place of 2.660.

Turn it on when a small number of large jumps is inflating the average moving range and widening the limits so much that nothing signals. The median is barely affected by a few extreme gaps. Compare both — if they agree, use the average; if they disagree sharply, you have outliers worth understanding before you chart anything.

## 12 · Exporting and saving

| Button | What you get |
|---|---|
| Download chart as SVG | The first chart on the page as vector art. Fonts are written as attributes, so text stays laid out correctly in Illustrator, Inkscape, and PowerPoint. |
| Download chart as PNG | The same chart rasterised at 2× for slides and documents. |
| Save session as JSON | Data plus every setting — chart type, columns, subgrouping, baseline, flags. This is the only way to preserve work. |
| Open saved session | Restores a saved JSON exactly, including which checkboxes were ticked. |

SVG and PNG export the *first* chart rendered. To export a particular subgroup's chart, uncheck the split, filter to that subgroup, and export.

## 13 · Clearing data

**Discard all loaded data** sits alone at the bottom of the panel in a marked box, well away from the export buttons, and asks for confirmation. That separation is deliberate: an action that destroys work should never sit beside one that saves it.

There is no undo. Save the session first.

## 14 · The four worked examples

All four are synthetic and shaped to teach one thing each. None contains real patient data.

**Referral turnaround days — the subgrouping case.** Twenty-four months, two clinics, pooled into one column. Chart it as loaded, ungrouped: the limits come out at −10.5 to 25.7 days while the data only spans 3.7 to 11.8, and not a single point signals. Then set Subgrouping to `clinic`: 99.4% of the variation is between the clinics, F(1,46) = 3957. Tick **Chart each subgroup separately** and two tight, stable, entirely different processes appear — North at 4.18 days, South at 10.99. The pooled chart was not merely less informative. It reported "nothing to see" about a seven-day gap between two clinics.

**CHW home visits per week — the baseline case.** Thirty weeks, with a real program change at week 19. Chart it as loaded, then set the baseline window to 18. Signals go from 3 to 11.

**SCP completion rate — the overdispersion case.** Eighteen months, denominators from 820 to 1,400. As a classical p chart, 8 of 18 months fall outside the limits — an implausible amount of special cause. Sigma z is 2.37: the months move well over twice as much as the binomial model permits. Turn on Laney p′ and 1 of 18 remains. That one is worth a conversation; the other seven were the model failing, not the clinics.

**ED visits per 1,000 member-months — the varying denominator case.** Membership climbs from 3,200 to 9,300 member-months and falls back. Watch the limits narrow as membership grows and widen as it shrinks. Nothing is wrong; that is what correct limits do. A chart with fixed limits would flag the small months for being small.

## 15 · What this tool does not do

Stated plainly, because a tool that hides its limits is worse than one that lacks features.

| Not handled | What to do instead |
|---|---|
| Autocorrelation | Series with momentum — daily census, wait times, anything where today depends on yesterday — break the independence assumption and produce limits that are much too tight. The tool does not detect this. Sample at a longer interval, or model the series and chart the residuals in R. |
| X̄–R and X̄–S charts | Not included. The subgrouping panel does the diagnostic work these are usually reached for. If you need them, use the `qcc` package in R. |
| Rare events (g and t charts) | Days-between-events charting for things like infections or falls is not implemented. Use `qicharts2` in R. |
| Capability indices | No Cp/Cpk. They need a specification limit, and health care measures rarely have a real one. |
| Comparing many units at once | For fourteen clinics side by side, a funnel plot is the right tool and this is not it. The subgroup table gives the numbers; the picture would have to be built elsewhere. |
| Unequal group variances | The ANOVA in the subgrouping panel assumes group variances are roughly comparable. When one group is far more variable than the others, read the per-group SD column rather than trusting F. |
| Persistence | Nothing is stored. Closing the tab loses everything not exported. |

## 16 · Formulas and constants

Everything the tool computes, so it can be checked by hand or against another package. These follow Hart & Hart, *Statistical Process Control for Health Care* (Duxbury/Thomson, 2002).

XmR:

```
mR_i   = |x_i − x_(i−1)|
CL     = x̄
UNPL   = x̄ + 2.660 · mR̄        LNPL = x̄ − 2.660 · mR̄
URL    = 3.268 · mR̄             (moving range chart)
sigma  = mR̄ / 1.128             (1.128 = d2 at n = 2)

median moving range variant:
UNPL   = x̄ + 3.145 · mR̃        URL  = 3.865 · mR̃
```

p chart:

```
p̄       = Σd_i / Σn_i                 (pooled, not the mean of p_i)
p_i      = d_i / n_i
sigma_i  = √( p̄(1 − p̄) / n_i )
UCL_i    = p̄ + 3 · sigma_i            clamped to [0, 1]
```

u chart:

```
ū        = Σc_i / Σa_i
u_i      = c_i / a_i
sigma_i  = √( ū / a_i )
UCL_i    = ū + 3 · sigma_i            LCL clamped at 0
```

Laney p′ / u′:

```
z_i      = (p_i − p̄) / sigma_i
sigma_z  = mR̄(z) / 1.128
UCL_i    = p̄ + 3 · sigma_z · sigma_i
```

Subgrouping, one-way decomposition:

```
MSB      = Σ n_j (x̄_j − x̄)² / (k − 1)
MSW      = Σ Σ (x_ij − x̄_j)² / (N − k)
F        = MSB / MSW        on (k − 1, N − k) degrees of freedom

n0       = ( N − Σ n_j² / N ) / (k − 1)
var_between = max(0, (MSB − MSW) / n0)
var_within  = MSW
share       = var_between / (var_between + var_within)
```

The p-value comes from the regularised incomplete beta function, evaluated by continued fraction — no lookup tables, no normal approximation.

Shewhart constants:

| n | d₂ | d₃ | c₄ |
|---|---|---|---|
| 2 | 1.128 | 0.853 | 0.7979 |
| 3 | 1.693 | 0.888 | 0.8862 |
| 4 | 2.059 | 0.880 | 0.9213 |
| 5 | 2.326 | 0.864 | 0.9400 |
| 6 | 2.534 | 0.848 | 0.9515 |
| 7 | 2.704 | 0.833 | 0.9594 |
| 8 | 2.847 | 0.820 | 0.9650 |
| 9 | 2.970 | 0.808 | 0.9693 |
| 10 | 3.078 | 0.797 | 0.9727 |

The XmR constants derive from these: 3 ÷ d₂(2) = 3 ÷ 1.128 = 2.660, and 3 ÷ 0.954 = 3.145 for the median moving range, where 0.954 is the corresponding bias factor at n = 2. Beyond n = 10, c₄ is approximated by 4(n−1) ÷ (4n−3).
