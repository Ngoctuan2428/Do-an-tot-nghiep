// src/models/cooked.model.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Cooked = sequelize.define(
  "Cooked",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    image_url: {
      type: DataTypes.STRING(512),
      allowNull: true,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // ✅ THÊM ĐỊNH NGHĨA CỘT created_at VÀO ĐÂY
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"), // Giá trị mặc định là thời gian hiện tại
    },
  },
  {
    tableName: "cooked",
    timestamps: true,
    createdAt: "created_at", // Ánh xạ timestamps của Sequelize sang cột này
    updatedAt: false,
  }
);

module.exports = Cooked;
