// backend/src/modules/citas/citas.repository.js
import db from "../../config/db.js";

function normalizarEstadoCodigo(value) {
  return String(value || "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/-/g, "_")
    .toUpperCase();
}

function construirFechaHora(fecha, hora) {
  if (!fecha || !hora) return null;

  const horaNormalizada = String(hora).length === 5 ? `${hora}:00` : hora;

  return `${fecha} ${horaNormalizada}`;
}

async function listarCitas({
  pacienteId = null,
  mostrar = "proximas",
  estadoCitaId = null,
}) {
  const params = [];
  const where = [];

  if (pacienteId) {
    where.push("c.paciente_id = ?");
    params.push(pacienteId);
  }

  if (mostrar === "proximas") {
    where.push("DATE(c.fecha_hora) >= CURDATE()");
  }

  if (mostrar === "historicas") {
    where.push("DATE(c.fecha_hora) < CURDATE()");
  }

  if (estadoCitaId) {
    where.push("c.estado_cita_id = ?");
    params.push(estadoCitaId);
  }

  const sql = `
    SELECT
      c.id,
      c.paciente_id,
      c.medico_id,
      c.especialidad_id,
      c.sede_id,
      c.consultorio_id,
      c.agenda_id,
      c.tipo_cita_id,
      c.estado_cita_id,
      c.fecha_hora,
      DATE(c.fecha_hora) AS fecha,
      TIME_FORMAT(TIME(c.fecha_hora), '%H:%i') AS hora,
      c.observaciones,
      NULL AS consecutivo,
      ec.nombre AS estado,
      tc.nombre AS tipo,
      0 AS valor_cita,
      NULL AS pago
    FROM citas c
    LEFT JOIN estados_cita ec ON ec.id = c.estado_cita_id
    LEFT JOIN tipos_cita tc ON tc.id = c.tipo_cita_id
    ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
    ORDER BY c.fecha_hora ASC
  `;

  const [rows] = await db.query(sql, params);
  return rows;
}

async function listarDisponibilidad({
  especialidadId = null,
  sedeId = null,
  medicoId = null,
  consultorioId = null,
  fecha = null,
}) {
  const params = [];
  const where = [];

  if (especialidadId) {
    where.push("hm.especialidad_id = ?");
    params.push(especialidadId);
  }

  if (sedeId) {
    where.push("hm.sede_id = ?");
    params.push(sedeId);
  }

  if (medicoId) {
    where.push("hm.medico_id = ?");
    params.push(medicoId);
  }

  if (consultorioId) {
    where.push("hm.consultorio_id = ?");
    params.push(consultorioId);
  }

  if (fecha) {
    where.push("? BETWEEN hm.fecha_inicio AND hm.fecha_fin");
    params.push(fecha);
  }

  where.push("(hm.estado = 1 OR hm.estado IS NULL)");

  const sql = `
    SELECT
      hm.id AS horario_medico_id,
      hm.agenda_id,
      hm.medico_id,
      hm.especialidad_id,
      hm.sede_id,
      hm.consultorio_id,
      hm.dia_semana,
      hm.hora_inicio,
      hm.hora_fin,
      hm.duracion_cita,
      hm.fecha_inicio,
      hm.fecha_fin,
      hm.estado,
      ? AS fecha,
      TIME_FORMAT(hm.hora_inicio, '%H:%i') AS hora
    FROM horarios_medicos hm
    WHERE ${where.join(" AND ")}
    ORDER BY hm.hora_inicio ASC
  `;

  const [rows] = await db.query(sql, [fecha, ...params]);

  return rows;
}

async function obtenerPacientePorId(pacienteId) {
  const [rows] = await db.query(
    `
    SELECT *
    FROM pacientes
    WHERE id = ?
    LIMIT 1
    `,
    [pacienteId]
  );

  return rows[0] || null;
}

async function validarPacienteActivo(pacienteId) {
  const [rows] = await db.query(
    `
    SELECT 1
    FROM pacientes p
    LEFT JOIN paciente_estados pe ON pe.id = p.estado_id
    WHERE p.id = ?
      AND (
        pe.nombre = 'Activo'
        OR pe.nombre = 'ACTIVO'
        OR p.estado_id IS NULL
      )
    LIMIT 1
    `,
    [pacienteId]
  );

  return rows.length > 0;
}

async function validarAgendaDisponible({
  agendaId = null,
  horarioMedicoId = null,
}) {
  if (agendaId) {
    const [rows] = await db.query(
      `
      SELECT 1
      FROM agendas
      WHERE id = ?
      LIMIT 1
      `,
      [agendaId]
    );

    return rows.length > 0;
  }

  if (horarioMedicoId) {
    const [rows] = await db.query(
      `
      SELECT 1
      FROM horarios_medicos
      WHERE id = ?
        AND (estado = 1 OR estado IS NULL)
      LIMIT 1
      `,
      [horarioMedicoId]
    );

    return rows.length > 0;
  }

  return false;
}

async function obtenerHorarioMedicoPorId(horarioMedicoId) {
  const [rows] = await db.query(
    `
    SELECT *
    FROM horarios_medicos
    WHERE id = ?
    LIMIT 1
    `,
    [horarioMedicoId]
  );

  return rows[0] || null;
}

async function existeCitaAsignada({
  agendaId = null,
  horarioMedicoId = null,
  medicoId = null,
  fecha = null,
  hora = null,
}) {
  const params = [];
  const where = [];

  const fechaHora = construirFechaHora(fecha, hora);

  if (agendaId) {
    where.push("c.agenda_id = ?");
    params.push(agendaId);
  }

  if (medicoId) {
    where.push("c.medico_id = ?");
    params.push(medicoId);
  }

  if (fechaHora) {
    where.push("c.fecha_hora = ?");
    params.push(fechaHora);
  }

  if (!agendaId && horarioMedicoId) {
    const horario = await obtenerHorarioMedicoPorId(horarioMedicoId);

    if (horario?.agenda_id) {
      where.push("c.agenda_id = ?");
      params.push(horario.agenda_id);
    }

    if (horario?.medico_id && !medicoId) {
      where.push("c.medico_id = ?");
      params.push(horario.medico_id);
    }
  }

  if (!where.length) {
    return false;
  }

  const sql = `
    SELECT COUNT(1) AS total
    FROM citas c
    LEFT JOIN estados_cita ec ON ec.id = c.estado_cita_id
    WHERE ${where.join(" AND ")}
      AND (
        ec.nombre IS NULL
        OR UPPER(ec.nombre) NOT IN ('CANCELADA', 'CANCELADO')
      )
  `;

  const [rows] = await db.query(sql, params);

  return Number(rows[0]?.total || 0) > 0;
}

async function existeBloqueoAgenda({
  agendaId = null,
  horarioMedicoId = null,
  medicoId = null,
  fecha = null,
  hora = null,
}) {
  if (!fecha || !hora) {
    return false;
  }

  const [tableRows] = await db.query(
    `
    SELECT COUNT(1) AS total
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'bloqueos_agenda'
    `
  );

  if (Number(tableRows[0]?.total || 0) === 0) {
    return false;
  }

  const [columnRows] = await db.query(
    `
    SELECT COLUMN_NAME
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'bloqueos_agenda'
    `
  );

  const columns = columnRows.map((row) => row.COLUMN_NAME);
  const hasColumn = (name) => columns.includes(name);

  const params = [];
  const where = [];

  if (hasColumn("fecha")) {
    where.push("b.fecha = ?");
    params.push(fecha);
  } else if (hasColumn("fecha_bloqueo")) {
    where.push("b.fecha_bloqueo = ?");
    params.push(fecha);
  } else if (hasColumn("fecha_inicio") && hasColumn("fecha_fin")) {
    where.push("? BETWEEN b.fecha_inicio AND b.fecha_fin");
    params.push(fecha);
  }

  if (hasColumn("hora_inicio") && hasColumn("hora_fin")) {
    where.push("? BETWEEN b.hora_inicio AND b.hora_fin");
    params.push(hora);
  } else if (hasColumn("hora")) {
    where.push("b.hora = ?");
    params.push(hora);
  }

  const relaciones = [];

  if (agendaId && hasColumn("agenda_id")) {
    relaciones.push("b.agenda_id = ?");
    params.push(agendaId);
  }

  if (horarioMedicoId && hasColumn("horario_medico_id")) {
    relaciones.push("b.horario_medico_id = ?");
    params.push(horarioMedicoId);
  }

  if (medicoId && hasColumn("medico_id")) {
    relaciones.push("b.medico_id = ?");
    params.push(medicoId);
  }

  if (!where.length) {
    return false;
  }

  if (relaciones.length) {
    where.push(`(${relaciones.join(" OR ")})`);
  }

  if (hasColumn("estado")) {
    where.push("(b.estado = 1 OR b.estado IS NULL)");
  } else if (hasColumn("activo")) {
    where.push("(b.activo = 1 OR b.activo IS NULL)");
  }

  const sql = `
    SELECT COUNT(1) AS total
    FROM bloqueos_agenda b
    WHERE ${where.join(" AND ")}
  `;

  const [rows] = await db.query(sql, params);

  return Number(rows[0]?.total || 0) > 0;
}

async function obtenerEstadoCitaPorId(id) {
  const [rows] = await db.query(
    `
    SELECT *
    FROM estados_cita
    WHERE id = ?
    LIMIT 1
    `,
    [id]
  );

  const estado = rows[0] || null;

  if (!estado) return null;

  return {
    ...estado,
    codigo: normalizarEstadoCodigo(estado.nombre),
  };
}

async function obtenerEstadoCitaPorCodigo(codigo) {
  const [rows] = await db.query(
    `
    SELECT *
    FROM estados_cita
    `
  );

  const codigoNormalizado = normalizarEstadoCodigo(codigo);

  const estado = rows.find((row) => {
    return normalizarEstadoCodigo(row.nombre) === codigoNormalizado;
  });

  if (!estado) return null;

  return {
    ...estado,
    codigo: normalizarEstadoCodigo(estado.nombre),
  };
}

async function generarConsecutivo() {
  const [rows] = await db.query(
    `
    SELECT COUNT(1) + 1 AS siguiente
    FROM citas
    WHERE DATE(fecha_hora) = CURDATE()
    `
  );

  const fecha = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const siguiente = String(rows[0]?.siguiente || 1).padStart(6, "0");

  return `CM-${fecha}-${siguiente}`;
}

async function crearCita(payload) {
  const fechaHora = construirFechaHora(payload.fecha, payload.hora);

  let horario = null;

  if (payload.horario_medico_id) {
    horario = await obtenerHorarioMedicoPorId(payload.horario_medico_id);
  }

  const medicoId = payload.medico_id || horario?.medico_id || null;
  const especialidadId = payload.especialidad_id || horario?.especialidad_id || null;
  const sedeId = payload.sede_id || horario?.sede_id || null;
  const consultorioId = payload.consultorio_id || horario?.consultorio_id || null;
  const agendaId = payload.agenda_id || horario?.agenda_id || null;

  const [result] = await db.query(
    `
    INSERT INTO citas (
      paciente_id,
      medico_id,
      especialidad_id,
      sede_id,
      consultorio_id,
      agenda_id,
      tipo_cita_id,
      estado_cita_id,
      fecha_hora,
      observaciones
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      payload.paciente_id,
      medicoId,
      especialidadId,
      sedeId,
      consultorioId,
      agendaId,
      payload.tipo_cita_id,
      payload.estado_cita_id,
      fechaHora,
      payload.observacion || payload.observaciones || null,
    ]
  );

  return obtenerCitaPorId(result.insertId);
}

async function obtenerCitaPorId(citaId) {
  const [rows] = await db.query(
    `
    SELECT *
    FROM citas
    WHERE id = ?
    LIMIT 1
    `,
    [citaId]
  );

  return rows[0] || null;
}

async function actualizarEstadoCita({
  citaId,
  estadoCitaId,
  motivoCancelacionId = null,
  observacion = null,
  usuarioId = null,
}) {
  const detalle = observacion
    ? observacion
    : motivoCancelacionId
      ? `Motivo cancelación ID: ${motivoCancelacionId}`
      : null;

  await db.query(
    `
    UPDATE citas
    SET estado_cita_id = ?,
        observaciones = CASE
          WHEN ? IS NULL THEN observaciones
          WHEN observaciones IS NULL OR observaciones = '' THEN ?
          ELSE CONCAT(observaciones, '\n', ?)
        END
    WHERE id = ?
    `,
    [
      estadoCitaId,
      detalle,
      detalle,
      detalle,
      citaId,
    ]
  );
}

async function registrarAuditoria(payload) {
  await db.query(
    `
    INSERT INTO auditoria (
      usuario_id,
      accion,
      tabla_afectada,
      registro_id,
      valor_anterior,
      valor_nuevo,
      ip,
      user_agent
    )
    VALUES (?, ?, ?, ?, CAST(? AS JSON), CAST(? AS JSON), ?, ?)
    `,
    [
      payload.usuario_id || null,
      payload.accion,
      payload.tabla || payload.tabla_afectada || "citas",
      payload.registro_id,
      payload.valor_anterior || null,
      payload.valor_nuevo || null,
      payload.ip || null,
      payload.user_agent || null,
    ]
  );
}

export {
  listarCitas,
  listarDisponibilidad,
  obtenerPacientePorId,
  validarPacienteActivo,
  validarAgendaDisponible,
  existeCitaAsignada,
  existeBloqueoAgenda,
  obtenerEstadoCitaPorCodigo,
  obtenerEstadoCitaPorId,
  generarConsecutivo,
  crearCita,
  obtenerCitaPorId,
  actualizarEstadoCita,
  registrarAuditoria,
};