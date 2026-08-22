//src/App.jsx
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import AdminShell from "./dashboards/AdminShell";
import FooterSitemapSingle from "./components/FooterSitemapSingle";
import "./styles/App.css";
import Card from "./components/ui/Card";
import Logo from "./components/ui/Logo";
import ContactForm from "./components/ui/ContactForm";
import PQRForm from "./components/ui/PQRForm";

export default function App() {
  const [view, setView] = useState("inicio");
  const [showLogin, setShowLogin] = useState(false);

  // --- AUTH robusto ---
  const readAuth = () => {
    let role = localStorage.getItem("role");
    let token = localStorage.getItem("token");

    if (!role || !token) {
      try {
        const session = JSON.parse(localStorage.getItem("session"));
        if (session) {
          token =
            token ||
            session?.token ||
            session?.accessToken ||
            session?.jwt ||
            session?.authorization ||
            session?.authToken ||
            null;

          let rawRole =
          role ||
          session?.role ||
          session?.rol ||
          session?.perfil ||
          session?.user?.role ||
          session?.usuario?.rol ||
          null;

          if (!rawRole && Array.isArray(session?.user?.roles)) {
  const firstRole = session.user.roles[0];

  rawRole =
    typeof firstRole === "string"
      ? firstRole
      : firstRole?.nombre ||
        firstRole?.rol ||
        firstRole?.role ||
        null;
}

role =
  typeof rawRole === "string"
    ? rawRole.trim().toLowerCase()
    : null;
        }
      } catch {}
    }
    console.log("READ AUTH");

console.log(
  "SESSION:",
  localStorage.getItem("session")
);

console.log(
  "TOKEN:",
  localStorage.getItem("token")
);

console.log(
  "ROLE:",
  localStorage.getItem("role")
);
    return { role, isLogged: !!token };
  };

  // Declarar "init" UNA sola vez y antes de los useState que lo usan
  const init = readAuth();
  const [role, setRole] = useState(init.role);
  const [isLogged, setIsLogged] = useState(init.isLogged);

  // Rol válido para Admin
  const isAdmin = ["admin","administrador","administrator",].includes(String(role || "").toLowerCase());
  // Si tu backend alguna vez usa "administrator", puedes ampliar:
  // const isAdmin = ["admin", "administrador", "administrator"].includes(role);

  // Sync por eventos de storage/auth
  useEffect(() => {
    const syncAuth = () => {
      const { role, isLogged } = readAuth();
      setRole(role);
      setIsLogged(isLogged);
    };
    syncAuth();
    window.addEventListener("storage", syncAuth);
    window.addEventListener("auth:updated", syncAuth);
    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("auth:updated", syncAuth);
    };
  }, []);
  
