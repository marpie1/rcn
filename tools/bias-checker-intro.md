# Conversation Navigator — Introduction

**ReLocalize Creativity Network · Open source · Free by design**
*Document updated: April 2026 · Hosted at Wiki Café*

[Introduction](bias-checker-intro.md) · [User Manual](bias-checker-manual.md) · [Open the Tool](bias-checker.html)

---

## What it is

The Conversation Navigator is a real-time, multi-participant tool for making the **intent and cognitive biases** of everyone in a conversation visible to each other — before and during the conversation, not in a debrief afterward. It runs in a browser, requires no account, and syncs across all participants through a shared session URL.

---

## Why it exists

Most facilitation breakdowns are not failures of method — they are failures of transparency. Someone in the room is trying to convince, and framing every contribution toward that end. Someone else is venting, and cannot hear what is being said to them. A third person notices both dynamics but cannot name them without disrupting the conversation.

The standard interventions — retrospectives, post-hoc bias audits, team health checks — come too late. They describe what went wrong after the conversation is over. What is needed is a lightweight, non-threatening way to make intent and bias visible *in the room*, so the group can self-correct in real time.

The Conversation Navigator operationalizes a simple insight: if everyone can see what everyone else is trying to do and what cognitive habits they are noticing in themselves, the conversation has a much better chance of going somewhere useful.

---

## Who it is for

Any group that meets regularly and wants to improve the quality of its conversations — RCN neighborhood development teams, community governance sessions, design workshops, strategy meetings, learning circles. It is especially useful when the group has learned to be honest with each other about their own reasoning patterns, because the tool rewards that honesty by making mismatches visible rather than letting them fester.

It is not designed for adversarial settings or anonymous use. It assumes good faith and a shared interest in having a better conversation.

---

## What it does

### Intent declaration
Each participant selects what they are trying to do: Learning, Exploring, Convincing, Producing, Socializing, Venting, Being heard, or Sharing/Teaching. Multiple intents can be active at once. Custom intents can be added.

### Bias self-reporting
Each participant checks any cognitive biases they are noticing in themselves right now — divided attention, doubling down when challenged, tone that limits participation, more statements than questions, and others. Custom biases can be added.

### Intent–bias conflict detection
The tool knows which biases work against which intents. "Doubling down when challenged" conflicts with Learning. "Tone limiting participation" conflicts with Healing. Conflicts are flagged visibly on each participant's card — a yellow warning the whole group can see.

### Live participant view
Every participant's intent, active biases, and conflict warnings are visible in real time on a shared card grid. Your own card is highlighted. The group can see the full picture without anyone having to narrate it.

### Aggregate stats
Switch from Cards to Stats to see bar charts of intent and bias distributions across the whole group — useful for a facilitator making sense of the room at a glance.

### Interactive framework models
Five built-in thinking models — Six Questions, Cynefin, eVSM v2, 15 Ps, Six Thinking Hats — rendered as clickable SVG diagrams. Participants click nodes and edges to mark relevance; clicks aggregate across the group and show in Stats.

### Custom graph models
Upload any JSON exported from the RCN Graph Tool to create a custom interactive model. Every node and edge becomes clickable; the group's attention pattern across the diagram is tracked and shown in Stats.

### Session sharing
One URL, no accounts. The session ID is encoded in the URL. Share it and anyone who opens it joins the same live session. Sessions persist as long as at least one participant is present.

### Real-time sync
All intent, bias, and model interaction data syncs across participants via Firebase Realtime Database. Changes appear within a second on all connected browsers. A live indicator in the header shows connection status.

---

## How it differs from the alternatives

### Retrospective / team health tools (Miro, FunRetro, TeamRetro)
**After the fact.** Retrospective tools are excellent for reflecting on a completed sprint or project. But they operate after the conversation is over — they describe what happened, not what is happening. By the time the retro runs, the bias that derailed Tuesday's meeting is a memory, not a live dynamic that can be shifted. The Conversation Navigator is designed to operate *during* the conversation, not after it.

