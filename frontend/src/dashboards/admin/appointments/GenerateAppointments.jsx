import { useState } from "react";

export default function GenerateAppointments({ appointments, setAppointments }) {
  // Simulación de horarios existentes
  const availableSchedules = [
    {
      doctorName: "Dr. Juan Pérez",
      specialty: "Cardiología",
      location: "Clínica Central",
      day: "Lunes",
      startTime: "08:00",
      endTime: "12:00",
    },
  ];

  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [interval, setInterval] = useState(30);

  const generate = () => {
    if (!selectedSchedule) return;

    const slots = [];
    let current = selectedSchedule.startTime;

    while (current < selectedSchedule.endTime) {
      slots.push({
        id: crypto.randomUUID(),
        doctorName: selectedSchedule.doctorName,
        specialty: selectedSchedule.specialty,
        location: selectedSchedule.location,
        date: selectedSchedule.day,
        time: current,
        status: "disponible",
      });

      // sumar minutos
      const [h, m] = current.split(":").map(Number);
      const next = new Date(0, 0, 0, h, m + interval);
      current = next.toTimeString().slice(0, 5);
    }

    setAppointments([...appointments, ...slots]);
  };

  return (
    <div className="admin-form">
      <h3>Generar citas desde horarios</h3>

      <select
        onChange={(e) =>
          setSelectedSchedule(
            availableSchedules.find((_, i) => i === Number(e.target.value))
          )
        }
      >
        <option value="">Seleccione un horario</option>
        {availableSchedules.map((s, i) => (
          <option value={i} key={i}>
            {s.doctorName} – {s.day} ({s.startTime}–{s.endTime})
          </option>
        ))}
      </select>

      <label>
        Duración cita (min):
        <input
          type="number"
          value={interval}
          onChange={(e) => setInterval(Number(e.target.value))}
        />
      </label>

      <button onClick={generate}>Generar Citas</button>
    </div>
  );
}