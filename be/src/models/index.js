// src/models/index.js

const { sequelize } = require('../config/database');

// Import tất cả models
const User = require('./user.model');
const Category = require('./category.model');
const Recipe = require('./recipe.model');
const Comment = require('./comment.model');
const Favorite = require('./favorite.model');
const Tag = require('./tag.model');
const Media = require('./media.model');
const Challenge = require('./challenge.model'); 

const db = {};

// Gán sequelize và các model vào đối tượng db
db.sequelize = sequelize;
db.User = User;
db.Category = Category;
db.Recipe = Recipe;
db.Comment = Comment;
db.Favorite = Favorite;
db.Tag = Tag;
db.Media = Media;
db.Challenge = Challenge; // <-- THÊM MỚI

// === ĐỊNH NGHĨA QUAN HỆ SỬ DỤNG CÁC MODEL TỪ `db` ===

// --- User relationships ---
db.User.hasMany(db.Recipe, { foreignKey: 'user_id', onDelete: 'CASCADE' });
db.User.hasMany(db.Comment, { foreignKey: 'user_id', onDelete: 'CASCADE' });
db.User.hasMany(db.Media, { foreignKey: 'user_id', onDelete: 'SET NULL' });
db.User.belongsToMany(db.Recipe, { 
  through: db.Favorite, 
  foreignKey: 'user_id', 
  as: 'FavoriteRecipes' 
});

// --- Recipe relationships ---
db.Recipe.belongsTo(db.User, { foreignKey: 'user_id' });
db.Recipe.hasMany(db.Comment, { foreignKey: 'recipe_id', onDelete: 'CASCADE' });
db.Recipe.hasMany(db.Media, { foreignKey: 'recipe_id', onDelete: 'CASCADE' });
db.Recipe.belongsToMany(db.Category, { 
  through: 'recipe_categories', 
  foreignKey: 'recipe_id', 
  otherKey: 'category_id', 
  timestamps: false 
});
db.Recipe.belongsToMany(db.Tag, { 
  through: 'recipe_tags', 
  foreignKey: 'recipe_id', 
  otherKey: 'tag', 
  timestamps: false 
});
db.Recipe.belongsToMany(db.User, { 
  through: db.Favorite, 
  foreignKey: 'recipe_id', 
  as: 'FavoritedByUsers' 
});

// --- Category relationships ---
db.Category.belongsToMany(db.Recipe, { 
  through: 'recipe_categories', 
  foreignKey: 'category_id', 
  otherKey: 'recipe_id', 
  timestamps: false 
});

// --- Tag relationships ---
db.Tag.belongsToMany(db.Recipe, { 
  through: 'recipe_tags', 
  foreignKey: 'tag', 
  otherKey: 'recipe_id', 
  timestamps: false 
});

// --- Comment relationships ---
db.Comment.belongsTo(db.User, { foreignKey: 'user_id' });
db.Comment.belongsTo(db.Recipe, { foreignKey: 'recipe_id' });

// --- Media relationships ---
db.Media.belongsTo(db.User, { foreignKey: 'user_id' });
db.Media.belongsTo(db.Recipe, { foreignKey: 'recipe_id' });

// --- Challenge relationships (THÊM MỚI) ---
db.Recipe.belongsToMany(db.Challenge, {
  through: 'ChallengeRecipe', // Tên bảng trung gian
  foreignKey: 'recipe_id',
  otherKey: 'challenge_id',
  as: 'challenges',
  timestamps: false // Bảng này không cần createdAt/updatedAt
});

db.Challenge.belongsToMany(db.Recipe, {
  through: 'ChallengeRecipe',
  foreignKey: 'challenge_id',
  otherKey: 'recipe_id',
  as: 'recipes',
  timestamps: false
});


module.exports = db;