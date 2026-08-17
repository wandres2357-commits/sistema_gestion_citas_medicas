export default function SchedulesList({ schedules }) {
  if (schedules.length === 0) {
    return <p>No hay horarios asignados.</p>;
  }

  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>Médico</th>
          <th>Sede</th>
          <th>Día</th>
          <th>Horario</th>
        </tr>
      </thead>
      <tbody>
        {schedules.map((sch) => (
          <tr key={sch.id}>
            <td>{sch.doctorName}</td>
            <td>{sch.locationName}</td>
            <td>{sch.day}</td>
            <td>
              {sch.startTime} – {sch.endTime}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}