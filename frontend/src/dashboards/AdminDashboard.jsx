import Card from "@/components/ui/Card";
import Logo from "@/components/ui/Logo";

export default function AdminDashboard({
  user,
  section = "home",
}) {
  if (section === "home") {
    return (
      <Card className="contact-panel">
        <div
          style={{
            textAlign: "center",
            marginBottom: "18px",
          }}
        >
          <Logo
            size={90}
            showPulse={false}
          />

          <h2 style={titleStyle}>
            Panel de Administración
          </h2>
        </div>

        <p style={textStyle}>
          Bienvenido{" "}
          <strong>
            {user?.nombre ||
              user?.username ||
              user?.correo ||
              "Administrador"}
          </strong>
          .
        </p>

        <p style={textStyle}>
          Desde este panel podrás administrar
          usuarios, médicos, citas, horarios,
          reportes y demás módulos del SGCM.
        </p>
      </Card>
    );
  }

  if (section === "medicos") {
    return (
      <Card className="contact-panel">
        <h2 style={titleStyle}>
          Gestión de Médicos
        </h2>

        <p style={textStyle}>
          Administración de médicos.
        </p>
      </Card>
    );
  }

  if (section === "citas") {
    return (
      <Card className="contact-panel">
        <h2 style={titleStyle}>
          Gestión de Citas
        </h2>

        <p style={textStyle}>
          Administración de citas médicas.
        </p>
      </Card>
    );
  }

  if (section === "reportes") {
    return (
      <Card className="contact-panel">
        <h2 style={titleStyle}>
          Reportes
        </h2>

        <p style={textStyle}>
          Reportes y estadísticas.
        </p>
      </Card>
    );
  }

  if (section === "especialidades") {
    return (
      <Card className="contact-panel">
        <h2 style={titleStyle}>
          Gestión de Especialidades
        </h2>

        <p style={textStyle}>
          Administración de especialidades médicas.
        </p>
      </Card>
    );
  }

  if (section === "sedes") {
    return (
      <Card className="contact-panel">
        <h2 style={titleStyle}>
          Gestión de Sedes / Clínicas
        </h2>

        <p style={textStyle}>
          Administración de sedes.
        </p>
      </Card>
    );
  }

  if (section === "horarios") {
    return (
      <Card className="contact-panel">
        <h2 style={titleStyle}>
          Gestión de Horarios
        </h2>

        <p style={textStyle}>
          Administración de horarios.
        </p>
      </Card>
    );
  }

  if (section === "auditoria") {
    return (
      <Card className="contact-panel">
        <h2 style={titleStyle}>
          Auditoría del Sistema
        </h2>

        <p style={textStyle}>
          Consultar registros del sistema.
        </p>
      </Card>
    );
  }

  return null;
}

const titleStyle = {
  fontWeight: "900",
  fontSize: "clamp(1.8rem, 2.5vw, 2.3rem)",
  color: "var(--primary)",
  textAlign: "center",
};

const textStyle = {
  fontSize: "1.1rem",
  lineHeight: "1.8",
  color: "#1e293b",
  textAlign: "justify",
};