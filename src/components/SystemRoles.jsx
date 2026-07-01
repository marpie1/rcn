// ── SystemRoles.jsx ───────────────────────────────────────────────────────────
// Step 4 — System Roles (Rollenverteilung)
// Dedicated quadrant view; read-only roles computed from the matrix.

import { useState } from "react";
import { computeRoles, getNote, setNote } from "../store.js";

const ROLE_META = {
  critical:  { label: "Critical",  color: "#dc2626", bg: "#fca5a5", text: "#7f1d1d",
    desc: "High AS and high PS. These variables both drive the system and are driven by it. Interventions here can cause unpredictable, amplifying feedback loops. Handle with care — and monitor closely." },
  active:    { label: "Active",    color: "#ea580c", bg: "#fed7aa", text: "#7c2d12",
    desc: "High AS, low PS. These are the levers — variables that drive others but are little influenced themselves. Policy measures work best when targeted here." },
  passive:   { label: "Passive",   color: "#2563eb", bg: "#bfdbfe", text: "#1e3a5f",
    desc: "Low AS, high PS. Outcome indicators — largely driven by others. Improving them is the goal, but acting on them directly has little systemic effect." },
  buffering: { label: "Buffering", color: "#6b7280", bg: "#e5e7eb", text: "#374151",
    desc: "Low AS and low PS. Relatively disconnected — neither strong drivers nor strongly driven. May be removed from a partial scenario without much loss." },
};

