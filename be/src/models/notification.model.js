const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Notification = sequelize.define(
  "Notification",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    recipient_id: {
      // Người nhận thông báo
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sender_id: {
      // Người tạo ra hành động (VD: người like)
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("like", "comment", "reply", "follow", "cooksnap"),
      allowNull: false,
    },
    reference_id: {
      // ID của đối tượng liên quan (VD: ID bài viết, ID comment)
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    message: {
      // Nội dung ngắn gọn (tùy chọn)
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "notifications",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Notification;
