const express = require("express");
const { requireAuth, requireTenant } = require("../middleware/clerkTenant");
const notificationService = require("../services/notification.service");

const router = express.Router();

router.get("/", requireAuth, requireTenant, async (req, res, next) => {
  try {
    const notifications = await notificationService.getUserNotifications({
      tenantId: req.tenantId,
      userId: req.user.userId,
    });
    res.status(200).json({
      message: "Notifications retrieved",
      count: notifications.length,
      notifications,
    });
  } catch (e) {
    next(e);
  }
});

router.get("/unread-count", requireAuth, requireTenant, async (req, res, next) => {
  try {
    const count = await notificationService.getUnreadCount({
      tenantId: req.tenantId,
      userId: req.user.userId,
    });
    res.status(200).json({ unreadCount: count });
  } catch (e) {
    next(e);
  }
});

router.patch("/:id/read", requireAuth, requireTenant, async (req, res, next) => {
  try {
    await notificationService.markAsRead({
      tenantId: req.tenantId,
      userId: req.user.userId,
      notificationId: req.params.id,
    });
    res.status(200).json({ message: "Notification marked as read" });
  } catch (e) {
    next(e);
  }
});

router.patch("/read-all", requireAuth, requireTenant, async (req, res, next) => {
  try {
    const result = await notificationService.markAllRead({
      tenantId: req.tenantId,
      userId: req.user.userId,
    });
    res.status(200).json({ message: "All notifications marked as read", ...result });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
