-- CreateEnum
CREATE TYPE "LockerStatus" AS ENUM ('AVAILABLE', 'OCCUPIED', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "LockerType" AS ENUM ('SMALL', 'MEDIUM', 'LARGE');

-- CreateEnum
CREATE TYPE "LockerTier" AS ENUM ('STANDARD', 'PREMIUM');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "RentalStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Locker" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "lockerNumber" TEXT NOT NULL,
    "status" "LockerStatus" NOT NULL DEFAULT 'AVAILABLE',
    "qrCode" TEXT,
    "accessCode" TEXT,
    "type" "LockerType" NOT NULL DEFAULT 'MEDIUM',
    "tier" "LockerTier" NOT NULL DEFAULT 'STANDARD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Locker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rental" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lockerId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "status" "RentalStatus" NOT NULL DEFAULT 'ACTIVE',
    "rentalCode" TEXT NOT NULL,
    "totalCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rental_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Locker_tenantId_status_idx" ON "Locker"("tenantId", "status");

-- CreateIndex
CREATE INDEX "Locker_tenantId_location_idx" ON "Locker"("tenantId", "location");

-- CreateIndex
CREATE UNIQUE INDEX "Locker_tenantId_lockerNumber_key" ON "Locker"("tenantId", "lockerNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Locker_tenantId_qrCode_key" ON "Locker"("tenantId", "qrCode");

-- CreateIndex
CREATE UNIQUE INDEX "Rental_rentalCode_key" ON "Rental"("rentalCode");

-- CreateIndex
CREATE INDEX "Rental_tenantId_userId_idx" ON "Rental"("tenantId", "userId");

-- CreateIndex
CREATE INDEX "Rental_tenantId_status_idx" ON "Rental"("tenantId", "status");

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_lockerId_fkey" FOREIGN KEY ("lockerId") REFERENCES "Locker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
