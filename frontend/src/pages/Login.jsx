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

  const login = async (event) => {
    event?.preventDefault();

    if (loading) return;

    const correoLimpio = correo.trim();

    if (!correoLimpio || !password) {
      setError("Ingresa correo/documento y contraseña");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const apiUrl =
        import.meta.env.VITE_API_URL || "http://localhost:3000";

      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo: correoLimpio,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Usuario o contraseña incorrecta"
        );
      }

      saveSession(data);
      onSuccess?.(data);
    } catch (err) {
      setError(
        err.message || "Usuario o contraseña incorrecta"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <Card className="login-panel">
        {/* LOGO */}
        <div className="login-logo">
          <Logo size={96} />
        </div>

        {/* TÍTULO */}
        <h2 className="login-title">Iniciar sesión</h2>

        {/* FORMULARIO */}
        <form className="login-stack" onSubmit={login}>
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
              className="input-soft rounded-xl"
            />
          </div>

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
              className="input-soft rounded-xl pr-14"
            />

            <button
              type="button"
              className="login-eye"
              onClick={() =>
                setShowPassword((value) => !value)
              }
              aria-label={
                showPassword
                  ? "Ocultar contraseña"
                  : "Mostrar contraseña"
              }
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <div className="login-options">
            <label className="login-remember">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) =>
                  setRemember(e.target.checked)
                }
              />
              <span>Recordar usuario</span>
            </label>
          </div>

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <div className="login-btn-row">
            <Button
              type="submit"
              variant="accent"
              className="login-btn-compact"
              disabled={loading}
            >
              {loading ? "Iniciando..." : "Entrar"}
            </Button>
          </div>

          <div className="login-bottom-links">
            <button
              type="button"
              className="login-link"
              onClick={() =>
                console.log("Recuperar contraseña")
              }
            >
              ¿Olvidaste tu contraseña?
            </button>

            <div className="login-register">
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
        </form>
      </Card>
    </main>
  );
}