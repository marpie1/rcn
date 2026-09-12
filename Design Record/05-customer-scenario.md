# Section 5 — The Customer Scenario as Origin Object

**State (as of 2026-09-11):** First draft delivered; edited by Marc; full rewrite delivered (two-level scenario distinction, both origination patterns, 14-element template, bid mechanic, Story Structure integration). Awaiting Marc's reactions.

**Provenance:** recovered from the Claude Chat conversation "Organizing local projects into actionable plans" (uuid 2f737cc8-4f75-402d-86b1-8b5b63e99882) via the account data export of 2026-09-11; full transcript at `chat-export/organizing-local-projects.md`. Turn numbers index that transcript. Marc's edits come from the `.pages` files in `sources/`.

**Reading order:** the latest text is the rewrite if there is one, else Marc's edits, else the first draft. Earlier layers are kept so nothing is lost and so the reasoning can be followed.


## First draft — turn 87, 2026-08-31 05:09 UTC
_Claude's preface:_ Drafting Section 5.
### Section 5 — The Customer Scenario as Origin Object

#### Why the customer scenario deserves its own section

Almost no one outside Haier does this. That absence is not incidental; it is why programs come and go while the underlying compound needs they were meant to address persist unchanged. The pattern is well-documented: an initiative launches around a real need, produces some work while its funding lasts, then dissolves — and the need itself dissolves with it in institutional memory, so the next initiative starts from zero. Every re-attempt at addressing the same compound need has to rediscover the need, re-articulate it, and re-form the ecosystem around it, without benefit of what the prior attempts learned.

Haier's Rendanheyi model contains an organ that prevents this pattern. The customer scenario is a persistent object that lives on an internal platform independent of any specific microenterprise attempting to address it. When an ME succeeds, the scenario has produced value and the ME's history attaches to the scenario. When an ME fails, the scenario returns to the platform enriched by what didn't work, available for another team to grab. William Malek reports the turnaround for a new team to form around a returned scenario at Haier's Chinese operations is two to three days. The scenario is the organ that makes ecosystem-brand work sustainable across generations of specific attempts.

This section develops the customer scenario as a first-class object in the design record — the object that ties the neighborhood's linkage-mapping work to the between-institution project shape, that anchors the balanced scorecard's value definition, that gives the SODOTO portfolio layer something to attach ME histories to, that feeds the FedWiki repository layer, and that gives the CfA-dSC contracts something to instrument around. Every subsequent section in the design record depends on the customer scenario being understood clearly.

#### What a customer scenario is

A customer scenario is an articulation of a compound unmet user need in end-to-end user-experience form. Three phrases in that sentence do specific work and deserve unpacking.

**Compound.** A single-need articulation is a product-development question. A compound articulation is a life-situation question. Haier's "smart refrigerator" is a product; Haier's "Internet of Food" is a scenario. The scenario names what the user is doing in their whole life-context: consuming food, which involves refrigeration but also purchase, storage, preparation, dietary advice, and the coordination of these across a household's rhythms and constraints. No single provider can satisfy the whole scenario; that is the point. The compound nature invites the ecosystem to form.

**Unmet user need.** Not "opportunity to expand a product line." Not "gap in service delivery from an institutional perspective." Not "problem someone should be solving." A specific compound context in the user's life where current provision leaves the user's actual experience incomplete, difficult, expensive, undignified, or dependent on the user doing coordination work that they should not have to do. The scenario is written from the user's side of the transaction, in the user's own terms, based on zero-distance contact with users who live inside the context.

**End-to-end user-experience form.** The scenario describes the whole context the user is living in, not the sliver of it one intervention would address. Haier's "balcony scenario" is not "washing machine plus sofa plus sound system plus sporting equipment." It is the way users actually live on their balconies — reading, resting, exercising, socializing, laundering, being outside without leaving home — and what would make that whole way of living work well. The scenario captures the situated life; the compound needs and the ME solutions are what the scenario invites once it is well-articulated.

The scenario is not a business plan. A business plan is a founder's proposal to investors about how a specific enterprise will operate. The scenario is the situation-with-user, upstream of any specific enterprise, available for any enterprise to form around.

The scenario is also not a project brief. A project brief is a description of specific work to be done — scope, deliverables, timeline, budget. The scenario is the compound context the project brief would address, upstream of any specific project's decisions about scope and approach. Multiple different projects could reasonably form around the same scenario; the scenario does not prejudice which.

#### The Experience-EMC / Solution-EMC split at neighborhood scale

Zohar's *Zero Distance* names a distinction that reshapes how MEs are understood at any scale. There are Experience EMCs and there are Solution EMCs, and they do different work.

**Experience EMCs** stay zero-distance to users. Their work is being present in the users' life-context, hearing pain points and desires, understanding why and how users are actually using what they use, and articulating scenarios that name what's happening. Experience EMCs surface the material that scenarios are made of.

**Solution EMCs** form to deliver against scenarios that Experience EMCs have surfaced. Their work is design, production, delivery, service — the mobilization of ecosystems that address the scenario's compound need. Solution EMCs are what the between-institution project shape describes at Haier scale.

At neighborhood scale, this split has structural implications the design record needs to hold.

Some neighborhood MEs will be scenario-articulators — small groups whose primary work is being zero-distance with residents and articulating what's actually happening in their lives. These are the people already at zero distance in a functioning neighborhood: community health workers, teachers who know families over years, chaplains, librarians who see who comes in for what, food bank volunteers, mutual-aid coordinators, elders who visit the homebound, the operator of a founded commons who watches who uses the space and how. These MEs may already exist as small groups in a neighborhood that meets the Section 4 filters; the kit does not create them but recognizes them and makes their scenario-articulation work visible.

Other neighborhood MEs will be solution-deliverers — the between-institution project teams that form around specific scenarios. These are the MEs the design record has been describing throughout, and Section 8 develops their shape in detail.

The customer scenario is the durable object that connects them. A scenario articulated by an Experience-ME analog lives on the FedWiki repository. A Solution-ME analog grabs it, forms an ecosystem around it, negotiates its value chain and contracts, receives catalytic seed capital, and does the work. When the work completes — successfully or not — the scenario continues to live in the repository, either as demonstrated-value or as returned-enriched.

The two-part structure prevents a specific failure mode common in neighborhood work: the scenario gets articulated by the same people who then have to solve it. When articulation and solution are combined in one small group, the scenario tends to shrink to what that group can solve — losing its compound end-to-end character and becoming a project the group can execute, which was not the point. Separating the roles keeps scenarios ambitious enough to require ecosystem formation and to invite between-institution work.

At neighborhood scale, the same person may participate in both an Experience ME and a Solution ME, and the same small group may play both roles at different times. The distinction is functional, not organizational; what matters is that the scenario-articulation work and the scenario-solving work are recognized as distinct and are not collapsed into each other.

#### What a well-formed scenario contains

The specific artifact of a Haier customer scenario is not fully documented in public sources. Zohar describes the mechanism and gives examples but does not show the document form; Malek describes how scenarios circulate on the platform but not what fields they contain. Startup Factory presumably provides more detail, and the RCN version of a well-formed scenario will need to be adapted from what we can infer and what we develop through use rather than reproduced from a fixed template.

Working from Haier's mechanism and the design record's requirements, a well-formed neighborhood-scale customer scenario should contain the following.

**A title in the users' own language.** "A child arriving new at school as a refugee, first year." Not "school-based refugee resettlement service coordination." The title signals whose situation this is and what makes it a distinct scenario worth naming.

**The situation described in end-to-end form.** What is the user's whole life-context, across time, across places, across relationships? What happens in the morning, what happens on weekends, what happens over the arc of a year? What are the transitions — enrollment, illness, holiday, growth — that reshape the situation? Written narratively, from within the user's experience, not as a service map.

**The compound unmet needs the situation contains.** What is the user currently doing without, doing with difficulty, paying too much for, waiting too long for, or being asked to coordinate that they shouldn't have to coordinate? Listed as a set, not ranked, because the compound character is what invites ecosystem formation. Each need named specifically enough that a Solution ME could recognize it.

**Who counts as "the user" and who counts as "the user's neighbors."** The neighbor clause matters — Marc's principle from the design conversation defines value as "created by residents for residents and their neighbors, with neighbors defined by the value creators themselves." The scenario names both. A refugee-child-at-school scenario has the child as user; the child's siblings, parents, extended family, cultural community, and classroom peers may all count as neighbors in ways the scenario has to make explicit for the value chain to settle correctly later.

**The neighborhood contexts in which the scenario is real.** Some scenarios are universal enough to move across neighborhoods (a school-refugee scenario applies wherever refugees arrive at schools); some are specific to a place (an East County backcountry-medical scenario would not port directly to City Center Bellingham). The scenario names its neighborhood contexts explicitly so that MEs looking to grab it know where it applies.

**Existing attempts and their outcomes.** What has been tried before, by whom, with what results? This is the enrichment field — where returning scenarios accumulate what didn't work and why. On first articulation this may be short or empty; over cycles it becomes the scenario's most valuable content, because it saves subsequent teams from re-learning what prior teams paid to learn.

**The invitation.** What kind of ecosystem is being invited to form around this scenario? Which small groups, institutions, and disciplines seem likely to be part of a viable Solution EMC? Not a prescription — the scenario does not choose its own ME. An indication of the shape a Solution EMC might reasonably take, which any ME considering the scenario can accept, revise, or ignore.

**Attribution.** Who articulated this scenario? When? Based on what zero-distance contact? Attribution matters for the SODOTO portfolio layer — the Experience-ME analog that first surfaced a scenario has that articulation credited in their portfolio, whether or not any Solution ME eventually succeeds. Scenario articulation is real work and its history should be visible.

These seven elements are the current best inference of what a well-formed scenario contains, subject to revision as the Startup Factory material clarifies specific Haier practice and as RCN's own use surfaces what actually works. The design record will hold this as a working template rather than a settled specification.

#### Where scenarios live and how they circulate

The FedWiki repository is where scenarios live. One page per scenario, forkable per neighborhood context, enriched by every attempt.

FedWiki's fork-and-modify pattern fits scenarios natively. A scenario articulated in East County can be forked by someone in Birchwood who recognizes a similar pattern, adapted for the Birchwood context, and lived alongside the East County original. Both remain visible; neither overwrites the other; a Solution ME in either place can see both versions and learn from the other's work. Cross-neighborhood learning happens through the fork history, not through any central curation.

The scenario page's structure follows the seven elements above, in FedWiki markdown-paragraph form. Fields that require structured data — attribution, neighborhood context, existing attempts with outcomes — can use FedWiki's native item types or link out to Overall Schema entries in Neo4j where the graph structure adds value.

Circulation happens through several mechanisms.

