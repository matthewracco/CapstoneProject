const express = require("express");
const { requireAuth, requireTenant } = require("../middleware/clerkTenant");
const prisma = require("../config/prisma");

const router = express.Router();

router.get("/", requireAuth, requireTenant, async (req, res, next) => {
  try {
    const tenantId = req.tenantId;

    const [
      totalLockers,
      availableLockers,
      occupiedLockers,
      maintenanceLockers,
      totalRentals,
      activeRentals,
      completedRentals,
      cancelledRentals,
      allRentals,
    ] = await Promise.all([
      prisma.locker.count({ where: { tenantId } }),
      prisma.locker.count({ where: { tenantId, status: "AVAILABLE" } }),
      prisma.locker.count({ where: { tenantId, status: "OCCUPIED" } }),
      prisma.locker.count({ where: { tenantId, status: "MAINTENANCE" } }),
      prisma.rental.count({ where: { tenantId } }),
      prisma.rental.count({ where: { tenantId, status: "ACTIVE" } }),
      prisma.rental.count({ where: { tenantId, status: "COMPLETED" } }),
      prisma.rental.count({ where: { tenantId, status: "CANCELLED" } }),
      prisma.rental.findMany({
        where: { tenantId },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { locker: true },
      }),
    ]);

    // Revenue from completed + active rentals
    const revenueResult = await prisma.rental.aggregate({
      where: { tenantId, paymentStatus: "COMPLETED" },
      _sum: { totalCost: true },
    });
    const totalRevenue = revenueResult._sum.totalCost || 0;

    // Locker utilization by type
    const lockersByType = await prisma.locker.groupBy({
      by: ["type"],
      where: { tenantId },
      _count: { id: true },
    });

    // Locker utilization by status
    const lockersByStatus = await prisma.locker.groupBy({
      by: ["status"],
      where: { tenantId },
      _count: { id: true },
    });

    res.status(200).json({
      overview: {
        totalLockers,
        availableLockers,
        occupiedLockers,
        maintenanceLockers,
        totalRentals,
        activeRentals,
        completedRentals,
        cancelledRentals,
        totalRevenue,
        utilizationRate:
          totalLockers > 0
            ? Math.round((occupiedLockers / totalLockers) * 100)
            : 0,
      },
      lockersByType: lockersByType.map((g) => ({
        type: g.type,
        count: g._count.id,
      })),
      lockersByStatus: lockersByStatus.map((g) => ({
        status: g.status,
        count: g._count.id,
      })),
      recentRentals: allRentals,
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
