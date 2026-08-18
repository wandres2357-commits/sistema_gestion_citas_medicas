// backend/src/modules/citas/citas.service.js

import * as repository from "./citas.repository.js";

/**
 * Servicio de citas médicas SGCM.
 *
 * Este servicio trabaja sobre tablas existentes de SGCMDB03:
 * - citas
 * - agendas
 * - horarios_medicos
 * - pacientes
 * - estados_cita
 * - tipos_cita
 * - motivos_cancelacion
 * - auditoria
 *
 * Y usa vistas para lectura:
 * - vw_citas
 * - vw_agendas
 * - vw_pacientes
 */

function normalizarTexto(value) {
  return String(value || '').trim();
}

function normalizarNumero(value) {
  if (value === null || value === undefined || value === '') return null;

  const parsed = Number(value);

  return Number.isNaN(parsed) ? null : parsed;
}

function validarFechaYYYYMMDD(fecha) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(fecha || ''));
}

function validarHoraHHMM(hora) {
  return /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(String(hora || ''));
}

function validarFechaHoraFutura(fecha, hora) {
  if (!validarFechaYYYYMMDD(fecha)) {
    throw new Error('La fecha de la cita no tiene un formato válido. Use YYYY-MM-DD.');
  }

  if (!validarHoraHHMM(hora)) {
    throw new Error('La hora de la cita no tiene un formato válido. Use HH:mm o HH:mm:ss.');
  }

  const horaNormalizada = String(hora).length === 5 ? `${hora}:00` : hora;
  const fechaHoraCita = new Date(`${fecha}T${horaNormalizada}`);
  const ahora = new Date();

  if (Number.isNaN(fechaHoraCita.getTime())) {
    throw new Error('La fecha u hora de la cita no es válida.');
  }

  if (fechaHoraCita < ahora) {
    throw new Error('No se puede asignar una cita en una fecha u hora anterior a la actual.');
  }
}

function validarCreacionCita(payload) {
  const errores = [];

  if (!normalizarNumero(payload.paciente_id)) {
    errores.push('El paciente es obligatorio.');
  }

  if (!normalizarNumero(payload.tipo_cita_id)) {
    errores.push('El tipo de cita es obligatorio.');
  }

  if (!payload.fecha) {
    errores.push('La fecha de la cita es obligatoria.');
  }

  if (!payload.hora) {
    errores.push('La hora de la cita es obligatoria.');
  }

  if (!normalizarNumero(payload.agenda_id) && !normalizarNumero(payload.horario_medico_id)) {
    errores.push('Debe seleccionar una agenda u horario médico disponible.');
  }

  if (
    payload.valor_cita !== undefined &&
    payload.valor_cita !== null &&
    payload.valor_cita !== '' &&
    Number(payload.valor_cita) < 0
  ) {
    errores.push('El valor de la cita no puede ser negativo.');
  }

  if (errores.length) {
    throw new Error(errores.join(' '));
  }
}

function validarConsultaDisponibilidad(query) {
  const errores = [];

  if (!normalizarNumero(query.especialidad_id)) {
    errores.push('La especialidad es obligatoria para consultar disponibilidad.');
  }

  if (!query.fecha) {
    errores.push('La fecha es obligatoria para consultar disponibilidad.');
  }

  if (query.fecha && !validarFechaYYYYMMDD(query.fecha)) {
    errores.push('La fecha debe tener formato YYYY-MM-DD.');
  }

  if (errores.length) {
    throw new Error(errores.join(' '));
  }
}

