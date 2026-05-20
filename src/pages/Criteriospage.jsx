import { useState, useEffect } from "react";
import { apiFetch } from "../api/Client";
import { C, F, btn, card, th, td } from "../api/Tokens";
import { puedeEscribir, puedeEliminar } from "../api/Auth";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/Confirmdialog";
import { EmptyState, LoadingSpinner, FormGroup, Inp, Txt, Sel } from "../components/Emptystate";

const EMPTY = { nombre_criterio: "", descripcion: "", peso: "", id_materia: "" };

export default function CriteriosPage({ toast }) {
  const [items, setItems]     = useState([]);
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroMateria, setFiltroMateria] = useState("");
  const [modal, setModal]     = useState({ open: false, mode: "create", data: null });
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [deleting, setDeleting] = useState(false);

  const canWrite  = puedeEscribir();
  const canDelete = puedeEliminar();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [crit, mats] = await Promise.all([
        apiFetch(`/api/criterios${filtroMateria ? `?id_materia=${filtroMateria}` : ""}`),
        apiFetch("/api/materias"),
      ]);
      setItems(crit); setMaterias(mats);
    } catch (e) { toast(e.message, "error"); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [filtroMateria]);

  const openCreate = () => { setForm({ ...EMPTY, id_materia: filtroMateria || "" }); setModal({ open: true, mode: "create" }); };
  const openEdit   = (item) => {
    setForm({ nombre_criterio: item.nombre_criterio, descripcion: item.descripcion || "", peso: item.peso, id_materia: item.id_materia });
    setModal({ open: true, mode: "edit", data: item });
  };
  const closeModal = () => setModal({ open: false, mode: "create", data: null });

  const handleSubmit = async () => {
    if (!form.nombre_criterio || !form.peso || !form.id_materia) return toast("Nombre, peso y materia son obligatorios.", "error");
    if (form.peso <= 0) return toast("El peso debe ser mayor a 0.", "error");
    setSaving(true);
    try {
      const body = { ...form, peso: parseFloat(form.peso), id_materia: parseInt(form.id_materia) };
      if (modal.mode === "create") {
        await apiFetch("/api/criterios", { method: "POST", body: JSON.stringify(body) });
        toast("Criterio creado.");
      } else {
        await apiFetch(`/api/criterios/${modal.data.id_criterio}`, { method: "PUT", body: JSON.stringify(body) });
        toast("Criterio actualizado.");
      }
      closeModal(); fetchData();
    } catch (e) { toast(e.message, "error"); }
    setSaving(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await apiFetch(`/api/criterios/${confirm.id}`, { method: "DELETE" });
      toast("Criterio eliminado."); setConfirm({ open: false, id: null }); fetchData();
    } catch (e) { toast(e.message, "error"); }
    setDeleting(false);
  };

  // Suma de pesos por materia (para advertencia)
  const sumaPesos = items.filter(i => !filtroMateria || i.id_materia === parseInt(filtroMateria)).reduce((s, i) => s + parseFloat(i.peso), 0);

  return (
    <div className="page-anim">
      {/* Toolbar */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "18px", alignItems: "center" }}>
        <Sel value={filtroMateria} onChange={(e) => setFiltroMateria(e.target.value)} style={{ flex: 1 }}>
          <option value="">Todas las materias</option>
          {materias.map((m) => <option key={m.id_materia} value={m.id_materia}>{m.clave_materia} – {m.nombre_materia}</option>)}
        </Sel>
        <button onClick={fetchData} style={btn("ghost")}>↻</button>
        {canWrite && <button onClick={openCreate} style={btn("primary")}>＋ Nuevo criterio</button>}
      </div>

      {/* Suma de pesos */}
      {filtroMateria && items.length > 0 && (
        <div style={{ background: sumaPesos === 100 ? "#dcfce7" : "#fef9c3", border: `1px solid ${sumaPesos === 100 ? "#86efac" : "#fde68a"}`, borderRadius: "10px", padding: "10px 16px", marginBottom: "14px", fontSize: "13px", fontWeight: "600", color: sumaPesos === 100 ? "#166534" : "#92400e" }}>
          {sumaPesos === 100 ? "Los pesos suman 100% — rúbrica completa." : `Los pesos suman ${sumaPesos}% (debe ser 100%).`}
        </div>
      )}

      {/* Table */}
      <div style={{ ...card, padding: 0, overflow: "hidden" }}>
        {loading ? <LoadingSpinner /> : items.length === 0 ? (
          <EmptyState icon="📋" title="Sin criterios" description="Crea criterios para definir la rúbrica de evaluación." />
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={th}>Criterio</th>
                <th style={th}>Descripción</th>
                <th style={th}>Materia</th>
                <th style={th}>Peso (%)</th>
                {(canWrite || canDelete) && <th style={{ ...th, textAlign: "right" }}>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id_criterio}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ ...td, fontWeight: "600", color: C.textPrimary }}>{item.nombre_criterio}</td>
                  <td style={{ ...td, maxWidth: "240px" }}>
                    <span style={{ fontSize: "13px", color: C.textMuted }}>{item.descripcion || "—"}</span>
                  </td>
                  <td style={td}>{item.materias?.nombre_materia || "—"}</td>
                  <td style={td}>
                    <span style={{ background: "#dbeafe", color: "#1e40af", padding: "3px 10px", borderRadius: "20px", fontWeight: "700", fontSize: "12px" }}>{item.peso}%</span>
                  </td>
                  {(canWrite || canDelete) && (
                    <td style={{ ...td, textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                        {canWrite  && <button onClick={() => openEdit(item)} style={btn("ghost", "sm")}>✏️ Editar</button>}
                        {canDelete && <button onClick={() => setConfirm({ open: true, id: item.id_criterio })} style={btn("danger", "sm")}>🗑</button>}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      <Modal open={modal.open} title={modal.mode === "create" ? "Nuevo criterio" : "Editar criterio"} onClose={closeModal}
        footer={<>
          <button onClick={closeModal} style={btn("ghost")}>Cancelar</button>
          <button onClick={handleSubmit} disabled={saving} style={btn("primary")}>{saving ? "Guardando…" : "Guardar"}</button>
        </>}
      >
        <FormGroup label="Materia">
          <Sel value={form.id_materia} onChange={(e) => setForm({ ...form, id_materia: e.target.value })}>
            <option value="">Selecciona una materia</option>
            {materias.map((m) => <option key={m.id_materia} value={m.id_materia}>{m.clave_materia} – {m.nombre_materia}</option>)}
          </Sel>
        </FormGroup>
        <FormGroup label="Nombre del criterio">
          <Inp value={form.nombre_criterio} onChange={(e) => setForm({ ...form, nombre_criterio: e.target.value })} placeholder="Ej. Dominio del tema" />
        </FormGroup>
        <FormGroup label="Descripción (opcional)">
          <Txt value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} placeholder="Describe qué se evalúa en este criterio…" />
        </FormGroup>
        <FormGroup label="Peso (%)">
          <Inp type="number" min="1" max="100" value={form.peso} onChange={(e) => setForm({ ...form, peso: e.target.value })} placeholder="Ej. 30" />
        </FormGroup>
        <p style={{ fontSize: "12px", color: C.textMuted }}>💡 La suma de todos los pesos de una materia debe ser 100.</p>
      </Modal>

      <ConfirmDialog open={confirm.open} onConfirm={handleDelete} onCancel={() => setConfirm({ open: false, id: null })} loading={deleting} />
    </div>
  );
}