Convener attention. The convener of a neighborhood engaged with the kit maintains awareness of the scenario repository and surfaces scenarios that plausibly apply to their neighborhood during Phase 2's linkage-mapping meetings. Scenarios articulated elsewhere can inform what the meeting sees.

WWHA Industry Platform attention. WWHA's granting arm maintains its own awareness of scenarios across the cluster of neighborhoods it serves and can bring cross-neighborhood scenarios into conversation with individual neighborhoods where relevant.

MEs shopping. In the mature marketplace state, MEs looking for work can browse the scenario repository and propose to form Solution EMCs around scenarios they see. This is the "you can go grab the scenario" mechanism Malek describes at Haier scale. At RCN scale, this is subject to the first-generation-portfolio conditions and the SODOTO trust mechanisms described in later sections; the mature marketplace only becomes fully operational once portfolios have accumulated enough substance to support competitive matching.

e-VSM survey validation. Once a scenario has been articulated, an e-VSM survey of the broader neighborhood can validate whether the scenario is real, whose experience it reflects, and what it misses. Claude API synthesis of survey results provides the interpretation and integration Marc's e-VSM design already contemplates. Scenarios that survive validation get Solution EMC formation; scenarios that don't get revised or archived with what was learned.

#### How scenarios interact with the kit's phases

The kit's phases descend from the CMG five-phase Linkage Mapping playbook. With the customer scenario as first-class object, the phases produce and use scenarios explicitly rather than jumping from linkage map to project.

**Phase 1** includes scenario-repository review. The convener reviews existing scenarios that plausibly apply to this neighborhood and brings the awareness into pre-work conversations. The Phase 1 diagnostic includes whether the neighborhood already has scenario-articulator patterns operating (Experience-ME analogs), even if they don't use the vocabulary.

**Phase 2's** first meeting produces scenarios, not projects. The linkage map surfaces the current-state S1-through-S3 view of the neighborhood; the Idealized Design work surfaces the S4-desired state; the surfacing of scenarios happens as the gap between those two becomes visible. Whose life is caught in the gap, in what compound way, across what end-to-end context? That is the scenario question, and the room's answer to it is Phase 2's real output.

**Phase 3's** weighted selection is scenario selection. The group chooses which of the surfaced scenarios matter most, using the weighted-selection matrix method the CMG playbook developed. The output is a small set of prioritized scenarios that go into the repository and become the basis for Phase 4's ME formation.

**Phase 4** is where Solution MEs form around selected scenarios. Self-organizing teams grab scenarios; they negotiate with the WWHA Industry Platform (playing an EMC-owner role); they form the ecosystem community across the small groups and institutions the scenario needs; they put contracts in place through CfA-dSC with Leading Targets and Value Added Mechanism specified; they receive catalytic seed capital.

**Phase 5** is execution, retrospective, and scenario update. The ME does the work. The retrospective — grounded in the e-VSM survey of how the work landed across the neighborhood's spheres and in resident recognition of value received — feeds back to the scenario's existing-attempts field. Whether the ME succeeded or failed, the scenario continues living in the repository, enriched by what happened.

The cycle can then repeat, with a new round of scenarios (or returning enriched scenarios) forming Phase 2's input for the next iteration. Or the neighborhood can set the kit free once the pattern is internalized, continuing to work with scenarios as its native object without needing the convener's Phase-facilitation to run each round.

#### What this section commits the design to

The customer scenario is treated throughout the design record as the origin object from which specific MEs derive rather than as a description a specific ME writes about its own work. This is the inversion that distinguishes the Rendanheyi pattern from conventional project-based work. Projects come from scenarios; scenarios do not come from projects.

The two-part Experience/Solution EMC structure is preserved even at neighborhood scale, with the recognition that the same person or small group may participate in both roles at different times but should not collapse the roles.

The FedWiki repository is treated as the persistent home of scenarios across cycles and across neighborhoods. Its fork-and-modify pattern is the native mechanism for cross-neighborhood learning; its markdown-paragraph structure holds the seven-element scenario template; its links out to Neo4j Overall Schema entries handle the structured relationships.

The e-VSM survey is treated as the small-data validation instrument for scenarios and as the retrospective instrument for how ME work has landed. Claude API synthesis integrates the survey evidence and surfaces suggestions, giving Claude an ongoing operational role in the kit rather than only a co-drafting role.

Section 6 develops the Industry Platform pattern — the WWHA-shaped granting-arm-as-EMC-owner that MEs negotiate with when forming Solution EMCs and whose actors are compensated as a downstream function of the MEs they seed. Section 7 develops the moods-and-speech-acts working layer that runs through every phase and every scenario negotiation. Section 8 returns to the between-institution project shape, now understood as the operational form Solution MEs take.

### Claude's notes on delivering the draft

That is Section 5, around 2500 words. Long, but the customer scenario is the design's structural pivot — the object that ties the four principles from Section 2, the VSM frame from Section 3, and the founded commons from Section 4 to everything that follows. Under-treating it here would force awkward retrofitting later.

Three things worth your attention.

The seven-element scenario template in "What a well-formed scenario contains" is my inference, not a Haier fact. I've flagged that inside the text. If Startup Factory or your Kindle notes turn up specific Haier fields we should adopt, we'll revise; if not, this template becomes RCN's own working form until use surfaces what to change.

The Experience/Solution split is applied fully — I've argued that the same person can play both roles but the roles should not be collapsed. This is a stronger structural claim than I've made elsewhere. If you want it softened (or strengthened further), say so.

The Phase-mapping in "How scenarios interact with the kit's phases" restates the CMG five-phase structure with scenarios as output rather than projects. This anticipates Section 8 (between-institution project shape) and Section 11-ish (the phase-by-phase kit walkthrough). Some overlap is unavoidable since the section-to-section boundaries in this design record aren't sharp; the scenario section has to say enough about the phases to make sense, and later sections will restate the phases with different emphases. Say if you want the phase material trimmed here or expanded there.

React, correct, or say go for Section 6.


## Marc's edits — `EDITED SECTION 5.pages` (file dated 2026-09-03)
_Extracted verbatim from the Pages file on disk. Marc edited the draft in place and added comments and questions as parenthetical paragraphs — a paragraph wrapped entirely in parentheses is Marc talking to Claude, not body text. Headings were restored by matching the draft; everything else is exactly as in the file._
### Section 5 — The Customer Scenario as Origin Object

#### Why the customer scenario deserves its own section

Almost no one outside Haier does this. That absence is not incidental; it is why programs come and go while the underlying needs they were meant to address persist unchanged. The pattern is well-documented: an initiative launches around a real need, produces some work while its funding lasts, then dissolves — and with it the institutional memory dissolves, so the next initiative starts from zero. Disappointment and even cynicism develop where there was enthusiasm and hope. Every re-attempt at addressing the same compound need has to rediscover the need, re-articulate it, and re-form the ecosystem around it, without benefit of what the prior attempts learned.

Haier's Rendanheyi model contains an organ that prevents this pattern. The customer scenario is a persistent object that lives on an internal platform independent of any specific microenterprise attempting to address it. When an ME succeeds, the scenario has produced value and the ME's history attaches to the scenario. When an ME fails, the scenario returns to the platform enriched by what didn't work, available for another team to grab. William Malek reports the turnaround for a new team to form around a returned scenario at Haier's Chinese operations is two to three days. The scenario is the organ that makes ecosystem-brand work sustainable across generations of specific attempts.

(What does this mean: “ecosystem-brand work”?)

