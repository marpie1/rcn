# Graph Tool v22 — native JSON schema

Verified against `tools/graph-tool-v22.html`, 2026-07-25 (post legend-as-registry
and icon-node work; earlier baseline was commit `5d1c70c`).
Derived from `loadGraphJSON()` (import), `buildState()` (export), `makeNode()`
(defaults), and `shapeHTML()` (rendering).

## Minimum that renders

```json
{
  "version": "1.0",
  "modelName": "My Map",
  "nodes": [
    { "id": "a", "label": "Node A", "x": 100, "y": 80, "w": 150, "h": 60, "shape": "rounded" }
  ],
  "edges": [
    { "id": "e1", "src": "a", "tgt": "a", "label": "", "polarity": "none" }
  ]
}
```

`nodes` and `edges` must both be arrays. Use `"edges": []`, never omit it.

## Nodes

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | **yes** | Must be unique. Any string; `n1`-style not required. |
| `x`, `y` | number | **yes** | Finite. Centre of the node. |
| `w`, `h` | number | **yes** | Positive. `autoSize()` only ever *grows* these — it does not initialise them, so a missing `w` gives a NaN radius and the node paints as a bare label. |
| `label` | string | recommended | |
| `shape` | string | no | See enum below. Default `rounded`. |
| `color` | hex string | no | Fill. Default `#ffffff`. |
| `fontColor` | hex string or `"auto"` | no | Default `#000000`. `"auto"` picks a contrast colour from the fill. |
| `borderColor` | hex string or `""` | no | Default `#000000`. `""` means auto. |
| `borderWidth` | number | no | Default `1.5` |
| `borderDash` | `solid`\|`dashed`\|`dotted` | no | Default `solid` |
| `fontSize` | number | no | Default `12` |
| `note` | string | no | Free text, shown as an indicator on the node |
| `extraLabels` | array of string | no | Neo4j-style multi-label |
| `props` | object | no | **The extension bag.** See below. |
| `layer` | string | no | Named layer; layers can be hidden |

### `shape` is a STRING, not a numeric code

```
ellipse | rect | rounded | diamond | hexagon | cylinder | barrel
```

Source: `var SHAPES=[...]`, `graph-tool-v22.html:875`.

Any unrecognised value **falls back to `ellipse` with no error** — including
the number `0`. This is the single most likely thing to get wrong, because it
fails silently and looks deliberate.

## Edges

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | **yes** | Unique. Easy to forget — the tool renders without it, but the validator rejects it and duplicate/absent ids break selection and undo. |
| `src`, `tgt` | string | **yes** | Node ids. **The tool reads `src`/`tgt` only.** An edge using `from`/`to` imports successfully and then never renders. |
| `label` | string | no | |
| `polarity` | `+` \| `-` \| `none` | no | Default `none`. **Not CLD-only** — the `+`/`−` mark draws in every mode, including the base diagram. CLD mode additionally uses it for loop detection, where `none` is counted as neutral *silently*, so unset edges quietly grey out real loops. The `?± Gaps` toolbar toggle flags every edge still on `none`. |
| `color` | hex string | no | Default `#000000` |
| `width` | number | no | Default `1.5` |
| `fontSize` | number | no | Default `10` |
| `fontColor` | hex string | no | Falls back to the edge colour |
| `curved` | boolean | no | Default `false` |
| `delay` | boolean | no | Draws the delay hash mark |
| `dash` | `solid`\|`dashed`\|`dotted` | no | Default `solid` |
| `note` | string | no | |
| `props` | object | no | **The extension bag.** |
| `layer` | string | no | |
| `traces` | array of 1–4 | no | Trace-path membership, e.g. `[1,3]`. An edge can be in several. Legacy single `trace: 1` is migrated on load. |
| `arrowDir` | `reversed` \| `none` | no | Set by Alt+click on an edge, not something to author. `reversed` means `src`/`tgt` were swapped; `none` draws no arrowhead and holds the authored orientation. Absent = normal `src → tgt` arrow. |

Note the naming trap: graph edges use **`src`/`tgt`**, but timeline links use
**`from`/`to`**. They are different tools; do not carry the habit across.

## The legend IS the registry (icons, node kinds, relationship kinds)

A legend row defines a style. Nodes and edges point at a row via `type` and take
their look from it. Change the row, every follower changes. This is the primary
way to style an RCN drawing — do not hand-set colours on 26 nodes.

