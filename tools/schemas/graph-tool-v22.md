# Graph Tool v22 — native JSON schema

Verified against `tools/graph-tool-v22.html`, **2026-08-19** (post the fitting/export fix; previously 2026-08-18, post OPM essence & affiliation; same day, post VSM mode; previously 2026-08-16, post LOP mode; previously 2026-07-29, post substrate round-trip work; 2026-07-25, post legend-as-registry and icon-node work; earlier baseline was commit `5d1c70c`). Derived from `loadGraphJSON()` (import), `buildState()` (export), `makeNode()` (defaults), and `shapeHTML()` (rendering).

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

Any unrecognised value **falls back to `ellipse` with no error** — including the number `0`. This is the single most likely thing to get wrong, because it fails silently and looks deliberate.

### `cylinder` and `barrel` draw wider than their declared `w`

The end-caps are painted outside the box, so a cylinder occupies visibly more horizontal space than `w` says. Nodes spaced on `w` alone will overlap, and the overlap looks like a layout bug rather than a shape property. Budget roughly an extra 15–20% of `w` on each side, or space cylinders on centres about 1.6× `w` apart. Verified 2026-08-17 by rendering three 270-wide cylinders on 480px centres, which collided.

### Labels auto-wrap, and authored `\n` is ignored

`label` is wrapped to fit the node; newline characters in the string are **not** honoured as line breaks. A label written as three clauses separated by `\n` renders as one long wrapped blob that overflows or shrinks, with no warning and a clean validator pass.

Keep labels to one or two words wherever possible and **put the gloss in the legend row and the detail in `note`**. That is what legend-as-registry is for: the row explains the kind once, the label names the instance, and the note carries the sentence. Verified 2026-08-17 — a four-node diagram whose labels each carried name, definition and examples was unreadable until the labels were cut to a single word each.

### `note` exports as an SVG `<title>` — hover works outside the tool

Anything in a node's or edge's `note` is written into the exported SVG as a `<title>` child, prefixed with 📌. Browsers render that as a native tooltip, so **the same field gives hover annotations both inside the Graph Tool and in any HTML document that inlines the exported SVG**. There is no second annotation mechanism to build. Annotate every node and edge and the exported diagram carries its own commentary. Verified 2026-08-17 across four diagrams (12, 17, 24 and 23 notes).

### `backdrop: true` — a container box drawn behind the arrows

