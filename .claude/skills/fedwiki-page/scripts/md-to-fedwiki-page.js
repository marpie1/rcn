#!/usr/bin/env node
/**
 * md-to-fedwiki-page.js — the entrance ramp. Completes the round trip that
 * export-fedwiki-page.js exits: takes .md files, splits them by the FedWiki
 * Format rules, and emits page JSON (or one importer bundle) that drags
 * straight onto a wiki.
 *
 * FedWiki Format rules applied:
 *   - one paragraph per item, hard line-wraps UNWRAPPED (lines joined by spaces)
 *   - headings are their own items
 *   - a contiguous list is one item
 *   - fenced code blocks are one item, preserved verbatim
 *   - pipe tables: --tables rows (default) -> one labeled-paragraph item per row (per the FedWiki Format spec);
 *                  --tables html -> one "html" item (for genuinely grid-shaped data)
 *   - [[Wiki Links]] pass through untouched (they are native)
 *
 * Title: first H1 (removed from the story), else --title, else filename.
 * Titles are sanitized to slug-safe Title Case per the node-naming rule:
 * "&" -> "and", punctuation dropped, no parens/dashes surviving into slugs.
 *
 * Usage:
 *   node md-to-fedwiki-page.js <file.md> [more.md ...]
 *       [--title "Page Title"]           (single input only)
 *       [--out <dir>]                    (page files, named <slug>.json; default ./pages)
 *       [--bundle <file> --bundle-title "Import Title"]
 *                                        (wrap ALL inputs into one importer page)
 *       [--tables html|rows]
 *
 * Journal convention (per fedwiki-page skill): create, then one add per item,
 * ms dates, each add chained with "after".
 */

'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/* ---------- CLI ---------- */
const argv = process.argv.slice(2);
if (argv.length === 0 || argv.includes('--help')) usage(0);
function usage(code) {
  console.error('Usage: md-to-fedwiki-page.js <file.md> [...] [--title T] [--out dir] [--bundle file --bundle-title T] [--tables html|rows]');
  process.exit(code);
}
function flag(name, dflt) {
  const i = argv.indexOf(name);
  if (i === -1) return dflt;
  const v = argv[i + 1];
  if (v === undefined || v.startsWith('--')) { console.error(`ERROR: ${name} needs a value`); usage(1); }
  return v;
}
const flagVals = new Set(['--title', '--out', '--bundle', '--bundle-title', '--tables']
  .map(f => flag(f, null)).filter(Boolean));
const inputs = argv.filter(a => !a.startsWith('--') && !flagVals.has(a));
const TITLE   = flag('--title', null);
const OUTDIR  = flag('--out', './pages');
const BUNDLE  = flag('--bundle', null);
const BTITLE  = flag('--bundle-title', 'Import');
const TABLES  = flag('--tables', 'rows');

if (inputs.length === 0) { console.error('ERROR: no input .md files'); usage(1); }
if (TITLE && inputs.length > 1) { console.error('ERROR: --title only applies to a single input'); usage(1); }
if (!['html', 'rows'].includes(TABLES)) { console.error('ERROR: --tables must be html or rows'); usage(1); }

/* ---------- helpers ---------- */
const newId = () => crypto.randomBytes(8).toString('hex');           // 16 hex chars
const asSlug = t => String(t).replace(/\s+/g, '-').replace(/[^A-Za-z0-9-]/g, '').toLowerCase();

