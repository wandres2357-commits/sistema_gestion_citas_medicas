import { useEffect, useMemo, useState } from "react";
import AdminDashboard from "./AdminDashboard";
import UsersPage from "./admin/users/UsersPage";
import AdminMenu from "./admin/AdminMenu";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import { getToken, logout } from "@/auth";
import "./admin.css";
import EspecialidadesPage from "./admin/especialidades/EspecialidadesPage";
import SedesPage from "./admin/sedes/SedesPage";
import MedicosPage from "./admin/medicos/MedicosPage";
import ConsultoriosPage from "./admin/consultorios/ConsultoriosPage";
import HorariosPage from "./admin/horarios/HorariosPage";

export default function AdminShell({ onLogout, user }) {
  const [section, setSection] = useState("home");

  useEffect(() => {
    const token = getToken();

    if (!token) {
      logout();
      onLogout?.();
      return;
    }

    const onExpired = () => {
      logout();
      onLogout?.();
    };

    window.addEventListener(
      "auth:expired",
      onExpired
    );

    return () => {
      window.removeEventListener(
        "auth:expired",
        onExpired
      );
    };
  }, [onLogout]);

  const handleLogout = () => {
    logout();
    onLogout?.();
  };

  const displayName =
    user?.nombre ||
    user?.username ||
    user?.correo ||
    "Administrador";

  const content = useMemo(() => {
    switch (section) {
      case "usuarios":
        return <UsersPage />;

      case "medicos":
        return <MedicosPage />;

      case "citas":
        return (
          <AdminDashboard
            section="citas"
          />
        );

      case "reportes":
        return (
          <AdminDashboard
            section="reportes"
          />
        );

        case "especialidades":
          return <EspecialidadesPage />;

        case "sedes":
          return <SedesPage />;
        
        case "consultorios":
          return <ConsultoriosPage />;
        
        case "horarios":
          return <HorariosPage />;

      case "auditoria":
        return (
          <AdminDashboard
            section="auditoria"
          />
        );

      case "home":
      default:
        return (
          <AdminDashboard
            user={user}
          />
        );
    }
  }, [section, user]);

  return (
    <div className="app">

      <header className="topbar">
        <div className="topbar-inner">

          <div className="brand">
            <Logo
              size={38}
              className="logo"
            />

            <div>
              <div className="brand-title">
                SGCM – Sistema de Gestión de Citas Médicas
              </div>

              <div className="brand-sub">
                Panel Administrativo
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span className="badge">
              👤 {displayName}
            </span>

            <Button
              variant="danger"
              onClick={handleLogout}
            >
              Cerrar sesión
            </Button>
          </div>

        </div>
      </header>

      <div className="admin-layout">

        <aside className="admin-sidebar">
          <AdminMenu
            section={section}
            onChange={setSection}
          />
        </aside>

        <main className="admin-content">
          {content}
        </main>

      </div>

    </div>
  );
}