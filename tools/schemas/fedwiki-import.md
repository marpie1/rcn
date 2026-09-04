# FedWiki page JSON, and the one file you drop on a site

The reference chat-Claude doesn't have, for writing FedWiki page JSON by hand and packaging a set of pages into one droppable file.

**Verified 2026-08-30 against two clients**, reading the code that actually runs in each:

- **Wiki Café live** — `wiki-client 0.33.0-rc.0` (build stamp Wed, 22 Jul 2026), fetched from `https://marc.relocalizecreativity.net/client.js`. This is the deployment target.
- **Local** — `wiki@0.27.0` / `wiki-client@0.23.2` at `/usr/local/lib/node_modules/wiki`: `client.max.js` `readFile()` (line 1498), the `importer` plugin's `emit`/`render`/`bind` (lines 1263–1305), `showResult()` (line 2242); plus `wiki-server/lib/server.coffee:534`, the `/system/export.json` route.

**The drop path is identical in both.** `readFile()`'s two branches, the importer's `render`/`bind`, and `showResult()`'s `.addClass("ghost")` are logically unchanged across the ten minor versions. Everything below holds on both. When the wiki is upgraded this file is wrong until someone re-derives it.

A working example ships beside this file: **[fedwiki-import-example.json](fedwiki-import-example.json)** — three cross-linked pages, every item type below, drop-ready.

---

## 1. The shape of a page

A FedWiki page is three keys. Nothing else is required and nothing else is read.

```json
{
  "title": "Rain Garden Guide",
  "story": [ { "type": "markdown", "id": "9f2c1a04b7de3315", "text": "..." } ],
  "journal": [
    { "type": "create", "item": { "title": "Rain Garden Guide", "story": [] }, "date": 1788130000000 },
    { "type": "add", "id": "9f2c1a04b7de3315",
      "item": { "type": "markdown", "id": "9f2c1a04b7de3315", "text": "..." },
      "date": 1788130000001 }
  ]
}
```

**`story`** is what renders — an ordered array of items, top to bottom.

**`journal`** is the page's history. It is not decoration: the wiki reads it for provenance, for the fork/compare machinery, and for the "from N revisions" line the importer prints. Build it as one `create` action with an **empty** story, then one `add` action per story item, each `add` carrying a full copy of its item.

**`title`** is rendered above the story by the wiki itself. Do not repeat it as a story item — an H1 at the top of the page prints the title twice. The converter strips a leading `#` heading for exactly this reason.

### IDs

