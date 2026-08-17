import { useEffect, useMemo, useState } from "react";

import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import SearchDialog from "@/components/ui/SearchDialog";
import DataGrid from "@/components/ui/DataGrid";
import FormSection from "@/components/ui/FormSection";
import FieldGroup from "@/components/ui/FieldGroup";
import SearchField from "@/components/ui/SearchField";

import "./horarios.css";

const API = import.meta.env.VITE_API_URL;

const DIAS = [
  "DOMINGO",
  "LUNES",
  "MARTES",
  "MIERCOLES",
  "JUEVES",
  "VIERNES",
  "SABADO",
];

function twoDigits(value) {
  return String(value).padStart(2, "0");
}

function parseDateInput(value) {
  if (!value) {
    return null;
  }

  return new Date(`${value}T00:00:00`);
}

function addDays(date, days) {
  const next = new Date(date);

  next.setDate(next.getDate() + days);

  return next;
}

function getDiaSemanaFromDate(date) {
  return DIAS[date.getDay()];
}

function buildDateRange(startValue, endValue) {
  const startDate = parseDateInput(startValue);
  const endDate = parseDateInput(endValue);

  if (!startDate || !endDate) {
    return [];
  }

  if (startDate > endDate) {
    return [];
  }

  const days = [];
  let current = new Date(startDate);

  while (current <= endDate) {
    days.push(new Date(current));
    current = addDays(current, 1);
  }

  return days;
}

function toDateInputValue(date) {
  return [
    date.getFullYear(),
    twoDigits(date.getMonth() + 1),
    twoDigits(date.getDate()),
  ].join("-");
}

function getMonthTitle(date) {
  return date.toLocaleDateString("es-CO", {
    month: "long",
    year: "numeric",
  });
}

function addMonths(date, count) {
  const next = new Date(date);

  next.setMonth(next.getMonth() + count);

  return next;
}

