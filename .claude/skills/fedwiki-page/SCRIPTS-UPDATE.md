# fedwiki-page scripts update (2026-07-08)

Three scripts, tested this session. If the full skill (from fedwiki-page-skill.tgz,
June 2026) is present, extract this over it — bundle-fedwiki-import.js is a faithful
rebuild of the same spec and may overwrite the original. If the full skill is absent
(e.g., on the MacBook Air), these three stand alone; only generate-fedwiki-pages.js
(diagram -> pages) and validate-fedwiki-pages.js are missing and live on the Mini.

- md-to-fedwiki-page.js — .md -> page JSON / importer bundle (FedWiki Format rules:
  one paragraph per item, unwrapped lines, headings own items, list one item,
  tables as labeled paragraphs by default, --tables html for grid data).
  node scripts/md-to-fedwiki-page.js a.md b.md --bundle import.json --bundle-title "Import X"
- export-fedwiki-page.js — page/bundle JSON -> md or html (--links text|wiki|anchor,
  --merge, --base). The exit ramp; outputs are NOT importable.
- bundle-fedwiki-import.js — directory of page JSONs -> one importer page.
  node scripts/bundle-fedwiki-import.js pagesDir --out import.json --title "Import X"

Round trip verified: md -> pages -> bundle -> (export back to md) on the 7-page
Chase rollup. Import format conforms to 0724FoothillsOutlook-v2.json / superior-eip-import.json.