Sixteen lowercase hex characters. `crypto.randomBytes(8).toString('hex')`. Never a UUID, never sequential, never reused across two items. The `id` in a story item and the `id` on its `add` action (and on the `add`'s nested `item`) must be the same string.

### Slug

Lowercase, hyphens, digits. This is the wiki's own function, byte-identical in wiki-client 0.23.2 and 0.33.0-rc.0 — copy it, don't approximate it:

```js
const asSlug = t => String(t).replace(/\s/g, '-').replace(/[^A-Za-z0-9-]/g, '').toLowerCase();
```

"Rain Garden Guide" → `rain-garden-guide`.

Two traps in that one line:

**`/\s/g`, not `/\s+/g`.** Each whitespace character becomes its own hyphen; runs are not collapsed. "Health.  Money" — two spaces after the period, the way many people type — slugs to `health--money`, not `health-money`. If you write the obvious slug key by hand you get a page whose inbound `[[links]]` point somewhere else.

**Characters are dropped, not replaced.** "Health & Money" → `health--money` (the `&` vanishes, both spaces stay); "Plan (v2)" → `plan-v2`.

Both traps disappear if you sanitize the *title* first — collapse whitespace runs to one space, turn `&` into "and", drop parentheses, colons, slashes and em dashes — and only then slug it. Do that and the title reads well, the slug is clean, and no two words fuse. `[[Wiki Links]]` resolve by slugging the link text, so a title that slugs badly is a title whose inbound links break.

### Chaining `add` actions

Each `add` after the first may carry `"after": "<id of the previous item>"`. It records insertion order. Harmless to include, harmless to omit; the converter includes it.

---

## 2. Item types

### `markdown` — the default

One paragraph per item. **Never hard-wrap.** A story item's text is a single long line that reflows into whatever column width the reader has. A line break inside an item's text is a break the reader sees at every width, on a phone as well as a desktop.

```json
{ "type": "markdown", "id": "9f2c1a04b7de3315", "text": "A rain garden is a shallow planted depression that takes roof and driveway runoff and lets it soak in instead of running to the storm drain." }
```

Rules for splitting a document into items:

- **Every heading is its own item.** `{"type":"markdown","text":"## Why it works"}` — alone, nothing else in it.
- **Every paragraph is its own item.** Items are the unit a reader drags, forks, and comments on; a five-paragraph blob is one indivisible lump.
- **A whole list is one item** — all its bullets, newline-separated, inside one `text`. Splitting bullets into items breaks the list markup.
- **A fenced code block is one item**, verbatim, fences included.

Inline `**bold**`, `*em*`, `` `code` ``, `[text](url)` and `[[Wiki Links]]` all work, because the wiki runs markdown over the item.

`wiki-plugin-markdown` ships bundled with the `wiki` package, so `markdown` is safe on any normal site. Confirmed present on Wiki Café's `/system/plugins.json` (2026-08-30) along with `paragraph`, `html`, `reference` and `rcngraph`. The `importer` type needs no server plugin — it is built into wiki-client.

### `paragraph` — the core fallback

Identical fields; older and simpler. It renders text with `[[Wiki Links]]` but **no markdown** — `**bold**` reaches the page as literal asterisks. Use `paragraph` only for a site you know is stripped down, or when the text has no inline markup at all.

### `html` — raw, and dangerous in one specific way

```json
{ "type": "html", "id": "1c4e77aa90b8d2f6", "text": "<table>\n<tr><th>Roof area</th><th>0.5 in/hr</th></tr>\n<tr><td>400 sq ft</td><td>40</td></tr>\n</table>" }
```

**An `html` item is injected raw.** The wiki runs no markdown over it and does not resolve `[[...]]`. Anything inline inside it must already be a tag or it shows up on the live page as literal asterisks and brackets. This is invisible in review — the JSON looks fine; only the rendered page is wrong.

So inside an `html` item, hand-build the inline markup:

| You want | Write |
| --- | --- |
| bold | `<strong>text</strong>` |
| emphasis | `<em>text</em>` |
| code | `<code>text</code>` |
| external link | `<a href="URL" rel="noopener" target="_blank">text</a>` |
| wiki link | `<a class="internal" href="/some-slug.html" data-page-name="some-slug" title="local">Some Slug</a>` |

The `data-page-name` attribute is the one that matters — wiki-client binds its click handler on that, not on the href.

Escape `&`, `<`, `>` in the cell content **first**, then build the tags, so a literal `<b>` the author typed stays literal.

### Tables: two paths, and the default is not the obvious one

**Default — `rows`.** A table becomes one labeled-paragraph `markdown` item per body row:

```
**Step:** Excavate — **What you do:** Flat bottom, not a bowl — **What goes wrong:** A bowl concentrates flow in the middle
```

This is the FedWiki-native choice and it is right most of the time. FedWiki columns are narrow; a six-column table is unreadable in one. More to the point, each row becomes a draggable, forkable, separately-editable item — which is the whole affordance FedWiki exists to offer, and an HTML table has none of it.

**`html` only when the data is genuinely grid-shaped** — a lookup table you read down a column and across a row, where the grid *is* the information. A sizing matrix qualifies. A two-column list of terms and definitions does not.

### Plugin items

Some plugins store state well beyond `text` — `rcngraph` carries `graphJSON` and `svgString`, the SCP plugins carry typed fields. **Copy such an item verbatim, every key, into both the story and its journal `add`.** Never reconstruct plugin state by hand and never strip a key you don't recognize. Source it from a live page (`~/.wiki/<site>/pages/<slug>`, no `.json` extension) or from a file the tool exported.

The plugin type name is the npm package name minus `wiki-plugin-`, and it is one word: `rcngraph`, not `rcn-graph`.

---

## 3. Packaging a set of pages into one file

### The drop file is a flat map of slug to page

This is the important part, and it is not what you would guess.

When you drop a `.json` on a FedWiki lineup, `readFile()` parses it and hands **every top-level key to the importer as a slug**. So the file it wants is a flat dictionary:

```json
{
  "rain-garden-guide":    { "title": "Rain Garden Guide",    "story": [...], "journal": [...] },
  "rain-garden-plants":   { "title": "Rain Garden Plants",   "story": [...], "journal": [...] },
  "rain-garden-failures": { "title": "Rain Garden Failures", "story": [...], "journal": [...] }
}
```

No wrapper, no title, no story, no journal at the top level. Just slugs pointing at pages.

That is byte-for-byte the format a FedWiki site emits at `/system/export.json` (`server.coffee:534` builds exactly this dictionary), which is why the drop handler expects it. **Round-tripping a site's own export is the thing this file format was built for**, and a hand-authored set that matches it inherits every guarantee.

### What happens when you drop it

1. The client builds a **ghost page** titled "Import from `<filename>`" and puts it at the end of your lineup. Nothing has been written to the site yet.
2. That ghost holds an `importer` item listing one link per slug, each with its revision count.
3. **Click a slug.** `bind()` calls `showResult()`, which opens *that page* as another ghost in the lineup — still nothing written.
4. **Fork it.** That is the write. The page now exists on the site.
5. Back up the lineup, click the next slug, fork. Repeat.

Shift-click a slug to open it without collapsing the lineup back to the importer, which is easier when you are importing a dozen.

### The `importer`-wrapper form, and why it is not the default

There is a second shape — a page whose story holds an `importer` item:

```json
{
  "title": "Import Rain Garden Set",
  "story": [
    { "type": "paragraph", "id": "<hex>", "text": "Import of 3 pages. The importer below offers each page; click to create it on this site." },
    { "type": "importer", "id": "<hex>", "pages": { "slug-one": {...}, "slug-two": {...} } }
  ],
  "journal": [ { "type": "fork", "date": 1788130000000 } ]
}
```

**Dropping this file is not equivalent, and on a stock client it is broken.** It is itself a `{title, story, journal}` page, so `readFile()` reads its three top-level keys as three slugs, and the importer renders three dead links named `title`, `story`, and `journal`. Simulated against the real `readFile()` and `render()`: unpatched, that is exactly what you get.

Newer wiki-client added a branch that detects a page-shaped file and wraps it under its own slug. **Wiki Café's 0.33.0-rc.0 has it natively** (confirmed in the live bundle), and Marc's local 0.23.2 has it back-ported by `tools/patch-wiki-pagejson.js`. With the branch present, dropping the wrapper *works* but costs an extra level: import the wrapper page, open it, then click and fork each page from the importer item inside it.

So on Wiki Café specifically both shapes function today. The flat map is still the better default: it is one level instead of two, and it does not depend on a client-version feature that a different federation member's site may not have.

**Use the flat map** when you want to drop a file and fork pages out of it — the case in this section.

**Use the wrapper** only when you want the import index to survive as a real page on the site, so someone else can come back to it later and pull pages from it. That durability is the only thing it buys, and it costs a client-version dependency plus a hop.

### Single page: no wrapper at all

One page is just the page — `{title, story, journal}`, on its own. FedWiki wraps it in a one-click import dialog itself. Wrapping one page in either multi-page form turns a one-click import into a two-step one.

---

## 4. Worked example

`docs/rain-garden-guide.md`, in house style — one line per paragraph, one line per bullet, no hard wrapping:

```markdown
# Rain Garden Guide

A rain garden is a shallow planted depression that takes roof and driveway runoff and lets it soak in instead of running to the storm drain. It is the cheapest piece of green stormwater infrastructure a household can build, and the one most likely to be built wrong.

## Why it works

The three numbers that decide whether it works:

- **Infiltration rate** — measured, not assumed. Dig a test hole, fill it, time the drop.
- **Sizing ratio** — garden area as a fraction of the impervious area draining to it.
- **Ponding depth** — six to nine inches. Deeper looks efficient and drowns the plants.

See also [[Rain Garden Plants]] and [[Rain Garden Failures]].
```

becomes, for the `rain-garden-guide` key of the drop file:

```json
{
  "title": "Rain Garden Guide",
  "story": [
    { "type": "markdown", "id": "6d1f83b2c40a97e5", "text": "A rain garden is a shallow planted depression that takes roof and driveway runoff and lets it soak in instead of running to the storm drain. It is the cheapest piece of green stormwater infrastructure a household can build, and the one most likely to be built wrong." },
    { "type": "markdown", "id": "a07c55e9138bd642", "text": "## Why it works" },
    { "type": "markdown", "id": "3be24f0a7c9d1508", "text": "The three numbers that decide whether it works:" },
    { "type": "markdown", "id": "e5920c7714af3bd6", "text": "- **Infiltration rate** — measured, not assumed. Dig a test hole, fill it, time the drop.\n- **Sizing ratio** — garden area as a fraction of the impervious area draining to it.\n- **Ponding depth** — six to nine inches. Deeper looks efficient and drowns the plants." },
    { "type": "markdown", "id": "0cf4a861de23b79c", "text": "See also [[Rain Garden Plants]] and [[Rain Garden Failures]]." }
  ],
  "journal": [
    { "type": "create", "item": { "title": "Rain Garden Guide", "story": [] }, "date": 1788130000000 },
    { "type": "add", "id": "6d1f83b2c40a97e5", "item": { "type": "markdown", "id": "6d1f83b2c40a97e5", "text": "A rain garden is a shallow planted depression that takes roof and driveway runoff and lets it soak in instead of running to the storm drain. It is the cheapest piece of green stormwater infrastructure a household can build, and the one most likely to be built wrong." }, "date": 1788130000001 },
    { "type": "add", "id": "a07c55e9138bd642", "after": "6d1f83b2c40a97e5", "item": { "type": "markdown", "id": "a07c55e9138bd642", "text": "## Why it works" }, "date": 1788130000002 },
    { "type": "add", "id": "3be24f0a7c9d1508", "after": "a07c55e9138bd642", "item": { "type": "markdown", "id": "3be24f0a7c9d1508", "text": "The three numbers that decide whether it works:" }, "date": 1788130000003 },
    { "type": "add", "id": "e5920c7714af3bd6", "after": "3be24f0a7c9d1508", "item": { "type": "markdown", "id": "e5920c7714af3bd6", "text": "- **Infiltration rate** — measured, not assumed. Dig a test hole, fill it, time the drop.\n- **Sizing ratio** — garden area as a fraction of the impervious area draining to it.\n- **Ponding depth** — six to nine inches. Deeper looks efficient and drowns the plants." }, "date": 1788130000004 },
    { "type": "add", "id": "0cf4a861de23b79c", "after": "e5920c7714af3bd6", "item": { "type": "markdown", "id": "0cf4a861de23b79c", "text": "See also [[Rain Garden Plants]] and [[Rain Garden Failures]]." }, "date": 1788130000005 }
  ]
}
```

Note what happened: the H1 left the story and became the `title`; each heading is its own item; the three bullets stayed together in one item with real newlines between them; the prose paragraphs are single unwrapped lines; the `[[Wiki Links]]` passed through untouched.

The full three-page file — including the `html` grid table and the labeled-paragraph table rows — is `fedwiki-import-example.json` beside this one. Drop it on a site to see the whole path end to end.

---

## 5. Checklist before you hand over a file

- [ ] Valid JSON. Parse it before you send it.
- [ ] Top level is a flat `{slug: page}` map — **not** `{title, story, journal}`, unless you deliberately chose the wrapper.
- [ ] Every slug key matches `asSlug(page.title)`. A mismatch imports the page under a name its inbound `[[links]]` will not find.
- [ ] Every `id` is 16 hex characters, unique within its page, and identical in the story item and its journal `add`.
- [ ] The `create` action's story is `[]`.
- [ ] One `add` per story item, in story order, dates strictly increasing.
- [ ] No hard line-wrapping inside any item's `text`. Paragraphs are single long lines.
- [ ] No H1 heading item duplicating the page title.
- [ ] Every `[[Wiki Link]]` either names a page in this same file or a page that already exists on the target site. A link to neither renders as a ghost — not an error, but not what you meant.
- [ ] Any `html` item has its inline markup as real tags and its content escaped.
- [ ] Any plugin item is verbatim from a live source, all keys intact.

---

## 6. Doing it with the scripts instead

On Marc's machine the whole path is already automated — `~/rcn/.claude/skills/fedwiki-page/scripts/`:

```
node scripts/md-to-fedwiki-page.js a.md b.md c.md --map import.json      # .md -> ONE flat drop file
node scripts/md-to-fedwiki-page.js a.md b.md c.md --out pages/           # .md -> one page JSON per file
node scripts/bundle-fedwiki-import.js pages/ --out import.json --map     # dir -> ONE flat drop file
node scripts/export-fedwiki-page.js import.json --out out.md             # exit ramp; output is NOT importable
```

`--map` is the flat `{slug: page}` form of §3 — the one to reach for. `md-to-fedwiki-page.js` also takes `--tables rows` (default) or `--tables html`.

The wrapper form is opt-in and stays available for the one case that wants it:

```
node scripts/md-to-fedwiki-page.js a.md b.md c.md --bundle import.json --bundle-title "Import X"
node scripts/bundle-fedwiki-import.js pages/ --out import.json --title "Import X"
```

Both wrapper paths print a note to stderr reminding you what they cost. `--map` and `--bundle` are mutually exclusive; asking for both is an error rather than a silent pick.

Chat-Claude has none of this and should write the JSON directly, to the rules above.
