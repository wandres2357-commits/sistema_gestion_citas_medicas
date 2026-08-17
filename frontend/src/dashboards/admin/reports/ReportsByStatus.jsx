export default function ReportsByStatus({ appointments }) {
  const statuses = ["disponible", "reservada", "atendida", "cancelada"];

  return (
    <div className="admin-card">
      <h3>Citas por Estado</h3>
      <table>
        <thead>
          <tr>
            <th>Estado</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {statuses.map(status => (
            <tr key={status}>
              <td>{status}</td>
              <td>
                {appointments.filter(a => a.status === status).length}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}