```json
"legendVisible": true,
"legendEntries": [
  { "id": "lg_support", "kind": "node", "label": "Supportive commons",
    "icon": "rcn_dwelling", "color": "#ffffff",
    "borderColor": "#16a34a", "borderWidth": 3 },
  { "id": "lg_harm", "kind": "edge", "label": "acts on them",
    "color": "#dc2626", "width": 3.5, "dash": "dashed" }
],
"nodes": [
  { "id": "housing", "type": "lg_support", "ovr": {"icon":"rcn_dwelling"},
    "label": "HOUSING", "x":165, "y":145, "w":72, "h":72, "shape":"rect" }
],
"edges": [
  { "id": "h1", "type": "lg_harm", "src":"fines", "tgt":"housing" }
]
```

| Row field | Applies to | Notes |
|---|---|---|
| `id` | both | **Required.** What `type` points at. |
| `kind` | both | `node` or `edge`. Missing = `node` (legacy rows). |
| `label` | both | The word people say out loud when pointing. |
| `icon` | node rows | Key from the house library. See below. |
| `color` | both | Node rows: **fill**. Edge rows: **stroke**. |
| `borderColor`, `borderWidth` | node rows | |
| `width`, `dash` | edge rows | `dash` is `solid`\|`dashed`\|`dotted`. |

**Resolution order** is `element.ovr[field]` → `legendRow[field]` → `element[field]`.
So an element with no `type` behaves exactly as it always did — this is fully
backwards compatible.

**`ovr` is the override bag.** Put a field there to diverge from the row for one
element (e.g. every node follows `lg_support` but each carries its own `icon`).
Editing a styled property of a typed element in the UI writes to `ovr`
automatically; "Clear overrides" in the legend panel empties it.

The legend renders **inside the SVG** (`#legend-layer`, not pan/zoom transformed),
so it survives PNG and SVG export. Before July 2026 it was an HTML div and
silently vanished from every export.

Budget: the panel warns above 8 rows and reports how many elements follow no row.
A drawing a group can read has roughly 6–8 kinds in it.

## Icons — `tools/rcn-icons.js`

