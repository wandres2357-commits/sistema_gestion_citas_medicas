import ReportsSummary from "./ReportsSummary";
import ReportsByDoctor from "./ReportsByDoctor";
import ReportsByStatus from "./ReportsByStatus";
import ReportsByLocation from "./ReportsByLocation";

export default function ReportsModule({ appointments }) {
  return (
    <section>
      <h2>📊 Reportes del Sistema</h2>

      <ReportsSummary appointments={appointments} />
      <ReportsByStatus appointments={appointments} />
      <ReportsByDoctor appointments={appointments} />
      <ReportsByLocation appointments={appointments} />
    </section>
  );
}