useEffect(() => {
  const openLogin = () => setShowLogin(true);

  window.addEventListener("auth:open", openLogin);

  return () => {
    window.removeEventListener("auth:open", openLogin);
  };
}, []);


  // ⬇️ ⬇️  BLOQUE QUE PEDISTE: si está logueado y es admin, renderiza AdminShell
  if (isLogged && isAdmin) {
  const session = (() => {
    try {
      return JSON.parse(localStorage.getItem("session"));
    } catch {
      return null;
    }
  })();

  return (
    <AdminShell
      user={session?.user}
      onLogout={() => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("session");
        
        setRole(null);
        setIsLogged(false);
        setShowLogin(false);
        setView("inicio");
        
        window.dispatchEvent(new Event("auth:updated"));
      }
    }
    />
  );
}

  // ⬆️ ⬆️  FIN DEL BLOQUE

  // --- DATA DEL MAPA DEL SITIO ---
  const sitemapItems = [
    { title: "Inicio", key: "inicio", links: [{ label: "Ir a Inicio", view: "inicio" }] },
    {
      title: "¿Quiénes Somos?",
      key: "quienes",
      links: [
        { label: "Historia", view: "historia" },
        { label: "Misión", view: "mision" },
        { label: "Visión", view: "vision" },
        { label: "Política de Calidad", view: "politica" },
        { label: "Información Institucional", view: "info" },
      ],
    },
    {
      title: "Novedades",
      key: "novedades",
      links: [
        { label: "Noticias", view: "noticias" },
        { label: "Actualizaciones", view: "actualizaciones" },
        { label: "Boletines", view: "boletines" },
      ],
    },
    {
      title: "Soporte",
      key: "soporte",
      links: [
        { label: "Ayuda", view: "ayuda" },
        { label: "Preguntas Frecuentes", view: "faq" },
        { label: "PQR", view: "pqr" },
      ],
    },
    { title: "Contáctenos", key: "contacto", links: [{ label: "Formulario de Contacto", view: "contacto" }] },
  ];

  // --- NAVEGACIÓN DESDE EL FOOTER + SCROLL SUAVE ---
  const handleNavigate = (viewKey) => {
    setView(viewKey);
    requestAnimationFrame(() => {
      const mainEl = document.querySelector("main");
      if (mainEl) mainEl.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  // ======= SITIO PÚBLICO =======
  return (
    <div className="app">
      {/* NAV SUPERIOR (FIJO) */}
      <header className="topbar" role="banner">
        <div className="topbar-inner">
          {/* LOGO + Marca */}
          <div className="brand" aria-label="SGCM">
           <Logo size={36} className="logo" />
            <div>
          <div className="brand-title">SGCM – Sistema de Gestión de Citas Médicas</div>
        <div className="brand-sub">Salud • Calidad • Confianza</div>
      </div>
    </div>
          {/* MENÚ CENTRADO */}
          <ul className="menu" role="menubar" aria-label="Navegación principal">
            {/* Inicio */}
            <li className="nav-item" role="none">
              <button
                className={`link ${view === "inicio" ? "active" : ""}`}
                onClick={() => setView("inicio")}
                role="menuitem"
              >
                Inicio
              </button>
            </li>

            {/* ¿Quiénes Somos? */}
            <li className="nav-item" role="none">
              <button className="link" role="menuitem" aria-haspopup="true" aria-expanded="false">
                ¿Quiénes Somos?
              </button>
              <div className="dropdown" role="menu" aria-label="¿Quiénes Somos?">
                <button className={`menu-btn ${view === "historia" ? "active" : ""}`} onClick={() => setView("historia")}>
                  Historia
                </button>
                <button className={`menu-btn ${view === "mision" ? "active" : ""}`} onClick={() => setView("mision")}>
                  Misión
                </button>
                <button className={`menu-btn ${view === "vision" ? "active" : ""}`} onClick={() => setView("vision")}>
                  Visión
                </button>
                <button className={`menu-btn ${view === "politica" ? "active" : ""}`} onClick={() => setView("politica")}>
                  Política de Calidad
                </button>
                <button className={`menu-btn ${view === "info" ? "active" : ""}`} onClick={() => setView("info")}>
                  Información Institucional
                </button>
              </div>
            </li>

            {/* Novedades */}
            <li className="nav-item" role="none">
              <button className="link" role="menuitem" aria-haspopup="true" aria-expanded="false">
                Novedades
              </button>
              <div className="dropdown" role="menu" aria-label="Novedades">
                <button className={`menu-btn ${view === "noticias" ? "active" : ""}`} onClick={() => setView("noticias")}>
                  Noticias
                </button>
                <button
                  className={`menu-btn ${view === "actualizaciones" ? "active" : ""}`}
                  onClick={() => setView("actualizaciones")}
                >
                  Actualizaciones
                </button>
                <button className={`menu-btn ${view === "boletines" ? "active" : ""}`} onClick={() => setView("boletines")}>
                  Boletines
                </button>
              </div>
            </li>

            {/* Soporte */}
            <li className="nav-item" role="none">
              <button className="link" role="menuitem" aria-haspopup="true" aria-expanded="false">
                Soporte
              </button>
              <div className="dropdown" role="menu" aria-label="Soporte">
                <button className={`menu-btn ${view === "ayuda" ? "active" : ""}`} onClick={() => setView("ayuda")}>
                  Ayuda
                </button>
                <button className={`menu-btn ${view === "faq" ? "active" : ""}`} onClick={() => setView("faq")}>
                  Preguntas Frecuentes
                </button>
                <button className={`menu-btn ${view === "pqr" ? "active" : ""}`} onClick={() => setView("pqr")}>
                  PQR
                </button>
              </div>
            </li>

            {/* Contáctenos */}
            <li className="nav-item" role="none">
              <button className="link" role="menuitem" aria-haspopup="true" aria-expanded="false">
                Contáctenos
              </button>
              <div className="dropdown" role="menu" aria-label="Contáctenos">
                <button className={`menu-btn ${view === "contacto" ? "active" : ""}`} onClick={() => setView("contacto")}>
                  Formulario de Contacto
                </button>
              </div>
            </li>
          </ul>

          {/* Acciones derecha */}
          <div className="right">
            <span className="badge">Público</span>
            
            <button
            type="button"
            className="cta"
            onClick={() => {
              console.log("CLICK LOGIN");
              setShowLogin(true);
            }}
            title="Abrir inicio de sesión"
            >
              Iniciar sesión
              </button>

          </div>
        </div>
      </header>

      {/* ======= CONTENIDO ======= */}
      <main>
        {view === "inicio" && (
          <Card className="contact-panel">
            <div style={{
              textAlign: "center",
              marginBottom: "18px",
          }}>
            <span style={{ fontSize: "2.2rem", display: "block" }}></span>
            <h2 style={{
              fontWeight: "900",
              fontSize: "clamp(1.7rem, 2.4vw, 2.2rem)",
              color: "var(--primary)",
              marginTop: "6px",
            }}>Inicio 
            </h2>
          </div>
          <p style={{
            fontSize: "1.14rem",
            lineHeight: "1.75",
            color: "#1e293b",
            textAlign: "justify",
            marginBottom: "14px",
          }}>
            El SGCM (Sistema de Gestión de Citas Médicas) es una plataforma diseñada
            para facilitar la programación, consulta y administración de citas entre 
            pacientes y personal médico. Su objetivo es optimizar los procesos de 
            atención, mejorar la organización de las agendas médicas y brindar una 
            experiencia más eficiente para los usuarios.
            </p>
          </Card>
        )}
        {view === "historia" && (
          <Card className="contact-panel">
            <div style={{
              textAlign: "center",
              marginBottom: "18px",
          }}>
            <span style={{ fontSize: "2.2rem", display: "block" }}>📜</span>
            <h2 style={{
              fontWeight: "900",
              fontSize: "clamp(1.7rem, 2.4vw, 2.2rem)",
              color: "var(--primary)",
              marginTop: "6px",
            }}>Historia
            </h2>
          </div>
          <p style={{
            fontSize: "1.14rem",
            lineHeight: "1.75",
            color: "#1e293b",
            textAlign: "justify",
            marginBottom: "14px",
          }}>
            En el año 2025 SGCM (Sistema de Gestión de Citas Médicas) se desarrolla
            como una herramienta tecnológica de sistema de Información para mejorar 
            la organización y administración de las citas en los servicios de salud. 
            Surge como una alternativa a los métodos manuales, permitiendo automatizar 
            la programación, consulta y control de citas médicas. Además, facilita la 
            interacción entre pacientes, personal administrativo y profesionales de la 
            salud, contribuyendo a una atención más organizada, rápida y eficiente.
          </p>
        </Card>
      )}
        {view === "mision" && (
          <Card className="contact-panel">
            <div style={{
              textAlign: "center",
              marginBottom: "18px",
        }}>
          <span style={{ fontSize: "2.2rem", display: "block" }}>🎯</span>
          <h2 style={{
            fontWeight: "900",
            fontSize: "clamp(1.7rem, 2.4vw, 2.2rem)",
            color: "var(--primary)",
            marginTop: "6px",
        }}>Misión
          </h2>
        </div>
        <p style={{
          fontSize: "1.14rem",
          lineHeight: "1.75",
          color: "#1e293b",
          textAlign: "justify",
          marginBottom: "14px",
        }}>
          Brindar una plataforma tecnológica eficiente que permita gestionar de manera
          organizada y ágil la programación de citas médicas, facilitando la interacción
          entre pacientes, personal administrativo y profesionales de la salud. El sistema 
          busca mejorar la calidad del servicio, optimizar los tiempos de atención y garantizar 
          una adecuada administración de la información.
        </p>
      </Card>
    )}
        {view === "vision" && (
          <Card className="contact-panel">
            <div style={{
              textAlign: "center",
              marginBottom: "18px",
        }}>
          <span style={{ fontSize: "2.2rem", display: "block" }}>👁️</span>
          <h2 style={{
            fontWeight: "900",
            fontSize: "clamp(1.7rem, 2.4vw, 2.2rem)",
            color: "var(--primary)",
            marginTop: "6px",
        }}>Visión
          </h2>
        </div>
        <p style={{
          fontSize: "1.14rem",
          lineHeight: "1.75",
          color: "#1e293b",
          textAlign: "justify",
          marginBottom: "14px",
        }}>
          Convertir el Sistema de Gestión de Citas Médicas (SGCM) en la solución
          tecnológica líder a nivel nacional para la administración eficiente y
          segura de los servicios de salud. Aspiramos a ser una plataforma ejemplar
          por su estabilidad, escalabilidad y enfoque centrado en el usuario.
        </p>
        <p style={{
          fontSize: "1.14rem",
          lineHeight: "1.75",
          color: "#1e293b",
          textAlign: "justify",
        }}>
          Nuestra visión es impulsar la transformación digital del sector salud,
          optimizando tiempos, mejorando la experiencia de pacientes y
          profesionales, y promoviendo procesos más ágiles que permitan una atención
          humana, accesible y confiable en cualquier punto de atención.
        </p>
        </Card>
      )}
        {view === "contacto" && <ContactForm />}
        {view === "pqr" && <PQRForm />}
      </main>

        {/* ======= INICIO DE SESIÓN MODAL ======= */}
{showLogin && (
  <div className="login-overlay">
    <div className="login-wrap">
      <div className="login-card-shell">
        <button
          type="button"
          className="login-close-float"
          onClick={() => setShowLogin(false)}
          aria-label="Cerrar inicio de sesión"
        >
          ×
        </button>

        <Login
          onSuccess={() => {
            setShowLogin(false);

            const { role = null, isLogged = false } = readAuth() || {};
            setRole(role);
            setIsLogged(isLogged);
          }}
        />
      </div>
    </div>
  </div>
)}
      {/* ======= FOOTER ======= */}
      <FooterSitemapSingle items={sitemapItems} onNavigate={handleNavigate} />
    </div>
  );
}