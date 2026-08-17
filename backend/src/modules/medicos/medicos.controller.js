import * as service
  from "./medicos.service.js";

/**
 * GET
 * Listar médicos
 */
export async function getMedicos(
  req,
  res
) {
  try {

    const data =
      await service.getAll();

    res.json(data);

  } catch (error) {

    console.error(
      "ERROR GET MEDICOS:",
      error
    );

    res.status(500).json({
      message:
        error.message
    });
  }
}

/**
 * GET
 * Buscar médico por ID
 */
export async function getMedicoById(
  req,
  res
) {
  try {

    const data =
      await service.getById(
        req.params.id
      );

    if (!data) {
      return res
        .status(404)
        .json({
          message:
            "Médico no encontrado"
        });
    }

    res.json(data);

  } catch (error) {

    console.error(
      "ERROR GET MEDICO:",
      error
    );

    res.status(500).json({
      message:
        error.message
    });
  }
}

/**
 * POST
 * Crear médico
 */
export async function createMedico(
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

    console.error(
      "ERROR CREATE MEDICO:",
      error
    );

    res.status(400).json({
      success: false,
      message:
        error.message
    });
  }
}

/**
 * PUT
 * Actualizar médico
 */
export async function updateMedico(
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

    console.error(
      "ERROR UPDATE MEDICO:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message
    });
  }
}

/**
 * DELETE LOGICO
 */
export async function deleteMedico(
  req,
  res
) {
  try {

    console.log(
      "SOFT DELETE MEDICO:",
      req.params.id
    );

    await service.remove(
      req.params.id
    );

    res.json({
      success: true
    });

  } catch (error) {

    console.error(
      "ERROR DELETE MEDICO:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message
    });
  }
}