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
 * "No asistió" -> "NO_ASISTIO"
 * "En espera" -> "EN_ESPERA"
 * "Re-programada" -> "RE_PROGRAMADA"
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
 * Valida los parámetros requeridos para consultar disponibilidad.
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
 * Convierte el filtro recibido al formato utilizado por el repositorio.
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

  const citas =
    await repository.listarCitas({
      pacienteId,
      estadoCitaId,
      mostrar,
    });

  return Array.isArray(citas)
    ? citas
    : [];
}

/**
 * Consulta la disponibilidad médica.
 */
async function listarDisponibilidad(query = {}) {
  validarConsultaDisponibilidad(query);

  const disponibilidad =
    await repository.listarDisponibilidad({
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

  return Array.isArray(disponibilidad)
    ? disponibilidad
    : [];
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
   * Validar existencia del paciente.
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

  /*
   * Validar estado del paciente.
   */
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
   * Obtener el estado inicial PROGRAMADA.
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
   * Validar existencia de agenda u horario.
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
   * Validar vigencia, día y hora del horario médico.
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
   * Validar cruce del recurso o agenda.
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
   * Validar que el paciente no tenga otra cita activa
   * en la misma fecha y hora.
   */
  const existeCrucePaciente =
    await repository.existeCitaPacienteMismoHorario({
      pacienteId,
      fecha: payload.fecha,
      hora: payload.hora,
    });

  if (existeCrucePaciente) {
    throw new Error(
      "El paciente ya tiene una cita activa en la fecha y hora seleccionadas."
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
   * Crear la cita.
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