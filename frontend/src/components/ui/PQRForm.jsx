//src/components/PQRForm.jsx
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";

export default function PQRForm() {
  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: integrar lógica de envío si la necesitas (fetch, etc.)
  };

  return (
    <Card
      className="
        login-panel     /* mismo acabado del login (bordes y sombra) */
        contact-panel   /* variante de ancho para páginas (CSS global) */
      "
    >
      <h2 className="login-title">PQR</h2>

      <form onSubmit={onSubmit} className="login-stack">
        {/* Nombres */}
        <div className="login-field">
          <Input
            id="pqr-nombres"
            name="nombres"
            type="text"
            placeholder="Nombres"
            autoComplete="given-name"
            className="input-soft rounded-xl"
            required
          />
        </div>

        {/* Apellidos */}
        <div className="login-field">
          <Input
            id="pqr-apellidos"
            name="apellidos"
            type="text"
            placeholder="Apellidos"
            autoComplete="family-name"
            className="input-soft rounded-xl"
            required
          />
        </div>

        {/* Correo */}
        <div className="login-field">
          <Input
            id="pqr-correo"
            name="correo"
            type="email"
            placeholder="Correo"
            autoComplete="email"
            className="input-soft rounded-xl"
            required
          />
        </div>

        {/* Mensaje */}
        <div className="login-field">
          <Textarea
            id="pqr-mensaje"
            name="mensaje"
            placeholder="Mensaje"
            rows={4}
            className="input-soft rounded-xl"
            required
          />
        </div>

        {/* Botón compacto, centrado y separado */}
        <div className="login-btn-row">
          <Button
            variant="accent"
            type="submit"
            className="login-btn-compact"
          >
            Enviar
          </Button>
        </div>
      </form>
    </Card>
  );
}