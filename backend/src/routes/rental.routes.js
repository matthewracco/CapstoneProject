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