// backend/src/modules/citas/citas.routes.js

import { Router } from "express";

import * as controller from "./citas.controller.js";

import {
  verifyToken,
} from "../../middleware/auth.middleware.js";

const router = Router();

/**
 * Todas las operaciones del módulo de citas
 * requieren una sesión válida.
 */
router.use(verifyToken);

router.get(
  "/",
  controller.listarCitas
);

router.get(
  "/disponibilidad",
  controller.listarDisponibilidad
);

router.post(
  "/",
  controller.crearCita
);

router.patch(
  "/:id/confirmar",
  controller.confirmarCita
);

router.patch(
  "/:id/cancelar",
  controller.cancelarCita
);

router.patch(
  "/:id/atendida",
  controller.marcarAtendida
);

router.patch(
  "/:id/no-asistio",
  controller.marcarNoAsistio
);

router.patch(
  "/:id/en-espera",
  controller.marcarEnEspera
);

router.patch(
  "/:id/reprogramada",
  controller.marcarReprogramada
);

router.patch(
  "/:id/reprogramar",
  controller.reprogramarFechaCita
);

export default router;