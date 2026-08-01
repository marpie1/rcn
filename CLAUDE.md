## Document file types

Before producing any document deliverable, ASK Marc once per session which format he wants: FedWiki Format, HTML, docx, PDF, or pipeline .md. Apply his answer for the rest of the session. Exception — do not ask for pipeline files that round-trip through Claude (extraction files, indexes, guides): those stay .md. Never default to .docx. RTF is never an option.

"FedWiki Format" means: page JSON (or an importer bundle for multiple pages) built with ~/rcn/.claude/skills/fedwiki-page/scripts/md-to-fedwiki-page.js — markdown story items, one paragraph per item, no hard line-wrapping, headings as their own items, a whole list as one item, tables as labeled paragraphs unless grid-shaped data needs an html item.

## Markdown house style — write every .md unwrapped

Default for ALL .md files, including pipeline files: **one line per paragraph, no hard line-wrapping.** Do not break prose at 80 columns. A paragraph is a single long line that reflows to whatever width it lands in — a narrow FedWiki column, a phone, a PDF. Same for each bullet in a list: one line per bullet.

Rendering is identical either way; the point is that unwrapped source ports to FedWiki with no reflow step and reads correctly at every width.

Keep normal markdown for everything else — real pipe tables, nested lists, fenced code. Do NOT pre-apply FedWiki's shaping to source files: turning tables into labeled paragraphs is the converter's job at publish time (--tables rows), and doing it by hand destroys grid data that a .md reader wants to scan.

The one cost is that git diffs a changed paragraph as a whole line. Use `git diff --word-diff=color` for prose, which reads better than line diffs anyway.

## Never bulk-edit gitignored files

Gitignored and untracked files are OFF LIMITS to any sweep, reformat, codemod, or other in-place bulk rewrite — `Chase/` is gitignored, and there are others. They have no committed baseline, so the change cannot be diffed, reviewed, or undone, and Marc has no way to check the work. Skip them and say which ones were skipped.

Editing such a file when Marc asks for that specific file is fine. The rule is about bulk operations, where a file is swept up as one of many rather than chosen.

`~/rcn/tools/unwrap-md.js` enforces this with `git check-ignore` and has no override flag.