`node.icon` (or the row's `icon`) takes a key from the RCN house icon library, a
**sidecar file loaded next to the tool**. If it is missing the tool degrades to
shapes-only; nothing breaks.

Icon nodes render the glyph centred, tinted with the border colour, and move the
caption **below** the box. The intended look is the Vera chart: one shape
(`rect`), white fill, meaning in the picture, a two-colour border code. Give icon
nodes a squarish `w`/`h` (72×72 works) and a short ALL-CAPS label.

49 starter icons across People, Place, Institution, Resource, Care, Harm,
Process, System. Browse them in `tools/rcn-icon-sheet.html`. Prefer an icon over
inventing a new shape — see `tools/neighborhood-cave-drawing.json` for a worked
example.

## `props` — where your own data goes

`props` is a flat `{string: string}` map on any node or edge. It is the only
place to put data the schema doesn't name, and it is the *right* place, because:

- it is editable in the Properties panel — add, rename, reorder, delete
  (`aEP`/`uEPK`/`moveEProp`/`rEP`, lines ~4274–4315)
- it is **searchable** — `renderEdge()` matches the search box against prop keys
  *and* values (line ~3233)
- the DOT, Cypher and CSV exporters carry it out

A bare top-level field on a node or edge (e.g. `"basis": "..."`) *does* survive
import and export, because both use `Object.assign` over the whole object. But
it is invisible in the UI, unsearchable, and dropped by every exporter. Use
`props`.

**Provenance convention:** for LLM-populated files, cite the source of each
claim in `props.basis`.

```json
{ "id": "e1", "src": "a", "tgt": "b", "label": "funds",
  "props": { "basis": "LLA audit report FY23, p.4" } }
```

## `schemaLabel` — what a node IS

Three different things get confused as "the name of a node". Keep them apart:

| Field | Question it answers | Free to change? |
|---|---|---|
| `label` | What do we CALL it on this drawing? | yes — it is for people |
| `schemaLabel` | What IS it, in the neighborhood schema? | no — it is the identity |
| `extraLabels` | What else is it called? Aliases, secondary types. | yes |
| `props.name` | WHICH one, when there are several? | it names an instance |

`schemaLabel` is a single string. `extraLabels` is a list, and a list cannot be
an identity — any rule for picking an element is arbitrary and order-dependent.
Some nodes legitimately carry several: Commitment is also Agreement, Promise and
Contract. Those are aliases worth keeping and worth exporting to Neo4j; they are
not what the node IS.

**The composition key is `schemaLabel` + `props.name`.** In
`tools/graph-composer.html`, two nodes from different subgraphs become one node
when both match.

`props.name` is the instance. `"?"`, `""` and absent are all normalised to the
same UNNAMED value, meaning "the type itself":

- Drawing the *schema* — one Person, one Org. Names are blank, so `schemaLabel`
  alone is the whole identity.
- Drawing an *actual neighborhood* — many Orgs. `schemaLabel` says `Org`,
  `props.name` says which one.

The display label is deliberately NOT part of identity. A node can be renamed
`HOUSING` or `Housing` or `the housing we have` for legibility without changing
what it merges with. Before this, the composer identified nodes by display label
and fell back to it for the instance name, which is how one file omitting
`props.name` silently split five entities into ten.

The composer reports `typed: 75/75` — how many source nodes carried a
`schemaLabel`. Anything short of full is amber: those nodes fall back to their
display label and will quietly fail to merge with a renamed sibling.

## Display-only data: the `_` prefix

Precedent: Neo4j's own Arrows tool gives a node a `caption` that displays
preferentially and does **not** import into Cypher. This tool generalises that:

> **A `props` key beginning with `_` is display-only.** It shows on hover, it is
> searchable, it is editable in the Properties panel — and it never reaches Neo4j.

```json
{ "id": "housing", "label": "HOUSING", "extraLabels": ["Dwelling"],
  "props": {
    "units": "42",
    "_why": "rent burden is the pressure point here",
    "_source": "2026 resident survey"
  } }
```

`units` is data and becomes a Neo4j property. `_why` and `_source` are glosses
for whoever is reading the drawing and stay on the drawing. That exports as:

```
CREATE (n0:HOUSING:Dwelling {units: "42"} )
```

Works on edges too.

`note` is display-only for the same reason — a pin is an annotation for a
reader, not a property of the thing. It no longer exports as a Cypher property.
(It did until July 2026.)

Display-only entries render italic and slightly dimmed in the hover tooltip, so
gloss is visually distinct from data.

**Arrows import:** an Arrows node's `labels` now land in `extraLabels`, where
they belong. They previously became a joined string in `props._labels`, so an
Arrows to Cypher round trip lost the labels *as labels* and emitted a junk
property in their place.

## Top-level keys

`buildState()` (line ~4330) emits **exactly** these, and nothing else:

```
version  modelName  modelNote  canvasBg  graphAttrs  cldLoopNames
legendEntries  legendVisible  legendCollapsed  customSymbols
nodes  edges  lines  metaEdges
```

(`legendEntries` now carries the registry — see "The legend IS the registry".)

**Any other top-level key is silently discarded on export.** Unknown *node* and
*edge* fields survive; unknown *top-level* keys do not. This asymmetry is the
trap.

In particular, a `meta: { title, description, author, ... }` block — a natural
thing to write, and what an LLM will reach for — evaporates the first time
anyone exports from the tool. Put that information where the tool keeps it:

- `modelName` — the title. Populates the Model Name field.
- `modelNote` — description, provenance, author, date. Populates Note/Source.

Keeping a `meta` block *as well* is fine for the source-of-truth file; just
never let it be the only copy.

### The other top-level keys

- `canvasBg` — hex string
- `cldLoopNames` — `{"nodeId,nodeId,...": "Loop name"}`. Key is the loop's node
  ids **sorted lexically**, comma-joined.
- `lines` — free-drawn annotation lines: `{id, x1, y1, x2, y2, color, width, dash, arrowhead, label}`
- `metaEdges`, `legendEntries`, `legendVisible`, `legendCollapsed`,
  `customSymbols`, `graphAttrs` — tool-managed; omit unless you know what you're
  writing. `legendCollapsed` shrinks the on-canvas legend to a `LEGEND (n)` title
  bar; `legendVisible: false` removes it altogether. They are independent.

## Choosing this tool

Web research and interview notes naturally yield an **actor map** — who exists,
how they relate, where the claim came from. That is what this tool is for in
Basic mode. It is *not* a causal map: do not invent causality to fill a CLD.
Switch to CLD mode only when the causal claims are real, because polarity and
loop detection will then be doing actual work.

Other modes (`EIP`, `NRM`, `OPM`, `SFD`, `Wardley`, `Trace`) carry their own
node typing and semantic colour palettes. Do not hand-write colours for those —
set the mode and let the tool assign them.

## A trace is a partial order — hand it to the Timeline

Trace mode tags edges with `traces: [1..4]`. `startTraceAnim()` finds the roots
(trace-edge sources that no trace edge targets), then BFS's outward in **waves**,
each wave lighting one step later than the last.

Those waves are a partial order. They say *this, then this, then this*. What they
cannot say is **when**, **for how long**, or **how big the gap is** — the
animation runs at a fixed `trace-speed` in milliseconds, so a step that took a
week and a step that took four years look identical.

That is precisely what `tools/rcn-timeline.html` adds. The pairing:

| | Graph Tool, Trace mode | Timeline |
|---|---|---|
| Answers | what causes what | when, how long, how far apart |
| Trace edge `A → B` | one animation step | a `before` or `meets` link |
| Wave depth | ordinal position | an actual date |
| Uncertainty | not represented | `startFuzz`/`endFuzz`, `conf`, `who` |

**`sendTraceToTimeline(n)`** does this — Trace mode's panel has a
"Send trace to Timeline" row of T1–T4 buttons beside the animate row. It reuses
`traceWaves()`, which is `startTraceAnim()`'s root-finding and BFS factored out,
so the thing you send is the thing you watched. Handoff is
`rcn-timeline.html#tl=<base64>`.

What it emits, and why:

| Choice | Reason |
|---|---|
| node → interval, **interval id = graph node id** | the bridge back; a future tool can match them |
| trace edge → **`before`, never `meets`** | a trace edge asserts sequence, not adjacency. `meets` would claim "no gap", which the graph never said — and two `meets` into one node would contradict on arrival |
| one placeholder year per wave depth | the order is real; the durations are not |
| interval `conf` 0.3, `who` empty | the DATES are unattributed — nobody has dated them |
| link `who` = "T*n* trace, *model*", `conf` 0.8 | the ORDER **is** attributed: the graph said so |

That split is the point. The converter hands over what the graph actually knows
and is conspicuously silent about the rest, because filling in the durations is
the step where a group discovers which of its confident causal arrows nobody can
date.

Doing it by hand instead:

1. Each **node** on the trace path becomes an **interval**. Give it a duration —
   this is the step where you find out whether you know one.
2. Each **trace edge** becomes a link: `meets` if the next thing begins as this
   one ends, `before` if there is a gap.
3. Keep the node's display label as the interval label so the two diagrams can
   be read side by side.
4. Colour the intervals by the node's legend family, so the palette carries over.

**The trap:** a graph node that names an ongoing *state* ("building in community
ownership") becomes an interval with no end, and you cannot link out of it —
see "Both relations require the intervals to be disjoint" in
`schemas/rcn-timeline.md`. Bound it to the event that actually causes the next
thing, or drop the link and let the dates speak.

Worked example: `tools/eip-schema-cld.json` T1 → `tools/t1-trace-timeline-demo.json`.

Worked example: `tools/eip-schema-cld.json` carries the T1 trace on six edges
(PERSON→ACTION→RESULT→{SOLUTION, SIDE EFFECT}→PROBLEM). Press ⏳ T1.

## Receiving a graph from the Composer

`graph-composer.html` speaks Ward's `graph.js` format (`nodes`/`rels`, identity
by array index, no geometry) and this tool speaks its own. The Composer's
**Open in Graph Tool** converts and hands over via the URL hash:

```
graph-tool-v22.html#graph=<base64 of the state object>
```

`loadFromURL()` decodes with `JSON.parse(decodeURIComponent(escape(atob(raw))))`,
so anything writing that hash must encode the mirror image —
`btoa(unescape(encodeURIComponent(json)))` — or non-ASCII labels corrupt.

The conversion worth copying if you ever write another one: **coordinates come
out of the rendered Graphviz SVG**, not from the data. Ward's format has no
geometry, and `autoSize()` here only grows `w`/`h` rather than initialising
them, so a node without a width paints as a bare label. Reading `getBBox()` off
each `g.node` gives the layout the user is already looking at. Graphviz SVG
user space is already screen-oriented (y grows downward), so positions only
need shifting into positive space — no axis flip.

## Pre-flight

```
node tools/validate-rcn-graph.js yourfile.json
```

Then load it and re-export before trusting it. The validator cannot see the
`meta` class of bug.
