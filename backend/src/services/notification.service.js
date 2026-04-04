const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");

async function create({ tenantId, userId, type, title, body }) {
  if (!type || !title || !body) {
    throw new AppError(
      "type, title, and body are required",
      400,
      "VALIDATION_ERROR"
    );
  }

  return prisma.notification.create({
    data: { tenantId, userId, type, title, body },
  });
}

async function getUserNotifications({ tenantId, userId }) {
  return prisma.notification.findMany({
    where: { tenantId, userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

async function getUnreadCount({ tenantId, userId }) {
  return prisma.notification.count({
    where: { tenantId, userId, read: false },
  });
}

async function markAsRead({ tenantId, userId, notificationId }) {
  const result = await prisma.notification.updateMany({
    where: { id: notificationId, tenantId, userId },
    data: { read: true },
  });

  if (result.count === 0) {
    throw new AppError(
      "Notification not found",
      404,
      "NOTIFICATION_NOT_FOUND"
    );
  }

  return { success: true };
}

async function markAllRead({ tenantId, userId }) {
  const result = await prisma.notification.updateMany({
    where: { tenantId, userId, read: false },
    data: { read: true },
  });

  return { updated: result.count };
}

module.exports = {
  create,
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllRead,
};
