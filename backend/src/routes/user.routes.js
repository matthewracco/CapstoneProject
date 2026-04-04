const express = require("express");
const { requireAuth, requireTenant } = require("../middleware/clerkTenant");
const { requireRole } = require("../middleware/rbac");
const userService = require("../services/user.service");

const router = express.Router();

router.get("/", requireAuth, requireTenant, requireRole("STAFF", "OWNER"), async (req, res, next) => {
  try {
    const users = await userService.getUsers({
      tenantId: req.tenantId,
    });
    res.status(200).json({ message: "Users retrieved", count: users.length, users });
  } catch (e) {
    next(e);
  }
});

router.patch("/:id/role", requireAuth, requireTenant, requireRole("OWNER"), async (req, res, next) => {
  try {
    const user = await userService.updateRole({
      tenantId: req.tenantId,
      userId: req.params.id,
      role: req.body.role,
    });
    res.status(200).json({ message: "Role updated successfully", user });
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", requireAuth, requireTenant, requireRole("OWNER"), async (req, res, next) => {
  try {
    await userService.deleteUser({
      tenantId: req.tenantId,
      userId: req.params.id,
    });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
