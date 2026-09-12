# The RCN Design Record — book plan and index

**Status date:** 2026-09-11. This file is the compass: what the work is, what is written, what is still to write, what is open, and what to do next. Update it after every drafting session.

## What we are doing

Two deliverables, in order.

**First, the book.** A full write-up of the theory and methods behind the RCN tools and methods, for people who really want to understand in depth what is behind them — newcomers and curious outsiders as much as Marc, Kerry and the four conveners. Written in reasoning voice: why each thing is shaped as it is, what substrate it rests on, what patterns it exists to interrupt, what corrections its design absorbed as it took form. It started life as "the RCN Design Record" behind a facilitator kit; late in Section 8 Marc observed that we are in fact writing a book, and that reshapes it: a title, a structure a cold reader can pick up, a publication path.

**Second, the tool kit.** With the book in hand, Marc and Claude build the field guide — the thing people grab tools from. Operational prose, imperative where a convener needs a specific move named, drafted against the book once the book is stable. Chat's kit discussion is at turns 104–107 of `13-drafting-conversation.md`; Marc settled on Option A there: mostly narrative operational prose, with imperative form when the convener needs a specific move named. Nothing of the kit has been drafted yet.

Delivery medium for both: FedWiki page JSON (with Neo4j for the structured graph), drafted here as pipeline markdown first. Publishing order per Marc's standing rule: .md → FedWiki → edit and discuss → .md → then HTML and PDF.

## The twelve sections and where each stands

| # | file | latest layer | state |
|---|---|---|---|
| 1 | `01-origin-and-purpose.md` | rewrite (2026-09-11) | awaiting Marc's reactions; RCN/WWHA glossed for a cold reader; the Linkage Mapping phases are noted as the field guide's spine, not a section |
| 2 | `02-four-principles.md` | rewrite (2026-09-11) | awaiting Marc's reactions; Principle Two retitled; Principle Four 'measured by their own measures' |
| 3 | `03-vsm-at-neighborhood-scale.md` | rewrite (2026-09-11) | awaiting Marc's reactions — the VSM→e-VSM mapping and the RenDanHeYi mapping are first passes offered for correction; e-VSM shared reference now lives here |
| 4 | `04-founded-commons.md` | rewrite (corrected 2026-09-11) | Chris/Jerry fixed in three places; kit → field guide; awaiting Marc's reactions |
| 5 | `05-customer-scenario.md` | rewrite (vocabulary pass 2026-09-11) | awaiting Marc's reactions |
| 6 | `06-industry-platform.md` | rewrite (vocabulary pass 2026-09-11) | awaiting Marc's reactions; value chain flow diagram in `sources/rcn-value-chain-flow.json` needs rendering |
| 7 | `07-moods-and-speech-acts.md` | rewrite | awaiting Marc's reactions |
| 8 | `08-between-institution-project.md` | rewrite (2026-09-11) | awaiting Marc's reactions; diagram in `diagrams/`; the footnote convention (tools and methods listed at the end of a section) starts here |
| 9 | `09-catalytic-seed-capital.md` | rewrite (2026-09-11) | awaiting Marc's reactions; the RCN gates proposal is the thing to argue with; two diagrams in `diagrams/` |
| 10 | `10-value-by-residents.md` | rewrite (2026-09-11) | awaiting Marc's reactions; CAM item pool recovered to `sources/`; anti-capture properties to revisit after the field guide |
| 11 | `11-prior-work-substrate.md` | first draft | awaiting Marc's edits; propagate the Chris/Jerry correction |
| 12 | `12-open-questions.md` | first draft (second attempt) | awaiting Marc's edits |

Each section file holds every layer in order — first draft, Marc's verbatim edits from the Pages file (his comments are the paragraphs wrapped in parentheses), the conversation about the edits, and the rewrite where one exists — with Claude's delivery notes after each version. The latest layer is the working text.

## Next actions, in order

**Agreed working order (Marc, 2026-09-11):** Marc sends his edits to Sections 9–12 one at a time; Claude rewrites each as it arrives; when all twelve rewrites exist Marc reads them all in one pass and they go over it together; then the tool kit.

1. **Sections 11–12** — 9 and 10 done. As each `.pages` file arrives: copy it to `sources/`, pull the text into the section file, rewrite.
2. **One review pass over all twelve** with Marc. Places already flagged for argument: Section 8's speech-acts Customer role, the Ackoff retelling's length, the single nesting-plus-network diagram, and whether "Forms of neighborhood value creation" belongs in Section 10; Section 3's Beer→e-VSM and RenDanHeYi mappings; Section 1's "field guide" against Marc's "tool kit"; Section 9's proposed three gates and the tool-state colors on the lifecycle diagram; Section 10's Likert answer and the Bill Mahoney attribution.
3. **Book-level work**: title; the cold-reader structure (Section 1 now glosses RCN and WWHA, but is it an introduction?); whether Section 8 splits; which of Sections 9–12 survive as chapters; a publication path.
4. **Then the field guide (the tool kit).**

