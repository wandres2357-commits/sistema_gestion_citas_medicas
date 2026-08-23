// backend/src/modules/citas/citas.repository.js

import db from "../../config/db.js";

/**
 * Normaliza un nombre de estado.
 */
function normalizarEstadoCodigo(value) {
  return String(value || "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/-/g, "_")
    .toUpperCase();
}

/**
 * Une fecha y hora en formato MySQL DATETIME.
 */
function construirFechaHora(fecha, hora) {
  if (!fecha || !hora) {
    return null;
  }

  const horaNormalizada =
    String(hora).length === 5
      ? `${hora}:00`
      : hora;

  return `${fecha} ${horaNormalizada}`;
}

/**
 * Convierte una hora a segundos.
 */
function horaASegundos(hora) {
  if (!hora) {
    return null;
  }

  const partes = String(hora)
    .split(":")
    .map(Number);

  const horas = partes[0] || 0;
  const minutos = partes[1] || 0;
  const segundos = partes[2] || 0;

  return (
    horas * 3600 +
    minutos * 60 +
    segundos
  );
}

/**
 * Normaliza el día de semana.
 */
function normalizarDiaSemana(value) {
  return String(value || "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
}

/**
 * Obtiene el día de semana en español.
 *
 * Se incluye T12:00:00 para evitar desplazamientos de fecha
 * por zona horaria al interpretar YYYY-MM-DD.
 */
function obtenerDiaSemana(fecha) {
  const dias = [
    "DOMINGO",
    "LUNES",
    "MARTES",
    "MIERCOLES",
    "JUEVES",
    "VIERNES",
    "SABADO",
  ];

  const date = new Date(
    `${fecha}T12:00:00`
  );

  return dias[date.getDay()];
}

/**
 * Lista citas.
 */
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
  } else if (mostrar === "historicas") {
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

      DATE_FORMAT(
        c.fecha_hora,
        '%Y-%m-%d'
      ) AS fecha,

      TIME_FORMAT(
        c.fecha_hora,
        '%H:%i'
      ) AS hora,

      c.observaciones,

      TRIM(UPPER(ec.nombre)) AS estado,

      tc.nombre AS tipo

    FROM citas c

    LEFT JOIN estados_cita ec
      ON ec.id = c.estado_cita_id

    LEFT JOIN tipos_cita tc
      ON tc.id = c.tipo_cita_id

    ${
      where.length
        ? `WHERE ${where.join(" AND ")}`
        : ""
    }

    ORDER BY c.fecha_hora ASC
  `;

  console.log("LISTAR CITAS FILTROS:", {
    pacienteId,
    mostrar,
    estadoCitaId,
  });

  console.log("LISTAR CITAS PARAMS:", params);

  const [rows] = await db.query(sql, params);

  console.log(
    "LISTAR CITAS TOTAL:",
    Array.isArray(rows) ? rows.length : "NO ES ARRAY"
  );

  return Array.isArray(rows) ? rows : [];
}
/**
 * Consulta horarios médicos vigentes para una fecha.
 *
 * Retorna los horarios base configurados. Posteriormente,
 * el front-end o el servicio podrá generar los intervalos
 * según duracion_cita.
 */
async function listarDisponibilidad({
  especialidadId = null,
  sedeId = null,
  medicoId = null,
  consultorioId = null,
  fecha = null,
}) {
  if (!especialidadId) {
    throw new Error(
      "La especialidad es obligatoria para consultar disponibilidad."
    );
  }

  if (!fecha) {
    throw new Error(
      "La fecha es obligatoria para consultar disponibilidad."
    );
  }

  const params = [];
  const where = [];

  where.push("hm.especialidad_id = ?");
  params.push(especialidadId);

  where.push("? BETWEEN hm.fecha_inicio AND hm.fecha_fin");
  params.push(fecha);

  where.push("(hm.estado = 1 OR hm.estado IS NULL)");

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

  /*
   * La fecha se agrega una vez para el SELECT:
   *
   *     ? AS fecha
   *
   * y nuevamente dentro de params para el filtro:
   *
   *     ? BETWEEN fecha_inicio AND fecha_fin
   */
  const sql = `
    SELECT
      hm.id AS horario_medico_id,
      hm.agenda_id,
      hm.medico_id,
      hm.especialidad_id,
      hm.sede_id,
      hm.consultorio_id,
      hm.dia_semana,

      TIME_FORMAT(
        hm.hora_inicio,
        '%H:%i'
      ) AS hora_inicio,

      TIME_FORMAT(
        hm.hora_fin,
        '%H:%i'
      ) AS hora_fin,

      hm.duracion_cita,

      DATE_FORMAT(
        hm.fecha_inicio,
        '%Y-%m-%d'
      ) AS fecha_inicio,

      DATE_FORMAT(
        hm.fecha_fin,
        '%Y-%m-%d'
      ) AS fecha_fin,

      hm.estado,
      ? AS fecha

    FROM horarios_medicos hm

    WHERE ${where.join(" AND ")}

    ORDER BY
      hm.medico_id ASC,
      hm.hora_inicio ASC
  `;

  const [rows] = await db.query(
    sql,
    [fecha, ...params]
  );

  return rows;
}

/**
 * Obtiene un paciente.
 */
async function obtenerPacientePorId(
  pacienteId
) {
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

/**
 * Valida estado activo del paciente.
 */
async function validarPacienteActivo(
  pacienteId
) {
  const [rows] = await db.query(
    `
    SELECT 1
    FROM pacientes p

    LEFT JOIN paciente_estados pe
      ON pe.id = p.estado_id

    WHERE p.id = ?
      AND (
        UPPER(pe.nombre) = 'ACTIVO'
        OR p.estado_id IS NULL
      )

    LIMIT 1
    `,
    [pacienteId]
  );

  return rows.length > 0;
}

/**
 * Obtiene un horario médico.
 */
async function obtenerHorarioMedicoPorId(
  horarioMedicoId
) {
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

/**
 * Valida existencia de agenda u horario médico.
 */
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
        AND (
          estado = 1
          OR estado IS NULL
        )
      LIMIT 1
      `,
      [horarioMedicoId]
    );

    return rows.length > 0;
  }

  return false;
}