// ── Quadrant scatter ──────────────────────────────────────────────────────────
function RoleChart({ variables, roles, selected, onSelect }) {
  const W = 520, H = 420, PAD = 52;
  const pw = W - PAD * 2, ph = H - PAD * 2;
  const n = variables.length;

  const allAS = variables.map(v => roles[v.id]?.AS ?? 0);
  const allPS = variables.map(v => roles[v.id]?.PS ?? 0);
  const maxAS = Math.max(...allAS, 1);
  const maxPS = Math.max(...allPS, 1);
  const meanAS = n ? allAS.reduce((a, b) => a + b, 0) / n : 0;
  const meanPS = n ? allPS.reduce((a, b) => a + b, 0) / n : 0;

  // X = PS, Y = AS  →  Active=upper-left, Critical=upper-right,
  //                     Buffering=lower-left, Passive=lower-right
  const px = ps => PAD + (ps / maxPS) * pw;
  const py = as => H - PAD - (as / maxAS) * ph;
  const mx = px(meanPS);
  const my = py(meanAS);

  // Q isolines at Q = meanAS * meanPS  (a hyperbola x*y = const)
  // We draw 3 contours for visual depth
  const qMean = meanAS * meanPS;
  const qLines = [qMean * 0.5, qMean, qMean * 2].filter(q => q > 0);
  const hypPoints = (qVal, steps = 60) => {
    const pts = [];
    for (let i = 1; i <= steps; i++) {
      const asVal = (i / steps) * maxAS;
      const psVal = qVal / asVal;
      if (psVal <= maxPS) pts.push(`${px(psVal)},${py(asVal)}`);
    }
    return pts.join(" ");
  };

  // Axis tick count
  const ticks = n => Array.from({ length: n + 1 }, (_, i) => i);

  return (
    <svg width={W} height={H} style={{ display: "block", border: "1px solid #d1d5db", borderRadius: 8, background: "#fafafa" }}>
      {/* Gradient quadrant fills */}
      <defs>
        <linearGradient id="grad-active" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fed7aa" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#fef3c7" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="grad-critical" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fca5a5" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#fde68a" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="grad-buffering" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e5e7eb" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#f9fafb" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="grad-passive" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Quadrant fills */}
      <rect x={PAD}   y={PAD}   width={mx - PAD}     height={my - PAD}     fill="url(#grad-active)"    />
      <rect x={mx}    y={PAD}   width={W - PAD - mx}  height={my - PAD}     fill="url(#grad-critical)"  />
      <rect x={PAD}   y={my}    width={mx - PAD}      height={H - PAD - my} fill="url(#grad-buffering)" />
      <rect x={mx}    y={my}    width={W - PAD - mx}  height={H - PAD - my} fill="url(#grad-passive)"   />

      {/* Q-value hyperbola isolines */}
      {qLines.map((q, i) => (
        <polyline key={q} points={hypPoints(q)} fill="none"
          stroke="#94a3b8" strokeWidth={i === 1 ? 1.2 : 0.6}
          strokeDasharray={i === 1 ? "5,4" : "3,4"} opacity="0.4" />
      ))}

      {/* Mean lines */}
      <line x1={mx} y1={PAD} x2={mx} y2={H - PAD} stroke="#64748b" strokeWidth="1.2" strokeDasharray="6,4" />
      <line x1={PAD} y1={my} x2={W - PAD} y2={my} stroke="#64748b" strokeWidth="1.2" strokeDasharray="6,4" />

      {/* Axes */}
      <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#374151" strokeWidth="1.5" />
      <line x1={PAD} y1={PAD}     x2={PAD}     y2={H - PAD} stroke="#374151" strokeWidth="1.5" />

      {/* Axis labels */}
      <text x={W / 2} y={H - 8}  textAnchor="middle" fontSize="11" fill="#374151" fontFamily="Arial,sans-serif" fontWeight="600">
        PS — Passive Sum →
      </text>
      <text x={13} y={H / 2} textAnchor="middle" fontSize="11" fill="#374151" fontFamily="Arial,sans-serif" fontWeight="600"
        transform={`rotate(-90,13,${H / 2})`}>
        ← AS — Active Sum
      </text>

      {/* Mean value ticks */}
      <line x1={mx - 3} y1={H - PAD} x2={mx + 3} y2={H - PAD} stroke="#64748b" strokeWidth="1.5" />
      <text x={mx} y={H - PAD + 13} textAnchor="middle" fontSize="9" fill="#64748b" fontFamily="Arial,sans-serif">
        {meanPS.toFixed(1)}
      </text>
      <line x1={PAD} y1={my - 3} x2={PAD} y2={my + 3} stroke="#64748b" strokeWidth="1.5" />
      <text x={PAD - 4} y={my + 4} textAnchor="end" fontSize="9" fill="#64748b" fontFamily="Arial,sans-serif">
        {meanAS.toFixed(1)}
      </text>

      {/* Quadrant labels */}
      <text x={PAD + 7} y={PAD + 16} fontSize="11" fontWeight="700" fill="#7c2d12" opacity="0.85" fontFamily="Arial,sans-serif">Active</text>
      <text x={W - PAD - 7} y={PAD + 16} fontSize="11" fontWeight="700" fill="#7f1d1d" opacity="0.85" textAnchor="end" fontFamily="Arial,sans-serif">Critical</text>
      <text x={PAD + 7} y={H - PAD - 7} fontSize="11" fontWeight="700" fill="#374151" opacity="0.6" fontFamily="Arial,sans-serif">Buffering</text>
      <text x={W - PAD - 7} y={H - PAD - 7} fontSize="11" fontWeight="700" fill="#1e3a5f" opacity="0.7" textAnchor="end" fontFamily="Arial,sans-serif">Passive</text>

      {/* Variable circles */}
      {variables.map(v => {
        const r = roles[v.id];
        if (!r) return null;
        const meta = ROLE_META[r.role ?? "buffering"];
        const cx = px(r.PS);
        const cy = py(r.AS);
        const isSel = selected === v.id;
        return (
          <g key={v.id} onClick={() => onSelect(isSel ? null : v.id)} style={{ cursor: "pointer" }}>
            <circle cx={cx} cy={cy} r={14} fill={meta.bg}
              stroke={isSel ? "#1e3a5f" : meta.color}
              strokeWidth={isSel ? 3 : 1.8} />
            <text x={cx} y={cy + 4} textAnchor="middle" fontSize="10" fontWeight="bold"
              fill={meta.text} fontFamily="Arial,sans-serif">
              {v.number}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Role sidebar ──────────────────────────────────────────────────────────────
function RoleDetail({ variable, role }) {
  if (!variable || !role) return null;
  const meta = ROLE_META[role.role ?? "buffering"];
  return (
    <div style={{ padding: "14px 16px", border: `1.5px solid ${meta.color}`, borderRadius: 8, background: meta.bg, minWidth: 220, maxWidth: 300 }}>
      <div style={{ fontWeight: 700, fontSize: 13, color: meta.text, marginBottom: 4 }}>
        #{variable.number} {variable.name || "(unnamed)"}
      </div>
      <div style={{ display: "flex", gap: 10, fontSize: 12, color: meta.text, marginBottom: 8 }}>
        <span><strong>AS</strong> {role.AS}</span>
        <span><strong>PS</strong> {role.PS}</span>
        <span><strong>Q</strong> {role.Q}</span>
      </div>
      <div style={{ display: "inline-block", background: meta.color, color: "white", borderRadius: 4, padding: "2px 10px", fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
        {meta.label}
      </div>
      <div style={{ fontSize: 12, color: meta.text, lineHeight: 1.6 }}>
        {meta.desc}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function SystemRoles({ variables, matrix, onNavigate, notes, setNotes }) {
  const [selected, setSelected] = useState(null);

  if (!variables || variables.length < 2) {
    return (
      <div style={{ padding: 40, color: "#6b7280", fontSize: 14, textAlign: "center" }}>
        Add at least 2 variables in Step 1 and score the matrix in Step 3 to see roles.
      </div>
    );
  }

  const roles = computeRoles(variables, matrix ?? {});

  // Check for scored cells (otherwise all roles are buffering/meaningless)
  const hasScores = variables.some(v =>
    variables.some(v2 => v.id !== v2.id && (matrix?.[v.id]?.[v2.id] ?? null) !== null)
  );

  // Count by role
  const counts = { critical: 0, active: 0, passive: 0, buffering: 0 };
  variables.forEach(v => { const role = roles[v.id]?.role ?? "buffering"; counts[role]++; });

  const selVar  = selected ? variables.find(v => v.id === selected) : null;
  const selRole = selected ? roles[selected] : null;

  // Role table sorted by Q desc
  const sorted = [...variables]
    .map(v => ({ v, ...roles[v.id] }))
    .sort((a, b) => b.Q - a.Q);

  return (
    <div style={{ padding: 24, fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1e3a5f", marginBottom: 4 }}>
        Step 4 — System Roles
      </h2>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20, lineHeight: 1.6 }}>
        Each variable's position in the AS/PS quadrant reveals its systemic role.
        Click a variable to read its role. If the <strong>Active</strong> quadrant is empty, go back to Step 1 to add more driver variables before building a scenario.
      </p>

      {/* Alerts */}
      {!hasScores && (
        <div style={{ background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 6, padding: "10px 16px", marginBottom: 16, fontSize: 13, color: "#92400e" }}>
          The matrix has no scores yet — go to <button onClick={() => onNavigate?.("matrix")} style={{ background: "none", border: "none", color: "#1d4ed8", cursor: "pointer", fontWeight: 600, textDecoration: "underline", padding: 0, fontSize: 13 }}>Step 3</button> to score relationships first.
        </div>
      )}
      {hasScores && counts.active === 0 && (
        <div style={{ background: "#fca5a5", border: "1px solid #f87171", borderRadius: 6, padding: "10px 16px", marginBottom: 16, fontSize: 13, color: "#7f1d1d" }}>
          <strong>No Active variables.</strong> Scenarios need at least one lever (high AS, low PS).
          Consider adding more variables in <button onClick={() => onNavigate?.("variables")} style={{ background: "none", border: "none", color: "#1d4ed8", cursor: "pointer", fontWeight: 600, textDecoration: "underline", padding: 0, fontSize: 13 }}>Step 1</button>.
        </div>
      )}

      {/* Role count badges */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        {Object.entries(counts).map(([role, count]) => {
          const meta = ROLE_META[role];
          return (
            <span key={role} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 12px", background: meta.bg, border: `1px solid ${meta.color}`, borderRadius: 16, fontSize: 12, fontWeight: 600, color: meta.text }}>
              {count} {meta.label}
            </span>
          );
        })}
      </div>

      {/* Chart + detail */}
      <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap", marginBottom: 28 }}>
        <RoleChart variables={variables} roles={roles} selected={selected} onSelect={setSelected} />
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {selVar
            ? <RoleDetail variable={selVar} role={selRole} />
            : (
              <div style={{ padding: "12px 16px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, color: "#9ca3af", fontSize: 13, maxWidth: 280 }}>
                Click a variable in the chart to see its role description.
              </div>
            )
          }

          {/* Role legend */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "12px 14px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, maxWidth: 280 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Role interpretation</div>
            {Object.entries(ROLE_META).map(([role, meta]) => (
              <div key={role} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 11 }}>
                <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: meta.bg, border: `1.5px solid ${meta.color}`, flexShrink: 0, marginTop: 2 }} />
                <div>
                  <span style={{ fontWeight: 700, color: meta.text }}>{meta.label}</span>
                  {" — "}
                  <span style={{ color: "#6b7280" }}>
                    {role === "critical"  ? "high AS, high PS — volatile, amplifying" :
                     role === "active"    ? "high AS, low PS — levers, policy targets" :
                     role === "passive"   ? "low AS, high PS — outcome indicators" :
                                           "low AS, low PS — relatively disconnected"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Role table */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
          All variables — sorted by Q = AS × PS (systemic relevance)
        </div>
        <table style={{ borderCollapse: "collapse", fontSize: 12, width: "100%", maxWidth: 700 }}>
          <thead>
            <tr style={{ background: "#f9fafb" }}>
              {["#", "Variable", "AS", "PS", "Q", "Role"].map((h, i) => (
                <th key={h} style={{ padding: "5px 10px", textAlign: i >= 2 && i <= 4 ? "center" : "left", borderBottom: "1px solid #e5e7eb", color: "#64748b", fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map(({ v, AS, PS, Q, role }) => {
              const meta = ROLE_META[role ?? "buffering"];
              const isSel = selected === v.id;
              return (
                <tr key={v.id} onClick={() => setSelected(isSel ? null : v.id)}
                  style={{ cursor: "pointer", background: isSel ? "#eff6ff" : "white" }}>
                  <td style={{ padding: "4px 10px", color: "#94a3b8", borderBottom: "1px solid #f3f4f6" }}>{v.number}</td>
                  <td style={{ padding: "4px 10px", borderBottom: "1px solid #f3f4f6", color: "#1f2937" }}>{v.name || "(unnamed)"}</td>
                  <td style={{ padding: "4px 10px", textAlign: "center", fontWeight: 700, color: "#1d4ed8", borderBottom: "1px solid #f3f4f6" }}>{AS ?? 0}</td>
                  <td style={{ padding: "4px 10px", textAlign: "center", fontWeight: 700, color: "#dc2626", borderBottom: "1px solid #f3f4f6" }}>{PS ?? 0}</td>
                  <td style={{ padding: "4px 10px", textAlign: "center", color: "#374151", borderBottom: "1px solid #f3f4f6" }}>{Q ?? 0}</td>
                  <td style={{ padding: "4px 10px", borderBottom: "1px solid #f3f4f6" }}>
                    <span style={{ background: meta.bg, color: meta.text, border: `1px solid ${meta.color}`, borderRadius: 3, padding: "1px 7px", fontSize: 11, fontWeight: 600 }}>
                      {meta.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Notes */}
      {notes !== undefined && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Notes from Step 4 review</div>
          <textarea
            value={getNote(notes, "roles")}
            onChange={e => setNotes(prev => setNote(prev, "roles", e.target.value))}
            placeholder="Surprises in the role landscape? Missing variable types? Notes for the group…"
            rows={4}
            style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 13, lineHeight: 1.7, resize: "vertical", background: "white" }}
          />
        </div>
      )}
    </div>
  );
}
