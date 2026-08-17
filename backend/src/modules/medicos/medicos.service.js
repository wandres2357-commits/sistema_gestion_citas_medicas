import * as repository
  from "./medicos.repository.js";

/**
 * Listar médicos
 */
export async function getAll() {
  return repository.getAll();
}

/**
 * Buscar médico por ID
 */
export async function getById(id) {

  if (!id) {
    throw new Error(
      "Id médico inválido"
    );
  }

  return repository.getById(id);
}

/**
 * Crear médico
 */
export async function create(data) {

  if (!data.numero_documento) {
    throw new Error(
      "El número de documento es obligatorio"
    );
  }

  if (!data.primer_nombre) {
    throw new Error(
      "El primer nombre es obligatorio"
    );
  }

  if (!data.primer_apellido) {
    throw new Error(
      "El primer apellido es obligatorio"
    );
  }

  if (
  !data.medico_especialidades ||
  data.medico_especialidades.length === 0
) {

  throw new Error(
    "Debe agregar al menos una especialidad"
  );
}
const tienePrincipal =
  data.medico_especialidades.some(
    (item) =>
      item.principal === true ||
      item.principal === 1
  );

if (!tienePrincipal) {
  throw new Error(
    "Debe marcar una especialidad como principal"
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

  return repository.create(data);
}

/**
 * Actualizar médico
 */
export async function update(
  id,
  data
) {

  if (!id) {
    throw new Error(
      "Id médico inválido"
    );
  }

  if (!data.numero_documento) {
    throw new Error(
      "El número de documento es obligatorio"
    );
  }

  if (!data.primer_nombre) {
    throw new Error(
      "El primer nombre es obligatorio"
    );
  }

  if (!data.primer_apellido) {
    throw new Error(
      "El primer apellido es obligatorio"
    );
  }

  return repository.update(
    id,
    data
  );
}

/**
 * Eliminación lógica
 */
export async function remove(id) {

  if (!id) {
    throw new Error(
      "Id médico inválido"
    );
  }

  return repository.remove(id);
}   