/**
 * Valida que una fecha y hora pertenezcan al horario médico.
 */
async function validarHorarioMedicoDisponible({
  horarioMedicoId,
  fecha,
  hora,
}) {
  if (
    !horarioMedicoId ||
    !fecha ||
    !hora
  ) {
    return false;
  }

  const horario =
    await obtenerHorarioMedicoPorId(
      horarioMedicoId
    );

  if (!horario) {
    return false;
  }

  if (
    horario.estado !== null &&
    Number(horario.estado) !== 1
  ) {
    return false;
  }

  const fechaConsultada = String(fecha);
  const fechaInicio = String(
    horario.fecha_inicio || ""
  ).slice(0, 10);

  const fechaFin = String(
    horario.fecha_fin || ""
  ).slice(0, 10);

  if (
    fechaInicio &&
    fechaConsultada < fechaInicio
  ) {
    return false;
  }

  if (
    fechaFin &&
    fechaConsultada > fechaFin
  ) {
    return false;
  }

  const diaConsultado =
    obtenerDiaSemana(fechaConsultada);

  const diaConfigurado =
    normalizarDiaSemana(
      horario.dia_semana
    );

  if (
    diaConfigurado &&
    diaConsultado !== diaConfigurado
  ) {
    return false;
  }

  const horaConsultada =
    horaASegundos(hora);

  const horaInicio =
    horaASegundos(
      horario.hora_inicio
    );

  const horaFin =
    horaASegundos(
      horario.hora_fin
    );

  if (
    horaConsultada === null ||
    horaInicio === null ||
    horaFin === null
  ) {
    return false;
  }

  if (
    horaConsultada < horaInicio ||
    horaConsultada >= horaFin
  ) {
    return false;
  }

  /*
   * Validar que la hora coincida con un intervalo
   * generado desde hora_inicio.
   */
  const duracion = Number(
    horario.duracion_cita || 0
  );

  if (duracion > 0) {
    const diferenciaMinutos =
      (horaConsultada - horaInicio) / 60;

    if (
      diferenciaMinutos % duracion !== 0
    ) {
      return false;
    }

    const finCita =
      horaConsultada +
      duracion * 60;

    if (finCita > horaFin) {
      return false;
    }
  }

  return true;
}

