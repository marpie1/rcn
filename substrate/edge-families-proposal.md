# Proposal: an edge family registry

Status: **PROPOSAL — nothing built.** For Marc's decision. Written 2026-07-28. Companion to `tool-inventory.md` row 12.

`tools/families.js` is the shared visual and semantic registry for **nodes**: eight families, one source, a validated palette. There is no equivalent for **edges**. Every document invents its own legend entries locally — `lg_e_support`, `lg_e_harm`, ids like `lg_1785188485798_604`. This proposes the missing half.

---

## 1. The evidence

Harvested from every graph JSON in `~/rcn/tools` and `~/rcn/maps`:

- **375 labelled edges**
- **202 distinct labels**
- **115 labels used exactly once**

Already drifting, with no registry to drift *toward*:

| Same idea, different strings |
|---|
| `create` (11) · `creates` (6) · `create / stimulates` · `stimulates` (2) |
| `support` (8) · `supports` (2) · `Supports` (2) · `Enables` · `enables` (4) |
| `constitute` (3) · `constitutes` (3) |
| `lead_to` (2) · `leads_to` (5) · `yield / lead_to` |
| `yield` (10) · `produces` (2) · `generates` (4) |

Two contributors drawing the same relation land on different strings, so nothing merges and no edge ever goes gold. This is the federation payoff failing in exactly the place it matters.

## 2. Not all of these are relations

The corpus contains at least three different animals. A registry that tries to swallow all of them will fail.

**(a) Relations** — the real target. `create`, `support`, `encompass`, `yield`, `play`, `undermines`, `steward`.

**(b) Branch guards** — from the flowcharts (POMR ×5, conversation flows, Groove). `yes`, `no`, `>85%`, `partial`, `act now`, `review`, `escalate`, `or stop`, `end session`. These are **conditions on a branch**, not kinds of relation. They belong in a `condition` property on a sequence edge, not in a family registry.

**(c) System-flow annotations** — from the architecture diagrams (`rcn-map-components`, `rcn-region-federation`). `downloads JSON`, `re-fetch on load`, `region data (CORS-open)`, `drag onto map`. These describe software plumbing, not neighborhood semantics. **Out of scope** — they should keep free-text labels and no family.

Roughly 260 of the 375 edges are (a). That is the population this serves.

## 3. Design constraints

1. **Cave Drawings.** A group must read it untrained. Few families, each obviously distinct. Seven is already at the limit for edges.
2. **Must not fight polarity.** CLD `+`/`−` already draws on every edge and is a separate layer. The family encoding cannot compete with it.
3. **Must not fight the node palette.** `families.js` owns eight Okabe-Ito hues on node borders. If edges also carry hue, an edge between two nodes becomes a third competing colour in the same few square inches.
4. **`label` stays untouched.** The author's words are provenance. The family is *added*, never substituted.
5. **Mode-aware.** Must cover CLD, EIP, NRM, OPM, SFD and IBIS without a family meaning different things in different modes.

## 4. The proposal: seven relation families

| # | Family | Means | Corpus verbs | Transitive? |
|---|---|---|---|---|
| 1 | **Influence** | A changes the *level* of B. Polarity says which way | create, drives, amplifies, undermines, erodes, catalyze, intensifies, dampens | no |
| 2 | **Provision** | A supplies something B *depends on*. Stops, and B stops | support, requires, pays for, uses, offer, grounds, steward, holds up | no |
| 3 | **Composition** | A is *part of* B | encompass, aggregate, constitute, comprises, part of | **yes** |
| 4 | **Classification** | A is a *kind of* or *instance of* B | is a, generalize, instance of, expressed as, realised in | **yes** |
| 5 | **Transformation** | Substance *moves or converts* from A to B. Carries quantity | yield, produces, generates, leads to, consumed by, flows to | no |
| 6 | **Agency** | A *acts in* B, or plays a part in it | play, enroll, oversee, operate in, handles, participate, inhabit | no |
| 7 | **Sequence** | A comes before B in a procedure. Carries a `condition` | then, next, starts clock, escalate, review | no |

**Why Influence and Provision are separate** — this is the distinction I would most defend, and it is the one neighborhoods care about. *Influence* is incremental: more of A, somewhat more of B. *Provision* is structural: if A stops, B stops. "The grant funds the program" is not "the grant increases the program." Only the second is a CLD arrow; only the first tells you what collapses when funding is cut. Merging them loses the fragility map.

