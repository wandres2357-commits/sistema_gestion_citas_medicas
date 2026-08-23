// backend/src/modules/citas/citas.service.js

import * as repository from "./citas.repository.js";
import db from "../../config/db.js";

import {
  validarCrearCita,
  validarFechaHoraFutura,
  validarTransicionEstado,
} from "./citas.validators.js";

function normalizarTexto(value) {
  return String(value || "").trim();
}

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

function normalizarEstado(value) {
  return String(value || "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/-/g, "_")
    .toUpperCase();
}

function validarFechaYYYYMMDD(fecha) {
  return /^\d{4}-\d{2}-\d{2}$/.test(
    String(fecha || "")
  );
}

function validarHoraHHMM(hora) {
  return /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(
    String(hora || "")
  );
}

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

  const estadoProgramada =
    await repository.obtenerEstadoCitaPorCodigo(
      "PROGRAMADA"
    );

  if (!estadoProgramada) {
    throw new Error(
      "No existe el estado PROGRAMADA en la tabla estados_cita."
    );
  }

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
 * Cambia el estado de una cita utilizando una
 * transacción MySQL.
 *
 * Operaciones atómicas:
 * 1. Bloquear y consultar cita.
 * 2. Validar transición.
 * 3. Actualizar cita.
 * 4. Registrar auditoría.
 * 5. Confirmar transacción.
 *
 * Si una operación falla, se ejecuta rollback.
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

  const motivoCancelacionId = normalizarNumero(
    params.motivoCancelacionId ||
    params.motivo_cancelacion_id
  );

  const observacion =
    normalizarTexto(
      params.observacion ||
      params.observaciones
    ) || null;

  if (!citaId) {
    throw new Error("El identificador de la cita es obligatorio.");
  }

  if (!estadoCodigo) {
    throw new Error("El nuevo estado de la cita es obligatorio.");
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    /**
     * Se bloquea la fila para evitar dos cambios
     * simultáneos sobre la misma cita.
     */
    const citaActual = await repository.obtenerCitaPorId(
      citaId,
      connection,
      true
    );

    if (!citaActual) {
      throw new Error("La cita no existe.");
    }

    const estadoActual = await repository.obtenerEstadoCitaPorId(
      citaActual.estado_cita_id,
      connection
    );

    if (!estadoActual) {
      throw new Error("El estado actual de la cita no existe en estados_cita.");
    }

    const nuevoEstado = await repository.obtenerEstadoCitaPorCodigo(
      estadoCodigo,
      connection
    );

    if (!nuevoEstado) {
      throw new Error(`No existe el estado de cita ${estadoCodigo}.`);
    }

    validarTransicionEstado(
      estadoActual.codigo,
      nuevoEstado.codigo
    );

    if (
      nuevoEstado.codigo === "CANCELADA" &&
      !motivoCancelacionId
    ) {
      throw new Error("Debe seleccionar un motivo de cancelación.");
    }

    if (
      nuevoEstado.codigo === "REPROGRAMADA" &&
      !observacion
    ) {
      throw new Error("Debe registrar una observación para reprogramar la cita.");
    }

    if (
      nuevoEstado.codigo === "EN_ESPERA" &&
      !observacion
    ) {
      throw new Error("Debe registrar una observación para enviar la cita a espera.");
    }

    /**
     * La actualización usa la misma conexión.
     */
    await repository.actualizarEstadoCita(
      {
        citaId,
        estadoCitaId: nuevoEstado.id,
        motivoCancelacionId,
        observacion,
        usuarioId,
      },
      connection
    );

    /**
     * Se consulta el resultado sin salir de la
     * transacción.
     */
    const citaActualizada = await repository.obtenerCitaPorId(
      citaId,
      connection
    );

    /**
     * La auditoría se inserta usando la misma
     * conexión transaccional.
     */
    await repository.registrarAuditoria(
      {
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
          motivo_cancelacion_id: motivoCancelacionId,
        }),
        usuario_id: usuarioId,
      },
      connection
    );

    /**
     * Solo se confirma cuando ambas operaciones
     * finalizaron correctamente.
     */
    await connection.commit();

    return citaActualizada;
  } catch (error) {
    try {
      await connection.rollback();
    } catch (rollbackError) {
      console.error(
        "ERROR ROLLBACK cambiarEstado:",
        rollbackError
      );
    }
    throw error;
  } finally {
    connection.release();
  }
}

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

  const existeCrucePaciente =
    await repository.existeCitaPacienteMismoHorario({
      pacienteId: citaActual.paciente_id,
      fecha,
      hora,
      excluirCitaId: id,
    });

  if (existeCrucePaciente) {
    throw new Error(
      "El paciente ya tiene otra cita activa en la nueva fecha y hora."
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