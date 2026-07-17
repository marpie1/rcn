#!/usr/bin/env node
/**
 * export-fedwiki-page.js — the reverse gear for the fedwiki-page skill.
 *
 * Takes FedWiki page JSON (or an importer bundle) and produces readable
 * documents. Zero dependencies; minimal markdown renderer inline.
 *
 * Usage:
 *   node export-fedwiki-page.js <page-or-bundle.json> --to md|html
 *       [--links text|wiki|anchor] [--base <wiki-url>]
 *       [--merge] [--out <file-or-dir>]
 *
 * Input:
 *   Single page:      {title, story:[...], journal:[...]}
 *   Importer bundle:  a page whose story contains {type:"importer", pages:{slug: pageJSON, ...}}
 *                     or a bare {type:"importer", pages:{...}} object.
 *
 * --to md     Join markdown items with blank lines. html items pass through raw.
 * --to html   Render each item, wrapped in <div class="item" id="<16-hex id>">
 *             so paragraph addressability survives export (#a3f9... jumps to it).
 *             Embedded stylesheet: light background, pure black text (RCN default).
 *
 * --links     What [[Wiki Links]] become:
 *   text      plain text (default) — for PDFs going to people who won't touch the wiki
 *   wiki      hyperlink to <base>/view/<slug> — requires --base
 *   anchor    (merge/bundle) internal anchor #page-<slug> when the target is in the
 *             bundle; falls back to wiki (if --base) or text otherwise
 *
 * --merge     Bundle only: one combined document, each page a section with
 *             id="page-<slug>". Order: if a page titled "Index" exists, its
 *             [[links]] set the order (index first); otherwise bundle key order.
 *
 * --out       Single page or --merge: output file (default stdout).
 *             Bundle without --merge: output directory (default ./export).
 *
 * Journals are ignored by design: this exports the document, not its history.
 */

'use strict';
const fs = require('fs');
const path = require('path');

/* ---------- CLI ---------- */
const argv = process.argv.slice(2);
if (argv.length === 0 || argv.includes('--help')) { usage(0); }
function usage(code) {
  console.error('Usage: export-fedwiki-page.js <page-or-bundle.json> --to md|html [--links text|wiki|anchor] [--base url] [--merge] [--out path]');
  process.exit(code);
}
function flag(name, dflt) {
  const i = argv.indexOf(name);
  if (i === -1) return dflt;
  const v = argv[i + 1];
  if (v === undefined || v.startsWith('--')) { console.error(`ERROR: ${name} needs a value`); usage(1); }
  return v;
}
const inputPath = argv.find(a => !a.startsWith('--') && a !== flag('--to') && a !== flag('--links') && a !== flag('--base') && a !== flag('--out'));
const TO    = flag('--to', null);
const LINKS = flag('--links', 'text');
const BASE  = (flag('--base', '') || '').replace(/\/+$/, '');
const MERGE = argv.includes('--merge');
const OUT   = flag('--out', null);

if (!inputPath) { console.error('ERROR: no input file given'); usage(1); }
if (!['md', 'html'].includes(TO)) { console.error('ERROR: --to must be md or html'); usage(1); }
if (!['text', 'wiki', 'anchor'].includes(LINKS)) { console.error('ERROR: --links must be text, wiki, or anchor'); usage(1); }
if (LINKS === 'wiki' && !BASE) { console.error('ERROR: --links wiki requires --base <wiki-url>'); usage(1); }

/* ---------- slug (identical transform to generate-fedwiki-pages.js) ---------- */
function asSlug(title) {
  return String(title).replace(/\s+/g, '-').replace(/[^A-Za-z0-9-]/g, '').toLowerCase();
}

/* ---------- load & validate ---------- */
let raw;
try { raw = JSON.parse(fs.readFileSync(inputPath, 'utf8')); }
catch (e) { console.error(`ERROR: cannot read/parse ${inputPath}: ${e.message}`); process.exit(1); }

