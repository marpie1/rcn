#!/usr/bin/env node
/**
 * build-lineup-bookmarklet.js — turn fedwiki-lineup-bookmarklet.js into
 * installable bookmarklets on an instruction page.
 *
 *   node ~/rcn/tools/build-lineup-bookmarklet.js
 *
 * Writes fedwiki-lineup-bookmarklet.html next to the source.
 *
 * No minifier: the source is URI-encoded whole, newlines and all. Minifying
 * bookmarklets by collapsing whitespace is how they get silently broken.
 */

'use strict';
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const SRC = path.join(dir, 'fedwiki-lineup-bookmarklet.js');
const OUT = path.join(dir, 'fedwiki-lineup-bookmarklet.html');

const PRINT_SRC = path.join(dir, 'fedwiki-print-bookmarklet.js');
const source = fs.readFileSync(SRC, 'utf8');
const printSource = fs.readFileSync(PRINT_SRC, 'utf8');

const variants = [
  { id: 'print', src: printSource, links: 'anchor',
    label: 'Print Lineup → PDF',
    blurb: 'No file, no terminal. Opens the lineup as one clean document — no wiki columns, no flags — and brings up the print dialog. Choose "Save as PDF".' },
  { id: 'bundle', src: source, shape: 'bundle', journal: 'fork',
    label: 'Capture Lineup → for Claude',
    blurb: 'The everyday one. Downloads the lineup as an importer bundle: hand the file to Claude Code, or run it through export-fedwiki-page.js to make a document.' },
  { id: 'import', src: source, shape: 'export', journal: 'fork',
    label: 'Capture Lineup → to import',
    blurb: 'Downloads the bare site-export shape. This is the only shape you can drag back onto a wiki to re-create the pages there.' },
  { id: 'history', src: source, shape: 'bundle', journal: 'full',
    label: 'Capture Lineup → with history',
    blurb: 'Same as the first, but keeps every journal entry — the full edit history of each page. Bigger files. Use it when the question is who changed what, when.' }
];

function bookmarklet(v) {
  /* Global replace, not string replace: String.replace(str, …) substitutes only
     the FIRST occurrence, which once silently patched a mention in a comment and
     shipped three identical, unconfigured bookmarklets. */
  const js = v.src
    .replace(/__SHAPE__/g, v.shape || '')
    .replace(/__JOURNAL__/g, v.journal || '')
    .replace(/__LINKS__/g, v.links || '');

  const left = js.match(/__[A-Z]+__/);
  if (left) { console.error(`ERROR: placeholder ${left[0]} survived substitution in "${v.label}"`); process.exit(1); }
  for (const [name, want] of [['SHAPE', v.shape], ['JOURNAL', v.journal], ['LINKS', v.links]]) {
    if (want && !js.includes(`var ${name} = '${want}'`)) {
      console.error(`ERROR: ${name} not set to "${want}" in "${v.label}"`); process.exit(1);
    }
  }
  if (js.includes('\u0000')) { console.error(`ERROR: NUL byte in "${v.label}" — browsers reject those`); process.exit(1); }
  return 'javascript:' + encodeURIComponent(js);
}

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const links = variants.map(v => `
    <div class="bm">
      <a class="button" href="${esc(bookmarklet(v))}">${esc(v.label)}</a>
      <p>${esc(v.blurb)}</p>
    </div>`).join('\n');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Capture a FedWiki Lineup — bookmarklets</title>
