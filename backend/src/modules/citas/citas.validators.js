function validarCrearCita(payload) {
  const errores = [];

  if (!payload.paciente_id) errores.push('El paciente es obligatorio.');
  if (!payload.agenda_id && !payload.horario_medico_id) {
    errores.push('Debe seleccionar una agenda u horario médico disponible.');
  }
  if (!payload.tipo_cita_id) errores.push('El tipo de cita es obligatorio.');
  if (!payload.fecha) errores.push('La fecha de la cita es obligatoria.');
  if (!payload.hora) errores.push('La hora de la cita es obligatoria.');

  if (payload.valor_cita !== undefined && Number(payload.valor_cita) < 0) {
    errores.push('El valor de la cita no puede ser negativo.');
  }

  if (errores.length) {
    throw new Error(errores.join(' '));
  }
}

function validarFechaHoraFutura(fecha, hora) {
  const fechaHora = new Date(`${fecha}T${hora}`);
  const ahora = new Date();

  if (Number.isNaN(fechaHora.getTime())) {
    throw new Error('La fecha u hora de la cita no es válida.');
  }

  if (fechaHora < ahora) {
    throw new Error('No se puede asignar una cita en una fecha u hora anterior a la actual.');
  }
}

function validarTransicionEstado(estadoActualCodigo, nuevoEstadoCodigo) {
  const transiciones = {
    ASIGNADA: ['CONFIRMADA', 'CANCELADA', 'ATENDIDA', 'NO_ASISTIO'],
    CONFIRMADA: ['CANCELADA', 'ATENDIDA', 'NO_ASISTIO'],
    CANCELADA: [],
    ATENDIDA: [],
    NO_ASISTIO: []
  };

  if (!transiciones[estadoActualCodigo]?.includes(nuevoEstadoCodigo)) {
    throw new Error(
      `No se permite cambiar la cita de ${estadoActualCodigo} a ${nuevoEstadoCodigo}.`
    );
  }
}

module.exports = {
  validarCrearCita,
  validarFechaHoraFutura,
}