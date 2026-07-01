# FedWiki Git Briefing for Claude Code

**Purpose:** Give this document to any Claude Code session that will do work involving Federated Wiki. It establishes the same grounding that Marc Pierson's Claude Code session reached in June 2026 after reading the FedWiki GitHub repo and Ward Cunningham's "What Wiki Does" specification.

---

## The Problem We Are Solving

Ward Cunningham (the inventor of wiki and creator of Federated Wiki) and the FedWiki programmer community have observed that people building on FedWiki often create solutions that work — but bypass the platform's native affordances. The result is tools that reinvent things FedWiki already provides, that can't interoperate with the federation, and that accumulate technical debt that diverges from where FedWiki is heading.

This happened in the RCN project. We built a Shared Care Plan plugin (`scp-field`), standalone HTML tools (a graph diagrammer, an outliner, a map editor), and infrastructure for SODOTO credential issuance — all working, but mostly outside FedWiki's design rather than inside it.

The goal going forward is to build FedWiki-idiomatically: use what exists, extend what needs extending through the plugin system, and let the federation do the work the federation was built to do.

**The rule:** Before writing any FedWiki-related code, fetch the relevant source from the FedWiki GitHub org and read it. Don't rely on memory or inference about how FedWiki works.

---

## FedWiki in Brief

Federated Wiki (FedWiki) was created by Ward Cunningham. Each person or organization runs their own wiki server. Pages have a JSON structure (story + journal). Anyone can fork a page to their own server, creating twins. The federation is the network of these sites — no central authority, no single owner.

Ward's specification "What Wiki Does" organizes the platform's behavior into six concerns: **fundamental, collaborative, interpretable, computational, generative, maintainable.** Key vocabulary:

- **Page** — JSON with `title`, `story` (array of items), `journal` (array of actions). License: CC BY-SA.
- **Item** — a typed content block. `id` is a random 16-char hex string assigned at creation, preserved through all edits including type changes, unique within a page.
- **Slug** — lowercase, alphanumeric, hyphens for spaces. A 404 means the page doesn't exist here; check neighbors.
- **Fork** — copying a page to your own server. Creates a twin. BY/SA attribution history is preserved.
- **Neighborhood** — the set of sites the client knows about and searches for content.
- **Ghost** — a computed or proposed page shown for review; the owner decides whether to fork it into their own server.
- **Frame plugin** — embeds an external HTML page in a sandboxed iFrame. The FedWiki-idiomatic way to embed external tools inside wiki pages.
- **Roster plugin** — lists community sites and registers them as neighbors. The FedWiki-idiomatic way to list a network of sites.

---

## The RCN Project Context

RCN (ReLocalize Creativity Network) is a neighborhood-scale community development project. The atomic unit is an NDC (Neighborhood Development Cooperative). Active NDC sites include Superior AZ, Lansing MI, Maple Falls WA, and Austin/Bastrop TX.

FedWiki is a core infrastructure component. Key RCN work involving FedWiki:

1. **Shared Care Plan (SCP)** — a person-controlled health record built on FedWiki, piloted in Superior AZ with community health workers (CHWs). Built as a FedWiki plugin (`scp-field`). Runs on a Groove workspace (port 3001).

2. **SODOTO credential infrastructure** — a skill credentialing system. Credentials are Verifiable Credentials (W3C standard), signed with Ed25519 keys. Issuance UI is being built. The FedWiki-idiomatic path: a Frame script that assembles the credential and offers it as a ghost page to fork.

3. **Standalone tools** — graph diagrammer, MORE outliner, issue polygon map. Currently standalone HTML files. These should be surfaced through wiki pages via the Frame plugin rather than living completely outside FedWiki.

---

## The Five Gaps (Ward's Critique)

These are the specific ways RCN's FedWiki work currently misses native affordances:

### 1. No factory pattern
`scp-field` items can only be created by editing raw page JSON. FedWiki has a "factory" affordance — dragging onto a page or using a menu creates a new item of a given type. A CHW cannot add a medication card without knowing JSON structure. The factory mechanism lives in `wiki-client/lib/factory.js` (not in `wiki-plugin-factory`, which has no client JS).

