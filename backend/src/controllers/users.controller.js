// backend/src/controllers/users.controller.js
import pool from "../config/db.js";

export const getUsers = async (req, res) => {
  try {
    const [users] = await pool.query(
      `
      SELECT 
        u.id,
        u.nombre_completo,
        u.correo,
        u.activo,
        GROUP_CONCAT(r.nombre) AS roles
      FROM usuarios u
      LEFT JOIN usuario_roles ur ON ur.usuario_id = u.id
      LEFT JOIN roles r ON r.id = ur.rol_id
      GROUP BY u.id, u.nombre_completo, u.correo, u.activo
      ORDER BY u.id DESC
      `
    );

    const formatted = users.map((u) => ({
      id: u.id,
      nombre: u.nombre_completo,
      correo: u.correo,
      activo: Boolean(u.activo),
      roles: u.roles ? u.roles.split(",") : [],
    }));

    res.json(formatted);
  } catch (error) {
    console.error("ERROR GET USERS:", error);
    res.status(500).json({
      message: "Error al consultar usuarios",
    });
  }
};