function findImporterPages(obj) {
  if (obj && obj.type === 'importer' && obj.pages) return obj.pages;           // bare importer item
  if (obj && Array.isArray(obj.story)) {
    const item = obj.story.find(it => it && it.type === 'importer' && it.pages);
    if (item) return item.pages;                                               // importer page
  }
  return null;
}
function validatePage(p, name) {
  const errs = [];
  if (!p || typeof p !== 'object') errs.push('not an object');
  else {
    if (typeof p.title !== 'string' || !p.title.trim()) errs.push('missing/empty title');
    if (!Array.isArray(p.story)) errs.push('story is not an array');
    else p.story.forEach((it, i) => {
      if (!it || typeof it !== 'object') errs.push(`story[${i}] not an object`);
      else {
        if (!it.type) errs.push(`story[${i}] missing type`);
        if (!it.id || !/^[0-9a-f]{16}$/i.test(String(it.id))) errs.push(`story[${i}] missing/malformed 16-hex id`);
      }
    });
  }
  if (errs.length) { console.error(`ERROR in ${name}:\n  ${errs.join('\n  ')}`); process.exit(1); }
}

const bundlePages = findImporterPages(raw);
let pages; // [{slug, page}]
if (bundlePages) {
  pages = Object.entries(bundlePages).map(([slug, page]) => ({ slug, page }));
  pages.forEach(({ slug, page }) => validatePage(page, `bundle page "${slug}"`));
} else {
  validatePage(raw, path.basename(inputPath));
  pages = [{ slug: asSlug(raw.title), page: raw }];
}
const bundleSlugs = new Set(pages.map(p => p.slug));

/* ---------- ordering for --merge: Index page drives order if present ---------- */
function orderPages(list) {
  const idx = list.find(p => p.slug === 'index' || /(^|-)index$/.test(p.slug));
  if (!idx) return list;
  const linkOrder = [];
  for (const it of idx.page.story) {
    if (typeof it.text !== 'string') continue;
    for (const m of it.text.matchAll(/\[\[([^\]]+)\]\]/g)) linkOrder.push(asSlug(m[1]));
  }
  const rank = new Map(linkOrder.map((s, i) => [s, i]));
  const rest = list.filter(p => p !== idx)
    .sort((a, b) => (rank.has(a.slug) ? rank.get(a.slug) : 1e9) - (rank.has(b.slug) ? rank.get(b.slug) : 1e9));
  return [idx, ...rest];
}

/* ---------- wiki-link resolution ---------- */
function resolveWikiLinks(text, mode) {
  return text.replace(/\[\[([^\]]+)\]\]/g, (_, title) => {
    const slug = asSlug(title);
    if (mode === 'anchor' && bundleSlugs.has(slug)) return mdLink(title, `#page-${slug}`);
    if ((mode === 'anchor' && BASE) || mode === 'wiki') return mdLink(title, `${BASE}/view/${slug}`);
    return title; // text mode, or anchor with no in-bundle target and no base
  });
}
function mdLink(text, href) { return `[${text}](${href})`; }

