import { useEffect, useState } from "react";
import { getAuditLogs } from "./audit.service";
import AuditList from "./AuditList";

export default function AuditModule() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    setLogs(getAuditLogs());
  }, []);

  return (
    <section>
      <h2>Auditoría del Sistema</h2>
      <AuditList logs={logs} />
    </section>
  );
}