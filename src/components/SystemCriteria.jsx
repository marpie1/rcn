// ── SystemCriteria.jsx ────────────────────────────────────────────────────────
import { useState, useRef } from "react";
import {
  CRITERIA_GROUPS, ASSESSMENT,
  getAssessment, setAssessment,
  getCriterionDefinition, setCriterionDefinition,
  getCriterionLabel, setCriterionLabel,
  getNote, setNote,
} from "../store.js";

const STATES = [null, "applies", "partial", "excluded"];
const ALL_CRITERIA = CRITERIA_GROUPS.flatMap((g) => g.criteria);

function nextState(current) {
  const idx = STATES.indexOf(current);
  return STATES[(idx + 1) % STATES.length];
}

function Tooltip({ text, children }) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const ref = useRef(null);
  if (!text) return <>{children}</>;
  return (
    <span ref={ref} style={{ position: "relative", display: "inline-block", cursor: "default" }}
      onMouseEnter={(e) => { const r = e.currentTarget.getBoundingClientRect(); setPos({ x: r.left, y: r.bottom + 6 }); setVisible(true); }}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div style={{ position: "fixed", left: Math.min(pos.x, window.innerWidth - 280), top: pos.y, zIndex: 2000, background: "#1e3a5f", color: "white", padding: "8px 12px", borderRadius: 6, fontSize: 12, lineHeight: 1.5, maxWidth: 260, boxShadow: "0 4px 16px rgba(0,0,0,0.25)", pointerEvents: "none", whiteSpace: "pre-wrap" }}>
          {text}
        </div>
      )}
    </span>
  );
}

