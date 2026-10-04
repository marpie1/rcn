# Mech Blocks Manual

*Marc Pierson and Claude Opus 5.5 · October 2026*

This manual covers every part of Mech Blocks. For what it is and why, read the [[Mech Blocks Introduction]] first. For every block and what it needs and makes, see the [[Mech Blocks Reference]].

## Opening it

Mech Blocks is one file, `tools/mech-blocks.html`. Open it in a web browser. It needs no server and no internet connection, and nothing you do in it reaches any wiki.

It opens with one of Ward's handbook scripts already loaded, so there is something to look at.

## The four parts of the screen

- **The bar along the top**: a menu of Ward's handbook scripts, the beginner mode switch, Undo, Copy Mech text, and Copy block catalog.
- **Blocks**, on the left: every block, grouped by colour. Control is brown, Pages and neighbors blue, Data teal, Show results green, Server purple, Messages pink, Turtle drawing grey.
- **Script**, in the middle: your program as blocks, with the three lamps above it.
- **Mech text and Before you run it**, on the right: the same program as Ward's text, and a list of everything that can be seen to be wrong before it runs.

On a narrow screen, such as a phone, the parts stack one above the other.

## Building a script by tapping

The dashed blue line in the script is labelled "next block goes here". Tap any block in the list on the left and it lands at that line.

The blue line follows the block you last added, so tapping CLICK, NEIGHBORS, WALK and PREVIEW in turn builds a four-line script. When a block has an empty space that must be filled, such as CLICK, the blue line goes inside it.

To add somewhere else, tap a block's name in the script. The blue line moves to just after that block, and the block is outlined. Tap the name again, or tap empty space in the script, to send the blue line back to the end.

## Building a script by dragging

Drag a block from the list into the script. While you drag, a bar shows where it will land:

- over the top half of a block, it lands above that block;
- over the bottom half of a block's name, it lands below it, or inside it if the block has a space for other blocks;
- over a dashed "drop here" space, it lands inside;
- over the strip at the bottom of a block that holds others, it lands after the whole block;
- over "Drop here to add at the end", it lands at the end.

The bar is **green** when the block fits there. It is **amber** when it would add a problem, and the note beside your pointer says what. In beginner mode it is **red** instead, and letting go does nothing.

To move a block already in the script, drag it by its name. Everything indented under it moves with it. A block cannot be dropped inside itself.

Dragging works with a mouse, a pen or a finger.

## Blocks that hold other blocks

Some blocks are drawn as a C, with a space inside. CLICK, TICK, FROM, FILE, TOGETHER, GET and PLUGIN must have something inside, and an empty one shows a yellow "Needs … drop here" space. Others, such as SOURCE, SENSOR, UNTIL and SLEEP, may have something inside, and show a faint "Optional" space.

A few blocks hold lines of data rather than blocks:

- NEIGHBORS can hold the titles of Site Survey pages, like Pattern Link Survey.
- KWIC holds a link pattern containing $K or $W.
- CODE can hold lines its function reads for itself.

These lines are drawn with a dashed border.

GET holds blocks that run on the wiki server. The server blocks are at the bottom of the list, marked "in GET", and only fit inside GET. PLUGIN holds blocks that another plugin runs; Mech Blocks cannot check those.

## Changing the words after a block

Click the words after a block's name to change them, such as "10 steps" after WALK. Type, then press Enter to keep the change or Escape to cancel. Clicking elsewhere also keeps it.

When the words are grey and slanted, they are a hint about what belongs there. WALK, PREVIEW, POPUP, PRINT, DELTA, SOURCE, FILE and HELLO offer a list of choices as you type.

A line that is not a block, such as a survey title, is edited as a whole line.

## Removing and undoing

To remove a block, drag it back onto the list on the left. The list is outlined in red while a drop there would remove. Everything indented under the block goes with it.

Undo, or Cmd-Z (Ctrl-Z on Windows), steps back through the last 200 changes made with blocks. Changes typed into the text box have the text box's own undo.

## The Mech text

The text box on the right is the program as Mech stores it. It changes with every drag and tap. You can also type into it; the blocks follow a moment after you stop.

Nothing is lost going between the two. Text you did not change comes back exactly as it was, spaces and all, and the blocks are arranged exactly as Mech itself reads the indentation.

**Copy Mech text** puts the text on your clipboard.

## Needs and makes

Each block carries small labels for what it needs and what it makes, each with a picture:

| Picture | Family | What it covers |
|---|---|---|
| 🏘 | sites and pages | neighborhood, page, info |
| 🔗 | graphs | aspect, marker |
| ☰ | lists of items | items |
| 📄 | files and text | assets, tsv, txt, csv, html, json |
| 🌡 | readings and counts | temperature, tick |
| 🖥 | from the server | result, commons, recent, actions |
| ✏️ | the turtle drawing | turtle |
| ◆ | made by CODE | anything else |

