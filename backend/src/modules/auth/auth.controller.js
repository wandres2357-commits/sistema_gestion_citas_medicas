import * as service
from "./auth.service.js";

export async function login(
  req,
  res
) {
  try {

    const {
      correo,
      password
    } = req.body;

    const data =
      await service.login(
        correo,
        password
      );

    console.log(
      "LOGIN RESPONSE"
    );

    console.log(data);

    res.json(data);

  } catch (error) {

    res.status(401).json({
      message: error.message
    });
  }
}