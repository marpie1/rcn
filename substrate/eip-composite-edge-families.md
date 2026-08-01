# EIP composite — 22 edges with no relation family

For Marc and Kerry. Generated from `composite26` after loading the signed 26-node CLD. Sibling of `tools/eip-cld-subgraph-mismatches.md`.

35 of 57 edges took a family from the author's own wording, matched against the verb lists in `tools/edge-families.js`. These 22 did not. **Nothing here has been guessed** — an unmatched edge is left null rather than assigned a plausible family, for the same reason the mismatches file leaves its 23 items open: a wrong family that nobody can see is worse than a gap that everybody can.

Assign in graph-tool with the legend picker, or say the word and I will apply a list. The `Aa Text` toggle in **both** mode shows label and family together, which is the mode this list is meant to be worked in.

## Assigned so far

| family | edges |
|---|---|
| **(none — this list)** | 22 |
| Agency | 11 |
| Influence | 8 |
| Provision | 6 |
| Composition | 4 |
| Transformation | 4 |
| Classification | 2 |

## The 22

| # | from | verb | to | polarity |
|---|---|---|---|---|
| 1 | COMMITMENT | `to` | PERSON Participation | `+` |
| 2 | COMMITMENT | `for` | Effectiveness of ACTION | `+` |
| 3 | Effectiveness of CONVERSATION | `for` | COMMITMENT | `+` |
| 4 | Effectiveness of CONVERSATION | `for` | POSSIBILITY | `+` |
| 5 | Effectiveness of CONVERSATION | `for` | TRUST | `+` |
| 6 | TRUST | *(no label)* | POSSIBILITY | `+` |
| 7 | POSSIBILITY | *(no label)* | COMMITMENT | `+` |
| 8 | TRUST | *(no label)* | COMMITMENT | `+` |
| 9 | Coherence of PURPOSE | `exists_for` | Effectiveness of ORG | `+` |
| 10 | Effectiveness of ACTION | `address` | Seriousness of PROBLEM | `-` |
| 11 | MOTIVATION | `power` | Effectiveness in ROLE | `+` |
| 12 | PERSON Participation | `take` | Effectiveness of ACTION | `+` |
| 13 | MOTIVATION | *(no label)* | Effectiveness of CONVERSATION | `+` |
| 14 | Negative AFFECT | *(no label)* | MOTIVATION | `-` |
| 15 | MOTIVATION | `power` | PERSON Participation | `+` |
| 16 | Coherence of IDEALS | *(no label)* | Belongingness of CULTURE | `+` |
| 17 | Q of RESULT | *(no label)* | Value of ASSETS | `+` |
| 18 | Q of RESULT | *(no label)* | Seriousness of PROBLEM | `-` |
| 19 | Effectiveness of CONVERSATION | *(no label)* | Effectiveness of Proposed SOLUTION | `+` |
| 20 | Effectiveness of Proposed SOLUTION | *(no label)* | Effectiveness of ACTION | `+` |
| 21 | Achievability of GOALS & OBJECTIVES | *(no label)* | Effectiveness of Proposed SOLUTION | `+` |
| 22 | Beauty of PLACE | *(no label)* | Belongingness of CULTURE | `+` |

## Note on the blank ones

Several carry no label at all. Those cannot be suggested from wording by any method — they need a person who knows what the arrow meant. They are also the edges most likely to have lost their meaning already.
