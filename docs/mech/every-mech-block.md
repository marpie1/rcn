# Every Mech Block

A Mech script is a few lines, and each line starts with one capital word: a block. These are all the blocks Ward Cunningham's Mech knows (version 0.1.48), each with what it does in a line, in one table per group. Block names link to their pages in Ward's handbook at mech.fed.wiki.

*Marc Pierson and Claude Opus 5.5 · October 2026*

## Control

| Block | What it does |
|---|---|
| [CLICK](http://mech.fed.wiki/view/click) | Waits for a person to click ▶, then runs the blocks indented under it. |
| [TICK](http://mech.fed.wiki/view/tick) | Like CLICK, but runs the blocks under it again and again, up to 99 times. |
| [UNTIL](http://mech.fed.wiki/view/until) | Sits inside TICK and stops the ticking once a chosen word turns up in the graphs. |
| [SLEEP](http://mech.fed.wiki/view/sleep) | Waits a number of seconds before the script goes on. |
| [TOGETHER](http://mech.fed.wiki/view/together) | Starts all the blocks under it at once, instead of one after another. |

## Pages and neighbors

| Block | What it does |
|---|---|
| [FROM](http://mech.fed.wiki/view/from) | Fetches one wiki page so the blocks under it can read it. |
| [NEIGHBORS](http://mech.fed.wiki/view/neighbors) | Gathers the list of every page on the nearby wiki sites. |
| [WALK](http://mech.fed.wiki/view/walk) | Follows links through those pages, by steps, days, weeks, hubs or clicks, and keeps what it finds as small graphs. |
| [RANDOM](http://mech.fed.wiki/view/random) | Picks one page at random from the neighborhood. |
| [ROSTER](http://mech.fed.wiki/view/roster) | Makes a Roster of the sites in the neighborhood. |
| [LINEUP](http://mech.fed.wiki/view/lineup) | Makes a list of the pages open to the left of this one. |
| [SHOW](http://mech.fed.wiki/view/show) | Opens a page beside this one. |
| [DELTA](http://mech.fed.wiki/view/delta) | Copies another site's recent changes onto this one, working with GET on the server. |

## Data

| Block | What it does |
|---|---|
| [SOURCE](http://mech.fed.wiki/view/source) | Reads what an item to the left offers, such as map markers, graphs or uploaded files. |
| [FILE](http://mech.fed.wiki/view/file) | Lets a person pick an uploaded file and hands its text to the blocks under it. |
| [KWIC](http://mech.fed.wiki/view/kwic) | Builds a keyword-in-context index from a tab-separated file. |
| [SENSOR](http://mech.fed.wiki/view/sensor) | Reads a temperature from a sensor named on the page. |
| CODE | Runs a JavaScript function written in a Code item on the same page. |

## Show results

| Block | What it does |
|---|---|
| [HELLO](http://mech.fed.wiki/view/hello) | Adds a smiling face, the simplest proof that Mech is running. |
| [REPORT](http://mech.fed.wiki/view/report) | Shows one value, such as a temperature, in large letters. |
| [PREVIEW](http://mech.fed.wiki/view/preview) | Shows what the script made (graphs, a map, a list or a page) as a new page beside this one. |
| [POPUP](http://mech.fed.wiki/view/popup) | Opens a pop-up window showing what the script holds, or images. |
| [SOLO](http://mech.fed.wiki/view/solo) | Opens the script's graphs in the Solo viewer. |
| [PRINT](http://mech.fed.wiki/view/print) | Gathers the pages a walk found into a printable outline or draft book. |
| DOWNLOAD | Saves what the script made as a file on your computer. |

## Server

| Block | What it does |
|---|---|
| [GET](http://mech.fed.wiki/view/get) | Runs the blocks under it on the wiki server and brings back what they make. |
| [PLUGIN](http://mech.fed.wiki/view/plugin) | Like GET, but another installed plugin answers the blocks under it. |

## Messages

| Block | What it does |
|---|---|
| [LISTEN](http://mech.fed.wiki/view/listen) | Waits for a named message, such as one sent by MESSAGE or by another plugin. |
| [MESSAGE](http://mech.fed.wiki/view/message) | Sends a named message to the page. |

## Turtle drawing

| Block | What it does |
|---|---|
| [FORWARD](http://mech.fed.wiki/view/forward) | Moves the drawing turtle forward, drawing a line. |
| [TURN](http://mech.fed.wiki/view/turn) | Turns the drawing turtle by some degrees. |

## On the server, inside GET

| Block | What it does |
|---|---|
| [HELLO](http://mech.fed.wiki/view/hello) | Sends back a smiling face from the server. |
| [UPTIME](http://mech.fed.wiki/view/uptime) | Tells how long the server has been running. |
| [SLEEP](http://mech.fed.wiki/view/sleep) | Waits on the server before going on. |
| [COMMONS](http://mech.fed.wiki/view/commons) | Counts the image files kept on the server. |
| [DELTA](http://mech.fed.wiki/view/delta) | Finds this site's recent changes, for DELTA on another site to copy. |

## Inside PLUGIN rcn

These come with the Mech Blocks plugin, not with Mech itself, and read RCN data held on the same site.

| Block | What it does |
|---|---|
| PROJECTIONS | Lists the Layer 1 folders on this site. |
| PROJECTION | Turns one Layer 1 folder into graphs, keeping only the kinds named after it. |
| BADGES | Gathers the SODOTO badges on this site's pages, as people and the skills they hold. |
| HELLO | Shows that the rcn plugin answers. |

CODE and DOWNLOAD have no pages in Ward's handbook yet; drafts of both are written and waiting to be offered to him. Every block, with what it needs and what it makes, is in the [[Mech Blocks Reference]].

*Marc Pierson and Claude Opus 5.5 · October 2026*
