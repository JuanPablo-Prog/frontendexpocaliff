import { useState, useEffect } from "react";
import { apiFetch, getUsuario, saveSession, getToken } from "../api/Client";
import { C, F, btn, card } from "../api/Tokens";
import { getRol } from "../api/Auth";
import { FormGroup, Inp, Badge } from "../components/Emptystate";

export default function PerfilPage({ toast, onProfileUpdate }) {
  const rolActual = getRol();
  const usuarioLocal = getUsuario();

  const [perfil, setPerfil]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving]   = useState(false);

  const [form, setForm] = useState({ nombre: "", apellido: "", matricula: "" });

  // También info del alumno vinculado (si aplica)
  const [alumno, setAlumno]   = useState(null);

  // ── Carga ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await apiFetch(`/api/usuarios/${usuarioLocal.id_usuario}`);
        setPerfil(data);
        setForm({ nombre: data.nombre, apellido: data.apellido, matricula: data.matricula || "" });

        // Si es alumno, cargar su registro de alumnos
        if (data.rol === "alumno") {
          const alumnos = await apiFetch("/api/alumnos");
          const propio  = alumnos.find((a) => a.id_usuario === data.id_usuario);
          setAlumno(propio || null);
        }
      } catch (e) { toast(e.message, "error"); }
      setLoading(false);
    };
    load();
  }, []);

  // ── Guardar ────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.nombre.trim() || !form.apellido.trim()) {
      return toast("Nombre y apellido son obligatorios.", "error");
    }
    setSaving(true);
    try {
      const data = await apiFetch(`/api/usuarios/${perfil.id_usuario}`, {
        method: "PUT",
        body: JSON.stringify({
          nombre:    form.nombre.trim(),
          apellido:  form.apellido.trim(),
          matricula: form.matricula.trim() || null,
        }),
      });

      // Sincronizar localStorage y notificar a App para actualizar el sidebar
      const updatedUser = {
        ...usuarioLocal,
        nombre:    data.usuario.nombre,
        apellido:  data.usuario.apellido,
        matricula: data.usuario.matricula,
      };
      saveSession(getToken(), updatedUser);
      if (onProfileUpdate) onProfileUpdate(updatedUser);

      setPerfil(data.usuario);
      setEditing(false);
      toast("Perfil actualizado correctamente. ✓");
    } catch (e) { toast(e.message, "error"); }
    setSaving(false);
  };

  const cancelar = () => {
    setForm({ nombre: perfil.nombre, apellido: perfil.apellido, matricula: perfil.matricula || "" });
    setEditing(false);
  };

  const rolInfo = {
    admin:   {  color: "#f59e0b", desc: "Tienes acceso completo al sistema." },
    docente: {  color: "#2563eb", desc: "Puedes gestionar grupos, exposiciones y alumnos." },
    alumno:  {  color: "#16a34a", desc: "Puedes ver exposiciones y enviar evaluaciones." },
  };
  const ri = rolInfo[rolActual] || rolInfo.alumno;

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px" }}>
        <div style={{ width: "36px", height: "36px", border: `3px solid ${C.border}`, borderTop: `3px solid ${C.primary}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!perfil) return null;

  return (
    <div className="page-anim" style={{ maxWidth: "680px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Cabecera de perfil */}
      <div style={{ ...card, background: "linear-gradient(135deg,rgb(48, 91, 170) 0%, #1e3a5f 100%)", border: "none", display: "flex", alignItems: "center", gap: "20px" }}>
        {/* Avatar */}
        <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: ri.color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.display, fontWeight: "800", fontSize: "26px", color: "#fff", flexShrink: 0, boxShadow: `0 0 0 4px ${ri.color}40` }}>
          {perfil.nombre?.[0]}{perfil.apellido?.[0]}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: F.display, fontSize: "22px", fontWeight: "800", color: "#fff" }}>
            {perfil.nombre} {perfil.apellido}
          </p>
          <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "3px" }}>{perfil.email}</p>
          <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "10px" }}>
            <Badge color={rolActual}>{rolActual}</Badge>
            <span style={{ fontSize: "12px", color: "#64748b" }}>{ri.desc}</span>
          </div>
        </div>
      </div>

      {/* Datos del perfil */}
      <div style={card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <h2 style={{ fontFamily: F.display, fontSize: "16px", fontWeight: "700", color: C.textPrimary }}>Información personal</h2>
          {!editing && (
            <button onClick={() => setEditing(true)} style={btn("ghost", "sm")}>✏️ Editar</button>
          )}
        </div>

        {editing ? (
          /* ── Modo edición ── */
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <FormGroup label="Nombre">
                <Inp
                  value={form.nombre}
                  onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                  placeholder="Juan"
                  autoFocus
                />
              </FormGroup>
              <FormGroup label="Apellido">
                <Inp
                  value={form.apellido}
                  onChange={(e) => setForm((f) => ({ ...f, apellido: e.target.value }))}
                  placeholder="García"
                />
              </FormGroup>
            </div>

            <FormGroup label="Matrícula / ID">
              <Inp
                value={form.matricula}
                onChange={(e) => setForm((f) => ({ ...f, matricula: e.target.value }))}
                placeholder="Ej. A230001"
              />
            </FormGroup>

            {/* Rol — solo lectura */}
            <div>
              <label style={{ fontSize: "11px", fontWeight: "700", color: C.textSecond, textTransform: "uppercase", letterSpacing: "0.6px", display: "block", marginBottom: "6px" }}>
                Rol (no editable)
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: "#f8fafc", border: `1px solid ${C.border}`, borderRadius: "8px" }}>
                <span style={{ fontSize: "18px" }}>{ri.icon}</span>
                <Badge color={rolActual}>{rolActual}</Badge>
                <span style={{ fontSize: "12px", color: C.textMuted }}>Contacta al administrador para cambiar tu rol.</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", paddingTop: "8px", borderTop: `1px solid ${C.border}` }}>
              <button onClick={cancelar} style={btn("ghost")} disabled={saving}>Cancelar</button>
              <button onClick={handleSave} style={btn("primary")} disabled={saving}>
                {saving ? "Guardando…" : "Guardar cambios"}
              </button>
            </div>
          </div>
        ) : (
          /* ── Modo vista ── */
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { label: "Nombre completo", value: `${perfil.nombre} ${perfil.apellido}` },
              { label: "Correo electrónico", value: perfil.email },
              { label: "Matrícula / ID", value: perfil.matricula || "—" },
              { label: "Miembro desde", value: new Date(perfil.created_at).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" }) },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", gap: "16px", paddingBottom: "14px", borderBottom: `1px solid #f1f5f9` }}>
                <span style={{ fontSize: "12px", fontWeight: "700", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.6px", width: "160px", flexShrink: 0, paddingTop: "2px" }}>{label}</span>
                <span style={{ fontSize: "14px", color: C.textPrimary, fontWeight: "500" }}>{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info de alumno vinculado (solo si tiene registro en la tabla alumnos) */}
      {rolActual === "alumno" && alumno && (
        <div style={card}>
          <h2 style={{ fontFamily: F.display, fontSize: "16px", fontWeight: "700", color: C.textPrimary, marginBottom: "16px" }}>
            Mi registro académico
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { label: "Matrícula académica", value: alumno.matricula },
              { label: "Nombre registrado",   value: `${alumno.nombre} ${alumno.apellido}` },
              { label: "Email académico",      value: alumno.email },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", gap: "16px", paddingBottom: "10px", borderBottom: `1px solid #f1f5f9` }}>
                <span style={{ fontSize: "12px", fontWeight: "700", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.6px", width: "160px", flexShrink: 0, paddingTop: "2px" }}>{label}</span>
                <span style={{ fontSize: "14px", color: C.textPrimary, fontWeight: "500" }}>{value}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: "12px", color: C.textMuted, marginTop: "12px" }}>
             Si necesitas actualizar tu matrícula o datos académicos, contacta a tu docente o administrador.
          </p>
        </div>
      )}

      {/* Banner si el alumno no tiene registro vinculado */}
      {rolActual === "alumno" && !alumno && (
        <div style={{ background: "#fef9c3", border: "1px solid #fde68a", borderRadius: "12px", padding: "16px 20px", fontSize: "13px", color: "#92400e" }}>
          Tu cuenta aún no está vinculada a un registro de alumno. Esto puede impedir que puedas enviar evaluaciones. Contacta a tu docente o administrador.
        </div>
      )}
    </div>
  );
}
