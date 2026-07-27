// ── store.js ──────────────────────────────────────────────────────────────────
// Single source of truth for all Vester data.
// App.jsx owns the state; this file provides shapes, persistence, and I/O.

// Deliberately still "sensimod_v1" after the rename to Vester: changing this
// key would orphan every model already saved in a user's localStorage.
export const LS_KEY = "sensimod_v1";

// ── ID generation ─────────────────────────────────────────────────────────────
export const makeId = () =>
  `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;

// ── Default shapes ────────────────────────────────────────────────────────────
export const defaultScale = () => ({
  minLabel: "",
  maxLabel: "",
  intermediates: [], // [{ position: 0-30, label: string }]
  optimum: null,     // int 0-30 | null
  colorEval: false,
});

export const defaultVariable = (id, number) => ({
  id,
  number,
  name: "",
  description: "",
  scale: defaultScale(),
});

export const emptyStore = () => {
  const id = makeId();
  return {
    modelName: "My System Model",
    modelPurpose: "",
    variables: [defaultVariable(id, 1)],
    criteria: {},        // { [variableId]: { [criterionKey]: "applies"|"partial"|"excluded"|null } }
    criteriaDefinitions: {}, // { [criterionKey]: string }
    criteriaLabels: {},       // { [criterionKey]: string }
    systemDescription: "",    // free-text system description (Step 0)
    influenceMatrix: {},      // { [fromId]: { [toId]: 0|1|2|3 } }
    transferCurves: {},       // { [`${fromId}:${toId}`]: [[x, y], ...] }
    notes: {},                // { [toolId]: string }
  };
};

// ── System Criteria ───────────────────────────────────────────────────────────
// 24 criteria in 5 groupings, matching Vester's Sensitivity Model layout.
export const CRITERIA_GROUPS = [
  {
    id: "spheres",
    label: "Spheres of Life",
    criteria: [
      { key: "economy",        label: "Economy" },
      { key: "population",     label: "Population" },
      { key: "space",          label: "Space utilization" },
      { key: "human_ecology",  label: "Human ecology" },
      { key: "nat_balance",    label: "Natural balance" },
      { key: "infrastructure", label: "Infrastructure" },
      { key: "rules",          label: "Rules and laws" },
    ],
  },
  {
    id: "physical",
    label: "Physical Category",
    criteria: [
      { key: "matter",      label: "Matter" },
      { key: "energy",      label: "Energy" },
      { key: "information", label: "Information" },
    ],
  },
  {
    id: "dynamical",
    label: "Dynamical Category",
    criteria: [
      { key: "flow",       label: "Flow quantity" },
      { key: "structural", label: "Structural quantity" },
      { key: "temporal",   label: "Temporal dynamics" },
      { key: "spatial",    label: "Spatial dynamics" },
    ],
  },
  {
    id: "system_rel",
    label: "System Relationship",
    criteria: [
      { key: "opens_input",    label: "Opens system through input" },
      { key: "opens_output",   label: "Opens system through output" },
      { key: "influenced_in",  label: "Can be influenced from inside" },
      { key: "influenced_out", label: "Can be influenced from outside" },
    ],
  },
  {
    id: "cpc",
    label: "Corporate Performance Criteria",
    criteria: [
      { key: "cpc_market",      label: "Market Position" },
      { key: "cpc_innovation",  label: "Innovation Performance" },
      { key: "cpc_productivity",label: "Productivities" },
      { key: "cpc_people",      label: "Attractiveness to Right People" },
      { key: "cpc_liquidity",   label: "Liquidity and Cash Flow" },
      { key: "cpc_profit",      label: "Profitability" },
    ],
  },
];

export const ALL_CRITERIA = CRITERIA_GROUPS.flatMap((g) => g.criteria);

// ── Criteria definitions ─────────────────────────────────────────────────────
// Stored separately from the static CRITERIA_GROUPS so labels/definitions
// can be edited at runtime without touching the source defaults.

export const getCriterionDefinition = (criteriaDefinitions, key) =>
  criteriaDefinitions?.[key] ?? "";

export const setCriterionDefinition = (criteriaDefinitions, key, value) => ({
  ...criteriaDefinitions,
  [key]: value,
});

// ── Assessment values ─────────────────────────────────────────────────────────
export const ASSESSMENT = {
  applies:  { label: "Applies",         symbol: "●", color: "#1d4ed8" },
  partial:  { label: "Partially",       symbol: "○", color: "#f59e0b" },
  excluded: { label: "Does not apply",  symbol: "✕", color: "#dc2626" },
};

// Get the assessment for a variable/criterion pair
export const getAssessment = (criteria, variableId, criterionKey) =>
  criteria?.[variableId]?.[criterionKey] ?? null;

// Set the assessment for a variable/criterion pair (returns new criteria object)
export const setAssessment = (criteria, variableId, criterionKey, value) => ({
  ...criteria,
  [variableId]: {
    ...criteria?.[variableId],
    [criterionKey]: value,
  },
});

// ── Persistence ───────────────────────────────────────────────────────────────
export function loadFromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

export function saveToStorage(state) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {}
}

export function exportJSON(state) {
  const data = { ...state, savedAt: new Date().toISOString() };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(state.modelName || "vester").replace(/\s+/g, "_")}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importJSON(file, onLoad, onError) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (!data.variables || !Array.isArray(data.variables)) throw new Error("Invalid");
      onLoad(data);
    } catch { onError(); }
  };
  reader.readAsText(file);
}

// ── Neo4j Cypher export ───────────────────────────────────────────────────────
export function buildCypher(state) {
  const { modelName, modelPurpose, variables, criteria } = state;
  const lines = [`// Vester Influence Analysis export — ${new Date().toISOString()}`];

  lines.push(`MERGE (m:SystemModel {name: ${JSON.stringify(modelName)}})
SET m.purpose = ${JSON.stringify(modelPurpose)}, m.updated = datetime();\n`);

  variables.forEach((v, idx) => {
    const nid = `var${idx + 1}`;
    lines.push(`MERGE (${nid}:Variable {id: ${JSON.stringify(v.id)}})
SET ${nid}.number = ${idx + 1},
    ${nid}.name = ${JSON.stringify(v.name)},
    ${nid}.description = ${JSON.stringify(v.description)},
    ${nid}.scaleMinLabel = ${JSON.stringify(v.scale.minLabel)},
    ${nid}.scaleMaxLabel = ${JSON.stringify(v.scale.maxLabel)},
    ${nid}.scaleIntermediates = ${JSON.stringify(JSON.stringify(v.scale.intermediates))},
    ${nid}.scaleOptimum = ${v.scale.optimum ?? "null"},
    ${nid}.scaleColorEval = ${v.scale.colorEval};`);
    lines.push(`MERGE (m)-[:HAS_VARIABLE {position: ${idx + 1}}]->(${nid});\n`);

    // Criteria assignments
    const varCriteria = criteria?.[v.id] ?? {};
    ALL_CRITERIA.forEach(({ key }) => {
      const val = varCriteria[key] ?? "null";
      if (val !== "null") {
        lines.push(`MERGE (${nid})-[:HAS_CRITERION {key: "${key}", assessment: "${val}"}]->(:Criterion {key: "${key}"});`);
      }
    });
    lines.push("");
  });

  return lines.join("\n");
}

