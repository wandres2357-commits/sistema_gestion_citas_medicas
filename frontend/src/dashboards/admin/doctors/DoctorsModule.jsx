import { useState } from "react";
import DoctorCreate from "./DoctorCreate";
import DoctorsList from "./DoctorsList";

export default function DoctorsModule() {
  const [doctors, setDoctors] = useState([]);

  return (
    <section>
      <h2>Médicos</h2>

      <DoctorCreate doctors={doctors} setDoctors={setDoctors} />

      <DoctorsList doctors={doctors} setDoctors={setDoctors} />
    </section>
  );
}
