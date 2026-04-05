const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");

const VALID_ROLES = ["CUSTOMER", "STAFF", "OWNER"];

async function getUsers({ tenantId }) {
  return prisma.user.findMany({
    where: { tenantId },
    select: {
      id: true,
      tenantId: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

async function getUserById({ tenantId, userId }) {
  const user = await prisma.user.findFirst({
    where: { id: userId, tenantId },
    select: {
      id: true,
      tenantId: true,
      email: true,
      name: true,
      role: true,
      failedLogins: true,
      lockedUntil: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  return user;
}

async function updateRole({ tenantId, userId, role }) {
  if (!VALID_ROLES.includes(role)) {
    throw new AppError(
      `Invalid role. Must be one of: ${VALID_ROLES.join(", ")}`,
      400,
      "INVALID_ROLE"
    );
  }

  const user = await prisma.user.findFirst({
    where: { id: userId, tenantId },
  });

  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  return prisma.user.update({
    where: { id: userId },
    data: { role },
    select: {
      id: true,
      tenantId: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

async function deleteUser({ tenantId, userId }) {
  const user = await prisma.user.findFirst({
    where: { id: userId, tenantId },
  });

  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  return { success: true };
}

module.exports = {
  getUsers,
  getUserById,
  updateRole,
  deleteUser,
};