/**
 * Valida cruce de cita.
 */
async function existeCitaAsignada({
  agendaId = null,
  horarioMedicoId = null,
  medicoId = null,
  fecha = null,
  hora = null,
  excluirCitaId = null,
}) {
  const params = [];
  const where = [];

  const fechaHora =
    construirFechaHora(
      fecha,
      hora
    );

  let horario = null;

  if (horarioMedicoId) {
    horario =
      await obtenerHorarioMedicoPorId(
        horarioMedicoId
      );
  }

  const agendaFinal =
    agendaId ||
    horario?.agenda_id ||
    null;

  const medicoFinal =
    medicoId ||
    horario?.medico_id ||
    null;

  /*
   * Se valida principalmente por médico + fecha_hora.
   * La agenda se agrega como control adicional.
   */
  if (medicoFinal) {
    where.push(
      "c.medico_id = ?"
    );
    params.push(medicoFinal);
  }

  if (agendaFinal) {
    where.push(
      "c.agenda_id = ?"
    );
    params.push(agendaFinal);
  }

  if (fechaHora) {
    where.push(
      "c.fecha_hora = ?"
    );
    params.push(fechaHora);
  }

  if (excluirCitaId) {
    where.push(
      "c.id <> ?"
    );
    params.push(excluirCitaId);
  }

  if (!fechaHora) {
    return false;
  }

  if (!medicoFinal && !agendaFinal) {
    return false;
  }

  const sql = `
    SELECT
      COUNT(1) AS total

    FROM citas c

    LEFT JOIN estados_cita ec
      ON ec.id = c.estado_cita_id

    WHERE ${where.join(" AND ")}
      AND (
        ec.nombre IS NULL
        OR UPPER(ec.nombre) NOT IN (
          'CANCELADA'
        )
      )
  `;

  const [rows] = await db.query(
    sql,
    params
  );

  return Number(
    rows[0]?.total || 0
  ) > 0;
}

