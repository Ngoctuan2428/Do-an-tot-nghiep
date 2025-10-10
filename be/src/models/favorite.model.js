const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Favorite = sequelize.define('Favorite', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    // user_id và recipe_id sẽ được Sequelize thêm qua associations trong file index.js
}, {
    tableName: 'favorites',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false, // Bảng này không có updated_at trong schema của bạn
});

module.exports = Favorite;