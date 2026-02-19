// const express = require('express');
// const prisma = require("../config/prisma")
// const { requireAuth, requireTenant } = require("../middleware/clerkTenant");

// const router = express.Router();

// router.get("/", requireAuth, requireTenant, async (req, res, next) => {
//   try {
//     const { status, location, type } = req.query;

//     const lockers = await prisma.locker.findMany({
//       where: {
//         tenantId: req.tenantId,
//         ...(status ? { status } : {}),
//         ...(location ? { location } : {}),
//         ...(type ? { type } : {}),
//       },
//       orderBy: { createdAt: "desc" },
//     });

//     res.status(200).json({ message: "Lockers retrieved", count: lockers.length, lockers });
//   } catch (e) {
//     next(e);
//   }
// });

// router.get("/:id", requireAuth, requireTenant, async (req, res, next) => {
//   try {
//     const locker = await prisma.locker.findFirst({
//       where: { id: req.params.id, tenantId: req.tenantId },
//     });

//     if (!locker) return res.status(404).json({ error: "Locker not found" });

//     res.status(200).json({ locker });
//   } catch (e) {
//     next(e);
//   }
// });

// module.exports = router;

const express = require("express");
const { requireAuth, requireTenant } = require("../middleware/clerkTenant");
const validate = require("../middleware/validate");
const lockerController = require("../controllers/locker.controller");
const {
  createLockerSchema,
  updateLockerSchema,
  lockerQuerySchema,
} = require("../validators/locker.validator");

const router = express.Router();

router.get("/", requireAuth, requireTenant, validate(lockerQuerySchema, "query"), lockerController.getLockers);
router.get("/:id", requireAuth, requireTenant, lockerController.getLocker);
router.post("/", requireAuth, requireTenant, validate(createLockerSchema), lockerController.createLocker);
router.patch("/:id", requireAuth, requireTenant, validate(updateLockerSchema), lockerController.updateLocker);

module.exports = router;