/**
 * Valida bloqueos de agenda leyendo dinámicamente
 * la estructura de bloqueos_agenda.
 */
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

  const [tableRows] =
    await db.query(
      `
      SELECT COUNT(1) AS total
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'bloqueos_agenda'
      `
    );

  if (
    Number(
      tableRows[0]?.total || 0
    ) === 0
  ) {
    return false;
  }

  const [columnRows] =
    await db.query(
      `
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'bloqueos_agenda'
      `
    );

  const columns = columnRows.map(
    (row) => row.COLUMN_NAME
  );

  const hasColumn = (name) =>
    columns.includes(name);

  const params = [];
  const where = [];

  if (hasColumn("fecha")) {
    where.push(
      "b.fecha = ?"
    );
    params.push(fecha);
  } else if (
    hasColumn("fecha_bloqueo")
  ) {
    where.push(
      "b.fecha_bloqueo = ?"
    );
    params.push(fecha);
  } else if (
    hasColumn("fecha_inicio") &&
    hasColumn("fecha_fin")
  ) {
    where.push(
      "? BETWEEN b.fecha_inicio AND b.fecha_fin"
    );
    params.push(fecha);
  }

  if (
    hasColumn("hora_inicio") &&
    hasColumn("hora_fin")
  ) {
    where.push(
      "? >= b.hora_inicio AND ? < b.hora_fin"
    );
    params.push(hora, hora);
  } else if (hasColumn("hora")) {
    where.push(
      "b.hora = ?"
    );
    params.push(hora);
  }

  const relaciones = [];
  const relacionesParams = [];

  if (
    agendaId &&
    hasColumn("agenda_id")
  ) {
    relaciones.push(
      "b.agenda_id = ?"
    );
    relacionesParams.push(
      agendaId
    );
  }

  if (
    horarioMedicoId &&
    hasColumn("horario_medico_id")
  ) {
    relaciones.push(
      "b.horario_medico_id = ?"
    );
    relacionesParams.push(
      horarioMedicoId
    );
  }

  if (
    medicoId &&
    hasColumn("medico_id")
  ) {
    relaciones.push(
      "b.medico_id = ?"
    );
    relacionesParams.push(
      medicoId
    );
  }

  /*
   * Si no se identificó fecha ni rango de fecha,
   * no se ejecuta una validación global que podría
   * bloquear agendas incorrectamente.
   */
  if (!where.length) {
    return false;
  }

  if (relaciones.length) {
    where.push(
      `(${relaciones.join(" OR ")})`
    );

    params.push(
      ...relacionesParams
    );
  }

  if (hasColumn("estado")) {
    where.push(
      "(b.estado = 1 OR b.estado IS NULL)"
    );
  } else if (hasColumn("activo")) {
    where.push(
      "(b.activo = 1 OR b.activo IS NULL)"
    );
  }

  const sql = `
    SELECT COUNT(1) AS total
    FROM bloqueos_agenda b
    WHERE ${where.join(" AND ")}
  `;

  const [rows] = await db.query(
    sql,
    params
  );

  return Number(
    rows[0]?.total || 0
  ) > 0;
}

/**
 * Obtiene estado por ID.
 */
async function obtenerEstadoCitaPorId(
  id,
  executor = db
) {
  const [rows] = await executor.query(
    `
    SELECT *
    FROM estados_cita
    WHERE id = ?
    LIMIT 1
    `,
    [id]
  );

  const estado = rows[0] || null;

  if (!estado) {
    return null;
  }

  return {
    ...estado,
    codigo: normalizarEstadoCodigo(
      estado.nombre
    ),
  };
}

/**
 * Obtiene estado por nombre normalizado.
 */
async function obtenerEstadoCitaPorCodigo(
  codigo,
  executor = db
) {
  const [rows] = await executor.query(
    `
    SELECT *
    FROM estados_cita
    `
  );

  const codigoNormalizado =
    normalizarEstadoCodigo(codigo);

  const estado = rows.find((row) => {
    return (
      normalizarEstadoCodigo(
        row.nombre
      ) === codigoNormalizado
    );
  });

  if (!estado) {
    return null;
  }

  return {
    ...estado,
    codigo: normalizarEstadoCodigo(
      estado.nombre
    ),
  };
}
/**
 * Crea una cita.
 */
async function crearCita(payload) {
  const fechaHora =
    construirFechaHora(
      payload.fecha,
      payload.hora
    );

  if (!fechaHora) {
    throw new Error(
      "No fue posible construir la fecha y hora de la cita."
    );
  }

  let horario = null;

  if (payload.horario_medico_id) {
    horario =
      await obtenerHorarioMedicoPorId(
        payload.horario_medico_id
      );
  }

  const medicoId =
    payload.medico_id ||
    horario?.medico_id ||
    null;

  const especialidadId =
    payload.especialidad_id ||
    horario?.especialidad_id ||
    null;

  const sedeId =
    payload.sede_id ||
    horario?.sede_id ||
    null;

  const consultorioId =
    payload.consultorio_id ||
    horario?.consultorio_id ||
    null;

  const agendaId =
    payload.agenda_id ||
    horario?.agenda_id ||
    null;

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
      payload.observacion ||
      payload.observaciones ||
      null,
    ]
  );

  return obtenerCitaPorId(
    result.insertId
  );
}
/**
 * Obtiene una cita por ID.
 *
 * executor puede ser:
 * - el pool db
 * - una conexión transaccional
 *
 * bloquear = true agrega FOR UPDATE y bloquea
 * la fila durante la transacción.
 */
