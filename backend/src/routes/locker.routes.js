// const express = require('express');
// const prisma = require("../config/prisma")
// const { requireAuth, requireTenant } = require("../middleware/clerkTenant");

// const router = express.Router();

// router.get("/", requireAuth, requireTenant, async (req, res, next) => {
//   try {
//     const { status, location, type } = req.query;

//     const lockers = await prisma.locker.findMany({
//       where: {
//         tenantId: req.tenantId,
//         ...(status ? { status } : {}),
//         ...(location ? { location } : {}),
//         ...(type ? { type } : {}),
//       },
//       orderBy: { createdAt: "desc" },
//     });

//     res.status(200).json({ message: "Lockers retrieved", count: lockers.length, lockers });
//   } catch (e) {
//     next(e);
//   }
// });

// router.get("/:id", requireAuth, requireTenant, async (req, res, next) => {
//   try {
//     const locker = await prisma.locker.findFirst({
//       where: { id: req.params.id, tenantId: req.tenantId },
//     });

//     if (!locker) return res.status(404).json({ error: "Locker not found" });

//     res.status(200).json({ locker });
//   } catch (e) {
//     next(e);
//   }
// });

// module.exports = router;

const express = require("express");
const { requireAuth, requireTenant } = require("../middleware/clerkTenant");
const { requireRole } = require("../middleware/rbac");
const validate = require("../middleware/validate");
const lockerController = require("../controllers/locker.controller");
const {
  createLockerSchema,
  updateLockerSchema,
  lockerQuerySchema,
} = require("../validators/locker.validator");
const qrService = require("../services/qr.service");
const lockerService = require("../services/locker.service");
const rentalService = require("../services/rental.service");
const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");

const router = express.Router();

router.get("/", requireAuth, requireTenant, validate(lockerQuerySchema, "query"), lockerController.getLockers);
router.get("/:id", requireAuth, requireTenant, lockerController.getLocker);
router.post("/", requireAuth, requireTenant, validate(createLockerSchema), lockerController.createLocker);
router.patch("/:id", requireAuth, requireTenant, validate(updateLockerSchema), lockerController.updateLocker);

// Generate QR code for a locker
router.post("/:id/qr", requireAuth, requireTenant, requireRole("STAFF", "OWNER"), async (req, res, next) => {
  try {
    const locker = await qrService.generateQRForLocker(req.params.id, req.tenantId);
    res.status(200).json({ message: "QR code generated", locker });
  } catch (e) {
    next(e);
  }
});

// Staff override locker status
router.post("/:id/override", requireAuth, requireTenant, requireRole("STAFF", "OWNER"), async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status || !["AVAILABLE", "MAINTENANCE", "OCCUPIED"].includes(status)) {
      throw new AppError("Invalid status", 400, "VALIDATION_ERROR");
    }

    const locker = await prisma.locker.findFirst({
      where: { id: req.params.id, tenantId: req.tenantId },
    });
    if (!locker) throw new AppError("Locker not found", 404, "LOCKER_NOT_FOUND");

    // If locker is OCCUPIED and being set to something else, force-end active rental
    if (locker.status === "OCCUPIED" && status !== "OCCUPIED") {
      const activeRental = await prisma.rental.findFirst({
        where: { lockerId: locker.id, tenantId: req.tenantId, status: "ACTIVE" },
      });
      if (activeRental) {
        await rentalService.forceCompleteRental({ tenantId: req.tenantId, rentalId: activeRental.id });
      }
    }

    const updated = await prisma.locker.update({
      where: { id: req.params.id },
      data: { status },
    });

    res.status(200).json({ message: "Locker status overridden", locker: updated });
  } catch (e) {
    next(e);
  }
});

// Assign or unassign a locker to a user
router.patch("/:id/assign", requireAuth, requireTenant, requireRole("STAFF", "OWNER"), async (req, res, next) => {
  try {
    const { userId } = req.body;

    // Find the locker (tenant-scoped)
    const locker = await prisma.locker.findFirst({
      where: { id: req.params.id, tenantId: req.tenantId },
    });
    if (!locker) throw new AppError("Locker not found", 404, "LOCKER_NOT_FOUND");

    // Unassign: userId is null or undefined
    if (!userId) {
      // Complete any active subscription rental on this locker
      await prisma.rental.updateMany({
        where: { lockerId: req.params.id, tenantId: req.tenantId, status: "ACTIVE" },
        data: { status: "COMPLETED", endTime: new Date() },
      });
      const updated = await prisma.locker.update({
        where: { id: req.params.id },
        data: { assignedTo: null, status: "AVAILABLE" },
      });
      return res.status(200).json({ message: "Locker unassigned", locker: updated });
    }

    // Validate user exists in same tenant
    const targetUser = await prisma.user.findFirst({
      where: { id: userId, tenantId: req.tenantId },
    });
    if (!targetUser) throw new AppError("User not found", 404, "USER_NOT_FOUND");

    // Cancel any existing active rental on this locker before re-assigning
    await prisma.rental.updateMany({
      where: { lockerId: req.params.id, tenantId: req.tenantId, status: "ACTIVE" },
      data: { status: "COMPLETED", endTime: new Date() },
    });

    // Assign
    const updated = await prisma.locker.update({
      where: { id: req.params.id },
      data: { assignedTo: userId, status: "ASSIGNED" },
    });

    // Auto-create a subscription rental (no end time) for the assigned user
    await rentalService.createSubscriptionRental({
      tenantId: req.tenantId,
      userId,
      lockerId: req.params.id,
    });

    // Send notification to the assigned user
    const notificationService = require("../services/notification.service");
    await notificationService.create({
      tenantId: req.tenantId,
      userId: userId,
      type: "LOCKER_ASSIGNED",
      title: "Locker Assigned",
      body: `Locker ${locker.lockerNumber} has been assigned to you.`,
    });

    res.status(200).json({ message: "Locker assigned", locker: updated });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
