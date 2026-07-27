// ── NavBar.jsx ────────────────────────────────────────────────────────────────
const TOOLS = [
  { id: "system",    label: "0  System Description" },
  { id: "variables", label: "1  Variable Set" },
  { id: "criteria",  label: "2  System Criteria" },
  { id: "matrix",    label: "3  Impact Matrix" },
  { id: "roles",     label: "4  System Roles" },
  { id: "scenario",  label: "5  Partial Scenario" },
];

export default function NavBar({ activeTool, onSelect, modelName }) {
  return (
    <div style={{ background: "#1e3a5f", padding: "0 24px", display: "flex", alignItems: "center", gap: 0, borderBottom: "3px solid #84cc16" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 24, padding: "10px 0" }}>
        <div style={{ width: 14, height: 14, background: "#84cc16", borderRadius: 2 }} />
        <span style={{ color: "white", fontWeight: 700, fontSize: 14, fontFamily: "Arial, sans-serif" }}>Vester</span>
      </div>
      {TOOLS.map((tool) => (
        <button
          key={tool.id}
          onClick={() => !tool.stub && onSelect(tool.id)}
          style={{
            padding: "12px 18px", border: "none",
            background: activeTool === tool.id ? "#84cc16" : "transparent",
            color: activeTool === tool.id ? "#1e3a5f" : tool.stub ? "#4a6a8f" : "#cbd5e1",
            fontWeight: activeTool === tool.id ? 700 : 500,
            fontSize: 13, fontFamily: "Arial, sans-serif",
            cursor: tool.stub ? "default" : "pointer",
            borderBottom: activeTool === tool.id ? "3px solid #84cc16" : "3px solid transparent",
            marginBottom: -3, transition: "background 0.15s, color 0.15s",
          }}
          title={tool.stub ? "Coming soon" : tool.label}
        >
          {tool.label}{tool.stub ? " ·" : ""}
        </button>
      ))}
      <div style={{ flex: 1 }} />
      <span style={{ color: "#94a3b8", fontSize: 12, fontFamily: "Arial, sans-serif", padding: "0 8px" }}>
        {modelName || "Untitled model"}
      </span>
    </div>
  );
}
