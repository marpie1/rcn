# wiki-plugin-mechblocks

*Marc Pierson and Claude Opus 5.5 · October 2026*

A Federated Wiki plugin that works beside Ward Cunningham's [Mech](https://github.com/WardCunningham/wiki-plugin-mech). Drop a **Mech Blocks** item on a page that has Mech items. Ward's Mech items are never changed except when you save an edit, and they stay ordinary Mech items that any wiki with Ward's plugin runs.

## What it does

- **Edit in blocks ↗** opens the Mech Blocks tool (`tools/mech-blocks.html`, embedded in the plugin, so nothing needs hosting) in a popup with that item's script. **Save to wiki** writes the text back as an ordinary edit, and Ward's plugin redraws it. **＋ New Mech in blocks** adds a new Mech item after the Mech Blocks item.
- **Watch it run** runs the script inside the Mech Blocks item with Ward's own blocks and draws the shared notebook (Mech's `state`) as it fills. There is an oval for each thing the blocks pass along. A solid line comes from the block that wrote it, and a dashed line goes to each block that read it. A line is red when a block needed something that was not there and stopped, and grey when a block only glanced for something optional. Lines brought back from the server by `PLUGIN rcn` are credited to the server line that wrote them.
- **Graph Tool ↗** appears once a run has made graphs (`state.aspect`) and draws them in the RCN Graph Tool, one column per node type.
- **PLUGIN rcn** is a set of server blocks for RCN data on the site:
  - `PROJECTIONS` lists the Layer 1 folders in `assets/rcn-table/`.
  - `PROJECTION whatcom [kinds…]` turns one into an aspect.
  - `BADGES [words…]` gathers the SODOTO badges on the site's pages as people, skills and a list of items.

## Help links

The Mech Blocks item, and the block tool it opens, link to an Introduction, a Manual, a block Reference and the Slides.

- **The three documents** are wiki pages that come with the plugin (`pages/mech-blocks-*`), built from `tools/mech-blocks-*.md`. Like any page a plugin brings, a page of the same name on the site takes its place. So edit them in the wiki, and the site's copy is the one people see, with no new plugin version.
- **The slides** come from `/plugin/mechblocks/rcn-mech-blocks-intro.pptx`. That route sends the copy in the site's own assets, under `assets/mechblocks/`, if one has been uploaded there with an Assets item named `mechblocks`. Otherwise it sends the copy that came with the plugin. To update the slides, upload the new file there.

The About page (`pages/about-mechblocks-plugin`) carries working examples. It also carries a Code item defining `graphtool`, so ordinary Mech, without this plugin, can send its graphs to the Graph Tool with `CODE graphtool`.

## How it is built

`npm run build` bundles `src/` with Ward's interpreter, which is vendored unchanged in `vendor/mech/` under its MIT licence; see that folder's README. Ward's `mech.js` registers his plugin when imported, so the build swaps it for `src/mech-shim.mjs`. Loading Mech Blocks can therefore never replace Ward's plugin on a page. The build also copies `tools/mech-blocks.html` in, and regenerates the About page.

Watching works by giving each block its own view of the one state object: a Proxy that reports reads, writes and deletes tagged with that block (`src/trace.mjs`). Each block's `emit` is wrapped in our bundled copy only.

`npm test` runs 17 tests: the tracer, the aspect converter, the server blocks against a fixture site, the slides route and help pages, and the About page's Code item loading the way Ward's CODE loads it.

## Known limits

- Ward's Mech 0.1.48 reads the page key from the `data-key` attribute, which wiki-client sets from 0.24 on. On an older client, such as the 0.23.2 in Marc's local wiki, the plugin copies the key across for its own page so that CODE and lineup walks work.
- `PLUGIN rcn` reads only this site: its pages for BADGES and its assets for PROJECTION. Badges on other people's SODOTO sites are not gathered.
- There are no relationship-record blocks. That design has no code until it is agreed.
- Watch it run really runs the script: PREVIEW opens pages, DOWNLOAD downloads, and SHOW changes the lineup.
- On npm, and installed on the main Wiki Café farm. To try it locally, symlink it into the wiki's `node_modules` like the other RCN plugins, and restart the wiki.
