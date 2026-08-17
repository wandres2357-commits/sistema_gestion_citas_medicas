import DoctorAssign from "./DoctorAssign";

export default function DoctorsList({ doctors, setDoctors }) {
  const updateDoctor = (updatedDoctor) => {
    setDoctors(
      doctors.map((doc) =>
        doc.id === updatedDoctor.id ? updatedDoctor : doc
      )
    );
  };

  if (doctors.length === 0) {
    return <p>No hay médicos registrados.</p>;
  }

  return (
    <ul>
      {doctors.map((doc) => (
        <li key={doc.id}>
          <strong>{doc.fullName}</strong> — {doc.email}

          <DoctorAssign
            doctor={doc}
            updateDoctor={updateDoctor}
          />
        </li>
      ))}
    </ul>
  );
}