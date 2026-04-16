const rentalService = require("../services/rental.service");
const AppError = require("../utils/AppError");
const { ok, created } = require("../utils/respond");

async function createRental(req, res, next) {
  try {
    const { lockerId, durationHours } = req.body;
    if (!lockerId) throw new AppError("lockerId is required", 400, "VALIDATION_ERROR", { field: "lockerId" });

    const rental = await rentalService.createRental({
      tenantId: req.tenantId,
      userId: req.user.userId,
      lockerId,
      durationHours: durationHours ? Number(durationHours) : 4,
    });

    return created(res, rental);
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

    return ok(res, rentals, { count: rentals.length });
  } catch (err) {
    next(err);
  }
}

async function completeRental(req, res, next) {
  try {
    const rental = await rentalService.completeRental({
      tenantId: req.tenantId,
      userId: req.user.userId,
      rentalId: req.params.id,
    });

    return ok(res, rental);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createRental,
  getRentals,
  completeRental,
};
