import { getRol } from "../api/Auth";

const NAV_ITEMS = [
  { page: "dashboard",    label: "Inicio" },
  { page: "usuarios",     label: "Usuarios",   roles: ["admin"] },
  { page: "materias",     label: "Materias",   roles: ["admin", "docente"] },
  { page: "criterios",    label: "Criterios",  roles: ["admin", "docente"] },
  { page: "grupos",       label: "Grupos",     roles: ["admin", "docente"] },
  { page: "alumnos",      label: "Alumnos",    roles: ["admin", "docente"] },
  { page: "equipos",      label: "Equipos",    roles: ["admin", "docente"] },
  { page: "exposiciones", label: "Exposiciones", roles: ["admin", "docente", "alumno"] },
  { page: "evaluaciones", label: "Evaluaciones", roles: ["admin", "docente", "alumno"] },
];

export default function TopNav({ page, setPage, usuario, onLogout }) {
  const rol = getRol();
  const itemsFiltrados = NAV_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(rol)
  );

  return (
    <div style={{
      background: "#1e3a8a",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
      height: "64px",
      flexShrink: 0,
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      color: "#ffffff",
    }}>
      {/* ── Logo ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <span style={{
          fontWeight: "700",
          fontSize: "1.25rem",
          letterSpacing: "-0.3px",
        }}>
          Expos<span style={{ color: "#93c5fd" }}>Calif</span>
        </span>
        <span style={{
          fontSize: "11px",
          fontWeight: "600",
          color: "#bfdbfe",
          background: "rgba(255,255,255,0.12)",
          padding: "2px 10px",
          borderRadius: "12px",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}>
          {rol}
        </span>
      </div>

      {/* ── Navegación ── */}
      <nav style={{
        display: "flex",
        alignItems: "center",
        gap: "2px",
        flex: 1,
        justifyContent: "center",
        margin: "0 20px",
        overflowX: "auto",
      }}>
        {itemsFiltrados.map((item) => {
          const active = page === item.page;
          return (
            <button
              key={item.page}
              onClick={() => setPage(item.page)}
              style={{
                background: active ? "rgba(255,255,255,0.15)" : "transparent",
                color: active ? "#ffffff" : "#bfdbfe",
                fontWeight: active ? "600" : "400",
                border: "none",
                borderRadius: "8px",
                padding: "6px 16px",
                fontSize: "13.5px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "background 0.15s, color 0.15s",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = "transparent";
              }}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* ── Usuario ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button
          onClick={() => setPage("perfil")}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#ffffff",
            fontSize: "13.5px",
            fontWeight: "500",
            fontFamily: "inherit",
            padding: "4px 8px",
            borderRadius: "8px",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
        >
          <div style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: "#bfdbfe",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "700",
            fontSize: "14px",
            color: "#1e3a8a",
          }}>
            {usuario?.nombre?.[0]}{usuario?.apellido?.[0]}
          </div>
          <span style={{ maxWidth: "110px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {usuario?.nombre} {usuario?.apellido}
          </span>
        </button>

        <button
          onClick={onLogout}
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "none",
            borderRadius: "8px",
            color: "#bfdbfe",
            fontSize: "12.5px",
            fontWeight: "600",
            fontFamily: "inherit",
            cursor: "pointer",
            padding: "6px 14px",
            transition: "background 0.15s, color 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.18)";
            e.currentTarget.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.08)";
            e.currentTarget.style.color = "#bfdbfe";
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}