function AssessBtn({ value, onClick }) {
  const a = value ? ASSESSMENT[value] : null;
  return (
    <button onClick={onClick} style={{ width: 32, height: 32, border: `2px solid ${a ? a.color : "#d1d5db"}`, borderRadius: 6, background: a ? `${a.color}18` : "#f9fafb", color: a ? a.color : "#9ca3af", fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.1s", flexShrink: 0 }}>
      {a ? a.symbol : "·"}
    </button>
  );
}

function AssignmentPane({ variable, criteria, setCriteria, criteriaDefinitions, criteriaLabels }) {
  if (!variable) return <div style={{ padding: 24, color: "#9ca3af", fontStyle: "italic" }}>Select a variable to assign criteria.</div>;
  const completedCount = ALL_CRITERIA.filter(c => getAssessment(criteria, variable.id, c.key) !== null).length;
  return (
    <div style={{ padding: "16px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14, flexWrap: "wrap" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#1f2937" }}>
          Assignment of criteria for: <span style={{ color: "#1d4ed8" }}>{variable.name || "unnamed variable"}</span>
        </div>
        <div style={{ fontSize: 12, color: "#6b7280" }}>{completedCount} / {ALL_CRITERIA.length} assigned</div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
          {Object.entries(ASSESSMENT).map(([key, a]) => (
            <span key={key} style={{ fontSize: 12, color: a.color, fontWeight: 600 }}>{a.symbol} {a.label}</span>
          ))}
          <span style={{ fontSize: 12, color: "#9ca3af" }}>· Unassigned</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {CRITERIA_GROUPS.map((group) => (
          <div key={group.id} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden", flex: "1 1 160px", minWidth: 150 }}>
            <div style={{ background: "#1e3a5f", color: "white", padding: "6px 12px", fontSize: 12, fontWeight: 700 }}>{group.label}</div>
            {group.criteria.map((c) => {
              const val = getAssessment(criteria, variable.id, c.key);
              const def = getCriterionDefinition(criteriaDefinitions, c.key);
              const label = getCriterionLabel(criteriaLabels, c.key);
              return (
                <div key={c.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px", borderBottom: "1px solid #f3f4f6", background: val ? `${ASSESSMENT[val].color}08` : "white" }}>
                  <Tooltip text={def}>
                    <span style={{ fontSize: 12, color: "#374151", flex: 1, marginRight: 8, borderBottom: def ? "1px dotted #9ca3af" : "none" }}>{label}</span>
                  </Tooltip>
                  <AssessBtn value={val} onClick={() => setCriteria(prev => setAssessment(prev, variable.id, c.key, nextState(getAssessment(prev, variable.id, c.key))))} />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function CellPopover({ variable, criterion, criteriaLabels, currentValue, onSelect, onClose }) {
  const label = getCriterionLabel(criteriaLabels, criterion.key);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.25)" }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.18)", padding: 20, minWidth: 280, maxWidth: 340 }}>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 2 }}>Assigning criterion</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1e3a5f" }}>{label}</div>
          <div style={{ fontSize: 12, color: "#374151", marginTop: 2 }}>for variable: <span style={{ fontWeight: 600 }}>{variable.name || "unnamed"}</span></div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { value: "applies",  symbol: "●", color: "#1d4ed8", label: "Applies",        desc: "This criterion fully applies to the variable" },
            { value: "partial",  symbol: "○", color: "#f59e0b", label: "Partially",      desc: "This criterion partially applies to the variable" },
            { value: "excluded", symbol: "✕", color: "#dc2626", label: "Does not apply", desc: "This criterion does not apply to the variable" },
            { value: null,       symbol: "·", color: "#9ca3af", label: "Unassigned",     desc: "Clear this assignment" },
          ].map(({ value, symbol, color, label: cl, desc }) => (
            <button key={String(value)} onClick={() => { onSelect(value); onClose(); }}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", border: "2px solid", borderColor: currentValue === value ? color : "#e5e7eb", borderRadius: 7, background: currentValue === value ? `${color}10` : "white", cursor: "pointer", textAlign: "left" }}>
              <span style={{ fontSize: 20, color, width: 24, textAlign: "center", flexShrink: 0 }}>{symbol}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color }}>{cl}</div>
                <div style={{ fontSize: 11, color: "#6b7280" }}>{desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function VariableEditPopover({ variable, onSave, onClose }) {
  const [name, setName] = useState(variable.name);
  const [description, setDescription] = useState(variable.description);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.25)" }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.18)", padding: 20, minWidth: 320, maxWidth: 420 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#1e3a5f", marginBottom: 14 }}>Edit Variable {variable.number}</div>
        <div style={{ marginBottom: 10 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Name</label>
          <input autoFocus value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", padding: "6px 10px", border: "1px solid #d1d5db", borderRadius: 5, fontSize: 13, boxSizing: "border-box" }} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} style={{ width: "100%", padding: "6px 10px", border: "1px solid #d1d5db", borderRadius: 5, fontSize: 12, boxSizing: "border-box", resize: "vertical", lineHeight: 1.5 }} />
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "6px 16px", background: "#e5e7eb", border: "none", borderRadius: 5, fontSize: 13, cursor: "pointer" }}>Cancel</button>
          <button onClick={() => { onSave(name, description); onClose(); }} style={{ padding: "6px 16px", background: "#1d4ed8", color: "white", border: "none", borderRadius: 5, fontSize: 13, cursor: "pointer", fontWeight: 600 }}>Save</button>
        </div>
      </div>
    </div>
  );
}

function MatrixView({ variables, setVariables, criteria, setCriteria, criteriaDefinitions, criteriaLabels }) {
  const [popover, setPopover] = useState(null);
  const [varEdit, setVarEdit] = useState(null);
  const handleSelect = (value) => {
    if (!popover) return;
    setCriteria(prev => setAssessment(prev, popover.variableId, popover.criterionKey, value));
  };
  const popVariable = popover ? variables.find(v => v.id === popover.variableId) : null;
  const popCriterion = popover ? ALL_CRITERIA.find(c => c.key === popover.criterionKey) : null;
  const popValue = popover ? getAssessment(criteria, popover.variableId, popover.criterionKey) : null;
  const varEditVariable = varEdit ? variables.find(v => v.id === varEdit) : null;
  const handleVarSave = (id, name, description) => {
    setVariables(prev => prev.map(v => v.id === id ? { ...v, name, description } : v));
  };
  return (
    <div style={{ padding: 20, overflowX: "auto" }}>
      {popover && popVariable && popCriterion && (
        <CellPopover variable={popVariable} criterion={popCriterion} criteriaLabels={criteriaLabels} currentValue={popValue} onSelect={handleSelect} onClose={() => setPopover(null)} />
      )}
      {varEdit && varEditVariable && (
        <VariableEditPopover variable={varEditVariable} onSave={(name, desc) => handleVarSave(varEdit, name, desc)} onClose={() => setVarEdit(null)} />
      )}
      <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 12 }}>Click a cell to assign. Click a variable name to edit. Hover criterion headers for definitions.</div>
      <table style={{ borderCollapse: "collapse", fontSize: 11, fontFamily: "Arial, sans-serif" }}>
        <thead>
          <tr>
            <th style={{ width: 160, minWidth: 160, padding: "4px 8px", textAlign: "left", background: "#1e3a5f", color: "white", borderRight: "2px solid white" }}>Variable</th>
            {CRITERIA_GROUPS.map((g) => (
              <th key={g.id} colSpan={g.criteria.length} style={{ padding: "4px 8px", textAlign: "center", background: "#2d5a8e", color: "white", borderRight: "2px solid white", fontSize: 11 }}>{g.label}</th>
            ))}
          </tr>
          <tr>
            <th style={{ padding: "4px 8px", background: "#374151", color: "#d1d5db", textAlign: "left", borderRight: "2px solid white" }}></th>
            {ALL_CRITERIA.map((c) => {
              const def = getCriterionDefinition(criteriaDefinitions, c.key);
              const label = getCriterionLabel(criteriaLabels, c.key);
              return (
                <th key={c.key} style={{ padding: "2px 4px", background: "#4b5563", color: "#e5e7eb", writingMode: "vertical-rl", textOrientation: "mixed", transform: "rotate(180deg)", height: 90, verticalAlign: "bottom", textAlign: "left", fontSize: 10, fontWeight: 500, borderRight: "1px solid #6b7280" }}>
                  <Tooltip text={def}><span style={{ borderBottom: def ? "1px dotted #9ca3af" : "none" }}>{label}</span></Tooltip>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {variables.map((v, rowIdx) => (
            <tr key={v.id} style={{ background: rowIdx % 2 === 0 ? "white" : "#f9fafb" }}>
              <td style={{ padding: "4px 8px", borderRight: "2px solid #e5e7eb", borderBottom: "1px solid #f3f4f6", maxWidth: 160 }}>
                <Tooltip text={v.description}>
                  <span onClick={() => setVarEdit(v.id)} style={{ fontWeight: 600, color: "#1f2937", fontSize: 11, cursor: "pointer", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", borderBottom: "1px dotted #9ca3af" }}>
                    <span style={{ color: "#9ca3af", marginRight: 4 }}>{v.number}</span>
                    {v.name || <span style={{ color: "#9ca3af", fontStyle: "italic" }}>unnamed</span>}
                  </span>
                </Tooltip>
              </td>
              {ALL_CRITERIA.map((c) => {
                const val = getAssessment(criteria, v.id, c.key);
                const a = val ? ASSESSMENT[val] : null;
                const isOpen = popover?.variableId === v.id && popover?.criterionKey === c.key;
                return (
                  <td key={c.key} onClick={() => setPopover({ variableId: v.id, criterionKey: c.key })}
                    style={{ textAlign: "center", padding: "4px 2px", borderRight: "1px solid #f3f4f6", borderBottom: "1px solid #f3f4f6", background: isOpen ? "#dbeafe" : a ? `${a.color}14` : "transparent", cursor: "pointer", fontSize: 14, color: a ? a.color : "#d1d5db", userSelect: "none", outline: isOpen ? "2px solid #1d4ed8" : "none" }}>
                    {a ? a.symbol : "·"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DefinitionsEditor({ criteriaDefinitions, setCriteriaDefinitions, criteriaLabels, setCriteriaLabels }) {
  const [selected, setSelected] = useState(ALL_CRITERIA[0].key);
  const selectedCriterion = ALL_CRITERIA.find(c => c.key === selected);
  const def = getCriterionDefinition(criteriaDefinitions, selected);
  const label = getCriterionLabel(criteriaLabels, selected);
  const definedCount = ALL_CRITERIA.filter(c => getCriterionDefinition(criteriaDefinitions, c.key)).length;
  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      <div style={{ width: 240, borderRight: "1px solid #e5e7eb", background: "white", overflowY: "auto", flexShrink: 0 }}>
        {CRITERIA_GROUPS.map((group) => (
          <div key={group.id}>
            <div style={{ padding: "8px 12px", background: "#f1f5f9", fontSize: 11, fontWeight: 700, color: "#475569", borderBottom: "1px solid #e5e7eb", letterSpacing: "0.04em", textTransform: "uppercase" }}>{group.label}</div>
            {group.criteria.map((c) => {
              const hasDef = !!getCriterionDefinition(criteriaDefinitions, c.key);
              const displayLabel = getCriterionLabel(criteriaLabels, c.key);
              return (
                <div key={c.key} onClick={() => setSelected(c.key)}
                  style={{ padding: "8px 14px", cursor: "pointer", fontSize: 13, background: selected === c.key ? "#eff6ff" : "white", borderLeft: selected === c.key ? "3px solid #1d4ed8" : "3px solid transparent", borderBottom: "1px solid #f3f4f6", color: "#374151", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                  <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayLabel}</span>
                  {hasDef && <span style={{ fontSize: 10, color: "#16a34a", fontWeight: 700, flexShrink: 0 }}>✓</span>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div style={{ flex: 1, padding: 24, background: "#f8fafc", display: "flex", flexDirection: "column", gap: 16, overflowY: "auto" }}>
        <div style={{ fontSize: 11, color: "#6b7280" }}>Edit the label and definition for this criterion. Changes appear immediately in all views.</div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>
            Label <span style={{ fontWeight: 400, color: "#9ca3af", marginLeft: 8 }}>(default: {selectedCriterion?.label})</span>
          </label>
          <input value={label} onChange={(e) => setCriteriaLabels(prev => setCriterionLabel(prev, selected, e.target.value))} placeholder={selectedCriterion?.label}
            style={{ width: "100%", padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 14, fontWeight: 600, boxSizing: "border-box", background: "white" }} />
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>
            Definition <span style={{ fontWeight: 400, color: "#9ca3af", marginLeft: 8 }}>(shown as tooltip on hover)</span>
          </label>
          <textarea value={def} onChange={(e) => setCriteriaDefinitions(prev => setCriterionDefinition(prev, selected, e.target.value))} placeholder="Write a plain-language definition…"
            style={{ flex: 1, minHeight: 140, padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 13, lineHeight: 1.6, boxSizing: "border-box", resize: "vertical", background: "white" }} />
        </div>
        <div style={{ fontSize: 11, color: "#9ca3af" }}>{definedCount} of {ALL_CRITERIA.length} criteria have definitions</div>
      </div>
    </div>
  );
}

export default function SystemCriteria({ variables, setVariables, criteria, setCriteria, criteriaDefinitions, setCriteriaDefinitions, criteriaLabels, setCriteriaLabels, notes, setNotes }) {
  const [selectedId, setSelectedId] = useState(() => variables[0]?.id ?? null);
  const [activeTab, setActiveTab] = useState("assign");
  const selected = variables.find((v) => v.id === selectedId);
  const updateDescription = (desc) => {
    setVariables(prev => prev.map((v) => v.id === selectedId ? { ...v, description: desc } : v));
  };
  return (
    <div style={{ fontFamily: "Arial, sans-serif", display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" }}>
      <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb", background: "white", paddingLeft: 24 }}>
        {[["assign", "Assign Criteria"], ["matrix", "Matrix View"], ["definitions", "Criteria Definitions"]].map(([id, label]) => (
          <button key={id} onClick={() => setActiveTab(id)} style={{ padding: "10px 20px", border: "none", background: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: activeTab === id ? "#1d4ed8" : "#6b7280", borderBottom: activeTab === id ? "2px solid #1d4ed8" : "2px solid transparent" }}>{label}</button>
        ))}
      </div>
      {activeTab === "assign" && (
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <div style={{ width: 220, borderRight: "1px solid #e5e7eb", background: "white", display: "flex", flexDirection: "column", flexShrink: 0 }}>
            <div style={{ padding: "10px 14px", background: "#f9fafb", borderBottom: "1px solid #e5e7eb", fontSize: 12, fontWeight: 700, color: "#374151" }}>Variables</div>
            <div style={{ flex: 1, overflowY: "auto" }}>
              {variables.map((v) => {
                const assigned = ALL_CRITERIA.filter(c => getAssessment(criteria, v.id, c.key) !== null).length;
                const complete = assigned === ALL_CRITERIA.length;
                return (
                  <div key={v.id} onClick={() => setSelectedId(v.id)}
                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: v.id === selectedId ? "#eff6ff" : "white", borderLeft: v.id === selectedId ? "3px solid #1d4ed8" : "3px solid transparent", borderBottom: "1px solid #f3f4f6", cursor: "pointer" }}>
                    <span style={{ fontSize: 11, color: "#9ca3af", minWidth: 18, textAlign: "right" }}>{v.number}</span>
                    <span style={{ fontSize: 12, flex: 1, color: v.name ? "#1f2937" : "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.name || "unnamed"}</span>
                    <span style={{ fontSize: 10, color: complete ? "#16a34a" : assigned > 0 ? "#d97706" : "#d1d5db" }}>{complete ? "✓" : assigned > 0 ? "…" : "○"}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto", background: "#f8fafc" }}>
            {selected && (
              <div style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "12px 20px" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 4 }}>{selected.number}. {selected.name || <span style={{ color: "#9ca3af" }}>unnamed variable</span>}</div>
                <textarea value={selected.description} onChange={(e) => updateDescription(e.target.value)} placeholder="Variable description…" rows={3}
                  style={{ width: "100%", padding: "6px 10px", border: "1px solid #e5e7eb", borderRadius: 5, fontSize: 12, boxSizing: "border-box", resize: "vertical", lineHeight: 1.5, color: "#374151", background: "#fafafa" }} />
              </div>
            )}
            <div style={{ flex: 1 }}>
              <AssignmentPane variable={selected} criteria={criteria} setCriteria={setCriteria} criteriaDefinitions={criteriaDefinitions} criteriaLabels={criteriaLabels} />
            </div>
          </div>
        </div>
      )}
      {activeTab === "matrix" && (
        <div style={{ flex: 1, overflow: "auto", background: "#f8fafc" }}>
          <MatrixView variables={variables} setVariables={setVariables} criteria={criteria} setCriteria={setCriteria} criteriaDefinitions={criteriaDefinitions} criteriaLabels={criteriaLabels} />
        </div>
      )}
      {activeTab === "definitions" && (
        <div style={{ flex: 1, overflow: "hidden", display: "flex" }}>
          <DefinitionsEditor criteriaDefinitions={criteriaDefinitions} setCriteriaDefinitions={setCriteriaDefinitions} criteriaLabels={criteriaLabels} setCriteriaLabels={setCriteriaLabels} />
        </div>
      )}

      {activeTab === "notes" && (
        <div style={{ flex: 1, padding: 32, background: "#f8fafc", display: "flex", flexDirection: "column", gap: 12, overflowY: "auto" }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1e3a5f", marginBottom: 4 }}>Notes — System Criteria</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Capture observations, open questions, and group discussion points from this step.</div>
          </div>
          <textarea
            value={getNote(notes, "criteria")}
            onChange={(e) => setNotes(prev => setNote(prev, "criteria", e.target.value))}
            placeholder="Notes from group discussion, brainstorming, open questions…"
            style={{ flex: 1, minHeight: 400, padding: "12px 14px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 13, lineHeight: 1.8, boxSizing: "border-box", resize: "vertical", background: "white" }}
          />
        </div>
      )}
    </div>
  );
}
