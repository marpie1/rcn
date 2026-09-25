# Kitchen Table Exercise — method package

The first RCN **method** rather than tool. Everything here is built so a person can do the exercise, and then host it for others, with no instructor and no contact with us.

## What is here

- `kitchen-table-import.json` — the FedWiki drop file. Fifteen pages: hub, intro, eleven step pages, notes sheet, manual. Drag onto a wiki.
- `src/*.md` — the markdown sources those pages are built from. Edit these, never the JSON.
- `kitchen-table-exercise.pptx` — the deck, which runs the exercise for a solo reader clicking through or for a host projecting it to a room where everyone works separately.
- `kitchen-table-exercise.pdf` — Keynote render of the deck, for printing or for handing to someone without PowerPoint. Regenerate or delete freely.
- The attribution step is not optional. Every generated page carries who wrote it, human and model; the stamper is idempotent so rerunning the pipeline refreshes the line rather than adding a second one.
- `fold.js` — turns the `PAGEFOLD` marker in the manual source into a real FedWiki pagefold item, which the markdown converter has no syntax for.

## Rebuilding

```
node ~/rcn/.claude/skills/fedwiki-page/scripts/md-to-fedwiki-page.js src/*.md --map kitchen-table-import.json
node fold.js kitchen-table-import.json
node ~/rcn/.claude/skills/fedwiki-page/scripts/fedwiki-attribution.js kitchen-table-import.json
python3 ~/rcn/docs/make_kitchen_table_pptx.py
```

The deck builder lives at `docs/make_kitchen_table_pptx.py` with the sixteen other deck builders, and writes back into this directory.

## The one rule when editing

The eleven step instructions are Marc's wording, tested on the people who have done this, and they are not to be improved. Everything around them — framing, debrief, hosting guidance — is ours and is open.

Nothing in the package may show a worked example. A worked example is a hint in written form: it tells the person what a good answer looks like, which puts a judge back in the room and converts the hour into a test. The deck's eleven step slides carry the instruction and nothing else for this reason, and the manual's debrief sits behind a pagefold for the same one.
