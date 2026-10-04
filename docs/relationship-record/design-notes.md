# Relationship Record — design notes

Working file for Marc + Claude Code, with RegenSonora (Chris Casillas, Mary Martha) in the room. Marc Pierson and Claude (Opus 5.5), October 2026.

"Relationship Record" is a placeholder name. It replaces "CRM". RegenSonora picks the real name, ideally in English and Spanish.

Shared with RegenSonora: `relationship-record-thinking.pdf` (built from the `.html` beside it), sent Oct 2 2026.

## Ground rules

- **No code until Marc explicitly agrees.** Design conversation only.
- **Don't say "substrate".** Marc hates the word. Say "the shared graph" or "the Neo4j graph".
- **No fork.** The data lives in the same Neo4j graph and fits the concept/instance (Option C) model. Table, Map, Timeline, Graph, ⇄ switcher, SPC and Rasch must all work on it.
- First users: RegenSonora, Superior AZ.

## Decided

- **Nothing about me without me.** The person a record is about can see it.
- **Subjects don't cross NDCs.** Each NDC's record is its own; no federation of people.
- **A relationship is a claim, not a fact.** Each one records who asserted it and when ("Marc says Dave knows Gil, Oct 2026"). This leans towards signed claims, matching the signed-JWT/DID direction.
- **Placeholder name: Relationship Record.** "Ledger" was rejected because it collides with the badge, currency and signed ledgers.

## Working model (proposed, not agreed)

- Small vocabulary: Person, Organisation, Relationship (claim), Contact/Touch (instance), Commitment, Need/Offer.
- People and organisations are concepts; many are already loaded (co-ops, the Sustainable Connections businesses, value-network roles).
- A touch is an instance: time, place, who was there.
- A commitment has the Institutional Grammar shape used by the Agreement Checker (who, deontic, aim, condition), plus a status. A follow-up is a commitment.
- Skills come from SODOTO badges. Needs and offers connect to the three-currency work.
- Trust and value ratings (in the style of PARTNER CPRM) would be claims too, if RegenSonora wants them at all.

## Three stories (Ganz) — agreed Oct 3 2026

Marshall Ganz's public narrative (story of me, story of we, story of now) is how the record draws out what people care about. Every story has the same three parts: challenge, choice, outcome. **The story of now is a story whose outcome is still blank**, so it is a Commitment, and each yes, no or "not yet" is a claim.

- **Me: told in pairs.** The teller tells one specific moment. The listener reflects it back ("what I heard you value was…"). That reflection is a claim ("Mary heard Chris value X"), and the teller accepts, fixes or rejects it. Nothing about me without me is the step itself.
- **We: the group tells it.** The graph can show values that several people named, but that overlap is a prompt for a kitchen-table conversation, not the story of we.
- **Now: one specific ask** with a date and a place, recorded as a commitment.

Decided:

- **The full Me story lives on the teller's own site.** The NDC record holds a link plus the values the teller agreed to share.
- **Values are free words in the teller's own language.** The group merges them in the We conversation, and the merging is the story of us. No starter list.
- **Health line:** a Me story's challenge is often an illness or a loss. The record holds that a story exists and the values it names, and nothing more.

Encoding (proposed): Story (kind me/we/now, teller, text or audio, challenge/choice/outcome, a moment with a fuzzy date and a place); Value (a concept, in the teller's words); Person → Value "holds" edges as claims. The edge style tells "teller said it" (solid) apart from "a listener heard it, not confirmed yet" (dotted).

Cave drawings: Me is a card (face, pin, year, two or three value words). We is a **campfire**: people in a ring, shared values inside the fire, values only one person named at the edge. Now is a thick arrow from the fire to one dated ask, and people who said yes get a green border. The Timeline can put all three on one line: Me moments in the past, the fire in the present, the ask on a future date.

Sample: `tools/three-stories-campfire.rcn.json` (six made-up Superior neighbors; hover a person for their Me story). It ends with a question for the group: are WATER and EL AGUA the same thing, and who decides?

## Tool views

| Tool | View |
|---|---|
| Table | contact list, open commitments, overdue follow-ups |
| Timeline | history with one person or organisation |
| Map | where people, organisations and visits are; coverage gaps |
| Graph | introduction paths, bridges, single points of failure |
| ⇄ switcher | one person across all four |
| SPC | touches per week, follow-up closure time; about the system, never a staff league table |
| Rasch | engagement ladder, only if it tests as one trait |

Missing today: a quick-log screen (phone, under about 20 seconds), commitments with reminders, and a ladder/board view.

## Hard constraints

- **Privacy breaks Layer 1.** Layer 1 static exports are public. This data needs a server with access control (Layer 2/3, `substrate/LAYERS-2-3.md`), and probably its own database with the same shape.
- **Health boundary.** The record holds *that* a contact happened (when, where, with whom). The *content* goes in the Shared Care Plan. Make the split structural, not a matter of policy.
- **Self-custody.** The person owns their did:key identity and their own site. The NDC holds only its side of the relationship.
- **Scope creep.** No email campaigns, donor management or grant tracking unless RegenSonora asks.

## Open questions (sent to RegenSonora)

1. Which three questions would they want answered on day one? This decides the first screens and the smallest data model.
2. What should it be called, in English and Spanish?
3. Who logs contacts, where, and on what device?
4. Where is the line between "we talked" and "what we talked about"?
5. How will people in Superior feel about seeing everything recorded about them? What would make that feel safe?
6. Is the person's view the same as *My Support Network*, or separate? Claude leans towards the same.
7. Do trust or value ratings between partners belong here at all?

## Changelog

- Oct 2 2026: first conversation. Research on CRM screens, questions and analytics. Discussion PDF sent to RegenSonora.
- Oct 3 2026: Ganz's three stories adopted as the way to draw out what people care about. Me stories live on the teller's own site; values are free words that the group merges. Sample campfire built in the Graph tool.
