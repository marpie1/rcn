#!/usr/bin/env node
/**
 * fedwiki-attribution.js — stamp an attribution item onto every FedWiki page.
 *
 * Standing rule: every page JSON we generate carries who wrote it, human and
 * model, with the month it was drafted. Pages get forked and travel away from
 * the conversation that produced them, so the credit has to live on the page
 * rather than in a commit message.
 *
 * Adds a final markdown story item carrying `attribution: true`, and a matching
 * journal `add` so the page history stays coherent. Also sets `author` on the
 * journal `create` action, which is what a wiki shows in its own byline.
 *
 * Idempotent: a page that already has an item with `attribution: true` has that
 * item's text refreshed rather than a second one appended.
 *
 * Usage:
 *   node fedwiki-attribution.js <drop-file-or-page.json ...>
 *       [--human "Marc Pierson"]      who the work belongs to
 *       [--model "Claude Opus 5"]     which model drafted it
 *       [--date  "September 2026"]    defaults to the current month
 *       [--text  "..."]               full override of the line
 */
'use strict';
const fs = require('fs');

const argv = process.argv.slice(2);
const flag = (n, d) => { const i = argv.indexOf(n); return i === -1 ? d : argv[i + 1]; };
const files = argv.filter((a, i) => !a.startsWith('--') && !(i > 0 && argv[i - 1].startsWith('--')));
if (!files.length) { console.error('Usage: fedwiki-attribution.js <file.json ...> [--human H] [--model M] [--date D] [--text T]'); process.exit(1); }

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const now = new Date();
const human = flag('--human', 'Marc Pierson');
const model = flag('--model', 'Claude Opus 5');
const when  = flag('--date', MONTHS[now.getMonth()] + ' ' + now.getFullYear());
const line  = flag('--text', `*${human} and ${model} · ${when}*`);

function rid() { return require('crypto').randomBytes(8).toString('hex'); }

function stamp(page) {
  if (!page || !Array.isArray(page.story)) return 0;
  const existing = page.story.find(it => it && it.attribution === true);
  if (existing) { existing.text = line; return 0; }
  const item = { type: 'markdown', id: rid(), text: line, attribution: true };
  page.story.push(item);
  if (Array.isArray(page.journal)) {
    const last = page.journal[page.journal.length - 1];
    const act = { type: 'add', id: item.id, item, date: Date.now() };
    if (last && last.id) act.after = last.id;
    page.journal.push(act);
    const create = page.journal.find(j => j.type === 'create');
    if (create && !create.author) create.author = `${human} with ${model}`;
  }
  return 1;
}

let pages = 0, added = 0;
for (const f of files) {
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  const list = Array.isArray(j.story) ? [j] : Object.values(j);
  for (const p of list) { pages++; added += stamp(p); }
  fs.writeFileSync(f, JSON.stringify(j, null, 2));
}
console.log(`attribution: ${added} added, ${pages - added} refreshed or skipped, across ${pages} pages`);
console.log(`line: ${line}`);
