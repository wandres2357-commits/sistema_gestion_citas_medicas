// backend/src/modules/auth/auth.service.js
import bcrypt from "bcryptjs";
import * as repository from "./auth.repository.js";

function crearError(message, code) {
  const error = new Error(message);
  error.code = code;
  return error;
}

function usuarioEstaActivo(estado) {
  if (estado === null || estado === undefined) {
    return true;
  }

  if (typeof estado === "number") {
    return estado === 1;
  }

  const valor = String(estado).trim().toUpperCase();

  return ["1", "ACTIVO", "ACTIVE", "HABILITADO"].includes(valor);
}

export async function login(identificador, password) {
  const correo = String(identificador || "")
    .trim()
    .toLowerCase();

  const usuario = await repository.findByCorreo(correo);

  if (!usuario) {
    throw crearError("Usuario no existe.", "USER_NOT_FOUND");
  }

  if (!usuarioEstaActivo(usuario.estado)) {
    throw crearError(
      "El usuario se encuentra inactivo.",
      "USER_INACTIVE"
    );
  }

  if (!usuario.password_hash) {
    throw crearError(
      "El usuario no tiene una contraseña configurada.",
      "INVALID_PASSWORD"
    );
  }

  const passwordValido = await bcrypt.compare(
    password,
    usuario.password_hash
  );

  if (!passwordValido) {
    throw crearError(
      "Contraseña incorrecta.",
      "INVALID_PASSWORD"
    );
  }

  return {
    token: "SGCM-DEMO-TOKEN",
    user: {
      id: usuario.id,
      nombre_completo: usuario.nombre_completo,
      correo: usuario.correo,
      roles: ["administrador"],
    },
  };
}