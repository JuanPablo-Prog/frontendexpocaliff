// ─── Color palette ───────────────────────────────────────────────────────────
export const C = {
  // Brand / Indigo
  brand:        "#4f46e5",
  brandHov:     "#4338ca",
  brandLight:   "#eef2ff",
  brandBorder:  "rgba(79,70,229,0.18)",
  brandBorderSt:"rgba(79,70,229,0.30)",

  // Page / Card
  pageBg:      "#f0f2f8",
  cardBg:      "#ffffff",
  contentBg:   "#f0f2f8",
  rowHov:      "#f8fafc",

  // Sidebar
  sidebar:     "#0c1628",
  sidebarHov:  "#162033",

  // Accent
  accent:      "#f59e0b",
  accentHov:   "#d97706",
  accentLight: "#fffbeb",

  // Semantic
  primary:     "#4f46e5",
  primaryHov:  "#4338ca",
  danger:      "#e11d48",
  dangerLight: "#fff1f2",
  success:     "#059669",
  successLight:"#ecfdf5",
  warning:     "#d97706",
  warningLight:"#fffbeb",

  // Text
  textPrimary: "#0f172a",
  textSecond:  "#475569",
  textMuted:   "#94a3b8",
  textInverse: "#ffffff",

  // Borders / Shadows
  border:      "rgba(79,70,229,0.12)",
  borderDark:  "rgba(79,70,229,0.22)",
  shadowSm:    "0 1px 3px rgba(15,23,42,.06), 0 1px 2px rgba(15,23,42,.04)",
  shadowMd:    "0 4px 16px rgba(15,23,42,.08), 0 2px 6px rgba(15,23,42,.05)",
  shadowLg:    "0 12px 40px rgba(15,23,42,.10), 0 4px 12px rgba(15,23,42,.06)",
};

// ─── Fonts ────────────────────────────────────────────────────────────────────
export const F = {
  display: "'Instrument Serif', serif",
  body:    "'DM Sans', system-ui, sans-serif",
};

// ─── Layout ───────────────────────────────────────────────────────────────────
export const S = {
  sidebar: { width: "240px", minWidth: "240px" },
  container: { maxWidth: "1340px", minHeight: "88vh", borderRadius: "20px" },
};

// ─── Button ───────────────────────────────────────────────────────────────────
export const btn = (variant = "primary", size = "md") => {
  const base = {
    border: "none", fontWeight: "600", fontFamily: F.body,
    display: "inline-flex", alignItems: "center", gap: "6px",
    cursor: "pointer", transition: "all 0.16s ease", whiteSpace: "nowrap",
    letterSpacing: "0.01em",
  };
  const variants = {
    primary: { background: C.brand,    color: "#fff", boxShadow: "0 2px 8px rgba(79,70,229,0.28)" },
    accent:  { background: C.accent,   color: "#fff", boxShadow: "0 2px 8px rgba(245,158,11,0.28)" },
    danger:  { background: C.danger,   color: "#fff", boxShadow: "0 2px 8px rgba(225,29,72,0.20)" },
    success: { background: C.success,  color: "#fff", boxShadow: "0 2px 8px rgba(5,150,105,0.25)" },
    ghost:   { background: "#fff", color: C.textSecond, border: `1.5px solid ${C.border}`, boxShadow: C.shadowSm },
    link:    { background: "transparent", color: C.brand, padding: "0" },
  };
  const sizes = {
    sm: { padding: "5px 12px",  fontSize: "12px", borderRadius: "7px" },
    md: { padding: "8px 16px",  fontSize: "13px", borderRadius: "9px" },
    lg: { padding: "11px 22px", fontSize: "15px", borderRadius: "10px" },
  };
  return { ...base, ...variants[variant], ...sizes[size], border: variants[variant].border || "none" };
};

// ─── Card ─────────────────────────────────────────────────────────────────────
export const card = {
  background: C.cardBg,
  borderRadius: "14px",
  border: `1px solid ${C.border}`,
  padding: "22px 24px",
  boxShadow: C.shadowSm,
  position: "relative",
  overflow: "hidden",
};

// ─── Table cells ──────────────────────────────────────────────────────────────
export const th = {
  padding: "10px 16px",
  fontSize: "11px",
  fontWeight: "700",
  textTransform: "uppercase",
  letterSpacing: "0.7px",
  color: C.textMuted,
  background: "#f8fafc",
  borderBottom: `2px solid ${C.border}`,
  textAlign: "left",
  whiteSpace: "nowrap",
};

export const td = {
  padding: "12px 16px",
  fontSize: "14px",
  color: C.textSecond,
  borderBottom: `1px solid #f1f5f9`,
  verticalAlign: "middle",
};

// ─── Input / label ────────────────────────────────────────────────────────────
export const input = {
  padding: "9px 13px", borderRadius: "8px",
  border: `1.5px solid rgba(79,70,229,0.15)`,
  fontSize: "14px", fontFamily: F.body,
  color: C.textPrimary, background: "#f8fafc", width: "100%",
};

export const label = {
  fontSize: "11px", fontWeight: "700", color: C.textSecond,
  textTransform: "uppercase", letterSpacing: "0.6px",
  marginBottom: "4px", display: "block",
};