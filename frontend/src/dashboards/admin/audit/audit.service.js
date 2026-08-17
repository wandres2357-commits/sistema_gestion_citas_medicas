const auditLogs = [];

export function logAudit({ user, action, module, description }) {
  auditLogs.push({
    id: crypto.randomUUID(),
    user,
    action,
    module,
    description,
    timestamp: new Date().toISOString(),
  });
}

export function getAuditLogs() {
  return auditLogs;
}