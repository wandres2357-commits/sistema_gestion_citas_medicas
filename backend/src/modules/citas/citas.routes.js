// backend/src/modules/citas/citas.routes.js

import { Router } from "express";
import * as controller from "./citas.controller.js";

const router = Router();

/*
 * Consultas
 */
router.get("/", controller.listarCitas);
router.get("/disponibilidad", controller.listarDisponibilidad);
/*
 * Creación
 */
router.post("/", controller.crearCita);
/*
 * Cambios de estado
 */
router.patch("/:id/confirmar", controller.confirmarCita);
router.patch("/:id/cancelar", controller.cancelarCita);
router.patch("/:id/atendida", controller.marcarAtendida);
router.patch("/:id/no-asistio", controller.marcarNoAsistio);
router.patch("/:id/en-espera", controller.marcarEnEspera);
router.patch("/:id/reprogramada", controller.marcarReprogramada);
/*
 * Reprogramación completa:
 * fecha, hora, agenda y recurso.
 */
router.patch("/:id/reprogramar", controller.reprogramarFechaCita);

export default router;