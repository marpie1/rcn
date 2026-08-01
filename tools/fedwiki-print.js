#!/usr/bin/env node
/**
 * fedwiki-print.js — lineup URL in, printable document out. One command.
 *
 *   node ~/rcn/tools/fedwiki-print.js "<lineup-url>"          opens it, ready to print
 *   node ~/rcn/tools/fedwiki-print.js "<lineup-url>" --pdf     writes the PDF directly
 *   node ~/rcn/tools/fedwiki-print.js captured.json --pdf      same, from a saved file
 *
 * Replaces this three-step dance:
 *   node fedwiki-lineup.js "<url>" --out bundle.json
 *   node export-fedwiki-page.js bundle.json --to html --merge --links wiki --base <origin> --out x.html
 *   open x.html
 *
 * The --base for wiki links is derived from the URL you pass, so you never type it.
 *
 * Options:
 *   --pdf              produce a PDF with headless Chrome instead of opening HTML
 *   --out <file>       output path (default lineup-<slug>-<date>.html / .pdf)
 *   --links <mode>     text | wiki | anchor   (default: wiki for URLs, anchor for files)
 *   --journal full     include page history (default: fork only)
 *   --keep             keep the intermediate bundle .json next to the output
 *   --no-open          write the file but do not open it
 */

'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const argv = process.argv.slice(2);
if (argv.length === 0 || argv.includes('--help') || argv.includes('-h')) {
  console.error(`Usage: fedwiki-print.js <lineup-url | bundle.json> [--pdf] [--out file]
                          [--links text|wiki|anchor] [--journal full] [--keep] [--no-open]`);
  process.exit(argv.length === 0 ? 1 : 0);
}

function flag(name, dflt) {
  const i = argv.indexOf(name);
  if (i === -1) return dflt;
  const v = argv[i + 1];
  if (v === undefined || v.startsWith('--')) { console.error(`ERROR: ${name} needs a value`); process.exit(1); }
  return v;
}
const flagVals = new Set([flag('--out'), flag('--links'), flag('--journal')].filter(Boolean));
const input   = argv.find(a => !a.startsWith('--') && !flagVals.has(a));
const PDF     = argv.includes('--pdf');
const KEEP    = argv.includes('--keep');
const NO_OPEN = argv.includes('--no-open');
const JOURNAL = flag('--journal', 'fork');

if (!input) { console.error('ERROR: give a lineup URL or a captured .json file'); process.exit(1); }

const HERE = __dirname;
const SKILL = path.join(os.homedir(), 'rcn', '.claude', 'skills', 'fedwiki-page', 'scripts');
const LINEUP = path.join(HERE, 'fedwiki-lineup.js');
const EXPORT = path.join(SKILL, 'export-fedwiki-page.js');
for (const [p, what] of [[LINEUP, 'fedwiki-lineup.js'], [EXPORT, 'export-fedwiki-page.js']]) {
  if (!fs.existsSync(p)) { console.error(`ERROR: cannot find ${what} at ${p}`); process.exit(1); }
}

const isUrl = /^https?:\/\//i.test(input);
const stamp = new Date().toISOString().slice(0, 10);

/* ---------- step 1: get a bundle ---------- */

let bundlePath, base = '', stem;
if (isUrl) {
  const u = new URL(input);
  base = u.origin;
  const firstSlug = u.pathname.split('/').filter(Boolean)[1] || 'lineup';
  stem = `lineup-${firstSlug}-${stamp}`;
  bundlePath = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'fwprint-')), `${stem}.json`);
  console.error(`capturing ${input}`);
  run('node', [LINEUP, input, '--out', bundlePath, '--journal', JOURNAL]);
} else {
  if (!fs.existsSync(input)) { console.error(`ERROR: no such file: ${input}`); process.exit(1); }
  bundlePath = input;
  stem = path.basename(input).replace(/\.json$/i, '');
}

const LINKS = flag('--links', isUrl ? 'wiki' : 'anchor');

/* ---------- step 2: export to HTML ---------- */

const outFlag = flag('--out', null);
const htmlPath = PDF
  ? path.join(os.tmpdir(), `${stem}.html`)
  : (outFlag || path.resolve(`${stem}.html`));

const exportArgs = [EXPORT, bundlePath, '--to', 'html', '--merge', '--out', htmlPath, '--links', LINKS];
if (LINKS === 'wiki' || (LINKS === 'anchor' && base)) {
  if (!base && LINKS === 'wiki') {
    console.error('ERROR: --links wiki needs a wiki URL; pass a lineup URL, or use --links text');
    process.exit(1);
  }
  if (base) exportArgs.push('--base', base);
}
run('node', exportArgs);

/* ---------- step 3: PDF, or open ---------- */

if (PDF) {
  const pdfPath = outFlag || path.resolve(`${stem}.pdf`);
  const chrome = findChrome();
  if (!chrome) {
    console.error('ERROR: could not find Chrome for headless printing.');
    console.error(`The HTML is at ${htmlPath} — open it and print to PDF by hand.`);
    process.exit(1);
  }
  console.error('printing with headless Chrome');
  /* Chrome chatters on stderr about mach task policy and GPU; none of it matters here. */
  run(chrome, ['--headless', '--disable-gpu', '--no-pdf-header-footer',
               `--print-to-pdf=${pdfPath}`, `file://${htmlPath}`], 'ignore');
  if (!fs.existsSync(pdfPath)) { console.error('ERROR: Chrome produced no PDF'); process.exit(1); }
  console.error(`wrote ${pdfPath} (${(fs.statSync(pdfPath).size / 1024).toFixed(0)} KB)`);
  if (!NO_OPEN) openFile(pdfPath);
} else if (!NO_OPEN) {
  openFile(htmlPath);
  console.error('opened — press Cmd-P, then Save as PDF');
}

if (KEEP && isUrl) {
  const kept = path.resolve(`${stem}.json`);
  fs.copyFileSync(bundlePath, kept);
  console.error(`kept ${kept}`);
}

/* ---------- helpers ---------- */

function run(cmd, args, errMode) {
  try { execFileSync(cmd, args, { stdio: ['ignore', 'inherit', errMode || 'inherit'] }); }
  catch (e) { console.error(`ERROR: ${path.basename(cmd)} failed`); process.exit(e.status || 1); }
}

function findChrome() {
  const candidates = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'
  ];
  return candidates.find(p => fs.existsSync(p)) || null;
}

function openFile(p) {
  const opener = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
  try { execFileSync(opener, [p], { stdio: 'ignore' }); }
  catch { console.error(`(could not open automatically — the file is at ${p})`); }
}
