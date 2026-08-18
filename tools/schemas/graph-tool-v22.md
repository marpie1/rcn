# Graph Tool v22 — native JSON schema

Verified against `tools/graph-tool-v22.html`, **2026-08-16** (post LOP mode;
previously 2026-07-29, post substrate round-trip work; 2026-07-25, post
legend-as-registry and icon-node work; earlier baseline was commit `5d1c70c`).
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

### `cylinder` and `barrel` draw wider than their declared `w`

The end-caps are painted outside the box, so a cylinder occupies visibly more horizontal space than `w` says. Nodes spaced on `w` alone will overlap, and the overlap looks like a layout bug rather than a shape property. Budget roughly an extra 15–20% of `w` on each side, or space cylinders on centres about 1.6× `w` apart. Verified 2026-08-17 by rendering three 270-wide cylinders on 480px centres, which collided.

### Labels auto-wrap, and authored `\n` is ignored

`label` is wrapped to fit the node; newline characters in the string are **not** honoured as line breaks. A label written as three clauses separated by `\n` renders as one long wrapped blob that overflows or shrinks, with no warning and a clean validator pass.

Keep labels to one or two words wherever possible and **put the gloss in the legend row and the detail in `note`**. That is what legend-as-registry is for: the row explains the kind once, the label names the instance, and the note carries the sentence. Verified 2026-08-17 — a four-node diagram whose labels each carried name, definition and examples was unreadable until the labels were cut to a single word each.

### `note` exports as an SVG `<title>` — hover works outside the tool

Anything in a node's or edge's `note` is written into the exported SVG as a `<title>` child, prefixed with 📌. Browsers render that as a native tooltip, so **the same field gives hover annotations both inside the Graph Tool and in any HTML document that inlines the exported SVG**. There is no second annotation mechanism to build. Annotate every node and edge and the exported diagram carries its own commentary. Verified 2026-08-17 across four diagrams (12, 17, 24 and 23 notes).

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

### Export stamps the resolved style onto every element (Aug 2026)

The row outranks the element's own field, so **an element that follows a row needs no colour of its own to draw correctly.** That is the convenience and the trap: a file where every node carries only `type` renders perfectly here and is *entirely unstyled* to anything that does not implement `sv()` — a Neo4j projection, a converter, an LLM reading the JSON, or a person scanning it.

Worse, `loadGraphJSON()` spreads defaults with `Object.assign({dash:'solid',...}, e)`, so every edge gets `dash:"solid"` written in explicitly. A row saying `dashed` still overrode it at render time, so the drawing showed dashed edges while the file asserted solid. The file **contradicted the screen**.

`stampStyle()` now runs inside `buildState()`, writing each element's resolved value as a bare field: node `color`/`borderColor`/`borderWidth`/`borderDash`/`fontColor`/`fontSize`/`icon`, edge `color`/`width`/`dash`/`fontSize`/`fontColor`/`linkFamily`. It covers Export JSON, Export URL, Snapshot, and the postMessage save.

Three properties worth not breaking, all verified:

- **The tool is unchanged.** The row still beats a bare field on reload, so the legend stays the single point of restyle and a legend edit still repaints every follower.
- **`ovr` still wins,** and exports carry both the override and the resolved value.
- **`snap()` does not call `buildState()`,** so undo/redo and the live `nodes`/`edges` arrays stay clean — stamping is an export-time concern only.

For a file already on disk, `tools/stamp-legend-style.js <file> --write` does the same thing. It is wired as a `Write|Edit` PostToolUse hook in `.claude/settings.json`, so anything Claude writes gets stamped automatically. It skips gitignored files (no committed baseline means no diff and no undo) and only rewrites when something changed.

