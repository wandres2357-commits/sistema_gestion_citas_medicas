import api from '../../../../services/api';

export async function searchPatients(params) {
  const response = await api.get('/pacientes', { params });
  return response.data.data;
}

export async function getPatient(id) {
  const response = await api.get(`/pacientes/${id}`);
  return response.data.data;
}