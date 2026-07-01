# Conversation Navigator — User Manual

**ReLocalize Creativity Network · Complete reference for all features**
*Updated: April 2026*

[← Introduction](bias-checker-intro.md) · [Open the Tool →](bias-checker.html)

---

## Contents

**Getting Started**
1. [Interface overview](#1-interface-overview)
2. [Sessions](#2-sessions)
3. [Joining a session](#3-joining-a-session)

**Your Self-Report**
4. [Intent](#4-intent)
5. [Biases](#5-biases)
5b. [Identity & consent](#5b-identity--consent)
6. [Conflict detection](#6-conflict-detection)

**Shared Views**
7. [Participants — Cards view](#7-participants--cards-view)
8. [Participants — Stats view](#8-participants--stats-view)

**Models**
9. [Models tab overview](#9-models-tab-overview)
10. [Six Questions](#10-six-questions)
11. [Cynefin](#11-cynefin)
12. [eVSM v2](#12-evsm-v2)
13. [15 Ps](#13-15-ps)
14. [Six Thinking Hats](#14-six-thinking-hats)
15. [Custom graph models](#15-custom-graph-models)

**Reference**
16. [Session management](#16-session-management)
17. [Tips & patterns](#17-tips--patterns)

---

## 1. Interface overview

The tool is a single HTML file hosted at Wiki Café. Open it in any modern browser — no install, no account. It requires an internet connection for real-time sync.

The interface has two panels:

- **Left panel** — your controls: join session, share link, intent selection, bias checklist.
- **Right panel** — shared views: the Participants tab (Cards or Stats) and the Models tab.

The header shows the tool name, the current session ID, and a live indicator dot — green when connected to Firebase, grey when offline. Click the **?** button in the header to open the inline documentation panel.

The right panel has two tabs at the top: **Participants** and **Models**. Stat pills in the tab bar always show the current participant count, total active biases, and intent–bias conflict count across the session.

---

## 2. Sessions

Every instance of the tool runs in a **session** — a shared Firebase namespace identified by a six-character ID. The session ID is embedded in the URL as a query parameter: `?s=ABC123`.

When you open the tool with no session ID in the URL, a new one is generated automatically and added to the URL. Share that URL with other participants and they will join the same session. Anyone who opens the same URL is in the same session.

Sessions are ephemeral. Data is not saved when participants leave. If you need to resume a session later, keep the URL — as long as at least one participant remains connected, the Firebase data persists.

> **Note:** Session data is cleaned up from Firebase when a participant closes their browser tab. If all participants leave, the session data is gone. Download model SVGs before closing if you need them.

---

## 3. Joining a session

1. Open the tool URL (or a session URL shared by another participant).
2. Enter your name in the **Your name** field in the left panel.
3. Click **Join**.

After joining, the name field locks and your participant key is registered in Firebase. The **Intent** and **Biases** sections appear. The **Share This Session** box shows the URL — click **Copy Link** to copy it to the clipboard and share with others.

Your participant card appears in the Participants view immediately after joining. Other participants see you appear on their screens within a second.

> **Tip:** Set your intent before others arrive — it gives the group useful information from the start of the conversation rather than mid-way through.

---

## 4. Intent

Intent is what you are trying to accomplish in this conversation right now. Naming it makes it visible to others and helps you notice when your behavior diverges from it.

### Built-in intents

| Intent | When to select it |
|--------|------------------|
| 📖 Learning | You are here to understand something you do not already understand. |
| ☕ Socializing | The relationship is the point — building trust, maintaining connection. |
| 🏆 Convincing | You have a position and you want others to adopt it. |
| 🔍 Exploring | The question is open — you do not know what you are going to find. |
| 🎯 Producing something | The conversation has a concrete deliverable: a decision, a document, a plan. |
| 💨 Venting | You need to discharge energy or frustration. The content is secondary. |
| ❤️ Being heard and acknowledged | You need to feel understood before you can engage with anything else. |
| 📢 Sharing / Teaching | You have something to transfer to others and that transfer is the goal. |

### Selecting intent

Click any intent button to select it. The button highlights in amber. Click again to deselect. You can have multiple intents active simultaneously — for example, both Exploring and Producing something if you are in a structured generative session.

Your intent selection is visible immediately on your participant card in the shared view.

### Custom intents

Type a custom intent in the field below the intent grid and press Enter or click **Add**. Custom intents appear with a ✦ icon. Click × to remove a custom intent.

> **Note:** Custom intents are specific to your session — they are visible to all participants but are not conflict-detected against the built-in bias map.

### Reordering intents

Drag any intent button to reorder the grid. The order is personal — it affects only your view.

### Clearing intent

Click **Clear mine** at the bottom of the left panel to deselect all your intents and biases at once.

---

## 5. Biases

The bias list asks you to notice and name cognitive patterns you are experiencing *right now* — not patterns you think others have. This is a self-report, not a judgment of others.

### Built-in biases

| Bias | What it means in practice |
|------|--------------------------|
| Divided attention | Part of your attention is elsewhere — phone, email, a parallel thread of thought. |
| Assuming communication success without checking | You believe you have been understood without verifying. Or you believe you understand without checking. |
| Doubling down when challenged | When someone pushes back, your position hardens rather than opening. The challenge triggers defense rather than curiosity. |
| Statements : Questions > 1 | You are contributing more assertions than questions — a signal that you may be driving rather than exploring. |
| Tone → Limiting Participation | Something about your manner — volume, certainty, speed, dismissiveness — is making it harder for others to contribute. |
| We need a model | The conversation has drifted into abstraction and you are reaching for a framework when concrete specifics would be more useful, or vice versa. |

### Checking a bias

Click the checkbox next to any bias you are noticing in yourself. The row highlights in orange and the bias name appears on your participant card immediately. Click again to uncheck.

### Custom biases

Type a custom bias in the field at the bottom of the bias list and press Enter or click **Add**. Custom biases work like built-in ones — checkable, visible on your card — but are not included in conflict detection. Click × to remove.

### Reordering biases

Drag any bias row to reorder the list. The order is personal.

> **Tip:** The bias list is most useful if you update it during the conversation, not just at the start. A bias you were not noticing five minutes ago may appear now. Checking it is the signal — not an admission of failure.

---

## 5b. Identity & consent

By default everyone in a session is **anonymous** — participant cards show only the name entered at join time, and model click data carries no identity information. The Identity section at the bottom of the left panel lets you opt in to being named.

Names become visible to the whole group only when *every* participant has checked the consent box. If even one person has not consented, the session stays anonymous. This state is called **Open**.

### Voting

Check *Show my name to the group* in the Identity section. The tab bar shows a running tally: **Open: X/Y** where X is the number who have consented and Y is the total. Which specific participants have consented is not shown — voting is itself anonymous.

The status line below the checkbox shows the current state: either how many agree and how many prefer anonymous, or *Open — names visible to everyone* when unanimous consent is reached.

### What changes in Open mode

| Feature | Anonymous (default) | Open (unanimous consent) |
|---------|---------------------|--------------------------|
| Stats bar charts | Count only | Hover tooltip shows names of participants with that intent or bias |
| Model click counts | Count only | Hover tooltip on each node/edge shows who clicked it |
| Stats section label | Intents — N participants | Intents — N participants — Open |

> **Note:** Open mode is session-scoped and real-time. If a participant unchecks the box, the session reverts to anonymous immediately. Model interactions started before unanimous consent was reached will not show names retroactively.

---

## 6. Conflict detection

The tool maps which cognitive biases work against which conversational intents. When a participant has an active intent and a checked bias that conflict, a yellow warning appears on their participant card: *⚠ Intent–bias mismatch: N conflict(s)*.

This is visible to everyone in the session. It is not punitive — it is information. The group can choose to acknowledge it, ignore it, or use it as the entry point for a brief check-in.

### Conflict map

| Intent | Conflicts with these biases |
|--------|---------------------------|
| Learning | Assuming communication success without checking; Doubling down when challenged |
| Socializing | Doubling down when challenged; Tone → Limiting Participation |
| Convincing | Divided attention; Assuming communication success without checking |
| Exploring | Doubling down when challenged; We need a model |
| Producing something | Divided attention; Doubling down when challenged; We need a model |
| Venting | *(none — venting has no conflict mappings)* |
| Being heard and acknowledged | Doubling down when challenged; Tone → Limiting Participation |
| Sharing / Teaching | Statements : Questions > 1; Tone → Limiting Participation |

The count in the tab bar (Conflicts: **N**) shows how many participants currently have at least one intent–bias conflict.

> **Note:** Custom intents and custom biases are not included in conflict detection — only the eight built-in intents and six built-in biases are mapped.

---

## 7. Participants — Cards view

The default view in the Participants tab. Shows one card per participant, updated in real time as people join, leave, or change their selections.

### What each card shows

| Element | Meaning |
|---------|---------|
| Name | The participant's name as entered at join time. Your own card is outlined in red and has a "you" tag. |
| Intent badge(s) | Amber pill(s) showing each active intent. Multiple intents stack horizontally. |
| Bias tags | Small grey tags for each checked bias. Tags for biases that conflict with the participant's intent are shown in red. |
| Bias count badge | Red circle in the top-right corner showing the number of active biases. Hidden if zero. |
| Conflict warning | Yellow banner: ⚠ Intent–bias mismatch: N conflict(s). Appears only when a conflict exists. |

Cards appear in join order. Participants who close their browser tab are automatically removed from the view within a few seconds.

---

## 8. Participants — Stats view

Click **Stats** above the card grid to switch to the aggregate statistics view. This shows bar charts summarizing the group's intent and bias distribution, plus model interaction data if any models have been used.

### Intent chart

One bar per intent, sorted by count descending. Shows how many participants have each intent active. Intents with zero participants are shown dimmed. Each intent has a distinct color.

### Biases chart

One bar per bias, sorted by count descending. Shows how many participants have each bias checked. Useful for noticing when a pattern (e.g., divided attention) is widespread across the group rather than individual.

### Model interaction sections

If any model has been opened and clicked in the session, the Stats view shows a section for each model with bars for clicked nodes and edges. These appear below the intent and bias charts, labeled by model name and click type (nodes / connections / questions).

> **Tip:** Stats view is useful for a facilitator who wants a quick read of the room without reading each card individually. Switch back to Cards to see individual names.

---

## 9. Models tab overview

Click **Models** in the tab bar to open the models tab. This tab contains five built-in thinking framework diagrams and a custom graph upload area.

Each model is an accordion — click the header to open or close it. **Only one model can be open at a time.** Opening a model subscribes to its click data in Firebase and renders the interactive SVG.

**Clicking a node or edge in a model increments its count by 1** for the whole session. Clicking it again decrements. Your clicks are tracked separately from others' — you cannot drive a count below zero regardless of how others have voted. Click counts persist as long as the Firebase session exists.

All model interaction counts appear in the **Stats** view on the Participants tab.

> **Note:** You must be joined (name entered, Join clicked) before model clicks are registered. Clicking before joining has no effect.

---

## 10. Six Questions

Six Questions is an interactive question-and-answer framework. Six rows, each with a question on the left and an answer field on the right. The defaults are When, Where, Why, Who, How, What — but both question labels and answers are fully editable by any participant.

### Editing questions and answers

- Click the **colored question box** on the left to edit the question label. Changes sync across all participants.
- Click the **answer box** on the right to type an answer. Changes sync across all participants.
- Click the **answer box itself** (not the text field) to increment the click count for that answer row. A red count appears when greater than zero.

### Timeline

Below the six rows, a timeline appears showing the order in which answers were filled in during the session. Each row shows a bar sized relative to the time elapsed between the first answer entered and that row's answer.

### Download SVG

Click **Download SVG** to export the current state of the Six Questions diagram — including question labels, answers, and click counts — as an SVG file. Useful for archiving the session output.

---

## 11. Cynefin

The Cynefin framework rendered as a clickable SVG diagram. Five domains: Complex, Complicated, Chaotic, Clear, and Disorder (center). Five boundary transitions between them.

Click any **domain** to mark it as relevant to the current conversation. Click a **boundary line** to mark a transition as relevant. Each click adds to the shared count; click again to remove your vote.

Domain and transition click counts appear in the Stats view under "Cynefin — domains" and "Cynefin — transitions."

> **Tip:** Use Cynefin when the group is trying to agree on what kind of problem they are facing — complicated (knowable with expertise) vs. complex (emergent, requires probing) vs. chaotic (act first). Having the diagram visible as a shared object makes that conversation concrete.

---

## 12. eVSM v2

The electronic Viable System Model (eVSM) v2 rendered as a clickable SVG. Nodes represent VSM functions (System 1 through System 5, algedonic channel, environment) and edges represent the command/autonomy and information flows between them.

Click any node or edge to mark it as the focus of current discussion. Clicks aggregate across participants and appear in Stats as "eVSM v2 — nodes" and "eVSM v2 — connections."

---

## 13. 15 Ps

A fifteen-node framework diagram rendered as a clickable SVG. Each node represents one of the fifteen P categories relevant to community and neighborhood development analysis. Edges show structural relationships between them.

Click nodes and edges to mark the ones relevant to the current conversation. Counts appear in Stats as "15 Ps — nodes" and "15 Ps — connections."

---

## 14. Six Thinking Hats

De Bono's Six Thinking Hats rendered as a clickable SVG. Six colored hat nodes:

| Hat | Mode |
|-----|------|
| White | Data and facts — what do we know? |
| Red | Emotion and intuition — how does this feel? |
| Black | Caution and risk — what could go wrong? |
| Yellow | Optimism and value — what is good about this? |
| Green | Creativity and alternatives — what else could we try? |
| Blue | Process and control — how are we thinking about this? |

Click a hat to mark it as the dominant mode of the current conversation or the mode a participant is operating in. Click counts aggregate per hat across all participants and appear in Stats as "Six Thinking Hats."

> **Tip:** Six Thinking Hats works well alongside the intent/bias panel — checking "Tone limiting participation" while clicking Black Hat gives the group a precise vocabulary for what is happening.

---

## 15. Custom graph models

Any JSON file exported from the **RCN Graph Tool** can be uploaded as a custom interactive model. This lets the group use any diagram they have built as a shared clickable canvas during a conversation.

### Uploading a graph

1. In the Models tab, click **Upload graph JSON**.
2. Select a `.json` file exported from the RCN Graph Tool.
3. The graph appears as a new accordion entry above the built-in models, labeled with the model name from the JSON.
4. Click the accordion header to open it and render the interactive diagram.

### Interacting with a custom graph

Every node and edge in the uploaded graph becomes clickable. Click a node or edge to add your attention mark; click again to remove it. Counts aggregate across all participants in the session and appear in Stats under the model's name.

Custom graphs are stored in the session's Firebase namespace. All participants see the uploaded graph automatically — you only need to upload once per session.

### Download SVG

Click **Download SVG** in the open accordion to export the current state of the custom diagram, including click count annotations, as an SVG file.

> **Note:** Only one custom graph can be uploaded per session. To use a different graph, use New Session (which resets all data) or Reset interactions (which clears click counts but keeps the graph).

---

## 16. Session management

Three session controls appear at the top of the Models tab:

| Button | What it does |
|--------|-------------|
| **Reset interactions** | Clears all model node and edge click counts for the entire session. Asks for confirmation. Participant intent and bias data is not affected. Use this to start a fresh round of model interaction without starting a new session. |
| **New session** | Generates a new session ID and reloads the page. All session data — participants, intents, biases, model interactions — is abandoned. Use this to start a completely fresh session. Share the new URL with participants. |
| **Upload graph JSON** | Opens a file picker to upload a custom graph model. See §15. |

> **Warning:** Reset interactions and New session are irreversible. There is no undo. Download any SVGs you want to keep before clicking either.

### Leaving a session

Closing your browser tab automatically removes your participant entry from Firebase. Other participants see your card disappear within a few seconds. Your name becomes available again for someone else to use if the session continues.

---

## 17. Tips & patterns

### Pre-conversation setup

1. One person opens the tool, gets a session URL, and shares it before the conversation begins.
2. Each participant opens the link and joins with their name.
3. Everyone sets their intent before the first agenda item. The Cards view is already useful — you can see whether the group expects to be Learning, Convincing, Producing, or a mix.

### Running a model during conversation

Open a model on one screen visible to the group (projected, shared screen, or a dedicated device). As topics shift, the facilitator or any participant clicks the relevant nodes. The Stats view at the end shows where group attention concentrated.

### Using conflict warnings

When a conflict badge appears on a card, the group has a choice: acknowledge it explicitly, leave it as background information, or let the individual adjust their intent or bias. The value is not in forcing a response — it is in making the dynamic nameable without anyone having to deliver a critique.

### Connecting to the RCN Graph Tool

Build a diagram in the RCN Graph Tool (causal loop, EIP analysis, OPM process model, anything). Export JSON. Upload as a custom graph in a Conversation Navigator session. The group can now click the diagram together during discussion — turning a static artifact into a live attention map.

### Closing a session

Download any model SVGs you want to keep. Copy any Six Questions answers into your notes. There is no other export — the session data does not persist after all participants leave.

### Large groups

The Cards view can get crowded above ten participants. Switch to Stats view for a cleaner read of the room. The bias and intent charts scale naturally to any group size.

---

*Conversation Navigator · © Marc Pierson & Kerry Turner, ReLocalize Creativity Network Co-Founders*
[Licensed CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) · Free by design

[← Introduction](bias-checker-intro.md) · [Open the Tool →](bias-checker.html)
