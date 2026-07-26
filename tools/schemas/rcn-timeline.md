# RCN Timeline — model JSON schema

Verified against `tools/rcn-timeline.html` at commit `5d1c70c`, 2026-07-25.
Derived from `importModel()` (line ~739), `exportModel()` (line ~734),
`solve()` (the constraint solver), and `parseDate()`.

## Minimum that loads

```json
{
  "name": "Jeanerette fiscal administration",
  "intervals": [
    { "id": "iv1", "label": "State fiscal administration", "start": "Jul 1 2023", "end": "Jun 30 2024" }
  ],
  "links": []
}
```

## Intervals

| Field | Type | Notes |
|---|---|---|
| `id` | string | Auto-generated (`iv…`) if absent, but **supply your own** — `links` reference these. |
| `label` | string | Defaults to `"Event N"` |
| `start` | date | See date formats. Defaults to `0` if unparseable. |
| `end` | date | **Defaults to `start + 1` (one year) if missing** — not to `start`. |
| `startFuzz` | number | Years of uncertainty before `start`. Default `0`. |
| `endFuzz` | number | Years of uncertainty after `end`. Default `0`. |
| `pinned` | boolean | A pinned interval will not be moved by the solver; a constraint that would move it is recorded as a contradiction instead. Default `false`. |
| `color` | hex string | Defaults to a rotating palette colour by index |
| `row` | number | Vertical lane. Defaults to array index. |
| `who` | string | Attribution — who asserts this |
| `note` | string | Free text |
| `conf` | number 0–1 | Confidence. **Default `0.8`**, not 1. |

`importModel` accepts a short form too — `s`, `e`, `sf`, `ef` for
`start`, `end`, `startFuzz`, `endFuzz`. `exportModel` always writes the long
form. Write the long form.

## Links

| Field | Type | Notes |
|---|---|---|
| `id` | string | Auto-generated (`lk…`) if absent |
| `from`, `to` | string | Interval ids. **Note: `from`/`to` here, but the Graph Tool uses `src`/`tgt`.** |
| `rel` | string | See below |
| `who`, `note` | string | Attribution and free text |
| `conf` | number 0–1 | Default `0.8` |

### `rel` supports exactly two values

```
meets | before
```

- `meets` — `to.start` is forced equal to `from.end`
- `before` — `to.start` is pushed to be ≥ `from.end` (minimum gap 0)

**This is not the full set of 13 Allen relations.** `solve()` tests
`rel === "meets"` and treats *everything else* as `before` — so `"overlaps"`,
`"during"`, `"starts"`, `"finishes"`, `"equals"` are accepted without complaint
and silently behave as `before`. If you need those semantics, they do not exist
yet; say so rather than emitting a relation name the tool will misread.

### Both relations require the intervals to be disjoint

`meets` and `before` are both defined against `from.end`. Neither can express
"B happens *during* A." If you link two intervals that overlap in the dates you
authored, the solver will not complain — it will **move `to` and everything
downstream of it** until the overlap is gone, and your dates are silently lost.

This bites hardest with long-running states. A `RESULT` interval that runs
2022→2030 with `RESULT before SOLUTION` does not mean "the solution follows from
the result"; it means "the solution cannot start until 2030."

Two ways out, both legitimate:

- **Bound the interval** to the event that actually causes the next thing
  (`title transferred, Nov 2022 – Feb 2023`) rather than to the state it opens.
- **Don't link it.** Overlapping intervals just get authored dates and sit side
  by side. Links are for sequence; the dates carry everything else.

`before` links are annotated on the canvas with their **slack** (`slack 2 yr
2 mo`). That label is usually the most argumentative thing on the diagram —
a long slack on a causal edge is the claim that the effect took years to land.

## Dates

`parseDate()` accepts:

- `"Mon D YYYY"` — e.g. `"Jul 4 1776"`, `"Sept. 3rd, 1783"`. Month names and
  ordinal suffixes are tolerated. **This is the house style — use it.**
- a bare number — a fractional year (`1776.5` = mid-1776)
- negative years for BCE

`exportModel` writes dates back through `fmtDate`. Internally everything is a
fractional year, so sub-year precision is preserved but sub-day is not.

## The solver

`solve()` iterates to a fixed point (max 200 passes), moving unpinned intervals
to satisfy links. Consequences worth knowing before you author a file:

- **Contradictions are data, not errors.** If a constraint would move a pinned
  interval, the link is recorded in `issues` and surfaced, not silently applied.
  Pinning the things you actually know, and letting the rest float, is the
  intended way to use the tool.
- Order of `links` does not matter; it iterates.
- A cycle of `meets` links that cannot be satisfied will simply report
  contradictions.

## Choosing this tool

Use the timeline when the question is *when* and *in what order* — sequence,
duration, overlap, and how confident anyone is about any of it. It is the
temporal sibling of the Graph Tool (structure) and the Map (place).

`conf`, `who`, `startFuzz`/`endFuzz` are the reason to prefer it over a plain
list of dates: it is built for **uncertain, attributed** history, which is what
research on a town's institutional record actually produces. Use them. A
timeline where every `conf` is 1 and every `who` is empty is not using the tool.

## Pre-flight

The **Import** button now runs these checks for you and shows a report before
anything loads (red = will not load, amber = loads with a caveat, green = clean).
Authoring a file by hand outside the tool, check the same list:

- every `links[].from` / `links[].to` matches an `intervals[].id`
- no `rel` value other than `meets` or `before`
- `end` present wherever you do not want a one-year default
- dates in `Mon D YYYY` form
- **no linked pair overlaps** — then load it and compare every solved `s`/`e`
  against the dates you authored. Anything that moved is a link you got wrong,
  not a date the solver improved:

  ```js
  importModel(m); solve();
  M.intervals.map(i => i.label+' '+i.s.toFixed(2)+'→'+i.e.toFixed(2))
  ```

## Worked example

`tools/t1-trace-timeline-demo.json` — the EIP schema's **T1 TRACE**
(`PERSON -take-> ACTION -yield-> RESULT -yield-> SOLUTION -resolve-> PROBLEM`,
plus `RESULT -yield-> SIDE EFFECT -creates-> PROBLEM`) laid out in time. The
graph says a side effect exists; the timeline says it arrived two years after
everyone stopped watching. One pinned interval (the deed), fuzz on everything
reconstructed from interviews, `conf` from 0.45 to 1.
