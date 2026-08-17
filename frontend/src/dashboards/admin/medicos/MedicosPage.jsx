import { useCallback, useEffect, useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import SearchDialog from "@/components/ui/SearchDialog";
import DataGrid from "@/components/ui/DataGrid";
import "./medicos.css";

const API = import.meta.env.VITE_API_URL;

const TIPOS_MEDICO = [
  {
    value: "Medico_Especialista",
    label: "Medico_Especialista",
  },
  {
    value: "Medico_General",
    label: "Medico_General",
  },
  {
    value: "Enfermera",
    label: "Enfermera",
  },
  {
    value: "Auxiliar_Enfermeria",
    label: "Auxiliar_Enfermeria",
  },
  {
    value: "Odontologo_Especialista",
    label: "Odontologo_Especialista",
  },
  {
    value: "Odontologo_General",
    label: "Odontologo_General",
  },
  {
    value: "Nutricionista",
    label: "Nutricionista",
  },
  {
    value: "Psicologia",
    label: "Psicologia",
  },
  {
    value: "Trabajador_Social",
    label: "Trabajador_Social",
  },
  {
    value: "Bacteriologo",
    label: "Bacteriologo",
  },
  {
    value: "Otro",
    label: "Otro",
  },
];

const TIPOS_VINCULACION = [
  {
    value: "PLANTA",
    label: "Planta",
  },
  {
    value: "PRESTACION_SERVICIOS",
    label: "Prestación Servicios",
  },
  {
    value: "TEMPORAL",
    label: "Temporal",
  },
];

const INITIAL_FORM = {
  codigo: "",
  tipo: "Medico_Especialista",
  estado: "1",
  tipoDocumentoId: "",
  numeroDocumento: "",
  primerNombre: "",
  segundoNombre: "",
  primerApellido: "",
  segundoApellido: "",
  correo: "",
  telefonoMovil: "",
  tarjetaProfesional: "",
  tipoVinculacion: "",
  usuarioId: "",
  sedeId: "",
  consultorioId: "",
};

function getErrorMessage(result, fallbackMessage) {
  if (!result) {
    return fallbackMessage;
  }

  if (typeof result === "string") {
    return result;
  }

  return (
    result.message ||
    result.sqlMessage ||
    result.error ||
    result.detail ||
    fallbackMessage
  );
}

async function requestJson(url, options = {}, signal) {
  const response = await fetch(url, {
    ...options,
    signal,
  });

  const contentType = response.headers.get("content-type") || "";
  const result = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new Error(
      getErrorMessage(result, "Error en la solicitud")
    );
  }

  return result;
}

function normalizarEspecialidad(item) {
  return {
    ...item,
    especialidad_id:
      item.especialidad_id ?? item.id ?? null,
    activa: Boolean(item.activa ?? true),
    principal: Boolean(item.principal ?? false),
    interconsulta: Boolean(item.interconsulta ?? false),
  };
}

