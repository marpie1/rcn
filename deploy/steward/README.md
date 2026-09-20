# RCN steward stack

A workbench on one person's own computer: Neo4j, the substrate, and a FedWiki with the RCN plugins, as one `docker compose up`. This is level 2 in `substrate/LAYERS-2-3.md` — for someone willing to install one thing (Docker) in order to load several sources, merge them on names, draw and edit, ask new questions, and publish the result as a folder for a wiki site.

If you only want to publish a spreadsheet, you do not need this. Open `tools/rcn-table.html`, press Open spreadsheet…, then Publish records ↓ (User Manual §15). This stack is for records that need a graph behind them.

## What you get

| Address | What |
|---|---|
| http://localhost:3000 | Your FedWiki. Rcntable, Rcngraph, Rcnoutliner in the Factory. The same image WikiCafe runs. |
| http://localhost:8768 | The substrate: what it can answer, and the tools it serves (`/tools/rcn-table.html`, the map, the graph tool). |
| http://localhost:7474 | Neo4j Browser, for when you want to see the graph itself. User `neo4j`, the password from `.env`. |

Everything is published on 127.0.0.1 — this computer only, not the wifi, not the internet. There is no login gate because there is nobody else.

## Fifteen minutes

1. Install Docker Desktop. Start it.
2. In this folder: `cp .env.example .env` and choose a password.
3. `docker compose up -d`. The first time pulls Neo4j and builds the substrate image; a few minutes.
4. Put your records in `records/`, one folder per body of records — for the 2017 Whatcom survey, the eight `MBKF … CSV - Sheet1.csv` files in `records/whatcom/`.
5. Load them: `docker compose exec substrate python3 substrate/load_whatcom.py --src /records/whatcom`. The loader prints what it found: rows per kind, links, names shared by more than one table, rows it could locate.
6. Open http://localhost:3000, claim the site, add an Rcntable item to a page, press Open Table. The popup reads the live graph.
7. Publish for a site: `docker compose exec substrate python3 substrate/export.py --bundle whatcom`. The folder appears in `export/rcn-table/` on your disk; User Manual §15 says how it goes onto a site's Assets items.

When the records change, edit the files in `records/` and run step 5 again. The loader rebuilds the database from the files every time.

## The rules this stack lives by

**The files are the truth; the database is derived.** (`substrate/tool-inventory.md`, decision 17.) `records/` is what you back up. `neo4j-data` is a cache of it and can be thrown away — `docker compose down -v` and load again. Nothing may exist only in the database; a loader has to be able to make it from a file.

**One codebase.** The Python is the same as on Marc's laptop and the same as on WikiCafe. What differs lives in `docker-compose.yml` and `.env`: the bind address (`HOST`), where Neo4j is (`NEO4J_HTTP`), the credentials. `db.py` reads `NEO4J_*` from the environment first and from `~/rcn/.env.neo4j` second, so a laptop needs no compose and the stack needs no file.

**On localhost the table reads the live graph; anywhere else it reads a folder.** That is the one place the wiki plugin behaves differently, and it is a convenience for exactly this stack: you see the database as it is, not as it was last exported. A site on WikiCafe never contacts this machine and cannot; the folder you export is the only thing that travels.

## Neo4j editions, and the NDC question

The default image is Neo4j Enterprise under its developer terms — the same edition Neo4j Desktop installs on a laptop, for one person's own machine. It is the default because the loaders keep each body of records in its own database (`whatcom`, `rcngeo`, `vna`, `aspects16`), and `CREATE DATABASE` is an Enterprise feature.

Community edition (`NEO4J_IMAGE=neo4j:5.26-community` in `.env`) is one database per instance. That is fine for a server other people reach, which is what an NDC instance is — and what Enterprise-under-developer-terms must not be used for. It means an NDC instance is one body of records per Neo4j container, which matches how NDCs work anyway: one neighbourhood, one graph. The loaders will need a `--database neo4j` switch for that; it is on the list in `substrate/LAYERS-2-3.md` (level 3), along with the NDC signature on the exported folder.

## Backups

`records/` — your files. Copy the folder. Everything else can be rebuilt from it.
`wiki-data` — your pages. `docker run --rm -v stewardstack_wiki-data:/w -v $PWD:/out alpine tar czf /out/wiki-pages.tgz -C /w .` (replace the volume name with what `docker volume ls` shows).

## Ports in use already?

If you already run Neo4j Desktop, a wiki on 3000 or the substrate on 8768 by hand, the stack will refuse to start on those ports. Stop the hand-run ones, or copy `docker-compose.yml` and change the left-hand port numbers.
