# How The Ostrom Frames Fit Together

Ostrom gave us four frames for looking at a group's agreements: the Institutional Grammar (and its older form, ADICO), the seven rule types, the levels of action, and the design principles. They are not four competing lists. Each answers a different question about the same sentences, and each one is built on the one before it. This page says how they connect, and where the smaller frames make the larger ones clearer. The idea they serve is on [[Commons Viability From Agreement Coding]].

## Four frames, four questions

- The grammar asks: what are the parts of this one sentence? WHO, MUST or MAY or MUST NOT, DO WHAT, WHEN, OR ELSE.
- The seven rule types ask: what does this sentence do in the situation? Say who is in, create a role, allow an action, combine choices into a decision, share information, hand out costs and benefits, or set what outcomes are in play.
- The levels ask: what is this sentence about? Doing the work, making the rules for the work, or deciding who makes the rules. Beneath them all is the unwritten level of what people think is even possible.
- The design principles ask: will this commons last? They are patterns found in commons that lasted, asked of all the sentences together.

## The stack

The grammar codes each sentence. The rule type and the level are two labels on each coded sentence. The design principles are questions asked across the whole labeled set: is there any duty to monitor, does any OR ELSE step up for a second breach, can the people affected change anything?

That is how [[Shared Shape For Coded Agreements]] stores it. Each statement keeps its answers to the grammar's questions as fields, plus a level and a rule type. A viability profile is a set of searches over those statements.

## The grammar: ADICO and IG 2.0

ADICO is the first version, from Crawford and Ostrom (1995). The Institutional Grammar 2.0 is the revision by Frantz and Siddiki (2021). The Agreement Checker uses IG 2.0, put into plain questions.

| Plain question | IG 2.0 | ADICO |
|---|---|---|
| WHO? | Attribute | Attribute |
| MUST, MAY, OR MUST NOT? | Deontic | Deontic |
| DO WHAT? | Aim | Aim |
| TO WHAT? | Object | not in ADICO |
| WHEN? | Activation condition | Condition |
| HOW? | Execution constraint | Condition |
| OR ELSE? | Or else, coded as its own sentence and linked by "backed by" | Or else |
| WHAT ARE WE CREATING?, MUST OR MAY?, FORMED?, OUT OF WHAT? | Constitutive statement | not in ADICO |
| ALL OF THESE, ONE OR MORE, EXACTLY ONE | Horizontal nesting | not in ADICO |

IG 2.0 adds three things. It splits ADICO's Condition into WHEN and HOW. It adds creating agreements: sentences that make a role, a group, or a thing, rather than tell people what to do. And it adds nesting: the "backed by" chain from a rule to the rule that enforces it, and the joining words that tie sentences together.

The NDC School page [[Seven Questions]] teaches the older ADICO, where Condition covers both when and where. The two pages do not disagree. A reader moving between them will just meet both.

## How the grammar feeds the other frames

The rule type is read mostly from DO WHAT? Join or enter is a boundary rule. Vote or decide is an aggregation rule. Report or record is an information rule. Pay, or receive a benefit, is a payoff rule. Creating agreements hold most of the position and boundary rules: "the water keeper, chosen each spring from the garden members."

The level is read mostly from TO WHAT? If the sentence acts on a plot or the tank, it is operational. If it acts on another rule, "amend these rules", it is collective choice. If it acts on the rule-makers themselves, who may vote or how the board is formed, it is constitutional.

The OR ELSE decides how strong a sentence is. All five parts make an agreed rule. No OR ELSE makes a shared expectation. No OR ELSE and no MUST or MAY makes a shared habit. Shared habits are as close as the grammar gets to the unwritten level beneath the other three. They can be recorded when they are seen in practice, but nothing written stands behind them.

## The seven rule types and the levels

The same seven rule types turn up at every level. A boundary rule at the operational level says who may water. A boundary rule at the collective-choice level says who may vote on the watering rules. A boundary rule at the constitutional level says who counts as a member at all.

So every coded sentence has two coordinates, a level and a rule type. The design principles are patterns in that grid.

## Each design principle on the grid

| Principle | Rule types it rests on | Level |
|---|---|---|
| 1A User boundaries | Boundary | Operational for who may use; constitutional for who is a member |
| 1B Resource boundaries | Scope | Operational |
| 2A Fit with local conditions | None. It is a judgment about the place | None |
| 2B Costs in proportion to benefits | Payoff, matched against choice: a duty for each benefit | Operational |
| 3 Collective choice | Boundary, position, aggregation, information, scope | Collective choice |
| 4A Monitoring users | Position for a monitor role, choice for the duty to watch, information for reports to users | Operational, with whom the monitor answers to set at constitutional |
| 4B Monitoring the resource | Information | Operational |
| 5 Graduated sanctions | Payoff: the OR ELSE, with WHEN answers that step up | Operational |
| 6 Conflict resolution | Position for a venue, boundary for who may bring a dispute, aggregation for how it is settled | Collective choice |
| 7 Recognition of rights | Scope, set by an outside body | Constitutional and below, in someone else's rules |
| 8 Nested enterprises | Boundary and position, linking bodies of different sizes | Constitutional |

