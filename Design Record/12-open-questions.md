# Section 12 — Open Questions

**State (as of 2026-09-11):** Drafted twice (the second supersedes the first — different framing and title); awaiting Marc's edits.

**Provenance:** recovered from the Claude Chat conversation "Organizing local projects into actionable plans" (uuid 2f737cc8-4f75-402d-86b1-8b5b63e99882) via the account data export of 2026-09-11; full transcript at `chat-export/organizing-local-projects.md`. Turn numbers index that transcript. Marc's edits come from the `.pages` files in `sources/`.

**Reading order:** the latest text is the rewrite if there is one, else Marc's edits, else the first draft. Earlier layers are kept so nothing is lost and so the reasoning can be followed.


## First draft (first attempt) — turn 101, 2026-08-31 13:54 UTC
_Claude's preface:_ Drafting Section 12.
### Section 12 — Open Questions

#### Why this section exists

A design record that pretends everything is settled is not honest. This one has real questions still open — questions RCN is actively grappling with, questions the substrate maturation will affect, questions the first years of operation will teach. Naming them here does two things: it protects future readers from mistaking working assumptions for settled answers, and it invites the questions to be worked as active RCN research rather than treated as background noise.

Some of these questions have partial answers the design conversation reached. Others are genuinely open. A few are more urgent than others, in the sense that operational work depends on them and cannot proceed indefinitely without at least provisional resolution. The section names each question, describes what is known and what is not, and marks its urgency to help RCN prioritize.

The questions cluster into five groups: founded-commons succession, the Industry Platform's own operational form, the substrate maturation, cross-Platform and cross-neighborhood federation, and the questions about the kit's own limits.

#### Founded-commons succession

Section 4 developed the founded commons as substrate the kit requires and the design record treats as living, mortal, and mutually generative with neighborhood small groups. Two questions about the founded commons over time remain open.

**How long before a founded commons loses its qualities.** The failure modes are named in Section 4: founder-steward departure without succession, institutional capture through funding relationships, neighborhood turnover emptying the constituency of use, decay of collaborative-work function into event-hosting or coworking. What is not known is the typical time-scale on which these failure modes act, whether the failure modes are predictable enough to be worked against preventively, and what specific early-warning signals appear before a founded commons has visibly degraded. The Phase 5 retrospective is named as the site for noticing degradation early, but the specific signals a retrospective should look for are not yet articulated. This is active RCN grappling territory and will remain so.

**How a new founded commons can replace an old one.** Marc's framing that this is biology, sociology, and anthropology rather than engineering points at the answer's shape without giving its content. New founded commons emerge from participation in aging ones; the emergence follows patterns of imitation, adaptation, mutation, and selection that biological systems know how to do and mechanical systems cannot fake. Some early observations were named in Section 4: emergence appears to require an aging founded commons whose founder is preparing to release, one or more younger neighborhood members who have absorbed the pattern by participation, and something like an elder-mentorship relationship between the two. Emergence appears easier where the aging founded commons has stayed small enough to remain legible as a pattern. Emergence appears to depend on the presence of what elders would recognize as their own younger selves. None of these observations is settled RCN doctrine; each needs multiple confirmed cases before it becomes reliable. The RCN work on documenting founded-commons trajectories over time is where these observations will accumulate.

**Related open question — the space that fails the diagnostic.** Section 4 committed to a hard filter: no founded commons, no start. What is not developed is what a convener does when they encounter a neighborhood they care about that fails the filter. "Wait" is honest but empty. "Help the neighborhood find its space" is prescriptive and probably wrong. "This is not something the kit can help with — the space has to come from the neighborhood itself, and if it doesn't, the neighborhood is telling you something" is truthful but leaves the convener with nothing to do. Whether there is a legitimate role for Platform actors in supporting nascent founded-commons emergence in a neighborhood that has none, without inadvertently substituting for the internal emergence that is the actual pattern, is not resolved.

#### The Industry Platform's own operational form

Section 6 developed the Industry Platform pattern and named that the Platform exists at higher recursion than the neighborhoods it serves, requiring its own S4 function at cluster scale. Several questions about the Platform's own operational form remain open.

