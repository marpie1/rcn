# RCN Session Patterns April to July 2026

Analysis of 15 Bias Checker session records from the NDC Group wiki, covering April 23 through July 30, 2026. Every figure here comes from parsing the HTML tables in the session pages themselves.

## The shape of the thing

A weekly Thursday meeting at roughly 11am: 15 sessions across 98 days, 13 of them Thursdays plus two Fridays. The two Friday sessions look like a different gathering — April 24 has 2 anonymous participants, and May 29 is the only session including Christine McIntyre. Only two real gaps interrupt the weekly rhythm, both 13 to 14 days: April 24 to May 7, and July 9 to July 23.

Attendance has a spine and a rotation. Of the 10 sessions that name their participants: Marc 9, Kerry 8, Chris 6, Jerry 5, Robin 5, Brent 4, Christine 1. Marc and Kerry are the constant; everyone else orbits.

Consent practice changed partway through. Every session from April 24 to May 28 is anonymous, recorded as "named consent not given by all." From May 29 onward every session names its participants. Something got settled at the end of May.

## A learning group, not a producing group

Intents summed across all 15 sessions:

**Intent:** Learning — **Count:** 50

**Intent:** Socializing — **Count:** 36

**Intent:** Exploring — **Count:** 16

**Intent:** Sharing / Teaching — **Count:** 9

**Intent:** Producing something — **Count:** 6

Learning and socializing outnumber producing by 14 to 1. That may be exactly right for what this group is. But if anyone expects deliverables from these meetings, this ratio is the reason they are not appearing.

## Meetings are getting fuller, and grew a template

Topics per session, in order: 14, 3, 5, 6, 7, 14, 3, 12, 13, 21, 22, 8, 26, 7, 24. Roughly triple by July.

Around June 18 to July 9 the topics stop being subjects and start being structure. `CHECK IN`, `FOR DISCUSSION`, `FOR ACTION`, `TO DO LIST`, and `FOCUS TODAY?` begin appearing as agenda scaffolding inside the topic list itself. The group invented a meeting template mid-stream, without anyone announcing it.

Across all sessions, 120 topics are marked done and 65 remain open — a 65% completion rate.

## Carry forward closes about half the time

Each session ends with a Carry Forward note. Checking whether that note's subject actually appears in the next session's topics or summary: 7 of 14 follow through.

The misses cluster in two places — the early April and May sessions before the template existed, and across both long gaps. Two threads survive reliably: eVSM appears in 8 sessions and SODOTO in 6. Those are the group's real spine. Items named once without attaching to those threads tend to evaporate, among them prediction markets, the Incarceration Navigator, and Second Brain and Twin.

## What the group is actually about

Subjects recurring across separate sessions: RCN in 9, Lansing in 9, eVSM in 8, tools in 7, then neighborhood, shared, SODOTO, and update in 6 each. Behind those: Superior, Whatcom, CLD, governance, constitution, health, and ethical in 4 sessions each.

Lansing appearing in 9 of 15 sessions is the quiet surprise — as persistent a thread as RCN itself, arriving mostly through polycentric governance.

## The biases are the most interesting and least used part

Only 16 bias flags were logged across 9 of the 15 sessions; five sessions logged none at all. Since the tool exists to catch these, low counts more likely indicate under-use than clean conversation. Read them as anecdotes, not measurement.

**Bias:** Divided attention — **Times:** 5

**Bias:** Statements : Questions > 1 — **Times:** 4

**Bias:** We need a model — **Times:** 4

**Bias:** Can we get a reframe please!? — **Times:** 1

**Bias:** Assuming communication success without checking — **Times:** 1

**Bias:** Tone leading to limiting participation — **Times:** 1

Two of these stand out. "Statements : Questions > 1" pairs naturally with the 50-to-6 learning-to-producing ratio: a group that talks more than it asks, and learns more than it ships. And "We need a model," flagged as a bias four times in a group whose entire toolkit is CLDs, eVSM, and graph tools, shows real self-awareness about reaching for a model instead of a decision.

There is no relationship between group size and flags logged. A 2-person session logged 3 flags while two 5-person sessions logged none. That again points at inconsistent use of the tool rather than a real signal about group size.

## Two cautions about the data

Chris appears variously as "Christopholis", "Christo", and "Chris". These were normalized to one person for the attendance count, but the source records do not normalize them.

Five of the fifteen sessions are anonymous, so all attendance figures describe only the 10 named sessions.

## How this was made

The lineup of 15 session pages was captured with `fedwiki-lineup.js --journal full`, which reads the lineup URL and fetches each page's complete JSON. The session pages store their participants, intents, biases, and topics as HTML tables, so the figures above come from parsing those tables rather than from reading prose.
