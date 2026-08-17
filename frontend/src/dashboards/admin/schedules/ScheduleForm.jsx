import { useState } from "react";

export default function ScheduleForm({ schedules, setSchedules }) {
  const [doctorName, setDoctorName] = useState("");
  const [locationName, setLocationName] = useState("");
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!doctorName || !locationName || !day || !startTime || !endTime) {
      return;
    }

    if (startTime >= endTime) {
      alert("La hora de inicio debe ser menor que la hora de fin");
      return;
    }

    const newSchedule = {
      id: crypto.randomUUID(),
      doctorName,
      locationName,
      day,
      startTime,
      endTime,
    };

    setSchedules([...schedules, newSchedule]);

    setDoctorName("");
    setLocationName("");
    setDay("");
    setStartTime("");
    setEndTime("");
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <h3>Asignar horario</h3>

      <input
        placeholder="Nombre del médico"
        value={doctorName}
        onChange={(e) => setDoctorName(e.target.value)}
      />

      <input
        placeholder="Sede / Clínica"
        value={locationName}
        onChange={(e) => setLocationName(e.target.value)}
      />

      <select value={day} onChange={(e) => setDay(e.target.value)}>
        <option value="">Seleccione día</option>
        <option>Lunes</option>
        <option>Martes</option>
        <option>Miércoles</option>
        <option>Jueves</option>
        <option>Viernes</option>
        <option>Sábado</option>
      </select>

      <input
        type="time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
      />

      <input
        type="time"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
      />

      <button type="submit">Guardar horario</button>
    </form>
  );
}