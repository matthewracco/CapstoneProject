const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

const JWT_SECRET = process.env.JWT_SECRET || "smartlocker-secret-key-change-in-prod";

function requireAuth(req, res, next) {
  if (process.env.BYPASS_AUTH === "true") {
    req.user = {
      userId: process.env.DEV_USER_ID || "user_demo",
      tenantId: process.env.DEV_TENANT_ID || "tenant_demo",
      role: process.env.DEV_USER_ROLE || "OWNER",
    };
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Unauthorized", 401, "UNAUTHORIZED"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return next(new AppError("Invalid or expired token", 401, "UNAUTHORIZED"));
  }
}

function requireTenant(req, res, next) {
  if (process.env.BYPASS_AUTH === "true") {
    req.tenantId = process.env.DEV_TENANT_ID || "tenant_demo";
    return next();
  }

  if (!req.user || !req.user.tenantId) {
    return next(new AppError("Tenant required", 400, "TENANT_REQUIRED"));
  }

  req.tenantId = req.user.tenantId;
  next();
}

module.exports = { requireAuth, requireTenant };