**If you generate graph JSON by hand, still emit the styles.** Do not rely on the hook: a file that reaches Marc by any other route wants to be self-describing on its own.

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
version  mode  modelName  modelNote  canvasBg  graphAttrs  cldLoopNames
legendEntries  legendVisible  legendCollapsed  customSymbols
nodes  edges  lines  metaEdges  lopBands
```

(`mode` was added Aug 2026 with Rent Band Analysis. It is one of
`select node edge freeline arrow cld eip nrm opm sfd lop trace wardley`, and the
tool switches to it on load. Set it whenever the diagram is only legible in one
mode — a Wardley map opened in Basic mode loses its grid and its rent bands.
`meta.mode` is read as a fallback.)

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


---

## Substrate additions (2026-07-29)

The tool can now read from and write to the RCN substrate. Three additions
matter to anyone generating JSON for it. See `substrate/ROUND-TRIP.md`.

### `linkFamily` — on a legend EDGE row, or on an edge

The shared relation vocabulary from `tools/edge-families.js`: seven families —
`Influence`, `Provision`, `Composition`, `Classification`, `Transformation`,
`Agency`, `Sequence`. It exists so two neighborhoods' differently worded edges
can merge.

```json
{ "id":"lg_e_harm", "kind":"edge", "label":"acts on them",
  "color":"#dc2626", "width":3.5, "dash":"dashed",
  "linkFamily":"Influence" }
```

Resolves through the same chain as every other styled value — element override →
legend row → the element's own field — so it may sit on either.

**Declaring a family changes no colour, width or dash.** Local styling always
wins. `edge-families.js` carries a `fallbackStyle` per family, nested under its
own key precisely so it cannot be spread onto a row by accident; nothing reads
it today, and if that ever changes it must be an explicit opt-in, off by
default.

### `x`/`y` are required, and the reason is worth knowing

Already stated above, but this is the bug that shipped: a projection omitted
them, the tool reported a clean load of 6 nodes and 7 edges, and drew a **blank
canvas**. NaN centres, no error, no warning. If you generate JSON, emit
coordinates — even arbitrary ones.

### Fields the substrate adds, which the tool ignores safely

A projection puts computed values in `props`, never at the top level:
`props.gold` (`size(sources) > 1`, never stored), `props.sources`,
`props.family`, `props.mode`, `props.linkFamily`. `schemaLabel` appears at the
top level. All are additive — the tool assigns defaults for anything absent and
changes nothing it was given.

### UI, for writing instructions rather than files

| control | does |
|---|---|
| `?± Gaps` | flags every edge with no `+`/`−` |
| `Aa Text` | cycles edge text: label / family / both / none. Default `label` — an unmodified file looks identical |
| `→ Substrate` | writes the database *and* the source file. Appears in EXPORT |
| edge label typeahead | typing a spelling of a label already in use offers the existing one, headed "Already in use with a different spelling". It suggests; it never rewrites |

`?url=` accepts a projection path, e.g.
`?url=/projection/subgraph/role`, and loading that way records which drawing it
is so `→ Substrate` replaces the right one.

## Rent Band Analysis additions (2026-08-10)

Optional per-node fields, additive, ignored outside Wardley mode. Full method: `~/rcn/Rent-Band-Analysis-Method.md`. Worked example: `tools/rba-hospital-pricing.rcn.json`. Validate with `node tools/validate-rcn-graph.js map.json [--cld loops.json]` before handing a file to anyone.

```json
{
  "id": "hospital_pricing",
  "label": "Hospital Pricing",
  "x": 333, "y": 466, "w": 150, "h": 60,
  "evolution": 0.35,
  "visibility": 0.30,
  "shadow": {
    "evolution": 0.85,
    "basis": "RAND 5.1 hospital price transparency study; RBP spreads; LASIK and airline comparables",
    "rent": { "label": "≈ $1,850 / employee / yr", "unit": "employee", "period": "year",
              "basis": "TPA-billed vs reference-based pricing spread, WWHA 2025", "asOf": "2026-Q2" }
  },
  "pinnedBy": ["R2 Discount Kabuki"],
  "pressure": {
    "forces": ["CMS price transparency rule", "Self-funded employer demand"],
    "resistance": [{ "loop": "R2 Discount Kabuki", "mechanism": "Contracted rebate architectures",
                     "annualCost": "≈$4.2B / yr sector" }]
  }
}
```

### The four things that will bite you

**`evolution` runs 0 = Genesis → 1 = Commodity.** Increasing rightward, the standard Wardley direction. The tool's internal `wardleyX` and the Wardley Map Generator's export run the *opposite* way (1 = Genesis); the conversion happens inside the tool and never appears in a file. Write the method's direction. A shadow should therefore have a *higher* `evolution` than its node — the validator warns when it doesn't, because that is the signature of a crossed convention.

**`evolution`/`visibility` beat `x`/`y`.** In Wardley mode the pixel pair is recomputed from the 0–1 pair on load, and written back from the canvas when a drag ends. Write both if you like — but if they disagree, the 0–1 pair wins, so do not tune a layout in pixels and expect it to survive.

**`pinnedBy` takes loop NAMES, not `R#`/`B#` labels.** Those labels are assigned in loop-detection order and renumber whenever the CLD is edited, so `"R2"` silently comes to mean a different loop. Use the name from `cldLoopNames` — `"R2 Discount Kabuki"`. The validator warns on any bare label.

