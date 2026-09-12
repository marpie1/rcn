# Section 11 — The Prior-Work Substrate

**State (as of 2026-09-11):** First draft delivered; awaiting Marc's edits. Needs the Chris/Jerry founded-commons correction propagated.

**Provenance:** recovered from the Claude Chat conversation "Organizing local projects into actionable plans" (uuid 2f737cc8-4f75-402d-86b1-8b5b63e99882) via the account data export of 2026-09-11; full transcript at `chat-export/organizing-local-projects.md`. Turn numbers index that transcript. Marc's edits come from the `.pages` files in `sources/`.

**Reading order:** the latest text is the rewrite if there is one, else Marc's edits, else the first draft. Earlier layers are kept so nothing is lost and so the reasoning can be followed.


## First draft — turn 99, 2026-08-31 13:46 UTC
_Claude's preface:_ Drafting Section 11.
### Section 11 — The Prior-Work Substrate

#### Why this section exists

Every prior section has referred to work that came before this design record. CMG's 2016 methodology, the five-phase Linkage Mapping playbook, the Medford and Spokane implementations, the thirty Spokane linkage maps, Marc's Ripple ReThink System Dynamics model, the 2014 Confluence architecture, the Whatcom Alliance for Health Advancement's original founding. And beyond Marc's own work: Beer's Viable System Model, Ackoff's Idealized Design, McKnight's *The Careless Society*, Ostrom's polycentric governance, Vester's biocybernetics, Meadows' leverage points, Flores's speech acts and moods, Zohar's *Zero Distance*, Minnaar-de Morree-van der Lecq's *The Startup Factory*, Rasch measurement from Wright and Linacre at Chicago.

This section situates the current design inside that arc, names what carries forward and what stays behind, and marks the substrate that gives the design its specific shape. A reader who wants to understand why this design record makes the choices it makes will find the reasoning here.

The section is organized in two parts. First, Marc's own prior work — the thirty-year arc from Whatcom Alliance for Health Advancement through Cambridge Management Group's Medford and Spokane implementations to the current RCN work. Second, the intellectual substrate from other authors and traditions that this design record draws on and extends. Both parts matter. The design is not a fresh invention; it is the current form of a long-standing set of commitments that have been tested against reality repeatedly and refined by what didn't work as much as by what did.

#### Marc's own arc

The current design rests on prior work that spans roughly three decades and produces recognizable through-lines despite substantial variation across sites and iterations.

**Whatcom Alliance for Health Advancement (WAHA), founding through 2000s.** Marc was among WAHA's founders. WAHA's early work developed a community-scale health improvement approach that emphasized inter-institutional coordination, patient engagement in design, and the specific insight that population health outcomes are driven far more by what happens outside clinical settings than inside them. WAHA's operating model included direct participation of residents in design processes and produced work that anticipated many of the moves later formalized in the CMG methodology. The current RCN work re-engages with WAHA's substrate at a moment when WAHA itself is being redesigned to hold a granting arm that will operate as an Industry Platform under this design's principles.

**Epic implementation and the whole-community medical record project.** Marc helped implement Epic systems approximately twenty years ago and led a whole-community medical record project in Whatcom County. That work developed operational understanding of what it takes to instrument coordination across institutions with different accountability structures, different technology bases, and different views of what the shared record is for. The lessons about how coordination succeeds and fails at the technology-substrate level inform the current CfA-dSC and Overall Schema work directly.

**Rasch measurement training at the University of Chicago.** Marc trained with Benjamin Wright and Mike Linacre in the Rasch measurement tradition. That tradition produces measurement instruments with specific psychometric properties — items calibrated to latent constructs along shared dimensions, invariant across contexts, with honest accounting for measurement error. Marc applied this in the Patient Activation Measure (PAM) field-testing through the Robert Wood Johnson Foundation's Pursuing Perfection program. The methodological substrate for the balanced-scorecard work in Section 10 comes from this training directly.

