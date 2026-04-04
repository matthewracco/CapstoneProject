const bcrypt = require("bcryptjs");
const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");

async function generateAccessCode({ tenantId, userId, rentalId }) {
  const rental = await prisma.rental.findFirst({
    where: { id: rentalId, tenantId },
  });

  if (!rental) {
    throw new AppError("Rental not found", 404, "RENTAL_NOT_FOUND");
  }

  if (rental.userId !== userId) {
    throw new AppError("Not authorized", 403, "FORBIDDEN");
  }

  if (rental.status !== "ACTIVE") {
    throw new AppError("Rental is not active", 400, "RENTAL_NOT_ACTIVE");
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const hashed = await bcrypt.hash(code, 10);

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await prisma.locker.updateMany({
    where: { id: rental.lockerId, tenantId },
    data: {
      accessCode: hashed,
      accessCodeExpiry: expiresAt,
    },
  });

  return { code, expiresAt: expiresAt.toISOString() };
}

module.exports = {
  generateAccessCode,
};