<style>
  :root { color-scheme: light dark; }
  body { font: 16px/1.6 system-ui, sans-serif; max-width: 44rem; margin: 2rem auto; padding: 0 1.25rem;
         background: #fff; color: #111; }
  @media (prefers-color-scheme: dark) { body { background: #17181a; color: #e8e8e8; } }
  h1 { font-size: 1.7rem; margin-bottom: .2rem; }
  h2 { font-size: 1.2rem; margin-top: 2.2rem; border-bottom: 1px solid #8884; padding-bottom: .25rem; }
  .lede { color: #666; margin-top: 0; }
  @media (prefers-color-scheme: dark) { .lede { color: #aaa; } }
  .bm { border: 1px solid #8884; border-radius: 8px; padding: 1rem 1.1rem; margin: 1rem 0; }
  .bm p { margin: .6rem 0 0; font-size: .94rem; }
  a.button { display: inline-block; background: #2b6cb0; color: #fff; text-decoration: none;
             padding: .5rem .95rem; border-radius: 6px; font-weight: 600; cursor: grab; }
  a.button:active { cursor: grabbing; }
  code, pre { font-family: ui-monospace, Menlo, monospace; font-size: .9em; }
  code { background: #8882; padding: .1em .35em; border-radius: 3px; }
  pre { background: #8881; padding: .8rem 1rem; border-radius: 6px; overflow-x: auto; }
  table { border-collapse: collapse; width: 100%; margin: 1rem 0; display: block; overflow-x: auto; }
  th, td { border: 1px solid #8884; padding: .45rem .6rem; text-align: left; vertical-align: top; font-size: .94rem; }
  th { background: #8881; }
  .warn { border-left: 4px solid #c80; background: #c8801a14; padding: .8rem 1rem; border-radius: 0 6px 6px 0; }
</style>
</head>
<body>

<h1>Capture a FedWiki Lineup</h1>
<p class="lede">Turn every page open in your wiki lineup into one thing: a PDF to hand someone, a file for Claude, or an import for another wiki. One click, no terminal.</p>

<h2>Install (once)</h2>
<p>Show your browser's bookmarks bar, then <strong>drag any button below onto it</strong>. Clicking the button does nothing useful — it has to become a bookmark.</p>
<ul>
  <li><strong>Chrome / Edge:</strong> <code>Ctrl+Shift+B</code> (<code>&#8984;+Shift+B</code> on Mac) shows the bar.</li>
  <li><strong>Safari:</strong> View &rarr; Show Favorites Bar. You may need Bookmarks &rarr; Edit Bookmarks to rename it afterwards.</li>
  <li><strong>Firefox:</strong> right-click the toolbar &rarr; Bookmarks Toolbar &rarr; Always Show.</li>
</ul>

<h2>The buttons</h2>
${links}

<h2>Use</h2>
<ol>
  <li>Open the pages you want in your wiki, in the order you want them. That is your lineup.</li>
  <li>Click the bookmarklet in your bookmarks bar.</li>
  <li>A green note appears at the top of the page saying what happened.</li>
</ol>
<p><strong>Print Lineup</strong> opens the document in a new tab and brings up the print dialog — choose "Save as PDF" as the destination. The three <strong>Capture</strong> buttons download a <code>.json</code> file named after the first page and today's date, e.g. <code>lineup-welcome-visitors-2026-08-01.json</code>.</p>

<h2>About the PDF</h2>
<p>The printed document is built from the page data, not from a screenshot of the wiki. So it has no columns, no flags, no twins, no search box — just the pages, one after another, in lineup order.</p>
<p><code>[[Wiki Links]]</code> to pages that are also in the lineup become internal jumps within the document; links to anything else point back at the live wiki.</p>
<p>Only text items are printed — markdown, paragraph, and html. Graphs, maps, images, and other plugin items are left out, because there is nothing sensible to put on paper for them.</p>
<div class="warn">
  If nothing opens, your browser blocked the pop-up. Allow pop-ups for the wiki's address and click again.
</div>

<h2>What it captures that a server-side tool cannot</h2>
<table>
  <tr><th>Situation</th><th>Captured?</th></tr>
  <tr><td>Edits you made while <em>not logged in</em></td><td>Yes. FedWiki keeps those in the browser's local storage and never sends them to the server, so nothing outside your browser can see them.</td></tr>
  <tr><td>Pages on a wiki that requires a login</td><td>Yes — it runs inside your logged-in session.</td></tr>
  <tr><td>Ghost pages (search results, neighbor pages never forked)</td><td>Yes — they are in the lineup, so they are in the page.</td></tr>
  <tr><td>A wiki on a private network, or one nobody else can reach</td><td>Yes — if your browser can open it, this can capture it.</td></tr>
  <tr><td>Pages from several different sites in one lineup</td><td>Yes — each keeps a note of the site it came from.</td></tr>
</table>
<p>One thing it does <strong>not</strong> catch: text still sitting in an open edit box. FedWiki files an edit when you click away from it, so close the editor before capturing.</p>
<p>If two pages share a slug, the second is renamed (<code>welcome-visitors-ward</code>) so neither is lost.</p>

<h2>Sending the file to Claude</h2>
<p>Attach the downloaded <code>.json</code> to your message, or say where it is:</p>
<pre>I've put the lineup at ~/Downloads/lineup-welcome-visitors-2026-08-01.json —
please read it and tell me ...</pre>
<p>If the wiki is one Claude can reach on its own (a public site, or one running on the same machine), you do not need any of this — just paste the lineup URL from the address bar.</p>

<h2>Importing onto another wiki</h2>
<p>Use the <strong>to import</strong> button, then drag the downloaded file onto a page in the destination wiki. It arrives as a list of pages; click each one to create it there.</p>
<div class="warn">
  <strong>The two shapes are not interchangeable.</strong> Only the <em>to import</em> file can be dragged onto a wiki. Dragging a <em>for Claude</em> file produces three meaningless entries called <code>title</code>, <code>story</code>, and <code>journal</code> — with no error message.
</div>

<h2>If nothing happens</h2>
<table>
  <tr><th>What you see</th><th>Why</th></tr>
  <tr><td>Red note: "Not a FedWiki page"</td><td>You clicked it on a non-wiki tab.</td></tr>
  <tr><td>Red note: "No pages found"</td><td>The lineup is empty. Open a page first.</td></tr>
  <tr><td>Nothing at all</td><td>Some browsers block <code>javascript:</code> bookmarklets when the bookmark is <em>typed</em> rather than dragged. Delete it and drag the button again.</td></tr>
  <tr><td>No download appears</td><td>Check the browser's download blocker — this creates a file locally, which some settings prompt about the first time.</td></tr>
</table>

<h2>Where this comes from</h2>
<p>Source: <code>~/rcn/tools/fedwiki-lineup-bookmarklet.js</code>. This page is generated — edit the source, then run <code>node ~/rcn/tools/build-lineup-bookmarklet.js</code>. Do not edit this HTML directly.</p>
<p>The command-line equivalent, for wikis a terminal can reach, is <code>~/rcn/tools/fedwiki-lineup.js</code> (see <code>~/rcn/docs/fedwiki-lineup.md</code>).</p>

</body>
</html>
`;

fs.writeFileSync(OUT, html);
console.error(`wrote ${OUT} (${variants.length} bookmarklets)`);
variants.forEach(v => {
  const len = bookmarklet(v).length;
  console.error(`  ${v.label.padEnd(32)} ${len} chars${len > 65000 ? '  WARNING: too long for some browsers' : ''}`);
});