**The Platform's own S4.** At neighborhood scale, S4 is Idealized Design plus SWOT-type scanning, activated through the kit's phases. At cluster scale, S4 requires different tools. What is the Platform's outside-and-future work? What is coming across the cluster that individual neighborhoods cannot see from their own recursion level? What patterns emerging in one neighborhood might apply to others? What is the Platform's Idealized Design for itself and the cluster it serves? Marc's Ripple ReThink SDM remains available as one tool for cluster-scale S4 when relevant. Cross-scenario pattern recognition across neighborhoods is another Platform S4 function. Cross-generational elder-succession work is another. The Platform's S4 is not the kit's job to develop; it is the Platform's own ongoing work. Whether the RCN substrate should provide specific tools for cluster-scale S4 beyond what the neighborhood-scale kit provides is open.

**The Platform's charter.** WWHA's charter needs to encode the four principles from Section 2 and the value definition's anti-capture properties from Section 10 as founding limits. The specific charter language is not drafted, and the governance structure that will enforce the limits is not specified. Who sits on WWHA's board? How are board members selected and rotated? What happens when a board member's judgment about scorecard-versus-funder-pressure differs from the neighborhoods' judgments? What happens when the Platform's compensation model produces distributions that individual Platform actors find inequitable? These are governance questions the design record cannot answer in the abstract; they are WWHA's design work.

**The Platform actors' initial compensation.** Section 6 committed to the mature form of the compensation mechanism and treated the interim before CfA-dSC and SODOTO are fully operational as requiring approximations that preserve the structural properties. What those approximations look like in practice — what Carl, Chris, Jerry, and Brent are compensated on in 2026 and 2027 before the full substrate is operational — is not specified. Whether they are compensated at all in the interim, and if so on what basis, is a real operational question. The structural commitment (outcome-dependent, downstream, variable, capable of returning zero) has to hold; how it holds in the transitional state is open.

**The transition from first-generation to mature marketplace.** Section 5 named that MEs grabbing scenarios and forming ecosystem communities is the mature marketplace state, and that the first-generation state requires more Platform-actor scaffolding because portfolios have not yet accumulated enough substance to support competitive matching. When does the transition happen? How do Platform actors recognize that the marketplace has matured enough that first-generation scaffolding should recede? Is there a way to accelerate the transition without violating the structural properties, or does the marketplace need to develop at its own biological pace regardless of Platform preferences? These questions cannot be answered before the first cycles of MEs form and either succeed or fail; the answers will develop empirically.

#### Substrate maturation

Several sections of the design record commit to substrate that is in active development. The design record commits to the mature form and treats the transitional state as requiring approximations. What specifically has to mature and on what timeline is worth naming.

**CfA-dSC.** The dyadic smart contract layer is expected to instrument ME chartering, Value Added Mechanism specifications, promise-and-offer tracking, and settlement. Its current state (state machine, schema, and currency model developed) is not yet a fully operational contracting layer for the ME formation sequence Section 8 describes. What CfA-dSC needs to develop before it can serve this function fully, and how the design should be adjusted if the substrate matures in a different direction than currently expected, is open.

**SODOTO.** The credentialing and portfolio layer is expected to hold participant histories, attributed contributions, and the causal traces that support settlement. Its current state (issuers, keys, handshake model) supports basic portfolio functions but does not yet fully support the compensation flow-tracking Section 6 and Section 9 describe. What SODOTO needs to develop, and what happens if it matures differently, is open.

**Overall Schema.** The top-level graph schema is expected to hold Scenario, ME, Institution, Person, Founded-Commons, Value-Chain, and Portfolio as node types with the relationships among them. Its current state (v0.1 with 32 nodes and 63 edges) covers substantial ground but does not yet include the specific node types the design record requires. The v0.2 revision that adds Scenario as a first-class node type, distinguishes Experience-ME and Solution-ME as sub-types, and encodes Value-Chain as a first-class object is anticipated. Whether the schema will develop in the direction the design record assumes, or in some other direction that the design record will need to accommodate, is open.

**e-VSM Survey/Diagram/Dialogue.** The survey layer with Claude API synthesis is expected to provide the multi-perspective read at multiple phases and the retrospective evidence for scorecards. Its current state (generic Neighborhood Development Center survey with 11 spheres, 66 directed edges, Markov Blanket layer mapping; municipal SOFI design initiated; SODOTO SOFI Certificate program planned) is operational for the general case. Whether the e-VSM instruments need customization for specific scenarios and phases, and how that customization is managed without diluting the psychometric integrity of the instruments, is open.

