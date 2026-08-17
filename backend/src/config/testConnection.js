import { pool } from "./db.js";

export async function testConnection() {
  try {
    const conn =
      await pool.getConnection();

    console.log(
      "✅ Conectado a SGCMDB03"
    );

    conn.release();
  } catch (error) {
    console.error(
      "❌ Error conexión BD",
      error
    );
  }
}