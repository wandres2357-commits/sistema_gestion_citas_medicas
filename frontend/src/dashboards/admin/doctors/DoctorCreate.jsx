import { useState } from "react";
import { logAudit } from "../audit/audit.service";

export default function DoctorCreate({ doctors, setDoctors }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

logAudit({
  user: "admin",
  action: "CREAR_MEDICO",
  module: "Médicos",
  description: `Se creó el médico ${fullName}`,
});
``
    if (!fullName || !email) return;

    const newDoctor = {
      id: crypto.randomUUID(),
      fullName,
      email,
      phone,
      specialties: [],
      locations: [],
      schedules: [],
    };

    setDoctors([...doctors, newDoctor]);

    setFullName("");
    setEmail("");
    setPhone("");
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <h3>Registrar médico</h3>

      <input
        placeholder="Nombre completo"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Teléfono"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button type="submit">Crear Médico</button>
    </form>
  );
}