/* ---------- minimal markdown renderer (headings, lists, para; inline b/i/code/links) ---------- */
function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function inlineHtml(s) {
  // protect code spans first
  const codes = [];
  s = s.replace(/`([^`]+)`/g, (_, c) => { codes.push(c); return `\u0000${codes.length - 1}\u0000`; });
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, h) => `<a href="${h}">${t}</a>`);
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|\W)\*([^*\n]+)\*(?=\W|$)/g, '$1<em>$2</em>');
  s = s.replace(/(^|\W)_([^_\n]+)_(?=\W|$)/g, '$1<em>$2</em>');
  s = s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${codes[+i]}</code>`);
  return s;
}
function mdItemToHtml(text) {
  const t = text.trim();
  const h = t.match(/^(#{1,6})\s+(.*)$/s);
  if (h) return `<h${h[1].length}>${inlineHtml(escapeHtml(h[2].trim()))}</h${h[1].length}>`;
  const lines = t.split('\n').map(l => l.trim()).filter(Boolean);
  const isUl = lines.every(l => /^[-*]\s+/.test(l));
  const isOl = lines.every(l => /^\d+[.)]\s+/.test(l));
  if (lines.length && (isUl || isOl)) {
    const tag = isUl ? 'ul' : 'ol';
    const lis = lines.map(l => `  <li>${inlineHtml(escapeHtml(l.replace(/^([-*]|\d+[.)])\s+/, '')))}</li>`).join('\n');
    return `<${tag}>\n${lis}\n</${tag}>`;
  }
  return `<p>${inlineHtml(escapeHtml(t))}</p>`;
}

/* ---------- per-page exporters ---------- */
function pageToMd(page, linkMode) {
  const parts = [`# ${page.title}`];
  for (const it of page.story) {
    if (it.type === 'markdown' && typeof it.text === 'string') parts.push(resolveWikiLinks(it.text, linkMode).trim());
    else if (it.type === 'html' && typeof it.text === 'string') parts.push(it.text.trim());
    else if (it.type === 'paragraph' && typeof it.text === 'string') parts.push(resolveWikiLinks(it.text, linkMode).trim());
    // other plugin types (importer, graph, image...) are skipped in md
  }
  return parts.join('\n\n') + '\n';
}
function pageToHtmlBody(page, linkMode, headingLevel) {
  const out = [`<h${headingLevel}>${escapeHtml(page.title)}</h${headingLevel}>`];
  for (const it of page.story) {
    let inner = null;
    if ((it.type === 'markdown' || it.type === 'paragraph') && typeof it.text === 'string')
      inner = mdItemToHtml(resolveWikiLinks(it.text, linkMode));
    else if (it.type === 'html' && typeof it.text === 'string')
      inner = it.text; // trusted: author-supplied html item
    if (inner !== null) out.push(`<div class="item" id="${it.id}">\n${inner}\n</div>`);
  }
  return out.join('\n');
}
const STYLE = `<style>
  body { background:#ffffff; color:#000000; font:16px/1.55 Georgia, 'Times New Roman', serif;
         max-width: 46em; margin: 2.5em auto; padding: 0 1em; }
  h1,h2,h3,h4,h5,h6 { font-family: Helvetica, Arial, sans-serif; color:#000000; line-height:1.25; }
  a { color:#000000; }
  code { font: 0.9em/1.4 Menlo, Consolas, monospace; background:#f4f4f4; padding:0 .25em; }
  table { border-collapse: collapse; } td, th { border:1px solid #000; padding:.3em .6em; }
  .item { margin: 0 0 1em 0; }
  .page-section { margin-bottom: 3em; }
  @media print { body { margin: 0 auto; } }
</style>`;
function htmlDoc(title, body) {
  return `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<title>${escapeHtml(title)}</title>\n${STYLE}\n</head>\n<body>\n${body}\n</body>\n</html>\n`;
}

/* ---------- drive ---------- */
function writeOut(file, content) { fs.writeFileSync(file, content); console.error(`wrote ${file}`); }

if (pages.length === 1 && !MERGE) {
  const { page } = pages[0];
  const doc = TO === 'md' ? pageToMd(page, LINKS) : htmlDoc(page.title, pageToHtmlBody(page, LINKS, 1));
  OUT ? writeOut(OUT, doc) : process.stdout.write(doc);
} else if (MERGE) {
  const ordered = orderPages(pages);
  const title = raw.title || path.basename(inputPath, '.json');
  let doc;
  if (TO === 'md') {
    doc = ordered.map(({ slug, page }) =>
      `<a id="page-${slug}"></a>\n\n${pageToMd(page, LINKS)}`).join('\n---\n\n');
  } else {
    const body = ordered.map(({ slug, page }) =>
      `<section class="page-section" id="page-${slug}">\n${pageToHtmlBody(page, LINKS, 2)}\n</section>`).join('\n');
    doc = htmlDoc(title, `<h1>${escapeHtml(title)}</h1>\n${body}`);
  }
  OUT ? writeOut(OUT, doc) : process.stdout.write(doc);
} else {
  const dir = OUT || './export';
  fs.mkdirSync(dir, { recursive: true });
  for (const { slug, page } of pages) {
    const doc = TO === 'md' ? pageToMd(page, LINKS) : htmlDoc(page.title, pageToHtmlBody(page, LINKS, 1));
    writeOut(path.join(dir, `${slug}.${TO}`), doc);
  }
}
