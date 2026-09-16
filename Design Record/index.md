# The RCN Design Record — book plan and index

**Status date:** 2026-09-11. This file is the compass: what the work is, what is written, what is still to write, what is open, and what to do next. Update it after every drafting session.

## What we are doing — the three things

Marc's structure, stated plainly (2026-09-14): **the 12, the 6, and the Kit.** Three deliverables, nested, each written for a different reader.

**The Book — thirteen sections now.** The RCN Design Record: the theory and methods behind everything, in reasoning voice, for people who want to understand in depth what is behind the tools and methods. It started at twelve sections; on 2026-09-14 a new Section 12 on the Federated Wiki and the foundational tools was added at Marc's request and Open Questions became Section 13. Files `01-` to `13-` in this folder; clean copies in `review/`.

**The Field Guide — six files.** How a convener runs one neighborhood through one cycle: `00-how-to-use-this-guide.md` and the five phases, `01-` to `05-`, in `field-guide/`. Operational voice, imperative where a move is named, one worked example carried through. Written for a convener doing, not a reader thinking. Each phase says where in the Book its reasoning lives.

**The Kit — the pattern language.** The tools and methods themselves, the things people grab: `kit/pattern-language.md`, thirty-two patterns on Alexander's model, each with its problem, its move, what it needs, its state, where to learn it, and its Basic / Intermediate / Advanced ladder; the network drawn in `diagrams/`. This is the seed of the RCN pattern-language book, and of the SODOTO skill pages, one triple per pattern, that will teach each tool in FedWiki. The Kit is the thing Chat and Marc first called "the kit"; the Field Guide is the sequence for using it.

The Book explains, the Field Guide sequences, the Kit equips. A convener can run the Field Guide without the Book; the Field Guide cannot be run without the Kit; the Kit makes no sense without the Book. All three are delivered as FedWiki pages, drafted here as pipeline markdown. Publishing order per Marc's standing rule: .md → FedWiki → edit and discuss → .md → then HTML and PDF.

## The Book's sections and where each stands

| # | file | latest layer | state |
|---|---|---|---|
| 1 | `01-origin-and-purpose.md` | rewrite (2026-09-11) | awaiting Marc's reactions; RCN/WWHA glossed for a cold reader; the Linkage Mapping phases are noted as the field guide's spine, not a section |
| 2 | `02-four-principles.md` | rewrite (2026-09-11) | awaiting Marc's reactions; Principle Two retitled; Principle Four 'measured by their own measures' |
| 2b | `02b-seven-protection-principles.md` | first draft (2026-09-15) | NEW — the seven protection principles (safety writ large), stated beside Section 2's four; from the Paris Safety Meeting deck, Reason, Tripod Beta/Delta, ORM, Amalberti, Mahoney, Pieper; awaiting Marc's reactions |
| 3 | `03-vsm-at-neighborhood-scale.md` | rewrite (2026-09-11) | awaiting Marc's reactions — the VSM→e-VSM mapping and the RenDanHeYi mapping are first passes offered for correction; e-VSM shared reference now lives here |
| 4 | `04-founded-commons.md` | rewrite (corrected 2026-09-11) | Chris/Jerry fixed in three places; kit → field guide; awaiting Marc's reactions |
| 5 | `05-customer-scenario.md` | rewrite (vocabulary pass 2026-09-11) | awaiting Marc's reactions |
| 6 | `06-industry-platform.md` | rewrite (vocabulary pass 2026-09-11) | awaiting Marc's reactions; value chain flow diagram in `sources/rcn-value-chain-flow.json` needs rendering |
| 7 | `07-moods-and-speech-acts.md` | rewrite | awaiting Marc's reactions |
| 8 | `08-between-institution-project.md` | rewrite (2026-09-11) | awaiting Marc's reactions; diagram in `diagrams/`; the footnote convention (tools and methods listed at the end of a section) starts here |
| 9 | `09-catalytic-seed-capital.md` | rewrite (2026-09-11) | awaiting Marc's reactions; the RCN gates proposal is the thing to argue with; two diagrams in `diagrams/` |
| 10 | `10-value-by-residents.md` | rewrite (2026-09-11) | awaiting Marc's reactions; CAM item pool recovered to `sources/`; anti-capture properties to revisit after the field guide |
| 11 | `11-prior-work-substrate.md` | rewrite (2026-09-11) | awaiting Marc's reactions; needs a paragraph from Marc or Kerry on ReLocalize Health and Seeing the Systems; four unverifiable points flagged in its notes |
| 12 | `12-federated-wiki-and-tools.md` | first draft (2026-09-14) | NEW — needs Marc's and Ward's account of why the wiki was chosen, and Ward's read |
| 13 | `13-open-questions.md` | rewrite (2026-09-11), renumbered | rewritten from Sections 1–11 as rewritten; awaiting Marc's reactions |