**Set `"mode": "wardley"`.** None of this renders in any other mode.

### What the validator insists on

Errors: `shadow` without a numeric `evolution` in [0,1], on the node or on the shadow; `shadow.rent` missing `label` or `basis`. Warnings: no `shadow.basis` (the shadow is an argued inference, not decoration); no `rent.asOf`; a shadow at or left of its node; a `resistance` entry whose `loop` is not in `pinnedBy`, or that names no mechanism or annual cost; `pressure` on a node with no `shadow` (the arrow is drawn inside the band, so it will not render); RBA fields present while `mode` is not `wardley`.

`resistors` is accepted as an alias for `resistance` and warned. Legacy `pressure: true` still renders a bare, unannotated arrow.

## Wardley maps written by Claude Chat (2026-08-11)

Full workflow: `tools/graph-tool-manual.html` §9d "Building a map with Claude Chat". The card a user pastes into Chat is `tools/wardley-chat-card.md`. Worked example: `tools/wardley-bicycle-production.rcn.json`.

### The minimum a Wardley node needs

```json
{ "id": "drivetrain", "label": "Drivetrain", "evolution": 0.78, "visibility": 0.62 }
```

With `"mode": "wardley"` at the top level, `x`/`y` are derived from `evolution`/`visibility` on load and written back on export, and `w`/`h` default to 108×46. Write `w`/`h` when a long label needs the room; do not write `x`/`y` at all.

### Three input shapes now load

| Shape | Recognised by | Axis |
|---|---|---|
| Native `{nodes, edges}` | `nodes` + `edges` | already normalised — `evolution` is 0=Genesis→1=Commodity |
| Generator export `{aiOriginal, userEdited}` | either wrapper key | implied `genesis-right`, flipped on import |
| Bare `{title, query, components, dependencies}` | top-level `components` | **must declare** `"axis"` or the load is refused |

The bare shape is what an LLM writes if you don't hand it the card, because it is the format the Wardley Map Generator documents. It carries `x` 0–1 with no statement of direction, and the two conventions in play run opposite ways: `commodity-right` (standard, and what Chat writes) versus `genesis-right` (the generator's internal format). Guessing wrong mirrors the map and every commodity lands in Genesis, looking entirely deliberate. So the tool refuses rather than guesses, and `tools/wardley-chat-to-rcn.js --axis …` converts with the direction stated.

### Loader changes that removed two silent failures

Missing `w`/`h` used to give a NaN radius and paint the node as a bare floating label with no error — the single most common defect in an LLM-written file. They are defaulted now. A node with no position of any kind is placed on a grid with a toast saying how many, rather than sitting at NaN and painting nothing.

## Presentation view (2026-08-12)

The tool has a presentation view — `P` or the **⛶ Present** button hides every control and gives the whole fullscreen window to the graph. It writes nothing to the file: there is no `presenting` key, and a top-level one you invent is discarded on the next export like any other unknown top-level key.

It changes two things about how a file meant to be *shown* should be written.

Set `mode` if the diagram is only legible in one. Presentation view hides the mode buttons, so whatever mode the file loads in is the mode the room sees, and there is no way to switch without leaving the presentation.

Put the detail in `note` and `props`, not in longer labels. Hover tooltips are the one detail channel that survives into presentation view — the sidebar Properties panel does not — so a node whose backing evidence lives in `note` and whose sources live in URL-valued `props` can be interrogated in front of a room, while the same content crammed into `label` just makes the box big.

## Linkage of Processes — LOP mode (2026-08-16)

