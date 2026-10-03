# Shared Shape For Coded Agreements

A design note, for review before any code changes. It proposes one way to store an agreement coded with Ostrom's Institutional Grammar, used the same way by the Agreement Checker, the Graph Tool, FedWiki, and the database. The reason for wanting it is on [[Commons Viability From Agreement Coding]]. What it would let a group check is on [[Ostrom Design Principles And Agreement Coding]].

## Why one shape

Today each tool keeps the coding its own way. The checker holds it in the browser. The drawings keep it in node properties. FedWiki pages hold only the sentences. The database holds none of it.

Two of those ways would go wrong as soon as the coding travels. The Graph Composer treats nodes with the same kind and the same name as one thing, so every statement in a drawing would collapse into one. The database merges drawing nodes by kind alone, so "WHO?" and "GARDENERS" would become two wordings of one idea.

Both behaviours are right for what they were built for: drawings of ideas, where "Housing" in two drawings really is one idea. A coded agreement is different. Each sentence is one particular rule, adopted by one particular group, with its own parts. It needs to be stored as a record.

## The things

**Agreement.** One document a group adopted: a bylaw, a charter, a house agreement. It knows its title, where it lives (a FedWiki page or a file), when it was adopted, and which group adopted it.

**Statement.** One sentence of an agreement, with exactly one MUST, MAY, or MUST NOT, or one creating agreement. It carries:

- its own words, as the group wrote them
- its answers to the questions, as fields: WHEN?, WHO?, MUST, MAY, OR MUST NOT?, DO WHAT?, TO WHAT?, HOW?, OR ELSE? for a rule; WHAT ARE WE CREATING?, MUST OR MAY?, FORMED?, OUT OF WHAT? for a creating agreement
- its strength: agreed rule, shared expectation, shared habit, or creating agreement
- its level: operational, collective choice, or constitutional
- its rule type: boundary, position, choice, aggregation, information, payoff, or scope
- who coded it, and whether the group has checked the coding
- whether it is in force, proposed, or retired

**Role, group, or resource.** The people and things the statements are about: the water keeper (a role), gardeners (a group), the tank (a resource). These already exist in the database's Ostrom layer as positions, participants, and resources, so coded agreements use them rather than inventing new ones.

**Observation.** A piece of evidence about whether a statement is followed in practice: a log, a survey answer, an SPC chart, a signed badge, or someone's account. Each is marked observed or asserted, the same distinction the database already makes on every transaction.

## The links

A statement belongs to its agreement.

A rule's WHO points to a role or group. Its TO WHAT? points to a resource when there is one.

A creating agreement points to the role, group, or resource it creates.

A statement points to the statement that backs it: the red "backed by" line in the drawings. This is Ostrom's vertical nesting.

Statements joined by ALL OF THESE, ONE OR MORE, or EXACTLY ONE point to a join, which carries which of the three it is. This is Ostrom's horizontal nesting.

A statement points to the action situation it governs, in the database's existing Ostrom layer. That is what turns a situation's rule types from "unspecified" to "specified".

An observation points to the statement it is evidence about.

Two links are never stored, because they can always be worked out. The purple "defined by" line follows from a rule's WHO and the creating agreement that created it. The checker's "what does this rule assume already exists?" question is the same lookup, run the other way.

## Who is the same as whom

This is the part that fixes the collapse. Four rules:

1. **A statement is its own thing.** It is identified by its agreement plus a statement number that never changes, even when the wording is edited. Two statements are never merged, however alike their words.
2. **A part belongs to its statement.** "MUST NOT" in sentence 1 and "MUST NOT" in sentence 2 are two separate answers.
3. **Roles, groups, and resources are shared within a commons.** "Gardeners" in sentence 1 and "gardeners" in sentence 6 of the same garden are one group, so every rule about gardeners links to the same place. "Gardeners" in two different gardens are two groups. A link between them is made on purpose, for example when one garden belongs to a larger network.
4. **Ostrom's term says what kind of thing something is.** Attributes, Deontic, Constituted Entity: these classify. Identity comes from rules 1 to 3.

