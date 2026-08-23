// backend/src/middleware/auth.middleware.js

import jwt from "jsonwebtoken";

/**
 * Extrae y valida el JWT enviado mediante:
 *
 * Authorization: Bearer <token>
 *
 * Cuando el token es válido, guarda el payload en req.user.
 */
export function verifyToken(req, res, next) {
  const authHeader =
    req.headers.authorization || "";

  if (!authHeader) {
    return res.status(401).json({
      ok: false,
      message:
        "Token de autenticación requerido.",
    });
  }

  const [scheme, token] =
    authHeader.split(" ");

  if (
    scheme?.toLowerCase() !== "bearer" ||
    !token
  ) {
    return res.status(401).json({
      ok: false,
      message:
        "Formato de autorización inválido. Use Bearer <token>.",
    });
  }

  if (!process.env.JWT_SECRET) {
    console.error(
      "JWT_SECRET no está configurado."
    );

    return res.status(500).json({
      ok: false,
      message:
        "La autenticación del servidor no está configurada.",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
      {
        algorithms: ["HS256"],
      }
    );

    if (!decoded?.id) {
      return res.status(401).json({
        ok: false,
        message:
          "El token no contiene un usuario válido.",
      });
    }

    req.user = {
      id: Number(decoded.id),
      correo: decoded.correo || null,
      nombre_completo:
        decoded.nombre_completo || null,
      roles: Array.isArray(decoded.roles)
        ? decoded.roles
        : [],
    };

    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        ok: false,
        message:
          "La sesión expiró. Inicie sesión nuevamente.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        ok: false,
        message:
          "Token de autenticación inválido.",
      });
    }

    console.error(
      "ERROR verifyToken:",
      error
    );

    return res.status(401).json({
      ok: false,
      message:
        "No fue posible validar la sesión.",
    });
  }
}
