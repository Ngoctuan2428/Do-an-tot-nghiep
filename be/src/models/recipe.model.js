const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Recipe = sequelize.define('Recipe', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    slug: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    short_description: {
        type: DataTypes.STRING(512),
    },
    description: {
        type: DataTypes.TEXT,
    },
    ingredients: {
        type: DataTypes.JSON,
    },
    steps: {
        type: DataTypes.JSON,
    },
    // ---- BỔ SUNG CÁC TRƯỜNG CÒN THIẾU ----
    servings: { // Khẩu phần ăn
        type: DataTypes.INTEGER,
    },
    prep_time: { // Thời gian chuẩn bị (phút)
        type: DataTypes.INTEGER,
    },
    cook_time: { // Thời gian nấu (phút)
        type: DataTypes.INTEGER,
    },
    total_time: { // Tổng thời gian
        type: DataTypes.INTEGER,
    },
    image_url: {
        type: DataTypes.STRING(512),
    },
    likes: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
    },
    // ---- KẾT THÚC PHẦN BỔ SUNG ----
    difficulty: {
        type: DataTypes.ENUM('Dễ', 'Trung bình', 'Khó'),
        defaultValue: 'Trung bình',
    },
    status: {
        type: DataTypes.ENUM('public', 'private', 'draft'),
        defaultValue: 'public',
    },
    views: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
    },
}, {
    tableName: 'recipes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = Recipe;