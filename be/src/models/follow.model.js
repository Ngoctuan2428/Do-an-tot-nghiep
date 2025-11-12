// src/models/follow.model.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Follow = sequelize.define(
  "Follow",
  {
    // follower_id: Người đi theo dõi (sẽ được Sequelize tự tạo)
    // following_id: Người được theo dõi (sẽ được Sequelize tự tạo)
  },
  {
    tableName: "follows",
    timestamps: true,
    updatedAt: false, // Chỉ cần biết follow lúc nào, không cần updated_at
  }
);

module.exports = Follow;
