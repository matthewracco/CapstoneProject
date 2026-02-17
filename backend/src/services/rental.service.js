const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");

async function createRental({ tenantId, userId, lockerId }) {
  if (!lockerId) {
    throw new AppError("lockerId is required", 400, "VALIDATION_ERROR", { field: "lockerId" });
  }

  const locker = await prisma.locker.findFirst({
    where: { id: lockerId, tenantId },
  });

  if (!locker) {
    throw new AppError("Locker not found", 404, "LOCKER_NOT_FOUND");
  }

  if (locker.status !== "AVAILABLE") {
    throw new AppError("Locker is not available", 400, "LOCKER_NOT_AVAILABLE");
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.locker.updateMany({
      where: { id: lockerId, tenantId, status: "AVAILABLE" },
      data: { status: "OCCUPIED" },
    });

    if (updated.count === 0) {
      throw new AppError("Locker is not available", 400, "LOCKER_NOT_AVAILABLE");
    }

    return tx.rental.create({
      data: {
        tenantId,
        userId,
        lockerId,
        status: "ACTIVE",
        paymentStatus: "PENDING",
        rentalCode: `RENTAL-${Date.now()}`,
      },
    });
  });
}

async function getUserRentals({ tenantId, userId }) {
  return prisma.rental.findMany({
    where: { tenantId, userId },
    orderBy: { createdAt: "desc" },
    include: { locker: true },
  });
}

async function completeRental({ tenantId, userId, rentalId }) {
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

  return prisma.$transaction(async (tx) => {
    await tx.rental.update({
      where: { id: rental.id },
      data: { status: "COMPLETED", endTime: new Date() },
    });

    await tx.locker.updateMany({
      where: { id: rental.lockerId, tenantId },
      data: { status: "AVAILABLE" },
    });

    return tx.rental.findFirst({
      where: { id: rental.id, tenantId },
      include: { locker: true },
    });
  });
}

module.exports = {
  createRental,
  getUserRentals,
  completeRental,
};
