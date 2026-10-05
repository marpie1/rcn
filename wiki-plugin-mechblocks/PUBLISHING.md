# Publishing wiki-plugin-mechblocks and installing it on Wiki Café

*Marc Pierson and Claude Opus 5.5 · October 2026*

Checked on October 4 2026, before the first publish:

- The name `wiki-plugin-mechblocks` is free on npm.
- Wiki Café's main farm (`marc.relocalizecreativity.net` and its neighbours) already runs Ward's Mech, Solo and wiki-client 0.33. So everything Mech Blocks leans on is there, and the old-client workaround is not needed.
- `npm pack` gives 11 files, 72 kB. The tarball was unpacked in a clean folder; its client parses and its server answers PROJECTIONS, PROJECTION and BADGES. It has no runtime dependencies.

## 1. Publish (Marc, from his own terminal)

npm needs your granular token with "Bypass 2FA" ticked; see the FedWiki plugin notes. Publishing first rebuilds the client and runs the 15 tests, through `prepack`, and stops if any fail.

```
cd ~/rcn/wiki-plugin-mechblocks
npm publish --access=public
npm view wiki-plugin-mechblocks version
```

The last line should print `0.1.0`.

## 2. Install on the main Wiki Café farm (Christian)

Message for Christian, ready to paste:

> Hi Christian, could you install a new plugin on the main Wiki Café farm (marc.relocalizecreativity.net and neighbours)? It is `wiki-plugin-mechblocks` on npm, version 0.1.0:
>
> `npm install -g wiki-plugin-mechblocks`, then restart the wiki.
>
> It works beside Ward's Mech, which you already have: a block editor for Mech scripts, a view of Mech's state while a script runs, and server blocks for `PLUGIN rcn` at `/plugin/rcn/mech`. Those blocks only read the site's own pages and assets. It has no runtime dependencies and nothing to configure. Thank you!

## 3. Check it took (anyone)

```
curl -s -o /dev/null -w "%{http_code}\n" https://marc.relocalizecreativity.net/plugins/mechblocks/mechblocks.js
curl -s https://marc.relocalizecreativity.net/system/factories.json | grep -o '"Mechblocks"'
curl -s "https://marc.relocalizecreativity.net/plugin/rcn/mech?mech=W3siY29tbWFuZCI6IkhFTExPIiwia2V5IjoiYS4wIn1d&state=e30="
```

The three lines should give, in order:

1. `200`
2. `"Mechblocks"`
3. a reply containing `the rcn plugin answers 😀`

Then open `https://marc.relocalizecreativity.net/view/about-mechblocks-plugin` and click ▶ on the examples.

## What will and will not work there at first

- **Edit in blocks, Watch it run, Graph Tool:** work on any page with Mech items. The Graph Tool opens the hosted copy in `assets/Drag/graph-tool-v22.html`, which is already there.
- **PROJECTIONS and PROJECTION:** report "no Layer 1 folders" until a Layer 1 bundle is uploaded to the site's assets as `rcn-table/<name>/graph.json`. That upload is still pending; see the Layer 1 notes.
- **BADGES:** reads only the site it runs on. SODOTO badges live on the separate SODOTO farm, so on the main farm it finds none unless a page there carries badge items.
- **The SODOTO farm is not included.** Its Docker image runs the older wiki 0.27 and does not have Ward's Mech. Adding Mech Blocks there would mean vendoring both into `deploy/docker/Dockerfile.fedwiki`, which is a separate decision.

## Later versions

Marc installs plugins on Wiki Café himself.

1. Bump `version` in `package.json`.
2. Run `npm publish --access=public`.
3. On Wiki Café, run `npm update -g wiki-plugin-mechblocks` and restart the wiki.

Plugin scripts are cached for about an hour, so force-reload before judging a change.

Not every change needs a new version:

- **Introduction, Manual, Reference:** edit the pages in the wiki. The site's own copy replaces the one the plugin brings.
- **Slides:** upload a new `rcn-mech-blocks-intro.pptx` with an Assets item named `mechblocks`. The Slides link sends that copy in place of the plugin's.
