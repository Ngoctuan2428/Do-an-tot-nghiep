const { Notification, User } = require("../models");

// 1. Tạo thông báo mới
const createNotification = async ({
  recipient_id,
  sender_id,
  type,
  reference_id,
  message,
}) => {
  // Không tự thông báo cho chính mình
  if (parseInt(recipient_id) === parseInt(sender_id)) {
    console.log(`[Notification] Skipped self-notification: ${type}`);
    return null;
  }

  try {
    const notification = await Notification.create({
      recipient_id,
      sender_id,
      type,
      reference_id,
      message,
    });
    console.log(
      `[Notification] Created: type=${type}, from=${sender_id} to=${recipient_id}`
    );
    return notification;
  } catch (error) {
    console.error(
      `[Notification] Error creating notification: ${error.message}`
    );
    throw error;
  }
};

// 2. Lấy danh sách thông báo của User
const getUserNotifications = async (userId, queryOptions) => {
  const { page = 1, limit = 20, type } = queryOptions; // Lấy thêm tham số type
  const offset = (page - 1) * limit;

  // Xây dựng điều kiện lọc
  const whereCondition = { recipient_id: userId };

  if (type) {
    whereCondition.type = type;
  }

  return await Notification.findAndCountAll({
    where: whereCondition,
    include: [
      {
        model: User,
        as: "Sender",
        attributes: ["id", "username", "avatar_url"],
      },
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [["created_at", "DESC"]],
  });
};

// 3. Đánh dấu đã đọc
const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOne({
    where: { id: notificationId, recipient_id: userId },
  });

  if (notification) {
    notification.is_read = true;
    await notification.save();
  }
  return notification;
};

// 4. Đánh dấu tất cả là đã đọc
const markAllAsRead = async (userId) => {
  await Notification.update(
    { is_read: true },
    { where: { recipient_id: userId, is_read: false } }
  );
};

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
};
