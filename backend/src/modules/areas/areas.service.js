import * as repository
  from "./areas.repository.js";

export async function getAll() {
  return repository.getAll();
}