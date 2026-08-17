import { pool } from "../../config/db.js";

export async function getAll() {

  const [rows] =
    await pool.query(`
      SELECT
        id,
        agenda_id,
        medico_id,
        codigo_medico,
        nombre_medico,
        especialidad_id,
        codigo_especialidad,
        especialidad,
        sede_id,
        sede,
        consultorio_id,
        consultorio,
        dia_semana,
        hora_inicio,
        hora_fin,
        duracion_cita,
        fecha_inicio,
        fecha_fin,
        estado,
        observacion,
        creado_en,
        actualizado_en
      FROM vw_horarios_medicos
      WHERE estado = 1
      ORDER BY
        nombre_medico,
        dia_semana,
        hora_inicio
    `);

  return rows;
}

export async function getById(id) {

  const [rows] =
    await pool.query(
      `
      SELECT
        id,
        agenda_id,
        medico_id,
        codigo_medico,
        nombre_medico,
        especialidad_id,
        codigo_especialidad,
        especialidad,
        sede_id,
        sede,
        consultorio_id,
        consultorio,
        dia_semana,
        hora_inicio,
        hora_fin,
        duracion_cita,
        fecha_inicio,
        fecha_fin,
        estado,
        observacion,
        creado_en,
        actualizado_en
      FROM vw_horarios_medicos
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

  return rows[0];
}

export async function medicoExisteActivo(
  medicoId
) {

  const [rows] =
    await pool.query(
      `
      SELECT id
      FROM medicos_salud
      WHERE id = ?
        AND estado = 1
      LIMIT 1
      `,
      [medicoId]
    );

  return rows[0];
}

export async function especialidadDelMedicoExiste(
  medicoId,
  especialidadId
) {

  const [rows] =
    await pool.query(
      `
      SELECT medico_id
      FROM medico_especialidad
      WHERE medico_id = ?
        AND especialidad_id = ?
        AND activa = 1
      LIMIT 1
      `,
      [
        medicoId,
        especialidadId
      ]
    );

  return rows[0];
}

export async function sedeExisteActiva(
  sedeId
) {

  const [rows] =
    await pool.query(
      `
      SELECT id
      FROM sedes
      WHERE id = ?
        AND estado = 1
      LIMIT 1
      `,
      [sedeId]
    );

  return rows[0];
}

export async function consultorioExisteActivo(
  consultorioId
) {

  const [rows] =
    await pool.query(
      `
      SELECT id
      FROM consultorios
      WHERE id = ?
        AND estado = 1
      LIMIT 1
      `,
      [consultorioId]
    );

  return rows[0];
}

export async function consultorioPerteneceASede(
  consultorioId,
  sedeId
) {

  const [rows] =
    await pool.query(
      `
      SELECT id
      FROM consultorios
      WHERE id = ?
        AND sede_id = ?
        AND estado = 1
      LIMIT 1
      `,
      [
        consultorioId,
        sedeId
      ]
    );

  return rows[0];
}

export async function existeTraslapeMedico(
  data,
  excludeId = null
) {

  const params = [
    data.medico_id,
    data.dia_semana,
    data.hora_fin,
    data.hora_inicio
  ];

  let extraWhere = "";

  if (excludeId) {
    extraWhere =
      "AND id <> ?";

    params.push(
      excludeId
    );
  }

  const [rows] =
    await pool.query(
      `
      SELECT id
      FROM horarios_medicos
      WHERE medico_id = ?
        AND dia_semana = ?
        AND estado = 1
        AND hora_inicio < ?
        AND hora_fin > ?
        ${extraWhere}
      LIMIT 1
      `,
      params
    );

  return rows[0];
}

export async function existeTraslapeConsultorio(
  data,
  excludeId = null
) {

  const params = [
    data.consultorio_id,
    data.dia_semana,
    data.hora_fin,
    data.hora_inicio
  ];

  let extraWhere = "";

  if (excludeId) {
    extraWhere =
      "AND id <> ?";

    params.push(
      excludeId
    );
  }

  const [rows] =
    await pool.query(
      `
      SELECT id
      FROM horarios_medicos
      WHERE consultorio_id = ?
        AND dia_semana = ?
        AND estado = 1
        AND hora_inicio < ?
        AND hora_fin > ?
        ${extraWhere}
      LIMIT 1
      `,
      params
    );

  return rows[0];
}

export async function create(data) {

  const [result] =
    await pool.query(
      `
      INSERT INTO horarios_medicos
      (
        agenda_id,
        medico_id,
        especialidad_id,
        sede_id,
        consultorio_id,
        dia_semana,
        hora_inicio,
        hora_fin,
        duracion_cita,
        fecha_inicio,
        fecha_fin,
        estado,
        observacion
      )
      VALUES
      (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
      `,
      [
        data.agenda_id || null,
        data.medico_id,
        data.especialidad_id,
        data.sede_id,
        data.consultorio_id,
        data.dia_semana,
        data.hora_inicio,
        data.hora_fin,
        data.duracion_cita,
        data.fecha_inicio || null,
        data.fecha_fin || null,
        data.estado ?? 1,
        data.observacion || null
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
    UPDATE horarios_medicos
    SET
      agenda_id = ?,
      medico_id = ?,
      especialidad_id = ?,
      sede_id = ?,
      consultorio_id = ?,
      dia_semana = ?,
      hora_inicio = ?,
      hora_fin = ?,
      duracion_cita = ?,
      fecha_inicio = ?,
      fecha_fin = ?,
      estado = ?,
      observacion = ?
    WHERE id = ?
    `,
    [
      data.agenda_id || null,
      data.medico_id,
      data.especialidad_id,
      data.sede_id,
      data.consultorio_id,
      data.dia_semana,
      data.hora_inicio,
      data.hora_fin,
      data.duracion_cita,
      data.fecha_inicio || null,
      data.fecha_fin || null,
      data.estado ?? 1,
      data.observacion || null,
      id
    ]
  );

  return true;
}

export async function remove(id) {

  const [result] =
    await pool.query(
      `
      UPDATE horarios_medicos
      SET estado = 0
      WHERE id = ?
      `,
      [id]
    );

  return result;
}