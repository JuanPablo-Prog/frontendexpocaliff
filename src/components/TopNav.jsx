import { F } from "../api/Tokens";
import { getRol } from "../api/Auth";

const NAV_ITEMS = [
  { page: "dashboard",    label: "Dashboard",    icon: "◈",  roles: ["admin", "docente", "alumno"] },
  { page: "usuarios",     label: "Usuarios",     icon: "👤", roles: ["admin"] },
  { page: "materias",     label: "Materias",     icon: "📚", roles: ["admin", "docente"] },
  { page: "criterios",    label: "Criterios",    icon: "📋", roles: ["admin", "docente"] },
  { page: "grupos",       label: "Grupos",       icon: "🏫", roles: ["admin", "docente"] },
  { page: "alumnos",      label: "Alumnos",      icon: "🎓", roles: ["admin", "docente"] },
  { page: "equipos",      label: "Equipos",      icon: "👥", roles: ["admin", "docente"] },
  { page: "exposiciones", label: "Exposiciones", icon: "🎤", roles: ["admin", "docente", "alumno"] },
  { page: "evaluaciones", label: "Evaluaciones", icon: "⭐", roles: ["admin", "docente", "alumno"] },
];

export default function TopNav({ page, setPage, usuario, onLogout }) {
  const rol = getRol();

  return (
    <div style={{
      background: "#0c1628",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 28px",
      height: "68px",
      borderBottom: "1px solid rgba(129,140,248,0.15)",
      flexShrink: 0,
    }}>
      {/* ── Logo + rol ─────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: "24px", flexShrink: 0 }}>
        <div style={{
          fontFamily: F.display, fontSize: "1.6rem", fontWeight: "400",
          fontStyle: "italic", color: "#fff", letterSpacing: "-0.01em", lineHeight: 1,
        }}>
          Expos<span style={{ color: "#818cf8" }}>Calif</span>
          <span style={{
            display: "inline-block", width: "6px", height: "6px",
            background: "#818cf8", borderRadius: "50%", marginLeft: "6px",
            verticalAlign: "middle", marginBottom: "4px",
          }} />
        </div>
        <span style={{
          fontSize: "10px", fontWeight: "600", color: "#818cf8",
          textTransform: "uppercase", letterSpacing: "1.8px",
          background: "rgba(129,140,248,0.12)", borderRadius: "6px",
          padding: "4px 10px",
        }}>
          {rol}
        </span>
      </div>

      {/* ── Navegación ─────────────────────────────── */}
      <nav style={{
        display: "flex", alignItems: "center", gap: "4px",
        flex: 1, justifyContent: "center", margin: "0 24px",
        overflowX: "auto", flexWrap: "nowrap",
      }}>
        {NAV_ITEMS.filter((n) => n.roles.includes(rol)).map((item) => {
          const active = page === item.page;
          return (
            <button
              key={item.page}
              onClick={() => setPage(item.page)}
              style={{
                display: "flex", alignItems: "center", gap: "7px",
                padding: "10px 16px", borderRadius: "10px", border: "none",
                background: active ? "rgba(129,140,248,0.18)" : "transparent",
                color: active ? "#c7d2fe" : "#64748b",
                fontWeight: active ? "600" : "400",
                fontSize: "13px", fontFamily: F.body,
                cursor: "pointer", whiteSpace: "nowrap",
                transition: "all 0.15s",
                borderBottom: active ? "3px solid #818cf8" : "3px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "#162033";
                  e.currentTarget.style.color = "#94a3b8";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#64748b";
                }
              }}
            >
              <span style={{ fontSize: "15px", flexShrink: 0 }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* ── Usuario + cerrar sesión ────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: "18px", flexShrink: 0 }}>
        <button
          onClick={() => setPage("perfil")}
          style={{
            background: "transparent", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: "10px",
            color: "#e2e8f0", fontSize: "13px", fontFamily: F.body, fontWeight: "500",
            transition: "color 0.15s",
            padding: "4px 8px", borderRadius: "8px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#162033";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#e2e8f0";
          }}
        >
          <div style={{
            width: "34px", height: "34px", borderRadius: "50%",
            background: "linear-gradient(135deg, #c7d2fe, #818cf8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: F.display, fontStyle: "italic", fontSize: "14px",
            color: "#312e81", fontWeight: "bold",
            boxShadow: "0 2px 8px rgba(99,102,241,0.3)",
          }}>
            {usuario?.nombre?.[0]}{usuario?.apellido?.[0]}
          </div>
          <span style={{ maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {usuario?.nombre} {usuario?.apellido}
          </span>
        </button>

        <button
          onClick={onLogout}
          style={{
            background: "transparent", border: "none", cursor: "pointer",
            color: "#64748b", fontSize: "13px", fontFamily: F.body,
            display: "flex", alignItems: "center", gap: "6px",
            padding: "6px 10px", borderRadius: "8px",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#1e1030";
            e.currentTarget.style.color = "#f87171";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#64748b";
          }}
        >
          <span style={{ fontSize: "16px" }}>⎋</span>
          <span style={{ fontWeight: "500" }}>Salir</span>
        </button>
      </div>
    </div>
  );
}