# RCN Map plugin — plan

Marc Pierson and Claude Opus 5.5 · September 2026

Status: PLAN, not started. Written after the Whatcom co-ops FedWiki pages (`docs/whatcom-coops-wiki/`) showed what the native Map plugin cannot do.

## Why

The co-op pages need a map that shows a co-op, its neighbours, and the ties between them. Three ways were tried or weighed:

- **Frame of the RCN Map (tried, dropped).** Frame needs an absolute URL, so pages were tied to one wiki; the site needed files uploaded; the sandbox broke OpenStreetMap tiles; and the frame plugin never talks to what it frames, so the map waited forever for rows. Frame is now used only for co-op websites.
- **FedWiki's own Map plugin (in use now).** Works on any wiki, editable as text, every point a `[[link]]`. It draws points but, as far as we found, no lines between them — so no ties.
- **An RCN Map plugin (this plan).** A small in-page map that draws points *and* ties, from data held in the item, with a button to open the full RCN Map.

## The shape of the solution

Copy the `rcngraph` pattern, which already works:

- The **item** holds the page's own subject. The **asset folder** holds the full tool and the big shared layers.
- The item draws itself in the page column. A button opens the full tool in a popup; the tool sends changes back and the plugin saves them into the item with `pageHandler.put`, as `rcngraph` does with `saveGraph`.

What goes in the item, and what does not:

- **In the item:** points, ties, kinds and link styles for this page's subject — the same fields as an RCN Map issue file (`parcels`, `links`, `types`, `linkKinds`). A co-op page's neighbourhood is about 2 KB.
- **Referenced, not copied:** shared layers (an NDC boundary, a region) named by URL or asset path and fetched when drawing. A FedWiki page is loaded whole and every edit copies the whole item into the journal, so the 5.5 MB baseline must never ride in an item.
- **Not in the plugin at all:** the RCN Map's full UI (sidebar, layers, search, drawing, routing). It is a full-screen app and stays in the asset folder.

## Item format

```json
{
  "type": "rcnmap",
  "id": "<16 hex>",
  "text": "Community Food Co-op and 5 co-ops it is tied to …",
  "map": {
    "types":     { "consumer": {"label": "Consumer co-op / credit union", "color": "#2563eb"} },
    "linkKinds": { "trade":    {"label": "Trade — supplies goods", "color": "#1a7a4a", "weight": 3.5} },
    "parcels":   [ {"id": "cfc", "label": "Community Food Co-op", "wikiTitle": "Community Food Co-op", "type": "consumer", "latLng": [48.747, -122.4765]} ],
    "links":     [ {"from": "ncm", "to": "cfc", "kind": "trade", "label": "Supplies grass-fed beef"} ],
    "layers":    [ {"url": "/assets/NDC/whatcom-boundary.json", "label": "East Whatcom RRC"} ],
    "view":      {"lat": 48.8, "lng": -122.4, "zoom": 10}
  }
}
```

- `map` is a subset of the issue-file format, so the full RCN Map already knows how to draw it, and one converter serves both directions.
- `text` is a plain-words summary: one line per point and per tie. FedWiki search indexes `item.text`, and a wiki without the plugin still shows something readable.
- `wikiTitle` (added to the co-op issue file Sep 2026) is the page a point opens; fall back to `label`.
- `layers` and `view` are optional.

## Behaviour in the page

- Draw in the ~430 px column with Leaflet: points in their kind colours, ties in their line styles (colour, weight, dash), a compact legend.
- **Basemap: Esri Light Gray canvas**, as the RCN Map and table map use. No key, no referrer requirement.
- **Leaflet once per page.** The native Map plugin loads Leaflet 1.7.1 from unpkg; reuse `window.L` if present rather than loading a second copy.
- **Click a point → open its page** beside the current one: `wiki.doInternalLink(wikiTitle || label, $page)`, the same call `rcngraph` uses. Popups show the label, kind, and the contact block when present.
- **Double-click → text editor** on the item, like every plugin.
- **"Open in RCN Map ↗"** opens the full tool in a named popup (below).
- Scroll-wheel zoom off, as the native plugin does, so scrolling the page does not zoom the map.

## Lineup merging — keep what the native plugin does, and carry ties too

How the native Map plugin combines maps (read from `/plugins/map/map.js`, Sep 2026):

- Every map item adds the class `marker-source` to its element and attaches `markerData()`, returning its points as `{lat, lon, label}` — or only the points whose popups are open, so opening popups selects what to share. It also offers `markerGeo()` (GeoJSON) and `regionData()` (current bounds, class `region-source`).
- A map whose text has a `LINEUP` line collects `markerData()` from every earlier `.item` in the lineup — all items on pages to its left and above it on its own page — merges them, removes exact duplicates, and draws them with its own. It is a browser-side handshake: no server, no page fetch.
- It reads the lineup once, when it draws. The ❄ control copies the collected points into `item.frozen` and saves the page, making the combination permanent and forkable; hover previews what a re-freeze would add; shift-click unfreezes.

