export default function LocationsList({ locations }) {
  if (locations.length === 0) {
    return <p>No hay sedes registradas.</p>;
  }

  return (
    <ul>
      {locations.map((loc) => (
        <li key={loc.id}>
          <strong>{loc.name}</strong>
          {loc.address && <span> — {loc.address}</span>}
          {loc.phone && <span> — Tel: {loc.phone}</span>}
        </li>
      ))}
    </ul>
  );
}
