import { useState, useEffect } from "react";
import { apiFetch } from "../api/Client";
import { C, F, btn, card, th, td } from "../api/Tokens";
import { puedeEscribir, puedeEliminar, esAlumno } from "../api/Auth";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/Confirmdialog";
import { EmptyState, LoadingSpinner, FormGroup, Inp, Sel } from "../components/Emptystate";

const EMPTY = { titulo: "", fecha_exposicion: "", id_equipo: "" };

export default function ExposicionesPage({ toast, onEvaluar }) {
  const [items, setItems]   = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroGrupo, setFiltroGrupo] = useState("");
  const [modal, setModal]   = useState({ open: false, mode: "create", data: null });
  const [resumenModal, setResumenModal] = useState({ open: false, data: null, loading: false });
  const [form, setForm]     = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [deleting, setDeleting] = useState(false);

  const canWrite  = puedeEscribir();
  const canDelete = puedeEliminar();
  const alumno    = esAlumno();

  const fetchData = async () => {
    setLoading(true);
    try {
      const qs = filtroGrupo ? `?id_grupo=${filtroGrupo}` : "";
      const [exps, eqs, grps] = await Promise.all([
        apiFetch(`/api/exposiciones${qs}`),
        apiFetch("/api/equipos"),
        apiFetch("/api/grupos"),
      ]);
      setItems(exps); setEquipos(eqs); setGrupos(grps);
    } catch (e) { toast(e.message, "error"); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [filtroGrupo]);

  const openCreate = () => { setForm(EMPTY); setModal({ open: true, mode: "create" }); };
  const openEdit   = (item) => {
    const fecha = item.fecha_exposicion ? item.fecha_exposicion.slice(0, 16) : "";
    setForm({ titulo: item.titulo, fecha_exposicion: fecha, id_equipo: item.id_equipo });
    setModal({ open: true, mode: "edit", data: item });
  };
  const closeModal = () => setModal({ open: false });

  const openResumen = async (exp) => {
    setResumenModal({ open: true, data: null, loading: true });
    try {
      const data = await apiFetch(`/api/evaluaciones/resumen/${exp.id_exposicion}`);
      setResumenModal({ open: true, data: { ...data, titulo: exp.titulo }, loading: false });
    } catch (e) { toast(e.message, "error"); setResumenModal({ open: false, data: null, loading: false }); }
  };

  const handleSubmit = async () => {
    if (!form.titulo || !form.fecha_exposicion || !form.id_equipo) return toast("Todos los campos son obligatorios.", "error");
    setSaving(true);
    try {
      const body = { ...form, id_equipo: parseInt(form.id_equipo) };
      if (modal.mode === "create") {
        await apiFetch("/api/exposiciones", { method: "POST", body: JSON.stringify(body) });
        toast("Exposición creada.");
      } else {
        await apiFetch(`/api/exposiciones/${modal.data.id_exposicion}`, { method: "PUT", body: JSON.stringify(body) });
        toast("Exposición actualizada.");
      }
      closeModal(); fetchData();
    } catch (e) { toast(e.message, "error"); }
    setSaving(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await apiFetch(`/api/exposiciones/${confirm.id}`, { method: "DELETE" });
      toast("Exposición eliminada."); setConfirm({ open: false, id: null }); fetchData();
    } catch (e) { toast(e.message, "error"); }
    setDeleting(false);
  };

  const formatFecha = (f) => f ? new Date(f).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" }) : "—";

  return (
    <div className="page-anim">
      <div style={{ display: "flex", gap: "12px", marginBottom: "18px", alignItems: "center" }}>
        <Sel value={filtroGrupo} onChange={(e) => setFiltroGrupo(e.target.value)} style={{ flex: 1 }}>
          <option value="">Todos los grupos</option>
          {grupos.map((g) => <option key={g.id_grupo} value={g.id_grupo}>{g.nombre_grupo} – {g.periodo}</option>)}
        </Sel>
        <button onClick={fetchData} style={btn("ghost")}>↻</button>
        {canWrite && <button onClick={openCreate} style={btn("primary")}>＋ Nueva exposición</button>}
      </div>

      <div style={{ ...card, padding: 0, overflow: "hidden" }}>
        {loading ? <LoadingSpinner /> : items.length === 0 ? (
          <EmptyState icon="🎤" title="Sin exposiciones" description="Aún no hay exposiciones programadas." />
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={th}>Título</th>
                <th style={th}>Equipo</th>
                <th style={th}>Fecha</th>
                <th style={th}>Evaluaciones</th>
                <th style={{ ...th, textAlign: "right" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const evalCount = item.evaluaciones?.[0]?.count ?? 0;
                return (
                  <tr key={item.id_exposicion}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ ...td, fontWeight: "600", color: C.textPrimary, maxWidth: "200px" }}>{item.titulo}</td>
                    <td style={td}>{item.equipos?.nombre_equipo || "—"}</td>
                    <td style={td}><span style={{ fontSize: "13px" }}>{formatFecha(item.fecha_exposicion)}</span></td>
                    <td style={td}>
                      <span style={{ background: evalCount > 0 ? "#dcfce7" : "#f3f4f6", color: evalCount > 0 ? "#166534" : "#6b7280", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" }}>
                        {evalCount}
                      </span>
                    </td>
                    <td style={{ ...td, textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                        {alumno && (
                          <button onClick={() => onEvaluar(item)} style={btn("accent", "sm")}>Evaluar</button>
                        )}
                        {!alumno && (
                          <button onClick={() => openResumen(item)} style={btn("ghost", "sm")}>Resumen</button>
                        )}
                        {canWrite  && <button onClick={() => openEdit(item)} style={btn("ghost", "sm")}>✏️</button>}
                        {canDelete && <button onClick={() => setConfirm({ open: true, id: item.id_exposicion })} style={btn("danger", "sm")}>🗑</button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Form modal */}
      <Modal open={modal.open} title={modal.mode === "create" ? "Nueva exposición" : "Editar exposición"} onClose={closeModal}
        footer={<>
          <button onClick={closeModal} style={btn("ghost")}>Cancelar</button>
          <button onClick={handleSubmit} disabled={saving} style={btn("primary")}>{saving ? "Guardando…" : "Guardar"}</button>
        </>}
      >
        <FormGroup label="Título">
          <Inp value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder="Ej. Patrones de diseño en POO" />
        </FormGroup>
        <FormGroup label="Fecha y hora">
          <Inp type="datetime-local" value={form.fecha_exposicion} onChange={(e) => setForm({ ...form, fecha_exposicion: e.target.value })} />
        </FormGroup>
        <FormGroup label="Equipo">
          <Sel value={form.id_equipo} onChange={(e) => setForm({ ...form, id_equipo: e.target.value })}>
            <option value="">Selecciona un equipo</option>
            {equipos.map((eq) => <option key={eq.id_equipo} value={eq.id_equipo}>{eq.nombre_equipo} — {eq.grupos?.nombre_grupo}</option>)}
          </Sel>
        </FormGroup>
      </Modal>

      {/* Resumen modal */}
      <Modal open={resumenModal.open} title={`Resumen: ${resumenModal.data?.titulo || ""}`} onClose={() => setResumenModal({ open: false, data: null, loading: false })} width="600px"
        footer={<button onClick={() => setResumenModal({ open: false, data: null, loading: false })} style={btn("primary")}>Cerrar</button>}
      >
        {resumenModal.loading ? <LoadingSpinner text="Calculando promedios…" /> : resumenModal.data && (
          <>
            {resumenModal.data.resumen?.length === 0 ? (
              <EmptyState icon="📭" title="Sin evaluaciones" description="Aún no hay evaluaciones para esta exposición." />
            ) : (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {resumenModal.data.resumen?.map((c) => (
                    <div key={c.id_criterio} style={{ background: "#f8fafc", borderRadius: "10px", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: "700", fontSize: "14px", color: C.textPrimary, marginBottom: "2px" }}>{c.nombre_criterio}</p>
                        <p style={{ fontSize: "12px", color: C.textMuted }}>{c.peso}% de peso · {c.total_evaluaciones} evaluaciones</p>
                        <div style={{ marginTop: "6px", height: "6px", background: "#e2e8f0", borderRadius: "99px", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${(c.promedio / 10) * 100}%`, background: C.primary, borderRadius: "99px", transition: "width 0.5s" }} />
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <span style={{ fontFamily: F.display, fontSize: "22px", fontWeight: "800", color: C.textPrimary }}>{c.promedio}</span>
                        <span style={{ fontSize: "12px", color: C.textMuted }}>/10</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ background: "#0c1628", borderRadius: "12px", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "4px" }}>
                  <span style={{ color: "#94a3b8", fontWeight: "600", fontSize: "14px" }}>Calificación final ponderada</span>
                  <span style={{ fontFamily: F.display, fontSize: "30px", fontWeight: "800", color: C.accent }}>{resumenModal.data.calificacion_final}</span>
                </div>
              </>
            )}
          </>
        )}
      </Modal>

      <ConfirmDialog open={confirm.open} onConfirm={handleDelete} onCancel={() => setConfirm({ open: false, id: null })} loading={deleting} />
    </div>
  );
}