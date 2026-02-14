const express = require("express");
const prisma = require("../config/prisma");
const { requireAuth, requireTenant } = require("../middleware/clerkTenant");

const router = express.Router();

router.post("/", requireAuth, requireTenant, async (req, res, next) => {
  try {
    const { lockerId } = req.body;
    if (!lockerId) return res.status(400).json({ error: "lockerId is required" });

    const locker = await prisma.locker.findFirst({
      where: { id: lockerId, tenantId: req.tenantId },
    });

    if (!locker) return res.status(404).json({ error: "Locker not found" });
    if (locker.status !== "available") return res.status(400).json({ error: "Locker is not available" });

    const rental = await prisma.$transaction(async (tx) => {
      await tx.locker.update({
        where: { id: lockerId },
        data: { status: "occupied" },
      });

      return tx.rental.create({
        data: {
          tenantId: req.tenantId,
          userId: req.user.userId,
          lockerId,
          rentalCode: `RENTAL-${Date.now()}`,
        },
      });
    });

    res.status(201).json({ message: "Rental created successfully", rental });
  } catch (e) {
    next(e);
  }
});

router.get("/", requireAuth, requireTenant, async (req, res, next) => {
  try {
    const rentals = await prisma.rental.findMany({
      where: { tenantId: req.tenantId, userId: req.user.userId },
      orderBy: { createdAt: "desc" },
      include: { locker: true },
    });

    res.status(200).json({ message: "Rentals retrieved", count: rentals.length, rentals });
  } catch (e) {
    next(e);
  }
});

router.post("/:id/complete", requireAuth, requireTenant, async (req, res, next) => {
  try {
    const rental = await prisma.rental.findFirst({
      where: { id: req.params.id, tenantId: req.tenantId },
    });

    if (!rental) return res.status(404).json({ error: "Rental not found" });
    if (rental.userId !== req.user.userId) return res.status(403).json({ error: "Not authorized" });
    if (rental.status !== "active") return res.status(400).json({ error: "Rental is not active" });

    const updated = await prisma.$transaction(async (tx) => {
      const r = await tx.rental.update({
        where: { id: rental.id },
        data: { status: "completed", endTime: new Date() },
      });

      await tx.locker.update({
        where: { id: rental.lockerId },
        data: { status: "available" },
      });

      return r;
    });

    res.status(200).json({ message: "Rental completed successfully", rental: updated });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
