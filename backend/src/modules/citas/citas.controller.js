// backend/src/modules/citas/citas.controller.js

import * as service from "./citas.service.js";

/**
 * Obtiene el ID del usuario autenticado.
 *
 * Mientras se implementa el JWT definitivo, puede ser null.
 */
function obtenerUsuarioId(req) {
  return req.user?.id || null;
}

/**
 * GET /api/citas
 */
export async function listarCitas(req, res) {
  try {
    const data =
      await service.listarCitas(
        req.query
      );

    return res.status(200).json({
      ok: true,
      data: Array.isArray(data)
        ? data
        : [],
    });
  } catch (error) {
    console.error(
      "ERROR listarCitas:",
      error
    );

    return res.status(500).json({
      ok: false,
      message:
        error.message ||
        "Error al listar las citas.",
    });
  }
}

/**
 * GET /api/citas/disponibilidad
 */
export async function listarDisponibilidad(req, res) {
  try {
    const data =
      await service.listarDisponibilidad(
        req.query
      );

    return res.status(200).json({
      ok: true,
      data,
    });
  } catch (error) {
    console.error(
      "ERROR listarDisponibilidad:",
      error
    );

    return res.status(400).json({
      ok: false,
      message:
        error.message ||
        "Error al consultar la disponibilidad.",
    });
  }
}

/**
 * POST /api/citas
 */
export async function crearCita(req, res) {
  try {
    const usuarioId =
      obtenerUsuarioId(req);

    const data =
      await service.crearCita(
        req.body,
        usuarioId
      );

    return res.status(201).json({
      ok: true,
      message:
        "Cita creada correctamente.",
      data,
    });
  } catch (error) {
    console.error("ERROR crearCita:", error);

    return res.status(400).json({
      ok: false,
      message:
        error.message ||
        "Error al crear la cita.",
    });
  }
}

/**
 * PATCH /api/citas/:id/confirmar
 */
export async function confirmarCita(req, res) {
  try {
    const citaId = Number(req.params.id);
    const usuarioId =
      obtenerUsuarioId(req);

    const data =
      await service.confirmarCita(
        citaId,
        usuarioId
      );

    return res.status(200).json({
      ok: true,
      message:
        "Cita confirmada correctamente.",
      data,
    });
  } catch (error) {
    console.error(
      "ERROR confirmarCita:",
      error
    );

    return res.status(400).json({
      ok: false,
      message:
        error.message ||
        "Error al confirmar la cita.",
    });
  }
}

/**
 * PATCH /api/citas/:id/cancelar
 */
export async function cancelarCita(req, res) {
  try {
    const citaId = Number(req.params.id);
    const usuarioId =
      obtenerUsuarioId(req);

    const data =
      await service.cancelarCita(
        citaId,
        req.body,
        usuarioId
      );

    return res.status(200).json({
      ok: true,
      message:
        "Cita cancelada correctamente.",
      data,
    });
  } catch (error) {
    console.error(
      "ERROR cancelarCita:",
      error
    );

    return res.status(400).json({
      ok: false,
      message:
        error.message ||
        "Error al cancelar la cita.",
    });
  }
}

/**
 * PATCH /api/citas/:id/atendida
 */
export async function marcarAtendida(req, res) {
  try {
    const citaId = Number(req.params.id);
    const usuarioId =
      obtenerUsuarioId(req);

    const data =
      await service.marcarAtendida(
        citaId,
        usuarioId
      );

    return res.status(200).json({
      ok: true,
      message:
        "Cita marcada como atendida.",
      data,
    });
  } catch (error) {
    console.error(
      "ERROR marcarAtendida:",
      error
    );

    return res.status(400).json({
      ok: false,
      message:
        error.message ||
        "Error al marcar la cita como atendida.",
    });
  }
}

/**
 * PATCH /api/citas/:id/no-asistio
 */
export async function marcarNoAsistio(req, res) {
  try {
    const citaId = Number(req.params.id);
    const usuarioId =
      obtenerUsuarioId(req);

    const data =
      await service.marcarNoAsistio(
        citaId,
        req.body,
        usuarioId
      );

    return res.status(200).json({
      ok: true,
      message:
        "Cita marcada como no asistió.",
      data,
    });
  } catch (error) {
    console.error(
      "ERROR marcarNoAsistio:",
      error
    );

    return res.status(400).json({
      ok: false,
      message:
        error.message ||
        "Error al marcar la inasistencia.",
    });
  }
}

/**
 * PATCH /api/citas/:id/en-espera
 *
 * Solo existe una declaración de marcarEnEspera
 * en todo este archivo.
 */
export async function marcarEnEspera(req, res) {
  try {
    const citaId = Number(req.params.id);
    const usuarioId =
      obtenerUsuarioId(req);

    const data =
      await service.marcarEnEspera(
        citaId,
        req.body,
        usuarioId
      );

    return res.status(200).json({
      ok: true,
      message:
        "Cita enviada al estado EN_ESPERA.",
      data,
    });
  } catch (error) {
    console.error(
      "ERROR marcarEnEspera:",
      error
    );

    return res.status(400).json({
      ok: false,
      message:
        error.message ||
        "Error al enviar la cita a espera.",
    });
  }
}

/**
 * PATCH /api/citas/:id/reprogramada
 *
 * Cambia únicamente el estado de la cita.
 */
export async function marcarReprogramada(
  req,
  res
) {
  try {
    const citaId = Number(req.params.id);
    const usuarioId =
      obtenerUsuarioId(req);

    const data =
      await service.marcarReprogramada(
        citaId,
        req.body,
        usuarioId
      );

    return res.status(200).json({
      ok: true,
      message:
        "Cita marcada como REPROGRAMADA.",
      data,
    });
  } catch (error) {
    console.error(
      "ERROR marcarReprogramada:",
      error
    );

    return res.status(400).json({
      ok: false,
      message:
        error.message ||
        "Error al cambiar el estado de la cita.",
    });
  }
}

/**
 * PATCH /api/citas/:id/reprogramar
 *
 * Cambia fecha, hora, agenda, recurso y estado.
 */
export async function reprogramarFechaCita(
  req,
  res
) {
  try {
    const citaId = Number(req.params.id);
    const usuarioId =
      obtenerUsuarioId(req);

    const data =
      await service.reprogramarFechaCita(
        citaId,
        req.body,
        usuarioId
      );

    return res.status(200).json({
      ok: true,
      message:
        "Cita reprogramada correctamente.",
      data,
    });
  } catch (error) {
    console.error(
      "ERROR reprogramarFechaCita:",
      error
    );

    return res.status(400).json({
      ok: false,
      message:
        error.message ||
        "Error al reprogramar la cita.",
    });
  }
}