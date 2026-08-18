import api from '../../../../services/api';

export async function getDocumentTypes() {
  const response = await api.get('/tipos-documento');
  return response.data.data;
}

export async function getAppointmentTypes() {
  const response = await api.get('/tipos-cita');
  return response.data.data;
}

export async function getAppointmentStates() {
  const response = await api.get('/estados-cita');
  return response.data.data;
}

export async function getCancellationReasons() {
  const response = await api.get('/motivos-cancelacion');
  return response.data.data;
}

export async function getSpecialties() {
  const response = await api.get('/especialidades');
  return response.data.data;
}

export async function getSites() {
  const response = await api.get('/sedes');
  return response.data.data;
}