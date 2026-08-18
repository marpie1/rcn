#!/usr/bin/env node
/**
 * inject-diagrams.js — the forward half of the diagram round trip.
 *
 *   node tools/inject-diagrams.js [pagesDir] [--svg-dir tools]
 *
 * md-to-fedwiki-page.js turns a DIAGRAM_<name> line into an ordinary paragraph,
 * because markdown has no way to carry a 20KB clickable SVG and should not try.
 * This walks the generated page JSON and swaps each of those paragraphs for an
 * html item holding the real diagram.
 *
 * pull-fedwiki.js does the reverse: html item back to DIAGRAM_<name>. Run this
 * after ANY regeneration of the pages, or a diagram silently reverts to the word
 * "DIAGRAM_something" on the wiki — which is what happened the first time.
 *
 * Links are rewritten to wiki-relative /slug.html. The repo copies in tools/ carry
 * absolute view URLs so the same SVG works from a local HTML file; inside the wiki
 * relative is what resolves.
 */

'use strict';
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf(n); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const REPO = path.resolve(__dirname, '..');
const PAGES = path.resolve(REPO, args.find(a => !a.startsWith('--')) || 'docs/pathways/pages');
const SVGDIR = path.resolve(REPO, flag('--svg-dir', 'tools'));
const WIKI = /https?:\/\/[^/]+\/view\//;

function wikiSvg(name) {
  const p = path.join(SVGDIR, `${name}.svg`);
  if (!fs.existsSync(p)) return null;
  let s = fs.readFileSync(p, 'utf8');
  s = s.replace(new RegExp(`href="${WIKI.source}([^"]+)"\\s*(?:target="[^"]*"\\s*)?(?:rel="[^"]*"\\s*)?`, 'g'), 'href="/$1.html"');
  s = s.replace(/\s(width|height)="[^"]*"/, '').replace(/\s(width|height)="[^"]*"/, '');
  s = s.replace('<svg ', '<svg style="width:100%;height:auto;display:block" ');
  return s;
}

let done = 0, missing = [];
for (const f of fs.readdirSync(PAGES).filter(f => f.endsWith('.json'))) {
  const p = path.join(PAGES, f);
  const page = JSON.parse(fs.readFileSync(p, 'utf8'));
  let touched = false;
  (page.story || []).forEach((item, i) => {
    const m = /^DIAGRAM_([a-z0-9-]+)$/.exec((item.text || '').trim());
    if (!m || item.type === 'html') return;
    const svg = wikiSvg(m[1]);
    if (!svg) { missing.push(`${m[1]} (on ${f})`); return; }
    page.story[i] = { type: 'html', id: item.id, text: svg };
    touched = true; done++;
  });
  if (touched) fs.writeFileSync(p, JSON.stringify(page, null, 2));
}
console.log(`diagrams injected: ${done}`);
if (missing.length) {
  console.log('MISSING SVGs — placeholder left as text, which will publish as the literal word:');
  missing.forEach(x => console.log('  ' + x));
  process.exit(1);
}