In the Graph Tool this means: each statement node and each answer node carries a name built from its agreement and statement number, so the Composer keeps them apart; role, group, and resource nodes carry their plain name, so they merge across sentences; and the question nodes in the teaching drawing stay unnamed, because they really are "the kind itself".

## One file, many views

The source of truth is a coded-agreement file, written by the Agreement Checker and kept beside the agreement itself. The drawing, the FedWiki page, and the database are all built from it. Nothing writes coding back from a drawing, because a drawing is where people move boxes around, and moving a box should never change what a rule says.

A sketch of the file, for the first garden sentence. The garden's name and date are made up:

```json
{
  "agreement": { "id": "garden-bylaw", "title": "Garden Bylaw", "commons": "Elm St Community Garden", "adopted": "2026-04-12" },
  "statements": [
    { "n": 1, "kind": "rule", "text": "Gardeners must not water on days not assigned to them, unless hand-watering seedlings.",
      "when": "unless hand-watering seedlings", "who": { "group": "gardeners" }, "deontic": "MUST NOT", "do": "water",
      "how": "on days not assigned to them", "backedBy": 4,
      "strength": "agreed rule", "level": "operational", "ruleType": "choice",
      "codedBy": "the checker, corrected by the group", "groupChecked": true, "status": "in force" }
  ],
  "roles": [ { "name": "water keeper", "createdBy": 5 } ],
  "groups": [ { "name": "gardeners", "createdBy": 6 } ],
  "resources": [ { "name": "the tank", "createdBy": null } ],
  "observations": []
}
```

The names in this file are the plain ones. Ostrom's terms are added when the file is read: "who" becomes Attributes, "do" becomes Aim, and so on, from one table kept in one place.

## How each tool carries it

**Agreement Checker.** It already keeps one record per sentence. It would add a stable statement number, the agreement's title and commons, and the list of roles, groups, and resources. Then it saves and opens coded-agreement files, besides making drawings.

**Graph Tool.** The drawings look the same. Their nodes gain the names from the identity rules, and each node records which statement and which question it comes from.

**FedWiki.** One page per agreement. Each sentence is its own story item, so it can be searched, linked, and forked. The coding travels with the page, first as a coded-agreement file attached to it, and later as its own item type, the way drawings travel as graph items today.

**The database.** A loader reads coded-agreement files into the Ostrom layer: agreements, statements, their links to roles, groups, resources and action situations, and observations. It keys statements by agreement and number, and roles, groups, and resources by commons and name. The idea-merging used for drawings is never applied to statements.

## What the viability profile then reads

Each design principle becomes a question asked of the stored statements. Principle 3, collective choice: is there any statement at the collective-choice level whose WHO includes the groups the operational rules apply to? Principle 5, graduated sanctions: does any rule have more than one statement backing it, stepping up? Principle 4B, monitoring the resource: does any WHEN? depend on a reading of a resource that no statement makes anyone responsible for?

This answers one of the database's own open questions. Design principles live as questions over the stored statements, so a group can see exactly which sentences each answer came from.

## Not settled here

The plain names for Ostrom's Conditions. WHEN? and HOW? are still stand-ins.

What to do when a WHO names two groups, such as "gardeners and volunteers": one statement pointing to two groups, or two statements.

What counts as an observation, and who may add one. This touches people's privacy and needs the same care as the Relationship Record: nothing about a person without that person.

Where coded-agreement files live: in the repository, as FedWiki assets, or both.

The richer levels of Ostrom's grammar, IG Extended and IG Logico, are left for later. This shape is IG Core.

## What would change

The Agreement Checker gains saving and opening coded-agreement files, statement numbers, and a commons name. The drawing export follows the identity rules. The teaching drawing gets names on its answer and statement nodes. A new loader brings coded agreements into the database's Ostrom layer. Nothing that already exists in the database changes, and no existing drawing is rewritten.

The suggested order: agree this note; then the file format and the checker; then the drawing names; then the loader; then the viability profile as questions over what is loaded.
