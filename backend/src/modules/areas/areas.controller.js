import * as service
  from "./areas.service.js";

export async function getAreas(
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
        "Error consultando áreas"
    });
  }
}