**FedWiki federation.** The delivery medium for the design record and the kit is expected to hold scenarios, retrospectives, and cross-neighborhood learning through the fork-and-modify pattern. Its current state (working, in active use by Marc, Ward, and others) supports the design record's needs. Whether the specific FedWiki plugins and rendering the RCN work uses will scale to hold the volume of content the mature system will generate, and whether the aggregator plugin's Claude API integration will develop the additional capacities the design assumes, is open.

**RCN Graph Tool.** The visualization layer for linkage maps, scenarios, and their relationships. Its current state (v22, schema-locked, validator working) supports the visualization work Section 8 describes. Whether the tool needs additional capabilities to support the Industry Platform's cross-neighborhood pattern recognition, and whether Neo4j as the underlying graph substrate will scale, is open.

#### Cross-Platform and cross-neighborhood federation

Section 6 committed to polycentric organization across Platforms — WWHA in Whatcom, the Fledge in Superior, Leo's in Lansing, other Platforms as they emerge — without centralized RCN authority. Several questions about how the federation actually works remain open.

**The shared substrate's governance.** FedWiki, Overall Schema, CfA-dSC, SODOTO, and e-VSM are shared across Platforms. Who governs their ongoing development? What happens when Platforms disagree about substrate direction? Marc and Kerry and the current RCN participants hold much of the substrate development informally in 2026; formal governance for the substrate as it matures is not specified. Whether the substrate needs a formal governance body (with its own risk of becoming a centralized RCN authority) or can be governed through peer-based mechanisms (which have their own scale limits) is open.

**Cross-neighborhood scenario forking.** Section 5 committed to the fork-and-modify pattern for scenarios across neighborhoods. What happens when a fork develops in a direction that the original scenario's neighborhood disagrees with? What happens when multiple forks of the same scenario develop simultaneously in different neighborhoods with contradictory value definitions? Whether cross-neighborhood dispute-resolution mechanisms are needed, and what shape they should take if so, is open.

**Elder mentorship across neighborhoods.** Carl, Chris, and Jerry mentoring convenors and ME leaders in their own neighborhoods is straightforward. Cross-neighborhood mentorship (Chris mentoring an emerging convener in East County, or Carl mentoring a Fledge participant) is possible and probably valuable but adds coordination and compensation questions. How cross-neighborhood mentorship is compensated when the mentor's Platform and the mentee's Platform are different is not specified.

**New Platforms emerging.** How does a new founded-commons become a Platform? What makes a place ready to host a Platform function rather than only to host neighborhood work? Who decides? The current four convenors and their spaces represent the founding generation; how the second generation of Platforms emerges is not yet worked. Marc's memory files note ongoing conversations with Chris and Jerry that would inform this; the design record cannot resolve it in advance.

#### The kit's own limits

The kit as designed does not attempt many things it could plausibly attempt. Some of these limits are principled (the founded-commons filter, the elder-only convener requirement); others are contingent (limits imposed by current substrate maturity). Naming what the kit does not do prevents the kit from being asked to do things it cannot do well.

**Neighborhoods without founded commons.** Section 4 committed to a hard filter. What Platform actors do in neighborhoods that fail the filter is not resolved. Whether there are related interventions RCN could develop for this case (documenting patterns of founded-commons emergence, supporting neighborhood conversations about what would be needed for a founded commons to emerge, connecting neighborhood members to elders who have founded commons in other places) is worth working, but they are not part of the current kit.

**Neighborhoods with functioning S4 already.** The kit is designed for the specific case of neighborhoods with functioning S1-S3 and some S5, but non-functional S4. Neighborhoods where S4 is already functioning may not need the kit's specific intervention; they may need different things (funding for MEs they have already identified, connection to other neighborhoods doing similar work, help with cluster-scale coordination). Whether the kit should be adapted for these cases or whether they should be served through different RCN offerings is open.

**Non-neighborhood scales.** The kit operates at neighborhood scale. Higher recursion (city, county, region) and lower recursion (block, extended family, single institution) are different scales with different requirements. The design record has committed to the neighborhood as the primary scale of intervention because that is where Ashby's Law's requisite variety lives for the kind of work RCN does. Whether related tools should be developed for higher or lower recursions, and how they would relate to the kit, is open.

