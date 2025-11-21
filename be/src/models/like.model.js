// src/models/like.model.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Like = sequelize.define(
  "Like",
  {
    // --- THAM SỐ 1: ĐỊNH NGHĨA CÁC CỘT ---
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // ✅ CHUYỂN CẤU HÌNH created_at VÀO ĐÂY (Đúng vị trí)
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    // --- THAM SỐ 2: CÁC TÙY CHỌN (OPTIONS) ---
    tableName: "likes",
    timestamps: true,
    createdAt: "created_at", // ✅ Báo cho Sequelize biết cột timestamp tên là 'created_at'
    updatedAt: false,
  }
);

module.exports = Like;
