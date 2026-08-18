// backend/src/modules/citas/citas.routes.js
import express from "express";
import * as controller from "./citas.controller.js";

const router = express.Router();

router.get("/", controller.listarCitas);
router.get("/disponibilidad", controller.listarDisponibilidad);
router.post("/", controller.crearCita);

router.patch("/:id/confirmar", controller.confirmarCita);
router.patch("/:id/cancelar", controller.cancelarCita);
router.patch("/:id/atendida", controller.marcarAtendida);
router.patch("/:id/no-asistio", controller.marcarNoAsistio);

export default router;