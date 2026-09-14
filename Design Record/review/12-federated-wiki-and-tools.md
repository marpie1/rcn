# Section 12 — The Federated Wiki and the RCN Foundational Tools

## Why this section exists

Every section so far has named the Federated Wiki in passing: the delivery medium, the scenario repository, the place portfolios live, fork-and-modify. And every section has named the RCN foundational tools, SODOTO, CfA-dSC, the Overall Schema, the RCN Graph Tool, e-VSM, and described only two of them, e-VSM in Section 3 and the value-network notation in Section 8. A reader who has come this far knows what the design asks of its tools and does not yet know what the tools are, or why the wiki was chosen over every other way of holding this work.

This section fills both gaps. The first half is about the Federated Wiki: what it is, why RCN chose it, how RCN uses it, and what Ward Cunningham's own critique of that use says is still missing. The claim of the first half is that the federation is not a hosting decision. It is the design's principles in software, and choosing something else would have meant a different design. The second half is about the foundational tools as a set, one short paragraph each, and about the RCN Workbench as the way they come together over one graph, with the wiki as the surface people read and write. The operational detail of each tool lives in the field guide's pattern language, and this section points there rather than repeating it.

## What the Federated Wiki is

Ward Cunningham invented the wiki in 1995 and the Federated Wiki in 2011, and the second was his answer to what the first had become. A conventional wiki is one site, one database, one set of pages that everyone edits in common, so that disagreement has to be resolved before anything is written and whoever administers the site owns everyone's work. In the Federated Wiki each person, or each organization, runs their own site. Pages are documents in a simple JSON form: a title, a story, which is an ordered list of typed items, paragraphs, images, data tables, diagrams, whatever a plugin knows how to show, and a journal, which is the complete history of every action that made the page what it is. Anyone reading a page on someone else's site can fork it, which copies the page to their own site as a twin, journal and attribution intact, and edit it there. The original is untouched. The federation is the network of all such sites, and there is no center: no server that everyone depends on, no owner of the whole, no one who can take a page away from the person who holds it. Pages are licensed CC BY-SA, so forking is always allowed and attribution always travels.

Two more of Ward's ideas matter for RCN. A site's neighborhood is the set of other sites it knows about and searches, built up from where its pages were forked from and from rosters of sites that choose to list each other; a search covers the neighborhood, and a page that is missing on one site is looked for on its neighbors. And a ghost page is a page that has been computed or proposed, shown in the reader's lineup for review, which the reader decides whether to fork into their own site or let vanish. Ward's specification of the platform, "What Wiki Does," organizes its behavior into six concerns: fundamental, collaborative, interpretable, computational, generative, maintainable. It is the document RCN's own pages are meant to be checked against.

## Why RCN chose it: the principles in software

Marc's own account of the choice, and Ward's, belongs here in their words; this paragraph is a placeholder for it. What follows is what the design record can say from the design itself.

**Each person owns their own site, and so their own record.** Section 2's first principle distributes variety across the tools so that no external team has to be present; the federation distributes the data the same way. A SODOTO portfolio is a page on a site the learner owns. A Shared Care Plan is a site the patient owns, and the community health worker who helps them keep it is a visitor with permission that can be revoked. A neighborhood's scenarios are on the neighborhood's site. RCN holds none of it. This is the self-custody principle the identity work settled in August 2026, that a person's signing key is generated on their own device and never held by a mentor, a coordinator, or a tool, carried through to the pages the key signs for. An institution that captures a program cannot capture a page it does not host.

**Fork-and-modify is how learning crosses neighborhoods without a curator.** Section 5's scenario repository and Section 6's insistence that RCN is a pattern language and not a Platform both rest on the same mechanism. A scenario written in Spokane is forked in Superior, changed to fit, and the journal shows what changed and who changed it; the Spokane page is not edited, and nobody had to decide which version is right. Enrichment, Section 8's word for what a retrospective writes back, is a fork with a new paragraph of existing attempts. RCN's cross-neighborhood learning is the federation's ordinary behavior, not a program layered on it.

**The journal is provenance.** Every claim the design makes about attribution, who articulated a scenario, who promised what, who attested to what, is answered by the page's journal without any additional system. Section 10's rule that recognition is something a person does is easier to keep when the page records which person did it.

