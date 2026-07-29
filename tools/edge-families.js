// edge-families.js — the shared RELATION vocabulary. Sibling of families.js.
//
// A .js file, not .json, for the same reason families.js is: fetch() cannot read
// a file:// URL, so a JSON sidecar silently loses every family when a tool is
// opened straight off disk. A <script> tag has no such restriction.
//
// This is the ONE source. Edit it here; there is no .json twin to drift from.
// substrate/seed.py parses this file to build :LinkFamily nodes — the database
// holds a GENERATED copy. Editing relation families in the Neo4j Browser is
// never correct. Edit here and re-run the seed.
//
// WHY THIS EXISTS: a harvest of every graph JSON in ~/rcn found 202 distinct
// edge labels across 375 edges, 115 used exactly once, with create/creates,
// support/supports/Supports and constitute/constitutes already drifting apart.
// Two people drawing the same relation landed on different strings, so nothing
// merged and no edge ever went gold.
//
// HOW IT IS MEANT TO BE USED — read this before adding a channel:
// The family is DECLARED, not drawn. A drawing keeps whatever local styling
// reads loudest for its own group (neighborhood-cave-drawing.json tells two
// kinds apart with colour AND width AND dash — three redundant channels for two
// distinctions, which is why it reads across a room). The family rides on the
// legend entry as data, and can optionally be shown as WORDS on the edge.
// Do not spend a visual channel on seven families; the reader loses.
//
// *** fallbackStyle NEVER OVERRIDES A USER'S EDGE ATTRIBUTES. ***
// It is nested under its own key precisely so it cannot be spread onto a legend
// row or an edge by accident. Declaring a family changes no colour, no width,
// no dash, no marker — today nothing reads these values at all. They exist only
// for a possible future opt-in that renders UNSTYLED edges (a dense composite
// nobody hand-lettered a legend for), and if that is ever built it must be an
// explicit toggle that is OFF by default. An author's own styling always wins.
//
// Everything below the first line is plain JSON.
window.EDGE_FAMILIES_DATA =
{
  "_comment": "Seven relation families. A relation belongs to exactly one. 'verbs' are a mapping aid for proposing a family from an author's free text — NOT a closed set. The author's own words always stay in the edge label; linkFamily is added, never substituted.",
  "order": [
    "Influence",
    "Provision",
    "Composition",
    "Classification",
    "Transformation",
    "Agency",
    "Sequence"
  ],
  "families": {
    "Influence": {
      "gloss": "changes the level of",
      "note": "Incremental. More of A, somewhat more (or less) of B. Polarity says which way. The CLD workhorse.",
      "fallbackStyle": { "marker": "arrow-open", "dash": "solid", "width": 1.5 },
      "transitive": false,
      "verbs": ["create", "creates", "drive", "drives", "amplify", "amplifies", "undermine", "undermines", "erode", "erodes", "catalyze", "catalize", "dampen", "intensify", "intensifies", "accelerates", "stimulates", "modify", "shapes", "deepens", "cultivates", "strengthens", "weakens", "perpetuates", "penalizes", "prioritizes"]
    },
    "Provision": {
      "gloss": "supplies what it depends on",
      "note": "Structural, not incremental. If A stops, B stops. 'The grant funds the program' is not 'the grant increases the program' — only this family tells you what collapses when funding is cut.",
      "fallbackStyle": { "marker": "arrow-open", "dash": "dashed", "width": 1.5 },
      "transitive": false,
      "verbs": ["support", "supports", "require", "requires", "pay for", "pays for", "use", "uses", "offer", "offers", "ground", "grounds", "steward", "hold up", "holds them up", "enable", "enables", "facilitate", "facilitates", "sustains", "fuels", "frees", "available", "limited"]
    },
    "Composition": {
      "gloss": "is part of",
      "note": "Transitive — walking this chain assembles a whole. One of the two candidates for a genuinely typed Neo4j relationship.",
      "fallbackStyle": { "marker": "diamond-filled", "dash": "solid", "width": 1.5 },
      "transitive": true,
      "verbs": ["encompass", "encompasses", "aggregate", "aggregates", "aggregates up", "constitute", "constitutes", "comprise", "comprises", "part of", "contains", "localize", "distributes down"]
    },
    "Classification": {
      "gloss": "is a kind of",
      "note": "Transitive — walking this chain finds a supertype. Never traverse it together with Composition; the two answer different questions.",
      "fallbackStyle": { "marker": "triangle-open", "dash": "solid", "width": 1.5 },
      "transitive": true,
      "verbs": ["is a", "is a type of", "generalize", "generalizes", "instantiate", "instance of", "express as", "expressed as", "realise in", "realised in", "realizes", "embodies", "expresses", "contextualize"]
    },
    "Transformation": {
      "gloss": "becomes / yields",
      "note": "Substance moves or converts from A to B. Carries quantity. SFD flows and eVSM value streams live here.",
      "fallbackStyle": { "marker": "triangle-filled", "dash": "solid", "width": 2.0 },
      "transitive": false,
      "verbs": ["yield", "yields", "produce", "produces", "generate", "generates", "lead to", "lead_to", "leads_to", "leads to", "consume", "consumed by", "flow to", "develops", "builds", "evolves into", "emerges through"]
    },
    "Agency": {
      "gloss": "acts in",
      "note": "A person or organisation plays a part in B. OPM's Agent and Instrument roles.",
      "fallbackStyle": { "marker": "circle-filled", "dash": "solid", "width": 1.5 },
      "transitive": false,
      "verbs": ["play", "plays", "enroll", "enrolls", "oversee", "oversees", "operate in", "operate_in", "handle", "handles", "participate", "participates", "inhabit", "inhabits", "enliven", "guide", "guides", "define", "codetermine", "seek"]
    },
    "Sequence": {
      "gloss": "then",
      "note": "A comes before B in a procedure. Carries a branch guard in `condition` — 'yes', '>85%', 'escalate'. Overlaps the timing layer on purpose; kept to learn from use.",
      "fallbackStyle": { "marker": "arrow-open", "dash": "solid", "width": 1.0 },
      "transitive": false,
      "verbs": ["then", "next", "start", "starts clock", "clock out", "time out", "escalate", "review", "confirm", "state", "scope"]
    }
  }
}
