import { useState } from "react";
import { logAudit } from "../audit/audit.service";

export default function ReserveAppointment({ appointment, onReserve }) {
  const [patientName, setPatientName] = useState("");

  const handleReserve = () => {
    if (!patientName.trim()) return;

logAudit({
  user: "paciente",
  action: "RESERVAR_CITA",
  module: "Citas",
  description: `Paciente ${patientName} reservó cita con ${appointment.doctorName}`,
});
    onReserve({
      ...appointment,
      status: "reservada",
      patientName: patientName.trim(),
    });

    setPatientName("");
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Nombre del paciente"
        value={patientName}
        onChange={(e) => setPatientName(e.target.value)}
      />

      <button onClick={handleReserve}>
        Reservar
      </button>
    </div>
  );
}