Each section file holds every layer in order — first draft, Marc's verbatim edits from the Pages file (his comments are the paragraphs wrapped in parentheses), the conversation about the edits, and the rewrite where one exists — with Claude's delivery notes after each version. The latest layer is the working text.

## Next actions, in order

**Agreed working order (Marc, 2026-09-11):** Marc sends his edits to Sections 9–12 one at a time; Claude rewrites each as it arrives; when all twelve rewrites exist Marc reads them all in one pass and they go over it together; then the tool kit.

1. **All twelve sections are at the rewrite layer** as of 2026-09-11. Marc's review copies are in `review/` — one clean file per section holding only the latest text.
2. **One review pass over all twelve** with Marc. Places already flagged for argument: Section 8's speech-acts Customer role, the Ackoff retelling's length, the single nesting-plus-network diagram, and whether "Forms of neighborhood value creation" belongs in Section 10; Section 3's Beer→e-VSM and RenDanHeYi mappings; Section 1's "field guide" against Marc's "tool kit"; Section 9's proposed three gates and the tool-state colors on the lifecycle diagram; Section 10's Likert answer and the Bill Mahoney attribution; Section 11's Whatcom-institutions paragraph and the Rippel correction.
3. **Book-level work**: title; the cold-reader structure (Section 1 now glosses RCN and WWHA, but is it an introduction?); whether Section 8 splits; which of Sections 9–12 survive as chapters; a publication path.
4. **Then the field guide (the tool kit)** — first pass drafted; Marc's reactions on 1, 2, and the Kit applied; 3–5 next; then the remaining thirty-one SODOTO triples in `kit/skills/`, on the e-VSM model.

Work items from Marc's review of the pattern language (2026-09-14): patterns for the RCN Table, the Graph Composer and Causal Loop Diagramming; the SODOTO Basic / Intermediate / Advanced pages, one triple per pattern, in FedWiki.

Work items from Marc's review of Section 3 (2026-09-14): a VSM of an Industry Platform on its own, and research on how platforms interact with EMCs as against MEs; adapt Pérez Ríos's recursion diagram in the Graph Tool to make multi-recursion visible; e-VSM 2.0 — the minimum sufficient environmental entity types, aligned with EIP's vocabulary so the Neo4j schema is one, then update the survey tools; the Friston computing-layer question; Ashby / Conant–Ashby awareness in the EIP Stage Sketch and a Snowden-like sorting of problems by variety; Section 11's Ripple ReThink sentence to align with Marc's Section 3 wording.

Work items from Marc's review of the field guide's Phase 2 (2026-09-14): decide the replacement for "interlocking needs" (Marc dislikes it; "interlocking needs" is used in Phase 2 pending discussion) and apply it throughout the record and guide; retrieve the Medford chevron graphic (Confluence LMID attachment 'Phases of Linkage Mapping Work.png') and finish the five-phases diagram from it; a linkage-map legend preset for the Graph Tool; Value Stream Mapping and A3 Problem Solving added as patterns 30 and 31 and woven into Sections 8 and 11 and Phases 4 and 5 (done 2026-09-14).

