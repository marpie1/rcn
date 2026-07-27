// ── App.jsx ───────────────────────────────────────────────────────────────────
import { useState, useEffect, useRef } from "react";
import {
  makeId, emptyStore, loadFromStorage, saveToStorage,
  exportJSON, importJSON, buildCypher,
} from "./store.js";
import NavBar from "./components/NavBar.jsx";
import SystemDescription from "./components/SystemDescription.jsx";
import VariableSet from "./components/VariableSet.jsx";
import SystemCriteria from "./components/SystemCriteria.jsx";
import ImpactMatrix from "./components/ImpactMatrix.jsx";
import SystemRoles from "./components/SystemRoles.jsx";
import PartialScenario from "./components/PartialScenario.jsx";

export default function App() {
  const [modelName,            setModelName]            = useState(() => loadFromStorage()?.modelName            ?? emptyStore().modelName);
  const [modelPurpose,         setModelPurpose]         = useState(() => loadFromStorage()?.modelPurpose         ?? "");
  const [systemDescription,    setSystemDescription]    = useState(() => loadFromStorage()?.systemDescription    ?? "");
  const [variables,            setVariables]            = useState(() => loadFromStorage()?.variables            ?? emptyStore().variables);
  const [criteria,             setCriteria]             = useState(() => loadFromStorage()?.criteria             ?? {});
  const [criteriaDefinitions,  setCriteriaDefinitions]  = useState(() => loadFromStorage()?.criteriaDefinitions  ?? {});
  const [criteriaLabels,       setCriteriaLabels]       = useState(() => loadFromStorage()?.criteriaLabels       ?? {});
  const [notes,                setNotes]                = useState(() => loadFromStorage()?.notes                ?? {});
  const [matrix,               setMatrix]               = useState(() => loadFromStorage()?.matrix               ?? {});
  const [transferCurves,       setTransferCurves]       = useState(() => loadFromStorage()?.transferCurves       ?? {});
  const [activeTool,           setActiveTool]           = useState("system");
  const [lastSaved,            setLastSaved]            = useState(() => loadFromStorage()?.savedAt ?? null);
  const [importError,          setImportError]          = useState(false);
  const [showCypher,           setShowCypher]           = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const state = { modelName, modelPurpose, systemDescription, variables, criteria, criteriaDefinitions, criteriaLabels, notes, matrix, transferCurves, savedAt: new Date().toISOString() };
    saveToStorage(state);
    setLastSaved(state.savedAt);
  }, [modelName, modelPurpose, systemDescription, variables, criteria, criteriaDefinitions, criteriaLabels, notes, matrix, transferCurves]);

  const handleSave = () => exportJSON({ modelName, modelPurpose, systemDescription, variables, criteria, criteriaDefinitions, criteriaLabels, notes, matrix, transferCurves });

  const handleLoad = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImportError(false);
    importJSON(
      file,
      (data) => {
        setModelName(data.modelName ?? "");
        setModelPurpose(data.modelPurpose ?? "");
        setSystemDescription(data.systemDescription ?? "");
        setVariables(data.variables ?? []);
        setCriteria(data.criteria ?? {});
        setCriteriaDefinitions(data.criteriaDefinitions ?? {});
        setCriteriaLabels(data.criteriaLabels ?? {});
        setNotes(data.notes ?? {});
        setMatrix(data.matrix ?? {});
        setTransferCurves(data.transferCurves ?? {});
        setLastSaved(data.savedAt ?? null);
      },
      () => setImportError(true)
    );
    e.target.value = "";
  };

  const cypher = buildCypher({ modelName, modelPurpose, variables, criteria, criteriaDefinitions, criteriaLabels });

  return (
    <div style={{ fontFamily: "Arial, sans-serif", background: "#f3f4f6", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <NavBar activeTool={activeTool} onSelect={setActiveTool} modelName={modelName} />
      <div style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "10px 24px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <input value={modelName} onChange={(e) => setModelName(e.target.value)} placeholder="Model name"
          style={{ fontWeight: 700, fontSize: 15, padding: "4px 10px", border: "1px solid #e5e7eb", borderRadius: 5, minWidth: 180 }} />
        <input value={modelPurpose} onChange={(e) => setModelPurpose(e.target.value)} placeholder="Model purpose / problem being addressed"
          style={{ flex: 1, minWidth: 220, fontSize: 13, padding: "4px 10px", border: "1px solid #e5e7eb", borderRadius: 5 }} />
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={handleSave} style={{ padding: "5px 14px", background: "#166534", color: "white", border: "none", borderRadius: 5, fontSize: 13, cursor: "pointer", fontWeight: 600 }}>↓ Save</button>
          <button onClick={() => fileInputRef.current.click()} style={{ padding: "5px 14px", background: "#e5e7eb", color: "#374151", border: "none", borderRadius: 5, fontSize: 13, cursor: "pointer", fontWeight: 600 }}>↑ Load</button>
          <input ref={fileInputRef} type="file" accept=".json" onChange={handleLoad} style={{ display: "none" }} />
          <button onClick={() => setShowCypher(!showCypher)} style={{ padding: "5px 14px", background: showCypher ? "#1d4ed8" : "#e5e7eb", color: showCypher ? "white" : "#374151", border: "none", borderRadius: 5, fontSize: 13, cursor: "pointer", fontWeight: 600 }}>Cypher</button>
          {lastSaved && <span style={{ fontSize: 11, color: "#9ca3af" }}>Saved {new Date(lastSaved).toLocaleTimeString()}</span>}
        </div>
      </div>
      {importError && (
        <div style={{ background: "#fca5a5", borderBottom: "1px solid #f87171", padding: "8px 24px", fontSize: 13, color: "#7f1d1d" }}>
          Could not load that file — make sure it is a JSON file saved from this tool.
        </div>
      )}
      {showCypher && (
        <div style={{ background: "#1e1e2e", padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ color: "#a78bfa", fontSize: 13, fontWeight: 600 }}>Neo4j Cypher — paste into Neo4j Browser</span>
            <button onClick={() => navigator.clipboard.writeText(cypher)} style={{ padding: "4px 12px", background: "#7c3aed", color: "white", border: "none", borderRadius: 4, fontSize: 12, cursor: "pointer" }}>Copy</button>
          </div>
          <pre style={{ color: "#e2e8f0", fontSize: 11, overflowX: "auto", margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.5, maxHeight: 300 }}>{cypher}</pre>
        </div>
      )}
      <div style={{ flex: 1, overflow: "auto" }}>
        {activeTool === "system" && (
          <SystemDescription
            systemDescription={systemDescription}
            setSystemDescription={setSystemDescription}
            notes={notes}
            setNotes={setNotes}
          />
        )}
        {activeTool === "variables" && (
          <VariableSet
            variables={variables}
            setVariables={setVariables}
            makeId={makeId}
            notes={notes}
            setNotes={setNotes}
          />
        )}
        {activeTool === "criteria" && (
          <SystemCriteria
            variables={variables} setVariables={setVariables}
            criteria={criteria} setCriteria={setCriteria}
            criteriaDefinitions={criteriaDefinitions} setCriteriaDefinitions={setCriteriaDefinitions}
            criteriaLabels={criteriaLabels} setCriteriaLabels={setCriteriaLabels}
            notes={notes} setNotes={setNotes}
          />
        )}
        {activeTool === "matrix" && (
          <ImpactMatrix
            variables={variables}
            matrix={matrix}
            setMatrix={setMatrix}
            modelName={modelName}
            notes={notes}
            setNotes={setNotes}
          />
        )}
        {activeTool === "roles" && (
          <SystemRoles
            variables={variables}
            matrix={matrix}
            onNavigate={setActiveTool}
            notes={notes}
            setNotes={setNotes}
          />
        )}
        {activeTool === "scenario" && (
          <PartialScenario
            variables={variables}
            matrix={matrix}
            transferCurves={transferCurves}
            setTransferCurves={setTransferCurves}
            notes={notes}
            setNotes={setNotes}
          />
        )}
      </div>
      <div style={{ padding: "6px 24px", fontSize: 11, color: "#9ca3af", textAlign: "right", background: "white", borderTop: "1px solid #f3f4f6" }}>
        CC BY-SA 4.0 · vester.relocalizecreativity.net
      </div>
    </div>
  );
}
