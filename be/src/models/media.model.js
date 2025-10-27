const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Media = sequelize.define('Media', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    url: { type: DataTypes.STRING(1024), allowNull: false },
    mime_type: { type: DataTypes.STRING(100) },
    size_bytes: { type: DataTypes.BIGINT },
}, { tableName: 'media', createdAt: 'created_at', updatedAt: false });
module.exports = Media;