**Non-U.S. contexts.** The kit is being designed initially for U.S. neighborhoods with the specific institutional and cultural context that implies. Adaptation for non-U.S. contexts (whether Haier-style Community Store models, European neighborhood-council traditions, or Global South community organizing patterns) is not attempted in the current kit. Whether RCN should extend to non-U.S. contexts and how, is a strategic question the design record does not answer.

**AI and Claude's ongoing role.** Section 10 named Claude's role in interpretation and integration of e-VSM survey evidence. Section 5 named Claude's role in scenario validation. Section 7 named CfA-dSC as the eventual instrumentation of speech acts. Across these, Claude is treated as an ongoing operational participant in the kit rather than only as a co-drafter of the design record. What Claude's role will actually be as the substrate matures — how much interpretive judgment Claude will hold, what accountability structures apply to Claude's contributions, how Claude's role changes as different AI systems become available — is open. This is not merely a technology question; it is a design question about how much of the kit's functioning should depend on a specific AI provider.

#### What Section 12 commits the design to

The design record does not pretend everything is settled. The five clusters of open questions above are named explicitly, and the design commits to treating them as active RCN research rather than as resolved doctrine.

Future readers of the design record should understand that operational work has proceeded and can proceed on the settled portions of the design while the open questions are worked. The four principles from Section 2, the VSM frame from Section 3, the founded-commons concept from Section 4, the customer scenario as origin object from Section 5, the Industry Platform pattern from Section 6, the moods-and-speech-acts working layer from Section 7, the between-institution project shape from Section 8, the catalytic seed capital principle from Section 9, and the value definition from Section 10 are stable enough that convenors can begin using the kit against them. The open questions in this section do not block operation; they are the ongoing work that will refine and mature the design over time.

The design record commits to being updated as the open questions develop answers. Some will resolve through operational experience (whether MEs form successfully in first-generation neighborhoods, whether the compensation approximations hold structural integrity, whether the founded-commons succession patterns actually appear in the cases RCN is watching). Others will resolve through substrate maturation (whether CfA-dSC develops in the expected direction, whether Overall Schema v0.2 encodes what the design assumes). Others may not resolve; they may remain open indefinitely and become part of the design's permanent grappling.

The kit is a living document. So is this design record. Both will be gardened over time by the RCN participants working with them, with the current four convenors — Carl, Chris, Jerry, and Brent — as the first gardeners. What emerges from their work with the kit will teach RCN more than the design record's specifications can anticipate, and the design record will need to be revised in response. That is the design's intended pattern of maturation.

### Claude's notes on delivering the draft

That is Section 12, around 2500 words, and it completes the design record.

Three things worth your attention before you have the full document to review.

The five clusters of open questions represent my synthesis of what the design conversation left unresolved. Some clusters (founded-commons succession, Platform S4) are things you and RCN are actively working. Others (cross-Platform federation, kit limits) are questions I've identified from the design conversation but that you may want to reshape substantially. If any cluster misrepresents what is actually open in RCN's current work, tell me and I'll adjust.

The section's tone is more explicitly RCN-facing than most earlier sections. It refers to RCN grappling, RCN research, RCN participants gardening the document over time. This is deliberate — the open questions are RCN's work, not the design record's answers — but it means Section 12 reads differently from Section 1 through Section 11. Say if the tonal shift is right or if you want it more consistent with earlier sections.

The final paragraph names the four convenors as "the first gardeners" of the kit and design record. This is a commitment about their role that goes beyond what earlier sections named explicitly. If that role framing is right, it belongs in the design record; if it overstates or reshapes what you intend, tell me.

The full twelve-section design record is complete. Ready to compile as a single markdown document for your review, or to begin the FedWiki rendering process, or to move to drafting the kit itself. Your call on what happens next.


## First draft (second attempt — supersedes the first) — turn 103, 2026-08-31 16:04 UTC
_Claude's preface:_ Drafting Section 12.
### Section 12 — Open Questions and Ongoing RCN Grappling

#### Why this section closes rather than concludes

