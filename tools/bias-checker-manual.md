# Conversation Navigator — User Manual

**ReLocalize Creativity Network · Complete reference for all features**
*Updated: September 2026*

[← Introduction](bias-checker-intro.md) · [Process Flow ↗](conversation-navigator-flow.html) · [Open the Tool →](bias-checker.html)

---

## Contents

**Getting Started**

- [1. Interface overview](#1-interface-overview)
- [2. Sessions](#2-sessions)
- [3. Joining a session](#3-joining-a-session)

**Your Self-Report**

- [4. Intent](#4-intent)
- [5. Biases](#5-biases)
- [5b. Identity & consent](#5b-identity--consent)
- [6. Conflict detection](#6-conflict-detection)

**Shared Views**

- [7. Participants — Cards view](#7-participants--cards-view)
- [8. Participants — Stats view](#8-participants--stats-view)

**Models**

- [9. Models tab overview](#9-models-tab-overview)
- [10. Six Questions](#10-six-questions--contexts)
- [11. Cynefin](#11-cynefin)
- [12. eVSM v2](#12-evsm-v2)
- [13. 15 Ps](#13-15-ps)
- [14. Six Thinking Hats](#14-six-thinking-hats)
- [15. Custom graph models](#15-custom-graph-models)

**Shared Tools**

- [18. Topics tab](#18-topics-tab)
- [19. Export tab](#19-export-tab)
- [20. Clean up](#20-clean-up)

**Reference**

- [16. Session management](#16-session-management)
- [17. Tips & patterns](#17-tips--patterns)

---

## 1. Interface overview

The tool is a single HTML file hosted at Wiki Café. Open it in any modern browser — no install, no account. It requires an internet connection for real-time sync.

The interface has two panels:

- **Left panel** — your controls: join session, share link, session title, identity/consent, intent selection, bias checklist.
- **Right panel** — shared views: five tabs described below.

The header shows the tool name, the current session ID, and a live indicator dot — green when connected to Firebase, grey when offline.

The right panel has five tabs at the top: **Participants**, **Models**, **Topics**, **Export**, and **Session**. Stat pills in the tab bar always show the current participant count, total active biases, and intent–bias conflict count across the session.

---

## 2. Sessions

Every instance of the tool runs in a **session** — a shared Firebase namespace identified by a six-character ID. The session ID is embedded in the URL as a query parameter: `?s=ABC123`.

When you open the tool with no session ID in the URL, a new one is generated automatically and added to the URL. Share that URL with other participants and they will join the same session. Anyone who opens the same URL is in the same session.

Leaving a session does not delete what you contributed. Close your tab and your card is marked *left* and greys out, but your intents, biases and affect scores stay in the session and in its export — otherwise an export would only capture whoever happened to still be connected. To withdraw your input for good, use *Remove my input* in the left panel.

Because of that, a session outlives the meeting. Keep the URL and you can reopen it later; rejoining from the same browser resumes your existing card rather than creating a second one, because your browser is signed in anonymously and keeps the same identity. That sign-in is silent — no account, no password, nothing to accept — and it is what stops any participant from altering anybody's card but their own. The session stays in the database until somebody uses *End session and delete all data* on the Export tab, so download your exports before ending it. Anyone holding the six-character link can read the session for as long as it exists — end it when the group is finished.

> **Note:** Ending a session is now a deliberate act on the **Session** tab, and it is the only thing that deletes anything — see [§20 Clean up](#20-clean-up). Model SVGs are never included in an export, so download any you want to keep before ending.

---

## 3. Joining a session

1.  Open the tool URL (or a session URL shared by another participant).
2.  Enter your name in the **Your name** field in the left panel.
3.  Click **Join**.

After joining, the name field locks and your participant key is registered in Firebase. The **Intent** and **Biases** sections appear. The **Share This Session** box shows the URL — click **Copy Link** to copy it to the clipboard and share with others.

The link it gives you always points at the copy of the tool hosted on Wiki Café, even if you opened the tool from a file on your own computer. A `file:///` address only works on the computer it came from, so never share the address from your browser's address bar if it starts with `file:` — use Copy Link.

Your participant card appears in the Participants view immediately after joining. Other participants see you appear on their screens within a second.

> **Tip:** Set your intent before others arrive — it gives the group useful information from the start of the conversation rather than mid-way through.

---

## 4. Intent

Intent is what you are trying to accomplish in this conversation right now. Naming it makes it visible to others and helps you notice when your behavior diverges from it.

### Built-in intents

| Intent | When to select it |
|----|----|
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
|----|----|
| Divided attention | Part of your attention is elsewhere — phone, email, a parallel thread of thought. |
| Assuming communication success without checking | You believe you have been understood without verifying. Or you believe you understand without checking. |
| Doubling down when challenged | When someone pushes back, your position hardens rather than opening. The challenge triggers defense rather than curiosity. |
| Statements : Questions \> 1 | You are contributing more assertions than questions — a signal that you may be driving rather than exploring. |
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

By default every session starts in **Open** mode — names are visible in stats hover tooltips and model click annotations. The Identity section in the left panel lets any participant switch the session to anonymous mode.

Check *Make this session anonymous* to remove your name from all shared views. As soon as *one* participant checks the box, the whole session becomes anonymous for everyone. The session stays anonymous as long as any participant has the box checked. Uncheck it to restore Open mode (provided no one else is still checked).

### Voting display

The tab bar shows a running count: **Open: X/Y** where X is the number of participants who have *not* requested anonymity and Y is the total. The count is always visible; which specific participants voted which way is not shown.

The status line below the checkbox shows the current state: either a tally such as *2 open, 1 anonymous*, or *Open — names visible to everyone* when no one has requested anonymity.

### What changes in anonymous mode

| Feature | Open (default) | Anonymous (one+ checked) |
|----|----|----|
| Stats bar charts | Hover tooltip shows names of participants with that intent or bias | Count only — no names |
| Model click counts | Hover tooltip on each node/edge shows who clicked it | Count only — no names |
| Stats section label | Intents — N participants — Open | Intents — N participants |

> **Note:** Anonymous mode takes effect immediately — as soon as one participant checks the box, names disappear from all tooltips for everyone. Unchecking the box restores Open mode if no one else is checked.

---

## 6. Conflict detection

The tool maps which cognitive biases work against which conversational intents. When a participant has an active intent and a checked bias that conflict, a yellow warning appears on their participant card: *⚠ Intent–bias mismatch: N conflict(s)*.

This is visible to everyone in the session. It is not punitive — it is information. The group can choose to acknowledge it, ignore it, or use it as the entry point for a brief check-in.

### Conflict map

| Intent | Conflicts with these biases |
|----|----|
| Learning | Assuming communication success without checking; Doubling down when challenged |
| Socializing | Doubling down when challenged; Tone → Limiting Participation |
| Convincing | Divided attention; Assuming communication success without checking |
| Exploring | Doubling down when challenged; We need a model |
| Producing something | Divided attention; Doubling down when challenged; We need a model |
| Venting | (none — venting has no conflict mappings) |
| Being heard and acknowledged | Doubling down when challenged; Tone → Limiting Participation |
| Sharing / Teaching | Statements : Questions \> 1; Tone → Limiting Participation |

The count in the tab bar (Conflicts: **N**) shows how many participants currently have at least one intent–bias conflict.

> **Note:** Custom intents and custom biases are not included in conflict detection — only the eight built-in intents and six built-in biases are mapped.

---

## 7. Participants — Cards view

The default view in the Participants tab. Shows one card per participant, updated in real time as people join, leave, or change their selections.

### What each card shows

| Element | Meaning |
|----|----|
| Name | The participant's name as entered at join time. Your own card is outlined in red and has a "you" tag. |
| Intent badge(s) | Amber pill(s) showing each active intent. Multiple intents stack horizontally. |
| Bias tags | Small grey tags for each checked bias. Tags for biases that conflict with the participant's intent are shown in red. |
| Bias count badge | Red circle in the top-right corner of the card showing the number of active biases. Hidden if zero. |
| Conflict warning | Yellow banner at the bottom of the card: ⚠ Intent–bias mismatch: N conflict(s). Appears only when a conflict exists. |

Cards appear in join order. Participants who close their browser tab are automatically removed from the view within a few seconds.

---

## 8. Participants — Stats view

Click **Stats** above the card grid to switch to the aggregate statistics view. This shows bar charts summarizing the group's intent and bias distribution, plus model interaction data if any models have been used.

### Intent chart

One bar per intent, sorted by count descending. Shows how many participants have each intent active. Intents with zero participants are shown dimmed. Each intent has a distinct color.

### Biases chart

One bar per bias, sorted by count descending. Shows how many participants have each bias checked. Useful for noticing when a pattern (e.g., divided attention) is widespread across the group rather than individual.

### Model interaction sections

If any model has been opened and clicked in the session, the Stats view shows a section for each model with bars for clicked nodes and edges. These appear below the intent and bias charts, in pairs, labeling the model and click type (nodes / connections / questions).

> **Tip:** Stats view is useful for a facilitator who wants a quick read of the room without reading each card individually. Switch back to Cards to see individual names.

---

## 9. Models tab overview

Click **Models** in the tab bar to open the models tab. This tab contains five built-in thinking framework diagrams and a custom graph upload area.

Each model is an accordion — click the header to open or close it. **Only one model can be open at a time.** Opening a model subscribes to its click data in Firebase and renders the interactive SVG.

**Clicking a node or edge in a model increments its count by 1** for the whole session. Clicking it again decrements. Your clicks are tracked separately from others' — you cannot drive a count below zero regardless of how others have voted. Click counts persist as long as the Firebase session exists.

All model interaction counts appear in the **Stats** view on the Participants tab.

> **Note:** You must be joined (name entered, Join clicked) before model clicks are registered. Clicking before joining has no effect.

---

## 10. Six Questions / Contexts

Six Questions is an interactive question-and-answer framework. Six rows, each with a question on the left and an answer field on the right. The defaults are When, Where, Why, Who, How, What — but both question labels and answers are fully editable by any participant.

### Editing questions and answers

- Click the **colored question box** on the left to edit the question label. Changes sync across all participants.
- Click the **answer box** on the right to type an answer. Changes sync across all participants.
- Click the **answer box itself** (not the text field) to increment the click count for that answer row. A red count appears when the count is greater than zero.

### Timeline

Below the six rows, a timeline appears showing the order in which answers were filled in during the session. Each row shows a bar sized relative to the time elapsed between the first answer entered and that row's answer.

### Download SVG

Click **Download SVG** to export the current state of the Six Questions diagram as an SVG file — including question labels, answers, and click counts. Useful for archiving the session output.

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

De Bono's Six Thinking Hats rendered as a clickable SVG. Six colored hat nodes: White (data/facts), Red (emotion/intuition), Black (caution/risk), Yellow (optimism/value), Green (creativity/alternatives), Blue (process/control).

Click a hat to mark it as the dominant mode of the current conversation or the mode a participant is operating in. Click counts aggregate per hat across all participants and appear in Stats as "Six Thinking Hats."

> **Tip:** Six Thinking Hats works well alongside the intent/bias panel — checking "Tone limiting participation" while clicking Black Hat gives the group a precise vocabulary for what is happening.

---

## 15. Custom graph models

Any JSON file exported from the **RCN Graph Tool** can be uploaded as a custom interactive model. This lets the group use any diagram they have built as a shared clickable canvas during a conversation.

### Uploading a graph

1.  In the Models tab, click **Upload graph JSON**.
2.  Select a `.json` file exported from the RCN Graph Tool.
3.  The graph appears as a new accordion entry above the built-in models, labeled with the model name from the JSON.
4.  Click the accordion header to open it and render the interactive diagram.

### Interacting with a custom graph

Every node and edge in the uploaded graph becomes clickable. Click a node or edge to add your attention mark; click again to remove it. Counts aggregate across all participants in the session and appear in Stats under the model's name.

Custom graphs are stored in the session's Firebase namespace. All participants see the uploaded graph automatically — you only need to upload once per session.

### Download SVG

Click **Download SVG** in the open accordion to export the current state of the custom diagram, including click count annotations, as an SVG file.

> **Note:** Only one custom graph can be uploaded per session. To use a different graph, use New Session (which resets all data) or Reset interactions (which clears click counts but keeps the graph).

---

## 16. Session management

### Session Title

After joining, a **Session Title** field appears in the left panel below the Share link. Enter a name for this session — it is used as the page title in the FedWiki export (§19). The title is local to your browser; it does not sync to other participants.

The session controls live on the **Session** tab of the right panel:

| Control | What it does |
|----|----|
| **Sessions you have joined** | Lists every session you have joined from this browser, with its title and when you were last in it. **Open ↗** reopens one in a new tab; **×** forgets it locally without deleting anything. See §20. |
| **Start another session ↗** | Opens a new session, with a new ID, in a new tab. The session you are in keeps running and stays in the list, so nothing is abandoned. Share the new tab's link with its participants. |
| **Clear all model interactions** | Wipes every node and edge click on every model, for everyone. Participants, topics and scores are untouched. Use it to start a fresh round of model interaction without starting a new session. |
| **End session and delete all data** | Deletes every participant record, all topics and all model interactions, for everyone. You must retype the session ID first. See §20. |

> **Warning:** Clear all model interactions and End session are irreversible. There is no undo. Download the exports and any SVGs you want to keep before using either.

**Upload graph JSON**, at the top of the Models tab, adds a custom graph model. See §15.

### Leaving a session

Closing your browser tab does not remove what you contributed. Your card is marked *left* and greys out for everyone else, and your intents, biases and scores stay in the session and in its exports. Reopen the link from the same browser and you resume the same card. To delete your card and everything you contributed, use **Remove my input** at the bottom of the left panel before you go.

---

## 17. Tips & patterns

### Pre-conversation setup

1.  One person opens the tool, gets a session URL, and shares it before the conversation begins.
2.  Each participant opens the link and joins with their name.
3.  Everyone sets their intent before the first agenda item. The Cards view is already useful — you can see whether the group expects to be Learning, Convincing, Producing, or a mix.

### Running a model during conversation

Open a model on one screen visible to the group (projected, shared screen, or a dedicated device). As topics shift, the facilitator or any participant clicks the relevant nodes. The Stats view at the end shows where group attention concentrated.

### Using conflict warnings

When a conflict badge appears on a card, the group has a choice: acknowledge it explicitly, leave it as background information, or let the individual adjust their intent or bias. The value is not in forcing a response — it is in making the dynamic nameable without anyone having to deliver a critique.

### Connecting to the RCN Graph Tool

Build a diagram in the RCN Graph Tool (causal loop, EIP analysis, OPM process model, anything). Export JSON. Upload as a custom graph in a Conversation Navigator session. The group can now click the diagram together during discussion — turning a static artifact into a live attention map.

### Closing a session

Before ending: use the Export tab to download the FedWiki page JSON and the raw session JSON, and use the Download SVG button inside any open model accordion to export model diagrams with click-count annotations. Then end the session from the **Session** tab — people leaving does not clear it, and it stays readable to anyone with the link until somebody does. Full housekeeping guidance is in [§20 Clean up](#20-clean-up).

### Large groups

The Cards view can get crowded above ten participants. Switch to Stats view for a cleaner read of the room. The bias and intent charts scale naturally to any group size.

---

## 18. Topics tab

The Topics tab provides a lightweight shared agenda that any participant can edit in real time. Use it to surface what the group needs to discuss, track which items have been addressed, and keep the conversation focused.

### Adding a topic

Type in the **Add a topic for the group…** field at the top of the tab and press Enter or click **Add**. The topic appears immediately for all participants. Topics are ordered by the time they were added.

### Marking done

Click the checkbox next to a topic to mark it done. The topic is struck through and dimmed. Click again to unmark. Done state is shared — when one participant checks it, everyone sees it as done.

### Removing a topic

Click the × button on any topic to remove it from the session. Removal is immediate and visible to all participants.

The Topics tab badge in the tab bar shows the number of open (undone) topics so the group can track progress at a glance.

> **Note:** Topics are part of the session's Firebase data. They survive people leaving and appear in both exports, but they are deleted along with everything else when the session is ended. The Export tab's summary fields are the right place to capture key decisions or open items for the record.

---

## 19. Export tab

The Export tab produces a **FedWiki page JSON** that captures the session's intent and bias snapshot alongside a facilitator-written summary and carry-forward note. The JSON can be dragged into any FedWiki server to create a durable session record.

### Before exporting

Set a **Session Title** in the left panel (the field appears after you join, below the Share link). The title becomes the page title in the FedWiki export. Without a title the export will use a default placeholder.

### Export fields

| Field | What to write here |
|----|----|
| Summary | What happened in this session — key insights, decisions, or shifts. Written by the facilitator or anyone in the group. |
| Carry Forward | What this group needs to bring to the next session — open questions, commitments, unresolved tensions. |

### Downloading the export

**Download FedWiki page JSON** gives you a `.json` file to drag onto any FedWiki server, where it becomes a page with the session content. **Download raw session JSON** gives you the full state — every participant, score, topic and model interaction — for archiving or your own analysis. Names are stripped from the raw export when the session is anonymous, exactly as they are everywhere else.

Both exports include people who have already left. Nothing on this tab changes or deletes anything; ending a session lives on the **Session** tab, and is covered in [§20 Clean up](#20-clean-up).

> **Tip:** You can export at any time, including after everyone has gone home — a session stays live until somebody ends it. Export before ending, though, because ending is irreversible.

> **Note:** The exports do not include model SVGs. Download any diagrams you want to keep using the Download SVG button inside each model accordion.

---

## 20. Clean up

Sessions used to look after themselves: when the last person left, the data went with them. That is no longer true, and deliberately so — an export has to capture everyone who took part, not just whoever still had a tab open. The cost of that decision is that **tidying up is now a job somebody has to do**. This section is that job.

### The one rule

A session stays live, in full, until somebody ends it. Closing tabs does nothing. Everyone going home does nothing. Anyone holding the six-character link can still read the whole session tomorrow, next month, or next year.

### Ending a session

Go to the **Session** tab. At the bottom, inside the red block, click **End session and delete all data**. You will be asked to retype the session ID before it will run, and told how many participant records are about to go. This deletes every participant record, all topics and all model interactions, for everyone, permanently.

> **Tip:** Download both exports first. There is no undo, and no copy kept anywhere.

### Ending it while others are still connected

This is handled for you. Anyone still in the session sees their controls close and a note saying *"This session was ended. Anything you add now starts it fresh."* Their card disappears, nothing they do afterwards writes back into the deleted session, and closing their tab leaves nothing behind.

They can rejoin from the same page if the group wants to carry on — that begins a genuinely new session under the same link, with none of the old contents.

> **Tip:** Still worth ending a session after people have gone rather than during, simply so nobody loses a view they were reading from.

### Finding sessions you have lost

The Session tab lists every session you have joined from this browser, with its title and when you were last in it. **Open ↗** reopens one in a new tab, which is how you get back to something you meant to end and forgot.

The **×** on a row only forgets the session locally — it does not delete anything. Use it for sessions somebody else has already ended. If you clear your browser storage, or open a session from a different machine, the list will not have it; keep the URL somewhere if a session matters.

### Removing only your own contribution

**Remove my input**, at the bottom of the left panel, deletes your card and everything you contributed, and nothing else. That is the only action that erases your own data without touching anyone else's. Use it if you took part and would rather not be in the record; use *End session* if the whole thing should go.

### A session exists as soon as somebody opens the link

Opening a session URL creates a small amount of data even if you never join — the tool stores the shared model definitions there so everyone sees the same diagrams. Sending a link to ten people and having nobody join still leaves something behind. It is tiny, and ending the session clears it along with everything else.

### A reasonable habit

| When | Do this |
|----|----|
| End of the meeting | Fill in Summary and Carry Forward, download both exports, and download any model SVGs you want. |
| Once everyone has closed their tabs | Open the Session tab and end the session. |
| Every so often | Glance at the session list. Anything old and still openable is a session nobody ended — open it and end it. |

---

*Conversation Navigator · © Marc Pierson & Kerry Turner, RCN Co-Founders · [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)*
