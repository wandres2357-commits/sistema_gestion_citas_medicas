export default function UserCreate() {
  return (
    <form className="admin-form">
      <h3>Crear nuevo usuario</h3>

      <input placeholder="Nombre completo" />
      <input placeholder="Correo electrónico" />
      <select>
        <option>Paciente</option>
        <option>Médico</option>
        <option>Administrador</option>
      </select>
      <input type="password" placeholder="Contraseña" />

      <button>Crear Usuario</button>
    </form>
  );
}
