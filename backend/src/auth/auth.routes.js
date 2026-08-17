// backend/src/auth/auth.routes.js
import { Router } from "express";
import { login } from "./auth.controller.js";

const router = Router();

router.post("/login", login);

export default router;