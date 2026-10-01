#!/usr/bin/env node
'use strict';
/*
 * build-deploy-tool.js — keep the Graph Tool ONE complete file, in place.
 *
 *   node tools/build-deploy-tool.js                 # refresh tools/graph-tool-v22.html
 *   node tools/build-deploy-tool.js --check <url>   # is the deployed copy complete and current?
 *
 * WHY THIS EXISTS
 *
 * The Graph Tool needs two shared lists: the house icons (rcn-icons.js) and the
 * relation families (edge-families.js). Each list has ONE master file in tools/,
 * because other things read them too — the Agreement Checker and the icon sheet
 * load rcn-icons.js, and substrate/seed.py builds Neo4j's relation vocabulary
 * from edge-families.js. Two hand-kept copies would drift apart without a word.
 *
 * The tool used to load them with relative <script src> tags. That works in
 * tools/, and 404s in a flat FedWiki asset folder — silently: every icon node
 * renders as a bare shape and a save writes that picture back over a good
 * diagram (found on marc.relocalizecreativity.net/assets/Drag, Sep 3 2026).
 *
 * Sep 3 fix: a second, self-contained copy in tools/dist/. Same name, two
 * folders, and the wrong one got uploaded (Sep 30 2026, both sites). Replaced
 * by this: the masters stay where they are, and this script pastes a copy of
 * each INTO tools/graph-tool-v22.html between BEGIN/END marker lines. There is
 * one Graph Tool file, always complete, and it is the one to upload.
 *
 * Edit the masters, never the pasted blocks — this script overwrites them. A
 * Claude Code hook (.claude/settings.json) reruns it whenever the tool or
 * either master is edited. It only writes when a block is out of date, so
 * running it is always safe.
 *
 * d3 stays on its CDN — it is already absolute and already works.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const TOOLS = __dirname;
const SRC = path.join(TOOLS, 'graph-tool-v22.html');
const SIDECARS = ['rcn-icons.js', 'edge-families.js'];

// A sidecar can contain the literal characters </script>, which would close the
// wrapping tag early and truncate the file into a syntax error.
const safe = js => js.replace(/<\/script/gi, '<\\/script');
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const block = (src, js) =>
  `<!-- BEGIN ${src} — pasted from tools/${src} by tools/build-deploy-tool.js. Edit tools/${src}, never this block. -->\n` +
  `<script>\n${safe(js)}\n</script>\n` +
  `<!-- END ${src} -->`;

// Find a sidecar in the tool: an earlier pasted block, or the old relative tag.
const finder = src => new RegExp(
  `<!-- BEGIN ${esc(src)} [\\s\\S]*?<!-- END ${esc(src)} -->` +
  `|<script[^>]*src="${esc(src)}"[^>]*>\\s*<\\/script>`);

// Relative script tags left after inline script bodies are stripped. rcn-icons.js
// documents its own <script src="rcn-icons.js"> in a header comment, and that is
// not a dependency.
function relativeScripts(html) {
  const skeleton = html.replace(/<script(?![^>]*\bsrc=)[^>]*>[\s\S]*?<\/script>/gi, '<script></script>');
  return [...skeleton.matchAll(/<script[^>]*src="([^"]+)"/g)].map(m => m[1]).filter(s => !/^https?:/.test(s));
}

if (process.argv.includes('--check')) {
  const base = process.argv[process.argv.indexOf('--check') + 1];
  if (!base) { console.error('ERROR: --check needs the folder URL, e.g. https://host/assets/NDC'); process.exit(2); }
  const url = `${base.replace(/\/$/, '')}/graph-tool-v22.html`;
  (async () => {
    let live;
    try {
      const r = await fetch(url);
      if (r.status !== 200) { console.log(`  MISS ${r.status}  ${url}`); process.exit(1); }
      live = await r.text();
    } catch (e) { console.log(`  ERR  ${e.message}  ${url}`); process.exit(1); }
    const sha = s => crypto.createHash('sha1').update(s).digest('hex').slice(0, 10);
    const local = fs.readFileSync(SRC, 'utf8');
    const rel = relativeScripts(live);
    console.log(`  ${url}`);
    if (rel.length) {
      console.log(`  INCOMPLETE — it loads ${rel.join(' + ')} from its folder; icons and relation families will vanish there.`);
      console.log('  Upload tools/graph-tool-v22.html (it now carries both inside it).');
      process.exit(1);
    }
    if (sha(live) === sha(local)) { console.log('  ok — complete, and the same as tools/graph-tool-v22.html.'); process.exit(0); }
    console.log('  complete, but NOT the same as tools/graph-tool-v22.html — upload the current one to bring it up to date.');
    process.exit(1);
  })();
  return;
}

const before = fs.readFileSync(SRC, 'utf8');
let html = before;
for (const src of SIDECARS) {
  const p = path.join(TOOLS, src);
  if (!fs.existsSync(p)) { console.error(`ERROR: master not found: tools/${src}`); process.exit(1); }
  const re = finder(src);
  if (!re.test(html)) { console.error(`ERROR: no place for ${src} in the tool — no BEGIN/END block and no <script src>. Has the tool changed?`); process.exit(1); }
  const fresh = block(src, fs.readFileSync(p, 'utf8'));
  html = html.replace(re, () => fresh);
}

const left = relativeScripts(html);
if (left.length) { console.error(`STILL RELATIVE — not complete: ${left.join(', ')}`); process.exit(1); }

if (html === before) {
  console.log('tools/graph-tool-v22.html is up to date — both lists already pasted in. Upload that file.');
} else {
  fs.writeFileSync(SRC, html);
  console.log(`refreshed tools/graph-tool-v22.html  (${(html.length / 1024).toFixed(0)} KB) — pasted in ${SIDECARS.join(' + ')}. Upload that file.`);
}
