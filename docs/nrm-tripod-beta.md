# NRM — Neighborhood Risk Management
## Tripod Beta for the RCN Context

---

## What it is

NRM (Neighborhood Risk Management) is Tripod Beta adapted for neighborhood-scale civic and cooperative work. Tripod Beta is a systemic incident investigation methodology developed by James Reason at the University of Leiden and Victoria University Manchester, commissioned by Shell International in the late 1980s and formalized after the Piper Alpha disaster (1988). Shell's goal was to stop blaming individuals for incidents and start finding the organizational and systemic failures that made those incidents inevitable.

The core insight: incidents don't happen because of a single human error. They happen because a sequence of organizational failures created conditions in which an error became likely, and because barriers that should have stopped the incident were absent, inadequate, or defeated. Fixing the person doesn't fix the system.

For the RCN, the application is neighborhood-scale risk: why do community initiatives fail, why do cooperative structures break down, why do civic processes produce harm or neglect rather than care? The methodology transfers directly. The same causal chain — Underlying Cause → Precondition → Immediate Cause → Failed Barrier → Event — describes organizational failures at the neighborhood scale just as well as it describes industrial accidents.

---

## Two tools

| File | Purpose |
|------|---------|
| `tools/nrm-tripod-beta.html` | Standalone full Tripod Beta diagramming tool — drag-and-drop canvas, all node types, barriers on connection lines, save/load JSON, SVG/PDF export |
| `tools/graph-tool-v22.html` | NRM mode added alongside CLD and EIP — place Tripod Beta typed nodes on a shared graph canvas, connect with standard edges, export to Neo4j Cypher |

The standalone tool is the right instrument for a focused incident analysis. The graph tool NRM mode is for integrating a Tripod Beta analysis into a larger CLD or EIP diagram — for example, anchoring a causal chain to a CLD feedback loop that explains why a neighborhood system produced an adverse outcome.

---

## Causal logic

Causation flows **left to right**, from organizational roots to the incident event:

```
Underlying Cause → Precondition → Immediate Cause → [Failed Barrier] → Event
                                                                          ↑
                                                               Agent + Object
```

Reading the diagram:

- The **Event** is the incident: a change of state in which an Object is adversely affected by an Agent of Change.
- The **Agent** is the entity with potential to cause harm. The **Object** is what receives it. One Agent and one Object per Event trio — this is a hard rule.
- **Barriers** sit on the trajectory between Agent/Object and Event. Failed Barriers let the harm through. Intact Barriers stop it (and turn the Event into a near miss).
- The **causal path** runs from each Failed Barrier back through Immediate Cause, Precondition, and Underlying Cause. This is the "why did the barrier fail?" investigation.
- **Missing/Inadequate Barriers** connect directly to Underlying Causes — no Immediate Cause or Precondition, because by definition no one defeated them. They simply were never there, or were inadequate by design.

---

## Node types

### Causal Chain

| Node | Color | Meaning |
|------|-------|---------|
| **Underlying Cause** | Dark red `#CC4125` | Organizational deficiency or anomaly. Root of the causal path. Always an end node (nothing points further left). Assign a BRF code (see below). |
| **Precondition** | Amber `#F6B26B` | The environmental, situational, or psychological system state that promotes the Immediate Cause. The link to Immediate Cause is probabilistic, not strictly causal — shown as a dotted line in the official spec. |
| **Immediate Cause** | Red `#E06666` | The action, omission, or technical failure that defeats the barrier. Close in logic (not necessarily time or location) to the Failed Barrier. Exactly one Immediate Cause per Failed Barrier. |

### Incident Trio

| Node | Color | Meaning |
|------|-------|---------|
| **Agent** | Yellow `#FFD966` | Entity with potential to harm or change the Object. No inputs (left-side connections). |
| **Object** | Green `#B4D7A8` | Entity that receives the change. No inputs. |
| **Event** | Pink `#EA9999` | The incident. Exactly two inputs: one Agent path and one Object path. |
| **Event/Agent** | Peach `#F4C2A1` | Combination node. Used when an Event creates a new Agent for a subsequent trio (chained events). |
| **Event/Object** | Light green `#C6E4B8` | Combination node. Used when an Event creates a new Object for a subsequent trio. |