**Small pieces, loosely joined.** Hamel and Zanini describe Haier's four thousand microenterprises with David Weinberger's phrase for the web, and it describes the Federated Wiki exactly: many small sites, free to differ, held together by a common page form and a common way to fork. A network of nested systems, Section 3's phrase, is what a federation of neighborhood sites is. A design that wanted a central platform would have chosen a central platform.

**Cave drawings stay editable where the room reads them.** The rcngraph plugin, RCN's own, puts a Graph Tool drawing on a wiki page as an item that carries both the model and the rendered picture, so that a linkage map or a value network can be opened, changed, and put back from the page itself. A diagram shipped as a flat picture is a dead image with no way back to the model; the design treats that as a bug. The prose of this record is editable on the page, and so must the drawings be.

**No vendor.** The wiki is open source, the plugins are npm packages anyone can install, the pages are JSON files on disk, and the whole of a site can be moved by copying a directory. A Neighborhood-Catalyzing Industry Platform that depended on a company's product would have a dependency Section 2 exists to remove.

## How RCN uses it today

The uses are concrete and most of them are running.

**The scenario repository.** Marc's FedWiki pages Customer Scenario Template and Writing a Customer Scenario are the template; scenarios are pages on the template, forked between neighborhoods, enriched at retrospectives. Section 5.

**SODOTO portfolios.** Each learner's portfolio is a wiki page, and in the per-person deployment a wiki site, at `{slug}.{domain}`, provisioned by the issuer tool with an unclaimed owner record that the learner's first signed badge claims. Badges are Ed25519-signed verifiable credentials written into the page by the sodoto-badge plugin; a teach chain is readable off the pages. The ownership flip, wiki-security-did, in which a site's owner is whoever holds the DID in its first badge, is built, tested against the real wiki server, pushed to the host dark, and waits on a coordinated switch. Sections 8 and 9.

**The Shared Care Plan.** The person-controlled health record for the Superior pilot is nineteen typed plugins on a FedWiki site per patient, with the CHW's access granted and revocable per site. Its journal is the access record a patient is owed, and the automatic access log is the one thing that must be built before real health data goes on it.

**This book, the field guide, and the skill pages.** The RCN Design Record and the field guide are drafted as markdown and delivered as FedWiki pages, one paragraph per item, headings as items, diagrams as rcngraph items; the SODOTO Basic, Intermediate, and Advanced pages for every pattern in the field guide's language will be the same kind of page. The reader is meant to fork what is useful.

**Tools inside the wiki.** Besides rcngraph, the rcnoutliner plugin puts the MORE outliner, the campfire capture tool, on a page; the e-VSM aggregator has a plugin; the RCN Map runs from a site's asset folder. Where a tool needs the whole window, the pattern is Paul Rodwell's Solo popup, which opens the tool full-screen while staying tied to the lineup it came from.

**Whole documents brought in.** The Foothills Outlook, a monthly community paper, and the Whatcom Court, a 145-page site derived from a diagram, were converted to FedWiki as worked cases of moving a body of local knowledge into a form its community can fork and extend.

**The network of sites.** The NDC sites, Superior, Lansing, Maple Falls, Austin and Bastrop, list each other with Roster pages, which is the wiki's own way of declaring a neighborhood of sites. Hosting is at Wiki Café, a FedWiki farm run by Christian, where RCN's images are pulled on a schedule; per-site secure login is available there today.

## Ward's critique: where RCN misses the wiki's own affordances

Ward and the FedWiki programmers looked at RCN's work in 2026 and said, accurately, that it worked and that much of it bypassed what the wiki already provides, reinventing things and drifting from where the platform is going. The design record records the critique because it is true and because the response is a standing rule: before building anything that touches the wiki, read the wiki's source, and use what is there.

