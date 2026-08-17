import { pool } from "../../config/db.js";

/**
 * Listar médicos
 */
export async function getAll() {
  const [rows] = await pool.query(`
    SELECT *
    FROM vw_medicos
    ORDER BY nombre_completo
  `);

  return rows;
}

/**
 * Buscar médico por ID
 */
export async function getById(id) {
  const [rows] = await pool.query(
    `
    SELECT *
    FROM vw_medicos
    WHERE id = ?
    LIMIT 1
    `,
    [id]
  );

  return rows[0];
}

/**
 * Crear médico
 */
export async function create(data) {

  const nombreCompleto =
    `${data.primer_nombre || ""} ${data.segundo_nombre || ""} ${data.primer_apellido || ""} ${data.segundo_apellido || ""}`
      .replace(/\s+/g, " ")
      .trim();

  const [result] = await pool.query(
    `
    INSERT INTO medicos_salud
    (
      codigo,
      tipo,
      tipo_documento_id,
      numero_documento,
      primer_nombre,
      segundo_nombre,
      primer_apellido,
      segundo_apellido,
      nombre_completo,
      correo,
      telefono_movil,
      tarjeta_profesional,
      tipo_vinculacion,
      estado
    )
    VALUES
    (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
    `,
    [
      data.codigo,
      data.tipo,
      data.tipo_documento_id,
      data.numero_documento,
      data.primer_nombre,
      data.segundo_nombre,
      data.primer_apellido,
      data.segundo_apellido,
      nombreCompleto,
      data.correo,
      data.telefono_movil,
      data.tarjeta_profesional,
      data.tipo_vinculacion,
      data.estado ?? 1
    ]
  );

  const medicoId = result.insertId;

  /**
   * Especialidad principal
   */
  if (
  data.medico_especialidades &&
  data.medico_especialidades.length > 0
) {

  for (
    const item of
    data.medico_especialidades
  ) {

    await pool.query(
      `
      INSERT INTO medico_especialidad
      (
        medico_id,
        especialidad_id,
        activa,
        principal,
        interconsulta
      )
      VALUES
      (
        ?, ?, ?, ?, ?
      )
      `,
      [
        medicoId,
        item.especialidad_id,
        item.activa ? 1 : 0,
        item.principal ? 1 : 0,
        item.interconsulta ? 1 : 0
      ]
    );
  }
}

  /**
   * Sede
   */
  if (data.sede_id) {

    await pool.query(
      `
      INSERT INTO medico_sede
      (
        medico_id,
        sede_id
      )
      VALUES
      (
        ?, ?
      )
      `,
      [
        medicoId,
        data.sede_id
      ]
    );
  }

  /**
   * Consultorio
   */
  if (data.consultorio_id) {

    await pool.query(
      `
      INSERT INTO medico_consultorio
      (
        medico_id,
        consultorio_id
      )
      VALUES
      (
        ?, ?
      )
      `,
      [
        medicoId,
        data.consultorio_id
      ]
    );
  }

  return medicoId;
}

/**
 * Actualizar médico
 */
export async function update(id, data) {

  const nombreCompleto =
    `${data.primer_nombre || ""} ${data.segundo_nombre || ""} ${data.primer_apellido || ""} ${data.segundo_apellido || ""}`
      .replace(/\s+/g, " ")
      .trim();

  await pool.query(
    `
    UPDATE medicos_salud
    SET
      codigo = ?,
      tipo = ?,
      tipo_documento_id = ?,
      numero_documento = ?,
      primer_nombre = ?,
      segundo_nombre = ?,
      primer_apellido = ?,
      segundo_apellido = ?,
      nombre_completo = ?,
      correo = ?,
      telefono_movil = ?,
      tarjeta_profesional = ?,
      tipo_vinculacion = ?
    WHERE id = ?
    `,
    [
      data.codigo,
      data.tipo,
      data.tipo_documento_id,
      data.numero_documento,
      data.primer_nombre,
      data.segundo_nombre,
      data.primer_apellido,
      data.segundo_apellido,
      nombreCompleto,
      data.correo,
      data.telefono_movil,
      data.tarjeta_profesional,
      data.tipo_vinculacion,
      id
    ]
  );

  /**
   * Especialidad
   */
  await pool.query(
    `
    DELETE
    FROM medico_especialidad
    WHERE medico_id = ?
    `,
    [id]
  );

  if (data.especialidad_id) {

    await pool.query(
      `
      INSERT INTO medico_especialidad
      (
        medico_id,
        especialidad_id,
        activa,
        principal,
        interconsulta
      )
      VALUES
      (
        ?, ?, 1, 1, 0
      )
      `,
      [
        id,
        data.especialidad_id
      ]
    );
  }

  /**
   * Sede
   */
  await pool.query(
    `
    DELETE
    FROM medico_sede
    WHERE medico_id = ?
    `,
    [id]
  );

  if (data.sede_id) {

    await pool.query(
      `
      INSERT INTO medico_sede
      (
        medico_id,
        sede_id
      )
      VALUES
      (
        ?, ?
      )
      `,
      [
        id,
        data.sede_id
      ]
    );
  }

  /**
   * Consultorio
   */
  await pool.query(
    `
    DELETE
    FROM medico_consultorio
    WHERE medico_id = ?
    `,
    [id]
  );

  if (data.consultorio_id) {

    await pool.query(
      `
      INSERT INTO medico_consultorio
      (
        medico_id,
        consultorio_id
      )
      VALUES
      (
        ?, ?
      )
      `,
      [
        id,
        data.consultorio_id
      ]
    );
  }

  return true;
}

/**
 * Eliminación lógica
 */
export async function remove(id) {

  const [result] =
    await pool.query(
      `
      UPDATE medicos_salud
      SET estado = 0
      WHERE id = ?
      `,
      [id]
    );

  return result;
}