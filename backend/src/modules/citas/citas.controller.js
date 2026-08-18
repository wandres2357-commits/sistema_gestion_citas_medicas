// backend/src/modules/citas/citas.controller.js
import * as service from "./citas.service.js";

export async function listarCitas(req, res) {
  try {
    const data = await service.listarCitas(req.query);

    return res.json({
      ok: true,
      data,
    });
  } catch (error) {
    console.error("ERROR listarCitas:", error);

    return res.status(500).json({
      ok: false,
      message: error.message || "Error al listar citas.",
    });
  }
}

export async function listarDisponibilidad(req, res) {
  try {
    const data = await service.listarDisponibilidad(req.query);

    return res.json({
      ok: true,
      data,
    });
  } catch (error) {
    console.error("ERROR listarDisponibilidad:", error);

    return res.status(400).json({
      ok: false,
      message: error.message || "Error al consultar disponibilidad.",
    });
  }
}

export async function crearCita(req, res) {
  try {
    const usuarioId = req.user?.id || null;
    const data = await service.crearCita(req.body, usuarioId);

    return res.status(201).json({
      ok: true,
      message: "Cita asignada correctamente.",
      data,
    });
  } catch (error) {
    console.error("ERROR crearCita:", error);

    return res.status(400).json({
      ok: false,
      message: error.message || "Error al crear la cita.",
    });
  }
}

export async function confirmarCita(req, res) {
  try {
    const usuarioId = req.user?.id || null;
    const data = await service.confirmarCita(Number(req.params.id), usuarioId);

    return res.json({
      ok: true,
      message: "Cita confirmada correctamente.",
      data,
    });
  } catch (error) {
    console.error("ERROR confirmarCita:", error);

    return res.status(400).json({
      ok: false,
      message: error.message || "Error al confirmar la cita.",
    });
  }
}

export async function cancelarCita(req, res) {
  try {
    const usuarioId = req.user?.id || null;

    const data = await service.cancelarCita(
      Number(req.params.id),
      req.body,
      usuarioId
    );

    return res.json({
      ok: true,
      message: "Cita cancelada correctamente.",
      data,
    });
  } catch (error) {
    console.error("ERROR cancelarCita:", error);

    return res.status(400).json({
      ok: false,
      message: error.message || "Error al cancelar la cita.",
    });
  }
}

export async function marcarAtendida(req, res) {
  try {
    const usuarioId = req.user?.id || null;
    const data = await service.marcarAtendida(Number(req.params.id), usuarioId);

    return res.json({
      ok: true,
      message: "Cita marcada como atendida.",
      data,
    });
  } catch (error) {
    console.error("ERROR marcarAtendida:", error);

    return res.status(400).json({
      ok: false,
      message: error.message || "Error al actualizar la cita.",
    });
  }
}

export async function marcarNoAsistio(req, res) {
  try {
    const usuarioId = req.user?.id || null;
    const data = await service.marcarNoAsistio(Number(req.params.id), usuarioId);

    return res.json({
      ok: true,
      message: "Cita marcada como no asistió.",
      data,
    });
  } catch (error) {
    console.error("ERROR marcarNoAsistio:", error);

    return res.status(400).json({
      ok: false,
      message: error.message || "Error al actualizar la cita.",
    });
  }
}