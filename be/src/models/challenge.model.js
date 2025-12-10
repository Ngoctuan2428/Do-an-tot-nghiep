// src/models/challenge.model.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Challenge = sequelize.define(
  "Challenge",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image_url: {
      type: DataTypes.STRING(512),
      allowNull: true,
    },
    // Dùng hashtag để user tham gia (ví dụ: #monchay7ngay)
    hashtag: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true, // Mỗi thử thách có 1 hashtag duy nhất
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true, // Ngày kết thúc
    },
  },
  {
    tableName: "challenges",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Challenge;
