// src/services/recipe.service.js

// 1. ❗️ SỬA LỖI: Gộp 2 dòng import models thành 1
const { Recipe, User, Category, Tag, Favorite } = require("../models");
const { Op } = require("sequelize"); // Import Op
const ApiError = require("../utils/ApiError");
const generateSlug = require("../utils/slugify");

// 2. HÀM GỐC
const createRecipe = async (userId, recipeData) => {
  const { title, categoryIds, tags, ...rest } = recipeData;
  const slug = generateSlug(title) + "-" + Date.now();

  // Fix (từ lỗi trước): Chuyển 'ingredients' (TEXT) thành chuỗi JSON
  if (Array.isArray(rest.ingredients)) {
    rest.ingredients = JSON.stringify(rest.ingredients);
  }
  // (steps là JSON trong model, không cần chuyển)

  const newRecipe = await Recipe.create({
    user_id: userId,
    title,
    slug,
    ...rest,
  });

  if (categoryIds && categoryIds.length > 0)
    await newRecipe.setCategories(categoryIds);
  if (tags && tags.length > 0) {
    const tagInstances = await Promise.all(
      tags.map((tagName) => Tag.findOrCreate({ where: { name: tagName } }))
    );
    await newRecipe.setTags(tagInstances.map((t) => t[0]));
  }
  return getRecipeById(newRecipe.id);
};

// 3. HÀM GỐC
const getRecipeById = async (recipeId) => {
  const recipe = await Recipe.findByPk(recipeId, {
    include: [
      { model: User, attributes: ["id", "username"] },
      { model: Category, through: { attributes: [] } },
      { model: Tag, through: { attributes: [] } },
    ],
  });
  if (!recipe) throw new ApiError(404, "Recipe not found");
  return recipe;
};

// 4. HÀM GỐC
const getAllRecipes = async (queryOptions) => {
  const { page = 1, limit = 10 } = queryOptions;
  const offset = (page - 1) * limit;
  return await Recipe.findAndCountAll({
    limit: parseInt(limit),
    offset: parseInt(offset),
    include: [{ model: User, attributes: ["id", "username"] }],
    order: [["created_at", "DESC"]],
  });
};

// 5. HÀM GỐC
const updateRecipe = async (recipeId, userId, userRole, updateData) => {
  const recipe = await getRecipeById(recipeId);

  if (recipe.user_id !== userId && userRole !== "admin") {
    throw new ApiError(403, "You are not authorized to update this recipe");
  }

  const { categoryIds, tags, ...rest } = updateData;
  if (rest.title) rest.slug = generateSlug(rest.title) + "-" + Date.now();

  await recipe.update(rest);
  if (categoryIds) await recipe.setCategories(categoryIds);
  if (tags) {
    const tagInstances = await Promise.all(
      tags.map((tagName) => Tag.findOrCreate({ where: { name: tagName } }))
    );
    await recipe.setTags(tagInstances.map((t) => t[0]));
  }
  return getRecipeById(recipeId);
};

// 6. HÀM GỐC
const deleteRecipe = async (recipeId, userId, userRole) => {
  const recipe = await getRecipeById(recipeId);
  if (userRole !== "admin" && recipe.user_id !== userId) {
    throw new ApiError(403, "You are not authorized to delete this recipe");
  }
  await recipe.destroy();
  return { message: "Recipe deleted successfully" };
};

// 7. HÀM MỚI (Cho "Lưu món")
const toggleFavoriteRecipe = async (userId, recipeId) => {
  const existingFavorite = await Favorite.findOne({
    where: {
      user_id: userId,
      recipe_id: recipeId,
    },
  });

  if (existingFavorite) {
    await existingFavorite.destroy();
    return { saved: false };
  } else {
    await Favorite.create({
      user_id: userId,
      recipe_id: recipeId,
    });
    return { saved: true };
  }
};

// 8. HÀM MỚI (Cho Sidebar count)
const getRecipeCounts = async (userId) => {
  const [all, saved, mine, published, drafts] = await Promise.all([
    Recipe.count({ where: { user_id: userId } }),
    Favorite.count({ where: { user_id: userId } }),
    Recipe.count({ where: { user_id: userId } }),
    Recipe.count({ where: { user_id: userId, status: "public" } }),
    Recipe.count({ where: { user_id: userId, status: "draft" } }),
  ]);

  return {
    all,
    saved,
    mine,
    published,
    drafts,
    cooked: 0, // Tạm thời
  };
};

/**
 * @desc    Lấy tất cả công thức của user đang đăng nhập
 * @param {string} userId
 */
const getMyRecipes = async (userId) => {
  return await Recipe.findAndCountAll({
    where: { user_id: userId },
    include: [{ model: User, attributes: ["id", "username"] }],
    order: [["created_at", "DESC"]],
  });
};

// 9. CẬP NHẬT EXPORTS
module.exports = {
  createRecipe,
  getRecipeById,
  getAllRecipes,
  updateRecipe,
  deleteRecipe,
  toggleFavoriteRecipe, // Thêm
  getRecipeCounts, // Thêm
  getMyRecipes,
};
