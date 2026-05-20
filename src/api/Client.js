const API_URL = import.meta.env.VITE_API_URL || "https://exposcalif-backend-v2.onrender.com";

export const getToken   = () => localStorage.getItem("ec_token");
export const getUsuario = () => JSON.parse(localStorage.getItem("ec_usuario") || "null");

export const saveSession = (token, usuario) => {
  localStorage.setItem("ec_token", token);
  localStorage.setItem("ec_usuario", JSON.stringify(usuario));
};

export const clearSession = () => {
  localStorage.removeItem("ec_token");
  localStorage.removeItem("ec_usuario");
};

export const apiFetch = async (endpoint, options = {}) => {
  const token = getToken();

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    clearSession();
    window.location.reload();
    return;
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error en la petición");
  return data;
};