import { useState } from "react";
import { apiFetch, saveSession } from "../api/Client";
import { F, btn } from "../api/Tokens";

export default function LoginPage({ onLogin }) {
  const [form, setForm]       = useState({ email: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return setError("Completa todos los campos.");
    setError(""); setLoading(true);
    try {
      const data = await apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify(form) });
      saveSession(data.access_token, data.usuario);
      onLogin(data.usuario);
    } catch (err) {
      setError(err.message || "Credenciales incorrectas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f0f2f8",
      backgroundImage: "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(99,102,241,0.10) 0%, transparent 60%)",
      backgroundAttachment: "fixed",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: F.body, padding: "20px",
    }}>
      <div className="modal-anim" style={{ width: "100%", maxWidth: "420px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{
            fontFamily: F.display, fontSize: "2.4rem", fontWeight: "400",
            fontStyle: "italic", color: "#4338ca", letterSpacing: "-0.01em", lineHeight: 1,
          }}>
            Expos<span style={{ color: "#818cf8" }}>Calif</span>
            <span style={{ display: "inline-block", width: "7px", height: "7px", background: "#818cf8", borderRadius: "50%", marginLeft: "5px", verticalAlign: "middle", marginBottom: "5px" }} />
          </div>
          <p style={{ color: "#94a3b8", fontSize: "14px", marginTop: "8px", fontWeight: "400" }}>
            Sistema de calificación de exposiciones
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "#fff",
          borderRadius: "24px",
          padding: "36px",
          boxShadow: "0 12px 40px rgba(15,23,42,0.10), 0 4px 12px rgba(79,70,229,0.08)",
          border: "1px solid rgba(79,70,229,0.10)",
          position: "relative", overflow: "hidden",
        }}>
          {/* top accent bar */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, #6366f1, #818cf8, #a78bfa)" }} />

          <h2 style={{ fontFamily: F.display, fontSize: "1.55rem", fontWeight: "400", fontStyle: "italic", color: "#1e293b", marginBottom: "24px", letterSpacing: "-0.01em" }}>
            Bienvenido
          </h2>

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Correo electrónico
              </label>
              <input
                type="email" name="email" value={form.email} onChange={handle}
                placeholder="usuario@ejemplo.com" autoComplete="email"
                style={{ padding: "10px 14px", borderRadius: "9px", border: "1.5px solid rgba(79,70,229,0.15)", fontSize: "14px", fontFamily: F.body, color: "#0f172a", background: "#f8fafc", transition: "border-color .2s" }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Contraseña
              </label>
              <input
                type="password" name="password" value={form.password} onChange={handle}
                placeholder="••••••••" autoComplete="current-password"
                style={{ padding: "10px 14px", borderRadius: "9px", border: "1.5px solid rgba(79,70,229,0.15)", fontSize: "14px", fontFamily: F.body, color: "#0f172a", background: "#f8fafc", transition: "border-color .2s" }}
              />
            </div>

            {error && (
              <div style={{ background: "#fff1f2", border: "1px solid #fca5a5", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", color: "#9f1239", fontWeight: "600" }}>
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              style={{ ...btn("primary", "lg"), justifyContent: "center", marginTop: "4px", opacity: loading ? 0.7 : 1, background: "#4f46e5", boxShadow: "0 4px 14px rgba(79,70,229,0.35)" }}
            >
              {loading ? "Ingresando..." : "Ingresar al sistema →"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "12px", marginTop: "20px" }}>
          ¿No tienes cuenta? Solicítala a tu docente o administrador.
        </p>
      </div>
    </div>
  );
}
