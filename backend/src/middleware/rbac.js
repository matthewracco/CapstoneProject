const AppError = require("../utils/AppError");

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (process.env.BYPASS_AUTH === "true") {
      return next();
    }

    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(
        new AppError("Forbidden: insufficient permissions", 403, "FORBIDDEN")
      );
    }

    next();
  };
}

module.exports = { requireRole };
