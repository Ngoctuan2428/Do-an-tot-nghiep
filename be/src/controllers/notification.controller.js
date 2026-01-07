const notificationService = require("../services/notification.service");

const getNotifications = async (req, res) => {
  const { count, rows } = await notificationService.getUserNotifications(
    req.user.id,
    req.query
  );

  res.json({
    status: "success",
    data: {
      notifications: rows,
      total: count,
      page: req.query.page || 1,
    },
  });
};

const markRead = async (req, res) => {
  await notificationService.markAsRead(req.params.id, req.user.id);
  res.json({ status: "success", message: "Đã đánh dấu đã xem" });
};

const markAllRead = async (req, res) => {
  await notificationService.markAllAsRead(req.user.id);
  res.json({ status: "success", message: "Đã đánh dấu tất cả đã xem" });
};

module.exports = { getNotifications, markRead, markAllRead };
