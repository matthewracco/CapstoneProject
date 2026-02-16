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

const router = require("express").Router();
const { requireAuth, requireTenant } = require("../middleware/clerkTenant");
const controller = require("../controllers/locker.controller");

// GET /api/v1/lockers
router.get("/", requireAuth, requireTenant, controller.getLockers);

// GET /api/v1/lockers/:id
router.get("/:id", requireAuth, requireTenant, controller.getLocker);

// POST /api/v1/lockers
router.post("/", requireAuth, requireTenant, controller.createLocker);

module.exports = router;
