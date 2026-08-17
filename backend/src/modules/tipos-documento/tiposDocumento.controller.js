import * as service
  from "./tiposDocumento.service.js";

/**
 * GET
 */
export async function getTiposDocumento(
  req,
  res
) {
  try {

    const data =
      await service.getAll();

    res.json(data);

  } catch (error) {

    console.error(
      "ERROR TIPOS DOCUMENTO:",
      error
    );

    res.status(500).json({
      message:
        error.message
    });
  }
}

/**
 * GET BY ID
 */
export async function getTipoDocumentoById(
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
            "Tipo documento no encontrado"
        });
    }

    res.json(data);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        error.message
    });
  }
}