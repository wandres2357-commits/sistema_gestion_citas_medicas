import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

const API = import.meta.env.VITE_API_URL;

export default function EspecialidadesPage() {
  const [error, setError] = useState("");
  const [codigo, setCodigo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [especialidades, setEspecialidades] = useState([]);

  const cargar = async () => {
    try {
      const response = await fetch(
        `${API}/api/especialidades`
      );

      const data = await response.json();

      setEspecialidades(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const guardar = async () => {

  setError("");

  if (!codigo.trim()) {

    setError(
      "Debe ingresar el código."
    );

    return;
  }

  if (!descripcion.trim()) {

    setError(
      "Debe ingresar la descripción."
    );

    return;
  }

  try {

    const payload = {
      codigo:
        codigo.trim()
          .toUpperCase(),

      descripcion:
        descripcion.trim()
    };

    console.log(
      "DATOS ENVIADOS:",
      payload
    );

    const url = editingId
      ? `${API}/api/especialidades/${editingId}`
      : `${API}/api/especialidades`;

    const method = editingId
      ? "PUT"
      : "POST";

    const response = await fetch(
      url,
      {
        method,

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify(
            payload
          ),
      }
    );

    const result =
      await response.json();

    console.log(
      "RESPUESTA BACKEND:",
      result
    );

    if (!response.ok) {

      throw new Error(
        result.message ||
        result.sqlMessage ||
        "Error guardando especialidad"
      );
    }

    setCodigo("");
    setDescripcion("");
    setEditingId(null);

    cargar();

  } catch (error) {

    console.error(
      "ERROR GUARDANDO:",
      error
    );

    setError(
      error.message
    );
  }
};
  const editar = (esp) => {
    setEditingId(esp.id);

    setCodigo(esp.codigo);
    setDescripcion(esp.descripcion);
  };

  const cancelarEdicion = () => {
    setEditingId(null);

    setCodigo("");
    setDescripcion("");
  };

  const eliminar = async (id) => {
    const confirmar = window.confirm(
      "¿Desea eliminar esta especialidad?"
    );

    if (!confirmar) return;

    try {

      const response = await fetch(
        `${API}/api/especialidades/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Error eliminando especialidad"
        );
      }

      cargar();

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* FORMULARIO */}
      <Card className="contact-panel form-panel">
        <h2 className="login-title">
          Especialidades Médicas
        </h2>
        {error && (

  <div
    style={{
      background: "#FEE2E2",
      color: "#991B1B",
      border:
        "1px solid #EF4444",
      padding: "12px",
      borderRadius: "10px",
      marginBottom: "15px"
    }}
  >
    {error}
  </div>

)}

        <div className="login-stack">

          <div className="login-field">
            <Input
              value={codigo}
              placeholder="Código especialidad (Ej: CARD)"
              className="input-soft rounded-xl"
              onChange={(e) =>
                setCodigo(
                  e.target.value.toUpperCase()
                )
              }
            />
          </div>

          <div className="login-field">
            <Textarea
              value={descripcion}
              placeholder="Descripción"
              className="input-soft rounded-xl"
              rows={5}
              onChange={(e) =>
                setDescripcion(
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
                onClick={
                  cancelarEdicion
                }
              >
                Cancelar
              </Button>
            )}
          </div>

        </div>
      </Card>

      {/* TABLA */}
      <Card
        className="contact-panel"
        style={{
          marginTop: "20px",
        }}
      >
        <table className="admin-crud-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Código</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>

            {especialidades.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  style={{
                    textAlign: "center",
                  }}
                >
                  No existen especialidades.
                </td>
              </tr>
            )}

            {especialidades.map((esp) => (
              <tr key={esp.id}>

                <td>{esp.id}</td>

                <td>{esp.codigo}</td>

                <td>{esp.descripcion}</td>

                <td
                  style={{
                    display: "flex",
                    gap: "8px",
                  }}
                >
                  <button
                    onClick={() =>
                      editar(esp)
                    }
                    title="Editar"
                  >
                    ✏️
                  </button>

                  <button
                    onClick={() =>
                      eliminar(
                        esp.id
                      )
                    }
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </td>

              </tr>
            ))}

          </tbody>

        </table>
      </Card>
    </>
  );
}