**Why Composition and Classification are separate** — they are the two you *traverse transitively*, and traversing them together is nonsense: walking part-of chains assembles a whole, walking is-a chains finds a supertype. OPM already distinguishes them (`AP` vs `GS`), and per the option-4 rule in `tool-inventory.md`, these two are the candidates for genuinely typed Neo4j relationships rather than `linkType` properties.

**Sequence is the weakest of the seven.** It overlaps the timing layer (`rel: before/meets`) already on every edge. It earns its place only because the flowchart corpus is large and its arrows carry guards, which the timing layer has no room for. Worth challenging.

## 5. Encoding: declared, not drawn

> **Revised 2026-07-28**, after rendering `neighborhood-cave-drawing.json` and looking at it. The first draft of this section proposed that family ride the ARROWHEAD. That was wrong, and the exemplar shows why.

### 5.1 What the exemplar proves

Exported to SVG, the Cave Drawing defines **17 markers and every one is the same path** — `M0,1 L10,5 L0,9 Z`, a filled triangle, differing only in fill colour. graph-tool has exactly **one** arrowhead shape; markers are generated per colour, not per meaning. (OPM mode has its own markers; the general path does not.)

Its two edge kinds are told apart like this:

| | colour | width | dash |
|---|---|---|---|
| holds them up | green `#16a34a` | 2.0 | solid |
| acts on them | red `#dc2626` | 3.5 | `8 5` |

**Two kinds, three redundant channels.** Hue *and* weight *and* dash, each saying the same thing. That is why it reads across a room, in greyscale, to someone who has never seen it. It is textbook redundant encoding, and it is why this is the exemplar.

The rejected proposal asked for **seven** kinds on **one** channel — the arrowhead, the smallest mark on the canvas. That is the opposite trade. A filled diamond vs. a hollow triangle vs. a filled triangle at 8px is hard to tell apart on a projector or a handout; green vs. red at 3.5px weight is unmissable. The first draft optimised for the substrate's need to distinguish seven things and spent the reader's attention to do it. Cave Drawings says the reader wins.

### 5.2 The rule: local styling stays free; family is declared

**Semantics and encoding do not have to be one-to-one.** The registry carries seven families for merging and querying. Any given drawing renders only the two or three distinctions *that drawing* needs, using whatever channels read loudest for its group.

The legend-as-registry work already does most of this. What is missing is that a legend entry does not say **which family it is**. One new field:

```json
{ "id":"lg_e_harm", "kind":"edge", "label":"acts on them",
  "color":"#dc2626", "width":3.5, "dash":"dashed",
  "linkFamily":"Influence" }
```

Then Superior's red dashed *"acts on them"* and Whatcom's orange dotted *"grinds them down"* both declare `linkFamily: Influence` and **merge into a gold edge** — while each drawing keeps the styling its own group reads best.

Local encoding stays loud and free. The family is what is shared.

### 5.3 Family as words on the edge

Marc, 2026-07-28: *"why not allow the user to display the edge type as words on the edge, along with edge labels?"* — **Adopt this. It is stronger than any visual encoding.**

Words are unambiguous. No legend lookup, no CVD risk, no 8px discrimination problem, and no ceiling: seven families or twenty, words do not run out.

The deeper argument is **correctability**. A family assignment written as a dash pattern is invisible, so a wrong one is never challenged. Written as the word *Provision* on the edge, a group can point at it and say "no, that one's Influence." That is the same discipline as `eip-cld-subgraph-mismatches.md`: nothing is guessed silently. It also makes migrating the 202 legacy labels a thing a human can *see* rather than audit in a table.

The cost is clutter — 57 EIP edges carrying two texts each is 114 runs of type. So it is a **toggle**, not always-on, alongside the existing `?± Gaps` control:

| Mode | Shows | For |
|---|---|---|
| **label** | `holds them up` | default — today's behaviour |
| **family** | `Provision` | reading the structure: 202 labels collapse to 7 words |
| **both** | `holds them up` · `Provision` | authoring and QA — the migration mode |
| **neither** | — | pure picture |

**family** mode is itself a lens in the substrate's sense: the same drawing read at a coarser grain. On the Cave Drawing it would show a group at a glance that everything entering RESIDENT is Provision except the two that are Influence.

Precedent: CLD polarity already draws as a glyph (`+`/`−`), a word-like mark rather than a colour. This extends a pattern rather than inventing one.

