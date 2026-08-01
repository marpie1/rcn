#!/usr/bin/env node
/**
 * unwrap-md.js — put a markdown file into RCN house style: one line per
 * paragraph, one line per bullet, no hard wrapping at 80 columns.
 *
 *   node ~/rcn/tools/unwrap-md.js <file.md> [...]           rewrite in place
 *   node ~/rcn/tools/unwrap-md.js <file.md> [...] --dry     report, change nothing
 *   node ~/rcn/tools/unwrap-md.js <file.md> [...] --stdout  print, change nothing
 *
 * Rendering is unaffected — markdown joins wrapped lines anyway. The point is
 * that unwrapped source ports to FedWiki with no reflow step and reads
 * correctly at any width.
 *
 * What it must NOT touch, because joining these changes their meaning:
 *   - fenced code blocks (``` … ```), verbatim
 *   - 4-space / tab indented lines: those ARE code blocks in markdown, and a
 *     naive joiner turns a column layout or a shell command into prose
 *   - a line ending in two spaces or a backslash: that is a deliberate <br>
 *   - pipe tables, headings, HTML blocks, horizontal rules, setext underlines,
 *     reference link definitions ([tag]: url)
 *
 * Blockquotes and lists are folded like paragraphs but keep their markers and
 * their nesting.
 *
 * Gitignored files are skipped. Nothing without a committed baseline gets
 * rewritten in place — there would be no way to diff or undo it.
 */

'use strict';
const fs = require('fs');
const { execFileSync } = require('child_process');

/* Gitignored files are never swept. They have no committed baseline, so an
   in-place rewrite cannot be diffed, reviewed, or undone. Skipped, not
   overridable — edit those by hand if they need it. */
function isGitIgnored(file) {
  try {
    execFileSync('git', ['check-ignore', '-q', file], { stdio: 'ignore' });
    return true;
  } catch {
    return false;    // exit 1 = not ignored; also covers "not a git repo"
  }
}

const argv = process.argv.slice(2);
if (!argv.length || argv.includes('--help')) {
  console.error('Usage: unwrap-md.js <file.md> [...] [--dry] [--stdout]');
  process.exit(argv.length ? 0 : 1);
}
const DRY = argv.includes('--dry');
const STDOUT = argv.includes('--stdout');
const files = argv.filter(a => !a.startsWith('--'));

const isFence   = l => /^\s*(```|~~~)/.test(l);
const isBlank   = l => /^\s*$/.test(l);
const isHeading = l => /^\s{0,3}#{1,6}\s/.test(l);
const isTable   = l => /^\s*\|/.test(l);
const isHtml    = l => /^\s{0,3}</.test(l);
const isRule    = l => /^\s{0,3}([-*_]\s*){3,}$/.test(l);
const isSetext  = l => /^\s{0,3}(=+|-+)\s*$/.test(l);
const isRefDef  = l => /^\s{0,3}\[[^\]]+\]:\s+\S/.test(l);
const isIndentedCode = l => /^(\s{4,}|\t)\S/.test(l);
const isList    = l => /^\s*([-*+]|\d+[.)])\s+/.test(l);
const isQuote   = l => /^\s*>/.test(l);
/* a deliberate hard break — the line must end here */
const isHardBreak = l => /(\s{2,}|\\)$/.test(l) && l.trim().length > 0;

function unwrap(src) {
  const lines = src.split('\n');
  const out = [];
  let i = 0, inFence = false;

  const structural = l =>
    isBlank(l) || isHeading(l) || isTable(l) || isHtml(l) || isRule(l) ||
    isSetext(l) || isRefDef(l) || isIndentedCode(l) || isFence(l);

  while (i < lines.length) {
    const l = lines[i];

    if (isFence(l)) {                      // fenced code: verbatim, both fences
      out.push(l); i++; inFence = true;
      while (i < lines.length && inFence) {
        out.push(lines[i]);
        if (isFence(lines[i])) inFence = false;
        i++;
      }
      continue;
    }

    if (structural(l)) { out.push(l); i++; continue; }

    if (isList(l)) {
      /* A bullet's continuation is indented, and a nested bullet's continuation
         is indented FURTHER — often to exactly 4, which the bare indented-code
         test would claim. Inside a list, code needs 8 spaces, so only that deep
         counts as code here. */
      if (isHardBreak(l)) { out.push(l); i++; continue; }
      let acc = l.replace(/\s+$/, '');
      i++;
      while (i < lines.length && !isBlank(lines[i]) && !isList(lines[i]) &&
             !isFence(lines[i]) && !isHeading(lines[i]) && !isTable(lines[i]) &&
             !/^(\s{8,}|\t{2,})\S/.test(lines[i])) {
        const hard = isHardBreak(lines[i]);
        acc += ' ' + lines[i].trim(); i++;
        if (hard) break;
      }
      out.push(acc);
      continue;
    }

    if (isQuote(l)) {                      // fold a quote paragraph, keep the marker
      if (isHardBreak(l)) { out.push(l); i++; continue; }
      const marker = (l.match(/^\s*>+\s?/) || ['> '])[0];
      let acc = l.replace(/\s+$/, '');
      i++;
      while (i < lines.length && isQuote(lines[i]) &&
             lines[i].replace(/^\s*>+\s?/, '').trim() !== '') {
        const hard = isHardBreak(lines[i]);
        acc += ' ' + lines[i].replace(/^\s*>+\s?/, '').trim(); i++;
        if (hard) break;
      }
      out.push(acc);
      continue;
    }

    // plain paragraph: join until a blank line, a structural line, or a hard break
    if (isHardBreak(l)) { out.push(l); i++; continue; }
    let acc = l.replace(/\s+$/, '');
    i++;
    while (i < lines.length && !isBlank(lines[i]) && !structural(lines[i]) &&
           !isList(lines[i]) && !isQuote(lines[i])) {
      const hard = isHardBreak(lines[i]);
      acc += ' ' + lines[i].trim(); i++;
      if (hard) break;
    }
    out.push(acc);
  }

  return out.join('\n').replace(/\n{3,}/g, '\n\n');
}

let changed = 0, skippedIgnored = 0;
for (const f of files) {
  if (isGitIgnored(f)) {
    skippedIgnored++;
    console.error(`  SKIPPED    ${f.padEnd(52)} gitignored — no baseline to diff against`);
    continue;
  }

  let src;
  try { src = fs.readFileSync(f, 'utf8'); }
  catch (e) { console.error(`SKIP ${f}: ${e.message}`); continue; }

  const out = unwrap(src);
  const before = src.split('\n').length, after = out.split('\n').length;

  if (STDOUT) { process.stdout.write(out); continue; }
  if (out === src) { console.error(`  unchanged  ${f}`); continue; }

  changed++;
  console.error(`  ${DRY ? 'would fold' : 'folded   '}  ${f.padEnd(52)} ${before} -> ${after} lines`);
  if (!DRY) fs.writeFileSync(f, out);
}
console.error(`${DRY ? 'would change' : 'changed'} ${changed} file${changed === 1 ? '' : 's'}` +
  (skippedIgnored ? `, skipped ${skippedIgnored} gitignored` : ''));
