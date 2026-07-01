// ── PartialScenario.jsx ───────────────────────────────────────────────────────
// Step 5 — Partial Scenario
// Select a subset of variables, define transfer curves for each scored
// relationship, then run the simulation and view trajectories.

import { useState, useRef, useCallback, useEffect } from "react";
import { computeRoles, getScore, getCurve, setCurve, evalCurve, getNote, setNote } from "../store.js";

// ── Constants ─────────────────────────────────────────────────────────────────
const SCALE_MAX = 30;   // variable state range 0–30
const EFFECT_MAX = 5;   // curve Y-axis: -EFFECT_MAX to +EFFECT_MAX
const SIM_ROUNDS = 20;  // max simulation rounds

const ROLE_COLOR = {
  critical:  "#dc2626",
  active:    "#ea580c",
  passive:   "#2563eb",
  buffering: "#6b7280",
};

const ROLE_BG = {
  critical:  "#fca5a5",
  active:    "#fed7aa",
  passive:   "#bfdbfe",
  buffering: "#e5e7eb",
};

// ── Curve Editor ──────────────────────────────────────────────────────────────
// Vester orientation:
//   Y axis (vertical, left side)  = source variable state, 0 at bottom → 30 at top
//   X axis (horizontal, bottom)   = effect per step, −EFFECT_MAX left → 0 center → +EFFECT_MAX right
// Points stored as [sourceState, effect]; sorted by sourceState for drawing.
// Click to add · drag to move · double-click to remove.
function CurveEditor({ fromVar, toVar, scaleLabels, points, onChange, description, onDescChange }) {
  // Canvas dimensions — taller than wide to give the state axis room
  const W = 360, H = 420;
  // Generous left padding for scale labels; bottom for effect ticks; top/right minimal
  const PAD_L = 140, PAD_R = 24, PAD_T = 24, PAD_B = 40;
  const pw = W - PAD_L - PAD_R;  // plot width  (effect axis)
  const ph = H - PAD_T - PAD_B;  // plot height (state axis)

  const svgRef = useRef(null);
  const [dragging, setDragging] = useState(null);

  // ── coordinate conversions ─────────────────────────────────────────────────
  // svgX  ← effect value  (−5 = left edge, 0 = centre, +5 = right edge)
  const toSvgX   = eff   => PAD_L + ((eff + EFFECT_MAX) / (2 * EFFECT_MAX)) * pw;
  // svgY  ← source state  (0 = bottom, 30 = top)
  const toSvgY   = state => PAD_T + ph - (state / SCALE_MAX) * ph;
  const fromSvgX = sx    => Math.max(-EFFECT_MAX, Math.min(EFFECT_MAX,
                              ((sx - PAD_L) / pw) * 2 * EFFECT_MAX - EFFECT_MAX));
  const fromSvgY = sy    => Math.max(0, Math.min(SCALE_MAX,
                              SCALE_MAX * (1 - (sy - PAD_T) / ph)));

  // Sort points by sourceState (ascending) so polyline runs bottom → top
  const sorted = [...points].sort((a, b) => a[0] - b[0]);

  const getSvgPos = e => {
    const rect = svgRef.current.getBoundingClientRect();
    return [e.clientX - rect.left, e.clientY - rect.top];
  };

  const handleMouseDown = (e, idx) => { e.stopPropagation(); setDragging(idx); };
  const handleSvgMouseUp = () => setDragging(null);

  const handleSvgMouseMove = useCallback(e => {
    if (dragging === null) return;
    const [sx, sy] = getSvgPos(e);
    const newState  = Math.round(fromSvgY(sy));
    const newEffect = Math.round(fromSvgX(sx) * 10) / 10;
    onChange(points.map((p, i) => i === dragging ? [newState, newEffect] : p));
  }, [dragging, points, onChange]);

  const handleSvgClick = e => {
    if (e.target.closest("circle")) return;
    const [sx, sy] = getSvgPos(e);
    if (sx < PAD_L || sx > W - PAD_R || sy < PAD_T || sy > H - PAD_B) return;
    const newState  = Math.round(fromSvgY(sy));
    const newEffect = Math.round(fromSvgX(sx) * 10) / 10;
    // Don't add if too close in state to an existing point
    if (points.some(p => Math.abs(p[0] - newState) < 1)) return;
    onChange([...points, [newState, newEffect]]);
  };

  const handleDblClick = (e, idx) => { e.stopPropagation(); onChange(points.filter((_, i) => i !== idx)); };

  // ── grid values ────────────────────────────────────────────────────────────
  const effectTicks = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
  const stateTicks  = [0, 5, 10, 15, 20, 25, 30];
  const zeroX = toSvgX(0);   // vertical zero-effect line

  // Scale labels from Step 1 — keyed by state position
  const labelEntries = Object.entries(scaleLabels || {})
    .map(([pos, label]) => [Number(pos), label])
    .filter(([pos]) => pos >= 0 && pos <= SCALE_MAX && label)
    .sort((a, b) => a[0] - b[0]);

  return (
    <div>
      {/* Relationship header */}
      <div style={{ marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#1e3a5f" }}>
          {fromVar.name || `#${fromVar.number}`}
        </span>
        <span style={{ fontSize: 13, color: "#64748b", margin: "0 8px" }}>→</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#1e3a5f" }}>
          {toVar.name || `#${toVar.number}`}
        </span>
      </div>

      <svg ref={svgRef} width={W} height={H}
        style={{ display: "block", border: "1px solid #d1d5db", borderRadius: 6, background: "white",
                 cursor: dragging !== null ? "grabbing" : "crosshair" }}
        onMouseMove={handleSvgMouseMove}
        onMouseUp={handleSvgMouseUp}
        onMouseLeave={handleSvgMouseUp}
        onClick={handleSvgClick}>

        {/* ── Plot area background ── */}
        <rect x={PAD_L} y={PAD_T} width={pw} height={ph} fill="#fafafa" />

        {/* ── Positive / negative half shading ── */}
        <rect x={zeroX} y={PAD_T} width={W - PAD_R - zeroX} height={ph} fill="#dcfce7" opacity="0.35" />
        <rect x={PAD_L} y={PAD_T} width={zeroX - PAD_L}     height={ph} fill="#fee2e2" opacity="0.25" />

        {/* ── Effect-axis grid (vertical lines) ── */}
        {effectTicks.map(v => (
          <g key={`et-${v}`}>
            <line x1={toSvgX(v)} y1={PAD_T} x2={toSvgX(v)} y2={H - PAD_B}
              stroke={v === 0 ? "#94a3b8" : "#e5e7eb"}
              strokeWidth={v === 0 ? 1.5 : 1}
              strokeDasharray={v === 0 ? "none" : "3,3"} />
            <text x={toSvgX(v)} y={H - PAD_B + 14} textAnchor="middle"
              fontSize="9" fill={v === 0 ? "#64748b" : "#9ca3af"} fontFamily="Arial,sans-serif">{v}</text>
          </g>
        ))}

        {/* ── State-axis grid (horizontal lines) ── */}
        {stateTicks.map(v => (
          <line key={`st-${v}`}
            x1={PAD_L} y1={toSvgY(v)} x2={W - PAD_R} y2={toSvgY(v)}
            stroke="#e5e7eb" strokeWidth="1" />
        ))}

        {/* ── Scale labels from Step 1 (left of plot, at their state height) ── */}
        {labelEntries.map(([pos, label]) => (
          <g key={`sl-${pos}`}>
            {/* Tick mark on Y axis */}
            <line x1={PAD_L - 4} y1={toSvgY(pos)} x2={PAD_L} y2={toSvgY(pos)}
              stroke="#94a3b8" strokeWidth="1.5" />
            {/* Horizontal guide line across plot */}
            <line x1={PAD_L} y1={toSvgY(pos)} x2={W - PAD_R} y2={toSvgY(pos)}
              stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="4,4" />
            <text x={PAD_L - 8} y={toSvgY(pos) + 4} textAnchor="end"
              fontSize="9" fill="#64748b" fontFamily="Arial,sans-serif">
              {label.length > 18 ? label.slice(0, 17) + "…" : label}
            </text>
          </g>
        ))}

        {/* ── State-axis numeric ticks ── */}
        {stateTicks.map(v => (
          <text key={`stn-${v}`} x={PAD_L - (labelEntries.length ? 6 : 6)} y={toSvgY(v) + 4}
            textAnchor="end" fontSize="9"
            fill={labelEntries.length ? "#c4c4c4" : "#9ca3af"}
            fontFamily="Arial,sans-serif">{v}</text>
        ))}

        {/* ── Zero-effect vertical axis line ── */}
        <line x1={zeroX} y1={PAD_T} x2={zeroX} y2={H - PAD_B}
          stroke="#64748b" strokeWidth="1.5" />

        {/* ── Curve — extend to top/bottom beyond outermost points ── */}
        {sorted.length >= 1 && (
          <>
            {/* Extension below lowest-state point (constant effect) */}
            <line
              x1={toSvgX(sorted[0][1])} y1={toSvgY(sorted[0][0])}
              x2={toSvgX(sorted[0][1])} y2={H - PAD_B}
              stroke="#1d4ed8" strokeWidth="2" strokeDasharray="4,3" opacity="0.45" />
            {/* Extension above highest-state point */}
            <line
              x1={toSvgX(sorted[sorted.length - 1][1])} y1={toSvgY(sorted[sorted.length - 1][0])}
              x2={toSvgX(sorted[sorted.length - 1][1])} y2={PAD_T}
              stroke="#1d4ed8" strokeWidth="2" strokeDasharray="4,3" opacity="0.45" />
          </>
        )}
        {sorted.length >= 2 && (
          <polyline
            points={sorted.map(([state, eff]) => `${toSvgX(eff)},${toSvgY(state)}`).join(" ")}
            fill="none" stroke="#1d4ed8" strokeWidth="2.5" strokeLinejoin="round" />
        )}

        {/* ── Axes ── */}
        {/* Y axis (state) */}
        <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={H - PAD_B} stroke="#374151" strokeWidth="1.5" />
        {/* X axis (effect) at bottom */}
        <line x1={PAD_L} y1={H - PAD_B} x2={W - PAD_R} y2={H - PAD_B} stroke="#374151" strokeWidth="1.5" />

        {/* ── Axis labels ── */}
        {/* Y axis label — rotated, sitting to the left */}
        <text x={11} y={PAD_T + ph / 2} textAnchor="middle"
          fontSize="10" fill="#374151" fontFamily="Arial,sans-serif"
          transform={`rotate(-90,11,${PAD_T + ph / 2})`}>
          State of {(fromVar.name || `#${fromVar.number}`).slice(0, 20)} (0–30)  ↑
        </text>
        {/* X axis label */}
        <text x={PAD_L + pw / 2} y={H - 5} textAnchor="middle"
          fontSize="10" fill="#374151" fontFamily="Arial,sans-serif">
          ← dampens · effect per step · amplifies →
        </text>
        {/* −/+ hints at ends */}
        <text x={PAD_L + 4} y={H - PAD_B + 14} fontSize="9" fill="#ef4444" fontFamily="Arial,sans-serif">−</text>
        <text x={W - PAD_R - 4} y={H - PAD_B + 14} fontSize="9" fill="#16a34a" textAnchor="end" fontFamily="Arial,sans-serif">+</text>

        {/* ── Control points ── */}
        {points.map((pt, i) => (
          <circle key={i}
            cx={toSvgX(pt[1])} cy={toSvgY(pt[0])} r={7}
            fill={dragging === i ? "#1d4ed8" : "white"}
            stroke="#1d4ed8" strokeWidth={dragging === i ? 2.5 : 2}
            style={{ cursor: "grab" }}
            onMouseDown={e => handleMouseDown(e, i)}
            onDoubleClick={e => handleDblClick(e, i)} />
        ))}
      </svg>

      <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>
        Click to add point · Drag to move · Double-click to remove
      </div>

      {/* Description */}
      <div style={{ marginTop: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>
          Curve description
        </div>
        <textarea
          value={description}
          onChange={e => onDescChange(e.target.value)}
          placeholder="Explain the logic of this transfer curve — narrative first, then what each segment means…"
          rows={4}
          style={{ width: "100%", boxSizing: "border-box", padding: "6px 10px", border: "1px solid #d1d5db", borderRadius: 5, fontSize: 13, lineHeight: 1.6, resize: "vertical" }}
        />
      </div>
    </div>
  );
}

// ── Simulation network layout ─────────────────────────────────────────────────
function ScenarioNetwork({ selVars, matrix, transferCurves, states, onSelectEdge, selectedEdge }) {
  const W = 500, H = 400, CX = 250, CY = 200;
  const n = selVars.length;
  const r = Math.max(120, Math.min(170, n * 28));

  const pos = selVars.map((v, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    return { id: v.id, x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle), v };
  });
  const posMap = {};
  pos.forEach(p => { posMap[p.id] = p; });

  const edges = [];
  selVars.forEach(from => {
    selVars.forEach(to => {
      if (from.id === to.id) return;
      const score = getScore(matrix, from.id, to.id);
      if (!score || score < 1) return;
      edges.push({ from, to, score });
    });
  });

  const edgeKey = (f, t) => `${f.id}:${t.id}`;

  return (
    <svg width={W} height={H} style={{ display: "block", border: "1px solid #e5e7eb", borderRadius: 8, background: "#fafafa" }}>
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#64748b" />
        </marker>
        <marker id="arrow-sel" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#1d4ed8" />
        </marker>
      </defs>

      {/* Edges */}
      {edges.map(({ from, to, score }) => {
        const fp = posMap[from.id];
        const tp = posMap[to.id];
        if (!fp || !tp) return null;
        const key = edgeKey(from, to);
        const isSel = selectedEdge === key;
        const hasCurve = getCurve(transferCurves, from.id, to.id).length > 0;
        const dx = tp.x - fp.x, dy = tp.y - fp.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const ux = dx / dist, uy = dy / dist;
        const NR = 18;
        const x1 = fp.x + ux * NR, y1 = fp.y + uy * NR;
        const x2 = tp.x - ux * (NR + 8), y2 = tp.y - uy * (NR + 8);
        // Slight curve
        const mx = (x1 + x2) / 2 - uy * 20, my = (y1 + y2) / 2 + ux * 20;
        return (
          <g key={key} onClick={() => onSelectEdge(isSel ? null : key)}
            style={{ cursor: "pointer" }}>
            <path d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`}
              fill="none"
              stroke={isSel ? "#1d4ed8" : "#94a3b8"}
              strokeWidth={isSel ? 2.5 : Math.max(1, score * 0.8)}
              strokeDasharray={hasCurve ? "none" : "4,3"}
              markerEnd={isSel ? "url(#arrow-sel)" : "url(#arrow)"}
              opacity="0.8" />
            {score >= 2 && (
              <text x={(x1 + mx * 2 + x2) / 4} y={(y1 + my * 2 + y2) / 4}
                textAnchor="middle" fontSize="9" fill={isSel ? "#1d4ed8" : "#94a3b8"} fontFamily="Arial,sans-serif">
                {score}
              </text>
            )}
          </g>
        );
      })}

      {/* Nodes */}
      {pos.map(({ x, y, v }) => {
        const state = states?.[v.id] ?? 15;
        const pct = state / SCALE_MAX;
        const barH = 24, barW = 6;
        return (
          <g key={v.id}>
            {/* State bar */}
            <rect x={x + 20} y={y - barH / 2} width={barW} height={barH} fill="#e5e7eb" rx="2" />
            <rect x={x + 20} y={y + barH / 2 - barH * pct} width={barW} height={barH * pct}
              fill={pct > 0.7 ? "#dc2626" : pct > 0.4 ? "#f59e0b" : "#22c55e"} rx="2" />
            {/* Node circle */}
            <circle cx={x} cy={y} r={18} fill="white" stroke="#94a3b8" strokeWidth="1.5" />
            <text x={x} y={y - 2} textAnchor="middle" fontSize="10" fontWeight="700" fill="#1e3a5f" fontFamily="Arial,sans-serif">
              {v.number}
            </text>
            <text x={x} y={y + 10} textAnchor="middle" fontSize="7" fill="#64748b" fontFamily="Arial,sans-serif">
              {state}
            </text>
            {/* Name below */}
            <text x={x} y={y + 30} textAnchor="middle" fontSize="9" fill="#374151" fontFamily="Arial,sans-serif">
              {(v.name || `#${v.number}`).slice(0, 14)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Trajectory chart ──────────────────────────────────────────────────────────
function TrajectoryChart({ history, selVars }) {
  if (!history || history.length < 2) return null;
  const W = 560, H = 280, PAD_L = 40, PAD_R = 20, PAD_T = 20, PAD_B = 36;
  const pw = W - PAD_L - PAD_R;
  const ph = H - PAD_T - PAD_B;
  const rounds = history.length - 1;

  const COLORS = ["#1d4ed8", "#dc2626", "#16a34a", "#ea580c", "#7c3aed", "#0891b2", "#b45309", "#be185d"];

  const px = round => PAD_L + (round / rounds) * pw;
  const py = state => PAD_T + ph - (state / SCALE_MAX) * ph;

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Trajectory</div>
      <svg width={W} height={H} style={{ display: "block", border: "1px solid #e5e7eb", borderRadius: 6, background: "white" }}>
        {/* Grid */}
        {[0, 10, 20, 30].map(v => (
          <g key={v}>
            <line x1={PAD_L} y1={py(v)} x2={W - PAD_R} y2={py(v)} stroke="#f1f5f9" strokeWidth="1" />
            <text x={PAD_L - 4} y={py(v) + 4} textAnchor="end" fontSize="9" fill="#9ca3af" fontFamily="Arial,sans-serif">{v}</text>
          </g>
        ))}
        {Array.from({ length: rounds + 1 }, (_, i) => i).map(i => (
          <text key={i} x={px(i)} y={H - PAD_B + 14} textAnchor="middle" fontSize="9" fill="#9ca3af" fontFamily="Arial,sans-serif">{i}</text>
        ))}
        {/* Axes */}
        <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={H - PAD_B} stroke="#374151" strokeWidth="1.5" />
        <line x1={PAD_L} y1={H - PAD_B} x2={W - PAD_R} y2={H - PAD_B} stroke="#374151" strokeWidth="1.5" />
        <text x={W / 2} y={H - 4} textAnchor="middle" fontSize="10" fill="#374151" fontFamily="Arial,sans-serif">Round</text>
        <text x={12} y={PAD_T + ph / 2} textAnchor="middle" fontSize="10" fill="#374151" fontFamily="Arial,sans-serif" transform={`rotate(-90,12,${PAD_T + ph / 2})`}>State (0–30)</text>
        {/* Lines */}
        {selVars.map((v, vi) => {
          const color = COLORS[vi % COLORS.length];
          const pts = history.map((snap, i) => `${px(i)},${py(snap[v.id] ?? 0)}`).join(" ");
          return <polyline key={v.id} points={pts} fill="none" stroke={color} strokeWidth="2" />;
        })}
      </svg>
      {/* Legend */}
      <div style={{ display: "flex", gap: 14, marginTop: 8, flexWrap: "wrap" }}>
        {selVars.map((v, vi) => (
          <span key={v.id} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#374151" }}>
            <span style={{ display: "inline-block", width: 20, height: 3, background: COLORS[vi % COLORS.length], borderRadius: 2 }} />
            {v.name || `#${v.number}`}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function PartialScenario({ variables, matrix, transferCurves, setTransferCurves, notes, setNotes }) {
  const [scenarioName,  setScenarioName]  = useState("Scenario 1");
  const [selectedIds,   setSelectedIds]   = useState(new Set());
  const [view,          setView]          = useState("select");  // "select" | "curves" | "sim"
  const [selectedEdge,  setSelectedEdge]  = useState(null);     // "fromId:toId"
  const [states,        setStates]        = useState({});       // { [id]: 0-30 }
  const [history,       setHistory]       = useState(null);     // [{ [id]: state }, ...]
  const [round,         setRound]         = useState(0);
  const [curveDescs,    setCurveDescs]    = useState({});       // { "fromId:toId": string }

  const roles = computeRoles(variables, matrix ?? {});

  // Selected variables in original order
  const selVars = variables.filter(v => selectedIds.has(v.id));

  // Edges within selected set with score >= 1
  const selEdges = [];
  selVars.forEach(from => {
    selVars.forEach(to => {
      if (from.id === to.id) return;
      const score = getScore(matrix, from.id, to.id);
      if (score && score >= 1) selEdges.push({ from, to, score });
    });
  });

  // Active curve edge
  const edgeParts = selectedEdge ? selectedEdge.split(":") : null;
  const edgeFrom = edgeParts ? variables.find(v => v.id === edgeParts[0]) : null;
  const edgeTo   = edgeParts ? variables.find(v => v.id === edgeParts[1]) : null;
  const activeCurve = edgeParts ? getCurve(transferCurves, edgeParts[0], edgeParts[1]) : [];

  // Initialize states from variable scale optimum / default to 15
  const initStates = useCallback(() => {
    const s = {};
    selVars.forEach(v => { s[v.id] = v.scale?.optimum ?? 15; });
    return s;
  }, [selVars.map(v => v.id).join(",")]);

  const handleStartSim = () => {
    const init = initStates();
    setStates(init);
    setHistory([{ ...init }]);
    setRound(0);
    setView("sim");
  };

  const handleStepSim = () => {
    if (round >= SIM_ROUNDS) return;
    setStates(prev => {
      const next = { ...prev };
      const deltas = {};
      selVars.forEach(v => { deltas[v.id] = 0; });

      // For each scored relationship in selected set, compute effect
      selEdges.forEach(({ from, to }) => {
        const curve = getCurve(transferCurves, from.id, to.id);
        const effect = evalCurve(curve, prev[from.id] ?? 15);
        deltas[to.id] = (deltas[to.id] ?? 0) + effect;
      });

      selVars.forEach(v => {
        next[v.id] = Math.max(0, Math.min(SCALE_MAX, (prev[v.id] ?? 15) + deltas[v.id]));
      });

      setHistory(h => [...(h ?? []), { ...next }]);
      setRound(r => r + 1);
      return next;
    });
  };

  const handleResetSim = () => {
    const init = initStates();
    setStates(init);
    setHistory([{ ...init }]);
    setRound(0);
  };

  // Count curves defined
  const curvesDefined = selEdges.filter(({ from, to }) => getCurve(transferCurves, from.id, to.id).length > 0).length;

  if (!variables || variables.length < 2) {
    return (
      <div style={{ padding: 40, color: "#6b7280", fontSize: 14, textAlign: "center" }}>
        Add at least 2 variables in Step 1 to build a scenario.
      </div>
    );
  }

  // ── VARIABLE SELECTION VIEW ───────────────────────────────────────────────
  if (view === "select") {
    const toggleAll = () => {
      if (selectedIds.size === variables.length) setSelectedIds(new Set());
      else setSelectedIds(new Set(variables.map(v => v.id)));
    };

    return (
      <div style={{ padding: 24, fontFamily: "Arial, sans-serif" }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1e3a5f", marginBottom: 4 }}>
          Step 5 — Partial Scenario
        </h2>
        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20, lineHeight: 1.6 }}>
          Select the variables to include in this scenario — typically 8–15. Include at least one <strong>Active</strong> variable as a policy lever.
          Then define transfer curves for each relationship and run the simulation.
        </p>

        <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
          <input value={scenarioName} onChange={e => setScenarioName(e.target.value)}
            style={{ padding: "6px 10px", border: "1px solid #d1d5db", borderRadius: 5, fontSize: 14, fontWeight: 600, color: "#1e3a5f", minWidth: 200 }}
            placeholder="Scenario name" />
          <span style={{ fontSize: 13, color: "#6b7280" }}>{selectedIds.size} of {variables.length} selected</span>
          <button onClick={toggleAll} style={{ padding: "5px 12px", background: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: 5, fontSize: 12, cursor: "pointer" }}>
            {selectedIds.size === variables.length ? "Deselect all" : "Select all"}
          </button>
        </div>

        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 24 }}>
          {/* Variable checklist */}
          <div style={{ minWidth: 320 }}>
            {variables.map(v => {
              const role = roles[v.id]?.role ?? "buffering";
              const roleColor = ROLE_COLOR[role];
              const roleBg   = ROLE_BG[role];
              const checked  = selectedIds.has(v.id);
              return (
                <label key={v.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 10px", borderBottom: "1px solid #f3f4f6", cursor: "pointer", background: checked ? "#eff6ff" : "white" }}>
                  <input type="checkbox" checked={checked}
                    onChange={() => setSelectedIds(prev => {
                      const next = new Set(prev);
                      checked ? next.delete(v.id) : next.add(v.id);
                      return next;
                    })}
                    style={{ accentColor: "#1d4ed8" }} />
                  <span style={{ fontWeight: 700, color: "#1e3a5f", minWidth: 22, fontSize: 12 }}>#{v.number}</span>
                  <span style={{ fontSize: 13, color: "#1f2937", flex: 1 }}>{v.name || "(unnamed)"}</span>
                  <span style={{ background: roleBg, color: roleColor, border: `1px solid ${roleColor}`, borderRadius: 3, padding: "1px 7px", fontSize: 10, fontWeight: 600, flexShrink: 0 }}>
                    {role}
                  </span>
                  <span style={{ fontSize: 11, color: "#9ca3af", flexShrink: 0, minWidth: 40 }}>
                    AS {roles[v.id]?.AS ?? 0}
                  </span>
                </label>
              );
            })}
          </div>

          {/* Summary of selection */}
          {selectedIds.size > 0 && (
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
                Edges in selected set: {selEdges.length}
              </div>
              {selEdges.length === 0 && (
                <div style={{ fontSize: 12, color: "#ef4444" }}>
                  No scored relationships between selected variables. Go to Step 3 to score them.
                </div>
              )}
              {selEdges.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {selEdges.slice(0, 12).map(({ from, to, score }) => (
                    <div key={`${from.id}:${to.id}`} style={{ fontSize: 11, color: "#374151", display: "flex", gap: 6, alignItems: "center" }}>
                      <span style={{ color: "#1e3a5f", fontWeight: 600 }}>{from.name || `#${from.number}`}</span>
                      <span style={{ color: "#94a3b8" }}>→</span>
                      <span style={{ color: "#1e3a5f", fontWeight: 600 }}>{to.name || `#${to.number}`}</span>
                      <span style={{ background: "#f1f5f9", borderRadius: 3, padding: "1px 5px", fontSize: 10, color: "#64748b" }}>{score}</span>
                    </div>
                  ))}
                  {selEdges.length > 12 && <div style={{ fontSize: 11, color: "#9ca3af" }}>…and {selEdges.length - 12} more</div>}
                </div>
              )}
            </div>
          )}
        </div>

        <button
          disabled={selVars.length < 2 || selEdges.length === 0}
          onClick={() => setView("curves")}
          style={{ padding: "9px 22px", background: selVars.length < 2 || selEdges.length === 0 ? "#e5e7eb" : "#1e3a5f", color: selVars.length < 2 || selEdges.length === 0 ? "#9ca3af" : "white", border: "none", borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: selVars.length < 2 || selEdges.length === 0 ? "default" : "pointer" }}>
          Define transfer curves →
        </button>
      </div>
    );
  }

  // ── CURVES VIEW ───────────────────────────────────────────────────────────
  if (view === "curves") {
    return (
      <div style={{ padding: 24, fontFamily: "Arial, sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button onClick={() => setView("select")} style={{ padding: "5px 12px", background: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: 5, fontSize: 12, cursor: "pointer" }}>← Variables</button>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1e3a5f", margin: 0 }}>
            Transfer Curves — {scenarioName}
          </h2>
          <span style={{ fontSize: 12, color: "#6b7280", marginLeft: "auto" }}>
            {curvesDefined} / {selEdges.length} curves defined
          </span>
          <button onClick={handleStartSim}
            style={{ padding: "7px 20px", background: "#166534", color: "white", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            Run simulation →
          </button>
        </div>

        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "flex-start" }}>
          {/* Edge list */}
          <div style={{ minWidth: 240, maxWidth: 280 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
              Relationships — click to edit curve
            </div>
            {selEdges.map(({ from, to, score }) => {
              const key = `${from.id}:${to.id}`;
              const hasCurve = getCurve(transferCurves, from.id, to.id).length > 0;
              const isSel = selectedEdge === key;
              return (
                <button key={key} onClick={() => setSelectedEdge(isSel ? null : key)}
                  style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 10px", marginBottom: 4, background: isSel ? "#eff6ff" : "white", border: `1px solid ${isSel ? "#1d4ed8" : "#e5e7eb"}`, borderRadius: 5, cursor: "pointer", textAlign: "left" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: hasCurve ? "#22c55e" : "#e5e7eb", flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: "#1e3a5f", fontWeight: 600, flex: 1 }}>
                    {from.name || `#${from.number}`} → {to.name || `#${to.number}`}
                  </span>
                  <span style={{ fontSize: 10, color: "#94a3b8" }}>{score}</span>
                </button>
              );
            })}
          </div>

          {/* Curve editor */}
          {edgeFrom && edgeTo && (
            <CurveEditor
              fromVar={edgeFrom}
              toVar={edgeTo}
              scaleLabels={Object.fromEntries(
                (edgeFrom.scale?.intermediates ?? []).map(({ position, label }) => [position, label])
                  .concat([[0, edgeFrom.scale?.minLabel || ""], [SCALE_MAX, edgeFrom.scale?.maxLabel || ""]])
                  .filter(([, l]) => l)
              )}
              points={activeCurve}
              onChange={pts => setTransferCurves(prev => setCurve(prev, edgeFrom.id, edgeTo.id, pts))}
              description={curveDescs[selectedEdge] ?? ""}
              onDescChange={val => setCurveDescs(prev => ({ ...prev, [selectedEdge]: val }))}
            />
          )}

          {!selectedEdge && (
            <div style={{ padding: "24px 28px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, color: "#9ca3af", fontSize: 13 }}>
              Select a relationship from the list to define its transfer curve.
            </div>
          )}
        </div>

        {/* Notes */}
        {notes !== undefined && (
          <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Notes from curve definition session</div>
            <textarea
              value={getNote(notes, "curves")}
              onChange={e => setNotes(prev => setNote(prev, "curves", e.target.value))}
              placeholder="Group decisions, assumptions, and disagreements about specific curves…"
              rows={4}
              style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 13, lineHeight: 1.7, resize: "vertical", background: "white" }}
            />
          </div>
        )}
      </div>
    );
  }

  // ── SIMULATION VIEW ───────────────────────────────────────────────────────
  return (
    <div style={{ padding: 24, fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <button onClick={() => setView("curves")} style={{ padding: "5px 12px", background: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: 5, fontSize: 12, cursor: "pointer" }}>← Curves</button>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1e3a5f", margin: 0 }}>
          Simulation — {scenarioName}
        </h2>
        <span style={{ fontSize: 12, color: "#6b7280", marginLeft: "auto" }}>Round {round}</span>
        <button onClick={handleStepSim} disabled={round >= SIM_ROUNDS}
          style={{ padding: "7px 18px", background: round >= SIM_ROUNDS ? "#e5e7eb" : "#1d4ed8", color: round >= SIM_ROUNDS ? "#9ca3af" : "white", border: "none", borderRadius: 5, fontSize: 13, fontWeight: 700, cursor: round >= SIM_ROUNDS ? "default" : "pointer" }}>
          Step →
        </button>
        <button onClick={handleResetSim}
          style={{ padding: "7px 14px", background: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: 5, fontSize: 13, cursor: "pointer" }}>
          Reset
        </button>
      </div>

      <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
        {/* Network */}
        <ScenarioNetwork
          selVars={selVars}
          matrix={matrix}
          transferCurves={transferCurves}
          states={states}
          selectedEdge={selectedEdge}
          onSelectEdge={setSelectedEdge}
        />

        {/* State panel */}
        <div style={{ minWidth: 220 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
            Variable states — drag to intervene
          </div>
          {selVars.map(v => {
            const state = states[v.id] ?? 15;
            const pct = state / SCALE_MAX;
            return (
              <div key={v.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: "#1e3a5f", fontWeight: 600, minWidth: 20 }}>#{v.number}</span>
                <span style={{ fontSize: 11, color: "#374151", flex: 1, minWidth: 80 }}>{(v.name || "").slice(0, 16) || "(unnamed)"}</span>
                <input type="range" min={0} max={SCALE_MAX} step={1} value={state}
                  onChange={e => setStates(prev => ({ ...prev, [v.id]: Number(e.target.value) }))}
                  style={{ width: 80, accentColor: "#1d4ed8" }} />
                <span style={{ fontSize: 11, color: "#64748b", minWidth: 24, textAlign: "right" }}>{state}</span>
              </div>
            );
          })}
        </div>
      </div>

      <TrajectoryChart history={history} selVars={selVars} />
    </div>
  );
}