### Barriers

| Node | Color | Meaning |
|------|-------|---------|
| **Failed Barrier** | Blue `#9FC5E8` | Barrier that existed but was defeated by an Immediate Cause. |
| **Missing Barrier** | Purple `#B4A7D6` | Barrier that should have been in place but wasn't, or was inadequate for the intended role. No Immediate Cause. Links directly to Underlying Cause. |
| **Intact Barrier** | Dark blue `#6FA8DC` | Barrier that held. Terminates the causal chain — no Immediate Cause, Precondition, or Underlying Cause. Signals a near miss. |

### Other

| Node | Color | Meaning |
|------|-------|---------|
| **Narrative** | Light gray `#F1F5F9` | Clarification note. Attaches to a connection to explain a link that the model alone cannot capture. |

---

## Connection rules (Annex 6 of the official spec)

These rules come directly from the Tripod Beta User Guide. Violations indicate an incomplete or incorrect analysis.

1. Each Event has **exactly one Agent** and **exactly one Object** connecting to it.
2. One Agent can affect multiple Objects, creating multiple Events.
3. One Object can be affected by multiple Agents, creating multiple Events.
4. **Failed Barrier** has exactly **one Immediate Cause**.
5. **Missing Barrier** connects **only to Underlying Cause** — never to Immediate Cause or Precondition.
6. **Intact Barrier** has no causal inputs — it is always a terminal node.
7. The Precondition → Immediate Cause link is probabilistic (influence, not strict causation).
8. An Underlying Cause is always an end node (no inputs from the left).
9. A core diagram typically contains **2 to 5 Agent-Object-Event trios**.

---

## Basic Risk Factors (BRFs)

Underlying Causes are classified into 11 Basic Risk Factors, which identify where in the management system the remedy lies. Add a `brf` property to any Underlying Cause node in the Properties panel.

| Code | Name | What it covers |
|------|------|----------------|
| HW | Hardware | Inadequate quality, non-availability, ageing of materials or equipment |
| DE | Design | Layout or design deficiencies that promote errors |
| MM | Maintenance Management | Failures in systems for ensuring technical integrity |
| PR | Procedures | Unclear, unavailable, incorrect, or unusable task information |
| EC | Error-enforcing Conditions | Time pressure, physical conditions, changes that promote sub-standard acts |
| HK | Housekeeping | Tolerance of deficiencies in tidiness, cleanliness, or resources |
| IG | Incompatible Goals | Failure to manage conflict between safety and production, or formal and informal rules |
| CO | Communication | Failure to transmit information clearly to the right recipients |
| OR | Organisation | Structural deficiencies that allow responsibilities to become ill-defined |
| TR | Training | Deficiencies in awareness, knowledge, or skill development |
| DF | Defences | Failures in systems for control or mitigation of harm |

The BRF code exports to Neo4j Cypher and can be queried across multiple analyses to reveal which management system failures are systemic across an NDC or across the network.

---

## Using NRM mode in the graph tool

1. Open `tools/graph-tool-v22.html` in a browser.
2. Click **NRM** in the Graph Mode section (right panel, top).
3. The right panel shows the Tripod Beta palette, grouped by Causal Chain / Incident Trio / Barriers.
4. Click a node type to activate it (highlighted with a dark border). Click canvas to place a node with the correct color and label pre-filled.
5. Use **+ Edge** mode to connect nodes according to the connection rules above.
6. Add edge labels in the Properties panel to override the default relationship type in Cypher export.
7. Add `ndc_id` as a node property to link the analysis to a specific NDC location in PostGIS/Neo4j.
8. Add `brf` as a property on Underlying Cause nodes (e.g., `TR`, `CO`, `OR`).
9. Export to **NRM→Cypher** (Export section, orange) to generate a Neo4j Cypher file.

NRM nodes placed on the canvas retain their `nrmType` and color in JSON save/load, and round-trip correctly through the standard JSON and DOT export formats.

---

## Neo4j Cypher export

The `NRM→Cypher` export generates:

