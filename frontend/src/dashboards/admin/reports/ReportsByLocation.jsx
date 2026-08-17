export default function ReportsByLocation({ appointments }) {
  const data = {};

  appointments.forEach(a => {
    data[a.location] = (data[a.location] || 0) + 1;
  });

  return (
    <div className="admin-card">
      <h3>Citas por Sede</h3>
      <table>
        <thead>
          <tr>
            <th>Sede</th>
            <th>Citas</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([location, count]) => (
            <tr key={location}>
              <td>{location}</td>
              <td>{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}