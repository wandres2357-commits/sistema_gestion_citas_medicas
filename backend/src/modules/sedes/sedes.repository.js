import { pool } from "../../config/db.js";

/**
 * Listar todas las sedes
 */
export async function getAll() {
  const [rows] = await pool.query(`
    SELECT
      id,
      ips,
      sede,
      telefono,
      correo,
      direccion_texto,
      estado
    FROM vw_sedes
    ORDER BY sede
  `);

  return rows;
}

/**
 * Buscar una sede por ID
 */
export async function getById(id) {
  const [rows] = await pool.query(
    `
    SELECT
      id,
      ips,
      sede,
      telefono,
      correo,
      direccion_texto,
      estado
    FROM vw_sedes
    WHERE id = ?
    LIMIT 1
    `,
    [id]
  );

  return rows[0];
}

/**
 * Crear sede
 *
 * NOTA:
 * Inicialmente usaremos
 * IPS Cayre
 * y una dirección existente.
 */
export async function create(data) {
  const [result] = await pool.query(
    `
    INSERT INTO sedes
    (
      ips_id,
      direccion_id,
      nombre,
      telefono,
      correo,
      estado
    )
    VALUES
    (
      1,
      1,
      ?,
      ?,
      ?,
      1
    )
    `,
    [
      data.sede,
      data.telefono,
      data.correo
    ]
  );

  return result.insertId;
}

/**
 * Actualizar sede
 */
export async function update(
  id,
  data
) {
  await pool.query(
    `
    UPDATE sedes
    SET
      nombre = ?,
      telefono = ?,
      correo = ?
    WHERE id = ?
    `,
    [
      data.sede,
      data.telefono,
      data.correo,
      id
    ]
  );
}

/**
 * Eliminación lógica
 */
export async function remove(id) {

  const [result] =
    await pool.query(
      `
      UPDATE sedes
      SET estado = 0
      WHERE id = ?
      `,
      [id]
    );

  return result;
}
export async function getComboSedes() {

  const [rows] =
    await pool.query(`
      SELECT
        id,
        nombre
      FROM sedes
      WHERE estado = 1
      ORDER BY nombre
    `);

  return rows;
}