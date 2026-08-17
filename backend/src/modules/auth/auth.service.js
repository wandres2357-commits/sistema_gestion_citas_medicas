import bcrypt from "bcryptjs";
import * as repository from "./auth.repository.js";

export async function login(
  correo,
  password
) {
  const usuario =
    await repository.findByCorreo(
      correo
    );

  if (!usuario) {
    throw new Error(
      "Usuario no existe"
    );
  }

  const ok =
    await bcrypt.compare(
      password,
      usuario.password_hash
    );

  console.log({
    correo,
    ok
  });

  if (!ok) {
    throw new Error(
      "Contraseña incorrecta"
    );
  }

  return {
    token: "SGCM-DEMO-TOKEN",

    user: {
      id: usuario.id,

      nombre_completo:
        usuario.nombre_completo,

      correo:
        usuario.correo,

      roles: [
        "administrador"
      ]
    }
  };
}