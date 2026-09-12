---
name: overview
description: RCN's purpose, collaborators, communities, and the current state of the IBIS tooling work
sources: [backfill]
aliases: [RCN, ReLocalize Creativity Network, IBIS tools]
---

## Purpose & context

- [stated] Marc is a co-founder of ReLocalize Creativity Network (RCN), an unincorporated, open-source, voluntary enterprise
- [stated] RCN provides vernacularized visual modeling tools and methods for neighborhood-scale self-organizing and systems thinking
- [stated] RCN works with neighborhood leaders across four communities: Superior AZ, Lansing MI, Columbia Valley WA, and Austin TX, with connections to India
- [stated] Shared focus areas across the communities: affordable food, housing, job creation, community health workers, and navigation of funders and municipal government
- [stated] RCN's growth model is exponential neighborhood-to-neighborhood propagation via SODOTO (See One Do One Teach One — a symmetric train-the-trainers method), not rapid internal scaling
- [stated] Core collaborator: Kerry Turner, mathematician and operational researcher with a System Dynamics background
- [stated] Core collaborator: Robin Asby, mathematician and physicist, Stafford Beer colleague, Metaphorum founder, and community organizer; developing cybernetics of nested governance and VSM (Viable Systems Model) applications for neighborhoods
- [stated] Marc, Kerry, and Robin are all cyberneticians
- [stated] Marc's broader intellectual project maps RCN's modeling tools onto a Story Structure framework as a master reference frame, chosen because it is the most universally understood and complete framework legible to groups

## Current state

- [stated] Marc has been building a suite of standalone HTML tools for RCN's IBIS (Issue-Based Information System) work
- [stated] IBIS Canvas Mapper (`ibis-map.jsx`): interactive spatial map editor with persona attribution, auto-layout (Reingold-Tilford tree), Story generation, and export to Markdown, DOCX, SVG, and JSON
- [stated] IBIS Extractor: companion standalone HTML tool using the Anthropic API directly from the browser to extract argument structure from conversation text
- [stated] More MORE Outliner (`more-outliner.html`): collapsible tree outliner with hoisting, clone nodes (synced across instances), and drag-to-reorder — identified as the right foundation for addressing the readability problems of spatial canvas maps
- [stated] IBIS-MORE: a recently developed fork of More MORE adding IBIS type coloring, edge labels, a Claude exploration panel (node-click-to-explore with proposal acceptance workflow), and import/export in multiple formats
- [stated] IBIS-MORE workflow: clicking a node seeds a Claude conversation in a side panel, the user converses freely, Claude proposes new IBIS nodes as a checklist, and the user accepts or rejects proposals before merging into the map
- [stated] Bugs resolved during IBIS-MORE development: a missing script tag causing raw JS rendering; accepted proposals appearing as empty placeholders (race condition in `acceptSelected`); localStorage storing broken state preventing JSON file display
- [stated] Marc has done substantive intellectual work mapping Story Structure against IBIS — identifying what each framework can and cannot hold, and producing comparison diagrams, IBIS JSON maps, and annotated documents that make tool limits visible

## On the horizon

- [stated] Continued refinement and deployment of IBIS-MORE for RCN's neighborhood systems thinking work
- [stated] Ongoing development of Robin Asby's nested governance / VSM applications for neighborhoods
- [stated] Potential further tool development as RCN's community network grows

## Tools & resources

- [stated] Anthropic API, used directly from the browser in IBIS Extractor
- [stated] JSZip + raw Open XML for DOCX export
- [stated] IBIS (Issue-Based Information System) methodology — Rittel & Kunz
- [stated] Viable Systems Model (VSM) — Stafford Beer
- [stated] System Dynamics — Barry Richmond / Peter Senge lineage
- [stated] More MORE Outliner as the foundation for tree-based IBIS work
- [stated] Starter JSON files for tool initialization (`ibis-more-starter.json`)
