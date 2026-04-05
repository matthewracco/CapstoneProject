const express = require("express");
const validate = require("../middleware/validate");
const authService = require("../services/auth.service");
const { registerSchema, loginSchema } = require("../validators/auth.validator");

const router = express.Router();

router.post("/register", validate(registerSchema), async (req, res, next) => {
  try {
    const tenantId = req.headers["x-tenant-id"] || "tenant_demo_1";
    const { email, password, name } = req.body;

    const result = await authService.register({ tenantId, email, password, name });

    res.status(201).json({ message: "User registered", ...result });
  } catch (e) {
    next(e);
  }
});

router.post("/login", validate(loginSchema), async (req, res, next) => {
  try {
    const tenantId = req.headers["x-tenant-id"] || "tenant_demo_1";
    const { email, password } = req.body;

    const result = await authService.login({ tenantId, email, password });

    res.status(200).json({ message: "Login successful", ...result });
  } catch (e) {
    next(e);
  }
});

router.post("/refresh", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    const result = await authService.refreshToken(refreshToken);

    res.status(200).json({ message: "Token refreshed", ...result });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
