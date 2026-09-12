# Substrate Notes for the RCN Design Record

**Purpose:** Reference notes on substrate materials the Design Record draws on, captured from prior working sessions so future drafting has the descriptions to hand. Each entry names the source, what was established about it, and what remains open. Where the underlying artifact is a file (JSON, image), the filename is noted so it can be re-loaded when needed.

**Scope:** Two entries at present — Story Structure model, Dunham Conversation for Action diagram. Additional substrate (e-VSM, VNA, Ackoff Bell Labs, EIP Stage Sketch) is documented in its own `/areas/` memory file or in `~/rcn` and does not need duplication here.

---

## Story Structure model

### What it is

Marc's own model, developed as an RCN Graph Tool drawing. Serves as connective narrative vocabulary across the Design Record — cross-culturally native, cross-mappable to most other frameworks including Ostrom's IAD.

Source artifact: `Simple-Story-Structure-Plus-Organizing-Path.json` (RCN Graph Tool JSON format).

### Structure

Twenty-six nodes across seven color-coded categories, fifty-nine directed edges connecting them.

**The seven categories:**

- **Settings and Affordances (props)** — the physical, social, and material context the situation happens in, and the resources available within it.
- **Kipling context** — six questions placing the situation in time, space, and cause: When, Where, Who, Why-Purposes, How-Mechanisms, What-Outcomes.
- **Characters** — with Points of View, Strategies (How), Motives (Why), Beliefs (six answers), Moods. The interior life of the people in the scenario: how they see, what they want, what they believe, how they feel.
- **Actions / Scenes / Roles / Plot / Dialogue / Stage** — the unfolding of what happens, played by whom, in what sequence.
- **Events as new states** — the moments where the situation changes, becoming something it was not before.
- **Learnings** — what characters come to understand through the events; loops back to inform Motives, Beliefs, Moods, Roles, Strategies, Settings.
- **Audience** — who receives what the story teaches.
- **Organizes (AIC)** — a red node that ties into the organizing methodology.

### Formal grounding

**Object-Process Methodology (OPM) integrated.** Actions are OPM Processes; States are OPM Objects. This gives the story-structural elements formal grounding usable by tools that read OPM (including the Neo4j substrate via the OPM→Cypher exporter).

**AIC = Appreciation, Influence, Control.** Attributed to W.E. (Bill) Smith, *The Creative Power: Organizing Ourselves, Our Organizations and Our World*. Bill Smith is Marc's friend and colleague; Bill and his wife led the World Bank's most successful work globally using the AIC framework. AIC closely matches Marc's consulting approach. Marc has *The Creative Power* and related material as PDFs.

### How the categories interconnect

Actions, Strategies, Motives, and Beliefs mutually inform each other. Events change States. Scenes stage Actions. Learnings loop back to Motives, Beliefs, Moods, Roles, and Settings. The Audience receives Learnings. Moods and Beliefs are entangled with Motives — this is the same working layer Section 7 develops as coordination grammar, rendered here as narrative structure.

### How it's used in the Design Record

Section 5 introduces the categories with examples and references the graph for depth. Not every scenario needs every node. What the model offers is a checklist for what a well-formed scenario could hold and a diagnostic for what a poorly-formed one is missing.

- When a primary-ME cannot grasp what a compound-need scenario is asking for, Story Structure identifies what is under-developed — often Motives not articulated, Beliefs or Moods named but not shown, Settings and Affordances too thin for readers to imagine the situation concretely.
- When a vision-blueprint scenario fails to attract bidders, Story Structure identifies what would make the invitation more compelling — often Strategies and How needing more specificity, or Characters with multiple Points of View so potential EMC members can see themselves in the story.

Used as connective vocabulary throughout the Design Record where a section reaches into narrative territory.

### Open items

- The full 59-edge structure was inspected via bash in the prior chat but never captured in prose. If the specific edge relationships matter for a section, re-load the JSON.
- Marc has a Customer Scenario Graphic that was intended to accompany Story Structure discussion but did not extract cleanly from an earlier upload. Re-upload when relevant.

---

## Dunham Conversation for Action

### What it is

A framework structuring the five foundational speech acts (assertions, declarations, requests, offers, promises) into a four-phase conversation-for-action with nine possible moves.

Developed by Bob and Jean Dunham at the Institute for Generative Leadership, © 2000, 2008. Adapted from Winograd and Flores, *Understanding Computers and Cognition* (1986). Direct lineage back through Fernando Flores to Searle and Austin, with Wittgenstein as forebear.

Marc hired Bob Dunham to teach approximately 150 people in Whatcom County under the umbrella of Language, Moods, and Bodies of leadership.

