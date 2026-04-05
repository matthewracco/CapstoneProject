const express = require("express");
const validate = require("../middleware/validate");
const { createRentalSchema, rentalQuerySchema } = require("../validators/rental.validator");
const rentalService = require("../services/rental.service");

const router = express.Router();
router.post("/", validate(createRentalSchema), async (req, res, next) => {
  try {
    const rental = await rentalService.createRental({
      tenantId: req.tenantId,
      userId: req.user.userId, 
      lockerId: req.body.lockerId,
    });

    res.status(201).json({ success: true, data: rental });
  } catch (e) {
    next(e);
  }
});
router.get("/", validate(rentalQuerySchema, "query"), async (req, res, next) => {
  try {
    const rentals = await rentalService.getUserRentals({
      tenantId: req.tenantId,
      userId: req.user.userId,
      status: req.query.status,
    });

    res.status(200).json({ success: true, data: rentals, meta: { count: rentals.length } });
  } catch (e) {
    next(e);
  }
});

router.post("/seed-demo", async (req, res, next) => {
  try {
    const now = new Date();

    const demo = await Rental.create([
      {
        rentalCode: "R-1001",
        status: "ACTIVE",
        paymentStatus: "PAID",
        totalCost: 25,
        startTime: now,
        userId: req.user?.id,
      },
      {
        rentalCode: "R-1002",
        status: "ENDED",
        paymentStatus: "PAID",
        totalCost: 40,
        startTime: new Date(now.getTime() - 60 * 60 * 1000),
        endTime: now,
        userId: req.user?.id,
      },
    ]);

    res.json({ ok: true, data: demo });
  } catch (e) {
    next(e);
  }
});

router.post("/:id/complete", async (req, res, next) => {
  try {
    const rental = await rentalService.completeRental({
      tenantId: req.tenantId,
      userId: req.user.userId,
      rentalId: req.params.id,
    });

    res.status(200).json({ success: true, data: rental });
  } catch (e) {
    next(e);
  }
});

module.exports = router;