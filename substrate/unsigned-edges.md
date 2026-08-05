# The unsigned edges — ERD/CLD conflicts, not gaps

For Marc and Kerry. Rewritten 2026-08-05 after Marc identified what these actually are.

## Correction to the previous version of this file

An earlier version called seven of these "transcription slips — read the verb aloud and pick the direction". **That was wrong.** They are not slips. They are the places where an entity-relationship reading and a causal reading of the same pair genuinely run in opposite directions, and the person variabilizing the ERD into a CLD left them blank rather than force a false choice.

The evidence is a rule, not a tendency. Across the 16 drawings, an edge carries a sign **if and only if** its ERD direction and its causal direction agree:

| | agrees with the CLD | reversed | not in the CLD |
|---|---|---|---|
| **signed** | 46 | 1 | 0 |
| **unsigned** | 0 | 9 | 5 |

The single signed-and-reversed exception was introduced by Claude Code on 2026-07-29 and has since been reverted. The original author's work is 46 for 46.

**So a blank here is not an omission. It is a marked conflict** — the author telling you that these two concepts stand in a structural relation one way and a causal relation the other way.

## What to do with them

Do not choose a direction. **Keep both**, as two edges:

```
Org --exists_for--> Purpose      an org exists for a purpose        STRUCTURAL, no polarity
Purpose --(+)--> Org             coherence of purpose raises
                                 effectiveness of org               CAUSAL, signed
```

Polarity belongs only to causal edges. A structural edge with no sign is complete, not broken — `Org constitutes Role` has no `+` or `−` because it is not that kind of statement.

---

## A. The 10 ERD/CLD conflicts — add the causal edge, keep the structural one

The CLD already supplies the direction and the sign for each. Nothing here needs inventing; it needs confirming.

| drawing | the ERD relation (keep, unsigned) | the causal edge to ADD |
|---|---|---|
| `asset` | Effectiveness of ORG —steward→ Value of ASSETS | Value of ASSETS —(+)→ Effectiveness of ORG |
| `commitment` | PERSON Participation —make→ COMMITMENT | COMMITMENT —(+)→ PERSON Participation |
| `culture` | Belongingness of CULTURE —offer→ Coherence of VALUES | Coherence of VALUES —(+)→ Belongingness of CULTURE |
| `org` | Coherence of VALUES —creates→ Effectiveness of ORG | Effectiveness of ORG —(+)→ Coherence of VALUES |
| `org` | Effectiveness of ORG —constitutes→ Effectiveness in ROLE | Effectiveness in ROLE —(+)→ Effectiveness of ORG |
| `org,purpose` | Effectiveness of ORG —exists_for→ Coherence of PURPOSE | Coherence of PURPOSE —(+)→ Effectiveness of ORG |
| `person` | PERSON Participation —experience→ MOTIVATION | MOTIVATION —(+)→ PERSON Participation |
| `place` | Beauty of PLACE —support→ PERSON Participation | PERSON Participation —(+)→ Beauty of PLACE |
| `role` | Effectiveness of ORG —constitute→ Effectiveness in ROLE | Effectiveness in ROLE —(+)→ Effectiveness of ORG |
| `solution` | Q of RESULT —yield→ Effectiveness of Proposed SOLUTION | Effectiveness of Proposed SOLUTION —(+)→ Q of RESULT |

## B. The 5 the CLD does not have — genuinely open

No causal reading exists yet for these. They may be structural-only, or they may need a causal edge nobody has drawn.

| drawing | relation | family |
|---|---|---|
| `action` | MOTIVATION —consider→ Effectiveness of ACTION | — |
| `commitment` | COMMITMENT —for→ Q of RESULT | — |
| `conversation` | Effectiveness of CONVERSATION —for→ Effectiveness of ACTION | — |
| `conversation` | Effectiveness of CONVERSATION —leads_to→ Q of RESULT | Transformation |
| `solution` | Effectiveness of Proposed SOLUTION —resolve→ Seriousness of PROBLEM | — |

## C. The 2 merge artefacts — not decisions

These are self-loops only because two placements of one concept were merged. In the source file they run between two different nodes. Nobody drew a self-loop.

| drawing | apparent self-loop |
|---|---|
| `org` | Achievability of GOALS & OBJECTIVES —require→ Achievability of GOALS & OBJECTIVES |
| `org` | Effectiveness of ORG —relate_with→ Effectiveness of ORG |

See `substrate/ROUND-TRIP.md` §8 and `eip-cld-subgraph-mismatches.md` group 2.