A design record that presented itself as complete would be lying. The design this record describes is in active development, with several load-bearing questions still unresolved and several others whose answers will only emerge from the first years of operation. Naming what is open, and how open it is, is more honest than performing closure and more useful to future readers than a summary that pretends the work is done.

This section holds three kinds of open material.

First, questions that RCN is actively grappling with — matters where thinking is underway but has not yet settled, where the design record makes provisional commitments that may need revision as the grappling produces answers.

Second, questions whose answers depend on substrate maturation — matters where the design's operational form depends on tools, contracts, or infrastructure not yet fully built, and where the transitional state involves approximations that will be replaced by mature mechanisms over time.

Third, questions whose answers can only come from empirical experience — matters where thinking cannot substitute for doing, and where the first years of actual operation will teach what no amount of design conversation can predict.

Each category is treated separately because each requires a different kind of response from future readers and future work.

#### Questions RCN is actively grappling with

##### How new founded commons replace old ones

Section 4 named this as one of the two questions the design record must hold open rather than pretend to answer. The founded commons is a living thing with a mortal life span; new founded commons emerge from participation in aging ones through patterns of imitation, adaptation, mutation, and selection that belong to biological rather than mechanical systems thinking. RCN is grappling with what conditions favor emergence, how the transition from one generation of founded commons to the next happens well or badly, and whether the pattern can be catalyzed without over-specifying it.

Early observations from the design conversation (preserved in Section 4) suggest emergence requires an aging founded commons whose founder is preparing to release, one or more younger neighborhood members who have absorbed the pattern by participation, and enough small-enough-to-remain-legible quality that the pattern can be seen and taken up. What favors emergence, what impedes it, and what conditions actually make it possible remain open questions.

The design record's commitment is to name the open question, point convenors toward the RCN conversation about founded-commons succession, and refuse to over-specify. Vester's biological systems framing is the sensibility inside which the eventual answers will live. The framework for observing and documenting emergence patterns as they occur is one of the things the current RCN work needs to develop; the observations that accumulate over time will inform how future versions of the design record treat this.

##### The Platform's own S4 function at cluster scale

Section 6 named that the Industry Platform exists at higher recursion than the neighborhoods it serves, and that WWHA (and each other Platform) needs its own S4 function operating at cluster scale. What that S4 function looks like operationally — what Idealized Design work happens at cluster scale, what environmental scanning informs it, what tools support it, how it coordinates with the neighborhood-scale S4 activation the kit provides — is not fully worked out.

Marc's Ripple ReThink System Dynamics Model remains available as one S4 tool for cluster-scale work when a question surfaces that needs it. Cross-scenario pattern recognition across neighborhoods is another S4 function the Platform performs. Cross-generational elder-succession work is another. Beyond these named functions, what the Platform's ongoing S4 practice looks like — its cadence, its convening forms, its documentation, its own retrospective structure — remains open.

The design record's commitment is to recognize this as ongoing Platform work rather than kit work, and to hold it as a design conversation to continue among Platform actors (Carl, Chris, Jerry, Brent initially) and RCN participants (Marc, Kerry, Ward, and others). The kit itself does not attempt to install cluster-scale S4; the Platform develops its own.

##### WWHA's charter and governance

Section 10's anti-capture properties named several constraints that need to be reflected in WWHA's charter as founding limits: outsiders cannot originate scorecards, grantmakers can only decline to fund rather than negotiate scorecards, revisions cannot be triggered by funder pressure, the neighborhood's determination of value received is final. Section 6's Industry Platform pattern named additional structural commitments: compensation must remain outcome-dependent, no centralized authority over other Platforms, diversified funding sources structurally required.

WWHA's actual charter — the legal instruments, governance structures, board composition, decision-making procedures, and accountability mechanisms — is being drafted by Marc, Kerry, and collaborators. The design record's principles inform the charter but do not substitute for it. What specific language accomplishes what specific structural commitment, how the charter handles the transitions between founder-led early stage and mature elder-succession stage, how the charter interfaces with legal requirements for nonprofit or cooperative or other organizational forms — all of this is active drafting work.

The design record's commitment is to name the structural properties the charter must preserve and to update as the charter's specific form is developed. Future versions of the design record will reference WWHA's charter as it takes final form.

##### The relationship between RCN and its constituent Platforms

