# Layers 2 and 3 — stewards with their own Neo4j, and the NDC instance

Written Sep 21 2026, after Layer 1 shipped. Layer 1 is drawn in `layer1-static-projections.rcn.json` and described in `export.py`'s header: a projection is a pure function of the files, so it is exported once to a folder in a FedWiki site's assets, and a reader with no account, no key and no software gets the table, the drawing and the map. This note is about the other end of that folder: who makes it, on what, and how a neighbourhood comes to own one.

## The question this answers

Marc, Sep 2026: how do we move toward people using Neo4j on their own computers, and how could an NDC curate and "control" a neighbourhood instance of Neo4j that interoperates with all our tools. Behind it is a decade-old worry: a shared graph database that anyone can read and only the keeper can write, or one per person, without inviting chaos.

The short answer is that Layer 1 already settled the hard part. Decision 17 (`tool-inventory.md`) says the files are the truth and the database is derived. Once that is true, a Neo4j instance is disposable, a "write" is a change to a file, and control of the graph is control of the files. FedWiki already knows how to run a world where everyone reads, the owner writes, and everyone else forks. The rest is packaging.

## Four levels, not one

The mistake to avoid is thinking everyone needs Neo4j. Each level is a real role and each needs less than the one above it.

| Level | Who | Needs | Can do |
|---|---|---|---|
| 0 Reader | anyone | a browser | open a page, scan the table, follow a row into a drawing or onto the map, click a name |
| 1 Spreadsheet steward | a CHW, a coordinator, a church secretary | a spreadsheet and a FedWiki site | keep records in a sheet; publish them as a folder to their own site; no Neo4j, no Python |
| 2 Workbench steward | someone willing to install one thing | Neo4j on their own computer plus the rcn tools | load several sources, merge on names, draw and edit aspects, ask new questions, export |
| 3 NDC instance | a Neighborhood Development Company | a machine the NDC controls and a git repository it owns | curate the neighbourhood's shared graph, sign what it publishes, accept or decline contributions |

