// backend/src/modules/auth/auth.repository.js
import { pool } from "../../config/db.js";

export async function findByCorreo(correo) {
  const correoNormalizado = String(correo || "")
    .trim()
    .toLowerCase();

  const [rows] = await pool.query(
    `
      SELECT
        id,
        nombre_completo,
        correo,
        password_hash,
        estado
      FROM usuarios
      WHERE LOWER(TRIM(correo)) = ?
      LIMIT 1
    `,
    [correoNormalizado]
  );

  return rows[0] || null;
}