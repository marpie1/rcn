#!/usr/bin/env node
'use strict';
/*
 * build-deploy-tool.js — make the Graph Tool safe to drop in a flat asset folder.
 *
 *   node tools/build-deploy-tool.js            # -> tools/dist/graph-tool-v22.html
 *   node tools/build-deploy-tool.js --check    # verify a deployed copy instead
 *
 * WHY THIS EXISTS
 *
 * graph-tool-v22.html loads its sidecars with relative script tags:
 *
 *     <script src="rcn-icons.js"></script>
 *     <script src="edge-families.js"></script>
 *
 * That resolves locally, where the tool sits in tools/ next to them. It does NOT
 * resolve when the tool is deployed alone into a FedWiki asset folder, and the
 * failure is silent — line ~2572 is
 *
 *     var ICONS = (typeof RCN_ICONS !== 'undefined') ? RCN_ICONS : [];
 *
 * so a missing sidecar degrades to shapes-only with no error. Symptom: a diagram
 * published with icons opens in the deployed tool with every icon gone. The model
 * still carries its `icon` keys (icon is in STAMP_NODE_FIELDS, so it survives the
 * round trip), but the re-rendered SVG does not — saving from that tool bakes the
 * icon-less picture back into the wiki page.
 *
 * Deploying three files in the right relative layout is the kind of thing that
 * works once and silently rots. This inlines the sidecars so the deploy artifact
 * is ONE self-contained file with nothing relative left to break.
 *
 * d3 stays on its CDN — it is already absolute and already works.
 */

const fs = require('fs');
const path = require('path');

const TOOLS = __dirname;
const SRC = path.join(TOOLS, 'graph-tool-v22.html');
const DIST = path.join(TOOLS, 'dist');
const OUT = path.join(DIST, 'graph-tool-v22.html');

// A sidecar can contain the literal characters </script>, which would close the
// wrapping tag early and truncate the file into a syntax error.
const safe = js => js.replace(/<\/script/gi, '<\\/script');

if (process.argv.includes('--check')) {
  const base = process.argv[process.argv.indexOf('--check') + 1];
  if (!base) { console.error('ERROR: --check needs a base URL, e.g. https://host/assets/Drag'); process.exit(2); }
  const html = fs.readFileSync(SRC, 'utf8');
  const needed = [...html.matchAll(/<script[^>]*src="([^"]+\.js)"/g)].map(m => m[1]).filter(s => !/^https?:/.test(s));
  (async () => {
    let bad = 0;
    for (const f of needed) {
      const url = `${base.replace(/\/$/, '')}/${f}`;
      let code = 'ERR';
      try { code = (await fetch(url)).status; } catch (e) { code = e.message; }
      const ok = code === 200;
      if (!ok) bad++;
      console.log(`  ${ok ? 'ok  ' : 'MISS'} ${String(code).padEnd(5)} ${url}`);
    }
    console.log(bad ? `\n${bad} sidecar(s) missing — icons and relation families will silently vanish there.\nDeploy tools/dist/graph-tool-v22.html instead; it needs no sidecars.`
                    : '\nAll sidecars resolve.');
    process.exit(bad ? 1 : 0);
  })();
  return;
}

let html = fs.readFileSync(SRC, 'utf8');
const inlined = [];
html = html.replace(/<script[^>]*src="([^"]+\.js)"[^>]*>\s*<\/script>/g, (tag, src) => {
  if (/^https?:/.test(src)) return tag;                     // CDN: leave absolute
  const p = path.join(TOOLS, src);
  if (!fs.existsSync(p)) { console.error(`ERROR: sidecar not found: ${src}`); process.exit(1); }
  const js = fs.readFileSync(p, 'utf8');
  inlined.push([src, js.length]);
  return `<script>\n/* inlined from ${src} by build-deploy-tool.js — do not edit here, edit tools/${src} */\n${safe(js)}\n</script>`;
});

if (!inlined.length) { console.error('ERROR: no local sidecars found to inline — has the tool changed?'); process.exit(1); }

fs.mkdirSync(DIST, { recursive: true });
fs.writeFileSync(OUT, html);

// Guard: nothing relative may remain, or the artifact is not self-contained.
// Scan with inline script BODIES stripped — rcn-icons.js documents its own
// <script src="rcn-icons.js"> in a header comment, and that is not a dependency.
const skeleton = html.replace(/<script(?![^>]*\bsrc=)[^>]*>[\s\S]*?<\/script>/gi, '<script></script>');
const left = [...skeleton.matchAll(/<script[^>]*src="([^"]+)"/g)].map(m => m[1]).filter(s => !/^https?:/.test(s));
console.log(`wrote ${path.relative(process.cwd(), OUT)}  (${(html.length / 1024).toFixed(0)} KB)`);
inlined.forEach(([s, n]) => console.log(`  inlined ${s} (${(n / 1024).toFixed(1)} KB)`));
if (left.length) { console.error(`\nSTILL RELATIVE — not self-contained: ${left.join(', ')}`); process.exit(1); }
console.log('\nself-contained: no relative script tags remain. Upload this one file.');
