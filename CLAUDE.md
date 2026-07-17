## Document file types

Before producing any document deliverable, ASK Marc once per session which
format he wants: FedWiki Format, HTML, docx, PDF, or pipeline .md. Apply his
answer for the rest of the session. Exception — do not ask for pipeline files
that round-trip through Claude (extraction files, indexes, guides): those stay
.md. Never default to .docx. RTF is never an option.

"FedWiki Format" means: page JSON (or an importer bundle for multiple pages)
built with ~/rcn/.claude/skills/fedwiki-page/scripts/md-to-fedwiki-page.js —
markdown story items, one paragraph per item, no hard line-wrapping, headings
as their own items, a whole list as one item, tables as labeled paragraphs
unless grid-shaped data needs an html item.
