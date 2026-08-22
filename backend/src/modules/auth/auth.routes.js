// backend/src/modules/auth/auth.routes.js
import { Router } from "express";
import { login } from "./auth.controller.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({
    ok: true,
    module: "auth",
    message: "Módulo de autenticación activo",
  });
});

router.post("/login", login);

export default router;