Section 6 committed to polycentric relationship among Platforms — WWHA in Whatcom, the Fledge in Superior, Leo's in Lansing, and other Platforms as they emerge — without any centralized RCN authority over them. Cross-Platform coordination happens through peer relationship, shared substrate (FedWiki, Overall Schema, CfA-dSC, SODOTO), and elder-mentorship networks among Platform actors.

What "RCN" is, organizationally and legally, in this arrangement remains open. Is RCN a federation of Platforms with a specific coordinating function? A shared brand and set of standards without organizational form? A support enterprise (in Rendanheyi terms) that serves the Platforms with substrate infrastructure? A pattern language that names how the work is done without instantiating any specific entity? Some combination? The design conversation preserved the polycentric commitment without resolving the organizational form.

The current RCN work stream includes tooling (SODOTO, CfA-dSC, Overall Schema, Graph Tool, e-VSM, FedWiki federation) that functions across Platforms without requiring centralized RCN organizational structure. Whether that continues to be sufficient as more Platforms emerge, or whether some more explicit RCN form is needed, will be answered by what the emerging Platforms actually need.

The design record's commitment is to preserve the polycentric constraint and let RCN's organizational form develop from what Platforms need rather than from what RCN might want to be.

#### Questions dependent on substrate maturation

##### CfA-dSC's operational form and its interface with speech acts

Section 7 committed to CfA-dSC as the substrate that will eventually instrument speech acts formally — promises captured as smart contracts, declarations recorded with attribution, offers and requests tracked in the coordination layer. Section 8 committed to CfA-dSC as the substrate that will eventually instrument ME chartering and Value Added Mechanism specification. Section 9 committed to CfA-dSC as the substrate for catalytic seed capital deployment.

CfA-dSC is in active development but not fully operational. What "fully operational" means in practice — what user interface convenors and MEs interact with, what the smart contracts actually enforce, how the state machine handles the various speech acts and their combinations, how the currency model settles compensation across the Value Added Mechanism — is being worked out.

The design record's transitional-form commitment (interim mechanisms preserve structural properties while mature mechanisms are built) applies here directly. In the interim, ME chartering happens through more manual coordination with the same structural properties. As CfA-dSC matures, the manual coordination is progressively replaced by contract-instrumented coordination.

The specific timeline for CfA-dSC maturation is not part of the design record; it depends on CfA-dSC development work happening in parallel with RCN's other work streams. What the design record commits to is that CfA-dSC's mature form preserves the structural properties the design requires, and that the interim mechanisms are recognized as transitional rather than treated as permanent.

##### SODOTO's operational form and its relationship to portfolios and trust

Section 8 committed to SODOTO portfolios as the persistent record of individual contributions to ME work, and Section 9 committed to portfolio data accumulated in SODOTO as the substrate for Platform actor pattern-recognition over time.

SODOTO is being developed as a credentialing system with issuers, keys, handshake model, and next-session issuance patterns. Its operational form — how portfolios are structured, what entries look like, how attestation works, how portfolios are surfaced when needed (during scenario grabbing, during ME formation, during Platform mentorship decisions) — is in active development.

The design record's commitment is that SODOTO's mature form supports the trust mechanisms the design requires (first-generation portfolios accumulating substance over time, mature-marketplace bidding based on portfolio depth, cross-neighborhood recognition of accumulated work), and that interim mechanisms preserve the intent while SODOTO develops.

##### Overall Schema's stable form

Section 8 committed to Overall Schema as the graph structure that represents scenarios, MEs, Platform actors, ecosystem members, founded commons, and residents, with edges representing the relationships among them. The current Overall Schema (v0.1, 32 nodes, 63 edges, 14 node labels) is being extended toward v0.2, with open decisions flagged for Kerry review.

What the stable v1.0 Overall Schema looks like — which node types are represented, which edge types are used, how scenarios interact with MEs, how portfolios attach, how neighborhood boundaries are represented, how the e-VSM survey layer connects — depends on the schema development work continuing in parallel with the substrate work.

The design record's commitment is to describe the mature graph structure in terms consistent with the current schema direction, with the recognition that specific schema decisions will settle as v0.2 and successors take shape.

##### FedWiki federation for the scenario repository

