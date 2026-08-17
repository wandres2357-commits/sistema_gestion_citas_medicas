export default function SpecialtiesList({ specialties }) {
  if (specialties.length === 0) {
    return <p>No hay especialidades registradas.</p>;
  }

  return (
    <ul>
      {specialties.map((spec) => (
        <li key={spec.id}>
          <strong>{spec.name}</strong>
          {spec.description && (
            <span> — {spec.description}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
