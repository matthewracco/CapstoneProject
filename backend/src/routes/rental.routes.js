const express = require("express");
const { requireAuth, requireTenant } = require("../middleware/clerkTenant");
const validate = require("../middleware/validate");
const { createRentalSchema, rentalQuerySchema } = require("../validators/rental.validator");
const rentalService = require("../services/rental.service");
const accessCodeService = require("../services/accessCode.service");
const { requireRole } = require("../middleware/rbac");

const router = express.Router();

router.post("/", requireAuth, requireTenant, validate(createRentalSchema), async (req, res, next) => {
  try {
    const rental = await rentalService.createRental({
      tenantId: req.tenantId,
      userId: req.user.userId,
      lockerId: req.body.lockerId,
    });
    res.status(201).json({ message: "Rental created successfully", rental });
  } catch (e) {
    next(e);
  }
});

router.get("/", requireAuth, requireTenant, validate(rentalQuerySchema, "query"), async (req, res, next) => {
  try {
    const isStaffOrOwner = ["STAFF", "OWNER"].includes(req.user.role);
    const rentals = await rentalService.getUserRentals({
      tenantId: req.tenantId,
      userId: isStaffOrOwner ? undefined : req.user.userId,
      ...(req.query.status ? { status: req.query.status } : {}),
    });
    res.status(200).json({ message: "Rentals retrieved", count: rentals.length, rentals });
  } catch (e) {
    next(e);
  }
});

router.post("/:id/complete", requireAuth, requireTenant, async (req, res, next) => {
  try {
    const rental = await rentalService.completeRental({
      tenantId: req.tenantId,
      userId: req.user.userId,
      rentalId: req.params.id,
    });
    res.status(200).json({ message: "Rental completed successfully", rental });
  } catch (e) {
    next(e);
  }
});

router.post("/:id/extend", requireAuth, requireTenant, async (req, res, next) => {
  try {
    const rental = await rentalService.extendRental({
      tenantId: req.tenantId,
      userId: req.user.userId,
      rentalId: req.params.id,
      hours: req.body.hours,
    });
    res.status(200).json({ message: "Rental extended successfully", rental });
  } catch (e) {
    next(e);
  }
});

router.post("/:id/force-complete", requireAuth, requireTenant, requireRole("STAFF", "OWNER"), async (req, res, next) => {
  try {
    const rental = await rentalService.forceCompleteRental({
      tenantId: req.tenantId,
      rentalId: req.params.id,
    });
    res.status(200).json({ message: "Rental force-completed", rental });
  } catch (e) {
    next(e);
  }
});

router.post("/:id/access-code", requireAuth, requireTenant, async (req, res, next) => {
  try {
    const { code, expiresAt } = await accessCodeService.generateAccessCode({
      tenantId: req.tenantId,
      userId: req.user.userId,
      rentalId: req.params.id,
    });
    res.status(200).json({ message: "Access code generated", code, expiresAt });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
