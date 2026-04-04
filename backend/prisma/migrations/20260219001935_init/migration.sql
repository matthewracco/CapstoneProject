-- CreateTable
CREATE TABLE "Locker" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "lockerNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "qrCode" TEXT,
    "accessCode" TEXT,
    "type" TEXT NOT NULL DEFAULT 'MEDIUM',
    "tier" TEXT NOT NULL DEFAULT 'STANDARD',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Rental" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lockerId" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "rentalCode" TEXT NOT NULL,
    "totalCost" REAL NOT NULL DEFAULT 0,
    "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Rental_lockerId_fkey" FOREIGN KEY ("lockerId") REFERENCES "Locker" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Locker_tenantId_status_idx" ON "Locker"("tenantId", "status");

-- CreateIndex
CREATE INDEX "Locker_tenantId_location_idx" ON "Locker"("tenantId", "location");

-- CreateIndex
CREATE UNIQUE INDEX "Locker_tenantId_lockerNumber_key" ON "Locker"("tenantId", "lockerNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Rental_rentalCode_key" ON "Rental"("rentalCode");

-- CreateIndex
CREATE INDEX "Rental_tenantId_userId_idx" ON "Rental"("tenantId", "userId");

-- CreateIndex
CREATE INDEX "Rental_tenantId_status_idx" ON "Rental"("tenantId", "status");
