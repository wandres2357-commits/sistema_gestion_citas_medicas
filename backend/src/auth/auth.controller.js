// backend/src/auth/auth.controller.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const login = async (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({
      message: "Correo y contraseña son obligatorios",
    });
  }

  try {
    const correoNormalizado = String(correo).trim().toLowerCase();

    const [users] = await pool.query(
      `
      SELECT 
        id,
        nombre_completo,
        correo,
        password_hash,
        activo
      FROM usuarios
      WHERE LOWER(correo) = ? AND activo = 1
      LIMIT 1
      `,
      [correoNormalizado]
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: "Credenciales inválidas",
      });
    }

    const user = users[0];

    const passwordCorrecta = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordCorrecta) {
      return res.status(401).json({
        message: "Credenciales inválidas",
      });
    }

    const [roles] = await pool.query(
      `
      SELECT LOWER(r.nombre) AS nombre
      FROM roles r
      INNER JOIN usuario_roles ur ON ur.rol_id = r.id
      WHERE ur.usuario_id = ?
      `,
      [user.id]
    );

    const rolesArray = roles.map((r) => r.nombre);

    const token = jwt.sign(
      {
        id: user.id,
        correo: user.correo,
        roles: rolesArray,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "2h",
      }
    );

    console.log("LOGIN OK");
console.log(usuario);
  } catch (error) {
    console.error("ERROR LOGIN:", error);
    res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};