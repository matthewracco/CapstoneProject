const express = require("express");
const { requireAuth, requireTenant } = require("../middleware/clerkTenant");
const rentalController = require("../controllers/rental.controller");

const router = express.Router();

router.post("/", requireAuth, requireTenant, rentalController.createRental);
router.get("/", requireAuth, requireTenant, rentalController.getRentals);
router.post("/:id/complete", requireAuth, requireTenant, rentalController.completeRental);

module.exports = router;
