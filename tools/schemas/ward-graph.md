# Ward's graph library and the Solo Super Collaborator pipeline

Located July 2026 while tracing where `tools/graph-composer.html` came from. `graph-composer.html` is a standalone reimplementation of this; the originals are live and public.

## The library

**`https://wardcunningham.github.io/graph/graph.js`** — published from `github.com/WardCunningham/graph`. ES module, `export class Graph`.

| Method | Notes |
|---|---|
| `addNode(type, props={})` | returns index |
| **`addUniqNode(type, props={})`** | **the merge key.** Returns an existing node id when `node.type == type && node.props?.name == props?.name`, else adds. |
| `addRel(type, from, to, props={})` | updates the nodes' `in`/`out` arrays |
| `tally()` | counts node and relation types |
| `size()` | node count + relation count |
| `n(type=null, props={})` | filtered Nodes collection |
| `search(query, opt={})` | Cypher-like query |
| `copy(nid, output)` | recursively copy a node and its connected graph |
| `clusters()` | disconnected subgraphs — what graph-composer calls `partitions` |
| `stringify(...)` | serialise |
| static `load(obj)` / `fetch(url)` / `read(path)` | factories |

Node identity is array index within a graph; identity *across* graphs is `type` + `props.name`. That is Ward's own rule, and graph-composer's `merge()` reimplements it exactly.

## The pages

**`github.com/WardCunningham/assets`**, `pages/mock-graph-data/` — 37 files:

    composite.html   creator.html    cypher.html     extract.html
    match.html       navigator.html  schema.html     search.html
    transform.html   nav-schema.html freeform.html   fluent.html
    macros.html      query-generator.html
    digraph.js       parser.js       javascript.js
    flow-sim.html    pop-sim.html    fox-sim.html    travel-graph.html

`digraph.js` is tiny and worth knowing — the whole thing is:

```js
export function digraph(graph) {
  const n = graph.nodes.map((n,i) => `${i} [label="${n.type}\\n${n.props.name}"]`)
  const r = graph.rels.map(r => `${r.from} -> ${r.to} [label="${r.type}"]`)
  return [...n, ...r].join("\n")
}
```

The `solo` item type is **`paul90/wiki-plugin-solo`** (`client/solo.js`) — the full-window popup bound to the lineup.

## The live pipeline

Marc's page **Basic Schema Aspects** (schema.relocalizecreativity.net) frames `assets/pages/graphviz-customizations/aspects-arrows.html`. That page:

1. imports Ward's `Graph`, plus local `frame.js` and `dotify.js`
2. reads the page's **attached JSON assets** — the aspect subgraphs — via `frame.assets()` filtered to the page slug and `.json`
3. renders a checkbox per asset with its node count
4. `arrows(json)` converts Arrows format to a `Graph`
5. `dosource()` posts the selected subgraphs to the parent: `postMessage({action:"publishSourceData", name:'aspect', sourceData}, '*')`
6. `dopreview()` emits the `<details>` + graphviz items that become the **Aspects From Arrows Preview** page

So the aspect JSON files are *page assets*, and the checkbox list is the beam.

### The part worth stealing: names resolve against the roster

`arrows()` does more than convert. For each node:

```js
const name = n.caption || n.properties.name || 'Unknown'
const bindings = exact(name) || partial(name) || {}
const props = Object.assign({}, n.properties, {name, ...bindings})
```

`exact()` and `partial()` look the name up **against the sitemaps of every site in the page's `roster` item**, returning `{title, site}` on a hit. That is why the preview reads "6 nodes, 6 resolved" or "22 nodes, 0 resolved" — *resolved* means the node's name matched a real federated wiki page.

This answers the merge-key fragility found while composing the RCN aspects (see `tools/eip-aspects/`, commit 15105d3): identity is not meant to be a bare string that two curators must type identically. It is meant to **resolve to a page in the neighborhood**. The roster is the namespace.

Any future work on graph-composer identity should adopt this rather than invent a scheme: bind `props.name` to `{title, site}` by roster lookup, and treat unresolved names as provisional.