Source artifacts (uploaded 2026-09-10):
- Classic Institute for Generative Leadership diagram — the Customer/Performer stick-figure form with speech-act labels across the four phases.
- A nine-state state-machine formalization diagram — same underlying framework rendered as a directed graph of states with speech-act transitions. Provenance of this second diagram to be confirmed with Marc.

### The two roles

- **Customer** — the one whose future the conversation is about.
- **Performer** — the one being asked to bring that future about.

### The four phases and their moves

**Phase 1 — Initiation.**
The Customer makes a Request of the Performer, specifying a condition of satisfaction. The Request opens the conversation. Well-formed Requests also specify a timeframe and any background constraints the Performer needs to know.

**Phase 2 — Negotiation.**
The Performer responds with one of four moves:
- **Promise** — accepting the Request as stated.
- **Decline** — refusing without counter-proposal.
- **Counteroffer** — proposing modified terms.
- **Commit-to-Commit** — deferring the substantive response to a later time.

If the Performer counteroffers, the Customer can respond with Accept, Decline, Counteroffer, or Commit-to-Commit. Negotiation continues until Promise and Accept converge on shared terms, or the conversation ends without commitment.

Throughout Negotiation, either party can Cancel (Customer) or Revoke (Performer) — moves that end the conversation before commitment is established.

**Phase 3 — Fulfillment.**
The Performer performs the promised action, then Declares complete to the Customer. Cancel and Revoke remain available if circumstances change. Well-managed Cancels and Revokes preserve trust; silent abandonment of the promise damages it.

**Phase 4 — Satisfaction.**
The Customer Declares satisfied or Declares dissatisfied. Dissatisfaction opens the possibility of the Performer taking additional action to satisfy, or the conversation ending without full satisfaction while the parties acknowledge what happened.

### The five foundational speech acts (Section 7 substrate)

The Dunham framework operationalizes the five foundational speech acts from the Flores-Searle tradition:

- **Assertions** — claims about how things are; can be true, false, or unsupported.
- **Declarations** — speech acts that bring something into being by being spoken by someone with the standing to make them (declaring a marriage, declaring a project complete, declaring satisfaction).
- **Requests** — speech acts that ask another party to bring about a future, with conditions of satisfaction and a timeframe.
- **Offers** — the mirror of requests: proposals to perform an action for another party, with conditions of satisfaction and a timeframe.
- **Promises** — speech acts that commit the speaker to perform an action, with conditions of satisfaction and a timeframe. A well-formed promise names who is committing, what they are committing to, by when, and under what conditions.

The sixth-category discipline around declining requests and offers is load-bearing for the field guide and often gets omitted in Flores treatments; the Design Record names it explicitly.

### The three conversation types (Marc's extension)

Marc uses a fuller framework than the classic Dunham diagram alone. In it, the Conversation for Action is preceded by two others:

- **Coffee conversation** (Marc + Robin Asby) — precedes even the possibility conversation. Asks whether there is any interest in shared futures at all.
- **Conversation for Possibility** — Dunham's conversation exploring what futures might be worth pursuing before any specific Request is made.
- **Conversation for Action** — the Dunham nine-state framework proper.

### Shared background of understanding

Dunham plus Marc: a shared background of understanding must be developed alongside conditions of satisfaction and time **before** any Request or Offer is made. This is the Phase 4 chartering discipline in the Design Record's field-guide phases.

### How it's used in the Design Record

Section 7 develops the nine states of the conversation for action as the coordination grammar underlying every ME's operational work. Section 8 develops CfA-dSC (Conversations for Action / Dyadic Smart Contracts) as the RCN foundational tool that instruments Promises, Declarations, Offers, and Requests through their conversation phases at operational scale.

The primary Customer in an RCN ME's work is the resident (declares satisfaction or dissatisfaction via the balanced scorecard plus e-VSM survey). The Platform is a secondary Customer (compensation depends on resident-recognized value). EMC members are Performers to the primary-ME's Customer role internally.

### Further reading named in the Design Record

- Winograd and Flores, *Understanding Computers and Cognition* (1986) — the source Dunham adapted from.
- Charles Spinosa, Fernando Flores, and Hubert Dreyfus, *Disclosing New Worlds: Entrepreneurship, Democratic Action, and the Cultivation of Solidarity* (MIT Press, 1997) — extends the framework into a philosophy of world-disclosing action; directly relevant to RCN neighborhood work.
- The Institute for Generative Leadership curriculum on Language, Moods, and Bodies of leadership — the applied tradition Marc drew on and taught.

The Design Record does not attempt to replicate these curricula. It names the vocabulary and the discipline; the deeper work happens elsewhere.

### Open items

- Provenance of the nine-state state-machine formalization (Image 2 in the 2026-09-10 upload batch): confirm whether this is the CfA-dSC state machine, Marc's own formalization, or something else. Its state numbering and transition labels differ from the classic Dunham diagram in ways worth capturing precisely.
