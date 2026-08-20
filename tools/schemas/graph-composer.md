# Graph Composer — its own data files, and what the export keeps

The reference chat-Claude doesn't have, for the two sidecars the Composer reads
and the one round trip it does not survive intact.

**Derived from `tools/graph-composer.html` at commit `3e719db` (2026-07-29)**,
from the tool's own load and render functions, with line references. When the
tool changes this file is wrong until someone re-derives it — check the commit
line before trusting it.

Graph *files* are the same native format the Graph Tool uses; that is documented
in [graph-tool-v22.md](graph-tool-v22.md) and not repeated here. This file
covers what is **specific to the Composer**.

---

## 1. What the Composer reads

Exactly two files, both loaded by `<script>` tag, both assigning to `window`:

| File | Global | Read at | Supplies |
|---|---|---|---|
| `tools/families.js` | `window.FAMILIES_DATA` | `loadFamilies()` — line 1070 | family membership, ring colour, pale fill, legend order, the note arguing each assignment |
| `tools/graph-sets.js` | `window.GRAPH_SETS_DATA` | `loadGraphSets()` — line 1023 | which set buttons appear, and the filenames behind each |

**They are `.js` and not `.json` on purpose.** `fetch()` cannot read a `file://`
URL — Chrome throws `TypeError: Failed to fetch` — so a JSON sidecar leaves
every node grey when the tool is opened straight off disk. A `<script>` tag has
no such restriction. Same pattern as `rcn-icons.js` and `rcn_static_data.js`.
There is no `.json` twin of either; do not reintroduce one.

**What it does NOT read.** `tools/eip-schema-cld.json` is reference only — the
signed CLD a human consults, not an input. `tools/edge-families.js` belongs to
the Graph Tool; the Composer only ever reads `props.linkFamily` off an edge when
searching (line 2281). The family and schema "diagrams" are **not files at all**
— they are computed views (§3).

### families.js

```js
window.FAMILIES_DATA =
{
  "order":    ["Setting", "Institution", "Aim", "Doing",
               "Outcome", "Issue", "Resource", "Person"],
  "families": {
    "Doing": {
      "color":     "#e69f00",   // the RING — full strength, the discriminating channel
      "fill":      "#f6db9e",   // the node FILL — pale, so black text always reads
      "fontColor": "#000000",   // vestigial on canvas; see §4
      "members":   ["Action", "Commitment", "Conversation", "Possibility", "Trust"]
    }
  },
  "concepts": {
    "Action": { "family": "Doing", "note": "the act itself." }
  }
}
```

- `concepts` is the lookup that matters — keyed by **schemaLabel, spaces
  stripped** (`famKey()`), because the CLD writes `ActiveGoal`/`SideEffect` and
  the subgraphs write `Active Goal`/`Side Effect`. Neither is wrong; the key
  tolerates both.
- `members` is **display only** — the legend count and its hover title. Membership
  is decided by `concepts`, so a name in `members` that is missing from
  `concepts` is invisible to the drawing.
- `order` drives the legend and nothing else. A family present in `families` but
  absent from `order` will colour nodes and never appear in the legend.
- A schemaLabel with no `concepts` entry gets grey fill `#e8e6e0` and grey ring
  `#8a8880` (`familyFill()`, line 1002) — the honest fallback. The Composer does
  not assume this or any taxonomy.

### graph-sets.js

```js
window.GRAPH_SETS_DATA =
{
  "sets": [
    { "name":  "EIP aspects — variabilized",
      "dir":   "eip-aspects-variabilized",   // relative to graph-composer.html
      "note":  "shown as the button's tooltip",
      "files": ["action.json", "…"] }        // extension optional; see below
  ]
}
```

- **HTTP cannot list a directory**, so filenames must be written down. This file
  is therefore the one place to register a new subgraph.
- `dir` may be an absolute path (`/projection/subgraph`) to read a set from a
  server rather than from disk.
- `files` entries are fetched as `${dir}/${f}` — the substrate set omits `.json`
  because its endpoint takes a bare name. Beam rows strip a trailing `.json`.
- `loadGraphSet()` (line 1039) **replaces** any previous copy of the same set
  rather than appending, and ticks **only** that set. Ticking the whole beam
  would silently composite the set together with the demo graphs — 30 nodes
  instead of 25, a result that looks plausible rather than wrong.
- Set loading needs a server whatever the manifest says, because the subgraph
  files themselves must be fetched. `offline` (line 1021) detects `file://` and
  replaces the buttons with a note pointing at drag-and-drop.

---

## 2. The merge key is not fixed — it is the detail level

`LEVELS` (line 1104), `nodeKey()` (1106), `nodeText()` (1124). Each key extends
the previous one, so the levels are strictly nested and a coarser view is a
genuine **contraction** of a finer one.

| Level | Merge key | Reads as | All 16 EIP aspects | WA Health, all 8 |
|---|---|---|---|---|
| `family` | family lookup | `Doing` | 8 nodes / 54 edges | 6 / 20 |
| `schema` | `schemaLabel` | `Action` | 24 / 63 | 8 / 25 |
| `variable` | + `label` | `Effectiveness of ACTION` | 25 / 64 | 92 / 155 |
| `instance` | + `props.name` | + the named case | 25 / 64 | 96 / 156 |

