# The 16 unsigned edges — a working list

For Marc and Kerry. Generated 2026-07-28 from `aspects16`, after the `role`
`constitute` edge was signed through the tool (17 → 16).

## These are not 16 small fixes. They are the mismatches doc, seen from the other side.

Every one of the 16 unsigned edges is an unresolved item in
`tools/eip-cld-subgraph-mismatches.md`. Not approximately — exactly:

| | unsigned edges found here | mismatches doc |
|---|---|---|
| the CLD signs it, **reversed** | 9 | group 1 — 9 direction disagreements |
| the CLD does not have it | 7 | group 2 — 7 in subgraphs, absent from CLD |
| the CLD signs it, same direction | **0** | — |

**Zero** unsigned edges agree with the CLD's direction. The missing sign and the
unresolved direction are the same fact: where the two drawings disagreed, nobody
ever committed to a sign. So for the 9 reversed ones, **setting the sign without
settling the direction is the wrong order** — in a CLD the arrow decides which
feedback loops exist, and a sign on a backwards arrow is a confident wrong answer.

## How to fix one

1. Open the drawing: `http://localhost:8768/tools/graph-tool-v22.html?url=/projection/subgraph/<name>`
2. Click **`?± Gaps`** — every unsigned edge gets a `?`
3. Click the edge → **PROPERTIES** → **Polarity + / − / ∅**
4. Alt+click the edge to flip its direction, if you settle that too
5. Click **→ Substrate** — writes the database *and* the source file

---

## `action` — 1 unsigned

<http://localhost:8768/tools/graph-tool-v22.html?url=/projection/subgraph/action>

| from | verb | to | what the CLD says |
|---|---|---|---|
| MOTIVATION | `consider` | Effectiveness of ACTION | not in the CLD at all |

## `asset` — 1 unsigned

<http://localhost:8768/tools/graph-tool-v22.html?url=/projection/subgraph/asset>

| from | verb | to | what the CLD says |
|---|---|---|---|
| Effectiveness of ORG | `steward` | Value of ASSETS | **`+` but REVERSED** — CLD draws `Asset` → `Org` as *steward* |

## `commitment` — 2 unsigned

<http://localhost:8768/tools/graph-tool-v22.html?url=/projection/subgraph/commitment>

| from | verb | to | what the CLD says |
|---|---|---|---|
| COMMITMENT | `for` | Q of RESULT | not in the CLD at all |
| PERSON Participation | `make` | COMMITMENT | **`+` but REVERSED** — CLD draws `Commitment` → `Person` as *to* |

## `conversation` — 2 unsigned

<http://localhost:8768/tools/graph-tool-v22.html?url=/projection/subgraph/conversation>

| from | verb | to | what the CLD says |
|---|---|---|---|
| Effectiveness of CONVERSATION | `for` | Effectiveness of ACTION | not in the CLD at all |
| Effectiveness of CONVERSATION | `leads_to` | Q of RESULT | not in the CLD at all |

## `culture` — 1 unsigned

<http://localhost:8768/tools/graph-tool-v22.html?url=/projection/subgraph/culture>

| from | verb | to | what the CLD says |
|---|---|---|---|
| Belongingness of CULTURE | `offer` | Coherence of VALUES | **`+` but REVERSED** — CLD draws `Value` → `Culture` as *offer* |

## `org` — 5 unsigned

<http://localhost:8768/tools/graph-tool-v22.html?url=/projection/subgraph/org>

| from | verb | to | what the CLD says |
|---|---|---|---|
| Achievability of GOALS & OBJECTIVES | `require` *(self-loop)* | Achievability of GOALS & OBJECTIVES | not in the CLD at all |
| Coherence of VALUES | `creates` | Effectiveness of ORG | **`+` but REVERSED** — CLD draws `Org` → `Value` as *creates* |
| Effectiveness of ORG | `relate_with` *(self-loop)* | Effectiveness of ORG | not in the CLD at all |
| Effectiveness of ORG | `constitutes` | Effectiveness in ROLE | **`+` but REVERSED** — CLD draws `Role` → `Org` as *constitute* |
| Effectiveness of ORG | `exists_for` | Coherence of PURPOSE | **`+` but REVERSED** — CLD draws `Purpose` → `Org` as *exists_for* |

## `person` — 1 unsigned

<http://localhost:8768/tools/graph-tool-v22.html?url=/projection/subgraph/person>

| from | verb | to | what the CLD says |
|---|---|---|---|
| PERSON Participation | `experience` | MOTIVATION | **`+` but REVERSED** — CLD draws `Motivation` → `Person` as *power* |

## `place` — 1 unsigned

<http://localhost:8768/tools/graph-tool-v22.html?url=/projection/subgraph/place>

| from | verb | to | what the CLD says |
|---|---|---|---|
| Beauty of PLACE | `support` | PERSON Participation | **`+` but REVERSED** — CLD draws `Person` → `Place` as *inhabit* |

## `solution` — 2 unsigned

<http://localhost:8768/tools/graph-tool-v22.html?url=/projection/subgraph/solution>

| from | verb | to | what the CLD says |
|---|---|---|---|
| Effectiveness of Proposed SOLUTION | `resolve` | Seriousness of PROBLEM | not in the CLD at all |
| Q of RESULT | `yield` | Effectiveness of Proposed SOLUTION | **`+` but REVERSED** — CLD draws `Solution` → `Result` as *yield* |

---

## A second thing this list turned up

**`constitute` and `constitutes` are two edges in the substrate, and neither can
ever go gold.**

```
Org -> Role   constitute    polarity +      sources ['role']
Org -> Role   constitutes   polarity none   sources ['org']
```

Same relation. Two people spelled the verb differently, and the edge merge key
is `(source, target, label)` — so the raw verb splits one relation in two. The
mismatches doc already flagged this pair (item 5: *sub `constitute/constitutes`*).
`create`/`creates` is the same story.

This is the edge-level twin of the `Active Goal` / `ActiveGoal` node bug that
`canon()` fixes: **a merge key that does not normalise is not a merge key.** The
node key normalises whitespace; the edge key does not normalise the verb at all.

The fix is to normalise the verb for merging while keeping the author's spelling
as the label — the same shape as `canon()`, and consistent with `linkFamily`
being the thing that actually merges. It is a decision because two genuinely
different verbs could in principle collapse; in this corpus only these two pairs
collide, and both should.

Marc's call.