function validarTransicionEstado(estadoActualCodigo, nuevoEstadoCodigo) {
  const estadoActual = normalizarTexto(estadoActualCodigo).toUpperCase();
  const estadoNuevo = normalizarTexto(nuevoEstadoCodigo).toUpperCase();

  const transicionesPermitidas = {
    ASIGNADA: ['CONFIRMADA', 'CANCELADA', 'ATENDIDA', 'NO_ASISTIO'],
    CONFIRMADA: ['CANCELADA', 'ATENDIDA', 'NO_ASISTIO'],
    CANCELADA: [],
    ATENDIDA: [],
    NO_ASISTIO: []
  };

  if (!transicionesPermitidas[estadoActual]) {
    throw new Error(`El estado actual ${estadoActual} no está configurado para transición.`);
  }

  if (!transicionesPermitidas[estadoActual].includes(estadoNuevo)) {
    throw new Error(`No se permite cambiar la cita de ${estadoActual} a ${estadoNuevo}.`);
  }
}

function mapearMostrarCitas(mostrar) {
  const value = normalizarTexto(mostrar).toLowerCase();

  if (['historicas', 'históricas', 'pasadas'].includes(value)) {
    return 'historicas';
  }

  if (['todas', 'todo'].includes(value)) {
    return 'todas';
  }

  return 'proximas';
}

async function listarCitas(query = {}) {
  const pacienteId = normalizarNumero(query.paciente_id);
  const estadoCitaId = normalizarNumero(query.estado_cita_id || query.estado_id);
  const mostrar = mapearMostrarCitas(query.mostrar);

  return repository.listarCitas({
    pacienteId,
    estadoCitaId,
    mostrar
  });
}

async function listarDisponibilidad(query = {}) {
  validarConsultaDisponibilidad(query);

  return repository.listarDisponibilidad({
    especialidadId: normalizarNumero(query.especialidad_id),
    sedeId: normalizarNumero(query.sede_id),
    medicoId: normalizarNumero(query.medico_id),
    consultorioId: normalizarNumero(query.consultorio_id),
    fecha: query.fecha
  });
}

async function crearCita(payload = {}, usuarioId = null) {
  validarCreacionCita(payload);
  validarFechaHoraFutura(payload.fecha, payload.hora);

  const pacienteId = normalizarNumero(payload.paciente_id);
  const agendaId = normalizarNumero(payload.agenda_id);
  const horarioMedicoId = normalizarNumero(payload.horario_medico_id);
  const medicoId = normalizarNumero(payload.medico_id);
  const especialidadId = normalizarNumero(payload.especialidad_id);
  const sedeId = normalizarNumero(payload.sede_id);
  const consultorioId = normalizarNumero(payload.consultorio_id);
  const tipoCitaId = normalizarNumero(payload.tipo_cita_id);

  const paciente = await repository.obtenerPacientePorId(pacienteId);

  if (!paciente) {
    throw new Error('El paciente no existe.');
  }

  const pacienteActivo = await repository.validarPacienteActivo(pacienteId);

  if (!pacienteActivo) {
    throw new Error('El paciente no se encuentra activo.');
  }

  const estadoAsignada = await repository.obtenerEstadoCitaPorCodigo('ASIGNADA');

  if (!estadoAsignada) {
    throw new Error('No existe el estado de cita ASIGNADA en la tabla estados_cita.');
  }

  const agendaDisponible = await repository.validarAgendaDisponible({
    agendaId,
    horarioMedicoId,
    fecha: payload.fecha,
    hora: payload.hora
  });

  if (!agendaDisponible) {
    throw new Error('La agenda u horario seleccionado no se encuentra disponible.');
  }

  const existeCruce = await repository.existeCitaAsignada({
    agendaId,
    horarioMedicoId,
    medicoId,
    fecha: payload.fecha,
    hora: payload.hora
  });

  if (existeCruce) {
    throw new Error('Ya existe una cita asignada para el recurso en esa fecha y hora.');
  }

  const bloqueoAgenda = await repository.existeBloqueoAgenda({
    agendaId,
    horarioMedicoId,
    medicoId,
    fecha: payload.fecha,
    hora: payload.hora
  });

  if (bloqueoAgenda) {
    throw new Error('La agenda seleccionada se encuentra bloqueada para la fecha u hora indicada.');
  }

  const consecutivo = await repository.generarConsecutivo();

  const citaCreada = await repository.crearCita({
    consecutivo,
    paciente_id: pacienteId,
    agenda_id: agendaId,
    horario_medico_id: horarioMedicoId,
    medico_id: medicoId,
    especialidad_id: especialidadId,
    sede_id: sedeId,
    consultorio_id: consultorioId,
    tipo_cita_id: tipoCitaId,
    estado_cita_id: estadoAsignada.id,
    fecha: payload.fecha,
    hora: payload.hora,
    valor_cita: payload.valor_cita || 0,
    observacion: normalizarTexto(payload.observacion) || null,
    usuario_creacion_id: usuarioId
  });

  await repository.registrarAuditoria({
    tabla: 'citas',
    registro_id: citaCreada.id,
    accion: 'CREAR_CITA',
    valor_anterior: null,
    valor_nuevo: JSON.stringify(citaCreada),
    usuario_id: usuarioId
  });

  return citaCreada;
}

