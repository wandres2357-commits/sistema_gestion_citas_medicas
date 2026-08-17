import * as repository
from "./sedes.repository.js";

export async function getAll() {
  return repository.getAll();
}

export async function getById(id) {
  return repository.getById(id);
}

export async function create(data) {
  return repository.create(data);
}

export async function update(
  id,
  data
) {
  return repository.update(
    id,
    data
  );
}

export async function remove(id) {
  return repository.remove(id);
}
