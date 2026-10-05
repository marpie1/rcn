# Mech Blocks Introduction

*Marc Pierson and Claude Opus 5.5 · October 2026*

Mech Blocks lets you build a small wiki program by snapping blocks together, the way children build programs in Scratch. It sits on top of Mech, which Ward Cunningham wrote so that a FedWiki page can carry a little program that runs when you read it.

It changes nothing in Mech itself. It comes two ways: as one web page, `tools/mech-blocks.html`, that you open in a browser, and as a wiki plugin, `wiki-plugin-mechblocks`, which puts a Mech Blocks item beside the Mech items on a FedWiki page.

## What Mech does

A Mech program is a few lines of capital words. Each line is a block that does one thing. A line indented under another line belongs to it. Ward's handbook at mech.fed.wiki has about sixty of them.

```
CLICK
 NEIGHBORS fed.wiki
 WALK 10 steps
 PREVIEW graph
```

Read it top to bottom. CLICK puts a ▶ button on the page and waits. NEIGHBORS gathers the list of every page on the nearby wiki sites. WALK follows links through those pages ten steps at a time and keeps what it finds as small graphs. PREVIEW graph opens those graphs as a page you can look at.

The blocks pass things to each other through a shared notebook that Mech calls "state". NEIGHBORS writes the neighborhood into it. WALK reads the neighborhood and writes graphs. PREVIEW reads the graphs. Put WALK before NEIGHBORS and WALK finds nothing to read.

## Why blocks

Typing these lines is easy for Ward and hard for nearly everyone else. Spaces matter, the capital words have to be spelled exactly, and a mistake only shows up after you click ▶.

Mech Blocks keeps Ward's text exactly as it is and puts a second view beside it. You drag blocks instead of typing, and the text rewrites itself as you go. The text is still what FedWiki stores, so a script built from blocks runs anywhere Mech runs.

## What you see

Every block says what it **needs** and what it **makes**, with a small picture and a word. WALK says "needs 🏘 neighborhood" and "makes 🔗 aspect". When the picture you need is made by a block above you, the block fits.

Three lamps above the script answer three plain questions:

- **Fits together**: does every block have what it needs?
- **Ready to start**: can anyone start it, not just the page owner?
- **Ends in a result**: will something show at the end?

In **beginner mode**, blocks that cannot go at the blue "next block goes here" line are greyed out, and a block that would not fit cannot be dropped. The tool says why: "WALK expects neighborhood, like from NEIGHBORS."

## Try it in three minutes

1. Open `tools/mech-blocks.html`. Clear the text box on the right.
2. Tap CLICK, then NEIGHBORS, then WALK, then PREVIEW in the block list on the left. Each one lands at the blue line.
3. Watch the three lamps turn green, and the text on the right become the script above.
4. Now drag WALK above NEIGHBORS. Beginner mode refuses and tells you why.
5. Turn beginner mode off and try again. This time the drop goes through, the bar turns amber, and the lamps go out with the reason.

## In the wiki

On a site with the plugin, place a Mech Blocks item on a page that has Mech items. For each Mech item it offers:

- **Edit in blocks**: the block view in a new window. **Save to wiki** puts the script back into the Mech item, where Ward's Mech runs it as usual.
- **Watch it run**: runs the script with Ward's own blocks, and draws the shared notebook as it fills. There is an oval for each thing the blocks pass along, a solid line from the block that wrote it, and a dashed line to each block that read it.
- **Graph Tool**: once a run has made graphs, draws them in the RCN Graph Tool.

The plugin also answers `PLUGIN rcn` with blocks for RCN data on the site: `PROJECTIONS`, `PROJECTION` for Layer 1 folders, and `BADGES` for SODOTO badges.

## What it cannot promise

Green lamps mean the script is put together right. They cannot promise a result, because some things only show up when it runs: a wiki site that does not answer, an empty neighborhood, a sensor that is off. Mech's own ✖︎ messages cover those.

The page on its own does not run Mech. In the wiki, Watch it run does, or copy the text into any Mech item.

## Where it came from

Ward named three inspirations: Scratch, where blocks only fit where they belong; Snap!, where blocks pass data to each other; and Etoys, where you pull pieces from the things on the screen. Mech Blocks borrows one idea from each, and its checks use the trouble messages from Ward's own code, applied before running instead of after.

The [[Mech Blocks Manual]] explains every part of the screen. The [[Mech Blocks Reference]] lists every block with what it needs and makes. [[About Mechblocks Plugin]] has working examples to click.

*Marc Pierson and Claude Opus 5.5 · October 2026*
