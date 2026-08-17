import express from "express";
import cors from "cors";
import { pool } from "./config/db.js";
import medicosRoutes from "./modules/medicos/medicos.routes.js";
import especialidadesRoutes from "./modules/especialidades/especialidades.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import sedesRoutes from "./modules/sedes/sedes.routes.js";
import consultoriosRoutes from "./modules/consultorios/consultorios.routes.js";
import tiposDocumentoRoutes from "./modules/tipos-documento/tiposDocumento.routes.js";
import areasRoutes from "./modules/areas/areas.routes.js";
import horariosRoutes from "./modules/horarios/horarios.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/especialidades",
  especialidadesRoutes
);

app.use(
  "/api/medicos",
  medicosRoutes
);

app.use(
  "/api/sedes",
  sedesRoutes
);

app.use(
  "/api/consultorios",
  consultoriosRoutes
);

app.use(
  "/api/tipos-documento",
  tiposDocumentoRoutes
);

app.use(
  "/api/areas",
  areasRoutes
);

app.use(
  "/api/horarios",
  horariosRoutes
);

app.get("/api/test", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        id,
        codigo,
        descripcion
      FROM especialidades
    `);

    res.json(rows);
  } catch (error) {
    console.error("ERROR MYSQL:", error);

    res.status(500).json({
      error: error.message
    });
  }
});

app.listen(3000, () => {
  console.log("Servidor ejecutándose");
});