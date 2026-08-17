import { useState } from "react";
import SpecialtyForm from "./SpecialtyForm";
import SpecialtiesList from "./SpecialtiesList";

export default function SpecialtiesModule() {
  const [specialties, setSpecialties] = useState([]);

  return (
    <section>
      <h2>Especialidades Médicas</h2>

      <SpecialtyForm
        specialties={specialties}
        setSpecialties={setSpecialties}
      />

      <SpecialtiesList specialties={specialties} />
    </section>
  );
}
