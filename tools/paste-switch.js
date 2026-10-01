#!/usr/bin/env node
'use strict';
/*
 * paste-switch.js — paste tools/rcn-switch.js into the four tools that share
 * it, between BEGIN/END marker lines, so each stays one complete file to
 * upload.
 *
 *   node tools/paste-switch.js
 *
 * Edit tools/rcn-switch.js, never the pasted blocks — this overwrites them. A
 * tool with no block yet gets one just before </head>. Writes only files whose
 * block is out of date, so running it is always safe.
 *
 * Marc Pierson with Claude Opus 5.5, Oct 2026.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(__dirname, 'rcn-switch.js');
const TARGETS = ['tools/graph-tool-v22.html', 'maps/rcn_map.html', 'tools/rcn-timeline.html', 'tools/rcn-table.html'];

const js = fs.readFileSync(SRC, 'utf8').replace(/<\/script/gi, '<\\/script');
const block =
  '<!-- BEGIN rcn-switch.js — pasted from tools/rcn-switch.js by tools/paste-switch.js. Edit tools/rcn-switch.js, never this block. -->\n' +
  '<script>\n' + js + '\n</script>\n' +
  '<!-- END rcn-switch.js -->';
const finder = /<!-- BEGIN rcn-switch\.js [\s\S]*?<!-- END rcn-switch\.js -->/;

for (const rel of TARGETS) {
  const file = path.join(ROOT, rel);
  const before = fs.readFileSync(file, 'utf8');
  let html;
  if (finder.test(before)) html = before.replace(finder, () => block);
  else if (/<\/head>/i.test(before)) html = before.replace(/<\/head>/i, () => block + '\n</head>');
  else { console.error('no </head> and no block in ' + rel + ' — add the block by hand once'); process.exitCode = 1; continue; }
  if (html === before) console.log('up to date   ' + rel);
  else { fs.writeFileSync(file, html); console.log('pasted into  ' + rel); }
}
