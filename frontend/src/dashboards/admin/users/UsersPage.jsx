import Card from "@/components/ui/Card";

export default function UsersPage() {
  return (
    <Card className="contact-panel">
      <h2
        style={{
          color: "var(--primary)",
          fontWeight: 800,
          marginBottom: "16px",
        }}
      >
        Usuarios
      </h2>

      <p>
        Administración de usuarios del sistema.
      </p>
    </Card>
  );
}