async function cambiarEstado(params = {}) {
  const citaId = normalizarNumero(params.citaId || params.cita_id);
  const estadoCodigo = normalizarTexto(params.estadoCodigo || params.estado_codigo).toUpperCase();
  const usuarioId = normalizarNumero(params.usuarioId || params.usuario_id);
  const motivoCancelacionId = normalizarNumero(params.motivoCancelacionId || params.motivo_cancelacion_id);
  const observacion = normalizarTexto(params.observacion) || null;

  if (!citaId) {
    throw new Error('El identificador de la cita es obligatorio.');
  }

  if (!estadoCodigo) {
    throw new Error('El nuevo estado de la cita es obligatorio.');
  }

  const citaActual = await repository.obtenerCitaPorId(citaId);

  if (!citaActual) {
    throw new Error('La cita no existe.');
  }

  const estadoActual = await repository.obtenerEstadoCitaPorId(citaActual.estado_cita_id);

  if (!estadoActual) {
    throw new Error('El estado actual de la cita no existe en estados_cita.');
  }

  const nuevoEstado = await repository.obtenerEstadoCitaPorCodigo(estadoCodigo);

  if (!nuevoEstado) {
    throw new Error(`No existe el estado de cita ${estadoCodigo}.`);
  }

  validarTransicionEstado(estadoActual.codigo, nuevoEstado.codigo);

  if (estadoCodigo === 'CANCELADA' && !motivoCancelacionId) {
    throw new Error('Debe seleccionar un motivo de cancelación.');
  }

  await repository.actualizarEstadoCita({
    citaId,
    estadoCitaId: nuevoEstado.id,
    motivoCancelacionId,
    observacion,
    usuarioId
  });

  const citaActualizada = await repository.obtenerCitaPorId(citaId);

  await repository.registrarAuditoria({
    tabla: 'citas',
    registro_id: citaId,
    accion: 'CAMBIAR_ESTADO_CITA',
    valor_anterior: JSON.stringify(citaActual),
    valor_nuevo: JSON.stringify(citaActualizada),
    usuario_id: usuarioId
  });

  return citaActualizada;
}

async function confirmarCita(citaId, usuarioId = null) {
  return cambiarEstado({
    citaId,
    estadoCodigo: 'CONFIRMADA',
    usuarioId
  });
}

async function cancelarCita(citaId, payload = {}, usuarioId = null) {
  return cambiarEstado({
    citaId,
    estadoCodigo: 'CANCELADA',
    motivoCancelacionId: payload.motivo_cancelacion_id,
    observacion: payload.observacion,
    usuarioId
  });
}

async function marcarAtendida(citaId, usuarioId = null) {
  return cambiarEstado({
    citaId,
    estadoCodigo: 'ATENDIDA',
    usuarioId
  });
}

async function marcarNoAsistio(citaId, usuarioId = null) {
  return cambiarEstado({
    citaId,
    estadoCodigo: 'NO_ASISTIO',
    usuarioId
  });
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
};