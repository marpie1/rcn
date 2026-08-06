# RCN Timeline — model JSON schema

Verified against `tools/rcn-timeline.html` at commit `5d1c70c`, 2026-07-25. Derived from `importModel()` (line ~739), `exportModel()` (line ~734), `solve()` (the constraint solver), and `parseDate()`.

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

`importModel` accepts a short form too — `s`, `e`, `sf`, `ef` for `start`, `end`, `startFuzz`, `endFuzz`. `exportModel` always writes the long form. Write the long form.

## Links

| Field | Type | Notes |
|---|---|---|
| `id` | string | Auto-generated (`lk…`) if absent |
| `from`, `to` | string | Interval ids. **Note: `from`/`to` here, but the Graph Tool uses `src`/`tgt`.** |
| `rel` | string | See below |
| `who`, `note` | string | Attribution and free text |
| `conf` | number 0–1 | Default `0.8` |

### `rel` supports five values

A link reads **`<from> rel <to>`**.

```
before | meets | overlaps | during | equals
```

| `rel` | Means | Constraint on the target |
|---|---|---|
| `before` | gap between them | `to.s ≥ from.e` |
| `meets` | B starts exactly when A ends | `to.s = from.e` |
| `overlaps` | they share a stretch; A starts first and ends first | `from.s ≤ to.s ≤ from.e` and `to.e ≥ from.e` |
| `during` | **A sits wholly inside B** | `to.s ≤ from.s` and `to.e ≥ from.e` |
| `equals` | identical extent | `to.s = from.s`, same duration |

Note the direction on `during`: `A during B` means A is the contained one. Writing "A contains B" in the sentence box creates `B during A` — the inverse is the same link drawn the other way, which is why five stored relations cover seven of Allen's named ones.

**Two of Allen's seven are not implemented: `starts` and `finishes`.** Anything outside the five above is accepted and behaves as `before`; the Import report flags it by name. Do not emit a relation the tool will misread.

### The solver never rewrites a duration

It only ever **translates** the target interval, so each relation reduces to a permitted range for `to.s`. Two consequences worth authoring around:

- **If the target already satisfies the relation, nothing moves.** Dates you researched are not quietly replaced by dates the solver preferred. This is why the range is clamped to the nearest bound rather than snapped to a canonical position.
- **Some relations are impossible on durations alone**, and are reported as contradictions rather than forced: `during` needs a container at least as long as its content, `equals` needs matching durations. You get a named contradiction (`"RESULT" during "PILOT" can't hold — "PILOT" is 1 yr long and "RESULT" is 8 yr`), not a silent reshuffle.

Boundary contact counts as satisfying — whether two ends are exactly equal is not what this tool is for.

### `before` and `meets` still require disjoint intervals

Both are defined against `from.e`. If you link two intervals that overlap in the dates you authored *with `before` or `meets`*, the solver will still **move `to` and everything downstream** until the overlap is gone, and your dates are lost.

The difference since the five relations landed is that this is now a **wrong-relation error rather than an unsayable one**. A `RESULT` running 2022→2030 with `RESULT before SOLUTION` does not mean "the solution follows from the result"; it means "the solution cannot start until 2030." What you almost certainly meant was `SOLUTION during RESULT`, which now exists and moves nothing.

The Import report flags exactly this: an overlapping pair linked with `before`/`meets`, naming the three relations you might have wanted instead.

You can also still just **not link them**. Overlapping intervals sit side by side on their authored dates perfectly well. Links are for asserting relations you want enforced; the dates carry everything else.

`before` links are annotated on the canvas with their **slack** (`slack 2 yr 2 mo`), usually the most argumentative thing on the diagram — a long slack on a causal edge is the claim that the effect took years to land. The three overlapping relations are labelled with the relation name instead, since their geometry alone doesn't say which one is being asserted.

### Pending — relation sets (step two, not built)

The five relations above are *definite*: a link asserts exactly one. The larger idea in Allen's algebra is a link holding a **set** of candidate relations (`{before, meets}` = "I know the order, not whether they touch"), with a composition table deriving what's possible transitively. Two people's partial knowledge then **intersects** into something tighter than either had — the formal version of "accuracy is a group activity."

