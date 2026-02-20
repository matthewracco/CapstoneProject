const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const tenantId = "tenant_demo_1";

  console.log("Seeding user...");

  const user = await prisma.user.create({
    data: {
      clerkUserId: "clerk_demo_user_1",
      role: "OWNER",
    },
  });

  console.log("User created:", user.id);

  console.log("Seeding lockers...");

  await prisma.locker.createMany({
    data: [
      { tenantId, location: "Toronto", lockerNumber: "A-101", status: "AVAILABLE", type: "SMALL", tier: "STANDARD" },
      { tenantId, location: "Toronto", lockerNumber: "A-102", status: "AVAILABLE", type: "MEDIUM", tier: "PREMIUM" },
      { tenantId, location: "North York", lockerNumber: "B-201", status: "MAINTENANCE", type: "LARGE", tier: "STANDARD" },
    ],
  });

  const locker = await prisma.locker.findFirst({
    where: { tenantId, lockerNumber: "A-101" },
  });

  console.log("Seeding rental...");

  await prisma.rental.create({
    data: {
      tenantId,
      userId: user.id,   
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

  console.log(" Seed complete.");
}

main()
  .catch((e) => {
    console.error(" Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });