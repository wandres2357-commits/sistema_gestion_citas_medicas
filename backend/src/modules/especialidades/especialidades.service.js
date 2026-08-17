import * as repository
  from "./especialidades.repository.js";

export async function getAll() {
  return repository.getAll();
}

export async function create(data) {

  if (!data.codigo?.trim()) {

    throw new Error(
      "El código es obligatorio"
    );
  }

  if (!data.descripcion?.trim()) {

    throw new Error(
      "La descripción es obligatoria"
    );
  }

  return repository.create(data);
}

export async function update(
  id,
  data
) {

  if (!data.codigo?.trim()) {

    throw new Error(
      "El código es obligatorio"
    );
  }

  if (!data.descripcion?.trim()) {

    throw new Error(
      "La descripción es obligatoria"
    );
  }

  return repository.update(
    id,
    data
  );
}

export async function remove(id) {
  return repository.remove(id);
}