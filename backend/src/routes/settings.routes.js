const express = require("express");
const { requireAuth, requireTenant } = require("../middleware/clerkTenant");
const { requireRole } = require("../middleware/rbac");
const settingsService = require("../services/settings.service");

const router = express.Router();

router.get("/", requireAuth, requireTenant, async (req, res, next) => {
  try {
    const settings = await settingsService.getSettings({ tenantId: req.tenantId });
    res.status(200).json({ settings });
  } catch (e) {
    next(e);
  }
});

router.put("/", requireAuth, requireTenant, requireRole("OWNER"), async (req, res, next) => {
  try {
    const { mode, maxDurationHours } = req.body;
    const settings = await settingsService.upsertSettings({
      tenantId: req.tenantId,
      mode,
      maxDurationHours: maxDurationHours ?? null,
    });
    res.status(200).json({ message: "Settings saved", settings });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
