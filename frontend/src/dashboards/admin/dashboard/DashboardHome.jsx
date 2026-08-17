export default function DashboardHome({ user }) {
  return (
    <section>
      <h1>Bienvenido, {user?.username}</h1>

      <div className="admin-cards">
        <div className="card">👥 Usuarios: 120</div>
        <div className="card">🩺 Médicos: 18</div>
        <div className="card">📅 Citas hoy: 42</div>
        <div className="card">✅ Citas atendidas: 300</div>
      </div>
    </section>
  );
}
