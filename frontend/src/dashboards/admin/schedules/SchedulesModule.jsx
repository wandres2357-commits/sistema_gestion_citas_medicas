import { useState } from "react";
import ScheduleForm from "./ScheduleForm";
import SchedulesList from "./SchedulesList";

export default function SchedulesModule() {
  const [schedules, setSchedules] = useState([]);

  return (
    <section>
      <h2>Horarios por Médico</h2>

      <ScheduleForm
        schedules={schedules}
        setSchedules={setSchedules}
      />

      <SchedulesList schedules={schedules} />
    </section>
  );
}
