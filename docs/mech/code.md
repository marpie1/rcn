# CODE

CODE runs a JavaScript function that you write in a Code item on the same page. It is the way to try out a new block before it is built into Mech.

The ways CODE can work:

- `CODE` calls the function exported as default.
- `CODE name` calls the function exported as name.
- `CODE name 15 more` also hands the words after the name to the function, as strings.

Click ▶ to run this one. It needs the Code item below it.

```mech
CLICK
 CODE greet world
 REPORT greeting
```

```code
export function greet(who) {
  this.greeting = `Hello ${who}`
  return this.greeting
}
```

## Where the code comes from

Every Code item on the page is joined together, top to bottom, and loaded as one JavaScript module. Helper functions can sit in Code items of their own. Only functions marked `export` can be named by CODE. A Code item can `import` from a full web address, as [[Catalog of Variables]] does to borrow Ward's Graph class.

## What the function can reach

Inside the function, `this` is the Mech state. Reading `this.neighborhood` reads what NEIGHBORS left there. Setting `this.items` hands items to a PREVIEW further down. Shift-click ▶ to see each state the function reads.

`this.context` describes where the Mech is running: the page and its title, site and slug, the Mech item itself, and `this.context.blocks`, the names of every block this copy of Mech knows.

`this.api` lets the function speak through the block the way built-in blocks do:

- `trouble(message)` shows the red ✖︎ with your message.
- `status(text)` shows text after the block, like ⇒ 12 pages.
- `response(text)` adds text after the block.
- `report(html)` replaces what follows the block with your html.
- `graph(nodes, rels)` returns a new Graph, ready to be an aspect for SOLO or PREVIEW graph.
- `body()` returns the lines indented under CODE. Mech does not run them; the function can read them as its own little language.

Whatever the function returns is shown after the block. A function can be `async`, and Mech waits for it.

## Here and there

[[Catalog of Mech Blocks]] uses CODE to check its own completeness. It calls the blocks in the running code `here` and the blocks documented on the page `there`, and reports the difference.

```code
export default function() {
 const docs = this.context.page.story
  .map(item=>item.text.match(/\[\[(.*?)\]\]/))
  .filter(m => m)
  .map(m => m[1])
 const there = new Set(docs)
 const here = new Set(this.context.blocks)
 const need = here.difference(there)
 return `Need ${[...need]}`
}
```

In October 2026 this reports Need CODE,DOWNLOAD. This page and [[DOWNLOAD]] are written to close that gap.

## When it goes wrong

- No export by that name: CODE says Expected export of function "name". A page with no Code item at all gives the same message for "default".
- An error inside the function: CODE shows the message, the line it happened on, and a red ✖︎ at the spot when the browser reports one.
- Curly quotes, dashes, emoji and other characters beyond plain Latin letters stop the code from loading at all, because Mech packs the code with the browser's btoa. Use straight quotes, or write such characters as `—` escapes.

## Who can run it

CODE runs when a person starts it, with CLICK or TICK directly above it, or when the page is your own page on your own site and you are logged in. Otherwise it says This CODE must be run by CLICK or TICK or owned by the logged in user.

The reason is that code travels with forked pages. Reading someone's page should not run their code until you choose to.

The permission from CLICK reaches only the blocks directly inside it. A CODE inside FROM inside CLICK, as in [[Catalog of Variables]], counts as not started by a person, so it runs only for the page's owner. That reading comes from the source, not from Ward; it may be intended.

CODE gives its function all of the state as this, so it can read state.context and anything earlier blocks wrote, and whatever it sets on this becomes state for later blocks. Which keys depends on the function.
