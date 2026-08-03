#!/usr/bin/env node
/**
 * patch-wiki-pagejson.js — teach an older local FedWiki to accept page-json
 * files on drag-and-drop, the way newer wiki-client already does.
 *
 *   node ~/rcn/tools/patch-wiki-pagejson.js            apply
 *   node ~/rcn/tools/patch-wiki-pagejson.js --check    report only
 *   node ~/rcn/tools/patch-wiki-pagejson.js --revert   restore the backups
 *
 * WHY: wiki-client's readFile() parses a dropped .json and hands every
 * top-level key to the importer as a slug. That is right for a site-export map
 * ({slug: page, …}) and wrong for a single page ({title, story, journal}),
 * which arrives as three junk entries named title, story, and journal.
 *
 * wiki-client 0.32 added a branch that detects a page and wraps it. This
 * back-ports exactly that branch to 0.23.2:
 *
 *     if (json.title && json.story && json.journal)
 *       json = { [asSlug(json.title)]: json }
 *
 * asSlug is inlined rather than imported, so the patch does not depend on any
 * minified internal name.
 *
 * NOTE: `npm i -g wiki` replaces these files and undoes this. Re-run then, or
 * upgrade properly and delete this script.
 */

'use strict';
const fs = require('fs');
const path = require('path');

const DIR = '/usr/local/lib/node_modules/wiki/node_modules/wiki-client/client';
const TARGETS = ['client.js', 'client.max.js'];
const MARK = 'RCN-PAGEJSON';

const CHECK = process.argv.includes('--check');
const REVERT = process.argv.includes('--revert');

/* The minified bundle and the readable one say the same thing differently, so
   each gets its own find/replace pair. Both are anchored on the unique
   "from an export file dated" string. */
const PATCHES = [
  {
    file: 'client.js',
    find: 't=JSON.parse(e),e=w();return e.setTitle("Import from ".concat(n.name)),e.addParagraph("Import of ".concat(Object.keys(t).length," pages\\n(").concat(r(n.size)," bytes)\\nfrom an export file dated ").concat(n.lastModifiedDate,"."))',
    repl: 't=JSON.parse(e),e=w();/*' + MARK + '*/var _pj=!!(t&&t.title&&t.story&&t.journal);if(_pj){var _s=String(t.title).replace(/\\s/g,"-").replace(/[^A-Za-z0-9-]/g,"").toLowerCase(),_o={};_o[_s]=t,t=_o}return e.setTitle("Import from ".concat(n.name)),e.addParagraph(_pj?"Import of one page\\n(".concat(r(n.size)," bytes)\\nfrom a page-json file dated ").concat(n.lastModifiedDate,"."):"Import of ".concat(Object.keys(t).length," pages\\n(").concat(r(n.size)," bytes)\\nfrom an export file dated ").concat(n.lastModifiedDate,"."))'
  },
  {
    file: 'client.max.js',
    find: `        result = e.target.result;
        pages = JSON.parse(result);
        resultPage = newPage();
        resultPage.setTitle("Import from ".concat(file.name));
        resultPage.addParagraph("Import of ".concat(Object.keys(pages).length, " pages\\n(").concat(commas(file.size), " bytes)\\nfrom an export file dated ").concat(file.lastModifiedDate, "."));`,
    repl: `        result = e.target.result;
        pages = JSON.parse(result);
        resultPage = newPage();
        resultPage.setTitle("Import from ".concat(file.name));
        /* ${MARK}: a single page, not an export map — wrap it under its slug */
        var isPageJson = !!(pages && pages.title && pages.story && pages.journal);

        if (isPageJson) {
          var pageSlug = String(pages.title).replace(/\\s/g, '-').replace(/[^A-Za-z0-9-]/g, '').toLowerCase();
          var wrapped = {};
          wrapped[pageSlug] = pages;
          pages = wrapped;
          resultPage.addParagraph("Import of one page\\n(".concat(commas(file.size), " bytes)\\nfrom a page-json file dated ").concat(file.lastModifiedDate, "."));
        } else {
          resultPage.addParagraph("Import of ".concat(Object.keys(pages).length, " pages\\n(").concat(commas(file.size), " bytes)\\nfrom an export file dated ").concat(file.lastModifiedDate, "."));
        }`
  }
];

function backupPath(f) { return path.join(DIR, f + '.pre-pagejson-bak'); }

if (!fs.existsSync(DIR)) {
  console.error(`ERROR: no wiki-client at ${DIR}`);
  console.error('Is the wiki installed globally? Adjust DIR in this script if it moved.');
  process.exit(1);
}

if (REVERT) {
  let n = 0;
  for (const f of TARGETS) {
    const bak = backupPath(f);
    if (!fs.existsSync(bak)) { console.error(`  no backup for ${f}`); continue; }
    fs.copyFileSync(bak, path.join(DIR, f));
    console.error(`  restored ${f}`);
    n++;
  }
  console.error(`reverted ${n} file${n === 1 ? '' : 's'} — restart the wiki, then hard-reload the browser`);
  process.exit(0);
}

let applied = 0, already = 0, failed = 0;
for (const p of PATCHES) {
  const full = path.join(DIR, p.file);
  if (!fs.existsSync(full)) { console.error(`  MISSING  ${p.file}`); failed++; continue; }
  const src = fs.readFileSync(full, 'utf8');

  if (src.includes(MARK)) { console.error(`  already  ${p.file}`); already++; continue; }
  if (!src.includes(p.find)) {
    console.error(`  NO MATCH ${p.file} — this wiki-client is not the version this patch was written for`);
    failed++; continue;
  }
  if (CHECK) { console.error(`  would patch ${p.file}`); continue; }

  if (!fs.existsSync(backupPath(p.file))) fs.copyFileSync(full, backupPath(p.file));
  fs.writeFileSync(full, src.replace(p.find, p.repl));
  console.error(`  patched  ${p.file}`);
  applied++;
}

if (failed) process.exit(1);
if (!CHECK && applied) console.error('done — restart the wiki, then hard-reload the browser (Cmd-Shift-R)');
if (already && !applied) console.error('nothing to do');
