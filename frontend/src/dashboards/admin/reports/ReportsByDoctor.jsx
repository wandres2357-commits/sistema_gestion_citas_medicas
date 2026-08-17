export default function ReportsByDoctor({ appointments }) {
  const data = {};

  appointments.forEach(a => {
    data[a.doctorName] = (data[a.doctorName] || 0) + 1;
  });

  return (
    <div className="admin-card">
      <h3>Citas por Médico</h3>
      <table>
        <thead>
          <tr>
            <th>Médico</th>
            <th>Citas</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([doctor, count]) => (
            <tr key={doctor}>
              <td>{doctor}</td>
              <td>{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}