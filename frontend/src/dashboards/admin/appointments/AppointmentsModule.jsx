import { useState } from "react";
import GenerateAppointments from "./GenerateAppointments";
import AppointmentsList from "./AppointmentsList";


export default function AppointmentsModule() {
  const [appointments, setAppointments] = useState([]);

  return (
    <section>
      <h2>Gestión de Citas Médicas</h2>

      <GenerateAppointments
        appointments={appointments}
        setAppointments={setAppointments}
      />

      <AppointmentsList appointments={appointments} setAppointments={setAppointments}/>

    </section>
  );
}