import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const API = import.meta.env.VITE_API_URL;

export default function SedesPage() {
  const [ips, setIps] = useState("");

  const [sede, setSede] = useState("");

  const [telefono, setTelefono] =
    useState("");

  const [correo, setCorreo] =
    useState("");

  const [direccion, setDireccion] =
    useState("");

  const [editingId, setEditingId] =
    useState(null);

  const [sedes, setSedes] =
    useState([]);

  const cargar = async () => {
    try {
      const response = await fetch(
        `${API}/api/sedes`
      );

      const data =
        await response.json();

      setSedes(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const limpiar = () => {
    setEditingId(null);

    setIps("");
    setSede("");
    setTelefono("");
    setCorreo("");
    setDireccion("");
  };

  const guardar = async () => {
    try {
      const url = editingId
        ? `${API}/api/sedes/${editingId}`
        : `${API}/api/sedes`;

      const method =
        editingId
          ? "PUT"
          : "POST";

      const response =
        await fetch(url, {
          method,

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            ips,
            sede,
            telefono,
            correo,
            direccion,
          }),
        });

      if (!response.ok) {
        throw new Error(
          "Error guardando sede"
        );
      }

      limpiar();

      cargar();
    } catch (error) {
      console.error(error);
    }
  };

  const editar = (item) => {
    setEditingId(item.id);

    setIps(item.ips);
    setSede(item.sede);

    setTelefono(
      item.telefono || ""
    );

    setCorreo(
      item.correo || ""
    );

    setDireccion(
      item.direccion_texto || ""
    );
  };

  const eliminar = async (id) => {

  console.log("ELIMINAR:", id);

  const confirmar =
    window.confirm(
      "¿Eliminar sede?"
    );

  if (!confirmar) return;

  try {

    const response =
      await fetch(
        `${API}/api/sedes/${id}`,
        {
          method: "DELETE"
        }
      );
      
      cargar();
    console.log(
      "STATUS:",
      response.status
    );

    const data =
      await response.json();

    console.log(
      "RESPONSE:",
      data
    );

    cargar();

  } catch (error) {

    console.error(error);
  }
};

  return (
    <>
      <Card className="contact-panel form-panel">

        <h2 className="login-title">
          Sedes / Clínicas
        </h2>

        <div className="login-stack">

          <div className="login-field">
            <Input
              value={ips}
              placeholder="IPS"
              className="input-soft rounded-xl"
              onChange={(e) =>
                setIps(
                  e.target.value
                )
              }
            />
          </div>

          <div className="login-field">
            <Input
              value={sede}
              placeholder="Nombre sede"
              className="input-soft rounded-xl"
              onChange={(e) =>
                setSede(
                  e.target.value
                )
              }
            />
          </div>

          <div className="login-field">
            <Input
              value={telefono}
              placeholder="Teléfono"
              className="input-soft rounded-xl"
              onChange={(e) =>
                setTelefono(
                  e.target.value
                )
              }
            />
          </div>

          <div className="login-field">
            <Input
              value={correo}
              placeholder="Correo"
              className="input-soft rounded-xl"
              onChange={(e) =>
                setCorreo(
                  e.target.value
                )
              }
            />
          </div>

          <div className="login-field">
            <Input
              value={direccion}
              placeholder="Dirección"
              className="input-soft rounded-xl"
              onChange={(e) =>
                setDireccion(
                  e.target.value
                )
              }
            />
          </div>

          <div
            className="login-btn-row"
            style={{
              display: "flex",
              gap: "10px",
            }}
          >
            <Button
              variant="accent"
              className="login-btn-compact"
              onClick={guardar}
            >
              {editingId
                ? "Actualizar"
                : "Guardar"}
            </Button>

            {editingId && (
              <Button
                variant="secondary"
                className="login-btn-compact"
                onClick={limpiar}
              >
                Cancelar
              </Button>
            )}
          </div>

        </div>
      </Card>

      <Card
        className="contact-panel"
        style={{
          marginTop: "20px",
        }}
      >
        <div className="admin-table-wrapper">
        <table className="admin-crud-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>IPS</th>
              <th>Sede</th>
              <th>Dirección</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>

            {sedes.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                  }}
                >
                  No existen sedes.
                </td>
              </tr>
            )}

            {sedes.map((item) => (
              <tr key={item.id}>

                <td>{item.id}</td>

                <td>{item.ips}</td>

                <td>{item.sede}</td>

                <td>
                  {item.direccion_texto}
                </td>

                <td>{item.telefono}</td>

                <td>{item.correo}</td>

                <td>
                  <button
                    onClick={() =>
                      editar(
                        item
                      )
                    }
                  >
                    ✏️
                  </button>

                  <button
                    onClick={() =>
                      eliminar(
                        item.id
                      )
                    }
                  >
                    🗑️
                  </button>
                </td>

              </tr>
            ))}

          </tbody>

        </table>
        </div>
      </Card>
    </>
  );
}