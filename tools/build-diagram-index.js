#!/usr/bin/env node
'use strict';
/*
 * build-diagram-index.js — the editing surface for every diagram in the repo.
 *
 *   node tools/build-diagram-index.js
 *
 * Scans tools/*.rcn.json, pairs each with its exported .svg if present, and
 * writes tools/diagrams.html: a contact sheet where every diagram has an Edit
 * button that opens graph-tool-v22.html?url=/tools/<name>.rcn.json with the
 * model already loaded.
 *
 * The point is that a diagram is never a dead picture. The convention is:
 *
 *     DIAGRAM_<name>  in a .md
 *     tools/<name>.rcn.json   the model, editable
 *     tools/<name>.svg        the export that gets injected into the page
 *
 * so the marker in the prose names the file, and this index makes the whole
 * set openable without anyone remembering a filename. Re-run it after adding
 * or renaming a diagram.
 */

const fs = require('fs');
const path = require('path');

const TOOLS = __dirname;
const OUT = path.join(TOOLS, 'diagrams.html');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const rows = fs.readdirSync(TOOLS)
  .filter(f => f.endsWith('.rcn.json'))
  .sort()
  .map(f => {
    const name = f.replace(/\.rcn\.json$/, '');
    const full = path.join(TOOLS, f);
    let m = {};
    try { m = JSON.parse(fs.readFileSync(full, 'utf8')); }
    catch (e) { return { name, broken: e.message }; }
    const svgPath = path.join(TOOLS, name + '.svg');
    const svg = fs.existsSync(svgPath) ? name + '.svg' : null;
    const usedIn = [];
    const docs = path.join(TOOLS, '..', 'docs');
    (function walk(dir) {
      if (!fs.existsSync(dir)) return;
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) walk(p);
        else if (e.name.endsWith('.md') && fs.readFileSync(p, 'utf8').includes('DIAGRAM_' + name))
          usedIn.push(path.relative(path.join(TOOLS, '..'), p));
      }
    })(docs);
    // Inline rather than <object>: the dev server serves .svg as text/plain, and an
    // <object> then renders the source as text. Inlining also means the index works
    // straight off the filesystem. Namespace every id — two exports in one page
    // otherwise collide on marker ids like mk000000 and steal each other's arrowheads.
    let inline = null;
    if (svg) {
      const ns = 'd' + Buffer.from(name).toString('hex').slice(0, 8) + '_';
      inline = fs.readFileSync(svgPath, 'utf8')
        .replace(/\sid="([^"]+)"/g, (_, v) => ` id="${ns}${v}"`)
        .replace(/url\(#([^)]+)\)/g, (_, v) => `url(#${ns}${v})`)
        .replace(/<svg /, '<svg preserveAspectRatio="xMidYMid meet" ')
        .replace(/\s(width|height)="[^"]*"/g, '');
    }
    return {
      name, svg, inline, usedIn,
      model: m.modelName || '(unnamed)',
      nodes: (m.nodes || []).length,
      edges: (m.edges || []).length,
      legend: (m.legendEntries || []).length,
      mtime: fs.statSync(full).mtime
    };
  });

const card = r => r.broken ? `
  <article class="c bad"><h2>${esc(r.name)}</h2><p class="err">will not parse — ${esc(r.broken)}</p></article>` : `
  <article class="c">
    <div class="thumb">${r.inline || `<div class="none">no .svg exported yet</div>`}</div>
    <h2>${esc(r.model)}</h2>
    <p class="meta"><code>${esc(r.name)}</code></p>
    <p class="meta">${r.nodes} nodes · ${r.edges} edges · ${r.legend} legend rows</p>
    ${r.usedIn.length ? `<p class="meta">used in ${r.usedIn.map(u => `<code>${esc(u)}</code>`).join(', ')}</p>` : `<p class="meta orphan">not referenced by any DIAGRAM_ marker</p>`}
    <p class="act">
      <a class="btn" href="graph-tool-v22.html?url=/tools/${esc(r.name)}.rcn.json">Edit in Graph Tool &#8599;</a>
      <a class="lnk" href="${esc(r.name)}.rcn.json">model JSON</a>
      ${r.svg ? `<a class="lnk" href="${esc(r.svg)}">svg</a>` : ''}
    </p>
  </article>`;

fs.writeFileSync(OUT, `<!doctype html>
<meta charset="utf-8"><title>RCN Diagrams</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
 :root{--ink:#1f2937;--mut:#6b7280;--line:#e5e7eb;--bg:#fcfcfb;--acc:#1d4ed8}
 body{margin:0;padding:28px;background:var(--bg);color:var(--ink);
      font:14px/1.5 system-ui,-apple-system,Segoe UI,sans-serif}
 h1{font-size:20px;margin:0 0 4px} .sub{color:var(--mut);margin:0 0 24px}
 .grid{display:grid;gap:18px;grid-template-columns:repeat(auto-fill,minmax(330px,1fr))}
 .c{border:1px solid var(--line);border-radius:10px;padding:14px;background:#fff}
 .c.bad{border-color:#b91c1c;background:#fdf2f2}
 .thumb{height:190px;border:1px solid var(--line);border-radius:6px;overflow:hidden;
        background:#fff;display:flex;align-items:center;justify-content:center;margin-bottom:10px}
 .thumb svg{width:100%;height:100%;pointer-events:none}
 .none{color:var(--mut);font-size:12px}
 h2{font-size:15px;margin:0 0 4px}
 .meta{margin:2px 0;color:var(--mut);font-size:12px}
 .meta.orphan{color:#b45309} .err{color:#b91c1c;font-size:12px}
 code{font:12px ui-monospace,SFMono-Regular,Menlo,monospace;background:#f3f4f6;padding:1px 4px;border-radius:3px}
 .act{margin:10px 0 0;display:flex;gap:10px;align-items:center;flex-wrap:wrap}
 .btn{background:var(--acc);color:#fff;text-decoration:none;padding:6px 11px;border-radius:6px;font-size:13px}
 .lnk{color:var(--mut);font-size:12px}
</style>
<h1>RCN Diagrams</h1>
<p class="sub">${rows.length} models in <code>tools/</code>. Every one opens in the Graph Tool with a click &mdash; the picture is never the only copy.
Regenerate with <code>node tools/build-diagram-index.js</code>.</p>
<div class="grid">${rows.map(card).join('')}</div>
`);

console.log(`wrote ${path.relative(process.cwd(), OUT)} — ${rows.length} diagrams`);
const orphan = rows.filter(r => !r.broken && !r.usedIn.length).length;
const nosvg = rows.filter(r => !r.broken && !r.svg).length;
if (orphan) console.log(`  ${orphan} not referenced by any DIAGRAM_ marker`);
if (nosvg) console.log(`  ${nosvg} with no exported .svg`);
rows.filter(r => r.broken).forEach(r => console.log(`  BROKEN ${r.name}: ${r.broken}`));
