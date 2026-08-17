export default function ReportsDashboard() {
  return (
    <section>
      <h2>Reportes del Sistema</h2>

      <ul>
        <li>📊 Citas por mes</li>
        <li>📈 Médicos con más citas</li>
        <li>🧾 Usuarios registrados</li>
        <li>⏱️ Tiempos promedio de atención</li>
      </ul>

      <button>Exportar PDF</button>
      <button>Exportar Excel</button>
    </section>
  );
}
