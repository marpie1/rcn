# fedwiki-page scripts update (2026-07-08)

Three scripts, tested this session. If the full skill (from fedwiki-page-skill.tgz,
June 2026) is present, extract this over it — bundle-fedwiki-import.js is a faithful
rebuild of the same spec and may overwrite the original. If the full skill is absent
(e.g., on the MacBook Air), these three stand alone; only generate-fedwiki-pages.js
(diagram -> pages) and validate-fedwiki-pages.js are missing and live on the Mini.

- md-to-fedwiki-page.js — .md -> page JSON / importer bundle (FedWiki Format rules:
  one paragraph per item, unwrapped lines, headings own items, list one item,
  tables as labeled paragraphs by default, --tables html for grid data).
  node scripts/md-to-fedwiki-page.js a.md b.md --map import.json
- export-fedwiki-page.js — page/bundle JSON -> md or html (--links text|wiki|anchor,
  --merge, --base). The exit ramp; outputs are NOT importable.
- bundle-fedwiki-import.js — directory of page JSONs -> one drop file.
  node scripts/bundle-fedwiki-import.js pagesDir --out import.json --map

Round trip verified: md -> pages -> bundle -> (export back to md) on the 7-page
Chase rollup. Import format conforms to 0724FoothillsOutlook-v2.json / superior-eip-import.json.

## md-to-fedwiki-page.js — inline markup in `--tables html` cells (2026-08-12)

A FedWiki `html` item is rendered raw: the wiki runs no markdown over it and does not resolve `[[...]]`. The html-table path escaped cells and stopped there, so `**consists of**` reached the live page as literal asterisks. Caught on the first publish of "OPM Relations", not in review — html items look fine in the JSON.

Fixed with `inlineHtml()`, applied to every `<th>`/`<td>`: escape first, then convert `**bold**`, `__bold__`, `*em*`, `_em_`, `` `code` ``, `[text](url)`, and `[[Page]]` (to `<a class="internal" data-page-name="slug">`, which is what wiki-client binds clicks on). Escaping before conversion keeps markup a user actually typed — a literal `<b>` — escaped.

The em rule requires a boundary before the `*`/`_` and punctuation or end after it, so `snake_case_name` is not mangled. Tested against bold, em, code, wiki link, md link, literal `<b>` plus `&`, snake_case, and all three inline forms in one cell.

`--tables rows` (the default) is untouched and still emits markdown items with `**` intact — those are markdown items, and the wiki renders them.

## --map: the drop file is a flat {slug: page} map (2026-08-30)

Read `wiki-client/client/client.max.js` `readFile()` (line 1498) instead of trusting the note in memory. The drag-and-drop handler hands **every top-level key to the importer as a slug**, so the file it wants is a flat dictionary of slug to page — byte-for-byte what a site emits at `/system/export.json` (`wiki-server/lib/server.coffee:534`).

The importer-wrapper both scripts used to emit is itself a `{title, story, journal}` page. On a client without the page-json branch (wiki-client < 0.32, or 0.23.2 unpatched by `~/rcn/tools/patch-wiki-pagejson.js`) its three top-level keys are read as three slugs and it renders dead links named `title`, `story`, `journal`. Simulated against the real `readFile()` and `render()`; confirmed both ways.

So both scripts grew `--map`, emitting the flat form: `md-to-fedwiki-page.js --map <file>` (parallel to `--bundle <file>`) and `bundle-fedwiki-import.js --map` (a switch, since `--out` already names the file). Verified byte-identical to `~/rcn/tools/schemas/fedwiki-import-example.json`.

The wrapper is untouched and still opt-in, because it buys one real thing: the import index survives as a page others can pull from later. It now prints a stderr note saying what it costs, and `--map` with `--bundle` is an error rather than a silent pick.

Full spec, item types, and a drop-ready example: `~/rcn/tools/schemas/fedwiki-import.md`.
