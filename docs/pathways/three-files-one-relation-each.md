# Three Files One Relation Each

Three places record overlapping facts about the same set of practices. The split that keeps them from drifting.

DIAGRAM_rcn-three-files

- The [[SODOTO]] Skills Registry holds skills — what a person can be certified in. Version 0.1, 31 skills, one live credential.
- methods.json holds pathways — ordered uses of tools. Each step carries the question it answers, any gate that must hold first, and the handoff to the next step.
- catalog.json holds tools — what you can launch. It has no methods field, because a tool cannot carry sequence.

One relation each: a method requires a skill, a method uses a tool, and a tool may embody a method.

## Two status axes, not one

Confidence answers "does this method hold?" and is derived from Do One and Teach One attestations on the method itself. A Do One earns the first star; a Teach One whose learner then runs it earns the second. Because a star is computed from signed credentials it cannot be talked up. Zero stars is a normal, publishable state.

Transmissibility answers "can this method be taught?" and is read off the registry's Active, Ready and Candidate. It measures whether the method's constituent skills have mentors and teaching chains.

These are orthogonal and both are needed. A method can be well-proven and untransmissible — it works, but only its author can run it. Or highly transmissible and untested — everyone could learn it, nobody has tried it. Collapsing them would hide exactly the failure each is built to expose.

## Neo4j is a projection

The three files stay the human-editable, git-diffable source. Neo4j is rebuilt from them. If the database is down the storefront still works and the handout still opens; nothing load-bearing sits only in the graph.

What it makes cheap: derived back-links, impact analysis before a rename, gap-finding, path-finding from what you have to what you need, the confidence computation, and staleness.
