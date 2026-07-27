// ── VariableSet.jsx ───────────────────────────────────────────────────────────
// Receives all state and setters from App via props.
// No internal persistence — App owns save/load.

import { useState, useRef, useCallback, useEffect } from "react";
import { getNote, setNote } from "../store.js";

const WARN_AMBER = 30;
const WARN_RED = 50;

// ── Auto-expanding textarea ───────────────────────────────────────────────────
function AutoTextarea({ value, onChange, placeholder, style }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = ref.current.scrollHeight + "px";
    }
  }, [value]);
  return (
    <textarea
      ref={ref}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={1}
      style={{ overflow: "hidden", resize: "none", lineHeight: 1.4, ...style }}
    />
  );
}

// ── Scale colour helper ───────────────────────────────────────────────────────
function scaleColor(pos, optimum, colorEval) {
  if (!colorEval || optimum === null) return "#e5e7eb";
  const dist = Math.abs(pos - optimum);
  if (dist <= 3) return "#86efac";
  if (dist <= 8) return "#fde68a";
  return "#fca5a5";
}

// ── Scale Panel ───────────────────────────────────────────────────────────────
function ScalePanel({ scale, onChange }) {
  const [hoverPos, setHoverPos] = useState(null);
  const [editingPos, setEditingPos] = useState(null);
  const [editText, setEditText] = useState("");
  const trackRef = useRef(null);

  const TRACK_HEIGHT = 360;
  const posToY = (pos) => TRACK_HEIGHT - (pos / 30) * TRACK_HEIGHT;
  const yToPos = (y) => Math.round(((TRACK_HEIGHT - y) / TRACK_HEIGHT) * 30);

  const handleTrackClick = useCallback((e) => {
    const rect = trackRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const pos = Math.max(0, Math.min(30, yToPos(y)));
    if (scale.colorEval) {
      onChange({ ...scale, optimum: scale.optimum === pos ? null : pos });
      return;
    }
    const existing = scale.intermediates.find((i) => i.position === pos);
    setEditingPos(pos);
    setEditText(existing ? existing.label : "");
  }, [scale, onChange]);

  const handleTrackMouseMove = useCallback((e) => {
    const rect = trackRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    setHoverPos(Math.max(0, Math.min(30, yToPos(y))));
  }, []);

  const commitLabel = () => {
    if (editingPos === null) return;
    let intermediates = scale.intermediates.filter((i) => i.position !== editingPos);
    if (editText.trim()) intermediates = [...intermediates, { position: editingPos, label: editText.trim() }];
    intermediates.sort((a, b) => a.position - b.position);
    onChange({ ...scale, intermediates });
    setEditingPos(null);
    setEditText("");
  };

  const removeIntermediate = (pos) => {
    onChange({ ...scale, intermediates: scale.intermediates.filter((i) => i.position !== pos) });
  };

  return (
    <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", userSelect: "none" }}>
        <AutoTextarea
          value={scale.maxLabel}
          onChange={(e) => onChange({ ...scale, maxLabel: e.target.value })}
          placeholder="State at 30 (highest)"
          style={{ width: 180, marginBottom: 6, padding: "4px 8px", border: "1px solid #d1d5db", borderRadius: 4, fontSize: 12, boxSizing: "border-box" }}
        />
        <div
          ref={trackRef}
          onClick={handleTrackClick}
          onMouseMove={handleTrackMouseMove}
          onMouseLeave={() => setHoverPos(null)}
          style={{
            width: 40, height: TRACK_HEIGHT,
            background: "linear-gradient(to top, #fca5a5, #fde68a, #86efac)",
            borderRadius: 6, position: "relative",
            cursor: scale.colorEval ? "crosshair" : "pointer",
            border: "1px solid #9ca3af", boxSizing: "border-box",
          }}
        >
          {[0, 5, 10, 15, 20, 25, 30].map((p) => (
            <div key={p} style={{ position: "absolute", right: -22, top: posToY(p) - 1, fontSize: 10, color: "#6b7280", lineHeight: 1 }}>{p}</div>
          ))}
          {scale.intermediates.map(({ position }) => (
            <div key={position} style={{ position: "absolute", left: -6, top: posToY(position) - 1, width: 52, height: 2, background: "#374151" }} />
          ))}
          {scale.optimum !== null && (
            <div style={{
              position: "absolute", left: -4, top: posToY(scale.optimum) - 8,
              width: 48, height: 16, display: "flex", alignItems: "center", justifyContent: "center",
              background: "#1d4ed8", borderRadius: 3, color: "white", fontSize: 10, fontWeight: "bold", pointerEvents: "none",
            }}>OPT</div>
          )}
          {hoverPos !== null && (
            <div style={{ position: "absolute", left: 0, top: posToY(hoverPos) - 1, width: "100%", height: 2, background: "rgba(30,30,30,0.4)", pointerEvents: "none" }} />
          )}
        </div>
        <AutoTextarea
          value={scale.minLabel}
          onChange={(e) => onChange({ ...scale, minLabel: e.target.value })}
          placeholder="State at 0 (lowest)"
          style={{ width: 180, marginTop: 6, padding: "4px 8px", border: "1px solid #d1d5db", borderRadius: 4, fontSize: 12, boxSizing: "border-box" }}
        />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 6, padding: "10px 12px", fontSize: 12, color: "#0369a1" }}>
          <strong>How to use this scale:</strong><br />
          1. Label the states at 0 (lowest) and 30 (highest).<br />
          2. Click anywhere on the track to add an intermediate label.<br />
          3. Enable <em>Color evaluation</em>, then click the track to set the optimum.
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={scale.colorEval}
            onChange={(e) => onChange({ ...scale, colorEval: e.target.checked, optimum: e.target.checked ? scale.optimum : null })}
          />
          Enable color evaluation (click track to set optimum)
        </label>

        {editingPos !== null && (
          <div style={{ background: "#fefce8", border: "1px solid #fde047", borderRadius: 6, padding: 10 }}>
            <div style={{ fontSize: 12, marginBottom: 6, color: "#713f12" }}>Label for position {editingPos}:</div>
            <AutoTextarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              placeholder="Describe this state…"
              style={{ width: "100%", padding: "4px 8px", border: "1px solid #d1d5db", borderRadius: 4, fontSize: 12, boxSizing: "border-box" }}
            />
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>Enter to save · Esc to cancel</div>
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              <button onClick={commitLabel} style={{ padding: "3px 12px", background: "#1d4ed8", color: "white", border: "none", borderRadius: 4, fontSize: 12, cursor: "pointer" }}>Save</button>
              <button onClick={() => setEditingPos(null)} style={{ padding: "3px 12px", background: "#e5e7eb", border: "none", borderRadius: 4, fontSize: 12, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        )}

        {scale.intermediates.length > 0 && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Intermediate states:</div>
            {[...scale.intermediates].sort((a, b) => b.position - a.position).map(({ position, label }) => (
              <div key={position} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ minWidth: 28, textAlign: "center", fontSize: 11, fontWeight: 600, background: scaleColor(position, scale.optimum, scale.colorEval), borderRadius: 3, padding: "1px 4px" }}>{position}</span>
                <span style={{ fontSize: 12, flex: 1, color: "#374151" }}>{label}</span>
                <button onClick={() => removeIntermediate(position)} style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer", fontSize: 14, lineHeight: 1 }}>×</button>
              </div>
            ))}
          </div>
        )}

        {scale.optimum !== null && (
          <div style={{ fontSize: 12, color: "#1d4ed8", fontWeight: 600 }}>
            Optimum at position {scale.optimum}
            <button onClick={() => onChange({ ...scale, optimum: null })} style={{ marginLeft: 8, background: "none", border: "none", color: "#9ca3af", cursor: "pointer", fontSize: 12 }}>clear</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── VariableSet ───────────────────────────────────────────────────────────────
export default function VariableSet({ variables, setVariables, makeId, notes, setNotes }) {
  const [selectedId, setSelectedId] = useState(() => variables[0]?.id ?? null);
  const [activeTab, setActiveTab] = useState("describe");
  const [dragOver, setDragOver] = useState(null);
  const dragSrc = useRef(null);

  // Keep selectedId valid if variables change externally
  useEffect(() => {
    if (!variables.find((v) => v.id === selectedId) && variables.length > 0) {
      setSelectedId(variables[0].id);
    }
  }, [variables]);

  const selected = variables.find((v) => v.id === selectedId);
  const count = variables.length;

  const warning =
    count > WARN_RED
      ? { text: `${count} variables — well above Vester's limit of 50. Consider splitting into sub-models.`, color: "#fca5a5", border: "#f87171" }
      : count > WARN_AMBER
      ? { text: `${count} variables — above 30. The impact matrix will be cognitively demanding.`, color: "#fde68a", border: "#fbbf24" }
      : null;

  const addVariable = () => {
    const id = makeId();
    const newVars = [...variables, { id, number: variables.length + 1, name: "", description: "", scale: { minLabel: "", maxLabel: "", intermediates: [], optimum: null, colorEval: false } }];
    setVariables(newVars);
    setSelectedId(id);
    setActiveTab("describe");
  };

  const deleteVariable = (id) => {
    const newVars = variables.filter((v) => v.id !== id).map((v, i) => ({ ...v, number: i + 1 }));
    setVariables(newVars);
    if (selectedId === id) setSelectedId(newVars[0]?.id ?? null);
  };

  const updateSelected = (patch) => {
    setVariables(variables.map((v) => v.id === selectedId ? { ...v, ...patch } : v));
  };

  const updateScale = (newScale) => {
    setVariables(variables.map((v) => v.id === selectedId ? { ...v, scale: newScale } : v));
  };

  const handleDragStart = (id) => { dragSrc.current = id; };
  const handleDragOver = (e, id) => { e.preventDefault(); setDragOver(id); };
  const handleDrop = (targetId) => {
    if (!dragSrc.current || dragSrc.current === targetId) { setDragOver(null); return; }
    const from = variables.findIndex((v) => v.id === dragSrc.current);
    const to = variables.findIndex((v) => v.id === targetId);
    const reordered = [...variables];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    setVariables(reordered.map((v, i) => ({ ...v, number: i + 1 })));
    dragSrc.current = null;
    setDragOver(null);
  };

  return (
    <div style={{ padding: 24, fontFamily: "Arial, sans-serif" }}>
      {warning && (
        <div style={{ background: warning.color, border: `1px solid ${warning.border}`, borderRadius: 6, padding: "8px 14px", marginBottom: 12, fontSize: 13 }}>
          ⚠️ {warning.text}
        </div>
      )}

      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        {/* Left: variable list */}
        <div style={{ width: 260, background: "white", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflow: "hidden", flexShrink: 0 }}>
          <div style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Variables ({count})</span>
            <button onClick={addVariable} style={{ background: "#84cc16", border: "none", borderRadius: 4, color: "white", fontWeight: 700, fontSize: 18, width: 26, height: 26, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
          </div>
          <div style={{ maxHeight: 520, overflowY: "auto" }}>
            {variables.map((v) => (
              <div
                key={v.id}
                draggable
                onDragStart={() => handleDragStart(v.id)}
                onDragOver={(e) => handleDragOver(e, v.id)}
                onDrop={() => handleDrop(v.id)}
                onDragEnd={() => setDragOver(null)}
                onClick={() => setSelectedId(v.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "8px 12px",
                  background: v.id === selectedId ? "#eff6ff" : dragOver === v.id ? "#f0fdf4" : "white",
                  borderLeft: v.id === selectedId ? "3px solid #1d4ed8" : "3px solid transparent",
                  borderBottom: "1px solid #f3f4f6", cursor: "pointer",
                }}
              >
                <span style={{ fontSize: 11, color: "#9ca3af", minWidth: 20, textAlign: "right" }}>{v.number}</span>
                <span style={{ fontSize: 13, flex: 1, color: v.name ? "#1f2937" : "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {v.name || "unnamed"}
                </span>
                <button onClick={(e) => { e.stopPropagation(); deleteVariable(v.id); }} style={{ background: "none", border: "none", color: "#d1d5db", cursor: "pointer", fontSize: 15, lineHeight: 1, padding: 0 }}>×</button>
              </div>
            ))}
          </div>
          <div style={{ padding: "8px 12px", borderTop: "1px solid #e5e7eb", fontSize: 11, color: "#9ca3af" }}>Drag to reorder</div>
        </div>

        {/* Right: editor */}
        {selected ? (
          <div style={{ flex: 1, background: "white", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflow: "hidden" }}>
            <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb" }}>
              {["describe", "scale", "notes"].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{
                  padding: "10px 20px", border: "none", background: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
                  color: activeTab === tab ? "#1d4ed8" : "#6b7280",
                  borderBottom: activeTab === tab ? "2px solid #1d4ed8" : "2px solid transparent",
                }}>{tab === "describe" ? "Describe" : tab === "scale" ? "Scale" : "Notes"}</button>
              ))}
              <div style={{ flex: 1 }} />
              <span style={{ padding: "10px 14px", fontSize: 12, color: "#9ca3af" }}>Variable {selected.number}</span>
            </div>

            <div style={{ padding: 20 }}>
              {activeTab === "describe" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Variable name</label>
                    <input
                      value={selected.name}
                      onChange={(e) => updateSelected({ name: e.target.value })}
                      placeholder="Enter variable name"
                      style={{ width: "100%", padding: "7px 10px", border: "1px solid #d1d5db", borderRadius: 5, fontSize: 14, boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Description</label>
                    <textarea
                      value={selected.description}
                      onChange={(e) => updateSelected({ description: e.target.value })}
                      placeholder="Describe this variable: what it represents, why it matters, how it behaves…"
                      rows={8}
                      style={{ width: "100%", padding: "7px 10px", border: "1px solid #d1d5db", borderRadius: 5, fontSize: 13, boxSizing: "border-box", resize: "vertical", lineHeight: 1.6 }}
                    />
                  </div>
                  <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 6, padding: "10px 14px", fontSize: 12, color: "#166534" }}>
                    <strong>Vester's discipline:</strong> If you cannot describe this variable in a few sentences, it may be two variables.
                  </div>
                </div>
              )}

              {activeTab === "scale" && (
                <div>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{selected.name || "unnamed variable"}</div>
                    {selected.description ? (
                      <div style={{ fontSize: 12, color: "#374151", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 5, padding: "8px 10px", marginBottom: 10, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                        {selected.description}
                      </div>
                    ) : (
                      <div style={{ fontSize: 12, color: "#9ca3af", fontStyle: "italic", marginBottom: 10 }}>No description yet — add one in the Describe tab.</div>
                    )}
                    <div style={{ fontSize: 12, color: "#6b7280" }}>
                      Variables have no fixed values — the scale marks the range of possible states from lowest (0) to highest (30).
                    </div>
                  </div>
                  <ScalePanel scale={selected.scale} onChange={updateScale} />
                </div>
              )}

              {activeTab === "notes" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>
                    Capture observations, open questions, and group discussion points from this step.
                  </div>
                  <textarea
                    value={getNote(notes, "variables")}
                    onChange={(e) => setNotes(prev => setNote(prev, "variables", e.target.value))}
                    placeholder="Notes from group discussion, brainstorming, open questions…"
                    rows={14}
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 13, lineHeight: 1.8, boxSizing: "border-box", resize: "vertical", background: "white" }}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, background: "white", borderRadius: 8, padding: 40, textAlign: "center", color: "#9ca3af" }}>
            Add a variable to begin.
          </div>
        )}
      </div>
    </div>
  );
}
