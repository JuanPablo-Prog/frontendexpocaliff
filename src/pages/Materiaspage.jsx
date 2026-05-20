import { useState, useEffect } from "react";
import { apiFetch } from "../api/Client";
import { C, F, btn, card, th, td } from "../api/Tokens";
import { puedeEscribir, puedeEliminar } from "../api/Auth";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/Confirmdialog";
import { EmptyState, LoadingSpinner, FormGroup, Inp } from "../components/Emptystate";

const EMPTY = { clave_materia: "", nombre_materia: "" };

export default function MateriasPage({ toast }) {
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal]   = useState({ open: false, mode: "create", data: null });
  const [form, setForm]     = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [deleting, setDeleting] = useState(false);

  const canWrite  = puedeEscribir();
  const canDelete = puedeEliminar();

  const fetchData = async () => {
    setLoading(true);
    try {
      const qs = search ? `?search=${search}` : "";
      setItems(await apiFetch(`/api/materias${qs}`));
    } catch (e) { toast(e.message, "error"); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setForm(EMPTY); setModal({ open: true, mode: "create" }); };
  const openEdit   = (item) => { setForm({ clave_materia: item.clave_materia, nombre_materia: item.nombre_materia }); setModal({ open: true, mode: "edit", data: item }); };
  const closeModal = () => setModal({ open: false, mode: "create", data: null });

  const handleSubmit = async () => {
    if (!form.clave_materia || !form.nombre_materia) return toast("Todos los campos son obligatorios.", "error");
    setSaving(true);
    try {
      if (modal.mode === "create") {
        await apiFetch("/api/materias", { method: "POST", body: JSON.stringify(form) });
        toast("Materia creada correctamente.");
      } else {
        await apiFetch(`/api/materias/${modal.data.id_materia}`, { method: "PUT", body: JSON.stringify(form) });
        toast("Materia actualizada.");
      }
      closeModal(); fetchData();
    } catch (e) { toast(e.message, "error"); }
    setSaving(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await apiFetch(`/api/materias/${confirm.id}`, { method: "DELETE" });
      toast("Materia eliminada."); setConfirm({ open: false, id: null }); fetchData();
    } catch (e) { toast(e.message, "error"); }
    setDeleting(false);
  };

  const filtered = items.filter((i) =>
    i.nombre_materia.toLowerCase().includes(search.toLowerCase()) ||
    i.clave_materia.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-anim">
      {/* Toolbar */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "18px", alignItems: "center" }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar materia…"
          style={{ flex: 1, padding: "9px 14px", borderRadius: "9px", border: `1px solid ${C.border}`, fontSize: "14px", fontFamily: F.body }} />
        <button onClick={fetchData} style={btn("ghost")}>↻ Actualizar</button>
        {canWrite && <button onClick={openCreate} style={btn("primary")}>＋ Nueva materia</button>}
      </div>

      {/* Table card */}
      <div style={{ ...card, padding: 0, overflow: "hidden" }}>
        {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
          <EmptyState title="Sin materias" description="Aún no hay materias registradas." />
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={th}>Clave</th>
                <th style={th}>Nombre</th>
                <th style={th}>Registrada</th>
                {(canWrite || canDelete) && <th style={{ ...th, textAlign: "right" }}>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id_materia} style={{ transition: "background 0.1s" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <td style={td}><span style={{ fontFamily: "monospace", background: "#f1f5f9", padding: "3px 8px", borderRadius: "6px", fontSize: "13px", fontWeight: "700" }}>{item.clave_materia}</span></td>
                  <td style={{ ...td, fontWeight: "600", color: C.textPrimary }}>{item.nombre_materia}</td>
                  <td style={td}>{new Date(item.created_at).toLocaleDateString("es-MX")}</td>
                  {(canWrite || canDelete) && (
                    <td style={{ ...td, textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                        {canWrite  && <button onClick={() => openEdit(item)} style={btn("ghost", "sm")}>✏️ Editar</button>}
                        {canDelete && <button onClick={() => setConfirm({ open: true, id: item.id_materia })} style={btn("danger", "sm")}>🗑 Eliminar</button>}
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
      <Modal open={modal.open} title={modal.mode === "create" ? "Nueva materia" : "Editar materia"} onClose={closeModal}
        footer={<>
          <button onClick={closeModal} style={btn("ghost")}>Cancelar</button>
          <button onClick={handleSubmit} disabled={saving} style={btn("primary")}>{saving ? "Guardando…" : "Guardar"}</button>
        </>}
      >
        <FormGroup label="Clave de materia">
          <Inp value={form.clave_materia} onChange={(e) => setForm({ ...form, clave_materia: e.target.value.toUpperCase() })} placeholder="Ej. PROG101" />
        </FormGroup>
        <FormGroup label="Nombre de materia">
          <Inp value={form.nombre_materia} onChange={(e) => setForm({ ...form, nombre_materia: e.target.value })} placeholder="Ej. Programación Orientada a Objetos" />
        </FormGroup>
      </Modal>

      <ConfirmDialog open={confirm.open} onConfirm={handleDelete} onCancel={() => setConfirm({ open: false, id: null })} loading={deleting}
        message="Se eliminarán también todos los criterios y grupos de esta materia." />
    </div>
  );
}