**Cambridge Management Group formation with Bob Harrington and Annie Merkle, mid-2010s.** CMG was formed to bring the accumulated Whatcom work and the accumulated methodological tools (Ackoff's Idealized Design, the ReThink Health System Dynamics Model, Linkage Mapping developed at CMG itself) to other communities. The 2016 CMG prospectus articulated the framework as Inclusion, Participation, Trust, with the three tools (Linkage Mapping, Idealized Design, System Dynamics Modeling) run iteratively inside that framework. The prospectus stated the goal as "ensuring local competence and autonomy." That goal did not hold in either Medford or Spokane after CMG's engagement ended, and the reasons why it did not are what this design record's four principles from Section 2 exist to address structurally.

**Jackson County, Oregon (Medford) implementation, 2016.** The Medford work was structured around an Accountable Community of Health (ACH) framework, with seven work streams (Community Sponsorship, Ideal CHW-Networker, Accelerated Solutions Environment, Guidance Group and Communication, End to End Service Line, Linkage Map and Idealized Design, Broad Community Financial Support) organized in Confluence spaces alongside a Jira project backlog. The GGCS backlog contains sixty scenarios and project stubs at the between-institution shape. The Medford implementation did not proceed to full execution because of institutional political conflict among the participating hospitals, but the architecture Marc laid out in anticipation of the work is preserved in the community4health.atlassian.net instance and informs the current design record's approach to scenario repositories, work-stream organization, and inter-institutional negotiation.

**Spokane implementation, mid-2010s.** The Spokane work produced the thirty linkage maps that document the between-institution project shape in canonical form. The maps' consistency across substantive variation (acute care pharmacy transport, school-refugee transition, integrated addiction care, community-based screening for prevention, dental care access, EMS-cabulance integration, and many others) is evidence that the shape is a stable pattern rather than an artifact of one project's design choices. The Spokane team matrix — sectors by priority areas by named individuals — is the operational form of cross-sector team composition that Section 8 draws on. Spokane also failed to sustain the practice after CMG's engagement ended, for the same structural reasons as Medford.

**The Ripple ReThink model, Whatcom County.** Marc originated the Whatcom-specific variant of the ReThink Health System Dynamics Model, which remains available as an S4-scanning tool at higher recursion levels than the neighborhood-scale kit operates. Marc's twenty years of use with the model informs the current design's judgment that SDM is a specialized tool for policy scenarios rather than a general S4 instrument, and Meadows' insight about parameters as the weakest leverage point (with worldview as the strongest) shapes where the current design chooses to invest attention.

**The current RCN work.** The current RCN work stream includes SODOTO credentialing, CfA-dSC dyadic smart contracts, the Overall Schema graph work, RCN Graph Tool, FedWiki federation, e-VSM Survey/Diagram/Dialogue, the RCN Map tool, and the recent Foothills Outlook and Whatcom Court FedWiki conversions. Several of these are still developing; some are operational. The current design record commits to their maturation providing the substrate that makes the four principles from Section 2 fully operational, with the recognition that the substrate is not fully mature in 2026 and interim mechanisms preserve the structural properties while the mature form is being built.

#### Through-lines across the arc

Certain commitments recur across all of Marc's prior work and are load-bearing in the current design. Naming them explicitly helps a reader see what continuity is being maintained.

**Residents are the primary actors, not the primary recipients.** From WAHA's early work forward, the design has treated residents' own agency as the starting point rather than as the endpoint. External contributions support what residents do; they do not substitute for it. The current design's value definition (Section 10) is this commitment made structural.

**Between-institution work is where the leverage lives.** From the whole-community medical record project through the Spokane linkage maps, Marc's work has consistently found that the highest-value opportunities live in the connective tissue among institutions rather than within any single institution's scope. Institutions handle their own S1-S3 competently; the failures accumulate in S4 (nobody's imagining what could be) and in coordination gaps. The current design's between-institution project shape (Section 8) is this commitment made operational.

**Measurement must be psychometrically real and neighborhood-authored.** From the PAM field-testing through the CAM work, Marc's methodological commitment has been to instruments that actually measure what they claim to measure and are constructed with the participation of those they measure. The current design's Rasch-substrate balanced scorecards (Section 10) extend this commitment to neighborhood-scale value measurement.

**Facilitator dependency is a design failure to be structurally eliminated.** From the CMG prospectus's stated goal of "ensuring local competence and autonomy" through the diagnosis of why that goal did not hold, Marc's work has treated facilitator dependency as a structural problem requiring structural solutions rather than a matter of good intentions or better training. The current design's four principles from Section 2 are the structural solutions the prior work pointed toward.

**Systems thinking through Beer, Ostrom, Vester, and Meadows is the operating framework.** From WAHA's early engagement with system-level thinking through the current work with VSM at neighborhood scale, Marc's practice has drawn on the systems tradition rather than treating each engagement as a discrete case. The current design's VSM frame (Section 3) is this tradition made explicit.

**Speech acts and moods matter operationally.** From CMG's Inclusion-Participation-Trust framework through the current work, Marc has treated ontological coaching's distinctions (Flores, Spinosa, Dunham) as operational rather than merely theoretical. The current design's Section 7 elevates this from implicit background to explicit working layer.

**FedWiki is the native delivery medium.** From the collaboration with Ward Cunningham forward, Marc's work has taken FedWiki's fork-and-modify pattern as the appropriate substrate for neighborhood-authored, cross-neighborhood-federated work. The current design commits to FedWiki as the delivery medium for both the design record and the kit itself.

#### What carries forward and what stays behind from prior implementations

The current design record explicitly continues some elements of Marc's prior work and explicitly diverges from others. The distinctions are worth naming.

**Continues:** The five-phase Linkage Mapping playbook structure, adapted from CMG's 2014 form to neighborhood scale with a compressed timeline. The weighted-selection matrix method for scenario prioritization. The between-institution project shape as documented in the Spokane linkage maps. The Inclusion-Participation-Trust framework as the operating stance. The speech acts and moods substrate. Rasch measurement as the methodological substrate for latent constructs. FedWiki as the delivery medium. The graph-based schema for representing scenarios, institutions, and coordination relationships.

**Diverges:** The ACH institutional container. Medford was structured around an ACH; the current design does not require or assume an ACH-equivalent institutional container, because the failure modes of ACHs (institutional politics among hospitals, capture by state Medicaid structures, misalignment of ACH incentives with resident-recognized value) informed the design's diagnosis of what needs structural fix.

**Diverges:** The seven-work-stream Confluence architecture. Medford's setup deployed seven parallel work streams simultaneously. The current design centers on the Linkage-Mapping-and-Idealized-Design work stream and lets the others emerge as neighborhood work exposes their need. Attempting to stand up all seven work streams at once was part of what made the prior architecture too heavy for anyone but CMG to operate.

**Diverges:** The role of System Dynamics Modeling. CMG's methodology treated SDM as one of three co-equal tools. The current design treats Ripple ReThink SDM as available for higher-recursion S4 questions but not part of the neighborhood-scale kit, per Meadows' insight about parameters being weak leverage compared to worldview.

**Diverges:** The facilitator team model. CMG operated as a paid external facilitation team engaged by community sponsors. The current design's Industry Platform is compensated as a downstream function of resident-recognized value rather than as a paid external service. This is the specific structural change that closes the dependency door prior implementations left open.

**Diverges:** The scale of engagement. Medford and Spokane operated at county scale, with ACH-shaped institutional containers as the primary interlocutors. The current design operates at neighborhood scale, with founded commons and small groups as the primary substrate. The change of scale is not incidental; it aligns the work with the level at which Ashby's Law's requisite variety is actually available.

**Diverges:** The role of grant-making. Prior implementations depended on external grant capital deployed on funder timelines with funder-authored evaluation frameworks. The current design's Industry Platform deploys catalytic seed capital with neighborhood-authored balanced scorecards, with the specific anti-capture properties from Section 10.

#### Intellectual substrate from other authors

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

#### What Section 11 commits the design to

The design record acknowledges its debts to prior work explicitly. Nothing in the current design is treated as a fresh invention; every substantive claim traces to prior work by Marc or by others, extended or adapted for the current situation.

Marc's own arc from WAHA through CMG to the current RCN work is treated as a continuous line of development rather than as a set of discrete engagements. The through-lines (residents as primary actors, between-institution work as leverage, real measurement, structural elimination of facilitator dependency, systems thinking as the framework, speech acts and moods as operational, FedWiki as delivery medium) are preserved. The divergences from prior implementations (from ACH containers, from seven-work-stream architecture, from SDM as co-equal tool, from paid-facilitator team, from county scale, from external grant-making) are named as the specific structural changes this design commits to.

The intellectual substrate from other authors is acknowledged as the specific set of traditions this design draws on and extends. Beer, Ackoff, Ostrom, Vester, Meadows, McKnight, Flores and the ontological-coaching tradition, Follett, Friston, Rasch, Zohar, Minnaar-de Morree-van der Lecq, Zhang Ruimin, Alexander, Cunningham, and the contemporary Rendanheyi reporting are named as the sources whose work shapes the current design's specific choices.

Section 12 addresses the questions still open in the design — the ones RCN is grappling with, the ones the substrate maturation will affect, the ones the first years of operation will teach — so a reader knows what is settled and what is not, and can engage the open questions as active work rather than assumed answers.

### Claude's notes on delivering the draft

That is Section 11, around 2500 words. Substantial because the arc of Marc's own work and the intellectual substrate together constitute the design's specific inheritance, and both had to be treated with enough detail that a reader could actually trace the through-lines and recognize what is being carried forward.

Three things worth your attention.

The through-lines section (seven commitments recurring across your work) is my synthesis from the design conversation and from what I know about your work through the memory files and prior sessions. If any of the seven mischaracterizes your commitments — or if you'd add others I've missed — say so.

The "carries forward and stays behind" subsection makes specific claims about what the current design diverges from in prior implementations. Some of the divergences (from ACH containers, from paid-facilitator teams) are strong claims about what did not work. If the framing is too sharp or too soft, tell me. My inclination is to keep it sharp because the divergences are what the four principles from Section 2 specifically address.

The intellectual-substrate bibliography names roughly fifteen authors and traditions. This is my selection based on what appeared in the design conversation and what I have in memory files as your intellectual anchors. If key influences are missing (Ilya Prigogine, Humberto Maturana, Francisco Varela, Erik Olin Wright, David Bohm, Christopher Alexander in more depth, or others), say so and I'll add them.

React, correct, or say go for Section 12.
