#!/usr/bin/env node
/**
 * fedwiki-lineup.js — turn a FedWiki lineup URL into an importer bundle.
 *
 * Usage:
 *   node fedwiki-lineup.js <lineup-url> [--out file.json] [--title "..."]
 *        [--shape bundle|export] [--journal full|fork|none]
 *        [--pages-dir <dir>] [--no-bundle] [--quiet]
 *
 * TWO OUTPUT SHAPES, because FedWiki has two and they are not interchangeable:
 *
 *   --shape bundle (default)  an importer PAGE:
 *       { title, story:[{type:"paragraph"}, {type:"importer", pages:{slug:page}}], journal }
 *     This is what export-fedwiki-page.js reads, and what bundle-fedwiki-import.js
 *     emits. It is a page — put it on a site as a page, or hand it to Claude.
 *
 *   --shape export            a bare site-export map:
 *       { slug: page, slug: page, ... }
 *     This is what /system/export.json returns and the ONLY shape the browser's
 *     drag-and-drop importer accepts. wiki-client's readFile() does
 *     JSON.parse(file) and treats every top-level key as a slug — drop a
 *     "bundle" on it and you get three junk entries named title/story/journal.
 *
 * The lineup is already in the address bar. FedWiki encodes it as strict
 * loc/slug pairs (confirmed against wiki-client's urlPages/urlLocs):
 *
 *   /view/welcome-visitors/view/some-page/other.site.org/their-page
 *    ^loc  ^slug           ^loc  ^slug    ^loc           ^slug
 *
 * loc is either "view" (a page on the URL's own origin) or a hostname
 * (a page federated in from that site).
 *
 * Local pages are fetched from   <origin>/<slug>.json
 * Remote pages from              <origin>/remote/<site>/<slug>.json
 *   (the origin server proxies these, so http/https and CORS are its problem)
 *   falling back to a direct https://<site>/<slug>.json then http://.
 *
 * Output is the same importer bundle shape bundle-fedwiki-import.js emits:
 *   { title, story: [ {type:"paragraph"}, {type:"importer", pages:{slug: page}} ],
 *     journal: [ {type:"fork", date}] }
 * which means export-fedwiki-page.js reads it without modification, and
 * dragging it onto a wiki page re-creates every page in the lineup.
 */

'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const argv = process.argv.slice(2);
if (argv.length === 0 || argv.includes('--help') || argv.includes('-h')) {
  console.error(`Usage: fedwiki-lineup.js <lineup-url> [options]

  --out <file>        output path (default lineup-<first-slug>.json)
  --shape <shape>     bundle | export      (default bundle)
                        bundle = importer page; read by export-fedwiki-page.js
                        export = bare {slug: page} map; the only shape the
                                 browser drag-and-drop importer accepts
  --title "..."       bundle page title (default "Lineup: <first page title>")
  --journal <mode>    full | fork | none   (default fork)
                        full = every journal entry, the page's whole history
                        fork = one fork entry recording where the page came from
                        none = empty journal
  --pages-dir <dir>   also write each page as <dir>/<slug>.json
  --no-bundle         write only --pages-dir, no bundle file
  --quiet             suppress the per-page report on stderr`);
  process.exit(argv.length === 0 ? 1 : 0);
}

function flag(name, dflt) {
  const i = argv.indexOf(name);
  if (i === -1) return dflt;
  const v = argv[i + 1];
  if (v === undefined || v.startsWith('--')) { console.error(`ERROR: ${name} needs a value`); process.exit(1); }
  return v;
}
const flagVals = new Set([flag('--out'), flag('--title'), flag('--journal'), flag('--pages-dir'), flag('--shape')].filter(Boolean));
const input     = argv.find(a => !a.startsWith('--') && !flagVals.has(a));
const JOURNAL   = flag('--journal', 'fork');
const SHAPE     = flag('--shape', 'bundle');
const PAGES_DIR = flag('--pages-dir', null);
const NO_BUNDLE = argv.includes('--no-bundle');
const QUIET     = argv.includes('--quiet');

if (!input) { console.error('ERROR: no lineup URL given'); process.exit(1); }
if (!['full', 'fork', 'none'].includes(JOURNAL)) { console.error('ERROR: --journal must be full, fork, or none'); process.exit(1); }
if (!['bundle', 'export'].includes(SHAPE)) { console.error('ERROR: --shape must be bundle or export'); process.exit(1); }
if (NO_BUNDLE && !PAGES_DIR) { console.error('ERROR: --no-bundle needs --pages-dir'); process.exit(1); }

const newId = () => crypto.randomBytes(8).toString('hex');
const log = (...a) => { if (!QUIET) console.error(...a); };

/* ---------- parse the lineup URL into [{site, slug}] ---------- */

let url;
try { url = new URL(input); }
catch { console.error(`ERROR: "${input}" is not a URL. Paste the whole address bar, in quotes.`); process.exit(1); }

const origin = url.origin;
const segs = url.pathname.split('/').filter(s => s !== '');
if (segs.length === 0) { console.error(`ERROR: ${origin} has no lineup in its path — that is a site root, not a lineup.`); process.exit(1); }
if (segs.length % 2 !== 0) console.error(`WARNING: odd number of path segments (${segs.length}); the last one is being ignored.`);

