# Requisite Variety

The root under all of it. [[Ross Ashby]]'s Law: **a regulator must have at least as much variety as the system it regulates.** And the Conant-Ashby theorem behind it: **every good regulator of a system must be a model of that system.**

## Order and variety are inverse

A tool that presumes high order presumes low variety. [[Stock Flow Model]] can only express quantified relations, so it cannot absorb the variety of a complex social situation.

Which gives the rule:

> **A step is legitimate when the order its tool presumes does not exceed the order the situation has.**

Or in Ashby's terms: a tool that presumes more order than the situation has is a model with less requisite variety than the system. It cannot absorb it, and what it produces is confident and wrong.

## Why the causal ladder runs the way it does

Climbing [[The Causal Ladder]] trades variety for precision.

[[Campfire Conversations]] and [[Cave Drawing]] presume almost nothing and work anywhere. [[System Dynamics Model]] presumes a great deal and works only where order is already established.

The numbers gate is the point where you must have **earned** enough order to afford the trade. That is [[Vester's Sensitivity Model]]'s epistemological honesty of fuzziness, stated in Ashby's terms — precision is not merely unhelpful in complex social systems, it is a regulator with too little variety.

## And the fallback rule is an Ashby move

When lost, drop back to a causal loop diagram. That is not retreat — it **increases your regulator's variety**.

Under-presuming is never an error. A causal loop diagram of a simple process is more variety than the job needs, which costs time rather than truth. Over-presuming costs truth.

## Where this is encoded

Marc's fills in [[Models for Seeing Systems]] classify the models by [[Cynefin]] domain, and those fills are the source of the values:

- Yellow-green, **Social Complexity** — Causal Loop Model, Sofi, VSM, and Vester's first five steps
- Cyan, **Complicated** — System Dynamics, Stock Flow, Model-Based Systems Engineering, and Vester's Partial Scenario and Simulation
- Near-black, **Simple** — Process Maps, Value Stream Mapping, Linkage Mapping, A3 Problem Solving
- Unfilled, **Chaotic** and pre-analytic — Campfire Conversations, Cave Drawing, Beauty. Chaotic carries no tools, correctly: in chaos you act.

In the repo, `presumes` on a tool records how much order it assumes, and `appliesWhen` on a method records the situation it suits. A step may carry its own `situation`, because methods descend domains as they proceed — probing is complex, measuring an outcome is complicated.

`tools/check-variety.js` applies the rule. On its first run it found one ungated crossing, which was a real hole rather than a false alarm.

## Two things the fills revealed

Vester's nine steps straddle the complex-complicated line, so the numbers gate is a **domain crossing** and not merely caution.

And [[The Six Nested Questions]] are themselves typed, descending the ordering — Who is complex, How is complicated, What is simple, and Time, Place and Paradigm carry no fill at all. The questions are a path out of disorder. That is why answering What first fails: it assumes an order nobody has established.