export default function MedicosPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [consultorios, setConsultorios] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [estado, setEstado] = useState("1");
  const [medicoEspecialidades, setMedicoEspecialidades] = useState([]);
  const [error, setError] = useState("");
  const [showEspecialidades, setShowEspecialidades] = useState(false);
  const [filtroEspecialidad, setFiltroEspecialidad] = useState("");
  const [especialidadSeleccionada, setEspecialidadSeleccionada,] = useState(null);
  const [guardando, setGuardando] = useState(false);
  
  const {
    codigo,
    tipo,
    tipoDocumentoId,
    numeroDocumento,
    primerNombre,
    segundoNombre,
    primerApellido,
    segundoApellido,
    correo,
    telefonoMovil,
    tarjetaProfesional,
    tipoVinculacion,
    usuarioId,
    sedeId,
    consultorioId,
  } = form;

  const nombreCompleto = useMemo(
    () =>
      [
        primerNombre,
        segundoNombre,
        primerApellido,
        segundoApellido,
      ]
        .map((value) => value.trim())
        .filter(Boolean)
        .join(" "),
    [
      primerNombre,
      segundoNombre,
      primerApellido,
      segundoApellido,
    ]
  );

  const actualizarCampo = useCallback((campo, valor) => {
    setForm((actual) => ({
      ...actual,
      [campo]: valor,
    }));
  }, []);

  const limpiar = useCallback(() => {
    setForm(INITIAL_FORM);
    setEditingId(null);
    setEstado("1");
    setMedicoEspecialidades([]);
    setEspecialidadSeleccionada(null);
    setFiltroEspecialidad("");
    setError("");
  }, []);

  const cargarMedicos = useCallback(async (signal) => {
    try {
      const data = await requestJson(
        `${API}/api/medicos`,
        {},
        signal
      );

      setMedicos(Array.isArray(data) ? data : []);
    } catch (requestError) {
      if (requestError.name !== "AbortError") {
        console.error("ERROR CARGANDO MEDICOS:", requestError);
      }
    }
  }, []);

  const cargarTiposDocumento = useCallback(async (signal) => {
    try {
      const data = await requestJson(
        `${API}/api/tipos-documento`,
        {},
        signal
      );

      setTiposDocumento(Array.isArray(data) ? data : []);
    } catch (requestError) {
      if (requestError.name !== "AbortError") {
        console.error(
          "ERROR TIPOS DOCUMENTO:",
          requestError
        );
      }
    }
  }, []);

  const cargarEspecialidades = useCallback(async (signal) => {
    try {
      const data = await requestJson(
        `${API}/api/especialidades`,
        {},
        signal
      );

      setEspecialidades(Array.isArray(data) ? data : []);
    } catch (requestError) {
      if (requestError.name !== "AbortError") {
        console.error(
          "ERROR CARGANDO ESPECIALIDADES:",
          requestError
        );
      }
    }
  }, []);

  const cargarSedes = useCallback(async (signal) => {
    try {
      const data = await requestJson(
        `${API}/api/sedes`,
        {},
        signal
      );

      setSedes(Array.isArray(data) ? data : []);
    } catch (requestError) {
      if (requestError.name !== "AbortError") {
        console.error("ERROR CARGANDO SEDES:", requestError);
      }
    }
  }, []);

  const cargarConsultorios = useCallback(async (signal) => {
    try {
      const data = await requestJson(
        `${API}/api/consultorios`,
        {},
        signal
      );

      setConsultorios(Array.isArray(data) ? data : []);
    } catch (requestError) {
      if (requestError.name !== "AbortError") {
        console.error(
          "ERROR CARGANDO CONSULTORIOS:",
          requestError
        );
      }
    }
  }, []);

  const cargarUsuarios = useCallback(async (signal) => {
    try {
      const data = await requestJson(
        `${API}/api/usuarios`,
        {},
        signal
      );

      setUsuarios(Array.isArray(data) ? data : []);
    } catch (requestError) {
      if (requestError.name !== "AbortError") {
        console.error(
          "ERROR CARGANDO USUARIOS:",
          requestError
        );
      }
    }
  }, []);

  const validar = useCallback(() => {
    const validaciones = [
      [codigo.trim(), "El código es obligatorio"],
      [
        tipoDocumentoId,
        "Seleccione un tipo de documento",
      ],
      [
        numeroDocumento.trim(),
        "El documento es obligatorio",
      ],
      [
        primerNombre.trim(),
        "El primer nombre es obligatorio",
      ],
      [
        primerApellido.trim(),
        "El primer apellido es obligatorio",
      ],
      [correo.trim(), "El correo es obligatorio"],
      [
        tarjetaProfesional.trim(),
        "Debe ingresar la tarjeta profesional",
      ],
      [
        medicoEspecialidades.length > 0,
        "Debe agregar al menos una especialidad",
      ],
      [
        medicoEspecialidades.some((item) =>
          Boolean(item.principal)
        ),
        "Debe marcar una especialidad como principal",
      ],
      [sedeId, "Seleccione una sede"],
      [consultorioId, "Seleccione un consultorio"],
    ];

    const validacionFallida = validaciones.find(
      ([condition]) => !condition
    );

    if (validacionFallida) {
      setError(validacionFallida[1]);
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(correo.trim())) {
      setError("Correo electrónico inválido");
      return false;
    }

    setError("");
    return true;
  }, [
    codigo,
    tipoDocumentoId,
    numeroDocumento,
    primerNombre,
    primerApellido,
    correo,
    tarjetaProfesional,
    medicoEspecialidades,
    sedeId,
    consultorioId,
  ]);

  const guardar = useCallback(async () => {
    if (guardando || !validar()) {
      return;
    }

    setGuardando(true);

    try {
      const url = editingId
        ? `${API}/api/medicos/${editingId}`
        : `${API}/api/medicos`;

      const method = editingId ? "PUT" : "POST";

      const payload = {
        codigo: codigo.trim(),
        tipo,
        estado: Number(estado),
        tipo_documento_id: Number(tipoDocumentoId),
        numero_documento: numeroDocumento.trim(),
        primer_nombre: primerNombre.trim(),
        segundo_nombre: segundoNombre.trim(),
        primer_apellido: primerApellido.trim(),
        segundo_apellido: segundoApellido.trim(),
        nombre_completo: nombreCompleto,
        correo: correo.trim(),
        telefono_movil: telefonoMovil.trim(),
        tarjeta_profesional: tarjetaProfesional.trim(),
        tipo_vinculacion: tipoVinculacion,
        usuario_id: usuarioId ? Number(usuarioId) : null,
        medico_especialidades: medicoEspecialidades,
        sede_id: Number(sedeId),
        consultorio_id: Number(consultorioId),
      };

      console.log("PAYLOAD MEDICO:", payload);

      const result = await requestJson(
        url,
        {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      console.log(
        "RESPUESTA BACKEND MEDICO:",
        result
      );

      limpiar();
      await cargarMedicos();
    } catch (requestError) {
      console.error(
        "ERROR GUARDANDO MEDICO:",
        requestError
      );

      setError(
        requestError.message || "Error guardando médico"
      );
    } finally {
      setGuardando(false);
    }
  }, [
    guardando,
    validar,
    editingId,
    codigo,
    tipo,
    estado,
    tipoDocumentoId,
    numeroDocumento,
    primerNombre,
    segundoNombre,
    primerApellido,
    segundoApellido,
    nombreCompleto,
    correo,
    telefonoMovil,
    tarjetaProfesional,
    tipoVinculacion,
    usuarioId,
    medicoEspecialidades,
    sedeId,
    consultorioId,
    limpiar,
    cargarMedicos,
  ]);

  function agregarEspecialidad() {
    if (!especialidadSeleccionada) {
      setError("Seleccione una especialidad");
      return;
    }

    const existe = medicoEspecialidades.some(
      (item) =>
        String(item.especialidad_id) ===
        String(especialidadSeleccionada.id)
    );

    if (existe) {
      setError("La especialidad ya fue agregada");
      return;
    }

    setMedicoEspecialidades((actuales) => [
      ...actuales,
      {
        especialidad_id: especialidadSeleccionada.id,
        codigo: especialidadSeleccionada.codigo,
        descripcion: especialidadSeleccionada.descripcion,
        activa: true,
        principal: actuales.length === 0,
        interconsulta: false,
      },
    ]);

    setEspecialidadSeleccionada(null);
    setFiltroEspecialidad("");
    setError("");
  }

  function actualizarEspecialidad(
    index, 
    campo, 
    valor
  ) {
    setMedicoEspecialidades((actuales) =>
      actuales.map((item, itemIndex) => {
        if (campo === "principal" && valor === true) {
          return {
            ...item,
            principal: itemIndex === index,
          };
        }

        if (itemIndex === index) {
          return {
            ...item,
            [campo]: valor,
          };
        }

        return item;
      })
    );
  }

  function eliminarEspecialidad(index) {
    setMedicoEspecialidades((actuales) => {
      const nuevas = actuales.filter(
        (_, itemIndex) => itemIndex !== index
      );

      if (
        nuevas.length > 0 &&
        !nuevas.some((item) => item.principal)
      ) {
        nuevas[0] = {
          ...nuevas[0],
          principal: true,
        };
      }

      return nuevas;
    });
  }

  function seleccionarEspecialidad(especialidad) {
    setEspecialidadSeleccionada(especialidad);
    setFiltroEspecialidad(
      `${especialidad.codigo} - ${especialidad.descripcion}`
    );
    setShowEspecialidades(false);
    setError("");
  }

  function editar(item) {
    setEditingId(item.id);

    setForm({
      codigo: item.codigo || "",
      tipo: item.tipo || "Medico_Especialista",
      estado: String(item.estado ?? "1"),
      tipoDocumentoId: item.tipo_documento_id
        ? String(item.tipo_documento_id)
        : "",
      numeroDocumento: item.numero_documento || "",
      primerNombre: item.primer_nombre || "",
      segundoNombre: item.segundo_nombre || "",
      primerApellido: item.primer_apellido || "",
      segundoApellido: item.segundo_apellido || "",
      correo: item.correo || "",
      telefonoMovil: item.telefono_movil || "",
      tarjetaProfesional: item.tarjeta_profesional || "",
      tipoVinculacion: item.tipo_vinculacion || "",
      usuarioId: item.usuario_id
        ? String(item.usuario_id)
        : "",
      sedeId: item.sede_id ? String(item.sede_id) : "",
      consultorioId: item.consultorio_id
        ? String(item.consultorio_id)
        : "",
    });

    setEstado(String(item.estado ?? "1"));

    const especialidadesActuales =
      item.medico_especialidades ||
      item.medicoEspecialidades ||
      item.especialidades ||
      [];

    setMedicoEspecialidades(
      Array.isArray(especialidadesActuales)
        ? especialidadesActuales.map(normalizarEspecialidad)
        : []
    );

    setError("");
  }

  async function eliminar(id) {
    const confirmar = window.confirm("¿Eliminar médico?");

    if (!confirmar) {
      return;
    }

    try {
      await requestJson(
        `${API}/api/medicos/${id}`,
        {
          method: "DELETE",
        }
      );

      await cargarMedicos();
    } catch (requestError) {
      console.error("ERROR ELIMINANDO MEDICO:", requestError);
      setError(
        requestError.message || "Error eliminando médico"
      );
    }
  }

  useEffect(() => {
    const controller = new AbortController();

    Promise.all([
      cargarTiposDocumento(controller.signal),
      cargarEspecialidades(controller.signal),
      cargarSedes(controller.signal),
      cargarConsultorios(controller.signal),
      cargarUsuarios(controller.signal),
      cargarMedicos(controller.signal),
    ]).catch((requestError) => {
      if (requestError.name !== "AbortError") {
        console.error(
          "ERROR CARGANDO INFORMACIÓN INICIAL:",
          requestError
        );
      }
    });

    return () => controller.abort();
  }, [
    cargarTiposDocumento,
    cargarEspecialidades,
    cargarSedes,
    cargarConsultorios,
    cargarUsuarios,
    cargarMedicos,
  ]);

  return (
    <div className="medico-page">
      <Card className="medico-card">
        <h1 className="medico-title">Médicos</h1>

        {error && (
          <div className="medicos-error" role="alert">
            {error}
          </div>
        )}

        <div className="medico-layout">
          <div className="medico-form-container">
            <div className="medico-top-layout">
              <div className="medico-top-form">
                <section className="medico-section">
                  <h3 className="medico-section-title">
                    Datos Generales
                  </h3>

                  <div className="medico-grid-3">
                    <div className="medico-field">
                      <label htmlFor="codigo">Código</label>
                      <Input
                        id="codigo"
                        value={codigo}
                        onChange={(e) =>
                          actualizarCampo(
                            "codigo",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="medico-field">
                      <label htmlFor="tipo">Tipo</label>
                      <select
                        id="tipo"
                        className="medico-select"
                        value={tipo}
                        onChange={(e) =>
                          actualizarCampo(
                            "tipo",
                            e.target.value
                          )
                        }
                      >
                        {TIPOS_MEDICO.map((option) => (
                          <option
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="medico-field">
                      <label htmlFor="estado">Estado</label>
                      <select
                        id="estado"
                        className="medico-select"
                        value={estado}
                        onChange={(e) =>
                          setEstado(e.target.value)
                        }
                      >
                        <option value="1">ACTIVO</option>
                        <option value="0">INACTIVO</option>
                      </select>
                    </div>
                  </div>

                  <div className="medico-grid-3">
                    <div className="medico-field">
                      <label htmlFor="tipoDocumentoId">
                        Tipo Documento
                      </label>
                      <select
                        id="tipoDocumentoId"
                        value={tipoDocumentoId}
                        className="medico-select"
                        onChange={(e) =>
                          actualizarCampo(
                            "tipoDocumentoId",
                            e.target.value
                          )
                        }
                      >
                        <option value="">
                          Seleccione
                        </option>

                        {tiposDocumento.map((item) => (
                          <option
                            key={item.id}
                            value={item.id}
                          >
                            {item.codigo} -{" "}
                            {item.descripcion}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="medico-field">
                      <label htmlFor="numeroDocumento">
                        Número Documento
                      </label>
                      <Input
                        id="numeroDocumento"
                        value={numeroDocumento}
                        onChange={(e) =>
                          actualizarCampo(
                            "numeroDocumento",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="medico-field">
                      <label htmlFor="usuarioId">
                        Usuario
                      </label>
                      <select
                        id="usuarioId"
                        value={usuarioId}
                        className="medico-select"
                        onChange={(e) =>
                          actualizarCampo(
                            "usuarioId",
                            e.target.value
                          )
                        }
                      >
                        <option value="">
                          Seleccione
                        </option>

                        {usuarios.map((usuario) => (
                          <option
                            key={usuario.id}
                            value={usuario.id}
                          >
                            {usuario.correo}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </section>

                <section className="medico-section">
                  <h3 className="medico-section-title">
                    Datos Personales
                  </h3>

                  <div className="medico-grid-2">
                    <Input
                      value={primerNombre}
                      placeholder="Primer Nombre"
                      onChange={(e) =>
                        actualizarCampo(
                          "primerNombre",
                          e.target.value
                        )
                      }
                    />

                    <Input
                      value={segundoNombre}
                      placeholder="Segundo Nombre"
                      onChange={(e) =>
                        actualizarCampo(
                          "segundoNombre",
                          e.target.value
                        )
                      }
                    />

                    <Input
                      value={primerApellido}
                      placeholder="Primer Apellido"
                      onChange={(e) =>
                        actualizarCampo(
                          "primerApellido",
                          e.target.value
                        )
                      }
                    />

                    <Input
                      value={segundoApellido}
                      placeholder="Segundo Apellido"
                      onChange={(e) =>
                        actualizarCampo(
                          "segundoApellido",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <Input
                    value={nombreCompleto}
                    placeholder="Nombre completo"
                    disabled
                  />
                </section>
              </div>

              <div className="medico-sidepanel">
                <div className="medico-photo-box">
                  Fotografía
                </div>

                <div className="medico-signature-box">
                  Firma Digital
                </div>
              </div>
            </div>

            <section className="medico-section">
              <h3 className="medico-section-title">
                Información Profesional
              </h3>

              <div className="medico-grid-2">
                <Input
                  value={tarjetaProfesional}
                  placeholder="Tarjeta Profesional"
                  onChange={(e) =>
                    actualizarCampo(
                      "tarjetaProfesional",
                      e.target.value
                    )
                  }
                />

                <select
                  className="medico-select"
                  value={tipoVinculacion}
                  onChange={(e) =>
                    actualizarCampo(
                      "tipoVinculacion",
                      e.target.value
                    )
                  }
                >
                  <option value="">Seleccione</option>

                  {TIPOS_VINCULACION.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div
                className="especialidad-toolbar"
                style={{ marginTop: "15px" }}
              >
                <label htmlFor="filtroEspecialidad">
                  Especialidad:
                </label>

                <div className="especialidad-search">
                  <input
                    id="filtroEspecialidad"
                    type="text"
                    value={filtroEspecialidad}
                    placeholder="Buscar..."
                    onChange={(e) =>
                      setFiltroEspecialidad(
                        e.target.value
                      )
                    }
                  />

                  <button
                    type="button"
                    aria-label="Buscar especialidad"
                    onClick={() =>
                      setShowEspecialidades(true)
                    }
                  >
                    🔍
                  </button>
                </div>

                <input
                  type="text"
                  readOnly
                  value={
                    especialidadSeleccionada
                      ? `${especialidadSeleccionada.codigo} - ${especialidadSeleccionada.descripcion}`
                      : ""
                  }
                  placeholder="Especialidad seleccionada"
                />

                <Button
                  type="button"
                  variant="accent"
                  onClick={agregarEspecialidad}
                >
                  ✓ Agregar
                </Button>
              </div>

              <table className="medico-especialidades-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Descripción</th>
                    <th>Activa</th>
                    <th>Principal</th>
                    <th>Interconsulta</th>
                    <th>Eliminar</th>
                  </tr>
                </thead>

                <tbody>
                  {medicoEspecialidades.map((item, index) => (
                    <tr
                      key={
                        item.especialidad_id ??
                        `${item.codigo}-${index}`
                      }
                    >
                      <td>{item.codigo}</td>
                      <td>{item.descripcion}</td>

                      <td
                        style={{ textAlign: "center" }}
                      >
                        <input
                          type="checkbox"
                          checked={Boolean(item.activa)}
                          onChange={(e) =>
                            actualizarEspecialidad(
                              index,
                              "activa",
                              e.target.checked
                            )
                          }
                        />
                      </td>

                      <td
                        style={{ textAlign: "center" }}
                      >
                        <input
                          type="checkbox"
                          checked={Boolean(item.principal)}
                          onChange={(e) =>
                            actualizarEspecialidad(
                              index,
                              "principal",
                              e.target.checked
                            )
                          }
                        />
                      </td>

                      <td
                        style={{ textAlign: "center" }}
                      >
                        <input
                          type="checkbox"
                          checked={Boolean(
                            item.interconsulta
                          )}
                          onChange={(e) =>
                            actualizarEspecialidad(
                              index,
                              "interconsulta",
                              e.target.checked
                            )
                          }
                        />
                      </td>

                      <td
                        style={{ textAlign: "center" }}
                      >
                        <button
                          type="button"
                          className="btn-delete"
                          aria-label="Eliminar especialidad"
                          onClick={() =>
                            eliminarEspecialidad(index)
                          }
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section className="medico-section">
              <h3 className="medico-section-title">
                Contacto
              </h3>

              <div className="medico-grid-2">
                <Input
                  value={correo}
                  placeholder="Correo"
                  onChange={(e) =>
                    actualizarCampo(
                      "correo",
                      e.target.value
                    )
                  }
                />

                <Input
                  value={telefonoMovil}
                  placeholder="Teléfono Móvil"
                  onChange={(e) =>
                    actualizarCampo(
                      "telefonoMovil",
                      e.target.value
                    )
                  }
                />
              </div>
            </section>

            <section className="medico-section">
              <h3 className="medico-section-title">
                Asignación
              </h3>

              <div className="medico-grid-2">
                <select
                  className="medico-select"
                  value={sedeId}
                  onChange={(e) =>
                    actualizarCampo(
                      "sedeId",
                      e.target.value
                    )
                  }
                >
                  <option value="">Sede</option>

                  {sedes.map((sede) => (
                    <option
                      key={sede.id}
                      value={sede.id}
                    >
                      {sede.sede}
                    </option>
                  ))}
                </select>

                <select
                  className="medico-select"
                  value={consultorioId}
                  onChange={(e) =>
                    actualizarCampo(
                      "consultorioId",
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Consultorio
                  </option>

                  {consultorios.map((consultorio) => (
                    <option
                      key={consultorio.id}
                      value={consultorio.id}
                    >
                      {consultorio.consultorio}
                    </option>
                  ))}
                </select>
              </div>
            </section>
          </div>
        </div>

        <div className="medico-actions">
          <Button
            variant="accent"
            onClick={guardar}
            disabled={guardando}
          >
            {guardando ? "Guardando..." : "Guardar"}
          </Button>

          <Button
            variant="secondary"
            onClick={limpiar}
            disabled={guardando}
          >
            Cancelar
          </Button>
        </div>
      </Card>

      <SearchDialog
        open={showEspecialidades}
        title="Listado de Especialidades"
        onClose={() => setShowEspecialidades(false)}
      >
        <DataGrid
          rows={especialidades}
          columns={[
            {
              field: "codigo",
              title: "Código",
            },
            {
              field: "descripcion",
              title: "Nombre",
            },
          ]}
          onRowDoubleClick={seleccionarEspecialidad}
        />
      </SearchDialog>
    </div>
  );
}