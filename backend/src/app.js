// backend/src/app.js
import express from "express";
import cors from "cors";
import authRoutes from "./auth/auth.routes.js";
import pool from "./config/db.js";
import especialidadesRoutes from "./modules/especialidades/especialidades.routes.js";
import medicosRoutes from "./modules/medicos/medicos.routes.js";


const app = express();

app.use(
  "/api/medicos",
  medicosRoutes
);

app.use(
  "/api/especialidades",
  especialidadesRoutes
);
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend SGCM funcionando correctamente",
  });
});

app.get("/api/db-test", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS fecha_servidor");
    res.json({
      status: "OK",
      message: "Conexión MySQL funcionando",
      data: rows[0],
    });
  } catch (error) {
    console.error("ERROR DB TEST:", error);
    res.status(500).json({
      status: "ERROR",
      message: "No se pudo conectar a MySQL",
    });
  }
});

export default app;