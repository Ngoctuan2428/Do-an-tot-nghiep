const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    avatar_url: {
        type: DataTypes.STRING(512),
        allowNull: true,
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user',
    },
}, {
    tableName: 'users',
    // Sequelize sẽ tự động quản lý created_at và updated_at
    timestamps: true, 
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = User;