### 2. Health data is opaque to other plugins
`scp-field` items hold data internally. FedWiki's inter-plugin data flow works via jQuery `thumb` events: a data plugin item fires `$(div).trigger('thumb', key)` and downstream plugins (method, chart, bars) listen on `$('.main').on('thumb', ...)`. Right now nothing downstream can read SCP data without custom code.

### 3. Standalone tools live outside the wiki
The graph tool, MORE outliner, and issue polygon map are standalone HTML files that open separately. They should be surfaced through wiki pages. However, the Frame plugin's narrow column width is too small for these tools. The correct approach is the **Solo popup pattern** (see below) — a full-window popup that stays linked to the lineup it came from.

### 4. Single-site, not federated — in progress
The intended architecture is a **FedWiki farm**: each patient gets their own subdomain on a managed Wiki Café server (e.g. `patient123.scp2.relocalizecreativity.net`). Each subdomain is a real, separate wiki site with its own data. Wiki Café already supports per-site secure login — a sys admin or user can enable it per site. This works now.

What remains before production with real health data:
- **Pressure testing** — verify a logged-in CHW on site A genuinely cannot reach patient data on site B via any route (UI, direct URL, API call)
- **Session hardening** — timeouts, token expiry, behavior on lost/stolen phone
- **Revocation testing** — verify grant/revoke/timed-expiry locks out a revoked user immediately
- **Audit log integrity** — patient can see who accessed their plan; log must be tamper-evident. This was a core feature of the original SCP (integrated with Microsoft HealthVault, hospital EMR, national labs, imaging repositories) — it is a pre-deployment requirement, not an enhancement. The Groove access log API already exists; the patient-facing UI must be built before go-live.
- **CHW authorization model** — how a CHW's wiki gets authorized to view/edit a specific patient's SCP; needs Ward's input

Health data failure is not a technical problem — it is a harm to a real person in a vulnerable situation. The Superior AZ pilot must not go live until the security has been seriously tested.

### 5. ~~No Roster for the NDC network~~  — **Already resolved**
Marc has been using Roster pages for the NDC network all along and will continue to. Not a gap.

---

## FedWiki Git: The GitHub Org

**Org:** https://github.com/fedwiki  
**Size:** 64 repositories  
**Note:** Most repos use `ReadMe.md` (mixed case), not `README.md`.

### Core repos
| Repo | Branch | Description |
|---|---|---|
| `fedwiki/wiki` | main | Top-level package; pulls together server, client, plugins |
| `fedwiki/wiki-server` | main | Express server |
| `fedwiki/wiki-client` | main | All client-side JS including plugin loading |

### Plugin repos (relevant to RCN)
| Repo | Branch | Notes |
|---|---|---|
| `wiki-plugin-frame` | main | `client/frame.js` — iFrame embed + postMessage API |
| `wiki-plugin-factory` | main | No client JS here — factory is in `wiki-client/lib/factory.js` |
| `wiki-plugin-roster` | main | `src/client/roster.js` — site listing + neighbor registration |
| `wiki-plugin-data` | main | `src/client/data.js` — inter-plugin data flow via thumb events |
| `wiki-plugin-method` | main | Consumes data plugin output |
| `wiki-plugin-chart` | main | Consumes data plugin output |
| `wiki-plugin-code` | main | Code items; used by Frame scripts |
| `wiki-plugin-map` | main | Geographic items |

### Paul Rodwell's repos (github.com/paul90) — relevant to RCN
Paul is a core FedWiki contributor. His `wiki-plugin-solo` is the canonical pattern for opening tools in a full window while staying linked to the lineup.

| Repo | Branch | Notes |
|---|---|---|
| `paul90/wiki-plugin-solo` | main | `client/solo.js` — **the full-window popup pattern for RCN tools** |
| `paul90/wiki-plugin-present` | master | Peer presence dashboard |
| `paul90/wiki-plugin-diag` | — | Diagram plugin |
| `paul90/wiki-plugin-dagre` | — | Graph layout plugin |

