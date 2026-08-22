// backend/src/modules/citas/citas.service.js

import * as repository from "./citas.repository.js";

import {
  validarCrearCita,
  validarFechaHoraFutura,
  validarTransicionEstado,
} from "./citas.validators.js";

/**
 * Convierte un valor a texto limpio.
 */
function normalizarTexto(value) {
  return String(value || "").trim();
}

/**
 * Convierte un valor a número.
 * Retorna null cuando el valor no es válido.
 */
function normalizarNumero(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const parsed = Number(value);

  return Number.isNaN(parsed)
    ? null
    : parsed;
}

/**
 * Normaliza nombres de estados.
 *
 * Ejemplos:
 * "No asistió"  -> "NO_ASISTIO"
 * "En espera"   -> "EN_ESPERA"
 * "re-programada" -> "RE_PROGRAMADA"
 */
function normalizarEstado(value) {
  return String(value || "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/-/g, "_")
    .toUpperCase();
}

/**
 * Valida formato YYYY-MM-DD.
 */
function validarFechaYYYYMMDD(fecha) {
  return /^\d{4}-\d{2}-\d{2}$/.test(
    String(fecha || "")
  );
}

/**
 * Valida formato HH:mm o HH:mm:ss.
 */
function validarHoraHHMM(hora) {
  return /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(
    String(hora || "")
  );
}

/**
 * Valida parámetros de consulta de disponibilidad.
 */
function validarConsultaDisponibilidad(query = {}) {
  const errores = [];

  if (!normalizarNumero(query.especialidad_id)) {
    errores.push(
      "La especialidad es obligatoria para consultar disponibilidad."
    );
  }

  if (!query.fecha) {
    errores.push(
      "La fecha es obligatoria para consultar disponibilidad."
    );
  }

  if (
    query.fecha &&
    !validarFechaYYYYMMDD(query.fecha)
  ) {
    errores.push(
      "La fecha debe tener formato YYYY-MM-DD."
    );
  }

  if (errores.length) {
    throw new Error(errores.join(" "));
  }
}

/**
 * Normaliza el filtro de citas.
 */
function mapearMostrarCitas(mostrar) {
  const value = normalizarTexto(mostrar)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (
    [
      "historicas",
      "pasadas",
      "anteriores",
    ].includes(value)
  ) {
    return "historicas";
  }

  if (
    [
      "todas",
      "todo",
    ].includes(value)
  ) {
    return "todas";
  }

  return "proximas";
}

/**
 * Lista citas con filtros.
 */
async function listarCitas(query = {}) {
  const pacienteId = normalizarNumero(
    query.paciente_id
  );

  const estadoCitaId = normalizarNumero(
    query.estado_cita_id ||
    query.estado_id
  );

  const mostrar = mapearMostrarCitas(
    query.mostrar
  );

  return repository.listarCitas({
    pacienteId,
    estadoCitaId,
    mostrar,
  });
}

/**
 * Consulta disponibilidad médica.
 */
async function listarDisponibilidad(query = {}) {
  validarConsultaDisponibilidad(query);

  return repository.listarDisponibilidad({
    especialidadId: normalizarNumero(
      query.especialidad_id
    ),

    sedeId: normalizarNumero(
      query.sede_id
    ),

    medicoId: normalizarNumero(
      query.medico_id
    ),

    consultorioId: normalizarNumero(
      query.consultorio_id
    ),

    fecha: query.fecha,
  });
}

/**
 * Crea una cita médica con estado PROGRAMADA.
 */
async function crearCita(
  payload = {},
  usuarioId = null
) {
  validarCrearCita(payload);

  validarFechaHoraFutura(
    payload.fecha,
    payload.hora
  );

  const pacienteId = normalizarNumero(
    payload.paciente_id
  );

  const agendaId = normalizarNumero(
    payload.agenda_id
  );

  const horarioMedicoId = normalizarNumero(
    payload.horario_medico_id
  );

  const medicoId = normalizarNumero(
    payload.medico_id
  );

  const especialidadId = normalizarNumero(
    payload.especialidad_id
  );

  const sedeId = normalizarNumero(
    payload.sede_id
  );

  const consultorioId = normalizarNumero(
    payload.consultorio_id
  );

  const tipoCitaId = normalizarNumero(
    payload.tipo_cita_id
  );

  const observacion =
    normalizarTexto(
      payload.observacion ||
      payload.observaciones
    ) || null;

  /*
   * Validar paciente.
   */
  const paciente =
    await repository.obtenerPacientePorId(
      pacienteId
    );

  if (!paciente) {
    throw new Error(
      "El paciente no existe."
    );
  }

  const pacienteActivo =
    await repository.validarPacienteActivo(
      pacienteId
    );

  if (!pacienteActivo) {
    throw new Error(
      "El paciente no se encuentra activo."
    );
  }

  /*
   * Obtener estado inicial.
   */
  const estadoProgramada =
    await repository.obtenerEstadoCitaPorCodigo(
      "PROGRAMADA"
    );

  if (!estadoProgramada) {
    throw new Error(
      "No existe el estado PROGRAMADA en la tabla estados_cita."
    );
  }

  /*
   * Validar agenda u horario.
   */
  const agendaDisponible =
    await repository.validarAgendaDisponible({
      agendaId,
      horarioMedicoId,
      fecha: payload.fecha,
      hora: payload.hora,
    });

  if (!agendaDisponible) {
    throw new Error(
      "La agenda u horario seleccionado no se encuentra disponible."
    );
  }

  /*
   * Validar que el horario seleccionado coincida con
   * el rango y la vigencia de horarios_medicos.
   */
  if (horarioMedicoId) {
    const horarioValido =
      await repository.validarHorarioMedicoDisponible({
        horarioMedicoId,
        fecha: payload.fecha,
        hora: payload.hora,
      });

    if (!horarioValido) {
      throw new Error(
        "La fecha u hora seleccionada no corresponde al horario médico configurado."
      );
    }
  }

  /*
   * Validar cruce contra otras citas.
   */
  const existeCruce =
    await repository.existeCitaAsignada({
      agendaId,
      horarioMedicoId,
      medicoId,
      fecha: payload.fecha,
      hora: payload.hora,
    });

  if (existeCruce) {
    throw new Error(
      "Ya existe una cita asignada para el recurso en esa fecha y hora."
    );
  }

  /*
   * Validar bloqueos de agenda.
   */
  const bloqueoAgenda =
    await repository.existeBloqueoAgenda({
      agendaId,
      horarioMedicoId,
      medicoId,
      fecha: payload.fecha,
      hora: payload.hora,
    });

  if (bloqueoAgenda) {
    throw new Error(
      "La agenda seleccionada se encuentra bloqueada para la fecha u hora indicada."
    );
  }

  /*
   * Crear cita.
   *
   * La tabla citas no contiene actualmente:
   * - consecutivo
   * - horario_medico_id
   * - valor_cita
   * - usuario_creacion_id
   *
   * horario_medico_id se usa para resolver los datos
   * relacionados, pero no se inserta en citas.
   */
  const citaCreada =
    await repository.crearCita({
      paciente_id: pacienteId,
      agenda_id: agendaId,
      horario_medico_id: horarioMedicoId,
      medico_id: medicoId,
      especialidad_id: especialidadId,
      sede_id: sedeId,
      consultorio_id: consultorioId,
      tipo_cita_id: tipoCitaId,
      estado_cita_id: estadoProgramada.id,
      fecha: payload.fecha,
      hora: payload.hora,
      observacion,
    });

  /*
   * Registrar auditoría.
   */
  await repository.registrarAuditoria({
    tabla: "citas",
    registro_id: citaCreada.id,
    accion: "CREAR_CITA",
    valor_anterior: null,
    valor_nuevo: JSON.stringify({
      ...citaCreada,
      estado: estadoProgramada.nombre,
    }),
    usuario_id: usuarioId,
  });

  return citaCreada;
}

/**
 * Cambia el estado de una cita.
 */
async function cambiarEstado(params = {}) {
  const citaId = normalizarNumero(
    params.citaId ||
    params.cita_id
  );

  const estadoCodigo = normalizarEstado(
    params.estadoCodigo ||
    params.estado_codigo
  );

  const usuarioId = normalizarNumero(
    params.usuarioId ||
    params.usuario_id
  );

  const motivoCancelacionId =
    normalizarNumero(
      params.motivoCancelacionId ||
      params.motivo_cancelacion_id
    );

  const observacion =
    normalizarTexto(params.observacion) ||
    null;

  if (!citaId) {
    throw new Error(
      "El identificador de la cita es obligatorio."
    );
  }

  if (!estadoCodigo) {
    throw new Error(
      "El nuevo estado de la cita es obligatorio."
    );
  }

  /*
   * Obtener cita.
   */
  const citaActual =
    await repository.obtenerCitaPorId(
      citaId
    );

  if (!citaActual) {
    throw new Error(
      "La cita no existe."
    );
  }

  /*
   * Obtener estado actual.
   */
  const estadoActual =
    await repository.obtenerEstadoCitaPorId(
      citaActual.estado_cita_id
    );

  if (!estadoActual) {
    throw new Error(
      "El estado actual de la cita no existe en estados_cita."
    );
  }

  /*
   * Obtener estado destino.
   */
  const nuevoEstado =
    await repository.obtenerEstadoCitaPorCodigo(
      estadoCodigo
    );

  if (!nuevoEstado) {
    throw new Error(
      `No existe el estado de cita ${estadoCodigo}.`
    );
  }

  /*
   * Validar transición.
   */
  validarTransicionEstado(
    estadoActual.codigo,
    nuevoEstado.codigo
  );

  /*
   * Validaciones específicas por estado.
   */
  if (
    nuevoEstado.codigo === "CANCELADA" &&
    !motivoCancelacionId
  ) {
    throw new Error(
      "Debe seleccionar un motivo de cancelación."
    );
  }

  if (
    nuevoEstado.codigo === "REPROGRAMADA" &&
    !observacion
  ) {
    throw new Error(
      "Debe registrar una observación para reprogramar la cita."
    );
  }

  if (
    nuevoEstado.codigo === "EN_ESPERA" &&
    !observacion
  ) {
    throw new Error(
      "Debe registrar una observación para enviar la cita a espera."
    );
  }

  /*
   * Actualizar.
   */
  await repository.actualizarEstadoCita({
    citaId,
    estadoCitaId: nuevoEstado.id,
    motivoCancelacionId,
    observacion,
    usuarioId,
  });

  const citaActualizada =
    await repository.obtenerCitaPorId(
      citaId
    );

  /*
   * Auditoría.
   */
  await repository.registrarAuditoria({
    tabla: "citas",
    registro_id: citaId,
    accion: "CAMBIAR_ESTADO_CITA",

    valor_anterior: JSON.stringify({
      ...citaActual,
      estado: estadoActual.nombre,
    }),

    valor_nuevo: JSON.stringify({
      ...citaActualizada,
      estado: nuevoEstado.nombre,
      motivo_cancelacion_id:
        motivoCancelacionId,
    }),

    usuario_id: usuarioId,
  });

  return citaActualizada;
}

/**
 * PROGRAMADA -> CONFIRMADA
 */
async function confirmarCita(
  citaId,
  usuarioId = null
) {
  return cambiarEstado({
    citaId,
    estadoCodigo: "CONFIRMADA",
    usuarioId,
  });
}

/**
 * PROGRAMADA o CONFIRMADA -> CANCELADA
 */
async function cancelarCita(
  citaId,
  payload = {},
  usuarioId = null
) {
  return cambiarEstado({
    citaId,
    estadoCodigo: "CANCELADA",
    motivoCancelacionId:
      payload.motivo_cancelacion_id,
    observacion:
      payload.observacion ||
      payload.observaciones,
    usuarioId,
  });
}

/**
 * CONFIRMADA -> ATENDIDA
 */
async function marcarAtendida(
  citaId,
  usuarioId = null
) {
  return cambiarEstado({
    citaId,
    estadoCodigo: "ATENDIDA",
    usuarioId,
  });
}

/**
 * CONFIRMADA -> NO_ASISTIO
 */
async function marcarNoAsistio(
  citaId,
  payload = {},
  usuarioId = null
) {
  return cambiarEstado({
    citaId,
    estadoCodigo: "NO_ASISTIO",
    observacion:
      payload.observacion ||
      payload.observaciones,
    usuarioId,
  });
}

/**
 * PROGRAMADA o REPROGRAMADA -> EN_ESPERA
 */
async function marcarEnEspera(
  citaId,
  payload = {},
  usuarioId = null
) {
  return cambiarEstado({
    citaId,
    estadoCodigo: "EN_ESPERA",
    observacion:
      payload.observacion ||
      payload.observaciones,
    usuarioId,
  });
}

/**
 * Marca una cita como REPROGRAMADA.
 *
 * Esta acción cambia únicamente el estado.
 * La asignación de la nueva fecha se realiza mediante
 * reprogramarFechaCita.
 */
async function marcarReprogramada(
  citaId,
  payload = {},
  usuarioId = null
) {
  return cambiarEstado({
    citaId,
    estadoCodigo: "REPROGRAMADA",
    observacion:
      payload.observacion ||
      payload.observaciones,
    usuarioId,
  });
}

/**
 * Reprograma fecha, hora y recurso de una cita.
 *
 * Flujo:
 * 1. Valida la transición hacia REPROGRAMADA.
 * 2. Valida la nueva fecha y hora.
 * 3. Valida agenda, cruces y bloqueos.
 * 4. Actualiza datos de la cita.
 * 5. Registra auditoría.
 */
async function reprogramarFechaCita(
  citaId,
  payload = {},
  usuarioId = null
) {
  const id = normalizarNumero(citaId);

  if (!id) {
    throw new Error(
      "El identificador de la cita es obligatorio."
    );
  }

  const fecha = normalizarTexto(
    payload.fecha
  );

  const hora = normalizarTexto(
    payload.hora
  );

  const observacion =
    normalizarTexto(
      payload.observacion ||
      payload.observaciones
    );

  if (!fecha) {
    throw new Error(
      "La nueva fecha es obligatoria."
    );
  }

  if (!hora) {
    throw new Error(
      "La nueva hora es obligatoria."
    );
  }

  if (!observacion) {
    throw new Error(
      "Debe registrar el motivo de la reprogramación."
    );
  }

  if (!validarFechaYYYYMMDD(fecha)) {
    throw new Error(
      "La nueva fecha debe tener formato YYYY-MM-DD."
    );
  }

  if (!validarHoraHHMM(hora)) {
    throw new Error(
      "La nueva hora debe tener formato HH:mm o HH:mm:ss."
    );
  }

  validarFechaHoraFutura(
    fecha,
    hora
  );

  const citaActual =
    await repository.obtenerCitaPorId(id);

  if (!citaActual) {
    throw new Error(
      "La cita no existe."
    );
  }

  const estadoActual =
    await repository.obtenerEstadoCitaPorId(
      citaActual.estado_cita_id
    );

  if (!estadoActual) {
    throw new Error(
      "El estado actual de la cita no existe."
    );
  }

  const estadoReprogramada =
    await repository.obtenerEstadoCitaPorCodigo(
      "REPROGRAMADA"
    );

  if (!estadoReprogramada) {
    throw new Error(
      "No existe el estado REPROGRAMADA."
    );
  }

  validarTransicionEstado(
    estadoActual.codigo,
    estadoReprogramada.codigo
  );

  const agendaId =
    normalizarNumero(payload.agenda_id) ||
    citaActual.agenda_id;

  const horarioMedicoId =
    normalizarNumero(
      payload.horario_medico_id
    );

  const medicoId =
    normalizarNumero(payload.medico_id) ||
    citaActual.medico_id;

  const especialidadId =
    normalizarNumero(
      payload.especialidad_id
    ) ||
    citaActual.especialidad_id;

  const sedeId =
    normalizarNumero(payload.sede_id) ||
    citaActual.sede_id;

  const consultorioId =
    normalizarNumero(
      payload.consultorio_id
    ) ||
    citaActual.consultorio_id;

  if (!agendaId && !horarioMedicoId) {
    throw new Error(
      "Debe seleccionar una agenda u horario médico para reprogramar."
    );
  }

  const agendaDisponible =
    await repository.validarAgendaDisponible({
      agendaId,
      horarioMedicoId,
      fecha,
      hora,
    });

  if (!agendaDisponible) {
    throw new Error(
      "La nueva agenda u horario no se encuentra disponible."
    );
  }

  if (horarioMedicoId) {
    const horarioValido =
      await repository.validarHorarioMedicoDisponible({
        horarioMedicoId,
        fecha,
        hora,
      });

    if (!horarioValido) {
      throw new Error(
        "La nueva fecha u hora no corresponde al horario médico seleccionado."
      );
    }
  }

  const existeCruce =
    await repository.existeCitaAsignada({
      agendaId,
      horarioMedicoId,
      medicoId,
      fecha,
      hora,
      excluirCitaId: id,
    });

  if (existeCruce) {
    throw new Error(
      "Ya existe una cita asignada para el recurso en la nueva fecha y hora."
    );
  }

  const bloqueoAgenda =
    await repository.existeBloqueoAgenda({
      agendaId,
      horarioMedicoId,
      medicoId,
      fecha,
      hora,
    });

  if (bloqueoAgenda) {
    throw new Error(
      "La agenda está bloqueada para la nueva fecha u hora."
    );
  }

  await repository.reprogramarCita({
    citaId: id,
    pacienteId: citaActual.paciente_id,
    agendaId,
    horarioMedicoId,
    medicoId,
    especialidadId,
    sedeId,
    consultorioId,
    tipoCitaId: citaActual.tipo_cita_id,
    estadoCitaId: estadoReprogramada.id,
    fecha,
    hora,
    observacion,
  });

  const citaActualizada =
    await repository.obtenerCitaPorId(id);

  await repository.registrarAuditoria({
    tabla: "citas",
    registro_id: id,
    accion: "REPROGRAMAR_CITA",

    valor_anterior: JSON.stringify({
      ...citaActual,
      estado: estadoActual.nombre,
    }),

    valor_nuevo: JSON.stringify({
      ...citaActualizada,
      estado: estadoReprogramada.nombre,
    }),

    usuario_id: usuarioId,
  });

  return citaActualizada;
}

export {
  listarCitas,
  listarDisponibilidad,
  crearCita,
  cambiarEstado,
  confirmarCita,
  cancelarCita,
  marcarAtendida,
  marcarNoAsistio,
  marcarEnEspera,
  marcarReprogramada,
  reprogramarFechaCita,
};