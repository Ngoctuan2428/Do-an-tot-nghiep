const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    slug: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    image_url: {
        type: DataTypes.STRING(512),
        allowNull: true,
    },
}, {
    tableName: 'categories',
    // Bảng này chỉ có created_at, không có updated_at
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false, // Tắt cột updated_at
});

module.exports = Category;