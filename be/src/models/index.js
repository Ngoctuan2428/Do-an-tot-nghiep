const { sequelize } = require("../config/database");

// Import tất cả models
const User = require("./user.model");
const Category = require("./category.model");
const Recipe = require("./recipe.model");
const Comment = require("./comment.model");
const Favorite = require("./favorite.model");
const Tag = require("./tag.model");
const Media = require("./media.model");
const Like = require("./like.model");
const Follow = require("./follow.model");
const Cooked = require("./cooked.model");
const Challenge = require("./challenge.model");

const db = {};

// Gán sequelize và các model vào đối tượng db
db.sequelize = sequelize;
db.User = User;
db.Category = Category;
db.Recipe = Recipe;
db.Comment = Comment;
db.Favorite = Favorite;
db.Like = Like;
db.Follow = Follow;
db.Tag = Tag;
db.Media = Media;
db.Cooked = Cooked;
db.Challenge = Challenge;

// === ĐỊNH NGHĨA QUAN HỆ SỬ DỤNG CÁC MODEL TỪ `db` ===

// User relationships
db.User.hasMany(db.Recipe, { foreignKey: "user_id", onDelete: "CASCADE" });
db.User.hasMany(db.Comment, { foreignKey: "user_id", onDelete: "CASCADE" });
db.User.hasMany(db.Media, { foreignKey: "user_id", onDelete: "SET NULL" });
db.User.belongsToMany(db.Recipe, {
  through: db.Favorite,
  foreignKey: "user_id",
  as: "FavoriteRecipes",
});

// Recipe relationships
db.Recipe.belongsTo(db.User, { foreignKey: "user_id" });
db.Recipe.hasMany(db.Comment, { foreignKey: "recipe_id", onDelete: "CASCADE" });
db.Recipe.hasMany(db.Media, { foreignKey: "recipe_id", onDelete: "CASCADE" });
db.Recipe.belongsToMany(db.Category, {
  through: "recipe_categories",
  foreignKey: "recipe_id",
  otherKey: "category_id",
  timestamps: false,
});
db.Recipe.belongsToMany(db.Tag, {
  through: "recipe_tags",
  foreignKey: "tag",
  otherKey: "recipe_id",
  timestamps: false,
});
db.Recipe.belongsToMany(db.User, {
  through: db.Favorite,
  foreignKey: "recipe_id",
  as: "FavoritedByUsers",
});
db.User.belongsToMany(db.Recipe, {
  through: db.Like,
  foreignKey: "user_id",
  as: "LikedRecipes",
});

db.Recipe.belongsToMany(db.User, {
  through: db.Like,
  foreignKey: "recipe_id",
  as: "LikedByUsers",
});
// Category relationships
db.Category.belongsToMany(db.Recipe, {
  through: "recipe_categories",
  foreignKey: "category_id",
  otherKey: "recipe_id",
  timestamps: false,
});

// Tag relationships
db.Tag.belongsToMany(db.Recipe, {
  through: "recipe_tags",
  foreignKey: "tag",
  otherKey: "recipe_id",
  timestamps: false,
});

// Comment relationships
db.Comment.belongsTo(db.User, { foreignKey: "user_id" });
db.Comment.belongsTo(db.Recipe, { foreignKey: "recipe_id" });

// Media relationships
db.Media.belongsTo(db.User, { foreignKey: "user_id" });
db.Media.belongsTo(db.Recipe, { foreignKey: "recipe_id" });

// ----------------------------------------------------------------
// ✅ BỔ SUNG QUAN HỆ CHO BẢNG TRUNG GIAN 'Favorite'
// ----------------------------------------------------------------
// (Những dòng này bị thiếu, khiến 'include' trong service bị lỗi 500)
db.Favorite.belongsTo(db.User, { foreignKey: "user_id" });
db.Favorite.belongsTo(db.Recipe, { foreignKey: "recipe_id" });

// (Thêm luôn quan hệ ngược lại để đầy đủ)
db.User.hasMany(db.Favorite, { foreignKey: "user_id" });
db.Recipe.hasMany(db.Favorite, { foreignKey: "recipe_id" });
// ----------------------------------------------------------------

db.Like.belongsTo(db.User, { foreignKey: "user_id" });
db.Like.belongsTo(db.Recipe, { foreignKey: "recipe_id" });
db.User.hasMany(db.Like, { foreignKey: "user_id" });
db.Recipe.hasMany(db.Like, { foreignKey: "recipe_id" });

// User có nhiều người theo dõi (Followers)
db.User.belongsToMany(db.User, {
  through: db.Follow,
  as: "Followers", // Tên alias khi truy vấn: user.getFollowers()
  foreignKey: "following_id", // Khóa ngoại trỏ đến người ĐƯỢC theo dõi
  otherKey: "follower_id", // Khóa ngoại trỏ đến người ĐI theo dõi
});

// User đang theo dõi nhiều người khác (Following)
db.User.belongsToMany(db.User, {
  through: db.Follow,
  as: "Following", // Tên alias khi truy vấn: user.getFollowing()
  foreignKey: "follower_id", // Khóa ngoại trỏ đến người ĐI theo dõi
  otherKey: "following_id", // Khóa ngoại trỏ đến người ĐƯỢC theo dõi
});

db.Follow.belongsTo(db.User, { as: "Follower", foreignKey: "follower_id" });
db.Follow.belongsTo(db.User, { as: "Following", foreignKey: "following_id" });

db.Comment.belongsTo(db.User, { foreignKey: "user_id" });
db.Comment.belongsTo(db.Recipe, { foreignKey: "recipe_id" });

// ✅ THÊM QUAN HỆ PHẢN HỒI (Một comment có nhiều comment con)
db.Comment.hasMany(db.Comment, {
  as: "Replies",
  foreignKey: "parent_id",
  onDelete: "CASCADE",
});
db.Comment.belongsTo(db.Comment, { as: "Parent", foreignKey: "parent_id" });

db.Cooked.belongsTo(db.User, { foreignKey: "user_id" });
db.Cooked.belongsTo(db.Recipe, { foreignKey: "recipe_id" });
db.User.hasMany(db.Cooked, { foreignKey: "user_id" });
db.Recipe.hasMany(db.Cooked, { foreignKey: "recipe_id" });

// Quan hệ N-N tiện lợi (Optional, dùng khi cần lấy nhanh danh sách recipe đã nấu của user)
db.User.belongsToMany(db.Recipe, {
  through: db.Cooked,
  foreignKey: "user_id",
  as: "CookedRecipes",
});

module.exports = db;
