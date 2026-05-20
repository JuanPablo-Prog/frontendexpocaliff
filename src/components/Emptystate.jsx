import { F } from "../api/Tokens";

export function EmptyState({ icon = "📭", title = "Sin resultados", description = "No hay datos para mostrar." }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 24px", gap: "10px", color: "#94a3b8" }}>
      <span style={{ fontSize: "48px", marginBottom: "4px" }}>{icon}</span>
      <p style={{ fontFamily: F.display, fontWeight: "400", fontStyle: "italic", fontSize: "1.1rem", color: "#475569" }}>{title}</p>
      <p style={{ fontSize: "13px", textAlign: "center", maxWidth: "260px", lineHeight: 1.5 }}>{description}</p>
    </div>
  );
}

export function LoadingSpinner({ text = "Cargando..." }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 24px", gap: "12px", color: "#94a3b8" }}>
      <div style={{ width: "36px", height: "36px", border: "3px solid rgba(79,70,229,0.15)", borderTop: "3px solid #6366f1", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <p style={{ fontSize: "13px", fontWeight: "600" }}>{text}</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export function Badge({ children, color }) {
  const map = {
    admin:   { bg: "#fff1f2",  text: "#be123c" },
    docente: { bg: "#fffbeb",  text: "#b45309" },
    alumno:  { bg: "#eef2ff",  text: "#4338ca" },
    green:   { bg: "#ecfdf5",  text: "#047857" },
    blue:    { bg: "#eef2ff",  text: "#4338ca" },
    amber:   { bg: "#fffbeb",  text: "#b45309" },
    red:     { bg: "#fff1f2",  text: "#be123c" },
    gray:    { bg: "#f1f5f9",  text: "#475569" },
  };
  const c = map[color] || map.gray;
  return (
    <span style={{ background: c.bg, color: c.text, padding: "3px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

export function FormGroup({ label: lbl, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <label style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>{lbl}</label>
      {children}
    </div>
  );
}

const inputBase = {
  padding: "9px 13px", borderRadius: "8px",
  border: "1.5px solid rgba(79,70,229,0.15)",
  fontSize: "14px", fontFamily: "'DM Sans', sans-serif",
  color: "#0f172a", background: "#f8fafc", width: "100%",
  transition: "border-color .2s, box-shadow .2s",
};

export function Inp({ style: s, ...props }) {
  return <input style={{ ...inputBase, ...s }} {...props} />;
}

export function Sel({ style: s, children, ...props }) {
  return <select style={{ ...inputBase, ...s }} {...props}>{children}</select>;
}

export function Txt({ style: s, ...props }) {
  return <textarea style={{ ...inputBase, minHeight: "80px", resize: "vertical", ...s }} {...props} />;
}