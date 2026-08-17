import { pool } from "../../config/db.js";

export async function getAll() {

  const [rows] =
    await pool.query(`
      SELECT
        id,
        sede_id,
        nombre,
        estado
      FROM areas
      WHERE estado = 1
      ORDER BY nombre
    `);

  return rows;
}