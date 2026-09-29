# wiki-plugin-rcnmap

A small RCN map on a Federated Wiki page that draws points **and the ties between them**. Each point is coloured by its kind, each tie by its kind of link, and clicking a point opens that point's page in the lineup beside this one.

FedWiki's own Map plugin draws points only. The full RCN Map is a full-screen tool that lives in a site's assets. This plugin sits between them: the item carries its own subject — a few KB in the RCN Map issue-file shape — and draws it in the page column.

Install on a wiki server:

```
npm install -g wiki-plugin-rcnmap
```

and restart the wiki. The Factory then offers **RCN Map**.

## The item

```json
{
  "type": "rcnmap",
  "text": "Caption on the first line\nthen the points and ties in words",
  "map": {
    "types":     { "worker": {"label": "Worker co-op", "color": "#c0392b"} },
    "linkKinds": { "trade":  {"label": "Trade — supplies goods", "color": "#1a7a4a", "weight": 3.5, "dash": "8 4"} },
    "parcels":   [ {"id": "tyl", "label": "Cooperativa Tierra y Libertad", "wikiTitle": "Cooperativa Tierra y Libertad", "type": "worker", "latLng": [48.8769, -122.4344]} ],
    "links":     [ {"from": "tyl", "to": "cfc", "kind": "trade", "label": "Supplies produce"} ],
    "view":      {"lat": 48.8, "lng": -122.4, "zoom": 10}
  }
}
```

- `map` is the RCN Map issue-file format (`types`, `linkKinds`, `parcels`, `links`), so the full RCN Map can draw the same data. `view` is optional; without it the map fits its points.
- A point opens the page named by `wikiTitle`, or by `label` when there is none.
- `text`: the first line is the caption. The rest lists the points and ties in plain words, so FedWiki search finds them and a wiki without this plugin still shows something readable.
- An item with no `map` — a fresh one from the Factory — is drawn from its text: every `lat, lon label` line is a point, as in the native Map plugin. Ties need `map`.

Double-click the item to edit its text. Editing the text changes the caption; the points and ties live in `map`, which the full RCN Map will edit in a later version.

## Lineup merging

Like FedWiki's own Map plugin, this one combines maps across the lineup.

- **Every RCN map offers its data** to items to its right, two ways: the native way (class `marker-source`, `markerData()` — so a native Map item with `LINEUP` collects RCN points), and a richer RCN way (class `rcnmap-source`, `rcnMapData()` — points, ties, kinds and link kinds).
- **An RCN map whose text has a `LINEUP` line** collects from every item to its left — earlier pages, and earlier items on its own page: full data from RCN maps, points from native maps. Points merge when they name the same page (`wikiTitle`, else label); ties are remapped onto the merged points, so a tie whose ends come from different pages joins them. Kinds merge by key; two sources giving one key different colours keep both.
- **❄** freezes what is collected into the item (`item.frozen`, saved as an ordinary edit), so it stays when the lineup changes; shift-click ❄ unfreezes. **↻** collects again — the native plugin reads the lineup only when it draws.
- Browser-side only: it sees pages open in this window, to its left.

## Status

Version 0.2: draws points, ties and a legend; a point opens its page; lineup merging with ties, ❄ freeze, ↻ refresh. Planned next, in `docs/rcn-map-plugin-plan.md`: "Open in RCN Map" with save-back, and shared layers.

Part of the [RCN toolset](https://github.com/marpie1/rcn), MIT.

Marc Pierson and Claude Opus 5.5 · September 2026
