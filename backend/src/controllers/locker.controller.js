const lockerService = require("../services/locker.service");
const AppError = require("../utils/AppError");
const { ok, created } = require("../utils/respond");
const settingsService = require("../services/settings.service");

async function getLockers(req, res, next) {
  try {
    const { status, location, type, tier } = req.query;

    const filters = {
      tenantId: req.tenantId,
      ...(status ? { status } : {}),
      ...(location ? { location } : {}),
      ...(type ? { type } : {}),
      ...(tier ? { tier } : {}),
    };

    // Customer visibility rules:
    //   PRIVATE mode → only lockers assigned to this customer
    //   PUBLIC mode  → unassigned lockers (time-limit pool) + this customer's assigned lockers
    if (req.user.role === "CUSTOMER") {
      const settings = await settingsService.getSettings({ tenantId: req.tenantId });
      if (settings.mode === "PRIVATE") {
        filters.assignedTo = req.user.userId;
      } else {
        filters.OR = [
          { assignedTo: null },
          { assignedTo: req.user.userId },
        ];
      }
    }

    const lockers = await lockerService.getAllLockers(filters);

    return ok(res, lockers, { count: lockers.length });
  } catch (err) {
    next(err);
  }
}

async function getLocker(req, res, next) {
  try {
    const locker = await lockerService.getLockerById(req.params.id, req.tenantId);
    if (!locker) throw new AppError("Locker not found", 404, "LOCKER_NOT_FOUND");

    return ok(res, locker);
  } catch (err) {
    next(err);
  }
}

async function createLocker(req, res, next) {
  try {
    const locker = await lockerService.createLocker({
      ...req.body,
      tenantId: req.tenantId,
    });

    return created(res, locker);
  } catch (err) {
    next(err);
  }
}

async function updateLocker(req, res, next) {
  try {
    const updated = await lockerService.updateLocker(req.params.id, req.tenantId, req.body);
    if (!updated) throw new AppError("Locker not found", 404, "LOCKER_NOT_FOUND");

    return ok(res, updated);
  } catch (err) {
    next(err);
  }
}

async function deleteLocker(req, res, next) {
  try {
    const deleted = await lockerService.deleteLocker(req.params.id, req.tenantId);
    if (!deleted) throw new AppError("Locker not found", 404, "LOCKER_NOT_FOUND");

    return ok(res, { deleted: true });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getLockers,
  getLocker,
  createLocker,
  updateLocker,
  deleteLocker,
};
