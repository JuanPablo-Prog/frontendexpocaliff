import { F } from "../api/Tokens";

export default function Modal({ open, title, onClose, children, footer, width = "520px" }) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}
    >
      <div
        className="modal-anim"
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: "20px", width: "100%", maxWidth: width, maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 24px 80px rgba(15,23,42,0.20), 0 4px 16px rgba(79,70,229,0.10)", border: "1px solid rgba(79,70,229,0.10)", position: "relative", overflow: "hidden" }}
      >
        {/* Accent bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, #6366f1, #818cf8, #a78bfa)" }} />

        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(79,70,229,0.10)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, marginTop: "3px" }}>
          <span style={{ fontFamily: F.display, fontSize: "1.2rem", fontWeight: "400", fontStyle: "italic", color: "#1e293b", letterSpacing: "-0.01em" }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "20px", color: "#94a3b8", cursor: "pointer", lineHeight: 1, padding: "2px 6px", borderRadius: "6px", transition: "color .15s" }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#4f46e5"}
            onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
          >×</button>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "14px" }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div style={{ padding: "14px 24px", borderTop: "1px solid rgba(79,70,229,0.08)", display: "flex", justifyContent: "flex-end", gap: "10px", flexShrink: 0, background: "#fafbff" }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
