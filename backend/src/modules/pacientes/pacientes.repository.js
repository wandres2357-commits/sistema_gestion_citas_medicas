const db = require('../../config/db');

async function buscarPacientes(filters) {
  const params = [];
  const where = [];

  if (filters.documento) {
    where.push('documento LIKE ?');
    params.push(`%${filters.documento}%`);
  }

  if (filters.tipoDocumentoId) {
    where.push('tipo_documento_id = ?');
    params.push(filters.tipoDocumentoId);
  }

  if (filters.nombreCompleto) {
    where.push('nombre_completo LIKE ?');
    params.push(`%${filters.nombreCompleto}%`);
  }

  if (filters.estado) {
    where.push('estado = ?');
    params.push(filters.estado);
  }

  const page = Number(filters.page || 1);
  const pageSize = Number(filters.pageSize || 20);
  const offset = (page - 1) * pageSize;

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const [items] = await db.query(
    `
    SELECT *
    FROM vw_pacientes
    ${whereSql}
    ORDER BY nombre_completo ASC
    LIMIT ? OFFSET ?
    `,
    [...params, pageSize, offset]
  );

  const [countRows] = await db.query(
    `
    SELECT COUNT(1) AS total
    FROM vw_pacientes
    ${whereSql}
    `,
    params
  );

  return {
    items,
    total: Number(countRows[0].total),
    page,
    pageSize
  };
}

async function obtenerPacienteCompleto(pacienteId) {
  const [[paciente]] = await db.query(
    `
    SELECT *
    FROM vw_pacientes
    WHERE id = ?
    LIMIT 1
    `,
    [pacienteId]
  );

  const [eps] = await db.query(
    `
    SELECT *
    FROM vw_pacientes_eps
    WHERE paciente_id = ?
    `,
    [pacienteId]
  );

  const [telefonos] = await db.query(
    `
    SELECT *
    FROM vw_pacientes_telefonos
    WHERE paciente_id = ?
    `,
    [pacienteId]
  );

  if (!paciente) return null;

  return {
    ...paciente,
    afiliaciones: eps,
    telefonos
  };
}

module.exports = {
  buscarPacientes,
  obtenerPacienteCompleto
};