Work items Sections 9 and 10 surfaced: run one ME by hand end to end at small scale, simulating the red boxes on `diagrams/me-lifecycle-end-to-end.rcn.json`; work out the RCN gates with that first ME; build a weighted-selection matrix tool (and look at Vester's sensitivity model for project selection); integrate Rasch with e-VSM results, including revising the survey's questions for measurement in neighborhoods (Bill Mahoney's complaint); run the scenario-validation experiment on synthetic respondents through the real aggregator; revisit the six anti-capture properties after the field guide exists.

Work items Section 8 surfaced, beyond the sections: write the school-refugee-transition scenario in full (the first real one) and a playbook for how an Experience-ME writes one; run the EIP Stage → value network → VAM test on that scenario in Claude Code; decide whether Section 8 splits (the Ackoff case and the RCN Workbench are candidates for short sections of their own); the pattern-language book Marc proposed (Alexander) as a companion to the tool kit — a book-level decision.

Two Claude Code sessions Chat flagged as separate pieces of substrate work, not part of the book: SODOTO portfolios extension (what a portfolio entry contains, how it attaches to individuals/MEs/Platforms, how it surfaces in bidding); CfA-dSC enhancement for chartering, VAM specification, speech-act instrumentation and gated funding.

## Open design questions

Carried from the chat, with where they live:

- How to write scenarios well — a playbook for Experience-ME scenario creation (Section 5; `sources/pastes/turn-136-*` are Marc's FedWiki pages on it)
- Curriculum in SODOTO for the ME formation sequence and tool skills
- Founded-commons succession — biology, sociology, anthropology, not engineering (Section 4, Section 12)
- The Platform's own S4 function at the scale of the neighborhoods it serves — noted, not developed (Section 6, Section 12)
- WWHA charter's specific structural properties to preserve (Section 6)
- e-VSM does not yet handle explicit links to the environment shown in `sources/rcn-graph-of-evsm.svg`; recursion is a separate e-VSM survey per level linked in Neo4j (Section 3)
- Speech acts: who the primary-ME promises to, and who declares satisfaction — resident as primary Customer, Platform as secondary, EMC members as Performers (Section 7, Section 8)
- Marc's own nine-state speech-act state machine (`sources/pastes/turn-154-1-dunham-conversation-for-action.svg` and the second screenshot) — his preferred visualization, possibly his own origination; which rendering is better only the observer can say

Settled vocabulary is in `handoff-2026-09-10.md` and is not repeated here.

## What is in this folder

| path | what |
|---|---|
| `index.md` | this file |
| `00-prework-conversation.md` | turns 0–68: the theory settled before drafting — the two biases, Ashby–Conant, Linkage Mapping, founded commons, McKnight, catalytic capital, Haier's Industry Platform, value by residents |
| `01-` … `12-*.md` | the twelve sections, all layers |
| `13-drafting-conversation.md` | turns 69–166: everything said around the drafts, with section bodies replaced by pointers |
| `handoff-2026-09-10.md` | Chat's state dump at the compaction wall — vocabulary decisions, entities, pending asks (copy; the original is in `docs/RNC Book Files/`) |
| `substrate-notes.md` | Chat's notes on Story Structure and the Dunham conversation-for-action (2026-09-11) |
| `chat-memory/` | Chat's 45 memory files as exported — `areas/design-record-drafting.md` is the running log with the per-section ripple lists |
| `sources/` | the files Marc uploaded to the two chats, gathered from Downloads and Desktop, plus his later `.pages` edits and the recovered CAM item pool; `sources/pastes/` holds the text he pasted, including his FedWiki pages on customer scenarios, Story Structure and the action conversation |
| `chat-export/` | the raw account export (gitignored where large) and the two full transcripts |
| `diagrams/` | RCN Graph Tool JSON for the book's diagrams; validated with `../tools/validate-rcn-graph.js`; render by opening the tool with `?url=` or dragging the file in |
| `build-design-record.py` | rebuilds the section and conversation files from the export and the Pages files; the Pages reader is in there |

Turn numbers throughout index `chat-export/organizing-local-projects.md`, which is the full transcript of "Organizing local projects into actionable plans" (chat uuid 2f737cc8-4f75-402d-86b1-8b5b63e99882 in Chat; 167 turns, Aug 30 – Sep 11 2026). Times in the files are UTC as the export recorded them; Marc's local time is seven hours earlier.

## Working rules for the rest of the arc

- Every draft and rewrite lands in this folder at the moment it is produced, and is committed. Nothing substantive lives only in a conversation.
- Pipeline files stay `.md`, one line per paragraph. FedWiki page JSON is built from them at publish time with the fedwiki-page skill.
- Marc edits in Pages if he likes; the `.pages` file goes in `sources/` and the build script (or a hand pass) pulls the text into the section file verbatim.
- Diagrams are RCN Graph Tool JSON in `diagrams/`, rendered to SVG for the book and kept editable as rcngraph items in FedWiki.
- From Section 8 on, each section ends with "Tools and methods named in this section" — the footnote convention Marc proposed, one list per section with repo paths.
- Sources of truth for the tools live in the repo, not here: `tools/schemas/*.md`, `docs/value-network-notation.md`, `docs/evsm-*.html`. This folder points at them.
