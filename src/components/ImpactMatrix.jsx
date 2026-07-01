// ── ImpactMatrix.jsx ──────────────────────────────────────────────────────────
// Step 3 — Cross-Impact Matrix
// Pairwise influence scoring: row i → col j, score 0-3.

import { computeRoles, buildSFDJSON, getNote, setNote } from "../store.js";

const CELL_SIZE = 34;

const SCORE_BG   = ["#f3f4f6", "#bfdbfe", "#3b82f6", "#1e3a8a"];
const SCORE_TEXT = ["#9ca3af", "#1e40af", "#ffffff",  "#ffffff"];

const ROLE_META = {
  critical:  { bg: "#fca5a5", border: "#dc2626", text: "#7f1d1d", label: "Critical"  },
  active:    { bg: "#fed7aa", border: "#ea580c", text: "#7c2d12", label: "Active"    },
  passive:   { bg: "#bfdbfe", border: "#2563eb", text: "#1e3a5f", label: "Passive"   },
  buffering: { bg: "#e5e7eb", border: "#6b7280", text: "#374151", label: "Buffering" },
};


// ── System Grid scatter ───────────────────────────────────────────────────────
function SystemGrid({ variables, roles }) {
  const W = 320, H = 280, PAD = 44;
  const pw = W - PAD * 2, ph = H - PAD * 2;
  const n = variables.length;

  const maxAS = Math.max(...variables.map(v => roles[v.id]?.AS ?? 0), 1);
  const maxPS = Math.max(...variables.map(v => roles[v.id]?.PS ?? 0), 1);
  const meanAS = n ? variables.reduce((s, v) => s + (roles[v.id]?.AS ?? 0), 0) / n : 0;
  const meanPS = n ? variables.reduce((s, v) => s + (roles[v.id]?.PS ?? 0), 0) / n : 0;

  const px = as => PAD + (as / maxAS) * pw;
  const py = ps => H - PAD - (ps / maxPS) * ph;
  const mx = px(meanAS);
  const my = py(meanPS);

  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>System Grid</div>
      <svg width={W} height={H} style={{ border: "1px solid #e5e7eb", borderRadius: 6, background: "white", display: "block" }}>
        {/* Quadrant shading */}
        <rect x={PAD} y={PAD}  width={mx - PAD}      height={my - PAD}      fill="#bfdbfe" opacity="0.25" />
        <rect x={mx}  y={PAD}  width={W - PAD - mx}  height={my - PAD}      fill="#fca5a5" opacity="0.25" />
        <rect x={PAD} y={my}   width={mx - PAD}      height={H - PAD - my}  fill="#e5e7eb" opacity="0.4"  />
        <rect x={mx}  y={my}   width={W - PAD - mx}  height={H - PAD - my}  fill="#fed7aa" opacity="0.25" />
        {/* Mean lines */}
        <line x1={mx} y1={PAD} x2={mx} y2={H - PAD} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,3" />
        <line x1={PAD} y1={my} x2={W - PAD} y2={my} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,3" />
        {/* Axes */}
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#374151" strokeWidth="1.5" />
        <line x1={PAD} y1={PAD}     x2={PAD}     y2={H - PAD} stroke="#374151" strokeWidth="1.5" />
        {/* Axis labels */}
        <text x={W / 2} y={H - 5} textAnchor="middle" fontSize="10" fill="#64748b" fontFamily="Arial,sans-serif">AS (Active Sum)</text>
        <text x={11} y={H / 2} textAnchor="middle" fontSize="10" fill="#64748b" fontFamily="Arial,sans-serif" transform={`rotate(-90,11,${H / 2})`}>PS (Passive Sum)</text>
        {/* Quadrant labels */}
        <text x={PAD + 5} y={PAD + 12}   fontSize="9" fill="#1e3a5f" opacity="0.7" fontFamily="Arial,sans-serif">Passive</text>
        <text x={W-PAD-4} y={PAD + 12}   fontSize="9" fill="#7f1d1d" opacity="0.7" textAnchor="end" fontFamily="Arial,sans-serif">Critical</text>
        <text x={PAD + 5} y={H-PAD - 5}  fontSize="9" fill="#374151" opacity="0.6" fontFamily="Arial,sans-serif">Buffering</text>
        <text x={W-PAD-4} y={H-PAD - 5}  fontSize="9" fill="#7c2d12" opacity="0.7" textAnchor="end" fontFamily="Arial,sans-serif">Active</text>
        {/* Points */}
        {variables.map(v => {
          const r = roles[v.id];
          if (!r) return null;
          const meta = ROLE_META[r.role ?? "buffering"];
          return (
            <g key={v.id}>
              <circle cx={px(r.AS)} cy={py(r.PS)} r={11} fill={meta.bg} stroke={meta.border} strokeWidth="1.5" />
              <text x={px(r.AS)} y={py(r.PS) + 4} textAnchor="middle" fontSize="9" fontWeight="bold" fill={meta.text} fontFamily="Arial,sans-serif">{v.number}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ImpactMatrix({ variables, matrix, setMatrix, modelName, notes, setNotes }) {
  if (!variables || variables.length < 2) {
    return (
      <div style={{ padding: 40, color: "#6b7280", fontSize: 14, textAlign: "center" }}>
        Add at least 2 variables in Step 1 to build the impact matrix.
      </div>
    );
  }

  const getScore = (srcId, tgtId) => matrix?.[srcId]?.[tgtId] ?? 0;

  const cycleScore = (srcId, tgtId) => {
    if (srcId === tgtId) return;
    const next = (getScore(srcId, tgtId) + 1) % 4;
    setMatrix(prev => ({ ...prev, [srcId]: { ...prev?.[srcId], [tgtId]: next } }));
  };

  const roles = computeRoles(variables, matrix ?? {});

  const handleExportSFD = () => {
    const json = buildSFDJSON({ modelName, variables, influenceMatrix: matrix ?? {} });
    const blob = new Blob([json], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url;
    a.download = `${(modelName || "model").replace(/\s+/g, "_")}_sfd.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const SUM_COL_W = 42;

  // Role table — sorted by Q desc
  const roleRows = [...variables]
    .map(v => ({ v, ...(roles[v.id] ?? { AS: 0, PS: 0, Q: 0, role: "buffering" }) }))
    .sort((a, b) => b.Q - a.Q);

  return (
    <div style={{ padding: 24, fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1e3a5f", marginBottom: 4 }}>
        Step 3 — Cross-Impact Matrix
      </h2>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20, lineHeight: 1.6 }}>
        Row = source variable, column = target variable. Click a cell to cycle
        {" "}<strong>0</strong> (none) → <strong>1</strong> (weak) → <strong>2</strong> (medium) → <strong>3</strong> (strong).
        Diagonal disabled.
      </p>

      {/* ── Matrix grid ── */}
      <div style={{ overflowX: "auto", marginBottom: 28 }}>
        <table style={{ borderCollapse: "collapse", tableLayout: "fixed", userSelect: "none" }}>
          <thead>
            <tr>
              <th style={{ position: "sticky", left: 0, background: "white", zIndex: 3, borderBottom: "2px solid #e5e7eb", padding: 0 }} />
              {variables.map(v => (
                <th key={v.id}
                  style={{ width: CELL_SIZE, minWidth: CELL_SIZE, padding: 0, verticalAlign: "bottom", textAlign: "center", borderBottom: "2px solid #e5e7eb", fontWeight: 500, fontSize: 11, color: "#374151", background: "white" }}>
                  <div style={{ display: "inline-flex", alignItems: "flex-end", justifyContent: "flex-start", paddingBottom: 4, paddingTop: 8, writingMode: "vertical-rl", transform: "rotate(180deg)", whiteSpace: "nowrap" }}>
                    <span style={{ fontWeight: 700, color: "#1e3a5f" }}>#{v.number}</span>
                    <span style={{ marginLeft: 4 }}>{v.name || "(unnamed)"}</span>
                  </div>
                </th>
              ))}
              <th style={{ width: SUM_COL_W, minWidth: SUM_COL_W, padding: 0, verticalAlign: "bottom", textAlign: "center", borderBottom: "2px solid #e5e7eb", borderLeft: "2px solid #e5e7eb", fontWeight: 700, fontSize: 11, color: "#1d4ed8", background: "white" }}>
                <div style={{ display: "inline-flex", alignItems: "flex-end", justifyContent: "flex-start", paddingBottom: 4, paddingTop: 8, writingMode: "vertical-rl", transform: "rotate(180deg)", whiteSpace: "nowrap" }}>
                  AS
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {variables.map(src => (
              <tr key={src.id}>
                <td style={{ position: "sticky", left: 0, background: "white", zIndex: 2, padding: "0 12px 0 4px", borderBottom: "1px solid #f3f4f6", borderRight: "2px solid #e5e7eb", fontSize: 12, color: "#374151", whiteSpace: "nowrap", height: CELL_SIZE }}>
                  <span style={{ fontWeight: 700, color: "#1e3a5f" }}>#{src.number}</span>{" "}
                  {src.name || "(unnamed)"}
                </td>
                {variables.map(tgt => {
                  const isDiag = src.id === tgt.id;
                  const score  = isDiag ? null : getScore(src.id, tgt.id);
                  return (
                    <td key={tgt.id} onClick={() => cycleScore(src.id, tgt.id)}
                      title={isDiag ? undefined : `${src.name || "#" + src.number} → ${tgt.name || "#" + tgt.number}`}
                      style={{ width: CELL_SIZE, minWidth: CELL_SIZE, height: CELL_SIZE, padding: 0, textAlign: "center", verticalAlign: "middle", background: isDiag ? "#e5e7eb" : SCORE_BG[score], color: isDiag ? "#9ca3af" : SCORE_TEXT[score], cursor: isDiag ? "default" : "pointer", pointerEvents: isDiag ? "none" : "auto", fontSize: 11, fontWeight: 600, border: "1px solid #e5e7eb", transition: "background 0.1s", lineHeight: `${CELL_SIZE}px` }}>
                      {isDiag ? "—" : score}
                    </td>
                  );
                })}
                <td style={{ width: SUM_COL_W, minWidth: SUM_COL_W, height: CELL_SIZE, padding: 0, textAlign: "center", verticalAlign: "middle", borderLeft: "2px solid #e5e7eb", borderBottom: "1px solid #f3f4f6", fontSize: 12, fontWeight: 700, color: "#1d4ed8", background: "#f8fafc" }}>
                  {roles[src.id]?.AS ?? 0}
                </td>
              </tr>
            ))}
            {/* PS row */}
            <tr>
              <td style={{ position: "sticky", left: 0, background: "#f8fafc", zIndex: 2, padding: "0 8px 0 4px", borderTop: "2px solid #e5e7eb", borderRight: "2px solid #e5e7eb", fontSize: 10, fontWeight: 700, color: "#dc2626", height: 30, verticalAlign: "middle" }}>
                PS (Passive Sum)
              </td>
              {variables.map(tgt => (
                <td key={tgt.id} style={{ textAlign: "center", verticalAlign: "middle", borderTop: "2px solid #e5e7eb", border: "1px solid #e5e7eb", fontSize: 12, fontWeight: 700, color: "#dc2626", background: "#f8fafc", height: 30 }}>
                  {roles[tgt.id]?.PS ?? 0}
                </td>
              ))}
              <td style={{ borderTop: "2px solid #e5e7eb", borderLeft: "2px solid #e5e7eb", background: "#f8fafc" }} />
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── Score legend ── */}
      <div style={{ display: "flex", gap: 16, marginBottom: 28, alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, color: "#6b7280", fontWeight: 600 }}>Influence:</span>
        {[0, 1, 2, 3].map(s => (
          <span key={s} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#374151" }}>
            <span style={{ display: "inline-block", width: 16, height: 16, background: SCORE_BG[s], border: "1px solid #d1d5db", borderRadius: 2 }} />
            {s === 0 ? "0 none" : s === 1 ? "1 weak" : s === 2 ? "2 medium" : "3 strong"}
          </span>
        ))}
      </div>

      {/* ── System Grid + Role table ── */}
      <div style={{ display: "flex", gap: 28, alignItems: "flex-start", flexWrap: "wrap", marginBottom: 28 }}>
        <SystemGrid variables={variables} roles={roles} />

        <div style={{ flex: 1, minWidth: 300 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
            Variable Roles — sorted by Q = AS × PS
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                {["#", "Variable", "AS", "PS", "Q", "Role"].map((h, i) => (
                  <th key={h} style={{ padding: "5px 8px", textAlign: i >= 2 && i <= 4 ? "center" : "left", borderBottom: "1px solid #e5e7eb", color: "#64748b", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roleRows.map(({ v, AS, PS, Q, role }) => {
                const meta = ROLE_META[role ?? "buffering"];
                return (
                  <tr key={v.id}>
                    <td style={{ padding: "4px 8px", color: "#94a3b8", borderBottom: "1px solid #f3f4f6" }}>{v.number}</td>
                    <td style={{ padding: "4px 8px", borderBottom: "1px solid #f3f4f6", color: "#1f2937" }}>{v.name || "(unnamed)"}</td>
                    <td style={{ padding: "4px 8px", textAlign: "center", fontWeight: 700, color: "#1d4ed8",  borderBottom: "1px solid #f3f4f6" }}>{AS}</td>
                    <td style={{ padding: "4px 8px", textAlign: "center", fontWeight: 700, color: "#dc2626",  borderBottom: "1px solid #f3f4f6" }}>{PS}</td>
                    <td style={{ padding: "4px 8px", textAlign: "center", color: "#374151", borderBottom: "1px solid #f3f4f6" }}>{Q}</td>
                    <td style={{ padding: "4px 8px", borderBottom: "1px solid #f3f4f6" }}>
                      <span style={{ background: meta.bg, color: meta.text, border: `1px solid ${meta.border}`, borderRadius: 3, padding: "1px 7px", fontSize: 11, fontWeight: 600 }}>
                        {meta.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Export to SFD ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, padding: "12px 16px", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 6 }}>
        <button onClick={handleExportSFD}
          style={{ padding: "7px 18px", background: "#b45309", color: "white", border: "none", borderRadius: 5, fontSize: 13, fontWeight: 600, cursor: "pointer", flexShrink: 0 }}>
          Export to SFD →
        </button>
        <span style={{ fontSize: 12, color: "#92400e", lineHeight: 1.5 }}>
          Downloads a <code style={{ background: "#fef3c7", borderRadius: 2, padding: "0 3px" }}>.json</code> file.
          In graph-tool-v22.html: click <strong>JSON</strong> import → drag the file in → switch to <strong>SFD</strong> mode.
          Nodes are colored by role (critical/active/passive/buffering) and carry a <code style={{ background: "#fef3c7", borderRadius: 2, padding: "0 3px" }}>sensimodId</code> for future round-trips.
        </span>
      </div>

      {/* ── Notes ── */}
      {notes !== undefined && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Notes from matrix scoring session</div>
          <textarea
            value={getNote(notes, "matrix")}
            onChange={e => setNotes(prev => setNote(prev, "matrix", e.target.value))}
            placeholder="Surprises, disagreements, open questions from the group scoring session…"
            rows={5}
            style={{ width: "100%", boxSizing: "border-box", padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 13, lineHeight: 1.7, resize: "vertical", background: "white" }}
          />
        </div>
      )}
    </div>
  );
}
