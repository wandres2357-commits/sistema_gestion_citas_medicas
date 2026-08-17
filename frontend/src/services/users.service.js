// frontend/src/services/users.service.js
import { apiFetch } from "./api";

export function getUsers() {
  return apiFetch("/api/users");
}