Section 5 committed to FedWiki as the delivery medium for the scenario repository, with the fork-and-modify pattern as the native mechanism for cross-neighborhood learning. The current FedWiki federation work includes the Foothills Outlook and Whatcom Court conversions, the e-VSM aggregator plugin, and Ward Cunningham's ongoing FedWiki development.

What the mature scenario repository looks like on FedWiki — the specific page structure, the field standards, the aggregator queries that surface scenarios by neighborhood or by pattern, the cross-Platform federation configuration — depends on continuing FedWiki work and on what use surfaces as needed.

The design record's commitment is that FedWiki serves as the scenario repository and delivery medium, with the specific operational form developing through use.

#### Questions whose answers only come from empirical experience

##### Whether the four principles hold under sustained operation

Section 2's four principles (facilitator variety distributed, elder-driven Industry Platform actors compensated through value chain, catalytic seed capital that departs, value created by and for residents and their neighbors) are designed to structurally resist the failure patterns that have collapsed prior attempts. Whether they hold under the sustained pressure of actual operation — whether the anti-capture properties survive contact with real funders, real institutions, real political pressure, real personnel turnover, real economic stress — cannot be determined in advance.

The design record's commitment is that the first years of WWHA's operation are as much learning as delivery, with genuine willingness to revise the principles if operation reveals structural weaknesses the design conversation could not anticipate. The four principles are not treated as eternal truths; they are treated as the current best design informed by prior work, subject to revision as new evidence accumulates.

##### What actual ME formation looks like at neighborhood scale

Section 8's scenario-to-ME formation sequence describes how MEs form around scenarios, negotiate value chains, and enter into contracts. This description draws on Haier's mechanics scaled down to neighborhood, on Marc's prior Spokane and Medford implementations, and on the design conversation's synthesis. Whether ME formation at neighborhood scale actually proceeds as described — the pacing, the specific negotiations, the failure modes, the ways teams self-organize versus struggle to form — will only be known from actual first-generation ME formations in East County, Superior, Lansing, and Whatcom neighborhoods.

The design record's commitment is that the described sequence is a working hypothesis, and that early ME formation experiences will inform revision of the description in future versions of the record.

##### What the balanced scorecards actually look like when neighborhoods construct them

Section 10 committed to neighborhood-authored balanced scorecards as the operational form of value measurement. What those scorecards actually contain when specific neighborhoods construct them — what dimensions matter to East County versus Superior versus Whatcom neighborhoods, how much variation exists across neighborhoods, whether the variation is generative or unwieldy, whether cross-neighborhood comparison remains meaningful — will only be known from actual construction.

The design record's commitment is that the scorecard framework holds even if specific scorecards vary substantially, and that the Rasch-substrate approach lets variation be handled without collapsing the framework.

##### Whether Platform actors' compensation actually works as designed

Section 6 committed to outcome-dependent compensation for Platform actors flowing from residents' recognition of value received. Section 9 committed to catalytic capital cycling through MEs and returning to the Platform through Value Added Mechanism settlements. Whether the aggregate economics of this compensation model actually sustain Platform actors at levels that allow them to do the work — whether the model needs adjustment based on actual ME success rates, actual scenario complexity, actual timelines to value recognition — will only be known from actual operation.

The design record's commitment is that the structural properties (outcome-dependence, downstream-flow, alignment with residents-received value) are non-negotiable, and that specific parameter adjustments (percentages in Value Added Mechanism, capital sizing formulas, timeline expectations) will develop from actual experience.

##### How elder succession actually proceeds

Section 9's discussion of catalytic principle across scales includes elder succession as one of the scales at which the principle operates. Whether elders actually release their roles as they age, whether younger successors actually take up the roles well, whether the succession patterns Marc has hypothesized (participation-based transmission, mentorship in the founding of new founded commons, generational stages of doing and releasing) actually work at scale — all remain empirical questions.

The design record's commitment is to name elder succession as ongoing work, to document what happens as first-generation Platform actors (Carl, Chris, Jerry, Brent and their peers) begin the release process, and to inform future versions of the record with what succession patterns actually emerge.

##### Whether the design record and the kit themselves are usable

