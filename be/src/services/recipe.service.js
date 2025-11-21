// File: services/recipe.service.js

const fs = require('fs'); // <-- SỬA LỖI 1: Thêm 'fs'
const path = require('path'); // <-- SỬA LỖI 2: Thêm 'path'

// 1. Import tất cả models, bao gồm 'IngredientsMaster'
const {
  Recipe,
  User,
  Category,
  Tag,
  Favorite,
} = require("../models");

const IngredientsMaster = require("../models/ingredientsMaster.model");

const { Op } = require("sequelize");
const ApiError = require("../utils/ApiError");
const generateSlug = require("../utils/slugify");

// 2. HÀM GỐC (createRecipe)
const createRecipe = async (userId, recipeData) => {
  const { title, categoryIds, tags, ...rest } = recipeData;
  const slug = generateSlug(title) + "-" + Date.now();

  // (Code này của bạn rất TỐT - tự động chuyển mảng 'ingredients' thành JSON)
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

// 3. HÀM GỐC (getRecipeById)
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

// 4. HÀM GỐC (getAllRecipes)
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

// 5. HÀM GỐC (updateRecipe)
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

// 6. HÀM GỐC (deleteRecipe)
const deleteRecipe = async (recipeId, userId, userRole) => {
  const recipe = await getRecipeById(recipeId);
  if (userRole !== "admin" && recipe.user_id !== userId) {
    throw new ApiError(403, "You are not authorized to delete this recipe");
  }
  await recipe.destroy();
  return { message: "Recipe deleted successfully" };
};

// 7. HÀM GỐC (toggleFavoriteRecipe)
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

// 8. HÀM GỐC (getRecipeCounts)
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
    cooked: 0,
  };
};

// 9. HÀM GỐC (getMyRecipes)
const getMyRecipes = async (userId) => {
  return await Recipe.findAndCountAll({
    where: { user_id: userId },
    include: [{ model: User, attributes: ["id", "username"] }],
    order: [["created_at", "DESC"]],
  });
};

// ============ BẮT ĐẦU CODE MỚI CHO TÍNH CALO ============

// 1. Đọc "Từ điển Đơn vị"
const conversionDBPath = path.join(__dirname, '..', '..', 'conversion_db.json');
const conversionDB = JSON.parse(fs.readFileSync(conversionDBPath, 'utf8'));

// 2. Hàm "Đoán" Tên Chuẩn (Helper function)
function findMasterKey(ingredientName) {
  const name = ingredientName.toLowerCase();
  
  if (name.includes('bột mì')) return 'bot_mi';
  if (name.includes('trứng gà') || name.includes('trứng')) return 'trung_ga';
  if (name.includes('đường')) return 'duong';
  if (name.includes('nước mắm')) return 'nuoc_mam';
  if (name.includes('hành lá')) return 'hanh_la';
  if (name.includes('khoai tây')) return 'khoai_tay';
  if (name.includes('cà rốt')) return 'ca_rot';
  if (name.includes('cá ngừ')) return 'ca_ngu_hop';
  if (name.includes('mayonnaise')) return 'mayonnaise';
  if (name.includes('thịt bò')) return 'thit_bo';
  if (name.includes('thịt heo')) return 'thit_heo';
  if (name.includes('thịt gà')) return 'thit_ga';
  if (name.includes('dầu ăn')) return 'dau_an';
  
  return null;
}

// 3. Hàm Service "Lõi Tính Toán"
const calculateNutrition = async (body) => {
  const { ingredients } = body; 

  if (!ingredients || !Array.isArray(ingredients)) {
    throw new ApiError(400, "Input không hợp lệ.");
  }

  // 1. Lấy "Từ điển Calo" từ Database
  // --- SỬA LỖI 3: Dùng 'IngredientsMaster', không phải 'prisma' ---
  const allMasterData = await IngredientsMaster.findAll();

  // 2. Chuyển nó thành object để tra cứu
  const masterDataMap = allMasterData.reduce((acc, item) => {
    acc[item.name_key] = item;
    return acc;
  }, {});

  let totalCalories = 0;
  let calculationDetails = [];

  // 3. Lặp và tính toán
  for (const item of ingredients) {
    const unitKey = item.unit.toLowerCase().trim();
    const conversionRate = conversionDB[unitKey];
    const masterKey = findMasterKey(item.name);
    
    if (!conversionRate || !masterKey || !masterDataMap[masterKey]) {
      calculationDetails.push({ name: item.name, status: "error", message: "Không có dữ liệu dinh dưỡng hoặc đơn vị" });
      continue;
    }

    const nutritionInfo = masterDataMap[masterKey];
    const quantity = parseFloat(item.quantity);

    if (isNaN(quantity) || quantity === 0) {
      // Bỏ qua nếu số lượng không hợp lệ hoặc = 0 (ví dụ: "ít", "vừa đủ")
      calculationDetails.push({ name: item.name, status: "skipped", message: "Số lượng không xác định" });
      continue;
    }

    // 5. PHÉP TÍNH
    const quantityInGrams = quantity * conversionRate;
    const calories = (quantityInGrams / 100) * nutritionInfo.calories_per_100g;

    totalCalories += calories;
    calculationDetails.push({
      name: nutritionInfo.display_name,
      quantity_g: parseFloat(quantityInGrams.toFixed(2)),
      calories: parseFloat(calories.toFixed(2)),
      status: "success"
    });
  }

  // 6. Trả kết quả
  return {
    total_calories: parseFloat(totalCalories.toFixed(2)),
    details: calculationDetails
  };
};

// ============ KẾT THÚC CODE MỚI ============

// 9. CẬP NHẬT EXPORTS
module.exports = {
  createRecipe,
  getRecipeById,
  getAllRecipes,
  updateRecipe,
  deleteRecipe,
  toggleFavoriteRecipe,
  getRecipeCounts,
  getMyRecipes,
  calculateNutrition, // (Đã export)
};