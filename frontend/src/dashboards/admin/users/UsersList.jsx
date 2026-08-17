import UserCreate from "./UserCreate";

export default function UsersList() {
  return (
    <section>
      <h2>Gestión de Usuarios</h2>

      <UserCreate />

      <table className="admin-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Juan Pérez</td>
            <td>juan@mail.com</td>
            <td>Paciente</td>
            <td>✏️ 🗑️</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
