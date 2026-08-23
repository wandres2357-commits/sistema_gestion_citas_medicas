// backend/src/modules/auth/auth.service.js

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import * as repository from "./auth.repository.js";

function crearError(message, code) {
  const error = new Error(message);
  error.code = code;

  return error;
}

function usuarioEstaActivo(estado) {
  if (
    estado === null ||
    estado === undefined
  ) {
    return true;
  }

  if (typeof estado === "number") {
    return estado === 1;
  }

  const valor = String(estado)
    .trim()
    .toUpperCase();

  return [
    "1",
    "ACTIVO",
    "ACTIVE",
    "HABILITADO",
  ].includes(valor);
}

function normalizarRoles(roles = []) {
  if (!Array.isArray(roles)) {
    return [];
  }

  return roles
    .map((role) => {
      if (typeof role === "string") {
        return role
          .trim()
          .toLowerCase();
      }

      return String(
        role?.nombre ||
        role?.rol ||
        role?.role ||
        ""
      )
        .trim()
        .toLowerCase();
    })
    .filter(Boolean);
}

function generarToken(usuario, roles) {
  if (!process.env.JWT_SECRET) {
    throw crearError(
      "JWT_SECRET no está configurado en el servidor.",
      "JWT_NOT_CONFIGURED"
    );
  }

  return jwt.sign(
    {
      id: usuario.id,
      correo: usuario.correo,
      nombre_completo:
        usuario.nombre_completo,
      roles,
    },
    process.env.JWT_SECRET,
    {
      algorithm: "HS256",
      expiresIn:
        process.env.JWT_EXPIRES_IN ||
        "8h",
      issuer: "sgcm-backend",
      audience: "sgcm-frontend",
    }
  );
}

export async function login(
  identificador,
  password
) {
  const correo = String(
    identificador || ""
  )
    .trim()
    .toLowerCase();

  const usuario =
    await repository.findByCorreo(
      correo
    );

  if (!usuario) {
    throw crearError(
      "Usuario no existe.",
      "USER_NOT_FOUND"
    );
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

  const passwordValido =
    await bcrypt.compare(
      password,
      usuario.password_hash
    );

  if (!passwordValido) {
    throw crearError(
      "Contraseña incorrecta.",
      "INVALID_PASSWORD"
    );
  }

  /*
   * Mientras se implementa la consulta real a usuario_roles,
   * se conserva el rol administrativo usado actualmente.
   */
  const roles = normalizarRoles([
    "administrador",
  ]);

  const token = generarToken(
    usuario,
    roles
  );

  return {
    token,

    user: {
      id: usuario.id,
      nombre_completo:
        usuario.nombre_completo,
      correo: usuario.correo,
      roles,
    },
  };
}