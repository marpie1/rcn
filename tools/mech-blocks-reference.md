# Mech Blocks Reference

*Marc Pierson and Claude Opus 5.5 · October 2026*

Every block Mech knows, as Mech Blocks understands it from reading Ward Cunningham's code in October 2026. The descriptions follow Ward's [[Catalog of Mech Blocks]]. How to use the tool is in the [[Mech Blocks Manual]].

**Needs** is what a block reads from the shared state, which a block above it must make. **Makes** is what it writes there for blocks below. What a block may hold, indented under it, is at the end of its description.

## Blocks that run in the browser

| Block | What it does | Needs and makes |
|---|---|---|
| CLICK | Offer to proceed once user clicks. Holds blocks, and must. | — |
| TICK | Proceed repeatedly once user clicks. Holds blocks, and must. | makes 🌡 tick, for the blocks inside |
| UNTIL | Stop TICKing once a word turns up. May hold blocks. | needs 🌡 tick; 🔗 aspect |
| SLEEP | Suspend a sequence of blocks. May hold blocks. | — |
| TOGETHER | Start all blocks at once. Holds blocks, and must. | — |
| FROM | Fetch a page for the blocks indented below. Holds blocks, and must. | makes 🏘 page |
| NEIGHBORS | Retrieve available neighborhood sitemaps. Holds lines of data. | makes 🏘 neighborhood |
| WALK | Explore the neighborhood link graph. | needs 🏘 neighborhood · makes 🔗 aspect |
| RANDOM | Select a random page from the neighbors. | needs 🏘 neighborhood · makes 🏘 info |
| ROSTER | Make a Roster for the current neighborhood. | needs 🏘 neighborhood · makes ☰ items |
| LINEUP | Make a page from the current lineup. | makes ☰ items |
| SHOW | Add an existing page to the lineup. Shows a result. | needs 🏘 info when no page is named |
| DELTA | Apply recent remote site changes. | needs 🖥 actions for apply · makes 🖥 recent for have; 🏘 page for apply |
| SOURCE | Read a data source from the lineup. May hold blocks. | makes the topic named, such as 🔗 marker |
| FILE | User selects one of the available files. Holds blocks, and must. | needs 📄 assets · makes 📄 the file text, named by the suffix as typed, for the blocks inside |
| KWIC | Construct a Keyword-In-Context index. Holds lines of data. | needs 📄 tsv · makes ☰ items |
| SENSOR | Read sensor data from a named endpoint. May hold blocks. | needs 🏘 page · makes 🌡 temperature |
| CODE | Run JavaScript from a Code item on this page. Holds lines of data. | makes ◆ whatever its function sets |
| HELLO | Add a happy face each time run. Shows a result. | — |
| REPORT | Report a measurement in place in the item. Shows a result. | needs 🌡 temperature, or the key named after REPORT |
| PREVIEW | Display computed state as a ghost page. Shows a result. | needs 🔗 marker for map; 🔗 aspect for graph; ☰ items for items; 🏘 page for page |
| POPUP | Open a pop-up window with various contents. Shows a result. | needs 🖥 commons for images |
| SOLO | Launch the Solo plugin pop-up viewer. Shows a result. | needs 🔗 aspect |
| PRINT | Compose a printable story and garden. Shows a result. | needs 🔗 aspect; 🏘 neighborhood · makes ☰ items |
| DOWNLOAD | Download state as a file. Shows a result. | needs 📄 the state named by the file ending |
| GET | Await a result from the server. Holds server blocks, and must. | makes 🖥 result |
| PLUGIN | Await a result from an installed plugin. Holds the plugin's blocks, and must. | makes 🖥 result |
| LISTEN | Wait for a specific message. | — |
| MESSAGE | Send a specific message. | — |
| FORWARD | Move the drawing "turtle" forward. | makes ✏️ turtle |
| TURN | Turn the drawing "turtle". | makes ✏️ turtle |

## Blocks that run on the server, inside GET

| Block | What it does | Needs and makes |
|---|---|---|
| HELLO | Add a happy face each time run. | — |
| UPTIME | Report time the server has run. | — |
| SLEEP | Suspend a sequence of blocks. | — |
| COMMONS | Report image files and byte count. | makes 🖥 commons |
| DELTA | Retrieve recent site changes. | needs 🖥 recent · makes 🖥 actions |

GET sends only the state named after it to the server, such as `GET recent`. Whatever the server blocks make comes back for the blocks after GET.

## Blocks that run inside PLUGIN rcn

These come with the Mech Blocks plugin and read RCN data held on the same site.

| Block | What it does | Needs and makes |
|---|---|---|
| PROJECTIONS | List the Layer 1 folders on this site. | makes ☰ items |
| PROJECTION | A Layer 1 folder's graph, as an aspect; kinds after the name keep only those. | makes 🔗 aspect |
| BADGES | SODOTO badges on this site's pages: people and the skills they hold; words after it keep matching skills. | makes 🔗 aspect; ☰ items |
| HELLO | Proves the rcn plugin answers. | — |

## Notes

- A block that is missing what it needs stops with a ✖︎ and makes nothing, so blocks after it that needed its result stop too.
- FILE stores the file's text under its argument exactly as typed. `FILE tsv` makes tsv, which KWIC and DOWNLOAD can use. `FILE .tsv` stores it under ".tsv", which they cannot find.
- CODE runs for anyone only when it sits directly inside CLICK or TICK. Elsewhere it runs only for the page owner.
- [[CODE]] and [[DOWNLOAD]] had no handbook pages; pages for them were drafted in October 2026.

*Marc Pierson and Claude Opus 5.5 · October 2026*
