// src/models/recipe_view.model.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const RecipeView = sequelize.define(
  "RecipeView",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    recipe_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    viewer_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Cho phép null nếu người xem chưa đăng nhập (khách)
    },
    viewed_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "recipe_views",
    timestamps: false, // Chúng ta tự quản lý viewed_at, không cần createdAt/updatedAt
  }
);

module.exports = RecipeView;
