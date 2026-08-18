import api from '../../../../services/api';

export async function getAppointments({ pacienteId, mostrar }) {
  const response = await api.get('/citas', {
    params: {
      paciente_id: pacienteId,
      mostrar
    }
  });

  return response.data.data;
}

export async function getAvailability(filters) {
  const response = await api.get('/citas/disponibilidad', {
    params: filters
  });

  return response.data.data;
}

export async function createAppointment(payload) {
  const response = await api.post('/citas', payload);
  return response.data.data;
}

export async function confirmAppointment(id) {
  const response = await api.patch(`/citas/${id}/confirmar`);
  return response.data.data;
}

export async function cancelAppointment(id, payload) {
  const response = await api.patch(`/citas/${id}/cancelar`, payload);
  return response.data.data;
}

export async function markAppointmentAsAttended(id) {
  const response = await api.patch(`/citas/${id}/atendida`);
  return response.data.data;
}

export async function markAppointmentAsNoShow(id) {
  const response = await api.patch(`/citas/${id}/no-asistio`);
  return response.data.data;
}