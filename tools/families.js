// families.js — sidecar for graph-composer.html.
//
// A .js file, not .json, so it loads over file:// as well as http://.
// fetch() cannot read a file:// URL — Chrome throws TypeError: Failed to
// fetch — so a JSON sidecar silently left every node grey when the tool was
// opened straight off disk. A <script> tag has no such restriction. Same
// pattern as rcn-icons.js and rcn_static_data.js.
//
// This is the ONE source. Edit it here; there is no .json twin to drift from.
// Everything below the first line is plain JSON.
window.FAMILIES_DATA =
{
  "_comment": "A supracategorisation: every schemaLabel belongs to exactly one of eight families. Families are invariant under the Composer detail zoom -- a node has a family at family, schema, variable and instance level alike -- which is why colour is keyed to this and not to elaboration count or merge depth, both of which move under the viewer. NOT an EIP construct: the scheme was worked out against the EIP schema and the notes below are lifted verbatim from the _family props in eip-schema-cld.json, which carry the argument for each assignment, but it is meant to be used across diagram types. Concepts are keyed spacelessly (ActiveGoal, SideEffect) because sources disagree about the spaces.",
  "_palette": "Two paired ramps. 'color' is the saturated family hue and rides the node BORDER; 'fill' is a pale tint of the same hue and fills the node. Node text is always black -- the Composer's own CSS forces it with #canvas .node text{fill:#000!important}, so a per-family fontColor could never reach the screen -- which is why the fill has to be pale. Worst black-on-fill contrast 12.7:1. That leaves the fills too washed out to tell 8 families apart (pale tints lose chroma and Issue/Resource collapse to dE 3.2), so discrimination moved to the ring, which is measured: Okabe-Ito with black->violet #6a3d9a and yellow->maroon #96203f, validated all-pairs on surface #f5f4f1 -- lightness PASS, chroma PASS, normal-vision floor PASS (worst 15.6), CVD separation WARN (worst 6.9 deutan, violet/blue), inside the 6-8 band that is legal only alongside secondary encoding. Node labels, the legend and the family zoom level supply it. Border WIDTH is independent and still carries merge depth.",
  "order": [
    "Setting",
    "Institution",
    "Aim",
    "Doing",
    "Outcome",
    "Issue",
    "Resource",
    "Person"
  ],
  "families": {
    "Setting": {
      "color": "#009e73",
      "fontColor": "#000000",
      "members": [
        "Culture",
        "Ecology",
        "Place"
      ],
      "fill": "#9edaca"
    },
    "Institution": {
      "color": "#0072b2",
      "fontColor": "#000000",
      "members": [
        "Government",
        "Org",
        "Role"
      ],
      "fill": "#b8d8e9"
    },
    "Aim": {
      "color": "#6a3d9a",
      "fontColor": "#000000",
      "members": [
        "ActiveGoal",
        "Ideal",
        "Objective",
        "Purpose",
        "Value"
      ],
      "fill": "#d5c9e3"
    },
    "Doing": {
      "color": "#e69f00",
      "fontColor": "#000000",
      "members": [
        "Action",
        "Commitment",
        "Conversation",
        "Possibility",
        "Trust"
      ],
      "fill": "#f6db9e"
    },
    "Outcome": {
      "color": "#56b4e9",
      "fontColor": "#000000",
      "members": [
        "Result",
        "Solution"
      ],
      "fill": "#bfe2f7"
    },
    "Issue": {
      "color": "#96203f",
      "fontColor": "#000000",
      "members": [
        "Problem",
        "SideEffect"
      ],
      "fill": "#e2c1c9"
    },
    "Resource": {
      "color": "#cc79a7",
      "fontColor": "#000000",
      "members": [
        "Asset",
        "Power"
      ],
      "fill": "#ecccde"
    },
    "Person": {
      "color": "#d55e00",
      "fontColor": "#000000",
      "members": [
        "Affect",
        "Motivation",
        "Person"
      ],
      "fill": "#efc29e"
    }
  },
  "concepts": {
    "Action": {
      "family": "Doing",
      "note": "the act itself."
    },
    "ActiveGoal": {
      "family": "Aim",
      "note": "the nearest of the Aims to being acted on."
    },
    "Affect": {
      "family": "Person",
      "note": "part of the acting self — what is felt, ahead of what pushes."
    },
    "Asset": {
      "family": "Resource",
      "note": "accumulated and held by an Institution."
    },
    "Commitment": {
      "family": "Doing",
      "note": "the end of the conversation chain and the start of acting."
    },
    "Conversation": {
      "family": "Doing",
      "note": "the head of the chain that ends in Commitment."
    },
    "Culture": {
      "family": "Setting",
      "note": "a medium, not an institution — Place shapes it and it surrounds Person, as Ecology surrounds Place."
    },
    "Ecology": {
      "family": "Setting",
      "note": "a medium you are inside, alongside Place and Culture."
    },
    "Government": {
      "family": "Institution",
      "note": "an organised body. It touches Place the way Org does, from outside."
    },
    "Ideal": {
      "family": "Aim",
      "note": "something aimed at rather than something that acts."
    },
    "Motivation": {
      "family": "Person",
      "note": "inner drive — it pushes rather than being pursued, so it is not an Aim."
    },
    "Objective": {
      "family": "Aim",
      "note": "aimed at, and unusually, it makes demands."
    },
    "Org": {
      "family": "Institution",
      "note": "the organised body the rest of this family hangs off."
    },
    "Person": {
      "family": "Person",
      "note": "the one who acts."
    },
    "Place": {
      "family": "Setting",
      "note": "the ground the other two mediums sit on."
    },
    "Possibility": {
      "family": "Doing",
      "note": "a link in the conversation chain, not something held."
    },
    "Power": {
      "family": "Resource",
      "note": "accumulated over time and drawn on in order to act."
    },
    "Problem": {
      "family": "Issue",
      "note": "what is wrong. An input to the system, not a by-product of it."
    },
    "Purpose": {
      "family": "Aim",
      "note": "the most heavily determined thing aimed at."
    },
    "Result": {
      "family": "Outcome",
      "note": "what comes out. Parent of both the wanted and the unwanted."
    },
    "Role": {
      "family": "Institution",
      "note": "a slot an organised body creates. A person occupies it; they are not it."
    },
    "SideEffect": {
      "family": "Issue",
      "note": "unwanted. Shares a parent with Solution but not a family."
    },
    "Solution": {
      "family": "Outcome",
      "note": "yielded by Result, alongside Side Effect."
    },
    "Trust": {
      "family": "Doing",
      "note": "a link in the conversation chain, not something held."
    },
    "Value": {
      "family": "Aim",
      "note": "aimed at. The only Aim that creates an Institution."
    }
  }
};
