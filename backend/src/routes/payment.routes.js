const express = require("express");
const { requireAuth, requireTenant } = require("../middleware/clerkTenant");
const paymentService = require("../services/payment.service");

const router = express.Router();

router.post("/", requireAuth, requireTenant, async (req, res, next) => {
  try {
    const payment = await paymentService.processPayment({
      tenantId: req.tenantId,
      userId: req.user.userId,
      rentalId: req.body.rentalId,
      method: req.body.method,
    });
    res.status(201).json({ message: "Payment processed", payment });
  } catch (e) {
    next(e);
  }
});

router.get("/:rentalId", requireAuth, requireTenant, async (req, res, next) => {
  try {
    const payments = await paymentService.getPaymentsByRental({
      tenantId: req.tenantId,
      rentalId: req.params.rentalId,
    });
    res.status(200).json({ message: "Payments retrieved", count: payments.length, payments });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
