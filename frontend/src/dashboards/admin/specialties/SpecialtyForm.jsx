import { useState } from "react";

export default function SpecialtyForm({ specialties, setSpecialties }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    const newSpecialty = {
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description.trim(),
    };

    setSpecialties([...specialties, newSpecialty]);

    setName("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <h3>Crear especialidad</h3>

      <input
        type="text"
        placeholder="Nombre de la especialidad"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <textarea
        placeholder="Descripción (opcional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button type="submit">Agregar</button>
    </form>
  );
}