const refs = [];
for (let i = 0; i + 1 < segs.length; i += 2) {
  const loc = decodeURIComponent(segs[i]);
  const slug = decodeURIComponent(segs[i + 1]);
  const local = loc === 'view' || loc === 'origin' || loc === url.host;
  refs.push({ site: local ? null : loc, slug });
}
if (refs.length === 0) { console.error('ERROR: no loc/slug pairs found in the path.'); process.exit(1); }

/* ---------- fetch ---------- */

async function tryJson(u) {
  let res;
  try { res = await fetch(u, { redirect: 'follow' }); } catch (e) { return { err: e.message }; }
  if (!res.ok) return { err: `HTTP ${res.status}` };
  try { return { page: await res.json() }; } catch (e) { return { err: `bad JSON: ${e.message}` }; }
}

async function fetchPage(ref) {
  const attempts = ref.site
    ? [`${origin}/remote/${ref.site}/${ref.slug}.json`,
       `https://${ref.site}/${ref.slug}.json`,
       `http://${ref.site}/${ref.slug}.json`]
    : [`${origin}/${ref.slug}.json`];
  const errs = [];
  for (const u of attempts) {
    const { page, err } = await tryJson(u);
    if (page) return { page, from: u };
    errs.push(`${u} — ${err}`);
  }
  return { errs };
}

function isPage(p) {
  return p && typeof p.title === 'string' && Array.isArray(p.story);
}

function shapeJournal(page, ref) {
  const journal = Array.isArray(page.journal) ? page.journal : [];
  if (JOURNAL === 'full') return journal;
  if (JOURNAL === 'none') return [];
  const last = journal[journal.length - 1];
  return [{ type: 'fork', site: ref.site || url.host, date: (last && last.date) || Date.now() }];
}

(async () => {
  const pages = {};
  const failed = [];
  let firstTitle = null;

  for (const ref of refs) {
    const { page, from, errs } = await fetchPage(ref);
    if (!page) {
      failed.push({ ref, errs });
      log(`  MISSING  ${ref.site || 'local'}/${ref.slug}`);
      errs.forEach(e => log(`           ${e}`));
      continue;
    }
    if (!isPage(page)) {
      failed.push({ ref, errs: [`${from} — not a page (no title/story)`] });
      log(`  NOT A PAGE  ${ref.site || 'local'}/${ref.slug}`);
      continue;
    }

    let key = ref.slug;
    if (pages[key]) {
      const tag = (ref.site || url.host).split('.')[0];
      key = `${ref.slug}-${tag}`;
      let n = 2;
      while (pages[key]) key = `${ref.slug}-${tag}-${n++}`;
      log(`  NOTE     slug "${ref.slug}" seen twice; second copy keyed "${key}"`);
    }

    const journal = shapeJournal(page, ref);
    pages[key] = { title: page.title, story: page.story, journal };
    if (!firstTitle) firstTitle = page.title;

    const types = {};
    for (const it of page.story) types[it.type || 'paragraph'] = (types[it.type || 'paragraph'] || 0) + 1;
    const typeStr = Object.entries(types).map(([t, n]) => `${n} ${t}`).join(', ');
    log(`  ok       ${key.padEnd(28)} ${String(page.story.length).padStart(3)} items (${typeStr})` +
        (JOURNAL === 'full' ? `, ${journal.length} journal` : '') +
        (ref.site ? `  [from ${ref.site}]` : ''));
  }

  const n = Object.keys(pages).length;
  if (n === 0) { console.error('ERROR: nothing was fetched. Is the wiki running, and is the URL a lineup?'); process.exit(1); }

  if (PAGES_DIR) {
    fs.mkdirSync(PAGES_DIR, { recursive: true });
    for (const [slug, page] of Object.entries(pages)) {
      fs.writeFileSync(path.join(PAGES_DIR, `${slug}.json`), JSON.stringify(page, null, 2));
    }
    console.error(`wrote ${n} page file${n === 1 ? '' : 's'} to ${PAGES_DIR}/`);
  }

  if (!NO_BUNDLE) {
    const out = flag('--out', `lineup-${Object.keys(pages)[0]}.json`);
    let payload;
    if (SHAPE === 'export') {
      payload = pages;                       // bare {slug: page} — drag-and-drop shape
    } else {
      payload = {
        title: flag('--title', `Lineup: ${firstTitle}`),
        story: [
          { type: 'paragraph', id: newId(),
            text: `Lineup of ${n} page${n === 1 ? '' : 's'} captured from ${origin} on ${new Date().toISOString().slice(0, 10)}. The importer below offers each page; click to create it on this site.` },
          { type: 'importer', id: newId(), pages }
        ],
        journal: [{ type: 'fork', date: Date.now() }]
      };
    }
    fs.writeFileSync(out, JSON.stringify(payload, null, 2));
    console.error(`wrote ${out} (${n} pages, shape=${SHAPE}, journal=${JOURNAL})`);
    if (SHAPE === 'bundle') console.error(`  to drag onto a wiki instead, re-run with --shape export`);
  }

  if (failed.length) {
    console.error(`\n${failed.length} page${failed.length === 1 ? '' : 's'} could not be fetched:`);
    failed.forEach(f => console.error(`  ${f.ref.site || 'local'}/${f.ref.slug}`));
    console.error('Ghost pages (search results, neighbor pages never saved locally) have no JSON on any server —');
    console.error('open and fork them in the wiki first, or capture that lineup from the browser instead.');
  }
})();
