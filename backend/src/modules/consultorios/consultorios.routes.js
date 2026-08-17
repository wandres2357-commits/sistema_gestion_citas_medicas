import { Router } from "express";

import {
  getConsultorios,
  createConsultorio,
  updateConsultorio,
  deleteConsultorio
} from "./consultorios.controller.js";

const router = Router();

router.get(
  "/",
  getConsultorios
);

router.post(
  "/",
  createConsultorio
);

router.put(
  "/:id",
  updateConsultorio
);

router.delete(
  "/:id",
  deleteConsultorio
);

export default router;