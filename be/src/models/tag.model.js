const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Tag = sequelize.define('Tag', {
    name: { type: DataTypes.STRING(100), primaryKey: true },
}, { tableName: 'tags', timestamps: false });
module.exports = Tag;