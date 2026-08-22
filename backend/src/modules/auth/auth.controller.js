// backend/src/modules/auth/auth.controller.js
import * as service from "./auth.service.js";

function obtenerIdentificador(body = {}) {
  return String(
    body.correo ||
    body.email ||
    body.usuario ||
    body.identificador ||
    body.documento ||
    ""
  ).trim();
}

function obtenerPassword(body = {}) {
  return String(
    body.password ||
    body.contrasena ||
    body.contraseña ||
    ""
  );
}

export async function login(req, res) {
  try {
    const identificador = obtenerIdentificador(req.body);
    const password = obtenerPassword(req.body);

    if (!identificador) {
      return res.status(400).json({
        ok: false,
        message: "El correo, usuario o documento es obligatorio.",
      });
    }

    if (!password) {
      return res.status(400).json({
        ok: false,
        message: "La contraseña es obligatoria.",
      });
    }

    const data = await service.login(identificador, password);

    return res.status(200).json({
      ok: true,
      ...data,
    });
  } catch (error) {
    console.error("ERROR LOGIN:", error.message);

    const status =
      error.code === "USER_NOT_FOUND" ||
      error.code === "INVALID_PASSWORD" ||
      error.code === "USER_INACTIVE"
        ? 401
        : 500;

    return res.status(status).json({
      ok: false,
      message: error.message || "No fue posible iniciar sesión.",
    });
  }
}