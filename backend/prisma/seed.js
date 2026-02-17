
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const tenantId = "tenant_demo_1";
  const userId = "user_demo_1";

  // Create lockers
  const lockers = await prisma.locker.createMany({
    data: [
      {
        tenantId,
        location: "Toronto",
        lockerNumber: "A-101",
        status: "AVAILABLE",
        type: "SMALL",
        tier: "STANDARD",
      },
      {
        tenantId,
        location: "Toronto",
        lockerNumber: "A-102",
        status: "AVAILABLE",
        type: "MEDIUM",
        tier: "PREMIUM",
      },
      {
        tenantId,
        location: "North York",
        lockerNumber: "B-201",
        status: "MAINTENANCE",
        type: "LARGE",
        tier: "STANDARD",
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seeded lockers:", lockers);

  const locker = await prisma.locker.findFirst({ where: { tenantId, lockerNumber: "A-101" } });

  if (locker) {
    await prisma.rental.create({
      data: {
        tenantId,
        userId,
        lockerId: locker.id,
        status: "ACTIVE",
        rentalCode: `RENTAL-${Date.now()}`,
        paymentStatus: "PENDING",
        totalCost: 0,
      },
    });

    await prisma.locker.update({
      where: { id: locker.id },
      data: { status: "OCCUPIED" },
    });

    console.log("Seeded one rental.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
