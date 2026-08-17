import { pool } from "../../config/db.js";

export async function findByCorreo(correo) {
  const [rows] = await pool.query(
    `
    SELECT
      id,
      nombre_completo,
      correo,
      password_hash,
      estado
    FROM usuarios
    WHERE correo = ?
    LIMIT 1
    `,
    [correo]
  );

  return rows[0];
}