Four of the five gaps remain. There is no factory pattern for RCN's items: a CHW cannot add a medication card without knowing the page's JSON, when the wiki has a drag-and-menu mechanism for creating typed items. RCN's data items are opaque to other plugins: the wiki has a simple event convention by which a data item announces itself and downstream plugins, charts, methods, read it, and RCN's items do not speak it, so nothing can chart a health log without custom code. The standalone tools, the Graph Tool, the outliner, the map, live outside the wiki as separate HTML files; the Solo popup is the idiomatic way in, and the work is partly done. And the single-site deployments are not yet the federation they should be: per-person sites are built and dark, and the pressure testing, session hardening, revocation testing, and audit log that real health data requires are not finished. The fifth gap, a roster of the NDC network, turned out not to be a gap; Marc had been keeping one all along.

Two of the wiki's generative affordances are worth naming as the way forward. A Frame script can run a tool inside a page and offer its result as a ghost page the owner decides whether to fork, which is the idiomatic form for credential issuance and for any computed result. And code items on a page can be imported as modules by other pages, so a tool's logic can live in the wiki it serves.

## Identity, signatures, and no blockchain

Everything the design asks a page to attest, a badge, a promise in a charter, a resident's attestation of value, a settlement, rests on one identity design and one refusal.

The identity is a did:key: an Ed25519 key pair generated in the person's own browser, on their own device, with a recovery phrase they hold, and a public identifier anyone can verify against. It is the same identity across SODOTO, CfA-dSC, and the Shared Care Plan. The issuer tool orchestrates a learner's onboarding and never holds the key; the coordinator registers only the public half. Signing and verification happen in the browser and nowhere else.

The refusal is of blockchains. A chain buys trustless enforcement among adversaries who share no authority. RCN's agreements happen inside a cooperative or a neighborhood that does have a common authority, and they run on institutional and cryptographic trust: signatures over consensus. So CfA-dSC's dyadic smart contracts are a structured commitment protocol, each speech act a signed token between two identities, and not chain contracts. The three-currency settlement of Section 6 is a signed ledger whose balances are computed from signed entries, as time banks and mutual-credit systems have done on plain databases for forty years. The one exception, real bearer money moving between strangers with no shared ledger, will be evaluated when it appears, and a plain payment rail is the likelier answer even then. The choice also passes the test the design applies to every tool: wallets, fees, and confirmation latency are the least readable vocabulary a neighborhood could be handed.

## The RCN foundational tools, as a set

Each of these has an introduction, a manual, and in most cases a deck in the rcn repository, and each appears in the field guide's pattern language with its Basic, Intermediate, and Advanced skills. What follows is only what a reader of the record needs in order to know what is being referred to.

**The RCN Graph Tool** is the drawing tool everything visual in the design runs through: a single HTML file, no install, that draws nodes and edges with a legend as the registry of kinds, so that a drawing a group can read has six to eight kinds in it and every element follows its kind. It has modes for particular notations, causal loop diagrams, the Environment / Institutions / Politics stage, value streams with their lanes and storm bursts, Wardley maps, process linkage, and the value-network notation of Section 8 as a legend preset with two enforced rules. It exports SVG for documents, rcngraph items for the wiki, and Cypher for the graph database, and a validator checks a drawing before it is shared. Its governing goal is the cave drawing: an image a group can read, point at, and argue about untrained.

**e-VSM** is Section 3's shared reference: the survey, aggregator, report, and spreadsheet tools that let a neighborhood see itself on eleven spheres and thirty-three paired homeostats, from several worlds at once, with Claude reading the evidence across respondents.

**SODOTO**, See One, Do One, Teach One, is the credentialing system: signed badges in a learner's own portfolio, issued gate by gate as a skill is seen, done, and taught on, with the rule that whoever learns must teach and the chain of who taught whom as the record. It is being extended to carry ME participation, scenario authorship, and residents' attestations, so that a portfolio is what a bid reads.

**CfA-dSC**, Conversations for Action as dyadic smart contracts, instruments Section 7's speech acts: a request, a promise or counteroffer or decline, a declaration of completion, a declaration of satisfaction, each signed by the party who makes it. It carries two-party conversations today and is committed to carry the multi-party charter, the VAM, the gates, and settlement.

