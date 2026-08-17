import * as service
from "./consultorios.service.js";

export async function getConsultorios(
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

export async function createConsultorio(
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

export async function updateConsultorio(
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

export async function deleteConsultorio(
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

    res.status(500).json({
      message: error.message
    });
  }
}