The design record you are reading and the kit that will be drafted against it are themselves subject to empirical test. Whether Carl, Chris, Jerry, Brent and future convenors actually pick up the kit and use it, whether the design record's reasoning actually helps new participants understand what they are joining, whether the moods-and-speech-acts vocabulary earns its way in through use as intended, whether the customer scenario as first-class object actually gets constructed in FedWiki as the design contemplates — all these are empirical questions.

The design record's commitment is that this document and the kit are themselves subject to revision based on how they land with actual users. If specific sections turn out to be confusing, prescriptive where they should be open, gestural where they should be operational, or theoretical where they should be practical, they will be revised. The design record is not a monument; it is a working document that gardens itself as the work matures.

#### What Section 12 commits the design to

The open questions are named honestly, without pretense that thinking has settled where it has not. Future readers can engage the open questions as active work rather than as assumed answers. RCN participants know which questions are their grappling to do and which are waiting for empirical evidence.

Three categories of openness are distinguished — active grappling, substrate maturation, empirical experience — because each requires a different kind of response. Grappling questions invite continued design conversation. Substrate questions invite continued substrate development. Empirical questions invite operation and observation.

The design record is committed to updating as questions get answered. Future versions of the record will refer back to this section and mark which questions have moved from open to settled, and how. Questions that turn out to be poorly posed will be revised or replaced. The record itself is one of the empirical experiments the design is running.

The four principles from Section 2 remain the design's load-bearing architecture. They are not treated as eternal, but they are treated as the current best design and the specific structural response to the failure patterns that prior work has documented. Revision of the four principles would be a substantial redesign; revision of specific operational forms downstream of them is expected and welcome.

The kit that will be drafted against this design record is the next major deliverable. It translates the design's reasoning into operational form for Carl, Chris, Jerry, Brent and future convenors. The kit's form will develop through drafting, use, and revision on the same gardening logic that this design record uses.

Cross-references to WWHA's charter, the CfA-dSC operational specification, the SODOTO credentialing detail, the Overall Schema stable form, and the FedWiki federation configuration will be added to future versions of this record as those documents take final form. In the current version, these are referenced as ongoing work with the recognition that they and this record co-evolve.

The reader who has arrived at this section has read the current best form of the design as of this drafting. The design continues. The reader is invited to participate.

### Claude's notes on delivering the draft

That is Section 12, around 2600 words. And it closes the design record's twelve sections.

Three things worth your attention on this section specifically.

The three-way categorization (active grappling, substrate maturation, empirical experience) is my synthesis of what "open question" means across the design conversation. If you'd prefer the questions treated in a different structure (by topic rather than by category, for example), tell me and I'll restructure.

The empirical-experience section includes "Whether the design record and the kit themselves are usable" as an open question. This is deliberately self-reflexive — the design record puts itself on the same empirical footing as everything else it describes. If that reads as too clever or too postmodern, I can rework it as a more matter-of-fact commitment to revision.

The closing paragraph ("The reader who has arrived at this section has read the current best form of the design as of this drafting. The design continues. The reader is invited to participate.") is a specific rhetorical choice — inviting the reader into ongoing work rather than delivering a conclusion. If you'd prefer a different closing register, tell me and I'll revise.

A few things worth flagging now that the full twelve-section draft exists.

The design record runs somewhere between 25,000 and 30,000 words total. That is substantial. It is written for the newcomer-or-curious-outsider audience we settled on early, which required scaffolding that people-already-in-the-work would find long. If you want a shorter form for people already in the work — a five-page or fifteen-page executive version — I can produce one as a companion document. It would sit alongside the full record rather than replacing it.

Cross-references between sections are consistent but not hyperlinked in the markdown. When we render the sections into FedWiki page JSONs, the internal-link resolution happens then, using FedWiki's native [[wikilink]] pattern. Similarly, the diagram descriptions I've embedded in the text ("A Graph Tool diagram of the four principles as connected structure would show...", though I've been more implicit than that in most sections) get rendered as actual RCN Graph Tool diagrams during the Claude Code rendering step.

The kit itself — the facilitator's guide for Carl, Chris, Jerry, Brent — is the next artifact and is a substantially different kind of writing than this. The design record is reasoning; the kit is instruction. The kit will draw on the design record for its grounding but will look very different in tone, structure, and length.

Say what you'd like next — reactions to specific sections, revisions to the record, moving to render into FedWiki, beginning the kit draft, or something else I'm not anticipating.
