#!/usr/bin/env node
/**
 * pull-fedwiki.js — the return leg of the RCN document loop.
 *
 *   .md  ->  FedWiki  ->  edit and discuss  ->  .md  ->  FedWiki + HTML + PDF
 *                                          ^^^^^^^^
 *                                          this script
 *
 * Usage:
 *   node tools/pull-fedwiki.js <lineup-url>            review into docs/pathways/pulled
 *   node tools/pull-fedwiki.js <lineup-url> --apply    overwrite the .md sources
 *   node tools/pull-fedwiki.js <bundle.json>           skip the fetch, use a local bundle
 *
 *   --out <dir>       where the .md land (default docs/pathways/pulled)
 *   --src <dir>       .md to compare against  (default docs/pathways)
 *   --svg-dir <dir>   where repo SVGs live    (default tools)
 *
 * WHAT IT DOES, and why each step is here
 *
 * 1. Turns a lineup URL into a bundle with fedwiki-lineup.js. The lineup carries
 *    Marc's ordering and can cross sites, which a list of slugs cannot.
 *
 * 2. Swaps every html item holding an <svg> back to a DIAGRAM_<name> placeholder.
 *    Without this, export --to md passes html through raw and a 20KB diagram lands
 *    inside the markdown, making the source unreadable and undiffable.
 *
 *    Diagrams are identified by comparing their text content against the repo's
 *    SVGs, not by position. If a pulled diagram does not match anything, it is
 *    SAVED rather than dropped — an edited diagram must never be lost silently.
 *    If it matches but differs, that is reported: the wiki diagram has been edited
 *    and the .rcn.json in the repo is now stale.
 *
 * 3. Exports with --links keep, so [[Wiki Links]] survive. Every other mode is
 *    lossy in this direction; the default 'text' mode strips them to bare words.
 *
 * 4. Reports what changed against the current sources, and writes to a review
 *    directory unless --apply is given. Pulling should never silently overwrite
 *    work.
 */

'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

const REPO = path.resolve(__dirname, '..');
const SKILL = path.join(REPO, '.claude/skills/fedwiki-page/scripts');

const argv = process.argv.slice(2);
if (!argv.length || argv.includes('--help')) {
  console.error('Usage: pull-fedwiki.js <lineup-url|bundle.json> [--apply] [--out dir] [--src dir] [--svg-dir dir]');
  process.exit(argv.length ? 0 : 1);
}
const flag = (n, d) => { const i = argv.indexOf(n); return i >= 0 && argv[i + 1] ? argv[i + 1] : d; };
const APPLY  = argv.includes('--apply');
const SRC    = path.resolve(REPO, flag('--src', 'docs/pathways'));
const OUT    = path.resolve(REPO, flag('--out', APPLY ? 'docs/pathways' : 'docs/pathways/pulled'));
const SVGDIR = path.resolve(REPO, flag('--svg-dir', 'tools'));
const input  = argv.find(a => !a.startsWith('--') && a !== flag('--out') && a !== flag('--src') && a !== flag('--svg-dir'));

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pullfw-'));
const say = (...a) => console.log(...a);

/* ---------- 1. get a bundle ---------- */
let bundlePath;
if (/^https?:\/\//.test(input)) {
  bundlePath = path.join(tmp, 'lineup.json');
  say(`fetching lineup…`);
  execFileSync('node', [path.join(SVGDIR, 'fedwiki-lineup.js'), input, '--out', bundlePath, '--quiet'], { stdio: 'inherit' });
} else {
  bundlePath = path.resolve(input);
}
const bundle = JSON.parse(fs.readFileSync(bundlePath, 'utf8'));
const importer = (bundle.story || []).find(i => i.type === 'importer');
const pages = importer ? importer.pages : bundle;
const slugs = Object.keys(pages);
say(`pages in lineup: ${slugs.length}`);

/* ---------- 2. diagrams back to placeholders ---------- */
const textOf = s => (s.match(/>([^<>]+)</g) || []).map(x => x.slice(1, -1).trim()).filter(Boolean).sort().join('|');
const repoSvgs = fs.readdirSync(SVGDIR).filter(f => f.endsWith('.svg')).map(f => ({
  name: f.replace(/\.svg$/, ''),
  body: fs.readFileSync(path.join(SVGDIR, f), 'utf8')
})).map(o => ({ ...o, sig: new Set(textOf(o.body).split('|')) }));

function bestMatch(svg) {
  const mine = new Set(textOf(svg).split('|'));
  let best = null, bestScore = 0;
  for (const r of repoSvgs) {
    let hit = 0; for (const t of mine) if (r.sig.has(t)) hit++;
    const score = hit / Math.max(mine.size, r.sig.size, 1);
    if (score > bestScore) { bestScore = score; best = r; }
  }
  return { best, score: bestScore };
}

