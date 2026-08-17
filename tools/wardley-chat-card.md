# Wardley map for the RCN Graph Tool — context card for Claude Chat

Paste everything below the line into a new Claude Chat conversation, then say what you want mapped. Chat replies with one JSON file. Save it, drag it into the RCN Graph Tool, done.

---

You are building a Wardley map that will be opened in the RCN Graph Tool. Output **RCN Graph native JSON** — one fenced ```json block, nothing else in the reply except a short note about what you assumed.

## The shape

```json
{
  "version": "1.0",
  "mode": "wardley",
  "modelName": "Bicycle Production",
  "modelNote": "What question this map answers, and where the positions came from.",
  "nodes": [
    { "id": "rideable_bicycle", "label": "Rideable Bicycle", "evolution": 0.95, "visibility": 0.95, "color": "#DBEAFE", "note": "Why it sits here." },
    { "id": "drivetrain", "label": "Drivetrain", "evolution": 0.78, "visibility": 0.62, "color": "#FEF3C7", "note": "Why it sits here." }
  ],
  "edges": [
    { "id": "e1", "src": "rideable_bicycle", "tgt": "drivetrain" }
  ]
}
```

That is the whole contract. `id`, `label`, `evolution`, `visibility` on every node; `id`, `src`, `tgt` on every edge; `mode: "wardley"` at the top. `color` and `note` are optional and worth writing. Everything else the tool fills in.

## The two axes, stated so they cannot be got backwards

**`evolution` runs 0 → 1 as Genesis → Commodity.** 0.0–0.2 Genesis (novel, uncertain, nobody agrees what it is). 0.2–0.4 Custom-built (bespoke, built per customer). 0.4–0.65 Product (several vendors, real differentiation). 0.65–1.0 Commodity and utility (interchangeable, bought on price). A shipping container, mains electricity, or a cartridge bearing is 0.9+. A research prototype is 0.05.

**`visibility` runs 0 → 1 as buried → visible.** 1.0 is the user need itself, sitting at the top of the map. 0.0 is the deepest thing in the chain that the user never sees or names. Everything a node depends on must have **lower** visibility than the node itself — that is what makes it a value chain rather than a scatter plot.

Do not write pixel coordinates. Do not invert either axis "to match the tool". The tool derives its own coordinates from these two numbers, and if you flip one, the map renders mirrored and looks entirely deliberate while being completely wrong.

## Edges are dependencies, and they point downward

`src` needs `tgt`. Start from one user need at the top and work down. Every node except the top one should be the `tgt` of something. A node nothing depends on is either the user need or a mistake.

## Rules that keep the file loadable

- `id` is lowercase with underscores, unique, and stable. `edges` reference node ids, never labels.
- Use `src`/`tgt`. Not `from`/`to` — those load without error and then never draw.
- 10–20 nodes. A map a group can argue about beats a map that is complete.
- `note` is where the argument goes: why this position, what evidence, what would move it. It shows on hover and it is the part that survives the meeting.
- Colour by value-chain band if you colour at all: user need `#DBEAFE`, user-facing services `#D1FAE5`, platform `#FEF3C7`, infrastructure `#E5E7EB`.

## If you are asked for Rent Band Analysis

Add these to a pinned node — a component someone is actively spending money to hold left of where competition would carry it. Only diagnose pinning when all three hold: someone profits from the gap, they spend to keep it open, and the spending targets the buyer's blindness rather than the thing's real difficulty.

```json
{
  "id": "hospital_pricing", "label": "Hospital Pricing",
  "evolution": 0.35, "visibility": 0.30,
  "shadow": {
    "evolution": 0.85,
    "basis": "Comparables that were allowed to evolve; cite them.",
    "rent": { "label": "≈ $1,850 / employee / yr", "basis": "What this figure is measured from.", "asOf": "2026-Q2" }
  },
  "pinnedBy": ["R2 Discount Kabuki"],
  "pressure": {
    "forces": ["What is pushing it right — statutes, buyers, commodity-form competitors"],
    "resistance": [{ "loop": "R2 Discount Kabuki", "mechanism": "What is holding it left", "annualCost": "What that costs the resistor each year" }]
  }
}
```

`shadow.evolution` must be **higher** than the node's — it is the forecast position once the pinning stops. `pinnedBy` takes causal-loop **names**, never bare `R2`/`B3` labels. `shadow.basis` and `rent.basis` are required in practice: a shadow with no evidence is decoration.

## Before you answer

State any assumption that a reader might disagree with — where a market boundary was drawn, which comparables set a position — in `modelNote` or in the node's `note`, not in prose outside the JSON. The positions are the argument, so they have to carry their reasons with them.
