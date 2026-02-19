const { z } = require("zod");

const LockerStatus = z.enum(["AVAILABLE", "OCCUPIED", "MAINTENANCE"]);
const LockerType = z.enum(["SMALL", "MEDIUM", "LARGE"]);
const LockerTier = z.enum(["STANDARD", "PREMIUM"]);

const createLockerSchema = z.object({
  location: z.string().min(1),
  lockerNumber: z.string().min(1),
  status: LockerStatus.optional(),
  qrCode: z.string().min(1).optional(),
  accessCode: z.string().min(1).optional(),
  type: LockerType.optional(),
  tier: LockerTier.optional(),
}).strict();

const updateLockerSchema = z.object({
  location: z.string().min(1).optional(),
  lockerNumber: z.string().min(1).optional(),
  status: LockerStatus.optional(),
  qrCode: z.string().min(1).optional().nullable(),
  accessCode: z.string().min(1).optional().nullable(),
  type: LockerType.optional(),
  tier: LockerTier.optional(),
}).strict();

const lockerQuerySchema = z.object({
  status: LockerStatus.optional(),
  location: z.string().optional(),
  type: LockerType.optional(),
  tier: LockerTier.optional(),
});

module.exports = {
  createLockerSchema,
  updateLockerSchema,
  lockerQuerySchema,
};
