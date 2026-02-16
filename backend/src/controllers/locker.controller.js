const lockerService = require("../services/locker.service");

async function getLockers(req, res, next) {
  try {
    const lockers = await lockerService.getAllLockers({
      tenantId: req.tenantId
    });
    res.status(200).json(lockers);
  } catch (err) {
    next(err);
  }
}
async function getLocker(req, res, next) {
  try {
    const locker = await lockerService.getLockerById(
      req.params.id,
      req.tenantId
    );

    if (!locker) {
      return res.status(404).json({ error: "Locker not found" });
    }

    res.status(200).json(locker);
  } catch (err) {
    next(err);
  }
}

async function createLocker(req, res, next) {
  try {
    const locker = await lockerService.createLocker({
      ...req.body,
      tenantId: req.tenantId
    });
    res.status(201).json(locker);
  } catch (err) {
    next(err);
  }
}


module.exports = {
  getLockers,
  getLocker,
  createLocker
};
