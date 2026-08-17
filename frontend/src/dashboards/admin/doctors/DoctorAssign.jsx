import { useState } from "react";

export default function DoctorAssign({ doctor, updateDoctor }) {
  // 🔹 Simulación de datos disponibles
  const availableSpecialties = ["Cardiología", "Pediatría", "Dermatología"];
  const availableLocations = ["Clínica Central", "IPS Norte"];

  const availableSchedules = [
    "Lunes 08:00 - 12:00 (Clínica Central)",
    "Martes 14:00 - 18:00 (IPS Norte)",
    "Miércoles 08:00 - 12:00 (Clínica Central)"
  ];

  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState("");

  const addSpecialty = () => {
    if (!selectedSpecialty || doctor.specialties.includes(selectedSpecialty)) {
      return;
    }

    updateDoctor({
      ...doctor,
      specialties: [...doctor.specialties, selectedSpecialty],
    });

    setSelectedSpecialty("");
  };

  const addLocation = () => {
    if (!selectedLocation || doctor.locations.includes(selectedLocation)) {
      return;
    }

    updateDoctor({
      ...doctor,
      locations: [...doctor.locations, selectedLocation],
    });

    setSelectedLocation("");
  };

  const addSchedule = () => {
    if (!selectedSchedule || doctor.schedules.includes(selectedSchedule)) {
      return;
    }

    updateDoctor({
      ...doctor,
      schedules: [...doctor.schedules, selectedSchedule],
    });

    setSelectedSchedule("");
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      {/* ESPECIALIDADES */}
      <div>
        <strong>Especialidades:</strong>{" "}
        {doctor.specialties.length ? doctor.specialties.join(", ") : "Ninguna"}
      </div>

      <select value={selectedSpecialty} onChange={(e) => setSelectedSpecialty(e.target.value)}>
        <option value="">Asignar especialidad</option>
        {availableSpecialties.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>
      <button onClick={addSpecialty}>➕</button>

      {/* SEDES */}
      <div style={{ marginTop: "0.5rem" }}>
        <strong>Sedes:</strong>{" "}
        {doctor.locations.length ? doctor.locations.join(", ") : "Ninguna"}
      </div>

      <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
        <option value="">Asignar sede</option>
        {availableLocations.map((l) => (
          <option key={l}>{l}</option>
        ))}
      </select>
      <button onClick={addLocation}>➕</button>

      {/* HORARIOS */}
      <div style={{ marginTop: "0.5rem" }}>
        <strong>Horarios:</strong>{" "}
        {doctor.schedules.length ? doctor.schedules.join(" | ") : "Ninguno"}
      </div>

      <select value={selectedSchedule} onChange={(e) => setSelectedSchedule(e.target.value)}>
        <option value="">Asignar horario</option>
        {availableSchedules.map((h) => (
          <option key={h}>{h}</option>
        ))}
      </select>
      <button onClick={addSchedule}>➕</button>
    </div>
  );
}