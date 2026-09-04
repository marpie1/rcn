# RCN tool schemas — the reference chat-Claude doesn't have

Chat-Claude has no live access to `~/rcn`. Its schema knowledge is *recall of past conversations* — accurate-sounding but unverifiable, and demonstrably wrong in ways it cannot detect. These files exist so that no Claude has to rely on recall.

**Use:** paste or upload the relevant file into the chat session before asking chat-Claude to pre-populate a tool file. Or load the lot into a Project's knowledge. The failure mode these prevent is confident output with invisible provenance.

| Tool | Schema | Input format |
|---|---|---|
| `tools/graph-tool-v22.html` | [graph-tool-v22.md](graph-tool-v22.md) | native graph JSON |
| `tools/rcn-timeline.html` | [rcn-timeline.md](rcn-timeline.md) | timeline model JSON |
| `tools/issue-polygon-map.html` | [issue-polygon-map.md](issue-polygon-map.md) | GeoJSON FeatureCollection |
| `tools/graph-composer.html` | [graph-composer.md](graph-composer.md) — its own sidecars, detail levels, export loss | native graph JSON, plus `families.js` + `graph-sets.js` |
| `tools/rcn-spc.html` | [rcn-spc.md](rcn-spc.md) — CSV shape, why pooled ≠ averaged, designing demo data | **CSV** in, session JSON out |
| the substrate projections | [../../substrate/ROUND-TRIP.md](../../substrate/ROUND-TRIP.md) | same native graph JSON, served over HTTP |
| FedWiki itself | [fedwiki-import.md](fedwiki-import.md) — page JSON, item types, and the one file you drop on a site | flat `{slug: page}` map; worked set in [fedwiki-import-example.json](fedwiki-import-example.json) |

Plus one file that is **not** a schema but explains where a tool came from: [ward-graph.md](ward-graph.md) — Ward Cunningham's `Graph` class, the `pages/mock-graph-data/` originals, and the live FedWiki pipeline the Composer reimplements. Read it before changing composition or node identity.

Each file is written **from the tool's own load and save functions**, with line references, and states the commit it was verified against. When a tool changes, the schema file is wrong until someone re-derives it — check the commit line before trusting one.

## The two rules that generalise across all three tools

**1. Structural validity is not survival.** A file can load, render, and pass a validator while silently losing data. Both bugs found on 2026-07-25 were of this kind: the graph tool drops a top-level `meta` block on export, and the polygon map imports its own exported `IssuePolygon` feature as nothing at all. Neither produces an error. The only test that catches this class is a **round-trip**: load the file, re-export, diff.

**2. Put extension data where the tool already looks.** Every one of these tools has a designated place for arbitrary user data — `props` on graph nodes/edges, `note`/`who` on timeline intervals, `properties` on GeoJSON features. Data there is editable in the UI, searchable, and carried by the exporters. A bare top-level key you invented is none of those things, even when it survives the round-trip. Do not propose a schema change until you have checked whether the tool already has a home for it.

## Validating

    node tools/validate-rcn-graph.js <file.json>          # graph tool only
    node tools/validate-rcn-graph.js <file.json> --fix    # writes .fixed.json

Exit 0 = renders, 1 = will not render, 2 = bad input.

The validator checks structure and, since 2026-07-25, warns about top-level keys the tool will discard. It is a pre-flight, **not** ground truth — it passed `southern-louisiana-actor-map-v22.json` with zero warnings while five fields of authorship metadata were being dropped. There is no validator for the timeline or the polygon map yet; for those, the schema file plus a load test is the check.