function sanitizeTitle(raw) {
  // slug-safe Title Case per the node-naming rule: & -> and; drop everything
  // that asSlug would strip so no words fuse and no double hyphens appear.
  let t = String(raw)
    .replace(/['’]/g, '').replace(/&/g, ' and ')
    .replace(/[—–:\/+%().,'"`*_\[\]{}!?;#]/g, ' ')
    .replace(/[^A-Za-z0-9 -]/g, ' ')
    .replace(/\s+/g, ' ').trim();
  t = t.split(' ').map(w => (w === w.toUpperCase() && w.length > 1) ? w   // keep acronyms (WHEN, SCP)
        : w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return t;
}
const escapeHtml = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ---------- md -> story items ---------- */
function mdToStory(md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const items = [];
  let i = 0;
  const isBlank   = l => /^\s*$/.test(l);
  const isHeading = l => /^#{1,6}\s+/.test(l);
  const isListLn  = l => /^\s*([-*+]|\d+[.)])\s+/.test(l);
  const isTableLn = l => /^\s*\|.*\|\s*$/.test(l);
  const isFence   = l => /^\s*```/.test(l);

  while (i < lines.length) {
    if (isBlank(lines[i])) { i++; continue; }

    if (isFence(lines[i])) {                       // fenced code block: one item, verbatim
      const buf = [lines[i++]];
      while (i < lines.length && !isFence(lines[i])) buf.push(lines[i++]);
      if (i < lines.length) buf.push(lines[i++]);  // closing fence
      items.push({ type: 'markdown', text: buf.join('\n') });
      continue;
    }
    if (isHeading(lines[i])) {                     // heading: its own item
      items.push({ type: 'markdown', text: lines[i++].trim() });
      continue;
    }
    if (isTableLn(lines[i])) {                     // pipe table
      const buf = [];
      while (i < lines.length && isTableLn(lines[i])) buf.push(lines[i++].trim());
      items.push(...tableItems(buf));
      continue;
    }
    if (isListLn(lines[i])) {                      // contiguous list: one item
      const raw = [];
      while (i < lines.length && (isListLn(lines[i]) || (/^\s+\S/.test(lines[i]) && !isBlank(lines[i])))) {
        raw.push(lines[i].replace(/\s+$/, '')); i++;
      }
      /* Two things the old version got wrong, both of which shipped
         hard-wrapped text into the wiki:
           - a bullet's continuation lines stayed on their own lines, so an
             80-column source wrapped in a 40-column wiki column;
           - every line was trimmed, which flattened nested bullets.
         Fold continuations onto their bullet; keep nesting relative to the
         first bullet's indent. */
      const baseIndent = (raw[0].match(/^\s*/) || [''])[0].length;
      const out = [];
      for (const l of raw) {
        if (isListLn(l)) {
          const indent = (l.match(/^\s*/) || [''])[0].length;
          out.push(' '.repeat(Math.max(0, indent - baseIndent)) + l.trim());
        } else if (out.length) {
          out[out.length - 1] += ' ' + l.trim();   // hard-wrapped continuation
        } else {
          out.push(l.trim());
        }
      }
      items.push({ type: 'markdown', text: out.join('\n') });
      continue;
    }
    // paragraph: contiguous prose lines, UNWRAPPED into one line
    const buf = [];
    while (i < lines.length && !isBlank(lines[i]) && !isHeading(lines[i]) &&
           !isListLn(lines[i]) && !isTableLn(lines[i]) && !isFence(lines[i])) {
      buf.push(lines[i].trim()); i++;
    }
    items.push({ type: 'markdown', text: buf.join(' ') });
  }
  return items;
}

function tableItems(rows) {
  const cells = r => r.replace(/^\||\|$/g, '').split('|').map(c => c.trim());
  const header = cells(rows[0]);
  const body = rows.slice(1).filter(r => !/^[\s|:-]+$/.test(r)).map(cells);
  if (TABLES === 'html') {
    const th = header.map(h => `<th>${escapeHtml(h)}</th>`).join('');
    const trs = body.map(r => `<tr>${r.map(c => `<td>${escapeHtml(c)}</td>`).join('')}</tr>`).join('\n');
    return [{ type: 'html', text: `<table>\n<tr>${th}</tr>\n${trs}\n</table>` }];
  }
  // rows mode: one labeled-paragraph item per body row (the FedWiki-native choice)
  return body.map(r => ({
    type: 'markdown',
    text: r.map((c, k) => `**${header[k] || `Col ${k + 1}`}:** ${c}`).join(' — ')
  }));
}

/* ---------- assemble page with journal (create, then add-per-item, chained) ---------- */
function buildPage(title, storyItems) {
  const t0 = Date.now();
  const story = storyItems.map(it => ({ ...it, id: newId() }));
  const journal = [{ type: 'create', item: { title, story: [] }, date: t0 }];
  let after;
  story.forEach((it, k) => {
    const act = { type: 'add', id: it.id, item: { type: it.type, id: it.id, text: it.text }, date: t0 + k + 1 };
    if (after) act.after = after;
    journal.push(act);
    after = it.id;
  });
  return { title, story, journal };
}

/* ---------- drive ---------- */
const pages = {};
for (const file of inputs) {
  let md;
  try { md = fs.readFileSync(file, 'utf8'); }
  catch (e) { console.error(`ERROR: cannot read ${file}: ${e.message}`); process.exit(1); }

  let items = mdToStory(md);
  let title = TITLE;
  /* A leading H1 always leaves the story — FedWiki renders the page title
     above the story, so keeping it would print the title twice. --title only
     decides what the title SAYS, not whether the H1 stays. */
  if (items.length && /^#\s+/.test(items[0].text)) {
    if (!title) title = items[0].text.replace(/^#\s+/, '');
    items = items.slice(1);
  }
  if (!title) title = path.basename(file, path.extname(file)).replace(/[-_]+/g, ' ');
  title = sanitizeTitle(title);

  if (!items.length) { console.error(`ERROR: ${file} produced an empty story`); process.exit(1); }
  const slug = asSlug(title);
  if (pages[slug]) { console.error(`ERROR: slug collision "${slug}" (from ${file})`); process.exit(1); }
  pages[slug] = buildPage(title, items);
  console.error(`${file} -> "${title}" (${slug}), ${items.length} items`);
}

if (BUNDLE) {
  const n = Object.keys(pages).length;
  const importer = {
    title: sanitizeTitle(BTITLE),
    story: [
      { type: 'paragraph', id: newId(),
        text: `Import of ${n} page${n === 1 ? '' : 's'}. The importer below offers each page; click to create it on this site.` },
      { type: 'importer', id: newId(), pages }
    ],
    journal: [{ type: 'fork', date: Date.now() }]
  };
  fs.writeFileSync(BUNDLE, JSON.stringify(importer, null, 2));
  console.error(`wrote ${BUNDLE} (${Object.keys(pages).length} pages)`);
} else {
  fs.mkdirSync(OUTDIR, { recursive: true });
  for (const [slug, page] of Object.entries(pages)) {
    const f = path.join(OUTDIR, `${slug}.json`);
    fs.writeFileSync(f, JSON.stringify(page, null, 2));
    console.error(`wrote ${f}`);
  }
}
