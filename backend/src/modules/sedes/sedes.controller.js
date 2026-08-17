import * as service
from "./sedes.service.js";

export async function getSedes(
  req,
  res
) {
  try {

    const data =
      await service.getAll();

    res.json(data);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
}

export async function createSede(
  req,
  res
) {
  try {

    const id =
      await service.create(
        req.body
      );

    res.status(201).json({
      success: true,
      id
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
}

export async function updateSede(
  req,
  res
) {
  try {

    await service.update(
      req.params.id,
      req.body
    );

    res.json({
      success: true,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
}

export async function deleteSede(
  req,
  res
) {
  try {

    console.log(
      "SOFT DELETE SEDE:",
      req.params.id
    );

    const result =
      await service.remove(
        req.params.id
      );

    console.log(result);

    res.json({
      success: true
    });

  } catch (error) {

    console.error(
      "ERROR ELIMINANDO SEDE:",
      error
    );

    res.status(500).json({
      message: error.message
    });
  }
}