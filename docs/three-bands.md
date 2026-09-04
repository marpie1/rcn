# The three bands — what collective-choice and operational actually mean

**Date:** 2026-08-31. Written after assigning Ostrom levels to four RCN drawings and finding that the Constitutional Builder had already claimed the top of the list.

## The cut

The Constitutional Builder covers Meadows leverage points 1 through 6 — paradigm and worldview, goals, self-organization, rules, information flows — with Ostrom's eight design principles as the check. That is not one framework borrowing from another. It is the same list cut at different places, and once you see the cut, the two lower bands stop being vague.

| Band | Meadows | What it governs |
|---|---|---|
| **Constitutional** | 1–4 | Paradigm, goals, and the power to add, change, evolve or self-organize system structure |
| **Collective-choice** | 5–6 | The rules themselves, and who may see what |
| **Operational** | 7–12 | Loop gains, delays, stock-and-flow structure, buffer sizes, constants and parameters |

Meadows' #4 — *the power to add, change, evolve or self-organize system structure* — **is** Ostrom's constitutional level, written in system-dynamics language rather than institutional language. That is the equivalence, and it is why the constitutional level is the more powerful half of the leverage points: Meadows put four of her top four there.

And Meadows' #12, the weakest point on her whole list, is *constants and parameters*. A price at a till is a constant. Which means the operational band is where nearly all the effort in any organization goes, and where the least leverage lives. That is not a criticism of operations. It is the reason a complaint that keeps recurring at operational level is usually a rule problem, and a rule problem that keeps recurring is usually a constitutional one.

## The distinction Ostrom adds that Meadows does not have

Meadows' #5 is "rules — incentives, punishments, constraints." One point, covering everything rule-shaped.

Ostrom splits it, and the split is the entire reason for three bands rather than two:

- **Making a rule** is collective choice.
- **Deciding who may make rules** is constitutional.

Meadows can tell you rules are high leverage. Only Ostrom tells you that the leverage is not in the rule, it is in the standing to write it. That is the distinction that turned a complaint about consultation into a question about membership classes, twice in one afternoon.

## What each band means in our own vocabulary

We already had these three things and did not have names for them.

**Operational** is where the `DELIVERS` edges are. Deliverables move between positions, payoffs are received, positions act on the choices available to them. Everything a value network draws natively lives here. Its characteristic question is *is this working*.

**Collective-choice** is where the payoff, scope and information rules governing those deliverables get set. Outcomes generated here become working components below — McGinnis's adjacency, drawn as a downward arrow. Its characteristic question is *who decided that, and can they decide differently*.

**Constitutional** is where positions themselves are created and standing is assigned. Outcomes here determine who may sit in the arenas below, and therefore what a collective-choice arena is even able to consider. Its characteristic question is *who has standing here at all*.

## Three worked triples

The same subject, at all three levels, from drawings made before any of this vocabulary existed.

**The co-op.** Price at the till is operational — Meadows #12, a constant. The board setting price and wage is collective choice — Meadows #5, a rule. What classes of member exist is constitutional — Meadows #4, the structure that decides who may be elected to set the rule.

**SODOTO.** A teaching session is operational. Issuing the badge is collective choice, because it assigns a participant to a position. Whether holding a badge confers standing to teach is constitutional, and it is unwritten.

**The CHW's missing seat.** This is the one that pays for the whole exercise. As an operational finding it read as a consultation problem — the CHW is not asked. At collective-choice level it read as a boundary-rule exclusion — the CHW is not seated. At constitutional level it is neither: there is no CHW class for a boundary rule to admit. You cannot seat someone in a class that does not exist. So consultation will not fix it, an invitation will not fix it, and only a constitutional decision will. Same complaint, three levels, and the leverage rises as you climb.

## The one-question test

For deciding, in the moment, which band you are standing in.

- Does it change **a number**? → operational. Least leverage.
- Does it change **a rule**? → collective choice.
- Does it change **who may change the rule**? → constitutional. Most leverage.

## The standing reminder

```bash
node tools/band-state.js          # the full state of all three bands
node tools/band-state.js --brief  # four lines, for a standup
```

Reads the drawings rather than the database, so it runs with nothing else up. It reports what is settled, open and not ours in the constitutional band; which situations sit in each of the lower two and whether they span; how much of what we hold is observed rather than asserted; and how many of Ostrom's seven working components we actually populate. It ends by printing the one-question test, because that is the part worth seeing every time.

It also reports evidence adoption across every drawing in the repo, not only the value networks, since `props.evidence` is a field any mode may carry.

As of 2026-09-01 it says two constitutional questions are unanswered, six claims are observed against sixty-one asserted, and we populate two of Ostrom's seven working components. The observed six are constitutional facts citable to a page of the RCN Constitution — the first things here that are measured rather than reasoned. The other two numbers are still the honest state, and both are meant to change.