### 5.4 The arrow palette becomes a default, not a mandate

Distinct arrowheads still earn a place — as the **fallback** for a drawing that has not been hand-styled, such as a dense 57-edge EIP composite nobody is going to give a bespoke legend. Not as the required encoding.

| Family | Default marker | Borrowed from |
|---|---|---|
| Influence | plain open arrow | CLD convention |
| Provision | open arrow, dashed line | UML dependency |
| Composition | filled diamond | UML composition |
| Classification | hollow triangle | UML generalization |
| Transformation | filled triangle | flow / SFD |
| Agency | small filled circle | OPM agent |
| Sequence | plain arrow, thin | flowchart convention |

Building these is real work: `getMarkerId()` is keyed on colour only, so shape variants are new code, not configuration. Worth doing *after* 5.2 and 5.3, which deliver the merge key and the readability without touching the renderer's marker logic.

## 6. Proposed file — `tools/edge-families.js`

Mirrors `families.js` exactly: a `.js` not `.json` so it loads over `file://`; one source, no JSON twin; everything after the assignment is plain JSON.

```js
// edge-families.js — the shared relation vocabulary. Sibling of families.js.
window.EDGE_FAMILIES_DATA =
{
  "_comment": "Seven relation families. A relation belongs to exactly one. The family rides the ARROWHEAD, not the hue — families.js already owns colour on node borders, and a third colour between two nodes competes with it. label keeps the author's own words; linkFamily is added, never substituted.",
  "order": ["Influence","Provision","Composition","Classification","Transformation","Agency","Sequence"],
  "families": {
    "Influence":      { "marker":"arrow-open",     "dash":"solid",  "width":1.5, "transitive":false, "gloss":"changes the level of",       "verbs":["create","drive","amplify","undermine","erode","catalyze","dampen","intensify"] },
    "Provision":      { "marker":"arrow-open",     "dash":"dashed", "width":1.5, "transitive":false, "gloss":"supplies what it depends on","verbs":["support","require","pay for","use","offer","ground","steward","hold up"] },
    "Composition":    { "marker":"diamond-filled", "dash":"solid",  "width":1.5, "transitive":true,  "gloss":"is part of",                 "verbs":["encompass","aggregate","constitute","comprise"] },
    "Classification": { "marker":"triangle-open",  "dash":"solid",  "width":1.5, "transitive":true,  "gloss":"is a kind of",               "verbs":["is a","generalize","instantiate","express as","realise in"] },
    "Transformation": { "marker":"triangle-filled","dash":"solid",  "width":2.0, "transitive":false, "gloss":"becomes / yields",           "verbs":["yield","produce","generate","lead to","consume","flow to"] },
    "Agency":         { "marker":"circle-filled",  "dash":"solid",  "width":1.5, "transitive":false, "gloss":"acts in",                    "verbs":["play","enroll","oversee","operate in","handle","participate","inhabit"] },
    "Sequence":       { "marker":"arrow-open",     "dash":"solid",  "width":1.0, "transitive":false, "gloss":"then",                       "verbs":["then","next","start","escalate","review"] }
  }
}
```

The `verbs` lists are **suggestions for authors and a mapping aid**, not a closed set. An author writes what they like in `label`; the verb list is how a tool (or Claude) proposes a family for it.

## 7. How it lands in each mode

| Mode | Families used | Note |
|---|---|---|
| CLD | Influence | polarity does the rest; a CLD is one family with two signs |
| EIP | all seven | the 57-edge composite spans them |
| NRM | Influence, Provision | Tripod Beta barriers are Provision that failed |
| OPM | all seven | maps onto its 10 ISO 19450 types — see below |
| SFD | Transformation, Influence | flows vs. information links |
| IBIS | Influence (signed) | supports = `+`, objects-to = `−` |

**OPM's 10 → the 7:** `AP`→Composition · `GS`→Classification · `CI`→Classification · `EC`→Composition · `Agent`→Agency · `Instrument`→Provision · `Consumption`→Transformation · `Result`→Transformation · `Effect`→Influence · `Invocation`→Sequence.

Nothing is lost: `linkType` keeps the precise OPM code, `linkFamily` gives the coarse reading a lens (or an untrained group) can use.

## 8. Migration — nothing is destroyed

