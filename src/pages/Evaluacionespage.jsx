import { useState, useEffect } from "react";
import { apiFetch, getUsuario } from "../api/Client";
import { C, F, btn, card, th, td } from "../api/Tokens";
import { esAlumno, puedeEliminar } from "../api/Auth";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/Confirmdialog";
import { EmptyState, LoadingSpinner, FormGroup, Inp, Txt, Sel } from "../components/Emptystate";

// ─── Página de Evaluaciones ───────────────────────────────────────────────────
// Para alumno: lista sus evaluaciones + botón "Nueva evaluación"
// Para admin/docente: lista todas las evaluaciones, puede eliminar

export default function EvaluacionesPage({ toast }) {
  const usuario   = getUsuario();
  const alumno    = esAlumno();
  const canDelete = puedeEliminar();

  // ── Estado principal ──────────────────────────────────────────────────────
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [loading, setLoading]           = useState(true);

  // ── Modal de nueva evaluación ─────────────────────────────────────────────
  const [evalModal, setEvalModal] = useState({ open: false });
  const [exposiciones, setExposiciones]   = useState([]);
  const [misAlumnos, setMisAlumnos]       = useState([]);   // alumnos cuyo id_usuario == usuario
  const [criterios, setCriterios]         = useState([]);
  const [loadingCriterios, setLoadingCriterios] = useState(false);

  // Formulario de evaluación
  const [evalForm, setEvalForm] = useState({
    id_exposicion: "",
    id_alumno_evaluador: "",
    comentario_general: "",
    calificaciones: {}, // { [id_criterio]: valor }
  });
  const [saving, setSaving] = useState(false);

  // ── Confirm eliminar ──────────────────────────────────────────────────────
  const [confirm, setConfirm]   = useState({ open: false, id: null });
  const [deleting, setDeleting] = useState(false);

  // ── Detalle evaluación ────────────────────────────────────────────────────
  const [detalleModal, setDetalleModal] = useState({ open: false, data: null });

  // ─────────────────────────────────────────────────────────────────────────
  const fetchEvaluaciones = async () => {
    setLoading(true);
    try {
      setEvaluaciones(await apiFetch("/api/evaluaciones"));
    } catch (e) { toast(e.message, "error"); }
    setLoading(false);
  };

  // Si venimos desde ExposicionesPage con una exposición preseleccionada
  const abrirEvalModalConExposicion = async (exposicionInicial) => {
    // Cargar exposiciones y datos del alumno
    try {
      const [exps, alumnos] = await Promise.all([
        apiFetch("/api/exposiciones"),
        apiFetch("/api/alumnos"),
      ]);
      setExposiciones(exps);

      // Identificar qué registro(s) de alumnos corresponden al usuario actual
      const propios = alumnos.filter((a) => a.id_usuario === usuario?.id_usuario);
      setMisAlumnos(propios);

      const idAlumno = propios[0]?.id_alumno?.toString() || "";
      const idExposicion = exposicionInicial?.id_exposicion?.toString() || "";

      setEvalForm({
        id_exposicion: idExposicion,
        id_alumno_evaluador: idAlumno,
        comentario_general: "",
        calificaciones: {},
      });

      setEvalModal({ open: true });

      // Cargar criterios de esa exposición
      if (idExposicion) {
        cargarCriterios(idExposicion, exps);
      }
    } catch (e) {
      toast(e.message, "error");
    }
  };

  useEffect(() => {
    fetchEvaluaciones();

    // ¿Venimos desde ExposicionesPage?
    const pendiente = sessionStorage.getItem("evaluar_exposicion");
    if (pendiente) {
      sessionStorage.removeItem("evaluar_exposicion");
      const exp = JSON.parse(pendiente);
      abrirEvalModalConExposicion(exp);
    }
  }, []);

  // ── Cargar criterios cuando cambia la exposición seleccionada ─────────────
  // Ruta de resolución (en orden de prioridad):
  //   1. exp.equipos.grupos.id_materia         ← ya viene del GET /api/exposiciones (backend corregido)
  //   2. exp.equipos.grupos.materias.id_materia ← alternativa si viene anidado
  //   3. Fetch explícito al equipo como fallback
  const cargarCriterios = async (idExposicion, expsSource) => {
    if (!idExposicion) { setCriterios([]); return; }

    setLoadingCriterios(true);
    try {
      const lista = expsSource || exposiciones;
      const exp   = lista.find((e) => e.id_exposicion === parseInt(idExposicion));
      if (!exp) { setCriterios([]); return; }

      // Intentar obtener id_materia desde los datos ya cargados
      let idMat =
        exp?.equipos?.grupos?.id_materia ||
        exp?.equipos?.grupos?.materias?.id_materia;

      // Fallback: fetch explícito al equipo (ahora el backend devuelve id_materia)
      if (!idMat && exp.id_equipo) {
        const equipo = await apiFetch(`/api/equipos/${exp.id_equipo}`);
        idMat =
          equipo?.grupos?.id_materia ||
          equipo?.grupos?.materias?.id_materia;
      }

      if (!idMat) {
        toast("Esta exposición no tiene una materia asociada. Verifica que el equipo tenga un grupo asignado.", "error");
        setCriterios([]);
        setLoadingCriterios(false);
        return;
      }

      const crit = await apiFetch(`/api/criterios?id_materia=${idMat}`);
      setCriterios(crit);

      // Inicializar calificaciones en 5
      const init = {};
      crit.forEach((c) => { init[c.id_criterio] = 5; });
      setEvalForm((prev) => ({ ...prev, calificaciones: init }));
    } catch (e) {
      toast(e.message, "error");
    }
    setLoadingCriterios(false);
  };

  const handleExposicionChange = (idExposicion) => {
    setEvalForm((prev) => ({ ...prev, id_exposicion: idExposicion, calificaciones: {} }));
    cargarCriterios(idExposicion, null);
  };

  // ── Abrir modal para nueva evaluación (manual) ────────────────────────────
  const abrirNuevaEval = async () => {
    try {
      const [exps, alumnos] = await Promise.all([
        apiFetch("/api/exposiciones"),
        apiFetch("/api/alumnos"),
      ]);
      setExposiciones(exps);
      const propios = alumnos.filter((a) => a.id_usuario === usuario?.id_usuario);
      setMisAlumnos(propios);
      setEvalForm({
        id_exposicion: "",
        id_alumno_evaluador: propios[0]?.id_alumno?.toString() || "",
        comentario_general: "",
        calificaciones: {},
      });
      setCriterios([]);
      setEvalModal({ open: true });
    } catch (e) { toast(e.message, "error"); }
  };

  // ── Enviar evaluación ─────────────────────────────────────────────────────
  const handleSubmitEval = async () => {
    if (!evalForm.id_exposicion)        return toast("Selecciona una exposición.", "error");
    if (!evalForm.id_alumno_evaluador)  return toast("No se encontró tu registro de alumno. Pide al docente que vincule tu cuenta.", "error");
    if (criterios.length === 0)         return toast("Esta exposición no tiene criterios de evaluación.", "error");

    const calificaciones = criterios.map((c) => ({
      id_criterio: c.id_criterio,
      calificacion: parseFloat(evalForm.calificaciones[c.id_criterio] ?? 5),
    }));

    const invalida = calificaciones.find((c) => c.calificacion < 0 || c.calificacion > 10);
    if (invalida) return toast("Todas las calificaciones deben estar entre 0 y 10.", "error");

    setSaving(true);
    try {
      await apiFetch("/api/evaluaciones", {
        method: "POST",
        body: JSON.stringify({
          id_exposicion:       parseInt(evalForm.id_exposicion),
          id_alumno_evaluador: parseInt(evalForm.id_alumno_evaluador),
          comentario_general:  evalForm.comentario_general || null,
          calificaciones,
        }),
      });
      toast("¡Evaluación enviada correctamente! 🎉");
      setEvalModal({ open: false });
      fetchEvaluaciones();
    } catch (e) { toast(e.message, "error"); }
    setSaving(false);
  };

  // ── Ver detalle ───────────────────────────────────────────────────────────
  const verDetalle = async (id) => {
    try {
      const data = await apiFetch(`/api/evaluaciones/${id}`);
      setDetalleModal({ open: true, data });
    } catch (e) { toast(e.message, "error"); }
  };

  // ── Eliminar ──────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await apiFetch(`/api/evaluaciones/${confirm.id}`, { method: "DELETE" });
      toast("Evaluación eliminada.");
      setConfirm({ open: false, id: null });
      fetchEvaluaciones();
    } catch (e) { toast(e.message, "error"); }
    setDeleting(false);
  };

  const formatFecha = (f) =>
    f ? new Date(f).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" }) : "—";

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="page-anim">
      {/* Toolbar */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginBottom: "18px" }}>
        <button onClick={fetchEvaluaciones} style={btn("ghost")}>↻ Actualizar</button>
        {alumno && (
          <button onClick={abrirNuevaEval} style={btn("accent")}>Nueva evaluación</button>
        )}
      </div>

      {/* Tabla de evaluaciones */}
      <div style={{ ...card, padding: 0, overflow: "hidden" }}>
        {loading ? <LoadingSpinner /> : evaluaciones.length === 0 ? (
          <EmptyState
            title="Sin evaluaciones"
            description={alumno
              ? "Aún no has evaluado ninguna exposición. Ve a Exposiciones y haz clic en Evaluar."
              : "Aún no hay evaluaciones registradas."
            }
          />
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={th}>Exposición</th>
                {!alumno && <th style={th}>Evaluado por</th>}
                <th style={th}>Fecha</th>
                <th style={th}>Criterios calificados</th>
                <th style={{ ...th, textAlign: "right" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {evaluaciones.map((ev) => (
                <tr key={ev.id_evaluacion}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ ...td, fontWeight: "600", color: C.textPrimary }}>
                    {ev.exposiciones?.titulo || `Exp. #${ev.id_exposicion}`}
                  </td>
                  {!alumno && (
                    <td style={td}>
                      {ev.alumnos?.nombre} {ev.alumnos?.apellido}
                      <span style={{ color: C.textMuted, fontSize: "12px", marginLeft: "6px" }}>
                        ({ev.alumnos?.matricula})
                      </span>
                    </td>
                  )}
                  <td style={td}><span style={{ fontSize: "13px" }}>{formatFecha(ev.created_at)}</span></td>
                  <td style={td}>
                    <span style={{ background: "#dbeafe", color: "#1e40af", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" }}>
                      {ev.detalle_evaluacion?.length ?? 0} criterios
                    </span>
                  </td>
                  <td style={{ ...td, textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                      <button onClick={() => verDetalle(ev.id_evaluacion)} style={btn("ghost", "sm")}>👁 Ver</button>
                      {canDelete && (
                        <button onClick={() => setConfirm({ open: true, id: ev.id_evaluacion })} style={btn("danger", "sm")}>🗑</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Modal: Nueva evaluación ────────────────────────────────────────── */}
      <Modal
        open={evalModal.open}
        title="Evaluar exposición"
        onClose={() => setEvalModal({ open: false })}
        width="600px"
        footer={
          <>
            <button onClick={() => setEvalModal({ open: false })} style={btn("ghost")}>Cancelar</button>
            <button onClick={handleSubmitEval} disabled={saving || loadingCriterios} style={btn("accent")}>
              {saving ? "Enviando…" : "Enviar evaluación"}
            </button>
          </>
        }
      >
        {/* Selector de exposición */}
        <FormGroup label="Exposición a evaluar">
          <Sel
            value={evalForm.id_exposicion}
            onChange={(e) => handleExposicionChange(e.target.value)}
          >
            <option value="">Selecciona una exposición</option>
            {exposiciones.map((exp) => (
              <option key={exp.id_exposicion} value={exp.id_exposicion}>
                {exp.titulo} — {exp.equipos?.nombre_equipo || ""}
              </option>
            ))}
          </Sel>
        </FormGroup>

        {/* Info: evaluador */}
        {misAlumnos.length > 0 ? (
          <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: "9px", padding: "10px 14px", fontSize: "13px", color: "#0369a1" }}>
            Evaluando como: <strong>{misAlumnos[0]?.nombre} {misAlumnos[0]?.apellido}</strong> ({misAlumnos[0]?.matricula})
          </div>
        ) : (
          <div style={{ background: "#fef9c3", border: "1px solid #fde68a", borderRadius: "9px", padding: "10px 14px", fontSize: "13px", color: "#92400e" }}>
            Tu cuenta no está vinculada a un registro de alumno. Pide al docente o administrador que lo vincule para poder evaluar.
          </div>
        )}

        {/* Criterios de evaluación */}
        {loadingCriterios ? (
          <LoadingSpinner text="Cargando rúbrica…" />
        ) : criterios.length > 0 ? (
          <>
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "14px" }}>
              <p style={{ fontSize: "12px", fontWeight: "700", color: C.textSecond, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "12px" }}>
                Rúbrica de evaluación
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {criterios.map((c) => {
                  const val = evalForm.calificaciones[c.id_criterio] ?? 5;
                  return (
                    <div key={c.id_criterio} style={{ background: "#f8fafc", borderRadius: "10px", padding: "14px 16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                        <div>
                          <p style={{ fontWeight: "700", fontSize: "14px", color: C.textPrimary }}>{c.nombre_criterio}</p>
                          {c.descripcion && (
                            <p style={{ fontSize: "12px", color: C.textMuted, marginTop: "2px" }}>{c.descripcion}</p>
                          )}
                          <span style={{ fontSize: "11px", background: "#dbeafe", color: "#1e40af", padding: "2px 8px", borderRadius: "20px", fontWeight: "700", marginTop: "4px", display: "inline-block" }}>
                            Peso: {c.peso}%
                          </span>
                        </div>
                        <div style={{ textAlign: "center", flexShrink: 0, marginLeft: "16px" }}>
                          <span style={{ fontFamily: F.display, fontSize: "28px", fontWeight: "800", color: val >= 7 ? C.success : val >= 5 ? C.warning : C.danger }}>
                            {val}
                          </span>
                          <span style={{ fontSize: "12px", color: C.textMuted }}>/10</span>
                        </div>
                      </div>
                      {/* Slider */}
                      <input
                        type="range" min="0" max="10" step="0.5"
                        value={val}
                        onChange={(e) => setEvalForm((prev) => ({
                          ...prev,
                          calificaciones: { ...prev.calificaciones, [c.id_criterio]: parseFloat(e.target.value) },
                        }))}
                        style={{ width: "100%", accentColor: C.primary, cursor: "pointer" }}
                      />
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: C.textMuted, marginTop: "2px" }}>
                        <span>0 — Insuficiente</span>
                        <span>5 — Regular</span>
                        <span>10 — Excelente</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Comentario */}
            <FormGroup label="Comentario general (opcional)">
              <Txt
                value={evalForm.comentario_general}
                onChange={(e) => setEvalForm((prev) => ({ ...prev, comentario_general: e.target.value }))}
                placeholder="Escribe un comentario sobre la presentación…"
              />
            </FormGroup>

            {/* Resumen de calificación estimada */}
            {(() => {
              const sumaPesos = criterios.reduce((s, c) => s + parseFloat(c.peso), 0);
              if (sumaPesos === 0) return null;
              const calif = criterios.reduce((s, c) => {
                const val = evalForm.calificaciones[c.id_criterio] ?? 5;
                return s + (val * parseFloat(c.peso)) / 100;
              }, 0);
              return (
                <div style={{ background: "#0c1628", borderRadius: "12px", padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#94a3b8", fontSize: "13px", fontWeight: "600" }}>Tu calificación ponderada estimada</span>
                  <span style={{ fontFamily: F.display, fontSize: "26px", fontWeight: "800", color: C.accent }}>{calif.toFixed(1)}</span>
                </div>
              );
            })()}
          </>
        ) : evalForm.id_exposicion ? (
          <div style={{ background: "#fef9c3", border: "1px solid #fde68a", borderRadius: "9px", padding: "10px 14px", fontSize: "13px", color: "#92400e" }}>
            Esta exposición no tiene criterios de evaluación configurados. Contacta a tu docente.
          </div>
        ) : null}
      </Modal>

      {/* ── Modal: Detalle de evaluación ───────────────────────────────────── */}
      <Modal
        open={detalleModal.open}
        title="Detalle de evaluación"
        onClose={() => setDetalleModal({ open: false, data: null })}
        width="560px"
        footer={<button onClick={() => setDetalleModal({ open: false, data: null })} style={btn("primary")}>Cerrar</button>}
      >
        {detalleModal.data && (
          <>
            <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "12px 16px", marginBottom: "4px" }}>
              <p style={{ fontWeight: "700", fontSize: "15px", color: C.textPrimary }}>{detalleModal.data.exposiciones?.titulo}</p>
              <p style={{ fontSize: "13px", color: C.textMuted, marginTop: "2px" }}>
                Evaluado por: {detalleModal.data.alumnos?.nombre} {detalleModal.data.alumnos?.apellido} · {detalleModal.data.alumnos?.matricula}
              </p>
            </div>

            {detalleModal.data.detalle_evaluacion?.map((d) => (
              <div key={d.id_detalle} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", borderRadius: "9px", padding: "10px 14px" }}>
                <div>
                  <p style={{ fontWeight: "600", fontSize: "14px", color: C.textPrimary }}>{d.criterios?.nombre_criterio}</p>
                  <p style={{ fontSize: "12px", color: C.textMuted }}>Peso: {d.criterios?.peso}%</p>
                </div>
                <span style={{
                  fontFamily: F.display, fontSize: "22px", fontWeight: "800",
                  color: d.calificacion >= 7 ? C.success : d.calificacion >= 5 ? C.warning : C.danger
                }}>
                  {d.calificacion}<span style={{ fontSize: "13px", color: C.textMuted }}>/10</span>
                </span>
              </div>
            ))}

            {detalleModal.data.comentario_general && (
              <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: "9px", padding: "10px 14px", fontSize: "13px", color: "#0369a1" }}>
                {detalleModal.data.comentario_general}
              </div>
            )}
          </>
        )}
      </Modal>

      <ConfirmDialog
        open={confirm.open}
        onConfirm={handleDelete}
        onCancel={() => setConfirm({ open: false, id: null })}
        loading={deleting}
      />
    </div>
  );
}
