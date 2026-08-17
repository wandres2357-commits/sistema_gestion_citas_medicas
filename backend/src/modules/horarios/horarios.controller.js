import * as service
  from "./horarios.service.js";

export async function getHorarios(
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
      success: false,
      message:
        "Error consultando horarios"
    });
  }
}

export async function getHorarioById(
  req,
  res
) {

  try {

    const data =
      await service.getById(
        req.params.id
      );

    res.json(data);

  } catch (error) {

    console.error(error);

    res.status(404).json({
      success: false,
      message:
        error.message
    });
  }
}

export async function createHorario(
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
      "ERROR CREANDO HORARIO:",
      error
    );

    res.status(400).json({
      success: false,
      message:
        error.message,
      sqlMessage:
        error.sqlMessage,
      sqlCode:
        error.code
    });
  }
}

export async function updateHorario(
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
      "ERROR ACTUALIZANDO HORARIO:",
      error
    );

    res.status(400).json({
      success: false,
      message:
        error.message,
      sqlMessage:
        error.sqlMessage,
      sqlCode:
        error.code
    });
  }
}

export async function deleteHorario(
  req,
  res
) {

  try {

    await service.remove(
      req.params.id
    );

    res.json({
      success: true
    });

  } catch (error) {

    console.error(
      "ERROR ELIMINANDO HORARIO:",
      error
    );

    res.status(400).json({
      success: false,
      message:
        error.message
    });
  }
}