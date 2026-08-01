# fedwiki-lineup.js — capture a lineup as a file

`~/rcn/tools/fedwiki-lineup.js`

## What it is for

You have a lineup of open pages in FedWiki. You want that lineup as **one file** — to hand to Claude Code for analysis, to archive, to import onto another wiki, or to turn into a document for people who will never touch a wiki.

This script takes the lineup URL and produces a single JSON file holding every page's complete content. That file works in three directions:

- **Analysis** — hand it to Claude Code. Nothing is lost: item ids, item types, and full plugin data all survive.
- **Import** — carry the pages onto another wiki (`--shape export`, then drag).
- **Documents** — feed it to `export-fedwiki-page.js` for markdown or HTML (and PDF by printing the HTML).

## Two shapes — pick the right one

FedWiki has two importer-related shapes and **they are not interchangeable**:

| `--shape` | Structure | Who accepts it |
|---|---|---|
| `bundle` (default) | a page: `{title, story:[…,{type:"importer", pages:{slug:page}}], journal}` | `export-fedwiki-page.js`; Claude; placing on a site as a page |
| `export` | bare map: `{slug: page, slug: page, …}` | the browser's drag-and-drop importer — **only** this shape |

The browser importer is not a factory plugin. It is core wiki-client (`lib/importer.coffee`, bundled into `client.js`). It has no editor and never appears in the factory menu. It exists to render a *dropped file*: `readFile()` does `JSON.parse(file)` and treats **every top-level key as a slug**. That is the same shape `/system/export.json` returns.

So dropping a `bundle` file on a wiki produces three junk entries named `title`, `story`, and `journal`. If the file is going into a browser, use `--shape export`. If it is going to Claude or to `export-fedwiki-page.js`, use `bundle`.

## When you do NOT need it

If the wiki is reachable from the machine Claude Code is running on — localhost, or Wiki Café — **just paste Claude the lineup URL.** It fetches the pages itself. No file, no download, no step for you.

Use this script when you want a durable artifact: something to archive, import elsewhere, or turn into a document.

## What it cannot capture — use the bookmarklet instead

The script reads the **server**. Anything that exists only in your browser is invisible to it:

- **Edits made while not logged in.** FedWiki writes those to browser localStorage (`pageHandler.useLocalStorage()` is true whenever a `.login` element is present) and never sends them to the server.
- **Ghost pages.** Search results and neighbor pages you have never forked have no JSON anywhere. The script names them and continues.
- **Pages behind a login.** It has no session cookie.
- **Wikis this machine cannot route to.**

For all of these use `fedwiki-lineup-bookmarklet.js`, which runs inside the tab. Its output is byte-identical to this script's for pages both can see — verified by comparing item ids and journal dates from both paths.

## Invoking it

Copy the whole address bar out of the browser. **Quote it** — the shell will mangle it otherwise.

```bash
node ~/rcn/tools/fedwiki-lineup.js "http://localhost:3000/view/welcome-visitors/view/some-page"
```

Writes `lineup-<first-slug>.json` in the current directory.

### Options

Any reachable wiki works — localhost, Wiki Café, an NDC site, someone else's public wiki. The origin in the URL is simply where it fetches from:

```bash
node ~/rcn/tools/fedwiki-lineup.js "http://ward.asia.wiki.org/view/welcome-visitors/ward.bay.wiki.org/welcome-visitors"
```

| Option | Effect |
|---|---|
| `--out <file>` | Output path. Default `lineup-<first-slug>.json`. |
| `--shape bundle\|export` | See "Two shapes" above. Default `bundle`. |
| `--title "..."` | Bundle page title. Default `Lineup: <first page title>`. |
| `--journal full\|fork\|none` | How much page history to keep. Default `fork`. |
| `--pages-dir <dir>` | Also write each page as its own `<slug>.json`. |
| `--no-bundle` | Write only `--pages-dir`, no bundle. Requires `--pages-dir`. |
| `--quiet` | Suppress the per-page report. |

### Choosing `--journal`

| Mode | Keeps | Use when |
|---|---|---|
| `fork` (default) | One fork entry: which site, what date | Almost always. Provenance without the noise. |
| `full` | Every edit ever made to the page | You are asking about *history* — who changed what, when, how a page evolved. |
| `none` | Nothing | Clean slate for import onto a new site. |

Journals are bulky — a three-item page here carried seven journal entries. Ask for `full` when history is the question, not by habit.

### Examples

Straight capture for analysis:

```bash
node ~/rcn/tools/fedwiki-lineup.js "http://localhost:3000/view/a/view/b" --out ~/rcn/data/lineup.json
```

History included, because the question is how these pages evolved:

```bash
node ~/rcn/tools/fedwiki-lineup.js "$URL" --journal full --out evolution.json
```

Loose page files as well as the bundle, so pages can be edited individually and re-bundled later with `bundle-fedwiki-import.js`:

```bash
node ~/rcn/tools/fedwiki-lineup.js "$URL" --pages-dir ./pages --out bundle.json
```

## Reading the output

Per page, on stderr:

