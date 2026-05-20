import { F, btn } from "../api/Tokens";

export default function ConfirmDialog({ open, message = "¿Estás seguro de eliminar este registro?", onConfirm, onCancel, loading }) {
  if (!open) return null;
  return (
    <div onClick={onCancel} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100, padding: "20px" }}>
      <div className="modal-anim" onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: "18px", width: "100%", maxWidth: "400px", padding: "28px", boxShadow: "0 20px 60px rgba(15,23,42,0.18)", border: "1px solid rgba(79,70,229,0.10)", position: "relative", overflow: "hidden" }}>
        {/* accent bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, #e11d48, #f43f5e)" }} />

        <div style={{ display: "flex", gap: "14px", marginBottom: "22px", marginTop: "6px" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "#fff1f2", border: "1px solid #fda4af", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>⚠️</div>
          <div>
            <p style={{ fontFamily: F.display, fontWeight: "400", fontStyle: "italic", fontSize: "1.1rem", color: "#0f172a", marginBottom: "6px" }}>Confirmar eliminación</p>
            <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.5 }}>{message}</p>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button onClick={onCancel} style={btn("ghost")} disabled={loading}>Cancelar</button>
          <button onClick={onConfirm} style={btn("danger")} disabled={loading}>{loading ? "Eliminando..." : "Sí, eliminar"}</button>
        </div>
      </div>
    </div>
  );
}
