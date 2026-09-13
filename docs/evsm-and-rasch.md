# eVSM and Rasch

Can data from eVSM surveys be turned into measurements? A first look, using the seven artificial Neighborhood Development Center responses written for the aggregator in March 2026, run through the RCN Rasch tool on 13 September 2026. Every number here is the tool's output on that data.

**Short answer: yes for the eleven spheres, no for the relationships as currently collected, and the reason for the no is a survey-design fix rather than a statistical one.**

## What an eVSM response looks like to Rasch

An eVSM response is 77 assessments: 11 spheres rated *go / caution / stop / unsure*, and 66 directed relationships rated *agree / disagree / unknown*, each with free-text evidence. Across respondents that is a person-by-item matrix, which is what Rasch wants — with two wrinkles.

The first is that the spheres are a three-step scale and the relationships are two-step. The tool's rating-scale model needs every item on one scale, so spheres and relationships are two separate analyses, not one. Coded for the tool: stop = 0, caution = 1, go = 2, unsure = blank (missing, not imputed); disagree = 0, agree = 1, unknown = blank.

The second wrinkle is the interesting one.

## In a single-organization survey, the person is the rater

Rasch places persons and items on one ruler. In a badge ledger the person is the thing being measured. In an eVSM survey of one neighborhood, every respondent is rating the *same* object, so the roles invert:

- **Item difficulty** becomes *how hard it is to call this sphere "go"* — the sphere's weakness, on an interval scale, corrected for who happened to answer.
- **Person ability** becomes *rater generosity* — how readily this resident says "go".
- **Item misfit** becomes *a contested sphere* — residents disagree about it in a way their general optimism does not explain.
- **Person misfit** becomes *a resident whose pattern breaks the consensus ordering* — one specific rating worth reading the evidence for.
- **Thresholds** say whether stop / caution / go is being used as a real three-step scale.

This is a two-facet Rasch analysis, rater × item, with the organization facet fixed at one. The tool does it as it stands; the only change is the labels — *resident* and *sphere* instead of *person* and *skill*.

## The seven artificial responses, spheres only

Seven residents of the Generic Neighborhood Development Center, eleven spheres. The CSV, ready to paste into the tool:

```
resident,Coordination Across The neighborhood,Involvement,Tools And Workspaces,Awareness Within The neighborhood,Quality Of Learning And Change,Ability To Get Things Done Within The neighborhood,Resources (Finance),Quality Of Neighborhood Planning,Awareness Beyond The neighborhood,Leadership In The neighborhood,Culture
Rosa,1,2,1,2,1,1,0,1,1,2,2
James,0,1,0,1,0,0,0,0,1,1,1
Priya,1,2,2,1,2,1,1,1,2,1,2
DeShawn,1,2,1,2,2,2,0,1,1,2,2
Elena,2,2,1,2,1,1,1,1,2,2,2
Tom,1,1,0,1,1,1,1,0,1,1,1
Keisha,1,2,2,1,2,1,0,0,2,1,2
```

The tool chose the Andrich rating-scale model (three categories) and converged in 62 iterations.

<!--WRIGHT-MAP-->

Residents on the left, more generous above. Spheres on the right, weaker above. The one red bar is a sphere residents disagree about; the hollow bar is the weakest sphere, whose fit rests on too few "go" responses to read.

### The neighborhood's profile, rater-corrected

| Sphere | Steps up, of 14 | Measure | Infit | Outfit | Reading |
|---|---|---|---|---|---|
| Resources (Finance) | 3 | +5.58 | 1.67 | 5.63 | Weakest by a wide margin. Fit provisional — only 3 steps up |
| Quality of Neighborhood Planning | 4 | +4.61 | 0.67 | 0.41 | Second weakest. Provisional |
| Coordination Across the Neighborhood | 7 | +0.76 | 0.54 | 0.43 | Middle; behaves |
| Tools and Workspaces | 7 | +0.76 | 1.96 | 2.24 | **Contested** — see below |
| Ability to Get Things Done | 7 | +0.76 | 0.75 | 0.65 | Middle; behaves |
| Quality of Learning and Change | 9 | −0.71 | 1.13 | 1.06 | Behaves |
| Awareness Within the Neighborhood | 10 | −1.42 | 0.96 | 0.84 | Strong |
| Awareness Beyond the Neighborhood | 10 | −1.42 | 0.96 | 0.84 | Strong |
| Leadership in the Neighborhood | 10 | −1.42 | 0.96 | 0.84 | Strong |
| Involvement | 12 | −3.74 | 0.19 | 0.10 | Near-universal "go" |
| Culture | 12 | −3.74 | 0.19 | 0.10 | Near-universal "go" |

"Steps up" is the item score: each *caution* is one step above *stop*, each *go* is two, so seven residents give a maximum of 14. Measures are in logits; the sphere mean is zero by construction.

The ordering is what an average of statuses would also give. What the average cannot give is the *spacing* — Finance is not merely last, it is a full logit beyond Planning and five beyond the middle group — and the two diagnostics that follow.

