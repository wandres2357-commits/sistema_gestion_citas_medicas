import ReserveAppointment from "./ReserveAppointment";
import UpdateAppointmentStatus from "./UpdateAppointmentStatus";

export default function AppointmentsList({ appointments, setAppointments }) {

  const updateAppointment = (updated) => {
    setAppointments(
      appointments.map((a) =>
        a.id === updated.id ? updated : a
      )
    );
  };

  if (appointments.length === 0) {
    return <p>No hay citas generadas.</p>;
  }

  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>Médico</th>
          <th>Especialidad</th>
          <th>Sede</th>
          <th>Día</th>
          <th>Hora</th>
          <th>Paciente</th>
          <th>Estado</th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody>
        {appointments.map((a) => (
          <tr key={a.id}>
            <td>{a.doctorName}</td>
            <td>{a.specialty}</td>
            <td>{a.location}</td>
            <td>{a.date}</td>
            <td>{a.time}</td>
            <td>{a.patientName || "-"}</td>
            <td>{a.status}</td>
            <td>
              {a.status === "disponible" && (
                <ReserveAppointment
                  appointment={a}
                  onReserve={updateAppointment}
                />
              )}

              {a.status === "reservada" && (
                <UpdateAppointmentStatus
                  appointment={a}
                  onUpdate={updateAppointment}
                />
              )}

              {(a.status === "atendida" || a.status === "cancelada") && "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}