(Please review Executing Your Strategy: How to Break It Down and Get It Done, by William Malek and tell me whether you think neighborhoods can accomplish this. Tell me why and how.”

This section develops the customer scenario as a first-class object in the design record — the object that ties the neighborhood's linkage-mapping work to the between-institution project shape, that anchors the balanced scorecard's value definition, that gives the SODOTO portfolio layer something to attach ME histories to, that feeds the FedWiki repository layer, and that gives the CfA-dSC contracts something to instrument around. Every subsequent section in the design record depends on the customer scenario being understood clearly.

#### What a customer scenario is

A customer scenario is an articulation of a compound unmet user need in end-to-end user-experience form. Three phrases in that sentence do specific work and deserve unpacking.

Compound. A single-need articulation is a product-development question. A compound articulation is a life-situation question. Haier's "smart refrigerator" is a product; Haier's "Internet of Food" is a scenario. The scenario names what the user is doing in their whole life-context: consuming food, which involves refrigeration but also purchase, storage, preparation, dietary advice, and the coordination of these across a household's rhythms and constraints. No single provider can satisfy the whole scenario; that is the point. The compound nature invites the ecosystem to form.

Unmet user need. Not "opportunity to expand a product line." Not "gap in service delivery from an institutional perspective." Not "problem someone should be solving." A specific compound context in the user's life where current provision leaves the user's actual experience incomplete, difficult, expensive, undignified, or dependent on the user doing coordination work that they should not have to do. The scenario is written from the user's side of the transaction, in the user's own terms, based on zero-distance contact with users who live inside the context.

End-to-end user-experience form. The scenario describes the whole context the user is living in, not the sliver of it one intervention would address. Haier's "balcony scenario" is not "washing machine plus sofa plus sound system plus sporting equipment." It is the way users actually live on their balconies — reading, resting, exercising, socializing, laundering, being outside without leaving home — and what would make that whole way of living work well. The scenario captures the situated life; the compound needs and the ME solutions are what the scenario invites once it is well-articulated.

The scenario is not a business plan. A business plan is a founder's proposal to investors about how a specific enterprise will operate. The scenario is the situation-with-user, upstream of any specific enterprise, available for any enterprise to form around.

The scenario is also not a project brief. A project brief is a description of specific work to be done — scope, deliverables, timeline, budget. The scenario is the compound context the project brief would address, upstream of any specific project's decisions about scope and approach. Multiple different projects could reasonably form around the same scenario; the scenario does not prejudice which.

#### The Experience-EMC / Solution-EMC split at neighborhood scale

(Explain EMC here, before making these distinctions. Explain “ecosystem”, “microenterprise”, and “community” is some detail as a functioning entity. How does it related to eVSM structure? In fact be creating a callout panel that relates all of RenDanHeYi to eVSM (and VSM) Let me get you a diagram to work from: https://evsm.relocalizecreativity.net/view/rcn-graph-of-evsm)

Zohar's Zero Distance names a distinction that reshapes how MEs are understood at any scale. There are Experience EMCs and there are Solution EMCs, and they do different work.

Experience EMCs stay zero-distance to users. Their work is being present in the users' life-context, hearing pain points and desires, understanding why and how users are actually using what they use, and articulating scenarios that name what's happening. Experience EMCs surface the material that scenarios are made of.

Solution EMCs form to deliver against scenarios that Experience EMCs have surfaced. Their work is design, production, delivery, service — the mobilization of ecosystems that address the scenario's compound need. Solution EMCs are what the between-institution project shape describes at Haier scale.

At neighborhood scale, this split has structural implications the design record needs to hold.

Some neighborhood MEs will be scenario-articulators — small groups whose primary work is being zero-distance with residents and articulating what's actually happening in their lives. These are the people already at zero distance in a functioning neighborhood: community health workers, teachers who know families over years, chaplains, librarians who see who comes in for what, food bank volunteers, mutual-aid coordinators, elders who visit the homebound, the operator of a founded commons who watches who uses the space and how. These MEs may already exist as small groups in a neighborhood that meets the Section 4 filters; the kit does not create them but recognizes them and makes their scenario-articulation work visible.

Other neighborhood MEs will be solution-deliverers — the between-institution project teams that form around specific scenarios. These are the MEs the design record has been describing throughout, and Section 8 develops their shape in detail.

The customer scenario is the durable object that connects them. A scenario articulated by an Experience-ME analog lives on the FedWiki repository. A Solution-ME analog grabs it, forms an ecosystem around it, negotiates its value chain and contracts, receives catalytic seed capital, and does the work. When the work completes — successfully or not — the scenario continues to live in the repository, either as demonstrated-value or as returned-enriched.

The two-part structure prevents a specific failure mode common in neighborhood work: the scenario gets articulated by the same people who then have to solve it. When articulation and solution are combined in one small group, the scenario tends to shrink to what that group can solve — losing its compound end-to-end character and becoming a project the group can execute, which was not the point. Separating the roles keeps scenarios ambitious enough to require ecosystem formation and to invite between-institution work.

(Does the Value Stream Mapping fit with the Experience-ME? If not or if so, what other tools do we have to make aspect of the Customer Scenario visible?)

At neighborhood scale, the same person may participate in both an Experience ME and a Solution ME, and the same small group may play both roles at different times. The distinction is functional, not organizational; what matters is that the scenario-articulation work and the scenario-solving work are recognized as distinct and are not collapsed into each other.

(I read a book ,Writing on Both Sides of the Brain by Henriette Anne Klauser, that advised to separate creating and editing. This seems very similar.)

#### What a well-formed scenario contains

The specific artifact of a Haier customer scenario is not fully documented in public sources. Zohar describes the mechanism and gives examples but does not show the document form; Malek describes how scenarios circulate on the platform but not what fields they contain. Startup Factory presumably provides more detail, and the RCN version of a well-formed scenario will need to be adapted from what we can infer and what we develop through use rather than reproduced from a fixed template.

Working from Haier's mechanism and the design record's requirements, a well-formed neighborhood-scale customer scenario should contain the following.

A title in the users' own language. "A child arriving new at school as a refugee, first year." Not "school-based refugee resettlement service coordination." The title signals whose situation this is and what makes it a distinct scenario worth naming.

The situation described in end-to-end form. What is the user's whole life-context, across time, across places, across relationships? What happens in the morning, what happens on weekends, what happens over the arc of a year? What are the transitions — enrollment, illness, holiday, growth — that reshape the situation? Written narratively, from within the user's experience, not as a service map.

(Our new Time Line Tool might be adapted to Customer Scenario depiction—cave drawings.)

The compound unmet needs the situation contains. What is the user currently doing without, doing with difficulty, paying too much for, waiting too long for, or being asked to coordinate that they shouldn't have to coordinate? Listed as a set, not ranked, because the compound character is what invites ecosystem formation. Each need named specifically enough that a Solution ME could recognize it.

Who counts as "the user" and who counts as "the user's neighbors." The neighbor clause matters — Marc's principle from the design conversation defines value as "created by residents for residents and their neighbors, with neighbors defined by the value creators themselves." The scenario names both. A refugee-child-at-school scenario has the child as user; the child's siblings, parents, extended family, cultural community, and classroom peers may all count as neighbors in ways the scenario has to make explicit for the value chain to settle correctly later.

The neighborhood contexts in which the scenario is real. Some scenarios are universal enough to move across neighborhoods (a school-refugee scenario applies wherever refugees arrive at schools); some are specific to a place (an East County backcountry-medical scenario would not port directly to City Center Bellingham). The scenario names its neighborhood contexts explicitly so that MEs looking to grab it know where it applies.

Existing attempts and their outcomes. What has been tried before, by whom, with what results? This is the enrichment field — where returning scenarios accumulate what didn't work and why. On first articulation this may be short or empty; over cycles it becomes the scenario's most valuable content, because it saves subsequent teams from re-learning what prior teams paid to learn.

The invitation. What kind of ecosystem is being invited to form around this scenario? Which small groups, institutions, and disciplines seem likely to be part of a viable Solution EMC? Not a prescription — the scenario does not choose its own ME. An indication of the shape a Solution EMC might reasonably take, which any ME considering the scenario can accept, revise, or ignore.

Attribution. Who articulated this scenario? When? Based on what zero-distance contact? Attribution matters for the SODOTO portfolio layer — the Experience-ME analog that first surfaced a scenario has that articulation credited in their portfolio, whether or not any Solution ME eventually succeeds. Scenario articulation is real work and its history should be visible.

These seven elements are the current best inference of what a well-formed scenario contains, subject to revision as the Startup Factory material clarifies specific Haier practice and as RCN's own use surfaces what actually works. The design record will hold this as a working template rather than a settled specification.

(Here is some speculative work I have done on a Customer Scenario Template: https://rendanheyi.relocalizecreativity.net/view/customer-scenario/view/customer-scenario-template. Maybe your suggestions above and my work could be integrated to good effect.)

#### Where scenarios live and how they circulate

The FedWiki repository is where scenarios live. One page per scenario, forkable per neighborhood context, enriched by every attempt.

FedWiki's fork-and-modify pattern fits scenarios natively. A scenario articulated in East County can be forked by someone in Birchwood who recognizes a similar pattern, adapted for the Birchwood context, and lived alongside the East County original. Both remain visible; neither overwrites the other; a Solution ME in either place can see both versions and learn from the other's work. Cross-neighborhood learning happens through the fork history, not through any central curation.

The scenario page's structure follows the seven elements above, in FedWiki markdown-paragraph form. Fields that require structured data — attribution, neighborhood context, existing attempts with outcomes — can use FedWiki's native item types or link out to Overall Schema entries in Neo4j where the graph structure adds value.

(Perhaps an introduction/reference to the Overall Schema might be useful to readers.)

Circulation/awareness of Customer Scenarios happens through several mechanisms.

Convener attention. The convener of a neighborhood engaged with the kit maintains awareness of the scenario repository and surfaces scenarios that plausibly apply to their neighborhood during Phase 2's linkage-mapping meetings. Scenarios articulated elsewhere can inform what the meeting sees.

WWHA Industry Platform attention. WWHA's granting arm maintains its own awareness of scenarios across the cluster of neighborhoods it serves and can bring cross-neighborhood scenarios into conversation with individual neighborhoods where relevant.

MEs shopping. In the mature marketplace state, MEs looking for work can browse the scenario repository and propose to form Solution EMCs around scenarios they see. This is the "you can go grab the scenario" mechanism Malek describes at Haier scale. At RCN scale, this is subject to the first-generation-portfolio conditions and the SODOTO trust mechanisms described in later sections; the mature marketplace only becomes fully operational once portfolios have accumulated enough substance to support competitive matching.

e-VSM survey validation. Once a scenario has been articulated, an e-VSM survey of the broader neighborhood can validate whether the scenario is real, whose experience it reflects, and what it misses. Claude API synthesis of survey results provides the interpretation and integration Marc's e-VSM design already contemplates. Scenarios that survive validation get Solution EMC formation; scenarios that don't get revised or archived with what was learned.

(Please illuminate this e-VSM comment to this (https://evsm.relocalizecreativity.net/view/rcn-graph-of-evsm) and this (https://evsm.relocalizecreativity.net/assets/eVSM/evsm-svg-v3.html).

#### How scenarios interact with the kit's phases

The kit's phases descend from the CMG five-phase Linkage Mapping playbook. With the customer scenario as first-class object, the phases produce and use scenarios explicitly rather than jumping from linkage map to project.

(Be sure to add hyper links to relevant images/pages/content whenever you talk about our bits and pieces, e.g. “CMG five-phase Linkage Mapping playbook”.) (Let’s create a crosswalk table from the Phases to the RCN tools/and methods.)

Phase 1 includes scenario-repository review. The convener reviews existing scenarios that plausibly apply to this neighborhood and brings the awareness into pre-work conversations. The Phase 1 diagnostic includes whether the neighborhood already has scenario-articulator patterns operating (Experience-ME analogs), even if they don't use the vocabulary.

Phase 2's first meeting produces scenarios, not projects. The linkage map surfaces the current-state S1-through-S3 view of the neighborhood; the Idealized Design work surfaces the S4-desired state; the surfacing of scenarios happens as the gap between those two becomes visible. Whose life is caught in the gap, in what compound way, across what end-to-end context? That is the scenario question, and the room's answer to it is Phase 2's real output.

Phase 3's weighted selection is scenario selection. The group chooses which of the surfaced scenarios matter most, using the weighted-selection matrix method the CMG playbook developed. The output is a small set of prioritized scenarios that go into the repository and become the basis for Phase 4's ME formation.

Phase 4 is where Solution MEs form around selected scenarios. Self-organizing teams grab scenarios; they negotiate with the WWHA Industry Platform (playing an EMC-owner role); they form the ecosystem community across the small groups and institutions the scenario needs; they put contracts in place through CfA-dSC with Leading Targets and Value Added Mechanism specified; they receive catalytic seed capital.

Phase 5 is execution, retrospective, and scenario update. The ME does the work. (Do you mean the Solution EM?) The retrospective — grounded in the e-VSM survey of how the work landed across the neighborhood's spheres and in resident recognition of value received — feeds back to the scenario's existing-attempts field. Whether the ME succeeded or failed, the scenario continues living in the repository, enriched by what happened.

The cycle can then repeat, with a new round of scenarios (or returning enriched scenarios) forming Phase 2's input for the next iteration. Or the neighborhood can set the kit free once the pattern is internalized, continuing to work with scenarios as its native object without needing the convener's Phase-facilitation to run each round.

(Please elaborate on: neighborhood can set the kit free once the pattern is internalized.)

#### What this section commits the design to

The customer scenario is treated throughout the design record as the origin object from which specific MEs derive rather than as a description a specific ME writes about its own work. This is the inversion that distinguishes the Rendanheyi pattern from conventional project-based work. Projects come from scenarios; scenarios do not come from projects.

(Back in the day, a friend working for Intel had a team that did ethnographic research on customers. Then when Microsoft and Peter Neupert did ethnographic work to develop HealthVault as an extension of our Shared Care Plan. Both of these approaches seem very related to the Experience-ME work. Might be good to reference ethnography? Seems related to Participatory Action Research too.)

The two-part Experience/Solution EMC structure is preserved even at neighborhood scale, with the recognition that the same person or small group may participate in both roles at different times but should not collapse the roles.

The FedWiki repository is treated as the persistent home of scenarios across cycles and across neighborhoods. Its fork-and-modify pattern is the native mechanism for cross-neighborhood learning; its markdown-paragraph structure holds the seven-element scenario template; its links out to Neo4j Overall Schema entries handle the structured relationships.

The e-VSM survey is treated as the small-data validation instrument for scenarios and as the retrospective instrument for how ME work has landed. Claude API synthesis integrates the survey evidence and surfaces suggestions, giving Claude an ongoing operational role in the kit rather than only a co-drafting role.

Section 6 develops the Industry Platform pattern — the WWHA-shaped granting-arm-as-EMC-owner that MEs negotiate with when forming Solution EMCs and whose actors are compensated as a downstream function of the MEs they seed.

Section 7 develops the moods-and-speech-acts working layer that runs through every phase and every scenario negotiation.

Section 8 returns to the between-institution project shape, now understood as the operational form Solution MEs take.

That is Section 5, around 2500 words. Long, but the customer scenario is the design's structural pivot — the object that ties the four principles from Section 2, the VSM frame from Section 3, and the founded commons from Section 4 to everything that follows. Under-treating it here would force awkward retrofitting later.

Three things worth your attention.

The seven-element scenario template in "What a well-formed scenario contains" is my inference, not a Haier fact. I've flagged that inside the text. If Startup Factory or your Kindle notes turn up specific Haier fields we should adopt, we'll revise; if not, this template becomes RCN's own working form until use surfaces what to change.

The Experience/Solution split is applied fully — I've argued that the same person can play both roles but the roles should not be collapsed. This is a stronger structural claim than I've made elsewhere. If you want it softened (or strengthened further), say so.

The Phase-mapping in "How scenarios interact with the kit's phases" restates the CMG five-phase structure with scenarios as output rather than projects. This anticipates Section 8 (between-institution project shape) and Section 11-ish (the phase-by-phase kit walkthrough). Some overlap is unavoidable since the section-to-section boundaries in this design record aren't sharp; the scenario section has to say enough about the phases to make sense, and later sections will restate the phases with different emphases. Say if you want the phase material trimmed here or expanded there.

React, correct, or say go for Section 6.


## The conversation about the edits — turns 134–142
_Claude's report on Marc's edits, and Marc's answers. Claude read the Pages file in the chat and summarised; the verbatim edits above are the authority where they differ._
**Marc** — turn 134, 2026-09-09 21:42 UTC

Option 3 please.

_uploaded files: `EDITED SECTION 5.pages` (in `sources/` where found on disk)_

---
**Claude** — turn 135, 2026-09-09 21:46 UTC

Creating the drafting log in memory first, then Section 5.
Log filed. Now Section 5.
Substantial edits and a lot of substantive questions. Before I respond fully, let me try to fetch your customer scenario template — I want to see it before proposing how to integrate it.
Got Section 5 with all your edits and comments. Report on URLs, quick answers to small asks, and a proposed plan for the substantive additions.

**URL fetch attempts:**
Your Customer Scenario Template at `rendanheyi.relocalizecreativity.net/view/customer-scenario/view/customer-scenario-template` — I couldn't reach it. The RCN site itself resolves but specific deep pages don't come back through fetch. Simplest fix: paste the template content into chat and I'll integrate. Or, since this is FedWiki territory anyway, we can synthesize in Claude Code once you're ready to instantiate.

**Quick answers to smaller asks:**

- **"ecosystem-brand work"** — Zohar's term. Haier calls their approach "Eco-System Brands" — MEs forming ecosystems around scenarios to deliver total solutions rather than atomic products. I should replace "ecosystem-brand work" with "ecosystem-scale work around scenarios" or similar, or gloss the term the first time.

- **Value Stream Mapping fit with Experience-ME** — Real acronym clash to name openly: VSM is Beer's Viable System Model in Section 3, and VSM is Value Stream Mapping (Toyota/Womack lean tradition) in your question. They're different tools. Value Stream Mapping traces the flow of value from customer request through processes to delivery. Yes, it can inform Experience-ME work — it's exactly the kind of tracing zero-distance MEs do when articulating what's happening for a user across time. Worth naming as a compatible tool. Other candidates: customer journey mapping, service blueprinting, ethnographic observation, sensemaking through fieldnotes. All fit the Experience-ME's core activity.

- **Klauser create/edit analogy** — Nice fit for Experience/Solution split. I'll add as a brief parenthetical citation.

- **Introduce/reference Overall Schema** — Short paragraph pointing readers to /areas/rcn-overall-schema.md substrate. Will add.

- **"Do you mean the Solution ME?"** — Yes, my "the ME" was ambiguous. Correcting to "the Solution ME."

- **Elaborate "neighborhood can set the kit free"** — Meaning: once the neighborhood has run through the phases enough times to internalize the pattern, it can continue running scenario cycles without a convener facilitating each round. The scenarios come from Experience-MEs directly to the FedWiki repository; the Solution-MEs form and dissolve on the neighborhood's own rhythm; the retrospectives happen at the founded commons on the neighborhood's schedule; the granting arm continues as adjacency but the ceremony of Phase 1 through Phase 5 is no longer needed because the practice has become native. Will elaborate this in-line.

- **Ethnography and Participatory Action Research** — Both real methodological lineages that align with Experience-ME work. Ethnography (Intel's history, Peter Neupert's HealthVault work you mentioned) and Participatory Action Research (Kurt Lewin, Orlando Fals-Borda, William Foote Whyte) are both zero-distance user-context methods. Will add as intellectual heritage in the Experience-ME subsection.

**Substantive additions needed — proposed plan:**

**1. EMC / ecosystem / microenterprise / community explanations up front, with callout panel relating RenDanHeYi to VSM/e-VSM.** This is the biggest ask and I want to do it well. My plan: a new subsection near the top of Section 5 (before the Experience/Solution split) defining the four terms clearly, then a structured callout panel — visual, likely rendered via the visualize tool — that shows RenDanHeYi's ME/EMC/Industry Platform structure mapped onto Beer's five systems and e-VSM's three layers. I have your RCN graph SVG as substrate for the visual and Zohar/Malek as substrate for the RenDanHeYi terms. Best done as a discrete drafting pass once you confirm scope. About 800-1000 words plus the diagram.

**2. Crosswalk table from kit Phases to RCN tools and methods.** Rows = Phase 1 through Phase 5. Columns = purpose, primary tool/method, RCN substrate involved, output. Straightforward once I have the tool inventory settled. Should include: Linkage Mapping, Idealized Design, weighted-selection matrix, e-VSM survey, FedWiki scenario repository, SODOTO portfolios, CfA-dSC contracts, Overall Schema, Time Line Tool ("cave drawings"), Ripple ReThink SDM (where relevant). I can draft once you confirm which tools belong on which phases.

**3. William Malek book review — *Executing Your Strategy: How to Break It Down and Get It Done*.** By Mark Morgan, Raymond Levitt, and William Malek (Harvard Business Review Press, 2007). This is a substantive analysis ask, not a quick pass. My plan: I'll fetch what's publicly available (I have some access to reviews and excerpts), report what I find on the specific "can neighborhoods do this" question, and give you my honest read. Probably a standalone response rather than integrated into Section 5. This might be its own conversation branch.

**4. Time Line Tool / "cave drawings" for scenario depiction.** Not in my substrate. I know "Cave Drawings" is one of the RCN Modeling focus areas per your public site (Kerry, Marc, Robin, Chris, Jerry). If you can share the Time Line Tool spec or a link/paste, I can integrate. Otherwise it becomes a "flagged for future integration" note.

**5. Your Customer Scenario Template.** As above — send content and I integrate.

**Proposed sequence:**
- I do the small integrations (glossing ecosystem-brand-work, adding VSM/ethnography/PAR references, correcting "Solution ME", elaborating set-the-kit-free) in the next Section 5 rewrite pass
- I set up the EMC/callout addition as a discrete draft — you'll want to review before I commit substantial diagram work
- Crosswalk table drafted next, once tool inventory is settled
- Malek book review is its own conversation branch when you want it
- Time Line Tool and Customer Scenario Template — you send substrate, I integrate

**One structural question:** the EMC/ecosystem callout wants to sit early in Section 5 (before the Experience/Solution split, per your comment). But some of that material — Beer/VSM/e-VSM/RenDanHeYi integration — was flagged earlier as substrate available across the record rather than concentrated in one section. Do you want the callout concentrated in Section 5, or would you rather it live as a shared reference (its own subsection or appendix in Section 3, since Section 3 is the VSM section) with Section 5 pointing at it? My inclination is shared reference in Section 3, referenced from Section 5 — keeps Section 5 focused on scenarios rather than diverting into framework mapping — but your call.

Updating the drafting log now with Section 5 status.
Log updated. Waiting on your call about the callout placement (shared reference in Section 3 vs concentrated in Section 5) and on the substrate you can share (Customer Scenario Template content, Time Line Tool info). I can proceed to the small integrations while you gather those.

---
**Marc** — turn 136, 2026-09-09 21:49 UTC

```
{
  "title": "Customer Scenario",
  "story": [
    {
      "type": "markdown",
      "id": "8fa058034cb04237",
      "text": "The customer scenario document lays out the value and the value creation process in detail. It is the vision/blueprint for the fully implemented primary micro enterprise and its EMC network. It is a creative act to write such a cenario. It is the document that people read when deciding whether to \"bid\" on the \"contract.\" In choosing to participate in this value creating network."
    },
    {
      "type": "markdown",
      "id": "3038d252112da416",
      "text": "See [[Customer Scenario Template]]"
    },
    {
      "type": "markdown",
      "id": "b786bfe18f92c073",
      "text": "[[Story Structure]] may be useful in communicating the customer scenario."
    }
  ],
  "journal": [
    {
      "type": "create",
      "item": {
        "title": "Customer Scenario",
        "story": [
          {
            "type": "markdown",
            "id": "8fa058034cb04237",
            "text": "Provide overview."
          }
        ]
      },
      "date": 1722295811637
    },
    {
      "type": "edit",
      "id": "8fa058034cb04237",
      "item": {
        "type": "markdown",
        "id": "8fa058034cb04237",
        "text": "The customer scenario document lays out the value and the value creation process in detail. It is the vision/blueprint for the fully implemented primary micro enterprise and its EMC network. It is a creative act to write such a cenario. It is the document that people read when deciding whether to \"bid\" on the \"contract.\" In choosing to participate in this value creating network.\n"
      },
      "date": 1725559609927
    },
    {
      "type": "edit",
      "id": "8fa058034cb04237",
      "item": {
        "type": "markdown",
        "id": "8fa058034cb04237",
        "text": "The customer scenario document lays out the value and the value creation process in detail. It is the vision/blueprint for the fully implemented primary micro enterprise and its EMC network. It is a creative act to write such a cenario. It is the document that people read when deciding whether to \"bid\" on the \"contract.\" In choosing to participate in this value creating network."
      },
      "date": 1725559619374
    },
    {
      "type": "add",
      "id": "3038d252112da416",
      "item": {
        "type": "markdown",
        "id": "3038d252112da416",
        "text": "See [[Customer Scenario Template]]"
      },
      "after": "8fa058034cb04237",
      "date": 1725559632750
    },
    {
      "item": {
        "type": "factory",
        "id": "b786bfe18f92c073"
      },
      "id": "b786bfe18f92c073",
      "type": "add",
      "after": "3038d252112da416",
      "date": 1731181957475
    },
    {
      "type": "edit",
      "id": "b786bfe18f92c073",
      "item": {
        "type": "markdown",
        "id": "b786bfe18f92c073",
        "text": "[[Story Structure]] may be useful in communicating the customer scenario."
      },
      "date": 1731181994870
    }
  ]
}
```

_pasted text saved as: `sources/pastes/turn-136-0-fedwiki-customer-scenario-template.json`, `sources/pastes/turn-136-1-fedwiki-writing-a-customer-scenario.json`_

---
**Claude** — turn 137, 2026-09-09 21:50 UTC

Got the Customer Scenario page content. Two other documents appear to have come through empty — probably the Customer Scenario Template and Story Structure pages you referenced. If you meant to attach those, they didn't extract, and I'd want them too.

**What your Customer Scenario page adds — and reshapes:**

Your framing is richer than what I had. My draft treated the scenario primarily as a compound unmet need articulated in end-to-end user-experience form — upstream of any specific ME, available for any ME to form around. Your page treats the scenario document as something more: "the vision/blueprint for the fully implemented primary micro enterprise and its EMC network." It lays out both the value AND the value creation process. It's what people read when deciding whether to bid on the contract.

That's a stronger claim about what the document contains. My draft's scenario is the situated compound need (a description of what's true for the user). Your page's scenario is that plus the vision (what value will be created) plus the blueprint (how it will be created) plus the primary-ME proposal (who leads, what EMC is invited to form). More like a proposal document than a need-description document.

Three moves this suggests for reconciling:

**First, distinguish the levels of scenario documentation.** There may be two things worth naming distinctly. Call one the *scenario as compound need* — the Experience-ME's articulation of what's actually happening for a user in end-to-end form, upstream of any specific solution. Call the other the *scenario as vision-blueprint* — the primary-ME's proposal of how to address that need, including value creation process and EMC structure, that others bid on. Both are legitimate customer scenarios in different senses. Both live in the repository. The vision-blueprint version cites the compound-need version as its origin.

Or — more likely closer to actual Haier practice — the scenario document is always the vision-blueprint version, and the compound need surfacing happens conversationally before someone commits to writing the scenario. In that case the distinction I made between Experience-ME (articulate need) and Solution-ME (address need) still holds functionally, but only Solution-ME output is a "scenario document." The Experience-ME's work produces conversation, observation, evidence — the raw material — but the scenario itself is written by whoever commits to leading.

**Second, expand the seven-element template.** My draft's elements (title, situation, compound needs, user/neighbors, contexts, existing attempts, invitation, attribution) need to grow to include value proposition and value creation process. Something like: title, situation, compound needs, vision (what value will be created), value creation process (how), primary ME's proposal, EMC network invited to form, existing attempts, user/neighbors, contexts, attribution. Still a working template — needs to be tested against the Startup Factory material and RCN practice.

**Third, integrate the "bid" mechanic explicitly.** My draft describes MEs "grabbing" scenarios in a mature-marketplace state. Your page positions the scenario as a bid document specifically. That's a stronger and more precise framing — the scenario advertises what's being built and invites bids on participation. Not just "here's a need"; more like "here's what we're going to build, want in?" This maps to Haier's Workbench platform where scenarios circulate for internal bidding.

**"Creative act to write" is important vocabulary.** Your page names writing a scenario as a creative act. My draft treated it more procedurally. That difference matters. If it's creative, story structure applies (your Story Structure page reference), Klauser's create/edit split applies (my earlier note), and the storycraft/cave-drawings work in the RCN modeling stream applies. The scenario document isn't a form to fill out — it's a written proposal that has to move readers to want to join. This changes how the kit teaches convenors and Experience-MEs to help scenario authoring.

**One thing to check before I rewrite Section 5:**

Do you want me to work Marc's-framing as the primary scenario definition (scenario = vision-blueprint written by primary ME, with Experience-ME surfacing conversationally the raw material), or preserve the two-level distinction I proposed (compound-need scenario AND vision-blueprint scenario as separate documents at different maturity levels)?

My inclination is your framing as primary. It's closer to Haier practice, closer to what actually circulates on their Workbench, and gives the scenario document more definite shape. The Experience-ME's work stays real and important — they surface, listen, articulate — but the scenario document proper is the primary-ME's vision-blueprint. The Experience-ME's contribution gets credited in attribution and in the situation-narrative sections, but isn't itself a separable scenario document.

If you agree, I'll rewrite Section 5 with this framing and integrate the other small corrections we settled. If you want to preserve both levels, tell me and I'll draft it that way instead.

Also standing by for the Customer Scenario Template and Story Structure content whenever you can share them — those would firm up the "what a well-formed scenario contains" section.

Updating the log now.
Log updated. Awaiting your call on the framing question and, if available, the Customer Scenario Template and Story Structure content.

---
**Marc** — turn 138, 2026-09-09 21:50 UTC

shared reference in Section 3, referenced from Section 5 — keeps Section 5 focused on scenarios rather than diverting into framework mapping

---
**Claude** — turn 139, 2026-09-09 21:51 UTC

Registered. Placement locked: shared reference goes in Section 3.
That gives Section 3 an expanded scope. Currently Section 3 is the VSM-at-neighborhood-scale reasoning with the deferred e-VSM material. Adding the RenDanHeYi/VSM/e-VSM reference means Section 3 becomes the framework-mapping home for the whole design record — Beer's VSM, your e-VSM extension with three-layer Markov Blanket and 33 paired homeostats, and Haier's RenDanHeYi structure (ME, EMC, Industry Platform, customer scenario) all mapped against each other. A reader coming to Section 3 gets the shared vocabulary that later sections use.

Two things this touches:

**Section 3 sequencing.** Your Section 3 edits are in from an earlier round. I owe you a rewrite that absorbs those edits plus adds this shared reference. My inclination is: do the base rewrite absorbing your existing edits first (I have those in hand), then do the shared-reference addition as a discrete second pass so you can see each layer separately rather than one large diff. Alternative: combine into one rewrite, longer but everything in one place. Which do you prefer?

**Substrate for the callout.** I have most of what I need for RenDanHeYi (Zohar, Malek transcript, your EMC contract page, your customer scenario page); most of what I need for Beer's VSM (Section 3 as drafted); most of what I need for e-VSM (your intro doc, architecture, workflow, RCN graph SVG). What I don't have is your working position on how the three frameworks map onto each other — you have this thinking; I've been inferring. Before I draft the callout, would you rather send a page or diagram showing your current mapping, or let me draft a first pass from inference and correct it? First-pass-from-inference is faster; your-mapping-as-substrate is more accurate.

**Section 5 framing question still open** — my primary-ME-vision-blueprint framing versus the two-level distinction. Your answer to that will change how Section 5's rewrite goes. Not blocking Section 3 work, but I'd rather have it settled before starting Section 5.

**Two documents came through empty last message** — probably the Customer Scenario Template and Story Structure pages. If those content are important for Section 5 rewrite, resending would help.

Not asking you to do everything at once. Order of what would help most, in my judgment:

1. Confirm Section 3 sequencing (base rewrite first vs combined)
2. Substrate call for RenDanHeYi/VSM/e-VSM mapping (send your mapping vs let me draft from inference)
3. Answer the Section 5 primary-ME framing question when you get to it
4. Resend the Customer Scenario Template and Story Structure when convenient

I can proceed as far as Section 3 base rewrite (absorbing your existing edits) without any of the above, if you want me moving.

---
**Marc** — turn 140, 2026-09-09 22:03 UTC

Story structure page json. Story diagram in arrows json. Use this intrepretation of customer scenario: Call one the scenario as compound need — the Experience-ME's articulation of what's actually happening for a user in end-to-end form, upstream of any specific solution. Call the other the scenario as vision-blueprint — the primary-ME's proposal of how to address that need, including value creation process and EMC structure, that others bid on. AND do--expand the seven-element template. AND integrate the "bid" mechanic. Story Structure RCN Graph json added for your reference. AND I think that the addition of "Experience-ME's contribution" is an important addition. I think sometimes that is how it will work--ethnography first; and other times someone(s) will create a customer scenario and look or a primary ME team and EMC partners. So some how we need to account for this flexibility in approach and speculate on the kinds of situations where one is more fitting than the other.

_uploaded files: `Simple-Story-Structure-Plus-Organizing-Path (1).json`, `Generic Customer Scenario Graphic.json` (in `sources/` where found on disk); pasted text saved as: `sources/pastes/turn-140-0-fedwiki-story-structure.json`, `sources/pastes/turn-140-1-Generic-Customer-Scenario-Graphic.json`_

---
**Claude** — turn 141, 2026-09-09 22:04 UTC

Got the Story Structure JSON. The Customer Scenario Graphic came through empty in the document block — probably didn't extract. If it's important, resending will help. What I can read from the Story Structure JSON is rich.

**Story Structure model — what I see:**

Twenty-six nodes across seven color categories, fifty-nine edges connecting them. The categories cover: Settings and Affordances (props); Kipling's context (When, Where, Who, Why-Purposes, How-Mechanisms, What-Outcomes); Characters with points of view, Strategies, Motives, Beliefs (six answers), Moods; Actions/Scenes/Roles/Plot/Dialogue/Stage; Events as state changes; Learnings; Audience; and a red "Organizes (AIC)" node that ties into an organizing methodology (AIC — Appreciation-Influence-Control from McWhinney, or another lineage you can clarify).

The structure holds real narrative machinery. Actions/Strategies/Motives/Beliefs mutually inform each other; Events change States; Scenes stage Actions; Learnings loop back to Motives, Beliefs, Moods, Roles, and Settings; the Audience receives Learnings. Moods and Beliefs are entangled with Motives — this is speech-acts-and-moods territory from Section 7 rendered as narrative structure. Object-Process Methodology (OPM) is integrated (Actions as OPM Processes, States as OPM Objects). And AIC organizes actions.

Direction is clear enough to guide scenario communication. A customer scenario written using this structure has: users as characters with beliefs, moods, motives; the setting they live in with its affordances; the strategies (how) they currently deploy or should be able to deploy; the events (state changes) that could happen; the learnings that ripple back to inform future strategy. That's a much richer thing than a needs list.

**Confirming the direction for Section 5 rewrite:**

Two-level scenario framing preserved:
- **Scenario as compound need** — Experience-ME's ethnographic articulation of what's actually happening for the user in end-to-end form; upstream of any specific solution
- **Scenario as vision-blueprint** — primary-ME's vision-and-blueprint document laying out value, value creation process, and EMC network invited; what people bid on

Both origination patterns preserved:
- **Ethnography-first pattern** — Experience-ME does the zero-distance work, articulates compound need, a Solution-ME later picks it up and writes the vision-blueprint
- **Vision-first pattern** — someone(s) write the customer scenario as vision-blueprint directly, then look for primary-ME team and EMC partners

The Section 5 rewrite will speculate on when each pattern fits. First rough cut:
- Ethnography-first likely fits: users whose needs aren't visible to outsiders, populations under-served by existing systems, situations where existing categories miss the actual pain, cases where the compound structure has to be discovered through observation
- Vision-first likely fits: known persistent problems where the shape of the compound need is already visible, where a specific person or group has a strong sense of what should exist, where the challenge is finding execution partners rather than surfacing what's needed
- Many real cases are hybrid: an Experience-ME's work informs someone's vision-blueprint, and the vision-blueprint's writing surfaces gaps requiring more ethnography

Expanded template incorporating both scenario levels — new elements to add to the seven from my draft:
- Value proposition (what value will be created)
- Value creation process (how it will be delivered)
- Primary-ME's proposal (who leads, what they bring)
- EMC network structure (which supporting MEs are invited, what roles)
- Bid terms (what's being offered to bidders, what's expected in return)
- Story-structural elements per your Story Structure graph (characters with PoVs, moods, beliefs, motives; settings and affordances; events as state changes) — these can be woven into the situation-in-end-to-end-form section

The "bid" mechanic gets its own section — how the scenario functions as a bid document, what bidding actually looks like at neighborhood scale, how the primary-ME evaluates bids, how CfA-dSC instruments the contract structure.

Story Structure gets its own subsection — how a scenario is written well, drawing on your Story Structure graph as the reference. Story-craft as creative act (your page's language). Klauser's create/edit split. Ethnography and Participatory Action Research as heritage traditions.

**Proposed structure for Section 5 rewrite:**

1. Why the customer scenario deserves its own section (unchanged from draft, small edits)
2. What a customer scenario is — two levels (compound need + vision-blueprint) with both origination patterns
3. Story-craft as creative act — how well-formed scenarios are written, drawing on Story Structure model and heritage traditions
4. Experience-ME contribution — zero-distance work, ethnographic articulation
5. Primary-ME as scenario author — the vision-blueprint act
6. The "bid" mechanic — how scenarios circulate for bidding, what bidding means at neighborhood scale
7. When each origination pattern fits — speculation with example situations
8. Expanded template — what a well-formed scenario contains, both levels
9. Where scenarios live and how they circulate — FedWiki repository, forkable per neighborhood, e-VSM validation, Story Structure applied
10. How scenarios interact with the kit's phases — same as draft, with two-level distinction integrated
11. What Section 5 commits the design to

Length would probably run 3500-4000 words — longer than my current draft (2500) because the two-level structure and Story Structure integration add real content.

**Before I write:**

Two things to confirm:

1. **Story Structure application depth.** Should the design record show the full 26-node structure (heavy, but honors your work), name the seven categories with examples (lighter, more accessible), or reference it as external substrate with a link (lightest)? My inclination is the middle option — categories with examples, referenced to your Story Structure graph for depth. This keeps Section 5 readable without stripping the substance.

2. **Section 5 as-is vs new outline.** The outline above changes section structure significantly from what you edited. My inclination is to rewrite fully rather than patch, because the two-level framing threads through everywhere. If you'd rather see a lighter patch preserving more of your edited structure, tell me.

Also: the Customer Scenario Graphic — if it exists and you can share it (screenshot works, or the JSON if the upload failed silently), it would inform the "bid mechanic" section directly. Not blocking.

Ready to rewrite on your two answers.
Log updated. Waiting on Story Structure application depth and rewrite-vs-patch decision.

---
**Marc** — turn 142, 2026-09-09 22:07 UTC

categories with examples, referenced to your Story Structure graph for depth. and rewrite fully.

_uploaded files: `Simple-Story-Structure-Plus-Organizing-Path.svg` (in `sources/` where found on disk)_

---


## Rewrite — turn 143, 2026-09-09 22:13 UTC
_What Claude said before the rewrite in the same turn:_

Full rewrite of Section 5. Delivering it below.
### Section 5 — The Customer Scenario as Origin Object

#### Why the customer scenario deserves its own section

Almost no one outside Haier does this. That absence is not incidental; it is why programs come and go while the underlying needs they were meant to address persist unchanged. The pattern is well-documented: an initiative launches around a real need, produces some work while its funding lasts, then dissolves — and with it the institutional memory dissolves, so the next initiative starts from zero. Disappointment and even cynicism develop where there was enthusiasm and hope. Every re-attempt at addressing the same compound need has to rediscover the need, re-articulate it, and re-form the ecosystem around it, without benefit of what the prior attempts learned.

Haier's RenDanHeYi model contains an organ that prevents this pattern. The customer scenario is a persistent object that lives on an internal platform independent of any specific microenterprise attempting to address it. When an ME succeeds, the scenario has produced value and the ME's history attaches to the scenario. When an ME fails, the scenario returns to the platform enriched by what didn't work, available for another team to grab. William Malek reports the turnaround for a new team to form around a returned scenario at Haier's Chinese operations is two to three days. The scenario is the organ that makes ecosystem-scale work sustainable across generations of specific attempts.

This section develops the customer scenario as a first-class object in the design record — the object that ties the neighborhood's linkage-mapping work to the between-institution project shape, that anchors the balanced scorecard's value definition, that gives the SODOTO portfolio layer something to attach ME histories to, that feeds the FedWiki repository layer, and that gives the CfA-dSC contracts something to instrument around. Every subsequent section in the design record depends on the customer scenario being understood clearly.

The framework mapping — how RenDanHeYi's structural elements (microenterprise, Ecosystem Micro-Community, Industry Platform) relate to Beer's Viable System Model and to the e-VSM extension — is developed in Section 3 as shared reference. This section refers to that mapping without repeating it.

#### What a customer scenario is

A customer scenario names a compound unmet need in a user's life and, in its mature form, proposes how that need will be met by a specific microenterprise leading a specific ecosystem. Two levels of scenario documentation are worth distinguishing, because they arrive at different maturity and serve different functions.

**The scenario as compound need** is the Experience-ME's ethnographic articulation of what is actually happening for a user in end-to-end form. It describes the situated life — what is happening across time, across places, across relationships — that contains a set of unmet needs no single provider currently addresses. It is upstream of any specific solution. It says "here is what is true"; it does not yet say "here is what we will do about it."

**The scenario as vision-blueprint** is the primary-ME's proposal of how to address the compound need. As the Customer Scenario page in the RenDanHeYi FedWiki names it: the document lays out the value and the value creation process in detail; it is the vision-blueprint for the fully implemented primary microenterprise and its EMC network; it is a creative act to write; it is what people read when deciding whether to bid on the contract, in choosing to participate in the value-creating network.

Both are customer scenarios. They live in the same FedWiki repository, cross-linked. The compound-need version tends to be shorter and more descriptive; the vision-blueprint version is longer, includes the primary-ME's proposal, and functions as a bid document. Multiple vision-blueprints can form around the same compound need; the compound-need document accumulates references to whichever vision-blueprints emerge, and their outcomes.

The distinction matters because two origination patterns exist and different scenarios take different routes.

**The ethnography-first pattern.** An Experience-ME does zero-distance work with users — sustained presence in the users' life-context, listening, observing, articulating. From that work a compound-need scenario emerges. The scenario circulates. A primary-ME later picks it up and writes a vision-blueprint scenario proposing how to address it. Others bid on the vision-blueprint. The EMC forms and the work begins.

**The vision-first pattern.** Someone — often a person with strong lived experience of the compound need, sometimes a group with existing capacity — writes a vision-blueprint scenario directly, articulating both what value should be created and how they propose to create it. The document circulates for bids on the primary-ME leadership, the EMC roles, or both. The scenario may have implicit compound-need articulation woven into it, or the ethnographic work may be done in parallel as the vision-blueprint is refined.

Neither pattern is superior. Different situations call for different origination routes.

#### When each origination pattern fits

The ethnography-first pattern likely fits situations where the compound need is not visible without sustained zero-distance work. Populations under-served by existing systems, whose experience does not fit institutional categories. Situations where the actual pain is not what a first-guess would suggest. Cases where the coordination burden the user is currently carrying is invisible until someone traces the user's whole day. Emerging conditions that existing frames do not yet name. When the shape of the compound need has to be discovered through observation, ethnography-first is the honest route.

The vision-first pattern likely fits situations where the compound need is already well-articulated in the neighborhood's language, or where a specific person or group has strong lived experience that lets them write the scenario directly. Persistent problems whose shape is already visible. Cases where the primary challenge is finding execution partners rather than surfacing what's needed. Situations where waiting for ethnography would delay work that could start now.

Many real scenarios are hybrid. An Experience-ME's early work informs someone's vision-blueprint, and the vision-blueprint's writing surfaces gaps requiring more ethnography. A compound-need scenario is circulated, a vision-blueprint forms in response, and the vision-blueprint's authors return to Experience-ME work to sharpen the situation-narrative. What matters is that the two kinds of work happen — ethnographic zero-distance and vision-blueprint proposing — and that they inform each other. The customer scenario documents in the repository hold both as they mature.

#### Story-craft as creative act

Writing a customer scenario is a creative act, in the specific sense the Customer Scenario page names. The document is not a form to fill out. It is a written proposal that must move readers to want to participate. If it is well-written, an Experience-ME's compound-need scenario evokes the user's situation clearly enough that a primary-ME can see themselves working on it. If it is well-written, a vision-blueprint scenario is compelling enough that potential EMC members want to bid on their part of the value chain.

The skill has heritage in traditions worth naming. Ethnography, from anthropology and adjacent disciplines, developed the practice of sustained close observation of human contexts and the writing that reports what was observed. In the technology industry, Intel's ethnographic research programs and Peter Neupert's team at Microsoft used ethnographic method to develop the HealthVault system as an extension of the Shared Care Plan work Marc was involved in. Ethnography as method has a working record in adjacent domains. Participatory Action Research, from Kurt Lewin, Orlando Fals-Borda, and William Foote Whyte, developed the practice of research in which the researcher and the researched participate together in surfacing what is happening and what could be different. The Experience-ME's role is closer to Participatory Action Research than to distanced ethnography — the ME is part of the neighborhood, not visiting it — but both traditions inform the practice.

Story-craft itself is a real skill. Henriette Anne Klauser's *Writing on Both Sides of the Brain* advises separating the creating phase from the editing phase, working in different modes with different mindsets. That separation applies directly to scenario writing. The Experience-ME's ethnographic surfacing is creating work; the shaping of that raw material into a compound-need scenario is editing work; the primary-ME's vision-blueprint is creating work again; the refinement of the vision-blueprint into a bid-ready document is editing work again. Collapsing the modes produces documents that are either too raw to circulate or too polished to be true.

The Story Structure model Marc has developed — twenty-six nodes across seven color-coded categories, with fifty-nine directed relationships among them — offers a structured vocabulary for scenario writing. The categories name what a scenario must contain if it is to work as a story:

- **Settings and Affordances (props)** — the physical, social, and material context the situation happens in, and the resources available within it
- **Kipling context (When, Where, Who, Why-Purposes, How-Mechanisms, What-Outcomes)** — the six questions that place a situation in time, space, and cause
- **Characters with Points of View, Strategies (How), Motives (Why), Beliefs, Moods** — the interior life of the people in the scenario, including how they see, what they want, what they believe, and how they feel
- **Actions, Scenes, Roles, Plot, Dialogue, Stage** — the unfolding of what happens, played by whom, in what sequence
- **Events as new states** — the moments where the situation changes, becoming something it was not before
- **Learnings** — what characters come to understand through the events, which loops back to inform Motives, Beliefs, Moods, Roles, Strategies, Settings
- **Audience** — who receives what the story teaches
- **Organizes (AIC)** — an organizing methodology that structures how the whole moves

Object-Process Methodology is integrated (Actions as OPM Processes, States as OPM Objects), giving the story-structural elements formal grounding. The moods and beliefs entanglement in the Character cluster is the same working layer Section 7 develops as coordination grammar.

Not every scenario needs every node. What the Story Structure model offers is a checklist for what a well-formed scenario could hold and a diagnostic for what a poorly-formed scenario is missing. When a primary-ME finds itself unable to grasp what a compound-need scenario is asking for, the Story Structure model can identify what is under-developed — often it is Motives that have not been articulated, or Beliefs and Moods that are named but not shown, or the Settings and Affordances that would let readers imagine the situation concretely. When a vision-blueprint scenario fails to attract bidders, the Story Structure model can identify what would make the invitation more compelling — often it is Strategies and How that need more specificity, or Characters with multiple Points of View that would let potential EMC members see themselves in the story.

The Story Structure model is available as substrate to conveners, Experience-MEs, and primary-MEs learning to write scenarios well. Scenario writers do not need to memorize the twenty-six nodes; they do need to know that the model exists and to be able to reach for it when a scenario stalls or fails to communicate. The full model, with all nodes and edges, is maintained as a working artifact in the RCN modeling substrate.

#### The Experience-ME's contribution

Some neighborhood MEs will be scenario-articulators — small groups whose primary work is being zero-distance with residents and articulating what's actually happening in their lives. These are the people already at zero distance in a functioning neighborhood: community health workers, teachers who know families over years, chaplains, librarians who see who comes in for what, food bank volunteers, mutual-aid coordinators, elders who visit the homebound, the operators of a founded commons who watch who uses the space and how. These MEs may already exist as small groups in a neighborhood that meets the Section 4 filters; the kit does not create them but recognizes them and makes their scenario-articulation work visible.

The Experience-ME's specific contribution is threefold. First, sustained zero-distance presence in the users' life-context — not visits, not interviews, not surveys, but the kind of presence over time that lets pattern become visible. Second, articulation of what is heard and seen in end-to-end form — the writing itself, in the users' own language where possible, that turns raw experience into a compound-need scenario. Third, ongoing amendment as understanding deepens — the compound-need scenario is not written once and finalized; it is refined as the Experience-ME sees more, as users' own understanding of their situation develops, as returning attempts from primary-MEs reveal what the scenario failed to capture.

Attribution matters here. The Experience-ME who first surfaces a compound need has that articulation credited in their SODOTO portfolio, whether or not any primary-ME eventually succeeds in addressing it. Scenario articulation is real work. Its history should be visible. When a primary-ME picks up a compound-need scenario and writes a vision-blueprint, the primary-ME's work is credited in their portfolio and the causal link back to the Experience-ME is preserved. Compensation flows through the value chain to both when residents recognize value received.

Some Experience-MEs will be paid for their scenario-articulation work through the value chain when scenarios they articulated eventually produce residents-received value. Others will be doing scenario-articulation work as part of their broader small-group activity in the neighborhood, with the scenario-articulation piece credited but not separately compensated. Both are legitimate. What matters is that the work is seen.

#### The primary-ME as scenario author

The primary-ME is the microenterprise (or the microenterprise leader-and-team-in-formation) that writes the vision-blueprint scenario. They may have come to it through the ethnography-first route — picking up a compound-need scenario from the repository and proposing to address it — or through the vision-first route — writing directly from their own lived experience and understanding. Either way, the vision-blueprint scenario is their proposal.

The proposal has real substance. It names what value will be created — for whom, in what form, over what timeline. It describes the value creation process — how the work will proceed from initial ecosystem-formation through delivery to residents. It identifies the EMC network invited to form — which supporting MEs, which institutional participants, which small groups, what each contributes to the value chain. It specifies the bid terms — what participation looks like, what the Value Added Mechanism will allocate to each contributor, what the CfA-dSC contracts will encode.

The primary-ME's authorship is a creative act. They are proposing something that does not yet exist and inviting others to make it exist. The vision-blueprint scenario has to be compelling enough that potential EMC members want in, honest enough that residents recognize their own situation in it, and specific enough that the bid mechanics can operate on it.

At neighborhood scale, the primary-ME may be a small group, an individual with a small team-in-formation, or an existing small group that is shifting into leading a scenario. The Neighborhood-Catalyzing Industry Platform (described in Section 6) supports primary-ME formation through mentorship, seed capital, contract help, and connection to potential EMC members. The Platform does not write the vision-blueprint; the primary-ME does. But the Platform helps make it possible for the primary-ME to write well.

#### The bid mechanic

Once a vision-blueprint scenario is written and circulating, others bid on participation. The bid mechanic is real, not metaphorical.

At Haier scale, MEs looking for work browse the Workbench platform, find scenarios that match their capacities and interests, and propose to form EMCs around them. William Malek describes the turnaround in Chinese Haier operations as two to three days. The bidding is competitive: multiple MEs may propose different EMC configurations around the same scenario; the primary-ME (or in some cases the platform's EMC-owner function) evaluates the proposals and selects the configuration to proceed with. The Value Added Mechanism is negotiated during this bidding, specifying how compensation will flow across the ecosystem community when the work delivers residents-received value.

At neighborhood scale, the bid mechanic operates similarly but with modifications the design record has been describing. Early in RCN's development, before SODOTO portfolios have accumulated substantial history, the mature marketplace form of bidding does not fully operate. In this bootstrap period, primary-MEs form more through relationship and convener-facilitation than through open-market bidding. The vision-blueprint scenario still functions as a bid document — it names what participation looks like — but the actual selection of EMC members happens through conversation, mentorship, and the Industry Platform's judgment as much as through competitive proposal.

As portfolios accumulate and trust mechanisms mature, the bidding becomes more market-like. A primary-ME can post a vision-blueprint scenario; multiple potential EMC members can propose their participation; the primary-ME can select from among proposals based on portfolio history, cultural fit, and fit-with-the-value-chain-design. The CfA-dSC contracts instrument the resulting agreements.

The bid document — the vision-blueprint scenario itself — has to be well-formed for the bidding to work. It has to describe the scenario clearly enough that potential bidders understand what they would be joining. It has to specify the value creation process in enough detail that bidders can locate their own contribution. It has to name the bid terms transparently. And it has to be readable enough that bidders can move to a decision without doing extensive additional research. This is where the story-craft and Story Structure work matter. A poorly-written vision-blueprint scenario, whatever its substantive merits, will not attract the right bidders — or any bidders.

#### What a well-formed scenario contains

The specific artifact of a Haier customer scenario is not fully documented in public sources. Zohar describes the mechanism and gives examples but does not show the document form; Malek describes how scenarios circulate on the platform but not what fields they contain. The RCN version of a well-formed scenario is being developed through use rather than reproduced from a fixed template, drawing on Marc's Customer Scenario page in the RenDanHeYi FedWiki and the Story Structure model for orientation.

Working from Haier's mechanism, RCN's prior work on scenarios, and the design record's requirements, a well-formed customer scenario at neighborhood scale should contain the following elements. Compound-need scenarios contain the first eight; vision-blueprint scenarios contain all fourteen.

**Title in the users' own language.** "A child arriving new at school as a refugee, first year." Not "school-based refugee resettlement service coordination." The title signals whose situation this is and what makes it a distinct scenario worth naming.

**Situation described in end-to-end form.** What is the user's whole life-context, across time, across places, across relationships? What happens in the morning, what happens on weekends, what happens over the arc of a year? What are the transitions — enrollment, illness, holiday, growth — that reshape the situation? Written narratively, from within the user's experience, not as a service map. This is where Story Structure elements — Settings, Affordances, Characters with PoVs, Beliefs, Moods, Events — do their work.

**Compound unmet needs the situation contains.** What is the user currently doing without, doing with difficulty, paying too much for, waiting too long for, or being asked to coordinate that they shouldn't have to coordinate? Listed as a set, not ranked, because the compound character is what invites ecosystem formation. Each need named specifically enough that a primary-ME could recognize it.

**Who counts as the user and who counts as the user's neighbors.** The neighbor clause matters — the principle from Section 2 defines value as created by residents for residents and their neighbors, with neighbors defined by the value creators themselves. The scenario names both. A refugee-child-at-school scenario has the child as user; the child's siblings, parents, extended family, cultural community, and classroom peers may all count as neighbors in ways the scenario has to make explicit for the value chain to settle correctly later.

**Neighborhood contexts in which the scenario is real.** Some scenarios are universal enough to move across neighborhoods (a school-refugee scenario applies wherever refugees arrive at schools); some are specific to a place (an East County backcountry-medical scenario would not port directly to City Center Bellingham). The scenario names its neighborhood contexts explicitly so that MEs looking to grab it know where it applies.

**Existing attempts and their outcomes.** What has been tried before, by whom, with what results? This is the enrichment field — where returning scenarios accumulate what didn't work and why. On first articulation this may be short or empty; over cycles it becomes the scenario's most valuable content, because it saves subsequent teams from re-learning what prior teams paid to learn.

**Attribution.** Who articulated this scenario? When? Based on what zero-distance contact? Attribution matters for the SODOTO portfolio layer — the Experience-ME analog that first surfaced a scenario has that articulation credited in their portfolio.

**The invitation.** What kind of ecosystem is being invited to form around this scenario? Which small groups, institutions, and disciplines seem likely to be part of a viable Solution EMC? Not a prescription — an indication of the shape a Solution EMC might reasonably take, which any ME considering the scenario can accept, revise, or ignore.

These first eight elements constitute a compound-need scenario. Vision-blueprint scenarios add six more.

**Value proposition.** What value will be created by the primary-ME and its EMC network for the user and the user's neighbors? Named specifically enough that residents can recognize it as value, and specifically enough that the balanced scorecard from Section 10 can measure it.

**Value creation process.** How will the value be created? What is the sequence of work from ecosystem-formation through delivery? Written at enough detail to be understandable by potential bidders, without being so detailed that it prevents adaptation as the work proceeds.

**Primary-ME's proposal.** Who is the primary-ME? What do they bring — capacity, existing relationships, prior portfolio, specific commitment? Why are they positioned to lead this scenario?

**EMC network invited to form.** Which supporting MEs, institutional participants, and small groups are being invited into the ecosystem? What role does each play? What contribution does each make to the value chain?

**Bid terms.** What does participation look like for a bidder? What time commitment, what capacity contribution, what accountability? What does the Value Added Mechanism allocate to each contributor when the work succeeds? What does the CfA-dSC contract structure look like?

**Story-structural signal.** Is the scenario compelling as a story? Does it use the Story Structure vocabulary well enough that a reader can locate themselves in the situation? The vision-blueprint scenario carries its own quality-check embedded in its readability.

These fourteen elements are the current working template, subject to revision as RCN's own use surfaces what actually works. The Startup Factory material may clarify specific Haier practice and inform template refinement.

#### Where scenarios live and how they circulate

The FedWiki repository is where scenarios live. One page per scenario, forkable per neighborhood context, enriched by every attempt.

FedWiki's fork-and-modify pattern fits scenarios natively. A scenario articulated in East County can be forked by someone in Birchwood who recognizes a similar pattern, adapted for the Birchwood context, and lived alongside the East County original. Both remain visible; neither overwrites the other; a Solution ME in either place can see both versions and learn from the other's work. Cross-neighborhood learning happens through the fork history, not through any central curation.

The scenario page's structure follows the fourteen elements, in FedWiki markdown-paragraph form. Fields that require structured data — attribution, neighborhood context, existing attempts with outcomes, EMC network configuration, bid terms — link out to Overall Schema entries in Neo4j where the graph structure adds value. The Overall Schema is the RCN top-level graph schema that names the node types and edge structure connecting scenarios to MEs, primary-MEs, EMC members, portfolios, value chains, and residents. It is documented in RCN's substrate work as an ongoing artifact.

Compound-need scenarios and vision-blueprint scenarios cross-link. A vision-blueprint scenario cites the compound-need scenario it grew from (if it took the ethnography-first route). A compound-need scenario accumulates references to whichever vision-blueprint scenarios have formed to address it, along with their outcomes.

Circulation and awareness of customer scenarios happen through several mechanisms.

**Convener attention.** The convener of a neighborhood engaged with the kit maintains awareness of the scenario repository and surfaces scenarios that plausibly apply to their neighborhood during Phase 2's linkage-mapping meetings. Scenarios articulated elsewhere can inform what the meeting sees.

**Neighborhood-Catalyzing Industry Platform attention.** WWHA's granting arm, and analogous Platforms operating in other neighborhood clusters, maintain their own awareness of scenarios across the cluster of neighborhoods they serve and can bring cross-neighborhood scenarios into conversation with individual neighborhoods where relevant.

**MEs shopping.** In the mature marketplace state, MEs looking for work can browse the scenario repository and propose to form Solution EMCs around scenarios they see. This is the "you can go grab the scenario" mechanism Malek describes at Haier scale. At RCN scale, this is subject to the first-generation-portfolio conditions and the SODOTO trust mechanisms described in later sections; the mature marketplace only becomes fully operational once portfolios have accumulated enough substance to support competitive matching.

**e-VSM survey validation.** Once a compound-need scenario has been articulated, an e-VSM survey of the broader neighborhood can validate whether the scenario is real, whose experience it reflects, and what it misses. The e-VSM framework and its multi-perspective aggregation are developed in Section 3 as shared reference. Claude API synthesis of survey results provides interpretation and integration. Scenarios that survive validation get Solution EMC formation; scenarios that don't get revised or archived with what was learned.

#### How scenarios interact with the kit's phases

The kit's phases descend from the CMG five-phase Linkage Mapping playbook, adapted for neighborhood scale. With the customer scenario as first-class object, the phases produce and use scenarios explicitly rather than jumping from linkage map to project.

Phase 1 includes scenario-repository review. The convener reviews existing scenarios that plausibly apply to this neighborhood and brings the awareness into pre-work conversations. The Phase 1 diagnostic includes whether the neighborhood already has scenario-articulator patterns operating (Experience-ME analogs), even if they don't use the vocabulary.

Phase 2's first meeting produces scenarios, not projects. The linkage map surfaces the current-state view of the neighborhood in Beer's S1-through-S3 terms; the Idealized Design work surfaces the S4-desired state; the surfacing of scenarios happens as the gap between those two becomes visible. Whose life is caught in the gap, in what compound way, across what end-to-end context? That is the scenario question, and the room's answer to it is Phase 2's real output. Some of what emerges will be compound-need scenarios that require further ethnographic development; some will be vision-blueprint scenarios in nascent form. Both go into the repository.

Phase 3's weighted selection is scenario selection. The group chooses which of the surfaced scenarios matter most, using the weighted-selection matrix method the CMG playbook developed. The output is a small set of prioritized scenarios that become the basis for Phase 4's ME formation.

Phase 4 is where primary-MEs write vision-blueprint scenarios for the selected priorities (if they don't already exist), Solution EMCs form around the vision-blueprint scenarios, and bidding proceeds. Self-organizing teams engage with scenarios; they negotiate with the Neighborhood-Catalyzing Industry Platform (playing an EMC-owner role); they form the ecosystem community across the small groups and institutions the scenario needs; they put contracts in place through CfA-dSC with Leading Targets and Value Added Mechanism specified; they receive catalytic seed capital.

Phase 5 is execution, retrospective, and scenario update. The Solution ME does the work. The retrospective — grounded in the e-VSM survey of how the work landed across the neighborhood's spheres and in resident recognition of value received — feeds back to the scenario's existing-attempts field. Whether the Solution ME succeeded or failed, the scenario continues living in the repository, enriched by what happened.

The cycle can then repeat, with a new round of scenarios (or returning enriched scenarios) forming Phase 2's input for the next iteration. Or the neighborhood can set the kit free once the pattern is internalized — meaning the practice of scenario articulation, primary-ME formation, EMC bidding, and retrospective becomes native to the neighborhood without requiring the convener's Phase-facilitation to run each round. Experience-MEs continue their zero-distance work and file compound-need scenarios directly to the repository; primary-MEs continue to write vision-blueprints; Solution EMCs form and dissolve on the neighborhood's own rhythm; retrospectives happen at the founded commons on the neighborhood's schedule; the Industry Platform continues as adjacency but the ceremonial structure of Phase 1 through Phase 5 is no longer needed because the practice has become native.

#### What Section 5 commits the design to

The customer scenario is treated throughout the design record as the origin object from which specific MEs derive rather than as a description a specific ME writes about its own work. This is the inversion that distinguishes the RenDanHeYi pattern from conventional project-based work. Projects come from scenarios; scenarios do not come from projects.

Two levels of scenario documentation are preserved — the compound-need scenario as Experience-ME's ethnographic articulation, and the vision-blueprint scenario as primary-ME's creative-act proposal. Both live in the FedWiki repository. Both accumulate portfolio attribution. Both are subject to e-VSM survey validation and to Story Structure quality checking.

Two origination patterns are preserved — ethnography-first (Experience-ME surfaces need, primary-ME later proposes) and vision-first (primary-ME writes directly, ethnographic work parallels). Each fits different situations. Hybrid patterns are common and legitimate.

Story-craft is treated as the specific skill required for well-formed scenario writing. The Story Structure model Marc has developed is the substrate available to conveners, Experience-MEs, and primary-MEs learning to write scenarios well. Ethnography and Participatory Action Research are the heritage traditions the practice draws on. Klauser's create-versus-edit separation is one of the working disciplines.

The bid mechanic is treated as real, not metaphorical. Vision-blueprint scenarios function as bid documents. Primary-MEs evaluate bids. EMC networks form through bidding. CfA-dSC instruments the resulting contracts. In the bootstrap period, more relationship and convener-facilitation are involved; as portfolios mature, the mechanic becomes more market-like.

The FedWiki repository is treated as the persistent home of scenarios across cycles and across neighborhoods. Its fork-and-modify pattern is the native mechanism for cross-neighborhood learning; its markdown-paragraph structure holds the fourteen-element scenario template; its links out to Neo4j Overall Schema entries handle the structured relationships.

The e-VSM survey is treated as the small-data validation instrument for scenarios and as the retrospective instrument for how ME work has landed. Claude API synthesis integrates the survey evidence and surfaces suggestions, giving Claude an ongoing operational role in the kit rather than only a co-drafting role.

Section 6 develops the Neighborhood-Catalyzing Industry Platform pattern — WWHA's granting arm operating as an EMC-owner analog that MEs negotiate with when forming Solution EMCs and whose actors are compensated as a downstream function of the MEs they seed. Section 7 develops the moods-and-speech-acts working layer that runs through every phase and every scenario negotiation. Section 8 returns to the between-institution project shape, now understood as the operational form Solution EMCs take when executing on vision-blueprint scenarios.

### Claude's notes on delivering the rewrite

That is Section 5, around 4200 words.

Three things worth your attention.

The two-level distinction (compound-need vs vision-blueprint) threads throughout. Both live in the repository; both accumulate portfolio credit; both can be authored under either origination pattern (ethnography-first or vision-first). If you want the two-level structure named differently or the terms varied, tell me.

The fourteen-element template (eight for compound-need, six additional for vision-blueprint) draws on your Customer Scenario page directly and my earlier seven-element inference. When the Startup Factory material or your own use surfaces refinements, we revise.

The Story Structure treatment — categories with examples referenced to the graph for depth — should preserve the model's substance without demanding readers memorize the twenty-six nodes. AIC is mentioned as an organizing methodology without me committing to a specific attribution (McWhinney or otherwise). If you want AIC named specifically, or a different attribution used, tell me.

Updating the log now.
