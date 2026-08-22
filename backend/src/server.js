// backend/src/server.js
import dotenv from "dotenv";

dotenv.config();

import app from "./app.js";
import { pool } from "./config/db.js";

const PORT = Number(process.env.PORT || 3000);

async function startServer() {
  try {
    const connection = await pool.getConnection();

    await connection.ping();
    connection.release();

    console.log("Conexión MySQL establecida correctamente");

    app.listen(PORT, () => {
      console.log(`Servidor SGCM ejecutándose en puerto ${PORT}`);
      console.log(`API health: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error("No fue posible iniciar SGCM:", error.message);
    process.exit(1);
  }
}

startServer();