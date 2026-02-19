const lockerService = require("../services/locker.service");
const AppError = require("../utils/AppError");
const { ok, created } = require("../utils/respond");

async function getLockers(req, res, next) {
  try {
    const { status, location, type, tier } = req.query;

    const lockers = await lockerService.getAllLockers({
      tenantId: req.tenantId,
      ...(status ? { status } : {}),
      ...(location ? { location } : {}),
      ...(type ? { type } : {}),
      ...(tier ? { tier } : {}),
    });

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
