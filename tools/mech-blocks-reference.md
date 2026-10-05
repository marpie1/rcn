# Mech Blocks Reference

*Marc Pierson and Claude Opus 5.5 · October 2026*

Every block Mech knows, as Mech Blocks understands it from reading Ward Cunningham's code in October 2026. The descriptions follow Ward's [[Catalog of Mech Blocks]]. How to use the tool is in the [[Mech Blocks Manual]].

**Needs** is what a block reads from the shared state, which a block above it must make. **Makes** is what it writes there for blocks below. **Holds** is what may be indented under it.

## Blocks that run in the browser

| Block | What it does | Needs | Makes | Holds |
|---|---|---|---|---|
| CLICK | Offer to proceed once user clicks. | — | — | blocks (must) |
| TICK | Proceed repeatedly once user clicks. | — | 🌡 tick, for the blocks inside | blocks (must) |
| UNTIL | Stop TICKing once a word turns up. | 🌡 tick; 🔗 aspect | — | blocks, if you like |
| SLEEP | Suspend a sequence of blocks. | — | — | blocks, if you like |
| TOGETHER | Start all blocks at once. | — | — | blocks (must) |
| FROM | Fetch a page for the blocks indented below. | — | 🏘 page | blocks (must) |
| NEIGHBORS | Retrieve available neighborhood sitemaps. | — | 🏘 neighborhood | lines of data |
| WALK | Explore the neighborhood link graph. | 🏘 neighborhood | 🔗 aspect | nothing |
| RANDOM | Select a random page from the neighbors. | 🏘 neighborhood | 🏘 info | nothing |
| ROSTER | Make a Roster for the current neighborhood. | 🏘 neighborhood | ☰ items | nothing |
| LINEUP | Make a page from the current lineup. | — | ☰ items | nothing |
| SHOW | Add an existing page to the lineup. Shows a result. | 🏘 info when no page is named | — | nothing |
| DELTA | Apply recent remote site changes. | 🖥 actions for apply | 🖥 recent for have; 🏘 page for apply | nothing |
| SOURCE | Read a data source from the lineup. | — | the topic named, such as 🔗 marker | blocks, if you like |
| FILE | User selects one of the available files. | 📄 assets | 📄 the file text, named by the suffix as typed, for the blocks inside | blocks (must) |
| KWIC | Construct a Keyword-In-Context index. | 📄 tsv | ☰ items | lines of data |
| SENSOR | Read sensor data from a named endpoint. | 🏘 page | 🌡 temperature | blocks, if you like |
| CODE | Run JavaScript from a Code item on this page. | — | ◆ whatever its function sets | lines of data |
| HELLO | Add a happy face each time run. Shows a result. | — | — | nothing |
| REPORT | Report a measurement in place in the item. Shows a result. | 🌡 temperature, or the key named after REPORT | — | nothing |
| PREVIEW | Display computed state as a ghost page. Shows a result. | 🔗 marker for map; 🔗 aspect for graph; ☰ items for items; 🏘 page for page | — | nothing |
| POPUP | Open a pop-up window with various contents. Shows a result. | 🖥 commons for images | — | nothing |
| SOLO | Launch the Solo plugin pop-up viewer. Shows a result. | 🔗 aspect | — | nothing |
| PRINT | Compose a printable story and garden. Shows a result. | 🔗 aspect; 🏘 neighborhood | ☰ items | nothing |
| DOWNLOAD | Download state as a file. Shows a result. | 📄 the state named by the file ending | — | nothing |
| GET | Await a result from the server. | — | 🖥 result | server blocks (must) |
| PLUGIN | Await a result from an installed plugin. | — | 🖥 result | the plugin's blocks (must) |
| LISTEN | Wait for a specific message. | — | — | nothing |
| MESSAGE | Send a specific message. | — | — | nothing |
| FORWARD | Move the drawing "turtle" forward. | — | ✏️ turtle | nothing |
| TURN | Turn the drawing "turtle". | — | ✏️ turtle | nothing |

## Blocks that run on the server, inside GET

| Block | What it does | Needs | Makes |
|---|---|---|---|
| HELLO | Add a happy face each time run. | — | — |
| UPTIME | Report time the server has run. | — | — |
| SLEEP | Suspend a sequence of blocks. | — | — |
| COMMONS | Report image files and byte count. | — | 🖥 commons |
| DELTA | Retrieve recent site changes. | 🖥 recent | 🖥 actions |

GET sends only the state named after it to the server, such as `GET recent`. Whatever the server blocks make comes back for the blocks after GET.

## Blocks that run inside PLUGIN rcn

These come with the Mech Blocks plugin and read RCN data held on the same site.

| Block | What it does | Needs | Makes |
|---|---|---|---|
| PROJECTIONS | List the Layer 1 folders on this site. | — | ☰ items |
| PROJECTION | A Layer 1 folder's graph, as an aspect; kinds after the name keep only those. | — | 🔗 aspect |
| BADGES | SODOTO badges on this site's pages: people and the skills they hold; words after it keep matching skills. | — | 🔗 aspect; ☰ items |
| HELLO | Proves the rcn plugin answers. | — | — |

## Notes

- A block that is missing what it needs stops with a ✖︎ and makes nothing, so blocks after it that needed its result stop too.
- FILE stores the file's text under its argument exactly as typed. `FILE tsv` makes tsv, which KWIC and DOWNLOAD can use. `FILE .tsv` stores it under ".tsv", which they cannot find.
- CODE runs for anyone only when it sits directly inside CLICK or TICK. Elsewhere it runs only for the page owner.
- [[CODE]] and [[DOWNLOAD]] had no handbook pages; pages for them were drafted in October 2026.

*Marc Pierson and Claude Opus 5.5 · October 2026*