Deming's organization-as-a-system diagram, in the vocabulary of *The Improvement Guide* (Langley, Moen, Nolan, Nolan, Norman, Provost) and *Quality as an Organizational Strategy* (Norman, Provost, Moen et al.). Set `"mode": "lop"` — the four labelled bands the map is drawn on only render in that mode, and a linkage map read in Basic mode loses its whole layout argument.

Optional fields, all additive; every other mode ignores them and they round-trip because import and export `Object.assign` the whole node or edge.

| Field | On | Values |
|---|---|---|
| `lopType` | node | `purpose` `leadership` `redesign` `supplier` `process` `subprocess` `output` `customer` `need` `support` `measure` `research` |
| `lopNum` | node | integer, key processes only — position in the flow |
| `props.owner` | node | who owns this key process |
| `props.measure` | node | how this key process is measured |
| `lopLink` | edge | `flow` `supplies` `serves` `supports` `informs` `requires` `guides` |
| `lopBands` | file | boolean, whether the band guide draws |

Bands are the y-axis of the layout, and a map that ignores them is hard to read. Place nodes inside them:

| Band | y range | Types belonging to it |
|---|---|---|
| Aim · Leadership · Design and redesign | 20–150 | `purpose` `leadership` `redesign` |
| Value-added system | 160–480 | `supplier` `process` `subprocess` `output` `customer` `need` |
| Support processes | 490–600 | `support` |
| Information · Measures · Customer research | 610–730 | `measure` `research` |

The value band reads left to right across x 20–1220 in four columns: suppliers (to x≈212), key processes (to x≈764), products and services (to x≈980), customers and needs (to x=1220).

Style each typed node the way the tool does, so the file is self-describing rather than relying on the mode to paint it:

```json
{ "id": "k2", "lopType": "process", "lopNum": 2, "label": "Agree a Shared Care Plan",
  "x": 480, "y": 250, "w": 154, "h": 54, "shape": "rounded",
  "color": "#dbeafe", "borderColor": "#1d4ed8", "borderWidth": 2, "fontColor": "#1e3a8a",
  "props": { "owner": "Care coordinator", "measure": "% members with a current plan" } }
```

Fills and borders by type: purpose `#fecdd3`/`#be123c`, leadership `#fee2e2`/`#b91c1c`, redesign `#ffe4e6`/`#be123c` (ellipse), supplier `#e2e8f0`/`#475569` (rect), process `#dbeafe`/`#1d4ed8`, subprocess `#eff6ff`/`#60a5fa`, output `#dcfce7`/`#15803d` (barrel), customer `#fef3c7`/`#b45309` (rect), need `#fef9c3`/`#ca8a04` (dashed border), support `#ede9fe`/`#7c3aed`, measure `#ccfbf1`/`#0f766e` (cylinder), research `#cffafe`/`#0891b2` (ellipse).

Linkage styles: `flow` `#1d4ed8` width 3 solid straight; `supplies` `#475569` width 2 solid straight; `serves` `#15803d` width 2.5 solid straight; `supports` `#7c3aed` width 1.5 dotted curved; `informs` `#0f766e` width 2 dashed curved; `requires` `#ca8a04` width 1.5 dashed curved; `guides` `#be123c` width 1.5 solid curved.

Three things the tool checks, and a hand-written file should satisfy before you hand it over:

- **Every key process has an owner and a measure.** The List of Processes exists to expose the ones that don't.
- **Every need is attached to a customer** as well as to the process that must meet it. A need with no customer is nobody's.
- **Something informs.** At least one `informs` linkage returning to `redesign` or to a process. Without it the drawing is a pipeline, not a system, which is the single point Deming's diagram was drawn to make.

`lopNum` should follow the `flow` chain, not the x-coordinate — the tool's Renumber does a topological walk of the flow linkages. Number by hand the same way, or leave `lopNum` off and let the person running the tool press Renumber.

Worked example: `tools/lop-whatcom-coop.rcn.json`. Exports: LOP→CSV (the List of Processes), LOP→MD (purpose, customers and needs, the list, and the linkage check), LOP→Cypher (`:LOP:KeyProcess` nodes, `FLOWS_TO`/`INFORMS`/`SUPPORTS` relationships).
