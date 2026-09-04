#!/usr/bin/env node
/**
 * inject-diagrams.js — the forward half of the diagram round trip.
 *
 *   node tools/inject-diagrams.js [pagesDir] [--svg-dir tools]
 *
 * md-to-fedwiki-page.js turns a DIAGRAM_<name> line into an ordinary paragraph,
 * because markdown has no way to carry a 20KB clickable SVG and should not try.
 * This walks the generated page JSON and swaps each of those paragraphs for a
 * real diagram item.
 *
 * DEFAULT IS `rcngraph`, not `html`. An html item is a dead picture: it renders
 * and that is all. An rcngraph item carries BOTH the enriched clickable SVG and
 * the graphJSON model, so on the wiki the diagram is clickable AND has an
 * "Edit in Graph Tool" button that reopens the real model and saves back.
 * Marc has to be able to edit the diagrams in the FedWiki, not just the prose —
 * so a diagram published as a bare SVG is a bug, not a shortcut.
 *
 * Needs wiki-plugin-rcngraph installed on the target wiki. Use --as html only
 * for a wiki that does not have it, and know that you are shipping a dead image.
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
const AS = flag('--as', 'rcngraph');
if (!['rcngraph', 'html'].includes(AS)) { console.error("ERROR: --as must be rcngraph or html"); process.exit(2); }
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

function model(name) {
  const p = path.join(SVGDIR, `${name}.rcn.json`);
  if (!fs.existsSync(p)) return null;
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch (e) { console.error(`  ${name}.rcn.json will not parse: ${e.message}`); return null; }
}

let done = 0, missing = [], noModel = [];
for (const f of fs.readdirSync(PAGES).filter(f => f.endsWith('.json'))) {
  const p = path.join(PAGES, f);
  const page = JSON.parse(fs.readFileSync(p, 'utf8'));
  let touched = false;
  (page.story || []).forEach((item, i) => {
    const m = /^DIAGRAM_([a-z0-9-]+)$/.exec((item.text || '').trim());
    if (!m || item.type === 'html' || item.type === 'rcngraph') return;
    const name = m[1];
    const svg = wikiSvg(name);
    if (!svg) { missing.push(`${name} (on ${f})`); return; }
    if (AS === 'html') {
      page.story[i] = { type: 'html', id: item.id, text: svg };
    } else {
      const g = model(name);
      if (!g) {
        // A computed chart (a plot of a function) has no node-link model and never
        // will. Ship it as html and say so, rather than leaving the marker as text.
        noModel.push(`${name} (on ${f})`);
        page.story[i] = { type: 'html', id: item.id, text: svg };
        touched = true; done++;
        return;
      }
      // graphJSON is the model OBJECT — the tool does JSON.stringify(ev.data.graphJSON)
      // on the way in. svgString is the enriched clickable export.
      page.story[i] = { type: 'rcngraph', id: item.id, graphJSON: g, svgString: svg };
    }
    touched = true; done++;
  });
  if (touched) fs.writeFileSync(p, JSON.stringify(page, null, 2));
}
console.log(`diagrams injected: ${done} (as ${AS})`);
if (noModel.length) {
  console.log('no .rcn.json — shipped as a flat html item, NOT editable on the wiki:');
  noModel.forEach(x => console.log('  ' + x));
  console.log('  (fine for a computed chart; a bug for anything the Graph Tool could have drawn)');
}
if (missing.length) {
  console.log('MISSING SVGs — placeholder left as text, which will publish as the literal word:');
  missing.forEach(x => console.log('  ' + x));
  process.exit(1);
}
