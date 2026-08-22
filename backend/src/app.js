// backend/src/app.js
import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes.js";
import medicosRoutes from "./modules/medicos/medicos.routes.js";
import especialidadesRoutes from "./modules/especialidades/especialidades.routes.js";
import sedesRoutes from "./modules/sedes/sedes.routes.js";
import consultoriosRoutes from "./modules/consultorios/consultorios.routes.js";
import tiposDocumentoRoutes from "./modules/tipos-documento/tiposDocumento.routes.js";
import areasRoutes from "./modules/areas/areas.routes.js";
import horariosRoutes from "./modules/horarios/horarios.routes.js";
import citasRoutes from "./modules/citas/citas.routes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origen no permitido por CORS: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    status: "OK",
    message: "Backend SGCM funcionando correctamente",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/medicos", medicosRoutes);
app.use("/api/especialidades", especialidadesRoutes);
app.use("/api/sedes", sedesRoutes);
app.use("/api/consultorios", consultoriosRoutes);
app.use("/api/tipos-documento", tiposDocumentoRoutes);
app.use("/api/areas", areasRoutes);
app.use("/api/horarios", horariosRoutes);
app.use("/api/citas", citasRoutes);

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
});

app.use((error, req, res, next) => {
  console.error("ERROR GLOBAL:", {
    message: error.message,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    method: req.method,
    url: req.originalUrl,
  });

  if (error.message?.startsWith("Origen no permitido por CORS")) {
    return res.status(403).json({
      ok: false,
      message: error.message,
    });
  }

  return res.status(error.status || 500).json({
    ok: false,
    message: error.message || "Error interno del servidor.",
  });
});

export default app;