### The contested sphere

*Tools and Workspaces* has infit 1.96 and outfit 2.24 on adequate data. Residents disagree about it beyond what their general generosity explains. Tom, in his seventies and a lifelong resident, rated it *stop*: "I don't understand half the tools people are using. The meetings are now on apps I've never heard of." Keisha, a student in her twenties, rated it *go*. A summed or averaged status would have called this sphere *caution* and moved on. Rasch says: this is not a middling sphere, it is a divided one, and the division runs along a line worth naming.

This is the single most useful thing the method adds to eVSM. The aggregator already shows disagreement per item; misfit says which disagreements are *structural* — not explained by some residents being generally harsher — and ranks them.

### The dissenting rater

Tom has outfit 3.64. He rated Tools and Planning *stop* while rating Finance — which every other resident called the worst thing in the neighborhood — only *caution*. His ratings are internally coherent and his evidence explains each one; they simply do not follow the consensus ordering. That is what outfit detects, and the response is to read Tom's evidence, not to discount him.

### Rater generosity

Elena at +3.55 logits down to James at −4.07, who said *stop* on seven of eleven spheres. Rater reliability 0.91, separation 3.20, strata 4.6 — with seven people those numbers are noise, but the ordering is legible and it is the thing a facilitator wants to know before reading the evidence: whose *stop* is a strong signal and whose is Tuesday.

### The scale works

Thresholds −3.33 and +3.33, ordered. *Caution* was used for 39 of the 77 sphere ratings and has a wide region of the ruler where it is the most likely answer. It is a real middle category, not a dead zone between two others. The spacing is exaggerated by the estimator's known bias at small n; the order is what matters, and it is right. This is a confirmation the Likert demo in the tool could not give: go / caution / stop is a scale Rasch can work with as written.

## The relationships cannot be measured as collected

The 66 directed relationships are the bulk of the survey, and as the seven responses stand they are unmeasurable. Each respondent assessed about 12 of 66. Across all seven, 45 distinct relationships appear; **none was assessed by everyone**, and 21 were assessed by exactly one person.

Rasch needs common items across raters to place anything on one ruler. Run on all 77 items together, dichotomised, the matrix falls apart: almost every relationship comes back *everybody* or *nobody*, reliability is 0.00, and the tool reports fewer than one stratum. That is not the method failing. It is the survey telling you the relationship data has no shared structure — each resident chose a different dozen, so there is nothing to compare.

**The fix is a design change.** A fixed core set of relationships that every respondent assesses — the 33 homeostat pairs, or a chosen dozen — with the rest optional. Agree / disagree on a fixed set is a clean dichotomous matrix, and the same rater-and-item reading applies: a contested relationship is one where misfit says residents disagree structurally.

The same point applies to the aggregator's compare mode today: comparing worlds on relationships that different people chose to assess is comparing samples of different things.

## What seven responses license

Nothing anyone would publish. Standard errors on the sphere measures are 0.8 to 1.4 logits, seven of eleven spheres trip the tool's provisional rule, and rater strata of 4.6 is not to be believed. But the diagnostics already work at seven — a contested sphere, a dissenting rater, an honest weakest-sphere ordering with spacing — and those are conversation material for a room, which is what eVSM is for. At twenty to thirty respondents the sphere measures become numbers with usable errors, and at that point they can go on a control chart, survey to survey.

## Across neighborhoods

Comparing Superior to Whatcom on one ruler needs three facets — organization × rater × item — which is many-facet Rasch, the first thing listed as deliberately absent from the tool. An interim route exists now: treat each (neighborhood, resident) pair as a person, run every neighborhood together with the eleven spheres as common items, and compare neighborhood means. It is crude, because it confounds rater generosity with organizational health. It is still more than any summed score can do, because the items are shared and the scale is interval. The sphere set is already identical across NDCs, so the anchoring problem is solved by the survey's own design.

Many-facet Rasch is the right addition when there are two or more neighborhoods with twenty-plus respondents each. Not before.

## Recommendations

1. **Keep go / caution / stop.** It works as a three-step scale. Keep *unsure* as missing.
2. **Fix a core set of relationships that everyone assesses.** Without it the relationship half of the survey cannot be measured or honestly compared.
3. **Aim for twenty to thirty respondents per neighborhood** before treating sphere measures as numbers rather than as a conversation.
4. **Add a Rasch pass to the aggregator's reading** — the contested-sphere list (item misfit, ranked) and the dissenting-rater list (person misfit, with their evidence) are the two outputs a facilitator would use.
5. **Many-facet Rasch when there are two neighborhoods with twenty respondents each,** and not before.

## Sources

The seven responses are `7NDCsofiSurveyResponses.zip` in Downloads, written for the aggregator on 4 March 2026. The real RCN self-assessments in Downloads (five usable, spheres only) are too few for numbers but would answer one question worth asking: whether RCN's own contested sphere is the same one.
