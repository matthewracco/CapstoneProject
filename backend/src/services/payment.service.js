const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");

const PRICES = {
  SMALL: 5,
  MEDIUM: 8,
  LARGE: 12,
};

async function processPayment({ tenantId, userId, rentalId, method }) {
  const rental = await prisma.rental.findFirst({
    where: { id: rentalId, tenantId },
    include: { locker: true },
  });

  if (!rental) {
    throw new AppError("Rental not found", 404, "RENTAL_NOT_FOUND");
  }

  if (rental.userId !== userId) {
    throw new AppError("Not authorized", 403, "FORBIDDEN");
  }

  const amount = method === "subscription" ? 0 : (PRICES[rental.locker.type] || PRICES.MEDIUM);

  // Simulate payment processing delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  let status;
  if (method === "mock_card_fail") {
    status = "FAILED";
  } else if (method === "subscription") {
    status = "SUCCESS";
  } else {
    status = Math.random() > 0.1 ? "SUCCESS" : "FAILED";
  }

  const payment = await prisma.payment.create({
    data: {
      tenantId,
      userId,
      rentalId,
      amount,
      method,
      status,
    },
  });

  if (status === "SUCCESS") {
    await prisma.rental.update({
      where: { id: rentalId },
      data: {
        paymentStatus: "COMPLETED",
        totalCost: amount,
      },
    });
  }

  return payment;
}

async function getPaymentsByRental({ tenantId, rentalId }) {
  const rental = await prisma.rental.findFirst({
    where: { id: rentalId, tenantId },
  });

  if (!rental) {
    throw new AppError("Rental not found", 404, "RENTAL_NOT_FOUND");
  }

  return prisma.payment.findMany({
    where: { tenantId, rentalId },
    orderBy: { createdAt: "desc" },
  });
}

module.exports = {
  PRICES,
  processPayment,
  getPaymentsByRental,
};
