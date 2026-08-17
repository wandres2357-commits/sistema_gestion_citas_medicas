export default function ReportsSummary({ appointments }) {
  const total = appointments.length;

  const count = (status) =>
    appointments.filter(a => a.status === status).length;

  return (
    <div className="admin-card">
      <h3>Resumen General</h3>
      <ul>
        <li>Total de citas: {total}</li>
        <li>Disponibles: {count("disponible")}</li>
        <li>Reservadas: {count("reservada")}</li>
        <li>Atendidas: {count("atendida")}</li>
        <li>Canceladas: {count("cancelada")}</li>
      </ul>
    </div>
  );
}