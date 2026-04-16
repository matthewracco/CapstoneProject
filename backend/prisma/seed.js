const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const QRCode = require("qrcode");
const prisma = new PrismaClient();

const TENANT = "tenant_demo_1";
const USER_ID = "user_demo_1"; // will be replaced with real user id

const locations = ["Floor 1 - East Wing", "Floor 1 - West Wing", "Floor 2 - Main Hall", "Floor 2 - South Wing", "Floor 3 - North Wing"];
const types = ["SMALL", "MEDIUM", "LARGE"];
const tiers = ["STANDARD", "PREMIUM"];
const statuses = ["AVAILABLE", "AVAILABLE", "AVAILABLE", "OCCUPIED", "MAINTENANCE"];

async function main() {
  // Clear existing data in order (respect foreign keys)
  await prisma.payment.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.rental.deleteMany({});
  await prisma.locker.deleteMany({});
  await prisma.user.deleteMany({});

  // --- Seed Users ---
  const passwordHash = await bcrypt.hash("password123", 12);

  const owner = await prisma.user.create({
    data: {
      tenantId: TENANT,
      email: "owner@smartlocker.com",
      passwordHash,
      name: "Demo Owner",
      role: "OWNER",
    },
  });

  const staff = await prisma.user.create({
    data: {
      tenantId: TENANT,
      email: "staff@smartlocker.com",
      passwordHash,
      name: "Demo Staff",
      role: "STAFF",
    },
  });

  const customer = await prisma.user.create({
    data: {
      tenantId: TENANT,
      email: "customer@smartlocker.com",
      passwordHash,
      name: "Demo Customer",
      role: "CUSTOMER",
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      tenantId: TENANT,
      email: "john@smartlocker.com",
      passwordHash,
      name: "John Smith",
      role: "CUSTOMER",
    },
  });

  const schoolCustomer = await prisma.user.create({
    data: {
      tenantId: TENANT,
      email: "customer@school.com",
      passwordHash,
      name: "School Student",
      role: "CUSTOMER",
    },
  });

  console.log("Seeded 5 users (password: password123 for all)");
  console.log(`  Owner:    owner@smartlocker.com`);
  console.log(`  Staff:    staff@smartlocker.com`);
  console.log(`  Customer: customer@smartlocker.com`);
  console.log(`  Customer: john@smartlocker.com`);
  console.log(`  Customer: customer@school.com  (subscription — no timer)`);

  // --- Seed Lockers with real QR codes ---
  const lockers = [];
  for (let i = 1; i <= 24; i++) {
    const num = String(i).padStart(3, "0");
    const prefix = ["A", "B", "C", "D", "E"][Math.floor((i - 1) / 5)];
    const lockerNumber = `${prefix}-${num}`;
    const lockerId = `locker_${TENANT}_${i}`;

    // Generate real QR code
    const qrData = JSON.stringify({ lockerId, tenantId: TENANT, lockerNumber });
    const qrCode = await QRCode.toDataURL(qrData, { width: 300, margin: 2 });

    const locker = await prisma.locker.create({
      data: {
        tenantId: TENANT,
        lockerNumber,
        location: locations[Math.floor((i - 1) / 5)] || locations[4],
        type: types[i % 3],
        tier: i % 5 === 0 ? "PREMIUM" : "STANDARD",
        status: i <= 18 ? statuses[i % statuses.length] : "AVAILABLE",
        qrCode,
      },
    });
    lockers.push(locker);
  }

  console.log(`Seeded ${lockers.length} lockers with QR codes`);

  // --- Assign one locker to Demo Customer for PRIVATE mode testing ---
  await prisma.locker.update({
    where: { id: lockers[0].id },
    data: { assignedTo: customer.id, status: "ASSIGNED" },
  });
  console.log(`Assigned locker ${lockers[0].lockerNumber} to Demo Customer (${customer.email})`);

  // --- Seed Rentals ---
  const occupiedLockers = lockers.filter((l) => l.status === "OCCUPIED");
  const availableLockers = lockers.filter((l) => l.status === "AVAILABLE");

  // Active rentals for occupied lockers
  const activeRentals = [];
  for (const locker of occupiedLockers) {
    const startTime = new Date(Date.now() - Math.floor(Math.random() * 3600000 * 6));
    const maxEndTime = new Date(startTime.getTime() + 48 * 60 * 60 * 1000);
    const endTime = new Date(startTime.getTime() + 4 * 60 * 60 * 1000); // 4hr rental
    const rental = await prisma.rental.create({
      data: {
        tenantId: TENANT,
        userId: customer.id,
        lockerId: locker.id,
        status: "ACTIVE",
        rentalCode: `RENT-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        totalCost: locker.type === "SMALL" ? 5 : locker.type === "MEDIUM" ? 8 : 12,
        paymentStatus: "COMPLETED",
        startTime,
        endTime,
        maxEndTime,
      },
    });
    activeRentals.push(rental);
  }

  // Completed rentals for history
  for (let i = 0; i < 8; i++) {
    const locker = availableLockers[i % availableLockers.length];
    const start = new Date(Date.now() - 86400000 * (i + 1) - 3600000 * 4);
    const end = new Date(start.getTime() + 3600000 * (2 + Math.floor(Math.random() * 8)));
    await prisma.rental.create({
      data: {
        tenantId: TENANT,
        userId: i % 2 === 0 ? customer.id : customer2.id,
        lockerId: locker.id,
        status: "COMPLETED",
        rentalCode: `RENT-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        totalCost: locker.type === "SMALL" ? 5 : locker.type === "MEDIUM" ? 8 : 12,
        paymentStatus: "COMPLETED",
        startTime: start,
        endTime: end,
      },
    });
  }

  // One cancelled rental
  await prisma.rental.create({
    data: {
      tenantId: TENANT,
      userId: customer.id,
      lockerId: availableLockers[0].id,
      status: "CANCELLED",
      rentalCode: `RENT-CANCEL-${Date.now()}`,
      totalCost: 0,
      paymentStatus: "FAILED",
      startTime: new Date(Date.now() - 86400000 * 3),
      endTime: new Date(Date.now() - 86400000 * 3 + 60000),
    },
  });

  // Subscription rental for school customer — dedicated locker, no expiry
  const schoolLocker = availableLockers[availableLockers.length - 1];
  await prisma.locker.update({
    where: { id: schoolLocker.id },
    data: { status: "OCCUPIED" },
  });
  await prisma.rental.create({
    data: {
      tenantId: TENANT,
      userId: schoolCustomer.id,
      lockerId: schoolLocker.id,
      status: "ACTIVE",
      rentalCode: `RENT-SCHOOL-${Date.now()}`,
      totalCost: 0,
      paymentStatus: "COMPLETED",
      startTime: new Date(Date.now() - 86400000 * 7), // started a week ago
      endTime: null,
      maxEndTime: null,
    },
  });

  // --- Seed Payments for active rentals ---
  for (const rental of activeRentals) {
    await prisma.payment.create({
      data: {
        tenantId: TENANT,
        rentalId: rental.id,
        userId: rental.userId,
        amount: rental.totalCost,
        method: "mock_card",
        status: "SUCCESS",
      },
    });
  }

  // --- Seed Notifications ---
  await prisma.notification.create({
    data: {
      tenantId: TENANT,
      userId: customer.id,
      type: "RENTAL_CONFIRMATION",
      title: "Locker Rented!",
      body: "You have successfully rented locker A-004. Enjoy!",
      read: false,
    },
  });

  await prisma.notification.create({
    data: {
      tenantId: TENANT,
      userId: customer.id,
      type: "EXPIRY_WARNING",
      title: "Rental Expiring Soon",
      body: "Your rental for locker B-009 expires in less than 1 hour.",
      read: false,
    },
  });

  await prisma.notification.create({
    data: {
      tenantId: TENANT,
      userId: customer.id,
      type: "RENTAL_CONFIRMATION",
      title: "Welcome to SmartLocker!",
      body: "Your account is set up and ready to go. Browse available lockers to get started.",
      read: true,
    },
  });

  const rentalCount = await prisma.rental.count();
  const paymentCount = await prisma.payment.count();
  const notifCount = await prisma.notification.count();
  console.log(`Seeded ${rentalCount} rentals, ${paymentCount} payments, ${notifCount} notifications`);
  console.log("Done!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
