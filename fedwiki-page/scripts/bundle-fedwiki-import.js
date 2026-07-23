#!/usr/bin/env node
/**
 * bundle-fedwiki-import.js — wrap a directory of validated FedWiki page files
 * into ONE importer page for drag-and-drop bulk import.
 *
 * (Rebuild 2026-07-08, to the spec documented in the skill and confirmed
 * against Marc's TFO import format 0724FoothillsOutlook-v2.json and the
 * 26-page superior-eip-import.json.)
 *
 * Usage:
 *   node bundle-fedwiki-import.js <pagesDir> --out import.json --title "Import ..." [--exclude slug]...
 *
 * Each file in pagesDir must be a page JSON {title, story, journal}; the file
 * name (minus .json) becomes the slug key. Validate the directory first —
 * the bundle inherits the directory's correctness.
 *
 * Output shape:
 *   { title, story: [ {type:"paragraph", ...}, {type:"importer", pages:{slug: page}} ],
 *     journal: [ {type:"fork", date} ] }
 */

'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const argv = process.argv.slice(2);
if (argv.length === 0 || argv.includes('--help')) {
  console.error('Usage: bundle-fedwiki-import.js <pagesDir> --out import.json --title "Import ..." [--exclude slug]...');
  process.exit(argv.includes('--help') ? 0 : 1);
}
function flag(name, dflt) {
  const i = argv.indexOf(name);
  if (i === -1) return dflt;
  const v = argv[i + 1];
  if (v === undefined || v.startsWith('--')) { console.error(`ERROR: ${name} needs a value`); process.exit(1); }
  return v;
}
const excludes = new Set();
argv.forEach((a, i) => { if (a === '--exclude' && argv[i + 1]) excludes.add(argv[i + 1]); });
const flagVals = new Set([flag('--out', null), flag('--title', null), ...excludes].filter(Boolean));
const dir   = argv.find(a => !a.startsWith('--') && !flagVals.has(a));
const OUT   = flag('--out', 'import.json');
const TITLE = flag('--title', 'Import');
const newId = () => crypto.randomBytes(8).toString('hex');

if (!dir || !fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
  console.error(`ERROR: pagesDir "${dir}" is not a directory`); process.exit(1);
}

const pages = {};
for (const f of fs.readdirSync(dir).sort()) {
  if (!f.endsWith('.json')) continue;
  const slug = f.replace(/\.json$/, '');
  if (excludes.has(slug)) { console.error(`excluded ${slug}`); continue; }
  let p;
  try { p = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); }
  catch (e) { console.error(`ERROR: ${f}: ${e.message}`); process.exit(1); }
  if (typeof p.title !== 'string' || !Array.isArray(p.story) || !Array.isArray(p.journal)) {
    console.error(`ERROR: ${f} is not a page JSON (need title, story[], journal[])`); process.exit(1);
  }
  pages[slug] = p;
}
const n = Object.keys(pages).length;
if (n === 0) { console.error(`ERROR: no page files found in ${dir}`); process.exit(1); }

const bundle = {
  title: TITLE,
  story: [
    { type: 'paragraph', id: newId(),
      text: `Import of ${n} page${n === 1 ? '' : 's'}. The importer below offers each page; click to create it on this site.` },
    { type: 'importer', id: newId(), pages }
  ],
  journal: [{ type: 'fork', date: Date.now() }]
};
fs.writeFileSync(OUT, JSON.stringify(bundle, null, 2));
console.error(`wrote ${OUT} (${n} pages)`);
