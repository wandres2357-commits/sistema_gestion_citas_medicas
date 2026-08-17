import { pool } from "../../config/db.js";

export async function getAll() {
  const [rows] = await pool.query(`
    SELECT
    id,
    codigo,
    descripcion,
    activa,
    principal,
    interconsulta
    FROM especialidades
    WHERE activa = 1
    ORDER BY descripcion
  `);
  return rows;
}

export async function create(data) {
  const [result] = await pool.query(
    `
    INSERT INTO especialidades
    (
      codigo,
      descripcion,
      activa,
      principal,
      interconsulta
    )
    VALUES
    (?, ?, 1, 1, 0)
    `,
    [
      data.codigo,
      data.descripcion
    ]
  );

  return result.insertId;
}

export async function update(
  id,
  data
) {
  await pool.query(
    `
    UPDATE especialidades
    SET
      codigo = ?,
      descripcion = ?
    WHERE id = ?
    `,
    [
      data.codigo,
      data.descripcion,
      id
    ]
  );
}
/** * Eliminación lógica */
export async function remove(id) {

  const [result] =
    await pool.query(
      `
      UPDATE especialidades
      SET activa = 0
      WHERE id = ?
      `,
      [id]
    );

  return result;
}
export async function getByCodigo(
  codigo
) {

  const [rows] =
    await pool.query(
      `
      SELECT id
      FROM especialidades
      WHERE codigo = ?
      LIMIT 1
      `,
      [codigo]
    );

  return rows[0];
}