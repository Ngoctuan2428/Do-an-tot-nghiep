const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database"); // Import sequelize của bạn

const IngredientsMaster = sequelize.define(
  "IngredientsMaster",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name_key: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    display_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    calories_per_100g: {
      type: DataTypes.INTEGER,
    },
  },
  {
    // Cấu hình Sequelize để khớp với tên bảng chính xác
    tableName: "ingredients_master",
    timestamps: false, // Bảng này không có created_at/updated_at
  }
);

module.exports = IngredientsMaster;