// Label overrides — falls back to the static default from CRITERIA_GROUPS
export const getCriterionLabel = (criteriaLabels, key) => {
  if (criteriaLabels?.[key] !== undefined && criteriaLabels[key] !== "") return criteriaLabels[key];
  const c = CRITERIA_GROUPS.flatMap(g => g.criteria).find(c => c.key === key);
  return c?.label ?? key;
};

export const setCriterionLabel = (criteriaLabels, key, value) => ({
  ...criteriaLabels,
  [key]: value,
});

// ── Transfer Curves ───────────────────────────────────────────────────────────
// Key: `${fromId}:${toId}`, value: sorted [[x, y], ...] control points
// x = source state (0–30), y = effect on target per sim step
export const curveKey   = (fromId, toId) => `${fromId}:${toId}`;
export const getCurve   = (curves, fromId, toId) => curves?.[curveKey(fromId, toId)] ?? [];
export const setCurve   = (curves, fromId, toId, points) => ({ ...curves, [curveKey(fromId, toId)]: points });

// Linear interpolation along the curve; returns 0 for empty curve
export const evalCurve  = (points, x) => {
  if (!points || points.length === 0) return 0;
  const s = [...points].sort((a, b) => a[0] - b[0]);
  if (x <= s[0][0]) return s[0][1];
  if (x >= s[s.length - 1][0]) return s[s.length - 1][1];
  for (let i = 1; i < s.length; i++) {
    if (x <= s[i][0]) {
      const t = (x - s[i-1][0]) / (s[i][0] - s[i-1][0]);
      return s[i-1][1] + t * (s[i][1] - s[i-1][1]);
    }
  }
  return 0;
};

