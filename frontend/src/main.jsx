//src/main.jsx
import React, { useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom/client";

import "./styles/index.css";
import "./styles/App.css";               // ✅

import App from "./App.jsx";
import Login from "./pages/Login.jsx";   // ✅
import { getSession } from "./auth";     // ✅ gracias a auth/index.js

function Root() {
  const [showLogin, setShowLogin] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  const readAuth = useCallback(() => {
    try {
      const session = getSession();
      const token = session?.token || localStorage.getItem("token");
      return !!token;
    } catch {
      return !!localStorage.getItem("token");
    }
  }, []);

  useEffect(() => {
    const sync = () => setIsLogged(readAuth());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("auth:updated", sync);

    const openLogin = () => setShowLogin(true);
    window.openLoginModal = openLogin;
  
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("auth:updated", sync);
      window.removeEventListener("auth:open", openLogin);
    };
  }, [readAuth]);

  useEffect(() => {
    if (isLogged) setShowLogin(false);
  }, [isLogged]);

  return (
    <>
      <App />
      
{showLogin && !isLogged && (
  <div className="login-overlay" aria-modal="true" role="dialog">
    {/* Contenedor relativo para poder “sacar” la X fuera del card */}
    <div className="login-wrap">
      {/* X flotante fuera del card */}
      <button
        className="login-close-float"
        onClick={() => setShowLogin(false)}
        aria-label="Cerrar"
        title="Cerrar"
      >
        ✕
      </button>

      {/* Card del login */}
      <div className="login-card-shell">
        <Login
          onSuccess={() => {
            window.dispatchEvent(new Event("auth:updated"));
            setShowLogin(false);
          }}
        />
      </div>
    </div>
  </div>
)}
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);