const AppError = require("../utils/AppError");



function requireAuth(req, res, next) {
  if (process.env.BYPASS_AUTH === "true") {
    req.user = { userId: process.env.DEV_USER_ID || "user_demo" };
    return next();
  }

  return next(new AppError("Unauthorized", 401, "UNAUTHORIZED"));
}

function requireTenant(req, res, next) {
  if (process.env.BYPASS_AUTH === "true") {
    req.tenantId = process.env.DEV_TENANT_ID || "tenant_demo";
    return next();
  }

  return next(new AppError("Tenant required", 400, "TENANT_REQUIRED"));
}

module.exports = { requireAuth, requireTenant };