Deliberately not built. Full Allen consistency is NP-complete; path consistency is O(n³) and incomplete; and it collides with the dual-face design, since dragging asserts a definite configuration and would collapse the set. Decide that trade before building it.

## Dates

`parseDate()` accepts:

- `"Mon D YYYY"` — e.g. `"Jul 4 1776"`, `"Sept. 3rd, 1783"`. Month names and ordinal suffixes are tolerated. **This is the house style — use it.**
- a bare number — a fractional year (`1776.5` = mid-1776)
- negative years for BCE

`exportModel` writes dates back through `fmtDate`. Internally everything is a fractional year, so sub-year precision is preserved but sub-day is not.

## The solver

`solve()` iterates to a fixed point (max 200 passes), moving unpinned intervals to satisfy links. Consequences worth knowing before you author a file:

- **Contradictions are data, not errors.** If a constraint would move a pinned interval, the link is recorded in `issues` and surfaced, not silently applied. Pinning the things you actually know, and letting the rest float, is the intended way to use the tool.
- Order of `links` does not matter; it iterates.
- A cycle of `meets` links that cannot be satisfied will simply report contradictions.

## Choosing this tool

Use the timeline when the question is *when* and *in what order* — sequence, duration, overlap, and how confident anyone is about any of it. It is the temporal sibling of the Graph Tool (structure) and the Map (place).

`conf`, `who`, `startFuzz`/`endFuzz` are the reason to prefer it over a plain list of dates: it is built for **uncertain, attributed** history, which is what research on a town's institutional record actually produces. Use them. A timeline where every `conf` is 1 and every `who` is empty is not using the tool.

## Coming from a Graph Tool trace

The expected upstream. A trace in `graph-tool-v22.html` (edges tagged `traces: [1..4]`) is already a partial order — its animation waves say *this, then this*, at a fixed millisecond speed that makes a week and four years look the same. The timeline is where that ordering gets dates, durations, gaps, and confidence.

Node → interval, trace edge → link (`meets` for no gap, `before` for a gap), node label → interval label, legend family → interval colour. See "A trace is a partial order" in `schemas/graph-tool-v22.md` for the full translation and the trap that comes with it.

The two diagrams are meant to be read together: the graph is the argument about *what causes what*, the timeline is the argument about *whether the timing supports it*. A causal edge whose timeline slack is measured in years is a different claim from one whose slack is a week, and only the timeline shows it.

## Pre-flight

The **Import** button now runs these checks for you and shows a report before anything loads (red = will not load, amber = loads with a caveat, green = clean). Authoring a file by hand outside the tool, check the same list:

- every `links[].from` / `links[].to` matches an `intervals[].id`
- no `rel` value outside `before` / `meets` / `overlaps` / `during` / `equals`
- `end` present wherever you do not want a one-year default
- dates in `Mon D YYYY` form
- **no linked pair overlaps under `before` or `meets`** — if a pair genuinely overlaps, the relation should be `overlaps`, `during` or `equals`
- `during` targets are long enough to contain their content, and `equals` pairs have matching durations — otherwise you get a contradiction rather than a placement

Then load it and compare every solved `s`/`e` against the dates you authored. Anything that moved is a link you got wrong, not a date the solver improved:

  ```js
  importModel(m); solve();
  M.intervals.map(i => i.label+' '+i.s.toFixed(2)+'→'+i.e.toFixed(2))
  ```

## Worked example

`tools/t1-trace-timeline-demo.json` — the EIP schema's **T1 TRACE** (`PERSON -take-> ACTION -yield-> RESULT -yield-> SOLUTION -resolve-> PROBLEM`, plus `RESULT -yield-> SIDE EFFECT -creates-> PROBLEM`) laid out in time. The graph says a side effect exists; the timeline says it arrived two years after everyone stopped watching. One pinned interval (the deed), fuzz on everything reconstructed from interviews, `conf` from 0.45 to 1.
