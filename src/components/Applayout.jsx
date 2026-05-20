import { C, F } from "../api/Tokens";
import { getRol } from "../api/Auth";

const PAGE_TITLES = {
  dashboard:    "Dashboard",
  usuarios:     "Usuarios",
  materias:     "Materias",
  criterios:    "Criterios",
  grupos:       "Grupos",
  alumnos:      "Alumnos",
  equipos:      "Equipos",
  exposiciones: "Exposiciones",
  evaluaciones: "Evaluaciones",
};

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

export default function AppLayout({ page, setPage, usuario, onLogout, children }) {
  const rol = getRol();

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f0f2f8",
      backgroundImage: "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(99,102,241,0.08) 0%, transparent 60%)",
      backgroundAttachment: "fixed",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px", fontFamily: F.body,
    }}>
      <div style={{
        width: "100%", maxWidth: "1340px", minHeight: "88vh",
        background: "#fff",
        borderRadius: "24px",
        boxShadow: "0 20px 80px rgba(15,23,42,0.14), 0 4px 20px rgba(79,70,229,0.08)",
        border: "1px solid rgba(79,70,229,0.10)",
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}>

        {/* ────── CABECERA PRINCIPAL ────── */}
        <div style={{
          background: "#0c1628",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 28px",
          height: "72px",
          borderBottom: "1px solid rgba(129,140,248,0.12)",
          flexShrink: 0,
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{
              fontFamily: F.display, fontSize: "1.7rem", fontWeight: "400",
              fontStyle: "italic", color: "#fff", letterSpacing: "-0.01em", lineHeight: 1,
            }}>
              Expos<span style={{ color: "#818cf8" }}>Calif</span>
            </div>
            <span style={{
              background: "rgba(129,140,248,0.15)", color: "#818cf8",
              fontWeight: "600", fontSize: "10px", textTransform: "uppercase",
              letterSpacing: "1.2px", borderRadius: "6px", padding: "3px 10px",
            }}>
              {rol}
            </span>
          </div>

          {/* Título de la página (centrado) */}
          <h1 style={{
            fontFamily: F.display, fontSize: "1.3rem", fontWeight: "400",
            fontStyle: "italic", color: "#c7d2fe", letterSpacing: "-0.01em",
            margin: 0, textAlign: "center",
          }}>
            {PAGE_TITLES[page]}
          </h1>

          {/* Área de usuario */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "50%",
                background: "linear-gradient(135deg, #c7d2fe, #818cf8)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: F.display, fontStyle: "italic", fontSize: "14px",
                color: "#312e81", fontWeight: "bold",
                boxShadow: "0 2px 8px rgba(99,102,241,0.3)",
              }}>
                {usuario?.nombre?.[0]}{usuario?.apellido?.[0]}
              </div>
              <span style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: "500" }}>
                {usuario?.nombre} {usuario?.apellido}
              </span>
            </div>
            <button
              onClick={onLogout}
              style={{
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(129,140,248,0.2)",
                borderRadius: "8px", color: "#94a3b8", fontSize: "12px",
                fontWeight: "600", fontFamily: F.body, cursor: "pointer",
                padding: "6px 14px", display: "flex", alignItems: "center", gap: "6px",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#1e1030";
                e.currentTarget.style.color = "#f87171";
                e.currentTarget.style.borderColor = "#f87171";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.color = "#94a3b8";
                e.currentTarget.style.borderColor = "rgba(129,140,248,0.2)";
              }}
            >
              <span style={{ fontSize: "14px" }}>⎋</span> Salir
            </button>
          </div>
        </div>

        {/* ────── BARRA DE NAVEGACIÓN ────── */}
        <div style={{
          background: "#0c1628",
          borderBottom: "1px solid rgba(129,140,248,0.12)",
          padding: "0 20px",
          height: "52px",
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
        }}>
          <nav style={{
            display: "flex", alignItems: "center", gap: "2px",
            flex: 1, justifyContent: "center",
            overflowX: "auto", flexWrap: "nowrap",
          }}>
            {NAV_ITEMS.filter((n) => n.roles.includes(rol)).map((item) => {
              const active = page === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => setPage(item.page)}
                  style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    padding: "8px 18px", borderRadius: "8px", border: "none",
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
                  <span style={{ fontSize: "16px" }}>{item.icon}</span>
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* ────── CONTENIDO ────── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#f0f2f8", minHeight: 0 }}>
          <div style={{ flex: 1, padding: "24px 28px", overflowY: "auto" }} className="page-anim">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}