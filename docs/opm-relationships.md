OPM has exactly two kinds of thing — [[Objects]], which exist, and [[Processes]], which transform objects — plus [[States]] that objects can be in. Everything else in a model is a link. There is a small closed set of them, and this page is the whole set, with the sentence each one generates.

The thing that makes this list hard to hold in your head is that every link has **two orderings, and they are not always the same one**. There is the direction the link is *drawn* — tail to head, the way you drag it on the canvas — and there is the order the words come out in the OPL sentence. For most links these agree. For four of them they run opposite ways, and every place this page used to be confused was one of those four.

# The chart

Green rectangle is an object, blue ellipse is a process, exactly as OPCloud draws them. Teal links are structural, amber links are procedural. A **dashed** link is one of the four where the sentence starts at the arrowhead — the words run against the arrow. Every link carries a note: hover the small dot under its label to read what the link means and where the symbol sits.

# Structural links — true over time

All four fundamental structural relations are the same shape. ISO 19450 gives it a name: the thing at the tail is a **refineable** — a whole, an exhibitor, a general, or a class — and the thing at the head is a **refinee** — a part, a feature, a specialization, or an instance. In OPM's own notation the triangle always sits at the refineable end, and the lines fan out to the refinees. Learn the shape once and all four follow.

| Relation | The sentence | Drawn | Sentence subject |
|---|---|---|---|
| Aggregation-participation | Whole **consists of** Part | whole → part | the tail |
| Exhibition-characterization | Exhibitor **exhibits** Feature | exhibitor → feature | the tail |
| Generalization-specialization | Specific **is a** General | general → specific | the head |
| Classification-instantiation | Instance **is an instance of** Class | class → instance | the head |
| Tagged structural link | A ‹your own phrase› B | as you draw it | the tail |

**Aggregation-participation** is composition: the parts make up the whole, and the whole is nothing but its parts arranged. From the OnStar model: *OnStar System consists of Cellular Network, GPS, OnStar Console, and VCIM.* It joins objects to objects or processes to processes, never one to the other.

**Exhibition-characterization** attaches a feature to the thing that has it. From my Neighborhood Developing model: *Financing exhibits Quality Of Financing.* The exhibitor is always the subject of the sentence and always the end the triangle sits on; the features fan out from it.

Read the other way, the feature **characterizes** the thing. That is the ISO vocabulary and the reason the relation carries both words in its name — but note that the tools never print the word: OPCloud says the converse as a **possessive**, as in *Variable B of Variable A is an informatical and systemic object.* If you are looking for "characterizes" in your OPL you will not find it; look for the "of".

A feature that is an object is an **attribute**; a feature that is a process is an **operation**, and both can hang off the same exhibitor: *Variable A exhibits Variable B, as well as Process C.* A process can be an exhibitor too — *Process C exhibits Process D.* This is the only fundamental structural relation where all four object/process combinations are allowed, which is why it kept showing up three times in my old notes — one real fact, written down three times as if it were three relations.

**Generalization-specialization** is the class hierarchy: *Restaurant is a Business.* Drawn general → specific, but spoken specific-first. This is one of the four where the words run against the arrow.

**Classification-instantiation** picks out a particular one: *Bantam Restaurant is an instance of Restaurant.* Also spoken against the arrow. The pair is worth keeping straight — *is a type of* answers "which kind", *is an instance of* answers "which particular one". My old list had a single "is one of" entry doing both jobs, which is how the distinction got lost.

**Tagged structural links** are the escape hatch: you write the phrase yourself, and it can read one way or both ways. From OnStar: *Driver communicates via OnStar Console.* Use it when no fundamental relation honestly fits — not as a way to avoid choosing one, because a model full of tagged links has given up exactly the precision that makes OPM worth the trouble.

# Procedural links — happen in time

| Relation | The sentence | Drawn | Sentence subject |
|---|---|---|---|
| Agent link | Agent **handles** Process | agent → process | the tail |
| Instrument link | Process **requires** Instrument | instrument → process | the head |
| Consumption link | Process **consumes** Object | object → process | the head |
| Result link | Process **yields** Object | process → object | the tail |
| Effect link | Process **affects** Object | process → object | the tail |
| Event link | Object **initiates** Process | object → process | the tail |
| Invocation link | Process A **invokes** Process B | A → B | the tail |

**Agent** and **instrument** are the two ways a process needs something that survives it. An agent is a person or a group — *OnStar Advisor handles Driver Rescuing* — and draws a filled circle at the process end. An instrument is everything else the process uses without consuming — *Driver Rescuing requires OnStar System* — and draws an open circle. Note the instrument sentence starts with the process even though the link is drawn from the instrument: another of the four reversals.

**Consumption**, **result** and **effect** are the three fates of an object touched by a process. Consumption means the object ceases to exist; result means it comes into existence; effect means it survives and changes state — *Driver Rescuing affects Driver*. Effect is shorthand: if which states matter, draw the consumption and result on the specific states instead and the model says more.

**Event** and **invocation** are the two triggers. An event link fires a process when an object enters a state; an invocation link fires the next process when this one ends. Invocation is the only procedural link that runs process to process.

There are two more you meet later — the **condition link**, which tests a state and skips the process if it fails, and the **exception link** for timeouts and faults. Both are worth leaving off a first model.

# The three questions I gave up on

**"Interacts with — how is this different from affects/causes?"** It isn't a separate relation, and OPM has no link by that name. What I had drawn was the effect link, which already means the process changes the object. Delete it and use *affects*.

**"Interacts both ways — why have this distinction?"** Because a *tagged* structural link can be one-way or two-way: two-way means the phrase you wrote reads correctly in both directions. It is a property of tagged links only, not a relation of its own. None of the four fundamental structural relations is bidirectional — they all run refineable to refinee.

**"Containment — is this the same as consists of?"** No, and OPM has no containment link. Consists-of is part-whole identity: the whole *is* its parts. A box containing a ball is a spatial fact about two separate things, and it belongs in a tagged structural link ("contains") or, better, as a state of the ball. The test: if you removed the contained thing, would the container be incomplete? If yes it is a part; if no it is contained.

# What is not in OPM

There is no *causes* link, and this is worth sitting with, because it is the first thing anyone coming from a [[Causal Loop Diagram]] reaches for. OPM makes you say *how*: the process consumes this and yields that, or affects it, or is invoked by it. Causation is the shape of the process links taken together, not a link you draw. A CLD says "A affects B, positively"; OPM says which process does it and what it takes in. The two are complements — see [[OPM]] and my note on [[Systems as a Second Language]].

# Where this comes from

The wording and the drawn directions here are checked against three sources, not remembered: ISO/PAS 19450:2015 §3.4, §3.20, §3.21, §3.61 and §3.62 for the definitions of attribute, exhibitor, feature, refineable and refinee; the OPCAT 3.0 manual's structural-links table for which end is source and which is destination; and live OPL output — the OnStar example in OPCloud 9.2.0 and my own Neighborhood Developing model — for every example sentence on this page.

This page replaces [[OPM Relationships]], which listed "exhibit" three times, filed "requires" under the wrong direction, and merged two fundamental relations into one line called "is one of". That page is worth keeping as evidence of what is genuinely hard here: not the vocabulary, but the two orderings.

The same error had spread into the RCN [[Graph Tool]]: its OPM mode drew the exhibition link labelled "exhibits" pointing from the attribute to the object, so the canvas contradicted the OPL panel next to it. The label now reads "characterizes" and the direction is unchanged, so diagrams already saved keep their meaning.
