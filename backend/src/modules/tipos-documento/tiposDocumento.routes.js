import { Router } from "express";

import {
  getTiposDocumento,
  getTipoDocumentoById
} from "./tiposDocumento.controller.js";

const router = Router();

router.get(
  "/",
  getTiposDocumento
);

router.get(
  "/:id",
  getTipoDocumentoById
);

export default router;