**The Overall Schema and the Neo4j graph** are the one graph into which all the tools write: scenarios, drawings, surveys, charters, badges, and the neighborhood's small groups and institutions as nodes and relationships with a shared vocabulary, so that a question can be asked across them. The schema is at v0.1 moving to v0.2. Loaders exist for drawings and value networks; the Institutional Analysis and Development lens is a read-only projection over it. The tools are lenses on this graph, and the graph is not aware of any tool's mode.

**The RCN Table, the Graph Composer, the Timeline, and the Map** are the smaller lenses: a table of things and their properties that feeds the graph; a composer that merges several drawings into one by what a node is rather than what it is called; a timeline of intervals and their relations; a map of parcels and places with deep links. The Rasch tool, the SPC tool, the A3 tool, and SensiMod carry the measurement and improvement methods of Sections 9 and 10.

## The RCN Workbench

Section 8 described the Workbench, the analog of Haier's platform on which scenarios are posted, MEs bid, EMCs form, and VAMs settle, as five views over one graph: a scenario browser, an ME chartering view, a portfolio viewer, a convener facilitation view, and a Platform dashboard. This section can now say what the views are made of. The graph is Neo4j under the Overall Schema. The surface is the Federated Wiki: a scenario is a page, a charter is a page, a portfolio is a page, a drawing is an item on a page, and each view is a way of reading and writing those pages, sometimes as a plugin on the page, sometimes as a tool in a Solo popup, sometimes as a ghost page a query produced for the reader to fork or discard. The design's two standing constraints hold: no decision routes through Claude or any single gate, Claude reads the graph and surfaces suggestions and is otherwise absent; and every view is a cave drawing, kept small enough for a room. The Workbench is not built as a whole. Its pieces, listed above, mostly are.

## What is still to build

The section's own list, drawn from Ward's critique and from the sections before it. A factory for RCN's item types. The data-flow convention on RCN's items, so the wiki's own charts can read them. The Solo popup for each standalone tool. The per-site security work that must precede real health data: pressure testing, session hardening, revocation, the automatic access log, and the CHW authorization model, which needs Ward's input. The wiki-security-did flip to per-person ownership, coordinated. The rcngraph delivery of every diagram in this record. And the pages themselves: the Design Record, the field guide, the pattern language, and the SODOTO skill triples, all as FedWiki pages a reader can fork.

## What Section 12 commits the design to

The Federated Wiki is the medium of the design because it is the design's principles in software: owned sites, fork-and-modify, journaled provenance, small pieces loosely joined, editable drawings, no vendor. Anything RCN builds that touches the wiki is built idiomatically, using the affordances Ward's specification names, and the source is read before the code is written.

Identity is self-custodied, a did:key minted on the person's own device and held by no one else, and every attestation in the design is a signature by that identity. Agreements and settlements are signed records on a shared ledger; there is no blockchain in the design.

The foundational tools are a set of lenses on one graph, each with its intro, manual, and skill ladder, and the RCN Workbench is their composition over the wiki as surface and Neo4j as store.

Section 13 names the questions still open.

## Tools and methods named in this section

- Ward Cunningham, "What Wiki Does"; the fedwiki GitHub organization (wiki, wiki-server, wiki-client, and the plugin repositories); Paul Rodwell's wiki-plugin-solo. RCN's briefing: docs/fedwiki-git-briefing.md.
- RCN's plugins: wiki-plugin-rcngraph, wiki-plugin-rcnoutliner, wiki-plugin-sodoto-badge, wiki-plugin-sodoto-signin, the scp-* plugins; the naming and publishing notes in Design Record/chat-memory and the rcn memory files.
- The fedwiki-page skill and tools/inject-diagrams.js for delivering markdown and diagrams as pages.
- SODOTO: docs/sodoto-intro.html, sodoto-manual.html, sodoto-pitch.pptx; the DID ownership design and deploy runbook in docs/.
- CfA-dSC: docs/cfa-dsc-intro.html, tools/cfa-dsc-creator.html.
- The Graph Tool, e-VSM, Rasch, SPC, A3, SensiMod, Table, Composer, Timeline, and Map: their intros and manuals in tools/ and docs/, and the field guide's pattern language for their skills.
- The Overall Schema and the Neo4j substrate: substrate/ in the repository; docs/three-bands.md and substrate/iad-crosswalk.md for the IAD projection.
