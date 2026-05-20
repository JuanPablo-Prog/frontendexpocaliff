import { F } from "../api/Tokens";

const config = {
  success: { bg: "#ecfdf5", border: "#6ee7b7", text: "#065f46", dot: "#059669", icon: "✓" },
  error:   { bg: "#fff1f2", border: "#fda4af", text: "#9f1239", dot: "#e11d48", icon: "✕" },
  info:    { bg: "#eef2ff", border: "#c7d2fe", text: "#3730a3", dot: "#6366f1", icon: "i" },
};

export default function ToastContainer({ toasts, dismiss }) {
  return (
    <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 9999, display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>
      {toasts.map((t) => {
        const c = config[t.type] || config.info;
        return (
          <div
            key={t.id}
            className="toast-anim"
            onClick={() => dismiss(t.id)}
            style={{
              background: c.bg, border: `1px solid ${c.border}`, color: c.text,
              padding: "11px 18px", borderRadius: "12px",
              fontSize: "13px", fontWeight: "600", fontFamily: F.body,
              boxShadow: "0 4px 20px rgba(15,23,42,0.12), 0 1px 4px rgba(79,70,229,0.08)",
              maxWidth: "320px", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "10px",
            }}
          >
            <span style={{ width: "20px", height: "20px", borderRadius: "50%", background: c.dot, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "11px", flexShrink: 0 }}>
              {c.icon}
            </span>
            {t.message}
          </div>
        );
      })}
    </div>
  );
}
