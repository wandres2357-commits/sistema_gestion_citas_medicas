import { useState } from "react";

export default function LocationForm({ locations, setLocations }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    const newLocation = {
      id: crypto.randomUUID(),
      name: name.trim(),
      address: address.trim(),
      phone: phone.trim(),
    };

    setLocations([...locations, newLocation]);

    setName("");
    setAddress("");
    setPhone("");
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <h3>Crear nueva sede</h3>

      <input
        type="text"
        placeholder="Nombre de la sede"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Dirección"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <input
        type="text"
        placeholder="Teléfono"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button type="submit">Agregar Sede</button>
    </form>
  );
}