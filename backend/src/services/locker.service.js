const prisma = require("../config/prisma");

async function getAllLockers(filters = {}) {
  return prisma.locker.findMany({
    where: filters,
    orderBy: { createdAt: "desc" },
  });
}

async function getLockerById(id, tenantId) {
  return prisma.locker.findFirst({
    where: { id, tenantId },
  });
}

async function createLocker(data) {
  return prisma.locker.create({ data });
}

async function updateLocker(id, tenantId, data) {
  const result = await prisma.locker.updateMany({
    where: { id, tenantId },
    data,
  });

  if (result.count === 0) return null;

  return prisma.locker.findFirst({
    where: { id, tenantId },
  });
}

async function deleteLocker(id, tenantId) {
  const result = await prisma.locker.deleteMany({
    where: { id, tenantId },
  });
  return result.count > 0;
}

module.exports = {
  getAllLockers,
  getLockerById,
  createLocker,
  updateLocker,
  deleteLocker,
};