Edges render below every node, so a filled box drawn round other nodes (Ostrom's "External Variables" around the "Action Situation") tints every arrow that crosses it, and an opaque one hides them. Give such a box `"backdrop": true` and it renders in its own layer **under** the edges: the arrows keep their colours and the fill can be solid. Backdrops stack among themselves in array order, so list the outermost first. Opt-in per node; a node without it behaves exactly as before. Added 2026-10-04 for docs/ostrom-nobel/.

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

Note the naming trap: graph edges use **`src`/`tgt`**, but timeline links use **`from`/`to`**. They are different tools; do not carry the habit across.

## The legend IS the registry (icons, node kinds, relationship kinds)

A legend row defines a style. Nodes and edges point at a row via `type` and take their look from it. Change the row, every follower changes. This is the primary way to style an RCN drawing — do not hand-set colours on 26 nodes.

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

**Resolution order** is `element.ovr[field]` → `legendRow[field]` → `element[field]`. So an element with no `type` behaves exactly as it always did — this is fully backwards compatible.

**`ovr` is the override bag.** Put a field there to diverge from the row for one element (e.g. every node follows `lg_support` but each carries its own `icon`). Editing a styled property of a typed element in the UI writes to `ovr` automatically; "Clear overrides" in the legend panel empties it.

The legend renders **inside the SVG** (`#legend-layer`, not pan/zoom transformed), so it survives PNG and SVG export. Before July 2026 it was an HTML div and silently vanished from every export.

Budget: the panel warns above 8 rows and reports how many elements follow no row. A drawing a group can read has roughly 6–8 kinds in it.

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

`node.icon` (or the row's `icon`) takes a key from the RCN house icon library, a **sidecar file loaded next to the tool**. If it is missing the tool degrades to shapes-only; nothing breaks.

Icon nodes render the glyph centred, tinted with the border colour, and move the caption **below** the box. The intended look is the Vera chart: one shape (`rect`), white fill, meaning in the picture, a two-colour border code. Give icon nodes a squarish `w`/`h` (72×72 works) and a short ALL-CAPS label.

49 starter icons across People, Place, Institution, Resource, Care, Harm, Process, System. Browse them in `tools/rcn-icon-sheet.html`. Prefer an icon over inventing a new shape — see `tools/neighborhood-cave-drawing.json` for a worked example.

## `props` — where your own data goes

`props` is a flat `{string: string}` map on any node or edge. It is the only place to put data the schema doesn't name, and it is the *right* place, because:

- it is editable in the Properties panel — add, rename, reorder, delete (`aEP`/`uEPK`/`moveEProp`/`rEP`, lines ~4274–4315)
- it is **searchable** — `renderEdge()` matches the search box against prop keys *and* values (line ~3233)
- the DOT, Cypher and CSV exporters carry it out

A bare top-level field on a node or edge (e.g. `"basis": "..."`) *does* survive import and export, because both use `Object.assign` over the whole object. But it is invisible in the UI, unsearchable, and dropped by every exporter. Use `props`.

**Provenance convention:** for LLM-populated files, cite the source of each claim in `props.basis`.

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

`schemaLabel` is a single string. `extraLabels` is a list, and a list cannot be an identity — any rule for picking an element is arbitrary and order-dependent. Some nodes legitimately carry several: Commitment is also Agreement, Promise and Contract. Those are aliases worth keeping and worth exporting to Neo4j; they are not what the node IS.

**The composition key is `schemaLabel` + `props.name`.** In `tools/graph-composer.html`, two nodes from different subgraphs become one node when both match.

`props.name` is the instance. `"?"`, `""` and absent are all normalised to the same UNNAMED value, meaning "the type itself":

- Drawing the *schema* — one Person, one Org. Names are blank, so `schemaLabel` alone is the whole identity.
- Drawing an *actual neighborhood* — many Orgs. `schemaLabel` says `Org`, `props.name` says which one.

The display label is deliberately NOT part of identity. A node can be renamed `HOUSING` or `Housing` or `the housing we have` for legibility without changing what it merges with. Before this, the composer identified nodes by display label and fell back to it for the instance name, which is how one file omitting `props.name` silently split five entities into ten.

The composer reports `typed: 75/75` — how many source nodes carried a `schemaLabel`. Anything short of full is amber: those nodes fall back to their display label and will quietly fail to merge with a renamed sibling.

## Display-only data: the `_` prefix

Precedent: Neo4j's own Arrows tool gives a node a `caption` that displays preferentially and does **not** import into Cypher. This tool generalises that:

> **A `props` key beginning with `_` is display-only.** It shows on hover, it is searchable, it is editable in the Properties panel — and it never reaches Neo4j.

```json
{ "id": "housing", "label": "HOUSING", "extraLabels": ["Dwelling"],
  "props": {
    "units": "42",
    "_why": "rent burden is the pressure point here",
    "_source": "2026 resident survey"
  } }
```

`units` is data and becomes a Neo4j property. `_why` and `_source` are glosses for whoever is reading the drawing and stay on the drawing. That exports as:

```
CREATE (n0:HOUSING:Dwelling {units: "42"} )
```

Works on edges too.

`note` is display-only for the same reason — a pin is an annotation for a reader, not a property of the thing. It no longer exports as a Cypher property. (It did until July 2026.)

Display-only entries render italic and slightly dimmed in the hover tooltip, so gloss is visually distinct from data.

**Arrows import:** an Arrows node's `labels` now land in `extraLabels`, where they belong. They previously became a joined string in `props._labels`, so an Arrows to Cypher round trip lost the labels *as labels* and emitted a junk property in their place.

## Top-level keys

`buildState()` (line ~4330) emits **exactly** these, and nothing else:

```
version  mode  modelName  modelNote  canvasBg  graphAttrs  cldLoopNames
legendEntries  legendVisible  legendCollapsed  customSymbols
nodes  edges  lines  metaEdges  lopBands
```

(`mode` was added Aug 2026 with Rent Band Analysis. It is one of `select node edge freeline arrow cld eip nrm opm sfd lop trace wardley`, and the tool switches to it on load. Set it whenever the diagram is only legible in one mode — a Wardley map opened in Basic mode loses its grid and its rent bands. `meta.mode` is read as a fallback.)

(`legendEntries` now carries the registry — see "The legend IS the registry".)

**Any other top-level key is silently discarded on export.** Unknown *node* and *edge* fields survive; unknown *top-level* keys do not. This asymmetry is the trap.

In particular, a `meta: { title, description, author, ... }` block — a natural thing to write, and what an LLM will reach for — evaporates the first time anyone exports from the tool. Put that information where the tool keeps it:

- `modelName` — the title. Populates the Model Name field.
- `modelNote` — description, provenance, author, date. Populates Note/Source.

Keeping a `meta` block *as well* is fine for the source-of-truth file; just never let it be the only copy.

### The other top-level keys

- `canvasBg` — hex string
- `cldLoopNames` — `{"nodeId,nodeId,...": "Loop name"}`. Key is the loop's node ids **sorted lexically**, comma-joined.
- `lines` — free-drawn annotation lines: `{id, x1, y1, x2, y2, color, width, dash, arrowhead, label}`
- `metaEdges`, `legendEntries`, `legendVisible`, `legendCollapsed`, `customSymbols`, `graphAttrs` — tool-managed; omit unless you know what you're writing. `legendCollapsed` shrinks the on-canvas legend to a `LEGEND (n)` title bar; `legendVisible: false` removes it altogether. They are independent.

## Choosing this tool

Web research and interview notes naturally yield an **actor map** — who exists, how they relate, where the claim came from. That is what this tool is for in Basic mode. It is *not* a causal map: do not invent causality to fill a CLD. Switch to CLD mode only when the causal claims are real, because polarity and loop detection will then be doing actual work.

Other modes (`EIP`, `NRM`, `OPM`, `SFD`, `Wardley`, `Trace`) carry their own node typing and semantic colour palettes. Do not hand-write colours for those — set the mode and let the tool assign them.

## A trace is a partial order — hand it to the Timeline

Trace mode tags edges with `traces: [1..4]`. `startTraceAnim()` finds the roots (trace-edge sources that no trace edge targets), then BFS's outward in **waves**, each wave lighting one step later than the last.

Those waves are a partial order. They say *this, then this, then this*. What they cannot say is **when**, **for how long**, or **how big the gap is** — the animation runs at a fixed `trace-speed` in milliseconds, so a step that took a week and a step that took four years look identical.

That is precisely what `tools/rcn-timeline.html` adds. The pairing:

| | Graph Tool, Trace mode | Timeline |
|---|---|---|
| Answers | what causes what | when, how long, how far apart |
| Trace edge `A → B` | one animation step | a `before` or `meets` link |
| Wave depth | ordinal position | an actual date |
| Uncertainty | not represented | `startFuzz`/`endFuzz`, `conf`, `who` |

**`sendTraceToTimeline(n)`** does this — Trace mode's panel has a "Send trace to Timeline" row of T1–T4 buttons beside the animate row. It reuses `traceWaves()`, which is `startTraceAnim()`'s root-finding and BFS factored out, so the thing you send is the thing you watched. Handoff is `rcn-timeline.html#tl=<base64>`.

What it emits, and why:

| Choice | Reason |
|---|---|
| node → interval, **interval id = graph node id** | the bridge back; a future tool can match them |
| trace edge → **`before`, never `meets`** | a trace edge asserts sequence, not adjacency. `meets` would claim "no gap", which the graph never said — and two `meets` into one node would contradict on arrival |
| one placeholder year per wave depth | the order is real; the durations are not |
| interval `conf` 0.3, `who` empty | the DATES are unattributed — nobody has dated them |
| link `who` = "T*n* trace, *model*", `conf` 0.8 | the ORDER **is** attributed: the graph said so |

That split is the point. The converter hands over what the graph actually knows and is conspicuously silent about the rest, because filling in the durations is the step where a group discovers which of its confident causal arrows nobody can date.

Doing it by hand instead:

1. Each **node** on the trace path becomes an **interval**. Give it a duration — this is the step where you find out whether you know one.
2. Each **trace edge** becomes a link: `meets` if the next thing begins as this one ends, `before` if there is a gap.
3. Keep the node's display label as the interval label so the two diagrams can be read side by side.
4. Colour the intervals by the node's legend family, so the palette carries over.

**The trap:** a graph node that names an ongoing *state* ("building in community ownership") becomes an interval with no end, and you cannot link out of it — see "Both relations require the intervals to be disjoint" in `schemas/rcn-timeline.md`. Bound it to the event that actually causes the next thing, or drop the link and let the dates speak.

Worked example: `tools/eip-schema-cld.json` T1 → `tools/t1-trace-timeline-demo.json`.

Worked example: `tools/eip-schema-cld.json` carries the T1 trace on six edges (PERSON→ACTION→RESULT→{SOLUTION, SIDE EFFECT}→PROBLEM). Press ⏳ T1.

## Receiving a graph from the Composer

`graph-composer.html` speaks Ward's `graph.js` format (`nodes`/`rels`, identity by array index, no geometry) and this tool speaks its own. The Composer's **Open in Graph Tool** converts and hands over via the URL hash:

```
graph-tool-v22.html#graph=<base64 of the state object>
```

`loadFromURL()` decodes with `JSON.parse(decodeURIComponent(escape(atob(raw))))`, so anything writing that hash must encode the mirror image — `btoa(unescape(encodeURIComponent(json)))` — or non-ASCII labels corrupt.

**Since 2026-09-28 the hash goes through `loadGraphJSON()`**, the same loader as Import JSON and `?url=`. Before that, `loadFromURL()` was a hand-rolled copy that read only `nodes`, `edges`, `modelName`, `modelNote` and a few graph attributes — `legendEntries`, `legendVisible`, `mode` and layers were silently dropped, so a sender's legend vanished on arrival and typed nodes lost their row. Anything a file can carry, a hash can now carry. Verified with a Composer-shaped state (no legend, non-ASCII labels) and with the RCN Map's issue handoff.

One inherited behaviour of `loadGraphJSON()`: a state with **no** `legendEntries` leaves the current legend in place rather than clearing it. On a fresh tab there is nothing to keep, so a handoff is unaffected; it only shows when re-loading into a tab that already held a legend.

## Receiving a graph from the RCN Map

`maps/rcn_map.html` sends a **network issue** — an issue file with `links` — through the same `#graph=` door (legend button **🕸 Open in Graph Tool**; **⬇ graph JSON** saves the same state as a file). `issueToGraph()` in the map does the conversion:

| Issue file | Graph |
|---|---|
| `parcels[]` | nodes `n1…`, `rounded` 150×56, label = parcel `label`, `note` = parcel `notes` |
| `latLng` | Web Mercator `x`/`y`, in-frame spread scaled to ~1400px, then overlapping boxes pushed apart; `props.lat`/`props.lng` keep the truth |
| `inFrame: false` | clamped to just outside the frame on its own side; `props._placement` says so |
| `types{}` | node legend rows `lg_t_<key>`: tinted fill, type colour as a 3px border |
| `linkKinds{}` | edge legend rows `lg_l_<key>`: colour, width, dash (`"3 5"`→`dotted`, longer→`dashed`) |
| `links[]` | edges `e1…`, `src`/`tgt` from parcel ids, `curved:true`, label = first clause of the link label (membership edges unlabelled), `note` = full label + notes/source |
| `twoWay: true` | `arrowDir:"none"` |

Every node also gets `props._onMap`, a deep link back to that point on the map (`?lat&lng&zoom=16&openissue=`). Styles are stamped as bare fields as well as through `type`, per the export convention above. The output passes `tools/validate-rcn-graph.js` with 0 warnings (22 nodes, 21 edges for the Whatcom co-ops).

The conversion worth copying if you ever write another one: **coordinates come out of the rendered Graphviz SVG**, not from the data. Ward's format has no geometry, and `autoSize()` here only grows `w`/`h` rather than initialising them, so a node without a width paints as a bare label. Reading `getBBox()` off each `g.node` gives the layout the user is already looking at. Graphviz SVG user space is already screen-oriented (y grows downward), so positions only need shifting into positive space — no axis flip.

## Pre-flight

```
node tools/validate-rcn-graph.js yourfile.json
```

Then load it and re-export before trusting it. The validator cannot see the `meta` class of bug.

---

## Substrate additions (2026-07-29)

The tool can now read from and write to the RCN substrate. Three additions matter to anyone generating JSON for it. See `substrate/ROUND-TRIP.md`.

### `linkFamily` — on a legend EDGE row, or on an edge

The shared relation vocabulary from `tools/edge-families.js`: seven families — `Influence`, `Provision`, `Composition`, `Classification`, `Transformation`, `Agency`, `Sequence`. It exists so two neighborhoods' differently worded edges can merge.

```json
{ "id":"lg_e_harm", "kind":"edge", "label":"acts on them",
  "color":"#dc2626", "width":3.5, "dash":"dashed",
  "linkFamily":"Influence" }
```

Resolves through the same chain as every other styled value — element override → legend row → the element's own field — so it may sit on either.

**Declaring a family changes no colour, width or dash.** Local styling always wins. `edge-families.js` carries a `fallbackStyle` per family, nested under its own key precisely so it cannot be spread onto a row by accident; nothing reads it today, and if that ever changes it must be an explicit opt-in, off by default.

### `x`/`y` are required, and the reason is worth knowing

Already stated above, but this is the bug that shipped: a projection omitted them, the tool reported a clean load of 6 nodes and 7 edges, and drew a **blank canvas**. NaN centres, no error, no warning. If you generate JSON, emit coordinates — even arbitrary ones.

### Fields the substrate adds, which the tool ignores safely

A projection puts computed values in `props`, never at the top level: `props.gold` (`size(sources) > 1`, never stored), `props.sources`, `props.family`, `props.mode`, `props.linkFamily`. `schemaLabel` appears at the top level. All are additive — the tool assigns defaults for anything absent and changes nothing it was given.

### UI, for writing instructions rather than files

| control | does |
|---|---|
| `?± Gaps` | flags every edge with no `+`/`−` |
| `Aa Text` | cycles edge text: label / family / both / none. Default `label` — an unmodified file looks identical |
| `→ Substrate` | writes the database *and* the source file. Appears in EXPORT |
| edge label typeahead | typing a spelling of a label already in use offers the existing one, headed "Already in use with a different spelling". It suggests; it never rewrites |

`?url=` accepts a projection path, e.g. `?url=/projection/subgraph/role`, and loading that way records which drawing it is so `→ Substrate` replaces the right one.

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

## Value Stream Mapping — VSM mode (2026-08-18)

Cindy Jimmerson's healthcare value stream map (*Value Stream Mapping for Healthcare Made Easy*), not the Rother/Shook manufacturing one. One patient, one condition, one observation, times recorded at the gemba. Set `"mode": "vsm"` — the five lanes only render in that mode, but **the sawtooth timeline always renders**, because the ratio is the argument and it must not be separable from the drawing.

Optional fields, all additive; every other mode ignores them and they round-trip because import and export `Object.assign` the whole node or edge.

| Field | On | Values |
|---|---|---|
| `vsmType` | node | `patientstep` `step` `info` `supply` `wait` `handoff` `decision` `burst` `outside` |
| `vsmNum` | node | integer, timed types only — position in the flow |
| `vsmValue` | node | `va` \| `nnva` \| `waste` — would the patient pay for it? |
| `vsmWaste` | node | `waiting` `motion` `transport` `overproc` `inventory` `defect` `overprod` `talent` |
| `props.vaTime` | node | **minutes**, as observed. String or number; parsed with `parseFloat`. |
| `props.waitTime` | node | **minutes** of waiting *before* this step |
| `props.who` | node | who you actually watched do it |
| `props.a3` | node | `"yes"` on exactly one `burst` — the one that becomes the A3 |
| `vsmFlow` | edge | `patient` `info` `supply` `handoff` `push` `pull` `rework` |
| `vsmLanes` | file | boolean, whether the lane guide draws |
| `vsmTrueScale` | file | boolean, strict-proportional sawtooth segments |

**Times are in minutes, always.** The tool humanises them on the way out (`39 min`, `7 d`); it never parses "7 days" on the way in. A hand-written file that puts days in `waitTime` will understate the lead time by 1440×.

Lanes are the y-axis of the layout, spanning x 20–1400. Place nodes inside them:

| Lane | y range | Types belonging to it |
|---|---|---|
| Patient · the person moving through | 20–170 | `patientstep` |
| Provider · who does the work | 180–330 | `step` `wait` `handoff` `decision` |
| Information · orders, results, records | 340–470 | `info` `outside` |
| Supplies · equipment, meds, materials | 480–600 | `supply` |
| Timeline · value-added above, waiting below | 620–790 | *nothing — the sawtooth is computed and drawn here* |

`burst` has no home lane. A storm burst is drawn wherever the problem was seen.

Style each typed node the way the tool does, so the file is self-describing:

```json
{ "id": "s5", "vsmType": "wait", "vsmNum": 5, "vsmValue": "waste",
  "label": "Sits in shared inbox", "x": 900, "y": 255, "w": 118, "h": 52,
  "shape": "hexagon", "color": "#fee2e2", "borderColor": "#b91c1c",
  "borderWidth": 2, "fontColor": "#450a0a",
  "props": { "vaTime": "0", "waitTime": "10080", "who": "" } }
```

Fills and borders by type: patientstep `#fae8ff`/`#a21caf`, step `#e0f2fe`/`#0369a1`, info `#ccfbf1`/`#0f766e` (rect), supply `#fef3c7`/`#b45309` (barrel), wait `#fee2e2`/`#b91c1c` (hexagon), handoff `#ffedd5`/`#c2410c` (diamond), decision `#f1f5f9`/`#475569` (diamond), burst `#fef08a`/`#b45309` (**shape `burst`**, a 12-point star added to `shapeHTML` for this mode), outside `#ede9fe`/`#7c3aed` (cylinder).

Flow styles: `patient` `#a21caf` width 3.5 solid straight; `info` `#0f766e` width 2 dashed curved; `supply` `#b45309` width 2 solid straight; `handoff` `#c2410c` width 3 solid straight; `push` `#64748b` width 2 solid straight; `pull` `#15803d` width 2.5 solid curved; `rework` `#b91c1c` width 2.5 dotted curved.

**The sawtooth is computed, never authored.** There is no field for it. `vsmOrderedSteps()` topologically sorts the timed nodes over the *moving* flows only — `patient`, `handoff`, `push`, `pull` — with x as the tie-break; `info` and `supply` edges deliberately do not sequence anything, and cycles (rework loops) are appended in x order rather than dropped. So `vsmNum` should follow that chain, not the x-coordinate. Leave it off and let the person press Renumber.

Segment widths are **not** strictly proportional by default. At any ratio Jimmerson would recognise the value-added ledges collapse below a pixel — verified at 0.38%, which is what a real referral stream looks like — so each segment gets a 30px floor and the surplus is distributed in proportion. The exact ratio lives in the scoreboard text. `vsmTrueScale: true` turns the floor off.

Six things the tool checks, and a hand-written file should satisfy before you hand it over:

- **Something is in the patient lane.** A stream that never touches the patient is a process map, not a value stream.
- **Times are recorded.** Without them the VA-to-lead ratio is absent and the map is a flowchart.
- **Waiting exists.** All-value-added-no-waiting almost never survives direct observation — it means the stream was reconstructed from policy, not watched.
- **The ratio is plausible.** Over 50% value-added means the units are wrong.
- **Storm bursts are named**, and exactly one carries `props.a3`.
- **All four flows appear**, information especially — it is the one people forget.

Exports: VSM→CSV (the stream in flow order with times), VSM→MD (the ratio, the step table, the bursts, and what the observation is still missing), and **VSM→A3**, which writes the `.a3.rcn.json` that `tools/a3.html` loads — seeded with the whole burst list, the observed times, the lead time as the follow-up baseline, and `source: {map, burstId}` pointing back at this drawing. The halves only a person can fill (what was *supposed* to happen, the gap, the five whys) are left empty on purpose.

## OPM essence and affiliation (2026-08-18)

ISO 19450 gives every OPM thing two orthogonal generic properties beyond its Object/Process kind (`7.3.3`). Both are now first-class on nodes, and **both render in every mode**, not only OPM mode — like `polarity`, because a diagram read in Basic mode must not silently lose its system boundary.

| Field | Values | Default | Draws as |
|---|---|---|---|
| `opmEssence` | `physical` \| `informatical` | `informatical` | physical adds a **drop shadow** offset (3,3) behind the shape |
| `opmAffiliation` | `environmental` \| `systemic` | `systemic` | environmental draws a **dashed** contour |

Both are additive and optional — a node without them reads as informatical and systemic, which is the ISO default and what OPCloud gives a freshly dragged thing.

**Affiliation is the system boundary.** `environmental` means outside the system under study; `systemic` means inside it. This is not decoration: an Odum-style heat sink is by definition a physical *environmental* object, and a source is a physical environmental object on the input side. Without affiliation you cannot state, let alone check, whether a loss actually leaves the system. Real models disagree on this — Marc's `Side Effect Set` is systemic in Neighborhood Developing OPCat but environmental in Neighborhood Developing, and only one of those can be right.

**Essence is not conservation, but it correlates.** `physical` things are the ones that behave like materials — consuming them depletes the source. `informatical` things can be copied without loss. Money is a judgement call; OPCloud practice in Marc's own models types Financial Input as **informatical**, which is defensible and matches Odum's treatment of money as circulating information with no heat sink of its own.

The generated OPL declaration follows the ISO sentence pattern exactly, matching OPCloud's output word for word:

```
Environment Input Set is a physical and environmental object.
Knowledge Set is an informatical and systemic object.
Neighborhood Developing is a physical and systemic process.
```

Note the article: `an informatical`, `a physical`. `OPM→OPL` export and the live OPL panel both use it.

`OPM→Cypher` carries them as extra Neo4j labels, matching the hand-built Second Language export shape:

```cypher
CREATE (n1:Object:Physical:Environmental {name: "Environment Input Set"})
```

Set them from the OPM mode properties panel — an **Essence & Affiliation** section with two button pairs, showing the resulting OPL sentence live underneath. `setNodeOPMEssence(id, v)` and `setNodeOPMAffiliation(id, v)` are the programmatic setters.

## OPM structural profile — functional form and the four checks (2026-08-18)

A small, deliberately **structural** profile: it reads link types and the two generic properties only. Nothing in it needs a number, a unit, or a formula, which is the point — the discipline is separable from the arithmetic, the same way Odum's diagrams were used descriptively for decades before emergy accounting arrived.

### `opmFunctionalForm` — optional, on Process nodes

| Value | Meaning |
|---|---|
| `multiplicative` | `out ≈ k·X·Y` — zero in either kills it, returns are superadditive. Invest in both. |
| `limiting` | `out ≈ k·min(X,Y)` — saturates in the abundant input. Only the scarce one moves it. |
| `additive` | `out ≈ aX + bY` — independent contributions. Spend wherever it is cheapest. |

OPM's AND over consumption links says "both are needed". It does **not** say how they combine, and the three answers give opposite investment advice. Declaring the form costs a sentence; resolving it would cost a formula, and we only ask for the declaration. Set it from the **Functional Form** section of the OPM properties panel, which appears only on Processes; clicking the active button clears it.

### The four checks — `runOPMChecks()`, "Run checks" in the OPM panel

Findings are clickable and select the nodes involved.

**1. Sink rule.** Every Process must have a `Result` link to at least one **environmental** object. A process that yields nothing, or yields only systemic objects, is flagged: nothing leaves the system, so the model runs its loops for free. This is the one check that Marc's own models already largely pass — `Environmental Side Effects Set` was built without reference to Odum.

**2. Affiliation consistency.** For every `AP` link, if the whole is environmental and the part is systemic, flag both. A part cannot sit inside the boundary when its whole sits outside. Catches the real `SD1: Environment Input Set unfolded` inconsistency, where Energy, Information and Materials are systemic parts of an environmental whole.

**3. Functional form.** Any Process with **two or more** `Consumption` links and no `opmFunctionalForm` is flagged. Nine conjunctive consumptions with no declared form — the state of `Neighborhood Developing` in the OPCat model — is the case this exists for.

**4. Unsourced systemic input.** An object that is consumed somewhere, is **systemic**, and is never the target of any `Result` link, is an unlimited source sitting inside the boundary. An *environmental* object with no source is correctly ignored — that is just the outside world. When the label looks financial the finding adds a counterflow prompt, since money consumed but never yielded is exactly the missing-money-circuit case.

Link directions in this tool (they are **not** all the same as OPCloud's drawn directions — check before porting): `AP` is drawn part→whole, `Consumption` object→process, `Result` process→object, `Instrument` and `Agent` object→process, `Invocation` process→process.

### `OPM→Cypher` now round-trips

Nodes and relationships both carry **`opm_id`**, and the export uses `MERGE` keyed on it rather than `CREATE` keyed on `name`. Names collide — your models are full of `… Set` labels — and `opm_id` is what makes the graph a lens on the same objects rather than a one-way dump. This follows Medvedev, Shani & Dori, *Gaining Insights into Conceptual Models: A Graph-Theoretic Querying Approach*, Appl. Sci. 2021, 11, 765, which is the published OPM↔Neo4j transform (and whose flattening algorithm is lossy in two named ways: stateful objects are de-stated into *n* specializations, and a parent's links are copied uniformly onto every nested child).

## Value networks — VNA rules (2026-08-31)

Verna Allee's Value Network Analysis, drawn in the existing notation. It needs no mode: it is a legend preset (roles as nodes, solid tangible / dashed intangible / dotted absent) plus two rules the validator enforces.

Declare it with `graphAttrs.method: "vna"` — `graphAttrs` is a free-form bag that survives export, whereas `mode` cannot carry `"vna"` because that is not a tool mode and would warn. `node validate-rcn-graph.js f.json --vna` forces the checks on an undeclared file.

**Rule 1 — every edge names its deliverable.** `label` must be non-empty. An unlabelled arrow asserts only that a tie exists, and a tie map is precisely what this method exists instead of: ties can only be read by computing on them (centrality, clustering), which is the reading Snowden's face-saving critique undermines. The label is what makes an arrow checkable (`CHW → "what's actually going on at home" → Clinic` can be wrong; `CHW —— Clinic` cannot) and what makes reciprocity legible without a metric.

**Rule 2 — every edge declares its evidence.** `props.evidence` is `"observed"` (a badge, contract or log says so) or `"asserted"` (somebody reasoned it out). Both are legitimate; drawn in the same ink they are indistinguishable, and a hypothesis then reads as a finding. This rule exists because `vna-whatcom-coop.rcn.json` shipped with two invented red arrows — "no clinical follow-back", "no seat in plan design" — rendered identically to the contractual ones.

`--fix` writes `evidence: "asserted"` on any edge missing it. Under-claiming is the safe direction: it makes a file valid without ever promoting a guess to a finding, and leaves the author to upgrade the arrows that are real.

The validator also prints a `note` with the observed/asserted split, and says so when nothing in the file is measured.

**Roles, not people.** A node is what gets done, not who does it — `CHW` is one node though six people do the job. This is Allee's rule and Snowden's independently: he moved SNA from individuals to identities to abstractions because person-level tie data is corrupted at collection by what people cannot afford to say. Person-as-node is the exception (an ego network drawn with its subject), not the default.

**Acceptance completes a transaction.** Value is offered at the role level and converts only when another role accepts. In SODOTO the badge is the acceptance, which is why teach-chain data is `observed` rather than self-reported. Working examples: `tools/vna-whatcom-coop.rcn.json`, `tools/vna-sodoto-acceptance.rcn.json`, `tools/sodoto-teach-chain-readings.rcn.json`.

## IAD levels — Ostrom's three bands (2026-08-31)

**Standing instruction from Marc: build these distinctions into every drawing where they are relevant, not as a special exercise.** Ostrom's three levels of analysis are the same list as Meadows' leverage points, cut in three places — constitutional is Meadows 1–4, collective-choice is Meadows 5–6, operational is Meadows 7–12 — and Ostrom adds the distinction Meadows lacks: making a rule is collective choice, deciding *who may make rules* is constitutional.

**The one-question test.** Changes a number → operational (least leverage). Changes a rule → collective-choice. Changes who may change the rule → constitutional (most leverage). Levelling a finding changes what it means, so do it before concluding anything: a complaint that reads as "we weren't consulted" at operational level can be "there is no class of member for a rule to admit" at constitutional level, and only the second version is actionable.

| Field | Where | Values |
|---|---|---|
| `graphAttrs.iadLevel` | file | `operational` \| `collective-choice` \| `constitutional` \| `unspecified` |
| `iadLevel` | an **edge** legend row | same. A file whose edge rows span levels is really two adjacent action situations — say so rather than forcing one label |
| `iadElement` | a **node** legend row | `position` \| `participant` \| `resource` \| `outcome`. Default `position`. A role is a position; a named individual is a participant; a till or fund is a resource; a badge is an outcome |

`graphAttrs.method` is `vna` for a value network (deliverable + evidence rules apply) or `nas` for a network-of-action-situations drawing, whose arrows are adjacency claims rather than deliverables.

**Adjacency**, after McGinnis: two action situations are adjacent when outcomes generated in one determine a working component — or a rule — of the other. Draw it as a downward arrow labelled with the rule type it sets (`→ payoff rules`, `→ scope rules`, `→ position rules`).

`node tools/band-state.js` prints the standing state of all three bands, and `--brief` gives four lines. `python3 substrate/load_iad.py --verify` projects every declared value network into IAD vocabulary in database `iad`; see `substrate/iad-crosswalk.md`.

**Read the Constitution before asserting anything about RCN's constitutional level.** It exists at ndcgroup.relocalizecreativity.net/rcn-constitution with implementation notes at /rcn-constitution-notes, and it settles more than the code suggests — including a superordinate ethical metasystem with real veto power, which no amount of reading drawings would have revealed. Working examples: `tools/iad-nas-rcn.rcn.json`, `tools/iad-constitutional-arena.rcn.json`. Explanation: `docs/three-bands.md`.

## `props.evidence` — available to every mode (2026-09-01)

`props.evidence` is `"observed"` (a badge, contract, log or cited document says so) or `"asserted"` (somebody reasoned it out). It began as a VNA rule and is now a field **any** mode may carry, because the hazard it addresses is not specific to value networks: a drawing that mixes sourced and reasoned claims in identical ink turns a hypothesis into a finding.

Value networks (`graphAttrs.method: "vna"`) still **require** it on every edge — that is an error. Every other mode is free to use it, and the validator enforces only one thing: **partial adoption is worse than none.** If some edges in a file declare evidence and others do not, the undeclared ones read as observed by default, so that is a warning. Declare all of them or none. A file that declares all of them gets a note saying it is auditable without being a value network.

`node tools/band-state.js` reports adoption across every drawing in the repo — how many declare fully, how many partially, how many not at all — alongside the observed/asserted split for those that do.

The rule of thumb for which value to use: `observed` needs a source you can name and someone else could check. A page in the RCN Constitution counts. Your own reasoning, however good, does not.

## Edge label placement — `labelHoriz`, `labelWrap`, `labelT` (2026-08-19)

Three optional edge fields decide where a label sits and which way it faces. None are exotic, and all three start mattering the moment a drawing contains icon nodes.

| Field | Default | What it does |
|---|---|---|
| `labelHoriz` | the global toolbar setting | `true` keeps the label horizontal. Left unset, a label **rotates to follow its edge**, which makes every label on a vertical edge unreadable. |
| `labelWrap` | the global toolbar setting | `true` wraps a long label at roughly 16 characters instead of running it along the line. |
| `labelT` | `0.5` | Position along the edge: 0 at the source, 1 at the target. |

Set `labelHoriz: true` on any labelled edge that runs more vertically than horizontally, or the label prints sideways and nobody reads it.

`labelT` exists to dodge one specific collision. An icon node draws its caption *below* its box, and an `extraLabels` tag below that — which is exactly where a vertical edge's midpoint label lands, so the label and the caption overprint. Push the label past the caption instead: `0.66` on a downward edge clears the source's caption, `0.34` on an upward edge clears the target's. `resetEdgeMarks(id)` returns `labelT`, `polT` and `delayT` to auto.

## Fitting and export (2026-08-19)

`zoomFit()` used to measure node `x/y/w/h` only. Icon captions, `extraLabels`, edge labels, free lines, the Wardley grid and the LOP bands are none of them nodes, so all of them fell outside the frame — and because SVG and PNG export the *current view*, whatever Fit cropped was also missing from the exported file. Measured before the fix: Wardley mode lost 249px, LOP mode 61px.

It now measures `contentBounds()`, the union of `getBBox()` across the six pan/zoom-transformed layers (lop, wardley, lines, edges, nodes, triples), and reserves its margin in **screen pixels** rather than graph units, so the margin no longer shrinks as a drawing grows. `#legend-layer` and the OPM symbol chart are deliberately excluded: they are untransformed screen furniture, and measuring them would mix two coordinate systems.

Export still captures the current view by design, so the workflow is press Fit, then export.

If you script an export rather than pressing the button, know that `loadGraphJSON()` defers a `zoomFit()` through `requestAnimationFrame`. Let that land **before** forcing `pan={x:0,y:0}; zoom=1; applyT()`, or the clone carries a transform that its graph-coordinate `viewBox` knows nothing about, and the drawing renders small in one corner of an otherwise empty frame. Hidden browser tabs never fire `requestAnimationFrame` at all, which makes anything behind it silently no-op in an automated tab.
