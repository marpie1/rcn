# OPCloud feature notes — for enhancing the Graph Tool's OPM mode

Observed directly in Marc's licensed OPCloud instance at https://opcloud.systems/ on 2026-08-18, driving the live app (account: Marc Pierson, The College of Exploration). Models inspected: Neighborhood Developing, Neighborhood Developing OPCat, ReLocalize Creativity Network, Cl Diagraming, OnStar example. This is an inventory of what OPCloud actually does, and what is worth porting to `tools/graph-tool-v22.html` OPM mode — not a wish list.

## What OPM mode already has

Nine link types, a relationship picker, OPL sentence generation, and Cypher/CSV export. The gaps below are all additive to that.

## Gap 1 — essence and affiliation (highest value, lowest cost)

Every OPCloud object carries two orthogonal binary properties, and both show in the OPL and on the drawing.

**Essence** is physical or informatical. Physical draws with a shadowed (double) contour; informatical draws flat. **Affiliation** is systemic or environmental. Environmental draws with a **dashed** contour; systemic draws solid. Default is informatical + systemic, which is why an untouched object reads "X is an informatical and systemic object."

Both appear in every object's OPL sentence as a fixed pattern: `<Name> is a[n] <essence> and <affiliation> object.` Processes take the same pattern with "process" as the noun.

This is worth porting first because it costs two booleans plus two border styles, it is the notation OPM uses to mark the **system boundary** (environmental = outside), and it is load-bearing for the Odum work — a heat sink is a physical *environmental* object, so without affiliation the sink rule cannot even be stated. It also surfaced a real modelling discrepancy in Marc's own work: `Side Effect Set` is systemic in Neighborhood Developing OPCat but environmental in Neighborhood Developing.

## Gap 2 — in-zooming versus unfolding are two different mechanisms

OPCloud distinguishes them sharply, and the OPD tree names which one each child diagram is.

**Unfolding** decomposes a *thing* into parts — `SD2: Ideal Set unfolded`. It draws as a tree with the triangle at the whole. **In-zooming** opens a *process* to reveal sub-processes inside its ellipse — `SD1: Neighborhood Developing in-zoomed`. Sub-processes stack vertically inside the parent ellipse, and **vertical position means time order**. Nesting continues: `SD1.1: Leading in-zoomed`.

The OPL says so explicitly: *"Neighborhood Developing from SD zooms in SD1 into Leading, Designing, Financing, Supporting, and Producing, which occur in that time sequence."* The phrase "which occur in that time sequence" is generated from geometry — the modeller never types it.

For the Graph Tool this is the big structural feature. Minimum viable version: a `zoomsInto` / `unfoldsInto` field on a node pointing at another diagram, plus the tree panel to navigate them. The time-order-from-vertical-position rule is a nice free inference if sub-processes are drawn inside a container.

### CRITICAL — the two are not interchangeable, and unfold is the more general one

**Unfold handles all four fundamental structural relations. In-zoom really only handles aggregation.** You cannot in-zoom "Restaurant is a Business" — a specialization is not *inside* the general. So unfold stays necessary for features (exhibition), kinds (generalization), and instances (classification), and any implementation that treats in-zoom as a strictly better unfold will lose three of the four relations.

The converse asymmetry is just as real, and it is what makes in-zoom worth having at all. In-zoom can carry **time order** (vertical position inside the parent contour *is* sequence — that is where the OPL phrase "which occur in that time sequence" comes from); it is where **relations among the parts** live (an unfold gives you N parts and says nothing about how they touch); and it is the only place the **parent's procedural links can attach to specific children**. That last one is why the nine consumed inputs in Neighborhood Developing OPCat are still parked on the parent process: unfolding offers no mechanism to distribute them.

Working rule: **in-zoom when the parts have an order, interact with each other, or need to receive the parent's links. Unfold when it is a flat taxonomy with no interaction among siblings, or when the relation is not part-whole.**

In-zoom does have a genuine advantage for reading, which is perceptual rather than logical: containment is understood instantly and without notation training, where a tree requires knowing which end the triangle sits on. In-zoom also keeps the parent's own contour and external links on screen, so you never lose the context an unfold discards. That is a real cave-drawings argument for preferring it *where it applies*.

## Gap 3 — the OPD tree and System Map

A left-hand tree lists every diagram with its relationship to the parent (`SD`, `SD1: X in-zoomed`, `SD2: Y unfolded`). Depth navigation buttons walk up, down, back and forward through it.

**Model Options → System Map** renders the entire model as one page — every diagram as a thumbnail, connected by arrows showing which diagram derives from which. For Neighborhood Developing it showed SD plus four children at a glance and confirmed nothing was hidden. Genuinely useful for auditing a model you did not write, and a good fit for the cave-drawings goal.

## Gap 4 — value states as a rated set

Attributes can carry enumerated states drawn as labelled boxes inside the object, with one marked as current. Marc uses this as a stoplight: `Quality Of Financing` has states **unrated / red / yellow / green**, and every one of the five sub-processes in Neighborhood Developing OPCat exhibits its own `Quality Of <Process>` object rated this way.

That is an assessment overlay riding on a process chain, and it is a pattern worth supporting directly rather than as ad-hoc labels. States are already in ISO 19450 (`7.3.5 Object states`), including initial, default and final markers.

## Gap 5 — validation is a mode, not a rule set

**Model Options → Model Validation Options** offers exactly two knobs:

- **Validation Time** — Design time / Execution Time / Design time & Execution Time
- **Enforcement level** — Soft Validation / Hard Validation

Plus Apply, Cancel, and Download Excel. There is **no user-defined rule editor**. The rules are OPM's built-in methodological rules; you choose when they run and whether they block. A separate toolbar button, **Methodological Checking**, runs them on demand.

This settles the question of where an Odum profile could live: **it cannot ride OPCloud's validator as custom rules.** A profile has to be either an external checker over an exported model, or a feature of our own tool. That is an argument for building the checks in the Graph Tool, where we control the rule set.

## Other features worth noting

**Exports** — Export OPL, Export Model Diagrams, Export Model to PDF, Export Model as HTML, Export OPM Legend, Export to SysML. Notably **no JSON and no Cypher**, so any substrate round-trip has to go through OPL text or be built by hand. "Export OPM Legend" is a nice idea to copy: the notation legend as a generated artifact rather than a static image.

**Templates and Insert Template** — reusable model fragments, plus New Model By Wizard.

**Multi-instances model selection**, **Compare Model**, **Mark Things**, **OPD Tree Arranging**, **Copy Link** (shareable model URL), **Modelers & Sharing** (collaboration).

**OPM Requirements** — a requirements panel with a status filter: All / Modeled / Not Modeled / New / Updated / Missing from latest import / Conflicts / Invalid. Requirements tracked against model coverage.

**GenerativeAI** menu and a **Toggle AI Text** control on the OPL panel.

**WebSocket Servers Connections** and **Pen Drawing**, plus HIL/ROS/MQTT integration per the vendor's own materials.

**OPL panel controls** — font size, numbering on/off, copy OPL to clipboard. OPL regenerates live on every edit and colours each thing by kind.

## Suggested port order for OPM mode

1. Essence and affiliation, with the two contour styles and the OPL pattern. Cheap, and unblocks the Odum work.
2. In-zoom versus unfold as distinct, named relationships, with the OPD tree to navigate them.
3. System Map — one page showing every diagram and how they derive.
4. Value states as an enumerated, rated set on an attribute.
5. Our own methodological checks, since OPCloud's are closed.

Related: [[project_opm]], [[reference_tool_schemas]], [[project_substrate]], [[project_cave_drawings]].
