# Section 11 — The Foundational Prior Work

**State (as of 2026-09-11):** First draft delivered; edited by Marc (2026-09-11); REWRITE DELIVERED 2026-09-11 in Claude Code: the Whatcom institutions (WIDS, CHIC, Community Health Record, HInet, WAHA, St. Luke's → Whatcom Health Foundation), the hospital run on speech acts and Co-Thrive, the Bill Mahoney / Wright / Linacre line, Deming and TPS, the Rippel Foundation correction, ReLocalize Health and Seeing the Systems placed (needs a paragraph from Marc), the four principles named, Highlander 3.0 and the pattern-language work in the current RCN list, Allee / Hamel & Zanini / Pérez Ríos / Horton added to the foundations, Chris/Jerry not at issue here. Awaiting Marc's reactions.

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

## Marc's edits — `EDITED SECTION 11.pages` (file dated 2026-09-11)
_Extracted verbatim from the Pages file on disk. Marc edited the draft in place and added comments and questions as parenthetical paragraphs — a paragraph wrapped entirely in parentheses is Marc talking to Claude, not body text. Headings were restored by matching the draft; everything else is exactly as in the file._

### Section 11 — The Foundational Prior-Work

#### Why this section exists

Every prior section has referred to work that came before this design record. CMG's 2016 methodology, the five-phase Linkage Mapping playbook, the Medford and Spokane implementations, the thirty Spokane linkage maps, Marc's Ripple ReThink System Dynamics model, the 2014 Confluence architecture, the Whatcom Alliance for Health Advancement's original founding. And beyond Marc's own work: Beer's Viable System Model, Ackoff's Idealized Design, McKnight's The Careless Society, Ostrom's polycentric governance, Vester's biocybernetics, Meadows' leverage points, Flores's speech acts and moods, Zohar's Zero Distance, Minnaar-de Morree-van der Lecq's The Startup Factory, Rasch measurement from Wright and Linacre at Chicago.

This section situates the current design inside that arc, names what carries forward and what stays behind, and marks the substrate that gives the design its specific shape. A reader who wants to understand why this design record makes the choices it makes will find the reasoning here.

The section is organized in two parts. First, Marc's own prior work — the thirty-year arc from Whatcom Alliance for Health Advancement through Cambridge Management Group's Medford and Spokane implementations to the current RCN work. Second, the intellectual background from other authors and traditions that this design record draws on and extends. Both parts matter. The design is not a fresh invention; it is the current form of a long-standing set of commitments that have been tested against reality repeatedly and refined by what didn't work as much as by what did.

#### Marc's own arc

The current design rests on prior work that spans roughly three decades and produces recognizable through-lines despite substantial variation across sites and iterations.

Whatcom Alliance for Health Advancement (WAHA), founding through 2000s. Marc was among WAHA's founders. WAHA's early work developed a community-scale health improvement approach that emphasized inter-institutional coordination, patient engagement in design, and the specific insight that population health outcomes are driven far more by what happens outside clinical settings than inside them. WAHA's operating model included direct participation of residents in design processes and produced work that anticipated many of the moves later formalized in the CMG methodology. The current RCN work re-engages with WAHA's substrate at a moment when WAHA itself is being redesigned to hold a granting arm that will operate as an Industry Platform under this design's principles.

(We need to bring in WIDS (Whatcom Integrated Delivery System) and CHIC (Whatcom Community Health Improvement Consortium, The Community Health Record, and Whatcom Health Information Network-HiNet. WAHA was the least important or successful of the set of institutions created. That is a revealing story in itself. The take over of a local hospital by an outside hospital corporation resulted in St. Lukes Foundation being formed and that ultimately played a role in WAHA and still exists as Whatcom Health Foundation. Some of the insights thus gained has influenced the evolution to this approach. The five year in-depth training in Speech Acts, Moods, and Body (aikido) by Bob Dunham, Carolyn Turkovitch, and Rachael Lucy developed the background for quality management for the whole hospital for several years useing an updated version of Flores and Winograd’s Coordinator software, called  Co-Thrive  developed by Sherman Rowland. )

IDX LastWord implementation and the whole-community medical record project. Marc helped implement a whole community medical record systems approximately thirty years ago in Whatcom County. That work developed operational understanding of what it takes to instrument coordination across institutions with different accountability structures, different technology bases, and different views of what the shared record is for. The lessons inform the current CfA-dSC and Overall Schema work directly.

Rasch measurement training with Bill Mahoney and at the University of Chicago. Marc trained with Bill Mahoney, Benjamin Wright and Mike Linacre in the Rasch measurement tradition. That tradition produces measurement instruments with specific psychometric properties — items calibrated to latent constructs along shared dimensions, invariant across contexts, with honest accounting for measurement error. Bill Mahoney applied this in creating the Patient Activation Measure (PAM) field-testing through the Robert Wood Johnson Foundation's Pursuing Perfection program. The methodological substrate for the balanced-scorecard work in Section 10 comes from this training directly.

Cambridge Management Group work with Bob Harrington and Annie Merkle, mid-2010s. CMG-West was formed to bring the accumulated Whatcom work and the accumulated methodological tools (Ackoff's Idealized Design, the ReThink Health System Dynamics Model, Linkage Mapping developed at CMG itself) to other communities. The 2016 CMG prospectus articulated the framework as Inclusion, Participation, Trust, with the three tools (Linkage Mapping, Idealized Design, System Dynamics Modeling) run iteratively inside that framework. The prospectus stated the goal as "ensuring local competence and autonomy." That goal did not hold in either Medford or Spokane after CMG's engagement ended, and the reasons why it did not are what this design record's four principles from Section 2 exist to address structurally.

Jackson County, Oregon (Medford) implementation, 2016. The Medford work was structured around an Accountable Community of Health (ACH) framework, with seven work streams (Community Sponsorship, Ideal CHW-Networker, Accelerated Solutions Environment, Guidance Group and Communication, End to End Service Line, Linkage Map and Idealized Design, Broad Community Financial Support) the never realized future work was pre-organized in Confluence spaces alongside a Jira project backlog. The GGCS backlog contains sixty scenarios and project stubs at the between-institution shape. The Medford implementation did not proceed to full execution because of institutional political conflict among the participating hospitals, but the architecture Marc laid out in anticipation of the work is preserved in the community4health.atlassian.net instance and informs the current design record's approach to scenario repositories, work-stream organization, and inter-institutional negotiation.

Spokane implementation, mid-2010s. The Spokane work produced the thirty linkage maps that document the between-institution project shape in canonical form. The maps' consistency across substantive variation (acute care pharmacy transport, school-refugee transition, integrated addiction care, community-based screening for prevention, dental care access, EMS-cabulance integration, and many others) is evidence that the shape is a stable pattern rather than an artifact of one project's design choices. The Spokane team matrix — sectors by priority areas by named individuals — is the operational form of cross-sector team composition that Section 8 draws on. Spokane also failed to sustain the practice after CMG's engagement ended, for the same structural reasons as Medford.

The Ripple ReThink model, Whatcom County. Marc originated the original whole county system dynamic model of chronic disease in Whatcom County with Jack Homer and Gary Hirsch. That went to become the Fanney E. Ripple ReThink Health System Dynamics Model, and a early implementation was a Whatcom-specific variant. The Ripple ReThink Health model is available as an S4-scanning tool at higher recursion levels than the neighborhood-scale kit operates. Marc's twenty years of use with the model informs the current design's judgment that SDM is a specialized tool for policy scenarios rather than a general S4 instrument, and Meadows' insight about parameters as the weakest leverage point (with worldview as the strongest) shapes where the current design chooses to invest attention.

The current RCN work. The current RCN work stream includes SODOTO credentialing, CfA-dSC dyadic smart contracts, the Overall Schema graph work, RCN Graph Tool, FedWiki federation, e-VSM Survey/Diagram/Dialogue, the RCN Map tool, and the recent Foothills Outlook and Whatcom Court FedWiki conversions. Several of these are still developing; some are operational—all will be piloted or in use over the next 12 months. The current design record commits to their maturation providing the substrate that makes the four principles from Section 2 fully operational, with the recognition that the substrate is not fully mature in 2026 and interim mechanisms preserve the structural properties while the mature form is being built.

#### Through-lines across the arc

Certain commitments recur across all of Marc's prior work and are load-bearing in the current design. Naming them explicitly helps a reader see what continuity is being maintained.

Residents are the primary actors, not the primary recipients. From Pursuing Perfection's early work forward, the design has treated residents' own agency as the starting point rather than as the endpoint. We learned this from patients. External contributions support what residents do; they do not substitute for it. The current design's value definition (Section 10) is this commitment made structural.

Between-institution work is a high leverage area. From the whole-community medical record project through the Spokane linkage maps, Marc's work has consistently found that high-value opportunities live in the connective tissue among institutions rather than within any single institution's scope. Institutions handle their own S1-S3 competently; the failures accumulate in S4 (nobody's imagining what could be) and in coordination gaps. The between-institution focus is developed in Section 8.

Measurement must be psychometrically real and neighborhood-authored. From the PAM field-testing through the CAM work, Marc's methodological commitment has been to instruments that actually measure what they claim to measure and are constructed with the participation of those they measure. The current design's Rasch-based balanced scorecards (Section 10) extend this to neighborhood-scale value measurement.

Facilitator dependency is a design failure to be structurally eliminated. From the CMG prospectus's stated goal of "ensuring local competence and autonomy" through the diagnosis of why that goal did not hold, Marc's work has treated facilitator dependency as a structural problem requiring structural solutions rather than a matter of good intentions or better training. The current design's four principles from Section 2 are the structural solutions the prior work pointed toward. (Show what you mean by the four principles…)

Systems thinking through Beer, Ostrom, Vester, and Meadows is the operating framework. From Marc’s early engagement with system-level thinking through the current work with VSM at neighborhood scale, Marc's practice has drawn on the systems tradition rather than treating each engagement as a discrete case. The current design's VSM frame (Section 3) is this tradition made explicit.

(We need to bring ReLocalize Health into this story and Kerry Turner’s emphasis on “Seeing the Systems” it’s foundational program.)

Speech acts and moods matter operationally. From CMG's Inclusion-Participation-Trust framework through the current work, Marc has treated ontological coaching's distinctions (Flores, Spinosa, Dunham) as operational rather than merely theoretical. The current design's Section 7 elevates this from implicit background to explicit working layer. For several years, until being “promoted” out of operations, the whole hospital was managed explicitly with Speech Acts and Sherman Rowland’s CoThrive platform.

FedWiki is the native delivery medium. From the collaboration with Ward Cunningham forward, Marc's work has taken FedWiki's fork-and-modify pattern as the appropriate substrate for neighborhood-authored, cross-neighborhood-federated work. The current design commits to FedWiki as the delivery medium for both the design record and the kit itself.

#### What carries forward and what stays behind from prior implementations

The current design record explicitly continues some elements of Marc's prior work and explicitly diverges from others. The distinctions are worth naming.

Continues: The five-phase Linkage Mapping playbook structure, adapted from CMG's 2014 form to neighborhood scale with a compressed timeline. The weighted-selection matrix method for scenario prioritization. The between-institution project shape as documented in the Spokane linkage maps. The Inclusion-Participation-Trust framework as the operating stance. The speech acts and moods substrate. Rasch measurement as the methodological substrate for latent constructs. FedWiki as the delivery medium. The graph-based schema for representing scenarios, institutions, and coordination relationships.

Diverges: The ACH institutional container. Medford was structured around an ACH; the current design does not require or assume an ACH-equivalent institutional container, because the failure modes of ACHs (institutional politics among hospitals, capture by state Medicaid structures, misalignment of ACH incentives with resident-recognized value) informed the design's diagnosis of what needs structural fix.

Diverges: The seven-work-stream Confluence architecture. Medford's setup deployed seven parallel work streams simultaneously. The current design centers on the Linkage-Mapping-and-Idealized-Design work stream and lets the others emerge as neighborhood work exposes their need. Attempting to stand up all seven work streams at once was part of what made the prior architecture too heavy for anyone but CMG to operate.

Diverges: The role of System Dynamics Modeling. CMG's methodology treated SDM as one of three co-equal tools. The current design treats Ripple ReThink SDM as available for higher-recursion S4 questions but not part of the neighborhood-scale kit, per Meadows' insight about parameters being weak leverage compared to worldview.

Diverges: The facilitator team model. CMG operated as a paid external facilitation team engaged by community sponsors. The current design's Industry Platform is compensated as a downstream function of resident-recognized value rather than as a paid external service. This is the specific structural change that closes the dependency door prior implementations left open. Of the neighborhood has no resident facilitators there is no investment.

Diverges: The scale of engagement. Medford and Spokane operated at county scale, with ACH-shaped institutional containers as the primary interlocutors. The current design operates at neighborhood scale, with founded commons and small groups as the primary substrate(another word please). The change of scale is not incidental; it aligns the work with the level at which Ashby's Law's requisite variety is actually available.

Diverges: The role of grant-making. Prior implementations depended on external grant capital deployed on funder timelines with funder-authored evaluation frameworks. The current design's Industry Platform deploys catalytic seed capital with neighborhood-authored balanced scorecards, with the specific anti-capture properties from Section 10.

#### Intellectual substrate from other authors

The design draws substantively on the work of others, in ways worth acknowledging explicitly. This is not an exhaustive bibliography; it is a naming of what shapes the design's specific choices.

Stafford Beer, Brain of the Firm (1972), The Heart of Enterprise (1979) and all the rest. The Viable System Model as the operating framework for viable-system diagnosis at any scale. Beer's insistence on recursion — every S1 is itself a viable system with its own five functions — is the specific claim the design's polycentric structure rests on. Section 3 draws on Beer directly. Beer's own treatment of System 4 as the most-often-neglected function shapes the design's identification of S4 activation as the specific intervention the kit provides.

Russell Ackoff, Redesigning the Future (1974) and related work on Interactive Planning. Idealized Design as the method for imagining what would be wanted if the constraints of history did not bind. Ackoff's two constraints — currently feasible technology and operationally possible — are the specific bounds that keep Idealized Design from becoming a wish list and let the design be revised as feasibility changes. Section 3's S4 activation logic and the kit's Phase 2 method both draw on Ackoff directly.

Elinor Ostrom, Governing the Commons (1990) and the broader polycentric governance literature. Ostrom's work on how communities self-govern common-pool resources without state or market solutions, and her polycentric governance framework showing how multiple centers of decision-making at multiple scales can produce workable coordination without any single center's dominance. The design's insistence on non-centralized RCN structure across Platforms (Section 6), the polycentric recursion (Section 3), and the neighborhood's authority over its own value definition (Section 10) all draw on Ostrom.

Frederic Vester, The Art of Interconnected Thinking (2007 English translation of the 1999 German original). Vester's biocybernetics as the specific frame for understanding systems as living rather than mechanical. The design's biological logic for founded-commons succession (Section 4) and elder-succession patterns (Section 9) draws on Vester directly. Vester's emphasis on network sensitivity analysis informs the current tool integration in RCN's substrate.

Donella Meadows, "Leverage Points: Places to Intervene in a System" (1999). Meadows' twelve leverage points, with the specific insight that parameters are the weakest leverage and paradigms (worldviews) are the strongest. The design's choice to invest in worldview-level change through the WHY-first facilitation sequence (Section 7) rather than in parameter-level change through metric adjustment draws on Meadows directly. Meadows' insight also shapes the design's judgment about System Dynamics Modeling's limits at neighborhood scale.

John McKnight, The Careless Society: Community and Its Counterfeits (1995). McKnight's distinction between associational gift and professional service, and his diagnosis of how the philanthropic-industrial pattern produces counterfeits of community. The design's second principle from Section 2 (compensation structurally tied to residents-received value rather than to job description) is McKnight made structural through Rendanheyi mechanics rather than through the ascetic-volunteer framing McKnight is sometimes read as advocating.

Fernando Flores and Charles Spinosa, Disclosing New Worlds (1997), Bob Dunham's Institute for Generative Leadership materials, and the broader ontological-coaching tradition. Speech acts (assertions, declarations, requests, offers, promises) and moods as the working layer of coordination. Section 7 develops this substrate at length. The design's coordination grammar comes from this tradition directly, extended to neighborhood scale.

Mary Parker Follett, The New State (1918) and related work. Follett's group ontology and her treatment of coordination as active integration rather than compromise. The design's understanding of what happens in the neighborhood's convening moments — genuine integration of differences rather than negotiated compromise — draws on Follett.

Karl Friston's Free Energy Principle and the Markov Blanket framework. The e-VSM survey's Markov Blanket layer mapping (11 spheres, 66 directed edges) draws on Friston's Free Energy Principle for its specific representation of what constitutes the boundary between a system and its environment. The design's treatment of neighborhoods as viable systems with their own boundaries and their own internal dynamics is compatible with Friston's framework.

Rasch measurement, from Georg Rasch (1960) through Benjamin Wright and Mike Linacre at Chicago. The methodological substrate for latent-construct measurement across contexts. Section 10's balanced-scorecard commitment and the CAM work in RCN's substrate both draw on this tradition.

Danah Zohar, Zero Distance (2022). The description of Haier's Rendanheyi model, including the specific mechanisms of Ecosystem Micro-Communities, the Experience-EMC/Solution-EMC split, the customer scenario as durable object, the Industry Platform pattern, the Community Store neighborhood-scale interface, and the city-not-company sustainability framework. Sections 5, 6, and 8 draw on Zohar directly.

Joost Minnaar, Pim de Morree, and Bram van der Lecq, The Startup Factory (2022). The specific mechanics of EMC formation, Leading Targets, Value Added Mechanism, and inter-ME contracting. The current design record's treatment of these draws on Minnaar-de Morree-van der Lecq via public excerpts and Andreas Holmer's summaries, with awareness that the book contains additional operational detail the current design would benefit from incorporating as the RCN substrate matures.

Zhang Ruimin's own writing and interviews about Haier's transformation. The primary source for Rendanheyi as it operates at Haier scale. Zhang's insistence that value to the employee must be aligned with value to the user, and his framing of the company as an ecosystem-generating tropical rainforest rather than a mature-and-dying organization, shape the design's understanding of what sustainability at scale requires.

Christopher Alexander, A Pattern Language (1977) and The Nature of Order (2003-2004). Alexander's pattern language work and his later treatment of what makes environments alive versus dead. Marc's active pattern-language work with the Bellingham downtown merchants (documented in /areas/bellingham-pattern-work.md) draws on Alexander directly. The design's treatment of founded commons as living environments follows Alexander's sensibility about what makes a place alive.

Ward Cunningham, FedWiki. The federated wiki pattern as the delivery medium for authored-and-federated content. The design's commitment to FedWiki as the delivery medium is not incidental; the fork-and-modify pattern is what allows cross-neighborhood learning without centralized curation.

Anne Marie Chiasson and the Haier Model Institute, William Malek's Beyond Buzzwords podcast series. Contemporary reporting on how Rendanheyi operates in practice, including the specific detail about scenarios returning to the platform enriched by failed attempts (Malek's phrase "you can go grab the scenario"). The current design draws on this reporting for the mechanisms that Zohar and Startup Factory describe at conceptual level.

#### What Section 11 commits the design to

The design record acknowledges its debts to prior work explicitly. Nothing in the current design is treated as a fresh invention; every substantive claim traces to prior work by Marc or by others, extended or adapted for the current situation.

Marc's own arc from Whatcom Community Healht Improvement Consortium (CHIC) through CMG to the current RCN work is treated as a continuous line of development rather than as a set of discrete engagements. The through-lines (residents as primary actors, between-institution work as leverage, real measurement, structural elimination of facilitator dependency, systems thinking as the framework, speech acts and moods as operational, FedWiki as delivery medium) are preserved. The divergences from prior implementations (from ACH containers, from seven-work-stream architecture, from SDM as co-equal tool, from paid-facilitator team, from county scale, from external grant-making) are named as the specific structural changes this design commits to.

The intellectual substrate from other authors is acknowledged as the specific set of traditions this design draws on and extends. Beer, Ackoff, Ostrom, Vester, Meadows, McKnight, Flores and the ontological-coaching tradition, Follett, Friston, Rasch, Zohar, Minnaar-de Morree-van der Lecq, Zhang Ruimin, Alexander, Cunningham, and the contemporary Rendanheyi reporting are named as the sources whose work shapes the current design's specific choices.

Section 12 addresses the questions still open in the design — the ones RCN is grappling with, the ones the substrate maturation will affect, the ones the first years of operation will teach — so a reader knows what is settled and what is not, and can engage the open questions as active work rather than assumed answers.

That is Section 11, around 2500 words. Substantial because the arc of Marc's own work and the intellectual substrate together constitute the design's specific inheritance, and both had to be treated with enough detail that a reader could actually trace the through-lines and recognize what is being carried forward.

Three things worth your attention.

The through-lines section (seven commitments recurring across your work) is my synthesis from the design conversation and from what I know about your work through the memory files and prior sessions. If any of the seven mischaracterizes your commitments — or if you'd add others I've missed — say so.

The "carries forward and stays behind" subsection makes specific claims about what the current design diverges from in prior implementations. Some of the divergences (from ACH containers, from paid-facilitator teams) are strong claims about what did not work. If the framing is too sharp or too soft, tell me. My inclination is to keep it sharp because the divergences are what the four principles from Section 2 specifically address.

The intellectual-substrate bibliography names roughly fifteen authors and traditions. This is my selection based on what appeared in the design conversation and what I have in memory files as your intellectual anchors. If key influences are missing (Ilya Prigogine, Humberto Maturana, Francisco Varela, Erik Olin Wright, David Bohm, Christopher Alexander in more depth, or others), say so and I'll add them.

(Your selection is quite well focused.)

React, correct, or say go for Section 12.


## Rewrite — 2026-09-11, Claude Code session

_Written against Marc's verbatim edits above, Chat's memory files (people/, areas/), the CAM chat in the export, and the other rewrites for consistency._

### Section 11 — The Foundational Prior Work

#### Why this section exists

Every prior section has referred to work that came before this design record: the Whatcom County institutions of the 1990s, CMG's 2016 methodology, the five-phase Linkage Mapping playbook, the Medford and Spokane implementations, the thirty Spokane linkage maps, Marc's Ripple ReThink System Dynamics model, the 2014 Confluence architecture. And beyond Marc's own work: Beer's Viable System Model, Ackoff's Idealized Design, McKnight's *The Careless Society*, Ostrom's polycentric governance, Vester's biocybernetics, Meadows' leverage points, Flores's speech acts and moods, Zohar's *Zero Distance*, Minnaar, de Morree and van der Lecq's *The Startup Factory*, Rasch measurement from Wright and Linacre at Chicago.

This section situates the current design inside that arc, names what carries forward and what stays behind, and marks the foundation that gives the design its specific form. A reader who wants to understand why this design record makes the choices it makes will find the reasoning here.

The section is organized in two parts. First, Marc's own prior work: the thirty-year arc from the Whatcom County institutions through Cambridge Management Group's Medford and Spokane implementations to the current RCN work. Second, the intellectual background from other authors and traditions that this design record draws on and extends. Both parts matter. The design is the current form of a long-standing set of commitments that have been tested against reality repeatedly and refined by what did not work as much as by what did.

#### Marc's own arc

The current design rests on prior work that spans roughly three decades and produces recognizable through-lines despite substantial variation across sites and iterations.

**The Whatcom County institutions, 1990s onward.** Whatcom County built a set of community institutions for health improvement in those years, and Marc was among the founders of WAHA and worked in and around the rest: the Whatcom Integrated Delivery System (WIDS), the Whatcom Community Health Improvement Consortium (CHIC), the Community Health Record, the Whatcom Health Information Network (HInet), and the Whatcom Alliance for Health Advancement (WAHA). The takeover of the local hospital by an outside hospital corporation produced the St. Luke's Foundation, which played a role in WAHA and continues today as the Whatcom Health Foundation. Of the set, WAHA was the least important and the least successful, and that is a revealing story in itself: the institution designed most explicitly as an alliance did the least, while the ones built around a concrete shared object, a record, a network, a consortium with work to do, did the most. Insights from that decade have shaped the evolution toward the approach this record describes. WAHA's early work did develop a community-scale health improvement approach that emphasized inter-institutional coordination, patient engagement in design, and the insight that population health outcomes are driven far more by what happens outside clinical settings than inside them. The current RCN work re-engages with that ground at a moment when WWHA, the Whatcom Wealth and Health cooperative, is being designed to hold a granting arm that will operate as a Neighborhood-Catalyzing Industry Platform under this design's principles.

**The whole-community medical record, 1993–1995 and the decade after.** Marc led the implementation of a whole-community medical record in Whatcom County, the first of very few such systems anywhere, through its implementation, cleanup, and optimization over ten years. That work developed operational understanding of what it takes to instrument coordination across institutions with different accountability structures, different technology bases, and different views of what the shared record is for. It is the Shared Care Plan's grandfather, and its lessons inform the current CfA-dSC and Overall Schema work directly. It also produced Marc's first psychometric instrument: a 52-item questionnaire evaluating the record, which Bill Mahoney's Rasch analysis turned into measures.

**Speech acts, moods, and body at the hospital.** Over five years, Marc and colleagues trained in depth in speech acts, moods, and body, through aikido, with Bob Dunham, Carolyn Turkovitch, and Rachael Lucy. That training became the background for quality management of the whole hospital for several years, run explicitly on speech acts using Co-Thrive, Sherman Rowland's updated version of Flores and Winograd's Coordinator software, until Marc was promoted out of operations. Section 7's claim that moods and speech acts are operational rather than theoretical rests on this: a hospital was managed that way, and it worked.

**Rasch measurement with Bill Mahoney and at the University of Chicago.** Marc trained with Bill Mahoney, Benjamin Wright, and Mike Linacre in the Rasch measurement tradition, going to Chicago with two of his Pursuing Perfection data analysts to learn directly from Wright. That tradition produces measures with specific properties: items calibrated to latent constructs along shared dimensions, invariant across contexts, with honest accounting for measurement error. Bill Mahoney applied it in creating the Patient Activation Measure, field-tested through the Robert Wood Johnson Foundation's Pursuing Perfection program, and Marc has studied at his feet for thirty years. The method underneath Section 10's balanced scorecards comes from this training directly.

**Deming and the Toyota Production System.** Marc was well versed in both, and knows how to improve the processes inside an institution. That knowledge is what made the between-institution gap visible: patients were harmed in the space between institutions that each ran acceptably inside. Deming's three levels, Driver, Support, and Mainstay, are the frame Marc's Spokane linkage maps were organized on, and Section 3 lines them up with Beer's five systems.

**The Ripple ReThink Model, Whatcom County.** Marc originated the first whole-county System Dynamics model of chronic disease in Whatcom County with Jack Homer and Gary Hirsch. That model went on to become the ReThink Health System Dynamics Model of the Fannie E. Rippel Foundation, and an early implementation was a Whatcom-specific variant. The model remains available as an S4-scanning tool at higher recursion levels than the neighborhood-scale field guide operates at. Marc's twenty years of use with it inform the current design's judgment that System Dynamics modeling is a specialized tool for policy scenarios rather than a general S4 tool, and Meadows' insight about parameters as the weakest leverage point, with worldview as the strongest, shapes where the current design chooses to invest attention.

**Cambridge Management Group, with Bob Harrington and Annie Merkle, mid-2010s.** CMG-West was formed to bring the accumulated Whatcom work and methodological tools, Ackoff's Idealized Design, the ReThink Health model, and Linkage Mapping developed at CMG itself, to other communities. The 2016 CMG prospectus articulated the framework as Inclusion, Participation, Trust, with the three tools run iteratively inside it, and stated the goal as "ensuring local competence and autonomy." That goal did not hold in either Medford or Spokane after CMG's engagement ended, and the reasons it did not are what the four principles of Section 2 exist to address structurally: facilitator variety distributed rather than replaced; Industry Platform actors compensated through the value chain; catalytic seed capital; and value created by residents for residents and their neighbors.

**Jackson County, Oregon (Medford), 2016.** The Medford work was structured around an Accountable Community of Health, with seven work streams, Community Sponsorship, Ideal CHW-Networker, Accelerated Solutions Environment, Guidance Group and Communication Space, End to End Service Line, Linkage Map and Idealized Design, and Broad Community Financial Support, pre-organized in Confluence spaces alongside a Jira backlog for work that was never realized. The GGCS backlog contains sixty scenarios and project stubs in the between-institution form. Phase 4 of the Medford playbook trained project staff in Value Stream Mapping and A3 Problem Solving, Lean Healthcare West's refinements of the Toyota methods for healthcare, then in use at La Clínica, for the chartered projects' work inside the participating institutions; both are now RCN tools. The Medford implementation did not proceed to full execution because of institutional political conflict among the participating hospitals, but the architecture Marc laid out in anticipation of the work is preserved in the community4health.atlassian.net instance and informs the current design record's approach to scenario repositories, work-stream organization, and inter-institutional negotiation.

**Spokane, mid-2010s.** The Spokane work produced the thirty linkage maps that document the between-institution project in canonical form. Their consistency across wide variation in subject, acute care pharmacy transport, school-refugee transition, integrated addiction care, community-based screening for prevention, dental care access, EMS-cabulance integration, and many others, is evidence that the form is a stable pattern rather than an artifact of one project's design choices. The Spokane team matrix, sectors by priority areas by named individuals, is the operational form of cross-sector team composition that Section 8 draws on. Spokane also failed to sustain the practice after CMG's engagement ended, for the same structural reasons as Medford.

**ReLocalize Health and RCN.** Marc and Kerry Turner co-founded the ReLocalize Creativity Network around a vision of one million neighborhoods. ReLocalize Health belongs in this story, and so does Kerry Turner's emphasis on "Seeing the Systems," its foundational program: the systems thinking that Section 3 makes explicit is, in Kerry's program, the first thing a resident is offered. A paragraph on what ReLocalize Health is and what Seeing the Systems does, in Marc's or Kerry's words, is the one thing this section still needs.

**The current RCN work.** The current RCN work includes SODOTO credentialing, CfA-dSC dyadic smart contracts, the Overall Schema graph work, the RCN Graph Tool with its Value Network notation and EIP Stage, FedWiki federation, e-VSM Survey, Diagram and Dialogue, the RCN Map and Timeline tools, the Civic Activation Measure item pool, the Highlander 3.0 cohort initiative, the pattern-language work with the Bellingham downtown merchants, and the recent Foothills Outlook and Whatcom Court FedWiki conversions. Several of these are still developing; some are operational; all will be piloted or in use over the next twelve months. The current design record commits to their maturation as what makes the four principles fully operational, with the recognition that the foundational tools are not fully mature in 2026 and interim mechanisms preserve the structural properties while the mature form is built. Section 9's end-to-end diagram shows exactly which tool carries which step today.

#### Through-lines across the arc

Certain commitments recur across all of Marc's prior work and are load-bearing in the current design. Naming them explicitly helps a reader see what continuity is being maintained.

**Residents are the primary actors.** From the community medical record and Pursuing Perfection forward, the design has treated residents' own agency as the starting point rather than the endpoint. We learned this from patients. External contributions support what residents do; they do not substitute for it. The current design's value definition, Section 10, is this commitment made structural.

**Between-institution work is a high-leverage area.** From the whole-community medical record through the Spokane linkage maps, Marc's work has consistently found that high-value opportunities live in the connective tissue among institutions rather than within any single institution's scope. Institutions handle their own S1 through S3 competently; the failures accumulate in S4, where nobody is imagining what could be, and in the coordination gaps. Section 8 develops this.

**Measurement must be psychometrically real and authored by those it measures.** From the 52-item record evaluation and the PAM through the CAM, Marc's methodological commitment has been to measures that measure what they claim and are constructed with the participation of those they measure. Section 10's Rasch-based balanced scorecards extend this to neighborhood-scale value.

**Facilitator dependency is a design failure to be structurally eliminated.** From the CMG prospectus's goal of "ensuring local competence and autonomy" through the diagnosis of why that goal did not hold, Marc's work has treated facilitator dependency as a structural problem requiring structural solutions rather than good intentions or better training. Section 2's four principles are those structural solutions: variety distributed rather than replaced, so the tools carry what the external team carried; Platform actors paid only downstream of value residents recognize, so nobody's salary depends on the work continuing; capital that seeds and departs, so no ME becomes a client; and value defined and measured by residents, so no outsider's definition of success can capture the work.

**Systems thinking through Beer, Ostrom, Vester, and Meadows is the operating framework.** From Marc's early engagement with system-level thinking through the current work with the VSM and e-VSM at neighborhood scale, his practice has drawn on the systems tradition rather than treating each engagement as a discrete case. Section 3 makes this explicit, and Kerry Turner's Seeing the Systems program makes it the first thing a resident is offered.

**Speech acts and moods matter operationally.** From the hospital run on Co-Thrive, through CMG's Inclusion-Participation-Trust framework, to the current work, Marc has treated the ontological distinctions of Flores, Spinosa, and Dunham as operational. Section 7 elevates this from implicit background to explicit working layer.

**FedWiki is the native delivery medium.** From the collaboration with Ward Cunningham forward, Marc's work has taken FedWiki's fork-and-modify pattern as the right ground for neighborhood-authored, cross-neighborhood-federated work. The current design commits to FedWiki as the delivery medium for both the design record and the field guide.

#### What carries forward and what stays behind

The current design record explicitly continues some elements of Marc's prior work and explicitly diverges from others.

**Continues:** the five-phase Linkage Mapping playbook structure, adapted from CMG's 2014 form to neighborhood scale with a compressed timeline; the weighted-selection matrix method for scenario prioritization; Value Stream Mapping and A3 Problem Solving for process work inside the institutions an ME touches; the between-institution project as documented in the Spokane linkage maps; the Inclusion-Participation-Trust framework as the operating stance; the speech acts and moods layer; Rasch measurement as the method for latent constructs; FedWiki as the delivery medium; and the graph-based schema for representing scenarios, institutions, and coordination relationships.

**Diverges from the ACH institutional container.** Medford was structured around an Accountable Community of Health; the current design neither requires nor assumes an equivalent container, because the failure modes of ACHs, institutional politics among hospitals, capture by state Medicaid structures, misalignment of ACH incentives with resident-recognized value, informed the design's diagnosis of what needs a structural fix.

**Diverges from the seven-work-stream Confluence architecture.** Medford deployed seven parallel work streams at once. The current design centers on the Linkage-Mapping-and-Idealized-Design work stream and lets the others emerge as neighborhood work exposes their need. Standing up all seven at once was part of what made the prior architecture too heavy for anyone but CMG to operate.

**Diverges on System Dynamics modeling.** CMG's methodology treated SDM as one of three co-equal tools. The current design treats the Ripple ReThink model as available for higher-recursion S4 questions and leaves it out of the neighborhood-scale field guide, per Meadows.

**Diverges from the facilitator team model.** CMG operated as a paid external facilitation team engaged by community sponsors. The current design's Industry Platform is compensated as a downstream function of resident-recognized value rather than as a paid external service. This is the specific structural change that closes the dependency door prior implementations left open. If a neighborhood has no resident facilitators, there is no investment.

**Diverges on the scale of engagement.** Medford and Spokane operated at county scale, with ACH-shaped institutional containers as the primary interlocutors. The current design operates at neighborhood scale, with founded commons and small groups as the primary ground. The change of scale is not incidental; it aligns the work with the level at which the requisite variety is actually available.

**Diverges on the role of grant-making.** Prior implementations depended on external grant capital deployed on funder timelines with funder-authored evaluation frameworks. The current design's Industry Platform deploys catalytic seed capital in gates, with neighborhood-authored balanced scorecards and the anti-capture properties of Section 10.

#### Intellectual foundations from other authors

The design draws substantively on the work of others, in ways worth acknowledging explicitly. This is a naming of what shapes the design's specific choices rather than an exhaustive bibliography.

**Stafford Beer**, *Brain of the Firm* (1972), *The Heart of Enterprise* (1979), and the rest. The Viable System Model as the operating framework for viable-system diagnosis at any scale. Beer's insistence on recursion, every S1 itself a viable system with its own five functions, is the claim the design's network of nested systems rests on. Beer's treatment of System 4 as the most neglected function shapes the identification of S4 activation as the specific intervention the field guide provides. **José Pérez Ríos**, *Design and Diagnosis for Sustainable Organizations* (2012), for the diagrams of several recursion criteria carving one territory at once. Marc's own **e-VSM** extends Beer with eleven spheres in three layers and thirty-three paired homeostats; Section 3.

**Russell Ackoff**, *Redesigning the Future* (1974) and the work on Interactive Planning. Idealized Design as the method for imagining what would be wanted if the constraints of history did not bind, with its two constraints, technologically feasible and operationally viable. Section 3's S4 activation and the field guide's Phase 2 method draw on Ackoff directly; Section 8 retells the 1951 Bell Labs story from his own lecture.

**Elinor Ostrom**, *Governing the Commons* (1990) and the polycentric governance literature. How communities self-govern common-pool resources without state or market solutions, and how several centers of decision-making at several scales can produce workable coordination without any single center's dominance. The design's distributed structure across Platforms (Section 6), the network of nested systems (Sections 3 and 8), the neighborhood's authority over its own value definition (Section 10), and the Institutional Analysis and Development framework as a standing lens on RCN drawings all draw on Ostrom.

**Frederic Vester**, *The Art of Interconnected Thinking* (2007 translation of the 1999 original). Biocybernetics as the frame for understanding systems as living rather than mechanical. The biological logic of founded-commons succession (Section 4) and of the catalytic principle across scales (Section 9) draws on Vester directly, and his sensitivity model is a candidate for project selection.

**Donella Meadows**, "Leverage Points: Places to Intervene in a System" (1999). The twelve leverage points, with parameters the weakest and paradigms the strongest. Marc and Kerry Turner have extended the list to fourteen plus two, adding Time and Place. The design's choice to invest in worldview-level change through the WHY-first facilitation sequence (Section 7) rather than parameter-level change draws on Meadows, as does its judgment about System Dynamics at neighborhood scale.

**W. Edwards Deming**, and the Toyota Production System. Process improvement inside an institution, and the Driver, Support, and Mainstay levels that organized the Spokane linkage maps; Section 3 and Section 8.

**John McKnight**, *The Careless Society: Community and Its Counterfeits* (1995). The distinction between associational gift and professional service, and the diagnosis of how the philanthropic-industrial pattern produces counterfeits of community. Section 2's second principle is McKnight made structural through RenDanHeYi mechanics.

**Fernando Flores and Charles Spinosa**, *Disclosing New Worlds* (1997); **Terry Winograd and Fernando Flores**, *Understanding Computers and Cognition* (1986); **Bob Dunham** and the Institute for Generative Leadership; and the ontological-coaching tradition. Speech acts and moods as the working layer of coordination. Section 7 develops this at length, and Section 11 records that a hospital was run on it.

**Mary Parker Follett**, *The New State* (1918). Group ontology and coordination as active integration rather than compromise. The design's understanding of what happens in a neighborhood's convening moments draws on Follett.

**Karl Friston**, the free energy principle and Markov blankets. e-VSM's three layers as a Markov blanket, and S4 as the place a neighborhood keeps and revises its model of the world; Sections 3 and 10.

**Rasch measurement**, from Georg Rasch (1960) through Benjamin Wright and Mike Linacre at Chicago, and **Bill Mahoney**'s application of it in the Patient Activation Measure (Hibbard, Mahoney, Stockard and Tusler, 2004). The method under Section 10's scorecards and the Civic Activation Measure.

**Verna Allee**, "Value network analysis and value conversion of tangible and intangible assets" (2008) and *Value Networks and the True Nature of Collaboration* (2011). Roles, deliverables, tangible and intangible flows, and acceptance completing a transaction; built into the RCN Graph Tool and used in Sections 8, 9, and 10.

**Danah Zohar**, *Zero Distance* (2022). Haier's RenDanHeYi, including Ecosystem Micro-Communities, the Experience-ME and Solution-ME split, the customer scenario as durable object, the Industry Platform pattern, and the Community Store neighborhood-scale interface. Sections 5, 6, and 8.

**Joost Minnaar, Pim de Morree, and Bram van der Lecq**, *The Startup Factory* (2022). The mechanics of EMC formation, Leading Targets, the Value Added Mechanism, and inter-ME contracting, drawn on through public excerpts and Andreas Holmer's summaries, with awareness that the book holds operational detail the design will benefit from as the tools mature.

**Gary Hamel and Michele Zanini**, "The End of Bureaucracy," *Harvard Business Review* (2018). Haier's staged funding of new MEs and its three performance thresholds, the basis for Section 9's gates.

**Zhang Ruimin**'s own writing and interviews. The primary source for RenDanHeYi as it operates at Haier scale; the insistence that value to the employee be aligned with value to the user, and the company as an ecosystem-generating rainforest rather than a mature and dying organization.

**Christopher Alexander**, *The Oregon Experiment* (1975), *A Pattern Language* (1977), and *The Nature of Order* (2003–2004). Piecemeal growth and the split of funds across project sizes (Section 9); the pattern language, applied by Marc with the Bellingham downtown merchants and intended as the model for RCN's own pattern language of tools and methods; and what makes an environment alive, which Section 4's founded commons follows.

**Ward Cunningham**, Federated Wiki. The fork-and-modify pattern is what allows cross-neighborhood learning without centralized curation, and Ward's critique of FedWiki's own affordance gaps shapes the tool work.

**Myles Horton**, the Highlander Folk School, later the Highlander Research and Education Center. The model for Highlander 3.0, the cohort initiative through which neighborhood actionists, in Chris Casillas's word, learn by immersion in one another's founded commons; Section 4.

**Contemporary RenDanHeYi reporting**: Andreas Holmer's WorkMatters series, the Haier Model Institute, William Malek's *Beyond Buzzwords* podcast. The mechanisms Zohar and *The Startup Factory* describe at the conceptual level, including scenarios returning to the platform enriched by failed attempts ("you can go grab the scenario").

#### What Section 11 commits the design to

The design record acknowledges its debts to prior work explicitly. Nothing in the current design is treated as a fresh invention; every substantive claim traces to prior work by Marc or by others, extended or adapted for the current situation.

Marc's own arc, from the Whatcom County institutions and the community medical record, through the hospital run on speech acts, through CMG's Medford and Spokane work, to ReLocalize Health and the current RCN work, is treated as a continuous line of development rather than a set of discrete engagements. The through-lines are preserved: residents as primary actors, between-institution work as leverage, real measurement authored by those measured, structural elimination of facilitator dependency, systems thinking as the framework, speech acts and moods as operational, FedWiki as the delivery medium. The divergences from prior implementations, from ACH containers, from the seven-work-stream architecture, from SDM as a co-equal tool, from the paid facilitator team, from county scale, from external grant-making, are named as the specific structural changes this design commits to.

The intellectual foundations from other authors are acknowledged as the specific traditions this design draws on and extends, and Marc has confirmed the selection is well focused.

Section 12 describes the Federated Wiki and the foundational tools as a set, and Section 13 addresses the questions still open in the design, the ones RCN is grappling with, the ones tool maturation will affect, the ones the first years of operation will teach, so a reader knows what is settled and what is not, and can engage the open questions as active work rather than assumed answers.

#### Tools and methods named in this section

- The CMG 2016 prospectus, the five-phase Linkage Mapping playbook, and the Spokane linkage maps; sources in Design Record/sources/ (Prospectus of CMG services, Marc's Method of Community Transformation, Logic of VSM Linkage Maps, Key Graphs).
- The Medford architecture at community4health.atlassian.net; the GGCS backlog.
- The Ripple ReThink Model and the Rippel Foundation's ReThink Health model.
- e-VSM (Section 3), CfA-dSC and SODOTO (Section 8), the RCN Graph Tool with VNA and EIP (Sections 8–10), the Timeline and Map tools, the CAM item pool (Section 10).
- Value Stream Mapping (Graph Tool VSM mode) and A3 Problem Solving (tools/a3.html), in Cindy Jimmerson's healthcare form; tools/rcn-lean-healthcare-intro.pptx.
- Co-Thrive, Sherman Rowland's successor to Flores and Winograd's Coordinator; a historical tool, not one in the current set.
- Marc's pattern-language work: Design Record/chat-memory/areas/bellingham-pattern-work.md.

### Claude's notes on delivering the rewrite

Marc's edited text is the basis; his three parentheticals are absorbed and the title is his ("The Foundational Prior Work"; "substrate" is gone from the title and the text).

Four things to check, because they go beyond what Marc wrote and I could not verify them elsewhere.

The Whatcom institutions paragraph. Marc's parenthetical named WIDS, CHIC, the Community Health Record, HInet, WAHA as least successful, the hospital takeover, St. Luke's Foundation and the Whatcom Health Foundation. I have written "Marc was among the founders of WAHA and worked in and around the rest" because I do not know his role in WIDS, CHIC, or HInet, and I have offered a reading of why WAHA did least (an alliance without a concrete shared object) that is my inference from the list. If the reading is wrong, cut the sentence.

ReLocalize Health and Seeing the Systems. Nothing in the export, the memory files, or the repo says what ReLocalize Health is or what Seeing the Systems does; the names appear only in Marc's edits to Sections 9 and 11. The rewrite places them and says in the text that a paragraph in Marc's or Kerry's words is the one thing the section still needs.

The Rippel correction. Marc wrote "the Fanney E. Ripple ReThink Health System Dynamics Model." ReThink Health is an initiative of the Fannie E. Rippel Foundation, so the rewrite says that; Marc's own model keeps his name for it, the Ripple ReThink Model. If "Ripple" is not Marc's intended name for his own model, both need changing.

Spellings taken from Marc's edit as written: Carolyn Turkovitch, Rachael Lucy, Sherman Rowland, Co-Thrive, Bob Harrington, Annie Merkle, Jack Homer, Gary Hirsch.

Added to the foundations because the record now uses them: Pérez Ríos (Section 3), Deming and TPS (Sections 3, 8), Verna Allee (Sections 8–10), Hamel and Zanini (Section 9), Winograd and Flores (Section 7), Myles Horton (Section 4), Alexander's Oregon Experiment (Section 9), Kaplan and Norton by implication in Section 10. Marc said the selection was well focused; these are additions the later sections forced rather than a widening. Prigogine, Maturana, Varela, Wright, Bohm are still out.

Chat's memory files have Chris at The Fledge and Jerry at Leo's (backfilled before the correction); this section does not depend on it, but anyone reading `chat-memory/` should know the memory is wrong on that point.