> ⚠ **The EIP edge counts above are stale.** Measured 2026-08-08 by counting
> rendered `g.edge` groups: `8 / 28`, `24 / 57`, `25 / 58`, `25 / 58`. The node
> counts are right; only the edge counts disagree. Confirmed pre-existing and not
> caused by the `families.js` additions — the committed and extended sidecars
> produce identical numbers. Most likely the original figures counted model edges
> before Graphviz folds parallel ones. Re-derive before quoting.

The WA Health column is the first **non-EIP** set, and it is the one that shows
`variable` and `instance` doing different work: five labels occur twice in that
source, so `variable` merges them by words and `instance` separates the four that
are genuinely distinct circles by `props.name`. On the EIP set those two levels
are identical because every `props.name` is still `"?"`.

- `composite(concepts, level)` (line 1134) takes the level, so **switching level
  re-composites** — it is not a relabelling.
- Keys below `family` are `JSON.stringify([...])`, so a label cannot impersonate
  a field boundary.
- A concept with no family entry keys on `?<schemaLabel>` at family level, so it
  stays itself instead of collapsing into one nameless bucket with every other
  stranger.
- `instance` matches `variable` on the EIP set only because every `props.name`
  is still `"?"`. That level is empty, not broken.

**The trap for anyone editing subgraph files:** at `variable` level the *words
are the identity*. 14 of the 25 EIP variable labels appear in more than one file
(`Effectiveness of ORG` in 9 of 16). Rename one in a single file and that concept
silently splits in two, and it will read as a modelling change rather than a typo.

Polarity is dropped and parallel edges fold at `family` and `schema` level
(`dotify()`, line 1315), because a signed link needs a quantity at both ends and
a bare concept has no magnitude — only a variable *of* it does.

---

## 3. Round trip — where it is lossless, and where it is not

Per the rule in [README.md](README.md): structural validity is not survival, and
the only test that catches this class is load → re-export → diff.

**Lossless:** node and edge counts at all four levels; `schemaLabel`;
`props`; geometry (read back out of the rendered SVG, since Graphviz did the
layout); `canvasBg`.

### ⚠ The exported `label` is the VARIABLE label, whatever level you were viewing

`toGraphToolState()` line 2088:

```js
const label = p.label || name || n.type || `node${i}`
```

Measured at commit `3e719db`, first node of the 16-aspect composite:

| Viewing | On screen | Exported `label` |
|---|---|---|
| `family` | `Doing` | `Effectiveness of ACTION` |
| `schema` | `Action` | `Effectiveness of ACTION` |
| `variable` | `Effectiveness of ACTION` | `Effectiveness of ACTION` ✓ |

So exporting a **family-level** drawing of 8 blobs yields 8 nodes labelled with
whichever member happened to win the merge, and a **schema-level** skeleton
exports carrying variable labels. The counts and the structure are right; only
the words disagree with what was on the canvas. Nothing errors.

This contradicts the stated intent — *export whatever is visible*. **Known, not
yet fixed** as of `3e719db`. The fix is to take the label from
`nodeText(node, level)` rather than `p.label`; the reason it has not simply been
applied is that it changes what the Graph Tool receives for the two coarse
levels, which is a decision rather than a repair.

### Other things the export synthesises rather than preserves

- `color`, `fontColor`, `borderColor`, `borderWidth` are **computed** from family
  and merge depth, then flagged `props._composerFill = "1"` so re-importing drops
  them. A node cannot keep a family fill in a drawing that knows nothing of
  families, nor a thick ring in a composite where it no longer merges.
- Fills authored in the source subgraphs are **ignored entirely** on the canvas.
  They used to win over the merge indicator, which is why colour here was
  confusing.
- `props._schemaLabel` and `props.label` are deleted from `props` on the way out
  — they are promoted to the top level as `schemaLabel` and `label`.
- At `family` level, `mergeProps` unions the props of every member, so one node
  can carry `cost`, `scope` and `CoSt` together. Correct, and worth expecting.
- Merge depth itself (`merged.sources`) is **not** persisted — it is a fact about
  one composite, recomputed every time.

---

## 4. Two things that look like bugs and are not

**Node text is always black.** `#canvas .node text { fill:#000 !important }` in
the tool's own stylesheet overrides whatever `fontcolor` Graphviz writes, so the
per-family `fontColor` above can never reach the canvas. That is *why* the fills
are pale: worst black-on-fill contrast is 12.7:1. Edge labels do follow the
canvas colour, because they sit on it with nothing behind them.

**Click-and-hold listens on pointer events, not mouse events.** svg-pan-zoom
calls `preventDefault()` on `pointerdown`, which by specification suppresses the
compatibility mouse events — over this canvas the browser fires `pointerdown`
then `click` and **never** `mousedown`. A `mousedown` handler here cannot run.
Do not "simplify" it back.

---

## 5. Re-deriving this file

    grep -n "^function nodeKey\|^function nodeText\|^function familyOf\|^function familyFill\|^const LEVELS\|^function loadFamilies\|^function loadGraphSets\|^async function loadGraphSet\|^function composite\|^function toGraphToolState\|^function dotify" tools/graph-composer.html

Then check the counts against the 16-aspect set at each level, and re-run the
export comparison in §3 — that is the check that caught the label mismatch.

Related: [graph-tool-v22.md](graph-tool-v22.md) for the file format,
[ward-graph.md](ward-graph.md) for where composition came from,
`../graph-composer-manual.html` §5/§7/§10 for the user-facing account,
`../eip-cld-subgraph-mismatches.md` for the 31 open modelling questions.