What the RCN Map plugin does:

1. **Be a native marker source.** Add `marker-source` and `markerData()` (and `markerGeo()`, `region-source`/`regionData()`), so a native Map with `LINEUP` to its right collects RCN points. Interoperates both ways with no change to the native plugin.
2. **Collect with `LINEUP`.** A `LINEUP` line in the item's text gathers from every marker source to its left — native maps and RCN maps.
3. **Carry ties between RCN maps.** Add a second, richer offer: class `rcnmap-source` and `rcnMapData()`, returning the `map` object (parcels, links, types, linkKinds) with each parcel tagged by its source page slug. An RCN map collecting from RCN maps merges ties as well as points; a tie whose ends come from different pages joins them — the Food Co-op page and the C2C page open together draw one connected network.
4. **Freeze (❄)** as the native plugin does, saving the merged parcels and links into the item.

Design rules for merging:

- **Identity:** match points by `source slug + parcel id`, then by `wikiTitle`, not by comparing whole objects, or the same co-op from two pages appears twice.
- **Kinds are namespaced by source.** Two issues may both define `worker` with different colours; keep each source's `types` separate unless label and colour agree.
- **Refresh.** The native plugin never re-reads the lineup; ours adds a ↻ control to re-collect without reopening the page.
- Same limits as native: only pages open in this browser, only to the left.

## The popup round trip

Plugin side (copy `rcngraph`'s `graphListener`):

- "Open in RCN Map ↗" → `window.open(RCN_MAP_URL, 'rcnmap', 'popup,…')`. Local wikis use the working copy (`http://localhost:8765/maps/rcn_map.html`); elsewhere `/assets/NDC/rcn_map.html` on the same site, then the canonical `ndcgroup.relocalizecreativity.net` copy.
- Listen for `{toolType:'rcn-map'}` messages: `mapReady` → post `{action:'loadIssue', map, pageTitle}`; `saveIssue` → set `item.map`, rebuild `item.text`, `pageHandler.put`, re-render; `doInternalLink` → open a page in the lineup.

RCN Map side (new, in `maps/rcn_map.html`):

- When opened by a wiki (`window.opener`), post `mapReady`; on `loadIssue`, show the item's data as a temporary issue layer using the existing `toggleIssue` drawing code (types, linkKinds, links already supported).
- A **"Save to wiki"** control posts `saveIssue` with the edited parcels and links. Editing points and ties in the full map is its own feature; step 2 can ship with save-back of view and layer choices only.

## Build steps

1. **Plugin, draw-only.** `wiki-plugin-rcnmap/` in this repo beside `wiki-plugin-rcn-graph/` and `wiki-plugin-rcn-table/`: `client/rcnmap.js`, `factory.json` (`{"name":"Rcnmap","title":"RCN Map","category":"visualization"}`), `index.js`, `package.json`, `pages/about-rcnmap-plugin`. Emit, legend, ties, point → page, double-click edit, readable `text`. Local install by symlink, as the other RCN plugins. **Done when:** the co-op pages' native map items are replaced by `rcnmap` items drawing their ties, checked by clicking in the local wiki.
2. **Lineup.** `marker-source` / `markerData()` first (native interop), then `LINEUP`, `rcnmap-source` / `rcnMapData()`, tie merging, ❄ freeze, ↻ refresh. **Done when:** a native `LINEUP` map collects RCN points, and an RCN `LINEUP` map joins two co-op neighbourhoods with their ties.
3. **Popup round trip.** The `rcn-map` handshake in both the plugin and `rcn_map.html`. **Done when:** "Open in RCN Map" shows the item's data in the full map and "Save to wiki" writes back.
4. **Shared layers.** `layers` entries fetched and drawn — only when a page needs one.
5. **Publish.** Marc runs `npm publish` (the harness blocks Claude from it); Wiki Café needs its Docker image rebuilt with the plugin, the same path as `rcngraph`.

Each step ends with the co-op pages rebuilt (`docs/whatcom-coops-wiki/build_pages.py` gains an `@@RCNMAP` marker) and checked in the local wiki at `coops.localhost:3000` with real clicks.

## Risks and choices to make before step 1

- **Name.** `rcnmap` (item type, one word, matching `rcngraph` and `rcntable`); package `wiki-plugin-rcnmap`.
- **Two copies of the drawing code.** The plugin and `rcn_map.html` both draw issues. Keep the plugin's drawing small and let the full map own everything else; share only the item format.
- **Leaflet version.** Match the native plugin's 1.7.1, or detect and reuse; two Leaflets on one page conflict.
- **Wikis without the plugin** show the item as unknown. The readable `text` is the fallback; the native Map item can stay on pages meant for any wiki.
- **Related bug to fix first or alongside:** the Graph Tool's `enrichSVGLinks()` breaks wiki links on wrapped labels (see `docs/whatcom-coops-wiki/README.md`). The map plugin opens pages the same way, so fix both link paths together.

Marc Pierson and Claude Opus 5.5 · September 2026