function buildCalendarDays(monthDate) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startOffset = firstDay.getDay();
  const totalDays = lastDay.getDate();
  const cells = [];

  for (let index = 0; index < startOffset; index += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= totalDays; day += 1) {
    cells.push(new Date(year, month, day));
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

function isDateInRange(value, startValue, endValue) {
  const current = parseDateInput(value);
  const start = parseDateInput(startValue);
  const end = parseDateInput(endValue);

  if (!current || !start || !end) {
    return false;
  }

  return current >= start && current <= end;
}

function MiniMonthCalendar({
  monthDate,
  selectedDate,
  rangeStart,
  rangeEnd,
  onSelectDate,
  onPreviousMonth,
  onNextMonth,
}) {
  const days = buildCalendarDays(monthDate);

  return (
    <div className="hm-calendar">
      <div className="hm-calendar-header">
        <button
          type="button"
          className="hm-calendar-nav"
          onClick={onPreviousMonth}
        >
          ◀
        </button>

        <div className="hm-calendar-title">
          {getMonthTitle(monthDate)}
        </div>

        <button
          type="button"
          className="hm-calendar-nav"
          onClick={onNextMonth}
        >
          ▶
        </button>
      </div>

      <div className="hm-calendar-weekdays">
        <span>d</span>
        <span>l</span>
        <span>m</span>
        <span>m</span>
        <span>j</span>
        <span>v</span>
        <span>s</span>
      </div>

      <div className="hm-calendar-grid">
        {days.map((day, index) => {
          if (!day) {
            return (
              <button
                key={index}
                type="button"
                className="hm-calendar-empty"
                disabled
              />
            );
          }

          const value = toDateInputValue(day);
          const isSelected = value === selectedDate;
          const isInRange = isDateInRange(
            value,
            rangeStart,
            rangeEnd
          );
          const isWeekend =
            day.getDay() === 0 || day.getDay() === 6;

          return (
            <button
              key={value}
              type="button"
              className={[
                "hm-calendar-day",
                isInRange
                  ? "hm-calendar-day--range"
                  : "",
                isSelected
                  ? "hm-calendar-day--selected"
                  : "",
                isWeekend
                  ? "hm-calendar-day--weekend"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => onSelectDate(value)}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function HorariosPage() {
  const [horarios, setHorarios] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [especialidades, setEspecialidades] =
    useState([]);
  const [sedes, setSedes] = useState([]);
  const [consultorios, setConsultorios] =
    useState([]);

  const [editingId, setEditingId] =
    useState(null);
  const [medicoSeleccionado, setMedicoSeleccionado] =
    useState(null);
  const [
    especialidadSeleccionada,
    setEspecialidadSeleccionada,
  ] = useState(null);
  const [sedeId, setSedeId] = useState("");
  const [consultorioId, setConsultorioId] =
    useState("");

  const [fechaSeleccionada, setFechaSeleccionada] =
    useState(toDateInputValue(new Date()));
  const [rangoInicio, setRangoInicio] =
    useState(toDateInputValue(new Date()));
  const [rangoFin, setRangoFin] =
    useState(toDateInputValue(new Date()));
  const [
    seleccionandoFinRango,
    setSeleccionandoFinRango,
  ] = useState(false);
  const [mesBase, setMesBase] =
    useState(new Date());

  const [modalidad, setModalidad] =
    useState("PRESENCIAL");
  const [reservado, setReservado] =
    useState(false);
  const [horaInicio, setHoraInicio] =
    useState("00:00");
  const [horaFin, setHoraFin] =
    useState("23:59");
  const [duracionCita, setDuracionCita] =
    useState("30");
  const [fechaInicio, setFechaInicio] =
    useState("");
  const [fechaFin, setFechaFin] =
    useState("");
  const [estado, setEstado] =
    useState("1");
  const [observacion, setObservacion] =
    useState("");
  const [turnosPreview, setTurnosPreview] =
    useState([]);
  const [tabActiva, setTabActiva] =
    useState("recursos");
  const [error, setError] =
    useState("");
  const [showMedicos, setShowMedicos] =
    useState(false);
  const [
    showEspecialidades,
    setShowEspecialidades,
  ] = useState(false);

  const consultoriosFiltrados = useMemo(() => {
    if (!sedeId) {
      return [];
    }

    return consultorios.filter((item) => {
      const sedeConsultorio =
        item.sede_id ??
        item.sedeId ??
        item.id_sede;

      return (
        String(sedeConsultorio) ===
        String(sedeId)
      );
    });
  }, [consultorios, sedeId]);

  const sedeSeleccionada = useMemo(
    () =>
      sedes.find(
        (item) =>
          String(item.id) ===
          String(sedeId)
      ),
    [sedes, sedeId]
  );

  const consultorioSeleccionado = useMemo(
    () =>
      consultorios.find(
        (item) =>
          String(item.id) ===
          String(consultorioId)
      ),
    [consultorios, consultorioId]
  );

  const diaSemana = useMemo(() => {
    if (!fechaSeleccionada) {
      return "";
    }

    const date = new Date(
      `${fechaSeleccionada}T00:00:00`
    );

    return DIAS[date.getDay()];
  }, [fechaSeleccionada]);

  const actividadCodigo =
    especialidadSeleccionada
      ? `${especialidadSeleccionada.codigo}-${duracionCita}`
      : "";

  const actividadDescripcion =
    especialidadSeleccionada
      ? `${especialidadSeleccionada.descripcion} ${duracionCita} MINUTOS`
      : "";

  async function cargarHorarios() {
    try {
      const response = await fetch(
        `${API}/api/horarios`
      );
      const data = await response.json();

      setHorarios(data);
    } catch (error) {
      console.error(
        "ERROR CARGANDO HORARIOS:",
        error
      );
    }
  }

  async function cargarMedicos() {
    try {
      const response = await fetch(
        `${API}/api/medicos`
      );
      const data = await response.json();

      setMedicos(data);
    } catch (error) {
      console.error(
        "ERROR CARGANDO MEDICOS:",
        error
      );
    }
  }

  async function cargarEspecialidades() {
    try {
      const response = await fetch(
        `${API}/api/especialidades`
      );
      const data = await response.json();

      setEspecialidades(data);
    } catch (error) {
      console.error(
        "ERROR CARGANDO ESPECIALIDADES:",
        error
      );
    }
  }

  async function cargarSedes() {
    try {
      const response = await fetch(
        `${API}/api/sedes`
      );
      const data = await response.json();

      setSedes(data);
    } catch (error) {
      console.error(
        "ERROR CARGANDO SEDES:",
        error
      );
    }
  }

  async function cargarConsultorios() {
    try {
      const response = await fetch(
        `${API}/api/consultorios`
      );
      const data = await response.json();

      setConsultorios(data);
    } catch (error) {
      console.error(
        "ERROR CARGANDO CONSULTORIOS:",
        error
      );
    }
  }

  useEffect(() => {
    cargarHorarios();
    cargarMedicos();
    cargarEspecialidades();
    cargarSedes();
    cargarConsultorios();
  }, []);

  function seleccionarFechaCalendario(value) {
    const fechaClic = parseDateInput(value);
    const fechaInicioActual =
      parseDateInput(rangoInicio);

    if (!seleccionandoFinRango) {
      setRangoInicio(value);
      setRangoFin(value);
      setFechaSeleccionada(value);
      setFechaInicio(value);
      setFechaFin(value);
      setSeleccionandoFinRango(true);

      return;
    }

    if (
      fechaInicioActual &&
      fechaClic < fechaInicioActual
    ) {
      setRangoInicio(value);
      setRangoFin(rangoInicio);
      setFechaInicio(value);
      setFechaFin(rangoInicio);
      setFechaSeleccionada(value);
      setSeleccionandoFinRango(false);

      return;
    }

    setRangoFin(value);
    setFechaInicio(rangoInicio);
    setFechaFin(value);
    setFechaSeleccionada(value);
    setSeleccionandoFinRango(false);
  }

  function limpiar() {
    setEditingId(null);
    setMedicoSeleccionado(null);
    setEspecialidadSeleccionada(null);
    setSedeId("");
    setConsultorioId("");

    const today = toDateInputValue(
      new Date()
    );

    setFechaSeleccionada(today);
    setRangoInicio(today);
    setRangoFin(today);
    setModalidad("PRESENCIAL");
    setReservado(false);
    setHoraInicio("00:00");
    setHoraFin("23:59");
    setDuracionCita("30");
    setFechaInicio("");
    setFechaFin("");
    setEstado("1");
    setObservacion("");
    setTurnosPreview([]);
    setError("");
  }

  function validar() {
    if (!medicoSeleccionado) {
      setError("Debe seleccionar un médico");
      return false;
    }

    if (!especialidadSeleccionada) {
      setError(
        "Debe seleccionar una especialidad"
      );
      return false;
    }

    if (!sedeId) {
      setError("Debe seleccionar una sede");
      return false;
    }

    if (!consultorioId) {
      setError(
        "Debe seleccionar un consultorio"
      );
      return false;
    }

    if (!fechaSeleccionada) {
      setError("Debe seleccionar una fecha");
      return false;
    }

    if (!horaInicio) {
      setError(
        "Debe ingresar la hora inicial"
      );
      return false;
    }

    if (!horaFin) {
      setError("Debe ingresar la hora final");
      return false;
    }

    if (horaInicio >= horaFin) {
      setError(
        "La hora inicial debe ser menor que la hora final"
      );
      return false;
    }

    if (
      !duracionCita ||
      Number(duracionCita) <= 0
    ) {
      setError(
        "La duración debe ser mayor a cero"
      );
      return false;
    }

    const inicioRango =
      fechaInicio || fechaSeleccionada;
    const finRango =
      fechaFin || fechaSeleccionada;

    if (
      parseDateInput(inicioRango) >
      parseDateInput(finRango)
    ) {
      setError(
        "La fecha inicial debe ser menor o igual a la fecha final"
      );
      return false;
    }

    setError("");

    return true;
  }

  function crearHorariosPreview() {
    if (!validar()) {
      return;
    }

    const inicioRango =
      rangoInicio ||
      fechaInicio ||
      fechaSeleccionada;

    const finRango =
      rangoFin ||
      fechaFin ||
      fechaSeleccionada;

    const fechas = buildDateRange(
      inicioRango,
      finRango
    );

    if (fechas.length === 0) {
      setError(
        "El rango de fechas no es válido"
      );
      return;
    }

    const nuevosTurnos = fechas.map(
      (fecha, index) => {
        const fechaTexto =
          toDateInputValue(fecha);

        return {
          id: `${fechaTexto}-${horaInicio}-${horaFin}-${index}`,
          fecha: fechaTexto,
          dia_semana:
            getDiaSemanaFromDate(fecha),
          hora_inicio: horaInicio,
          hora_fin: horaFin,
          reservado: reservado
            ? "SI"
            : "NO",
          modalidad,
        };
      }
    );

    setTurnosPreview(nuevosTurnos);
    setError("");
  }

  function borrarHorariosPreview() {
    setTurnosPreview([]);
  }

  function eliminarTurnoPreview(id) {
    setTurnosPreview((actuales) =>
      actuales.filter(
        (item) => item.id !== id
      )
    );
  }

  async function guardar() {
    if (!validar()) {
      return;
    }

    try {
      const turnosAGuardar =
        turnosPreview.length > 0
          ? turnosPreview
          : [
              {
                fecha: fechaSeleccionada,
                dia_semana: diaSemana,
                hora_inicio: horaInicio,
                hora_fin: horaFin,
                reservado: reservado
                  ? "SI"
                  : "NO",
                modalidad,
              },
            ];

      for (const turno of turnosAGuardar) {
        const payload = {
          medico_id:
            medicoSeleccionado.id,
          especialidad_id:
            especialidadSeleccionada.id,
          sede_id: Number(sedeId),
          consultorio_id:
            Number(consultorioId),
          dia_semana:
            turno.dia_semana,
          hora_inicio:
            turno.hora_inicio,
          hora_fin:
            turno.hora_fin,
          duracion_cita:
            Number(duracionCita),
          fecha_inicio:
            turno.fecha,
          fecha_fin:
            turno.fecha,
          estado: Number(estado),
          observacion:
            observacion ||
            `${turno.modalidad}${
              turno.reservado === "SI"
                ? " - Reservado"
                : ""
            }`,
        };

        console.log(
          "PAYLOAD HORARIO:",
          payload
        );

        const url = editingId
          ? `${API}/api/horarios/${editingId}`
          : `${API}/api/horarios`;

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
            body: JSON.stringify(payload),
          }
        );

        const result =
          await response.json();

        console.log(
          "RESPUESTA BACKEND HORARIO:",
          result
        );

        if (!response.ok) {
          throw new Error(
            result.message ||
              result.sqlMessage ||
              "Error guardando horario"
          );
        }
      }

      limpiar();
      cargarHorarios();
    } catch (error) {
      console.error(
        "ERROR GUARDANDO HORARIO:",
        error
      );

      setError(error.message);
    }
  }

  async function guardarYCerrar() {
    await guardar();
  }

  function editar(item) {
    setEditingId(item.id);

    setMedicoSeleccionado({
      id: item.medico_id,
      codigo: item.codigo_medico,
      nombre_completo:
        item.nombre_medico,
    });

    setEspecialidadSeleccionada({
      id: item.especialidad_id,
      codigo:
        item.codigo_especialidad,
      descripcion:
        item.especialidad,
    });

    setSedeId(
      item.sede_id
        ? String(item.sede_id)
        : ""
    );

    setConsultorioId(
      item.consultorio_id
        ? String(item.consultorio_id)
        : ""
    );

    setHoraInicio(
      item.hora_inicio
        ? String(
            item.hora_inicio
          ).slice(0, 5)
        : "00:00"
    );

    setHoraFin(
      item.hora_fin
        ? String(
            item.hora_fin
          ).slice(0, 5)
        : "23:59"
    );

    setDuracionCita(
      item.duracion_cita
        ? String(
            item.duracion_cita
          )
        : "30"
    );

    setFechaInicio(
      item.fecha_inicio || ""
    );

    setFechaFin(
      item.fecha_fin || ""
    );

    setEstado(
      String(
        item.estado ?? "1"
      )
    );

    setObservacion(
      item.observacion || ""
    );
  }

  function seleccionarMedico(item) {
    setMedicoSeleccionado(item);
    setShowMedicos(false);
    setError("");
  }

  function seleccionarEspecialidad(item) {
    setEspecialidadSeleccionada(item);
    setShowEspecialidades(false);
    setError("");
  }

  return (
    <div className="hm-page sgcm-page">
      <Card className="hm-card sgcm-card">
        <div className="hm-window-title">
          <h1 className="sgcm-title">
            🗓️ Horario de atención -
            Creación de horarios
          </h1>
        </div>

        {error && (
          <div className="hm-error sgcm-error">
            {error}
          </div>
        )}

        <section className="hm-creator">
          <div className="hm-calendars">
            <MiniMonthCalendar
              monthDate={mesBase}
              selectedDate={
                fechaSeleccionada
              }
              rangeStart={rangoInicio}
              rangeEnd={rangoFin}
              onSelectDate={
                seleccionarFechaCalendario
              }
              onPreviousMonth={() =>
                setMesBase(
                  addMonths(
                    mesBase,
                    -1
                  )
                )
              }
              onNextMonth={() =>
                setMesBase(
                  addMonths(
                    mesBase,
                    1
                  )
                )
              }
            />

            <MiniMonthCalendar
              monthDate={addMonths(
                mesBase,
                1
              )}
              selectedDate={
                fechaSeleccionada
              }
              rangeStart={rangoInicio}
              rangeEnd={rangoFin}
              onSelectDate={
                seleccionarFechaCalendario
              }
              onPreviousMonth={() =>
                setMesBase(
                  addMonths(
                    mesBase,
                    -1
                  )
                )
              }
              onNextMonth={() =>
                setMesBase(
                  addMonths(
                    mesBase,
                    1
                  )
                )
              }
            />

            <div className="hm-calendar-footer">
              <button
                type="button"
                className="hm-today-btn"
                onClick={() => {
                  const today =
                    toDateInputValue(
                      new Date()
                    );

                  setFechaSeleccionada(
                    today
                  );
                  setRangoInicio(today);
                  setRangoFin(today);
                  setFechaInicio(today);
                  setFechaFin(today);
                  setSeleccionandoFinRango(
                    false
                  );
                }}
              >
                Hoy
              </button>
            </div>
          </div>

          <div className="hm-time-panel">
            <div className="hm-radio-row">
              <label>
                <input
                  type="radio"
                  checked={
                    modalidad ===
                    "PRESENCIAL"
                  }
                  onChange={() =>
                    setModalidad(
                      "PRESENCIAL"
                    )
                  }
                />
                Presencial
              </label>

              <label>
                <input
                  type="radio"
                  checked={
                    modalidad ===
                    "VIRTUAL"
                  }
                  onChange={() =>
                    setModalidad(
                      "VIRTUAL"
                    )
                  }
                />
                Virtual
              </label>
            </div>

            <label className="hm-check-row">
              <input
                type="checkbox"
                checked={reservado}
                onChange={(event) =>
                  setReservado(
                    event.target.checked
                  )
                }
              />
              Reservado
            </label>

            <div className="hm-time-field">
              <label>
                Hora inicial:
              </label>

              <Input
                type="time"
                value={horaInicio}
                onChange={(event) =>
                  setHoraInicio(
                    event.target.value
                  )
                }
              />
            </div>

            <div className="hm-time-field">
              <label>
                Hora final:
              </label>

              <Input
                type="time"
                value={horaFin}
                onChange={(event) =>
                  setHoraFin(
                    event.target.value
                  )
                }
              />
            </div>

            <Button
              type="button"
              variant="accent"
              onClick={
                crearHorariosPreview
              }
            >
              🗓️ Crear Horarios
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={
                borrarHorariosPreview
              }
            >
              🗑️ Borrar Horarios
            </Button>
          </div>

          <div className="hm-turnos-panel">
            <div className="hm-turnos-actions">
              <button type="button">
                📋 Copiar
              </button>

              <button type="button">
                🧾 Consultar turnos
              </button>
            </div>

            <table className="sgcm-table hm-preview-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Hora Inicial</th>
                  <th>Hora Final</th>
                  <th>Reservado</th>
                  <th>Acción</th>
                </tr>
              </thead>

              <tbody>
                {turnosPreview.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="hm-preview-empty"
                    >
                      Record 0 of 0
                    </td>
                  </tr>
                )}

                {turnosPreview.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {new Date(
                        `${item.fecha}T00:00:00`
                      ).toLocaleDateString(
                        "es-CO"
                      )}
                    </td>

                    <td>
                      {item.hora_inicio}
                    </td>

                    <td>
                      {item.hora_fin}
                    </td>

                    <td>
                      {item.reservado}
                    </td>

                    <td className="hm-preview-action-cell">
                      <button
                        type="button"
                        className="sgcm-delete-button hm-preview-delete-btn"
                        title="Eliminar fecha"
                        onClick={() =>
                          eliminarTurnoPreview(
                            item.id
                          )
                        }
                      >
                        🗓️⛔
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="hm-tabs">
          <div className="hm-tab-header">
            <button
              type="button"
              className={
                tabActiva === "recursos"
                  ? "hm-tab active"
                  : "hm-tab"
              }
              onClick={() =>
                setTabActiva("recursos")
              }
            >
              👥 Recursos
            </button>

            <button
              type="button"
              className={
                tabActiva === "turnos"
                  ? "hm-tab active"
                  : "hm-tab"
              }
              onClick={() =>
                setTabActiva("turnos")
              }
            >
              🗓️ Turnos
            </button>
          </div>

          <div className="hm-tab-body">
            {tabActiva === "recursos" && (
              <>
                <div className="hm-resource-fields">
                  <label className="sgcm-label">
                    Especialidad:
                  </label>

                  <input
                    className="sgcm-input-readonly"
                    value={
                      especialidadSeleccionada
                        ? especialidadSeleccionada.codigo
                        : ""
                    }
                    readOnly
                  />

                  <button
                    type="button"
                    className="sgcm-search-button"
                    aria-label="Buscar especialidad"
                    onClick={() =>
                      setShowEspecialidades(
                        true
                      )
                    }
                  >
                    🔍
                  </button>

                  <input
                    className="sgcm-input-readonly"
                    value={
                      especialidadSeleccionada
                        ? especialidadSeleccionada.descripcion
                        : ""
                    }
                    readOnly
                  />

                  <label>
                    Centro de atención:
                  </label>

                  <input
                    value={
                      sedeSeleccionada
                        ? sedeSeleccionada.sede ||
                          sedeSeleccionada.nombre
                        : ""
                    }
                    readOnly
                  />

                  <button type="button">
                    🔍
                  </button>

                  <select
                    value={sedeId}
                    onChange={(event) => {
                      setSedeId(
                        event.target.value
                      );
                      setConsultorioId("");
                    }}
                  >
                    <option value="">
                      Seleccione
                    </option>

                    {sedes.map((item) => (
                      <option
                        key={item.id}
                        value={item.id}
                      >
                        {item.sede ||
                          item.nombre}
                      </option>
                    ))}
                  </select>

                  <label>
                    Actividad:
                  </label>

                  <input
                    value={actividadCodigo}
                    readOnly
                  />

                  <button type="button">
                    🔍
                  </button>

                  <input
                    value={
                      actividadDescripcion
                    }
                    readOnly
                  />
                </div>

                <div className="hm-consultorio-row">
                  <div className="hm-consultorio-label sgcm-label">
                    Consultorio:
                  </div>

                  <FieldGroup className="hm-consultorio-field">
                    <select
                      className="sgcm-select"
                      value={consultorioId}
                      onChange={(event) =>
                        setConsultorioId(
                          event.target.value
                        )
                      }
                    >
                      <option value="">
                        Seleccione consultorio
                      </option>

                      {consultoriosFiltrados.map(
                        (item) => (
                          <option
                            key={item.id}
                            value={item.id}
                          >
                            {item.consultorio ||
                              item.nombre}
                          </option>
                        )
                      )}
                    </select>
                  </FieldGroup>

                  <FieldGroup
                    label="Piso:"
                    htmlFor="piso-consultorio"
                    className="hm-piso-field"
                  >
                    <Input
                      id="piso-consultorio"
                      value={
                        consultorioSeleccionado?.piso ??
                        ""
                      }
                      readOnly
                      className="sgcm-input-readonly"
                    />
                  </FieldGroup>
                </div>

                <div className="hm-resource-panel">
                  <div className="hm-window-title">
                    <h1 className="sgcm-title">
                      🩺 Médicos/Recursos y consultorios
                    </h1>
                  </div>

                  <div className="hm-resource-actions">
                    <button
                      type="button"
                      className="sgcm-search-action-button"
                      onClick={() =>
                        setShowMedicos(true)
                      }
                    >
                      🔍 Buscar médico
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setMedicoSeleccionado(
                          null
                        )
                      }
                    >
                      👥 Quitar todos
                    </button>

                    <button
                      type="button"
                      onClick={
                        crearHorariosPreview
                      }
                    >
                      🗓️ Crear turnos
                    </button>
                  </div>

                  <DataGrid
                    rows={
                      medicoSeleccionado
                        ? [
                            {
                              id: medicoSeleccionado.id,
                              codigo:
                                medicoSeleccionado.codigo,
                              nombre:
                                medicoSeleccionado.nombre_completo ||
                                medicoSeleccionado.nombre_medico,
                              tipo:
                                medicoSeleccionado.tipo,
                              consultorio:
                                consultorioSeleccionado?.consultorio ||
                                consultorioSeleccionado?.nombre ||
                                "",
                            },
                          ]
                        : []
                    }
                    columns={[
                      {
                        field: "codigo",
                        title: "Código",
                      },
                      {
                        field: "nombre",
                        title: "Nombre",
                      },
                      {
                        field: "tipo",
                        title: "Tipo",
                      },
                      {
                        field: "consultorio",
                        title: "Consultorio",
                      },
                    ]}
                  />
                </div>
              </>
            )}

            {tabActiva === "turnos" && (
              <DataGrid
                rows={horarios}
                columns={[
                  {
                    field: "fecha_inicio",
                    title: "Fecha",
                  },
                  {
                    field: "hora_inicio",
                    title: "Hora I.",
                  },
                  {
                    field: "hora_fin",
                    title: "Hora F.",
                  },
                  {
                    field: "nombre_medico",
                    title: "Médico",
                  },
                  {
                    field: "consultorio",
                    title: "Consultorio",
                  },
                ]}
                onRowDoubleClick={editar}
              />
            )}
          </div>

          <div className="hm-toolbar sgcm-actions">
            <Button
              type="button"
              variant="accent"
              onClick={guardar}
            >
              💾 GUARDAR
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={limpiar}
            >
              ↩️ DESHACER
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={limpiar}
            >
              ❌ CERRAR
            </Button>
          </div>
        </section>
      </Card>

      <SearchDialog
        open={showMedicos}
        title="Listado de Médicos"
        onClose={() =>
          setShowMedicos(false)
        }
      >
        <DataGrid
          rows={medicos}
          columns={[
            {
              field: "codigo",
              title: "Código",
            },
            {
              field: "nombre_completo",
              title: "Médico",
            },
            {
              field: "numero_documento",
              title: "Documento",
            },
          ]}
          onRowDoubleClick={
            seleccionarMedico
          }
        />
      </SearchDialog>

      <SearchDialog
        open={showEspecialidades}
        title="Listado de Especialidades"
        onClose={() =>
          setShowEspecialidades(false)
        }
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
          onRowDoubleClick={
            seleccionarEspecialidad
          }
        />
      </SearchDialog>
    </div>
  );
}