### File path patterns
```
# Try main branch first:
https://raw.githubusercontent.com/fedwiki/{repo}/main/src/client/{name}.js
https://raw.githubusercontent.com/fedwiki/{repo}/main/client/{name}.js

# If 404, try master:
https://raw.githubusercontent.com/fedwiki/{repo}/master/client/{name}.js

# If still 404, try CoffeeScript:
https://raw.githubusercontent.com/fedwiki/{repo}/main/client/{name}.coffee
```

### Key files to fetch
```
https://raw.githubusercontent.com/fedwiki/wiki-client/main/lib/plugin.js
https://raw.githubusercontent.com/fedwiki/wiki-client/main/lib/factory.js
https://raw.githubusercontent.com/fedwiki/wiki-plugin-frame/main/client/frame.js
https://raw.githubusercontent.com/fedwiki/wiki-plugin-roster/main/src/client/roster.js
https://raw.githubusercontent.com/fedwiki/wiki-plugin-data/main/src/client/data.js
https://raw.githubusercontent.com/paul90/wiki-plugin-solo/main/client/solo.js
```

---

## Plugin API Contract

From `wiki-client/lib/plugin.js`:

Every plugin registers as:
```javascript
window.plugins.myPlugin = { emit, bind }
```

- **`emit($item, item)`** — renders the item into the DOM. Called first.
- **`bind($item, item)`** — attaches event handlers after all items rendered. Called second.
- **`consumes`** — optional array of CSS selectors for upstream producer items this plugin depends on.
- Loaded from `/plugins/{name}/{name}.js` (falls back to `/plugins/{name}.js`).
- **No callbacks** — the interface uses async/await only. Do not write `emit(div, item, done)` with a callback; that pattern is deprecated.

To register: `window.plugins.myPlugin = { emit, bind }` — that's all.

---

## Frame Plugin — Full postMessage API

From `wiki-plugin-frame/client/frame.js`:

### Item text format
```
https://example.com/your-tool   ← first line: the src URL (must include domain)
HEIGHT 400                       ← optional: height in px (default 120)
SOURCE topicName                 ← optional: consume upstream source data
LINEUP topicName                 ← optional: listen to lineup stream events
Caption text here                ← everything else becomes caption text
```

Special: `PLUGIN pluginname` loads from `/plugins/pluginname`.

### Context passed to iFrame (in URL hash params)
`pageKey`, `itemId`, `origin`, `site`, `slug`, `title`

### Messages the iFrame sends to the wiki (postMessage to parent)
| action | effect |
|---|---|
| `sendFrameContext` | request page/item context |
| `showResult` | display a new page in the lineup (the ghost pattern) |
| `doInternalLink` | navigate to a wiki page |
| `importer` | show import dialog for multiple pages |
| `resize` | resize the iframe |
| `triggerThumb` | fire a thumb event (inter-plugin data flow) |
| `publishSourceData` | publish named data to downstream plugins |
| `requestSourceData` | request data from an upstream source plugin |
| `requestNeighborhood` | get list of neighbor sites |

### Messages the wiki sends back to the iFrame
| action | content |
|---|---|
| `frameContext` | page title, slug, site, item data |
| `sourceData` | upstream plugin data |
| `neighborhood` | list of sites with sitemaps |
| `{topic}Stream` | stream events from LINEUP sources |

### The ghost/fork pattern
A Frame script can compute a result, then call:
```javascript
window.parent.postMessage({ action: 'showResult', page: { title: '...', story: [...] } }, '*')
```
This displays the result as a ghost page in the lineup. The user reviews it and decides whether to fork it to their wiki. This is the FedWiki-idiomatic path for any computed output — including SODOTO credential issuance.

---

## Roster Plugin

From `wiki-plugin-roster/src/client/roster.js`:

Item text: one domain name per line. Each becomes a flag icon that registers the site as a neighbor:
```javascript
wiki.neighborhoodObject.registerNeighbor(site)
```

Special directives:
- `ROSTER site.example.org/page-slug` — include another roster page inline
- `REFERENCES site.example.org/page-slug` — include all reference items from that page
- Blank line — flush current group

