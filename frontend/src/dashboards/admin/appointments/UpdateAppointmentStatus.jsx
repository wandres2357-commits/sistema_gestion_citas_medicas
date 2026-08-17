import { logAudit } from "../audit/audit.service";

export default function UpdateAppointmentStatus({ appointment, onUpdate }) {
  const markAsAttended = () => {
    const updated = {
      ...appointment,
      status: "atendida"
    };

    logAudit({
      user: "admin",
      action: "CITA_ATENDIDA",
      module: "Citas",
      description: `Cita atendida con ${appointment.doctorName} (${appointment.time})`,
    });

    onUpdate(updated);
  };

  const cancelAppointment = () => {
    const updated = {
      ...appointment,
      status: "cancelada"
    };

    logAudit({
      user: "admin",
      action: "CITA_CANCELADA",
      module: "Citas",
      description: `Cita cancelada de ${appointment.patientName} con ${appointment.doctorName}`,
    });

    onUpdate(updated);
  };

  return (
    <div style={{ display: "flex", gap: "4px" }}>
      <button onClick={markAsAttended}>✅ Atendida</button>
      <button onClick={cancelAppointment}>❌ Cancelar</button>
    </div>
  );
}