# Ward Cunningham's Mech interpreter, vendored

These files are copied unchanged from `src/client/` of
[WardCunningham/wiki-plugin-mech](https://github.com/WardCunningham/wiki-plugin-mech)
at commit 54b7695, the source of the published 0.1.48-3. MIT licence, see LICENSE.

Mech Blocks bundles them so "Watch it run" can run a script with Ward's own
blocks while recording which block reads and writes each piece of state.
The one import that is swapped at build time is `./mech.js`, which registers
Ward's plugin as a side effect; `src/mech-shim.js` supplies its three helpers
instead, so loading Mech Blocks never replaces Ward's plugin on a page.