// ── Notes ─────────────────────────────────────────────────────────────────────
// { [toolId]: string } — one scratchpad per tool
export const getNote = (notes, toolId) => notes?.[toolId] ?? "";
export const setNote = (notes, toolId, value) => ({ ...notes, [toolId]: value });

// ── Influence Matrix ──────────────────────────────────────────────────────────
// Returns null when not yet evaluated, 0-3 when scored
export const getScore = (matrix, fromId, toId) => {
  const v = matrix?.[fromId]?.[toId];
  return v === undefined ? null : v;
};

export const setScore = (matrix, fromId, toId, value) => ({
  ...matrix,
  [fromId]: { ...matrix?.[fromId], [toId]: value },
});

export const computeRoles = (variables, matrix) => {
  const n = variables.length;
  if (n === 0) return {};
  const stats = {};
  variables.forEach(v => {
    const AS = variables.reduce((s, v2) => v2.id === v.id ? s : s + (getScore(matrix, v.id, v2.id) ?? 0), 0);
    const PS = variables.reduce((s, v2) => v2.id === v.id ? s : s + (getScore(matrix, v2.id, v.id) ?? 0), 0);
    stats[v.id] = { AS, PS, Q: AS * PS };
  });
  const vals = Object.values(stats);
  const meanAS = vals.reduce((s, r) => s + r.AS, 0) / n;
  const meanPS = vals.reduce((s, r) => s + r.PS, 0) / n;
  Object.keys(stats).forEach(id => {
    const { AS, PS } = stats[id];
    stats[id].role =
      AS >= meanAS && PS >= meanPS ? "critical"  :
      AS >= meanAS                 ? "active"     :
                     PS >= meanPS  ? "passive"    :
                                     "buffering";
  });
  return stats; // { [id]: { AS, PS, Q, role } }
};

// ── SFD JSON export ───────────────────────────────────────────────────────────
const ROLE_COLORS = {
  critical:  { fill: "#fca5a5", border: "#dc2626" },
  active:    { fill: "#fed7aa", border: "#ea580c" },
  passive:   { fill: "#bfdbfe", border: "#2563eb" },
  buffering: { fill: "#e5e7eb", border: "#6b7280" },
};

export function buildSFDJSON({ modelName, variables, influenceMatrix }) {
  const roles = computeRoles(variables, influenceMatrix);
  const n = variables.length;
  const cx = 600, cy = 400;
  const r = Math.max(180, Math.min(320, n * 34));

  const nodes = variables.map((v, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    const role = roles[v.id]?.role ?? "buffering";
    const { fill, border } = ROLE_COLORS[role];
    return {
      id: "n" + (i + 1),
      label: v.name || `V${v.number}`,
      extraLabels: [],
      x: Math.round(cx + r * Math.cos(angle)),
      y: Math.round(cy + r * Math.sin(angle)),
      w: 108, h: 46,
      shape: "ellipse",
      color: fill,
      fontColor: "#0f172a",
      borderColor: border,
      borderWidth: 1.5,
      borderDash: "solid",
      note: v.description || "",
      props: {
        role,
        AS: String(roles[v.id]?.AS ?? 0),
        PS: String(roles[v.id]?.PS ?? 0),
      },
      fontSize: 12,
      sfdType: "aux",
      vesterId: v.id,
    };
  });

  const idMap = {};
  variables.forEach((v, i) => { idMap[v.id] = "n" + (i + 1); });

  const edges = [];
  let eid = nodes.length + 1;
  variables.forEach(from => {
    variables.forEach(to => {
      if (from.id === to.id) return;
      const score = getScore(influenceMatrix, from.id, to.id);
      if (score < 1) return;
      edges.push({
        id: "e" + eid++,
        src: idMap[from.id],
        tgt: idMap[to.id],
        label: score >= 2 ? String(score) : "",
        color: "#475569",
        width: score === 3 ? 2.5 : score === 2 ? 1.8 : 1.2,
        fontSize: 10,
        curved: true,
        polarity: "none",
        delay: false,
        dash: "solid",
        note: "",
        traces: [],
        layer: "",
        props: { score: String(score) },
      });
    });
  });

  return JSON.stringify({ version: "1.0", modelName: modelName || "Vester Export", nodes, edges }, null, 2);
}