Work items from Marc's review of the field guide's Phase 1 (2026-09-14): Chris, Jerry, Carl and Brent each contribute one well-developed scenario to the repository before the guide is shared beyond RCN; Marc and Claude re-check the neighborhood e-VSM survey against the guide and Section 3 and update its labels and questions; refine the list of neighborhood "worlds" (first pass is in Phase 1); an RCN Table for the small groups and a schema entry for a small group in Neo4j; validate the outside founded-commons examples (Men's Sheds, Repair Cafés, UK community pubs, settlement houses) and add detail.

Work items Sections 9 and 10 surfaced: run one ME by hand end to end at small scale, simulating the red boxes on `diagrams/me-lifecycle-end-to-end.rcn.json`; work out the RCN gates with that first ME; build a weighted-selection matrix tool (and look at Vester's sensitivity model for project selection); integrate Rasch with e-VSM results, including revising the survey's questions for measurement in neighborhoods (Bill Mahoney's complaint); run the scenario-validation experiment on synthetic respondents through the real aggregator; revisit the six anti-capture properties after the field guide exists.

Work items Section 8 surfaced, beyond the sections: write the school-refugee-transition scenario in full (the first real one) and a playbook for how an Experience-ME writes one; run the EIP Stage → value network → VAM test on that scenario in Claude Code; decide whether Section 8 splits (the Ackoff case and the RCN Workbench are candidates for short sections of their own); the pattern-language book Marc proposed (Alexander) as a companion to the tool kit — a book-level decision.

Two Claude Code sessions Chat flagged as separate pieces of substrate work, not part of the book: SODOTO portfolios extension (what a portfolio entry contains, how it attaches to individuals/MEs/Platforms, how it surfaces in bidding); CfA-dSC enhancement for chartering, VAM specification, speech-act instrumentation and gated funding.

Work items from the safety thread (2026-09-15): the latent-condition survey as a pipeline .md — DRAFTED 2026-09-16 as `docs/neighborhood-protection-survey.md`, awaiting Marc's reactions (eleven BRFs in neighborhood terms, observable yes/no items, Mahoney's six vigilance items with 'leadership' read as the outside per McKnight, everyone answers, Worlds carry perspective); the field-guide insertions Section 2b's closing paragraph proposes (protection clause and barrier reading in the Charter, domain and safety model on the Customer Scenario, the substitution test in the Retrospective, the survey in Phase 1); then reconfigure the NRM tool to serve the practice (IAD bands as rows, HFACS classification per node type, Annex 6 validator with empty-band warnings, stepwise reveal as FedWiki items).

## Open design questions

Carried from the chat, with where they live:

- How to write scenarios well — a playbook for Experience-ME scenario creation (Section 5; `sources/pastes/turn-136-*` are Marc's FedWiki pages on it)
- Curriculum in SODOTO for the ME formation sequence and tool skills
- Founded-commons succession — biology, sociology, anthropology, not engineering (Section 4, Section 13)
- The Platform's own S4 function at the scale of the neighborhoods it serves — noted, not developed (Section 6, Section 13)
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
| `01-` … `13-*.md` | the Book's sections, all layers |
| `13-drafting-conversation.md` | turns 69–166: everything said around the drafts, with section bodies replaced by pointers |
| `handoff-2026-09-10.md` | Chat's state dump at the compaction wall — vocabulary decisions, entities, pending asks (copy; the original is in `docs/RNC Book Files/`) |
| `substrate-notes.md` | Chat's notes on Story Structure and the Dunham conversation-for-action (2026-09-11) |
| `chat-memory/` | Chat's 45 memory files as exported — `areas/design-record-drafting.md` is the running log with the per-section ripple lists |
| `sources/` | the files Marc uploaded to the two chats, gathered from Downloads and Desktop, plus his later `.pages` edits and the recovered CAM item pool; `sources/pastes/` holds the text he pasted, including his FedWiki pages on customer scenarios, Story Structure and the action conversation |
| `chat-export/` | the raw account export (gitignored where large) and the two full transcripts |
| `review/` | the latest text of each section with nothing else — Marc's reading and editing copies, rebuilt from the section files whenever a rewrite lands |
| `field-guide/` | the Field Guide: how to use, and Phases 1–5 |
| `kit/` | the Kit: `pattern-language.md`; `tool-index.md` pointing at every tool's intro, manual, deck and schema; `skills/` with the SODOTO triple template and the e-VSM triple as the model |
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