As of this note: level 0 is built and verified; level 2 exists on one machine (Marc's); level 1 is a small script away and is the highest-leverage thing to build; level 3 is mostly assembling pieces already built for SODOTO and SCP.

## Level 1 — the missing rung

`table-<kind>.json` is `{columns, data}`. A CSV is already that. `graph.json` is a list of `src, tgt, label` triples, which is a second sheet with three columns. `geo.json` is rows that happen to carry `lat` and `long`. So a spreadsheet can become the same folder `export.py` writes, with no database in the loop.

The shape of the input, kept as simple as the data allows: one sheet (or CSV) per kind of thing, named for the kind, first column the name; an optional sheet called Links with columns From, Relation, To. Names are slugged the way everything else is (`asSlug`), so a row here and a page in the wiki and a node in a drawing meet at the same address. A name that appears in Links but has no row of its own becomes a node with no kind, which is exactly what the 2017 Whatcom records do with the 55 things named by some table but never given a row.

Where it runs: in the table itself, in the browser. Open a spreadsheet and the table works immediately, in memory, with Neighbourhood and Map; a Publish button hands back the folder as one zip, tools included, to drop into the site's assets. That keeps level 1 at "a browser and a spreadsheet" and needs nothing installed. A Python twin for stewards who prefer the command line is the same logic and can follow.

What this deliberately does not do: merge two sheets that name the same thing differently, guess a kind, or fill an empty cell. Those are decisions, and the loaders at level 2 report them rather than making them.

## Level 2 — Neo4j on a person's own computer

This is the steward track, and it should follow the rule already set for SCP 3.0's personal-computer track (`project_scp3_personal`): one codebase; differences live in compose files and environment variables, never in `if` branches in the Python; everything bound to 127.0.0.1; the person is the data controller.

Concretely, `deploy/steward/` with one `docker compose up` that starts Neo4j Community, `api.py`, and a FedWiki: the three things Marc runs by hand today. `db.py` speaks Cypher over plain HTTP with no driver, so the tools need nothing beyond Docker. A 15-minute manual: start it, run a loader, open the wiki, open a table item.

Two facts shape it. Neo4j Desktop's Enterprise is a developer licence, fine on one person's laptop and not for anything shared; Community is what a steward stack or an NDC runs, and Community allows one user database per instance, which is one-instance-per-NDC anyway. And decision 17 is what makes this safe to hand to a non-expert: a steward's Neo4j is disposable. Blow it away, run the loader, it is back. The worst case is "run the loader again."

Level 2 is packaging and a manual, not capability. Nothing in the tools changes.

## Level 3 — an NDC curating a neighbourhood instance

Precision about what "control" can mean, because the design already answers it and it is not what control usually means for a database.

**The NDC controls the files, not the database.** By decision 17 the database is derived. The NDC's real asset is a git repository of source files — survey CSVs, aspect drawings, geography, whatever the loaders read — that the NDC owns. Its Neo4j instance is the loaded form of that repository, running on a machine the NDC controls: a Mac mini in the office, or a container on WikiCafe, in the same shape as the per-NDC server already designed for SODOTO auto-seal (`project_sodoto_coordinatorless`). To curate is to decide what goes into the repository.

**Writes arrive as forks, not as writes.** FedWiki solved shared editing by refusing it: you do not edit my page, you fork it, and I choose whether to pull. The graph follows the same rule. A change arrives as a file — an aspect drawing saved from the graph tool, a corrected CSV, a table saved back from the popup — and the NDC steward accepts it into the repository, runs the loader, re-exports. The boundary validator from `WRITE-SAFETY.md` sits at the loader and refuses a malformed contribution whole. No stranger ever holds write access to the NDC's Neo4j; nobody needs it.

**What the NDC publishes is signed.** This is where SODOTO joins. The NDC already has an institutional signing key (the auto-seal engine, `sodoto/auto-seal/`). `export.py` puts an NDC signature on `index.json`: a JWT over the folder's file hashes, signed with the NDC key, dated. The table can then show "curated by Superior AZ NDC, 2026-09-21, verified" the way a badge verifies, entirely in the browser, no server call. That is control in the only sense a federation offers: not the power to stop copying, but the authority to say "this is ours, as of this date." Everyone can read and copy; only the NDC can vouch. Signing a folder is an institutional seal, which is the case `feedback_sodoto_signing` allows — people sign in their browsers, institutions may seal on a server.

**Interoperation with every tool is the projection contract**, which is already the design. Every tool reads a projection and writes a file; `tool-inventory.md` is the coverage list. Table reads `table/<kind>`; map reads `geo`; graph tool reads `neighbours` and `subgraph` and writes aspect files back; sunburst reads `vocabulary`; timeline and Rasch have their rows in the inventory. An NDC instance interoperates with all of them by definition, because it is the same `api.py`, and the exported folder carries the subset a reader needs.

**Across NDCs**, three moves. Read another NDC's records: an item's `src:` line pointing at their site's folder; built. Copy them: download the folder, or load their `graph.json` into your own Neo4j as another database; one small loader, `load_export.py`. Merge them: load both into one workbench and let the loaders' merge-on-name rule join what names the same thing, the rule the Whatcom sheets already use; where names disagree the tool reports it and a person decides. That is the neighbourhood of neighbourhoods, and it stays a human act, which is right.

## What this gives up, on purpose

Live queries by strangers against a hosted graph. Ad hoc Cypher over the network. A central RCN database that all NDCs write into. Each of those is the chaos Marc has been sitting on, and each is unnecessary once the files are the truth and the folder is the interface.

## Sequence

1. Level 1 now: spreadsheet to folder, in the table, no Neo4j. Unblocks a CHW pilot.
2. `deploy/steward/`: one compose file, one short manual. Turns Marc's workbench into something a second person can run.
3. Signed exports: NDC key on `index.json`, verification shown in the table header. Small, and it is the piece that makes "curated by" real.
4. First NDC instance: Superior AZ, since the SCP pilot and the SODOTO server already point there. The steward stack on their machine, their repository, their site, their signature.
5. Cross-NDC loader: `load_export.py` reading another site's folder into a database.

See `layer1-static-projections.rcn.json`, `export.py`, `WRITE-SAFETY.md`, `tool-inventory.md` decision 17, and the SODOTO auto-seal design under `sodoto/auto-seal/`.
