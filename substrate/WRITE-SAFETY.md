# Write safety — how ordinary people get to enter data without breaking anything

Plan, not yet built. Written 2026-09-07 by Marc + Claude Code, at the point where the toolset started working well enough that opening it to people who are not us became a real question.

Read `ROUND-TRIP.md` first for how a write actually travels. This file is about what has to be true before anyone else is allowed to make one.

---

## The question that started it

Marc: *"I am wondering if we should now force them to use Claude to enter new data so that YOU are responsible for not accidentally corrupting the Neo4j db."*

The worry is right and the mechanism is wrong, for four reasons worth keeping because they will come up again.

**An LLM is not a reliable guard.** On the day this was asked, Claude broke the write path twice — a `NameError` and a merge that matched nothing — and both destroyed data. What recovered it was files in git, loaders that rebuild, and before/after counts. Putting a nondeterministic component in front of a write does not make the write safer; it makes its failures harder to predict. Both bugs that got *fixed* that day were deterministic, which is why they were findable.

**The property we want is structural and already half-built.** Decision 17: the files are the source of truth, the database is derived. That is a stronger guarantee than any gatekeeper, and it does not depend on anything being clever.

**It contradicts the foundational commitment.** Every tool open source, CC BY 4.0, never for sale, belonging to the commons, incapable of being captured by a single owner. Making an Anthropic API call a *required* step for entering data makes the commons depend on a proprietary service, with a per-write cost and a per-person key. That is the Larry Weed lesson aimed at our own work.

**It does not scale to a neighbourhood.** A CHW entering a household needs it to work on a phone, offline, in a basement, for free.

---

## The four things to build instead

### 1. Files as truth, defended rather than assumed

Locked as decision 17. What remains is enforcement: **no data may exist only in the database.** Today that holds because every loader reads files, but nothing stops a future writer from putting rows straight into Neo4j.

- Every write path must produce a file as well as a database change — the graph tool already does, via `POST /subgraph/<name>/file`.
- A periodic check that the database can be rebuilt from files and come back identical. That is the real test of the rule, and it is cheap: run the loader into a scratch database and compare counts and schemaLabels.
- `SRC_DIRS` in `aspect_file.py` already names which files back which database. A database with no entry there has no file leg, and should refuse writes rather than accept ones it cannot persist.

### 2. Validate at the boundary

**The deterministic version of what an LLM was being asked to be.** A schema check on the way in that refuses a malformed payload outright instead of half-writing it.

- Runs in `put_subgraph` before anything is touched — before the retract, not after.
- Checks what the model actually requires: every node has a usable key under that database's convention; every edge's endpoints exist in the payload; labels are non-empty; the database is one we know how to write.
- Refuses the whole payload on any failure, with a message naming the offending node. Never a partial write.
- **This would have caught one of the two failures on its own** — the merge that matched nothing produced a payload whose edges referenced endpoints that resolved to no concept.

### 3. Destructive actions separate and marked

Marc's standing rule, and the write path is exactly where it applies.

- `put_subgraph` deletes; the deletion now runs last and is preceded by a rollback capture (done 2026-09-07), but it is still bundled into the same call as the ordinary save.
- Separate the retire step from the save step, so retiring something is a thing you chose rather than a side effect of pressing Save.
- Report what *would* be retired before doing it. The counts already exist in the response — `deletedLastWitnessNodes`, `deletedLastWitnessEdges` — they just arrive too late to decline.

### 4. Claude as advisor, never as gate

Where an LLM is genuinely good, and where being absent costs nothing:

- Suggesting an existing label instead of a near-duplicate — *you are about to create a second `MEMBER HOUSEHOLD`*.
- Explaining what a change will do before it happens, in the person's own terms.
- Reading the "one name, two kinds" and near-collision reports the loaders already print, and saying which ones look like mistakes.

This is already the pattern the tools use — decision 11, **labels are never normalised, only suggested**. Advisory, reversible, and it degrades to nothing when the network is down or nobody has a key.

---

## The order to build them

1. **Boundary validation** (§2). Smallest, highest value, would have caught a real failure, and it is the piece that most directly answers the original worry.
2. **Rebuild-and-compare check** (§1). Turns decision 17 from a claim into something tested.
3. **Separating the retire step** (§3). Needs a UI decision as well as a server one.
4. **Advisory Claude** (§4). Last, because it is the only one that is not a safety property — it is a convenience, and it must never become load-bearing.

## What must stay true whatever gets built

A person with no account, no key and no network must still be able to open a drawing, read a table, and follow a row into a picture. Reading is not gated. Only writing is, and only by a check that runs on their own machine.