This grid is a synthesis made for this page. Ostrom did not publish it in this form.

## Where the rule types add clarity

Principle 3 is the vaguest of the principles, and the rule types split it into five questions anyone can answer. Are the people affected seated? That is a boundary rule at the collective-choice level. Is there a role for them to sit in? That is a position rule, set at the constitutional level. Do they see a proposal before it is decided? That is an information rule. Does their voice count, by vote, consent, or only by being asked? That is an aggregation rule. What are they allowed to change? That is a scope rule. A group that says "we follow principle 3" can fail on any one of the five.

The community health worker who is never at the table is the case that shows it. As an operational complaint it reads as "nobody asks the health worker", an information problem. One level up it reads as "the health worker is not seated", a boundary problem. At the constitutional level the real gap shows: there is no health-worker role at all, a missing position rule. Asking more often will not fix it. Only creating the role will.

Aggregation is the rule type the principles never name. Principles 3 and 6 assume a decision gets made, but neither says how choices combine. "Who has to agree for this to count?" asked of any principle-3 or principle-6 arrangement often finds the real gap. [[Seven Questions]] calls aggregation the one to teach first, because most conflict is two people silently assuming different aggregation rules.

Principle 1 is two rules, not one. Who is in is a boundary rule. What the shared thing is, is a scope rule. Cox and his colleagues split the principle because the two fail separately: everyone can know who the gardeners are while nobody knows which tank is the shared one.

The rule type tells you what kind of fix is needed, and the level tells you who can make it. "Principle 4 is weak" becomes "no information rule makes the water keeper report, and adding one is a collective-choice decision the gardeners can make at the spring meeting."

## Where the grammar adds clarity

It finds what is missing. For every rule the checker asks: what does this rule assume already exists? A rule about "gardeners" with no creating agreement for gardeners is a gap in principle 1A. A rule about "the tank" with nothing saying which tank is a gap in 1B. The missing health-worker role is the same gap one level up. The rule types can say a position rule is missing. The grammar points to the exact sentence nobody wrote.

It makes principles 4 and 5 into a path to follow. Graduated sanctions need several OR ELSE sentences for the same rule, with WHEN answers that step up. Each OR ELSE needs someone to carry it out. Follow the "backed by" chain: the sanction leads to the keeper's duty, the duty leads to the creating agreement for the keeper, and that agreement's OUT OF WHAT? says "the garden members". That last step is principle 4A, the monitor answering to the users. If any step is missing, the coding shows where.

It turns monitoring of the resource into something visible. A WHEN such as "when the tank is below half" assumes someone reads the tank. If no sentence gives anyone that duty, principle 4B has a gap the text itself reveals.

It finds rules that cannot be enforced. In real documents the OR ELSE is usually empty. Without one, a sentence is a shared expectation, not an agreed rule, and practice will drift away from it. That matters for principle 5, and for the distance between rules on paper and rules in use.

It shows where a sentence really sits. Words like "consult" or "advise" sound like collective choice. If the sentence's TO WHAT? is still the work, and nobody's choice is counted, it is operational. Being consulted without a seat is that case.

## What none of the frames can show

All four frames read what is written. A commons lives by what people do. Principle 2A, fit with local conditions, cannot be read from any text. Principles 7 and 8 need the outside bodies' sentences coded too: the city's ordinance, the landowner's lease, the larger council's charter.

The word "nested" means two different things. In principle 8 it means larger bodies built from smaller ones: a garden inside a neighborhood council inside a county. The levels of action are layers of rule-making inside any one of those bodies. Each body in a principle-8 nest has its own levels.

So the evidence of use has to sit beside the coding: measurements kept over time with SPC charts, survey answers, and what people see on the ground. The frames say where to look. Practice says what is there.

## In one line

The grammar codes each sentence, the rule types and levels label it, and the design principles are what we ask of the labeled whole.

## Sources

Ostrom, Elinor (1990). Governing the Commons. Cambridge University Press.

Crawford, Sue and Elinor Ostrom (1995). A Grammar of Institutions. American Political Science Review 89(3).

Ostrom, Elinor (2005). Understanding Institutional Diversity. Princeton University Press. Especially chapter 7 on rule types.

Cox, Michael, Gwen Arnold and Sergio Villamayor Tomás (2010). A Review of Design Principles for Community-based Natural Resource Management. Ecology and Society 15(4): 38.

Frantz, Christopher and Saba Siddiki (2021). Institutional Grammar 2.0: A Specification for Encoding and Analyzing Institutional Design. Public Administration.
