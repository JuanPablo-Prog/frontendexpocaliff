import { useState, useEffect } from "react";
import { apiFetch, getUsuario } from "../api/Client";
import { C, F, card } from "../api/Tokens";
import { getRol } from "../api/Auth";
import { LoadingSpinner, Badge } from "../components/Emptystate";

function StatCard({ icon, label, value, color }) {
  return (
    <div style={{
      ...card,
      display: "flex", alignItems: "center", gap: "18px",
      borderTop: `3px solid ${color}`,
      transition: "box-shadow .2s, transform .2s",
    }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(79,70,229,0.12)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = C.shadowSm; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: "28px", fontWeight: "400", fontFamily: F.display, fontStyle: "italic", color: "#0f172a", lineHeight: 1 }}>{value ?? "—"}</p>
        <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "3px", fontWeight: "500" }}>{label}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const usuario = getUsuario();
  const rol     = getRol();
  const [stats, setStats]   = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        if (rol !== "alumno") {
          const [materias, grupos, alumnos, exposiciones] = await Promise.all([
            apiFetch("/api/materias"), apiFetch("/api/grupos"),
            apiFetch("/api/alumnos"), apiFetch("/api/exposiciones"),
          ]);
          setStats({ materias: materias.length, grupos: grupos.length, alumnos: alumnos.length, exposiciones: exposiciones.length });
        } else {
          const [exposiciones, evaluaciones] = await Promise.all([
            apiFetch("/api/exposiciones"), apiFetch("/api/evaluaciones"),
          ]);
          setStats({ exposiciones: exposiciones.length, evaluaciones: evaluaciones.length });
        }
      } catch (_) {}
      setLoading(false);
    };
    load();
  }, [rol]);

  if (loading) return <LoadingSpinner />;

  const initials = `${usuario?.nombre?.[0] ?? ""}${usuario?.apellido?.[0] ?? ""}`;

  return (
    <div className="page-anim">
      {/* Welcome card */}
      <div style={{
        ...card,
        marginBottom: "20px",
        background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #3730a3 100%)",
        border: "none",
        overflow: "hidden",
      }}>
        {/* decorative blob */}
        <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "160px", height: "160px", borderRadius: "50%", background: "rgba(129,140,248,0.15)" }} />
        <div style={{ position: "absolute", bottom: "-20px", right: "80px", width: "100px", height: "100px", borderRadius: "50%", background: "rgba(167,139,250,0.10)" }} />

        <div style={{ display: "flex", alignItems: "center", gap: "18px", position: "relative" }}>
          <div style={{ width: "54px", height: "54px", borderRadius: "50%", background: "linear-gradient(135deg, #c7d2fe, #818cf8)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.display, fontStyle: "italic", fontSize: "1.2rem", color: "#312e81", flexShrink: 0, boxShadow: "0 4px 14px rgba(99,102,241,0.4)" }}>
            {initials}
          </div>
          <div>
            <p style={{ color: "#c7d2fe", fontSize: "13px", marginBottom: "2px", fontWeight: "400" }}>Bienvenido de vuelta,</p>
            <p style={{ fontFamily: F.display, fontStyle: "italic", fontWeight: "400", fontSize: "1.5rem", color: "#fff", letterSpacing: "-0.01em" }}>{usuario?.nombre} {usuario?.apellido}</p>
            <div style={{ marginTop: "8px" }}><Badge color={rol}>{rol}</Badge></div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "20px" }}>
        {rol !== "alumno" && (
          <>
            <StatCard label="Materias registradas"  value={stats.materias}     color="#6366f1" />
            <StatCard label="Grupos activos"        value={stats.grupos}        color="#f59e0b" />
            <StatCard label="Alumnos registrados"   value={stats.alumnos}       color="#059669" />
          </>
        )}
        <StatCard label="Exposiciones"           value={stats.exposiciones}  color="#a78bfa" />
        {rol === "alumno" && (
          <StatCard label="Mis evaluaciones"      value={stats.evaluaciones}  color="#6366f1" />
        )}
      </div>

      {/* Info box */}
      <div style={{ ...card, background: "#eef2ff", border: "1px solid #c7d2fe" }}>
        <p style={{ fontSize: "13px", color: "#4338ca", fontWeight: "500", lineHeight: 1.6 }}>
          {rol === "admin"   && " Tienes acceso completo al sistema: puedes gestionar todos los módulos y eliminar registros."}
          {rol === "docente" && " Puedes crear y editar materias, grupos, alumnos, equipos y exposiciones. Contacta al administrador para eliminar registros."}
          {rol === "alumno"  && " Puedes ver las exposiciones programadas y enviar tus evaluaciones."}
        </p>
      </div>
    </div>
  );
}
