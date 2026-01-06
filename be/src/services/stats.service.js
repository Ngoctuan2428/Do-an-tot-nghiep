// src/services/stats.service.js
const {
  Recipe,
  RecipeView,
  Favorite,
  Comment,
  sequelize,
} = require("../models");
const { Op } = require("sequelize");

/**
 * 1. Tăng lượt xem (Gọi khi người dùng xem chi tiết món ăn)
 */
const incrementViewCount = async (recipeId, viewerId = null) => {
  // Cộng 1 vào cột 'views' trong bảng Recipes
  await Recipe.increment("views", { by: 1, where: { id: recipeId } });
  
  // Lưu lịch sử xem vào bảng RecipeView
  await RecipeView.create({ recipe_id: recipeId, viewer_id: viewerId });
};

/**
 * 2. Lấy thống kê tổng quan (KPIs) của User
 */
const getUserStats = async (userId) => {
  // Tổng view (cộng dồn từ cột views)
  const totalViews =
    (await Recipe.sum("views", { where: { user_id: userId } })) || 0;

  // Tổng lượt thích (cộng dồn từ cột likes)
  const totalLikes =
    (await Recipe.sum("likes", { where: { user_id: userId } })) || 0;

  // Lấy danh sách ID các món ăn của user này
  const recipes = await Recipe.findAll({
    where: { user_id: userId },
    attributes: ["id"],
    raw: true,
  });
  const recipeIds = recipes.map((r) => r.id);

  let totalFavorites = 0;
  let totalComments = 0;

  if (recipeIds.length > 0) {
    // Đếm tổng số lượt được thêm vào yêu thích
    totalFavorites = await Favorite.count({
      where: { recipe_id: { [Op.in]: recipeIds } },
    });
    // Đếm tổng số bình luận
    totalComments = await Comment.count({
      where: { recipe_id: { [Op.in]: recipeIds } },
    });
  }

  return {
    total_views: totalViews,
    total_likes: totalLikes,
    total_favorites: totalFavorites,
    total_comments: totalComments,
  };
};

/**
 * 3. Lấy dữ liệu biểu đồ User (7 ngày qua)
 */
const getViewsChartData = async (userId) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const userRecipes = await Recipe.findAll({
    where: { user_id: userId },
    attributes: ["id"],
    raw: true,
  });
  const recipeIds = userRecipes.map((r) => r.id);

  if (recipeIds.length === 0) return [];

  const viewsData = await RecipeView.findAll({
    attributes: [
      [sequelize.fn("DATE", sequelize.col("viewed_at")), "date"],
      [sequelize.fn("COUNT", "*"), "count"],
    ],
    where: {
      recipe_id: { [Op.in]: recipeIds },
      viewed_at: { [Op.gte]: sevenDaysAgo },
    },
    group: [sequelize.fn("DATE", sequelize.col("viewed_at"))],
    order: [[sequelize.col("date"), "ASC"]],
    raw: true,
  });

  return viewsData;
};

// ✅ 4. Lấy chỉ số thống kê của 1 món ăn (ĐÃ SỬA LỖI)
const getRecipeStats = async (recipeId, userId) => {
  const recipe = await Recipe.findOne({
    where: { id: recipeId, user_id: userId },
  });
  
  // Lưu ý: Cần đảm bảo ApiError đã được define hoặc import ở trên đầu file
  if (!recipe) throw new Error("Món ăn không tồn tại hoặc không thuộc về bạn");

  // Đếm Favorite
  const favorites = await Favorite.count({ where: { recipe_id: recipeId } });
  // Đếm Comment
  const comments = await Comment.count({ where: { recipe_id: recipeId } });

  return {
    // 🔥 ĐÃ SỬA: Thay recipe.view_count thành recipe.views cho khớp với DB
    total_views: recipe.views || 0, 
    total_likes: recipe.likes || 0,
    total_favorites: favorites,
    total_comments: comments,
    title: recipe.title, 
    image_url: recipe.image_url,
  };
};

// ✅ 5. Biểu đồ view của 1 món ăn (7 ngày qua)
const getRecipeChartData = async (recipeId, userId) => {
  // Kiểm tra quyền sở hữu
  const recipe = await Recipe.findOne({
    where: { id: recipeId, user_id: userId },
  });
  
  if (!recipe) throw new Error("Món ăn không tìm thấy");

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const viewsData = await RecipeView.findAll({
    attributes: [
      [sequelize.fn("DATE", sequelize.col("viewed_at")), "date"],
      [sequelize.fn("COUNT", "*"), "count"],
    ],
    where: {
      recipe_id: recipeId,
      viewed_at: { [Op.gte]: sevenDaysAgo },
    },
    group: [sequelize.fn("DATE", sequelize.col("viewed_at"))],
    order: [[sequelize.col("date"), "ASC"]],
    raw: true,
  });

  return viewsData;
};

module.exports = {
  incrementViewCount,
  getUserStats,
  getViewsChartData,
  getRecipeStats,
  getRecipeChartData,
};