The labels change with their situation:

- A **needs** label with a coloured outline means a block above makes it.
- A **needs** label filled in amber means nothing above makes it. The block will stop with an error when it runs.
- A **needs** label with a dashed outline means a CODE block above might make it. Mech Blocks cannot tell what someone's code does.
- A **makes** label is filled with its family's colour. It is crossed out and grey when the block is missing something it needs, because a block that stops early makes nothing.
- **⇒ shows a result** marks a block that will put something on the screen.

## The three lamps

Above the script are three lamps. A lamp is green when its answer is yes. When one is grey, the reason is written under the lamps.

- **Fits together**: every block has what it needs, every space that must be filled is filled, the words after each block make sense, and no lines are left where they can never run.
- **Ready to start**: anyone reading the page can start it. The one thing that turns this off is a CODE block that is not directly inside CLICK or TICK. Such a CODE runs only for the page's owner, because code travels with copied pages and Mech will not run a stranger's code until a person asks it to.
- **Ends in a result**: the script reaches a block that shows something (PREVIEW, REPORT, SOLO, POPUP, PRINT, DOWNLOAD, SHOW or HELLO), and that block has what it needs.

All three green means the script is put together right. It does not promise a result when it runs: a site may not answer, a neighborhood may be empty, a sensor may be off. Mech reports those itself, with its ✖︎.

## Beginner mode

Beginner mode is the switch in the top bar. It starts on, and the browser remembers your choice.

In beginner mode:

- Blocks in the list that cannot go at the blue line are greyed out. Server blocks are greyed everywhere except inside GET.
- Tapping a greyed block does nothing, and the top bar says why.
- A drop that would add any problem is refused, with the reason. This counts problems for every block, not only the one you move: moving NEIGHBORS below WALK is refused because it leaves WALK without a neighborhood.
- Problems that were already there do not block other drops. You can keep building while an old mistake waits to be fixed.
- An empty space that still needs filling does not block a drop, so you can place CLICK and then fill it.

With beginner mode off, every drop goes through. The bar turns amber, the lamps go out, and the reasons are listed, but nothing is refused. This suits someone who knows Mech and wants to rearrange freely.

## Before you run it

The list on the right shows every problem that can be seen before running, by line number, in the words Ward's own blocks use. Click a line in the list to scroll to its block, which flashes.

Each block with a problem also has a small ✖︎ button. Click it to read the message under the block, as in Mech itself. Red is something wrong. Amber is something missing or something that will never run.

## Lines that are not blocks

- A **blank line** is drawn as a faint "blank line" tile. Mech ignores it, but lines indented under it never run.
- A line that starts with a capital word Mech does not know is drawn red: "CLACK doesn't name a block we know."
- A line that does not start with a capital word is drawn red: "Expected line to begin with all-caps keyword."
- Lines indented under nothing are drawn inside a red dashed box marked "never runs".
- Lines indented under a block that does not use them are drawn faded.

These match what Mech does with the same text.

## Ward's handbook scripts

The **Handbook script** menu holds all 61 Mech scripts from mech.fed.wiki, as they were in October 2026. Choosing one replaces the script; Undo brings yours back. Several are Ward's tests and are meant to show errors.

## Dropping a wiki page link

Drop a link to a wiki page onto the script, for example from a browser's address bar. Mech Blocks adds `FROM site/slug` at the blue line, ready to hold the blocks that use that page. This has not yet been tried with links dragged from a FedWiki page itself.

## Copy block catalog

**Copy block catalog** copies the list Mech Blocks uses: every block, what it needs, what it makes and what it may hold, as JSON. It was built by reading Ward's code. It is offered to Ward as a list Mech could carry itself, so that tools like this one would not have to work it out.

## Running a script

Mech Blocks does not run scripts. To run one:

1. Click **Copy Mech text**.
2. On a FedWiki page, on a site where the Mech plugin is installed, add a Mech item, or double-click an existing one.
3. Paste the text and click outside the item to save.
4. Click ▶ on the page.

## What it does not do

- It does not run Mech, so it shows no live results.
- It cannot check what CODE functions or PLUGIN blocks do.
- It cannot know whether a site answers, a page exists or a neighborhood has pages, until the script runs.
- It is not yet a FedWiki plugin. It is a standalone page for exploring the idea.

## For developers

The checks and the text conversion are plain functions inside the page. `node tools/test-mech-blocks.js` runs more than 5,500 checks against them. They cover every handbook script coming back byte for byte, nesting exactly as Ward's interpreter does, over 1,400 block moves, the fit rule, the blue line and the lamps.

*Marc Pierson and Claude Opus 5.5 · October 2026*