let swapped = 0, drifted = [], rescued = [];
for (const slug of slugs) {
  const page = pages[slug];
  (page.story || []).forEach((item, idx) => {
    if (item.type !== 'html' || !/<svg[\s>]/.test(item.text || '')) return;
    const svg = item.text;
    const { best, score } = bestMatch(svg);
    let name;
    if (best && score >= 0.6) {
      name = best.name;
      // normalise link form before comparing — repo copies carry absolute hrefs
      // Compare CONTENT, not presentation. The repo copy carries absolute hrefs and
      // explicit width/height for the HTML build; the wiki copy carries relative
      // hrefs and a percentage style. Neither difference means anyone edited it.
      const norm = s => s.replace(/href="[^"]*\/view\/([^"]+)"/g, 'href="/$1.html"')
                        .replace(/\s+(target|rel)="[^"]*"/g, '')
                        .replace(/<svg[^>]*>/, m => m.replace(/\s+(style|width|height)="[^"]*"/g, ''))
                        .replace(/\s+/g, ' ').trim();
      if (norm(svg) !== norm(best.body)) {
        const p = path.join(SVGDIR, `${name}.wiki.svg`);
        fs.writeFileSync(p, svg);
        drifted.push({ name, slug, saved: path.relative(REPO, p) });
      }
    } else {
      name = `${slug}-diagram-${idx}`;
      const p = path.join(SVGDIR, `${name}.pulled.svg`);
      fs.writeFileSync(p, svg);
      rescued.push({ name, slug, saved: path.relative(REPO, p), score: score.toFixed(2) });
    }
    page.story[idx] = { type: 'paragraph', id: item.id, text: `DIAGRAM_${name}` };
    swapped++;
  });
}
say(`diagrams swapped to placeholders: ${swapped}`);

const staged = path.join(tmp, 'staged.json');
fs.writeFileSync(staged, JSON.stringify(importer ? bundle : { title: 'pulled', story: [{ type: 'importer', pages }] }, null, 2));

/* ---------- 3. export to markdown, links intact ---------- */
fs.mkdirSync(OUT, { recursive: true });
// export-fedwiki-page treats a ONE-page bundle as a single page, where --out is a
// FILE rather than a directory. A lineup of one page is a perfectly ordinary thing
// to pull, so handle both shapes instead of crashing on EISDIR.
const outArg = slugs.length === 1 ? path.join(OUT, `${slugs[0]}.md`) : OUT;
execFileSync('node', [path.join(SKILL, 'export-fedwiki-page.js'), staged, '--to', 'md', '--links', 'keep', '--out', outArg], { stdio: 'pipe' });

/* ---------- 4. report ---------- */
const norm = s => s.replace(/\r/g, '').replace(/[ \t]+$/gm, '').trim();
const changed = [], added = [], same = [];
for (const slug of slugs) {
  const outFile = path.join(OUT, `${slug}.md`);
  if (!fs.existsSync(outFile)) continue;
  const srcFile = path.join(SRC, `${slug}.md`);
  if (!fs.existsSync(srcFile)) { added.push(slug); continue; }
  (norm(fs.readFileSync(outFile, 'utf8')) === norm(fs.readFileSync(srcFile, 'utf8')) ? same : changed).push(slug);
}
const gone = fs.existsSync(SRC)
  ? fs.readdirSync(SRC).filter(f => f.endsWith('.md')).map(f => f.slice(0, -3)).filter(s => !slugs.includes(s))
  : [];

say('');
say(`unchanged ${same.length}   changed ${changed.length}   new ${added.length}   not in lineup ${gone.length}`);
if (changed.length) say('  changed:      ' + changed.join(', '));
if (added.length)   say('  new:          ' + added.join(', '));
if (gone.length)    say('  not in lineup:' + gone.join(', ') + '   (still on disk — nothing deleted)');
if (drifted.length) {
  say('');
  say('DIAGRAMS EDITED ON THE WIKI — the .rcn.json in this repo is now stale:');
  drifted.forEach(d => say(`  ${d.name}  (on ${d.slug})  wiki version saved to ${d.saved}`));
}
if (rescued.length) {
  say('');
  say('UNRECOGNISED DIAGRAMS — saved rather than dropped:');
  rescued.forEach(r => say(`  ${r.saved}  (on ${r.slug}, best match ${r.score})`));
}
say('');
say(APPLY ? `applied to ${path.relative(REPO, SRC)}` : `written to ${path.relative(REPO, OUT)} — review, then re-run with --apply`);
fs.rmSync(tmp, { recursive: true, force: true });
