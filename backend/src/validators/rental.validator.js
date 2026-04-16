const { z } = require("zod");

const RentalStatus = z.enum(["ACTIVE", "COMPLETED", "CANCELLED"]);

const createRentalSchema = z.object({
  lockerId: z.string().min(1),
  durationHours: z.number().int().min(1).max(48).optional(),
});

const rentalQuerySchema = z.object({
  status: RentalStatus.optional(),
});

module.exports = {
  createRentalSchema,
  rentalQuerySchema,
};
