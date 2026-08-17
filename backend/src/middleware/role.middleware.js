// backend/src/middleware/role.middleware.js
export const requireRole = (role) => {
  return (req, res, next) => {
    const requiredRole = String(role).toLowerCase();
    const userRoles = Array.isArray(req.user?.roles)
      ? req.user.roles.map((r) => String(r).toLowerCase())
      : [];

    if (!userRoles.includes(requiredRole)) {
      return res.status(403).json({
        message: "Acceso denegado",
      });
    }

    next();
  };
};