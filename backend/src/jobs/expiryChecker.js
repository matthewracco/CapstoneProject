const cron = require("node-cron");
const prisma = require("../config/prisma");
const notificationService = require("../services/notification.service");

/**
 * Every 5 minutes: warn users whose ACTIVE rentals end within the next hour.
 * Skips rentals that already received a warning in the last hour.
 */
function scheduleExpiryWarnings() {
  cron.schedule("*/5 * * * *", async () => {
    try {
      const now = new Date();
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

      const rentals = await prisma.rental.findMany({
        where: {
          status: "ACTIVE",
          endTime: {
            not: null,
            gt: now,
            lte: oneHourFromNow,
          },
        },
        include: { locker: true },
      });

      for (const rental of rentals) {
        // Check for duplicate warning in the last hour
        const existing = await prisma.notification.findFirst({
          where: {
            tenantId: rental.tenantId,
            userId: rental.userId,
            type: "EXPIRY_WARNING",
            body: { contains: rental.id },
            createdAt: { gte: oneHourAgo },
          },
        });

        if (existing) continue;

        await notificationService.create({
          tenantId: rental.tenantId,
          userId: rental.userId,
          type: "EXPIRY_WARNING",
          title: "Rental expiring soon",
          body: `Your rental ${rental.rentalCode} for locker ${rental.locker.lockerNumber} expires within the next hour. Extend or complete your rental to avoid automatic closure.`,
        });
      }
    } catch (err) {
      console.error("[ExpiryChecker] Warning job error:", err);
    }
  });
}

/**
 * Every 1 minute: force-complete ACTIVE rentals whose endTime has passed.
 * Sets rental status to COMPLETED and locker status to AVAILABLE,
 * then notifies the user.
 */
function scheduleForceExpiry() {
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      const expiredRentals = await prisma.rental.findMany({
        where: {
          status: "ACTIVE",
          endTime: {
            not: null,
            lt: now,
          },
        },
        include: { locker: true },
      });

      for (const rental of expiredRentals) {
        await prisma.$transaction(async (tx) => {
          await tx.rental.update({
            where: { id: rental.id },
            data: { status: "COMPLETED" },
          });

          await tx.locker.updateMany({
            where: { id: rental.lockerId, tenantId: rental.tenantId },
            data: { status: "AVAILABLE" },
          });
        });

        await notificationService.create({
          tenantId: rental.tenantId,
          userId: rental.userId,
          type: "RENTAL_EXPIRED",
          title: "Rental expired",
          body: `Your rental ${rental.rentalCode} for locker ${rental.locker.lockerNumber} has expired and been automatically completed.`,
        });
      }
    } catch (err) {
      console.error("[ExpiryChecker] Force-expiry job error:", err);
    }
  });
}

function startExpiryChecker() {
  scheduleExpiryWarnings();
  scheduleForceExpiry();
  console.log("[ExpiryChecker] Cron jobs started");
}

module.exports = { startExpiryChecker };
