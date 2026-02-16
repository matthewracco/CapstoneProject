const prisma = require("../config/prisma");

async function getAllLockers(filters = {}) {
  return prisma.locker.findMany({
    where: filters,
    orderBy: { createdAt: "desc" }
  });
}

async function getLockerById(id, tenantId) {
  return prisma.locker.findFirst({
    where: { id, tenantId }
  });
}

async function createLocker(data) {
  return prisma.locker.create({ data });
}

module.exports = {
  getAllLockers,
  getLockerById,
  createLocker
};
