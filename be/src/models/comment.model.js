// src/models/comment.model.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Comment = sequelize.define(
  "Comment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    rating: {
      type: DataTypes.TINYINT,
      allowNull: true,
    },
    // ✅ THÊM TRƯỜNG NÀY
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Null nghĩa là bình luận gốc
    },
  },
  {
    tableName: "comments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Comment;
