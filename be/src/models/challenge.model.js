// src/models/challenge.model.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database').sequelize; // Giả sử bạn có file này
const generateSlug = require('../utils/slugify'); // Dùng lại slugify

class Challenge extends Model {
    // Có thể thêm các phương thức tùy chỉnh ở đây nếu cần
}

Challenge.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  banner_image_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Challenge',
  tableName: 'challenges',
  timestamps: true, // Thử thách nên có created_at
  hooks: {
    beforeCreate: (challenge) => {
      challenge.slug = generateSlug(challenge.title) + '-' + Date.now();
    },
    beforeUpdate: (challenge) => {
      if (challenge.changed('title')) {
        challenge.slug = generateSlug(challenge.title) + '-' + Date.now();
      }
    },
  },
});

module.exports = Challenge;