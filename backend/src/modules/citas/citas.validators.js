// backend/src/modules/citas/citas.validators.js

function normalizarEstado(value) {
  return String(value || "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/-/g, "_")
    .toUpperCase();
}

export function validarCrearCita(payload = {}) {
  const errores = [];

  if (!payload.paciente_id) {
    errores.push("El paciente es obligatorio.");
  }

  if (!payload.agenda_id && !payload.horario_medico_id) {
    errores.push(
      "Debe seleccionar una agenda u horario médico disponible."
    );
  }

  if (!payload.tipo_cita_id) {
    errores.push("El tipo de cita es obligatorio.");
  }

  if (!payload.fecha) {
    errores.push("La fecha de la cita es obligatoria.");
  }

  if (!payload.hora) {
    errores.push("La hora de la cita es obligatoria.");
  }

  if (
    payload.valor_cita !== undefined &&
    payload.valor_cita !== null &&
    payload.valor_cita !== "" &&
    Number(payload.valor_cita) < 0
  ) {
    errores.push("El valor de la cita no puede ser negativo.");
  }

  if (errores.length) {
    throw new Error(errores.join(" "));
  }
}

export function validarFechaHoraFutura(fecha, hora) {
  const horaNormalizada =
    String(hora || "").length === 5
      ? `${hora}:00`
      : hora;

  const fechaHora = new Date(`${fecha}T${horaNormalizada}`);
  const ahora = new Date();

  if (Number.isNaN(fechaHora.getTime())) {
    throw new Error("La fecha u hora de la cita no es válida.");
  }

  if (fechaHora < ahora) {
    throw new Error(
      "No se puede asignar una cita en una fecha u hora anterior a la actual."
    );
  }
}

export function obtenerTransicionesPermitidas() {
  return {
    EN_ESPERA: [
      "PROGRAMADA",
      "CANCELADA",
    ],

    PROGRAMADA: [
      "CONFIRMADA",
      "CANCELADA",
      "REPROGRAMADA",
      "EN_ESPERA",
    ],

    CONFIRMADA: [
      "ATENDIDA",
      "NO_ASISTIO",
      "CANCELADA",
      "REPROGRAMADA",
    ],

    REPROGRAMADA: [
      "PROGRAMADA",
      "CONFIRMADA",
      "CANCELADA",
      "EN_ESPERA",
    ],

    NO_ASISTIO: [
      "REPROGRAMADA",
    ],

    ATENDIDA: [],

    CANCELADA: [],
  };
}

export function validarTransicionEstado(
  estadoActualCodigo,
  nuevoEstadoCodigo
) {
  const estadoActual = normalizarEstado(estadoActualCodigo);
  const nuevoEstado = normalizarEstado(nuevoEstadoCodigo);

  if (!estadoActual) {
    throw new Error(
      "El estado actual de la cita es obligatorio."
    );
  }

  if (!nuevoEstado) {
    throw new Error(
      "El nuevo estado de la cita es obligatorio."
    );
  }

  if (estadoActual === nuevoEstado) {
    throw new Error(
      `La cita ya se encuentra en estado ${estadoActual}.`
    );
  }

  const transiciones = obtenerTransicionesPermitidas();
  const permitidas = transiciones[estadoActual];

  if (!permitidas) {
    throw new Error(
      `El estado actual ${estadoActual} no está configurado para transición.`
    );
  }

  if (!permitidas.includes(nuevoEstado)) {
    const estadosPermitidos = permitidas.length
      ? permitidas.join(", ")
      : "ninguno";

    throw new Error(
      `No se permite cambiar la cita de ${estadoActual} a ${nuevoEstado}. ` +
      `Estados permitidos desde ${estadoActual}: ${estadosPermitidos}.`
    );
  }

  return {
    estadoActual,
    nuevoEstado,
  };
}