`label` is never rewritten. Each edge gains `linkFamily`. The 202 existing labels stay exactly as authored; ~85 of them map to a family by the verb lists, and the rest are proposed one at a time and confirmed by a human. Same discipline as `eip-cld-subgraph-mismatches.md`: **nothing is guessed silently.**

Edges in the (b) and (c) populations of §2 get no family, and that is correct.

## 9. Open questions

1. ~~**Seven or six?**~~ **RESOLVED 2026-07-28 — keep Sequence.** Marc: "we will learn by using it." Its overlap with the timing layer is accepted as something to observe in practice rather than design away in advance.
2. ~~**Is Influence/Provision the right cut?**~~ **RESOLVED 2026-07-28 — keep.** Marc: "common understanding." The distinction is treated as one field groups already make, not one the scheme imposes.
3. ~~**Does the marker encoding survive a real drawing?**~~ **ANSWERED 2026-07-28 — no, and §5 is rewritten.** Rendering the exemplar showed two edge kinds carried on three redundant channels, against a proposal of seven kinds on one small channel. Family is now *declared* on the legend entry and optionally shown as **words**, not carried by the arrowhead. The remaining test is smaller: does declaring a family per legend entry feel natural while drawing?
4. ~~**Who owns the registry?**~~ **RESOLVED 2026-07-28 — `tools/edge-families.js` is the source; the substrate holds a generated copy.** See §11.

## 10. Recommendation

Adopt **seven families, declared not drawn**, in this order — each step is useful on its own and none depends on the next:

1. **`tools/edge-families.js`** — the registry (§6, §11). Nothing renders differently; the vocabulary simply exists.
2. **`linkFamily` on legend entries** (§5.2). The merge key. Local styling is untouched, so every existing drawing looks identical.
3. **The edge-text toggle** (§5.3) — label / family / both / neither. Makes the assignment visible and therefore correctable, and gives the migration in §8 a mode a human can work in.
4. **Default arrowhead shapes** (§5.4) — last, and only for un-styled drawings. Real renderer work; the least of the value.

Steps 1–3 need no change to `getMarkerId()` or the marker pipeline at all.

The fallback, if seven proves too fine in practice, is three (Influence, Provision, Composition) plus free text — which still kills the drift in §1.

---

## 11. Where the registry lives

**`tools/edge-families.js` is the source. The substrate holds a generated copy, rebuilt from it. The flow is one-directional and never reversed.**

This is the pattern `seed.py` already uses for `families.js`, and it follows from three hard constraints.

**1. The tools must work with the database off.** Neo4j Desktop is started by hand. `graph-tool-v22.html` runs standalone, offline, off a USB stick, inside a FedWiki asset folder, on someone else's machine. If the vocabulary lived only in Neo4j, every tool would lose its edge semantics whenever the DBMS was down — which, for everyone who is not Marc, is always.

**2. `file://` rules out JSON.** `families.js` is a `.js` for a reason recorded in its own header: `fetch()` cannot read a `file://` URL, so a JSON sidecar "silently left every node grey when the tool was opened straight off disk." The edge registry inherits that constraint exactly.

**3. Vocabulary and content have different lifecycles.** This is the deciding argument.

> **Content** changes constantly, by many hands → belongs in the database. **Vocabulary** changes rarely and deliberately, by few hands → belongs in a file under version control.

Seven relation families are a *governance artifact*, not user data. What you want when one changes is history, diff, review, blame and rollback — which git gives free and Neo4j gives not at all. A `:Family` node edited in the Browser leaves no trace of who changed it, when, or why.

### The trap worth naming

The tempting RCN-native answer is **FedWiki as the source** — a vocabulary page each NDC can fork. It fits the federation story everywhere else, and it is wrong here.

A forkable vocabulary is not a merge key. If Superior forks the registry and renames Provision, gold nodes stop working between Superior and Whatcom — and the registry exists precisely so that two neighborhoods drawing the same relation land on the same thing. **Fork the content; never fork the merge vocabulary.**

The growth path, if a neighborhood genuinely needs a local relation kind, is the Dublin Core shape: a stable shared core plus namespaced local extensions that never collide with it. Not now.

### Concretely

- `tools/edge-families.js` — sibling of `families.js`, same directory, same format, same one-source rule in its header comment.
- `substrate/seed.py` parses it and builds `:LinkFamily` nodes, exactly as it already does for `:Family`.
- Editing relation families in the Neo4j Browser is **never** correct. Edit the `.js` and re-run the seed.