async function obtenerCitaPorId(
  citaId,
  executor = db,
  bloquear = false
) {
  const bloqueoSql = bloquear
    ? "FOR UPDATE"
    : "";

  const [rows] = await executor.query(
    `
    SELECT
      c.*,
      ec.nombre AS estado,
      tc.nombre AS tipo

    FROM citas c

    LEFT JOIN estados_cita ec
      ON ec.id = c.estado_cita_id

    LEFT JOIN tipos_cita tc
      ON tc.id = c.tipo_cita_id

    WHERE c.id = ?

    LIMIT 1

    ${bloqueoSql}
    `,
    [citaId]
  );

  return rows[0] || null;
}

/**
 * Actualiza el estado de una cita.
 *
 * executor puede ser el pool o una conexión
 * perteneciente a una transacción.
 */
async function actualizarEstadoCita(
  {
    citaId,
    estadoCitaId,
    motivoCancelacionId = null,
    observacion = null,
    usuarioId = null,
  },
  executor = db
) {
  const partesDetalle = [];

  if (motivoCancelacionId) {
    partesDetalle.push(
      `Motivo cancelación ID: ${motivoCancelacionId}`
    );
  }

  if (observacion) {
    partesDetalle.push(observacion);
  }

  const detalle =
    partesDetalle.length > 0
      ? partesDetalle.join(" | ")
      : null;

  const [result] = await executor.query(
    `
    UPDATE citas

    SET
      estado_cita_id = ?,

      observaciones = CASE
        WHEN ? IS NULL
          THEN observaciones

        WHEN observaciones IS NULL
          OR TRIM(observaciones) = ''
          THEN ?

        ELSE CONCAT(
          observaciones,
          '\n',
          ?
        )
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

  if (result.affectedRows !== 1) {
    throw new Error(
      "No fue posible actualizar el estado de la cita."
    );
  }

  return result;
}

/**
 * Reprograma una cita.
 */
async function reprogramarCita({
  citaId,
  agendaId = null,
  horarioMedicoId = null,
  medicoId = null,
  especialidadId = null,
  sedeId = null,
  consultorioId = null,
  tipoCitaId = null,
  estadoCitaId,
  fecha,
  hora,
  observacion = null,
}) {
  const fechaHora =
    construirFechaHora(
      fecha,
      hora
    );

  if (!fechaHora) {
    throw new Error(
      "No fue posible construir la nueva fecha y hora."
    );
  }

  let horario = null;

  if (horarioMedicoId) {
    horario =
      await obtenerHorarioMedicoPorId(
        horarioMedicoId
      );
  }

  const agendaFinal =
    agendaId ||
    horario?.agenda_id ||
    null;

  const medicoFinal =
    medicoId ||
    horario?.medico_id ||
    null;

  const especialidadFinal =
    especialidadId ||
    horario?.especialidad_id ||
    null;

  const sedeFinal =
    sedeId ||
    horario?.sede_id ||
    null;

  const consultorioFinal =
    consultorioId ||
    horario?.consultorio_id ||
    null;

  const detalle = observacion
    ? `Reprogramación: ${observacion}`
    : "Cita reprogramada";

  await db.query(
    `
    UPDATE citas

    SET
      medico_id = ?,
      especialidad_id = ?,
      sede_id = ?,
      consultorio_id = ?,
      agenda_id = ?,
      tipo_cita_id = ?,
      estado_cita_id = ?,
      fecha_hora = ?,

      observaciones = CASE
        WHEN observaciones IS NULL
          OR TRIM(observaciones) = ''
          THEN ?

        ELSE CONCAT(
          observaciones,
          '\n',
          ?
        )
      END

    WHERE id = ?
    `,
    [
      medicoFinal,
      especialidadFinal,
      sedeFinal,
      consultorioFinal,
      agendaFinal,
      tipoCitaId,
      estadoCitaId,
      fechaHora,
      detalle,
      detalle,
      citaId,
    ]
  );
}
/**
 * Registra una operación en auditoría.
 *
 * executor puede ser:
 * - db
 * - una conexión transaccional
 */
async function registrarAuditoria(
  payload,
  executor = db
) {
  const valorAnterior =
    payload.valor_anterior === null ||
    payload.valor_anterior === undefined
      ? null
      : typeof payload.valor_anterior === "string"
        ? payload.valor_anterior
        : JSON.stringify(
            payload.valor_anterior
          );

  const valorNuevo =
    payload.valor_nuevo === null ||
    payload.valor_nuevo === undefined
      ? null
      : typeof payload.valor_nuevo === "string"
        ? payload.valor_nuevo
        : JSON.stringify(
            payload.valor_nuevo
          );

  const [result] = await executor.query(
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
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      payload.usuario_id || null,
      payload.accion,
      payload.tabla ||
        payload.tabla_afectada ||
        "citas",
      payload.registro_id,
      valorAnterior,
      valorNuevo,
      payload.ip || null,
      payload.user_agent || null,
    ]
  );

  if (!result.insertId) {
    throw new Error(
      "No fue posible registrar la auditoría."
    );
  }

  return result;
}
/**
 * Valida si el paciente ya tiene una cita activa
 * en la misma fecha y hora.
 *
 * Estados que bloquean el horario:
 * - PROGRAMADA
 * - CONFIRMADA
 * - EN_ESPERA
 * - REPROGRAMADA
 *
 * Estados que no bloquean:
 * - ATENDIDA
 * - CANCELADA
 * - NO_ASISTIO
 */
async function existeCitaPacienteMismoHorario({
  pacienteId,
  fecha,
  hora,
  excluirCitaId = null,
}) {
  const fechaHora =
    construirFechaHora(fecha, hora);

  if (!pacienteId || !fechaHora) {
    return false;
  }

  const params = [
    pacienteId,
    fechaHora,
  ];

  const where = [
    "c.paciente_id = ?",
    "c.fecha_hora = ?",
  ];

  /*
   * Durante una reprogramación se excluye la cita
   * que actualmente se está modificando.
   */
  if (excluirCitaId) {
    where.push("c.id <> ?");
    params.push(excluirCitaId);
  }

  const [rows] = await db.query(
    `
    SELECT
      COUNT(1) AS total

    FROM citas c

    INNER JOIN estados_cita ec
      ON ec.id = c.estado_cita_id

    WHERE ${where.join(" AND ")}
      AND UPPER(TRIM(ec.nombre)) IN (
        'PROGRAMADA',
        'CONFIRMADA',
        'EN_ESPERA',
        'REPROGRAMADA'
      )
    `,
    params
  );

  return Number(
    rows[0]?.total || 0
  ) > 0;
}
export {
  listarCitas,
  listarDisponibilidad,
  obtenerPacientePorId,
  validarPacienteActivo,
  validarAgendaDisponible,
  validarHorarioMedicoDisponible,
  obtenerHorarioMedicoPorId,
  existeCitaAsignada,
  existeCitaPacienteMismoHorario,
  existeBloqueoAgenda,
  obtenerEstadoCitaPorCodigo,
  obtenerEstadoCitaPorId,
  crearCita,
  obtenerCitaPorId,
  actualizarEstadoCita,
  reprogramarCita,
  registrarAuditoria
  };
