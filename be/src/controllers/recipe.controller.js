// src/controllers/recipe.controller.js
const recipeService = require("../services/recipe.service");
// ✅ IMPORT SERVICE THỐNG KÊ (Để tăng view)
const statsService = require("../services/stats.service");

const { Recipe, User, Category, sequelize } = require("../models");
const { Op } = require("sequelize");

const createRecipe = async (req, res, next) => {
  try {
    const newRecipe = await recipeService.createRecipe(req.user.id, req.body);
    res.status(201).json({ status: "success", data: newRecipe });
  } catch (error) {
    next(error);
  }
};

const getAllRecipes = async (req, res, next) => {
  try {
    const recipes = await recipeService.getAllRecipes(req.query);
    res.status(200).json({ status: "success", data: recipes });
  } catch (error) {
    next(error);
  }
};

const getRecipeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Lấy ID người xem (nếu đã đăng nhập), nếu khách vãng lai thì null
    const viewerId = req.user ? req.user.id : null;

    // --- DEBUG LOG (Để kiểm tra lỗi) ---
    console.log(
      `[DEBUG] Dang tang view cho recipe: ${id}, viewer: ${viewerId}`
    );

    try {
      await statsService.incrementViewCount(id, viewerId);
      console.log("[DEBUG] Tang view THANH CONG!");
    } catch (err) {
      // Nếu lỗi, nó sẽ in ra lý do (Ví dụ: cột 'views' không tồn tại)
      console.error("[ERROR] LOI TANG VIEW:", err.message);
    }
    // ----------------------------------

    const recipe = await recipeService.getRecipeById(id);
    res.status(200).json({ status: "success", data: recipe });
  } catch (error) {
    next(error);
  }
};

const updateRecipe = async (req, res, next) => {
  try {
    const updatedRecipe = await recipeService.updateRecipe(
      req.params.id,
      req.user.id,
      req.user.role,
      req.body
    );

    res.status(200).json({ status: "success", data: updatedRecipe });
  } catch (error) {
    next(error);
  }
};

const deleteRecipe = async (req, res, next) => {
  try {
    await recipeService.deleteRecipe(req.params.id, req.user.id, req.user.role);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const saveRecipe = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const recipeId = req.params.id;
    const result = await recipeService.toggleFavoriteRecipe(userId, recipeId);
    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    next(error);
  }
};

const getRecipeCounts = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const counts = await recipeService.getRecipeCounts(userId);
    res.status(200).json({ status: "success", data: counts });
  } catch (error) {
    next(error);
  }
};

const getMyRecipes = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const recipes = await recipeService.getMyRecipes(userId);
    res.status(200).json({ status: "success", data: recipes });
  } catch (error) {
    next(error);
  }
};

const getSavedRecipes = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const recipes = await recipeService.getSavedRecipes(userId);
    res.status(200).json({ status: "success", data: recipes });
  } catch (error) {
    next(error);
  }
};

const getPublishedRecipes = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const recipes = await recipeService.getPublishedRecipes(userId);
    res.status(200).json({ status: "success", data: recipes });
  } catch (error) {
    next(error);
  }
};

const getDraftRecipes = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const recipes = await recipeService.getDraftRecipes(userId);
    res.status(200).json({ status: "success", data: recipes });
  } catch (error) {
    next(error);
  }
};

const likeRecipe = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const recipeId = req.params.id;
    const result = await recipeService.toggleLike(userId, recipeId);
    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    next(error);
  }
};

const getLikedRecipesIds = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const ids = await recipeService.getLikedRecipesIds(userId);
    res.status(200).json({ status: "success", data: ids });
  } catch (error) {
    next(error);
  }
};

const getRecipeReacters = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await recipeService.getRecipeReacters(id, req.query);
    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    next(error);
  }
};

const sendCooksnap = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const recipeId = req.params.id;
    const { imageUrl, comment } = req.body;

    const result = await recipeService.markRecipeAsCooked(
      userId,
      recipeId,
      imageUrl,
      comment
    );
    res.status(201).json({ status: "success", data: result });
  } catch (error) {
    next(error);
  }
};

const getCookedRecipes = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const recipes = await recipeService.getCookedRecipesList(userId);
    res.status(200).json({ status: "success", data: recipes });
  } catch (error) {
    next(error);
  }
};

const getPublicRecipesByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const recipes = await recipeService.getPublicRecipesByUserId(userId);
    res.status(200).json({ status: "success", data: recipes });
  } catch (error) {
    next(error);
  }
};

const getRecipeCooksnaps = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cooksnaps = await recipeService.getRecipeCooksnaps(id);
    res.status(200).json({ status: "success", data: cooksnaps });
  } catch (error) {
    next(error);
  }
};

const getCooksnap = async (req, res, next) => {
  try {
    const cooksnap = await recipeService.getCooksnapById(req.params.id);
    res.status(200).json({ status: "success", data: cooksnap });
  } catch (error) {
    next(error);
  }
};

const updateCooksnap = async (req, res, next) => {
  try {
    const updated = await recipeService.updateCooksnap(
      req.params.id,
      req.user.id,
      req.body
    );
    res.status(200).json({ status: "success", data: updated });
  } catch (error) {
    next(error);
  }
};

const deleteCooksnap = async (req, res, next) => {
  try {
    const result = await recipeService.deleteCooksnap(
      req.params.id,
      req.user.id
    );
    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    next(error);
  }
};

const getRelatedRecipes = async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentRecipe = await Recipe.findByPk(id);
    if (!currentRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const whereClause = {
      id: { [Op.ne]: id },
      status: "public",
    };

    const relatedRecipes = await Recipe.findAll({
      where: whereClause,
      limit: 3,
      order: sequelize.random(),
      include: [{ model: User, attributes: ["id", "username", "avatar_url"] }],
    });

    res.status(200).json({ status: "success", data: relatedRecipes });
  } catch (error) {
    next(error);
  }
};

const getPremiumRecipes = async (req, res, next) => {
  try {
    const recipes = await recipeService.getPremiumRecipes();
    res.status(200).json({ status: "success", data: recipes });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  saveRecipe,
  getRecipeCounts,
  getMyRecipes,
  getSavedRecipes,
  getPublishedRecipes,
  getDraftRecipes,
  likeRecipe,
  getLikedRecipesIds,
  getRecipeReacters,
  sendCooksnap,
  getCookedRecipes,
  getPublicRecipesByUserId,
  getRecipeCooksnaps,
  getCooksnap,
  updateCooksnap,
  deleteCooksnap,
  getRelatedRecipes,
  getPremiumRecipes,
};
