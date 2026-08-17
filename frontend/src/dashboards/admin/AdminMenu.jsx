export default function AdminMenu({
  section,
  onChange,
}) {
  const items = [
    {
      key: "home",
      label: "📊 Dashboard",
    },
    {
      key: "usuarios",
      label: "👥 Usuarios",
    },
    {
      key: "medicos",
      label: "🩺 Médicos",
    },
    {
      key: "citas",
      label: "📅 Citas",
    },
    {
      key: "reportes",
      label: "📈 Reportes",
    },
    {
      key: "especialidades",
      label: "🧾 Especialidades",
    },
    {
      key: "sedes",
      label: "🏥 Sedes / Clínicas",
    },
    {key: "consultorios",
      label: "🏢 Consultorios",
    },
    {
      key: "horarios",
      label: "⏱️ Horarios",
    },
    {
      key: "auditoria",
      label: "📜 Auditoría",
    },
  ];

  return (
    <aside className="admin-menu">
      <h2 className="admin-title">
        Administrador
      </h2>

      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          className={`admin-menu-item ${
            section === item.key
              ? "admin-menu-item--active"
              : ""
          }`}
          onClick={() => onChange(item.key)}
        >
          {item.label}
        </button>
      ))}
    </aside>
  );
}