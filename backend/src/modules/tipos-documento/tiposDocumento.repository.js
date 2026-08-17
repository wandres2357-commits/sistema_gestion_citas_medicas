import { pool } from "../../config/db.js";

/**
 * Listar tipos documento
 */
export async function getAll() {

  const [rows] =
    await pool.query(`
      SELECT
        id,
        codigo,
        descripcion
      FROM tipos_documento
      ORDER BY descripcion
    `);

  return rows;
}

/**
 * Buscar por ID
 */
export async function getById(id) {

  const [rows] =
    await pool.query(
      `
      SELECT
        id,
        codigo,
        descripcion
      FROM tipos_documento
      WHERE id = ?
      `,
      [id]
    );

  return rows[0];
}