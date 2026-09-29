# Whatcom co-ops on FedWiki

One FedWiki page per co-op plus an index page, built from the RCN Map issue file `tools/issue-data/whatcom-wa--cooperatives.json` and Marc's graph layout `tools/whatcom-coops-graph.json`.

Marc Pierson and Claude Opus 5.5 · September 2026

## What each page carries

- The record: kind, founding year, notes, and the contact block (website, phone, email, address, named people, caveat, when and where it was checked).
- Ties, as `[[links]]` to the other co-op pages, each with its source.
- An `rcngraph` item: the co-op and its nearest neighbours, cut from Marc's layout. Click a box to open that co-op's page; "Edit in Graph Tool" opens the model.
- A map of the co-op and its neighbours. By default an `rcnmap` item (`wiki-plugin-rcnmap`, in this repo) drawing the points and the ties, each point opening its page. `build_pages.py --map native` uses FedWiki's own Map plugin instead — points only, one `lat, lon [[Title]] — kind` line each — for a wiki that does not have the plugin yet.
- A `frame` item with the co-op's own website — the only use of Frame — where the site allows framing. Five do not (ICU, REI, North Coast CU, A1DesignBuild, Puget Sound Food Hub refuse; Bellingham Bay Builders puts up a bot check), and four have no working site; those pages link out instead.

The index page adds the `rcntable` item (all 22 rows; its Map button draws the ties on the RCN Map), the whole graph, a map of all 22, and two `assets` items.

## Rebuild

1. `python3 make_ego_graphs.py` — writes `diagrams/<mapId>.rcn.json`, one per co-op. Skip it unless the layout or the ties changed.
2. Render the SVGs in the Graph Tool (below). Skip it unless step 1 ran.
3. `python3 build_pages.py` — writes `whatcom-coops-wiki.json`, a flat `{slug: page}` drop file, with the attribution stamped last. The pages work on any wiki.

Only the table plugin needs files on the site: `/assets/rcn-table/` holding `rcn-table.html`, `rcn-table-map.html`, `graph-tool-v22.html` (the `tools/dist` build) and the `whatcomcoops/` folder written by `python3 -c "import export; export.export('whatcomcoops', '<dir>')"` in `substrate/`.

## Rendering the SVGs

The SVG in an `rcngraph` item must come from the Graph Tool itself. Serve `diagrams/` on a port that accepts POST, open `tools/graph-tool-v22.html`, and for each model: `loadGraphJSON`, fit (set `zoom`/`pan` directly — `zoomFit()` waits on `requestAnimationFrame`, which a background tab never fires, and the export then has no view transform), `buildExportSVG()`, crop the viewBox to the content, `enrichSVGLinks()`, then relink.

**Relink every co-op box.** `enrichSVGLinks()` wraps each `<text>` in `<a class="internal">`. wiki-client's click handler reads the page name from the clicked element — `$(e.target).text() || data('pageName')` and then `attr('title').split(...)` — and in a wrapped label that element is one `<tspan>`: the text is one line of the name and there is no `title`, so the handler throws and the browser follows the bare href, replacing the lineup. So: unwrap every enriched anchor, then add to each co-op node group `<a class="internal" href="/<slug>.html" data-page-name="<slug>" title="view"><title>…</title><rect … fill="transparent" data-page-name="<slug>" title="view"/></a>` covering the node. The `<title>` tooltip sits on the `<a>`, not inside the `<rect>`, or `text()` picks it up. Edge labels stay plain text.

This is a Graph Tool bug, not a co-op one: any enriched diagram with wrapped labels has it on this wiki-client. The fix belongs in `enrichSVGLinks()`.
