import { useState } from "react";

import AdminMenu from "./AdminMenu";

import DashboardHome from "./DashboardHome";

import UsersList from "./users/UsersList";

import DoctorsModule from "./doctors/DoctorsModule";
import AppointmentsModule from "./appointments/AppointmentsModule";

import ReportsModule from "./reports/ReportsModule";

import SpecialtiesModule from "./specialties/SpecialtiesModule";
import LocationsModule from "./locations/LocationsModule";
import SchedulesModule from "./schedules/SchedulesModule";

import AuditModule from "./audit/AuditModule";

export default function AdminLayout({ user }) {
  const [section, setSection] = useState("dashboard");

  const renderSection = () => {
    switch (section) {
      case "users":
        return <UsersList />;

      case "doctors":
        return <DoctorsModule />;

      case "appointments":
        return <AppointmentsModule />;

      case "reports":
        return <ReportsModule />;

      case "specialties":
        return <SpecialtiesModule />;

      case "locations":
        return <LocationsModule />;

      case "schedules":
        return <SchedulesModule />;

      case "audit":
        return <AuditModule />;

      case "dashboard":
      default:
        return <DashboardHome user={user} />;
    }
  };

  return (
    <div className="admin-layout">
      <AdminMenu
        section={section}
        onChange={setSection}
      />

      <main className="admin-content">
        {renderSection()}
      </main>
    </div>
  );
}