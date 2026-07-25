# Graph Tool v22 — native JSON schema

Verified against `tools/graph-tool-v22.html` at commit `5d1c70c`, 2026-07-25.
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
| `polarity` | `+` \| `-` \| `none` | no | Default `none`. CLD mode uses this for loop detection. |
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

Note the naming trap: graph edges use **`src`/`tgt`**, but timeline links use
**`from`/`to`**. They are different tools; do not carry the habit across.

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

## Top-level keys

`buildState()` (line ~4330) emits **exactly** these, and nothing else:

```
version  modelName  modelNote  canvasBg  graphAttrs  cldLoopNames
legendEntries  legendVisible  customSymbols  nodes  edges  lines  metaEdges
```

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
- `metaEdges`, `legendEntries`, `legendVisible`, `customSymbols`, `graphAttrs` —
  tool-managed; omit unless you know what you're writing.

## Choosing this tool

Web research and interview notes naturally yield an **actor map** — who exists,
how they relate, where the claim came from. That is what this tool is for in
Basic mode. It is *not* a causal map: do not invent causality to fill a CLD.
Switch to CLD mode only when the causal claims are real, because polarity and
loop detection will then be doing actual work.

Other modes (`EIP`, `NRM`, `OPM`, `SFD`, `Wardley`, `Trace`) carry their own
node typing and semantic colour palettes. Do not hand-write colours for those —
set the mode and let the tool assign them.

## Pre-flight

```
node tools/validate-rcn-graph.js yourfile.json
```

Then load it and re-export before trusting it. The validator cannot see the
`meta` class of bug.
