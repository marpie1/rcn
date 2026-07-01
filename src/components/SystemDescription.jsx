// ── SystemDescription.jsx ─────────────────────────────────────────────────────
import { useState } from "react";
import { getNote, setNote } from "../store.js";

export default function SystemDescription({ systemDescription, setSystemDescription, notes, setNotes }) {
  const [activeTab, setActiveTab] = useState("description");
  const note = getNote(notes, "system");

  return (
    <div style={{ fontFamily: "Arial, sans-serif", display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" }}>
      <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb", background: "white", paddingLeft: 24 }}>
        {[["description", "System Description"], ["notes", "Notes"]].map(([id, label]) => (
          <button key={id} onClick={() => setActiveTab(id)} style={{ padding: "10px 20px", border: "none", background: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: activeTab === id ? "#1d4ed8" : "#6b7280", borderBottom: activeTab === id ? "2px solid #1d4ed8" : "2px solid transparent" }}>{label}</button>
        ))}
      </div>

      {activeTab === "description" && (
        <div style={{ flex: 1, padding: 32, background: "#f8fafc", display: "flex", flexDirection: "column", gap: 16, overflowY: "auto" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#1e3a5f", marginBottom: 8 }}>Step 0 — System Description</div>
            <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.7, maxWidth: 700 }}>
              This step is purely manual: through discussion, brainstorming, notes and records from the group.
              It provides the basis for the establishment of the variable set, and for a preliminary effect system.
              Write a summary of your system description here, capturing the basic information that will guide all subsequent steps.
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>
              System Description
              <span style={{ fontWeight: 400, color: "#9ca3af", marginLeft: 8 }}>What system are you modeling? What problem does it address? Who is involved?</span>
            </label>
            <textarea
              value={systemDescription}
              onChange={(e) => setSystemDescription(e.target.value)}
              placeholder="Describe the system being modeled. Include: the scope, the key actors, the problem or challenge being addressed, and the purpose of this model…"
              style={{ flex: 1, minHeight: 320, padding: "12px 14px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 13, lineHeight: 1.8, boxSizing: "border-box", resize: "vertical", background: "white", color: "#1f2937" }}
            />
          </div>
          <div style={{ fontSize: 11, color: "#9ca3af" }}>
            {systemDescription.length > 0 ? `${systemDescription.length} characters` : "Not yet written"}
          </div>
        </div>
      )}

      {activeTab === "notes" && (
        <div style={{ flex: 1, padding: 32, background: "#f8fafc", display: "flex", flexDirection: "column", gap: 12, overflowY: "auto" }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1e3a5f", marginBottom: 4 }}>Notes — System Description</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Capture observations, open questions, and group discussion points from this step.</div>
          </div>
          <textarea
            value={note}
            onChange={(e) => setNotes(prev => setNote(prev, "system", e.target.value))}
            placeholder="Notes from group discussion, brainstorming, open questions…"
            style={{ flex: 1, minHeight: 400, padding: "12px 14px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 13, lineHeight: 1.8, boxSizing: "border-box", resize: "vertical", background: "white" }}
          />
        </div>
      )}
    </div>
  );
}
