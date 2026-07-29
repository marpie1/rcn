// graph-sets.js — sidecar for graph-composer.html.
//
// A .js file, not .json, so it loads over file:// as well as http://.
// fetch() cannot read a file:// URL — Chrome throws TypeError: Failed to
// fetch — so a JSON sidecar silently left every node grey when the tool was
// opened straight off disk. A <script> tag has no such restriction. Same
// pattern as rcn-icons.js and rcn_static_data.js.
//
// This is the ONE source. Edit it here; there is no .json twin to drift from.
// Everything below the first line is plain JSON.
window.GRAPH_SETS_DATA =
{
  "_comment": "Named sets of subgraphs the Composer can load in one click. Nothing here is special to any one schema -- add a set by adding an entry. 'dir' is relative to the folder holding graph-composer.html. HTTP cannot list a directory, so the filenames have to be written down; this is the one place to register a new subgraph.",
  "sets": [
    {
      "name": "EIP aspects \u2014 from the substrate",
      "dir": "/projection/subgraph",
      "note": "The same 16 drawings, read live from Neo4j instead of from files. A subgraph is not stored there \u2014 it is a filter on provenance (WHERE 'org' IN c.sources), so the drawings and their union are the same rows read two ways. Needs substrate/api.py on 8768; unavailable over file://, which is why the file sets stay.",
      "files": [
        "action", "affect", "asset", "commitment", "conversation", "culture",
        "function-objective", "motivation", "org", "person", "place", "power",
        "problem", "purpose", "role", "solution"
      ]
    },
    {
      "name": "EIP aspects — variabilized",
      "dir": "eip-aspects-variabilized",
      "note": "The 16 curated EIP subgraphs with humanised variable labels and CLD signs.",
      "files": [
        "action.json",
        "affect.json",
        "asset.json",
        "commitment.json",
        "conversation.json",
        "culture.json",
        "function-objective.json",
        "motivation.json",
        "org.json",
        "person.json",
        "place.json",
        "power.json",
        "problem.json",
        "purpose.json",
        "role.json",
        "solution.json"
      ]
    },
    {
      "name": "EIP aspects — original",
      "dir": "eip-aspects",
      "note": "The same 16 with bare one-word concept labels. Composes to the schema skeleton.",
      "files": [
        "action.json",
        "affect.json",
        "asset.json",
        "commitment.json",
        "conversation.json",
        "culture.json",
        "function-objective.json",
        "motivation.json",
        "org.json",
        "person.json",
        "place.json",
        "power.json",
        "problem.json",
        "purpose.json",
        "role.json",
        "solution.json"
      ]
    }
  ]
};
