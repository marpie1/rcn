# Section 9 — Catalytic Seed Capital

**State (as of 2026-09-11):** First draft delivered; awaiting Marc's edits.

**Provenance:** recovered from the Claude Chat conversation "Organizing local projects into actionable plans" (uuid 2f737cc8-4f75-402d-86b1-8b5b63e99882) via the account data export of 2026-09-11; full transcript at `chat-export/organizing-local-projects.md`. Turn numbers index that transcript. Marc's edits come from the `.pages` files in `sources/`.

**Reading order:** the latest text is the rewrite if there is one, else Marc's edits, else the first draft. Earlier layers are kept so nothing is lost and so the reasoning can be followed.


## First draft — turn 95, 2026-08-31 09:26 UTC
_Claude's preface:_ Drafting Section 9.
### Section 9 — Catalytic Seed Capital

#### What catalytic capital is and is not

Money enters the work described in this design record in one form only: catalytic seed capital that funds new work at its launch and departs when the new work has become self-sustaining or when it has failed. This form is distinct from the several other forms money commonly takes in philanthropic and public-sector work, and the distinctions matter because the failure modes of the other forms are exactly what the design exists to prevent.

Catalytic seed capital is not operating subsidy. Operating subsidy funds ongoing work at whatever level it takes to keep the work going. It creates dependency by design: the recipient becomes dependent on the subsidy's continuation, and the funder acquires ongoing power over the recipient's decisions. Operating subsidy is what most philanthropic grant-making effectively becomes over time, whatever its original framing. The pattern is well-documented and reliable.

Catalytic seed capital is not project funding in the standard sense. Standard project funding pays for a discrete piece of work, usually scoped, budgeted, and timelined by the funder or by the recipient in dialogue with the funder's priorities. It funds work that would happen more or less the same way if the funder chose it or a different one. It does not catalyze new work; it selects among existing candidates for work that could happen anyway.

Catalytic seed capital is not investment in the venture-capital sense. Venture investment expects financial return proportional to risk taken, and the return flows to the investor rather than to the residents whose lives the venture affects. The venture's success is measured in the investor's terms; the community whose problem the venture addresses is treated as market rather than as beneficiary.

What catalytic seed capital is: money that enables an ME to try something it otherwise could not, sized to make the launch possible, structurally shaped so that it departs when the ME either succeeds and becomes self-sustaining or fails and dissolves. The catalyzing happens because a launch that could not have happened without the capital now happens. The departure happens because the capital's job is done at launch, not because of any external judgment about when to withdraw.

#### The catalyzability test

The Industry Platform, when considering whether to seed a Solution ME forming around a scenario, applies a specific test: is this catalyzable? The test is not "is this a good project" or "does this address a real need" or "would this create value if it worked." Those are all easier questions and all less useful. The catalyzability test asks: will the seed capital do its work and then be able to step away, or is this a request for ongoing subsidy dressed as a launch?

Answering the question requires distinguishing between two different situations that look similar on the surface.

The first situation: the ME needs capital to acquire capabilities, relationships, tools, or presence that, once acquired, become part of the ecosystem's ongoing operational capacity. A CHW network that receives seed capital to hire and train its first cohort of workers, whose ongoing work then generates the fees or grants or referral revenue that sustains the network, has been catalyzed. The seed capital enabled the acquisition; the acquired capacity now runs on its own metabolism. The Platform's role in that ME is done at launch.

The second situation: the ME needs capital to do work that has no self-sustaining metabolism, and the work will need capital continuously in order to continue. A program that provides a specific service to residents and requires ongoing funding to continue providing that service is not being catalyzed by seed capital; it is being subsidized. The seed framing is aspiration; the operational reality is dependency.

The distinction is often unclear at the moment of ME formation. Some MEs that appear catalyzable turn out to be subsidy-shaped once execution begins; some that appear subsidy-shaped turn out to develop unexpected self-sustaining metabolism. What matters is that the Platform asks the question honestly at formation and re-asks it during execution. The catalyzability test is a discipline, not a formula.

Elders who have seen the pattern many times are better at this discipline than newcomers. Marc's thirty years of work in this space produces catalyzability judgments that a first-year foundation program officer cannot match, not because the elder is smarter but because the pattern is only visible through many repeated cases. This is one of the specific reasons the Platform actors must be elders — the catalyzability judgment they bring is capacity that cannot be substituted by training or process.

Elders also fail this test in specific ways worth naming. They can become attached to particular kinds of work and want to seed instances of it whether or not the specific instance is catalyzable. They can become resigned about a domain and refuse to seed real opportunities because they've been burned before. They can lose the distinction between the pattern they know and the specific case in front of them. The Platform's compensation structure — outcome-dependent, downstream, variable — is what corrects for these tendencies over time. An elder whose seeding judgments fail catalyzability tests reliably will see their compensation decline; that signal is more honest than any peer review process would be.

#### Sizing

The size of catalytic seed capital is set by what the launch requires, bounded by what the Platform can deploy without over-committing to any single ME, and shaped by the specific structure of the scenario the ME is addressing.

