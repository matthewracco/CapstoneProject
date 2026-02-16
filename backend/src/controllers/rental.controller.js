const rentalService = require("../services/rental.service");

async function createRental(req, res, next) {
  try {
    const { lockerId } = req.body;
    if (!lockerId) return res.status(400).json({ error: "lockerId is required" });

    const rental = await rentalService.createRental({
      tenantId: req.tenantId,
      userId: req.user.userId,
      lockerId,
    });

    res.status(201).json({ message: "Rental created successfully", rental });
  } catch (err) {
    next(err);
  }
}

async function getRentals(req, res, next) {
  try {
    const rentals = await rentalService.getUserRentals({
      tenantId: req.tenantId,
      userId: req.user.userId,
    });

    res.status(200).json({ message: "Rentals retrieved", count: rentals.length, rentals });
  } catch (err) {
    next(err);
  }
}

async function completeRental(req, res, next) {
  try {
    const updated = await rentalService.completeRental({
      tenantId: req.tenantId,
      userId: req.user.userId,
      rentalId: req.params.id,
    });

    res.status(200).json({ message: "Rental completed successfully", rental: updated });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createRental,
  getRentals,
  completeRental,
};
