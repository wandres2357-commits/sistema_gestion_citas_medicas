// backend/src/routes/users.routes.js
import { Router } from "express";
import { getUsers } from "../controllers/users.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();

router.get("/", verifyToken, requireRole("admin"), getUsers);

export default router;