```cypher
// NRM Analysis — [model name]
// Generated [date]

CREATE (n1:NRM:UnderlyingCause {
  name: "Inadequate conflict resolution procedures",
  nrm_type: "underlyingCause",
  brf: "PR",
  brf_label: "Procedures",
  ndc_id: "superior-az"
})

CREATE (n2:NRM:FailedBarrier {
  name: "Community mediation process",
  nrm_type: "failedBarrier",
  ndc_id: "superior-az"
})

CREATE (n1)-[:EXPLAINS]->(n2)
CREATE (n3)-[:DEFEATS]->(n2)
CREATE (n2)-[:ALLOWS_PATH_TO]->(n4)
```

**Relationship types** are inferred automatically from the source/target `nrmType` pair. Manual edge labels override them.

| Source → Target | Default relationship |
|----------------|---------------------|
| UnderlyingCause → Precondition | `CREATES` |
| UnderlyingCause → MissingBarrier | `EXPLAINS` |
| Precondition → ImmediateCause | `PROMOTES` |
| ImmediateCause → FailedBarrier | `DEFEATS` |
| Agent → Event | `TRANSFERS_ENERGY_TO` |
| Agent → FailedBarrier | `TRANSFERS_ENERGY_THROUGH` |
| Agent → IntactBarrier | `BLOCKED_BY` |
| Object → Event | `RECEIVES_TRANSFER` |
| Object → FailedBarrier | `EXPOSED_THROUGH` |
| Object → IntactBarrier | `PROTECTED_BY` |
| FailedBarrier → Event | `ALLOWS_PATH_TO` |
| MissingBarrier → Event | `UNGUARDED_PATH_TO` |
| Event → EventAgent | `CREATES_AGENT` |
| Event → EventObject | `CREATES_OBJECT` |

The `:NRM` shared label allows cross-analysis queries:

```cypher
// All analyses at a given NDC
MATCH (n:NRM {ndc_id: 'superior-az'}) RETURN n

// All Underlying Causes with BRF = Training across all NDCs
MATCH (n:NRM:UnderlyingCause {brf: 'TR'}) RETURN n.name, n.ndc_id

// Full causal chain for a given event
MATCH p=(uc:UnderlyingCause)-[*]->(e:Event) RETURN p
```

---

## Relationship to the rest of the RCN stack

| Tool | Connection |
|------|-----------|
| **CLD** (graph-tool NRM mode) | A CLD feedback loop that produces a harmful outcome can be annotated with a Tripod Beta causal path. The NRM mode and CLD mode are both available in the same canvas — place NRM nodes alongside CLD variables and connect them with typed edges. |
| **EIP** (graph-tool NRM mode) | Institutional failures (Incompatible Goals, Organisation, Communication BRFs) can be traced to specific EIP nodes. A missing barrier may be an institutional gap; an underlying cause may sit in the Politics or Ecology column. |
| **Vester** | Underlying Causes with high cross-impact in a Vester sensitivity matrix are structurally similar to BRFs with high recurrence across multiple analyses. Cross-reference the two to find leverage points with both systemic weight and incident history. |
| **PostGIS / Neo4j** | `ndc_id` on NRM nodes links analyses to `place_geo` rows. Neo4j Cypher export uses the shared `:NRM` label for cross-location queries. |
| **SODOTO** | A future NRM practitioner credential would gate the ability to conduct a formal Tripod Beta analysis at an NDC. The methodology is learnable but requires practice — accreditation is part of the original spec. |

---

## Next development steps

- **Validation overlay** in NRM mode: flag broken connection rules as warnings (e.g., Event with no Agent, Failed Barrier with multiple Immediate Causes, Missing Barrier connected to Immediate Cause)
- **BRF selector** in the Properties panel for Underlying Cause nodes — dropdown instead of free-text
- **Remedial action nodes** — the spec requires SMART actions on every Failed Barrier and Underlying Cause; a dedicated node type or a structured property would support this
- **SODOTO NRM credential** — gate definitions for NRM Observer, Practitioner, and Facilitator
- **Trend query templates** — pre-built Cypher for BRF frequency analysis across NDCs, to surface systemic patterns from accumulated analyses

---

## Source

Tripod Beta User Guide, Shell International, based on research by the University of Leiden and Victoria University Manchester (late 1980s–early 1990s), commissioned after the Piper Alpha disaster (1988, 167 killed, North Sea).
