export default function AuditList({ logs }) {
  if (logs.length === 0) {
    return <p>No hay eventos registrados.</p>;
  }

  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>Usuario</th>
          <th>Acción</th>
          <th>Módulo</th>
          <th>Descripción</th>
          <th>Fecha</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log) => (
          <tr key={log.id}>
            <td>{log.user}</td>
            <td>{log.action}</td>
            <td>{log.module}</td>
            <td>{log.description}</td>
            <td>{new Date(log.timestamp).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}