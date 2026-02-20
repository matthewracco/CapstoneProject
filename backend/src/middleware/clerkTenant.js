const { clerkMiddleware, requireAuth } = require("@clerk/express");

function requireTenant(req, res, next) {
  req.tenantId = process.env.DEFAULT_TENANT_ID || "tenant_demo_1";
  next();
}

module.exports = {
  clerkMiddleware,
  requireAuth,
  requireTenant,
};