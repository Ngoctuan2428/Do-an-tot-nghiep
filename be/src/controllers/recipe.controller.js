const recipeService = require("../services/recipe.service");

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
    const recipe = await recipeService.getRecipeById(req.params.id);
    res.status(200).json({ status: "success", data: recipe });
  } catch (error) {
    next(error);
  }
};

const updateRecipe = async (req, res, next) => {
  try {
    // --- SỬA DÒNG NÀY ---
    // Thêm req.user.role để truyền vào service
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

/**
 * @desc    Lưu/Bỏ lưu món ăn
 * @route   POST /api/recipes/:id/save
 * @access  Private (Cần đăng nhập)
 */
const saveRecipe = async (req, res, next) => {
  try {
    const userId = req.user.id; // Lấy từ middleware 'protect'
    const recipeId = req.params.id;

    const result = await recipeService.toggleFavoriteRecipe(userId, recipeId);

    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Lấy số lượng món ăn cho sidebar
 * @route   GET /api/recipes/counts
 * @access  Private
 */
const getRecipeCounts = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const counts = await recipeService.getRecipeCounts(userId);
    res.status(200).json({ status: "success", data: counts });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Lấy món ăn của tôi
 * @route   GET /api/recipes/mine
 * @access  Private
 */
const getMyRecipes = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const recipes = await recipeService.getMyRecipes(userId);
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
};
