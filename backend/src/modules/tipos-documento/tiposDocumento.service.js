import * as repository
  from "./tiposDocumento.repository.js";

/**
 * Listar
 */
export async function getAll() {
  return repository.getAll();
}

/**
 * Buscar por ID
 */
export async function getById(id) {

  if (!id) {
    throw new Error(
      "Id inválido"
    );
  }

  return repository.getById(id);
}