Each roster item exposes `element.getRoster()` returning `{ all: [...sites], categoryName: [...sites] }` for use by other plugins.

**Use this for NDC network listings. Do not build custom site-listing code.**

---

## Data Plugin — Inter-Plugin Data Flow

From `wiki-plugin-data/src/client/data.js`:

The pattern by which plugins publish data to downstream plugins:
```javascript
// Publisher — fires when data changes:
$(div).trigger('thumb', 'columnName')

// Consumer — listens for upstream data:
$('.main').on('thumb', (evt, thumb) => { /* read upstream data */ })
```

Downstream plugins (method, chart, bars) are all built to consume this pattern. For SCP to expose health data to these plugins, `scp-field` needs to fire thumb events with the right keys.

---

## Full-Window Popup Pattern (paul90/wiki-plugin-solo)

The Frame plugin's narrow column is too small for complex tools like the graph diagrammer, outliner, and polygon map. The FedWiki-idiomatic solution is the **Solo pattern** — a full-window popup that stays linked to the lineup it came from. Paul Rodwell built this; it is the template for RCN standalone tools.

### How it works

**1. A small wiki plugin renders a button in the narrow column:**
```javascript
$item.append('<button>Open in full window</button>')
```

**2. The button opens a named full-window popup:**
```javascript
const pageKey = $item.parents('.page').data('key')
const popup = window.open('/plugins/solo/dialog/#', 'solo', 'popup,height=720,width=1280')
popup.postMessage({ pageKey, ...data }, window.origin)
```
The window name (`'solo'`) means re-clicking reuses the same window. `pageKey` is the thread back to the lineup.

**3. The popup talks back to the wiki via `window.opener`:**
```javascript
// In the popup:
window.opener.postMessage({
  action: 'doInternalLink',
  keepLineup: event.shiftKey,
  pageKey,
  title
}, window.origin)
```

**4. The wiki has a dedicated listener for popup messages:**
```javascript
function soloListener(event) {
  if (!event.source.opener || event.source.location.pathname !== '/plugins/solo/dialog/') return
  wiki.doInternalLink(title, $page)
}
window.addEventListener("message", soloListener)
```

### Why Frame alone doesn't solve this
The Frame plugin explicitly ignores messages from popup windows (`event.source.opener` check). Solo's listener does the opposite — it only accepts messages from popup windows. They are parallel, non-conflicting patterns. Use Frame for tools that fit in the narrow column; use Solo popup for tools that need full-screen space.

### Key source to read before building
```
https://raw.githubusercontent.com/paul90/wiki-plugin-solo/main/client/solo.js
```

---

## Going-Forward Rules

1. **Fetch before building.** When working on anything FedWiki-related, fetch the relevant source file from FedWiki Git and read it before writing code.

2. **Check the five gaps.** Before proposing an approach, ask: does FedWiki already have an affordance for this? Refer to the gap list above.

3. **The ghost/fork pattern is preferred over write APIs.** Instead of writing pages programmatically via sofi-proxy, compute a result in a Frame script and offer it as a ghost for the user to fork.

4. **SCP must eventually be federated.** Design decisions should not deepen the single-site lock-in. Every data structure should be designed so a client can own it on their own wiki.

5. **Use Roster for network listings.** Any page that lists NDC sites should use `wiki-plugin-roster`, not custom HTML.

6. **Ward's "What Wiki Does" is the conformance reference.** When generating page JSON, check slugs, item IDs, license, and journal format against that specification.

---

## Local FedWiki Setup (RCN)

- Local FedWiki runs on port 3000 via `wiki` CLI
- Groove workspace on port 3001 (`~/rcn/groove-workspace/`)
- FedWiki test targets: `ward.dojo.fed.wiki`, `localfedwiki.relocalizecreativity.net`
- SODOTO badge plugin registered at `~/.wiki/localhost/assets/wiki-plugin-sodoto-badge/client/sodoto-badge.js`
- sofi-proxy.py handles FedWiki page writes at `/api/wiki-write`
