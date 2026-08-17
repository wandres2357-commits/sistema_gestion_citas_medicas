import * as service
  from "./especialidades.service.js";

export async function getEspecialidades(
  req,
  res
) {
  try {

    const data =
      await service.getAll();

    res.json(data);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Error consultando especialidades"
    });
  }
}

export async function createEspecialidad(
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

    console.error(error);

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

export async function updateEspecialidad(
  req,
  res
) {
  try {

    await service.update(
      req.params.id,
      req.body
    );

    res.json({
      success: true
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
}

export async function deleteEspecialidad(
  req,
  res
) {
  try {

    console.log(
      "SOFT DELETE ESPECIALIDAD:",
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
      "ERROR ELIMINANDO ESPECIALIDAD:",
      error
    );

    res.status(500).json({
      message: error.message
    });
  }
}