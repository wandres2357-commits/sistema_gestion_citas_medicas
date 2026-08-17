// src/pages/Login.jsx
import { useState } from "react";
import { saveSession } from "@/auth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import Logo from "@/components/ui/Logo";

export default function Login({ onSuccess }) {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async () => {
  if (loading) return;

  const correoLimpio = correo.trim();

  if (!correoLimpio || !password) {
    setError("Ingresa correo/documento y contraseña");
    return;
  }

  setLoading(true);
  setError("");

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo: correoLimpio,
          password,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Usuario o contraseña incorrecta");
    }

    saveSession(data);
    onSuccess?.(data);
  } catch (err) {
    setError(err.message || "Usuario o contraseña incorrecta");
  } finally {
    setLoading(false);
  }
};

const handleKeyDown = (e) => {
  if (e.key === "Enter") {
    login();
  }
};

  return (
    <Card className="login-panel">
      {/* LOGO */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "12px",
        }}
      >
        <Logo size={96} />
      </div>

      {/* TITULO */}
      <h2 className="login-title">Iniciar sesión</h2>

      {/* FORMULARIO */}
      <div className="login-stack">

        {/* USUARIO / CORREO */}
        <label className="login-label">
          Número de documento o correo *
        </label>

        <div className="login-field">
          <Input
            type="text"
            placeholder="Documento o correo"
            autoComplete="username"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            onKeyDown={handleKeyDown}
            className="input-soft rounded-xl"
          />
        </div>

        {/* PASSWORD */}
        <label className="login-label">
          Contraseña *
        </label>

        <div className="login-field relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            className="input-soft rounded-xl pr-14"
          />

          <button
            type="button"
            className="login-eye"
            onClick={() => setShowPassword(!showPassword)}
            aria-label="Mostrar contraseña"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        {/* RECORDAR */}
        <div className="login-options">
          <label className="login-remember">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <span>Registrar usuario y contraseña</span>
          </label>
        </div>

        {/* ERROR */}
        {error && (
          <p className="login-error">
            {error}
          </p>
        )}

        {/* BOTON */}
        <div className="login-btn-row">
          <Button
            variant="accent"
            className="login-btn-compact"
            onClick={login}
            disabled={loading}
          >
            {loading ? "Iniciando..." : "Entrar"}
          </Button>
        </div>

        {/* ENLACES INFERIORES */}
        <div
          style={{
            marginTop: "14px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <button
            type="button"
            className="login-link"
            onClick={() => console.log("Recuperar contraseña")}
          >
            ¿Olvidaste tu contraseña?
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <span>¿No tienes cuenta?</span>

            <button
              type="button"
              className="login-link"
              onClick={() => console.log("Ir a registro")}
            >
              Registrarme
            </button>
          </div>
        </div>

      </div>
    </Card>
  );
}