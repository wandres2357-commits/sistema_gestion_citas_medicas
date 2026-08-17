import { Router }
  from "express";

import {
  getAreas
} from "./areas.controller.js";

const router =
  Router();

router.get(
  "/",
  getAreas
);

export default router;