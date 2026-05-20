import { C, F } from "../api/Tokens";
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

export default function Sidebar({ page, setPage, usuario, onLogout }) {
  const rol = getRol();

  return (
    <div style={{ width: "240px", minWidth: "240px", background: C.sidebar, display: "flex", flexDirection: "column" }}>
      {/* Brand */}
      <div style={{ padding: "26px 22px 20px", borderBottom: "1px solid #1a2840" }}>
        <div style={{
          fontFamily: F.display, fontSize: "1.6rem", fontWeight: "400",
          fontStyle: "italic", color: "#fff", letterSpacing: "-0.01em", lineHeight: 1,
        }}>
          Expos<span style={{ color: "#818cf8" }}>Calif</span>
          <span style={{
            display: "inline-block", width: "5px", height: "5px",
            background: "#818cf8", borderRadius: "50%", marginLeft: "4px",
            verticalAlign: "middle", marginBottom: "4px",
          }} />
        </div>
        <div style={{
          fontSize: "10px", fontWeight: "600", color: "#818cf8",
          textTransform: "uppercase", letterSpacing: "1.5px", marginTop: "5px",
        }}>
          {rol}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: "2px" }}>
        {NAV_ITEMS.filter((n) => n.roles.includes(rol)).map((item) => {
          const active = page === item.page;
          return (
            <button
              key={item.page}
              onClick={() => setPage(item.page)}
              style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "9px 13px", borderRadius: "10px", border: "none",
                background: active ? "rgba(129,140,248,0.18)" : "transparent",
                color: active ? "#c7d2fe" : "#64748b",
                fontWeight: active ? "600" : "400",
                fontSize: "13.5px", fontFamily: F.body,
                cursor: "pointer", width: "100%", textAlign: "left",
                transition: "all 0.15s",
                borderLeft: active ? "3px solid #818cf8" : "3px solid transparent",
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
              <span style={{ fontSize: "15px", flexShrink: 0, width: "20px", textAlign: "center" }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User + Perfil + Logout */}
      <div style={{ padding: "12px 10px", borderTop: "1px solid #1a2840" }}>
        {/* User info card */}
        <div style={{ padding: "10px 13px", borderRadius: "10px", background: "#162033", marginBottom: "6px" }}>
          <p style={{ fontSize: "13px", fontWeight: "600", color: "#e2e8f0", marginBottom: "2px" }}>
            {usuario?.nombre} {usuario?.apellido}
          </p>
          <p style={{ fontSize: "11px", color: "#475569", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {usuario?.email}
          </p>
        </div>

        {/* Perfil button – functionality from repo, style from local */}
        <button
          onClick={() => setPage("perfil")}
          style={{
            width: "100%", padding: "9px 13px", borderRadius: "10px",
            border: "none", background: "transparent", color: "#64748b",
            fontSize: "13px", fontWeight: "500", fontFamily: F.body,
            cursor: "pointer", textAlign: "left", display: "flex",
            alignItems: "center", gap: "8px", transition: "all 0.15s",
            marginBottom: "4px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#162033";
            e.currentTarget.style.color = "#a5b4fc"; // indigo claro
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#64748b";
          }}
        >
          <span>👤</span> Ver mi perfil
        </button>

        {/* Logout button */}
        <button
          onClick={onLogout}
          style={{
            width: "100%", padding: "9px 13px", borderRadius: "10px",
            border: "none", background: "transparent", color: "#64748b",
            fontSize: "13px", fontWeight: "500", fontFamily: F.body,
            cursor: "pointer", textAlign: "left", display: "flex",
            alignItems: "center", gap: "8px", transition: "all 0.15s",
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
          <span>⎋</span> Cerrar sesión
        </button>
      </div>
    </div>
  );
}