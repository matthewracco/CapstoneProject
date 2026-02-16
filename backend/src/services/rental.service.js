const prisma = require('../config/prisma')



async function createRental({tenantId, userId, lockerId}) {
    const locker = await prisma.locker.findFirst({
        where: { id: lockerId, tenantId}
    })

    if(!lockerId) {
        const err = new Error('lcoker not found')
        err.status = 400
        throw err
    }

    return prisma.$transaction(async (tx) => {
        await tx.locker.update({
            where: {id: lockerId},
            data: { status: 'occupied'}
        })

        return tx.rental.create({
            data: {
                tenantId,
                userId,
                lockerId,
                rentalCode: `RENTAL-${Date.now()}`
            }
        })
    })
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
    const err = new Error("Rental not found");
    err.status = 404;
    throw err;
  }

  if (rental.userId !== userId) {
    const err = new Error("Not authorized");
    err.status = 403;
    throw err;
  }

  if (rental.status !== "active") {
    const err = new Error("Rental is not active");
    err.status = 400;
    throw err;
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.rental.update({
      where: { id: rental.id },
      data: { status: "completed", endTime: new Date() },
    });

    await tx.locker.update({
      where: { id: rental.lockerId },
      data: { status: "available" },
    });

    return updated;
  });
}

module.exports = {
  createRental,
  getUserRentals,
  completeRental,
};