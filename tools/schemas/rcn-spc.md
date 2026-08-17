# RCN Process Behavior Charts — input CSV and session JSON

Derived from `tools/rcn-spc.html` as first written, 2026-08-15 — **not yet committed, and not yet opened in a browser.** Re-derive and re-verify before trusting this file. Sources inside the tool: `parseCSV()`, `loadData()`, the `SPC` namespace, and the save/open handlers on `#jsonBtn` / `#jsonInput`.

This tool is unlike the other three in the schemas folder: its primary input is **CSV**, not JSON. The JSON format below is a session save — data plus UI state — and exists for reproducibility, not for authoring.

## The CSV contract

First row is column names. Everything after is data. Values containing `$`, `%`, commas, or surrounding whitespace are coerced to numbers when they parse; anything else stays a string. Quoted fields with embedded commas and doubled quotes (`""`) are handled.

**Rows are charted in the order they appear in the file. The tool never sorts.** An out-of-order series produces a meaningless moving range and therefore meaningless limits, with no warning. Sort before loading.

### Long format, always

One row per observation. Do not put each clinic in its own column — subgrouping needs a column to group *by*, so the grouping variable must be a column of values, not a set of columns.

```csv
month,clinic,days
2025-01,North,4.1
2025-01,South,10.9
2025-02,North,3.8
2025-02,South,11.3
```

### Rates need numerator and denominator as separate columns

Never pre-compute a percentage. The tool cannot compute limits for a p or u chart without the denominator, because the limit width at each point is a function of that point's own denominator.

```csv
month,enrolled,completed
M01,820,426
M02,905,498
```

### Column roles

| Role | Chart types | Requirement |
|---|---|---|
| Order (x axis) | all | Any column. Used only for point labels; the actual order is row order. |
| Value | XmR, run | Must be numeric. Non-numeric rows are dropped silently. |
| Numerator | p, u | Numeric. Events, or the count of the thing. |
| Denominator | p, u | Numeric. Denominator ≤ 0 yields a rate of 0 and a sigma of 0 at that point. |
| Group | all (optional) | Any column. String or number; coerced to string for grouping. |

## What the tool computes

Formulas are listed in full in `tools/rcn-spc-manual.html` §16. The three that most often differ between packages, stated here so a generated dataset can be checked against expected output:

**Centre line on p and u charts is pooled** — `Σd/Σn`, not the mean of the individual rates. A generator that produces rates whose unweighted mean differs from the pooled proportion will not match the tool's centre line, and that is the tool being right.

**XmR limits come from the average moving range**, `x̄ ± 2.660·mR̄`, never from the standard deviation of the values. Synthetic data with a deliberate step change will show much wider limits than `mean ± 3·SD` would suggest — expected, and the entire point.

**Overdispersion is detected, not assumed away.** `sigma_z = mR̄(z)/1.128` where `z_i = (p_i − p̄)/sigma_i`. Any p or u dataset with denominators in the hundreds or thousands and realistic month-to-month movement will come out overdispersed (`sigma_z > 1.2`) and the tool will say so in a red banner. If you are generating demo data that is *supposed* to look well-behaved on a classical p chart, you must keep the rates within roughly `±3·√(p̄(1−p̄)/n)` of the centre line — which for n = 1200 is about ±1.4 points of percentage. This is much tighter than intuition suggests.

## Designing a dataset to demonstrate something

The four built-in demos are in the `DEMOS` constant. Each targets one failure mode; copy the shape rather than inventing one.

| To show | Build |
|---|---|
| Mixture (the subgrouping case) | Two groups with clearly separated means and small within-group spread, interleaved row by row. Pooled limits become absurdly wide and nothing signals. |
| A real shift | A stable stretch, then a step of 2–3 within-process sigma, sustained. Demonstrate with the baseline window set to the last stable row. |
| Overdispersion | Denominators in the high hundreds or thousands, with rates varying by several percentage points month to month. |
| Stepped limits | Denominators that vary by 3× or more across the series. |

## Session JSON

Written by **Save session as JSON**, read by **Open saved session…**. Not intended for hand-authoring, but hand-editing works.

```json
{
  "format": "rcn-spc/1",
  "saved": "2026-08-15T21:00:00.000Z",
  "data": {
    "cols": ["month", "clinic", "days"],
    "rows": [["2025-01", "North", 4.1], ["2025-01", "South", 10.9]]
  },
  "note": "optional string shown under the data panel",
  "settings": {
    "chartSel": "xmr",
    "orderSel": "month",
    "valueSel": "days",
    "numSel": "", "denSel": "",
    "groupSel": "clinic",
    "scaleInput": "1000",
    "baseInput": ""
  },
  "changePoints": [
    { "row": 19, "note": "Second CHW joined", "url": "https://example.org/record" },
    { "row": 34, "note": "Referral form simplified", "url": "" }
  ],
  "flags": {
    "splitChk": false, "medianMR": false,
    "laneyChk": false, "nelsonChk": true
  }
}
```

`changePoints` is the authoritative record of process changes: `row` is the 1-based row at which a new phase begins, `note` says what changed, `url` optionally links to the record of it. Rows below 2 are dropped and duplicates collapse, keeping the first note seen. When the array is non-empty the tool ignores `baseInput` — freezing and phasing answer opposite questions and combining them has no coherent meaning.

Older sessions that carry `settings.cpInput` (a bare comma-separated row list, no notes) still load; the rows are honoured and the notes come up empty. New saves write `changePoints` and drop `cpInput`.

Only `http://` and `https://` values in `url` are rendered as links, in the tool and in exported SVG. Anything else — `javascript:`, `data:`, a bare domain — is kept in the file and shown as plain text, never as an anchor.

`data.rows` must be parallel to `data.cols` — the loader indexes by position, not by name, and a short row yields `undefined` rather than an error. `chartSel` is one of `xmr` / `p` / `u` / `run`. `settings` values are all strings because they come from DOM inputs; `flags` values are booleans. Unknown keys in either object are ignored, and missing ones leave the current UI value in place.

The only validation on open is `s.data && s.data.cols`. A file that passes that check but has malformed rows will load and render nonsense.

## Known round-trip loss

Per the folder's rule 1 — structural validity is not survival — assume loss until a round trip has been diffed. Two are known by inspection and neither has been tested in a browser yet:

- **The demo `note` survives, but the demo identity does not.** Reopening a saved session restores `note` as free text; `#demoSel` is left blank, so the intro banner keyed off the demo name will not reappear.
- **Nothing records which chart was exported.** SVG and PNG export the *first* chart on the page. With **Chart each subgroup separately** ticked, that is whichever subgroup sorted first, and the file name does not say which.

## Not implemented — do not generate data expecting these

Autocorrelation handling, X̄–R and X̄–S charts, g and t charts for rare events, capability indices, funnel plots. Full list with alternatives in the manual §15.
