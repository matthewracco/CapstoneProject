const { z } = require("zod");

const RentalStatus = z.enum(["ACTIVE", "COMPLETED", "CANCELLED"]);

const createRentalSchema = z.object({
  lockerId: z.string().min(1),
}).strict();

const rentalQuerySchema = z.object({
  status: RentalStatus.optional(),
});

module.exports = {
  createRentalSchema,
  rentalQuerySchema,
};
