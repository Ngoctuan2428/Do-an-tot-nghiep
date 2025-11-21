// File: services/recipe.service.js

// 1. DÒNG IMPORT DUY NHẤT: Bao gồm tất cả các Models cần dùng
const {
  Recipe,
  User,
  Category,
  Tag,
  Favorite,
  Like,
  Cooked,
} = require("../models");
const { Op } = require("sequelize");
const ApiError = require("../utils/ApiError");
const generateSlug = require("../utils/slugify");

// 2. HÀM createRecipe
const createRecipe = async (userId, recipeData) => {
  const { title, categoryIds, tags, ...rest } = recipeData;
  const slug = generateSlug(title) + "-" + Date.now();

  // Fix lỗi: Chuyển 'ingredients' (TEXT) thành chuỗi JSON
  if (Array.isArray(rest.ingredients)) {
    // Sửa Model Recipe từ TEXT -> JSON sẽ không cần dòng này nữa
    // nhưng để tạm vẫn chạy
    rest.ingredients = JSON.stringify(rest.ingredients);
  }

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

// 3. CẬP NHẬT HÀM getRecipeById
const getRecipeById = async (recipeId) => {
  const recipe = await Recipe.findByPk(recipeId, {
    include: [
      { model: User, attributes: ["id", "username", "avatar_url", "bio"] }, // ✅ Lấy thêm avatar/bio nếu cần
      { model: Category, through: { attributes: [] } },
      { model: Tag, through: { attributes: [] } },
    ],
  });

  if (!recipe) throw new ApiError(404, "Recipe not found");

  // ✅ THÊM: Đếm số lượng người đã lưu (Favorite) món này
  const favoritesCount = await Favorite.count({
    where: { recipe_id: recipeId },
  });

  // Gán thêm trường này vào kết quả trả về
  // (Sử dụng dataValues để gán vào object Sequelize)
  recipe.dataValues.favorites_count = favoritesCount;

  return recipe;
};

// 4. HÀM getAllRecipes
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

// 5. HÀM updateRecipe
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

// 6. HÀM deleteRecipe
const deleteRecipe = async (recipeId, userId, userRole) => {
  const recipe = await getRecipeById(recipeId);
  if (userRole !== "admin" && recipe.user_id !== userId) {
    throw new ApiError(403, "You are not authorized to delete this recipe");
  }
  await recipe.destroy();
  return { message: "Recipe deleted successfully" };
};

// 7. HÀM toggleFavoriteRecipe (Cho "Lưu món")
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

// 8. HÀM getRecipeCounts (Cho Sidebar count)
const getRecipeCounts = async (userId) => {
  const [all, saved, mine, published, drafts, cooked] = await Promise.all([
    Recipe.count({ where: { user_id: userId } }),
    Favorite.count({ where: { user_id: userId } }),
    Recipe.count({ where: { user_id: userId } }),
    Recipe.count({ where: { user_id: userId, status: "public" } }),
    Recipe.count({ where: { user_id: userId, status: "draft" } }),
    Cooked.count({ where: { user_id: userId } }),
  ]);

  return {
    all,
    saved,
    mine,
    published,
    drafts,
    cooked, // Tạm thời
  };
};

// 9. HÀM getMyRecipes
const getMyRecipes = async (userId) => {
  return await Recipe.findAndCountAll({
    where: { user_id: userId },
    include: [{ model: User, attributes: ["id", "username"] }],
    order: [["created_at", "DESC"]],
  });
};

/**
 * @desc    Lấy các công thức đã lưu (Favorite) của user
 * @param {string} userId
 */
const getSavedRecipes = async (userId) => {
  const favorites = await Favorite.findAll({
    where: { user_id: userId },
    // Include (tham gia) bảng Recipe để lấy thông tin món ăn
    include: [
      {
        model: Recipe,
        include: [{ model: User, attributes: ["id", "username"] }], // Lấy cả user của món ăn đó
      },
    ],
    order: [["created_at", "DESC"]],
  });

  // Trích xuất thông tin Recipe từ kết quả Favorite
  const recipes = favorites.map((fav) => fav.Recipe);

  return {
    count: recipes.length,
    rows: recipes,
  };
};

/**
 * @desc    Lấy các công thức đã đăng (status='public') của user
 * @param {string} userId
 */
const getPublishedRecipes = async (userId) => {
  return await Recipe.findAndCountAll({
    where: {
      user_id: userId,
      status: "public", // Chỉ lấy các món có status là 'public'
    },
    include: [{ model: User, attributes: ["id", "username"] }],
    order: [["created_at", "DESC"]],
  });
};

/**
 * @desc    Lấy các công thức nháp (status='draft') của user
 * @param {string} userId
 */
const getDraftRecipes = async (userId) => {
  return await Recipe.findAndCountAll({
    where: {
      user_id: userId,
      status: "draft", // Chỉ lấy các món có status là 'draft'
    },
    include: [{ model: User, attributes: ["id", "username"] }],
    order: [["created_at", "DESC"]],
  });
};

const toggleLike = async (userId, recipeId) => {
  const recipe = await Recipe.findByPk(recipeId);
  if (!recipe) throw new ApiError(404, "Recipe not found");

  const existingLike = await Like.findOne({
    where: { user_id: userId, recipe_id: recipeId },
  });

  if (existingLike) {
    // Đã like -> Hủy like (xóa bản ghi và giảm đếm)
    await existingLike.destroy();
    await recipe.decrement("likes", { by: 1 });
    return { liked: false, likes: recipe.likes - 1 };
  } else {
    // Chưa like -> Tạo like mới (thêm bản ghi và tăng đếm)
    await Like.create({ user_id: userId, recipe_id: recipeId });
    await recipe.increment("likes", { by: 1 });
    return { liked: true, likes: recipe.likes + 1 };
  }
};

const getLikedRecipesIds = async (userId) => {
  const likes = await Like.findAll({
    where: { user_id: userId },
    attributes: ["recipe_id"], // Chỉ lấy cột recipe_id cho nhẹ
  });
  return likes.map((like) => like.recipe_id);
};

const getRecipeReacters = async (recipeId, queryOptions) => {
  const { page = 1, limit = 20 } = queryOptions;
  const offset = (page - 1) * limit;

  // Nếu Like hoặc User chưa được import, dòng dưới đây sẽ gây lỗi 500
  const likes = await Like.findAndCountAll({
    where: { recipe_id: recipeId },
    include: [
      {
        model: User, // Phải chắc chắn model User đã import
        attributes: ["id", "username", "avatar_url", "bio"],
      },
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [["created_at", "DESC"]],
  });

  return {
    total: likes.count,
    // Map để lấy ra object User thay vì object Like
    users: likes.rows.map((like) => like.User),
    page: parseInt(page),
    totalPages: Math.ceil(likes.count / limit),
  };
};

const markRecipeAsCooked = async (userId, recipeId, imageUrl, comment = "") => {
  // Kiểm tra xem món này tồn tại không
  const recipe = await Recipe.findByPk(recipeId);
  if (!recipe) throw new ApiError(404, "Recipe not found");

  // Tạo bản ghi Cooked mới
  const cooksnap = await Cooked.create({
    user_id: userId,
    recipe_id: recipeId,
    image_url: imageUrl,
    comment: comment,
  });

  return cooksnap;
};

// ✅ 4. CẬP NHẬT HÀM MỚI: Lấy danh sách món đã nấu cho trang CookedRecipes
const getCookedRecipesList = async (userId) => {
  // Lấy danh sách Cooked kèm theo thông tin Recipe
  const cookedItems = await Cooked.findAll({
    where: { user_id: userId },
    include: [
      {
        model: Recipe,
        include: [{ model: User, attributes: ["id", "username"] }],
      },
    ],
    order: [["created_at", "DESC"]],
  });

  // Trích xuất Recipe ra để trả về format giống các API khác
  // Lưu ý: Một món có thể nấu nhiều lần, tùy bạn muốn hiển thị trùng hay không.
  // Dưới đây là hiển thị tất cả lần nấu.
  const recipes = cookedItems.map((item) => {
    const recipe = item.Recipe.toJSON();
    // Gắn thêm ảnh cooksnap vào recipe để hiển thị nếu muốn
    recipe.cooksnap_image = item.image_url;
    recipe.cooked_id = item.id; // <--- THÊM DÒNG NÀY (ID duy nhất của lần nấu)
    return recipe;
  });

  return {
    count: recipes.length,
    rows: recipes,
  };
};

const getPublicRecipesByUserId = async (userId) => {
  return await Recipe.findAndCountAll({
    where: {
      user_id: userId,
      status: "public", // Chỉ lấy món đã lên sóng
    },
    include: [{ model: User, attributes: ["id", "username", "avatar_url"] }],
    order: [["created_at", "DESC"]],
  });
};

// 10. CẬP NHẬT EXPORTS
module.exports = {
  createRecipe,
  getRecipeById,
  getAllRecipes,
  updateRecipe,
  deleteRecipe,
  toggleFavoriteRecipe,
  getRecipeCounts,
  getMyRecipes,
  getSavedRecipes,
  getPublishedRecipes,
  getDraftRecipes,
  toggleLike, // ✅ Export mới
  getLikedRecipesIds, // ✅ Export mới
  getRecipeReacters,
  markRecipeAsCooked, // ✅ Export mới
  getCookedRecipesList, // ✅ Export mới
  getPublicRecipesByUserId,
};
