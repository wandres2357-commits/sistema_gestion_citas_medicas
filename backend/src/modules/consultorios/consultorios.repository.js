import { pool } from "../../config/db.js";

export async function getAll() {
  const [rows] = await pool.query(`
    SELECT
      id,
      sede_id,
      sede,
      area_id,
      area,
      consultorio,
      piso,
      estado
    FROM vw_consultorios
    ORDER BY consultorio
  `);

  return rows;
}

export async function create(data) {
  const [result] = await pool.query(
    `
    INSERT INTO consultorios
    (
      sede_id,
      area_id,
      nombre,
      piso,
      estado
    )
    VALUES
    (
      ?,
      ?,
      ?,
      ?,
      1
    )
    `,
    [
      data.sede_id,
      data.area_id,
      data.consultorio,
      data.piso
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
    UPDATE consultorios
    SET
      sede_id = ?,
      area_id = ?,
      nombre = ?,
      piso = ?
    WHERE id = ?
    `,
    [
      data.sede_id,
      data.area_id,
      data.consultorio,
      data.piso,
      id
    ]
  );
}

export async function remove(id) {
  await pool.query(
    `
    UPDATE consultorios
    SET estado = 0
    WHERE id = ?
    `,
    [id]
  );
}