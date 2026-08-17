import * as repository
  from "./horarios.repository.js";

const DIAS_VALIDOS = [
  "LUNES",
  "MARTES",
  "MIERCOLES",
  "JUEVES",
  "VIERNES",
  "SABADO",
  "DOMINGO"
];

function validarHora(
  hora
) {

  return /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/.test(
    hora
  );
}

function normalizarDia(
  dia
) {

  return String(
    dia || ""
  )
    .trim()
    .toUpperCase();
}

function validarDatosBasicos(
  data
) {

  if (!data.medico_id) {
    throw new Error(
      "Debe seleccionar un médico"
    );
  }

  if (!data.especialidad_id) {
    throw new Error(
      "Debe seleccionar una especialidad"
    );
  }

  if (!data.sede_id) {
    throw new Error(
      "Debe seleccionar una sede"
    );
  }

  if (!data.consultorio_id) {
    throw new Error(
      "Debe seleccionar un consultorio"
    );
  }

  if (!data.dia_semana) {
    throw new Error(
      "Debe seleccionar un día de la semana"
    );
  }

  data.dia_semana =
    normalizarDia(
      data.dia_semana
    );

  if (
    !DIAS_VALIDOS.includes(
      data.dia_semana
    )
  ) {

    throw new Error(
      "Día de la semana inválido"
    );
  }

  if (!data.hora_inicio) {
    throw new Error(
      "Debe ingresar la hora de inicio"
    );
  }

  if (!data.hora_fin) {
    throw new Error(
      "Debe ingresar la hora de fin"
    );
  }

  if (
    !validarHora(
      data.hora_inicio
    )
  ) {

    throw new Error(
      "Hora de inicio inválida"
    );
  }

  if (
    !validarHora(
      data.hora_fin
    )
  ) {

    throw new Error(
      "Hora de fin inválida"
    );
  }

  if (
    data.hora_inicio >=
    data.hora_fin
  ) {

    throw new Error(
      "La hora de inicio debe ser menor que la hora de fin"
    );
  }

  if (
    !data.duracion_cita ||
    Number(
      data.duracion_cita
    ) <= 0
  ) {

    throw new Error(
      "La duración de la cita debe ser mayor a cero"
    );
  }

  data.duracion_cita =
    Number(
      data.duracion_cita
    );
}

async function validarRelaciones(
  data
) {

  const medico =
    await repository.medicoExisteActivo(
      data.medico_id
    );

  if (!medico) {
    throw new Error(
      "El médico seleccionado no existe o está inactivo"
    );
  }

  const especialidadDelMedico =
    await repository.especialidadDelMedicoExiste(
      data.medico_id,
      data.especialidad_id
    );

  if (!especialidadDelMedico) {
    throw new Error(
      "La especialidad seleccionada no está asociada al médico"
    );
  }

  const sede =
    await repository.sedeExisteActiva(
      data.sede_id
    );

  if (!sede) {
    throw new Error(
      "La sede seleccionada no existe o está inactiva"
    );
  }

  const consultorio =
    await repository.consultorioExisteActivo(
      data.consultorio_id
    );

  if (!consultorio) {
    throw new Error(
      "El consultorio seleccionado no existe o está inactivo"
    );
  }

  const consultorioSede =
    await repository.consultorioPerteneceASede(
      data.consultorio_id,
      data.sede_id
    );

  if (!consultorioSede) {
    throw new Error(
      "El consultorio no pertenece a la sede seleccionada"
    );
  }
}

async function validarTraslapes(
  data,
  excludeId = null
) {

  const traslapeMedico =
    await repository.existeTraslapeMedico(
      data,
      excludeId
    );

  if (traslapeMedico) {
    throw new Error(
      "El médico ya tiene un horario asignado en ese rango"
    );
  }

  const traslapeConsultorio =
    await repository.existeTraslapeConsultorio(
      data,
      excludeId
    );

  if (traslapeConsultorio) {
    throw new Error(
      "El consultorio ya está ocupado en ese rango"
    );
  }
}

export async function getAll() {
  return repository.getAll();
}

export async function getById(id) {

  const horario =
    await repository.getById(id);

  if (!horario) {
    throw new Error(
      "Horario no encontrado"
    );
  }

  return horario;
}

export async function create(data) {

  validarDatosBasicos(data);

  await validarRelaciones(data);

  await validarTraslapes(data);

  return repository.create(data);
}

export async function update(
  id,
  data
) {

  const horario =
    await repository.getById(id);

  if (!horario) {
    throw new Error(
      "Horario no encontrado"
    );
  }

  validarDatosBasicos(data);

  await validarRelaciones(data);

  await validarTraslapes(
    data,
    id
  );

  return repository.update(
    id,
    data
  );
}

export async function remove(id) {

  const horario =
    await repository.getById(id);

  if (!horario) {
    throw new Error(
      "Horario no encontrado"
    );
  }

  return repository.remove(id);
}