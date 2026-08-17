import { Router } from "express";

import {
  getSedes,
  createSede,
  updateSede,
  deleteSede
} from "./sedes.controller.js";

const router = Router();

router.get(
  "/",
  getSedes
);

router.post(
  "/",
  createSede
);

router.put(
  "/:id",
  updateSede
);

router.delete(
  "/:id",
  deleteSede
);

export default router;