```
  ok       1-2                            3 items (3 markdown)
  ok       welcome-visitors               6 items (6 paragraph)  [from wiki.ralfbarkow.ch]
  MISSING  local/no-such-page-xyz
```

Failures are named and non-fatal — a lineup with one ghost page still produces a bundle of the rest.

If a slug appears twice from different sites, the second is re-keyed (`welcome-visitors-superior`) and a note is printed. Importer keys are slugs, so without this the second copy would silently overwrite the first.

## Making a document — the short way

```bash
node ~/rcn/tools/fedwiki-print.js "$URL"         # opens it, ready for Cmd-P
node ~/rcn/tools/fedwiki-print.js "$URL" --pdf   # writes the PDF directly
node ~/rcn/tools/fedwiki-print.js captured.json --pdf
```

One command replaces capture → export → open. The `--base` for wiki links is derived from the URL, so you never type it. `--pdf` drives headless Chrome; without it you get HTML and your own print dialog.

Other options: `--out <file>`, `--links text|wiki|anchor`, `--journal full`, `--keep` (keep the intermediate bundle), `--no-open`.

**With no terminal at all:** the *Print Lineup → PDF* bookmarklet does the same job from inside the browser — see `fedwiki-lineup-bookmarklet.html`.

## The long way, when you want the intermediate files

```bash
S=~/rcn/.claude/skills/fedwiki-page/scripts

# one markdown file, all pages, in Index order if the lineup has an Index page
node $S/export-fedwiki-page.js bundle.json --to md --merge --out lineup.md

# one HTML file, [[wiki links]] pointing back at the live wiki
node $S/export-fedwiki-page.js bundle.json --to html --merge \
     --links wiki --base http://localhost:3000 --out lineup.html

# separate files, one per page, into ./export/
node $S/export-fedwiki-page.js bundle.json --to md
```

`--links` controls what `[[Wiki Links]]` become: `text` (plain, for readers with no wiki access), `wiki` (hyperlink to the live page, needs `--base`), or `anchor` (jump within the merged document when the target is in the bundle, falling back to `wiki` or `text`).

For PDF: export to HTML, open it, print to PDF. The HTML wraps every item in `<div class="item" id="<item-id>">`, so paragraph-level addressability survives.

**The export script drops journals by design** — it exports the document, not its history. If you want history in a document, ask Claude to read the `--journal full` bundle and write it up.

## Importing onto another wiki

Capture with `--shape export`, then drag the file onto a FedWiki page in the browser:

```bash
node ~/rcn/tools/fedwiki-lineup.js "$URL" --shape export --out drop-me.json
```

It arrives as a ghost page holding an importer item that lists every page; click a page to create it on that site. This is how a lineup moves between wikis — Wiki Café to localhost, or out to an NDC site.

Dragging a `--shape bundle` file instead yields three junk entries named `title`, `story`, and `journal`. Wrong shape, no error message — just nonsense.

## Sharing with other people

The **script** needs Node and a copy of the file. Someone with both runs it exactly as documented here; there are no paths baked in and no dependencies. Anyone without Node cannot use it at all.

The **bookmarklet** (`~/rcn/tools/fedwiki-lineup-bookmarklet.js`) needs no install and no terminal — send someone `~/rcn/tools/fedwiki-lineup-bookmarklet.html` and they drag a button to their bookmarks bar. That is the form to hand to NDC sites. Rebuild that page with `node ~/rcn/tools/build-lineup-bookmarklet.js` after editing the source.

## How the lineup URL is parsed

FedWiki encodes the lineup as strict `loc/slug` pairs (this matches wiki-client's `urlPages`/`urlLocs`):

```
/view/welcome-visitors/view/some-page/other.site.org/their-page
 ^loc  ^slug           ^loc  ^slug    ^loc           ^slug
```

`loc` is either `view` — a page on the URL's own origin — or a hostname, meaning a page federated in from that site.

Local pages are fetched from `<origin>/<slug>.json`. Remote pages go through the origin server's proxy at `<origin>/remote/<site>/<slug>.json`, so http/https and CORS are the server's problem; if that fails the script tries the remote host directly.

## A note on the renderer

`export-fedwiki-page.js` used to require *every* line of an item to be a bullet before it would build a list, so the common "label line, then bullets" item — a `STATUS - COLOR` heading over its checkboxes — came out as one paragraph with the asterisks showing. It now splits an item into blocks, so one item can mix prose, lists, and `>` quotes. This changed a shared script; `git diff` on `.claude/skills/fedwiki-page/scripts/export-fedwiki-page.js` shows exactly what.

## Related

- `~/rcn/.claude/skills/fedwiki-page/scripts/bundle-fedwiki-import.js` — build a bundle from a *directory* of page files. Same output shape. Use it when pages come from authoring rather than from a live wiki.
- `~/rcn/.claude/skills/fedwiki-page/scripts/md-to-fedwiki-page.js` — markdown into page JSON, the authoring direction.
- `~/rcn/.claude/skills/fedwiki-page/scripts/export-fedwiki-page.js` — the reverse gear, page JSON or bundle out to md/html.