### Meeting facilitation apps (Mentimeter, Slido, Poll Everywhere)
**Polling, not metacognition.** These tools collect votes, word clouds, and sentiment ratings. They are good at aggregating opinions about external topics. None of them ask participants to report on their own cognitive state — what they are trying to do or what reasoning patterns they are noticing in themselves. They poll the conversation's content; the Conversation Navigator surfaces its dynamics.

### Check-in / personal board practices (Six Thinking Hats, etc.)
**Framework without aggregation.** Practices like Six Thinking Hats or structured check-ins ask participants to name their current mode or emotional state. This is the right instinct. What is missing is aggregation and conflict detection: when a facilitator asks "which hat are you wearing?" verbally, the answers are sequential and forgettable. The Conversation Navigator makes all answers simultaneously visible, persists them for the session, and flags when a participant's stated intent and self-reported behavior are in tension.

### Cognitive bias reference tools (bias lists, checklists)
**Reference, not live.** Cognitive bias glossaries and checklists are useful for education and reflection. They are not designed for use during a live conversation. The Conversation Navigator distills the most practically relevant biases for group conversation into a checklist that takes five seconds to update and immediately communicates to everyone in the room.

---

## What exists only here

**Intent–bias conflict detection.** The tool maps which cognitive biases work against which conversational intents and flags the mismatch in real time — visible to the whole group. This specific combination does not exist in any facilitation tool surveyed. A participant who says they are "Learning" and checks "Doubling down when challenged" gets a yellow warning card. The group sees it. That is the intervention.

**Interactive framework models with group click aggregation.** Built-in diagrams of Cynefin, eVSM, Six Thinking Hats, the 15 Ps, and Six Questions are not just reference images — they are live canvases where each participant clicks nodes and edges to mark relevance, and those clicks aggregate in real time. No other facilitation tool combines interactive framework diagrams with multi-participant click tracking.

**Custom graph model upload.** Any JSON diagram exported from the RCN Graph Tool can be uploaded as a custom interactive model. The group's attention pattern across a custom causal diagram, data model, or knowledge graph becomes a live data feed. This closes the loop between the RCN's diagramming and conversation tools.

**No-account shared sessions.** The entire session state — participants, intents, biases, model interactions — lives in a Firebase database keyed to a six-character session ID embedded in the URL. Share the link, join the session. No login, no installation, no configuration.

---

## Honest gaps

| Gap | Notes |
|-----|-------|
| No session history | Sessions are ephemeral. When all participants leave, the Firebase data is cleaned up. There is no save or export for a session's full state. Model SVGs can be downloaded; the rest is not persisted. |
| No facilitator role | All participants see the same interface. There is no elevated facilitator view, no ability to control what others see, and no presentation mode. Anyone can reset interactions or start a new session. |
| Firebase dependency | Real-time sync requires a Firebase Realtime Database connection. The tool does not work offline. |
| Mobile layout | The two-column layout collapses on small screens but is not optimized for phone use. Intended for laptop or tablet in a meeting context. |
| Bias list is fixed (mostly) | The six built-in biases reflect the RCN's specific conversational concerns. Custom biases can be added per session but are not persisted across sessions or shared as defaults. |

---

## Positioning statement

The Conversation Navigator is the only free, no-account, real-time browser tool that makes each participant's conversational intent and self-reported cognitive biases simultaneously visible to the whole group — with automatic conflict detection, live aggregate stats, and interactive framework models that track group attention across shared diagrams. It is built for groups that have decided to be honest about how they think, and want tooling that rewards that honesty immediately rather than in a debrief three weeks later.

---

*Conversation Navigator · © Marc Pierson & Kerry Turner, ReLocalize Creativity Network Co-Founders*
[Licensed CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) · Free by design

[User Manual →](bias-checker-manual.md) · [Open the Tool →](bias-checker.html)
