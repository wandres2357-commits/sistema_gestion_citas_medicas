import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const API = import.meta.env.VITE_API_URL;

export default function ConsultoriosPage() {
  const [sedeId, setSedeId] = useState("");
  const [areaId, setAreaId] = useState("");
  const [sedes, setSedes] = useState([]);
  const [areas, setAreas] = useState([]);
  const [consultorio, setConsultorio] =
    useState("");
  const [piso, setPiso] = useState("");

  const [editingId, setEditingId] =
    useState(null);

  const [consultorios, setConsultorios] =
    useState([]);

  const cargar = async () => {
    try {
      const response = await fetch(
        `${API}/api/consultorios`
      );

      const data = await response.json();

      setConsultorios(data);
    } catch (error) {
      console.error(error);
    }
  };
async function cargarSedes() {

  try {

    const response =
      await fetch(
        `${API}/api/sedes`
      );

    const data =
      await response.json();

    console.log(
      "SEDES:",
      data
    );

    setSedes(data);

  } catch (error) {

    console.error(
      "ERROR SEDES:",
      error
    );
  }
}
  useEffect(() => {
    cargar();
    cargarSedes();
    cargarAreas();
  }, []);

  const limpiar = () => {
    setEditingId(null);

    setSedeId("");
    setAreaId("");
    setConsultorio("");
    setPiso("");
  };

  const guardar = async () => {
    try {
      const url = editingId
        ? `${API}/api/consultorios/${editingId}`
        : `${API}/api/consultorios`;

      const method = editingId
        ? "PUT"
        : "POST";
if (!sedeId) {

  alert(
    "Seleccione una sede"
  );

  return;
}

if (!areaId) {

  alert(
    "Seleccione un área"
  );

  return;
}

if (!consultorio.trim()) {

  alert(
    "Ingrese el nombre del consultorio"
  );

  return;
}
      const response = await fetch(
        url,
        {
          method,
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            sede_id: Number(sedeId),
            area_id: Number(areaId),
            consultorio,
            piso,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Error guardando consultorio"
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

    setSedeId(item.sede_id);
    setAreaId(item.area_id);

    setConsultorio(
      item.consultorio
    );

    setPiso(item.piso);
  };

  const eliminar = async (id) => {
    const confirmar = window.confirm(
      "¿Desea eliminar este consultorio?"
    );

    if (!confirmar) return;

    try {
      const response = await fetch(
        `${API}/api/consultorios/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Error eliminando consultorio"
        );
      }

      cargar();

    } catch (error) {
      console.error(error);
    }
  };

const cargarAreas =
  async () => {

  try {

    const response =
      await fetch(
        `${API}/api/areas`
      );

    const data =
      await response.json();

    setAreas(data);

  } catch (error) {

    console.error(error);
  }
};


  return (
    <>
      {/* FORMULARIO */}
      <Card className="contact-panel form-panel">

        <h2 className="login-title">
          Consultorios
        </h2>

        <div className="login-stack">

          <div className="login-field">
            <select
  value={sedeId}
  onChange={(e) =>
    setSedeId(
      e.target.value
    )
  }
>

  <option value="">
    Seleccione sede
  </option>

  {sedes.map((sede) => (

    <option
      key={sede.id}
      value={sede.id}
    >
      {sede.sede}
    </option>

  ))}

</select>
            </div>
            <div className="login-field">
            <select
  value={areaId}
  onChange={(e) =>
    setAreaId(
      e.target.value
    )
  }
>

  <option value="">
    Seleccione área
  </option>

  {areas.map((a) => (

  <option
    key={a.id}
    value={a.id}
  >
    {a.nombre}
  </option>

))}

</select>
          </div>

          <div className="login-field">
            <Input
              value={consultorio}
              placeholder="Nombre consultorio"
              className="input-soft rounded-xl"
              onChange={(e) =>
                setConsultorio(
                  e.target.value
                )
              }
            />
          </div>

          <div className="login-field">
            <Input
              value={piso}
              placeholder="Piso"
              className="input-soft rounded-xl"
              onChange={(e) =>
                setPiso(
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
              <th>Sede</th>
              <th>Área</th>
              <th>Consultorio</th>
              <th>Piso</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>

            {consultorios.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                  }}
                >
                  No existen consultorios.
                </td>
              </tr>
            )}

            {consultorios.map((item) => (
              <tr key={item.id}>

                <td>{item.id}</td>

                <td>{item.sede}</td>

                <td>{item.area}</td>

                <td>
                  {item.consultorio}
                </td>

                <td>{item.piso}</td>

                <td
                  style={{
                    display: "flex",
                    gap: "8px",
                  }}
                >
                  <button
                    title="Editar"
                    onClick={() =>
                      editar(item)
                    }
                  >
                    ✏️
                  </button>

                  <button
                    title="Eliminar"
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
      </Card>
    </>
  );
}