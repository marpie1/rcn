# Organizing local projects into actionable plans

Claude Chat conversation, created 2026-08-30, last updated 2026-09-11. 167 messages. uuid 2f737cc8-4f75-402d-86b1-8b5b63e99882

---

**Marc** (2026-08-30 01:14):

Talk with me before creating any thing. Please read this document and then consider how feasible it would be to make a first pass at organizing it into a table of potential local projects with likely beneficiaries and likely funds needed, likely outcomes AND best make up of teams needed to manage the projects to completion or to stable operations.  My team of three people collects similar project ideas in Medford, OR and in Spokane, WA and organized the creation of project plans by teams, arranged funding, and they got results. So I know from first hand experience that it is possible BUT very very very seldom done well.

_attachments: Bringing It Home - Community Forum Handout.pdf_

---

**Claude** (2026-08-30 01:15):

Read the whole thing. It's a well-packaged marketing companion to the book — the $2B waste framing, the 15.6¢ statistic, and the 20% redirection scenario are doing rhetorical work as much as analytical work. Underneath that, what Chase actually gives you is role categories and role counts, plus reference implementations. He does not give you projects. He is explicit about it: *"This plan does not dictate the services... The community determines."*

The translation from role categories to fundable, sequenceable projects with beneficiaries, budgets, outcomes, and teams is exactly the gap Chase leaves open, and the gap where your Medford and Spokane experience lives. So the question is not whether a first-pass table is generateable — it is. The question is what shape of first pass earns its keep versus becomes another wishlist.

A few design decisions I'd want your call on before drafting anything:

1. **Breadth vs. depth.** Twenty to forty project stubs across all seven Chase categories, each with rough T-shirt sizing, shows the shape of the opportunity. Five to eight concrete projects in one or two categories, each with real beneficiary identification and a plausible funding pathway, gives your team something to actually move on. These are very different artifacts.

2. **Grain of "project."** Chase's frame is county-scale. Yours is neighborhood-scale (the RCN 7,000–10,000 unit). A "Whatcom Community Health Worker Network" and "CHW hub at Birchwood serving 1,200 households" are both defensible units of work, but they call for entirely different team compositions, sponsors, and funding stacks. Which grain do you want the first pass at?

3. **Funding pathway assumption.** Chase's whole model presumes employer self-funded plan redirects — ERISA carve-outs, TPA restructuring, employer coalitions. Some of the seven categories fit that (health navigation, behavioral health integration, mobile screening). Others don't — watershed restoration, restorative justice mediation, community arts, ADU construction. Those need philanthropic, public, cooperative, or hybrid capital. Should the table hold the Chase assumption throughout, or distinguish funding pathway per project? The second is more honest and more useful, and it also breaks the "just redirect the healthcare waste" story that Chase is selling.

4. **Local grounding.** I can invent plausible Whatcom projects from general knowledge, or I can cross-reference what's already active locally — Sea Mar, Unity Care NW, Chuckanut Health Foundation, Community Food Co-op, Rebound, Opportunity Council, PeaceHealth's community work, the WWHA extraction we've already done. The second is more useful but requires either your input on who's active or a research pass. The invented version risks proposing things that already exist, or missing the organizations you'd actually want at the table.

5. **Team makeup.** You've done this in two counties. Rather than me writing a generic PMO template — sponsor / PM / SME / community liaison / financial ops / evaluation — tell me what actually worked in Medford and Spokane. Was it a fixed team shape you replicated, or did team composition vary by project type? Was there a distinction between the "get it built" team and the "run it in steady state" team? That distinction matters and Chase's handout doesn't touch it.

On why this is seldom done well: my read is that these exercises collapse into one of two failure modes — vague programs no one owns, or tightly-scoped interventions with no funding pathway. The bridge is a named sponsor per project who can move real money and take real political heat. If the table doesn't have a sponsor column, or the sponsor is "TBD" everywhere, it's a wishlist. You presumably solved this in Medford and Spokane. How?

Routing note: this conversation — framing, ideation, drafting — belongs in chat. Once we're building a table that cross-references your existing files (WWHA extraction, Overall Schema, whatever project registries you already keep in ~/rcn), that's Claude Code territory. Flag me when we cross that line.

What do you want to decide first?

---

**Marc** (2026-08-30 01:25):

Two biases of mine. 1) Don't use existing organizations to do what they have so far failed to do (all the while claiming successes that are not real). So I would prefer to start from scratch and build histories in this kind of work. 2) I strongly prefer to model and act from the neighborhoods that have the need and some of the skills adding neighborhoods as they become engaged and capable (if they every do). AND let me share this note with you so you see where I would like to go: What if there were a large number of community projects that the community decided that it wanted implemented and imagine that the funding were available. Imagine that every one who wanted to bid on any of them had a public history of all the projects they participated in and the outcomes. Imagine that the identities of all the members of the team (ME) were identified and their project histories were also available. Imagine a bidding process that matches the best performer to the project and paid them accordingly? Imagine that after a while the businesses and governments would look to this matching system (our version of the Haier Workbench—created for complex (multi stakeholder) local projects. Imagine that there were mechanisms for local loans and or equity based upon such histories of performance.

---

**Claude** (2026-08-30 01:27):

Both biases land, and together they change the table shape considerably.

On bias 1, one clarification worth making before we run with it. The system you're sketching doesn't actually need to exclude existing organizations — it structurally filters them by putting everyone on transparent performance history. An org that has been claiming unreal successes shows up in the marketplace with the same track-record burden as a two-person ME nobody has heard of. Transparency does the work exclusion was going to do, and it lets the occasional genuinely-performing team from an existing org participate rather than being pre-blocked. But if what you mean is "the first generation of histories must be built by people who chose to enter on the system's terms, not imported from prior institutional reputation" — that's a cleaner rule for the bootstrap phase, and easier to defend. Which one do you mean?

On bias 2, this is exactly how a workbench like this has to bootstrap. You cannot instantiate a functioning marketplace across 250,000 people. You seed it in a neighborhood with both need and a nucleus of capable people, run a small number of real projects there, and the resulting histories become the substrate that draws the next neighborhood in. Pull distribution, not push.

What you're describing is a civic Rendanheyi, and the interesting thing is that most of the infrastructure for it is already sitting in your project set:

- SODOTO is the credential/portfolio layer. The public history of every team member is what SODOTO was built to hold, with attestation via the issuer/handshake model rather than a central authority.
- CfA-dSC is the contracting layer. Each ME-to-neighborhood engagement is a Dyadic Smart Contract instance — offer, negotiate, promise, deliver, evaluate, close — with a durable record.
- Overall Schema + Graph Tool is the registry layer. Projects, MEs, neighborhoods, engagements, outcomes as nodes and edges, queryable.
- CAM could serve as one outcome measure for civic-activation-adjacent projects.
- RCN Map grounds projects and neighborhoods spatially.

What you don't yet have across your files is the bidding/matching mechanism itself, and the local-capital layer keyed to performance history. Those are real gaps, but they sit on top of existing scaffolding rather than a build from zero.

Which reshapes the table. Chase's handout points toward a static planning artifact — projects with owners and budgets, decided top-down. What you actually want is seed content for the project registry that will feed the marketplace once it exists. The columns change:

- Project — small enough for a 2-6 person ME to bid on
- Neighborhood — specific, not county-wide
- Beneficiaries — households, cohort, or physical site
- Outcome measures — verifiable after the fact
- Team roles — ME composition, not org chart or FTE count
- Funding envelope with pathway (grant, employer redirect, local loan, cooperative capital)
- Bootstrap posture — first-generation project (community-selected ME under provisional trust, public retrospective) or mature-marketplace project (competitive bid against verified histories)

The last column matters for the early years. First-generation projects need a different governance shape because histories haven't accumulated yet. That's how the substrate gets seeded.

To move toward actual drafting I need three things from you:

1. Bias 1 as I asked above — permanent exclusion, or transparency-with-no-imported-reputation for the bootstrap phase?
2. One or two specific Whatcom neighborhoods that meet your criteria (need + skill nucleus + willingness), or is identifying those itself a question we need to work?
3. What actually worked as team shape in Medford and Spokane? I'd rather build on what you already proved than invent a PMO template.

One thing worth flagging as we go: Haier owns the platform and Haier's users pay Haier's MEs directly. In a civic workbench, platform governance and funding source are separate problems. Who runs the marketplace, who verifies histories, who arbitrates when a bidder claims success the neighborhood disputes — those need explicit answers. Some pieces are in CfA-dSC and SODOTO already; the full stack isn't.

---

**Marc** (2026-08-30 01:27):

Then I can go back and answer questions you pose.

---

**Claude** (2026-08-30 01:27):

Got it. Three questions on the table, in the order that matters:

1. **Bias 1 — permanent exclusion of existing organizations, or transparency-with-no-imported-reputation for the bootstrap phase?** The second lets a genuinely-performing team from an existing org enter on the same terms as anyone else; the first is a cleaner bootstrap rule.

2. **Neighborhood selection — one or two Whatcom neighborhoods that meet your criteria (need + skill nucleus + willingness), or is identifying those itself a question we need to work?** If it's the latter, that becomes its own project stub.

3. **Team shape — what actually worked in Medford and Spokane?** Fixed shape you replicated across projects, or varied by project type? Was there a distinction between the build-it team and the run-it team?

Answer in whatever order and depth suits. I'll hold here.

---

**Marc** (2026-08-30 01:30):

1) "the first generation of histories must be built by people who chose to enter on the system's terms, not imported from prior institutional reputation"

---

**Claude** (2026-08-30 01:31):

Good. That's the cleaner rule and it aligns with what SODOTO was already built to hold — individual portfolios, attested, no institutional brand doing the vouching.

Two implications worth naming now so we don't rediscover them later:

Someone who spent fifteen years at Sea Mar or PeaceHealth isn't blocked — they enter as themselves, and whatever they can document about their own past work can go into their portfolio if they choose. What they can't do is arrive wearing the org's brand as substitute for personal history. That's the laundering path this rule closes.

And the first-generation provisional-trust mechanism becomes load-bearing rather than optional. Empty portfolios need a way to get their first project, or nothing starts. Community selection with binding public retrospective is the shape I'd expect — the neighborhood picks whom they trust, the outcome gets attested afterward whether it went well or badly, and that attestation is the seed of the portfolio. Losing well and honestly is worth more than winning with a spun result.

Holding for 2 and 3.

---

**Marc** (2026-08-30 01:37):

2) There are a few candidate neighborhoods (research needed) 1. Carl's East County/Maple Falls/Columbia Valley/Kindall  and then in Bellingham 2. Columbia Neighborhood 3. Puget Neighborhood 4. Birchwood Neighborhood, 5. City Center Bellingham Neighborhood, 6. York.

---

**Claude** (2026-08-30 01:38):

Carl being named for #1 is the biggest signal in this list. That's an identified skill nucleus already inside the RCN network. The other five have no name attached, and the absence is itself data — either you haven't looked yet, the people aren't obvious, or you're testing whether I'll ask.

Two asymmetries worth flagging before research:

The East County cluster is a rural region of maybe 3,000-5,000 dispersed across Maple Falls, Kendall, and Columbia Valley. Different operational reality from a Bellingham neighborhood of similar total population. Dispersed rural means longer travel and weaker social density, but often stronger mutual-aid tradition and less institutional saturation. The Bellingham neighborhoods are dense, contain more existing service providers, and sit inside city politics. Also worth noting: most of the Bellingham neighborhoods run 3,000-5,000 people — below your 7,000-10,000 RCN target. Fine for a pilot; the scale question surfaces if two adjacent neighborhoods want to federate.

Second, "need" is doing a lot of work. Different metrics point different directions. Extraction in health-dollar terms is probably highest per-capita in East County, given distance from care and higher uninsured rates. Life-expectancy-and-chronic-disease disparity likely ranks Birchwood and parts of City Center high. Housing precarity concentrates in City Center and York. Organizing capacity gaps vary. Which axis do you want the selection to weight?

Two things I need to know before running research:

Are you asking me to do the research pass, or is "research needed" pointing at fieldwork you, Kerry, or Carl will do? Both are legitimate. Public data I can pull. Willingness I cannot. Skill-nucleus for the five unnamed I cannot without your network.

If I do the research pass, what's the output form — comparative table across all six on a fixed set of criteria, or deeper profile of one or two you're leaning toward?

Still holding on Q3.

---

**Marc** (2026-08-30 01:38):

3) In Medford and Spokane the potential members of the team were selected by very seasoned local leaders and then the actual teams self-organized .

---

**Claude** (2026-08-30 01:38):

That's the answer I was hoping for and it changes the shape of what we're building.

The seasoned-leader-then-self-organization model is exactly the bootstrap pattern the workbench needs before histories exist. It says two things clearly. Team composition is not a template to be specified in advance — the table should not have an "FTE mix" column that pretends to know. And the mechanism for the first generation is curated candidate pool plus self-organization, not competitive bidding. Bidding is the mature-marketplace mechanism that comes later, once portfolios have content.

That means for the first-generation projects, the seasoned local leaders are themselves a role in the system — and one that isn't in your existing project files as far as I've seen. SODOTO holds individual portfolios. CfA-dSC handles the ME-to-neighborhood contract. Nothing yet holds the pool-curator function: who is trusted to name candidates, on what basis, with what accountability when their picks fail. That's the first-generation analog of what verified portfolios do in the mature system, and it's the load-bearing piece your Medford and Spokane experience proved works.

Worth naming: the curator role has to be visible and attested too, on the same terms as everyone else. Their track record is which teams they seeded and how those teams performed. That closes the loop and prevents the curator layer from becoming the new institutional-reputation import your bias 1 excluded.

So the table columns settle to something like:

- Project — small enough for a self-organized 2-6 person ME
- Neighborhood
- Beneficiaries — households, cohort, or physical site
- Verifiable outcomes
- Funding envelope with pathway
- Bootstrap posture — first-generation (curator names candidates, team self-organizes, public retrospective feeds portfolios) or mature-marketplace
- Curator — the seasoned local leader for first-generation projects; explicit rather than TBD

No team-composition column. That's the ME's problem to solve after selection, which is what actually worked for you.

One question this raises that I don't want to answer for you: build-team versus run-team. In Medford and Spokane, did the self-organized team stay together through both phases, or did the composition shift once a project moved from build to stable operations? If it shifted, was that handled by the original team or by a fresh selection round?

And to close the research question from before: given the curator model, the more useful research pass may not be public data on the six neighborhoods. It may be identifying who the plausible seasoned local leader is in each — the Carl-equivalent. That's a much harder pass to do from public sources. Is that a question for you, Kerry, and Carl to work, or is there a way I can usefully contribute?

---

**Marc** (2026-08-30 01:49):

7-10K were upper limits if that. The nature of the people and place is much more important than any guess as numbers I might make. It really is based on their ability to self-organize and take collective action (by small teams--not riots).  AND re "need". Folks must choose what they have the passion and capacity to take on. No outsider should have a say. All the thinks that Dave put in the paper were aggregated from communities that self-selected what was worth attempting. AND  "research needed" was just me saying that in the future, should we come up with something interesting my team could do that research (maybe, likely with your help then). AND RE the pool curator function--that is now being done in Superior and Lansing by the folks that created and operate Leo's and The Fledge. The do have requisite variety for "first pass" and maybe more than that but I would love to replace something so dependent on "elders" with RenDanHeYi tools and methods. NEXT In Medford and Spokane the teams were organized for the projects and then dissolved. Very very much like RenDanHeYi.

---

**Claude** (2026-08-30 01:49):

Good. Several corrections that meaningfully change the shape of what we're building.

**7-10K as upper limits, not target.** That's a real correction. Puget, Birchwood, Columbia at 3-5K are on-scale, not below-scale. City Center and York at whatever they are, likewise. The East County cluster is on-scale even before any federation question. Scale drops out as a filter entirely — the filter is capacity for self-organized collective action by small teams, which is something you can only know by looking at the people, not the map.

**Need is chosen from inside, not assessed from outside.** This is a bigger correction than it looks. It means the neighborhood ranking exercise I was setting up — weighting by health disparity, extraction, housing precarity — is the wrong exercise. Not just under-informed, structurally wrong. Nobody outside picks what a neighborhood works on, and by extension nobody outside picks which neighborhoods are "ready" based on external need metrics. The neighborhoods that self-organize are the ones that self-organize. That's the signal.

Which means the Chase framework's role in this is smaller than I was treating it. It's a menu of what other communities did, useful as inspiration for a neighborhood scanning its own passions and capacities. It is not a source for what Whatcom neighborhoods should do, and it should not structure the project table as if it were. The seven categories can inform the menu but the projects have to come from the neighborhood.

**Pool curator function is already operating in Superior and Lansing via Leo's and The Fledge — Chris Casillas and Jerry.** That's a big piece I should have connected. It also names the deeper design goal: replace elder-dependence with Rendanheyi-style tools and methods. The seasoned-leader-plus-self-organization pattern is the working bootstrap, not the destination. The destination is a mechanism where the curator function is distributed, transparent, and doesn't require an elder at the center.

That's a design problem worth naming plainly: what does distributed curation look like, and what accountability does it carry? Some initial thinking, not answers. Reputation-weighted peer nomination is one path — people who've delivered on projects earn the standing to name candidates for new ones, and their naming record is itself attested. Neighborhood assembly nomination is another — the collective, not an individual, curates the pool. Hybrid: the assembly delegates curation to a rotating small group whose record is public. Each has failure modes. None have been proven at neighborhood scale that I'm aware of. This is a genuine research and design question for RCN, not a solved problem.

**Teams organized for projects and then dissolved — pure Rendanheyi.** Good. That means no build-team-vs-run-team distinction. A stable operation is either its own subsequent project with its own team, or it hands off to an ongoing operator selected through the same mechanism. Cleaner than trying to hold one team across a phase transition.

**Where this leaves the table.**

Given the corrections, the artifact I was heading toward is not what you actually need. A pre-populated project table sourced from Chase's menu, ranked by external need metrics, is the wrong artifact — it violates the from-inside rule at multiple levels.

What might actually be useful, in rough order of value:

*A neighborhood self-selection instrument.* Something a Carl-equivalent, or a would-be one, could put in front of the people in their neighborhood to surface what the neighborhood already has passion and capacity for. Not a needs assessment. A capacity-and-passion inventory that ends in a small set of projects the group actually wants to do. This is closer to what Chris and Jerry are doing operationally than what Chase offers.

*A distributed-curation design study.* Concrete mechanism proposals for how the pool-curator function operates without depending on elders, with worked examples of failure modes and mitigations. This is real design work and probably belongs in the RCN research stream alongside Overall Schema and CfA-dSC.

*A worked example from one neighborhood that has already self-organized.* If East County under Carl, or Chris's Superior work, or Jerry's Lansing work has a live project or two that could be documented in the shape a first-generation portfolio entry would take, that's the seed content for the actual marketplace. Real projects, real teams, real outcomes, attested. That's substrate.

None of these three is what I was drafting toward. Which of them, if any, matches where you want to go next? Or is there a fourth I'm missing?

---

**Marc** (2026-08-30 02:08):

I will answer you in a moment. I just want to interject something about Ashby's Law and the Conant-Ashby Theorem. I do know that there are problems that neighborhoods don't have requisite variety to handle. I know that there are problems that city gov and public health departments do have requisite variety to handle. THE problem that concerns me is the the variety in neighborhoods is ignored or dismissed or silenced to the detriment of all and I want this issue of matching variety to problems to be made very very visible and very discussable as we move forward. I am not looking for a war but for mutuality in problem solving. Ostrom's polycentricity take to its limits is what I am looking to do. AND I am very interested in putting whatever we come up with in front of Carl, Chris, Jerry and Brent (a SW Lansing organizer and friend of Jerry's) so that points to your "worked example" if we can frame it up for them. Re the neighborhood self-selection mechanism--I am a huge proponent of my version of Russ Ackoff's Idealized Design. That is what we did in Medford and Spokane and from that the project emerge as way to help the existing organizations work synergistically. In fact I think all the project were BETWEEN existing organizations. I am of the strong opinion that the organizations will take care of themselves but not each other or the community. We helped them to create classic win-win-win projects with real monetary and real pain/frustration reducing outcomes. It worked but they could not do it without us the next year in both places. I don't what that to happen again. I want a decentralized mechanism to match capital with problem solves, not the good ole boys.

---

**Claude** (2026-08-30 02:09):

_[tool call: memory_read]_

_[tool result]_

Ashby-Conant registered, and it lands hard. The problem you're naming isn't only a design problem — it's political. Higher-scale institutions routinely absorb problems whose variety they cannot match, and the neighborhood-scale variety that could match those problems gets dismissed as parochial, unprofessional, or ideological. Making that visible and discussable without turning it into war is a real design goal, and it needs an artifact — a map or matrix that names problem classes, the variety they require, and where in a polycentric arrangement that variety actually lives. Not something to hand to Carl, Chris, Jerry, and Brent yet, but a thing the workbench presupposes and makes operable. Worth naming now so it doesn't get lost.

Ackoff's Idealized Design as the neighborhood-scale method is a big correction and clarifies a lot. It's a substantively different method from what I had in mind — designing the neighborhood you would want if you could have it, working backward from that to the projects that move toward it, and finding the ones that live between existing entities. That explains why Medford and Spokane produced win-win-win projects between organizations rather than programs run by any single one. The variety needed to see between-organization opportunities is exactly what organizations don't have about themselves, which is why they needed your team, and why they couldn't reproduce it alone.

That reframes bias 1 more precisely. Your opposition isn't to existing organizations doing work — those Medford and Spokane projects were between existing organizations and they worked. Your opposition is to dependency on facilitator teams that operate as elders and can't be replicated. The workbench is the replacement for your team. That's the actual design specification. Whether existing organizations show up on it depends on whether individuals from them enter on the system's terms with real portfolios, which is where we already were.

Which makes the audience-of-four a real constraint, not incidental. Carl in East County, Chris in Superior, Jerry and Brent in Lansing and SW Lansing already occupy the convenor position your seasoned local leaders occupied in Medford and Spokane. If we frame the artifact to be usable by them, we're testing whether the tools can carry what your team carried, or whether the mechanism still needs elders wearing different hats. That is the real experiment.

The direction I'd sketch, subject to your answer on the three options, is a facilitator kit for running an Idealized Design cycle at neighborhood scale, whose outputs are project stubs of the kind that emerged in Medford and Spokane, coupled with a first-generation team-formation mechanism the four of them can operate. The variety-matching frame would sit above it as the political principle the whole thing embodies. The CAM might also have a role — a way for a neighborhood to see itself before and after an Idealized Design cycle, different from its original design use.

Still holding for your answer.

---

**Marc** (2026-08-30 02:13):

Considering all this please ask me what you need to know from me now.

---

**Claude** (2026-08-30 02:14):

Four, in the order they most matter.

1. Purpose. When Carl, Chris, Jerry, and Brent receive this, what do they do with it? React to the frame, try to run it in a real neighborhood, adapt it into their existing work? The purpose shapes how prescriptive the artifact should be and how finished it needs to feel.

2. Scope of the first artifact. Candidates I can see: (a) Idealized Design facilitator kit only; (b) that plus the first-generation team-formation mechanism; (c) that plus the variety-matching frame above it; (d) full package with capital-matching included. Each is a real weight difference and a real time cost. Which slice.

3. Your version of Idealized Design. I cannot invent this. The specific method, how it differs from Ackoff's original, what a cycle actually looks like in a room — a walkthrough of how you ran it in Medford or Spokane would be the substrate I need before drafting.

4. One or two specific Medford or Spokane between-organization projects, concrete enough to serve as worked examples inside the frame. Real cases will do more than abstract description, and they'll show the four convenors what shape of project the method actually produces.

---

**Marc** (2026-08-30 02:22):

Let me be clear. People are listening to Dave. His is smart and believable and a good person. But he does not have experience in the spaces between institutions. He has been a CEO, CFO and now a knowledgable public speaker. He does not over state his knowledge but listeners don't know how to do this stuff so they will waste most of the saving and that is a tragedy I don't want to see happen. Let's do some things to break free of the past top down, hurried style of change and get something going that moves at the speed of variety management. AND I cannot answer #1 until I read it. :>) but they will read it and think and talk and react constructively. #2 a and b please. #3 I will find the documents today and give them to you. #4 I will give you 30ish project diagrams so you see what links they set out to improve. I can also give you about 19 driver trees from Spokane so you can see what the took on with funding. Give me a few minutes to add these documents.

---

**Claude** (2026-08-30 02:22):

Understood on all four. The Dave framing is important context — you're moving at the speed of variety management specifically because the alternative is watching most of the savings get wasted by people who don't know how to work between institutions. That's the design constraint behind everything else.

Ready when you upload. Take the time you need.

Two small things while you gather them.

The 30 project diagrams and 19 driver trees will probably tell me more than the method documents alone. Method plus real cases is what I need — either without the other leaves gaps. If the projects show what links they set out to improve, I can see the between-organization pattern in operation rather than in description.

And a format check before you send: if the diagrams are images, PDFs, or a mix, either works. If there's a native format (Visio, Lucidchart, drawio) that would preserve structure better than a rendered image, send that. If it's what you have, send what you have.

Standing by.

---

**Marc** (2026-08-30 16:42):

Here are a few Strategy maps for prjects/programs that were ultimately funded. https://docs.google.com/presentation/d/0B_acqVoB1W2ASHhFLWxEbkh4bUU/edit?slide=id.p5&resourcekey=0--xGzFjnoI6hrWZBeEQjmRQ#slide=id.p5 Here is the approach to Linkage Mapping at scale: https://docs.google.com/document/d/0B_acqVoB1W2AR2h4RjFaeWVBYnM/edit?resourcekey=0-I9Fpn0POidlP4NIaFMVu6g Here are diagrams of the proposed improvements in the processes between the institutions. I may have give you more than is useful.

_attachments: Linkage Mapping Teams Final.docx, Marc's Method of Community Transformation.docx, Key Graphs (nodes & releationships) Neo4J copy.pdf, IEHP Conversation.pptx, PHOTO-2026-08-27-20-05-17.jpg, Prospectus of CMG services for Community Integration May 5, 2016.docx_

---

**Claude** (2026-08-30 16:44):

_[tool call: view]_

_[tool result]_

_[tool call: bash_tool]_

_[tool result]_

_[tool call: bash_tool]_

_[tool result]_

_[tool call: bash_tool]_

_[tool result]_

_[tool call: bash_tool]_

_[tool result]_

_[tool call: bash_tool]_

_[tool result]_

Read. All of it, and it substantially sharpens what I had.

Your method is battle-tested. The 30-plus Spokane linkage maps are the output of a working process, and their canonical shape — Improvement node, multiple Institution nodes, relational edges of specific types (WORKS ON, SHARE_CLIENT, REQUEST_COORD, PRESENTS_TO) — is already compatible with the Overall Schema you have in progress. When we build the workbench project registry, this is the schema, adapted. I've also been conflating Idealized Design with the whole method. It's the middle third. The CMG method is Linkage Mapping for the current state, Idealized Design (Ackoff proper) for the desired state, and System Dynamics Modeling for long-term policy implications, run iteratively inside the Inclusion → Participation → Trust framework. That matters for what we build.

The team matrix from Spokane is more elegant than your description conveyed. Sectors as rows, priority areas as columns, named individuals in each cell. The matrix guarantees cross-sector variety; teams self-organize inside it. That is exactly what the workbench needs — the matrix defines the variety requirement, individuals accumulate portfolios, first-generation teams self-organize within it, mature-marketplace teams bid to fill it.

The CMG prospectus states the dependency problem in its own words. "Ensuring local competence and autonomy" was 2016's stated goal, and it didn't hold in Medford or Spokane the next year. The design constraint for the workbench is therefore sharper: reduce the requisite facilitator variety to a level distributable across the community, permanently. The tools do what your team did.

The José Pérez Ríos recursion diagram is doing real work in the substrate. Nested systems, multiple recursion criteria, system-in-focus at one level with legitimate concerns above and below. That's polycentricity made structural — the variety-matching frame in operational form. And the 30 projects span governance scales. Some are neighborhood-shape (#33 School-Based Oral Health). Some are county-shape (#18 Integrated Addiction Care involves courts, jails, legislators). Some are metro-shape (#25 Place-Based CHWs spans multiple sector federations). The neighborhood-scale kit should work on neighborhood-shape projects, and it should make visible when a project the neighborhood identifies actually lives at a higher recursion — with a mechanism for surfacing that upward rather than mishandling it locally.

Four narrowing questions before I draft.

Do we strip the method to Linkage Mapping plus Idealized Design for the first artifact, and leave System Dynamics Modeling for a higher recursion level? My instinct is yes. The 25-year policy simulation is county-and-above work, and the neighborhood kit should be small enough to actually run.

Should the artifact assume the sector matrix as the variety requirement, or should each neighborhood identify its own matrix as part of the process? The Spokane matrix is health-sector-shaped; East County or Birchwood may have different sector maps.

Which one or two of the 30 Spokane projects should serve as the worked example inside the kit? Point directly, or let me propose candidates. My leaning is toward one that is clearly between-institution and clearly neighborhood-scale — #33 School-Based Oral Health, #17 Schools-CHW Network, or #7 School-Refugee Transition. Schools anchor a neighborhood, and the linkages can be followed without deep clinical context.

The variety-matching frame — does it infuse the kit as an operating principle (every project surfaces its recursion level, mismatches are made discussable), or stay entirely out of the first artifact? I'd argue for infusion. The Pérez Ríos structure is already latent in the projects you produced, and naming it lightly costs little and prevents the four convenors from mishandling higher-recursion projects.

Ready to draft when you've answered.

---

**Marc** (2026-08-30 16:53):

This presentation may be more coherent. And I want us to focus on the VSM and the importance of having system 4 create a map/diagram/model of possibilities (precisesly what Idealized Design delivers). This MUST be added and then combined strategicly with SWOT type environmental scans.
And Idealized Design allows you to know what you wish you had today by 
Ideal design—SO WE ARE GOING TO SOMEWHER WE WANT TO BE
So we are not just fighting fires but building something together
Only two constraints:
Currently feasible technology
Operationally possible

_attachments: Logic of VSM Linkage Maps Idealized Design.pptx_

---

**Claude** (2026-08-30 16:55):

_[tool call: bash_tool]_

_[tool result]_

Read. This deck is more coherent, and it re-anchors the kit design in a way that clarifies what we're actually building.

The three mapping levels in the deck map cleanly to the VSM. Mainstay is S1 — the operational units delivering services from the client's perspective. Support is S2 plus internal S3 — coordination and staff-facing infrastructure. Driver is S4 plus S5 — stakeholders coming together around shared purpose to plan improvements. Linkage Mapping is a single visualization of the neighborhood as a viable system, made from three vantage points.

Idealized Design plus SWOT-type environmental scanning is what constitutes S4 at neighborhood scale — the pairing of inside-and-desired with outside-and-future. Without both, S4 collapses: SWOT alone is reactive, Idealized Design alone floats. Together they let a neighborhood know what it wants to be and what is coming at it, which is the prerequisite for building rather than firefighting. Your two Ackoff constraints — currently feasible technology, operationally possible — are the discipline that keeps the idealized design from becoming a wish list, and the door that lets it be revised as feasibility changes. Worth naming to the four convenors as the specific bounds their neighborhoods will design inside.

This move answers two of my four narrowing questions.

The variety-matching frame lives inside the VSM. The Pérez Ríos recursion is what you get when a viable system at one level is an S1 to a viable system at the next level up. When the kit surfaces "this project is actually higher-recursion," it is saying "this project belongs to a viable system whose scope exceeds this neighborhood's." That language is native to the frame.

And on System Dynamics Modeling — Beer's view was that S4 uses whatever tools of anticipation fit the scale. At neighborhood scale, SWOT plus Idealized Design is enough for S4. ReThink's 25-year policy simulation is an S4 tool for the higher-recursion viable system at county or region. Leave it out of the neighborhood kit; make its existence known as something the neighborhood can request when a project surfaces upward.

Which leaves three questions, one of them new.

The matrix. The Spokane matrix was health-sector-shaped because the container was an ACH. A neighborhood's S1 population is not given — the kit needs a matrix-discovery step where the neighborhood identifies its own operational parts. In East County that might include the volunteer fire department, the Baptist church, the elementary school, the food bank, the trailhead volunteers, and individual healers. In City Center Bellingham it might include the library, the shelter network, the community court, and a dozen small nonprofits. Same schema — parts by priority areas by named individuals — different populations. Agreed?

The worked example. Still needs your call. My leaning is unchanged — #33 School-Based Oral Health, #17 Schools-CHW Network, or #7 School-Refugee Transition. If you want to point to something from your own memory that we don't have in the substrate — a Medford or Spokane project that particularly captured what "between-institution done well" looks like — that would land harder than a diagram I am working from cold.

The new question, and it is the load-bearing one. VSM at neighborhood scale needs S5 — identity, purpose, the "why we are together at all" that gives S4 something to design toward. The convener (Carl, Chris, Jerry, Brent) is initially carrying S5 as a matter of fact. Your bias against elder-dependence says that shouldn't stay put. Does the kit include an explicit S5-elicitation step in which the neighborhood authors its own purpose, so the convener steps out of that role by the end of the first cycle? Or is initial convener-as-S5-custodian an acceptable bootstrap that migrates over time, with a defined transition mechanism? These are two different designs for the kit's opening move, and they set different expectations for what the four convenors are agreeing to when they run it.

Ready to draft when you've answered the three.

---

**Marc** (2026-08-30 21:03):

RE SDM. As far as I am concerned the Ripple ReThink Model, which I originated in Whatcom County is the only systems dynamics modeling we will ever do. We can use that as, if, and when needed. I still have access to it. SDM is only useful for policy making--by running what if scenarios to avoid living through experiments that are sure to fail. I am not a fan of SDM and that comes from 20 years of use. It is a very very limited tool As Donella Meadows famously pointed out--the parameters are the weakest leverage point is complex systems. The world view (and changing world views) is the most powerful type of leverage point. RE matrices--some kind of matrix with flexility in "shape" seems useful. RE which project as "worked example". I agree that working around schools and showing the Perez phenomena in an example might be very useful. So YES on infusion and use the school intersection to illustrate the participation in multiple systems simultaneously. (reality of polycentricity and multiple roles along different dimension). RE "the new question". My own consulting practice is to have groups answer WHY (for the sake of what form the POV of everyone present. Digest that. Then answer WHERE. Then answer WHEN (how long will we take care). And only then answer WHO. Now pause, digest, and consider the WHAT is and WHAT might be (Idealized Design). THEN THE REAL WORK BEGINS: figure out HOW and do lots of experiments to learn.

---

**Claude** (2026-08-30 21:04):

Substrate registered.

SDM out. The Meadows point about parameters being the weakest leverage and worldview being the strongest is worth carrying into how the kit frames itself. The kit's first work is at the worldview level — WHY, from the POV of everyone present. That's the leverage point the CMG method partly reached through Idealized Design and that the ACH machinery mostly buried. The neighborhood kit puts it at the front.

Flexible matrix confirmed. Each neighborhood identifies its own S1 population and its own priority-area columns; the schema stays constant, the shape varies. Same instrument, different fills.

School-based worked example with polycentricity infused. The school is where a person is simultaneously a student, a child in a family, a resident of a neighborhood, a member of a cultural group, a client of health services. That single site makes the multiple-viable-systems-in-one-place structure visible without any theory. I'll pick the candidate whose linkage map best displays the multi-membership overlay — my leaning is #17 Schools-CHW Network because it explicitly bridges school, family, community, health, and public health, but #33 or #7 also work. Preference?

Your facilitation sequence answers the S5 question with an elegance I hadn't anticipated. WHY first, from the POV of everyone present, distributes S5 authorship from step 1 — the convener never has to hold identity alone because the process elicits it from the group. Digest pauses protect that from rush-through. WHERE, WHEN, WHO follow to ground it. Only then do WHAT IS and WHAT MIGHT BE (the Idealized Design pair) come into play. HOW comes last, and its mode is experimentation to learn. That sequence should structure the kit itself — each step is a section, each section has its prompts and artifacts, and the ordering discipline is what keeps the convener from collapsing into elder-as-author.

On SWOT-type environmental scan placement — classical SWOT does two things at once (S/W current-internal, O/T future-external). I'll place it as a bridge from WHAT IS to WHAT MIGHT BE unless you'd rather it live entirely inside one.

One question before I draft, and it is a real one. WHEN — "how long will we take care." I'm reading this as a commitment-horizon question, not a project-duration question. It asks the group what generational or life-course scope they are committing to, and it shapes who can meaningfully participate: a thirty-year "we will take care of this place" attracts different people than a six-month "we will finish this project." Is that read right? If so, the WHEN prompt in the kit needs to resist collapsing back into "when will this be done."

Answer that and pick the worked-example candidate, and I'll ask you the format question and draft.

---

**Marc** (2026-08-30 21:08):

Yes WHEN is about commitments not project plans. AND before you draft anything--Do you have access to  my Chrome browser? If so please take you time and look through Atlasian's Confluence and Jira that I configured for the work in Medford--it never got that far (internal political wars between the hospitals killed large scale cooperation). BUT Whatcom county could use/adapt the approach I laid out in anticipation of a community that did what to find synergies.

---

**Claude** (2026-08-30 21:09):

No — I don't have access to your Chrome browser in this conversation. I have web search and web fetch, but Confluence and Jira sit behind Atlassian authentication, so a public fetch won't reach your Medford instance.

Let me check whether there's a connector path that could reach it.

_[tool call: search_mcp_registry]_

_[tool result]_

WHEN as commitment horizon confirmed. That will shape the prompt language directly — a "we will take care of this place for the next generation" framing pulls different people to the table than a "we will finish this project by Q2" framing, and the kit needs to protect the former from collapsing into the latter.

On browser access: no, I don't have your Chrome browser in this conversation, and Confluence and Jira sit behind Atlassian auth, so a public web fetch won't reach your Medford instance. There is a connector path if you want to go that route.

_[tool call: suggest_connectors]_

_[tool result]_

If you'd rather not connect it, exports or screenshots uploaded here work too — say which suits you.

---

**Marc** (2026-08-30 21:09):

Claude Code accesses my browser all the time.

---

**Claude** (2026-08-30 21:10):

Right. In Claude Code, with the browser-controlling MCP you have set up, that access is live. This chat surface has a narrower tool set — web_fetch for public URLs, plus whatever connectors you approve.

Per your own routing preference, browser reading of your Atlassian instance belongs on the Claude Code side. That's the cleaner switch, and it lets me work directly with the Medford Confluence and Jira you laid out. The Rovo connector suggested above is the alternative path if you'd rather keep this thread in chat.

Which route?

---

**Marc** (2026-08-30 21:11):

If we can use the ROVO connector and use that information to make your draft that would be preferable to going back and forth between Chat and Code or my cutting and pasting.

---

**Claude** (2026-08-30 21:12):

_[tool call: tool_search]_

_[tool result]_

_[tool call: tool_search]_

_[tool result]_

The Atlassian tools aren't showing up yet, which means the Rovo connector hasn't finished connecting on your end. The card I sent has a Connect button — clicking it will open the Atlassian OAuth flow, and once you approve access, the Confluence and Jira tools become available in this thread.

After you connect, tell me the Confluence space name (and Jira project key if it's separate) for the Medford setup, and I'll pull it and read through before drafting.

---

**Marc** (2026-08-30 21:13):

I have not seen your "card". I don't know what a "card" is.

---

**Claude** (2026-08-30 21:13):

My mistake — "card" is jargon. When I called the connector tool, the interface was supposed to render a small interactive box in the chat, showing "Atlassian Rovo" with a description and a Connect button. If nothing like that appeared, either the render failed silently or your client version doesn't display it inline.

The reliable workaround is to add the connector through Claude's own settings. Look for a Connectors section under Settings in the app or website, find Atlassian Rovo in the directory, and connect it there. The exact menu path differs between web, desktop, and mobile, so I don't want to guess the precise clicks without knowing which surface you're on.

Once it's connected, the Atlassian tools will show up in this thread and I can pull the Medford Confluence and Jira directly.

---

**Marc** (2026-08-30 21:21):

I found the connector and initiated it. You should have access now.

---

**Claude** (2026-08-30 21:21):

_[tool call: tool_search]_

_[tool result]_

_[tool call: tool_search]_

_[tool result]_

_[tool call: Atlassian Rovo:getAccessibleAtlassianResources]_

_[tool result]_

Connected. Site is community4health.atlassian.net. Searching for the Medford setup.

_[tool call: Atlassian Rovo:search]_

_[tool result]_

Acknowledged — you declined that call. How would you like me to proceed? I can list Confluence spaces or Jira projects first, take a specific space key or project key you name, or work from a different starting point entirely.

---

**Marc** (2026-08-30 21:23):

I did not purposefully decline. So let's try again with community4health.atlassian.net

---

**Claude** (2026-08-30 21:27):

_[tool call: Atlassian Rovo:search]_

_[tool result]_

_[tool call: Atlassian Rovo:searchJiraIssuesUsingJql]_

_[tool result]_

_[tool call: bash_tool]_

_[tool result]_

_[tool call: bash_tool]_

_[tool result]_

_[tool call: bash_tool]_

_[tool result]_

_[tool call: bash_tool]_

_[tool result]_

_[tool call: Atlassian Rovo:searchConfluenceUsingCql]_

_[tool result]_

_[tool call: bash_tool]_

_[tool result]_

_[tool call: bash_tool]_

_[tool result]_

_[tool call: bash_tool]_

_[tool result]_

_[tool call: Atlassian Rovo:getConfluencePage]_

_[tool result]_

_[tool call: Atlassian Rovo:getConfluencePage]_

_[tool result]_

_[tool call: Atlassian Rovo:getConfluencePage]_

_[tool result]_

Substantive. Six things stand out from what's in the instance.

The five-phase Linkage Mapping playbook in the LMID space is a real facilitator kit already, written for county scale. Phase 1 is pre-work to understand and enlist. Phase 2 is a first 6-8 hour meeting to construct the linkage map and co-define values, principles, goals, beliefs, hopes, and fears. Phase 3 is a weighted selection matrix with distributed input and adjudication of outliers. Phase 4 charters the selected projects. Phase 5 is execution and next-round convening. That structure translates to neighborhood scale with a compressed timeline — three months rather than seven — and it gives the four convenors a real sequence to run.

The weighted selection matrix in Phase 3 is a methodological piece I hadn't grasped. Weighting the principles first, distributing input across all participants, then adjudicating outliers in a follow-up meeting — that is the mechanism that keeps selection from collapsing to elder-picks. It's the operational answer to your distributed-curation concern in a form your 2014 work already had figured out. It goes into the kit.

The seven-work-stream Confluence architecture (Community Sponsorship, Ideal CHW-Networker, ASES, Guidance Group & Communication, End to End Service Line, LMID, Broad Community Financial Support) is more scaffolding than a first neighborhood iteration needs. The kit should center the LMID work stream and let the others emerge as the neighborhood's own work exposes the need. Trying to stand up all seven at once was probably part of what made the 2014 approach too heavy for anyone but CMG to operate.

The GGCS backlog is validation of the between-institution project shape. Sixty open stories, most of them exactly that pattern — Chronic Pain/Addiction Recovery, Hospital Discharge/Readmission, Care & Social Services Coordination, CHW/promotoras, Mental Health for Children, Community Managed Formulary, School-based Prevention. Same shape as the 30 Spokane linkage maps at smaller grain. The pattern is stable across your work.

The ASES philosophy — a physical space owned by the community and purpose-built for design and implementation work — is a longer-horizon element that goes beyond a first-artifact kit. Worth naming as what a neighborhood might eventually stand up, and out of scope for what Carl, Chris, Jerry, and Brent get in v1.

The ontological/speech-acts layer is present in your 2014 material (the mood matrix on the assessment page, the 353 references, the Flores influence) but stays implicit. My inclination is to leave it implicit for v1 — the kit shouldn't require the convener to teach a new vocabulary. CfA-dSC can make it explicit later when it matures.

Three final things before I draft.

Worked example still needs your pick — #17 Schools-CHW Network, #33 School-Based Oral Health, or #7 School-Refugee Transition, or a Medford/Spokane project you'd rather see used.

The kit's delivery medium. Confluence-plus-Jira is one option (you already have the instance and the four convenors could each get a space). FedWiki is another (aligns with your current RCN work and Ward's involvement). Markdown files in a repo is a third (Claude Code territory). Which do you want v1 to land in? This is the format-check question from earlier and it changes what "draft" means.

The kit's scope in the first draft — a facilitator guide with the five-phase structure, the WHY-WHERE-WHEN-WHO-WHAT-IS-WHAT-MIGHT-BE-HOW sequence embedded in Phase 2, the weighted selection matrix method for Phase 3, and one worked example. Enough to be usable, small enough to actually run. Anything in or out of v1?

Ready to draft on your answers.

---

**Marc** (2026-08-30 21:36):

Let's discuss: 1) "The ASES philosophy — a physical space owned by the community and purpose-built for design and implementation work — is a longer-horizon element that goes beyond a first-artifact kit. Worth naming as what a neighborhood might eventually stand up, and out of scope for what Carl, Chris, Jerry, and Brent get in v1." and 2) " The ontological/speech-acts layer is present in your 2014 material (the mood matrix on the assessment page, the 353 references, the Flores influence) but stays implicit. My inclination is to leave it implicit for v1 — the kit shouldn't require the convener to teach a new vocabulary. CfA-dSC can make it explicit later when it matures." 3) Unless you disagree I still choose the Schools for the example but thing the example should handle / expose the multiple role multi dimensional world that schools (and every other "institution" lives in). RE "The kit's delivery medium." my hope is that we use the FedWiki and that to the extant needed we reverse engineer the aspects of Atlassian we need and deploy via FedWiki and Neo4j, understanding that we can and will handle documents in fedwiki assets folders or other external URLs. RE "The kit's scope in the first draft" that sound like a good start and a place to adapt and build out from (gardening).

---

**Claude** (2026-08-30 21:38):

On ASES first. I was reading it as capital-intensive and long-horizon. What I missed is that The Fledge already IS ASES for Chris in Superior, and Leo's presumably plays a similar role for Jerry in Lansing. Two of four convenors are operating from purpose-built-adjacent spaces already. That changes the v1 answer.

The kit should include a "designated home for the work" concept without requiring construction — the neighborhood identifies the place it already recognizes as its own civic ground. Fledge, Leo's, a maker space, a church hall, a co-op, a library room booked as recurring anchor. What matters is that the linkage map lives somewhere visible over time, the retrospectives happen there, the portfolios accumulate there, and people know where to find the work. That's the operational core of ASES, distinct from the capital ambition of a community-owned purpose-built facility. The full ambition stays named as horizon; the operational core goes in v1.

For Carl in East County and Brent in SW Lansing, this raises a real question — do they have equivalent spaces, or is space-finding an early step in their neighborhoods' work? Either way is workable, but the kit should treat "where does the work live?" as an explicit early decision rather than an assumption.

On the ontological layer, a middle path may be right. Your WHY-WHO-WHERE-WHEN-WHAT sequence IS a speech-act structure, and it's already going into v1 as facilitation sequence. What I'd leave implicit for v1 is the naming — no requirement that convenors learn Flores or teach ontological coaching. The mechanics work whether or not the theory is surfaced. What I'd add is one thin appendix pointing convenors toward the deeper substrate for when they want to go there: Flores on speech acts and moods, Beer on system-level states, the CfA-dSC direction that will formalize the coordination grammar. That way v1 doesn't collapse the layer, doesn't require it either, and shows the path forward. Does that match how you use this material in your own practice?

School worked example confirmed. One thing to flag on the three candidates: #17 Schools-CHW Network as drawn in the PDF looks like a copy-paste of #16 Prevent Senior Falls with just the title swapped — the client is "Family & Individual FRAIL ELDERLY" and the participating institutions are elder-services-shaped. Which means #17 as drawn doesn't actually illustrate a school project. That leaves #33 School-Based Oral Health (cleanest, simplest) and #7 School-Refugee Transition (multi-cultural, multi-family-status, most polycentric).

My lean is #7. A refugee student is simultaneously a student in the school system, a child in a family with its own cultural and legal navigation needs, a resident of a neighborhood, a member of a diaspora community with its own internal support structures, and a client of health and social services. The polycentric structure lives in the fact pattern; the frame surfaces it rather than imposing it. The linkage across School, World Relief, CHW network, and Family & Individual makes it visible. #33 is cleaner but the polycentricity is thinner.

Delivery medium confirmed as FedWiki plus Neo4j. That's a clean answer and it means the kit lives as FedWiki pages (forkable per neighborhood, aligned with your current RCN direction), with the structured graph data (linkage maps, projects, portfolios) in Neo4j and aligned with the Overall Schema work. Assets folders and external URLs handle documents and diagrams.

This also flags a routing decision. The v1 drafting itself — facilitator guide text, templates, worked example prose, reasoning documentation — is chat work. Standing up the actual FedWiki pages and instantiating the Neo4j schema is Claude Code work, running against your ~/rcn setup. I'd suggest drafting all of v1's content here first as portable markdown, then switching to Claude Code for FedWiki instantiation and any Neo4j schema updates. Sound right?

Gardening registered as the operational metaphor for v1's structure. Minimal but complete, template-based rather than prescriptive, forkable, with an explicit "adapt this" section rather than a "follow this" instruction. FedWiki's fork-and-modify pattern is natively aligned with gardening.

One question remains open before I draft. The kit will have a name. Something purely descriptive like "Neighborhood Facilitator Kit for Idealized Design" is dry but does the job. Something more evocative — "Between Us," "Neighborhood Systems Kit," "Gardening Kit" — anchors reception differently. Or leave it as "v1 Facilitator Kit" until convenors give it a real name from use. Do you have a preference? Worth asking before I write cover text.

Ready to draft on your call about naming, and your reactions to the ASES and ontological-layer moves above.

---

**Marc** (2026-08-30 21:38):

Moods and Speech Acts are critical to everything and will be used at all phases and explained as needed.

---

**Claude** (2026-08-30 21:38):

Correction registered. That's a substantive shift and I had it wrong. Moods and speech acts aren't an appendix — they're a working layer that runs through every phase, surfaced explicitly whenever a participant needs them to make sense of what's happening.

That changes several things in the v1 kit structure.

Phase 1 pre-work includes a brief moods orientation for the convener and for early participants, so the vocabulary is shared before the first big meeting. Not a full Flores curriculum — enough to name resentment, resignation, acceptance, ambition, curiosity, and the opening/closing distinction, and to recognize the mood field of a room or a person.

Phase 2's first 6-8 hour meeting explicitly holds space for mood work. When the group co-defines values, principles, goals, beliefs, hopes, and fears, hopes and fears are mood-territory and the facilitation should name them as such. The WHY-WHO-WHERE-WHEN sequence is speech-act structure and gets named as such when it helps participants see what they're doing — declarations, assertions, promises, offers, requests.

Phase 3's weighted selection matrix generates disagreements that read as conflicts about values but often are mood-differences (one group is in ambition, another in resignation, about the same option). The adjudication step needs a mood check before it becomes a values debate — otherwise the process collapses into "we disagree" when the underlying situation is "we're in different moods about the same possibility."

Phase 4's chartering is speech-act-dense. Commitments are promises. Roles are declarations. Resource pledges are offers. Making these acts explicit reduces the ambiguity that usually undermines cross-institutional project execution — the vague "we'll help" that isn't a promise and doesn't create accountability.

Phase 5's execution and retrospective cycle uses the assessment-of-situation template your 2014 material already has — the mood matrix with past/present/future crossed with opening/closing. That's the retrospective structure and it makes the S3* audit function operational at neighborhood scale.

Across all phases, when a participant asks "what does that mean" or the group hits a moment of confusion about a term, the convener explains as needed. Progressive disclosure rather than upfront curriculum. The vocabulary earns its way in through use.

And this connects to the ASES point differently. A designated home for the work matters more once moods and speech acts are load-bearing, because a mood field builds up in a place over time. The Fledge, Leo's, whatever the East County and SW Lansing equivalents turn out to be — these are places where the mood substrate accumulates. That's not incidental. It's part of why a physical anchor matters.

Two things still to answer before I draft: your call on naming (or leaving it as v1 for now), and confirmation that the drafting/instantiation routing makes sense — content drafted as portable markdown in chat, then FedWiki pages and Neo4j schema stood up in Claude Code against ~/rcn.

---

**Marc** (2026-08-30 21:38):

We should not waste our time working in communities that cannot find safe culturally appropriate spaces to come back to time and time again. THEIR SPACES not anyone elses, even if it is someone's basement or garage.

---

**Claude** (2026-08-30 21:39):

Right. That's a hard filter, not a nice-to-have, and it belongs in Phase 1 before any invitation goes out.

The convener's Phase 1 work therefore includes a real question: does this neighborhood have a place its people already recognize as theirs, safe, and culturally fitting, and will that place hold recurring gatherings over months? If the answer is no, the work doesn't start here. Not "we'll help them find one." Not "we'll host at the library until they figure it out." No space, no start.

That's a design decision with several sharp implications worth naming.

It rules out top-down neighborhood selection. An outsider — including the convener — cannot decide a neighborhood is ready. The neighborhood shows readiness by having a place, or it doesn't. This aligns exactly with your from-inside principle and gives it operational teeth: the space is proof of the from-inside conditions being present.

It rules out convener-provided space. If Carl offers his own place as the anchor for East County work, that's Carl's place, not the neighborhood's. The work would proceed on borrowed ground and stay dependent on Carl. Same problem for Chris at the Fledge and Jerry at Leo's — those are their spaces as founders and operators, and the question for their neighborhoods becomes whether the neighborhood has adopted the space as its own, or whether it remains the convener's space that the neighborhood visits. The distinction is real and the kit should make it explicit.

It defines a legitimate outcome of Phase 1 that isn't "proceed": "this neighborhood is not ready to be worked with, and here is what's missing." That's not failure. That's diagnostic clarity that saves everyone's time and prevents the dependency pattern from repeating.

It shifts what the four convenors are agreeing to when they take up the kit. They're agreeing to run Phase 1 diagnostically first, and to decline to proceed if the space criterion isn't met — including in their own neighborhoods, which is the harder discipline. The kit should say this plainly at the front.

And it clarifies what "safe, culturally appropriate, theirs" means in a way that isn't left to the convener's judgment. Some questions the Phase 1 diagnostic could hold: Who decides who comes in? Who has keys? Who cleans up? Who pays for the space if there's a cost? Who decides what happens there? If the answers all route to one person — the convener, a landlord, an institution — the space isn't the neighborhood's. If the answers distribute across neighborhood members who recognize each other as the answer-givers, it is.

This also gives the kit a real early-decline path. Better to name a neighborhood not-ready in month one than to spend six months producing work that dissolves because there was never ground under it.

Two things this raises that I want your call on.

Does the kit's front matter say plainly to the four convenors: "if your neighborhood does not meet the space criterion, do not proceed, including in your own"? That's a strong statement and it constrains what they can do with the kit. It also protects the kit from being used to force-fit a neighborhood that isn't ready. My inclination is yes, plainly.

And what do you want the kit to say to a convener whose neighborhood fails the space diagnostic? "Wait" is honest but empty. "Here is how to help the neighborhood find its space" would be prescriptive and probably wrong. "This is not something the kit can help with — the space has to come from the neighborhood itself, and if it doesn't, the neighborhood is telling you something" is truthful and refuses false help. My inclination is the third. Yours?

The naming and routing questions from earlier are still open. Ready to draft when you've answered these two and those.

---

**Marc** (2026-08-30 21:43):

"It rules out convener-provided space. If Carl offers his own place as the anchor for East County work, that's Carl's place, not the neighborhood's. The work would proceed on borrowed ground and stay dependent on Carl. Same problem for Chris at the Fledge and Jerry at Leo's — those are their spaces as founders and operators, and the question for their neighborhoods becomes whether the neighborhood has adopted the space as its own, or whether it remains the convener's space that the neighborhood visits. The distinction is real and the kit should make it explicit." This is too hard edges. Leo's and The Fledge meet my criteria and their. So we (you and I)  just need to find a way to talk about such spaces. They were purpose created in the community for neighborhood collaborative work--by a community member, by community members NOT by outsiders nor by government nor by already present institutions such a churches. And your logic will quickly discover an unaddressed question, how long before the thing loses these qualities. And how can a new one replace the old one. These are the questions RCN is grappling with now.

---

**Claude** (2026-08-30 21:44):

Correction registered and understood. I overshot on the "convener-provided" logic. Leo's and The Fledge meet your criteria because of how they came to be — created by community members inside the community for collaborative work, not imposed from outside, not spun up by government or existing institutions, and functioning as neighborhood commons even though a founder is identifiable. That's a specific origin and function pattern, and it's what qualifies a space, not the absence of a founder.

The vocabulary problem you're naming is real. "Community-owned" reads as legal ownership, which misses it. "Third place" is Oldenburg's term but doesn't capture the purpose-built-for-collaborative-work part. "Commons" points at the governance shape but is vague about origin. "Community-created civic infrastructure" is accurate and unreadable.

The pattern seems to have several conditions holding together:

Origin from inside — a community member or members created it for the community, not for a customer base, a congregation, or a constituency.

Purpose designed for collaborative work — not incidentally hospitable to it, but built for it. The Fledge and Leo's are purpose-built in a way a coffee shop is not, even a friendly one.

Ongoing use as commons — the neighborhood recognizes it as theirs and uses it that way, whether or not the founder is present. The founder's role is real but has shifted from proprietor toward steward, and the community's ownership is functional even if not legal.

Not captured by external actors — no government agency, foundation, or established institution can direct what happens there, even if they occasionally fund or use it.

A working phrase might be "founded commons" or "commoned space" — grammatically awkward but captures both the specific origin and the collective present-tense function. Or just describe the pattern in a couple of sentences and let convenors recognize their local instance. Do you have a term already in use in RCN circles, or is this itself an open naming question?

The two questions your last sentence names are the real ones and they belong in the kit as open work, not resolved doctrine.

How long before a founded commons loses these qualities. The failure modes are probably several. The founder-steward departs without succession and the space reverts to whoever holds the lease. Growth attracts institutional capture — grants with strings, partnerships that dilute purpose, professional staff whose accountability drifts outward. Neighborhood turnover empties the constituency of use. Or the collaborative-work function decays into event-hosting or coworking, retaining the form and losing the substance. The kit shouldn't pretend to solve this — it should name that the question exists, that RCN is grappling with it, and that the convener's Phase 5 retrospectives are the natural place to notice degradation early.

How a new one can replace the old one. This is harder. The founded-commons pattern seems to require a founder-with-vision and a specific historical moment; it's not obvious that it can be manufactured on demand when an old one degrades. But it's also not obvious that it can't. What's the RCN thinking so far — is there a hypothesis about seeding new founded commons, or is that still open?

If both questions are open in RCN, the kit should carry them openly. Something like a section at the end of Phase 1 named "the space question, over time" that names both, points to where the RCN community is working on them, and says plainly that a neighborhood whose founded commons is degrading is a neighborhood that needs to be talking about succession or replacement now, before the collaborative work depends on ground that's about to shift.

This also connects to the SODOTO portfolio layer in a way I hadn't seen. If a founded commons has stewards over time, those stewards accumulate portfolios of what happened in the space under their tenure — not just projects executed but the space's own health as a commons. Succession becomes visible as a portfolio handoff rather than a private arrangement. Not certain that's the right move but flagging it.

Three questions for you:

Is there an existing term in RCN circles for this class of space, or do we work with a description until one emerges?

For the kit's Phase 1 diagnostic, what specific questions would you want convenors to hold — beyond "who decides, who has keys, who cleans up, who pays" — to distinguish a founded commons from a friendly-but-not-quite space? You know this better than I do.

And is the "how a new one replaces an old one" question open enough that the kit shouldn't gesture at answers, or is there enough RCN thinking that the kit should point toward it? I'd rather under-claim than over-claim on RCN's behalf.

Naming and routing still open. Ready to draft on your answers.

---

**Marc** (2026-08-30 21:51):

I actually like, ""Community-created civic infrastructure" and "A working phrase might be "founded commons" or "commoned space" which can be the start of a conversation in neighborhood for them to find their own language for this. RE new following old--this is biology and sociology and anthropology. It is the way live adapts and extends. We just need to look to biological patterns (As Vester suggests) to find a way to shift from mechanical to biological systems thinking. THEN let's come back to your question, "For the kit's Phase 1 diagnostic, what specific questions would you want convenors to hold — beyond "who decides, who has keys, who cleans up, who pays" — to distinguish a founded commons from a friendly-but-not-quite space? You know this better than I do." Be a little more granular so I can help.

---

**Claude** (2026-08-30 21:51):

Right. Splitting the diagnostic into the dimensions a convener would actually need to walk through, so you can react at grain.

**Origin.** How did the space come to be? Who initiated it, and were they of this neighborhood at the time? Was it built or converted for the collaborative purpose it now serves, or is that use retrofitted onto a space built for something else? How long ago, and what did the neighborhood look like then?

**Founder relationship, present tense.** Is the founder still active in the space? In what role — proprietor, steward, member among members, absent? Has the founder's role visibly changed over time, and if so, how? What happens if the founder is gone for a month? Six months? Would the space still function?

**Governance in practice.** Who actually decides what happens in the space? Programming, use, access, changes to the space itself, financial decisions, disputes. Is there a formal structure (board, collective, cooperative), an informal one (a recognized group of decision-makers), or does it default to the founder or a small circle? Does the neighborhood recognize the decision-makers as legitimate?

**Access and membership.** Who can come in, and on what terms? Is there a membership, a fee, a vouching pattern, open access? Who has keys or equivalent — who can be there when others aren't? Are there people the neighborhood expects to be there, and are there people who would feel unwelcome? On what grounds — cost, culture, past history, unspoken rules?

**Safety in the specific sense.** Is this a place where people say things they wouldn't say elsewhere? Are disagreements and hard conversations survivable here? Have they happened? What happens to someone who challenges a decision made in this space — is there a path for that, or does it end the relationship? Are there groups in the neighborhood who would say this space is not safe for them, and why?

**Cultural fit.** Whose language is spoken here — literally, and in the sense of vocabulary, register, unspoken norms? Are there neighborhood populations who would enter and feel this is not their kind of place? Is the food, the imagery, the schedule, the pace legible to the neighborhood or to a subculture of it? Who does the space attract, and who does it fail to attract — and does the neighborhood match that pattern?

**Function match.** Is the space usable for the collaborative work the kit's phases require? Can 8-15 people sit together for a working session? Can a linkage map stay up on a wall for months? Can there be a recurring recognizable time? Can materials, artifacts, and evolving work be stored and displayed?

**Financial durability.** How does the space stay open — rent, ownership, donations, membership, revenue from other activity? Is that basis stable across a change in economic conditions? Who holds the risk if it fails? Is the neighborhood at risk of losing the space to a landlord decision, a tax event, a founder health event? What's the succession plan if the founder becomes unable to continue?

**Constituency.** How many people in the neighborhood use this space or have used it? Not attend an event once — actually use it. Would neighborhood members recognize each other as fellow users? Is there a "regulars" group whose composition changes over time or stays the same? Are people showing up from the neighborhood, or is the space drawing from a wider geography that happens to include the neighborhood?

**History under stress.** Has the space been through anything hard — a leadership conflict, a financial crisis, a founder-departure attempt, an external threat? How did it come through? A space that has survived a real stress event has demonstrated its commons character; one that hasn't been tested has claimed it.

**Neighborhood recognition.** If you asked ten random neighborhood members "does this neighborhood have a place that belongs to it, where the neighborhood's work happens," would they name this space? Would they name a different one? Would they say no? The answer to that question is more diagnostic than any of the above.

Some of these are hard questions and asking them all in a Phase 1 conversation would feel like an interrogation. So the kit probably needs both a full diagnostic set for the convener to hold internally, and a shorter conversational set to actually raise with the neighborhood — plus judgment about which of the harder ones (Cultural fit, Safety, History under stress) need to be asked directly and which get answered by what the convener observes over the pre-work period.

Which of these feel right, which need reshaping, and are there dimensions I'm missing?

---

**Marc** (2026-08-30 21:54):

Any place/group that has any vestige of neighborhood already have small groups getting things done outside of business and government (often involving business owners and government officials in a peripheral way). These folks can be invited into conversation with the money granting arm of WWHA (and we will design WWHA and that arm to work in this way).

---

**Claude** (2026-08-30 21:55):

That reframes Phase 1 substantially, and clarifies where I was overcomplicating.

The diagnostic isn't "does this neighborhood meet ten criteria." It's "who is already getting things done here, outside business and government, and are they findable?" If the answer is yes, the neighborhood has the substrate. The small groups already at work are the evidence that the founded commons is functional, whether or not it has a physical space yet (though usually it does — the small groups tend to have a place they gather). Business owners and government officials appearing in peripheral roles is a healthy sign; it means the neighborhood has porous relationships with the broader system without being captured by it.

That inverts the diagnostic question. Phase 1 doesn't establish readiness by checking conditions. It establishes readiness by finding whether the small groups exist, and whether they can be invited into conversation with WWHA's granting arm. If they exist and are open to the invitation, the neighborhood is ready. If they don't exist or can't be reached, the neighborhood isn't — and probably no external effort can substitute for what would need to have grown on its own.

And it repositions WWHA's granting arm as part of the mechanism itself, not as a downstream funder the kit hands off to. WWHA-with-this-granting-arm is designed to receive and work with these small groups. The kit and WWHA's granting arm are two halves of the same design. The kit orients the convener toward finding and inviting small groups; the granting arm is what they can be invited into conversation with. Neither works alone.

Which raises several things worth working before I draft.

The invitation itself. What does WWHA's granting arm actually offer the small groups when they come into conversation with it? Grant capital is one obvious form. Others might be recognition, connection to other groups doing related work, access to the linkage-mapping process and its outputs, a portfolio that accumulates over time, a defensive backstop when institutional actors try to capture their work. The form of the offer shapes who accepts it and what they do with it. This may be one of the WWHA design questions still open.

The relationship between kit and granting arm across the phases. Phase 1 finds and invites the small groups. Phase 2 brings them together for the first meeting. Somewhere in Phases 3 through 5, funding decisions get made — either the granting arm funds specific projects the groups charter, or funds the groups themselves, or funds the space they work in. Which of those, and at what phase, is a design decision that shapes the whole shape of the kit. My inclination is that the granting arm shows up substantively at Phase 4 chartering, since that's when commitments and resources are needed and it aligns with speech-acts-around-promises. But that's a guess, and you know how WWHA is being designed better than I do.

The four convenors' relationship to WWHA. Carl in East County is inside WWHA's geographic scope. Chris in Superior and Jerry-and-Brent in Lansing are outside it. Does the kit assume a WWHA-equivalent granting arm exists in each neighborhood's larger container, or is it Whatcom-specific in v1? Two paths — a Whatcom-specific v1 that the other three adapt for their contexts, or a v1 that treats the granting arm as a generic role to be instantiated locally (WWHA in Whatcom, TBD in Superior, TBD in Lansing). My inclination is the second, with WWHA as the worked example of the granting arm, but that's another call for you.

And the small groups' portfolios. What you're describing sounds like the actual seed content for the first-generation portfolios in the SODOTO layer. The people already getting things done are the ones with real histories, even if those histories aren't yet documented. The kit's early work with a small group might include helping them articulate what they've already done, in a form that becomes portfolio material — not to gatekeep, but so the record of their existing capacity accumulates from the start rather than only from the moment they take a kit-facilitated project. Does that fit how you're thinking about SODOTO in this context?

Three questions before I draft.

The invitation from WWHA's granting arm — is the shape of that invitation open enough that the kit shouldn't specify it, or firm enough that the kit can describe what small groups are being invited into?

At what phase does the granting arm substantively enter the process? Phase 1 (as the entity making the invitation), Phase 4 (chartering and funding), or across all phases as a background presence?

WWHA as specific example versus generic granting-arm role — which does v1 assume?

Naming and routing still open, and now this too.

---

**Marc** (2026-08-30 22:01):

RE "What does WWHA's granting arm actually offer the small groups when they come into conversation with it?" We offer them whatever they need. Hopefully mentorship with Carl, Jerry, Chris; SODOTO; RenDanHeYi fit for neighborhood scale entrepreneurship, etc. etc. --everything I have been working on for 30 years. But only on an as needed basis. Not a dump truck load of "technical support" on their lawns. By the way I hate the term and pervasive style of technical support in the philanthropic and grant making industry.

---

**Claude** (2026-08-30 22:01):

Registered, and the "no dump truck of technical support" is a design principle in itself.

What the granting arm offers, then, is a menu of adjacencies available on request. Not a package, not a curriculum, not a mandatory onboarding. Small groups come into conversation and stay in conversation; specific offerings surface when a specific group encounters a specific need. Mentorship with Carl, Chris, or Jerry when someone is stuck on a governance question they've been through. SODOTO when a group is ready to make its portfolio visible. Rendanheyi patterns when a group is ready to move from ad hoc to structured. The linkage-mapping method when a group is ready to see itself in a larger system. Facilitation help when a hard conversation needs holding. Money when money is what's needed and other things have been resolved. Each of these on request, none of them pushed.

That has real shape. It means the granting arm is a relationship, not a program. The relationship is initiated by the invitation and sustained by ongoing conversation, and the offerings sit inside it as things available when relevant. This is closer to how a good doctor works than to how a good foundation works — you know the medicine chest, you don't administer everything at every visit, you notice what's needed and offer it, the patient accepts or declines.

Which surfaces the design opposite of technical-support-dump. Technical support is push, generic, timed to the funder's calendar, and framed as help-they-need-whether-they-know-it-or-not. What you're describing is pull, specific, timed to the group's readiness, and framed as help-they-can-take-or-leave. The small group's autonomy is the through-line.

The kit should probably say this plainly to convenors. Something in the front matter about what the granting arm is and is not — not a service delivery machine, not a technical-assistance provider, not a compliance apparatus. A relationship-holder with a menu of adjacencies, offered on request. Convenors need to understand this because they'll be tempted to push things they know would help; the discipline is to wait until asked.

Which also connects back to the four convenors themselves. Carl, Chris, and Jerry are three of the mentorship offerings on the menu. They are also the people using the kit to convene their own neighborhoods. That double role is interesting and probably fine — they're mentors to other neighborhoods' small groups, convenors of their own — but it's worth naming that the kit's early users are also part of what the granting arm can offer to future neighborhoods. Their portfolios accumulate on both sides.

And it changes my earlier phase-mapping question. If the granting arm is a relationship rather than a phase-specific intervention, it's present from Phase 1 (as the entity making the invitation) through Phase 5 and beyond (as the ongoing container the small groups' work sits inside). What varies across phases isn't whether the granting arm is present but which of its adjacencies are being drawn on at that moment. That's a simpler and truer mapping than the Phase-4-chartering guess I offered.

Two things this raises before I draft.

The kit itself is one of the adjacencies on the menu. A small group might come into conversation with WWHA and never need the linkage-mapping process — they might be doing fine, they might already know each other, they might just need a bit of money and to be left alone. The kit shouldn't be treated as the default path that every invited small group runs through. That's a strong statement and I want to confirm you agree — otherwise the convenor's temptation will be to run every group through the phases whether or not the group asked for them.

And the on-request principle probably means the kit has to include some form of explicit surfacing of what's available, without pushing it. Small groups can only request things they know exist. My inclination is something like a single-page menu the convenor can share when the group asks "what can this WWHA thing actually help with?" — not a brochure, more a list with brief descriptions and the standing offer to talk about any of them if wanted. Does that fit, or do you have a different mechanism in mind for making the adjacencies discoverable without making them prescriptive?

Naming, routing, and the earlier three questions (invitation shape, phase presence — now answered as "throughout" — and WWHA-specific vs. generic) still open. Ready to draft on your answers.

---

**Marc** (2026-08-30 22:05):

I happen to have a very strong perference that on the grant making and facilitation side everyone must be working in a volunteer capacity. THIS IS CIVIL SOCIETY--not a new "helping" industry. Refresh your memory of John McKnight's The Careless Society, Community and Its Counterifts. The only solution I have seen work is elders giving back--not taking. That will reframe every thing in a way that having patients on all design teams did. THIS IS HOW YOU CHANGE A WORLD VIEW. Change the POV and the mix.

---

**Claude** (2026-08-30 22:07):

Registered. McKnight belongs at the center of the frame, not as citation. The core distinction — care as associational gift versus service as professional transaction — is the whole game. The moment facilitation or granting becomes paid work, it starts producing the counterfeit McKnight names, and it does so through the incentive structure of paid work itself, regardless of any given individual's good intentions. Paid work bends toward client-production and continuation of the paying relationship. That's what it does.

There's a specific dependency-elimination implication in this I hadn't fully seen. Paid facilitators have material interest in the work continuing; they need it to keep going or their livelihood ends. Volunteer elders have interest in the work becoming self-sustaining, so they can rest and pass it on. Your earlier dependency-elimination principle — the tools do what facilitators did — was a design fix to the problem. The volunteer principle is a structural fix to the same problem, built into who is doing the work rather than only into how it's built. Both are needed. Together they make the pattern durable.

This reshapes the kit's front matter into something with real bite: this only works if facilitation and granting are volunteer, elder-driven, and non-professionalizing. A convener paid to run this will pull it toward service over time, whatever their intentions. That's a design constraint the kit names and asks convenors to accept before they start.

Several implications follow.

The convener role is a volunteer role, always. Carl, Chris, Jerry, Brent take this on as elders giving back, and any successor takes it on the same way. If a neighborhood's convener needs to be paid, that neighborhood isn't ready and the kit isn't for them.

WWHA's granting arm is volunteer, always. The people deciding what gets funded are elders working in the way of civil society. Legal and fiduciary responsibilities can be met by elders with the right skills; small foundations do this. What cannot be substituted is the volunteer status. The moment it becomes paid, it becomes the philanthropic industry you named, and Ostrom's polycentricity gets replaced by hierarchical service delivery.

Mentorship offerings on the granting arm's menu are all elder-to-neighbor gift. Carl mentoring a new East County group, Chris a new Superior group, Jerry a new Lansing group — none of that is billable. Which puts a real constraint on scale: you can only have as many mentors as you have elders willing to give back, and the offerings extend at that pace. That's a feature. It prevents the machine from outrunning the community's own capacity to hold it.

Small groups doing between-institution project work can be paid for their project work. That's a different category. Money for delivering a project is fine; money for the infrastructure of connection, facilitation, and granting is what corrupts. The kit needs to hold this distinction cleanly, because it will be under pressure — the small groups will sometimes wonder why the mentors and grantmakers aren't paid too, and the answer is McKnight's, told plainly.

Elder succession becomes as important as founded-commons succession, and it lives on the same biological-not-mechanical logic you referenced. Elders age out, new elders come into the giving-back stage, the pattern replicates or dies depending on whether the neighborhood produces the next generation of people willing to give back. Phase 5 retrospectives are where this gets noticed. The kit should probably say so.

And the patient-on-design-teams analogy is exactly right on how this works as worldview change. Patients' presence made certain things unspeakable and other things speakable, and expertise had nothing to do with it. Same here: an elder-volunteer at the granting arm makes certain things unspeakable (billable hours, program officer job descriptions, KPIs justifying the officer's role) and other things speakable (the neighborhood knows what it needs better than we do, we should stop helping now, this work should end when the neighborhood no longer needs it). Change the mix, change the POV, change the world. That is the mechanism.

One question this leaves. Do you want the kit to include an explicit early-decline path for convenors who realize they cannot do this in a volunteer capacity — a front-matter statement that says plainly, if you can't sustain this from your own reasons for giving back, please don't start? My inclination is yes, plainly. It protects the pattern from being taken up by people who will bend it toward professionalization out of their own economic need.

Everything else — naming, routing, WWHA-as-example, adjacencies menu, phase presence of the granting arm as "throughout" — I can proceed with reasonable defaults if you want me to. Or resolve them first. I've been letting open questions accumulate. Say the word and I draft, or answer the ones you want firmed up and then I draft.

---

**Marc** (2026-08-30 22:07):

New businesses often need seed capital (catalytic money) not long term operating or salaries. Raise your kids and set them free.

---

**Claude** (2026-08-30 22:08):

Right. And that reframes what the granting arm's money is *for* in a way that carries the whole design.

Catalytic money for new work. Seed capital that enables a small group to try something they otherwise couldn't. Enough to buy the space or the materials or the time to launch. Not enough to become an ongoing operating budget, and structurally not shaped to become one. The money starts the thing and steps away.

The between-institution project work in your Spokane and Medford substrate fits this exactly. A project like #33 School-Based Oral Health needs seed capital to stand up the initial linkage, pay for the equipment, secure the first-year commitments. Once the linkage is working and the institutions have absorbed their share of the ongoing cost as part of doing their real work, the seed money has done its job. If the seed money is still funding operations in year three, either the project failed to become self-sustaining or it was never a real between-institution project in the first place — it was a program the money was propping up.

Which sharpens what the granting arm evaluates when a small group asks for money. The question is not "is this a good project" but "is this catalyzable, will the seed do its work and then be able to step away, or is this a request for ongoing subsidy dressed as a launch." The distinction is doable in conversation, but it takes elders who have seen the pattern to hold the line. Which is another reason the granting arm has to be volunteer elders — a paid program officer with quarterly deployment targets cannot reliably decline requests that don't meet this test, because their job depends on deploying the capital.

Same principle applies to the small groups themselves. Raise your kids and set them free means the small groups are not the granting arm's ongoing clients. They come into conversation, they get what they need on request, they take the seed money and do the work, they set themselves free. The relationship with the granting arm continues as adjacency and mentorship, not as dependency. When they no longer need the granting arm, that's the point.

And it applies to the kit's own theory of use. Convenors run neighborhoods through the phases and then step back. The neighborhood absorbs the pattern and continues without them, or it doesn't. If it doesn't, the convener made the classic error of raising kids who never left. If it does, the convener moves on — to another neighborhood if there is one to serve, or to rest, or to the elder-mentorship role for other convenors coming up. The pattern replicates by parents releasing children, not by parents extending oversight.

This closes the loop on several things I'd been holding as separate.

Dependency elimination is not one design principle but three, working together. First: the tools do what facilitators did (from earlier). Second: facilitation and granting are volunteer-elder work, not paid work (from your McKnight point). Third: money is seed catalytic capital that funds launch and then departs, not operating budget that creates ongoing relationships (from now). Any one of these alone is insufficient; all three together create a pattern that structurally resists professionalization and dependency.

Founded commons succession, elder succession, and now project succession — all three run on the same biology. New founded commons emerge as old ones age out. New elders step into the giving-back role as older elders rest. New small groups form as older ones become self-sustaining and no longer need the seed relationship. The pattern is generative because release is built in at every level. Vester's biological systems thinking, made operational.

The kit's front matter is now doing serious work: this only works if convenors are volunteers, the granting arm is elder-led volunteer, and the money is catalytic seed capital that funds launches and departs. Three clean statements. Each one closes a door the philanthropic-industrial pattern walks through. Together they define what "civil society" means operationally, in a form Carl, Chris, Jerry, and Brent can hand to anyone considering whether to take up the kit and use it as intended, or hand back if they can't.

I have enough now. The open questions I've been accumulating — naming, routing, invitation shape, WWHA-as-example vs generic, adjacencies menu shape, early-decline path, kit as one adjacency among several rather than default — I can carry into the draft with defaults I'll make explicit, and you can react to what I chose. Or you can resolve any of them first. Your call.

Ready to draft when you say go.

---

**Marc** (2026-08-30 22:17):

A comment on, says plainly, if you can't sustain this from your own reasons for giving back, please don't start". Consider RenDenHeYi seriously. Consider the Haier Group's current approach with EMCs and Support Enterprises. Every one gets paid. I have not yet found the analogy for Carl, Chris, and Jerry's contribution but I am confident it is there. They should be getting paid BUT only when value to customers (residents and their customers) get paid as a direct/indirect consequence of Carl, Chris, Jerry contribution--all handled by dSC. It might be worth creating a urgent adjacent chat to explore and "resolve" this.

---

**Claude** (2026-08-30 22:18):

Correction registered, and it's a real one — not a small correction. I collapsed McKnight's principle into "unpaid," and Rendanheyi shows that was too fast. The distinction that actually matters is not paid-versus-unpaid but structurally-independent-of-outcomes versus structurally-tied-to-value-delivered.

A traditional program officer earns salary regardless of whether the funded work creates value for residents. That's the pattern McKnight names as counterfeit — the incentive is client-production and continuation of the paying relationship, because the pay flows from the funding institution rather than from the value created. Rendanheyi inverts this. At Haier, EMCs earn only when users get value; support enterprises earn only when EMCs succeed. Compensation flows from the value-chain outward, not from a central budget inward. Someone can be paid substantially and still be operating in the civil-society mode McKnight is pointing at, provided the pay is tied to actual value delivered to residents rather than to a job description or a service contract.

That completely reshapes the third dependency-elimination principle. It is not "money is catalytic seed capital that departs" — that's still true for the small groups' project launches. The convener and granting-arm compensation question is a different question with a different answer: Carl, Chris, and Jerry can be paid, and probably should be paid, provided the payment is structurally downstream of residents receiving value that would not have existed without their contribution. dSC is the mechanism that can make this operational — the smart contract instruments the value chain and settles compensation according to the actual causal flow, not according to a salary line.

The analogy you're looking for is probably in the shape of the value chain itself. In Haier, an EMC creates a product the user directly pays for. In neighborhood work, the value is more diffuse — a resident's kid doesn't fall through the school-refugee-transition gap, a family's oral health problem gets caught early, a neighborhood's founded commons acquires the succession capacity to survive its founder's aging out. Naming who "pays" in these cases (in the sense that entitles Carl or Chris or Jerry to compensation as a downstream consequence) is the design work that isn't finished yet in your thinking, and I don't want to make it up.

This is worth an urgent adjacent chat. It touches CfA-dSC directly (the smart contract instrumenting the value flow), SODOTO (the portfolios that make the value contribution visible over time), Overall Schema (the graph that makes the causal chain traceable), and the granting arm's design (what money is doing when, and where it comes from). It's foundational, not tangential — the kit's front matter about "who is doing this work and why" cannot be written accurately until this is worked. If I draft with the wrong compensation frame, the whole thing carries a McKnight-flavored asceticism that isn't what you mean.

My suggestion: pause the v1 kit draft, open the adjacent chat, work the compensation-mechanism question there until it has enough shape to be described in the kit's front matter without misrepresenting it. Then return to the kit draft with that resolved. The other open questions I've been carrying — naming, routing, invitation shape, WWHA-as-example, adjacencies menu, early-decline path — are all downstream of this one and can be answered cleanly once this is settled.

For the adjacent chat, some starting shape:

The specific question is what value-chain instrumentation makes Carl-Chris-Jerry-Brent compensation flow from actual resident-received value rather than from a fixed contribution to WWHA or its equivalents. Haier's EMC/support-enterprise/user-payment structure is the reference, and the translation to neighborhood work is the design work.

A few pieces that would sit inside this: which "user" pays, and in what form (money, land, time, attention, standing) — because residents don't directly pay for the neighborhood work in most cases, and identifying the actual payer is the first design decision. What CfA-dSC needs to instrument this at neighborhood scale, and what already exists versus what needs to be built. How SODOTO portfolios expose the causal chain from Carl's contribution to a specific value-received event three or five years later. How the granting arm's role fits — is WWHA the "support enterprise" in the Haier analogy, or something else. And how this scales down to Brent in SW Lansing where there is no equivalent granting arm yet, versus scaling up to Carl in East County where WWHA is the granting arm.

Two questions on how to proceed.

Do you want to open the adjacent chat now, or hold both open and toggle? Toggling has risk that the compensation question stays perpetually open while the kit drafts against unresolved ground. Opening now and pausing the kit draft is cleaner but slower.

And do you want the adjacent chat to also carry the "how a new founded commons replaces an old one" question and the "what does the granting arm's invitation actually offer" question? Both are related, both feel like they belong in the same design conversation about the value-flow and relationship structures. Or should each stay in its own chat?

Ready to pause the kit draft on your say-so.

---

**Marc** (2026-08-30 22:22):

In the Haier Group they actually have/had? a function called and "Industry Platform" that works as in internal VC. Clearly the folks that operate the industry platform are being paid and certainly based upon results. What I am really suggesting is that WWHA create a neibhborhood catalyzing "industry platform" function that only pays its employees based on the outcomes of the MEs and SMEs and EMC that they fund. The balanced score card will need to include more than just money.

---

**Claude** (2026-08-30 22:23):

That's the missing analog and it changes the shape considerably.

WWHA's granting arm isn't the philanthropic-industrial pattern in a nicer costume. It's an Industry Platform for a neighborhood-scale civil-society sector. The platform team can be paid, provided compensation flows from the outcomes of the MEs, SMEs, and EMCs they seed and support — and the balanced scorecard against which those outcomes are measured includes categories beyond money.

That resolves the McKnight tension. McKnight's counterfeit is the paid role whose incentives are independent of value-received. Haier's Industry Platform is the paid role whose incentives are structurally locked to value-created downstream. They look similar from a distance and are opposite in operation. The organizational form makes the difference.

Which repositions Carl, Chris, Jerry, and Brent in a way that makes more sense than my earlier framings. They are not volunteer elders in the McKnight-purist sense, and they are not paid facilitators in the philanthropic-industrial sense. They are Industry Platform operators for their neighborhood clusters, compensated as a downstream function of the MEs they help form and the value those MEs deliver to residents and residents' customers. Their portfolios accumulate not just their own contributions but the trajectories of what they seeded. That is a coherent and non-corrupting role, and it has real precedent.

The balanced scorecard question is where the design work concentrates. A neighborhood-scale Industry Platform cannot use Haier's scorecard directly — Haier measures user-payment, revenue growth, market position. A neighborhood ME producing a between-institution project like School-Refugee Transition or Community Managed Formulary produces value in categories that don't reduce to money, and if the scorecard reduces them to money, the platform will select for money-shaped work and starve the rest. So the scorecard has to hold multiple value dimensions in a form the platform can actually operate on.

Some starting candidates for the dimensions:

Resident well-being outcomes tied to the specific ME's work (health measures, safety measures, connection measures, whatever the ME's project actually addresses)

Between-institution linkage improvements — did coordination between organizations that were disconnected before this ME's work actually become durable, or did it collapse when the seed money left

Neighborhood capacity growth — did the ME's work leave the neighborhood with more people who now know how to do this kind of work, or was capacity concentrated in the ME itself

Portfolio depth of the individuals involved — SODOTO histories accumulated as a consequence of participation

Founded-commons health — did the space that hosted this work become stronger, weaker, or unchanged over the ME's engagement

ME viability without further seed capital — the raise-your-kids-and-set-them-free test, at eighteen months and thirty-six months

Replicability of the pattern the ME created — did other neighborhoods pick up something learnable from this

Cultural fit and neighborhood legitimacy — do the residents recognize this work as belonging to their neighborhood, or does it feel imposed

Some of these are hard to measure. That's fine. The Industry Platform's job includes figuring out how to see these dimensions without collapsing them into surrogates that miss what they are (test scores instead of learning, event attendance instead of connection). Rasch measurement (your CAM work) probably has direct application here — several of these dimensions are latent constructs that Rasch is exactly designed to measure.

This is now genuinely a design problem that touches nearly everything you have in progress. Industry Platform organization design. Balanced scorecard construction with Rasch-appropriate measurement. dSC contracts that instrument the value chain from Platform contribution through ME work to resident value-received. SODOTO portfolios that track the causal traces. WWHA's structure and governance. And the relationship between the Whatcom instance and the equivalent that would need to exist for Superior, Lansing, and elsewhere.

The kit's front matter now looks different. Rather than "convenors are volunteer elders," it becomes something like: "convenors operate as Industry Platform for a neighborhood cluster, compensated as a downstream function of the value the MEs they seed deliver, measured against a balanced scorecard the Platform is responsible for constructing and maintaining." That's a more honest and more scalable description, and it doesn't rely on ascetic self-sacrifice as the mechanism preventing corruption. The mechanism preventing corruption is the compensation structure itself.

Two things worth raising before we pause the kit and open the adjacent chat.

The adjacent chat now has enough scope to matter substantively. It should probably work at least: the Industry Platform's organizational form at neighborhood-cluster scale, the balanced scorecard's initial dimensions and how they get measured, dSC's role in instrumenting the value chain, and how this maps to WWHA specifically as the first instance. That is a real design agenda, not a side conversation.

And the kit's v1 draft may need to wait for at least the front-matter-relevant parts of this to settle. Not the whole design — the Industry Platform's full operational design will take longer than the kit — but enough that the kit can accurately describe what the convener is agreeing to become when they take it up. Otherwise the kit teaches a role that the mechanism can't actually sustain.

Do you want to open the adjacent chat now? And if so, does the agenda above match what you'd want it to hold, or does it need reshaping?

---

**Marc** (2026-08-30 22:34):

Yes, "So the scorecard has to hold multiple value dimensions in a form the platform can actually operate on" and we will develop and adapt these to fit the place and time and culture of the neighborhoods NOT the funding agency. The industry platform actors get paid by the creation of the values and value of the residents NOT ANY OUTSIDER.

---

**Claude** (2026-08-30 22:35):

Registered, and it sharpens the compensation logic to a hard edge that hadn't been fully explicit.

The Industry Platform actors' compensation flows from value created for and recognized by residents. Full stop. Not from a foundation's assessment of value. Not from a state agency's outcome metrics. Not from an academic evaluation framework. Not from WWHA's board's judgment. From the residents themselves, or from the customers of the residents' work — the value chain terminates in the neighborhood, and the compensation signal originates there.

That is a much stronger constraint than "outcome-based pay" as it's usually meant in the philanthropic-industrial world, where outcomes are defined by outsiders even when they're paid on. It's also stronger than most Rendanheyi implementations discussed publicly, where the "user" is still often mediated through platforms or intermediaries. What you're describing is compensation that originates in the neighborhood's own recognition of value received, and flows outward from there through whatever instrumentation (dSC, portfolios, graph) can carry the signal faithfully.

Several things fall out of this.

The balanced scorecard is not a WWHA instrument or a granting-arm instrument. It's a neighborhood instrument. Each neighborhood constructs and maintains its own scorecard for what counts as value, adapted to its place, time, and culture. The Industry Platform's job is to help the neighborhood construct one that will actually see its own value-creation clearly — not to hand it a template. And the platform's own compensation depends on the neighborhood's scorecard, which means the platform has strong incentive to help the neighborhood build a scorecard that is real, not one that flatters the platform. Two-way discipline built into the instrument itself.

Rasch measurement fits this now in a specific way. Rasch is designed to hold latent constructs across contexts by calibrating items to a shared underlying dimension while allowing item content to vary. That is exactly what neighborhood-specific scorecards need: dimensions that are comparable enough to be usable across neighborhoods (so the Industry Platform can operate at cluster scale) while the specific items that measure them are neighborhood-authored. Your CAM work is the operational precedent — same measurement architecture, applied here.

The Industry Platform's role in helping construct scorecards becomes a real methodology, not a form-filling exercise. What is it that residents in this neighborhood recognize as value received? Not "improved health outcomes" as a category — what specifically, in this neighborhood's language, in this neighborhood's felt experience, would residents point to and say yes, that is worth something to us. That surfacing is itself skilled work, and it's part of what Carl, Chris, Jerry, and Brent bring — the capacity to hold the conversation that generates a real scorecard rather than a bureaucratic one.

Which also means outsiders — WWHA's board, funders, state agencies, evaluators — cannot originate the scorecard even when they contribute capital. They can decline to fund a neighborhood whose scorecard they don't believe in, but they cannot substitute their scorecard for the neighborhood's. That is a real governance constraint on WWHA itself, and it should probably be in WWHA's charter.

And this makes the earlier "raise your kids and set them free" principle operational at the platform level. The Industry Platform's success is a neighborhood that can maintain its own scorecard, recognize its own value received, and eventually operate without needing the platform's ongoing seeding. The platform's compensation trails away naturally as the neighborhood becomes self-sustaining, because the neighborhood's value creation continues but the platform's causal contribution diminishes. The compensation structure itself enforces release rather than requiring willpower.

The kit's front matter now has a fourth clean statement that pairs with the other three:

The convener operates as an Industry Platform actor. Compensation flows from value created for and recognized by residents of the neighborhood — through instruments the neighborhood itself constructs and maintains. No outsider originates the measure. No outsider substitutes their judgment for the neighborhood's judgment of what has been received.

That is the compensation-structure answer to McKnight, expressed operationally rather than as a prohibition.

Two questions before the adjacent chat opens.

First — does the phrase "value created for and recognized by residents" carry the right weight, or is there a term of art you've been using in RCN circles for this that I should adopt? "Recognition" specifically is doing a lot of work in what I wrote (it's what makes the compensation signal originate from the neighborhood rather than from an assessor) and if there's a better word I want to use it.

Second — the neighborhood-authored scorecard constructed with Rasch-appropriate measurement is now a real design object that the adjacent chat needs to hold, alongside the Industry Platform organizational form, dSC value-chain instrumentation, and WWHA's charter implications. Does that expanded agenda match what you want the adjacent chat to work?

Ready to open the adjacent chat on your say-so, with whatever agenda shape you confirm.

---

**Marc** (2026-08-30 22:42):

I would rather, "value created by residents for residents and their neighbors" allowing neighbors to be defined by the value creators. AND I think that we don't need the adjacent chat as we have actually "solved" it. SO.... how should we proceed. I do not what to lose what we have developed here together--our new shared understanding, apart form the document we produce for WWAH. How can we do both?

---

**Claude** (2026-08-30 22:43):

"Value created by residents for residents and their neighbors" registered, and the neighbor-defined-by-the-value-creator clause is the important part — it keeps who counts as a neighbor inside the value chain, not imposed from outside. That's the fourth front-matter statement in its right form.

On not losing what we've built: the concern is real and worth solving deliberately, because what we've developed here is different in kind from the WWHA-facing kit. The kit will be a facilitator's guide — usable, portable, adaptable, meant to be handed to Carl, Chris, Jerry, and Brent. The shared understanding underneath it is the design reasoning, the corrections you made to my framings, the McKnight-through-Rendanheyi resolution, the compensation logic, the founded-commons pattern, the four dependency-elimination principles as they arrived. That reasoning belongs somewhere durable and separable from the kit, because it's the substrate the kit rests on and future work will need to reach back into.

Two artifacts, one process. That handles it cleanly.

**Artifact one: the design-reasoning record.** A durable capture of what we worked through in this conversation — the framings tried and corrected, the principles as they arrived and why, the substrate documents that shaped each move, the questions still open. Not a transcript. A synthesis in your own materials' voice, organized so future-you and future-Kerry can pick it up cold and see the reasoning, not just the conclusions. This is what makes the shared understanding portable across time and across other RCN work streams. It also becomes the reference for anyone else who joins the work later — Kerry, Ward, the four convenors themselves if they want to see the reasoning behind what they're being handed.

**Artifact two: the WWHA-facing kit.** The facilitator's guide itself, in the form the four convenors will actually use. Written for their use, not for internal RCN reasoning. Portable to FedWiki plus Neo4j as we discussed. Small enough to actually run, adaptable to each neighborhood, gardening-shaped.

The two are related but distinct. The kit is what gets handed out; the design record is what stays home. They cross-reference where useful — the kit's front matter can point to the design record for anyone who wants the deeper reasoning; the design record can point to the kit as the operational expression of the reasoning.

On sequence, the design record should be drafted first, or at minimum drafted alongside. If I draft the kit first and the design record second, I'll compress out the reasoning by the time I get there. If I draft the design record first, the kit will land more precisely because the reasoning is fresh and organized. My inclination is: draft the design record first, then the kit against it, with the kit citing the record where useful.

On location, the design record probably lives in FedWiki alongside the kit, in its own space or as a set of pages. It could also live in your memory-store, which would make it accessible to me across future conversations and would keep it live as we do further work — this is genuinely the substrate the RCN work will draw on repeatedly, and having it in memory means it informs future exchanges without needing to be re-established each time.

Actually, both. The FedWiki version is the shareable public-facing record for RCN participants. The memory-store version is the working substrate that keeps our future conversations grounded in what we've worked out together. Neither substitutes for the other.

Three questions before I proceed.

Do you want me to draft the design record first, then the kit — sequential, cleaner reasoning — or draft the kit first and pull the design record from it — faster to the WWHA-facing artifact, more compression risk on the reasoning?

For the memory-store version of the design record, do you want it filed as a single dense area file, or decomposed across several files that align with the principles and topics (dependency-elimination principles, founded-commons pattern, Industry Platform compensation logic, McKnight-through-Rendanheyi, and so on)? The second is more findable long-term; the first keeps the reasoning integrated.

And for FedWiki, do you want the design record and the kit in the same space (with clear separation), or in separate spaces that reference each other? Same space is easier to navigate as a whole; separate spaces respect the different audiences.

Ready to proceed on your call.

---

**Marc** (2026-08-30 22:51):

Draft the design record first. Claude Code has learned how to write into FedWiki with internal hyperlinks. You have done some of that. That would be my preferred document for the design record. You may want to do your usual .md and then decompose/recompose into page JSONs. That way I can edit expand and represent to you as we go. And I certainly want all the major prior approaches and artifacts referenced. Also at lease consider using the current version of RCN Graph tool to crate diagrams for the document. HOPEFULLY this approach is aligned with the second more findable long-term approach. If not say so. I will create a fedwiki site exclusively for this content and we can put both there to internal hyper links can be used without jumping browser tabs or document types.

---

**Claude** (2026-08-30 22:52):

Yes, aligned. Let me pull the two strands apart cleanly so we agree on what's happening in which channel.

**Memory-store.** Multi-file decomposition, as I flagged earlier. Files organized by concept and cross-linked with [[wikilinks]] to each other. This is my persistent working substrate — what future-me reads at the start of every RCN conversation to stay grounded in what we've built. It stays alongside your existing area and topic files rather than replacing them. Kerry-review-and-sign-off doesn't apply here; it's my ground.

**FedWiki site.** The shareable design record and the kit both live there, with FedWiki's native internal-link mechanism. This is what Kerry sees, what the four convenors can read, what future RCN participants can pick up. Same content as the memory-store decomposition in terms of reasoning, different form (FedWiki JSON pages rather than markdown files, presentation-quality rather than working-substrate).

The workflow that respects both:

Draft the design record in chat as portable markdown, decomposed into the section structure that will become both the memory-store files and the FedWiki pages. You edit and iterate on the markdown here — that's the collaboration surface. Once a section stabilizes, two things happen: the memory-store gets the durable version (I handle that here), and the FedWiki version gets rendered from the markdown into page JSONs with proper internal links and Graph Tool diagrams where they help. The FedWiki rendering is Claude Code work, running against your ~/rcn setup and the new FedWiki site you'll stand up.

RCN Graph Tool for diagrams — yes, definitely. Several places in what we've worked would benefit: the four dependency-elimination principles as a connected structure, the VSM recursion with S4 at neighborhood scale and the granting-arm-as-Industry-Platform mapped in, the value-chain instrumentation showing how compensation flows from residents through MEs through the Platform, the five-phase Linkage Mapping flow with moods and speech acts as a cross-cutting layer, and the relationship among founded commons, elder succession, and Industry Platform. Graph Tool renders these as first-class artifacts that the design record can reference and the kit can adapt.

References to prior approaches and artifacts — yes, throughout. CMG's 2016 prospectus, the Medford Confluence and Jira architecture, the seven work streams, the Spokane linkage maps as the between-institution project shape, the ontological/speech-acts substrate in your 2014 material, the José Pérez Ríos recursion diagram, McKnight's Careless Society, Vester's biocybernetic frame, Ostrom's polycentricity, Beer's VSM, Ackoff's Idealized Design, Rendanheyi and the Industry Platform, Flores on speech acts, Meadows on leverage points, your CAM for Rasch-measured scorecards, and the RCN work streams that touch this (Overall Schema, SODOTO, CfA-dSC, Graph Tool, FedWiki). The design record situates the kit inside your thirty-year arc, not as if it emerged from nothing.

Structural draft of the design record's sections, for your reaction before I write:

1. Origin and purpose — what this is, what it is not, who it is for, what problem it addresses
2. The four dependency-elimination principles as they arrived, with reasoning
3. The VSM-plus-Idealized-Design frame at neighborhood scale, with the S4 activation logic
4. The founded-commons concept — origin, function, succession, biological rather than mechanical replacement
5. The Industry Platform pattern — Rendanheyi via WWHA, compensation structure, balanced scorecard as neighborhood-authored instrument
6. Moods and speech acts as the working layer, progressive disclosure across all phases
7. The five-phase Linkage Mapping structure, adapted from CMG's 2014 playbook
8. The between-institution project shape — schema, the school worked example (#7 Refugee Transition), the polycentric structure visible in the linkage
9. The catalytic-seed capital principle — money as launch, not operations
10. Value definition — "value created by residents for residents and their neighbors" with the neighbor-defined-by-the-value-creator clause
11. The prior-work substrate — CMG, Medford, Spokane, the 2014 architecture, and what carries forward versus what stays behind
12. Open questions and RCN grappling — founded-commons succession, Industry Platform scaling, cross-neighborhood pattern replication

The kit itself is a subsequent artifact drafted against this design record — the facilitator's guide with the phases, prompts, worked example, and templates, referring back to the design record for reasoning.

Routing for next steps:

Chat now: I draft the design record's sections here as portable markdown. You edit, correct, expand, react. We iterate until sections stabilize.

Memory here as we go: as sections stabilize, I write the decomposed durable versions into the memory-store, cross-linked to your existing area files.

Claude Code later: once markdown has stabilized in chat and been reflected in memory, we switch to Claude Code for FedWiki JSON rendering with internal links and Graph Tool diagrams, and for any Overall Schema updates the design record implies.

Two questions before I start drafting section 1.

Is the twelve-section structure roughly right, or does it need reshaping before I write? I'd rather adjust the skeleton now than restructure after drafting.

For sections that would benefit from a Graph Tool diagram, do you want me to describe the diagram in the markdown (so we know what will be rendered in Claude Code later), or leave diagram placement to the FedWiki rendering step? My inclination is describe in markdown — it forces us to know what the diagram must show before Claude Code has to make it.

Ready to draft section 1 on your say-so.

---

**Marc** (2026-08-30 22:59):

We can try your suggestion with your .md first if necessary. But I do not like woking in .md. I prefer to work in Fedwiki page json type "markdown" paragraphs. But that said I need you to be able to do your best so I can do whatever you need. RE Graph Tool diagrams: describe in markdown. Clarify as needed or draft section.

---

**Claude** (2026-08-30 22:59):

Preference registered. Working in FedWiki markdown paragraphs is more natural for you, and portable markdown files are more natural for me to iterate on and to write into memory. The workflow that respects both: I draft in .md here, we iterate, and each stabilized section gets rendered into FedWiki page JSON (markdown-type items only, per your standing preference) as we go rather than at the end. That way you're reading and editing in FedWiki form for most of the work, and the .md is just my drafting substrate.

The Claude Code switch for FedWiki JSON rendering can happen per-section rather than only at the end. Once section 1 is drafted here and you've reacted, I can hand it to Claude Code to render as a FedWiki page you can then edit natively. Same for each subsequent section. That gets you into your preferred environment quickly and keeps me in mine.

One clarification before I draft section 1.

The design record is about the design reasoning — the why behind the kit, the substrate the kit rests on, the corrections and refinements we made together. Section 1 (Origin and purpose) is the entry point. It should answer: what is this document, what is the kit it supports, who is each for, what problem does the whole thing address, and what is it explicitly not.

My inclination for section 1's shape:

Open with the situation — thirty years of working between institutions, the Medford and Spokane experience of producing real between-institution projects that couldn't sustain without your team the following year, the diagnosis that facilitator dependency and philanthropic-industrial capture are the pattern-corrupters. Name the current opening — RCN, WWHA in design, the four convenors in place, and the substrate work (SODOTO, CfA-dSC, Overall Schema, Graph Tool, FedWiki, CAM) far enough along to support what wasn't possible in 2014.

Then name what the design record is: the reasoning substrate for a facilitator kit that helps a neighborhood run an Idealized Design cycle at neighborhood scale, produce between-institution projects, and do so in a form that structurally resists both facilitator-dependency and philanthropic-industrial capture. And what the kit is: the operational expression of that reasoning, in a form Carl, Chris, Jerry, and Brent can pick up and use in their own neighborhoods.

Then name what it is not — not a program, not a curriculum, not a service-delivery framework, not a template for standing up a new nonprofit sector. And name who it is for — the four convenors first, then whoever they hand it to as new convenors emerge, always people already recognized as elders in their neighborhoods doing giving-back work.

Close with the design record's own structure — the twelve sections and how they fit together, with a note that both the design record and the kit are living documents meant to be gardened.

Length target for section 1: probably 800-1200 words of markdown, dense but readable. Long enough to actually establish the frame; short enough that the reader gets to section 2 in one sitting.

One question of substance before I write, because it will shape section 1's tone throughout.

The design record has two audiences. First audience: you, Kerry, and the four convenors — people who already know the substrate and need the reasoning organized. Second audience: someone joining RCN later, or Ward, or a future funder curious about what WWHA is actually doing, or a Rendanheyi practitioner asking whether this is a real application of the pattern. The two audiences want the same content, but the first can be addressed with more familiar shorthand and the second needs more scaffolding.

My inclination is to write for the second audience — the newcomer or the curious outsider — because the first audience will read it easily either way, but the second audience is who the design record has to serve if it's going to travel. Writing for the newcomer forces the reasoning to be complete rather than compressed. And it means the design record can be handed to someone without preamble, which matters when Kerry or you want to bring a new person into the work.

Is that the right call, or would you rather I write primarily for you-Kerry-convenors and let the outsider figure it out?

On your answer, I draft section 1.

---

**Marc** (2026-08-30 23:01):

write for the second audience

---

**Claude** (2026-08-30 23:02):

Drafting section 1 now.

---

# Section 1 — Origin and Purpose

## What this document is

This is the design record for a facilitator kit that helps a neighborhood run an Idealized Design cycle at neighborhood scale, produce projects that improve how existing institutions and small groups work together for the neighborhood's residents, and do so in a form that structurally resists two failure patterns that reliably corrupt this kind of work.

The kit itself is a separate artifact, drafted against this record. This document holds the reasoning: why the kit is shaped as it is, what substrate it rests on, what patterns it exists to interrupt, what corrections its design absorbed as it took form. A reader who wants only the operational method should read the kit. A reader who wants to understand why the kit is that way, or who is joining the work and needs the substrate that made the kit possible, should read this record.

Both documents are meant to be gardened rather than followed. Neighborhoods vary; the four convenors currently in position each operate in materially different contexts; the substrate technologies (SODOTO, CfA-dSC, Overall Schema, Graph Tool, FedWiki, CAM) are themselves in ongoing development. The design record will change as the work teaches us more. That is a feature.

## What the kit exists to do

A neighborhood that is functioning at all already has small groups getting things done outside of business and government — usually with business owners and government officials appearing in peripheral roles, which is a sign of health rather than of institutional capture. The kit exists to help such neighborhoods:

Convene those small groups into visible relationship with each other and with a granting arm capable of supporting their work

Construct a shared picture of how the neighborhood's institutions and groups currently interact around the residents' lives

Design what the neighborhood would want if it were unconstrained by history — Ackoff's Idealized Design, adapted to neighborhood scale — bounded only by currently feasible technology and operational possibility

Select projects, using a weighted-selection method that distributes decision-making across the participants rather than concentrating it in a facilitator or a small circle

Charter those projects with commitments made as explicit speech acts, with catalytic seed capital from the granting arm

Execute the projects, retrospect on what happened, and either replicate the cycle for a new round of projects or set the work free once the neighborhood no longer needs the kit's structure

The kit's phases descend from a five-phase Linkage Mapping playbook that was designed for county-scale Accountable Community of Health work in Jackson County, Oregon in 2014-2016. That county-scale work produced real between-institution projects. It also demonstrated that when the facilitation depended on a paid external team, the neighborhood couldn't sustain the practice after the team's engagement ended. The kit is the neighborhood-scale adaptation of that playbook, with structural changes intended to prevent that failure from repeating.

## The two failure patterns the kit resists

The first pattern is facilitator dependency. In Medford and Spokane, a skilled external team ran the process and produced concrete between-institution projects with measurable win-win-win outcomes. The next year, without the external team, the local organizations could not do it themselves. This was not for lack of intelligence, will, or skill on the local side. It was because the requisite variety needed to see between-organization opportunities is exactly what organizations don't have about themselves — and the external team was carrying that variety. The kit's design constraint is not "replace the facilitator" but the sharper form: reduce the requisite facilitator variety to a level distributable across the neighborhood, permanently. The tools themselves must do what the facilitators did. That is a demanding constraint and it shapes many of the kit's specific choices.

The second pattern is what John McKnight named as the counterfeit of community — the philanthropic-industrial replacement of associational gift with professional service. A paid program officer whose salary flows from a foundation regardless of whether the funded work creates value for residents will, over time and regardless of individual intention, produce work shaped for the funder's satisfaction rather than for the residents' benefit. Technical assistance dumped on a neighborhood's lawn regardless of whether the neighborhood asked for it, and regardless of whether it produces value the neighborhood recognizes, is the mechanism. The kit's design constraint here is not "make it all volunteer" — a purity that ignores that people doing real work deserve real compensation. It is that compensation for the facilitation and granting roles must flow from value created by residents for residents and their neighbors, measured against instruments the neighborhood itself constructs, rather than from any outsider's assessment.

Haier's Rendanheyi provides the working model: an Industry Platform whose operators are compensated as a downstream function of the microenterprises they seed and support, with compensation flowing from the users of what those microenterprises create. WWHA's granting arm is being designed as a neighborhood-catalyzing Industry Platform in this pattern. The four convenors — Carl in East County (WA), Chris in Superior (AZ) at The Fledge, Jerry in Lansing (MI) at Leo's, and Brent in SW Lansing — operate or will operate as Industry Platform actors at neighborhood-cluster scale. Their compensation flows through the value chain from the microenterprises and small groups they seed, whose value creation is recognized by residents and the residents' neighbors (with "neighbors" defined by the value creators themselves, not imposed from outside).

## Who this is for

The primary users of the kit are Carl, Chris, Jerry, and Brent, and any convenors who follow them as new neighborhoods engage with the work. Each of them already occupies the convener position in their neighborhood-adjacent context. Each is doing something recognizable as elder-giving-back work, with real portfolios of what they have already accomplished. Each has, or is adjacent to, a founded commons — a space created by and for the community for collaborative work, safe and culturally appropriate, that the neighborhood recognizes as its own. The kit does not create convenors; it equips convenors who already exist.

The secondary users are WWHA's designers (yourself, Kerry Turner, and collaborators) shaping the granting arm and its Industry Platform function; Ward Cunningham and the FedWiki community as the substrate for the kit's delivery medium; and future convenors who take up the kit in neighborhoods that grow into readiness over time.

The reader of this design record, specifically, may be any of the above, or someone new to the work asking whether this is worth taking seriously. The record is written for that last case — the newcomer who needs the reasoning complete rather than compressed. Readers who already know the substrate can skim.

## What this is not

The kit is not a program to be adopted, a curriculum to be delivered, a service to be rendered, or a template for standing up a new nonprofit sector. It is not a replacement for existing community organizations, though it may catalyze new relationships among them. It is not a route to grant funding for existing operating budgets — its funding logic is catalytic seed capital for new work, not subsidy for existing work. It is not an evaluation framework operated by outsiders on the neighborhood's behalf. It is not compatible with paid facilitator or paid program-officer roles whose compensation is independent of resident-recognized value.

Neighborhoods that cannot sustain the kit under these constraints are neighborhoods the kit is not for. This is a hard filter, not a nice-to-have. A neighborhood without a founded commons, or without small groups already getting things done, or without elders willing to take up the convener role, is telling the kit something. The right response is to not proceed, not to force-fit.

## How this design record is organized

The remaining eleven sections work through the design in the order the reasoning arrived rather than in strict logical dependency, because the reasoning arrived by iteration and correction and the design record honors that history. Section 2 lays out the four dependency-elimination principles. Section 3 describes the VSM-plus-Idealized-Design frame at neighborhood scale. Section 4 develops the founded-commons concept and its succession logic. Section 5 works through the Industry Platform pattern and the neighborhood-authored balanced scorecard. Section 6 places moods and speech acts as the working layer running through all phases. Section 7 presents the five-phase Linkage Mapping structure as adapted from the 2014 playbook. Section 8 describes the between-institution project shape with the school worked example. Section 9 develops the catalytic seed capital principle. Section 10 defines value in the form settled through the design work. Section 11 references the prior-work substrate — CMG, Medford, Spokane, and the thirty-year arc of related work. Section 12 names the questions still open, including the ones RCN is grappling with, so the reader knows what is settled and what is not.

Cross-references among sections use FedWiki internal links where the design record is rendered as a FedWiki site. Where diagrams help — and several sections have them — the diagrams are rendered from the RCN Graph Tool and described in text so a reader without access to the visual still has the structural claim.

---

That is section 1. Length ended up around 1350 words — a bit longer than my target, and I'd trim if you agree the frame is right. Two specific places I'd want your reaction:

The naming of the four convenors and their locations by name in section 1. I did it because it grounds the abstract in the concrete, but if you want the design record to be less person-specific at the top level, I can push those names to section 5 (Industry Platform) where they land in operational detail.

The framing of "elder-giving-back work" for the convenors. This is a phrase we developed together and it carries the McKnight logic well, but it may read as sentimentalizing to a Rendanheyi reader who is expecting compensated Industry Platform actors. The tension is real and I resolved it by naming both — elder-giving-back work, compensated through the value chain via the Industry Platform structure. That may be the right synthesis or may need refinement.

React, correct, or say go and I'll draft section 2.

---

**Marc** (2026-08-30 23:07):

Can you present this in an adjacent area of this screen so I can edit there?

---

**Claude** (2026-08-30 23:07):

Not in this chat surface. What you're describing is the artifact panel — a side-by-side editing area that appears with certain document types on claude.ai and in the desktop app. It renders for artifacts, and there's a version for Claude for Excel and Claude for Word documents in their respective surfaces.

For markdown drafting like this, the closest options I can offer from within chat:

I can render each section as a downloadable file you can open in whatever editor you prefer, then paste your edits back into chat and I'll take them from there. Not simultaneous editing, but round-trippable.

If you have Claude Desktop, it can open documents alongside the chat in ways this web surface doesn't, and Claude Code can work directly on files in your filesystem while we discuss changes here. Either would give you a real editing surface next to the conversation.

The cleanest path given your preference for FedWiki markdown paragraphs is probably to render section 1 into FedWiki page JSON now and put it on the new FedWiki site you'll stand up for this work. You'd then edit natively in FedWiki, and paste your revisions or the page URL back here for the next round. That matches how you want to work with the rest of the sections anyway, so we'd just start that pattern from section 1.

Want me to render section 1 as FedWiki page JSON now? If so, I need one thing from you — the site URL or slug where the page will live, so the internal links from later sections can resolve correctly. If the site isn't stood up yet, I can produce the JSON with placeholder link targets that get filled in once the site exists.

Or if you'd rather I produce a downloadable .md file for now while you set up the FedWiki site, say so.

---

**Marc** (2026-08-31 00:12):

I am editing the .md file no problem. In the mean time if you can, research RenDanHeYi "customer scenario" the initiating concept and document upon which any ME comes into existence conceptually and actually. It is the customer scenario that is shopped withing Hair Group using the Workbench platform. IT IS THE ORIGIN. Almost no one I know outside of Haier does this. It is more and less than a "business plan". Please see what you can find so we can wrap it in.

---

**Claude** (2026-08-31 00:14):

_[tool call: web_search]_

_[tool result]_

_[tool call: web_fetch]_

_[tool result]_

_[tool call: web_search]_

_[tool result]_

_[tool call: web_search]_

_[tool result]_

_[tool call: web_search]_

_[tool result]_

_[tool call: web_search]_

_[tool result]_

_[tool call: web_fetch]_

_[tool result]_

Research done. The mechanism is more distinctive than I'd realized, and it changes the design record's flow substantially.

The customer scenario at Haier is an articulation of a compound unmet user need in end-to-end user-experience form. "Smart Kitchen" not "smart refrigerator." "Clothing Care" not "washing machine." "Peking Duck at home as though eating at a five-star gourmet restaurant" not "food delivery service." The scenario names the whole context the user is living in — the sliver one product would address is too small a unit for it.

Three things distinguish it from a business plan.

Its origin is zero-distance with users. Someone close enough to see the whole user context articulates it in the users' own terms. Not strategy from the top.

Its scope is compound. A single provider usually cannot satisfy an end-to-end scenario. The scenario is written large on purpose, precisely because tackling compound problems generates more value than tackling atomic ones, and because a compound problem invites the ecosystem community — the EMC — to form around it. The scenario is the invitation.

Its lifecycle is durable. Scenarios live on an internal platform Haier maintains. Anyone can browse scenarios, propose to form an ME around one, negotiate with an EMC owner and the other MEs needed to build the value chain, and put a smart contract in place. When an ME fails, the scenario doesn't die — it returns to the platform, enriched by what didn't work, available for the next team to grab. William Malek's phrase is "you can go grab the scenario" and start again, with turnaround of two to three days in China's Haier operations.

That is the shopping mechanism you named. It is how new work originates in Rendanheyi. Almost no one outside Haier does this, and its absence is why programs come and go — projects die and the scenarios die with them, so every attempt at addressing a compound need starts from zero. The scenario as a persistent, forkable, learn-enriched object is the missing organ.

For the WWHA design and the neighborhood kit, the customer scenario as a distinct object changes the flow substantially.

The linkage mapping phases don't produce projects directly. They produce scenarios. Phase 2's first meeting surfaces compound unmet needs in end-to-end resident-experience form — something like "a refugee child arriving new at school in this neighborhood, needing what they need across school, family, health, cultural community, and neighborhood, across the first year." Phase 3's weighted selection is scenario selection — the group chooses which compound scenarios matter most. Phase 4 is where a self-organizing ME picks up a selected scenario, negotiates with WWHA's Industry Platform playing the EMC-owner role, forms the ecosystem community across the small groups and institutions the scenario needs, and puts contracts in place through CfA-dSC. Phase 5 executes and retrospects, with the scenario continuing to live in the repository whether the specific ME succeeds or not.

This gives every piece of the RCN stack a specific job. FedWiki holds the scenario repository — one page per scenario, forkable across neighborhoods, enriched by every attempt. CfA-dSC instruments the Leading Targets, Value Added Mechanism, and value-chain settlement that make an ME's ecosystem community operational. SODOTO portfolios credit scenario originators (the person who saw the compound need first and articulated it), ME participants (their attempts, successes, and learnings from failure), and EMC-owner-role convenors (Carl, Chris, Jerry, Brent). The Overall Schema adds Scenario as a node type distinct from Project, with an Originator, a Compound Need, an End-to-End Description, a set of Attempted-By MEs with outcomes, and a Location that can be neighborhood-specific or cross-neighborhood. Graph Tool renders the scenario-to-ME-to-EMC structure for a given scenario as a first-class visualization. WWHA's Industry Platform makes markets in scenarios — funding is one function; the platform is also where scenarios come to be seen, where MEs come to grab them, where EMC formation is supported, where compensation flows once value arrives back at residents.

This also answers the catalytic-seed-capital question operationally. The seed goes to an ME that has grabbed a scenario and formed an EMC around it. If the ME succeeds, the value chain settles and compensation flows through the VAM to the ME, the EMC members, and the platform actors. If the ME fails, the scenario returns to the repository enriched, the seed capital is written off as the cost of experimentation, and the learning is recorded. That is what "seed capital catalyzes new work" looks like operationally at Haier scale, and it maps cleanly to neighborhood scale.

And it locks in your "value created by residents for residents and their neighbors" definition to a specific object. The scenario articulates what value would mean, in the residents' own terms, before any project starts. The scorecard for a scenario is authored by whoever articulates it and refined by the neighborhood as MEs attempt it. Compensation flows only when value defined by residents shows up. The scenario is the anchor for the whole compensation logic.

Gaps in what I found publicly: the specific template or form for a customer scenario document is not published in detail. Malek describes the mechanism but not the document format. The books — Startup Factory by Minaar, Moree, and van der Lecq, and Zero Distance by Danah Zohar — probably contain more detail on the document form itself, and they're the natural next step if you want a template to adapt. If you have either, or want me to look at excerpts, I can go deeper.

Two questions before we return to the design record.

Does the customer scenario become a top-level section in the design record, or does it live inside the Phase 2 through Phase 4 discussion in the Linkage Mapping section? My instinct is top-level — a new Section 5, between the VSM frame and the Industry Platform section — because it's the object that ties everything else together and it needs its own name before the phases and the platform can be described accurately. The existing sections shift by one.

And do you have Startup Factory or Zero Distance? The mechanism is clear enough from what I found, but the document form itself and the criteria for a well-formed scenario are the parts I couldn't confirm publicly.

---

**Marc** (2026-08-31 00:25):

Re "books — Startup Factory by Minaar, Moree, and van der Lecq, and Zero Distance by Danah Zohar — probably contain more detail on the document form itself, and they're the natural next step if you want a template to adapt. If you have either, or want me to look at excerpts, I can go deeper." Go deeper. RE "Does the customer scenario become a top-level section" top-level — a new Section 5

---

**Claude** (2026-08-31 00:25):

I'll dig into both books.

_[tool call: web_search]_

_[tool result]_

---

**Marc** (2026-08-31 02:45):

Feel free to do look into the books. AND Let's be sure to integrate the eVSM survey into the work. Any neighborhood or any social entity can be "surveyed" to gain from the perspectives of the respondents. This is a quick way to begin to get the whole from the part and the whole into the parts--the essence of democratic problem solving. Now we have an open source tool that anyone can use. And Claude can help with the interpretation and integration of the "evidence" and "suggestions".

---

**Claude** (2026-08-31 02:47):

_[tool call: memory_read]_

_[tool result]_

Registered on e-VSM — I'll integrate it after the book work. Continuing the research.

_[tool call: web_search]_

_[tool result]_

_[tool call: web_fetch]_

_[tool result]_

_[tool call: web_fetch]_

_[tool result]_

_[tool call: web_search]_

_[tool result]_

_[tool call: web_fetch]_

_[tool result]_

Read both Zohar chapters — implementation of Quantum Management (Ch 5) and Haier: A Maker's Culture (Ch 16) — end to end. Startup Factory is paywalled and my public-source options are more limited there. Here's what Zohar adds that materially updates the frame.

**Scenarios are total solutions for whole-life situations, not compound needs alone.** This is a subtler distinction than I'd carried. A compound need is a list of unmet needs. A scenario is the user's whole life-context inside which those needs arise. Haier's "balcony scenario" isn't washing-machine-plus-sofa-plus-sound-system — it's the way users actually live on their balconies as a whole. The scenario captures the situated life; the compound needs and the ME solutions are what the scenario invites. For neighborhood scale, this means a "school refugee transition scenario" isn't a service list — it's the whole first-year experience of a refugee family with a school-age child, mapped as they actually live it. Scenario captures life; solutions come after.

**Two-part scenario mechanism: Experience EMCs and Solution EMCs.** I hadn't seen this split. Experience EMCs stay zero-distance with users, surface scenarios, and hear pain points and desires. Solution EMCs form to deliver against those scenarios — design, create, produce, transport. Distinct MEs, related through the scenario itself as durable object between them. For RCN this reshapes what MEs even are: some MEs will be scenario-articulators whose main work is being zero-distance with residents (community health workers, teachers, chaplains, librarians, food bank volunteers, mutual-aid coordinators — people already there). Other MEs form as solution-deliverers, the between-institution project teams we've been discussing. The scenario is what ties them.

**Community Stores as neighborhood-scale interface.** This is the biggest unexpected finding. Haier operates a Community Store in every one of China's 650,000 villages. Each serves as a community center (with after-school childcare among other functions) and as a service platform for any citizen with an entrepreneurial idea — anyone can be an employee or designer, anyone can propose a new ME. The founded-commons concept we developed (Fledge, Leo's, whatever East County and SW Lansing turn out to be) IS the neighborhood-scale RCN analog to Haier's Community Store. Not something we're inventing — the pattern is already operational at Haier scale, and RCN's version is the same pattern at neighborhood scale. Confirmation the pattern is real.

**Small data, not just big data.** Haier's COSMOPlat platform is designed to know WHY and HOW users engage with what they use, in their own experience — not merely what they buy. Zhang: "We want to free our users from the tyranny of mass production." This aligns exactly with e-VSM's role at neighborhood scale.

**City not company, on West's Scale logic.** Companies grow sublinearly and eventually die. Cities grow superlinearly and don't. Zohar's argument is that Haier structured itself deliberately to be city-like — sustainable, superlinear, generating new "species" (MEs) continuously. Same logic applies to WWHA and RCN: structured as city, not as company, with all that implies for succession, generativity, and the raise-your-kids-and-set-them-free principle. Zhang's own metaphor is tropical rainforest — "every day some organisms are born and some die; the point is that the ecosystem facilitates the generation of new species." Direct connect to Vester's biological systems and to your "biology, sociology, anthropology" answer earlier on how new founded commons follow old ones.

Now e-VSM integration.

e-VSM is exactly the small-data instrument RCN needs to complement scenario articulation. Not behavioral data harvested from users — structured perspectives from respondents on spheres and their relationships, aggregated with Claude API synthesis, exposed via the FedWiki aggregator plugin. That fits several points in the kit's cycle.

Pre-Phase 1: an e-VSM survey of the neighborhood (or of a potentially-emerging neighborhood) surfaces whether the substrate is present — small groups getting things done, founded commons, cross-sphere relationships. Not a checklist assessment; a multi-perspective read that reveals what's already happening without the convener having to guess.

Phase 2 preparation: participants surveyed before the linkage-mapping meeting so the room has multiple perspectives on the table before the loudest voice sets the frame. This addresses the reliably-encountered problem that whoever speaks first in these meetings shapes what gets seen. Multiple perspectives already visible in the room.

Scenario validation: once an Experience-EMC-analog has articulated a scenario, e-VSM can survey the broader neighborhood to check whether the scenario is real, whose experience it reflects, what it misses. Validation before Solution-EMC formation and before catalytic capital deploys.

Phase 5 retrospective: e-VSM surveys how the ME's work has landed across the neighborhood's spheres. The scorecard we discussed is partly the survey — respondents recognize (or don't) that value has been created for residents in the terms residents themselves articulated.

Claude's role in this: interpretation and integration of the survey's evidence and suggestions, per your standing e-VSM design. Which makes Claude an ongoing operational participant in the kit rather than only a co-drafter. Worth naming that plainly in Section 5 (customer scenarios) and Section 8 (the between-institution project shape) — Claude appears at the phase transitions, helping the convener and the MEs read what the survey is showing.

This also puts the design record's structure on firmer ground. The proposed Section 5 (customer scenarios) now needs to hold the Experience/Solution split, the total-solution framing, and the connection to e-VSM. The subsequent sections shift as we discussed — Industry Platform becomes Section 6, moods/speech acts becomes Section 7, and so on.

Two things before I write Section 2.

On the book side: Startup Factory would give the ME-formation and EMC-contract mechanics in more detail than what I've gathered from Zohar and the Medium/podcast material. It's paywalled, and my public-source options are near exhausted. Options are (a) proceed to Section 2 with what I have — the mechanism is clear enough to write accurately, template-level detail can be firmed later if needed; (b) I keep looking for excerpts or reviews that might yield more; (c) you have access to it and can share excerpts of the ME/EMC-formation chapters. Which of the three?

And Section 2 was originally "the four dependency-elimination principles." Given how much we've refined since, do you want Section 2 to hold the four principles as they now stand (facilitator-variety-distribution, elder-driven volunteer-shaped Industry Platform actors, catalytic seed capital that departs, value-created-by-residents-for-residents-and-their-neighbors), or does one of the newer threads (the founded commons / Community Store parallel, the e-VSM integration, the Experience/Solution EMC split) claim Section 2 instead? My inclination is the four principles stay in Section 2 — they're the load-bearing architecture and the newer material rests on them. But your call.

Ready to draft on your answers.

---

**Marc** (2026-08-31 04:49):

I have the Startup Factory on Kindle and have read it. I can open it in browser and you can take a look. Or you can pose questions for me to go searching for answers. Keep in mind that I have dyslexia and am the slowest reader I have ever met. I am ok with your suggestions and preferences. re the draft.

---

**Claude** (2026-08-31 04:50):

Pose questions is the better path. Reading through the book on your behalf is exactly the wrong use of your time — you'd be doing the slow work while I do the fast work, backwards. If I ask targeted questions, you can search for specific answers using the Kindle search function or by knowing where the material lives from your prior reading. That way each of us does what we're fastest at.

Six questions, in decreasing order of importance for the design record. Answer whichever you can find quickly; skip any that would take real digging.

**1. The customer scenario document itself.** Does Startup Factory show or describe an actual scenario document — a template, a page, a screenshot, a worked example beyond "balcony scenario"? Specifically: what fields does a Haier scenario contain when it lives on the internal platform? Title, description, unmet needs list, target user, spheres of life it touches, existing attempts, invitation to form an EMC — something like that? If there's a visible artifact anywhere in the book, that's the single most valuable thing.

**2. Leading Targets.** The term appears in the Andreas Holmer summary as one of the EMC contract elements. What are Leading Targets in Haier's usage — how do they differ from ordinary goals, who sets them, how are they written, how do they relate to the scenario? The name suggests they lead the value chain toward user value, but I want the mechanic.

**3. Value Added Mechanism (VAM).** How is the value-added-sharing range determined before production starts? Who negotiates the lower and upper limits, on what basis, and how is the pie divided when the EMC succeeds? The mechanism of "predetermined agreements on the value and size of the individual contributions" is where compensation flow gets operational, and this is where the CfA-dSC work has to interface with Haier's actual pattern.

**4. Experience EMC to Solution EMC handoff.** Zohar named the two types but didn't show how they connect operationally. Does Startup Factory describe what happens when an Experience EMC surfaces a scenario and a Solution EMC forms around it — is there a formal handoff, does one Solution EMC form or several bid, does the Experience EMC continue to participate or step aside?

**5. Failure and scenario return.** Malek said scenarios return to the platform enriched when an ME fails, with two-to-three-day turnaround for someone new to grab it. Does Startup Factory describe what's actually captured when a scenario returns — a post-mortem attached, the previous team's notes, what was tried, what didn't work? The retrospective as an artifact matters for how portfolios accumulate in RCN's SODOTO analog.

**6. Community Stores.** Zohar's mention of the 650,000-village Community Stores was brief. Does Startup Factory say more about how they operate, who staffs them, whether they're themselves MEs or something else, and how the local entrepreneurial-idea-to-ME path actually works through them? This is the closest Haier parallel to the founded commons.

Anything you find on any of these — even a page reference or a phrase you remember — is useful. And if you'd rather I proceed to draft Section 2 while you search in parallel, that works too. I don't need all of these to write accurately; I have enough. What Startup Factory would add is precision on the artifacts and mechanisms, which shape the templates later more than the reasoning now.

---

**Marc** (2026-08-31 04:52):

You draft I look.

---

**Claude** (2026-08-31 04:54):

Drafting Section 2 now. Working from what we settled: the four dependency-elimination principles as the load-bearing architecture that everything else rests on.

---

# Section 2 — The Four Dependency-Elimination Principles

## Why these four, together

Every attempt to do the kind of work this design record supports fails in one of two ways. It fails because the outside facilitator team goes home and the local capacity to sustain the work goes with them. Or it fails because the funded work bends over time toward the funder's satisfaction rather than the residents' benefit, and by the time anyone notices the bending, the work has become one more instance of the pattern John McKnight named as the counterfeit of community.

The four principles below are the design's structural response to these failures. Each closes a door the failure walks through. Any three without the fourth leaves the door open. Together they define what makes this work sustainable — not through willpower, ascetic self-sacrifice, or heroic individual character, but through structure that makes the failure modes materially harder to enter.

The principles arrived in this order through the work of drafting the design. That order is preserved here because each builds on the ones before it. A reader who wants the shortest form: variety distributed, facilitation compensated only through downstream user value, capital catalytic and departing, value defined and recognized by those it serves.

## Principle One — Facilitator variety distributed, not replaced

The 2016 Cambridge Management Group prospectus for Jackson County, Oregon named the goal plainly: "with the goal of ensuring local competence and autonomy." The five-phase Linkage Mapping method CMG deployed produced real between-institution projects. And when CMG stepped away, the local participants could not sustain the practice.

This was not for lack of intelligence, will, or skill on the local side. It happened because the requisite variety needed to see between-organization opportunities is exactly what organizations don't have about themselves. Ashby's Law is not sentimental: to regulate a system, the regulator must match the system's variety. In the county-scale work, CMG was carrying that variety. When they left, no local participant had built the requisite variety to replace them, and the local participants collectively had not developed the shared practice for it either. The variety hadn't distributed. It had concentrated in the facilitators.

Naming this precisely matters. The design constraint here is not "replace the facilitator" — that framing implies a person or team can be swapped in for CMG. The correct framing is: reduce the requisite facilitator variety to a level distributable across the neighborhood, permanently. The tools themselves — the linkage-mapping method, the weighted-selection matrix, the moods and speech-acts vocabulary, the customer scenario as a durable object, the e-VSM survey, the CfA-dSC coordination instruments, the SODOTO portfolios, the Overall Schema graph — carry what a skilled external facilitator would carry, distributed across the substrate rather than concentrated in a person.

Some parts of this are further along than others. The linkage-mapping method exists in usable form; the weighted-selection matrix exists in the 2014 material; e-VSM is operational; SODOTO and CfA-dSC are in active development; the Overall Schema is stabilizing. The kit's convener does real work — but the work that in 2014 required a CMG-team member's judgment can, section by section as this work matures, be done by the neighborhood with tool support. The direction of travel is what matters. The convener's role should get smaller over time as the tools get better, not larger.

This principle also constrains what the kit can ask of its convener. If a task in the kit's phases can only be done by someone with the accumulated variety of a Marc-Pierson-equivalent, that task is a design failure and needs to be redesigned until the variety is distributable. Every phase's prompts, templates, and tools are held to this test.

## Principle Two — Elder-driven volunteer-shaped Industry Platform actors, compensated through the value chain

McKnight's *The Careless Society* names what happens when care becomes service. The associational gift — one neighbor to another, one small group to a community — gets replaced by a professional transaction, and the professional's compensation structure bends the work over time toward the professional's continued employment rather than toward the recipient's actual benefit. This happens through the incentive structure of paid work regardless of individual intention.

The straightforward reading of this — the reading that first suggested itself in the design work — was that facilitation and granting must be entirely volunteer. If money bends the work, remove the money. Elders give back; the granting arm is entirely volunteer-run; nobody in the facilitation or granting role earns anything for their contribution.

That reading is too fast, and it fails on its own terms. It assumes the only alternative to McKnight's counterfeit is ascetic self-sacrifice, and that assumption produces a design that cannot scale because it cannot compensate people doing real work for real time. It also confuses the surface (paid versus unpaid) with the structural (compensation independent of value delivered versus compensation structurally tied to value delivered).

Haier's Rendanheyi resolves this. In Rendanheyi, MEs earn only when users receive value; support enterprises earn only when the MEs they support succeed; and the Industry Platform function, which acts as an internal venture capital arm inside the company, is compensated as a downstream function of the MEs it seeds and the value those MEs deliver. Everyone gets paid. Nobody gets paid on a job description independent of what actually gets created for users.

That is what closes McKnight's door without requiring ascetic self-sacrifice. Compensation is not eliminated; it is structurally located downstream in the value chain, so the incentives of the compensated actors align with actual value creation rather than with continuation of the paying relationship.

WWHA's granting arm is being designed as a neighborhood-catalyzing Industry Platform in this pattern. The four convenors currently in position — Carl in East County (WA), Chris in Superior (AZ) at The Fledge, Jerry in Lansing (MI) at Leo's, and Brent in SW Lansing — operate or will operate as Industry Platform actors at neighborhood-cluster scale. Their compensation flows through the value chain: from the MEs they seed and support, whose value creation is recognized by residents and by those the residents count as neighbors. When residents recognize value received, the Platform actors get paid; when they don't, the Platform actors don't.

This principle keeps the elder-giving-back framing that fits how Carl, Chris, Jerry, and Brent describe their own work — while rejecting the ascetic implication that giving back requires financial self-sacrifice. Elders can be paid, and probably should be paid, provided the pay flows structurally from value received by those whose lives the work touches. This is McKnight's principle expressed through Rendanheyi's mechanism, not against it.

The instrumentation this requires — smart contracts that instrument the value chain, portfolio systems that make the causal chain from Platform contribution through ME work to resident value-received visible over time — is the CfA-dSC and SODOTO work in RCN's substrate. When those mature, the compensation structure becomes operational without depending on trust in individual judgment.

## Principle Three — Catalytic seed capital that departs

Money enters the work as catalytic seed capital that funds new work. It does not enter as ongoing operating subsidy that funds existing work indefinitely.

The distinction is not about amounts. Seed capital for launching a new between-institution project can be substantial. What makes it catalytic rather than operating is its shape: enough to enable the ME to try something it otherwise couldn't, not enough to become the ME's permanent budget, and structurally not set up to migrate into a permanent budget. If seed capital is still funding the same work in year three at similar or higher levels, either the ME failed to become self-sustaining or the work was never something that could self-sustain — it was a program the money was propping up, dressed as a launch.

This principle constrains what the granting arm evaluates when an ME requests funding. The question is not "is this a good project" but "is this catalyzable — will the seed do its work and then be able to step away." Answering that question well requires elders who have seen the pattern many times and can recognize the difference between a launch and a subsidy request. A paid program officer with quarterly deployment targets cannot reliably decline requests that don't meet this test; their job depends on deploying capital, and declining is professionally costly. An Industry Platform actor whose compensation is downstream of ME success has aligned incentives — they don't get paid for money deployed, only for value ultimately received by residents, which means seeding an ME that turns into a subsidy hole hurts their own compensation.

The principle also applies to the small groups and MEs themselves. Raise your kids and set them free. The MEs are not the granting arm's ongoing clients. They come into conversation, they receive what they need on request from the platform's menu of adjacencies (mentorship, SODOTO, Rendanheyi patterns, linkage-mapping, dSC contracting, facilitation help, and when relevant, seed capital), they do the work, they set themselves free. When they no longer need the granting arm, that is the point. The relationship continues as adjacency and possible future collaboration; the dependency does not.

And the principle applies to the kit itself. Convenors run neighborhoods through the phases and then step back. If the neighborhood cannot absorb the pattern and continue without the convener, the convener has made the classic error of raising kids who never left. If it can, the convener moves on to another neighborhood if there is one to serve, or rests, or takes up the elder-mentorship role for other convenors coming up. Release is built in at every scale.

## Principle Four — Value created by residents for residents and their neighbors, recognized by them, measured by their instruments

Value here means something specific. It is not value as assessed by a foundation's evaluation framework, a state agency's outcome metrics, an academic evaluator's methodology, or WWHA's board's judgment. It is value created by residents for residents and their neighbors — with "neighbors" defined by the value creators themselves, not imposed from outside — and recognized as such by them.

The instruments through which that value is seen are the neighborhood's own instruments. Balanced scorecards for what counts as value are neighborhood-constructed and neighborhood-maintained, adapted to the place, time, and culture of that neighborhood. WWHA's Industry Platform helps the neighborhood build a scorecard that will show its own value creation clearly — that is skilled work, and it's part of what the convener brings — but the platform does not hand the neighborhood a template. Different neighborhoods produce different scorecards. That is a feature.

Because the Industry Platform's own compensation depends on the neighborhood's scorecard, the Platform has strong incentive to help construct a scorecard that is real rather than one that flatters the Platform. Two-way discipline is built into the instrument itself.

Rasch measurement — the methodology behind RCN's Civic Activation Measure work — fits this design in a specific way. Rasch is built to hold latent constructs across contexts by calibrating items to a shared underlying dimension while allowing item content to vary. Neighborhood-authored scorecards need exactly this: dimensions that are comparable enough to be usable across neighborhoods, so the Platform can operate at cluster scale and MEs can be evaluated in comparable terms, while the specific items measuring those dimensions are neighborhood-authored. The e-VSM survey family provides the structured multi-perspective instrument through which neighborhoods can see themselves before and after ME work, with Claude API synthesis integrating the evidence and surfacing suggestions.

Outsiders — WWHA's board, funders, state agencies, evaluators — cannot originate the scorecard even when they contribute capital. They can decline to fund a neighborhood whose scorecard they don't believe in, and that is a legitimate use of their judgment. They cannot substitute their scorecard for the neighborhood's judgment of what has been received. This is a real governance constraint on WWHA itself, and it belongs in WWHA's charter as a founding limit.

The principle also has an anti-capture function. Grantmakers who dislike a neighborhood's scorecard have one legitimate response: decline to fund it. They do not get to negotiate the scorecard toward their own preferences as a condition of funding, because that negotiation would be exactly the capture pattern the design exists to prevent.

## How the four hold together

Each principle closes a specific door. Facilitator variety distributed prevents the dependency of the local on the external. Elder-driven Industry Platform compensation prevents the incentive-drift of paid facilitation toward client-production. Catalytic seed capital prevents the subsidy trap that turns launches into permanent operations. Neighborhood-authored value measurement prevents the capture of the work by outside definitions of success.

Any three without the fourth leaves a door open. Distributed variety plus elder-Platform plus catalytic capital, without neighborhood-authored value, means the metrics that determine whether the Platform actors get paid are set by someone other than the residents — and the work bends toward those metrics. Distributed variety plus catalytic capital plus neighborhood-authored value, without elder-Platform compensation, either produces ascetic volunteer facilitators (which cannot scale) or paid facilitators on a fixed job description (which reintroduces McKnight's counterfeit). All four together produce a pattern that is materially harder to corrupt because the failure modes require structural work to enter, not just individual bad judgment.

These principles are the foundation for everything that follows in this design record. Section 3 places them within the VSM-plus-Idealized-Design frame at neighborhood scale. Section 4 develops the founded-commons concept that these principles both require and support. Section 5 introduces the customer scenario as the durable object around which everything else moves. Sections 6 and 7 handle the Industry Platform pattern and the moods-and-speech-acts working layer. Sections 8 and 9 return to the operational method — the linkage-mapping phases and the between-institution project shape — with the four principles now doing the design work under them.

---

That is Section 2, coming in around 2000 words. Longer than Section 1 because these principles are the load-bearing architecture and each needed to be established with its full reasoning rather than compressed.

Three specific places worth your attention.

The naming of "elder-driven volunteer-shaped Industry Platform actors" in Principle Two's heading is awkward. It's trying to hold too much at once — the elder-giving-back framing that fits how Carl, Chris, Jerry, Brent describe themselves; the volunteer-shape that reflects the associational-gift spirit; and the Industry Platform structure that provides the compensation mechanism. If you have a cleaner phrase, I'd take it. Or we can leave it awkward until the four convenors give it a name from use.

The claim that these principles produce a pattern "materially harder to corrupt because the failure modes require structural work to enter" is strong and I want to make sure it's honest. It is not a claim that the pattern is uncorruptible — it is a claim that corruption requires more effort and more visible steps to enact than in the counterfeit-community pattern. Worth checking that framing lands right.

And the closing paragraph promises what Sections 3 through 9 will do. If we're re-sequencing (customer scenarios as Section 5 as we decided, and the newer material from Zohar reshaping subsequent sections), the closing needs to reflect the current section list. I wrote it against the working list from earlier in the conversation. Say if you want the section list restated cleanly before I move to Section 3.

React, correct, or say go and I'll draft Section 3.

---

**Marc** (2026-08-31 05:03):

Draft Section 3

---

**Claude** (2026-08-31 05:05):

Drafting Section 3.

---

# Section 3 — VSM at Neighborhood Scale, with Idealized Design as the S4 Activation

## Why the VSM belongs here

Every attempt to organize collective work at any scale runs up against the same set of functional requirements. Something has to do the actual work. Something has to coordinate the doers when they'd otherwise interfere with each other. Something has to keep the whole operation running day to day. Something has to look outward and forward to see what's coming and imagine what could be. And something has to hold the identity and purpose that makes any of this worth doing at all.

Stafford Beer named these five functions and worked out the relationships among them across four decades of consulting practice, publishing the mature form in *Brain of the Firm* (1972) and *The Heart of Enterprise* (1979). He called the whole a Viable System Model — viable because a system with these five functions properly related can survive and adapt in an environment that keeps changing, and any system missing one or more of them cannot. The VSM is descriptive of what viability requires, not prescriptive of any particular organizational form. Human bodies are viable systems. Cities are viable systems. Firms that survive are viable systems. Neighborhoods that survive are viable systems.

The five functions, in Beer's numbering:

- **System 1** — the operational units doing the actual work. Multiple S1s exist in any real system; each has its own local viability and its own bit of the environment to work with.
- **System 2** — coordination among the S1s. Handles the anti-oscillation problem: when two S1s would otherwise interfere with each other, S2 handles the resolution.
- **System 3** — day-to-day internal management. "Inside and now." Keeps operations running, resolves resource allocation, handles the ongoing stuff that S1 and S2 can't handle on their own.
- **System 3\*** — audit and monitoring. Sporadic direct look at what S1s are actually doing, providing S3 with information it wouldn't otherwise have.
- **System 4** — outside and future. Environmental scanning, strategic modeling, imagining what could be. This is the function most organizations do worst, because it produces nothing measurable in the short term.
- **System 5** — identity, purpose, policy. The meta-system. Holds "why we are together at all."

Beer's insight was that these functions are recursive: any S1 in a larger viable system is itself a viable system with its own five functions internally. A neighborhood is an S1 in a larger geographic-political container; it is also a viable system with its own S1s, S2, S3, S4, S5 inside it. José Pérez Ríos's diagrammatic work extends this to show that multiple recursion criteria can apply simultaneously — the same territory can be carved by geographic containment, sectoral function, or cultural affiliation, each producing a different recursion structure. This is Ostrom's polycentricity expressed as system structure.

For the design record, VSM does two things at once. It provides the frame for understanding what a neighborhood needs to have functioning to be viable. And it provides the frame for understanding what this design is intervening on specifically — because most neighborhoods that struggle are struggling with a specific VSM deficit that can be named.

## What a neighborhood as viable system looks like

A functioning neighborhood has all five VSM functions operating, often without anyone naming them that way.

Its **S1s** are the operational units doing the actual work of the neighborhood's life. Small groups getting things done outside business and government, as you named them earlier — with business owners and government officials appearing in peripheral roles. The volunteer fire department, the Baptist church's mutual aid group, the food bank's core volunteers, the after-school tutoring circle, the trail maintenance crew, the neighborhood watch, the informal childcare network that runs among a handful of families, the elders who quietly check on people who live alone. In a healthy neighborhood these S1s are numerous, overlapping, and known to each other.

Its **S2** is the coordination that keeps these S1s from oscillating against each other. Sometimes formal (a monthly neighborhood association meeting), often informal (the network of people who know who knows what and who can get a message to whom). The kitchen table where two people meet to work out how the food bank's Tuesday distribution and the church's Wednesday meal don't tread on each other. S2 is often invisible when it's working and painfully visible when it stops.

Its **S3** is the ongoing management of the neighborhood's daily life. In a neighborhood, S3 is distributed across many people carrying pieces of it — the person who tracks which houses have new residents, the person who knows when the sidewalk got fixed, the person who notices when a lamp is out, the person who keeps the list of who's homebound. Rarely a formal role at neighborhood scale; almost always a set of people doing S3 work as part of larger giving-back activity.

Its **S3\*** is whatever direct-look-at-what's-actually-happening exists in the neighborhood beyond the ongoing S3 stream. In healthy neighborhoods, this often looks like the elders who walk regularly and see everything, or the crisis response that happens when someone notices something is off. It gets more or less formal depending on scale and culture.

Its **S4** is the function most neighborhoods do worst — outside and future. The imagining of what the neighborhood could be if things were different. The scanning of what's coming (demographic change, economic pressure, environmental risk, cultural shift) that will require adaptation. S4 requires stepping out of the ongoing rush of S1-through-S3 to look at what isn't yet visible in daily operations, and it requires people who can hold both the outside-scan and the inside-vision at once. Almost every neighborhood is deficient in S4. Most neighborhoods that are struggling are struggling here first.

Its **S5** is the identity and purpose that makes the neighborhood something more than a set of overlapping addresses. In some neighborhoods S5 is carried by long-standing cultural or religious identity. In others by shared history — the neighborhood that formed around a particular immigration, a particular industry, a particular struggle. In others by ongoing conscious articulation — a neighborhood assembly or covenant that names why we are here together. Where S5 is thin or contested, S4 has nothing to design toward and the neighborhood is at risk of drifting into whatever external pressures shape it.

## The specific VSM deficit this design intervenes on

The kit does not attempt to install all five functions in a neighborhood. Neighborhoods that have S1s already functioning, some S2 in operation, distributed S3 more or less working, and some form of S5 present — these are neighborhoods the kit can serve. What the kit specifically supplies is S4 activation, plus the S3\* audit function that makes S4's work honest over time.

This is a narrow claim and worth stating precisely. If a neighborhood has no S1s — no small groups already getting things done — the kit is not for that neighborhood. If a neighborhood has no S5 — no identity or purpose beyond happening-to-share-geography — the kit cannot supply one, and the invitation-into-conversation Phase 1 opens will surface that absence. If a neighborhood has S1s, some S2 and S3, and enough S5 to make convening possible, but no functioning S4 — no capacity to imagine what could be and no scanning of what's coming — the kit's phases activate S4 through a specific pair of tools.

**Idealized Design activates S4's inside-and-desired function.** Russell Ackoff's method: design what the neighborhood would want if it could have it, bounded only by currently feasible technology and operational possibility. Ackoff's two constraints are exactly the discipline that keeps idealized design from becoming a wish list and exactly the door that lets the design be revised as feasibility changes. What the neighborhood wants is not a wish; it is an operationally-possible present that history has prevented. Naming it precisely is S4's core work.

**SWOT-type environmental scanning activates S4's outside-and-future function.** Strengths and weaknesses as they exist now in the neighborhood's operational reality; opportunities and threats as they are visible on the horizon. Coupled with Idealized Design, the pair gives S4 both hands — inside-and-desired plus outside-and-coming. Neither alone is sufficient. SWOT alone is reactive; the neighborhood sees what's coming but has no vision to steer toward. Idealized Design alone floats; the neighborhood knows what it wants but doesn't see what's actually going to hit it.

Together they let a neighborhood know what it wants to be and what is coming at it. That is the prerequisite for building rather than firefighting — and Marc's phrase, "so we are not just fighting fires but building something together," is exactly what S4 makes possible when it is functioning.

Beer's own view was that S4 uses whatever tools of anticipation fit the scale. At corporate or governmental scale, S4 tools include large-scale System Dynamics modeling of the kind ReThink Health developed and Marc originated the Ripple ReThink variant of for Whatcom County. At neighborhood scale, System Dynamics is oversized — the data requirements exceed what a neighborhood can produce, and the parameters that System Dynamics moves are the weakest leverage points anyway, per Meadows. Ripple ReThink remains available as a Marc-facilitated tool for higher-recursion questions when a neighborhood surfaces one that needs it. At neighborhood scale, Idealized Design plus SWOT-type scanning is enough for S4.

## The S3\* audit function and how it prevents S4 from becoming self-referential

An S4 that never gets checked against reality becomes fantasy. An S4 that gets checked only through S3's ongoing management gets folded back into current operational logic and loses its outside-and-future function. Beer's S3\* — sporadic direct look at S1 activity independent of the S3 management stream — is what keeps S4 honest.

At neighborhood scale, S3\* takes the form of retrospectives, portfolios, and structured multi-perspective survey. Phase 5 of the linkage-mapping cycle is explicitly a retrospective — how did the ME's work actually land, what did residents actually receive, what did the neighborhood's scorecard actually show. The SODOTO portfolio layer accumulates the traces of what people and MEs actually did across cycles. The e-VSM survey provides periodic multi-perspective read on how the neighborhood is seeing itself. Each of these is an S3\* instrument, providing S4 (and the Industry Platform actors who share compensation with the neighborhood's success) with information the ongoing operational stream would otherwise smooth over.

Without S3\*, S4's Idealized Design cycles would drift over time toward whatever the loudest voices in the convening room want, or whatever the convener's own preferences run to. With S3\*, the design remains honest to what is actually being received by residents — which is the value-definition principle from Section 2 made operational through instrumentation.

## The polycentric recursion — why this only works at multiple scales simultaneously

The José Pérez Ríos recursion structure shows that any viable system exists at multiple recursion levels simultaneously, with multiple recursion criteria carving the same territory differently. A neighborhood is an S1 in a higher-recursion viable system (city, county, region). A neighborhood is itself a viable system with S1s inside it (small groups, MEs, individual practices). And the recursion criteria vary — the same neighborhood is carved by geographic containment (this block, this ZIP code, this school catchment), by sectoral function (health, education, food, safety), by cultural affiliation (parish, ethnic community, generational cohort), and each carving produces a different S1/S2/S3/S4/S5 structure that is simultaneously true.

For the kit, this recursion structure has three operational implications.

First, projects surface at their own scale. Some scenarios that a neighborhood identifies are actually neighborhood-scale — the ME can form within the neighborhood and the value chain terminates in residents the neighborhood recognizes. Others are higher-recursion — the scenario is real for the neighborhood but the ME needed to address it must form at city or county scale because the required variety exceeds what the neighborhood contains. The kit needs to make this distinction visible so that neighborhood-scale MEs don't get asked to do higher-recursion work (which would exceed their variety and fail), and so that higher-recursion opportunities the neighborhood surfaces don't get dropped or handled locally at the wrong scale (which would exceed the neighborhood's variety and fail differently).

Second, the granting arm (WWHA and its equivalents) exists at higher recursion than the neighborhoods it serves. WWHA is an Industry Platform for a cluster of neighborhoods; it needs its own S4 function operating at cluster scale, its own scanning of what's coming across the cluster, its own Idealized Design work at cluster scale. The kit for neighborhood convenors does not attempt to install that higher-recursion S4 — but the design record recognizes it exists and needs to be developed separately.

Third, the political dimension of Ashby's Law becomes discussable through the recursion structure. When a higher-recursion institution (a city government, a state agency, a healthcare system) absorbs a problem whose actual required variety lives at neighborhood scale, the institution has taken on work it cannot properly regulate, and the neighborhood-scale variety that could match that work has been silenced or dismissed. This is the pattern Marc named as the political problem the design must make visible without turning it into war. The recursion structure gives it operational language: this problem belongs at the recursion level whose variety matches it, and mismatches produce systematic failures that everyone eventually pays for. Ostrom's polycentricity to the limit, as Marc named it. Mutuality across scales rather than capture by any single scale.

## What this section commits the design to

Everything downstream in this design record depends on the VSM frame holding. Section 5's customer scenario as the durable object between Experience-EMC-analog and Solution-EMC-analog is a scenario at whatever recursion level the scenario actually lives; the linkage-mapping method surfaces both the S1-through-S3 current state and, through Idealized Design, the S4-desired state; the Industry Platform's compensation flows through the value chain from ME work at appropriate recursion to resident value received at appropriate recursion; the moods-and-speech-acts layer that runs through every phase is what lets S4's imaginative work translate into S1 commitment without losing its S4 character.

The frame also constrains what the kit will not attempt. The kit is an S4-activation-with-S3\*-audit tool for neighborhoods that already have S1-through-S3 functioning and some form of S5 present. It does not attempt to build neighborhoods from scratch, install identity where none exists, replace failing operational units, or substitute for the political-cultural work that only a neighborhood can do for itself.

Section 4 develops the founded-commons concept — the physical and social infrastructure that a functioning S1-S5 substrate requires in order to sustain the S4 work the kit activates. Without the founded commons, S4's outputs have nowhere to accumulate and nowhere to be gardened over time.

---

That is Section 3, around 2100 words. Substantial because the VSM frame has to be introduced with enough detail that a reader who doesn't know Beer can follow it, and because the recursion structure needed enough treatment to serve as substrate for Section 5's scenario-scale discussion and for the political-recursion point.

Two places worth flagging.

The definitions of S1 through S5 in the "What a neighborhood as viable system looks like" section are grounded in ordinary neighborhood examples rather than in Beer's more abstract cybernetic language. That's deliberate — the design record is written for a reader who may not know VSM — but it means Beer scholars might find the treatment loose in places. If Kerry or Ward would want tighter Beer-faithful language, I can add a companion appendix. My inclination is to leave the main text neighborhood-grounded and add a Beer-faithful section only if a reader requests it.

The claim that "almost every neighborhood is deficient in S4" is strong and worth checking. I based it on the pattern in your Medford and Spokane work and on Beer's own observation that most organizations do S4 badly. If you want to soften it or ground it differently, say so.

React, correct, or say go for Section 4.

---

**Marc** (2026-08-31 05:05):

Compose section 4

---

**Claude** (2026-08-31 05:07):

Drafting Section 4.

---

# Section 4 — The Founded Commons

## What the concept names

Every neighborhood that sustains collective work over time has a place where that work happens. Not a place it borrows. Not a place an outside institution lets it use. A place the neighborhood recognizes as its own, safe, culturally appropriate, and available reliably enough that people know where to go and when.

The concept has several names in adjacent literatures. Ray Oldenburg's "third place" — home, work, and the other — captures some of it, though third-place discussions usually stop at hospitality and don't reach the purpose-built-for-collaborative-work part. "Commons" from Elinor Ostrom's tradition captures the governance shape but is vague about origin. "Community-owned civic infrastructure" is accurate and hard to say. The working phrase adopted here is "founded commons" — grammatically awkward, but it captures both the specific origin (someone founded it, from inside, for this purpose) and the collective present-tense function (it operates as a commons, not as a private facility that visitors use).

The phrase is the start of a conversation, not the end of one. Each neighborhood that engages with the kit will develop its own language for what its founded commons is called and what it is for. What matters is not the term but the pattern.

The pattern has several conditions holding together. None alone is sufficient; together they distinguish a founded commons from a friendly-but-not-quite space.

**Origin from inside.** A community member or members created it for the community. Not imposed from outside by government, foundation, or existing institution. Not spun up as a customer base for someone's business or a congregation for someone's church. Someone from within the neighborhood, seeing what the neighborhood needed, made this place happen.

**Purpose designed for collaborative work.** Built or converted deliberately for the collective work of the neighborhood, not incidentally hospitable to it. The Fledge in Superior, Arizona and Leo's in Lansing, Michigan are purpose-built in a way a coffee shop is not, even a friendly coffee shop with a corner table. The purpose shapes the space and the space shapes what happens there.

**Ongoing use as commons.** The neighborhood recognizes it as theirs and uses it that way, whether or not the founder is present in any given hour. The founder's role has shifted or is shifting from proprietor toward steward. The community's ownership is functional and cultural even where not legal.

**Not captured by external actors.** No government agency, foundation, or established institution can direct what happens in the space, even when one occasionally funds it or uses it. The neighborhood decides who comes in, what happens there, how it is used. External support is welcomed on the neighborhood's terms or not at all.

These four conditions are the substance. Everything else — the physical layout, the schedule, the funding basis, the specific programming — varies by neighborhood and should vary by neighborhood. The founded commons in East County will not resemble the founded commons in Birchwood, which will not resemble Leo's or the Fledge. What they share is the pattern of how they came to be and how they function now.

## Why the founded commons is a Phase 1 hard filter

Every earlier section of this design record depends on the founded commons being present. The linkage map lives somewhere visible over time; the retrospectives happen somewhere the neighborhood knows to come back to; the portfolios and scenarios accumulate somewhere; the moods and speech-acts work builds up a field in a place; the between-institution project chartering happens where the parties can gather without borrowed ground shifting under them.

Without a founded commons, none of this survives contact with the neighborhood's actual life. Meetings happen in scattered borrowed rooms; the linkage map exists only on someone's laptop; the retrospectives get cancelled when the borrowed room isn't available; the mood field never accumulates because no place holds it; the work depends on the convener's ability to keep re-inviting people to each new location. That is the failure pattern, and it is reliable enough to serve as a hard filter.

The Phase 1 convener's work therefore includes a real diagnostic question: does this neighborhood have a place its people already recognize as theirs, safe, culturally appropriate, purpose-built for collaborative work, and available to hold recurring gatherings over months? If the answer is no, the work does not start here. Not "we'll help them find one." Not "we'll host at the library until they figure it out." No founded commons, no start.

This is not sentimental. It is the design's honest recognition that neighborhoods without a founded commons are neighborhoods where the substrate for what the kit does isn't present, and no external effort can substitute for what would need to have grown on its own. The right response to that absence is to name it plainly, decline to force the work, and leave the neighborhood alone until the substrate develops — which it may do on its own timeline, or may not.

Two related failures the filter also prevents. First, the convener's temptation to offer their own place as anchor. Carl offering his home in East County, Chris offering the Fledge, Jerry offering Leo's, Brent offering wherever his SW Lansing work happens — the temptation is genuine because these are the spaces the convener knows and cares about. The distinction that matters is whether the neighborhood has adopted the space as its own or whether it remains the convener's space that the neighborhood visits. For Chris and Jerry, the Fledge and Leo's have plausibly crossed into founded-commons status — the neighborhood uses them as commons, the founder's role has moved toward steward, and the ongoing use is community-recognized. For Carl and Brent in newer or less-formalized situations, whether an existing place has crossed this line or a different place needs to emerge is exactly what the Phase 1 diagnostic surfaces.

Second, the temptation to accept an existing institutional space (a church hall, a library room, a school gym) that is friendly to the work but not founded from inside the neighborhood for it. These spaces are often available and often generous. They are not founded commons. The neighborhood using them is still visiting; the institution decides what continues to happen there; when institutional priorities shift, the space becomes unavailable and the work has no ground. The kit's Phase 1 should recognize the difference and prefer waiting for a real founded commons over starting on borrowed institutional ground.

## The Phase 1 diagnostic — how the convener sees a founded commons

Rather than a checklist to interrogate the neighborhood with, the diagnostic is a set of dimensions the convener holds internally through the pre-work period and asks conversationally where appropriate. Some of these are harder questions and asking them all directly would feel like an interrogation; the convener's judgment shapes which get asked and which get answered by observation.

**Origin.** How did this place come to be? Who initiated it, and were they of this neighborhood at the time? Was it built or converted for the collaborative purpose it now serves, or is that use retrofitted onto a space built for something else? How long ago, and what did the neighborhood look like then?

**Founder relationship, present tense.** Is the founder still active in the space? In what role — proprietor, steward, member among members, absent? Has the founder's role visibly changed over time? What would happen if the founder were gone for a month, six months, a year? Would the space still function?

**Governance in practice.** Who actually decides what happens here — programming, use, access, changes to the space, financial decisions, disputes? Is there a formal structure (board, collective, cooperative), an informal one (a recognized group of decision-makers), or does it default to the founder or a small circle? Does the neighborhood recognize the decision-makers as legitimate?

**Access and membership.** Who can come in, and on what terms? Is there a membership, a fee, a vouching pattern, open access? Who has keys or equivalent? Are there people the neighborhood expects to be there, and are there people who would feel unwelcome, on what grounds?

**Safety in the specific sense.** Is this a place where people say things they would not say elsewhere? Are disagreements and hard conversations survivable here? Have they happened? What happens to someone who challenges a decision made in this space? Are there groups in the neighborhood who would say this space is not safe for them, and why?

**Cultural fit.** Whose language is spoken here, literally and in the sense of vocabulary, register, unspoken norms? Are there neighborhood populations who would enter and feel this is not their kind of place? Who does the space attract, and who does it fail to attract — and does the neighborhood match that pattern?

**Function match.** Can 8-15 people sit together for a working session? Can a linkage map stay up on a wall for months? Can there be a recurring recognizable time? Can materials, artifacts, and evolving work be stored and displayed?

**Financial durability.** How does the space stay open — rent, ownership, donations, membership, revenue from other activity? Is that basis stable across a change in economic conditions? Who holds the risk if it fails? Is the neighborhood at risk of losing the space to a landlord decision, a tax event, a founder health event? What is the succession plan if the founder becomes unable to continue?

**Constituency.** How many people in the neighborhood use this space or have used it — not attended an event once, actually used it? Would neighborhood members recognize each other as fellow users? Is there a "regulars" group whose composition changes over time or stays stable? Are people showing up from the neighborhood specifically, or is the space drawing from a wider geography that happens to include the neighborhood?

**History under stress.** Has the space been through anything hard — a leadership conflict, a financial crisis, a founder-departure attempt, an external threat? How did it come through? A space that has survived a real stress event has demonstrated its commons character; one that has not been tested has claimed it.

**Neighborhood recognition.** If the convener asked ten random neighborhood members "does this neighborhood have a place that belongs to it, where the neighborhood's work happens," would they name this space? Would they name a different one? Would they say no? The answer to this question is more diagnostic than any of the others above.

An eleventh dimension is worth naming as a specific finding rather than a diagnostic question. **The Haier parallel.** Haier operates a Community Store in every one of China's 650,000 villages. Each serves as a community center — Zohar mentions after-school childcare specifically — and as a service platform for any citizen with an entrepreneurial idea. Anyone can be an employee, a designer, or the founder of a new ME through the Community Store. That the world's most operationally successful Rendanheyi implementation depends on a physical neighborhood-scale interface is confirmation the founded commons pattern is not a Western nonprofit conceit — it is what neighborhood-scale civil-society and neighborhood-scale entrepreneurial-society share as a common substrate.

## Beyond the diagnostic — the small groups filter

The founded commons is one filter. The other, which Marc named in the design conversation and which turns out to be at least as important, is whether the neighborhood already has small groups getting things done outside of business and government — often with business owners and government officials in peripheral roles. If those small groups exist and are findable, the neighborhood has the substrate the kit needs, whether or not a fully-formed founded commons is yet in place (though typically the two co-occur). If the small groups do not exist, the founded commons alone is not enough.

Together the two filters are the honest Phase 1 diagnostic: is there a founded commons this neighborhood recognizes as its own, and are there small groups already doing work of the shape that the kit's phases will amplify? Where both are present, the kit can serve. Where either is absent, the honest answer is to name what is absent, not force the work.

The relationship between the two filters is worth noting. Small groups often *create* founded commons — a founded commons is often the physical infrastructure that a set of small groups has willed into being over years. And a founded commons often *supports* the emergence of new small groups — a space designed for collaborative work makes new collaborations possible that would not otherwise form. The two are causally entangled and mutually generative. Where both are present, the neighborhood has the substrate the kit's S4-activation work rests on. Where only one is present, the neighborhood is on the way to substrate but not yet ready; the honest response is patience.

## Succession — how a new founded commons replaces an old one

The design record has to hold two open questions about the founded commons over time, because RCN is actively grappling with both and the answers are neither settled nor pretend-able.

**How long before a founded commons loses its qualities.** The failure modes are several. The founder-steward departs without succession and the space reverts to whoever holds the lease. Growth attracts institutional capture — grants with strings, partnerships that dilute purpose, professional staff whose accountability drifts outward toward funders. Neighborhood turnover empties the constituency of use. Or the collaborative-work function decays into event-hosting or coworking, retaining the form and losing the substance. The kit does not solve any of these — but it does place the retrospectives of Phase 5 as the natural site for noticing degradation early, before the work becomes dependent on ground that is about to shift.

**How a new founded commons can replace an old one.** This is the harder question, and Marc's framing of it deserves preservation: this is biology and sociology and anthropology, not engineering. The way life adapts and extends. Vester's biological systems framework points at the shift from mechanical to biological systems thinking as the frame the answer lives inside. New founded commons emerge as old ones age; the emergence follows patterns of imitation, adaptation, mutation, and selection that biological systems know how to do and mechanical systems cannot fake. What RCN can do is document the pattern as it appears, notice what conditions favor emergence, and refuse to over-specify.

Some early observations worth carrying, without claiming they are settled:

Emergence seems to require an aging founded commons whose founder is preparing to release, and one or more younger neighborhood members who have absorbed the pattern by participation and are ready to found their own version. The pattern replicates through participation, not through instruction. This is Vester's biological logic — new species emerge from old species through variation, not from blueprints.

Emergence appears easier where the aging founded commons has stayed small enough to remain legible as a pattern, and harder where it has grown large enough to require formal governance and paid staff. This has implications for how founded commons should be encouraged to develop — the pressure to grow, professionalize, and formalize is often the pressure toward institutional capture, and that same pressure suppresses the emergence of the next generation of founded commons.

Emergence appears to depend on the presence of what elders would recognize as their own younger selves — people in the generational stage of doing rather than of releasing, but with a sensibility that would make them capable of releasing later. This has succession implications for the elder-mentorship role in the granting arm's menu: mentoring a younger neighborhood person in the founding of a new founded commons is different from mentoring an ME leader, and requires the same kind of long patience that raising a child does.

The kit should carry these observations as open work and point convenors toward the RCN conversation about founded commons succession rather than claiming to answer. Section 12 (open questions) preserves the questions in their unresolved form; this section names them and refuses to pretend the design record has them solved.

## What Section 4 commits the design to

The founded commons is treated throughout the design record as substrate the kit requires rather than substrate the kit creates. The Phase 1 diagnostic is honest about this. The kit will not attempt to force a neighborhood without founded commons or without functioning small groups; the invitation Phase 1 opens will surface those absences, and the honest response is to decline to proceed rather than to force-fit.

The founded commons is also treated as a living, mortal thing whose life is measured in years to decades. Founded commons that lose their qualities are named honestly as such; new founded commons that emerge from participation in aging ones are recognized as the pattern's natural succession. Neither the founded commons nor the neighborhood is a static object; both are viable systems in Beer's sense that maintain themselves through ongoing work and decline when that work stops.

Section 5 introduces the customer scenario as the durable object that the kit's phases produce, hand between MEs, and carry forward across cycles — the object that only makes sense inside the founded commons whose life this section has named.

---

That is Section 4, around 2400 words. Long, but the founded commons is one of the design's most important claims and the diagnostic has to be complete enough to be usable rather than gestural.

Three things worth your attention.

The eleven-dimension diagnostic in the "Phase 1 diagnostic" subsection reproduces the material we worked through together in the design conversation. It's dense. My inclination is to keep it dense in the design record and produce a shorter conversational form for the kit itself — the design record's job is to establish what the convener needs to hold, and the kit will translate it into what to actually ask when. Say if you want it compressed here.

The "Beyond the diagnostic — the small groups filter" subsection introduces Marc's small-groups criterion as a second filter alongside the founded commons. In the design conversation these arrived as a single insight (Marc's framing that any real neighborhood has small groups already at work and those groups can be invited into conversation with WWHA). I've placed them as related-but-distinct here because they are logically separable: founded commons and small groups can in principle exist without each other, though in practice they co-occur. If you want them fused rather than distinguished, I can rewrite.

The succession subsection preserves questions rather than answering them. This is deliberate — RCN is grappling and the design record should not pretend otherwise. If any of the early observations I noted (emergence through participation not instruction, small-enough-to-remain-legible, elder-mentoring-younger-founders) is either settled RCN thinking or actively wrong, tell me and I'll adjust.

React, correct, or say go for Section 5.

---

**Marc** (2026-08-31 05:07):

Write Section 5

---

**Claude** (2026-08-31 05:09):

Drafting Section 5.

---

# Section 5 — The Customer Scenario as Origin Object

## Why the customer scenario deserves its own section

Almost no one outside Haier does this. That absence is not incidental; it is why programs come and go while the underlying compound needs they were meant to address persist unchanged. The pattern is well-documented: an initiative launches around a real need, produces some work while its funding lasts, then dissolves — and the need itself dissolves with it in institutional memory, so the next initiative starts from zero. Every re-attempt at addressing the same compound need has to rediscover the need, re-articulate it, and re-form the ecosystem around it, without benefit of what the prior attempts learned.

Haier's Rendanheyi model contains an organ that prevents this pattern. The customer scenario is a persistent object that lives on an internal platform independent of any specific microenterprise attempting to address it. When an ME succeeds, the scenario has produced value and the ME's history attaches to the scenario. When an ME fails, the scenario returns to the platform enriched by what didn't work, available for another team to grab. William Malek reports the turnaround for a new team to form around a returned scenario at Haier's Chinese operations is two to three days. The scenario is the organ that makes ecosystem-brand work sustainable across generations of specific attempts.

This section develops the customer scenario as a first-class object in the design record — the object that ties the neighborhood's linkage-mapping work to the between-institution project shape, that anchors the balanced scorecard's value definition, that gives the SODOTO portfolio layer something to attach ME histories to, that feeds the FedWiki repository layer, and that gives the CfA-dSC contracts something to instrument around. Every subsequent section in the design record depends on the customer scenario being understood clearly.

## What a customer scenario is

A customer scenario is an articulation of a compound unmet user need in end-to-end user-experience form. Three phrases in that sentence do specific work and deserve unpacking.

**Compound.** A single-need articulation is a product-development question. A compound articulation is a life-situation question. Haier's "smart refrigerator" is a product; Haier's "Internet of Food" is a scenario. The scenario names what the user is doing in their whole life-context: consuming food, which involves refrigeration but also purchase, storage, preparation, dietary advice, and the coordination of these across a household's rhythms and constraints. No single provider can satisfy the whole scenario; that is the point. The compound nature invites the ecosystem to form.

**Unmet user need.** Not "opportunity to expand a product line." Not "gap in service delivery from an institutional perspective." Not "problem someone should be solving." A specific compound context in the user's life where current provision leaves the user's actual experience incomplete, difficult, expensive, undignified, or dependent on the user doing coordination work that they should not have to do. The scenario is written from the user's side of the transaction, in the user's own terms, based on zero-distance contact with users who live inside the context.

**End-to-end user-experience form.** The scenario describes the whole context the user is living in, not the sliver of it one intervention would address. Haier's "balcony scenario" is not "washing machine plus sofa plus sound system plus sporting equipment." It is the way users actually live on their balconies — reading, resting, exercising, socializing, laundering, being outside without leaving home — and what would make that whole way of living work well. The scenario captures the situated life; the compound needs and the ME solutions are what the scenario invites once it is well-articulated.

The scenario is not a business plan. A business plan is a founder's proposal to investors about how a specific enterprise will operate. The scenario is the situation-with-user, upstream of any specific enterprise, available for any enterprise to form around.

The scenario is also not a project brief. A project brief is a description of specific work to be done — scope, deliverables, timeline, budget. The scenario is the compound context the project brief would address, upstream of any specific project's decisions about scope and approach. Multiple different projects could reasonably form around the same scenario; the scenario does not prejudice which.

## The Experience-EMC / Solution-EMC split at neighborhood scale

Zohar's *Zero Distance* names a distinction that reshapes how MEs are understood at any scale. There are Experience EMCs and there are Solution EMCs, and they do different work.

**Experience EMCs** stay zero-distance to users. Their work is being present in the users' life-context, hearing pain points and desires, understanding why and how users are actually using what they use, and articulating scenarios that name what's happening. Experience EMCs surface the material that scenarios are made of.

**Solution EMCs** form to deliver against scenarios that Experience EMCs have surfaced. Their work is design, production, delivery, service — the mobilization of ecosystems that address the scenario's compound need. Solution EMCs are what the between-institution project shape describes at Haier scale.

At neighborhood scale, this split has structural implications the design record needs to hold.

Some neighborhood MEs will be scenario-articulators — small groups whose primary work is being zero-distance with residents and articulating what's actually happening in their lives. These are the people already at zero distance in a functioning neighborhood: community health workers, teachers who know families over years, chaplains, librarians who see who comes in for what, food bank volunteers, mutual-aid coordinators, elders who visit the homebound, the operator of a founded commons who watches who uses the space and how. These MEs may already exist as small groups in a neighborhood that meets the Section 4 filters; the kit does not create them but recognizes them and makes their scenario-articulation work visible.

Other neighborhood MEs will be solution-deliverers — the between-institution project teams that form around specific scenarios. These are the MEs the design record has been describing throughout, and Section 8 develops their shape in detail.

The customer scenario is the durable object that connects them. A scenario articulated by an Experience-ME analog lives on the FedWiki repository. A Solution-ME analog grabs it, forms an ecosystem around it, negotiates its value chain and contracts, receives catalytic seed capital, and does the work. When the work completes — successfully or not — the scenario continues to live in the repository, either as demonstrated-value or as returned-enriched.

The two-part structure prevents a specific failure mode common in neighborhood work: the scenario gets articulated by the same people who then have to solve it. When articulation and solution are combined in one small group, the scenario tends to shrink to what that group can solve — losing its compound end-to-end character and becoming a project the group can execute, which was not the point. Separating the roles keeps scenarios ambitious enough to require ecosystem formation and to invite between-institution work.

At neighborhood scale, the same person may participate in both an Experience ME and a Solution ME, and the same small group may play both roles at different times. The distinction is functional, not organizational; what matters is that the scenario-articulation work and the scenario-solving work are recognized as distinct and are not collapsed into each other.

## What a well-formed scenario contains

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

## Where scenarios live and how they circulate

The FedWiki repository is where scenarios live. One page per scenario, forkable per neighborhood context, enriched by every attempt.

FedWiki's fork-and-modify pattern fits scenarios natively. A scenario articulated in East County can be forked by someone in Birchwood who recognizes a similar pattern, adapted for the Birchwood context, and lived alongside the East County original. Both remain visible; neither overwrites the other; a Solution ME in either place can see both versions and learn from the other's work. Cross-neighborhood learning happens through the fork history, not through any central curation.

The scenario page's structure follows the seven elements above, in FedWiki markdown-paragraph form. Fields that require structured data — attribution, neighborhood context, existing attempts with outcomes — can use FedWiki's native item types or link out to Overall Schema entries in Neo4j where the graph structure adds value.

Circulation happens through several mechanisms.

Convener attention. The convener of a neighborhood engaged with the kit maintains awareness of the scenario repository and surfaces scenarios that plausibly apply to their neighborhood during Phase 2's linkage-mapping meetings. Scenarios articulated elsewhere can inform what the meeting sees.

WWHA Industry Platform attention. WWHA's granting arm maintains its own awareness of scenarios across the cluster of neighborhoods it serves and can bring cross-neighborhood scenarios into conversation with individual neighborhoods where relevant.

MEs shopping. In the mature marketplace state, MEs looking for work can browse the scenario repository and propose to form Solution EMCs around scenarios they see. This is the "you can go grab the scenario" mechanism Malek describes at Haier scale. At RCN scale, this is subject to the first-generation-portfolio conditions and the SODOTO trust mechanisms described in later sections; the mature marketplace only becomes fully operational once portfolios have accumulated enough substance to support competitive matching.

e-VSM survey validation. Once a scenario has been articulated, an e-VSM survey of the broader neighborhood can validate whether the scenario is real, whose experience it reflects, and what it misses. Claude API synthesis of survey results provides the interpretation and integration Marc's e-VSM design already contemplates. Scenarios that survive validation get Solution EMC formation; scenarios that don't get revised or archived with what was learned.

## How scenarios interact with the kit's phases

The kit's phases descend from the CMG five-phase Linkage Mapping playbook. With the customer scenario as first-class object, the phases produce and use scenarios explicitly rather than jumping from linkage map to project.

**Phase 1** includes scenario-repository review. The convener reviews existing scenarios that plausibly apply to this neighborhood and brings the awareness into pre-work conversations. The Phase 1 diagnostic includes whether the neighborhood already has scenario-articulator patterns operating (Experience-ME analogs), even if they don't use the vocabulary.

**Phase 2's** first meeting produces scenarios, not projects. The linkage map surfaces the current-state S1-through-S3 view of the neighborhood; the Idealized Design work surfaces the S4-desired state; the surfacing of scenarios happens as the gap between those two becomes visible. Whose life is caught in the gap, in what compound way, across what end-to-end context? That is the scenario question, and the room's answer to it is Phase 2's real output.

**Phase 3's** weighted selection is scenario selection. The group chooses which of the surfaced scenarios matter most, using the weighted-selection matrix method the CMG playbook developed. The output is a small set of prioritized scenarios that go into the repository and become the basis for Phase 4's ME formation.

**Phase 4** is where Solution MEs form around selected scenarios. Self-organizing teams grab scenarios; they negotiate with the WWHA Industry Platform (playing an EMC-owner role); they form the ecosystem community across the small groups and institutions the scenario needs; they put contracts in place through CfA-dSC with Leading Targets and Value Added Mechanism specified; they receive catalytic seed capital.

**Phase 5** is execution, retrospective, and scenario update. The ME does the work. The retrospective — grounded in the e-VSM survey of how the work landed across the neighborhood's spheres and in resident recognition of value received — feeds back to the scenario's existing-attempts field. Whether the ME succeeded or failed, the scenario continues living in the repository, enriched by what happened.

The cycle can then repeat, with a new round of scenarios (or returning enriched scenarios) forming Phase 2's input for the next iteration. Or the neighborhood can set the kit free once the pattern is internalized, continuing to work with scenarios as its native object without needing the convener's Phase-facilitation to run each round.

## What this section commits the design to

The customer scenario is treated throughout the design record as the origin object from which specific MEs derive rather than as a description a specific ME writes about its own work. This is the inversion that distinguishes the Rendanheyi pattern from conventional project-based work. Projects come from scenarios; scenarios do not come from projects.

The two-part Experience/Solution EMC structure is preserved even at neighborhood scale, with the recognition that the same person or small group may participate in both roles at different times but should not collapse the roles.

The FedWiki repository is treated as the persistent home of scenarios across cycles and across neighborhoods. Its fork-and-modify pattern is the native mechanism for cross-neighborhood learning; its markdown-paragraph structure holds the seven-element scenario template; its links out to Neo4j Overall Schema entries handle the structured relationships.

The e-VSM survey is treated as the small-data validation instrument for scenarios and as the retrospective instrument for how ME work has landed. Claude API synthesis integrates the survey evidence and surfaces suggestions, giving Claude an ongoing operational role in the kit rather than only a co-drafting role.

Section 6 develops the Industry Platform pattern — the WWHA-shaped granting-arm-as-EMC-owner that MEs negotiate with when forming Solution EMCs and whose actors are compensated as a downstream function of the MEs they seed. Section 7 develops the moods-and-speech-acts working layer that runs through every phase and every scenario negotiation. Section 8 returns to the between-institution project shape, now understood as the operational form Solution MEs take.

---

That is Section 5, around 2500 words. Long, but the customer scenario is the design's structural pivot — the object that ties the four principles from Section 2, the VSM frame from Section 3, and the founded commons from Section 4 to everything that follows. Under-treating it here would force awkward retrofitting later.

Three things worth your attention.

The seven-element scenario template in "What a well-formed scenario contains" is my inference, not a Haier fact. I've flagged that inside the text. If Startup Factory or your Kindle notes turn up specific Haier fields we should adopt, we'll revise; if not, this template becomes RCN's own working form until use surfaces what to change.

The Experience/Solution split is applied fully — I've argued that the same person can play both roles but the roles should not be collapsed. This is a stronger structural claim than I've made elsewhere. If you want it softened (or strengthened further), say so.

The Phase-mapping in "How scenarios interact with the kit's phases" restates the CMG five-phase structure with scenarios as output rather than projects. This anticipates Section 8 (between-institution project shape) and Section 11-ish (the phase-by-phase kit walkthrough). Some overlap is unavoidable since the section-to-section boundaries in this design record aren't sharp; the scenario section has to say enough about the phases to make sense, and later sections will restate the phases with different emphases. Say if you want the phase material trimmed here or expanded there.

React, correct, or say go for Section 6.

---

**Marc** (2026-08-31 05:09):

Do Section 6

---

**Claude** (2026-08-31 05:11):

Drafting Section 6.

---

# Section 6 — The Industry Platform Pattern

## What an Industry Platform is in Haier's usage

Haier operates an internal function it calls an Industry Platform. In Rendanheyi mechanics, the Industry Platform is what an outside observer would recognize as an internal venture capital arm — a small group of people whose work is helping microenterprises form, seeding them with capital when they do, negotiating the value chains they participate in, and being compensated as a downstream function of the value the seeded MEs eventually deliver to users. The Industry Platform is a support enterprise in the technical sense: it earns nothing on its own, only through the success of the MEs it supports.

Zohar's description of the Rendanheyi model names three types of ME operating at Haier: market-facing MEs that deal directly with users; incubating MEs that explore new product and service categories; and node MEs that supply components or services (marketing, HR, and so on) to the market-facing MEs. The Industry Platform is a specific case of the third category — a node-ME whose service to other MEs is capital, mentorship, network access, and negotiation help. What distinguishes it from an ordinary node-ME is the compensation structure: the Industry Platform's income depends on the market-facing MEs it seeded successfully creating value for users, mediated through the smart contracts and Value Added Mechanisms that instrument the value chain.

This is not incidental to Haier's operating logic. It is the mechanism that lets Haier compensate the entrepreneurial-support function without falling into the pattern that most external venture capital and most internal corporate innovation funds fall into — the pattern where the support function's compensation is independent of the eventual value delivered, and therefore drifts toward metrics that flatter the support function rather than metrics that measure user benefit. Haier's Industry Platform actors, in Zohar's account and in William Malek's descriptions, are paid substantially and paid based on outcomes downstream of their contributions. Everyone gets paid. Nobody gets paid on a job description independent of what actually reaches users.

## Why WWHA's granting arm is being designed as an Industry Platform

The design conversation for this record moved through several framings for what WWHA's granting arm should be before arriving at the Industry Platform pattern.

The first framing was "granting arm" in the conventional philanthropic sense — an entity that receives applications, evaluates them, awards grants, and reports on outcomes. That framing was rejected because it reproduces the philanthropic-industrial pattern John McKnight named, in which the grant-making function's compensation and job structure are independent of whether the grants actually create value for the residents the work is meant to serve. Grant officers who deploy capital according to a foundation's strategic priorities can be excellent professionals doing their jobs well and still, in aggregate over time, produce work that bends toward what the foundation wants rather than what residents receive. The bending is structural, not personal.

The second framing was "volunteer elders giving back" — the granting arm operated entirely without compensation, by people whose relationship to the work was purely associational gift in McKnight's sense. That framing was also rejected, because it fails on its own terms. It assumes the only alternative to the philanthropic-industrial pattern is ascetic self-sacrifice, and that assumption produces a design that cannot scale because it cannot compensate people doing real work for real time. It also confuses the surface (paid versus unpaid) with the structural (compensation independent of value delivered versus compensation structurally tied to value delivered).

The third framing, arrived at through recognition of Haier's actual mechanism, is that WWHA's granting arm operates as an Industry Platform — the entity that catalyzes neighborhood MEs to form around customer scenarios, seeds them with catalytic capital, mentors them across the menu of adjacencies described in Section 2's Principle Two, and is compensated as a downstream function of the value those MEs eventually deliver to residents. This framing keeps the elder-giving-back sensibility that fits how Carl, Chris, Jerry, and Brent describe their own work; keeps compensation for real work at real levels rather than requiring self-sacrifice; and keeps the compensation structure locked to value received by residents rather than to any outside assessment of the work's quality.

## What the Platform actors do

The Industry Platform is not defined by a fixed set of tasks; it is defined by its position in the value chain. The Platform sits between the neighborhoods where customer scenarios emerge and the MEs that form to address them. Its work is whatever contributes to MEs forming, doing well, and setting themselves free — from the residents' side of the value chain, not from any outside assessment.

Some concrete functions the Platform performs:

**Invitation.** Small groups already at work in a neighborhood come into conversation with the Platform, on the Platform's invitation or their own. The invitation is not a form to fill out; it is a relationship begun. What the Platform offers, as Marc named in the design conversation, is whatever the small group needs — from the menu of adjacencies — on request, not as a technical-assistance dump.

**Mentorship.** Carl, Chris, Jerry, and Brent and other elders on the Platform mentor ME leaders and small-group participants across whatever they've learned in thirty years or more of work. Mentorship is on request, not on schedule, and its content is whatever the mentee actually needs. It appears on the Platform's menu of adjacencies as one thing MEs can draw on when they see the need.

**Facilitation of the linkage-mapping cycle.** Platform actors serving as conveners run the kit's phases in neighborhoods that have met the Phase 1 filters. This is the specific S4-activation work the kit exists to enable, described in Section 3.

**Scenario stewardship.** Scenarios live in the FedWiki repository; the Platform maintains awareness of them, helps surface applicable scenarios during Phase 2 meetings, and helps validate scenarios through e-VSM survey work before Solution MEs form. The scenario is durable; the Platform's stewardship of the repository is one of its ongoing responsibilities.

**Solution-ME formation support.** When a scenario has been selected in Phase 3 and a self-organizing team is forming around it in Phase 4, the Platform acts as an EMC-owner analog in Haier's sense — helping the ME assemble the ecosystem community it needs, negotiate the value chain, specify Leading Targets and Value Added Mechanism, and put the CfA-dSC contracts in place. The Platform does not run the ME; it helps the ME form itself viably.

**Catalytic seed capital deployment.** When a Solution ME is ready to launch and the scenario, the ecosystem, and the contracts are in place, the Platform deploys catalytic seed capital under the principles described in Section 2 (catalytic not operating, sized to enable launch not to become permanent budget, evaluated on catalyzability rather than on general goodness).

**Retrospective and portfolio work.** After Phase 5's retrospective, the Platform supports the accumulation of what happened into SODOTO portfolios (the ME participants, the Platform actors, the scenario itself) and into the scenario repository's existing-attempts field. This is S3\* work in the VSM sense, providing S4 with honest information about what actually happened.

**Cross-neighborhood pattern recognition.** Platform actors see across multiple neighborhoods simultaneously. When a pattern is emerging across neighborhoods (a scenario recurring, an ME approach that works, a founded-commons succession pattern that appears repeatable), the Platform's cross-cutting view can surface the pattern to individual neighborhoods that would otherwise not see it. This is one of the specific reasons the Platform exists — the Platform holds requisite variety that any single neighborhood does not.

None of these functions is fixed in a job description. The Platform is a set of relationships in the value chain, and Platform actors do whatever the value chain needs done for MEs to form, do well, and set themselves free.

## Compensation mechanics

The Platform actors' compensation flows from value created by residents for residents and their neighbors (as Section 2 defined), measured against instruments the neighborhood itself constructs and maintains (as Section 2 also defined), through the instrumented value chain that CfA-dSC provides.

The mechanism has several moving parts that are worth naming even in preliminary form.

**Value Added Mechanism specification.** At the time a Solution ME's contracts are put in place (in Phase 4), the value chain from Platform contribution through ME work to resident value received is specified. This includes the range of value-added sharing among the parties — the Platform, the ME's core participants, the ecosystem-community members contributing components or services, and any other parties the value chain touches. Haier's practice defines lower and upper limits for each party's share, negotiated before production starts. The RCN analog will use CfA-dSC as the smart-contract layer instrumenting this.

**Recognition of value received.** When the ME's work has produced results (or when the timeline for producing results has elapsed), the neighborhood-authored balanced scorecard is used to assess what value residents have received. The e-VSM survey provides the multi-perspective read. The scenario's original invitation, the ME's Leading Targets, and the specific value the Platform contributed to the ME's formation are all inputs to the settlement.

**Settlement across the value chain.** Compensation flows to all parties according to their pre-negotiated shares, only to the extent that value has been recognized by residents. If the ME failed or the scenario didn't deliver as intended, the Platform's compensation for that specific instance is correspondingly small or zero. If the ME succeeded and residents recognized substantial value received, the Platform's compensation is correspondingly larger.

**Portfolio accumulation.** Beyond the immediate settlement, the outcome accumulates in the Platform actors' SODOTO portfolios — the specific contribution they made to this ME's formation, the value that eventually flowed, the residents who recognized it. Over time, a Platform actor's portfolio is the trace of what they seeded and how it landed. This is what makes Platform work replicable and inheritable across generations of elders.

The mechanism requires several pieces of RCN's substrate to be operational: CfA-dSC as the smart-contract layer, SODOTO as the portfolio layer, e-VSM as the survey layer, Overall Schema as the graph structure, and the FedWiki repository as the durable content home. None of these is fully mature in 2026; each is in active development. The Industry Platform's compensation mechanism becomes fully operational as the substrate matures, and the design record commits to describing the mature form rather than working around the transitional state.

In the interim — before CfA-dSC and SODOTO are fully operational — Platform actors will need to be compensated on approximations of the mature mechanism. The approximations must preserve the structural property: compensation must be downstream of value received by residents, must be measured against neighborhood-authored instruments, and must be capable of returning zero or small when the ME does not deliver. A fixed salary or a percentage of grants deployed would violate the structure and would reproduce the philanthropic-industrial pattern the design exists to prevent. The Platform actors have to accept this. If they cannot accept variable, outcome-dependent, and potentially small or zero compensation, they cannot be Platform actors.

## The Platform and the four convenors

Carl, Chris, Jerry, and Brent are the initial Platform actors in the design's current scope. Each occupies a convener position in a neighborhood cluster with founded commons or founded-commons-adjacent conditions present. Each has thirty or more years of work whose patterns line up with what the Platform's functions require. Each has, or can develop, the temperament for release — the willingness to raise their neighborhoods' MEs and set them free rather than hold them.

The initial four are also each specific to their own neighborhood cluster. Carl operates in East County and its surrounding rural context; Chris operates in Superior, Arizona, with the Fledge as anchor; Jerry operates in Lansing, Michigan, with Leo's as anchor; Brent operates in SW Lansing with related but distinct patterns. Each of them will run the kit's phases in their own neighborhoods and be Platform actors for the MEs that form there. They may also be mentors to other convenors and MEs across the cluster as second-generation and third-generation convenors emerge.

The Platform is not organizationally centralized in any one place. WWHA is the first instance in Whatcom County; the Fledge and Leo's function as related Platforms in their own contexts; a general RCN framework holds the pattern across all of them without any single Platform having authority over another. This is deliberate — a centralized Platform would replicate exactly the higher-recursion capture pattern that Ostrom's polycentricity warns against. Each Platform is autonomous within its own recursion level; cross-Platform coordination happens through peer relationship, shared substrate (FedWiki, Overall Schema, CfA-dSC), and the elder-mentorship network among Platform actors.

Cross-Platform learning happens through the same fork-and-modify pattern that scenarios use in the FedWiki repository. A pattern developed at the Fledge can be forked into Whatcom's context; a pattern developed in East County can be forked into SW Lansing's context; each fork adapts and neither overwrites the other. The RCN substrate holds the shared patterns; each Platform holds its own adaptations.

## The Platform's own S4 function at cluster scale

Section 3 named that the Industry Platform exists at higher recursion than the neighborhoods it serves, and that WWHA (and each other Platform) needs its own S4 function operating at cluster scale. This deserves brief development here even though it is not fully worked out in the design conversation to date.

At neighborhood scale, S4 is Idealized Design plus SWOT-type scanning, activated through the kit's phases. At cluster scale — the scale at which a Platform operates across multiple neighborhoods — S4 needs different tools. What is the Platform's own outside-and-future work? What is coming across the cluster that individual neighborhoods cannot see from their own recursion level? What patterns emerging in one neighborhood might apply to others? What is the Platform's Idealized Design for itself and for the cluster it serves?

Marc's Ripple ReThink System Dynamics model, originally developed for Whatcom County, remains available as one S4 tool for cluster-scale work when a question surfaces that needs it. Cross-scenario pattern recognition across neighborhoods is another S4 function the Platform performs. Cross-generational elder-succession work is another. The Platform's S4 is not the kit's job to develop; it is the Platform's own ongoing work, and this design record recognizes it exists without attempting to specify it further.

## What Section 6 commits the design to

The Industry Platform is the operational form of the granting arm throughout the design record. Grants, mentorship, facilitation, scenario stewardship, and all other Platform functions are understood as parts of a single value-chain-embedded role rather than as separate programs. Platform compensation is structurally downstream of value received by residents. Platform actors are the elders who take up this work in their own neighborhoods and clusters, initially the four named convenors and eventually whoever follows them.

The Platform is polycentric across clusters — WWHA in Whatcom, the Fledge in Superior, Leo's in Lansing, and other Platforms as they emerge — without any centralized RCN authority. The shared substrate (FedWiki, Overall Schema, CfA-dSC, SODOTO, e-VSM) is what connects the Platforms; peer relationship and elder-mentorship among Platform actors is what sustains them across generations.

The compensation mechanism depends on RCN substrate maturing — CfA-dSC, SODOTO, e-VSM, Overall Schema — and the design record commits to describing the mature form rather than the transitional state. In the interim, Platform actors accept compensation approximations that preserve the structural property (downstream, outcome-dependent, variable) even where the full mechanism is not yet operational.

Section 7 develops the moods and speech-acts working layer that runs through every phase, every scenario negotiation, and every Platform interaction. Section 8 returns to the between-institution project shape — the operational form Solution MEs take when they form around scenarios and enter into value-chain contracts with the Platform.

---

That is Section 6, around 2400 words. Substantial because the Industry Platform is where several strands from earlier sections converge into an operational form, and because the compensation mechanics — the part that resolves the tension between McKnight and Rendanheyi — deserves precise treatment.

Three things worth your attention.

The interim-versus-mature-form discussion in the compensation-mechanics subsection acknowledges that the substrate isn't fully ready in 2026. I've committed the design record to describing the mature form and treating interim approximations as transitional. If you'd rather have the interim state described in more detail (what specifically Carl, Chris, Jerry, Brent get paid on right now), tell me and I'll add that — but my instinct is to keep the design record on the mature form and let the transitional state be handled operationally rather than architecturally.

The polycentric-across-clusters point in the "Platform and the four convenors" subsection is a real design claim: WWHA does not have authority over the Fledge or Leo's, and no future centralized RCN body should either. This is Ostrom's polycentricity applied to the Platform itself. If that lands wrong — if you actually intend some form of centralized RCN authority across Platforms — say so and I'll revise.

The "Platform's own S4 function at cluster scale" subsection is deliberately underdeveloped. The design conversation touched on it briefly but didn't work it fully. I've flagged that in the section rather than pretending it's resolved. Section 12 (open questions) will pick it up along with the founded-commons succession question and the WWHA-charter question.

React, correct, or say go for Section 7.

---

**Marc** (2026-08-31 05:11):

Write section 7 please

---

**Claude** (2026-08-31 05:13):

Drafting Section 7.

---

# Section 7 — Moods and Speech Acts as the Working Layer

## Why this is a section, not an appendix

Moods and speech acts run through every phase of the kit, every scenario negotiation, every conversation between Platform actors and MEs, every retrospective, every founded-commons conversation. They are not a specialized tool that comes out for specific occasions. They are the working layer within which everything else happens. A conversation that ignores them still contains them; ignoring them means being moved by them without noticing.

The design conversation initially placed this material as an appendix — a substrate that curious readers could reach for. Marc's correction was sharp and definitive: moods and speech acts are critical to everything and will be used at all phases and explained as needed. That correction reshaped Section 7 into a load-bearing section rather than a reference.

The section develops the material at a level that a convener can use in practice without becoming a specialist. It does not attempt to replicate Fernando Flores's full ontological-coaching curriculum or Beer's full VSM treatment of system-level moods. It develops enough of the vocabulary and enough of the operational implications that a convener can name what is happening in a room, recognize when a mood mismatch is masquerading as a values disagreement, distinguish a promise from a hopeful wish, and hold speech-act discipline through the moments when it matters most — the chartering of MEs in Phase 4, the retrospective in Phase 5, the naming of what a scenario is asking for.

Progressive disclosure is the operating principle. Vocabulary earns its way in through use. A convener explains what an act of declaration is when a moment in the meeting turns on someone declaring something. A convener names a mood of resignation when the room is stuck and no one has said why. The teaching is embedded in the doing. Full curriculum is available for those who want it — Flores's writings, Charles Spinosa's work, Bob Dunham's Institute for Generative Leadership materials, and Beer's own discussions of variety and mood in *Diagnosing the System* — but the kit does not require a convener or a neighborhood to become fluent in the theory before beginning.

## Moods as the working layer

A mood is not an emotion in the usual sense. Emotions are episodic, personal, and often about something specific. Moods are pervasive, shared across a group or a situation, and shape what is possible to say, do, hear, or notice from within them. A room in a mood of resignation cannot hear an invitation to imagine what could be; the invitation lands as naive at best, offensive at worst. A room in a mood of ambition cannot hear a caution about downstream failure modes; the caution lands as obstruction. Moods are not obstacles to conversation — they are the ground on which conversation happens, and skilled facilitation begins with noticing the ground.

Six moods are worth naming as the working set. They are not exhaustive. They are what a convener needs to recognize in practice.

**Resignation.** The mood that says nothing can really change here; we've tried before; the problem is too big; the powerful won't allow it; the people who would have to change won't. Resignation forecloses possibility. It often masquerades as realism or wisdom. A room in resignation cannot do Idealized Design work, because Idealized Design requires the belief that a designed present is available if the constraints of history don't bind. Convener's first move when resignation is present is to name it, not to argue with it. Naming it opens space; arguing with it strengthens it.

**Resentment.** The mood that says something was taken from us that we were owed; someone did us wrong; the injustice has not been repaired. Resentment holds a real memory of harm and refuses to release it. In a neighborhood context, resentment is often accurate — the harm was real, the repair has not happened, the institutional actors that caused it are still operating. Resentment cannot be facilitated away, and any convener who tries will lose the room. Convener's work when resentment is present is to acknowledge what happened, refuse to minimize it, and hold the possibility that new work can happen alongside unresolved harm without pretending the harm is resolved.

**Acceptance.** The mood that says this is what is; I can work with this; the constraints are real but not everything. Acceptance is neither resignation nor cheerful denial. It is the mood from which realistic action becomes possible. Most productive work happens in acceptance. Convener's work is often to help the room move from resignation or resentment into acceptance, without forcing the move and without prematurely claiming it has happened.

**Ambition.** The mood that says we could do more than we currently are; the horizon is open; possibility exceeds current arrangements. Ambition is what Idealized Design requires. Ambition without acceptance produces wish lists; acceptance without ambition produces incremental adjustment; both together produce designed futures that are also grounded. Convener's work is to invite ambition after acceptance has settled, and to protect it from being flattened back into what already exists.

**Wonder.** The mood that says I don't know what this is; I want to look longer; the situation is more interesting than my current understanding of it. Wonder is what allows a scenario to be articulated at end-to-end scope rather than at product-development scope. It is also what allows a convener to see a neighborhood on its own terms rather than through prior templates. Wonder is often missing from professional facilitation because professional certainty is what facilitators are hired for. The kit's convener will do better work in wonder than in certainty; the design record commits to this preference.

**Serenity.** The mood in which one can act well without needing the action to succeed. Serenity allows a Platform actor to seed an ME that may fail, an ME participant to commit to work that may not deliver, a convener to invite a neighborhood into work whose outcome is not guaranteed. Without serenity, catalytic seed capital cannot be deployed honestly, because the deployer will unconsciously bend the work toward visible near-term success at the expense of the actual value chain. Serenity is what makes the raise-your-kids-and-set-them-free principle from Section 2 emotionally available rather than only intellectually correct.

These six do not cover everything a convener will encounter. Fear, hope, joy, grief, pride, shame, curiosity — all can be present in any given meeting, and skilled facilitation reads them accurately. What the six above name specifically is the working set that recurs in the kind of work the kit is for. A convener who can distinguish resignation from acceptance, ambition from wish, resentment from anger, wonder from confusion, has enough to work with.

## Mood as VSM signal

Beer's VSM discussions include a treatment of moods as system-level information — not as emotional states of individuals but as signals about the system's own state that appear in the moods of the people inside it. A resignation mood widespread in a neighborhood is information about the neighborhood's S5 (identity, purpose) or its S4 (outside and future) being in trouble, not information about the individuals being defective. Resentment widespread in an institution is information about unresolved S3\* findings that S3 has been ignoring, not information about the resenting individuals being difficult.

At neighborhood scale, this means the moods of the room during a Phase 2 meeting are diagnostic. Resignation in the room suggests S4 is not functioning — the neighborhood cannot imagine a different future, which is the specific S4 deficit the kit exists to address. Resentment in the room suggests unresolved history that any Idealized Design work will run into unless acknowledged. Ambition without acceptance suggests the room is in denial about current constraints and will produce a plan that cannot survive contact with those constraints. The convener's mood-reading is not a soft skill; it is instrument reading, and the instruments are pointing at the neighborhood's viable-system state.

The Section 3 note about "almost every neighborhood is deficient in S4" now connects to this. Neighborhoods where S4 has been non-functional for a long time typically operate in some mixture of resignation (about what could be) and reactive vigilance (about what is coming next). The kit's Phase 1 through Phase 3 work is, at the mood layer, an invitation into acceptance and then into ambition and wonder — moods from which S4 can begin to function. This is not incidental to the kit's purpose; it is close to being the kit's purpose expressed in mood-terms.

## Speech acts as the structure of coordination

Fernando Flores's contribution, drawing on John Austin and John Searle, is that human coordination happens through a small number of distinguishable acts we perform in language. Recognizing which act is being performed changes what response is appropriate, what commitment has been made or not made, and where a coordination will succeed or fail.

Five speech acts form the working set for the kit.

**Assertions.** Claims about what is the case. "The linkage map shows three institutions with no connections." "Rent in this neighborhood rose 40 percent in five years." Assertions can be true or false; they invite evidence or dispute; they do not by themselves create commitment. Most conversation is made of assertions.

**Declarations.** Speech acts that bring something into being by being said, by someone with the authority to say them. "This meeting is closed." "You are hired." "I now pronounce you married." "This scenario is prioritized for Phase 4." Declarations require authority; they create new realities; they change what is possible from that moment forward. Convener declarations shape what the group takes as decided. Neighborhood declarations shape what the neighborhood takes as its own. Declaring what does not exist yet is the specific speech act that Idealized Design and scenario articulation require.

**Requests.** Speech acts that ask another party to perform an action, with conditions of satisfaction and a timeframe. "Would you draft the linkage map by Thursday?" "Would you convene the group for a scenario validation session next month?" A well-formed request specifies who is being asked, what is being asked for, by when, and under what conditions of satisfaction the request will be considered fulfilled. A vague request produces a vague response; a well-formed request creates the possibility of a well-formed promise.

**Offers.** Speech acts that propose to perform an action for another party, with conditions of satisfaction and a timeframe. "I could facilitate the retrospective if that would help." "I could bring three other people to the next meeting." Offers are the mirror of requests; they invite acceptance or decline; they create the same possibility of well-formed promise on acceptance. The Industry Platform's menu of adjacencies is a standing set of offers that MEs can accept on request.

**Promises.** Speech acts that commit the speaker to perform an action, with conditions of satisfaction and a timeframe. "I will have the linkage map to you by Thursday." "We will deliver the ME's first cycle of work by the end of Q2." A well-formed promise names who is committing, what they are committing to, by when, and under what conditions. Promises create futures that the speaker becomes accountable for. Broken promises break trust in specific and traceable ways; well-kept promises build it.

A sixth category, though not a distinct speech act, is worth naming as a discipline: the **declined request** and the **declined offer**. These are legitimate and often necessary responses that the kit should explicitly protect. A conversation in which requests and offers cannot be declined is not a real conversation; it is coercion pretending to be coordination. The convener's work includes protecting the ability to decline without penalty, because a coerced acceptance produces a broken promise later, and the broken promise costs more than the honest decline would have.

## Where speech-act discipline matters most

The kit's phases include several moments where speech-act discipline is load-bearing rather than optional. Failing at these moments produces the specific failures that between-institution work is famous for.

**Phase 2's WHY sequence.** The WHY question, asked from the POV of everyone present, produces declarations of purpose — each participant declaring what the work is for from where they stand. Declarations are the right speech act for this moment because purpose is brought into being by being said, not derived from evidence. Convener's work is to hold space for declaration rather than to invite assertion (as if there were a right purpose to be discovered). WHERE, WHEN, WHO follow as more declarations of context and commitment. The declarations become the ground for WHAT IS and WHAT MIGHT BE (assertions about the current state and declarations about the imagined future).

**Phase 3's weighted selection.** The selection produces a declaration by the group about which scenarios are prioritized. The weighted-input method from the CMG playbook distributes the declarative act across the group rather than concentrating it in the loudest voice. Convener's work is to make the declarative moment explicit — this is what we are declaring, together, as our priority — so that Phase 4's commitments have real ground to stand on.

**Phase 4's chartering.** Chartering is speech-act-dense. The scenario is declared as the object being addressed. The ME's Leading Targets are declared as what will be aimed for. Resource contributions are offers made by ecosystem-community members. Commitments to specific work are promises made by ME participants. The Value Added Mechanism is a joint declaration of how value will be shared when it arrives. The CfA-dSC contracts instrument these speech acts formally. The chartering fails when the speech acts are vague — when a promise is actually a hopeful wish, when a resource contribution is actually a maybe, when a Leading Target is actually a hoped-for outcome. The convener's discipline is to name each speech act as it happens, invite the well-formed version if the first version is vague, and protect the right to decline if that is the honest response.

**Phase 5's retrospective.** Retrospectives are assertions about what happened, declarations about what the group takes as learned, and often new promises about what will be done differently next time. The mood-reading of the retrospective is at least as important as the assertion-reading: a retrospective in resignation cannot honestly declare what was learned, because the mood forecloses the possibility that learning matters. Convener's work is to protect the retrospective from collapse into either premature celebration or unwarranted despair.

**Every Platform-ME conversation.** When a Platform actor talks with an ME leader about seeding, mentoring, or contracting, the conversation contains requests, offers, promises, and declarations. Each is either well-formed or not. Well-formed speech acts create traceable commitments and traceable ground for later settlement; vague speech acts create ambiguity that shows up later as broken trust or unrecoverable value chains. The Platform's compensation eventually depends on residents recognizing value received — which requires the value chain to have been well-formed in speech from the beginning.

## Moods and speech acts together — the coordination grammar

Moods and speech acts interact. A promise made in resentment lands differently than a promise made in acceptance. A request made in ambition invites a different response than a request made in resignation. A declaration made in serenity holds differently than a declaration made in fear. The convener who can read both layers together — the mood-ground the conversation happens on and the speech-act-structure the conversation is building — has instruments that most facilitators lack.

Some specific interactions worth naming.

An apparent values disagreement between two participants often turns out to be a mood mismatch about the same possibility. One is in ambition; the other is in resignation; they are talking past each other and hearing each other's positions as opposed values when they are actually opposed moods. The move that resolves the disagreement is not values-reconciliation; it is mood-recognition, followed by whatever work is needed to bring the moods into workable relation.

A promise made without acceptance of what will be required to keep it is a broken promise waiting to happen. Convener's work at chartering is to notice when a promise is being made in ambition without the acceptance-of-cost that would make it real, and to invite the promiser to re-examine before the promise is recorded.

A request declined in resignation is a different signal than a request declined in acceptance. Declined-in-acceptance means the requestee has good reasons and can articulate them; declined-in-resignation means the requestee cannot see the possibility of doing what is asked, which is diagnostic information about their mood-state, not about the request. The convener responds differently to each.

A declaration held in wonder can be revised as understanding develops; a declaration held in ambition without wonder tends to be defended even when it should be revised. Convener's work is to hold declarative moments open long enough for wonder to be present, so that what gets declared can breathe.

## What Section 7 commits the design to

Moods and speech acts are treated throughout the design record as a working layer, not as an optional appendix or specialist technique. Every phase's facilitation involves reading the mood-ground and holding the speech-act discipline. Every ME chartering involves well-formed speech acts and mood-recognition. Every retrospective involves both.

The vocabulary is available to be named at any moment when naming would help. The kit does not require anyone to become fluent before beginning. Vocabulary earns its way in through use, with progressive disclosure as the operating principle. Convener guidance includes when to name and when to work implicitly.

CfA-dSC is the substrate that will eventually instrument speech acts formally — promises captured as smart contracts, declarations recorded with attribution, offers and requests tracked in the coordination layer. The mature form of the kit runs on CfA-dSC as the speech-act instrumentation. The transitional form works with the vocabulary and the discipline without full instrumentation.

The Flores-Beer connection — speech acts as coordination grammar, moods as VSM signals — is left implicit in the convener-facing material but named explicitly in the design record for readers who want the theoretical substrate. Charles Spinosa, Bob Dunham, and the ontological-coaching literature are named as further reading; the design record does not attempt to replicate their curricula.

Section 8 returns to the between-institution project shape — now understood as the operational form Solution MEs take when they form around scenarios, negotiate value chains with the Industry Platform, and enter into speech-act-instrumented CfA-dSC contracts under the moods-and-speech-acts discipline described here.

---

That is Section 7, around 2500 words. The moods material is longer than the speech-acts material because the moods vocabulary is less familiar in most professional contexts and needed more grounding, while the speech-acts vocabulary is at least recognizable from Flores's diffusion through the coaching and coordination literature.

Three things worth your attention.

The six-moods set (resignation, resentment, acceptance, ambition, wonder, serenity) is my selection from a much larger space. Flores's own writing works with a shifting set; different practitioners emphasize different moods. If you have a specific working set from your own practice that differs, tell me and I'll revise. The six I chose are the ones I saw doing the most work in the design conversation and in the CMG substrate.

The five-speech-acts set (assertions, declarations, requests, offers, promises) is the standard Flores-Searle working set. I've added the sixth-category discipline around declining requests and offers because it's load-bearing for the kit and often gets omitted in Flores treatments. If you want a different working set, say so.

The "Mood as VSM signal" subsection makes a claim about Beer's treatment of moods that draws on *Diagnosing the System* and related material but doesn't reproduce a specific citation. If Kerry or Ward would want tighter Beer sourcing, I can develop that in an appendix. My inclination is to leave the main text as-is and add sourcing only if a reader requests it.

React, correct, or say go for Section 8.

---

**Marc** (2026-08-31 06:30):

Please write section 8

---

**Claude** (2026-08-31 06:32):

Drafting Section 8.

---

# Section 8 — The Between-Institution Project Shape

## What the between-institution project is

The between-institution project is the operational form a Solution ME takes when it addresses a customer scenario at neighborhood scale. It is a specific kind of work — different from a project internal to a single organization, different from a partnership between two organizations, different from a program run by a coalition. The shape is distinctive enough to deserve its own section, and stable enough across Marc's Medford, Spokane, and prior work that the pattern can be described operationally rather than in the abstract.

The between-institution project sits in the connective tissue among institutions, small groups, and residents. It is not owned by any single institution or small group. It exists because a scenario requires an ecosystem to address, and the ecosystem requires work between the parties that none of them would do on their own. The value the project produces is value that could not have been produced by any single participant working alone; that is why the project exists.

Thirty of Marc's Spokane linkage maps document this shape in canonical form. Each map has an Improvement node at the center, connected via WORKS ON edges to multiple Institution nodes, with additional relational edges among the institutions (SHARE_CLIENT, REQUEST_COORD, PRESENTS_TO, LEARNS_FROM, TRANSPORTS_CLIENT, MEMBER_OF). The Family & Individual node — the resident whose life the improvement serves — anchors most of the maps. The pattern is remarkably consistent across the thirty maps despite the substantive variation among them (acute care pharmacy transport, school-refugee transition, integrated addiction care, community-based screening for prevention, and so on). The Medford GGCS backlog contains sixty additional scenarios and project stubs at the same shape.

That consistency across a large corpus of real work is evidence that the shape is a stable pattern, not an artifact of one project's design choices. The design record can name the shape confidently and describe how MEs form to occupy it.

## Why between-institution work fails in the standard model

Between-institution work is famously difficult, and the reasons are well-documented in the coordination and collaboration literatures. Each participating institution has its own S3 (day-to-day management) that resists work exceeding its scope; its own S5 (identity and purpose) that shapes what it will and won't participate in; its own compensation structures for staff whose participation is unpaid overhead; its own accountability structures that make undertaking joint work politically expensive when the joint work fails; and its own risk-aversion that treats participation in something it doesn't control as a threat.

The standard responses to these difficulties are all versions of the same move: try to create a new institution to hold the between-institution work. Collective impact backbones, coalition secretariats, integrator organizations, network administrative organizations, backbone teams. The pattern is: recognize that between-institution work needs someone to hold it, and create a new organization to be that someone. The pattern reliably fails over time, because the new organization becomes an institution with its own S3, S5, compensation, accountability, and risk-aversion, and the between-institution work now has one more institution to work between rather than fewer.

Marc's diagnosis, arrived at across thirty years of doing this work in multiple locations, is that the standard response misidentifies the problem. Between-institution work does not need a new institution to hold it. It needs a durable object (the customer scenario) that persists across specific work attempts, a compensation mechanism (the Industry Platform's value-chain-embedded pay) that aligns the interests of the doers with the value received by residents, a temporary self-organizing team (the Solution ME) that forms to do specific work and dissolves when the work is done, and a founded commons (Section 4) where the shared work can happen without borrowed ground. None of these requires a new institution. All of them can be provided by RCN's substrate infrastructure and by Platform actors operating under the four principles from Section 2.

This is the structural claim the between-institution project shape rests on: the shape is doable at neighborhood scale under Rendanheyi mechanics precisely because Rendanheyi mechanics avoid the trap of creating new institutions to hold between-institution work. The MEs are temporary. They form for a specific scenario, they do the work, they dissolve. The scenario persists in the FedWiki repository. The value chain persists in the CfA-dSC ledger. The people persist in their SODOTO portfolios. The Platform persists as a set of relationships in the value chain. Nothing new needs to become an institution.

## The between-institution ME's composition

A Solution ME formed around a customer scenario draws its participants from wherever the scenario requires them. Some come from existing institutions (a school nurse, a social worker at Family Impact Network, a nurse practitioner from a Community Health Center, a peer support specialist from a recovery services organization). Some come from small groups already at work in the neighborhood (a community health worker network, a doula collective, a food bank's core volunteers, a mutual aid group's coordinators). Some come as individuals (a retired teacher, a family member of someone the scenario serves, a person with lived experience of the scenario's compound need).

What matters is not the participant's institutional affiliation but their capacity to contribute to the scenario's solution. The ME is composed of people who bring what the scenario requires, not of representatives of institutions with formal authority to speak for them. This is a crucial distinction that has structural implications.

**Participants participate as themselves, not as representatives.** A school nurse joining an ME contributes their capabilities, their portfolio, their zero-distance knowledge of what happens with children at the school. They do not join as "the school's representative" with authority to bind the school. If the school as institution needs to act, that is a separate negotiation between the ME and the school's leadership. Confusing the two — treating a participant as if their participation binds their institution — is one of the reliable ways between-institution work fails.

**MEs form quickly and dissolve when done.** A Haier ME in China can form in two to three days when someone grabs a scenario from the platform. A neighborhood ME will form more slowly at first as the SODOTO portfolios accumulate and the trust mechanisms mature, but the design commits to fast ME formation as the mature state. Standing committees, permanent working groups, and long-lived task forces are all failure modes to avoid — they turn into institutions.

**The Platform seeds and supports, does not run.** The Industry Platform actor helping an ME form (as described in Section 6) is the EMC-owner analog in Haier's sense. The Platform provides mentorship, seed capital, contract help, and connection to other MEs and institutions. The Platform does not run the ME. The ME's members are the ME's members; the Platform is a supporting node in the value chain.

**Compensation flows through the ME to its participants.** When the ME's work delivers value that residents recognize, the Value Added Mechanism specifies how compensation flows across the ecosystem community — to the ME's core participants, to ecosystem members contributing components or services, and to the Platform for its role in seeding. Institutional employees participating in an ME may receive compensation through the ME in addition to whatever their employer pays them for their regular role; the two compensations are distinct and both are legitimate. Small-group participants and individuals receive their compensation directly. The compensation structure aligns the incentives of all participants with the value residents receive, which is what makes between-institution work sustainable in a way that unpaid coalition participation is not.

## The scenario-to-ME formation sequence

The sequence from an articulated scenario to an ME doing work follows a specific pattern that the design record can name in operational detail.

**Scenario visibility.** A scenario lives in the FedWiki repository, articulated by an Experience-ME analog and validated through e-VSM survey work. The scenario is visible to anyone who browses the repository — Platform actors, potential ME participants, other Experience MEs, other neighborhoods considering forks.

**Interest formation.** Individuals, small groups, or institutional participants who see the scenario and recognize their own capacity to contribute begin conversations with each other and with the Platform. Interest is not yet commitment; it is the mood of ambition and wonder taking shape around a specific scenario.

**Ecosystem sketching.** The interested parties, often with Platform-actor help, sketch what an ecosystem community would need to look like to address the scenario. Which capacities are required? Which institutions or small groups have those capacities? Which specific people bring what specific contributions? This is not yet a formed ME; it is a working sketch of what the ME would need to be viable.

**Value chain specification.** The sketched ecosystem specifies the value chain: how the ME's work will produce recognizable value for residents, whose contributions will be needed at what stages, what the Leading Targets will be, how the Value Added Mechanism will share compensation across contributors. This is the negotiation that the CfA-dSC smart contracts will eventually instrument formally; in the transitional state it can be handled through more manual coordination with the same structural properties preserved.

**Chartering.** With the ecosystem sketched and the value chain specified, the ME charters itself. Charter is a declarative act (Section 7): the ME declares itself into being, with named participants making specific promises to specific work, ecosystem members making specific offers, the Platform making a specific commitment of seed capital, the scenario declared as the object being addressed, and the CfA-dSC contract instrumenting the commitments. Speech-act discipline at chartering is load-bearing; vague chartering produces broken promises later.

**Execution.** The ME does the work. Speed and specificity vary with the scenario; some scenarios can be addressed in weeks, others require years. The ME maintains contact with residents whose lives the scenario touches (zero-distance) throughout the work, and adjusts as what it learns changes what needs doing. The Platform is available for mentorship on request but does not manage.

**Retrospective and settlement.** When the work reaches whatever completion the charter specified, the retrospective assesses what happened: what residents actually received (measured through the neighborhood's own scorecard and the e-VSM survey), what the ME learned that others should know (fed back to the scenario's existing-attempts field), what the value chain settles as compensation to each participant. Settlement is a declarative act; the ME declares what has happened and what it means. The scenario returns to the repository, enriched.

**Dissolution or reconstitution.** The ME dissolves. Participants return to their base contexts (whatever institutions, small groups, or individual practices they came from) with their SODOTO portfolios enriched by the work. If the scenario turned out to require more work, either the same ME can charter a second cycle explicitly or a different ME can form around the enriched scenario. Nothing about the ME persists beyond the specific work chartered; the persistence lives in the scenario, the contracts, the portfolios, and the residents' recognition of value received.

## The school-refugee-transition worked example

Section 5 named the school-refugee-transition scenario as the worked example for the design record, on the reasoning that a refugee student is simultaneously a student in the school system, a child in a family with its own cultural and legal navigation needs, a resident of a neighborhood, a member of a diaspora community with its own internal support structures, and a client of health and social services. The polycentric structure lives in the fact pattern; the frame surfaces it rather than imposing it.

The Spokane #7 linkage map documents the between-institution shape for this scenario in one form. The map's Improvement node ("School-Refugee Transition") connects via WORKS ON to five Institution nodes: Schools, World Relief, CHW Network, Family & Individual, and by implication the health-provider institutions where CHWs coordinate. The relational edges include SHARE_CLIENT (between institutions serving the same family), PRESENTS_TO (between the family and the schools, between the family and World Relief), and REQUEST_COORD (between institutions requesting coordination with each other, and between the CHW Network and the other institutions).

Translated into ME terms, the scenario would invite a Solution ME to form around the compound question: what does the first year in a US school look like for a refugee student, and what would it take across the ecosystem of school, family, cultural community, health, and social services for that first year to go well for the student and the family? The ME's composition would depend on the specific neighborhood context, but plausibly would include:

- A school nurse or school counselor with zero-distance knowledge of what typically happens at enrollment and in the first weeks
- A resettlement-agency staff person with knowledge of the family's arrival context and the legal-cultural navigation they face
- A community health worker from the neighborhood's CHW network with existing relationships in the refugee community
- A parent from the same or an earlier refugee cohort whose lived experience informs what actually helped and what didn't
- A teacher or two from the school where enrollment happens
- A cultural or religious community leader from the refugee community whose network is where the family will actually seek support
- Platform-actor support from Carl or an East County equivalent, or whoever is convening the neighborhood the school serves

The ME's Leading Targets would be specific to what the ecosystem could actually deliver: a coordinated intake process that captures the family's context without re-traumatizing; a designated navigator (probably the CHW) whose role is understood by every participating institution; regular check-ins at named intervals; a shared understanding of what school-family communication requires when the family's English is limited and the school's cultural competence is uneven; a specific commitment about what happens when something goes wrong at school (the family's first instinct may not be to contact the school directly).

The Value Added Mechanism would specify how compensation flows when the year goes well as measured by the neighborhood's scorecard — with input from the family, from the school, from the resettlement agency, from the cultural community — through the ecosystem: to the CHW who did the navigation work, to the school nurse whose zero-distance knowledge shaped the design, to the community leader whose network held the family, to the Platform actor whose seeding made the ME possible.

If the year goes badly — if the family withdraws, if the student's grades suggest untreated difficulty, if the family reports feeling isolated or misunderstood — the settlement is correspondingly small, and the scenario returns to the repository with what was learned about what didn't work. The next ME to form around the scenario (which may be substantially the same people, chartered afresh, or different people entirely) benefits from the enriched scenario rather than starting from zero.

The polycentric structure is visible throughout. The student is at the intersection of the school as viable system (with its own S1-S5 at the school-district recursion level), the family as viable system (with its own S1-S5 at household scale), the cultural community as viable system (with its own S1-S5 at community-of-affiliation scale), the neighborhood as viable system (with its own S1-S5 at the geographic recursion level the kit operates on), and the health-and-social-services provider ecosystem (with its own S1-S5 at whatever institutional recursion each provider occupies). The between-institution project navigates all of these simultaneously. That is what makes it hard, and that is what makes the Rendanheyi mechanics necessary — no single institution's operational logic can hold the whole scenario, so the ME has to form specifically to be the connective tissue that no single institution can be.

## What Section 8 commits the design to

Between-institution work is understood throughout the design record as the operational form Solution MEs take when they address customer scenarios. It is a distinctive shape, well-documented across Marc's prior work at Spokane and Medford, stable enough to be described in canonical form.

The standard response to between-institution work — create a new institution to hold it — is understood as a failure pattern that the design record commits to avoiding. Between-institution work is held by durable objects (scenarios), by structural mechanisms (Industry Platform, CfA-dSC contracts, SODOTO portfolios), and by temporary self-organizing teams (MEs), not by new institutions.

Solution ME composition draws from wherever the scenario requires — institutional participants, small-group members, individuals — with participants participating as themselves rather than as institutional representatives. MEs form quickly and dissolve when their chartered work is done. The Platform seeds and supports but does not run. Compensation flows through the ME to its participants via the Value Added Mechanism as residents recognize value received.

The scenario-to-ME formation sequence (visibility, interest, ecosystem sketching, value chain specification, chartering, execution, retrospective, dissolution) is the operational pattern that the kit's phases produce and the CfA-dSC substrate will eventually instrument.

The school-refugee-transition worked example illustrates the shape in concrete form and preserves the polycentric structure that this scenario type makes visible.

Section 9 develops the catalytic seed capital principle in operational detail — how much, on what basis, deployed by whom, evaluated against what, recovered how — as the specific form Section 2's Principle Three takes when it meets the ME formation sequence described above.

---

That is Section 8, around 2500 words. Long, but between-institution project shape is what everything upstream in the design record has been building toward, and the shape had to be described specifically enough that a convener could recognize it and support MEs forming to occupy it.

Three things worth your attention.

The "why between-institution work fails in the standard model" subsection makes a strong claim: that creating a new institution to hold between-institution work is a reliable failure pattern. This is your diagnosis from thirty years of practice, and I've stated it as such. If you want it softened, or if you want additional acknowledgment of the specific coalition-and-backbone literature (Kania and Kramer's collective impact, network administrative organization literature) that has tried to work this problem, I can add that. My inclination is to leave the claim strong — you have the standing to make it — and to name the literature only if a reader needs it.

The school-refugee-transition worked example runs about 500 words. Some design records would compress a worked example further; I've kept it at this length because the polycentric structure the scenario makes visible is one of the design's most important claims and needed enough treatment to actually show the polycentricity rather than merely assert it. Say if you want it trimmed.

The section commits to CfA-dSC as the substrate that will eventually instrument ME chartering and compensation formally. This assumes CfA-dSC matures in the direction the current work is heading. If CfA-dSC ends up pointing somewhere different than currently planned, this section will need revision — but that's true of every section touching CfA-dSC, and I've flagged the substrate dependency here as I have throughout.

React, correct, or say go for Section 9.

---

**Marc** (2026-08-31 09:25):

Section 9

---

**Claude** (2026-08-31 09:26):

Drafting Section 9.

---

# Section 9 — Catalytic Seed Capital

## What catalytic capital is and is not

Money enters the work described in this design record in one form only: catalytic seed capital that funds new work at its launch and departs when the new work has become self-sustaining or when it has failed. This form is distinct from the several other forms money commonly takes in philanthropic and public-sector work, and the distinctions matter because the failure modes of the other forms are exactly what the design exists to prevent.

Catalytic seed capital is not operating subsidy. Operating subsidy funds ongoing work at whatever level it takes to keep the work going. It creates dependency by design: the recipient becomes dependent on the subsidy's continuation, and the funder acquires ongoing power over the recipient's decisions. Operating subsidy is what most philanthropic grant-making effectively becomes over time, whatever its original framing. The pattern is well-documented and reliable.

Catalytic seed capital is not project funding in the standard sense. Standard project funding pays for a discrete piece of work, usually scoped, budgeted, and timelined by the funder or by the recipient in dialogue with the funder's priorities. It funds work that would happen more or less the same way if the funder chose it or a different one. It does not catalyze new work; it selects among existing candidates for work that could happen anyway.

Catalytic seed capital is not investment in the venture-capital sense. Venture investment expects financial return proportional to risk taken, and the return flows to the investor rather than to the residents whose lives the venture affects. The venture's success is measured in the investor's terms; the community whose problem the venture addresses is treated as market rather than as beneficiary.

What catalytic seed capital is: money that enables an ME to try something it otherwise could not, sized to make the launch possible, structurally shaped so that it departs when the ME either succeeds and becomes self-sustaining or fails and dissolves. The catalyzing happens because a launch that could not have happened without the capital now happens. The departure happens because the capital's job is done at launch, not because of any external judgment about when to withdraw.

## The catalyzability test

The Industry Platform, when considering whether to seed a Solution ME forming around a scenario, applies a specific test: is this catalyzable? The test is not "is this a good project" or "does this address a real need" or "would this create value if it worked." Those are all easier questions and all less useful. The catalyzability test asks: will the seed capital do its work and then be able to step away, or is this a request for ongoing subsidy dressed as a launch?

Answering the question requires distinguishing between two different situations that look similar on the surface.

The first situation: the ME needs capital to acquire capabilities, relationships, tools, or presence that, once acquired, become part of the ecosystem's ongoing operational capacity. A CHW network that receives seed capital to hire and train its first cohort of workers, whose ongoing work then generates the fees or grants or referral revenue that sustains the network, has been catalyzed. The seed capital enabled the acquisition; the acquired capacity now runs on its own metabolism. The Platform's role in that ME is done at launch.

The second situation: the ME needs capital to do work that has no self-sustaining metabolism, and the work will need capital continuously in order to continue. A program that provides a specific service to residents and requires ongoing funding to continue providing that service is not being catalyzed by seed capital; it is being subsidized. The seed framing is aspiration; the operational reality is dependency.

The distinction is often unclear at the moment of ME formation. Some MEs that appear catalyzable turn out to be subsidy-shaped once execution begins; some that appear subsidy-shaped turn out to develop unexpected self-sustaining metabolism. What matters is that the Platform asks the question honestly at formation and re-asks it during execution. The catalyzability test is a discipline, not a formula.

Elders who have seen the pattern many times are better at this discipline than newcomers. Marc's thirty years of work in this space produces catalyzability judgments that a first-year foundation program officer cannot match, not because the elder is smarter but because the pattern is only visible through many repeated cases. This is one of the specific reasons the Platform actors must be elders — the catalyzability judgment they bring is capacity that cannot be substituted by training or process.

Elders also fail this test in specific ways worth naming. They can become attached to particular kinds of work and want to seed instances of it whether or not the specific instance is catalyzable. They can become resigned about a domain and refuse to seed real opportunities because they've been burned before. They can lose the distinction between the pattern they know and the specific case in front of them. The Platform's compensation structure — outcome-dependent, downstream, variable — is what corrects for these tendencies over time. An elder whose seeding judgments fail catalyzability tests reliably will see their compensation decline; that signal is more honest than any peer review process would be.

## Sizing

The size of catalytic seed capital is set by what the launch requires, bounded by what the Platform can deploy without over-committing to any single ME, and shaped by the specific structure of the scenario the ME is addressing.

The lower bound is what the ME actually needs to launch. Under-seeding to spread capital across more MEs is a failure mode; MEs that launch under-capitalized fail more often, and each failure represents lost work, lost portfolio accumulation, and lost residents-received value that a well-seeded ME might have produced. The Platform's compensation depends on ME success; under-seeding to appear frugal actively harms the Platform's own long-term compensation.

The upper bound is what the launch actually requires. Over-seeding creates its own failure mode: the ME becomes dependent on the seed capital as ongoing budget rather than treating it as launch fuel. Once an ME's operations scale to consume a specific level of continuous funding, the ME cannot easily contract back to a self-sustaining scale; the over-seeded ME either becomes a subsidy case or dissolves painfully. Over-seeding also concentrates the Platform's capital in fewer MEs, reducing the diversity of scenarios that can be seeded and the diversity of learning that returns to the repository.

Between these bounds, the specific size depends on the scenario, the ME's composition, the ecosystem community's other contributions, and the expected timeline to self-sustainability or completion. Some MEs need substantial capital because their launch involves acquiring durable infrastructure (equipment, physical space commitments, technology systems). Others need modest capital because their launch is primarily about assembling relationships and negotiating agreements, with the operational work happening through participants' existing roles and contributions.

There is no universal formula. The Platform actor's judgment, informed by pattern-recognition across many MEs, is what sizes the capital. Over time, portfolio data accumulated in SODOTO makes the pattern visible: MEs of shape X seeded at size Y in context Z tend to produce outcome W. Platform actors can calibrate against this data. The judgment does not become mechanical, but it becomes better informed.

## Deployment mechanics

The mechanics of how seed capital moves from the Platform to the ME depend on RCN substrate that is in active development. In the mature form:

The ME's charter (Phase 4 in the kit's phase structure, described in Section 8) includes the Value Added Mechanism specifying how compensation will flow across the ecosystem community when the work delivers residents-recognized value. The seed capital's deployment is the first commitment in the Value Added Mechanism — the Platform's contribution enabling the launch — and its recovery mechanism is specified alongside.

CfA-dSC instruments the deployment as a smart contract. The contract encodes the promises (the ME's commitments to specific work, the Platform's commitment of specific capital), the offers (ecosystem members' contributions), the declarations (the scenario being addressed, the Leading Targets being aimed for), and the settlement conditions (how the Value Added Mechanism will divide value when it arrives, how residents' recognition will be assessed).

The Overall Schema tracks the ME as a node in the graph, with edges to the scenario it addresses, the Platform actors seeding it, the ecosystem members participating in it, the founded commons where the work happens, and the residents whose lives the scenario touches. Graph queries can surface patterns across MEs, help Platform actors see cross-ME learning opportunities, and provide the substrate for the retrospective work at Phase 5.

SODOTO portfolios attach to individual participants (ME core members, ecosystem contributors, Platform actors) and accumulate their traces of work — what they contributed, what value flowed, what they learned. The portfolios are the persistent record of who has done what over time, and they feed the trust mechanisms that eventually make the mature marketplace possible.

In the interim before the substrate is fully operational, deployment can happen through more manual coordination that preserves the structural properties. What matters is that the structural properties survive the manual phase intact: outcome-dependence, downstream-flow, ability to return small or zero, alignment of Platform compensation with ME success, alignment of ME compensation with residents-received value.

## Recovery and reuse

Catalytic seed capital that has done its work becomes available for the Platform to deploy again to seed new MEs. This is what makes the Platform sustainable at cluster scale — capital cycles through, catalyzing successive waves of new work rather than being deployed once and then requiring ongoing replenishment from external sources.

The specific recovery mechanism depends on the ME's shape. Some MEs, once launched, generate revenue streams (fees, service payments, grants for continuing operations) that can include a return-to-Platform component as part of the Value Added Mechanism. Others produce value that residents recognize but that does not generate financial revenue; in those cases the "recovery" is portfolio and scenario enrichment rather than capital return, and the Platform's compensation comes through its shared Value Added Mechanism proportion rather than through capital recovery.

MEs that fail do not return capital. That is by design. Failure is expected and priced into the Platform's aggregate model. The failed ME's contribution is the enrichment of the scenario in the repository — what was tried, what didn't work, what the next team should know. That contribution has real value even when no financial recovery is possible, and the Platform's model accounts for it.

The aggregate model requires that successful MEs return enough capital in total, across enough time, to fund continuing seed deployments plus the Platform's own compensation. The precise economics depend on ME success rates, capital sizing, Value Added Mechanism specifications, and the specific mix of financial-recovery and portfolio-enrichment outcomes. The design record cannot specify the aggregate model in detail because WWHA's initial deployment will be the first real test of it at scale, and the model will develop empirically.

Two design commitments constrain the model without specifying it. First, the Platform cannot become dependent on any single funding source (foundation, government grant, individual donor) in a way that gives that source control over which MEs get seeded. Diversified funding is not merely prudent; it is structurally necessary to prevent capture. Second, the Platform's own compensation must remain outcome-dependent even when capital sources are guaranteed for a period. Guaranteed capital sources can be used to seed more MEs; they cannot be used to pay Platform actors on a fixed basis, because that would violate Principle Two from Section 2.

## The catalytic principle applied across scales

Section 2's Principle Three — catalytic seed capital that departs — has now been treated at ME formation scale. The same principle applies at other scales the design record touches.

At the neighborhood scale, the kit itself is catalytic. Convenors run the kit's phases in a neighborhood and then step back. If the neighborhood cannot absorb the pattern and continue without the convener, the kit has failed to be catalytic. If it can, the convener moves on. The pattern of raise-your-kids-and-set-them-free from Section 2 applies to the kit's own presence in a neighborhood.

At the founded-commons scale, the seed principle applies to how new founded commons emerge from participation in aging ones (Section 4). Elders founding new founded commons receive whatever catalytic support the Platform can provide — mentorship, seed capital where relevant, connection to other founders — and set the new commons free when it can sustain itself.

At the Platform scale, WWHA itself is a first-generation instance of an Industry Platform for neighborhood-cluster work. Whatever RCN provides in support of WWHA's launch is catalytic. WWHA becomes self-sustaining through its own compensation mechanism and its own diversified capital base, or it fails and enriches the scenario of "how to launch a neighborhood-catalyzing Industry Platform" in the RCN repository. The Fledge and Leo's are analogous instances at their own recursion levels. Cross-Platform learning happens through the same fork-and-modify pattern that scenarios use.

At the individual scale, the principle appears in the elder-succession work. Elders who have been Platform actors, convenors, or ME leaders eventually release those roles as they age. The releasing is itself catalyzed — often through mentorship of younger neighborhood people who take up the roles — and it happens whether or not any specific successor is ready, because holding on past the release point is itself a failure mode. The generation ahead prepares the ground; whether the next generation grows in it is not fully within the elder's control.

The catalytic principle across scales is Vester's biological logic — new things emerge from old things through variation and selection, not from blueprints applied top-down. Each scale of catalytic work is preparation for the next scale; each scale's success is measured by what it enables to grow rather than by what it holds in place.

## What Section 9 commits the design to

Money enters the work as catalytic seed capital, not as operating subsidy, standard project funding, or venture investment. The catalyzability test distinguishes real launches from subsidy requests dressed as launches, and the test is applied by elders whose pattern-recognition is the specific capacity that Platform actors bring.

Capital sizing is set by what launches actually require, between the lower bound of under-seeding failure and the upper bound of over-seeding dependency. There is no universal formula; the Platform actor's judgment, calibrated over time by portfolio data, is what sizes each specific ME.

Deployment happens through CfA-dSC smart contracts in the mature form and through more manual coordination in the interim, with the structural properties (outcome-dependence, downstream-flow, small-or-zero-return possibility, alignment with residents-received value) preserved in both.

Recovery flows back to the Platform for reuse in seeding new MEs, through mechanisms that vary by ME shape. Failed MEs do not return capital; failure is expected, priced into the aggregate model, and produces value through scenario enrichment. Successful MEs return enough capital in aggregate to sustain the Platform's continuing seed deployments plus its own compensation.

The Platform cannot become dependent on any single funding source in a way that would give that source control over seeding decisions. Diversified funding is structurally necessary. And the Platform's own compensation must remain outcome-dependent even when capital sources are guaranteed for a period, because fixed-basis pay violates Principle Two from Section 2.

The catalytic principle applies across scales: to the kit's presence in a neighborhood, to founded-commons succession, to Platform launches, to elder-succession work. Each scale prepares the next; each scale's success is measured by what emerges from it.

Section 10 develops the value definition — "value created by residents for residents and their neighbors, recognized by them, measured by their instruments" — in operational detail, including how the neighborhood-authored balanced scorecard is constructed, how residents' recognition is assessed, and how the e-VSM survey layer supports the assessment.

---

That is Section 9, around 2300 words. Substantial because catalytic seed capital is where the design's compensation logic meets the operational reality of moving money, and both had to be treated precisely enough that the substrate developers (CfA-dSC, SODOTO, WWHA) can build against the specification.

Three things worth your attention.

The "aggregate model" discussion under Recovery and reuse is deliberately underspecified — I've said the model will develop empirically through WWHA's initial deployment rather than trying to name specific ratios or success rates. If you have working numbers from prior thinking (target ME success rates, target portfolio composition, target return-to-Platform percentages), we can add them. My inclination is to leave the aggregate model as an empirical question the first years of operation will answer, and to have the design record commit to the structural properties rather than the specific numbers.

The "elders who fail catalyzability tests reliably will see their compensation decline" claim in the Catalyzability Test subsection is a strong statement about how the compensation structure disciplines elder judgment. It's honest and it follows from Principle Two, but it may sound harsher than you want it to sound in a document Carl, Chris, Jerry, and Brent will read. Say if you want it softened.

The cross-scale application in "The catalytic principle applied across scales" pulls together threads from Sections 2, 4, 6, and 8. Some readers may find this repetitive; others will find it clarifying. My inclination is to keep it — the cross-scale point is one of the design's most important claims and benefits from the repetition — but I can compress if you prefer.

React, correct, or say go for Section 10.

---

**Marc** (2026-08-31 09:37):

Create section 10

---

**Claude** (2026-08-31 09:39):

Drafting Section 10.

---

# Section 10 — Value: Created by Residents for Residents and Their Neighbors, Recognized by Them, Measured by Their Instruments

## Why value gets its own section

Every section of the design record has referred to value. Section 2 named the fourth dependency-elimination principle in terms of value created by residents for residents and their neighbors. Section 5 anchored the customer scenario in what would constitute value for the residents whose lives the scenario touches. Section 6 tied Industry Platform compensation to residents' recognition of value received. Section 8 grounded the Solution ME's Leading Targets in the value the ecosystem community was chartered to produce. Section 9 conditioned catalytic capital's recovery on value that residents recognize.

If value in all these usages meant the ordinary thing — outcomes measured against outsider-authored frameworks, benefits assessed by evaluators, impacts scored against standard metrics — the design would collapse into the philanthropic-industrial pattern the four principles from Section 2 exist to prevent. The design's coherence requires that value mean something specific and different, and that the operational mechanisms for producing, recognizing, and measuring value be developed with the same care as the other structural components.

That is what this section does. Value is defined precisely, the mechanisms for its production and recognition are specified, the instrumentation for its measurement is described, and the anti-capture properties that keep the definition from drifting back toward outsider-authored standards are made explicit.

## The definition, unpacked

The full form of the definition arrived through the design conversation in Marc's own words: value created by residents for residents and their neighbors, with neighbors defined by the value creators themselves. Each element does work worth naming.

**Created by residents.** The value's origin is in the residents' own agency, not in an external provider's contribution to residents. This is a strong claim. It rules out framings in which an outside organization creates value that is then delivered to residents; the residents in that framing are recipients, not creators. In the design's framing, residents are the primary actors — the neighborhood's small groups, the founded commons' users, the ME participants, the neighbors of neighbors — and the value comes into being through what they do. External contributions (Industry Platform capital, Platform actor mentorship, kit facilitation, substrate infrastructure) support the residents' creation of value; they do not substitute for it.

**For residents and their neighbors.** The value's beneficiaries are the residents themselves and the people the residents count as their neighbors. This closes the loop between value creation and value reception within the neighborhood's own ecology, rather than routing benefits outward to shareholders, investors, funders, or outside evaluators. When an ME successfully addresses a customer scenario, the value produced flows to residents living inside that scenario and to the people they count as connected to their situation.

**With neighbors defined by the value creators themselves.** This clause is the most important. It refuses the standard move of having outsiders define who counts as legitimate beneficiary — service-area boundaries, eligibility criteria, target populations, protected classes. The residents creating value define, in their own terms, who counts as their neighbor for the purposes of this scenario and this value. A refugee family may count their extended kin, their cultural community, the neighbors on their block, and their child's classmates as neighbors; the definition emerges from them, not from an external framework. This clause is what makes the value definition genuinely neighborhood-authored rather than merely neighborhood-delivered.

**Recognized by them.** Value that residents do not recognize is not value under this definition, regardless of what outside assessors may say about it. This is a stringent test. A well-designed intervention that produces measurable improvements in indicators the residents don't care about, or improvements the residents don't experience as improvements, or improvements to which the residents attribute other causes, has not produced recognized value. The recognition is done by the residents themselves, in their own terms, using their own instruments.

**Measured by their instruments.** The instruments through which value is seen are the neighborhood's own instruments. The balanced scorecard is neighborhood-constructed and neighborhood-maintained. The surveys are neighborhood-authored. The retrospectives happen in the neighborhood's own founded commons, in the neighborhood's own language, on the neighborhood's own timeline. External instruments (foundation evaluation frameworks, state agency outcome metrics, academic assessment methodologies) may exist and may inform the neighborhood's instrument-construction if the neighborhood chooses, but they do not substitute for the neighborhood's own measurement.

Together these five elements define value in a form that structurally resists the capture patterns that have collapsed most attempts at neighborhood-scale civic work over the past century. Each element closes a specific door.

## The neighborhood-authored balanced scorecard

The balanced scorecard is the operational form of the neighborhood's value-measurement instrument. It sits at the center of the Industry Platform's compensation mechanism, the ME retrospective cycles, and the accumulation of scenario-enrichment data over time.

"Balanced" here means what it meant in Kaplan and Norton's original 1990s formulation — measurement across multiple dimensions rather than reduction to a single dimension. But the dimensions themselves are neighborhood-authored rather than inherited from Kaplan and Norton's four (financial, customer, internal process, learning and growth). What matters is that the neighborhood constructs a scorecard that captures what value means to that neighborhood in enough distinct dimensions that no single dimension can be gamed against the others.

Section 6 named some starting candidates for dimensions a neighborhood might include: resident well-being outcomes tied to specific ME work; between-institution linkage improvements that survived beyond seed capital; neighborhood capacity growth beyond the ME's own participants; portfolio depth of individuals involved; founded-commons health; ME viability without further seed; replicability of patterns created; cultural fit and neighborhood legitimacy. These are candidates, not a template. Each neighborhood produces its own set, informed by what has come up in the neighborhood's Phase 2 meetings, what residents have named as important, and what the ME's specific scenario requires attention to.

The Platform's role in scorecard construction is skilled but bounded. The Platform actor helps the neighborhood construct a scorecard that will show its own value creation clearly — that requires knowledge of how scorecards can be well or badly constructed, which dimensions tend to work and which tend to fail, how to phrase items so they capture what they intend to capture. But the Platform actor does not hand the neighborhood a template. The scorecard emerges from the neighborhood's own naming of what matters, with the Platform actor's help in making sure the naming produces something that can actually function as an instrument.

Because the Platform's own compensation depends on the neighborhood's scorecard (as described in Section 6), the Platform has strong incentive to help construct a scorecard that is real rather than one that flatters the Platform's contribution. Two-way discipline is built into the instrument itself. A Platform actor who tries to soften the scorecard to make their own compensation easier will find that the softened scorecard fails to reflect what residents actually recognize, and the compensation flows dry up regardless of how favorable the softened metrics appear.

The scorecard is not static. It develops as the neighborhood's Phase 2 conversations return, as MEs surface new understandings of what the scenarios they address require, as residents' own experience of what matters shifts. The Platform maintains the scorecard as a living instrument, revised on the neighborhood's timeline rather than on any external review cycle.

## Rasch measurement as the methodological substrate

The methodological substrate that allows neighborhood-authored scorecards to function as real measurement instruments is Rasch analysis, from the same measurement tradition Marc worked in with Benjamin Wright at the University of Chicago and applied through the Robert Wood Johnson Foundation's Pursuing Perfection program. Rasch is not the only possible substrate, but it is uniquely well-suited to what neighborhood scorecards need to do.

Rasch measurement holds a specific property: it calibrates items to an underlying latent construct along a shared dimension, while allowing the specific items measuring that construct to vary across contexts. This is exactly what neighborhood-authored scorecards need. The dimensions of value that show up across neighborhoods can be comparable enough to be usable across the cluster the Platform serves, while the specific items measuring those dimensions in any given neighborhood can be authored in that neighborhood's own language, culture, and priorities.

Practical implications for the design:

A dimension like "residents' recognition of value received from ME work" is a latent construct that can be measured through many possible item sets. A neighborhood scorecard might include items like "I have noticed changes in how [scenario area] works for my family in the past six months" or "People in my building talk about how this is different now" or "My kids' school has changed something about how they handle [specific situation]." Different neighborhoods will phrase these items differently; the same underlying construct is being measured; comparisons across neighborhoods are meaningful even where the specific items differ.

A dimension like "between-institution linkage improvement that survives beyond seed capital" is another latent construct with many possible item sets. Different neighborhoods will find different specific items that reveal this construct; Rasch calibration lets those different items sit along the same underlying dimension.

The CAM work in RCN's substrate — Civic Activation Measure, the 40-item Rasch-modeled instrument for civic engagement — is the methodological precedent. The scorecard's dimensions can be developed using the same architecture, with Winsteps or similar Rasch analysis software providing the calibration infrastructure. The CAM's open-governance clause (all items, calibration data, and control files published in commons) is a model for how scorecard dimensions should be developed and maintained across neighborhoods.

Rasch is not required for every neighborhood scorecard. Simpler measurement approaches (frequency counts, Likert-scale summaries, qualitative narratives) can serve where they fit. What Rasch provides is the option of psychometrically real measurement when the neighborhood or the Platform needs to be confident that dimensions measure what they claim to measure, and when cross-neighborhood comparison is required for Platform-scale learning.

## The e-VSM survey layer

The e-VSM survey family — Survey, Diagram, Dialogue — provides the multi-perspective read that scorecards and retrospectives need. e-VSM's operational architecture is developed in the RCN substrate work; here the design record names its role in the value-measurement layer.

At Pre-Phase 1, an e-VSM survey of the neighborhood or the potentially-emerging neighborhood surfaces whether the substrate is present — small groups working, founded commons, cross-sphere relationships — through multi-perspective structured input rather than through the convener's own judgment. The Generic Neighborhood Development Center survey (11 spheres, 66 directed edges, Markov Blanket layer mapping) is the specific instrument this design record contemplates using.

At Phase 2 preparation, participants surveyed before the linkage-mapping meeting bring multiple perspectives to the room before the loudest voice sets the frame. The survey's Claude API synthesis produces integrated reads of what respondents are saying, with world-set filters (Exclusive/Inclusive) letting the neighborhood examine its own diversity of perspective rather than collapsing to a consensus view.

At scenario validation, once a scenario has been articulated, an e-VSM survey of the broader neighborhood assesses whether the scenario is real, whose experience it reflects, and what it misses. Scenarios that survive validation get Solution ME formation; scenarios that do not get revised or archived with what was learned.

At Phase 5 retrospective, e-VSM surveys how the ME's work has landed across the neighborhood's spheres. The scorecard's dimensions inform survey item construction; the survey provides the multi-perspective evidence that supports (or fails to support) the scorecard's assessment.

Claude's operational role across these uses is the interpretation and integration Marc's e-VSM design contemplates. Claude reads the survey evidence and surfaces suggestions; the convener, the Platform actors, and the neighborhood participants use those interpretations as inputs to their own judgment. Claude does not substitute for the neighborhood's own recognition; Claude provides synthesis that makes the neighborhood's own recognition more visible than raw survey data would be.

## Recognition as an act, not a metric

Recognition of value is a specific human act, not a metric that instruments produce automatically. This distinction matters because instruments can produce numbers that look like recognition without any actual recognition having happened.

A resident recognizes value when they experience the value in their own life or in the life of someone they count as a neighbor, understand what happened as connected to specific work (an ME's activity, a scenario being addressed), and can articulate the connection in their own terms. All three components matter. Experience without articulation is data. Articulation without experience is testimony. Connection to specific work distinguishes recognized value from generic goodwill.

Recognition happens in conversation, in survey response, in retrospective participation, in whether people show up again when invited. It also happens in absence — value that produced no recognition (however measured) has not been recognized, whatever the measurement instruments suggest.

The design's commitment is to preserve recognition as human act, supported by instruments but not replaced by them. The scorecard's numbers, the e-VSM survey's syntheses, and the retrospective's narratives are all inputs to a determination that residents did or did not recognize value from this specific ME's work. The determination itself is made by the neighborhood, not by the instruments. Platform compensation flows according to the determination, not according to the instruments alone.

## The anti-capture properties

The value definition's structural anti-capture properties are what make it different from ordinary outcome-based funding, and they are worth naming explicitly.

**Outsiders cannot originate the scorecard.** WWHA's board, funders, state agencies, evaluators, and academic partners can contribute methodological help, suggest possible dimensions, and offer to fund neighborhoods whose scorecards they find credible. They cannot substitute their scorecard for the neighborhood's judgment of what has been received. This is a governance constraint on WWHA itself and belongs in WWHA's charter as a founding limit.

**Grantmakers who dislike a neighborhood's scorecard have one legitimate response: decline to fund.** They do not get to negotiate the scorecard toward their own preferences as a condition of funding. That negotiation would be the capture pattern the design exists to prevent, and the ability to walk away is what protects the neighborhood's authorship.

**Neighborhoods with scorecards that funders reject may still function.** Diversified funding sources means no single funder's rejection can starve a neighborhood whose scorecard the funder disagrees with. The Platform's aggregate model must maintain enough diversity of capital sources that any single source's departure is survivable.

**Scorecard revisions cannot be triggered by funder pressure.** The neighborhood revises its scorecard on its own timeline, informed by what the neighborhood learns from its own experience. Funder feedback may be one input the neighborhood considers, but the decision to revise is the neighborhood's alone. Revisions triggered by funder pressure violate the definition.

**Recognition cannot be manufactured through instrument design.** Instruments that produce apparent-recognition without corresponding lived experience are failures of instrument design, not evidence of recognition. The design record's Rasch commitment includes commitment to psychometric honesty — items must actually measure what they claim to measure, not merely produce numbers that appear to.

**The neighborhood's "no" is respected.** A neighborhood that determines an ME's work produced no recognized value has produced a legitimate assessment, even where evidence-of-outputs and process-of-work suggest the ME did its job. The design does not allow the ME to appeal the determination to any higher authority — the residents' determination is final within the value definition's own terms. This is what distinguishes recognition from evaluation.

## What Section 10 commits the design to

Value throughout the design record means what this section has defined: value created by residents for residents and their neighbors, with neighbors defined by the value creators themselves, recognized by the residents and measured by their own instruments. No looser or more inclusive definition is available for use anywhere in the design.

The neighborhood-authored balanced scorecard is the operational form of the value-measurement instrument. Each neighborhood constructs and maintains its own; dimensions are candidates rather than templates; the Platform helps with scorecard construction but does not substitute its own judgment for the neighborhood's.

Rasch measurement is the methodological substrate that allows scorecards to function as real instruments while remaining neighborhood-authored. The CAM work is the precedent. Rasch is not required for every scorecard but is available when the neighborhood or Platform needs psychometrically real measurement or cross-neighborhood comparison.

The e-VSM survey layer provides multi-perspective input at multiple phases — Pre-Phase 1 diagnostic, Phase 2 preparation, scenario validation, Phase 5 retrospective. Claude's API-driven synthesis of survey results makes multi-perspective evidence usable without substituting for human recognition.

Recognition is a specific human act supported by instruments rather than replaced by them. Instruments provide input; the neighborhood's determination is what constitutes recognition; Platform compensation flows according to the determination.

The value definition's structural anti-capture properties (outsiders cannot originate the scorecard, grantmakers can only decline to fund, revisions cannot be triggered by funder pressure, the neighborhood's "no" is respected) are the specific mechanisms that keep the value definition from drifting back toward outsider-authored standards.

Section 11 addresses the prior-work substrate that this design record rests on and carries forward — CMG's 2016 methodology, the Medford and Spokane implementations, the thirty-year arc of Marc's related work, and the specific tools and frameworks (Ackoff's Idealized Design, Beer's VSM, Ostrom's polycentricity, Vester's biocybernetics, Meadows' leverage points, McKnight's associational-versus-service distinction, Flores' speech acts, Rasch measurement) that constitute the intellectual foundation.

---

That is Section 10, around 2400 words. Longer than average because value is the design's most contested territory — the concept that most work in this space collapses on — and the operational mechanisms had to be specified precisely enough to survive the pressures that will act on them.

Three things worth your attention.

The "Recognition as an act, not a metric" subsection makes a strong claim about the limits of instrumentation. It's foundational to how the value definition survives contact with measurement culture, and it says something that measurement-culture practitioners will find uncomfortable. I've stated it plainly rather than hedging. If you want it softened — if the design should be more accommodating to conventional measurement approaches — say so. My inclination is to keep it strong.

The Rasch subsection assumes the CAM work is in position to serve as methodological precedent. If CAM's status has shifted since the memory-file version I read, or if the specific claim that Rasch is well-suited to neighborhood-authored scorecards needs qualification, tell me and I'll adjust.

The anti-capture properties are numbered as six specific mechanisms. These are load-bearing for the whole design — the value definition doesn't hold without them — and I've stated them in a form that could serve as a checklist for WWHA's charter or for Platform actor training. If you want additional properties named or existing ones consolidated, let me know.

React, correct, or say go for Section 11.

---

**Marc** (2026-08-31 13:44):

Write 11

---

**Claude** (2026-08-31 13:46):

Drafting Section 11.

---

# Section 11 — The Prior-Work Substrate

## Why this section exists

Every prior section has referred to work that came before this design record. CMG's 2016 methodology, the five-phase Linkage Mapping playbook, the Medford and Spokane implementations, the thirty Spokane linkage maps, Marc's Ripple ReThink System Dynamics model, the 2014 Confluence architecture, the Whatcom Alliance for Health Advancement's original founding. And beyond Marc's own work: Beer's Viable System Model, Ackoff's Idealized Design, McKnight's *The Careless Society*, Ostrom's polycentric governance, Vester's biocybernetics, Meadows' leverage points, Flores's speech acts and moods, Zohar's *Zero Distance*, Minnaar-de Morree-van der Lecq's *The Startup Factory*, Rasch measurement from Wright and Linacre at Chicago.

This section situates the current design inside that arc, names what carries forward and what stays behind, and marks the substrate that gives the design its specific shape. A reader who wants to understand why this design record makes the choices it makes will find the reasoning here.

The section is organized in two parts. First, Marc's own prior work — the thirty-year arc from Whatcom Alliance for Health Advancement through Cambridge Management Group's Medford and Spokane implementations to the current RCN work. Second, the intellectual substrate from other authors and traditions that this design record draws on and extends. Both parts matter. The design is not a fresh invention; it is the current form of a long-standing set of commitments that have been tested against reality repeatedly and refined by what didn't work as much as by what did.

## Marc's own arc

The current design rests on prior work that spans roughly three decades and produces recognizable through-lines despite substantial variation across sites and iterations.

**Whatcom Alliance for Health Advancement (WAHA), founding through 2000s.** Marc was among WAHA's founders. WAHA's early work developed a community-scale health improvement approach that emphasized inter-institutional coordination, patient engagement in design, and the specific insight that population health outcomes are driven far more by what happens outside clinical settings than inside them. WAHA's operating model included direct participation of residents in design processes and produced work that anticipated many of the moves later formalized in the CMG methodology. The current RCN work re-engages with WAHA's substrate at a moment when WAHA itself is being redesigned to hold a granting arm that will operate as an Industry Platform under this design's principles.

**Epic implementation and the whole-community medical record project.** Marc helped implement Epic systems approximately twenty years ago and led a whole-community medical record project in Whatcom County. That work developed operational understanding of what it takes to instrument coordination across institutions with different accountability structures, different technology bases, and different views of what the shared record is for. The lessons about how coordination succeeds and fails at the technology-substrate level inform the current CfA-dSC and Overall Schema work directly.

**Rasch measurement training at the University of Chicago.** Marc trained with Benjamin Wright and Mike Linacre in the Rasch measurement tradition. That tradition produces measurement instruments with specific psychometric properties — items calibrated to latent constructs along shared dimensions, invariant across contexts, with honest accounting for measurement error. Marc applied this in the Patient Activation Measure (PAM) field-testing through the Robert Wood Johnson Foundation's Pursuing Perfection program. The methodological substrate for the balanced-scorecard work in Section 10 comes from this training directly.

**Cambridge Management Group formation with Bob Harrington and Annie Merkle, mid-2010s.** CMG was formed to bring the accumulated Whatcom work and the accumulated methodological tools (Ackoff's Idealized Design, the ReThink Health System Dynamics Model, Linkage Mapping developed at CMG itself) to other communities. The 2016 CMG prospectus articulated the framework as Inclusion, Participation, Trust, with the three tools (Linkage Mapping, Idealized Design, System Dynamics Modeling) run iteratively inside that framework. The prospectus stated the goal as "ensuring local competence and autonomy." That goal did not hold in either Medford or Spokane after CMG's engagement ended, and the reasons why it did not are what this design record's four principles from Section 2 exist to address structurally.

**Jackson County, Oregon (Medford) implementation, 2016.** The Medford work was structured around an Accountable Community of Health (ACH) framework, with seven work streams (Community Sponsorship, Ideal CHW-Networker, Accelerated Solutions Environment, Guidance Group and Communication, End to End Service Line, Linkage Map and Idealized Design, Broad Community Financial Support) organized in Confluence spaces alongside a Jira project backlog. The GGCS backlog contains sixty scenarios and project stubs at the between-institution shape. The Medford implementation did not proceed to full execution because of institutional political conflict among the participating hospitals, but the architecture Marc laid out in anticipation of the work is preserved in the community4health.atlassian.net instance and informs the current design record's approach to scenario repositories, work-stream organization, and inter-institutional negotiation.

**Spokane implementation, mid-2010s.** The Spokane work produced the thirty linkage maps that document the between-institution project shape in canonical form. The maps' consistency across substantive variation (acute care pharmacy transport, school-refugee transition, integrated addiction care, community-based screening for prevention, dental care access, EMS-cabulance integration, and many others) is evidence that the shape is a stable pattern rather than an artifact of one project's design choices. The Spokane team matrix — sectors by priority areas by named individuals — is the operational form of cross-sector team composition that Section 8 draws on. Spokane also failed to sustain the practice after CMG's engagement ended, for the same structural reasons as Medford.

**The Ripple ReThink model, Whatcom County.** Marc originated the Whatcom-specific variant of the ReThink Health System Dynamics Model, which remains available as an S4-scanning tool at higher recursion levels than the neighborhood-scale kit operates. Marc's twenty years of use with the model informs the current design's judgment that SDM is a specialized tool for policy scenarios rather than a general S4 instrument, and Meadows' insight about parameters as the weakest leverage point (with worldview as the strongest) shapes where the current design chooses to invest attention.

**The current RCN work.** The current RCN work stream includes SODOTO credentialing, CfA-dSC dyadic smart contracts, the Overall Schema graph work, RCN Graph Tool, FedWiki federation, e-VSM Survey/Diagram/Dialogue, the RCN Map tool, and the recent Foothills Outlook and Whatcom Court FedWiki conversions. Several of these are still developing; some are operational. The current design record commits to their maturation providing the substrate that makes the four principles from Section 2 fully operational, with the recognition that the substrate is not fully mature in 2026 and interim mechanisms preserve the structural properties while the mature form is being built.

## Through-lines across the arc

Certain commitments recur across all of Marc's prior work and are load-bearing in the current design. Naming them explicitly helps a reader see what continuity is being maintained.

**Residents are the primary actors, not the primary recipients.** From WAHA's early work forward, the design has treated residents' own agency as the starting point rather than as the endpoint. External contributions support what residents do; they do not substitute for it. The current design's value definition (Section 10) is this commitment made structural.

**Between-institution work is where the leverage lives.** From the whole-community medical record project through the Spokane linkage maps, Marc's work has consistently found that the highest-value opportunities live in the connective tissue among institutions rather than within any single institution's scope. Institutions handle their own S1-S3 competently; the failures accumulate in S4 (nobody's imagining what could be) and in coordination gaps. The current design's between-institution project shape (Section 8) is this commitment made operational.

**Measurement must be psychometrically real and neighborhood-authored.** From the PAM field-testing through the CAM work, Marc's methodological commitment has been to instruments that actually measure what they claim to measure and are constructed with the participation of those they measure. The current design's Rasch-substrate balanced scorecards (Section 10) extend this commitment to neighborhood-scale value measurement.

**Facilitator dependency is a design failure to be structurally eliminated.** From the CMG prospectus's stated goal of "ensuring local competence and autonomy" through the diagnosis of why that goal did not hold, Marc's work has treated facilitator dependency as a structural problem requiring structural solutions rather than a matter of good intentions or better training. The current design's four principles from Section 2 are the structural solutions the prior work pointed toward.

**Systems thinking through Beer, Ostrom, Vester, and Meadows is the operating framework.** From WAHA's early engagement with system-level thinking through the current work with VSM at neighborhood scale, Marc's practice has drawn on the systems tradition rather than treating each engagement as a discrete case. The current design's VSM frame (Section 3) is this tradition made explicit.

**Speech acts and moods matter operationally.** From CMG's Inclusion-Participation-Trust framework through the current work, Marc has treated ontological coaching's distinctions (Flores, Spinosa, Dunham) as operational rather than merely theoretical. The current design's Section 7 elevates this from implicit background to explicit working layer.

**FedWiki is the native delivery medium.** From the collaboration with Ward Cunningham forward, Marc's work has taken FedWiki's fork-and-modify pattern as the appropriate substrate for neighborhood-authored, cross-neighborhood-federated work. The current design commits to FedWiki as the delivery medium for both the design record and the kit itself.

## What carries forward and what stays behind from prior implementations

The current design record explicitly continues some elements of Marc's prior work and explicitly diverges from others. The distinctions are worth naming.

**Continues:** The five-phase Linkage Mapping playbook structure, adapted from CMG's 2014 form to neighborhood scale with a compressed timeline. The weighted-selection matrix method for scenario prioritization. The between-institution project shape as documented in the Spokane linkage maps. The Inclusion-Participation-Trust framework as the operating stance. The speech acts and moods substrate. Rasch measurement as the methodological substrate for latent constructs. FedWiki as the delivery medium. The graph-based schema for representing scenarios, institutions, and coordination relationships.

**Diverges:** The ACH institutional container. Medford was structured around an ACH; the current design does not require or assume an ACH-equivalent institutional container, because the failure modes of ACHs (institutional politics among hospitals, capture by state Medicaid structures, misalignment of ACH incentives with resident-recognized value) informed the design's diagnosis of what needs structural fix.

**Diverges:** The seven-work-stream Confluence architecture. Medford's setup deployed seven parallel work streams simultaneously. The current design centers on the Linkage-Mapping-and-Idealized-Design work stream and lets the others emerge as neighborhood work exposes their need. Attempting to stand up all seven work streams at once was part of what made the prior architecture too heavy for anyone but CMG to operate.

**Diverges:** The role of System Dynamics Modeling. CMG's methodology treated SDM as one of three co-equal tools. The current design treats Ripple ReThink SDM as available for higher-recursion S4 questions but not part of the neighborhood-scale kit, per Meadows' insight about parameters being weak leverage compared to worldview.

**Diverges:** The facilitator team model. CMG operated as a paid external facilitation team engaged by community sponsors. The current design's Industry Platform is compensated as a downstream function of resident-recognized value rather than as a paid external service. This is the specific structural change that closes the dependency door prior implementations left open.

**Diverges:** The scale of engagement. Medford and Spokane operated at county scale, with ACH-shaped institutional containers as the primary interlocutors. The current design operates at neighborhood scale, with founded commons and small groups as the primary substrate. The change of scale is not incidental; it aligns the work with the level at which Ashby's Law's requisite variety is actually available.

**Diverges:** The role of grant-making. Prior implementations depended on external grant capital deployed on funder timelines with funder-authored evaluation frameworks. The current design's Industry Platform deploys catalytic seed capital with neighborhood-authored balanced scorecards, with the specific anti-capture properties from Section 10.

## Intellectual substrate from other authors

The design draws substantively on the work of others, in ways worth acknowledging explicitly. This is not an exhaustive bibliography; it is a naming of what shapes the design's specific choices.

**Stafford Beer, *Brain of the Firm* (1972) and *The Heart of Enterprise* (1979).** The Viable System Model as the operating framework for viable-system diagnosis at any scale. Beer's insistence on recursion — every S1 is itself a viable system with its own five functions — is the specific claim the design's polycentric structure rests on. Section 3 draws on Beer directly. Beer's own treatment of System 4 as the most-often-neglected function shapes the design's identification of S4 activation as the specific intervention the kit provides.

**Russell Ackoff, *Redesigning the Future* (1974) and related work on Interactive Planning.** Idealized Design as the method for imagining what would be wanted if the constraints of history did not bind. Ackoff's two constraints — currently feasible technology and operationally possible — are the specific bounds that keep Idealized Design from becoming a wish list and let the design be revised as feasibility changes. Section 3's S4 activation logic and the kit's Phase 2 method both draw on Ackoff directly.

**Elinor Ostrom, *Governing the Commons* (1990) and the broader polycentric governance literature.** Ostrom's work on how communities self-govern common-pool resources without state or market solutions, and her polycentric governance framework showing how multiple centers of decision-making at multiple scales can produce workable coordination without any single center's dominance. The design's insistence on non-centralized RCN structure across Platforms (Section 6), the polycentric recursion (Section 3), and the neighborhood's authority over its own value definition (Section 10) all draw on Ostrom.

**Frederic Vester, *The Art of Interconnected Thinking* (2007 English translation of the 1999 German original).** Vester's biocybernetics as the specific frame for understanding systems as living rather than mechanical. The design's biological logic for founded-commons succession (Section 4) and elder-succession patterns (Section 9) draws on Vester directly. Vester's emphasis on network sensitivity analysis informs the current SensiMod work in RCN's substrate.

**Donella Meadows, "Leverage Points: Places to Intervene in a System" (1999).** Meadows' twelve leverage points, with the specific insight that parameters are the weakest leverage and paradigms (worldviews) are the strongest. The design's choice to invest in worldview-level change through the WHY-first facilitation sequence (Section 7) rather than in parameter-level change through metric adjustment draws on Meadows directly. Meadows' insight also shapes the design's judgment about System Dynamics Modeling's limits at neighborhood scale.

**John McKnight, *The Careless Society: Community and Its Counterfeits* (1995).** McKnight's distinction between associational gift and professional service, and his diagnosis of how the philanthropic-industrial pattern produces counterfeits of community. The design's second principle from Section 2 (compensation structurally tied to residents-received value rather than to job description) is McKnight made structural through Rendanheyi mechanics rather than through the ascetic-volunteer framing McKnight is sometimes read as advocating.

**Fernando Flores and Charles Spinosa, *Disclosing New Worlds* (1997), Bob Dunham's Institute for Generative Leadership materials, and the broader ontological-coaching tradition.** Speech acts (assertions, declarations, requests, offers, promises) and moods as the working layer of coordination. Section 7 develops this substrate at length. The design's coordination grammar comes from this tradition directly, extended to neighborhood scale.

**Mary Parker Follett, *Creative Experience* (1924) and related work.** Follett's group ontology and her treatment of coordination as active integration rather than compromise. The design's understanding of what happens in the neighborhood's convening moments — genuine integration of differences rather than negotiated compromise — draws on Follett.

**Karl Friston's Free Energy Principle and the Markov Blanket framework.** The e-VSM survey's Markov Blanket layer mapping (11 spheres, 66 directed edges) draws on Friston's Free Energy Principle for its specific representation of what constitutes the boundary between a system and its environment. The design's treatment of neighborhoods as viable systems with their own boundaries and their own internal dynamics is compatible with Friston's framework.

**Rasch measurement, from Georg Rasch (1960) through Benjamin Wright and Mike Linacre at Chicago.** The methodological substrate for latent-construct measurement across contexts. Section 10's balanced-scorecard commitment and the CAM work in RCN's substrate both draw on this tradition.

**Danah Zohar, *Zero Distance* (2022).** The description of Haier's Rendanheyi model, including the specific mechanisms of Ecosystem Micro-Communities, the Experience-EMC/Solution-EMC split, the customer scenario as durable object, the Industry Platform pattern, the Community Store neighborhood-scale interface, and the city-not-company sustainability framework. Sections 5, 6, and 8 draw on Zohar directly.

**Joost Minnaar, Pim de Morree, and Bram van der Lecq, *The Startup Factory* (2022).** The specific mechanics of EMC formation, Leading Targets, Value Added Mechanism, and inter-ME contracting. The current design record's treatment of these draws on Minnaar-de Morree-van der Lecq via public excerpts and Andreas Holmer's summaries, with awareness that the book contains additional operational detail the current design would benefit from incorporating as the RCN substrate matures.

**Zhang Ruimin's own writing and interviews about Haier's transformation.** The primary source for Rendanheyi as it operates at Haier scale. Zhang's insistence that value to the employee must be aligned with value to the user, and his framing of the company as an ecosystem-generating tropical rainforest rather than a mature-and-dying organization, shape the design's understanding of what sustainability at scale requires.

**Christopher Alexander, *A Pattern Language* (1977) and *The Nature of Order* (2003-2004).** Alexander's pattern language work and his later treatment of what makes environments alive versus dead. Marc's active pattern-language work with the Bellingham downtown merchants (documented in /areas/bellingham-pattern-work.md) draws on Alexander directly. The design's treatment of founded commons as living environments follows Alexander's sensibility about what makes a place alive.

**Ward Cunningham, FedWiki.** The federated wiki pattern as the delivery medium for authored-and-federated content. The design's commitment to FedWiki as the delivery medium is not incidental; the fork-and-modify pattern is what allows cross-neighborhood learning without centralized curation.

**Anne Marie Chiasson and the Haier Model Institute, William Malek's *Beyond Buzzwords* podcast series.** Contemporary reporting on how Rendanheyi operates in practice, including the specific detail about scenarios returning to the platform enriched by failed attempts (Malek's phrase "you can go grab the scenario"). The current design draws on this reporting for the mechanisms that Zohar and Startup Factory describe at conceptual level.

## What Section 11 commits the design to

The design record acknowledges its debts to prior work explicitly. Nothing in the current design is treated as a fresh invention; every substantive claim traces to prior work by Marc or by others, extended or adapted for the current situation.

Marc's own arc from WAHA through CMG to the current RCN work is treated as a continuous line of development rather than as a set of discrete engagements. The through-lines (residents as primary actors, between-institution work as leverage, real measurement, structural elimination of facilitator dependency, systems thinking as the framework, speech acts and moods as operational, FedWiki as delivery medium) are preserved. The divergences from prior implementations (from ACH containers, from seven-work-stream architecture, from SDM as co-equal tool, from paid-facilitator team, from county scale, from external grant-making) are named as the specific structural changes this design commits to.

The intellectual substrate from other authors is acknowledged as the specific set of traditions this design draws on and extends. Beer, Ackoff, Ostrom, Vester, Meadows, McKnight, Flores and the ontological-coaching tradition, Follett, Friston, Rasch, Zohar, Minnaar-de Morree-van der Lecq, Zhang Ruimin, Alexander, Cunningham, and the contemporary Rendanheyi reporting are named as the sources whose work shapes the current design's specific choices.

Section 12 addresses the questions still open in the design — the ones RCN is grappling with, the ones the substrate maturation will affect, the ones the first years of operation will teach — so a reader knows what is settled and what is not, and can engage the open questions as active work rather than assumed answers.

---

That is Section 11, around 2500 words. Substantial because the arc of Marc's own work and the intellectual substrate together constitute the design's specific inheritance, and both had to be treated with enough detail that a reader could actually trace the through-lines and recognize what is being carried forward.

Three things worth your attention.

The through-lines section (seven commitments recurring across your work) is my synthesis from the design conversation and from what I know about your work through the memory files and prior sessions. If any of the seven mischaracterizes your commitments — or if you'd add others I've missed — say so.

The "carries forward and stays behind" subsection makes specific claims about what the current design diverges from in prior implementations. Some of the divergences (from ACH containers, from paid-facilitator teams) are strong claims about what did not work. If the framing is too sharp or too soft, tell me. My inclination is to keep it sharp because the divergences are what the four principles from Section 2 specifically address.

The intellectual-substrate bibliography names roughly fifteen authors and traditions. This is my selection based on what appeared in the design conversation and what I have in memory files as your intellectual anchors. If key influences are missing (Ilya Prigogine, Humberto Maturana, Francisco Varela, Erik Olin Wright, David Bohm, Christopher Alexander in more depth, or others), say so and I'll add them.

React, correct, or say go for Section 12.

---

**Marc** (2026-08-31 13:52):

Write 12

---

**Claude** (2026-08-31 13:54):

Drafting Section 12.

---

# Section 12 — Open Questions

## Why this section exists

A design record that pretends everything is settled is not honest. This one has real questions still open — questions RCN is actively grappling with, questions the substrate maturation will affect, questions the first years of operation will teach. Naming them here does two things: it protects future readers from mistaking working assumptions for settled answers, and it invites the questions to be worked as active RCN research rather than treated as background noise.

Some of these questions have partial answers the design conversation reached. Others are genuinely open. A few are more urgent than others, in the sense that operational work depends on them and cannot proceed indefinitely without at least provisional resolution. The section names each question, describes what is known and what is not, and marks its urgency to help RCN prioritize.

The questions cluster into five groups: founded-commons succession, the Industry Platform's own operational form, the substrate maturation, cross-Platform and cross-neighborhood federation, and the questions about the kit's own limits.

## Founded-commons succession

Section 4 developed the founded commons as substrate the kit requires and the design record treats as living, mortal, and mutually generative with neighborhood small groups. Two questions about the founded commons over time remain open.

**How long before a founded commons loses its qualities.** The failure modes are named in Section 4: founder-steward departure without succession, institutional capture through funding relationships, neighborhood turnover emptying the constituency of use, decay of collaborative-work function into event-hosting or coworking. What is not known is the typical time-scale on which these failure modes act, whether the failure modes are predictable enough to be worked against preventively, and what specific early-warning signals appear before a founded commons has visibly degraded. The Phase 5 retrospective is named as the site for noticing degradation early, but the specific signals a retrospective should look for are not yet articulated. This is active RCN grappling territory and will remain so.

**How a new founded commons can replace an old one.** Marc's framing that this is biology, sociology, and anthropology rather than engineering points at the answer's shape without giving its content. New founded commons emerge from participation in aging ones; the emergence follows patterns of imitation, adaptation, mutation, and selection that biological systems know how to do and mechanical systems cannot fake. Some early observations were named in Section 4: emergence appears to require an aging founded commons whose founder is preparing to release, one or more younger neighborhood members who have absorbed the pattern by participation, and something like an elder-mentorship relationship between the two. Emergence appears easier where the aging founded commons has stayed small enough to remain legible as a pattern. Emergence appears to depend on the presence of what elders would recognize as their own younger selves. None of these observations is settled RCN doctrine; each needs multiple confirmed cases before it becomes reliable. The RCN work on documenting founded-commons trajectories over time is where these observations will accumulate.

**Related open question — the space that fails the diagnostic.** Section 4 committed to a hard filter: no founded commons, no start. What is not developed is what a convener does when they encounter a neighborhood they care about that fails the filter. "Wait" is honest but empty. "Help the neighborhood find its space" is prescriptive and probably wrong. "This is not something the kit can help with — the space has to come from the neighborhood itself, and if it doesn't, the neighborhood is telling you something" is truthful but leaves the convener with nothing to do. Whether there is a legitimate role for Platform actors in supporting nascent founded-commons emergence in a neighborhood that has none, without inadvertently substituting for the internal emergence that is the actual pattern, is not resolved.

## The Industry Platform's own operational form

Section 6 developed the Industry Platform pattern and named that the Platform exists at higher recursion than the neighborhoods it serves, requiring its own S4 function at cluster scale. Several questions about the Platform's own operational form remain open.

**The Platform's own S4.** At neighborhood scale, S4 is Idealized Design plus SWOT-type scanning, activated through the kit's phases. At cluster scale, S4 requires different tools. What is the Platform's outside-and-future work? What is coming across the cluster that individual neighborhoods cannot see from their own recursion level? What patterns emerging in one neighborhood might apply to others? What is the Platform's Idealized Design for itself and the cluster it serves? Marc's Ripple ReThink SDM remains available as one tool for cluster-scale S4 when relevant. Cross-scenario pattern recognition across neighborhoods is another Platform S4 function. Cross-generational elder-succession work is another. The Platform's S4 is not the kit's job to develop; it is the Platform's own ongoing work. Whether the RCN substrate should provide specific tools for cluster-scale S4 beyond what the neighborhood-scale kit provides is open.

**The Platform's charter.** WWHA's charter needs to encode the four principles from Section 2 and the value definition's anti-capture properties from Section 10 as founding limits. The specific charter language is not drafted, and the governance structure that will enforce the limits is not specified. Who sits on WWHA's board? How are board members selected and rotated? What happens when a board member's judgment about scorecard-versus-funder-pressure differs from the neighborhoods' judgments? What happens when the Platform's compensation model produces distributions that individual Platform actors find inequitable? These are governance questions the design record cannot answer in the abstract; they are WWHA's design work.

**The Platform actors' initial compensation.** Section 6 committed to the mature form of the compensation mechanism and treated the interim before CfA-dSC and SODOTO are fully operational as requiring approximations that preserve the structural properties. What those approximations look like in practice — what Carl, Chris, Jerry, and Brent are compensated on in 2026 and 2027 before the full substrate is operational — is not specified. Whether they are compensated at all in the interim, and if so on what basis, is a real operational question. The structural commitment (outcome-dependent, downstream, variable, capable of returning zero) has to hold; how it holds in the transitional state is open.

**The transition from first-generation to mature marketplace.** Section 5 named that MEs grabbing scenarios and forming ecosystem communities is the mature marketplace state, and that the first-generation state requires more Platform-actor scaffolding because portfolios have not yet accumulated enough substance to support competitive matching. When does the transition happen? How do Platform actors recognize that the marketplace has matured enough that first-generation scaffolding should recede? Is there a way to accelerate the transition without violating the structural properties, or does the marketplace need to develop at its own biological pace regardless of Platform preferences? These questions cannot be answered before the first cycles of MEs form and either succeed or fail; the answers will develop empirically.

## Substrate maturation

Several sections of the design record commit to substrate that is in active development. The design record commits to the mature form and treats the transitional state as requiring approximations. What specifically has to mature and on what timeline is worth naming.

**CfA-dSC.** The dyadic smart contract layer is expected to instrument ME chartering, Value Added Mechanism specifications, promise-and-offer tracking, and settlement. Its current state (state machine, schema, and currency model developed) is not yet a fully operational contracting layer for the ME formation sequence Section 8 describes. What CfA-dSC needs to develop before it can serve this function fully, and how the design should be adjusted if the substrate matures in a different direction than currently expected, is open.

**SODOTO.** The credentialing and portfolio layer is expected to hold participant histories, attributed contributions, and the causal traces that support settlement. Its current state (issuers, keys, handshake model) supports basic portfolio functions but does not yet fully support the compensation flow-tracking Section 6 and Section 9 describe. What SODOTO needs to develop, and what happens if it matures differently, is open.

**Overall Schema.** The top-level graph schema is expected to hold Scenario, ME, Institution, Person, Founded-Commons, Value-Chain, and Portfolio as node types with the relationships among them. Its current state (v0.1 with 32 nodes and 63 edges) covers substantial ground but does not yet include the specific node types the design record requires. The v0.2 revision that adds Scenario as a first-class node type, distinguishes Experience-ME and Solution-ME as sub-types, and encodes Value-Chain as a first-class object is anticipated. Whether the schema will develop in the direction the design record assumes, or in some other direction that the design record will need to accommodate, is open.

**e-VSM Survey/Diagram/Dialogue.** The survey layer with Claude API synthesis is expected to provide the multi-perspective read at multiple phases and the retrospective evidence for scorecards. Its current state (generic Neighborhood Development Center survey with 11 spheres, 66 directed edges, Markov Blanket layer mapping; municipal SOFI design initiated; SODOTO SOFI Certificate program planned) is operational for the general case. Whether the e-VSM instruments need customization for specific scenarios and phases, and how that customization is managed without diluting the psychometric integrity of the instruments, is open.

**FedWiki federation.** The delivery medium for the design record and the kit is expected to hold scenarios, retrospectives, and cross-neighborhood learning through the fork-and-modify pattern. Its current state (working, in active use by Marc, Ward, and others) supports the design record's needs. Whether the specific FedWiki plugins and rendering the RCN work uses will scale to hold the volume of content the mature system will generate, and whether the aggregator plugin's Claude API integration will develop the additional capacities the design assumes, is open.

**RCN Graph Tool.** The visualization layer for linkage maps, scenarios, and their relationships. Its current state (v22, schema-locked, validator working) supports the visualization work Section 8 describes. Whether the tool needs additional capabilities to support the Industry Platform's cross-neighborhood pattern recognition, and whether Neo4j as the underlying graph substrate will scale, is open.

## Cross-Platform and cross-neighborhood federation

Section 6 committed to polycentric organization across Platforms — WWHA in Whatcom, the Fledge in Superior, Leo's in Lansing, other Platforms as they emerge — without centralized RCN authority. Several questions about how the federation actually works remain open.

**The shared substrate's governance.** FedWiki, Overall Schema, CfA-dSC, SODOTO, and e-VSM are shared across Platforms. Who governs their ongoing development? What happens when Platforms disagree about substrate direction? Marc and Kerry and the current RCN participants hold much of the substrate development informally in 2026; formal governance for the substrate as it matures is not specified. Whether the substrate needs a formal governance body (with its own risk of becoming a centralized RCN authority) or can be governed through peer-based mechanisms (which have their own scale limits) is open.

**Cross-neighborhood scenario forking.** Section 5 committed to the fork-and-modify pattern for scenarios across neighborhoods. What happens when a fork develops in a direction that the original scenario's neighborhood disagrees with? What happens when multiple forks of the same scenario develop simultaneously in different neighborhoods with contradictory value definitions? Whether cross-neighborhood dispute-resolution mechanisms are needed, and what shape they should take if so, is open.

**Elder mentorship across neighborhoods.** Carl, Chris, and Jerry mentoring convenors and ME leaders in their own neighborhoods is straightforward. Cross-neighborhood mentorship (Chris mentoring an emerging convener in East County, or Carl mentoring a Fledge participant) is possible and probably valuable but adds coordination and compensation questions. How cross-neighborhood mentorship is compensated when the mentor's Platform and the mentee's Platform are different is not specified.

**New Platforms emerging.** How does a new founded-commons become a Platform? What makes a place ready to host a Platform function rather than only to host neighborhood work? Who decides? The current four convenors and their spaces represent the founding generation; how the second generation of Platforms emerges is not yet worked. Marc's memory files note ongoing conversations with Chris and Jerry that would inform this; the design record cannot resolve it in advance.

## The kit's own limits

The kit as designed does not attempt many things it could plausibly attempt. Some of these limits are principled (the founded-commons filter, the elder-only convener requirement); others are contingent (limits imposed by current substrate maturity). Naming what the kit does not do prevents the kit from being asked to do things it cannot do well.

**Neighborhoods without founded commons.** Section 4 committed to a hard filter. What Platform actors do in neighborhoods that fail the filter is not resolved. Whether there are related interventions RCN could develop for this case (documenting patterns of founded-commons emergence, supporting neighborhood conversations about what would be needed for a founded commons to emerge, connecting neighborhood members to elders who have founded commons in other places) is worth working, but they are not part of the current kit.

**Neighborhoods with functioning S4 already.** The kit is designed for the specific case of neighborhoods with functioning S1-S3 and some S5, but non-functional S4. Neighborhoods where S4 is already functioning may not need the kit's specific intervention; they may need different things (funding for MEs they have already identified, connection to other neighborhoods doing similar work, help with cluster-scale coordination). Whether the kit should be adapted for these cases or whether they should be served through different RCN offerings is open.

**Non-neighborhood scales.** The kit operates at neighborhood scale. Higher recursion (city, county, region) and lower recursion (block, extended family, single institution) are different scales with different requirements. The design record has committed to the neighborhood as the primary scale of intervention because that is where Ashby's Law's requisite variety lives for the kind of work RCN does. Whether related tools should be developed for higher or lower recursions, and how they would relate to the kit, is open.

**Non-U.S. contexts.** The kit is being designed initially for U.S. neighborhoods with the specific institutional and cultural context that implies. Adaptation for non-U.S. contexts (whether Haier-style Community Store models, European neighborhood-council traditions, or Global South community organizing patterns) is not attempted in the current kit. Whether RCN should extend to non-U.S. contexts and how, is a strategic question the design record does not answer.

**AI and Claude's ongoing role.** Section 10 named Claude's role in interpretation and integration of e-VSM survey evidence. Section 5 named Claude's role in scenario validation. Section 7 named CfA-dSC as the eventual instrumentation of speech acts. Across these, Claude is treated as an ongoing operational participant in the kit rather than only as a co-drafter of the design record. What Claude's role will actually be as the substrate matures — how much interpretive judgment Claude will hold, what accountability structures apply to Claude's contributions, how Claude's role changes as different AI systems become available — is open. This is not merely a technology question; it is a design question about how much of the kit's functioning should depend on a specific AI provider.

## What Section 12 commits the design to

The design record does not pretend everything is settled. The five clusters of open questions above are named explicitly, and the design commits to treating them as active RCN research rather than as resolved doctrine.

Future readers of the design record should understand that operational work has proceeded and can proceed on the settled portions of the design while the open questions are worked. The four principles from Section 2, the VSM frame from Section 3, the founded-commons concept from Section 4, the customer scenario as origin object from Section 5, the Industry Platform pattern from Section 6, the moods-and-speech-acts working layer from Section 7, the between-institution project shape from Section 8, the catalytic seed capital principle from Section 9, and the value definition from Section 10 are stable enough that convenors can begin using the kit against them. The open questions in this section do not block operation; they are the ongoing work that will refine and mature the design over time.

The design record commits to being updated as the open questions develop answers. Some will resolve through operational experience (whether MEs form successfully in first-generation neighborhoods, whether the compensation approximations hold structural integrity, whether the founded-commons succession patterns actually appear in the cases RCN is watching). Others will resolve through substrate maturation (whether CfA-dSC develops in the expected direction, whether Overall Schema v0.2 encodes what the design assumes). Others may not resolve; they may remain open indefinitely and become part of the design's permanent grappling.

The kit is a living document. So is this design record. Both will be gardened over time by the RCN participants working with them, with the current four convenors — Carl, Chris, Jerry, and Brent — as the first gardeners. What emerges from their work with the kit will teach RCN more than the design record's specifications can anticipate, and the design record will need to be revised in response. That is the design's intended pattern of maturation.

---

That is Section 12, around 2500 words, and it completes the design record.

Three things worth your attention before you have the full document to review.

The five clusters of open questions represent my synthesis of what the design conversation left unresolved. Some clusters (founded-commons succession, Platform S4) are things you and RCN are actively working. Others (cross-Platform federation, kit limits) are questions I've identified from the design conversation but that you may want to reshape substantially. If any cluster misrepresents what is actually open in RCN's current work, tell me and I'll adjust.

The section's tone is more explicitly RCN-facing than most earlier sections. It refers to RCN grappling, RCN research, RCN participants gardening the document over time. This is deliberate — the open questions are RCN's work, not the design record's answers — but it means Section 12 reads differently from Section 1 through Section 11. Say if the tonal shift is right or if you want it more consistent with earlier sections.

The final paragraph names the four convenors as "the first gardeners" of the kit and design record. This is a commitment about their role that goes beyond what earlier sections named explicitly. If that role framing is right, it belongs in the design record; if it overstates or reshapes what you intend, tell me.

The full twelve-section design record is complete. Ready to compile as a single markdown document for your review, or to begin the FedWiki rendering process, or to move to drafting the kit itself. Your call on what happens next.

---

**Marc** (2026-08-31 16:02):

Write 12

---

**Claude** (2026-08-31 16:04):

Drafting Section 12.

---

# Section 12 — Open Questions and Ongoing RCN Grappling

## Why this section closes rather than concludes

A design record that presented itself as complete would be lying. The design this record describes is in active development, with several load-bearing questions still unresolved and several others whose answers will only emerge from the first years of operation. Naming what is open, and how open it is, is more honest than performing closure and more useful to future readers than a summary that pretends the work is done.

This section holds three kinds of open material.

First, questions that RCN is actively grappling with — matters where thinking is underway but has not yet settled, where the design record makes provisional commitments that may need revision as the grappling produces answers.

Second, questions whose answers depend on substrate maturation — matters where the design's operational form depends on tools, contracts, or infrastructure not yet fully built, and where the transitional state involves approximations that will be replaced by mature mechanisms over time.

Third, questions whose answers can only come from empirical experience — matters where thinking cannot substitute for doing, and where the first years of actual operation will teach what no amount of design conversation can predict.

Each category is treated separately because each requires a different kind of response from future readers and future work.

## Questions RCN is actively grappling with

### How new founded commons replace old ones

Section 4 named this as one of the two questions the design record must hold open rather than pretend to answer. The founded commons is a living thing with a mortal life span; new founded commons emerge from participation in aging ones through patterns of imitation, adaptation, mutation, and selection that belong to biological rather than mechanical systems thinking. RCN is grappling with what conditions favor emergence, how the transition from one generation of founded commons to the next happens well or badly, and whether the pattern can be catalyzed without over-specifying it.

Early observations from the design conversation (preserved in Section 4) suggest emergence requires an aging founded commons whose founder is preparing to release, one or more younger neighborhood members who have absorbed the pattern by participation, and enough small-enough-to-remain-legible quality that the pattern can be seen and taken up. What favors emergence, what impedes it, and what conditions actually make it possible remain open questions.

The design record's commitment is to name the open question, point convenors toward the RCN conversation about founded-commons succession, and refuse to over-specify. Vester's biological systems framing is the sensibility inside which the eventual answers will live. The framework for observing and documenting emergence patterns as they occur is one of the things the current RCN work needs to develop; the observations that accumulate over time will inform how future versions of the design record treat this.

### The Platform's own S4 function at cluster scale

Section 6 named that the Industry Platform exists at higher recursion than the neighborhoods it serves, and that WWHA (and each other Platform) needs its own S4 function operating at cluster scale. What that S4 function looks like operationally — what Idealized Design work happens at cluster scale, what environmental scanning informs it, what tools support it, how it coordinates with the neighborhood-scale S4 activation the kit provides — is not fully worked out.

Marc's Ripple ReThink System Dynamics Model remains available as one S4 tool for cluster-scale work when a question surfaces that needs it. Cross-scenario pattern recognition across neighborhoods is another S4 function the Platform performs. Cross-generational elder-succession work is another. Beyond these named functions, what the Platform's ongoing S4 practice looks like — its cadence, its convening forms, its documentation, its own retrospective structure — remains open.

The design record's commitment is to recognize this as ongoing Platform work rather than kit work, and to hold it as a design conversation to continue among Platform actors (Carl, Chris, Jerry, Brent initially) and RCN participants (Marc, Kerry, Ward, and others). The kit itself does not attempt to install cluster-scale S4; the Platform develops its own.

### WWHA's charter and governance

Section 10's anti-capture properties named several constraints that need to be reflected in WWHA's charter as founding limits: outsiders cannot originate scorecards, grantmakers can only decline to fund rather than negotiate scorecards, revisions cannot be triggered by funder pressure, the neighborhood's determination of value received is final. Section 6's Industry Platform pattern named additional structural commitments: compensation must remain outcome-dependent, no centralized authority over other Platforms, diversified funding sources structurally required.

WWHA's actual charter — the legal instruments, governance structures, board composition, decision-making procedures, and accountability mechanisms — is being drafted by Marc, Kerry, and collaborators. The design record's principles inform the charter but do not substitute for it. What specific language accomplishes what specific structural commitment, how the charter handles the transitions between founder-led early stage and mature elder-succession stage, how the charter interfaces with legal requirements for nonprofit or cooperative or other organizational forms — all of this is active drafting work.

The design record's commitment is to name the structural properties the charter must preserve and to update as the charter's specific form is developed. Future versions of the design record will reference WWHA's charter as it takes final form.

### The relationship between RCN and its constituent Platforms

Section 6 committed to polycentric relationship among Platforms — WWHA in Whatcom, the Fledge in Superior, Leo's in Lansing, and other Platforms as they emerge — without any centralized RCN authority over them. Cross-Platform coordination happens through peer relationship, shared substrate (FedWiki, Overall Schema, CfA-dSC, SODOTO), and elder-mentorship networks among Platform actors.

What "RCN" is, organizationally and legally, in this arrangement remains open. Is RCN a federation of Platforms with a specific coordinating function? A shared brand and set of standards without organizational form? A support enterprise (in Rendanheyi terms) that serves the Platforms with substrate infrastructure? A pattern language that names how the work is done without instantiating any specific entity? Some combination? The design conversation preserved the polycentric commitment without resolving the organizational form.

The current RCN work stream includes tooling (SODOTO, CfA-dSC, Overall Schema, Graph Tool, e-VSM, FedWiki federation) that functions across Platforms without requiring centralized RCN organizational structure. Whether that continues to be sufficient as more Platforms emerge, or whether some more explicit RCN form is needed, will be answered by what the emerging Platforms actually need.

The design record's commitment is to preserve the polycentric constraint and let RCN's organizational form develop from what Platforms need rather than from what RCN might want to be.

## Questions dependent on substrate maturation

### CfA-dSC's operational form and its interface with speech acts

Section 7 committed to CfA-dSC as the substrate that will eventually instrument speech acts formally — promises captured as smart contracts, declarations recorded with attribution, offers and requests tracked in the coordination layer. Section 8 committed to CfA-dSC as the substrate that will eventually instrument ME chartering and Value Added Mechanism specification. Section 9 committed to CfA-dSC as the substrate for catalytic seed capital deployment.

CfA-dSC is in active development but not fully operational. What "fully operational" means in practice — what user interface convenors and MEs interact with, what the smart contracts actually enforce, how the state machine handles the various speech acts and their combinations, how the currency model settles compensation across the Value Added Mechanism — is being worked out.

The design record's transitional-form commitment (interim mechanisms preserve structural properties while mature mechanisms are built) applies here directly. In the interim, ME chartering happens through more manual coordination with the same structural properties. As CfA-dSC matures, the manual coordination is progressively replaced by contract-instrumented coordination.

The specific timeline for CfA-dSC maturation is not part of the design record; it depends on CfA-dSC development work happening in parallel with RCN's other work streams. What the design record commits to is that CfA-dSC's mature form preserves the structural properties the design requires, and that the interim mechanisms are recognized as transitional rather than treated as permanent.

### SODOTO's operational form and its relationship to portfolios and trust

Section 8 committed to SODOTO portfolios as the persistent record of individual contributions to ME work, and Section 9 committed to portfolio data accumulated in SODOTO as the substrate for Platform actor pattern-recognition over time.

SODOTO is being developed as a credentialing system with issuers, keys, handshake model, and next-session issuance patterns. Its operational form — how portfolios are structured, what entries look like, how attestation works, how portfolios are surfaced when needed (during scenario grabbing, during ME formation, during Platform mentorship decisions) — is in active development.

The design record's commitment is that SODOTO's mature form supports the trust mechanisms the design requires (first-generation portfolios accumulating substance over time, mature-marketplace bidding based on portfolio depth, cross-neighborhood recognition of accumulated work), and that interim mechanisms preserve the intent while SODOTO develops.

### Overall Schema's stable form

Section 8 committed to Overall Schema as the graph structure that represents scenarios, MEs, Platform actors, ecosystem members, founded commons, and residents, with edges representing the relationships among them. The current Overall Schema (v0.1, 32 nodes, 63 edges, 14 node labels) is being extended toward v0.2, with open decisions flagged for Kerry review.

What the stable v1.0 Overall Schema looks like — which node types are represented, which edge types are used, how scenarios interact with MEs, how portfolios attach, how neighborhood boundaries are represented, how the e-VSM survey layer connects — depends on the schema development work continuing in parallel with the substrate work.

The design record's commitment is to describe the mature graph structure in terms consistent with the current schema direction, with the recognition that specific schema decisions will settle as v0.2 and successors take shape.

### FedWiki federation for the scenario repository

Section 5 committed to FedWiki as the delivery medium for the scenario repository, with the fork-and-modify pattern as the native mechanism for cross-neighborhood learning. The current FedWiki federation work includes the Foothills Outlook and Whatcom Court conversions, the e-VSM aggregator plugin, and Ward Cunningham's ongoing FedWiki development.

What the mature scenario repository looks like on FedWiki — the specific page structure, the field standards, the aggregator queries that surface scenarios by neighborhood or by pattern, the cross-Platform federation configuration — depends on continuing FedWiki work and on what use surfaces as needed.

The design record's commitment is that FedWiki serves as the scenario repository and delivery medium, with the specific operational form developing through use.

## Questions whose answers only come from empirical experience

### Whether the four principles hold under sustained operation

Section 2's four principles (facilitator variety distributed, elder-driven Industry Platform actors compensated through value chain, catalytic seed capital that departs, value created by and for residents and their neighbors) are designed to structurally resist the failure patterns that have collapsed prior attempts. Whether they hold under the sustained pressure of actual operation — whether the anti-capture properties survive contact with real funders, real institutions, real political pressure, real personnel turnover, real economic stress — cannot be determined in advance.

The design record's commitment is that the first years of WWHA's operation are as much learning as delivery, with genuine willingness to revise the principles if operation reveals structural weaknesses the design conversation could not anticipate. The four principles are not treated as eternal truths; they are treated as the current best design informed by prior work, subject to revision as new evidence accumulates.

### What actual ME formation looks like at neighborhood scale

Section 8's scenario-to-ME formation sequence describes how MEs form around scenarios, negotiate value chains, and enter into contracts. This description draws on Haier's mechanics scaled down to neighborhood, on Marc's prior Spokane and Medford implementations, and on the design conversation's synthesis. Whether ME formation at neighborhood scale actually proceeds as described — the pacing, the specific negotiations, the failure modes, the ways teams self-organize versus struggle to form — will only be known from actual first-generation ME formations in East County, Superior, Lansing, and Whatcom neighborhoods.

The design record's commitment is that the described sequence is a working hypothesis, and that early ME formation experiences will inform revision of the description in future versions of the record.

### What the balanced scorecards actually look like when neighborhoods construct them

Section 10 committed to neighborhood-authored balanced scorecards as the operational form of value measurement. What those scorecards actually contain when specific neighborhoods construct them — what dimensions matter to East County versus Superior versus Whatcom neighborhoods, how much variation exists across neighborhoods, whether the variation is generative or unwieldy, whether cross-neighborhood comparison remains meaningful — will only be known from actual construction.

The design record's commitment is that the scorecard framework holds even if specific scorecards vary substantially, and that the Rasch-substrate approach lets variation be handled without collapsing the framework.

### Whether Platform actors' compensation actually works as designed

Section 6 committed to outcome-dependent compensation for Platform actors flowing from residents' recognition of value received. Section 9 committed to catalytic capital cycling through MEs and returning to the Platform through Value Added Mechanism settlements. Whether the aggregate economics of this compensation model actually sustain Platform actors at levels that allow them to do the work — whether the model needs adjustment based on actual ME success rates, actual scenario complexity, actual timelines to value recognition — will only be known from actual operation.

The design record's commitment is that the structural properties (outcome-dependence, downstream-flow, alignment with residents-received value) are non-negotiable, and that specific parameter adjustments (percentages in Value Added Mechanism, capital sizing formulas, timeline expectations) will develop from actual experience.

### How elder succession actually proceeds

Section 9's discussion of catalytic principle across scales includes elder succession as one of the scales at which the principle operates. Whether elders actually release their roles as they age, whether younger successors actually take up the roles well, whether the succession patterns Marc has hypothesized (participation-based transmission, mentorship in the founding of new founded commons, generational stages of doing and releasing) actually work at scale — all remain empirical questions.

The design record's commitment is to name elder succession as ongoing work, to document what happens as first-generation Platform actors (Carl, Chris, Jerry, Brent and their peers) begin the release process, and to inform future versions of the record with what succession patterns actually emerge.

### Whether the design record and the kit themselves are usable

The design record you are reading and the kit that will be drafted against it are themselves subject to empirical test. Whether Carl, Chris, Jerry, Brent and future convenors actually pick up the kit and use it, whether the design record's reasoning actually helps new participants understand what they are joining, whether the moods-and-speech-acts vocabulary earns its way in through use as intended, whether the customer scenario as first-class object actually gets constructed in FedWiki as the design contemplates — all these are empirical questions.

The design record's commitment is that this document and the kit are themselves subject to revision based on how they land with actual users. If specific sections turn out to be confusing, prescriptive where they should be open, gestural where they should be operational, or theoretical where they should be practical, they will be revised. The design record is not a monument; it is a working document that gardens itself as the work matures.

## What Section 12 commits the design to

The open questions are named honestly, without pretense that thinking has settled where it has not. Future readers can engage the open questions as active work rather than as assumed answers. RCN participants know which questions are their grappling to do and which are waiting for empirical evidence.

Three categories of openness are distinguished — active grappling, substrate maturation, empirical experience — because each requires a different kind of response. Grappling questions invite continued design conversation. Substrate questions invite continued substrate development. Empirical questions invite operation and observation.

The design record is committed to updating as questions get answered. Future versions of the record will refer back to this section and mark which questions have moved from open to settled, and how. Questions that turn out to be poorly posed will be revised or replaced. The record itself is one of the empirical experiments the design is running.

The four principles from Section 2 remain the design's load-bearing architecture. They are not treated as eternal, but they are treated as the current best design and the specific structural response to the failure patterns that prior work has documented. Revision of the four principles would be a substantial redesign; revision of specific operational forms downstream of them is expected and welcome.

The kit that will be drafted against this design record is the next major deliverable. It translates the design's reasoning into operational form for Carl, Chris, Jerry, Brent and future convenors. The kit's form will develop through drafting, use, and revision on the same gardening logic that this design record uses.

Cross-references to WWHA's charter, the CfA-dSC operational specification, the SODOTO credentialing detail, the Overall Schema stable form, and the FedWiki federation configuration will be added to future versions of this record as those documents take final form. In the current version, these are referenced as ongoing work with the recognition that they and this record co-evolve.

The reader who has arrived at this section has read the current best form of the design as of this drafting. The design continues. The reader is invited to participate.

---

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

---

**Marc** (2026-08-31 16:35):

Begin the kit draft

---

**Claude** (2026-08-31 16:35):

Before I begin drafting, one thing to settle so the kit lands right.

The kit is a different kind of writing than the design record. The design record's job was reasoning — why the design is this way, what substrate it rests on, what corrections shaped it. The kit's job is enabling use — helping Carl, Chris, Jerry, Brent and future convenors actually run the phases in a specific neighborhood, with prompts they can use, templates they can adapt, and enough guidance to do it well without requiring them to have read the design record first.

That is a real distinction. The design record is written for a reader thinking; the kit is written for a convener doing. Different sentences, different structure, different length. A convener in the middle of a Phase 2 first meeting does not want reasoning; they want to know what to do next.

Which raises a decision that will shape the whole kit.

**Option A: Kit as sequential facilitator's guide.** Organized by phase (Phase 1 through Phase 5). Each phase has its purpose, its prerequisites, its sequence of activities, its prompts, its templates, its common failure modes, its handoff to the next phase. A convener reads the whole kit once to understand the arc, then works with the current-phase section during operation. Length in the range of 8,000–12,000 words. Format supports both start-to-finish reading and jump-to-current-phase reference use.

**Option B: Kit as reference set.** Organized by artifact and moment rather than by phase. Sections for the Phase 1 diagnostic, the WHY-WHERE-WHEN-WHO sequence, the linkage-map construction, the weighted-selection matrix, the scenario articulation template, the ME chartering conversation, the e-VSM survey deployment, the retrospective structure, and so on. A convener uses whichever section they need at whichever moment. Length similar but structured for pure reference. Less narrative arc.

**Option C: Kit as narrative walkthrough with reference attachments.** Main text is a narrative — how a convener runs a neighborhood through the cycle from first pre-work through Phase 5 retrospective, told in operational voice with prompts and decisions embedded. Attachments are reference material — the templates, the diagnostic questions, the surveys, the artifacts — that the narrative points to. A convener reads the narrative once to see the arc and returns to attachments during operation. Length probably 15,000–20,000 words total, split between narrative and reference.

My inclination is Option A. It's the shape closest to what your Medford Confluence architecture set up (phase-organized work streams with content in each), it's the shape the CMG 2016 five-phase playbook took, and it's the shape most usable for convenors coming to the work new. Option C is the most complete but risks being too heavy for first use. Option B is the most flexible but doesn't teach the arc.

Also two smaller settings before I start.

**Tone.** The design record was written in reasoning voice — long paragraphs, developed arguments, complete sentences. The kit can be written the same way, or it can move toward instructional voice — shorter, more directive, more use of imperative form ("Ask each participant to name...", "The convener holds space for..."). My inclination is the middle — mostly narrative operational prose, with imperative form when the convener needs a specific move named, and with the moods-and-speech-acts vocabulary progressively disclosed as described in Section 7.

**Worked example integration.** The design record established the school-refugee-transition scenario (Spokane #7 lineage) as the worked example. The kit can either use it throughout (so convenors see the same case unfold across all five phases) or use different examples in different phases (so convenors see the range). My inclination is one worked example throughout — continuity teaches better than variety, and the scenario is rich enough to illustrate all phases.

Say which option (A, B, C) and confirm or revise the tone and worked-example choices. On your answers I draft the kit's introduction and Phase 1.

---

**Marc** (2026-08-31 17:08):

Option A. mostly narrative operational prose, with imperative form when the convener needs a specific move named, and with the moods-and-speech-acts vocabulary progressively disclosed as described in Section 7. Re worked example is more challenging, since my CMG team did not participate in the implementation. So let's discuss how to handle a worked example.

---

**Claude** (2026-08-31 17:08):

Real question, and worth solving before I draft rather than after.

The Spokane linkage maps and Medford scenarios document the between-institution project shape well. They show what the WORKS ON and SHARE_CLIENT and REQUEST_COORD relationships look like across many domains. What they don't show is what a facilitator did in Phase 2's first meeting, how the weighted-selection matrix actually got run in Phase 3, what specific speech acts happened at Phase 4 chartering, how the retrospective was structured in Phase 5. The CMG team stopped at handoff; the neighborhood didn't sustain; there is no clean case where the full five-phase cycle produced observable-through-completion results at a specific between-institution project you can walk a reader through step by step.

That is real. It also is the case for essentially all similar work — most between-institution work that got funded and executed did so under one of the failure patterns Section 8 diagnoses, so even if we had case studies, they'd be examples of the pattern we're trying to avoid rather than of the pattern we're trying to establish.

Four ways to handle this, in decreasing order of my preference.

**Option 1: Composite illustrative example.** Construct a plausible worked example using #7 School-Refugee-Transition as the scenario, drawing from what actually happened in Spokane's linkage-mapping phase and Medford's scenario-articulation phase (which you were part of) plus what would plausibly happen in Phases 3-5 under this design. Mark the composite explicitly at the point where the example moves from documented history to informed construction. The convener reader sees the shape of the whole cycle without being misled about what has and hasn't been done.

The move that makes this honest is labeling. Every prompt, decision, and outcome in the example is tagged as either drawn-from-actual-work (with the source named — Spokane #7 linkage map, Medford GGCS-8 scenario stub, CMG Phase 2 process from the 2014 material) or as constructed-for-illustration. The reader can see what carries evidence and what is design-informed hypothesis. This preserves both the pedagogical value of continuous example and the honesty about what has and hasn't been proven.

**Option 2: Multiple partial examples per phase.** Rather than one example carried through, use short concrete examples per phase drawn from different real moments in your prior work. Phase 1's diagnostic uses examples from your actual convening conversations in various neighborhoods. Phase 2's linkage-mapping uses examples from actual CMG sessions. Phase 3's weighted selection uses examples from actual Spokane prioritization. Phase 4 and 5 use examples from wherever real material exists. This costs continuity but every example is fully grounded in actual practice.

**Option 3: Explicit hypothetical throughout.** Use #7 School-Refugee-Transition as a hypothetical worked example throughout, marked as hypothetical from the start. "Imagine a convener in a neighborhood where..." The convener reader treats it as a thought experiment demonstrating what the phases would produce, without any claim of empirical grounding. Costs some pedagogical weight but is fully honest.

**Option 4: No sustained worked example.** Kit uses fragmentary illustrations where useful, but does not carry any single scenario through. This is what most facilitator's guides actually do, and it has the advantage of not misleading anyone. Costs the strongest form of pedagogical continuity.

My inclination is Option 1, with careful labeling. The reasoning: convenors coming new to the work benefit substantially from seeing the whole cycle unfold around a single case, because the phases only make sense in relation to each other and abstract description doesn't teach the way concrete narrative does. The labeling problem is solvable — I can flag composite material explicitly and specifically each time. And #7 School-Refugee-Transition has enough real substrate in the Spokane linkage map and enough polycentric structure in its fact pattern to carry the pedagogical weight even where the later phases are informed construction rather than documented history.

Two questions for you on Option 1 specifically before committing.

First, are you comfortable with a composite where you can review the labeling and correct any place where I've mislabeled construction as history or vice versa? The honesty depends on getting the labels right, and I'll want you to check them.

Second, would you rather the labeling be inline (each specific claim marked in the text) or in a header note at the start of each phase's worked-example section (saying which parts of this phase's example draw from documented history and which parts are constructed)? Inline is more precise but more visually cluttered; header-note is cleaner but less specific.

If you'd rather one of the other three options, tell me which and I'll proceed with that. If Option 1 works, tell me your answers on the two sub-questions and I'll begin drafting.

---

**Marc** (2026-09-09 01:10):

Ok. I have now reviewed the first nine sections and I want to give them back to you for your use and rework. I don't think sections 10-12 will need much alteration. We need all of this done before working on the kit.

---

**Claude** (2026-09-09 01:11):

Understood. Pausing kit work.

Send whichever form is easiest for you — the marked-up files, the paragraphs you want changed with the changes noted, or a summary of the shape of the corrections you want made. Any of those works. If some corrections are on the direction of the reasoning and others are on wording or emphasis, feel free to mix them; I can sort them as I work.

A few things worth knowing before you send.

I'll treat your revisions as authoritative — where you've changed reasoning, wording, emphasis, or ordering, I follow your changes rather than defending the original. Where a change ripples into other places in the same section or into other sections, I'll flag the ripples and ask before propagating them, so you can confirm which downstream places should update and which should stay.

If any of your revisions to Sections 1 through 9 change something that Sections 10 through 12 depend on, I'll flag that too. Your read that 10 through 12 will not need much alteration is probably right — those sections rest more on the four principles and the value definition than on the specific phrasings above them — but I want to check rather than assume.

Sections 5 (customer scenarios), 6 (Industry Platform), 7 (moods and speech acts), 8 (between-institution project shape), and 9 (catalytic seed capital) are the ones most likely to have ripple effects, because they instantiate the design's operational form and later sections use their language. Changes to Section 5's scenario definition, Section 6's Platform mechanics, or Section 8's ME formation sequence will most likely need matching updates elsewhere. Changes to Sections 1 through 4 are more contained.

I'll set aside what I've drafted and work from your revisions as the current text. Send when ready. Take the time you need.

---

**Marc** (2026-09-09 01:11):

Should I give them to you all at once?

---

**Claude** (2026-09-09 01:11):

Depends on the shape of your revisions.

If most sections have small independent corrections — a phrase here, a paragraph there, some wording changes — send them all at once. I can work through them in a single pass without losing track, and you don't have to manage a back-and-forth over many exchanges.

If some sections have substantial rewrites or reasoning changes that could ripple into other sections — Section 5's scenario definition changing, Section 6's Platform mechanics shifting, Section 8's ME formation sequence being restructured — send those one or two at a time. That lets us work through the ripples before compounding them with the next set of changes, and lets you see how I'm handling one revision before committing to how I'll handle the next.

Mixed case (some sections small corrections, some substantial rewrites) — send the small-correction sections together, and send the substantial-rewrite sections separately. Or send all of them at once with a note flagging which are which, and I'll handle the small ones as a batch and pause to work through each substantial one with you.

One practical constraint worth mentioning: this conversation is already long, and adding nine revised sections all at once will use a substantial amount of context on top of what we've built. That is fine, but it means I want to be efficient with how I work through them. If you send all nine at once, my inclination would be to work through them section by section in order, confirming after each that my interpretation of your revisions is right before moving to the next, rather than trying to hold all nine open in parallel.

Your call. What's easiest for you.

---

**Marc** (2026-09-09 01:13):

Let me give you one and then we decide. Each is handled similarly on my end.

_attachments: EDITED SECTION 1 fedwiki-lineup 3.pages_

---

**Claude** (2026-09-09 01:16):

Let me open it and take a look.

_[tool call: bash_tool]_

_[tool result]_

_[tool call: bash_tool]_

_[tool result]_

_[tool call: bash_tool]_

_[tool result]_

_[tool call: bash_tool]_

_[tool result]_

_[tool call: bash_tool]_

_[tool result]_

_[tool call: bash_tool]_

_[tool result]_

_[tool call: bash_tool]_

_[tool result]_

_[tool call: bash_tool]_

_[tool result]_

_[tool call: bash_tool]_

_[tool result]_

_[tool call: bash_tool]_

_[tool result]_

Got Section 1, extracted the full text, and read it carefully. Substantive edits throughout — most are precision moves that sharpen the design, several will ripple into later sections. Let me report what I see and check three things with you before working further.

**Key changes I read:**

Spelling and terminology settled: convener throughout (not convenor), RenDanHeYi throughout (not Rendanheyi). I'll propagate these across all sections.

A new named entity introduced: **Neighborhood-Catalyzing Industry Platform (NCIP)**. This becomes the specific term for WWHA's granting arm operating in the RenDanHeYi pattern. Big move — it needs to appear in Section 6 throughout (where I currently call it "the Industry Platform" or "WWHA's granting arm") and in Section 9 (compensation and capital flow).

The kit's scope explicitly widened. "This can include creating new associations (volunteers) or businesses (paid work for paying customers)." My original framed the output as between-institution projects. Yours frames it as new associations, new businesses, and the coordination among existing entities. This affects Section 5 (customer scenarios), Section 8 (project shape), and possibly Section 9 (what catalytic capital funds).

External facilitators, not just facilitators. "External (episodic)" is a precision I missed. The variety-distribution principle is about eliminating dependence on external, episodic facilitator teams — not on facilitation as such, which the convener still provides internally. This ripples into Section 2's Principle One.

WWHA collaborators updated: Dave Chase, Gil Lund, Elizabeth Hampton (not Kerry Turner). Kerry may still be involved in RCN broadly — the memory file describes her as your primary collaborator and RCN co-founder — but the WWHA designer set is different. I'll use the correct set in Section 11 and anywhere else specific collaborators come up.

Founded commons possession specified: Chris at the Fledge and Jerry at Leo's have founded commons; Carl and Brent don't yet. This is a real precision I had blurred. Affects Section 4 (the founded commons discussion), Section 6 (Platform actors), and Section 8 (worked example if the East County version comes up).

Cycle continuation now qualified: "if within scope of funder." Affects Section 6 (Platform operations across time) and Section 9 (catalytic capital's relationship to sustaining vs. seeding new work).

Rejection softened to actionable direction: "need to get these in place" rather than "not proceed." Section 4's founded-commons filter language should match.

Explicit rejection of "technical assistance" funding — this reinforces Section 2's Principle Two and Section 9.

**Three things I want to check before I work further:**

**1. The section list in your edited Section 1 doesn't include Customer Scenarios as its own section, and it lists Section 5 as "Industry Platform pattern and the neighborhood-authored balanced scorecard" combined.** My current design record has Customer Scenarios as Section 5 (its own section, per our conversation about the Haier scenario mechanism as an origin object) and Industry Platform as Section 6, with Balanced Scorecard developed in Section 10 (Value). Your Section 1 list may indicate you want the structure reorganized — no separate Customer Scenarios section, Industry Platform + Balanced Scorecard combined as Section 5 — or it may be an artifact of you editing before we added Customer Scenarios and the list didn't get updated. Which is it? If restructuring, that's a substantial rework of the middle sections and I want to know before I do it.

**2. "Their compensation will flow through the value chain from the microenterprises they seed" — you removed "and small groups"** that I had after "microenterprises." Deliberate? My reading was that small groups (Experience-ME analogs, per Section 5) also feed the value chain, but "microenterprises" as the general term may be sufficient. Small distinction, but I want to know if you're consolidating vocabulary.

**3. The closing meta-commentary from my draft ("That is section 1. Length ended up around 1350 words... React, correct, or say go and I'll draft section 2.")** is still in the file. I'll strip it when I take Section 1 into the design record proper — that was chat commentary, not section content. Confirming that's your intent too.

**Workflow going forward:** Once you confirm the three items above, I'll take your Section 1 as the current authoritative text and treat my draft as superseded. When I get Sections 2-9 from you, I'll do the same. Ripples into other sections I'll flag rather than propagate — you can decide which ripples to accept as I identify them. Sections 10-12 I'll leave alone until we've been through 2-9 and can see whether the ripples touch them.

Ready for Section 2 whenever you send it, or answer the three questions first if any of them changes what I should do.

---

**Marc** (2026-09-09 01:23):

Re #1: I am happy with your sections. RE #2: I have no strong opinion about use "small groups" when you think it is needed in addition to MEs. RE # 3: Yes your call on what meta data you think we need to preserve for ongoing work. I am sure we will pass over this content a few times and some meta data the planning material will be useful/required.

_attachments: EDITED Section 2.pages_

---

**Claude** (2026-09-09 01:25):

Got it on all three. I'll update the Section 1 section-list to reflect our actual twelve-section structure, use "small groups" where the sentence needs the distinction from MEs, and keep meta-commentary that reads as planning material rather than pure chat transition. Let me extract Section 2.

_[tool call: bash_tool]_

_[tool result]_

Got Section 2, read it in full. Softer, more direct, and more honest about difficulty than my draft — I can see the moves. Let me report what I read and check a few things.

**Key changes I see:**

Opening framing softened throughout. "Every attempt fails" → "This kind of work fails." "Structural response" → "response." "Materially harder to enter" → "less likely." Less absolutist, more truthful about what a design can guarantee.

Principle One picked up two important precisions that affect other sections. Ashby carrying "**models of** that variety" (not the variety itself) — this is the Conant-Ashby language proper, and it should propagate to Section 3 where VSM is developed. "Variety/model/system understanding hadn't been distributed" is a more accurate description of what CMG carried and left behind. And "external (episodic)" facilitators consistent with your Section 1 edit.

The tools description shifted: "distributed across the substrate rather than concentrated in a person" → "**modular and open source**." Matches the FedWiki-and-RCN-substrate philosophy directly.

Principle Two condensed the resolution substantially. "Compensation is not eliminated; it is completely dependent on and proportional to beneficiary value creation." That's the cleanest form of the McKnight-RenDanHeYi synthesis. And you dropped "not against it" from "McKnight's principle expressed through RenDanHeYi's mechanism" — no more need to argue with McKnight, the design just does what it does.

The instrumentation paragraph reformatted as bullets and adds a precision I'd missed: "**infrastructure and matching data schema**" (not just substrate). And the framing shifted from "becomes operational without depending on trust in individual judgment" to "we will tune the compensation agreements" — trust in participant judgment is preserved rather than replaced.

Principle Three dropped "that departs" from the heading. Consistent with the principle list summary. The departure aspect is still in the text, but no longer in the name. The "raise your kids" framing is kept.

Principle Four added an important angle: **compensation and/or reputation**. The Platform's incentive isn't only financial. This shifts how Sections 6 and 9 need to describe the compensation mechanism — reputation is real currency alongside money. Also the added parenthetical: "(THIS WILL BE CHALLENGING TO THE GRANTMAKER and a hard problem navigate—maybe impossible.)" — honest about the anti-capture principle being hard to actually operate.

"How the four hold together" got much simpler. Trust in participants' judgment is the closing note, not analytical enumeration of failure modes.

Language throughout: "release" became "**graduations and growing self-sufficiency (self-organizing)**" — more constructive, less finality. "Convenors run neighborhoods through" → "conveners support neighborhoods through" — less directive.

**Ripples I'll need to check in later sections:**

- **Reputation as compensation alongside money.** Sections 6 and 9 both describe the Platform's compensation mechanism. Both need to acknowledge reputation as real currency, not just financial flow. I'll flag both when we get to them.
- **"Models of" variety** — Section 3's VSM discussion should adopt the Conant-Ashby precision.
- **"Graduations and growing self-sufficiency"** — Sections 4 (founded-commons succession), 6 (Platform release), and 9 (catalytic capital departure) should adopt this framing.
- **"Infrastructure and matching data schema"** rather than just "substrate" — could ripple to Sections 6, 8, 9.
- **The ALL CAPS parenthetical note pattern for flagging open difficulties** — I want to check whether you want this as a documented pattern for the record. If yes, I'll look for other places where a similar honest flag belongs.

**Three things to check with you:**

**1. NCIP acronym status.** Section 1 introduced "Neighborhood-Catalyzing Industry Platform (NCIP)" as a formal name for WWHA's granting arm. Section 2 uses "neighborhood-catalyzing Industry Platform" lowercase without the acronym, and adds "is being considered for" softening ("WWHA's granting arm is being considered for designed as a neighborhood-catalyzing Industry Platform"). Two possibilities: (a) NCIP is the formal name and Section 2 will get updated when I integrate the ripples, or (b) NCIP was a working name in Section 1 that Section 2 backs off from because commitment isn't yet final. My inclination is (a) — introduce NCIP formally in Section 1 and use it consistently thereafter, with Section 2's language reconciled to match. Confirm?

**2. Reputation as currency — how prominent?** The addition of "compensation/reputation" and "compensation and/or reputation" is small in Section 2 but implies something larger. Should Section 6 develop reputation as a first-class element of Platform-actor compensation alongside financial flow, with its own mechanisms (portfolio visibility, cross-Platform recognition, elder attestation)? Or should it stay as a modifier acknowledging reputation matters without developing it as its own mechanism? My inclination is to develop it in Section 6 — it's real, it belongs, and SODOTO portfolios are the mechanism — but that's a genuine addition to the design that I want to check.

**3. Three small spots that read as possible typos or grammar I want to confirm are intentional before I preserve them:**
- "being considered for designed as" — my read is "being considered for design as" or "being designed as" 
- "how Marc describes Carl, Chris, Jerry, and Brent works" — my read is "how Marc describes Carl, Chris, Jerry, and Brent's work"
- "Their compensation flowing through the value chain" — my read is "Their compensation flows through the value chain"

If these were intentional, tell me and I'll preserve. If typos, I'll clean them.

Ready for Section 3 whenever you send it.

---

**Marc** (2026-09-09 01:36):

I don't think the ALL CAPS should survive our conversation. RE #1: Spell out NCIP, do not use acronym. #2: Reputation  is likely more important for Industry Platforms and their actors (too often called elders) than money, but I have not problem keeping reimbursement in there until we get feedback from WWHA folks. Do develop in in Section 6. #3: Your reads are correct including: "being considered for design as".

_attachments: EDITED SECTION 3.pages_

---

**Claude** (2026-09-09 01:37):

Got all three. ALL CAPS out. Spell out Neighborhood-Catalyzing Industry Platform (no NCIP). Develop reputation as first-class element in Section 6, keep money references until WWHA feedback. Typos as read. And I'll register the "too often called elders" flag — I'll ease off the elder framing where the sentence works without it.

Extracting Section 3.

_[tool call: bash_tool]_

_[tool result]_

Got Section 3. Multiple substantive edits and three working notes at the end pointing to real research and design work. Let me fetch the e-VSM tool before responding, since that's actionable now.

_[tool call: web_fetch]_

_[tool result]_

---

**Marc** (2026-09-09 16:37):

Can you continue or do you need something from me now?

---

**Claude** (2026-09-09 16:38):

I can continue. The fetch permission is a small quirk — the tool won't fetch URLs that haven't appeared in a prior search result, so I need to run a search first that surfaces the URL, then fetch it. Doing that now.

_[tool call: web_search]_

_[tool result]_

_[tool call: web_search]_

_[tool result]_

_[tool call: web_search]_

_[tool result]_

_[tool call: web_fetch]_

_[tool result]_

Read Section 3. Substantive edits and three working notes at the end. Report and questions.

**Key edits in Section 3 I see:**

S1 gets "most often voluntary and associational" — McKnight connection made structural. S3* gets Ostrom's commons-governance parenthetical linking it to informal monitoring and graduated sanctions. S4 gets "(and businesses)" — deficiency observation widened. And the Friston/Bayesian Belief Network parenthetical for S4's model-maintenance function connects S4 directly to the Free Energy Principle — significant, and it aligns with a memory-file intellectual anchor.

Idealized Design description shifted: "inside-and-desired" became "inside and outside-desired." That's a real precision — Idealized Design activates the desired both inside the system and outside it, not just one. And the reframing "operationally-possible present that is waiting" (from "history has prevented") shifts the mood from blame to invitation.

Ripple ReThink now "precursor" to ReThink Health, not variant. Chronological precedence made explicit. "Walking around the neighborhood" added to S3* forms. The Deming-mapping parenthetical at the end — Driver/Support/Mainstay corresponding to Beer's VSM levels — links to the 2014 Confluence architecture directly.

Compensation/reputation consistent with Section 2. Convener → conveners throughout. Section header "The VSM function this design focus on" (grammar: should be "focuses" — flag or preserve?).

**Ripples for later sections:**
- Deming levels mapping: Section 8 should reference (Spokane linkage maps were organized on this)
- S1 as voluntary-and-associational: Section 4 (founded commons) and Section 8 
- Friston/Bayesian connection: Section 10 (measurement, e-VSM synthesis)
- Reputation as compensation currency still needs full development in Section 6

**On the three working notes at the end** — the e-VSM tool, VSM-to-e-VSM transition, and RenDanHeYi integration — I need to report and ask.

I couldn't fetch the specific tool URL you sent (my web fetch requires URLs surface in prior search first, and that specific path didn't appear). I did find your substantive VSM writeup on the marcus subdomain and grabbed the key points from it — homeostat as fundamental ("the VSM itself emerges from the homeostat"), Idealized Design as innovation activation, polycentricity as structural, vernacular language over jargon, database for viability queries. That gives me your working position on VSM at a level Section 3 could draw on more heavily.

What I don't have and can't get from public search: the specific content of the e-VSM v3 diagram tool, the definition of your 33 paired homeostats, and how you've been mapping RenDanHeYi's ME/EMC/Industry Platform structure onto VSM/e-VSM levels. This is substantive substrate I'd need before writing an accurate VSM-to-e-VSM transition in Section 3.

**Three options for how to proceed on the working notes:**

**Option 1: Pause Section 3 finalization, gather substrate first.** You send me the e-VSM v3 diagram (screenshot, exported SVG, or the tool as text if it's small), the 33 paired homeostats definition, and any RenDanHeYi-VSM mapping notes. I do a research pass and draft the VSM-to-e-VSM transition and the RenDanHeYi integration properly, then integrate them into Section 3. Section 3 becomes accurately what RCN actually uses.

**Option 2: Add the transition and integration as flagged open work in Section 12, keep Section 3 as VSM-only for now.** This preserves the current Section 3 as a Beer-VSM introduction and defers the e-VSM extension work to a specific open question. Faster to get the record complete; leaves a real gap.

**Option 3: Draft a preliminary integration pass in Section 3 based on what I can infer, marked clearly as provisional, with your revisions to follow.** Riskier — I could get it wrong in ways that would confuse rather than clarify. But it moves the work forward.

My inclination is Option 1 for the substrate, then a substantive addition to Section 3 covering both the e-VSM extension of VSM and a first pass at the RenDanHeYi integration. That's real work but it belongs in Section 3, not deferred. Which option do you want?

Also worth naming: this is enough new material that it may reshape how much other sections need to change too. Sections 6 (Industry Platform), 8 (between-institution project shape), and 10 (measurement) all touch these frames and would need to be revisited once VSM/e-VSM/RenDanHeYi integration is clear in Section 3.

---

**Marc** (2026-09-09 16:58):

The link I provided was to the amazing tool that we (Claude Code I think) developed for creating eVSM surveys and analyzing the results. You should be able to find evsm-svg-v3.html here: /Users/marcpierson/rcn/tools/evsm-svg-v3.html. This tool should be instrumental in community based research, analysis, and tracking.

---

**Claude** (2026-09-09 16:58):

Understood — the tool is on your local filesystem at `/Users/marcpierson/rcn/tools/evsm-svg-v3.html`, not something I can reach from chat. I need Claude Code for that.

The routing looks like this: I stay in chat and continue on the design record while you pull the file open on your side. When you're ready, either paste the tool's key content into chat (the SVG structure, the labels on the 11 spheres and 66 directed edges, the survey questions if they're embedded, the Markov Blanket layer mapping) — or, if that's a lot, open Claude Code in your terminal with `~/rcn/tools/` as the working directory and have Claude Code read the file and give you a synthesis you can paste back here. Either path gets me the substrate I need to write the VSM-to-e-VSM transition accurately.

Two questions worth naming now.

**What of the tool needs to be in the design record versus in the kit versus stay operational.** The tool itself is operational — respondents use it, results get synthesized, patterns emerge. What Section 3 needs is enough of the tool's structure to explain how e-VSM extends Beer's VSM: the added features (33 paired homeostats, negotiated links, coordination communication links), the isomorphisms with Beer, and what the tool actually surfaces when a neighborhood runs it. Not every SVG element and label. Just enough for a reader to understand what e-VSM does that VSM alone doesn't.

The kit's Phase 1 and Phase 5 sections will reference the tool operationally — how a convener deploys the survey, how the results feed the linkage-mapping meeting, how Claude API synthesis integrates evidence and suggestions. That's operational detail belonging in the kit, not the design record.

**What to do meanwhile.** Two possibilities. First, I can pause Section 3 finalization and wait for your substrate to arrive. Or second, I can proceed to reviewing your Section 4 edits if you're ready to send them, since Section 4's founded-commons material is largely independent of the VSM-to-e-VSM transition and the ripples we've already identified are what carry forward. When your e-VSM substrate arrives, I take another pass at Section 3.

My inclination is the second — keep working through the sections you have ready while the tool substrate gathers on your side. When you send it, I integrate. That way neither of us is waiting.

Send Section 4 when ready, or send the e-VSM tool content, or say which order you'd rather work.

---

**Marc** (2026-09-09 17:01):

This tool may be particularly relevant so here are the documents.

_attachments: evsm-intro.html, evsm-manual-excel.html, evsm-manual-report.html, evsm-architecture.html, evsm-manual-aggregator.html, evsm-manual-survey.html, evsm-workflow.html, evsm-intro.html, evsm-manual-excel.html, evsm-manual-report.html_

---

**Claude** (2026-09-09 17:03):

Reading the other files from disk.

_[tool call: bash_tool]_

_[tool result]_

_[tool call: bash_tool]_

_[tool result]_

Read all seven docs — the introduction, architecture, workflow, and four manuals. This is a complete, operational, thoughtful tool suite. What I hadn't grasped from Marc's earlier notes is the specific structure that makes it e-VSM rather than VSM. Reporting what I understand and proposing how to integrate it into Section 3.

**What e-VSM adds to Beer, as I now read it:**

Eleven spheres organized into three layers that map directly to Friston's Markov Blanket — Sensory/Interface (S-4 Awareness within, S-7 Resources, S-9 Awareness beyond), Internal Core (S-3 Tools/workspaces, S-6 Ability to get things done, S-8 Quality of planning), and Alignment/Homeostatic (S-1 Coordination, S-2 Involvement, S-5 Quality of learning and change, S-10 Leadership, S-11 Culture). Sixty-six directed edges = thirty-three paired homeostats. Every important relationship is a bidirectional coupled regulation, generalizing Beer's homeostat concept from a few key regulators to the whole system's connective tissue.

Every sphere carries anatomical framing (systems-theory) and vernacular description (community-facing) simultaneously. This operationalizes your "discover the words the group already uses" principle without discarding the systems rigor underneath. It matches the design record's Section 7 progressive-disclosure principle at the tool level.

Multi-perspective by construction — World categories, Set A / Set B compare, per-respondent view. The tool doesn't produce one truth but shows multiple truths against each other. This is the operational form of the democratic problem-solving Marc named ("the whole from the part and the whole into the parts").

Claude API synthesis reads evidence and suggestions across respondents to surface convergence and divergence. Claude sits in the loop at the S3\*-audit function, feeding S4 with information the ongoing operational stream would smooth over.

The Homeostatic Pairs Report structure — organized by focal sphere with both directions of each relationship — is Beer's cybernetic structure operationalized as a readable document. "Each sphere's state is the outcome of its coupled regulatory processes with its neighbors" — that framing belongs in the design record verbatim.

**Two proposed additions to Section 3:**

**Addition A — new subsection: "From VSM to e-VSM: extending Beer for neighborhood-scale operation."** Placed after "The five functions, in Beer's numbering" and before "What a neighborhood as viable system looks like." Roughly 800-1000 words. Would cover:
- Beer's five as necessary but underspecified at neighborhood-scale operation
- The extension to eleven spheres in three layers (Markov Blanket structure)
- Why 33 paired homeostats: generalizing Beer's homeostat to every meaningful relationship, making the system's regulatory couplings visible
- The isomorphism (mapping Beer's 5 to e-VSM's 11 by layer)
- Anatomical/vernacular dual naming as the tool-level form of Section 7's progressive-disclosure principle
- The Friston/Markov Blanket connection made explicit — three-layer structure = sensory/active/internal states of a Bayesian inference machine
- Multi-perspective by construction as the operational form of democratic problem-solving

Then the existing "What a neighborhood as viable system looks like" subsection revised — currently describes each of Beer's five systems with neighborhood examples; would be revised to describe each Beer system with the corresponding e-VSM spheres, keeping the neighborhood-grounded examples but making the eleven-sphere structure visible.

**Addition B — new subsection: "RenDanHeYi at recursion levels through VSM/e-VSM."** Placed after "The polycentric recursion" and before "What this section commits the design to." Roughly 600-800 words. Would cover:
- Haier corporation as a viable system: MEs as S1s, Industry Platform as S3/S4, Zhang's leadership as S5, customer scenarios as S4 memory
- Single ME as a viable system inside Haier: its own S1-S5 with zero-distance-to-users as its S4
- WWHA-and-neighborhood at analogous recursion: WWHA-Industry-Platform as S3/S4 for a cluster whose S1s are neighborhoods; each neighborhood as viable system with MEs and small groups as its S1s
- The Experience-EMC / Solution-EMC split mapped to VSM: Experience-EMCs as S4-heavy (scenario articulation), Solution-EMCs as S1-heavy (scenario execution), scenarios as S4 memory that persists across specific S1 attempts
- How e-VSM's paired homeostats operationalize the value-chain instrumentation (each ME↔user pair is a homeostat; the VAM is what regulates it; CfA-dSC is the smart-contract layer)

**Ripples I'll flag as I draft:**
- Section 7 (moods/speech acts) — the anatomical/vernacular dual naming pattern in e-VSM matches Section 7's progressive-disclosure principle. Cross-reference.
- Section 8 (between-institution project shape) — e-VSM tool becomes operational instrument for Phase 2 preparation and Phase 5 retrospective, and every scenario→ME→user chain instruments as homeostatic pairs.
- Section 10 (value/measurement) — e-VSM is the multi-perspective instrument that neighborhood-authored balanced scorecards will run on. The Homeostatic Pairs Report is a specific form the retrospective can take.
- Section 6 (Industry Platform) — Platform actors read e-VSM synthesis to inform their support decisions and to feed the reputation/compensation loop.

**Three questions before I draft the additions:**

1. **Section 3 length.** With both additions Section 3 goes from about 2100 words to about 3500-4000 words. Substantial. Alternative: put Addition B (RenDanHeYi integration) in its own new section (Section 3a or Section 4-prime) rather than expanding Section 3. My inclination is to keep both in Section 3 — the VSM frame is coherent as a single treatment — but the length trade-off is real. Your call.

2. **e-VSM as the frame throughout, or VSM as the frame with e-VSM as the extension?** Right now Section 3 is Beer's VSM with brief mentions of e-VSM. My Addition A treats VSM as foundation and e-VSM as extension. But the design's actual working tool is e-VSM. Should the whole record adopt e-VSM as the frame with Beer's five as underlying scaffold, or preserve VSM as the primary language with e-VSM as extension? First matches operational reality; second respects Beer more visibly. I lean toward the first with explicit honoring of Beer in the transition, but say if you'd rather the other way.

3. **Is my mapping right?** My Beer-to-e-VSM sphere mapping is inferred from the intro doc's descriptions. If your working mapping differs — if S-6 doesn't primarily map to S1, or S-8 planning belongs elsewhere, or the S-1 through S-11 numbering carries logic I haven't seen — tell me before I write. Getting the isomorphism wrong would make Addition A misleading.

Ready to draft on your answers.

---

**Marc** (2026-09-09 17:03):

I am not sure where we will want to include this material but now you have it.

---

**Claude** (2026-09-09 17:03):

Registered. I'll hold the material as substrate available to any section that needs it, and not force it into Section 3 without a clear reason.

My working plan, unless you tell me otherwise:

The e-VSM substrate stays available across the record. When your Section 3 edits arrive as final, I'll integrate them and note explicitly where e-VSM material would land if we wanted it — probably in a subsection of Section 3, or in Section 8 (operational use during phases), or in Section 10 (measurement). You can then decide per section whether to pull the substrate in or leave it out.

The RenDanHeYi/VSM/e-VSM integration question is real work but doesn't have to be resolved in Section 3. It could live in its own section, an appendix, or a companion document. Or it could stay in the working substrate for now and get formalized once WWHA operations produce enough concrete cases to write about.

The e-VSM tool itself gets referenced operationally in the kit (Phase 1 diagnostic, Phase 2 preparation, Phase 5 retrospective) whether or not the design record's Section 3 covers its architecture. The kit needs to point at the tool and describe when convenors use it; the design record doesn't have to explain the tool's internals to make that point.

I'll flag when I see a specific spot where a piece of e-VSM material would strengthen a section, so you can decide in context rather than in the abstract.

Ready for Section 4 whenever you send it, or for a different direction if you want to change what we're working on next.

---

**Marc** (2026-09-09 17:05):

FYI, The key thing that eVSM does not yet handle are the explisit links to the environment that are indicated.

_attachments: rcn-graph-of-evsm.svg_

---

**Claude** (2026-09-09 17:06):

_[tool call: bash_tool]_

_[tool result]_

Read the SVG carefully. Now I see three concentric structures:

**The core eleven spheres in their RCN-vernacular naming** — Coordination, HR, Tools, Outreach, Innovation, Worldview & Identity, Policies & Legal, Managing, Resources & Accounting, Research, Planning. Different labels from the intro-doc's default (Awareness within, Involvement, Culture, etc.). This is the vernacular-description principle actually working: same underlying structure, RCN's own language. The 33 paired homeostats sit here.

**The environment layer, ten external entity types** — Customers, Suppliers, Financiers, Regulators, Competitors, Partners, Market Geographies, Ideal Futures, plus Suppliers (OU) and Customers (OU). Explicit directed edges from specific core spheres to specific environment entities: sphere 4 to Government and Customers, sphere 7 to Financiers and Suppliers, sphere 9 to Partners, Ideal Futures, Regulators, Competitors. The Sensory/Interface Layer at work — but only in the graph, not yet in the survey.

**The recursion downward** — Operating Unit Hub connecting to OU-1, OU-2, OU-n, with edges to spheres 1, 2, 3, 4 above. This shows the S1s inside the viable system at neighborhood scale — the small groups, MEs, and operating units that the neighborhood contains. Each of those OUs is itself a viable system at a lower recursion level with its own eleven spheres, its own environment, its own S1s below.

Your point registers exactly. The current eVSM survey handles the eleven-sphere internal structure with its 33 paired homeostats well. What it does not yet handle is:

1. **The environment interface** — the explicit directed relationships between the neighborhood's Sensory/Interface Layer (Outreach, Policies & Legal, Resources & Accounting in RCN naming) and the specific external entities that layer interfaces with. Customers-of-the-neighborhood, Suppliers-to-the-neighborhood, Regulators-over-the-neighborhood, Competitors-of-the-neighborhood, Ideal-Futures-toward-which-the-neighborhood-designs. These are shown in the RCN graph as necessary connections but are not part of the survey's assessment structure.

2. **The recursion downward to specific S1s** — the survey treats the neighborhood as a unit and assesses its internal spheres; it doesn't yet let a respondent (or the aggregator) go a recursion level down to see the S1 operating units and their own e-VSM structure.

Both are real gaps. The graph is more complete than the survey; the design record should honor both — what e-VSM currently operationalizes and what it aspires to.

**For Section 3 this means, when we do integrate e-VSM material:** describe both what the tool does now (11 spheres, 33 paired homeostats, three-layer Markov Blanket, dual anatomical-vernacular naming, multi-perspective aggregation with Claude synthesis) AND what the underlying model calls for that the tool does not yet reach (explicit environment interface, recursive OU structure). Not as failure — as work in progress and as design horizon.

I'll keep this in the substrate, ready to draw on when we integrate e-VSM into Section 3 or elsewhere. Nothing to draft against right now unless you want to tell me otherwise.

Ready for Section 4 whenever you send it, or for a different direction.

---

**Marc** (2026-09-09 21:22):

Re: The recursion downward to specific S1s. All that is required it that another eVSM survey is done at the next level (the one that makes up the one currently in focus or the one that the current institution in focus is a part of. Recall Jose Perez Rios' diagram. It will be interesting to understand how the recursions are related named and queried in Neo4j.

_attachments: EDITED SECTION 4.pages_

---

**Claude** (2026-09-09 21:24):

Registered — recursion via separate eVSM instances at each level, linked in Neo4j. Elegant. Naming and query patterns become a substrate question rather than a tool question. Extracting Section 4.

_[tool call: bash_tool]_

_[tool result]_

Got Section 4 with all your edits and parenthetical marginalia. Reporting what I see and answering the questions you raised.

**Key edits:**
Opening softened ("Neighborhoods...benefit from having" instead of "Every neighborhood...has"). "Without a founded commons, much of this will not survive" instead of "none of this survives" — matches the Section 2 softening pattern. The Oregon/eastern Washington failure note tied to lack of founded commons is a specific evidentiary point I hadn't included, and it belongs. The catalytic space metaphor (molecules forming at right temperature) reshapes the "hard filter" framing to acknowledge that collective work happens without a founded commons but accelerates with one — softens the absolutism without losing the design commitment. The spaces-as-power observation ("what government and business use to maintain their power is shared spaces") is important and belongs — I hadn't drawn out the political dimension explicitly. And the parking-lot-rain metaphor about failed capital pours is doing serious work — carries into Section 9. Also caught "legible" in the figurative sense and corrected to "understandable" — that was a slip on my part against your standing preference.

The convener-provided-space paragraph you trimmed heavily. Cleaner. The core distinction stays; the person-by-person nuance goes to the kit rather than the design record.

**Answering your four asks:**

**1. Haier 650,000 Community Stores — evidence.** The number comes from Zohar, *Zero Distance*, Ch. 16 ("Haier: A Maker's Culture"), where she writes that Haier operates one in every one of China's 650,000 villages, serving as community center (after-school childcare) and as a service platform for anyone with an entrepreneurial idea. The number is Zohar's; I cannot independently verify. China's administrative-village count is typically reported at ~500,000-690,000 depending on year and definition; if Haier operates a store in each administrative village, that would be the right order of magnitude. Whether Haier's actual coverage matches "one in every village" as of any specific year, I can't confirm without contacting Haier or checking their annual reports. My recommendation: soften the language to "Zohar reports Haier operates a Community Store in each of China's roughly 650,000 villages" — attributes the specific number to the source and lets a reader trace it, without asserting it as independent fact.

**2. "Patience" — elaborate with example.** Patience here is operational, not sentimental. When one of the two filters is present but the other isn't, patience means the granting arm stays in relationship, watches, and does not proceed to Phase 2. Concrete: a neighborhood has mutual-aid networks, food distribution, informal childcare rings — real small groups getting things done — but no founded commons. Patience means the convener knows who those small groups are, stays in touch, does not invite them into the kit's phases, does not offer capital, and watches for whether a founded commons emerges (someone activates a garage, a church basement gets adopted as neighborhood space, a maker space appears). When it emerges, the convener is ready. Or the opposite: a founded commons exists — someone converted a building for community work — but no small groups have formed around it. Patience means the granting arm doesn't fund the founded commons as if it were the neighborhood's collective work, doesn't invite the founder alone into the phases, and watches for whether small groups begin using the space for their own initiatives. The wrong response in either case is to try to force what's missing to emerge on the granting arm's timeline. The right response is to remain in relationship without demanding readiness. I'll write this into the section as an example.

**3. Multiple associations as foundation for a unified founded commons.** Yes, and it's a real design possibility worth adding. Existing associations (church, food co-op, maker space, volunteer fire company) might federate around a shared space that they collectively cede to the neighborhood as the neighborhood's — becoming a founded commons through federation rather than through single-founder origin. The pattern is different but the outcome is the same. The distinction that matters is whether the space becomes recognized by the neighborhood as the neighborhood's, or remains understood as the associations' shared conference room. When it's the latter, it's a coalition-backbone arrangement — the failure pattern Section 8 diagnoses. When it's the former, the founder's-role-shifting-to-steward move applies collectively rather than individually. I'll add a paragraph noting this possibility.

**4. Highlander 3.0 as generative response.** Substantive addition — a whole named RCN initiative I didn't have. Registering: cohorts of neighborhood actionists (Chris's term, distinct from "activists") move through neighborhoods with vibrant founded commons — Superior, Lansing, Whatcom — spending weeks in each, learning from the places and people and from each other. Networked version of Myles Horton's Highlander Folk School (Highlander Research and Education Center after 1961). This gives the honest "not ready yet" outcome a real generative response beyond patience: introduce their actionists to networks with vibrant founded commons. Learning by immersion. I'll add this to the closing of Section 4 and also flag it as belonging in Section 11 (prior-work substrate) and Section 12 (ongoing RCN initiatives).

Small spelling note: it's Myles Horton (with a Y), not Miles. Preserve his spelling.

**Ripples I'll carry to other sections:**
- Catalytic space metaphor and the parking-lot-rain metaphor → Section 9 (catalytic capital)
- Spaces-as-power observation → Section 3 (VSM), Section 6 (Industry Platform)
- "Actionist" (Chris's term) as vocabulary distinct from "activist" → possible in Section 8 (ME participants) and Section 11 (prior work)
- Highlander 3.0 → Sections 4, 11, 12

Ready for Section 5 when you send it. Or, if you'd rather, I can rewrite Section 4 with these adjustments made (Haier language softened, patience example added, multiple-associations paragraph added, Highlander 3.0 in closing) and show you the result before you move on.

---

**Marc** (2026-09-09 21:38):

continue

---

**Claude** (2026-09-09 21:40):

Rewriting Section 4 with your edits absorbed and the four items I offered to add worked in.

---

# Section 4 — The Founded Commons

## What the concept names

Neighborhoods that sustain collective work over time benefit from having a place where that work happens. Not a place it borrows. Not a place an outside institution lets it use. A place the neighborhood recognizes as its own, safe, culturally appropriate, and available reliably enough that people know where to go and when.

The concept has several names in adjacent literatures. Ray Oldenburg's "third place" — home, work, and the other — captures some of it, though third-place discussions usually stop at hospitality and don't reach the purpose-built-for-collaborative-work part. "Commons" from Elinor Ostrom's tradition captures the governance shape but is vague about origin. "Community-owned civic infrastructure" is accurate and hard to say. The working phrase adopted here is "founded commons" — grammatically awkward, but it captures both the specific origin (someone founded it, from inside, for this purpose) and the collective present-tense function (it operates as a commons, not as a private facility that visitors use).

The phrase is the start of a conversation, not the end of one. Each neighborhood that engages with the kit will develop its own language for what its founded commons is called and what it is for. What matters is not the term but the pattern.

The pattern has several conditions holding together. None alone is sufficient; together they distinguish a founded commons from a friendly-but-not-quite space.

**Origin from inside.** A community member or members created it for the whole community. Not imposed from outside by government, foundation, or existing institution. Not spun up as a customer base for someone's business or a congregation for someone's church. Someone from within the neighborhood, seeing what the neighborhood needed, made this place happen.

**Purpose designed for collaborative work.** Built or converted deliberately for the collective work of the neighborhood, not incidentally hospitable to it. The Fledge in Superior, Arizona and Leo's in Lansing, Michigan are purpose-built in a way a coffee shop is not, even a friendly coffee shop with a corner table. The purpose shapes the space and the space shapes what happens there.

**Ongoing use as commons.** The neighborhood recognizes it as theirs and uses it that way, whether or not the founder is present in any given hour. The founder's role has shifted or is shifting from proprietor toward steward. The community's ownership is functional and cultural even where not legal.

**Not captured by external actors.** No government agency, foundation, or established institution can direct what happens in the space, even when one occasionally funds it or uses it. The neighborhood decides who comes in, what happens there, how it is used. External support is welcomed on the neighborhood's terms or not at all.

These four conditions are the substance. Everything else — the physical layout, the schedule, the funding basis, the specific programming — varies by neighborhood and should vary by neighborhood. The founded commons in East County will not resemble the founded commons in Birchwood, which will not resemble Leo's or the Fledge. What they share is the pattern of how they came to be and how they function now.

Collective work and play can occur without a founded commons. The founded commons is not a precondition for civic life; it is a catalyst for it. Placing elements near enough and at the right temperature, new molecules form or reform. The catalytic power of such spaces should not be discounted — they raise the likelihood of creative chemistry that would otherwise happen more slowly or not at all.

## Why the founded commons is a Phase 1 hard filter

Every earlier section of this design record depends on the founded commons being present. The linkage map lives somewhere visible over time; the retrospectives happen somewhere the neighborhood knows to come back to; the portfolios and scenarios accumulate somewhere; the moods and speech-acts work builds up a field in a place; the between-institution project chartering happens where the parties can gather without borrowed ground shifting under them.

Without a founded commons, much of this will not survive contact with the neighborhood's actual life. Meetings happen in scattered borrowed rooms; the linkage map exists only on someone's laptop; the retrospectives get cancelled when the borrowed room isn't available; the mood field never accumulates because no place holds it; the work depends on the convener's ability to keep re-inviting people to each new location. That is the failure pattern, and it is reliable enough to serve as a hard filter.

The political dimension is worth naming plainly. Government and business maintain much of their power through the shared spaces they design for institutional purposes — the state house, the corporate campus, the courtroom, the boardroom. Neighborhoods and civil society, and the latent civic power that lives in them, equally benefit from their own recurrent convening places. Without such a place, civil society meets on borrowed institutional ground and speaks in the register that ground permits. With it, civil society meets in a place where its own register is native.

The failure for the CMG work in Jackson County, Oregon and in Spokane, Washington to continue and accelerate can be linked in significant part to the temporary lodgings used for the collaborative work. The linkage-mapping sessions produced real between-institution projects; the sessions were held in hotel conference rooms, hospital meeting spaces, and similar institutional venues. When the CMG team went home, the ground of the work went with them. No founded commons had accumulated the mood field, the visible artifacts, or the neighborhood's recognition of ownership that would have carried the practice forward without external facilitation.

The Phase 1 convener's work therefore includes a real diagnostic question: does this neighborhood have a place its people already recognize as theirs, safe, culturally appropriate, purpose-built for collaborative work, and available to hold recurring gatherings over months? If the answer is no, the work does not start here. Not "we'll help them find one." Not "we'll host at the library until they figure it out." No founded commons, no start.

This is not sentimental. It is the design's honest recognition that neighborhoods without a founded commons are neighborhoods where the substrate for what the kit does isn't present, and no external effort can substitute for that prior self-organizing. The right response to that absence is to name it plainly, decline to force the work, and leave the neighborhood alone until the substrate develops — which it may do on its own timeline, or may not.

Two related failures the filter also prevents. First, the convener's temptation to provide temporary accommodations. The distinction that matters is whether the neighborhood has adopted the space as its own or whether it remains the convener's space that the neighborhood visits. For Chris and Jerry, the Fledge and Leo's have plausibly crossed into founded-commons status — the neighborhood uses them as commons, the founder's role has moved toward steward, and the ongoing use is community-recognized.

Second, the temptation to accept an existing institutional space (a church hall, a library room, a school gym) that is friendly to the work but not founded from inside the neighborhood for it. These spaces are often available and often generous. They are not founded commons. The neighborhood using them is still visiting; the institution decides what continues to happen there; when institutional priorities shift, the space becomes unavailable and the work has no ground. The kit's Phase 1 should recognize the difference and prefer waiting for a real founded commons over starting on borrowed institutional ground.

## The Phase 1 diagnostic — how the convener sees a founded commons

Rather than a checklist to interrogate the neighborhood with, the diagnostic is a set of dimensions the convener holds internally through the pre-work period and asks conversationally where appropriate. Some of these are harder questions and asking them all directly would feel like an interrogation; the convener's judgment shapes which get asked and which get answered by observation.

**Origin.** How did this place come to be? Who initiated it, and were they of this neighborhood at the time? Was it built or converted for the collaborative purpose it now serves, or is that use retrofitted onto a space built for something else? How long ago, and what did the neighborhood look like then?

**Founder relationship, present tense.** Is the founder still active in the space? In what role — proprietor, steward, member among members, absent? Has the founder's role visibly changed over time? What would happen if the founder were gone for a month, six months, a year? Would the space still function?

**Governance in practice.** Who actually decides what happens here — programming, use, access, changes to the space, financial decisions, disputes? Is there a formal structure (board, collective, cooperative), an informal one (a recognized group of decision-makers), or does it default to the founder or a small circle? Does the neighborhood recognize the decision-makers as legitimate?

**Access and membership.** Who can come in, and on what terms? Is there a membership, a fee, a vouching pattern, open access? Who has keys or equivalent? Are there people the neighborhood expects to be there, and are there people who would feel unwelcome, on what grounds?

**Safety in the specific sense.** Is this a place where people say things they would not say elsewhere? Are disagreements and hard conversations survivable here? Have they happened? What happens to someone who challenges a decision made in this space? Are there groups in the neighborhood who would say this space is not safe for them, and why?

**Cultural fit.** Whose language is spoken here, literally and in the sense of vocabulary, register, unspoken norms? Are there neighborhood populations who would enter and feel this is not their kind of place? Who does the space attract, and who does it fail to attract — and does the neighborhood match that pattern?

**Function match.** Can 8-15 people sit together for a working session? Can a linkage map stay up on a wall for months? Can there be a recurring recognizable time? Can materials, artifacts, and evolving work be stored and displayed?

**Financial durability.** How does the space stay open — rent, ownership, donations, membership, revenue from other activity? Is that basis stable across a change in economic conditions? Who holds the risk if it fails? Is the neighborhood at risk of losing the space to a landlord decision, a tax event, a founder health event? What is the succession plan if the founder becomes unable to continue?

**Constituency.** How many people in the neighborhood use this space or have used it — not attended an event once, actually used it? Would neighborhood members recognize each other as fellow users? Is there a "regulars" group whose composition changes over time or stays stable? Are people showing up from the neighborhood specifically, or is the space drawing from a wider geography that happens to include the neighborhood?

**History under stress.** Has the space been through anything hard — a leadership conflict, a financial crisis, a founder-departure attempt, an external threat? How did it come through? A space that has survived a real stress event has demonstrated its commons character; one that has not been tested has claimed it.

**Neighborhood recognition.** If the convener asked ten random neighborhood members "does this neighborhood have a place that belongs to it, where the neighborhood's work happens," would they name this space? Would they name a different one? Would they say no? The answer to this question is more diagnostic than any of the others above.

An eleventh dimension is worth naming as a specific finding rather than a diagnostic question. **The Haier parallel.** Danah Zohar reports in *Zero Distance* that Haier operates a Community Store in each of China's roughly 650,000 villages. Each serves as a community center — Zohar notes after-school childcare specifically — and as a service platform for any citizen with an entrepreneurial idea, where anyone can be an employee, a designer, or the founder of a new ME. The specific coverage number is Zohar's; the pattern is what matters here. That the world's most operationally successful RenDanHeYi implementation depends on a physical neighborhood-scale interface is confirmation the founded commons pattern is not a Western nonprofit conceit — it is what neighborhood-scale civil-society and neighborhood-scale entrepreneurial-society share as a common substrate.

## Beyond the diagnostic — the small groups filter

The founded commons is one filter. The other, which turns out to be at least as important, is whether the neighborhood already has small groups getting things done outside of business and government — often with business owners and government officials in peripheral roles. If those small groups exist and are findable, the neighborhood has the substrate the kit needs, whether or not a fully-formed founded commons is yet in place (though typically the two co-occur). If the small groups do not exist, the founded commons alone is not enough.

Neighborhoods often have multiple active associations already — a church, a food co-op, a mutual-aid network, a volunteer fire company, a maker space, a community garden. These are not themselves founded commons, but some subset of them may federate around a shared space that they collectively cede to the neighborhood as the neighborhood's — becoming a founded commons through federation rather than through single-founder origin. The pattern of origin is different; the outcome pattern is the same. The distinction that matters is whether the space becomes recognized by the neighborhood as the neighborhood's, or remains understood as several associations' shared conference room. When it's the latter, it's a coalition-backbone arrangement — the failure pattern this design exists to avoid. When it's the former, the founder-role-shifting-to-steward move applies collectively rather than individually. The associations' leaders become co-stewards; the space belongs to the neighborhood.

Together the two filters are the honest Phase 1 diagnostic: is there a founded commons this neighborhood recognizes as its own, and are there small groups already doing work of the shape that the kit's phases will amplify? Where both are present, the kit can serve. Where either is absent, the honest answer is to name what is absent, not force the work.

No one can force anyone to create neighborhood collective action, and the design should not try. No one can keep pots of money from being distributed to places without substrate, either, and the design should not try to police that. Money poured onto ground without substrate runs off like rain on cement — nothing grows. That is not a failure of the money or the neighborhood. It is just a parking lot rather than a neighborhood, sometimes a very expensive parking lot that many people park on. The granting arm's discipline is to know where it is watering and what it can reasonably expect to come of it.

The relationship between the two filters is worth noting operationally. Small groups often create founded commons — a founded commons is often the physical infrastructure that a set of small groups has willed into being over years. And a founded commons often supports the emergence of new small groups — a space designed for collaborative work makes new collaborations possible that would not otherwise form. The two are causally entangled and mutually generative.

Where only one is present, the neighborhood is on the way toward enhanced creative capability but not yet ready for the kit's phases; the honest response is patience. Patience here is operational, not sentimental. It means the granting arm stays in relationship, watches, and does not proceed to Phase 2. A concrete example: a neighborhood has mutual-aid networks, food distribution, informal childcare circles — real small groups getting things done — but no founded commons. Patience means the convener knows who those small groups are and stays in touch with them; does not invite them into the kit's phases; does not offer capital for the work they are doing; and watches for whether a founded commons emerges. Someone activates a garage; a church basement gets adopted as neighborhood space; a maker space appears. When it emerges, the convener is ready. The opposite case: a founded commons exists — someone converted a building for community work — but no small groups have formed around it. Patience means the granting arm does not fund the founded commons as if it were the neighborhood's collective work; does not invite the founder alone into the kit's phases; and watches for whether small groups begin using the space for their own initiatives. When they do, the convener is ready.

The wrong response in either case is to try to force what's missing to emerge on the granting arm's timeline. The right response is to remain in relationship without demanding readiness.

## Succession — how a new founded commons replaces an old one

The design record has to hold two open questions about the founded commons over time, because RCN is actively grappling with both and the answers are neither settled nor hidden.

**How long before a founded commons loses its qualities.** The failure modes are several. The founder-steward departs without succession and the space reverts to whoever holds the lease. Growth attracts institutional capture — grants with strings, partnerships that dilute purpose, professional staff whose accountability drifts outward toward funders. Neighborhood turnover empties the constituency of use. Or the collaborative-work function decays into event-hosting or co-working, retaining the form and losing the substance. The kit does not solve any of these — but it does place the retrospectives of Phase 5 as the natural site for noticing degradation early, before the work becomes dependent on ground that is about to shift.

**How a new founded commons can replace an old one.** This is the harder question, and its framing deserves preservation: this is biology and sociology and anthropology, not engineering. The way life adapts and extends. Vester's biological systems framework points at the shift from mechanical to biological systems thinking as the frame the answer lives inside. New founded commons emerge as old ones age; the emergence follows patterns of imitation, adaptation, mutation, and selection that biological systems know how to do and mechanical systems cannot fake. What RCN can do is document the pattern as it appears, notice what conditions favor emergence, and refuse to over-specify.

Some early observations worth carrying, without claiming they are settled:

Emergence seems to require an aging founded commons whose founder is preparing to release, and one or more younger neighborhood members who have absorbed the pattern by participation and are ready to found their own version. The pattern replicates through participation, not through instruction. This is Vester's biological logic — new species emerge from old species through variation, not from blueprints.

Emergence appears easier where the aging founded commons has stayed small enough to remain understandable as a pattern, and harder where it has grown large enough to require formal governance and paid staff. This has implications for how founded commons should be encouraged to develop — the pressure to grow, professionalize, and formalize is often the pressure toward institutional capture, and that same pressure suppresses the emergence of the next generation of founded commons.

Emergence appears to depend on the presence of what elders would recognize as their own younger selves — people in the generational stage of doing rather than of releasing, but with a sensibility that would make them capable of releasing later. This has succession implications for the elder-mentorship role in the granting arm's menu: mentoring a younger neighborhood person in the founding of a new founded commons is different from mentoring an ME leader, and requires the same kind of long patience that raising a child does.

The kit should carry these observations as open work and point conveners toward the RCN conversation about founded commons succession rather than claiming to answer. Section 12 (open questions) preserves the questions in their unresolved form; this section names them and refuses to pretend the design record has them solved.

## What Section 4 commits the design to

The founded commons is treated throughout the design record as substrate the kit requires rather than substrate the kit creates. The Phase 1 diagnostic is honest about this. The kit will not attempt to force a neighborhood without founded commons or without functioning small groups; the invitation Phase 1 opens will surface those absences, and the honest response is to decline to proceed rather than to force-fit.

A generative response to that absence exists in the RCN work. Neighborhoods with vibrant founded commons can host cohorts of neighborhood actionists — Chris Casillas's term, chosen to emphasize action-taking rather than the political-activism connotation of "activist" — from neighborhoods still developing their substrate. The initiative RCN is calling Highlander 3.0 is a networked version of Myles Horton's Highlander Folk School (later Highlander Research and Education Center), the Tennessee institution where the leaders of the civil rights and labor movements were formed through immersion and peer learning. In Highlander 3.0, cohorts move through Superior, Arizona; Lansing, Michigan; and Whatcom County, Washington — and other locations as the network grows — spending weeks in each, learning from the places and from the people who founded and steward them, and, crucially, learning from one another. When a neighborhood declines the kit for lack of substrate, its actionists can be introduced to the Highlander 3.0 network. Learning by immersion in vibrant founded commons is one of the ways new founded commons come to be founded.

The founded commons is also treated as a living, mortal thing whose life is measured in years to decades. Founded commons that lose their qualities are named honestly as such; new founded commons that emerge from participation in aging ones are recognized as the pattern's natural succession. Neither the founded commons nor the neighborhood is a static object; both are viable systems in Beer's sense that maintain themselves through ongoing work and decline when that work stops.

Section 5 introduces the customer scenario as the durable object that the kit's phases produce, hand between MEs, and carry forward across cycles — the object that only makes sense inside the founded commons whose life this section has named.

---

Section 4 comes in around 2700 words. Longer than a straight edit would have produced, but the additions each earn their place: the political-power observation about spaces, the Oregon/eastern-Washington evidence, the multiple-associations paragraph, the parking-lot paragraph, the concrete elaboration of patience, and Highlander 3.0 as the generative response.

Three things worth your attention.

The Highlander 3.0 paragraph in the closing is substantial. If you want it shorter, or you want Myles Horton and the Highlander Folk School described differently — you may have a specific framing you use with cohort members that I don't know — say so and I'll revise.

The parking-lot paragraph shifted from your original poetic voice ("Like rain on cement, it runs off and nothing grows") into a slightly more measured register to match the design-record voice. If you want the more direct phrasing preserved verbatim, tell me and I'll put it back in your words.

The multiple-associations paragraph makes a real design claim: that federation-of-associations can produce a founded commons if the associations cede the space to the neighborhood. This is your idea from the parenthetical, developed. If it goes further than you intended, say so.

Ready for Section 5 whenever you send it, or for reactions to this rewrite first.

---

**Marc** (2026-09-09 21:41):

Are you keeping all of your edits and notes in a way that we can compile them for a comprehensive review when we get through this round of feedback?

---

**Claude** (2026-09-09 21:41):

Honest answer: no, not automatically, and not in the form you'd want for a comprehensive review.

What exists right now: the sections themselves live in this conversation as chat turns — your edits, my rewrites, and the back-and-forth about ripples and open questions are all here. They can be read back but they're interleaved with tool calls, my drafting commentary, and my questions to you. Not a compiled document.

What doesn't exist unless I make it: a running record of the specific ripples I've flagged for later sections (reputation as compensation in Section 6, NCIP terminology decisions, "external (episodic)" facilitators, "convener" spelling, Deming-level mappings, Highlander 3.0 references, the catalytic-space and parking-lot metaphors as they should propagate, the e-VSM environment-interface gap, the RenDanHeYi/VSM/e-VSM integration question, your comment-flags on Section 4 that I answered but haven't consolidated). I've been tracking these in-conversation but not compiling them.

Three options, and I'd like your call before I do more work.

**Option 1: I do a compilation pass right now, before we continue.** I produce two artifacts: (a) a clean consolidated version of Sections 1-4 as they stand after your edits and my rewrites, with meta-commentary stripped; and (b) a ripples-and-open-items log — everything I've flagged that needs to happen elsewhere, organized by target section. You review both before we move to Section 5. Advantage: you can see the whole thing before more accumulates. Cost: about one substantial turn's work, and it delays Section 5.

**Option 2: I start keeping the ripples log now, and produce the compiled Sections 1-4 later.** I make one artifact right now — a plain running list of ripples and open items — that I add to after every subsequent section. When we've gone through Section 9, I do the full compilation pass. Advantage: momentum preserved, log stays current. Cost: the compilation happens at the end when there's more to compile.

**Option 3: I use the memory filesystem for the running log.** I write the ripples-and-open-items log into a file in memory — something like `/areas/design-record-drafting.md` — and update it as we go. That way it survives if this conversation ends, and future-me picks it up automatically at the start of the next conversation. The compiled sections still get produced when you want them. Advantage: durability across the drafting arc, plus continuity if we split into multiple sessions. Cost: a small memory file that will grow as we go.

My inclination is Option 3. The drafting is spanning enough turns and enough substrate that memory-durability matters, and having the log accessible to future-me means we don't lose track if we come back after a break. I'd do a light version of Option 1 alongside it — produce the compilation artifact when you want it, not now, so we don't lose Section 5 momentum.

Your call. And if you're already keeping a compilation on your side (given you've been editing each section in Pages), tell me — I don't want to duplicate work you're already doing.

---

**Marc** (2026-09-09 21:42):

Option 3 please.

_attachments: EDITED SECTION 5.pages_

---

**Claude** (2026-09-09 21:46):

Creating the drafting log in memory first, then Section 5.

_[tool call: memory_write]_

_[tool result]_

Log filed. Now Section 5.

_[tool call: bash_tool]_

_[tool result]_

Substantial edits and a lot of substantive questions. Before I respond fully, let me try to fetch your customer scenario template — I want to see it before proposing how to integrate it.

_[tool call: web_search]_

_[tool result]_

_[tool call: web_fetch]_

_[tool result]_

_[tool call: web_fetch]_

_[tool result]_

_[tool call: web_fetch]_

_[tool result]_

_[tool call: web_search]_

_[tool result]_

_[tool call: web_search]_

_[tool result]_

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

_[tool call: memory_str_replace]_

_[tool result]_

_[tool call: memory_append]_

_[tool result]_

Log updated. Waiting on your call about the callout placement (shared reference in Section 3 vs concentrated in Section 5) and on the substrate you can share (Customer Scenario Template content, Time Line Tool info). I can proceed to the small integrations while you gather those.

---

**Marc** (2026-09-09 21:49):

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

_attachments: _

---

**Claude** (2026-09-09 21:50):

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

_[tool call: memory_append]_

_[tool result]_

Log updated. Awaiting your call on the framing question and, if available, the Customer Scenario Template and Story Structure content.

---

**Marc** (2026-09-09 21:50):

shared reference in Section 3, referenced from Section 5 — keeps Section 5 focused on scenarios rather than diverting into framework mapping

---

**Claude** (2026-09-09 21:51):

Registered. Placement locked: shared reference goes in Section 3.

_[tool call: memory_str_replace]_

_[tool result]_

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

**Marc** (2026-09-09 22:03):

Story structure page json. Story diagram in arrows json. Use this intrepretation of customer scenario: Call one the scenario as compound need — the Experience-ME's articulation of what's actually happening for a user in end-to-end form, upstream of any specific solution. Call the other the scenario as vision-blueprint — the primary-ME's proposal of how to address that need, including value creation process and EMC structure, that others bid on. AND do--expand the seven-element template. AND integrate the "bid" mechanic. Story Structure RCN Graph json added for your reference. AND I think that the addition of "Experience-ME's contribution" is an important addition. I think sometimes that is how it will work--ethnography first; and other times someone(s) will create a customer scenario and look or a primary ME team and EMC partners. So some how we need to account for this flexibility in approach and speculate on the kinds of situations where one is more fitting than the other.

_attachments: Generic Customer Scenario Graphic.json, Simple-Story-Structure-Plus-Organizing-Path (1).json, Generic Customer Scenario Graphic.json_

---

**Claude** (2026-09-09 22:04):

_[tool call: bash_tool]_

_[tool result]_

_[tool call: bash_tool]_

_[tool result]_

_[tool call: bash_tool]_

_[tool result]_

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

_[tool call: memory_append]_

_[tool result]_

Log updated. Waiting on Story Structure application depth and rewrite-vs-patch decision.

---

**Marc** (2026-09-09 22:07):

categories with examples, referenced to your Story Structure graph for depth. and rewrite fully.

_attachments: Simple-Story-Structure-Plus-Organizing-Path.svg_

---

**Claude** (2026-09-09 22:13):

Full rewrite of Section 5. Delivering it below.

---

# Section 5 — The Customer Scenario as Origin Object

## Why the customer scenario deserves its own section

Almost no one outside Haier does this. That absence is not incidental; it is why programs come and go while the underlying needs they were meant to address persist unchanged. The pattern is well-documented: an initiative launches around a real need, produces some work while its funding lasts, then dissolves — and with it the institutional memory dissolves, so the next initiative starts from zero. Disappointment and even cynicism develop where there was enthusiasm and hope. Every re-attempt at addressing the same compound need has to rediscover the need, re-articulate it, and re-form the ecosystem around it, without benefit of what the prior attempts learned.

Haier's RenDanHeYi model contains an organ that prevents this pattern. The customer scenario is a persistent object that lives on an internal platform independent of any specific microenterprise attempting to address it. When an ME succeeds, the scenario has produced value and the ME's history attaches to the scenario. When an ME fails, the scenario returns to the platform enriched by what didn't work, available for another team to grab. William Malek reports the turnaround for a new team to form around a returned scenario at Haier's Chinese operations is two to three days. The scenario is the organ that makes ecosystem-scale work sustainable across generations of specific attempts.

This section develops the customer scenario as a first-class object in the design record — the object that ties the neighborhood's linkage-mapping work to the between-institution project shape, that anchors the balanced scorecard's value definition, that gives the SODOTO portfolio layer something to attach ME histories to, that feeds the FedWiki repository layer, and that gives the CfA-dSC contracts something to instrument around. Every subsequent section in the design record depends on the customer scenario being understood clearly.

The framework mapping — how RenDanHeYi's structural elements (microenterprise, Ecosystem Micro-Community, Industry Platform) relate to Beer's Viable System Model and to the e-VSM extension — is developed in Section 3 as shared reference. This section refers to that mapping without repeating it.

## What a customer scenario is

A customer scenario names a compound unmet need in a user's life and, in its mature form, proposes how that need will be met by a specific microenterprise leading a specific ecosystem. Two levels of scenario documentation are worth distinguishing, because they arrive at different maturity and serve different functions.

**The scenario as compound need** is the Experience-ME's ethnographic articulation of what is actually happening for a user in end-to-end form. It describes the situated life — what is happening across time, across places, across relationships — that contains a set of unmet needs no single provider currently addresses. It is upstream of any specific solution. It says "here is what is true"; it does not yet say "here is what we will do about it."

**The scenario as vision-blueprint** is the primary-ME's proposal of how to address the compound need. As the Customer Scenario page in the RenDanHeYi FedWiki names it: the document lays out the value and the value creation process in detail; it is the vision-blueprint for the fully implemented primary microenterprise and its EMC network; it is a creative act to write; it is what people read when deciding whether to bid on the contract, in choosing to participate in the value-creating network.

Both are customer scenarios. They live in the same FedWiki repository, cross-linked. The compound-need version tends to be shorter and more descriptive; the vision-blueprint version is longer, includes the primary-ME's proposal, and functions as a bid document. Multiple vision-blueprints can form around the same compound need; the compound-need document accumulates references to whichever vision-blueprints emerge, and their outcomes.

The distinction matters because two origination patterns exist and different scenarios take different routes.

**The ethnography-first pattern.** An Experience-ME does zero-distance work with users — sustained presence in the users' life-context, listening, observing, articulating. From that work a compound-need scenario emerges. The scenario circulates. A primary-ME later picks it up and writes a vision-blueprint scenario proposing how to address it. Others bid on the vision-blueprint. The EMC forms and the work begins.

**The vision-first pattern.** Someone — often a person with strong lived experience of the compound need, sometimes a group with existing capacity — writes a vision-blueprint scenario directly, articulating both what value should be created and how they propose to create it. The document circulates for bids on the primary-ME leadership, the EMC roles, or both. The scenario may have implicit compound-need articulation woven into it, or the ethnographic work may be done in parallel as the vision-blueprint is refined.

Neither pattern is superior. Different situations call for different origination routes.

## When each origination pattern fits

The ethnography-first pattern likely fits situations where the compound need is not visible without sustained zero-distance work. Populations under-served by existing systems, whose experience does not fit institutional categories. Situations where the actual pain is not what a first-guess would suggest. Cases where the coordination burden the user is currently carrying is invisible until someone traces the user's whole day. Emerging conditions that existing frames do not yet name. When the shape of the compound need has to be discovered through observation, ethnography-first is the honest route.

The vision-first pattern likely fits situations where the compound need is already well-articulated in the neighborhood's language, or where a specific person or group has strong lived experience that lets them write the scenario directly. Persistent problems whose shape is already visible. Cases where the primary challenge is finding execution partners rather than surfacing what's needed. Situations where waiting for ethnography would delay work that could start now.

Many real scenarios are hybrid. An Experience-ME's early work informs someone's vision-blueprint, and the vision-blueprint's writing surfaces gaps requiring more ethnography. A compound-need scenario is circulated, a vision-blueprint forms in response, and the vision-blueprint's authors return to Experience-ME work to sharpen the situation-narrative. What matters is that the two kinds of work happen — ethnographic zero-distance and vision-blueprint proposing — and that they inform each other. The customer scenario documents in the repository hold both as they mature.

## Story-craft as creative act

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

## The Experience-ME's contribution

Some neighborhood MEs will be scenario-articulators — small groups whose primary work is being zero-distance with residents and articulating what's actually happening in their lives. These are the people already at zero distance in a functioning neighborhood: community health workers, teachers who know families over years, chaplains, librarians who see who comes in for what, food bank volunteers, mutual-aid coordinators, elders who visit the homebound, the operators of a founded commons who watch who uses the space and how. These MEs may already exist as small groups in a neighborhood that meets the Section 4 filters; the kit does not create them but recognizes them and makes their scenario-articulation work visible.

The Experience-ME's specific contribution is threefold. First, sustained zero-distance presence in the users' life-context — not visits, not interviews, not surveys, but the kind of presence over time that lets pattern become visible. Second, articulation of what is heard and seen in end-to-end form — the writing itself, in the users' own language where possible, that turns raw experience into a compound-need scenario. Third, ongoing amendment as understanding deepens — the compound-need scenario is not written once and finalized; it is refined as the Experience-ME sees more, as users' own understanding of their situation develops, as returning attempts from primary-MEs reveal what the scenario failed to capture.

Attribution matters here. The Experience-ME who first surfaces a compound need has that articulation credited in their SODOTO portfolio, whether or not any primary-ME eventually succeeds in addressing it. Scenario articulation is real work. Its history should be visible. When a primary-ME picks up a compound-need scenario and writes a vision-blueprint, the primary-ME's work is credited in their portfolio and the causal link back to the Experience-ME is preserved. Compensation flows through the value chain to both when residents recognize value received.

Some Experience-MEs will be paid for their scenario-articulation work through the value chain when scenarios they articulated eventually produce residents-received value. Others will be doing scenario-articulation work as part of their broader small-group activity in the neighborhood, with the scenario-articulation piece credited but not separately compensated. Both are legitimate. What matters is that the work is seen.

## The primary-ME as scenario author

The primary-ME is the microenterprise (or the microenterprise leader-and-team-in-formation) that writes the vision-blueprint scenario. They may have come to it through the ethnography-first route — picking up a compound-need scenario from the repository and proposing to address it — or through the vision-first route — writing directly from their own lived experience and understanding. Either way, the vision-blueprint scenario is their proposal.

The proposal has real substance. It names what value will be created — for whom, in what form, over what timeline. It describes the value creation process — how the work will proceed from initial ecosystem-formation through delivery to residents. It identifies the EMC network invited to form — which supporting MEs, which institutional participants, which small groups, what each contributes to the value chain. It specifies the bid terms — what participation looks like, what the Value Added Mechanism will allocate to each contributor, what the CfA-dSC contracts will encode.

The primary-ME's authorship is a creative act. They are proposing something that does not yet exist and inviting others to make it exist. The vision-blueprint scenario has to be compelling enough that potential EMC members want in, honest enough that residents recognize their own situation in it, and specific enough that the bid mechanics can operate on it.

At neighborhood scale, the primary-ME may be a small group, an individual with a small team-in-formation, or an existing small group that is shifting into leading a scenario. The Neighborhood-Catalyzing Industry Platform (described in Section 6) supports primary-ME formation through mentorship, seed capital, contract help, and connection to potential EMC members. The Platform does not write the vision-blueprint; the primary-ME does. But the Platform helps make it possible for the primary-ME to write well.

## The bid mechanic

Once a vision-blueprint scenario is written and circulating, others bid on participation. The bid mechanic is real, not metaphorical.

At Haier scale, MEs looking for work browse the Workbench platform, find scenarios that match their capacities and interests, and propose to form EMCs around them. William Malek describes the turnaround in Chinese Haier operations as two to three days. The bidding is competitive: multiple MEs may propose different EMC configurations around the same scenario; the primary-ME (or in some cases the platform's EMC-owner function) evaluates the proposals and selects the configuration to proceed with. The Value Added Mechanism is negotiated during this bidding, specifying how compensation will flow across the ecosystem community when the work delivers residents-received value.

At neighborhood scale, the bid mechanic operates similarly but with modifications the design record has been describing. Early in RCN's development, before SODOTO portfolios have accumulated substantial history, the mature marketplace form of bidding does not fully operate. In this bootstrap period, primary-MEs form more through relationship and convener-facilitation than through open-market bidding. The vision-blueprint scenario still functions as a bid document — it names what participation looks like — but the actual selection of EMC members happens through conversation, mentorship, and the Industry Platform's judgment as much as through competitive proposal.

As portfolios accumulate and trust mechanisms mature, the bidding becomes more market-like. A primary-ME can post a vision-blueprint scenario; multiple potential EMC members can propose their participation; the primary-ME can select from among proposals based on portfolio history, cultural fit, and fit-with-the-value-chain-design. The CfA-dSC contracts instrument the resulting agreements.

The bid document — the vision-blueprint scenario itself — has to be well-formed for the bidding to work. It has to describe the scenario clearly enough that potential bidders understand what they would be joining. It has to specify the value creation process in enough detail that bidders can locate their own contribution. It has to name the bid terms transparently. And it has to be readable enough that bidders can move to a decision without doing extensive additional research. This is where the story-craft and Story Structure work matter. A poorly-written vision-blueprint scenario, whatever its substantive merits, will not attract the right bidders — or any bidders.

## What a well-formed scenario contains

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

## Where scenarios live and how they circulate

The FedWiki repository is where scenarios live. One page per scenario, forkable per neighborhood context, enriched by every attempt.

FedWiki's fork-and-modify pattern fits scenarios natively. A scenario articulated in East County can be forked by someone in Birchwood who recognizes a similar pattern, adapted for the Birchwood context, and lived alongside the East County original. Both remain visible; neither overwrites the other; a Solution ME in either place can see both versions and learn from the other's work. Cross-neighborhood learning happens through the fork history, not through any central curation.

The scenario page's structure follows the fourteen elements, in FedWiki markdown-paragraph form. Fields that require structured data — attribution, neighborhood context, existing attempts with outcomes, EMC network configuration, bid terms — link out to Overall Schema entries in Neo4j where the graph structure adds value. The Overall Schema is the RCN top-level graph schema that names the node types and edge structure connecting scenarios to MEs, primary-MEs, EMC members, portfolios, value chains, and residents. It is documented in RCN's substrate work as an ongoing artifact.

Compound-need scenarios and vision-blueprint scenarios cross-link. A vision-blueprint scenario cites the compound-need scenario it grew from (if it took the ethnography-first route). A compound-need scenario accumulates references to whichever vision-blueprint scenarios have formed to address it, along with their outcomes.

Circulation and awareness of customer scenarios happen through several mechanisms.

**Convener attention.** The convener of a neighborhood engaged with the kit maintains awareness of the scenario repository and surfaces scenarios that plausibly apply to their neighborhood during Phase 2's linkage-mapping meetings. Scenarios articulated elsewhere can inform what the meeting sees.

**Neighborhood-Catalyzing Industry Platform attention.** WWHA's granting arm, and analogous Platforms operating in other neighborhood clusters, maintain their own awareness of scenarios across the cluster of neighborhoods they serve and can bring cross-neighborhood scenarios into conversation with individual neighborhoods where relevant.

**MEs shopping.** In the mature marketplace state, MEs looking for work can browse the scenario repository and propose to form Solution EMCs around scenarios they see. This is the "you can go grab the scenario" mechanism Malek describes at Haier scale. At RCN scale, this is subject to the first-generation-portfolio conditions and the SODOTO trust mechanisms described in later sections; the mature marketplace only becomes fully operational once portfolios have accumulated enough substance to support competitive matching.

**e-VSM survey validation.** Once a compound-need scenario has been articulated, an e-VSM survey of the broader neighborhood can validate whether the scenario is real, whose experience it reflects, and what it misses. The e-VSM framework and its multi-perspective aggregation are developed in Section 3 as shared reference. Claude API synthesis of survey results provides interpretation and integration. Scenarios that survive validation get Solution EMC formation; scenarios that don't get revised or archived with what was learned.

## How scenarios interact with the kit's phases

The kit's phases descend from the CMG five-phase Linkage Mapping playbook, adapted for neighborhood scale. With the customer scenario as first-class object, the phases produce and use scenarios explicitly rather than jumping from linkage map to project.

Phase 1 includes scenario-repository review. The convener reviews existing scenarios that plausibly apply to this neighborhood and brings the awareness into pre-work conversations. The Phase 1 diagnostic includes whether the neighborhood already has scenario-articulator patterns operating (Experience-ME analogs), even if they don't use the vocabulary.

Phase 2's first meeting produces scenarios, not projects. The linkage map surfaces the current-state view of the neighborhood in Beer's S1-through-S3 terms; the Idealized Design work surfaces the S4-desired state; the surfacing of scenarios happens as the gap between those two becomes visible. Whose life is caught in the gap, in what compound way, across what end-to-end context? That is the scenario question, and the room's answer to it is Phase 2's real output. Some of what emerges will be compound-need scenarios that require further ethnographic development; some will be vision-blueprint scenarios in nascent form. Both go into the repository.

Phase 3's weighted selection is scenario selection. The group chooses which of the surfaced scenarios matter most, using the weighted-selection matrix method the CMG playbook developed. The output is a small set of prioritized scenarios that become the basis for Phase 4's ME formation.

Phase 4 is where primary-MEs write vision-blueprint scenarios for the selected priorities (if they don't already exist), Solution EMCs form around the vision-blueprint scenarios, and bidding proceeds. Self-organizing teams engage with scenarios; they negotiate with the Neighborhood-Catalyzing Industry Platform (playing an EMC-owner role); they form the ecosystem community across the small groups and institutions the scenario needs; they put contracts in place through CfA-dSC with Leading Targets and Value Added Mechanism specified; they receive catalytic seed capital.

Phase 5 is execution, retrospective, and scenario update. The Solution ME does the work. The retrospective — grounded in the e-VSM survey of how the work landed across the neighborhood's spheres and in resident recognition of value received — feeds back to the scenario's existing-attempts field. Whether the Solution ME succeeded or failed, the scenario continues living in the repository, enriched by what happened.

The cycle can then repeat, with a new round of scenarios (or returning enriched scenarios) forming Phase 2's input for the next iteration. Or the neighborhood can set the kit free once the pattern is internalized — meaning the practice of scenario articulation, primary-ME formation, EMC bidding, and retrospective becomes native to the neighborhood without requiring the convener's Phase-facilitation to run each round. Experience-MEs continue their zero-distance work and file compound-need scenarios directly to the repository; primary-MEs continue to write vision-blueprints; Solution EMCs form and dissolve on the neighborhood's own rhythm; retrospectives happen at the founded commons on the neighborhood's schedule; the Industry Platform continues as adjacency but the ceremonial structure of Phase 1 through Phase 5 is no longer needed because the practice has become native.

## What Section 5 commits the design to

The customer scenario is treated throughout the design record as the origin object from which specific MEs derive rather than as a description a specific ME writes about its own work. This is the inversion that distinguishes the RenDanHeYi pattern from conventional project-based work. Projects come from scenarios; scenarios do not come from projects.

Two levels of scenario documentation are preserved — the compound-need scenario as Experience-ME's ethnographic articulation, and the vision-blueprint scenario as primary-ME's creative-act proposal. Both live in the FedWiki repository. Both accumulate portfolio attribution. Both are subject to e-VSM survey validation and to Story Structure quality checking.

Two origination patterns are preserved — ethnography-first (Experience-ME surfaces need, primary-ME later proposes) and vision-first (primary-ME writes directly, ethnographic work parallels). Each fits different situations. Hybrid patterns are common and legitimate.

Story-craft is treated as the specific skill required for well-formed scenario writing. The Story Structure model Marc has developed is the substrate available to conveners, Experience-MEs, and primary-MEs learning to write scenarios well. Ethnography and Participatory Action Research are the heritage traditions the practice draws on. Klauser's create-versus-edit separation is one of the working disciplines.

The bid mechanic is treated as real, not metaphorical. Vision-blueprint scenarios function as bid documents. Primary-MEs evaluate bids. EMC networks form through bidding. CfA-dSC instruments the resulting contracts. In the bootstrap period, more relationship and convener-facilitation are involved; as portfolios mature, the mechanic becomes more market-like.

The FedWiki repository is treated as the persistent home of scenarios across cycles and across neighborhoods. Its fork-and-modify pattern is the native mechanism for cross-neighborhood learning; its markdown-paragraph structure holds the fourteen-element scenario template; its links out to Neo4j Overall Schema entries handle the structured relationships.

The e-VSM survey is treated as the small-data validation instrument for scenarios and as the retrospective instrument for how ME work has landed. Claude API synthesis integrates the survey evidence and surfaces suggestions, giving Claude an ongoing operational role in the kit rather than only a co-drafting role.

Section 6 develops the Neighborhood-Catalyzing Industry Platform pattern — WWHA's granting arm operating as an EMC-owner analog that MEs negotiate with when forming Solution EMCs and whose actors are compensated as a downstream function of the MEs they seed. Section 7 develops the moods-and-speech-acts working layer that runs through every phase and every scenario negotiation. Section 8 returns to the between-institution project shape, now understood as the operational form Solution EMCs take when executing on vision-blueprint scenarios.

---

That is Section 5, around 4200 words.

Three things worth your attention.

The two-level distinction (compound-need vs vision-blueprint) threads throughout. Both live in the repository; both accumulate portfolio credit; both can be authored under either origination pattern (ethnography-first or vision-first). If you want the two-level structure named differently or the terms varied, tell me.

The fourteen-element template (eight for compound-need, six additional for vision-blueprint) draws on your Customer Scenario page directly and my earlier seven-element inference. When the Startup Factory material or your own use surfaces refinements, we revise.

The Story Structure treatment — categories with examples referenced to the graph for depth — should preserve the model's substance without demanding readers memorize the twenty-six nodes. AIC is mentioned as an organizing methodology without me committing to a specific attribution (McWhinney or otherwise). If you want AIC named specifically, or a different attribution used, tell me.

Updating the log now.

_[tool call: memory_str_replace]_

_[tool result]_

---

**Marc** (2026-09-10 02:30):

AIC is from: THE CREATIVE POWER: ORGANIZING OURSELVES, OUR
ORGANIZATIONS AND OUR WORLD W.E. SMITH. Bill Smith is a friend and colleague. He and his wife lead the World Bank's most successful work globally using the AIC framework. It closely matches my consulting approach. I have this book (and more) as a set of PDFs. I am in favor of using some story structure through out because it is already understood (not necessarily my words) by everyone in every culture and I have been able to cross map most framework including the Ostrom Institute's IAD framework.

_attachments: EDITED SECTION 6.pages_

---

**Claude** (2026-09-10 02:32):

Got it — AIC is W.E. Smith's, not McWhinney's. Bill Smith of *The Creative Power: Organizing Ourselves, Our Organizations and Our World*, whose World Bank work with his wife is your reference. Story Structure to be used throughout as connective vocabulary — cross-culturally native and cross-maps to Ostrom Institute's IAD and other frameworks. Registering both.

Extracting Section 6.

_[tool call: bash_tool]_

_[tool result]_

Substantial edits with many marginalia. Updating memory first, then responding.

_[tool call: memory_append]_

_[tool result]_

Log updated. Section 6 needs substantial work — many marginalia point to real questions rather than surface edits. Reporting what I see and asking for direction rather than rewriting on the fly.

**Two categories in your marginalia:**

*Terminology and language.* You've flagged "substrate", "cluster", "adjacent", "EMC-owner", "set themselves free", "shape", "requisite variety", "design record", "polycentric", "instruments" — asking for either better wording or explanation-then-don't-overuse. These are real and consistent across the design record, not just Section 6. I need to settle these once and propagate everywhere. Proposed replacements below; your reactions welcome:

- "substrate" → name the components directly: "the RCN infrastructure — CfA-dSC, SODOTO, e-VSM, Overall Schema, and FedWiki." Or "the RCN foundational tools." Or when the meaning is data-schema specifically: "the RCN data schema." I'll drop "substrate" as a summary term.
- "cluster" and "neighborhood cluster" → "grouping of neighborhoods" or "the neighborhoods a Platform serves" or name them specifically ("East County and its rural surroundings").
- "adjacent" → "nearby", "neighboring", or drop entirely.
- "EMC-owner" → "EMC coordinator" or "EMC organizer." Prefer "coordinator" — matches the coordination function without ownership connotation.
- "set themselves free" → "become self-organizing and self-funding" (from your own Section 6 phrasing), or "graduate to autonomous operation" (matches "graduations and growing self-sufficiency" from Section 2).
- "shape" → varies by context; "form", "pattern", "configuration", "character", "arena" as fits.
- "requisite variety" → explain once with Ashby's Law then use "range of responses", "internal complexity to match external complexity", or "capacity to match what's needed."
- "design record" → "the RCN Design Record" (with capitals) or just "this document." The current phrase reads like generic reference; capitalizing it makes it a name.
- "polycentric" → reserve for when Platforms have overlapping constituencies. When Platforms operate in separate constituencies, use "distributed" or "locally-autonomous" or simply "each Platform operates independently."
- "instruments" → "measures" per your suggestion.

*Substantive questions and additions.* Several want real work beyond terminology.

**VAM (Value Added Mechanism).** You want much clearer treatment. Working answer: VAM is Haier's practice of specifying, before production starts, how compensation will be shared across all parties in the ecosystem community — the primary-ME, supporting MEs, node MEs providing components, the Industry Platform, and any other contributors. Lower and upper limits negotiated for each party's share. Settled after value is delivered and recognized. At neighborhood scale, VAM has to accommodate your three-currency mechanism (fiat, time, gifts), which none of Haier's writing describes directly. This is a real adaptation problem worth its own subsection in Section 6, possibly with a worked example (theoretical is fine to start).

**Zohar reference.** Danah Zohar, *Zero Distance: Management in the Quantum Age*, Palgrave Macmillan (Springer imprint), 2022. Twenty-plus chapters organized in three sections: Quantum Management theory (physics-as-metaphor for organizational structure), specific companies operating in the quantum mode (Haier, Roche India, GE Appliances, others), and the broader Quantum Society implications. Her Haier chapter (16) is the primary published source for RenDanHeYi mechanics accessible in English. I'll add the full citation in Section 6 and Section 11.

**Haier's gated funding.** From what I've read, Haier's Industry Platforms deploy capital in stages tied to specific milestones — initial seed at ME formation, additional capital when the ME hits proof-of-concept or user-adoption thresholds, further capital as value delivery scales. The specific gate structure varies by ME type. At neighborhood scale, the gates would map to scenario-development phases: initial capital at chartering (Phase 4 in the kit), next tranche when initial ecosystem is assembled and delivering, further tranches when residents recognize initial value received, final settlement at Phase 5 retrospective. This wants development. My inclination is a gated-funding subsection in Section 9 (catalytic capital) with cross-reference from Section 6.

**Non-financial measures alongside financial.** Your three-currency mechanism (fiat, time, gifts) plus the neighborhood-authored balanced scorecard's typically-non-financial dimensions means the Platform actors' compensation flows through multiple channels simultaneously. Fiat compensation from scenarios that produce financial value. Time-accumulation credited in portfolios. Gift-recognition in reputation and standing. Reputation as compensation currency (Section 2 edit) is the fourth stream, alongside fiat and time and gifts. This wants its own subsection in Section 6 on how compensation actually works with all these channels.

**SODOTO portfolios — my extension proposal.** You want to work on this together. My working thinking: SODOTO's credentialing infrastructure (issuers, keys, handshakes) already handles the attestation problem. The portfolio extension would use that infrastructure to accumulate an individual's or ME's record of participation — what they contributed to which scenarios, what MEs they were part of, what value flowed, what residents recognized. Similar to Haier's indelible bidding record but built on SODOTO's decentralized credentialing rather than a central platform. Marc, my portfolio extension may be running ahead of what you've been building. Best done as its own conversation before I commit design-record language.

**ME Leading Targets at neighborhood scale.** Examples I can propose for the school-refugee scenario worked example: number of refugee families who complete first school year without disenrollment; measurable improvement in family's report of feeling connected to the school; specific coordination outputs (working CHW-school protocol, working family-school translation channel). But these are guesses. This wants your input.

**Value chain flow diagram.** Real ask. I can produce a schematic diagram showing the flow from scenario articulation through primary-ME → EMC formation → value creation → resident recognition → settlement. Would you rather I draft it now (visualize tool, describing then rendering), or wait until we're firmer on VAM and gated-funding structure?

**Chris/Jerry founded-commons mapping — need your confirmation.** Your Section 6 edit has "Chris operates in Superior, Arizona, with the Leo's as anchor; Jerry operates in Lansing, Michigan, with The Fledge as anchor." My earlier drafts (and my Section 4 rewrite) have Chris at The Fledge (Superior) and Jerry at Leo's (Lansing). Which is correct? Affects Sections 4, 6, 11, and possibly others.

**Platform vs RCN distinction.** Your marginalia asks whether The Platform is RCN itself or a network of neighborhoods. My answer: not the same. RCN is the broader Network — including multiple Industry Platforms (WWHA in Whatcom, Fledge in one place, Leo's in another), multiple neighborhoods within each Platform's scope, individual actors, and shared infrastructure. An Industry Platform (like WWHA) operates at the level between individual neighborhoods and RCN as a whole. Platforms are locally-autonomous; RCN provides the shared tools and pattern language they use. Section 6 needs to make this distinction clear early rather than leaving it ambiguous.

**Proposed sequence for Section 6 rewrite:**

1. First, you confirm the terminology substitutions (or offer better alternatives)
2. Then you confirm the Chris/Jerry founded-commons mapping
3. Then we work SODOTO portfolios as its own conversation (either in chat or in a specific working session)
4. Then I rewrite Section 6 with terminology fixed, Zohar reference in, VAM subsection expanded, three-currency compensation integrated, gated-funding referenced (development in Section 9), Platform-vs-RCN distinction clarified, and value chain flow diagram either drafted or flagged for later
5. Value chain flow diagram — draft as visualization or wait

This is a fair amount of work. Rather than trying to do it all in one turn, I'd rather settle the terminology and the mapping first, then rewrite with those decisions in place.

Say which items you want to answer now vs. defer.

---

**Marc** (2026-09-10 18:06):

Substrate -> RCN foundational tools or the RCN data schema. AND Cluster ->grouping of neighborhoods" or "the neighborhoods a Platform serves" or name them specifically ("East County and its rural surroundings"). AND "adjacent" → "nearby", "neighboring" AND "EMC organizer." AND "set themselves free" → "become self-organizing and self-funding" AND "shape" →as fits AND "design record" →t"the RCN Design Record" or This document. AND yes ""polycentric" → reserve for when Platforms have overlapping constituencies. When Platforms operate in separate constituencies, use "distributed" or "locally-autonomous" or simply "each Platform operates independently."" AND "instruments" → "measures" AND at the first reference to VAM provide this explanation you have used here. AND add Zohar this reference to the document when first mentioned and in sections 6 and 11. AND you have it right on "Haier's gated funding" explanation and translation to neighborhoods, and we do need to say this this requires experimentation. AND Non-financial measures alongside financial. yes on develop subsection in Section 6 and consider notes on using Rasch developed socio psycho metric measures to fit the needed measures for a balanced set of metrics (balanced score card). AND outside this document lets work on SODOTO portfolios — my extension proposal along with Claude Code. Suggest how you would like to do this. AND "ME Leading Targets at neighborhood scale" is a good enough start for now. AND Re Value chain flow diagram.--Draft it now.  AND "Chris operates in Superior, Arizona, with the Leo's as anchor; Jerry operates in Lansing, Michigan, with The Fledge as anchor." is correct. AND i agree with your interpretation of "xPlatform vs RCN distinction." Please make this clear in the document. AND let me know if you need anything else from me before preoceeding.

---

**Claude** (2026-09-10 18:10):

Confirmed on all. Let me update memory with the resolutions, propose the SODOTO portfolios approach, draft the value chain diagram, then rewrite Section 6.

_[tool call: memory_append]_

_[tool result]_

**SODOTO portfolios — proposed approach for Claude Code session:**

Dedicated session, roughly 60-90 minutes of your time. I read your existing `/areas/sodoto-credentialing.md` and any SODOTO-related files or code in `~/rcn`; we then work through: what a portfolio entry contains (participant, ME, scenario, contribution type, currency form(s), value flowed, resident recognition score, attestation chain); how portfolios attach to individuals versus MEs versus Platforms; how they get created and updated (issuer/handshake model extended); how they surface in bidding (Haier's "indelible record" analog); how they interact with Overall Schema. Output: a design document that either updates `/areas/sodoto-credentialing.md` in place or creates a companion `/areas/sodoto-portfolios.md` file, plus any Overall Schema node/edge additions the design requires. When we're ready, tag me in Claude Code at your working directory.

**Value chain flow diagram — drafting now:**

_[tool call: visualize:read_me]_

_[tool result]_

_[tool call: visualize:show_widget]_

_[tool result]_

Now Section 6 rewrite with all terminology decisions applied.

---

# Section 6 — The Neighborhood-Catalyzing Industry Platform

## What an Industry Platform is in Haier's usage

Haier operates an internal function it calls an Industry Platform. In RenDanHeYi mechanics, the Industry Platform is what an outside observer would recognize as an internal venture capital arm — a small group of people whose work is helping microenterprises form, seeding them with capital when they do, negotiating the value chains they participate in, and being compensated as a downstream function of the value the seeded MEs eventually deliver to users. The Industry Platform is a support enterprise in the technical sense: it earns nothing on its own, only through the success of the MEs it supports.

Danah Zohar's *Zero Distance: Management in the Quantum Age* (Palgrave Macmillan, 2022), the primary published source in English on RenDanHeYi mechanics, describes three types of ME operating at Haier: market-facing MEs that deal directly with users; incubating MEs that explore new product and service categories; and node MEs that supply components or services (marketing, HR, and so on) to the market-facing MEs. The Industry Platform is a specific case of the third category — a node-ME whose service to other MEs is capital, mentorship, network access, and negotiation help. What distinguishes it from an ordinary node-ME is the compensation structure: the Industry Platform's income depends on the market-facing MEs it seeded successfully creating value for users, mediated through the smart contracts and Value Added Mechanisms that instrument the value chain.

The Value Added Mechanism, or VAM, is Haier's practice of specifying — before production starts — how compensation will be shared across all parties in the ecosystem community. Lower and upper limits are negotiated for each party's share: the primary-ME, supporting MEs, node MEs providing components, the Industry Platform, and any other contributors. The VAM is settled after value is delivered and residents recognize it. VAM specification is the substantive design work that turns a scenario proposal into a viable ecosystem community. At neighborhood scale, VAM has to accommodate RCN's three-currency mechanism — fiat, time, and gifts — plus reputation, which will be developed in this section as a fourth compensation stream.

This is not incidental to Haier's operating logic. It is the mechanism that lets Haier compensate the entrepreneurial-support function without falling into the pattern that most external venture capital and most internal corporate innovation funds fall into — the pattern where the support function's compensation is independent of the eventual value delivered, and therefore drifts toward metrics that flatter the support function rather than metrics that measure user benefit. Haier's Industry Platform actors, in Zohar's account and in William Malek's descriptions, are paid substantially and paid based on outcomes downstream of their contributions. Everyone gets paid. Nobody gets paid on a job description independent of what actually reaches users.

## Why WWHA's granting arm is being designed as an Industry Platform

The design conversation for this document moved through several framings for what WWHA's granting arm should be before arriving at the Industry Platform pattern.

The first framing was "granting arm" in the conventional philanthropic sense — an entity that receives applications, evaluates them, awards grants, and reports on outcomes. That framing was rejected because it reproduces the philanthropic-industrial pattern John McKnight named, in which the grant-making function's compensation and job structure are independent of whether the grants actually create value for the residents the work is meant to serve. Grant officers who deploy capital according to a foundation's strategic priorities can be excellent professionals doing their jobs well and still, in aggregate over time, produce work that bends toward what the foundation wants rather than what residents receive. The bias is structural, not personal.

The second framing was "volunteer elders giving back" — the granting arm operated entirely without compensation, by people whose relationship to the work was purely associational gift in McKnight's sense. That framing was also rejected, because it fails on its own terms. It assumes the only alternative to the philanthropic-industrial pattern is self-sacrifice, and that assumption produces a design that cannot scale because it cannot compensate people doing real work for real time. It also confuses the form of compensation (paid versus unpaid) with the structural question (compensation independent of value delivered versus compensation structurally tied to value delivered).

The third framing, arrived at through recognition of Haier's actual mechanism, is that WWHA's granting arm operates as a Neighborhood-Catalyzing Industry Platform — the entity that catalyzes neighborhood MEs to form around customer scenarios, seeds them with catalytic capital, mentors them across the menu of adjacencies described in Section 2's Principle Two, and is compensated as a downstream function of the value those MEs eventually deliver to residents. This framing keeps the elder-giving-back sensibility that fits how Carl, Chris, Jerry, and Brent describe their own work; keeps compensation for real work at real levels rather than requiring self-sacrifice; and keeps the compensation structure locked to value received by residents rather than to any outside assessment of the work's quality.

## The Platform and RCN — different things at different scales

Because the terminology is close enough to blur, the distinction between an Industry Platform and RCN itself deserves plain naming.

An Industry Platform is a specific operating entity. WWHA operating as one Neighborhood-Catalyzing Industry Platform serves a defined grouping of neighborhoods (in Whatcom County). Analogous Platforms operate elsewhere — Chris in Superior, Arizona, with Leo's as anchor; Jerry in Lansing, Michigan, with The Fledge as anchor — each serving the neighborhoods that Platform serves. Each Platform has its own funding sources, its own catalytic capital pool, its own primary jurisdictions, and its own compensation flows. Its decision-making authority extends only over the MEs it seeds and the neighborhoods within its own funding jurisdiction.

RCN — the ReLocalize Creativity Network — is the broader network within which multiple Industry Platforms operate. RCN is not itself a Platform. RCN is the pattern language, the shared RCN foundational tools (CfA-dSC, SODOTO, e-VSM, Overall Schema, FedWiki), the peer network of Platform actors, the accumulating scenario repository, and the emerging elder-mentorship network across Platforms. RCN provides the common ground on which each Platform operates locally, and the medium through which cross-Platform learning happens (the fork-and-modify FedWiki pattern for scenarios, the cross-Platform elder-mentorship for pattern-recognition).

The distinction matters because it shapes what decisions belong at what scale. What a specific Platform funds, and how it structures its VAMs, belongs to that Platform's decision-making. What tools are shared across Platforms belongs to RCN's collective development. When two Platforms have overlapping constituencies — the same neighborhood potentially receiving support from more than one — the situation becomes genuinely polycentric in Ostrom's specific sense, and the interfaces between Platforms will need to be worked. In the current state, Platforms have separate constituencies and operate independently.

## What Platform actors do

The Platform is not defined by a fixed set of tasks; it is defined by its position in the value chain. The Platform sits between the neighborhoods where customer scenarios emerge and the MEs that form to address them. Its work is whatever contributes to MEs forming, doing well, and becoming self-organizing and self-funding — from the residents' side of the value chain, not from any outside assessment.

The diagram above shows the flow at a glance. The Platform is present at every stage from scenario availability through EMC formation, value creation, resident recognition, and settlement. Its specific functions include the following.

**Invitation.** Small groups already at work in a neighborhood come into conversation with the Platform, on the Platform's invitation or their own. The invitation is not a form to fill out; it is conversational and the beginning of a relationship. What the Platform hopes to offer is whatever the small group needs from a menu of adjacencies — mentorship, connection to other MEs, help with scenario articulation, catalytic capital when appropriate, story-craft support, e-VSM survey deployment, contract help — on request, not as a technical-assistance dump. This menu of adjacencies is what the Platform can make available; small groups draw on what they need when they need it.

**Mentorship.** Carl, Chris, Jerry, Brent, and other elders on the Platform mentor ME leaders and small-group participants across whatever they've learned in thirty years or more of work. Mentorship is on request, not on schedule, and its content is whatever the mentee actually needs that the mentor has to share. It appears on the Platform's menu of adjacencies as one thing MEs can draw on when they see the need.

**Facilitation of the linkage-mapping cycle.** Platform actors serving as conveners work through the kit's phases in neighborhoods that have met the Phase 1 filters. This is the specific S4-activation work the kit exists to enable, described in Section 3.

**Scenario stewardship.** Scenarios live in the FedWiki repository; the Platform maintains awareness of them, helps surface applicable scenarios during Phase 2 meetings, and helps validate scenarios through e-VSM survey work before and after Solution MEs form. The scenario is adaptable yet durable; the Platform's stewardship of the repository is one of its ongoing responsibilities.

**Solution-ME formation support.** When a scenario has been selected in Phase 3 and a self-organizing team is forming around it in Phase 4, the Platform acts as an EMC organizer in Haier's sense — helping the ME assemble the ecosystem community it needs, negotiate the value chain, specify Leading Targets and VAM, and put the CfA-dSC contracts in place. The Platform does not run the ME; it helps the ME form itself viably.

**Catalytic seed capital deployment.** When a Solution ME is ready to launch and the scenario, the ecosystem, and the contracts are in place, the Platform deploys catalytic seed capital under the principles described in Section 2 and developed in Section 9 (catalytic not operating, sized to enable launch not to become permanent budget, evaluated on catalyzability rather than on general goodness). Capital is deployed in stages tied to milestones — initial seed at ME formation, additional tranches as the ME hits proof-of-concept or user-adoption thresholds, further capital as value delivery scales. This gated approach draws on Haier's own practice of milestone-based funding and adapts it to neighborhood scale. The specific gates need experimentation to develop for neighborhood work; plausible early gates include scenario validation completion, ecosystem community formed and contracted, initial delivery to first users, first evidence of resident recognition. What works will emerge from practice; the design record commits to the gated pattern without prescribing specific gates.

**Retrospective and portfolio work.** After Phase 5's retrospective, the Platform supports the accumulation of what happened into SODOTO portfolios (the ME participants, the Platform actors, the scenario itself) and into the scenario repository's existing-attempts field. This is S3\* work in the VSM sense, providing S4 with honest information about what actually happened. The specific structure of SODOTO portfolios as they extend the existing SODOTO credentialing work is being developed as its own strand of work; the design record's commitment is that portfolios accumulate participation history in a form that supports future bidding, mentorship judgment, and cross-Platform pattern recognition.

**Cross-neighborhood pattern recognition.** Platform actors see across multiple neighborhoods simultaneously. When a pattern is emerging across neighborhoods (a scenario recurring, an ME approach that works, a founded-commons succession pattern that appears repeatable), the Platform's cross-cutting view can surface the pattern to individual neighborhoods that would otherwise not see it. This is one of the specific reasons the Platform exists — the Platform has range of responses that no single neighborhood contains, exactly what Ashby's Law tells us a regulator needs to match a complex system.

None of these functions is fixed in a job description. The Platform is a set of relationships in the value chain, and Platform actors do whatever the value chain needs done for MEs to form, do well, and become self-organizing and self-funding.

## Compensation mechanics

Platform actors' compensation flows from value created by residents for residents and their neighbors (as Section 2 defined), measured against measures the neighborhood itself constructs and maintains (as Section 2 also defined), through the instrumented value chain that CfA-dSC provides.

The mechanism has several moving parts that are worth naming even in preliminary form.

**VAM specification.** At the time a Solution ME's contracts are put in place (in Phase 4), the value chain from Platform contribution through ME work to resident value received is specified. This includes the range of value-added sharing among the parties — the Platform, the ME's core participants, the ecosystem-community members contributing components or services, and any other parties the value chain touches. Haier's practice defines lower and upper limits for each party's share, negotiated before production starts. The RCN analog uses CfA-dSC as the smart-contract layer instrumenting this. A worked example of the upper and lower limits and how they distribute across contributors, even at first theoretical, is one of the things Section 9 develops. The general form is intended to be elaborated as a network structure in Neo4j against the Overall Schema, so that value chains can be queried, patterns can be surfaced, and settlements can be verified.

**Recognition of value received.** When the ME's work has produced results (or when the timeline for producing results has elapsed), the neighborhood-authored balanced scorecard is used to assess what value residents have received. The e-VSM survey may provide a multi-perspective read. The scenario's original invitation, the ME's Leading Targets, and the specific value the Platform contributed to the ME's formation are all inputs to the settlement.

**Settlement across the value chain.** Compensation flows to all parties according to their pre-negotiated shares, only to the extent that value has been recognized by residents. If the ME failed or the scenario didn't deliver as intended, the Platform's compensation for that specific instance is correspondingly small or zero. If the ME succeeded and residents recognized substantial value received, the Platform's compensation is correspondingly larger.

**Portfolio accumulation.** Beyond the immediate settlement, the outcome accumulates in the Platform actors' SODOTO portfolios — the specific contribution they made to this ME's formation, the value that eventually flowed, the residents who recognized it. Over time, a Platform actor's portfolio is the trace of what they participated in and what the results were. This is what makes Platform work replicable and inheritable across generations of elders — parallel to Haier's own practice in which every employee and every team has an indelible record used in bidding for work.

The mechanism requires several of the RCN foundational tools to be operational: CfA-dSC as the smart-contract layer, SODOTO as the portfolio and credentialing layer, e-VSM as the survey layer, Overall Schema as the graph structure, and the FedWiki repository as the durable content home. None of these is fully mature in 2026; each is in active development. The Platform's compensation mechanism becomes fully operational as these tools mature, and this document commits to describing the mature form rather than working around the transitional state.

In the interim — before CfA-dSC and SODOTO are fully operational — Platform actors will need to be compensated on approximations of the mature mechanism. The approximations must preserve the structural property: compensation must be downstream of value received by residents, must be measured against neighborhood-authored measures, and must be capable of returning zero or small when the ME does not deliver. A fixed salary or a percentage of grants deployed would violate the structure and would reproduce the philanthropic-industrial pattern the design exists to prevent. Platform actors have to accept this. If they cannot accept variable, outcome-dependent, and potentially small or zero compensation, they cannot be Platform actors.

## Non-financial measures alongside financial ones

Most neighborhood measures will not be financial. This is a real design point that reshapes how compensation flows and how success is recognized.

The three-currency mechanism RCN has developed handles three forms of currency per transaction: fiat (conventional money), time (hours contributed), and gifts (non-reciprocal contributions in McKnight's associational-gift sense). Each transaction can be negotiated in one, two, or three of these currencies simultaneously. A Solution ME might receive fiat compensation for one contribution, time credits for another, and gift attestations for a third — with the mix negotiated during VAM specification.

Reputation is a fourth stream of compensation, distinct from the three transactional currencies. Reputation accumulates in SODOTO portfolios as attestations by residents, other Platform actors, and MEs that a person or ME contributed value the recipient recognized. Unlike fiat, time, and gifts, reputation is not exchanged transactionally — it accumulates as a durable record that supports future bidding, mentorship judgment, and cross-Platform pattern recognition. For elders in particular, reputation may be more valuable than any transactional currency; a Platform actor whose portfolio shows a long record of ME formations that produced recognized value has standing that no salary could substitute.

The balanced scorecard from Section 10 is where non-financial measures live in structured form. The scorecard is neighborhood-authored, meaning the neighborhood decides which measures matter to it. Many of those measures will be latent constructs — feelings of connection, sense of dignity, experience of being heard, perceived safety, cultural continuity — that traditional measurement approaches struggle to capture reliably. Rasch measurement, from the tradition Marc trained in with Benjamin Wright and Mike Linacre at the University of Chicago and applied through the Robert Wood Johnson Foundation's Pursuing Perfection program, is uniquely suited to measuring latent constructs across contexts. Rasch-developed socio-psychometric measures let the balanced scorecard hold what matters to a neighborhood in a form that can be assessed reliably across time and across neighborhoods, without collapsing what is qualitatively different into what is merely quantifiable.

The e-VSM survey is one instrument that produces such measures. The Civic Activation Measure (CAM) work in RCN's foundational tools is another. As the scorecard and the survey layer mature, the range of non-financial measures Platform actors can be compensated against grows.

The design commitment is: financial measures are one channel of value recognition, and often not the most important. The other channels — non-financial resident recognition, portfolio depth, reputation attestations, gift acknowledgments — matter as much or more. Compensation mechanisms that treat only financial measures as real would fail the design; compensation mechanisms that hold all four currencies plus reputation together are what's being built.

## The Platform and the four conveners

Carl, Chris, Jerry, and Brent are the initial Platform actors in this document's current scope. Each occupies a convener position in the neighborhoods they serve. Each has thirty or more years of work whose patterns line up with what the Platform's functions require. Each has, or can develop, the temperament for graduation — the willingness to raise their neighborhoods' MEs to self-organization and self-funding rather than hold them.

Chris operates in Superior, Arizona, with Leo's as anchor. Jerry operates in Lansing, Michigan, with The Fledge as anchor. Carl operates in East County and its surrounding rural areas of Whatcom County — the founded commons infrastructure there is still developing. Brent operates in SW Lansing with related but distinct patterns, also without a founded commons yet in place. Each of them will work through the kit's phases in their own neighborhoods and be Platform actors for the MEs that form there. They may also be mentors to other conveners and MEs across the network as second-generation and third-generation conveners emerge.

Platforms are not centralized. WWHA is the first instance in Whatcom County; the Platforms operating from Leo's and The Fledge are related but locally-autonomous instances in their contexts; the emerging RCN framework holds the pattern across all of them without any single Platform having authority over another. Each Platform is autonomous within the neighborhoods it serves and the funding sources it draws on; cross-Platform coordination happens through peer relationship, shared RCN foundational tools, and the elder-mentorship network among Platform actors.

Cross-Platform learning happens through the same fork-and-modify pattern that scenarios use in the FedWiki repository. A pattern developed at Leo's can be forked into Whatcom's context; a pattern developed in East County can be forked into SW Lansing's context; each fork adapts and neither overwrites the other. The RCN foundational tools hold the shared patterns; each Platform holds its own adaptations.

## The Platform's own S4 function at the scale it serves

Section 3 named that a Platform exists at higher recursion than the neighborhoods it serves, and that each Platform needs its own S4 function operating at the scale of the neighborhoods it works with. This deserves brief development here even though it is not fully worked out in the design conversation to date.

At neighborhood scale, S4 is Idealized Design plus SWOT-type scanning, activated through the kit's phases. At the scale a Platform serves — several neighborhoods, potentially over years — S4 needs different tools. What is the Platform's own outside-and-future work? What is coming across the neighborhoods it serves that individual neighborhoods cannot see from their own recursion level? What patterns emerging in one neighborhood might apply to others? What is the Platform's Idealized Design for itself and for the neighborhoods it works with?

Marc's Ripple ReThink System Dynamics model, originally developed for Whatcom County, remains available as one S4 tool for Platform-scale work when a question surfaces that needs it. Cross-scenario pattern recognition across neighborhoods is another S4 function the Platform performs. Cross-generational elder-succession work is another. The Platform's S4 is not the kit's job to develop; it is the Platform's own ongoing work, and this document recognizes it exists without attempting to specify it further.

## What Section 6 commits the design to

The Industry Platform is the operational form of the granting arm throughout this document — specifically the Neighborhood-Catalyzing Industry Platform pattern that WWHA is being designed as one instance of. Grants, mentorship, facilitation, scenario stewardship, and all other Platform functions are understood as parts of a single value-chain-embedded role rather than as separate programs. Platform compensation is structurally downstream of value received by residents. Platform actors are the elders who take up this work in their own neighborhoods, initially the four named conveners and whoever follows them.

The distinction between an Industry Platform and RCN itself is preserved. Platforms are locally-autonomous operating entities defined by their funding sources and jurisdictions; RCN is the broader network of shared tools, methods, patterns, and peer relationships within which Platforms operate. Platforms operate independently in their current state; if Platforms develop overlapping constituencies over time, the situation becomes polycentric in Ostrom's specific sense and the interfaces will need to be worked.

The compensation mechanism depends on the RCN foundational tools maturing — CfA-dSC, SODOTO, e-VSM, Overall Schema — and this document commits to describing the mature form rather than the transitional state. In the interim, Platform actors accept compensation approximations that preserve the structural property (downstream, outcome-dependent, variable) even where the full mechanism is not yet operational.

The three-currency mechanism (fiat, time, gifts) plus reputation as a fourth compensation stream is preserved as the design's honest recognition that most neighborhood value is not financial. VAM specifications hold all four streams. Rasch-developed socio-psychometric measures are the methodological substrate for the non-financial measures that dominate the balanced scorecard.

Catalytic seed capital deployment follows Haier's gated pattern, adapted for neighborhood scale. Specific gates need experimentation to develop; the design commits to the gated approach without prescribing specific gates.

Section 7 develops the moods and speech-acts working layer that runs through every phase, every scenario negotiation, and every Platform interaction. Section 8 returns to the between-institution project arena — the operational form Solution MEs take when they form around scenarios and enter into value-chain contracts with the Platform.

---

That is Section 6 rewritten, around 3800 words.

Terminology decisions applied throughout: convener, RenDanHeYi, Neighborhood-Catalyzing Industry Platform spelled out, Solution ME/EMC, EMC organizer (not owner), become self-organizing and self-funding (not set free), grouping of neighborhoods (not cluster), measures (not instruments), RCN foundational tools (not substrate), locally-autonomous (not polycentric in the separate-constituencies case), design/document (not just design record). Chris-at-Leo's-in-Superior and Jerry-at-Fledge-in-Lansing corrected. VAM explained at first reference. Zohar cited with full attribution. Non-financial measures given their own subsection with Rasch grounding. Gated funding acknowledged as requiring experimentation. Platform-vs-RCN distinction given its own subsection early.

The value chain diagram sits above the section as reference; the Compensation mechanics and Non-financial measures subsections both reference the four currencies (fiat, time, gifts, reputation) shown in the settlement box.

Three things worth flagging:

The **SODOTO portfolios** references throughout treat portfolios as accumulating substance without specifying the accumulation mechanism in detail. That's honest to the state of the SODOTO extension work, which we agreed to do outside this document in Claude Code. When we finish that session, this section may need a small update to reflect what we settle.

The **Ashby's Law reference** in cross-neighborhood pattern recognition — I said "The Platform has range of responses that no single neighborhood contains, exactly what Ashby's Law tells us a regulator needs to match a complex system." That's the explain-once-then-use-plainer-language approach you asked for. If you want it phrased differently, tell me.

Sections 4 and 11 will need updating for the Chris/Jerry founded-commons correction — Chris at Leo's in Superior, Jerry at The Fledge in Lansing. I'll propagate that when I rewrite those sections. Section 4 rewrite (already delivered) has the reverse mapping and needs a correction pass.

_[tool call: memory_str_replace]_

_[tool result]_

Log updated. Ready for Section 7 whenever you send it, or for reactions to Sections 5 and 6 first.

---

**Marc** (2026-09-10 18:10):

Please use RCN Graph tool for diagrams.

---

**Claude** (2026-09-10 18:11):

_[tool call: memory_read]_

_[tool result]_

Registered. Diagrams via RCN Graph Tool going forward, not the built-in visualize tool. Updating the log.

_[tool call: memory_append]_

_[tool result]_

Two things worth naming so we do this right.

First, I have the canonical rules noted (`src`/`tgt`, full node objects with numeric `w`/`h`/`shape`, `cldLoopNames` as sorted comma-joined key objects) but not the full v22 schema in explicit form. I know your Story Structure JSON has one shape (26 nodes with id/label/color, 59 edges), and your Generic Neighborhood Development Center e-VSM survey has another (11 spheres, 66 directed edges as 33 pairs). Both fit under the same tool family but the specific field structure I'd use for a value chain flow needs your confirmation. Two paths:

Either send me a small example graph JSON that reflects current v22 canonical form — a couple of nodes and edges with all the fields the tool expects — and I'll match it exactly. Or point me at a specific existing RCN Graph Tool JSON file I can use as template (a small one is fine; the value chain diagram is only 5-6 nodes).

Second, the trade-off you're accepting is that diagrams won't render inline in chat during the drafting conversation. They'll be portable to FedWiki and Neo4j, which is where they need to live, but during drafting we'll have the JSON without a visual until we render it in Claude Code against the cld_viewer or the FedWiki site. That's a real cost for iteration speed but a real gain for downstream portability. Confirming that's what you want.

For the Section 6 value chain diagram I produced with the visualize tool — three options:

1. I re-produce it as RCN Graph Tool JSON now (once we settle the format) and the visualize version stays as scratch that gets superseded.
2. I re-produce it later during the Claude Code FedWiki rendering pass, alongside other diagrams that will exist by then.
3. Both — I do it now as JSON so the design record has portable substrate, and Claude Code renders it during instantiation.

My inclination is option 3 — produce the JSON now so the design record carries portable substrate from this point forward, with visual rendering deferred to the Claude Code pass.

For any additional diagrams that come up (the RenDanHeYi/VSM/e-VSM callout for Section 3, potentially others), I'll produce RCN Graph Tool JSON directly rather than starting with the visualize tool.

Send whichever example graph JSON gives me the cleanest template, or point me at a file I can read from disk, and I'll produce the value chain graph in the same shape.

---

**Marc** (2026-09-10 18:15):

Option 3. AND here you have a RCN Graph json and the whole HTML application with that json file.

_attachments: BGTE-3-Levels-Cohesiveness-Frame (14).json, BGTE-3-Levels-Cohesiveness-Frame (21).html_

---

**Claude** (2026-09-10 18:17):

_[tool call: bash_tool]_

_[tool result]_

Got the schema. Creating the value chain flow JSON now in the RCN Graph Tool format.

_[tool call: create_file]_

_[tool result]_

_[tool call: present_files]_

_[tool result]_

Structure follows the schema from your BGTE example: version, mode, modelName, modelNote, canvas settings, the full node objects with x/y/w/h/shape/color/borderColor/borderWidth/borderDash/fontSize/fontColor/note/extraLabels/props, and edges with src/tgt/color/width/dash/curved/polarity/delay/fontSize/traces/layer/note/cpxUser/cpyUser/props.

**Design choices worth naming:**

Vertical column of five nodes centered around x=400, spaced 140 apart. Colors encode function: gray for the durable object (scenario), teal for human work (Solution ME formation and value creation), amber for measurement (recognition), purple for compensation flow (VAM settlement). Feedback edge from n5 back to n1 is dashed red and curved (via cpxUser=720, cpyUser=340) with the "outcomes enrich the scenario" note attached. The four currencies (fiat, time, gifts, reputation) live in n5's note rather than as separate nodes — kept the flow readable at five stages rather than eight.

Node notes carry the substantive detail (what the CfA-dSC settles across, what the neighborhood-authored scorecard registers, how the Platform seeds catalytic capital in gated stages, how the founded commons hosts recurring work and holds the mood field). The tool's hover-note behavior should surface these on inspection. If your v22 tool renders notes differently, or if you'd rather have that detail on the canvas rather than in notes, tell me and I'll adjust.

Polarity fields are empty strings since this isn't a CLD — the diagram is a directional flow, not a feedback-signed loop. If your tool prefers polarity absent versus empty string, tell me and I'll adjust.

Load it into your `cld_viewer.html` at `~/rcn/tools/` and see how it renders. If the layout, colors, or note handling need adjustment I can iterate.

**Ripples for other diagrams to come:**

The RenDanHeYi/VSM/e-VSM callout for Section 3 will also want to be in this format. When we get to that draft, same schema.

Any other diagrams that emerge during the remaining sections likewise.

Ready for Section 7 or reactions to Sections 5 and 6.

---

**Marc** (2026-09-10 18:19):



_attachments: EDITED SECTION 7.pages_

---

**Claude** (2026-09-10 18:21):

_[tool call: bash_tool]_

_[tool result]_

Substantial corrections and a lot to work through. Report and answers.

**Where I got things wrong:**

The six-moods set — I substituted my inferred set for your actual working framework, which is much cleaner. Your set is closing moods (Resentment, Anxiety/Fear, Resignation) and opening moods (Acceptance, Curiosity, Ambition), organized by past/present/future × opening/closing. That's a 3×2 matrix that anchors moods in time-orientation and disposition-toward-possibility. Cleaner than what I had. My "wonder" and "serenity" collapse into Curiosity and Acceptance respectively. I'll use your framework in the rewrite.

The Beer/mood connection — you're right to challenge. I don't have a specific Beer citation for treating moods as VSM system-level information. I was inferring from Beer's writing on system-level information flows and extrapolating. The honest move is to drop the specific Beer-said-this claim and reframe: the VSM structure *invites* us to read moods as diagnostic information about the neighborhood's viable-system state (S4 deficit, S5 identity issues, unresolved S3\* findings). That reading is a legitimate application of Beer's framework, not something Beer explicitly wrote. I'll rewrite the section that way. Your S5-as-culture note is accurate; Beer does treat S5 as identity/purpose, which maps to culture.

**On the nine states — I need the diagrams:**

The five speech acts (assertions, declarations, requests, offers, promises) is the Flores-Searle working set as commonly diffused, but Dunham's fuller nine-states framework includes what my draft treated as "sixth-category discipline" (declines) plus more: renege, revoke, and probably some conversation-type distinctions. I don't have the specific nine states in an authoritative form. Send the diagrams and I'll integrate them directly rather than guessing. Meanwhile I can hold Section 7 or draft with a placeholder noting the framework will be filled in from your material.

**On Charles Spinosa:**

Charles Spinosa is Flores's principal co-author for a body of work that extends speech-act theory into a philosophy of world-making. Their book *Disclosing New Worlds: Entrepreneurship, Democratic Action, and the Cultivation of Solidarity* (with Hubert Dreyfus, MIT Press, 1997) treats entrepreneurs, citizen activists, and cultural figures as three forms of "history-making" agents — people who bring new worlds into being through skilled disclosive action. Their argument draws on Heidegger's later work on how humans dwell in shared understandings, and on Austin and Searle's speech acts, to develop a philosophical account of how new practices and new ways of being get established. Spinosa's more recent work with Dreyfus (*All Things Shining*, and articles on trust and business) continues this trajectory. What makes Spinosa relevant to RCN: his account of world-disclosing action treats entrepreneurial and civic-action work as the same kind of thing — bringing new possibilities into being through speech, mood, and skilled coordination. That's exactly what RCN's neighborhood work is doing, and Spinosa's framework provides philosophical grounding for treating it as a serious practice rather than as a hobby or a compensation for missing institutions.

I'll add a paragraph in the rewrite.

**On the coffee conversation preceding Dunham's possibility/action:**

Registering this as a real addition. The sequence becomes:
- Coffee conversation: is there any possibility of shared interest in creating shared futures? (Marc + Robin Asby)
- Conversation for possibilities: what could exist? (Dunham/Flores)
- Conversation for action: what will we commit to doing? (Dunham/Flores)

This threads through the kit phases — Phase 1 is coffee-conversation territory, Phase 2 opens the possibilities conversation, Phase 4 chartering is the action conversation. Worth naming explicitly.

**On shared background of understanding:**

Dunham's term for the mutual understanding that must exist before requests and offers can land. Marc's addition: must be developed alongside conditions of satisfaction and time specification, before any request or offer is made. This adds an important discipline to Phase 4 chartering — you don't jump to requests and offers until the shared background is present. This threads back to the coffee conversation and to Phase 1 pre-work. I'll integrate.

**On "menu of adjacencies":**

I've been using this without defining it. It's my language, not yours. The concept: the set of supports and resources that a Neighborhood-Catalyzing Industry Platform can offer to small groups and MEs — mentorship, catalytic capital, connection to other MEs, help with scenario articulation, contract help, story-craft support, e-VSM survey deployment, and so on. "Adjacencies" was my attempt to name that these are available-nearby-when-requested rather than pushed-as-a-service. The problem is it doesn't communicate. Better options: "menu of supports," "support offerings," "what the Platform can offer," or just describe the specific offerings in prose without a summary term. My inclination is to drop the abstract summary term and just describe the specific offerings. Confirm and I'll propagate through Sections 2, 6, 7.

**On "kit":**

Real question, worth thinking. Options with what each conveys:
- "toolkit" — collection of separable tools; matches what it is but generic
- "playbook" — the CMG lineage; sequence of plays; useful heritage but sports metaphor
- "companion" — accompanies the convener; humble; doesn't convey structure
- "guide" or "facilitator's guide" — traditional; well-understood; slightly institutional
- "handbook" — reference to be used at hand; slightly formal
- "pattern" — Alexander lineage; matches the pattern-language work you've done
- "cycle" — the recurring five-phase form; matches what it is
- "practice" — what it is when it becomes native to a neighborhood; matches the outcome
- "field guide" — for use in specific terrain; convener uses in their neighborhood
- "protocol" — sequence and discipline; technical/medical feel

My leaning: "practice" or "field guide." "Practice" captures the outcome (the neighborhood eventually does this as native practice, not as facilitated method) and treats what's being delivered as something you take up rather than deploy. "Field guide" captures the convener's role (they're in the field of a specific neighborhood, using this to navigate). "Kit" has served as working shorthand but as you say, it may be worth changing. Which direction resonates?

**On Neo4j tracking of speech acts and RenDanHeYi behaviors — the Workbench question:**

This is a substantive design question about substrate. What you're describing is real:
- Neo4j as the underlying graph database
- Multiple UIs on top: convener facilitation UI, ME chartering UI, scenario browser, portfolio viewer, Platform dashboard
- Speech acts recorded as nodes/edges with attribution, time, conditions of satisfaction, status (open, promised, fulfilled, reneged, revoked)
- ME formation, EMC composition, VAM specification all tracked
- Value chain flows recorded from Platform contribution through ME work to resident recognition

This is the Haier Workbench pattern, adapted for neighborhood scale. It's a design goal for the RCN foundational tools and Section 8 (between-institution project work) is the right place to develop it further — the between-institution project is where multiple speech acts and coordination flows converge, and it's what the Workbench-analog needs to hold.

Worth naming: what you're describing is essentially the "RCN Workbench" as a proper name. It's not just CfA-dSC alone, not just Overall Schema alone, not just SODOTO alone — it's the integrated tool suite these constitute when they run together on a shared graph database. Worth naming it directly rather than treating it as an emergent property of the substrate.

**On Vester's Impact Matrix vs weighted selection matrix:**

Real question, needs its own treatment. Both are matrices; they do different things.

Vester's Impact Matrix (from Sensitivity Model / SensiMod): rows and columns are system variables. Cell values rate the direct causal impact of the row variable on the column variable (typically 0-3). Sum of each row = the variable's "active" score (how much it influences the system). Sum of each column = the variable's "reactive" score (how much the system influences it). Cross-plotting these places variables in categories: Active (high row sum, low column), Reactive (low row, high column), Critical (both high), Buffering (both low). It's a diagnostic tool that surfaces where system leverage lives.

The CMG weighted selection matrix (as I understand it from your 2014 materials): rows are options/candidates for prioritization; columns are principles/criteria with weights; cells are ratings of how each option scores on each principle; weighted sums produce a prioritization. It's a decision-making tool for choosing among options.

They're related in structure (both matrices) but distinct in purpose:
- Vester diagnoses a system's own dynamics
- CMG-style selects options against a group's criteria

Both belong in the kit. Vester's matrix is useful in Phase 2 (understanding what's happening in the neighborhood at the systems level). CMG's is useful in Phase 3 (choosing which scenarios to prioritize). Different phases, different tools.

Worth naming both in Section 7 (which discusses the CMG selection matrix already) with a brief callout to Vester. I can add.

**Proposed sequence:**

1. You send the Dunham nine-states diagrams (or share the specific nine states in prose)
2. You confirm the "kit" alternative — practice, field guide, or something else
3. You confirm dropping "menu of adjacencies" for direct description
4. I rewrite Section 7 with:
   - Corrected six moods (closing × opening across past/present/future)
   - Beer-mood claim dropped, VSM-invites-mood-reading kept
   - Wittgenstein added to Austin/Searle/Flores lineage
   - Spinosa developed briefly
   - Nine states from Dunham (once I have the diagrams)
   - Coffee-conversation preceding possibility/action
   - Shared background of understanding as chartering discipline
   - Vester's Impact Matrix callout vs CMG selection matrix
   - "Kit" replaced throughout
   - "Menu of adjacencies" replaced throughout with direct description
5. Section 8 gets Workbench treatment when we get there — RCN Workbench as the proper name for the integrated tool suite

Also worth flagging: sections already delivered (1-6) will need the "menu of adjacencies" and "kit" replacements when we do a pass through those. Small edits, not full rewrites, but real.

Ready for the diagrams and your calls on the naming questions.

_[tool call: memory_append]_

_[tool result]_

Log updated. Waiting on Dunham diagrams and your calls on naming.

---

**Marc** (2026-09-10 18:35):

On nine states: how much of this can you access. Here is an SVG. And another PNG. AND thanks for reminding me of Disclosing New Worlds: Entrepreneurship, Democratic Action, and the Cultivation of Solidarity, I have read it but forgot the authors and yes it is relevant and I will reread it in light of current work. AND drop the abstract summary term and just describe the specific offerings.  AND "field guide." AND yes on ""RCN Workbench" AND yes "Both belong in the kit."

_attachments: Screenshot 2026-09-10 at 11.29.03 AM.png_

---

**Claude** (2026-09-10 18:39):

I can read the Dunham diagram clearly. Nine states as moves within a four-phase conversation-for-action: Initiation (Request), Negotiation (Promise, Decline, Counteroffer, Commit-to-Commit), Fulfillment (Declare complete, Cancel, Revoke), and Satisfaction (Declare satisfied / dissatisfied). The other documents came through empty — probably the SVG and another PNG — but the diagram I can see is authoritative for the nine states. I have what I need.

Updating memory with the decisions, then rewriting Section 7.

_[tool call: memory_append]_

_[tool result]_

Section 7 rewrite:

---

# Section 7 — Moods and Speech Acts as the Working Layer

## Why this is a section, not an appendix

Moods and speech acts are the substance of how people interact with each other. They permeate every phase of the field guide, every scenario negotiation, every conversation between Platform actors and MEs, every retrospective, every founded-commons conversation. They are not a specialized tool that comes out for specific occasions. They are the human constructs through which everything else happens. A conversation that ignores them still contains them; ignoring them means being moved and impacted by them without understanding why cooperation succeeds or fails. They are integral to all human behavior, and lack of awareness of them is a common cause of frustration and disappointment.

The design conversation initially placed this material as an appendix — a substrate that curious readers could reach for. Marc's correction was sharp and definitive: moods and speech acts are critical to everything and will be used at all phases and explained as needed. That correction reshaped Section 7 into a load-bearing section rather than a reference.

The section develops the material at a level a convener can use in practice without becoming a specialist. It does not attempt to replicate Fernando Flores's full ontological-coaching curriculum or Bob Dunham's Institute for Generative Leadership training. It develops enough of the vocabulary and enough of the operational implications that a convener can name what is happening in a room, recognize when a mood mismatch is masquerading as a values disagreement, distinguish a promise from a hopeful wish, and hold speech-act discipline through the moments when it matters most — the chartering of MEs in Phase 4, the retrospective in Phase 5, the naming of what a scenario is asking for.

Progressive disclosure is the operating principle. Vocabulary earns its way in through use. A convener explains what an act of declaration is when a moment in the meeting turns on someone declaring something. A convener names a mood of resignation when the room is stuck and no one has said why. The teaching is embedded in the doing. Full curriculum is available for those who want it — Flores's writings, Charles Spinosa and Hubert Dreyfus's work extending speech acts into a philosophy of world-disclosing action, Bob Dunham's Institute for Generative Leadership materials — but the field guide does not require a convener or a neighborhood to become fluent in the theory before beginning.

## Moods as the working layer

A mood is not an emotion in the usual sense. Emotions are episodic, personal, and often about something specific. Moods are pervasive, shared across a group or a situation, and shape what is possible to say, do, hear, or notice from within them. A room in a mood of resignation cannot hear an invitation to imagine what could be; the invitation lands as naive at best, offensive at worst. A room in a mood of ambition cannot hear a caution about downstream failure modes; the caution lands as obstruction. Moods are not obstacles to conversation — they are the ground on which conversation happens, and skilled facilitation begins with noticing the ground.

Six moods organize into a working framework a convener can hold in practice. They come in two disposition-toward-possibility categories (closing moods and opening moods), each with three time-orientation positions (past, present, future).

**Closing moods** foreclose possibility. They tell the person or room that action toward something new is not available. Each attaches to a different time orientation.

*Resentment* is the closing mood oriented to the past. Something was taken from us that we were owed; someone did us wrong; the injustice has not been repaired. Resentment holds a real memory of harm and refuses to release it. In a neighborhood context, resentment is often accurate — the harm was real, the repair has not happened, the institutional actors that caused it are still operating. Resentment cannot be facilitated away, and any convener who tries will lose the room. The convener's work when resentment is present is to acknowledge what happened, refuse to minimize it, and hold the possibility that new work can happen alongside unresolved harm without pretending the harm is resolved.

*Anxiety or fear* is the closing mood oriented to the present. Something is happening now that threatens what matters, and the person or room cannot see how to act well in the face of it. Anxiety collapses attention onto the source of threat and narrows the range of responses that seem available. In a neighborhood context, anxiety may be about immediate economic precarity, about a policy change bearing down, about a neighbor in crisis. The convener's work when anxiety is present is to acknowledge the reality of the threat, help the room see what is actually knowable versus what is uncertain, and preserve enough grounded space that action becomes possible again.

*Resignation* is the closing mood oriented to the future. Nothing can really change here; we've tried before; the problem is too big; the powerful won't allow it; the people who would have to change won't. Resignation forecloses possibility. It often masquerades as realism or wisdom. A room in resignation cannot do Idealized Design work, because Idealized Design requires the belief that a designed present is available if the constraints of history don't bind. The convener's first move when resignation is present is to name it, not to argue with it. Naming it opens space; arguing with it strengthens it.

**Opening moods** open possibility. They tell the person or room that action toward something new is available. Each attaches to a different time orientation.

*Acceptance* is the opening mood oriented to the past. This is what happened, and I can work with this; the constraints from the past are real but they are not everything. Acceptance is neither resignation nor cheerful denial. It is the mood from which realistic action becomes possible. Most productive work happens in acceptance. Acceptance is also what allows a Platform actor to seed an ME that may fail, an ME participant to commit to work that may not deliver, a convener to invite a neighborhood into work whose outcome is not guaranteed. Without acceptance, catalytic seed capital cannot be deployed honestly, because the deployer will unconsciously bend the work toward visible near-term success at the expense of the actual value chain. Acceptance is what makes the raise-your-kids-and-set-them-free principle from Section 2 emotionally available rather than only intellectually correct. The convener's work is often to help the room move from resignation or resentment into acceptance, without forcing the move and without prematurely claiming it has happened.

*Curiosity* is the opening mood oriented to the present. I don't know what this is; I want to look longer; the situation is more interesting than my current understanding of it. Curiosity is what allows a scenario to be articulated at end-to-end scope rather than at product-development scope. It is also what allows a convener to see a neighborhood on its own terms rather than through prior templates. Curiosity is often missing from professional facilitation because professional certainty is what facilitators are hired for. The convener will do better work in curiosity than in certainty; the design record commits to this preference.

*Ambition* is the opening mood oriented to the future. We could do more than we currently are; the horizon is open; possibility exceeds current arrangements. Ambition is what Idealized Design requires. Ambition without acceptance produces wish lists; acceptance without ambition produces incremental adjustment; both together produce designed futures that are also grounded. The convener's work is to invite ambition after acceptance has settled, and to protect it from being flattened back into what already exists.

These six do not cover every mood a convener will encounter. Grief, joy, pride, shame, and others can be present in any given meeting, and skilled facilitation reads them accurately. What the six above name specifically is the working set that recurs in the kind of work the field guide is for. A convener who can distinguish resignation from acceptance, ambition from wish, resentment from anger, curiosity from confusion, has enough to work with.

## Mood as viable-system signal

The VSM framework from Section 3 invites us to read moods as diagnostic information about the neighborhood's viable-system state, not as emotional states of the individuals who happen to hold them. This is a legitimate application of Beer's framework, though not a claim Beer made directly.

A resignation mood widespread in a neighborhood is information about the neighborhood's S5 (identity, purpose, culture) or its S4 (outside and future) being in trouble. It is not information about the resigned individuals being defective. Resentment widespread in an institution is information about unresolved S3\* findings that S3 has been ignoring, and about damage the institution has done that has not been repaired. Anxiety widespread in a neighborhood is information about environmental pressures that the neighborhood's S4 is not yet handling, or about coordination failures at S2 that the residents are absorbing individually.

At neighborhood scale, this means the moods of the room during a Phase 2 meeting are diagnostic. Resignation in the room suggests S4 is not functioning — the neighborhood cannot imagine a different future, which is the specific S4 deficit the field guide exists to address. Resentment in the room suggests unresolved history that any Idealized Design work will run into unless acknowledged. Ambition without acceptance suggests the room is in denial about current constraints and will produce a plan that cannot survive contact with those constraints. The convener's mood-reading is not a soft skill; it is measure-reading, and the measures are pointing at the neighborhood's viable-system state.

The Section 3 note about "almost every neighborhood is deficient in S4" connects to this. Neighborhoods where S4 has been non-functional for a long time typically operate in some mixture of resignation about what could be and reactive vigilance about what is coming. The field guide's Phase 1 through Phase 3 work is, at the mood layer, an invitation into acceptance and then into curiosity and ambition — moods from which S4 can begin to function. This is not incidental to the field guide's purpose; it is close to being the field guide's purpose and foundation expressed in mood terms.

## Speech acts as the structure of coordination

Fernando Flores's contribution, drawing on Ludwig Wittgenstein, John Austin, and John Searle, is that human coordination happens through a small number of distinguishable acts we perform in language. Recognizing which act is being performed changes what response is appropriate, what commitment has been made or not made, and where a coordination will succeed or fail.

Five foundational speech acts form the working vocabulary.

**Assertions.** Claims about what is the case. "The linkage map shows three institutions with no connections." "Rent in this neighborhood rose 40 percent in five years." Assertions can be true or false; they invite evidence or dispute; they do not by themselves create commitment. Most conversation is made of assertions.

**Declarations.** Speech acts that bring something into being by being said, by someone with the authority to say them. "This meeting is closed." "You are hired." "I now pronounce you married." "This scenario is prioritized for Phase 4." Declarations require authority; they create new realities; they change what is possible from that moment forward. Convener declarations shape what the group takes as decided. Neighborhood declarations shape what the neighborhood takes as its own. Declaring what does not exist yet is the specific speech act that Idealized Design and scenario articulation require.

**Requests.** Speech acts that ask another party to perform an action, with conditions of satisfaction and a timeframe. "Would you draft the linkage map by Thursday?" A well-formed request specifies who is being asked, what is being asked for, by when, and under what conditions of satisfaction the request will be considered fulfilled.

**Offers.** Speech acts that propose to perform an action for another party, with conditions of satisfaction and a timeframe. "I could facilitate the retrospective if that would help." Offers are the mirror of requests; they invite acceptance or decline.

**Promises.** Speech acts that commit the speaker to perform an action, with conditions of satisfaction and a timeframe. "I will have the linkage map to you by Thursday." A well-formed promise names who is committing, what they are committing to, by when, and under what conditions. Promises create futures that the speaker becomes accountable for. Broken promises break trust in specific and traceable ways; well-kept promises build it. Trust is rebuilt by making good on prior broken promises.

## The nine states of a conversation for action

Bob and Jean Dunham at the Institute for Generative Leadership, working from Winograd and Flores's *Understanding Computers and Cognition* (1986), developed a framework that structures the five foundational speech acts into a four-phase conversation-for-action with nine possible moves. Marc has used this framework in his own practice and hired Dunham to teach it to approximately 150 people in Whatcom County under the umbrella of Language, Moods, and Bodies of leadership.

The framework has two roles — Customer (the one whose future the conversation is about) and Performer (the one being asked to bring that future about) — and four phases.

**Phase 1 — Initiation.** The Customer makes a Request of the Performer, specifying a condition of satisfaction. The Request opens the conversation. In practice, well-formed Requests also specify a timeframe and any background constraints the Performer needs to know.

**Phase 2 — Negotiation.** The Performer can respond with any of four moves: Promise (accepting the Request as stated), Decline (refusing without counter-proposal), Counteroffer (proposing modified terms), or Commit-to-Commit (deferring the substantive response to a later time). If the Performer counteroffers, the Customer can respond with Accept, Decline, Counteroffer, or Commit-to-Commit — and negotiation continues until Promise and Accept converge on shared terms, or the conversation ends without commitment. Throughout Negotiation, either party can Cancel (Customer) or Revoke (Performer) — moves that end the conversation before commitment is established.

**Phase 3 — Fulfillment.** The Performer performs the promised action, then Declares complete to the Customer. Cancel and Revoke remain available if circumstances change; well-managed Cancels and Revokes preserve trust, whereas silent abandonment of the promise damages it.

**Phase 4 — Satisfaction.** The Customer Declares satisfied or Declares dissatisfied. Dissatisfaction opens the possibility of the Performer taking additional action to satisfy, or of the conversation ending without full satisfaction while the parties acknowledge what happened.

Nine moves in total: Request, Promise, Decline, Counteroffer, Commit-to-Commit, Accept, Cancel, Revoke, Declare complete, and Declare satisfied or dissatisfied (counted as one move with two variants). These are not additional speech acts distinct from the five foundational ones — they are specific moves that use the foundational acts (particularly Requests, Promises, and Declarations) within a structured conversation-for-action.

The value of the nine-states framework for RCN work is that it makes the moves explicit. Instead of "I asked him and he sort of said yes but nothing happened," a convener can trace: Request made, Counteroffer received, no Promise resulted, no Fulfillment attempted, no Declaration of anything. That trace tells you where the conversation actually is and what the next well-formed move would be.

## Conversations for coffee, possibilities, and action

Bob Dunham distinguished between conversations for possibilities and conversations for action. Different work happens in each. Marc and Robin Asby have added a preceding conversation type: the coffee conversation.

The **coffee conversation** asks whether there is any possibility of shared interest in creating any shared futures at all. It precedes possibilities-thinking and action-planning. Two people meet over coffee (literally or figuratively) and explore whether they see the world in enough shared terms to imagine building something together. Many coffee conversations end without going further, and that is a fine outcome — the parties learned what they needed to know. Some coffee conversations open space for the next kind of conversation.

The **conversation for possibilities** asks what could exist that does not currently. Participants speculate, imagine, propose, without yet committing. Idealized Design work happens in conversations for possibilities. Scenario articulation happens in conversations for possibilities. Phase 2 of the field guide is largely a conversation for possibilities.

The **conversation for action** — the four-phase, nine-state structure above — commits to specific work with specific parties by specific times. Phase 4 chartering is a conversation for action. ME formation is a conversation for action. VAM specification is a conversation for action.

Collapsing these confuses the parties and produces broken commitments. A conversation for possibilities treated as a conversation for action produces premature promises that cannot be kept. A conversation for action treated as a conversation for possibilities produces vague intentions that never become promises. A coffee conversation treated as either produces the impression of interest where there is only politeness.

The field guide's phases move through all three: Phase 1 pre-work often includes coffee conversations with potential participants; Phase 2 is possibilities territory; Phase 3 selects the possibilities that become the ground for action; Phase 4 charters actions. Convener judgment includes recognizing which conversation is appropriate at each moment and holding the discipline of not skipping ahead.

## Shared background of understanding

Bob Dunham and Marc use the term "shared background of understanding" to name the mutual understanding that must exist before Requests and Offers can be well-formed. Two parties who do not share enough understanding of the situation, each other's roles, the context, and what value would look like cannot make Requests or Offers that produce Promises worth trusting.

The discipline: shared background of understanding must be developed alongside conditions of satisfaction and time specification *before* any Request or Offer is made. Jumping to Requests without shared background produces requests that lack necessary detail. Making Offers without shared background produces offers that miss what is actually needed. Committing to Promises without shared background produces broken promises.

At Phase 4 chartering, this discipline is load-bearing. The Solution ME, the Platform, the ecosystem community members, and the primary-ME all need to share enough understanding of the scenario, the value chain, the currencies involved (fiat, time, gifts, reputation), and the specific work required that their Requests and Offers can converge on Promises worth trusting. If the shared background is thin, the chartering fails — not always visibly at first, but reliably as the work proceeds.

The RCN Workbench (developed further in Section 8) is being designed in part to make shared background of understanding explicit — capturing not only Requests, Offers, Promises, and Declarations but also the background context each party brings, so that shared background becomes a first-class object rather than an implicit prerequisite.

## Where speech-act discipline matters most

The field guide's phases include several moments where speech-act discipline is load-bearing rather than optional. Failing at these moments produces the specific failures that between-institution work is famous for.

**Phase 2's WHY sequence.** The WHY question, asked from the POV of everyone present, produces Declarations of purpose — each participant declaring what the work is for from where they stand. Declarations are the right speech act for this moment because purpose is brought into being by being said, not derived from evidence. The convener's work is to hold space for Declaration rather than to invite Assertion (as if there were a right purpose to be discovered). WHERE, WHEN, WHO follow as more Declarations of context and commitment. The Declarations become the ground for WHAT IS and WHAT MIGHT BE (Assertions about the current state and Declarations about the imagined future).

**Phase 3's weighted selection.** The selection produces a Declaration by the group about which scenarios are prioritized. The weighted-input method distributes the declarative act across the group rather than concentrating it in the loudest voice. The convener's work is to make the declarative moment explicit — this is what we are declaring, together, as our priority — so that Phase 4's commitments have real ground to stand on. The weighted selection matrix is distinct from Vester's Impact Matrix (both are matrices, both belong in the field guide, they do different work); the distinction is developed below.

**Phase 4's chartering.** Chartering is speech-act-dense. The scenario is Declared as the object being addressed. The ME's Leading Targets are Declared as what will be aimed for. Resource contributions are Offers made by ecosystem-community members. Commitments to specific work are Promises made by ME participants. The VAM is a joint Declaration of how value will be shared when it arrives. CfA-dSC contracts instrument these speech acts formally. Chartering fails when the speech acts are vague — when a Promise is actually a hopeful wish, when a resource contribution is actually a maybe, when a Leading Target is actually a hoped-for outcome. The convener's discipline is to name each speech act as it happens, invite the well-formed version if the first version is vague, and protect the right to Decline if that is the honest response. And to insist that shared background of understanding is developed before Requests and Offers are made.

**Phase 5's retrospective.** Retrospectives are Assertions about what happened, Declarations about what the group takes as learned, and often new Promises about what will be done differently next time. The mood-reading of the retrospective is at least as important as the assertion-reading: a retrospective in resignation cannot honestly declare what was learned, because the mood forecloses the possibility that learning matters. The convener's work is to protect the retrospective from collapse into either premature celebration or unwarranted despair.

**Every Platform-ME conversation.** When a Platform actor talks with an ME leader about seeding, mentoring, or contracting, the conversation contains Requests, Offers, Promises, and Declarations — moving through the four phases as the work develops. Each act is either well-formed or not. Well-formed speech acts create traceable commitments and traceable ground for later settlement; vague speech acts create ambiguity that shows up later as broken trust or unrecoverable value chains. The Platform's compensation eventually depends on residents recognizing value received — which requires the value chain to have been well-formed in speech from the beginning.

## Vester's Impact Matrix and CMG's weighted selection matrix

Both are matrices; they do different work; both belong in the field guide.

**Vester's Impact Matrix** (from Frederic Vester's Sensitivity Model work, operationalized in RCN's SensiMod tool) diagnoses a system's own dynamics. Rows and columns are system variables. Each cell rates the direct causal impact of the row variable on the column variable (typically 0-3). Row sums indicate how strongly each variable influences others (active score). Column sums indicate how strongly each variable is influenced (reactive score). Cross-plotting active against reactive places variables in four categories: Active (high row, low column — leverage points), Reactive (low row, high column — indicators), Critical (both high — hot spots), and Buffering (both low — inert). Vester's matrix reveals where system leverage lives.

**The weighted selection matrix** from the CMG playbook, adapted in Phase 3 of the field guide, is a decision-making tool. Rows are options or candidates for prioritization (scenarios, MEs, projects). Columns are principles or criteria with weights. Cells rate how each option scores on each principle. Weighted sums produce a prioritization. The weighted selection matrix supports a group in choosing among options against agreed criteria.

The two tools serve different phases and different questions. Vester's Impact Matrix belongs in Phase 2 when the neighborhood is understanding how its own system works — which variables drive others, where leverage might live. The weighted selection matrix belongs in Phase 3 when the neighborhood is choosing among prioritizations for the coming cycle of work. Confusing them (using Vester's to prioritize scenarios, or using CMG's to diagnose system dynamics) produces the wrong kind of analysis for the moment.

Both tools rest on the same speech-act ground: the values in cells are Assertions about impact or fit, the weights and criteria are Declarations by the group about what matters, and the resulting rankings inform the next Declarations about system-understanding or prioritization.

## Moods and speech acts together — the coordination grammar

Moods and speech acts interact. A Promise made in resentment lands differently than a Promise made in acceptance. A Request made in ambition invites a different response than a Request made in resignation. A Declaration made in curiosity holds differently than a Declaration made in anxiety. The convener who can read both layers together — the mood as ground of the conversation, the speech-act structure as what the conversation is building — has measures that most facilitators lack.

Some specific interactions worth naming.

An apparent values disagreement between two participants often turns out to be a mood mismatch about the same possibility. One is in ambition; the other is in resignation; they are talking past each other and hearing each other's positions as opposed values when they are actually opposed moods. The move that resolves the disagreement is not values reconciliation; it is mood recognition, followed by whatever work is needed to bring the moods into workable relation.

A Promise made without acceptance of what will be required to keep it is a broken promise waiting to happen. The convener's work at chartering is to notice when a Promise is being made in ambition without the acceptance-of-cost that would make it real, and to invite the promiser to re-examine before the Promise is recorded. This is what shared background of understanding is for: developed before the Request and Offer, it exposes what will be required so that the Promise can be made in acceptance rather than in hope.

A Request declined in resignation is a different signal than a Request declined in acceptance. Declined-in-acceptance means the requestee has good reasons and can articulate them; declined-in-resignation means the requestee cannot see the possibility of doing what is asked, which is diagnostic information about their mood state, not about the Request. The convener responds differently to each.

A Declaration held in curiosity can be revised as understanding develops; a Declaration held in ambition without curiosity tends to be defended even when it should be revised. The convener's work is to hold declarative moments open long enough for curiosity to be present, so that what gets declared can change through experience and learning.

## What Section 7 commits the design to

Moods and speech acts are treated throughout the design record as a working layer, not as an optional appendix or specialist technique. Every phase's facilitation involves reading the mood-ground and holding the speech-act discipline. Every ME chartering involves well-formed speech acts, shared background of understanding, and mood recognition. Every retrospective involves both.

The vocabulary is available to be named at any moment when naming would help. The field guide does not require anyone to become fluent before beginning. Vocabulary earns its way in through use, with progressive disclosure as the operating principle. Convener guidance includes when to name and when to work implicitly.

The six moods (Resentment, Anxiety, Resignation on the closing side; Acceptance, Curiosity, Ambition on the opening side) organized across past, present, and future are the working set. The five foundational speech acts (Assertions, Declarations, Requests, Offers, Promises) and the nine states of the conversation-for-action (Request, Promise, Decline, Counteroffer, Commit-to-Commit, Accept, Cancel, Revoke, Declare complete, Declare satisfied/dissatisfied) are the working speech-act framework. The three conversation types (coffee, possibilities, action) name what kind of conversation is being had. Shared background of understanding names the discipline required before Requests and Offers are made.

CfA-dSC is the RCN foundational tool that will eventually instrument speech acts formally — Promises captured as smart contracts, Declarations recorded with attribution, Offers and Requests tracked through their conversation phases. The mature form of the field guide runs on the RCN Workbench (developed in Section 8), integrating CfA-dSC with SODOTO portfolios and the Overall Schema graph on Neo4j to make the coordination layer directly readable. In the interim, the vocabulary and the discipline work without full instrumentation.

The Flores tradition — including Wittgenstein, Austin, and Searle as forebears, and Charles Spinosa and Hubert Dreyfus as extending the framework into a philosophy of world-disclosing action (in *Disclosing New Worlds: Entrepreneurship, Democratic Action, and the Cultivation of Solidarity*, MIT Press, 1997) — is named as further reading for those who want the philosophical substrate. Bob and Jean Dunham's Institute for Generative Leadership curriculum on Language, Moods, and Bodies of leadership is the applied tradition Marc has drawn on and taught. The design record does not attempt to replicate these curricula.

Section 8 returns to the between-institution project work — now understood as the operational form Solution MEs take when they form around scenarios, negotiate value chains with the Industry Platform, and enter into speech-act-instrumented CfA-dSC contracts under the moods-and-speech-acts discipline described here. Section 8 also develops the RCN Workbench as the integrated tool suite that instruments the coordination grammar at operational scale.

---

Section 7 rewrite, around 3800 words. Longer than the original because the corrections were substantive.

Three things worth your attention.

The six-moods framework is now correct — closing and opening across past, present, future — and I've dropped wonder and serenity. If the way I've phrased the mood definitions differs from how you teach them, tell me and I'll match your usage.

The nine-states section describes the conversation-for-action framework from your Dunham diagram. I've named it as nine possible moves within the four-phase structure rather than as nine additional speech acts distinct from the five foundational ones. If the Dunham teaching treats them as more distinct, tell me and I'll adjust.

The Beer-and-mood claim is dropped. The section now reads "The VSM framework from Section 3 invites us to read moods as diagnostic information... This is a legitimate application of Beer's framework, though not a claim Beer made directly." That's the honest form.

Two smaller things I'd like your reaction to:

The "field guide" replacement for "kit" is now used throughout Section 7. I have not yet gone back through Sections 1-6 to make the same replacement — that's a mechanical pass I can do once we're through the substantive rewriting.

The RCN Workbench reference points forward to Section 8. Section 8 hasn't been rewritten yet with that content. When we get to Section 8's rewrite, the Workbench treatment will need real development.

Ready for Section 8 or reactions to this rewrite first.

_[tool call: memory_str_replace]_

_[tool result]_

I accidentally overwrote Section 6's status entry in the log with Section 7's. Fixing.

_[tool call: memory_str_replace]_

_[tool result]_

Log corrected. Ready for Section 8 or reactions.

---

**Marc** (2026-09-10 19:18):



_attachments: EDITED SECTION 8.pages_

---

**Claude** (2026-09-10 19:20):

_[tool call: bash_tool]_

_[tool result]_

A lot to work through. Reporting and proposing sequence.

**On "we are writing a book":**

That observation reshapes what this is. A book has different requirements than a working design record — it has a target audience beyond RCN participants, a publication path, a title, a structure that a reader who isn't already inside the work can pick up cold. And it needs a writing plan that tracks what's done, what remains, and what questions are open.

Proposal for the book-planning artifact: a companion document (probably in memory as a working substrate) that holds three lists — sections/chapters written to current draft state, sections/chapters or components still to write, open questions with their status. Updated after each drafting session. This becomes the compass we work against. Doesn't replace the sections themselves; sits alongside them.

I'll create this alongside the drafting log if that shape works.

**Quick answers to small items:**

- **GGCS reminder**: GGCS = Guidance Group and Communication Space, one of the seven Confluence work streams from the 2016 Medford (Jackson County, OR) architecture. The GGCS Jira project held 60 stories under Epic GGCS-8 ("All the feasible projects that could both improve population health and lower costs") — the between-institution scenarios and project stubs that emerged from Medford's Idealized Design work. Section 11 references this fully; Section 8 needs a brief gloss on first mention.

- **Chris/Jerry mapping**: Confirmed as Chris in Superior at Leo's, Jerry in Lansing at The Fledge. Your Section 8 text has this right. I had it wrong in the Section 4 rewrite; that needs correction.

- **Principle Three by name**: "Catalytic seed capital that departs." I'll restate at the end of Section 8 and check whether other places refer to principles without naming them.

**Substantive corrections for the Section 8 rewrite:**

The most important is the institutions correction. My draft treated institutions themselves as a failure pattern; your correction reframes it. Institutions aren't bad. Haier creates new institutions constantly. The failure is holding onto underperforming institutions, not creating them. Some MEs will and should become durable institutions when the work they do requires durable institutional form. What RCN adds is balanced-scorecard measurement with Rasch-modeled social metrics for evaluating which institutions deserve to persist — as opposed to Haier's business-metrics-only approach. This changes the framing throughout Section 8.

Related: participants in an ME participate as themselves, AND institutions can separately commit their own resources. Your line about institutions "loaning" executives or managers to MEs without monetary compensation, betting on outcome value, is important — it's a specific institutional participation mode. The Section 8 rewrite needs to hold both tracks: individual-as-themselves ME participation AND institutional commitment mechanisms.

The "reliably fails" claim softens to "seldom works." The Kania and Kramer / collective impact reference goes out.

The "The ME's members are the ME's members" awkwardness gets rewritten.

The Platform's persistence in the value chain needs unpacking. I meant: while individual MEs form and dissolve, the Platform is a persistent set of relationships (with specific MEs it seeds, with the neighborhoods it serves, with other Platforms across RCN, with the RCN foundational tools) that maintains continuity across many ME cycles. But that needs clearer articulation.

The polycentric terminology needs work. "Polycentric" brings sets to your mind; you also think in networks. The Section 8 language about the refugee student existing simultaneously in school, family, cultural community, neighborhood, and provider ecosystems needs different vocabulary or a visualization. Options: "multiple simultaneous viable systems," "overlapping systems," "network of nested systems." Or I produce an RCN Graph diagram showing the specific case. Or both.

**Substantive additions — I need substrate:**

- **Ackoff Bell Labs 1991**: The transcript file you mentioned (_tape_of_ackoff's_bell_lab_lecture_v1 (480p).md in your downloads) — I'd need that content. When you can share it, I'll work it into the section as a case study of a nearly-complete scenario worked over 40 years by successive MEs and EMCs.

- **Verna Allee's value networks**: Real ask. Allee's *The Future of Knowledge* and her work on value network analysis (VNA) developed a framework for mapping value flows including tangible and intangible exchanges across networks. Compare-and-contrast with RenDanHeYi VAM: Allee's framework maps existing value flows for analysis; RenDanHeYi VAM specifies future value flows for contracts. Both belong. I can draft this integration piece, but it's substantial enough to be its own subsection or callout.

- **EIP Stage Sketch tool**: I don't have this documented in memory. If you can share how it works or point me at documentation, I'll integrate it into ecosystem sketching and retrospective story-boarding. Otherwise it becomes a flagged reference.

- **Value chain vs Value Stream Mapping clarification**: What I meant by "value chain specification" is the RenDanHeYi value chain (the sequence of contributions from primary-ME through EMC members to residents-received value, with VAM allocations at each link). Not Value Stream Mapping (VSM) from lean/Toyota. The naming clash is real. I'll clarify.

- **Speech acts / Customer role**: Your question about who the promise is made to and who declares satisfaction/dissatisfaction is important and I've been ambiguous. In a Solution ME's work on a scenario, the primary-ME makes promises to... the residents? The Platform? The EMC members? All three at different points? Each has different implications. This wants working out clearly. My working answer: the primary Customer role is the resident (whose life the scenario touches), with declarations of satisfaction/dissatisfaction registered through the balanced scorecard and e-VSM survey. The Platform is a secondary Customer (their compensation depends on resident-recognized value). EMC members are Performers to the primary-ME's Customer role internally. But this deserves more careful treatment.

**Two work sessions surfaced:**

- **Claude Code session #1**: SODOTO portfolios extension (already flagged from Section 6)
- **Claude Code session #2**: CfA-dSC enhancement for the proposed uses (chartering, VAM specification, speech-act instrumentation, gated funding)

Do you want these bundled or separate? My inclination: separate. They're distinct pieces of substrate work with different design tensions.

**Proposal for sequence:**

1. **Create book-planning artifact** in memory now.
2. **Rewrite Section 8** with the corrections I have substrate for (institutions reframe, institutional-commitment track, principle restate, Platform persistence unpacked, "seldom works" softening, GGCS gloss, "field guide" replacement, polycentric terminology alternatives with maybe an RCN Graph diagram of the refugee-scenario nested systems, speech-acts Customer role clarification).
3. **Flag as pending in Section 8** the substantive additions I need substrate for (Ackoff Bell Labs, Verna Allee integration, EIP Stage Sketch reference).
4. **Move to Section 9** whenever you're ready.
5. **Substantive additions to Section 8** get their own passes when I have your substrate — Ackoff transcript, Allee treatment, EIP tool reference.

Want me to proceed with the rewrite as described? Or would you rather I gather the substrate first before rewriting?

_[tool call: memory_append]_

_[tool result]_

Log updated. Awaiting your call on: rewrite Section 8 now with what I have vs. gather substrate first; whether the book-planning artifact should be created now; and confirmation on the two Claude Code sessions being separate.

---

**Marc** (2026-09-10 19:34):

On Options: "multiple simultaneous viable systems," "overlapping systems," "network of nested systems." Or I produce an RCN Graph diagram showing the specific case. Or both." Both and I like "network of nested systems". AND Re: Verna Allee's value networks be aware that Claude Code has parsed Allee's work and create
Here's everything in the repo touching Verna Allee / Value Network Analysis.

The two documents to hand Claude Chat

- docs/value-network-notation.md (116 lines) — the decision record from 2026-08-31: where VNA came from (via Snowden's network work), the notation table, the two enforced rules and why, roles-not-people, acceptance-completes-a-transaction, the five readings you take off a drawing, the triple/reification note, and what was deliberately not built (no VNA mode, no centrality metrics). Ends with Allee's sources.
- tools/schemas/graph-tool-v22.md, lines 617–660 — the contract chat-Claude is meant to read. Two sections: "Value networks — VNA rules (2026-08-31)" and "props.evidence — available to every mode (2026-09-01)". This carries the rules with their reasons so a rule survives being questioned, which is exactly the file for this purpose.

Tools

- tools/validate-rcn-graph.js — enforces both rules. Opt-in via graphAttrs.method: "vna" or --vna; --fix writes evidence: "asserted" (under-claims on purpose). Also warns on partial evidence adoption in any mode.
- tools/band-state.js — standing state of Ostrom's three bands plus repo-wide evidence adoption; filters on method === 'vna'.
- substrate/load_vna.py (189 lines) — the drawings into Neo4j database vna in Option-C vocabulary; prints every schemaLabel merge.
- substrate/project_iad.py — the IAD lens, read-only projection over vna, holds no state.
- No VNA mode in graph-tool-v22.html — deliberate. The notation is a legend preset over existing machinery.

Drawings

┌────────────────────────────────────────────┬────────────────────┬─────────────────────────────────────────────────────────────┐
│                    File                    │        Size        │                        What it shows                        │
├────────────────────────────────────────────┼────────────────────┼─────────────────────────────────────────────────────────────┤
│ tools/vna-whatcom-coop.rcn.json            │ 9 nodes / 15 edges │ Two circuits failing to close; CHW reciprocity asymmetry    │
├────────────────────────────────────────────┼────────────────────┼─────────────────────────────────────────────────────────────┤
│ tools/vna-sodoto-acceptance.rcn.json       │ 9 / 7              │ Four sessions, one completed transaction                    │
├────────────────────────────────────────────┼────────────────────┼─────────────────────────────────────────────────────────────┤
│ tools/sodoto-teach-chain-readings.rcn.json │ 12 / 6             │ Dead ends, bottleneck, reciprocity, hop depth off one shape │
├────────────────────────────────────────────┼────────────────────┼─────────────────────────────────────────────────────────────┤
│ tools/hybrid-coop-money-and-value.rcn.json │ 17 / 27            │ Where value goes vs. where money goes                       │
├────────────────────────────────────────────┼────────────────────┼─────────────────────────────────────────────────────────────┤
│ tools/iad-nas-rcn.rcn.json                 │ 12 / 8             │ method: "nas" — adjacency, not deliverables                 │
├────────────────────────────────────────────┼────────────────────┼─────────────────────────────────────────────────────────────┤
│ tools/iad-constitutional-arena.rcn.json    │ 18 / 12                                                │
└────────────────────────────────────────────┴────────────────────┴─────────────────────────────────────────────────────────────┘

Supporting context

substrate/iad-crosswalk.md (Allee's role = Snowden's identity = Ostrom's position; a value network populates 2 of Ostrom's 7 components),
docs/three-bands.md, substrate/tool-inventory.md items 13 andatabase table.

One thing to know

~/Downloads/Whatcom-coop-as-a-value-network-*.json (two copie — 14 edges against the repo file's 15. The repo file is thesource of truth; the Downloads copies are stale.

For Claude Chat, the schema section is the piece designed for that job — sed -n '617,660p' tools/schemas/graph-tool-v22.md is about 40 lines and
self-contained. Want me to package that plus the notation docbrief? If so, tell me the format you want documents in thissession (FedWiki Format, HTML, docx, PDF, or pipeline .md).
d

_attachments: value-network-notation.md, _tape__of_ackoff's_bell_lab_lecture_v1 (480p) (1).md, graph-tool-v22.md, value-network-notation.md_

---

**Claude** (2026-09-10 19:34):

_[tool call: bash_tool]_

_[tool result]_

_[tool call: bash_tool]_

_[tool result]_

---

**Claude** (2026-09-10 19:34):



---

**Marc** (2026-09-10 19:35):

I will add the rest momentarily dont try to finish until them.

---

**Marc** (2026-09-10 20:14):

I have a message that this chat cannot be compacted further. Start a new chat. Tell me how to best transition to a new chat. I dont want to loose anything important.

---

**Marc** (2026-09-10 21:14):

I have a message that this chat cannot be compacted further. Start a new chat. Tell me how to best transition to a new chat. I dont want to loose anything important.ask it for a full state dump — current decisions, vocabulary settled, open questions, pending deliverables, next steps, and any working artifacts (schema fragments, draft passages, tool state). Save that as a .md pipeline file in `~/rcn` (or wherever the project lives). That becomes the seed for a new chat.

---

**Claude** (2026-09-10 21:15):

Good instinct on the state dump. Here's what to do, then the dump follows.

**Transition procedure:**

Save the state dump below as `~/rcn/pipeline/design-record-drafting-handoff-2026-09-10.md` (or your preferred pipeline path). In a new chat, paste this file into the first message with a note like: "Continuing the RCN Design Record drafting work. Here is the handoff state. My memory files also carry the working substrate. Read `/areas/design-record-drafting.md` first for the running log."

Future-me will read `/areas/design-record-drafting.md` and adjacent files at the start of the new chat automatically. The handoff file below is the human-readable summary that puts everything in one place.

---

# RCN Design Record Drafting — Handoff State

**Date:** September 10, 2026
**Purpose:** Seed for continuing the RCN Design Record book work in a new chat after this one exceeded its compaction limit.

## What we are doing

Writing a book (Marc's observation late in Section 8) that started as the RCN Design Record — the reasoning substrate behind a facilitator field guide for RCN neighborhood work. Target audience: newcomers-or-curious-outsiders (as well as Marc/Kerry/the four conveners). Written in reasoning voice. Delivery medium: FedWiki page JSON plus Neo4j for structured graph, drafted here as portable markdown first.

The design record has twelve sections. A separate field guide (originally "the kit") will be drafted against it once the record is stable.

## Section drafting status

- **Section 1 (Origin and Purpose)** — drafted, edited by Marc, rewrite pending with all ripples
- **Section 2 (Four Dependency-Elimination Principles)** — drafted, edited by Marc, rewrite pending
- **Section 3 (VSM at Neighborhood Scale)** — drafted, edited by Marc, rewrite pending; e-VSM integration substrate held but placement deferred (option: dedicated subsection when substrate matures)
- **Section 4 (The Founded Commons)** — drafted, edited by Marc, rewritten with all edits absorbed; **needs correction**: Chris-at-Leo's-in-Superior, Jerry-at-The-Fledge-in-Lansing (my rewrite had it reversed)
- **Section 5 (Customer Scenario as Origin Object)** — full rewrite delivered with two-level distinction (compound-need + vision-blueprint), both origination patterns (ethnography-first, vision-first), expanded 14-element template, bid mechanic, Story Structure integration; awaiting reactions
- **Section 6 (Neighborhood-Catalyzing Industry Platform)** — full rewrite delivered with all terminology decisions applied, VAM explained at first reference, Zohar cited, non-financial measures subsection, Platform-vs-RCN distinction, gated funding with experimentation note, value chain flow diagram (in RCN Graph Tool JSON at `/mnt/user-data/outputs/rcn-value-chain-flow.json`); awaiting reactions
- **Section 7 (Moods and Speech Acts)** — full rewrite delivered with corrected six-moods framework (closing/opening × past/present/future), Beer-mood claim dropped in favor of VSM-invites-mood-reading, Wittgenstein/Austin/Searle/Flores lineage, five foundational speech acts, Dunham nine states in four phases, three conversation types (coffee/possibilities/action), shared background of understanding, Vester Impact Matrix vs CMG weighted selection matrix callout, "field guide" replacing "kit", RCN Workbench referenced forward to Section 8; awaiting reactions
- **Section 8 (Between-Institution Project Shape)** — drafted, extensively edited by Marc with many substantive parenthetical questions and additions requested (institutions correction, dual-track participation, polycentric terminology alternatives, Verna Allee integration, EIP Stage Sketch reference, Ackoff Bell Labs case study, "seldom works" softening, "field guide" replacement); rewrite pending
- **Sections 9-12** — drafted, awaiting Marc's edits

## Vocabulary and terminology decisions (settled, apply throughout)

- **"convener"** not "convenor"
- **"RenDanHeYi"** not "Rendanheyi"
- **"Neighborhood-Catalyzing Industry Platform"** spelled out (no NCIP acronym)
- **"Solution ME"** or **"Solution EMC"**, disambiguated from bare "ME"
- **"EMC organizer"** not "EMC-owner"
- **"become self-organizing and self-funding"** not "set themselves free"
- **"graduations and growing self-sufficiency (self-organizing)"** replaces "release" language
- **"actionist"** (Chris Casillas's term) — distinct from "activist"; emphasis on action-taking
- **"external (episodic) facilitators"** — Section 2 Principle One precision
- **"models of variety"** rather than "variety" per Conant-Ashby
- **"RCN foundational tools"** (general) or **"the RCN data schema"** (data-specific) — never "substrate" as a summary term
- **"grouping of neighborhoods"** or **"the neighborhoods a Platform serves"** or name specifically — never "cluster"
- **"nearby"**, **"neighboring"** — not "adjacent"
- **"measures"** not "instruments"
- **"the RCN Design Record"** (capitalized name) or **"This document"** — not generic "design record"
- **"distributed"** or **"locally-autonomous"** or **"each Platform operates independently"** — reserve **"polycentric"** for genuine overlapping-constituencies case
- **"network of nested systems"** — Marc's preferred alternative to "polycentric structure"
- **"field guide"** replaces **"kit"** throughout
- **"shape"** — replace context-by-context (form, pattern, configuration, character, arena)
- **"requisite variety"** — explain once (Ashby: regulator must match regulated system's variety) then use plainer language
- **Drop "menu of adjacencies"** — describe specific offerings directly
- **Never use "legible" figuratively** — use "understandable" or similar (Marc's standing preference)
- **No ALL CAPS working notes in final** — strip working annotations
- **No negation-correction frame** ("This isn't X, it's Y") — state directly

## Key concepts and named entities

- **RCN** — ReLocalize Creativity Network; broader network within which multiple Industry Platforms operate; shared pattern language, foundational tools, peer network, emerging elder-mentorship network
- **Neighborhood-Catalyzing Industry Platform** — locally-autonomous operating entity (e.g., WWHA in Whatcom, Leo's in Superior, The Fledge in Lansing); Haier Industry Platform analog at neighborhood scale
- **RCN Workbench** — proper name for the integrated tool suite (Neo4j graph database with multiple UIs: convener facilitation, ME chartering, scenario browser, portfolio viewer, Platform dashboard); Haier Workbench analog; to develop in Section 8 rewrite
- **Highlander 3.0** — named RCN initiative: cohorts of neighborhood actionists moving through networks with vibrant founded commons (Superior, Lansing, Whatcom, etc.); networked Myles Horton Highlander Folk School analog; Section 4 and Section 11 references
- **Founded commons** — space created by community members inside the community for collaborative work; recognized by neighborhood as its own; safe, culturally appropriate; not captured by external actors (Leo's, The Fledge exemplify; East County and SW Lansing still developing)
- **Customer scenario** — two levels: compound-need (Experience-ME's ethnographic articulation) and vision-blueprint (primary-ME's proposal with value creation process and EMC network)
- **Experience-ME / Solution-ME / Primary-ME** — MEs by role in scenario work
- **Story Structure** — Marc's 26-node model to use throughout as connective vocabulary; cross-culturally understood; cross-maps to Ostrom Institute's IAD framework
- **Value Added Mechanism (VAM)** — Haier's practice of specifying, before production starts, how compensation will be shared across all parties in the ecosystem community; lower and upper limits negotiated per party; settled after value delivered and recognized
- **Three-currency mechanism plus reputation** — RCN transactions can use fiat, time, gifts (McKnight associational sense), plus reputation as fourth compensation stream via SODOTO portfolios
- **e-VSM** — Marc's extension of Beer's VSM: 11 spheres in three-layer Markov Blanket structure (Sensory/Interface, Internal Core, Alignment/Homeostatic); 33 paired homeostats; dual anatomical/vernacular naming; recursion via separate surveys per level linked in Neo4j
- **AIC** — Appreciation, Influence, Control from W.E. (Bill) Smith's *The Creative Power*; Bill Smith is Marc's friend and colleague; World Bank framework

## Four principles from Section 2 (name when referenced)

1. **Facilitator variety distributed, not replaced** — external (episodic) facilitators eliminated by distributing requisite variety across the RCN foundational tools
2. **Elder-driven Industry Platform actors, compensated through the value chain** — McKnight's counterfeit-community avoided via RenDanHeYi mechanics (everyone paid but paid downstream of value received)
3. **Catalytic seed capital** — money as launch fuel that departs, not operating subsidy
4. **Value created by residents for residents and their neighbors** — neighbors defined by value creators; recognized by residents; measured by their own measures

## Delivered artifacts

- **`/mnt/user-data/outputs/rcn-value-chain-flow.json`** — value chain flow diagram in RCN Graph Tool JSON format; five-node vertical flow (Customer scenario → Primary-ME/EMC/Platform → Value created → Recognition → VAM settlement) with dashed feedback edge back to scenario; needs rendering in cld_viewer or FedWiki

## Substantive substrate received but not yet integrated

- **e-VSM tool suite documentation** (evsm-intro, architecture, workflow, four manuals) — held for Section 3 subsection when placement decided
- **RCN Graph SVG of e-VSM** (rcn-graph-of-evsm.svg) — shows 11 core spheres, 10 environment entities, Operating Unit Hub recursion; environment interface is design horizon (survey doesn't yet handle explicit environment links)
- **Story Structure model** (26 nodes, 7 categories, 59 edges) — held as substrate; used lightly in Section 5; to use throughout as connective vocabulary
- **Dunham Conversation for Action diagram** — nine states across four phases (Initiation/Negotiation/Fulfillment/Satisfaction), Customer/Performer roles; integrated in Section 7
- **BGTE-3-Levels-Cohesiveness-Frame.json** — RCN Graph Tool schema example; used as template for value chain flow diagram
- **Ackoff Bell Labs 1991 lecture transcript** — 26KB markdown; complete lecture on idealized design at Bell Labs; nearly-complete scenario worked over 40 years by successive MEs/EMCs; to incorporate as major case study in Section 8 rewrite
- **graph-tool-v22.md** — 56KB RCN Graph Tool schema documentation; key section: lines 617-660 (Value networks — VNA rules and props.evidence)
- **value-network-notation.md** — Verna Allee VNA notation and decision record; VNA rules already enforced in `validate-rcn-graph.js`; loaded into Neo4j via `substrate/load_vna.py`; IAD projection via `substrate/project_iad.py`; six reference drawings in `tools/vna-*.rcn.json`; **VNA is already integrated into RCN Graph Tool** — Section 8 should reference this integration rather than describe VNA as an unincorporated tradition

## Pending Marc asks and open items

### Immediate for Section 8 rewrite
- Institutions correction: institutions aren't bad; some MEs will and should become durable institutions when work requires it; failure is holding onto underperforming institutions; Haier creates institutions constantly; RCN uses balanced-scorecard with Rasch-modeled social metrics for evaluation
- Dual-track ME participation: individuals participate as themselves AND institutions can separately commit ("loan" executives/managers to MEs, often without monetary compensation, betting on outcome value)
- "Reliably fails" → "seldom works"; drop Kania/Kramer collective impact reference (Marc not a fan of Stanford methods and backbone literature)
- "The ME's members are the ME's members" awkwardness — rewrite
- Platform persistence in value chain unpacked: MEs form and dissolve; Platform is persistent set of relationships (with MEs seeded, neighborhoods served, other Platforms, RCN foundational tools) across many ME cycles
- Polycentric terminology: use "network of nested systems" + RCN Graph diagram of refugee scenario nested systems (Marc wants both)
- Value chain vs Value Stream Mapping (VSM) clarification — mean RenDanHeYi value chain, not lean/Toyota VSM
- Speech-acts Customer role: primary Customer = resident (declares satisfaction via balanced scorecard + e-VSM); Platform = secondary Customer (compensation depends on resident-recognized value); EMC members = Performers to primary-ME's Customer role internally
- GGCS gloss on first mention (Guidance Group and Communication Space, Medford Confluence work stream, 60 stories under Epic GGCS-8)
- Principle Three by name at end: "Catalytic seed capital"
- **Ackoff Bell Labs case study** — I now have the transcript; integrate as case study of nearly-complete scenario worked over 40 years by successive MEs/EMCs
- **Verna Allee integration** — VNA already in RCN Graph Tool; compare/contrast with VAM; note that VNA maps existing value flows for analysis while VAM specifies future flows for contracts; both belong; reference the six existing VNA drawings in the repo
- **EIP Stage Sketch tool** — Marc's own; substrate needed
- e-VSM before/after surveys and EIP Stage Sketches as retrospective story-boarding elements

### Section 4 rewrite correction
- Chris-at-Leo's-in-Superior and Jerry-at-The-Fledge-in-Lansing (my rewrite had it reversed)

### Small edits pending for delivered sections
- Sections 1-6 need "kit" → "field guide" replacement pass
- Sections 2, 6 need "menu of adjacencies" replacement pass
- Section 4 needs Chris/Jerry founded-commons correction

### Broader design questions still open
- How to write scenarios well (playbook for Experience-ME scenario creation)
- Curriculum in SODOTO for ME formation sequence and tool skills
- Founded-commons succession — biology/sociology/anthropology, not engineering; RCN grappling
- Platform's own S4 function at cluster scale — noted but not developed
- WWHA charter's specific structural properties preservation

## Claude Code work sessions pending

- **Session #1: SODOTO portfolios extension** — read `/areas/sodoto-credentialing.md` and SODOTO code in ~/rcn; design what portfolio entries contain, how they attach to individuals/MEs/Platforms, how they get created/updated via issuer/handshake, how they surface in bidding, how they interact with Overall Schema
- **Session #2: CfA-dSC enhancement** — for chartering, VAM specification, speech-act instrumentation, gated funding
- Marc's preference: separate sessions with distinct design tensions
- Section 4 correction pass and "kit"→"field guide" pass could also happen in Claude Code as filesystem work

## Book planning acknowledgment

Late in Section 8, Marc observed "we are in fact writing a book." This reshapes what this is:
- Target audience beyond RCN participants
- Publication path to figure out
- Title to be named
- Structure that a cold reader can pick up
- Writing plan tracking what's written / to be written / open

Book-planning artifact proposed: companion document tracking (1) sections/chapters at current draft state, (2) still to write, (3) open questions with status. Not yet created; recommended as one of first acts in new chat.

## Routing preferences

- **Chat** for drafting, synthesis, discussion, cross-project connections, web research
- **Claude Code** for FedWiki instantiation, Neo4j schema work, filesystem operations, RCN foundational tools code, ~/rcn integration
- Marc requests explicit routing flags when switching becomes relevant

## Diagram tool preference

- **RCN Graph Tool JSON format** for all diagrams going forward
- Schema fields: version, mode, modelName, modelNote, canvasBg, graphAttrs, cldLoopNames, legendEntries, legendVisible, lopBands, vsmLanes, vsmTrueScale, legendCollapsed, customSymbols, nodes, edges, lines, metaEdges
- Node fields: id, label, x, y, w, h, shape, color, borderColor, borderWidth, borderDash, fontSize, fontColor, note, extraLabels, props
- Edge fields: id, src, tgt, color, width, dash, curved, polarity, delay, fontSize, traces, layer, note, cpxUser, cpyUser, props
- Not directly renderable in chat; portable to FedWiki, Neo4j, cld_viewer

## Format conventions

- Markdown as drafting substrate
- Present files via present_files when delivered
- Never default to .docx; ask before choosing document format
- FedWiki: markdown-type items only; bold speaker labels for transcripts; inline provenance tags [H]/[C]/[C→H]/[H→C]/[H↔C]

## Files in memory relevant to this work

- `/areas/design-record-drafting.md` — the running log (this handoff summarizes it plus additions)
- `/areas/evsm.md` — e-VSM tool suite, 11 spheres, 33 paired homeostats, environment gap
- `/areas/cfa-dsc.md` — Conversations for Action / Dyadic Smart Contracts
- `/areas/sodoto-credentialing.md` — SODOTO issuers, keys, handshake model
- `/areas/rcn-overall-schema.md` — Overall Schema v0.1
- `/areas/rcn-graph-tool.md` — Graph Tool v22, validator, canonical JSON rules
- `/areas/civic-activation-measure.md` — CAM, Rasch measurement
- `/areas/highlander-3.md` — Highlander 3.0 cohort program
- `/areas/chase-extraction-wwha.md` — WWHA cooperative health structure
- `/areas/whitcomb-voice-practice.md` — Robert Whitcomb voice work (unrelated to this arc)
- `/topics/intellectual-anchors.md` — Marc's intellectual anchors (Beer, Ostrom, Alexander, Vester, Meadows, Ashby, Friston, Follett, RenDanHeYi, Weed, Flores)
- `/profile.md` — Marc's profile
- `/preferences.md` — standing preferences

## First actions recommended for new chat

1. Confirm you can read `/areas/design-record-drafting.md` and this handoff file
2. Create book-planning artifact (proposed above; not yet created)
3. Correct Section 4 rewrite (Chris/Jerry founded-commons mapping)
4. Rewrite Section 8 with Marc's substantial edits absorbed (substrate now available: Ackoff transcript, VNA already integrated in Graph Tool)
5. Continue through Sections 9-12 as Marc sends edits

---

Save this as `.md` in your pipeline location. In the new chat, paste it into the first message along with a brief intro. Future-me will pick up from there.

---

**Marc** (2026-09-11 00:26):

Please finish.

---

**Claude** (2026-09-11 00:28):

Saving the handoff file to the outputs directory so you can grab it directly.

_[tool call: create_file]_

_[tool result]_

_[tool call: present_files]_

_[tool result]_

Handoff file saved and presented above. Also updating memory to record that this transition happened, so future-me picks it up cold.

_[tool call: memory_append]_

_[tool result]_

Done. Save the .md file above into your pipeline location and paste it into the first message of the new chat. Future-me will read `/areas/design-record-drafting.md` automatically and pick up the running substrate. This was substantive work — glad we got it captured cleanly before the limit.
