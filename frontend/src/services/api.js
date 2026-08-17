// frontend/src/services/api.js
import { getToken, logout } from "@/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function apiFetch(path, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  let data = null;

  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (res.status === 401) {
    logout();
    window.dispatchEvent(new Event("auth:expired"));
    throw new Error(data?.message || "Sesión expirada");
  }

  if (!res.ok) {
    throw new Error(data?.message || "Error en la solicitud");
  }

  return data;
}