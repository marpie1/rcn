# Set files — one dataset across the Graph Tool, Map, Timeline and Table

Verified against commit `ab43a28` (Oct 1 2026). The loader is `tools/rcn-switch.js`, which is pasted into all four tools, plus the `?set=` blocks near the end of each tool's main script.

A set file names where one dataset lives in each of the four views. Any of the tools opened as

    <tool>.html?set=<set file>&sel=<id>

loads its own part of the set, opens on the thing with that id, and shows the ⇄ bar that carries the current selection to the other three. Without `?set=` a tool behaves exactly as it did before.

## Shape

```json
{
  "name": "Co-ops of Whatcom County",
  "about": "free text — what this set is, who made it",
  "graph": "whatcom-coops-graph.json",
  "graphIdProp": "mapId",
  "issue": "whatcom-wa--cooperatives",
  "timeline": "whatcom-coops-timeline.json",
  "table": { "src": "whatcom-coops-export-", "kind": "Coop", "idColumn": "mapId" }
}
```

| Field | Used by | Meaning |
|---|---|---|
| `name` | the bar | label shown on the ⇄ bar |
| `graph` | Graph Tool | a native graph JSON file |
| `graphIdProp` | Graph Tool | the node `props` field that holds the shared id, when node ids differ from it. Omit if node ids *are* the shared ids |
| `issue` | RCN Map | an issue **key** from `issue-index.json` (not a file) |
| `timeline` | Timeline | a timeline model JSON file |
| `table.src` | Table | an export **location**: a folder (`…/whatcom/`) or a file-name prefix ending in `-` (`whatcom-coops-export-`), as written by `substrate/export.py [--prefix NAME]` |
| `table.kind` | Table | which kind (table) to open |
| `table.idColumn` | Table | the column that holds the shared id |

Every path is **relative to the set file**. A view whose field is missing simply has no button on the bar.

## The one rule: a shared id

The selection travels as one id: the **map's point id** for that thing (`cfc`, `tyl`, …). Each file has to carry it somewhere:

- **Map issue**: the parcel `id`.
- **Graph**: the node `id`, or `props[graphIdProp]`.
- **Timeline**: the interval `id`, or the first entry of the interval's `coops` list (kept in the interval's extra fields). An interval with no co-op id of its own (*A-1 Builders (conventional firm)*) hands on `coops[0]` (`a1`).
- **Table**: the `idColumn` value in the row.

If an id is not found, the tool opens the dataset with nothing selected; nothing fails.

## Deploying

The set file sits beside the tools. On a flat FedWiki asset folder (NDC Assets) everything is flat, so paths are bare file names. Locally (`localhost:8765`) the tools live in `tools/` and `maps/`, and the switcher passes the set as a root path (`/tools/whatcom-coops.set.json`), so the same file works from either folder. The live set and the repo set differ only in `table.src`: the repo points at `../substrate/export/whatcomcoops/whatcom-coops-export-`, while live it is just `whatcom-coops-export-`.

## Editing the switcher

Edit `tools/rcn-switch.js`, then run `node tools/paste-switch.js`, which refreshes the pasted copy in all four tools. Never edit the pasted blocks.

Marc Pierson with Claude Opus 5.5, Oct 2026.