The lower bound is what the ME actually needs to launch. Under-seeding to spread capital across more MEs is a failure mode; MEs that launch under-capitalized fail more often, and each failure represents lost work, lost portfolio accumulation, and lost residents-received value that a well-seeded ME might have produced. The Platform's compensation depends on ME success; under-seeding to appear frugal actively harms the Platform's own long-term compensation.

The upper bound is what the launch actually requires. Over-seeding creates its own failure mode: the ME becomes dependent on the seed capital as ongoing budget rather than treating it as launch fuel. Once an ME's operations scale to consume a specific level of continuous funding, the ME cannot easily contract back to a self-sustaining scale; the over-seeded ME either becomes a subsidy case or dissolves painfully. Over-seeding also concentrates the Platform's capital in fewer MEs, reducing the diversity of scenarios that can be seeded and the diversity of learning that returns to the repository.

Between these bounds, the specific size depends on the scenario, the ME's composition, the ecosystem community's other contributions, and the expected timeline to self-sustainability or completion. Some MEs need substantial capital because their launch involves acquiring durable infrastructure (equipment, physical space commitments, technology systems). Others need modest capital because their launch is primarily about assembling relationships and negotiating agreements, with the operational work happening through participants' existing roles and contributions.

There is no universal formula. The Platform actor's judgment, informed by pattern-recognition across many MEs, is what sizes the capital. Over time, portfolio data accumulated in SODOTO makes the pattern visible: MEs of shape X seeded at size Y in context Z tend to produce outcome W. Platform actors can calibrate against this data. The judgment does not become mechanical, but it becomes better informed.

#### Deployment mechanics

The mechanics of how seed capital moves from the Platform to the ME depend on RCN substrate that is in active development. In the mature form:

The ME's charter (Phase 4 in the kit's phase structure, described in Section 8) includes the Value Added Mechanism specifying how compensation will flow across the ecosystem community when the work delivers residents-recognized value. The seed capital's deployment is the first commitment in the Value Added Mechanism — the Platform's contribution enabling the launch — and its recovery mechanism is specified alongside.

CfA-dSC instruments the deployment as a smart contract. The contract encodes the promises (the ME's commitments to specific work, the Platform's commitment of specific capital), the offers (ecosystem members' contributions), the declarations (the scenario being addressed, the Leading Targets being aimed for), and the settlement conditions (how the Value Added Mechanism will divide value when it arrives, how residents' recognition will be assessed).

The Overall Schema tracks the ME as a node in the graph, with edges to the scenario it addresses, the Platform actors seeding it, the ecosystem members participating in it, the founded commons where the work happens, and the residents whose lives the scenario touches. Graph queries can surface patterns across MEs, help Platform actors see cross-ME learning opportunities, and provide the substrate for the retrospective work at Phase 5.

SODOTO portfolios attach to individual participants (ME core members, ecosystem contributors, Platform actors) and accumulate their traces of work — what they contributed, what value flowed, what they learned. The portfolios are the persistent record of who has done what over time, and they feed the trust mechanisms that eventually make the mature marketplace possible.

In the interim before the substrate is fully operational, deployment can happen through more manual coordination that preserves the structural properties. What matters is that the structural properties survive the manual phase intact: outcome-dependence, downstream-flow, ability to return small or zero, alignment of Platform compensation with ME success, alignment of ME compensation with residents-received value.

#### Recovery and reuse

Catalytic seed capital that has done its work becomes available for the Platform to deploy again to seed new MEs. This is what makes the Platform sustainable at cluster scale — capital cycles through, catalyzing successive waves of new work rather than being deployed once and then requiring ongoing replenishment from external sources.

The specific recovery mechanism depends on the ME's shape. Some MEs, once launched, generate revenue streams (fees, service payments, grants for continuing operations) that can include a return-to-Platform component as part of the Value Added Mechanism. Others produce value that residents recognize but that does not generate financial revenue; in those cases the "recovery" is portfolio and scenario enrichment rather than capital return, and the Platform's compensation comes through its shared Value Added Mechanism proportion rather than through capital recovery.

MEs that fail do not return capital. That is by design. Failure is expected and priced into the Platform's aggregate model. The failed ME's contribution is the enrichment of the scenario in the repository — what was tried, what didn't work, what the next team should know. That contribution has real value even when no financial recovery is possible, and the Platform's model accounts for it.

The aggregate model requires that successful MEs return enough capital in total, across enough time, to fund continuing seed deployments plus the Platform's own compensation. The precise economics depend on ME success rates, capital sizing, Value Added Mechanism specifications, and the specific mix of financial-recovery and portfolio-enrichment outcomes. The design record cannot specify the aggregate model in detail because WWHA's initial deployment will be the first real test of it at scale, and the model will develop empirically.

Two design commitments constrain the model without specifying it. First, the Platform cannot become dependent on any single funding source (foundation, government grant, individual donor) in a way that gives that source control over which MEs get seeded. Diversified funding is not merely prudent; it is structurally necessary to prevent capture. Second, the Platform's own compensation must remain outcome-dependent even when capital sources are guaranteed for a period. Guaranteed capital sources can be used to seed more MEs; they cannot be used to pay Platform actors on a fixed basis, because that would violate Principle Two from Section 2.

