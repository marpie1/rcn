# EIP: where the CLD and the aspect subgraphs disagree

For Marc and Kerry. Generated 2026-07-28 from `tools/eip-schema-cld.json`
(the finished signed CLD, 26 nodes / 57 edges) against the 16 files in
`tools/eip-aspects-variabilized/` (58 distinct edges).

42 of 58 subgraph edges matched the CLD and inherited its sign. These 31 did not.
Nothing here has been guessed at — every item needs a human decision.

---

## 1. Direction disagreements (9)

The same relation exists in both, pointing opposite ways. These matter most:
in a CLD the arrow direction determines the loop structure, so a reversed
edge does not merely mislabel — it changes which feedback loops exist.

Four use the *identical verb*, which makes a transcription slip more likely
than a genuine disagreement. (There is precedent: commit 6796303 was
"stop edges reversing by accident".)

| # | subgraph says | CLD says | verb |
|---|---|---|---|
| 1 | `Beauty of PLACE` --support--> `PERSON Participation` | `PERSON Participation` --inhabit(+)--> `Beauty of PLACE` | sub `support` / CLD `inhabit` |
| 2 | `Belongingness of CULTURE` --offer--> `Coherence of VALUES` | `Coherence of VALUES` --offer(+)--> `Belongingness of CULTURE` | **same verb** |
| 3 | `Coherence of VALUES` --creates--> `Effectiveness of ORG` | `Effectiveness of ORG` --creates(+)--> `Coherence of VALUES` | **same verb** |
| 4 | `Effectiveness of ORG` --exists_for--> `Coherence of PURPOSE` | `Coherence of PURPOSE` --exists_for(+)--> `Effectiveness of ORG` | **same verb** |
| 5 | `Effectiveness of ORG` --constitute/constitutes--> `Effectiveness in ROLE` | `Effectiveness in ROLE` --constitute(+)--> `Effectiveness of ORG` | sub `constitute/constitutes` / CLD `constitute` |
| 6 | `Effectiveness of ORG` --steward--> `Value of ASSETS` | `Value of ASSETS` --steward(+)--> `Effectiveness of ORG` | **same verb** |
| 7 | `PERSON Participation` --make--> `COMMITMENT` | `COMMITMENT` --to(+)--> `PERSON Participation` | sub `make` / CLD `to` |
| 8 | `PERSON Participation` --experience--> `MOTIVATION` | `MOTIVATION` --power(+)--> `PERSON Participation` | sub `experience` / CLD `power` |
| 9 | `Q of RESULT` --yield--> `Effectiveness of Proposed SOLUTION` | `Effectiveness of Proposed SOLUTION` --yield(+)--> `Q of RESULT` | **same verb** |

**Decide:** which direction is right for each. The CLD's sign travels with it.

## 2. In the subgraphs, absent from the CLD (7)

Still unsigned in the composite — they appear as dotted edges.

| # | edge | verb | from file |
|---|---|---|---|
| 1 | `Achievability of GOALS & OBJECTIVES` → `Achievability of GOALS & OBJECTIVES`  *(self-loop)* | require | org |
| 2 | `COMMITMENT` → `Q of RESULT` | for | commitment |
| 3 | `Effectiveness of CONVERSATION` → `Effectiveness of ACTION` | for | conversation |
| 4 | `Effectiveness of CONVERSATION` → `Q of RESULT` | leads_to | conversation |
| 5 | `Effectiveness of ORG` → `Effectiveness of ORG`  *(self-loop)* | relate_with | org |
| 6 | `Effectiveness of Proposed SOLUTION` → `Seriousness of PROBLEM` | resolve | solution |
| 7 | `MOTIVATION` → `Effectiveness of ACTION` | consider | action |

**Decide:** add to the CLD with a sign, or drop from the subgraphs.
The two self-loops are worth a second look — they may be artefacts of merging.

## 3. In the CLD, absent from every subgraph (7)

Signed relations the aspect drawings never recorded.

| # | edge | verb | sign |
|---|---|---|---|
| 1 | `Achievability of GOALS & OBJECTIVES` → `Effectiveness of Proposed SOLUTION` | — | `+` |
| 2 | `Effectiveness of CONVERSATION` → `Effectiveness of Proposed SOLUTION` | — | `+` |
| 3 | `Effectiveness of Proposed SOLUTION` → `Effectiveness of ACTION` | — | `+` |
| 4 | `MOTIVATION` → `Effectiveness of CONVERSATION` | — | `+` |
| 5 | `Q of RESULT` → `Seriousness of PROBLEM` | — | `-` |
| 6 | `Q of RESULT` → `Value of ASSETS` | — | `+` |
| 7 | `SIDE EFFECT` → `Seriousness of PROBLEM` | creates | `+` |

**Decide:** which aspect subgraph each belongs in, or accept that the CLD
carries relations no single aspect owns.

---

## Note on `Q of RESULT → Seriousness of PROBLEM`

This is one of only three negative links in the whole CLD, and it is in
group 3 — no subgraph has it. Worth placing deliberately rather than letting
it live only in the CLD.