#### The catalytic principle applied across scales

Section 2's Principle Three — catalytic seed capital that departs — has now been treated at ME formation scale. The same principle applies at other scales the design record touches.

At the neighborhood scale, the kit itself is catalytic. Convenors run the kit's phases in a neighborhood and then step back. If the neighborhood cannot absorb the pattern and continue without the convener, the kit has failed to be catalytic. If it can, the convener moves on. The pattern of raise-your-kids-and-set-them-free from Section 2 applies to the kit's own presence in a neighborhood.

At the founded-commons scale, the seed principle applies to how new founded commons emerge from participation in aging ones (Section 4). Elders founding new founded commons receive whatever catalytic support the Platform can provide — mentorship, seed capital where relevant, connection to other founders — and set the new commons free when it can sustain itself.

At the Platform scale, WWHA itself is a first-generation instance of an Industry Platform for neighborhood-cluster work. Whatever RCN provides in support of WWHA's launch is catalytic. WWHA becomes self-sustaining through its own compensation mechanism and its own diversified capital base, or it fails and enriches the scenario of "how to launch a neighborhood-catalyzing Industry Platform" in the RCN repository. The Fledge and Leo's are analogous instances at their own recursion levels. Cross-Platform learning happens through the same fork-and-modify pattern that scenarios use.

At the individual scale, the principle appears in the elder-succession work. Elders who have been Platform actors, convenors, or ME leaders eventually release those roles as they age. The releasing is itself catalyzed — often through mentorship of younger neighborhood people who take up the roles — and it happens whether or not any specific successor is ready, because holding on past the release point is itself a failure mode. The generation ahead prepares the ground; whether the next generation grows in it is not fully within the elder's control.

The catalytic principle across scales is Vester's biological logic — new things emerge from old things through variation and selection, not from blueprints applied top-down. Each scale of catalytic work is preparation for the next scale; each scale's success is measured by what it enables to grow rather than by what it holds in place.

#### What Section 9 commits the design to

Money enters the work as catalytic seed capital, not as operating subsidy, standard project funding, or venture investment. The catalyzability test distinguishes real launches from subsidy requests dressed as launches, and the test is applied by elders whose pattern-recognition is the specific capacity that Platform actors bring.

Capital sizing is set by what launches actually require, between the lower bound of under-seeding failure and the upper bound of over-seeding dependency. There is no universal formula; the Platform actor's judgment, calibrated over time by portfolio data, is what sizes each specific ME.

Deployment happens through CfA-dSC smart contracts in the mature form and through more manual coordination in the interim, with the structural properties (outcome-dependence, downstream-flow, small-or-zero-return possibility, alignment with residents-received value) preserved in both.

Recovery flows back to the Platform for reuse in seeding new MEs, through mechanisms that vary by ME shape. Failed MEs do not return capital; failure is expected, priced into the aggregate model, and produces value through scenario enrichment. Successful MEs return enough capital in aggregate to sustain the Platform's continuing seed deployments plus its own compensation.

The Platform cannot become dependent on any single funding source in a way that would give that source control over seeding decisions. Diversified funding is structurally necessary. And the Platform's own compensation must remain outcome-dependent even when capital sources are guaranteed for a period, because fixed-basis pay violates Principle Two from Section 2.

The catalytic principle applies across scales: to the kit's presence in a neighborhood, to founded-commons succession, to Platform launches, to elder-succession work. Each scale prepares the next; each scale's success is measured by what emerges from it.

Section 10 develops the value definition — "value created by residents for residents and their neighbors, recognized by them, measured by their instruments" — in operational detail, including how the neighborhood-authored balanced scorecard is constructed, how residents' recognition is assessed, and how the e-VSM survey layer supports the assessment.

### Claude's notes on delivering the draft

That is Section 9, around 2300 words. Substantial because catalytic seed capital is where the design's compensation logic meets the operational reality of moving money, and both had to be treated precisely enough that the substrate developers (CfA-dSC, SODOTO, WWHA) can build against the specification.

Three things worth your attention.

The "aggregate model" discussion under Recovery and reuse is deliberately underspecified — I've said the model will develop empirically through WWHA's initial deployment rather than trying to name specific ratios or success rates. If you have working numbers from prior thinking (target ME success rates, target portfolio composition, target return-to-Platform percentages), we can add them. My inclination is to leave the aggregate model as an empirical question the first years of operation will answer, and to have the design record commit to the structural properties rather than the specific numbers.

The "elders who fail catalyzability tests reliably will see their compensation decline" claim in the Catalyzability Test subsection is a strong statement about how the compensation structure disciplines elder judgment. It's honest and it follows from Principle Two, but it may sound harsher than you want it to sound in a document Carl, Chris, Jerry, and Brent will read. Say if you want it softened.

The cross-scale application in "The catalytic principle applied across scales" pulls together threads from Sections 2, 4, 6, and 8. Some readers may find this repetitive; others will find it clarifying. My inclination is to keep it — the cross-scale point is one of the design's most important claims and benefits from the repetition — but I can compress if you prefer.

React, correct, or say go for Section 10.
