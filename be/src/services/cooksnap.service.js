const {
  Cooksnap,
  Recipe,
  User,
  CooksnapLike,
  sequelize,
} = require("../models");
const notificationService = require("./notification.service");

/**
 * Tạo một Cooksnap mới (Người dùng trả bài)
 */
const createCooksnap = async (userId, recipeId, data) => {
  const t = await sequelize.transaction(); // Dùng transaction để đảm bảo toàn vẹn dữ liệu
  try {
    // 1. Tạo cooksnap
    const newCooksnap = await Cooksnap.create(
      {
        user_id: userId,
        recipe_id: recipeId,
        image_url: data.imageUrl,
        caption: data.caption,
      },
      { transaction: t }
    );

    // 2. Tăng số đếm cooked_count của món ăn lên 1
    await Recipe.increment("cooked_count", {
      by: 1,
      where: { id: recipeId },
      transaction: t,
    });

    await t.commit();

    // 3. 🔥 TẠO THÔNG BÁO CHO NGƯỜI TẠO BÀI VIẾT (Nếu không phải tự đang cooksnap bài mình)
    try {
      const recipe = await Recipe.findByPk(recipeId);
      if (recipe && recipe.user_id !== userId) {
        await notificationService.createNotification({
          recipient_id: recipe.user_id,
          sender_id: userId,
          type: "cooksnap",
          reference_id: recipeId,
          message: `đã nấu thử món ăn "${recipe.title}" của bạn`,
        });
      }
    } catch (error) {
      console.error("Lỗi tạo thông báo cooksnap:", error);
      // Không throw lỗi để tránh ảnh hưởng luồng chính
    }

    return newCooksnap;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

/**
 * Lấy danh sách Cooksnap của một món ăn
 */
const getCooksnapsByRecipe = async (recipeId, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  return await Cooksnap.findAndCountAll({
    where: { recipe_id: recipeId },
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [["created_at", "DESC"]], // Mới nhất lên đầu
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "username", "avatar_url"], // Lấy thông tin người trả bài
      },
    ],
    distinct: true, // Đảm bảo đếm đúng khi có include
  });
};

/**
 * Lấy chi tiết một Cooksnap theo ID
 */
const getCooksnapById = async (id) => {
  return await Cooksnap.findByPk(id, {
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "username", "avatar_url"],
      },
      {
        model: Recipe,
        as: "recipe",
        attributes: ["id", "title"], // Kèm thông tin món ăn gốc
      },
    ],
  });
};

/**
 * Cập nhật Cooksnap (Chỉ chủ sở hữu mới được sửa)
 */
const updateCooksnap = async (id, userId, updates) => {
  const cooksnap = await Cooksnap.findOne({
    where: { id, user_id: userId }, // Check luôn user_id để đảm bảo quyền sở hữu
  });

  if (!cooksnap) return null;

  // Chỉ update các trường cho phép
  if (updates.caption) cooksnap.caption = updates.caption;
  if (updates.imageUrl) cooksnap.image_url = updates.imageUrl;

  await cooksnap.save();
  return cooksnap;
};

/**
 * Xóa Cooksnap (Giảm cooked_count của món ăn đi 1)
 */
const deleteCooksnap = async (id, userId) => {
  const t = await sequelize.transaction();
  try {
    const cooksnap = await Cooksnap.findOne({
      where: { id, user_id: userId },
    });

    if (!cooksnap) {
      await t.rollback();
      return null;
    }

    const recipeId = cooksnap.recipe_id;

    // 1. Xóa cooksnap
    await cooksnap.destroy({ transaction: t });

    // 2. Giảm cooked_count của món ăn
    await Recipe.increment("cooked_count", {
      by: -1,
      where: { id: recipeId },
      transaction: t,
    });

    await t.commit();
    return true;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

/**
 * Like hoặc Unlike Cooksnap
 * Giả định bạn có bảng CooksnapLike hoặc bảng trung gian
 */
const toggleLike = async (cooksnapId, userId) => {
  // Kiểm tra xem user đã like chưa
  // Lưu ý: Cần import Model CooksnapLike hoặc dùng bảng trung gian tương ứng
  const existingLike = await CooksnapLike.findOne({
    where: {
      cooksnap_id: cooksnapId,
      user_id: userId,
    },
  });

  if (existingLike) {
    // Đã like -> Xóa like (Unlike)
    await existingLike.destroy();
    // Giảm like count (nếu có cột like_count trong bảng Cooksnap)
    // await Cooksnap.decrement('likes_count', { where: { id: cooksnapId } });
    return { liked: false };
  } else {
    // Chưa like -> Tạo like
    await CooksnapLike.create({
      cooksnap_id: cooksnapId,
      user_id: userId,
    });
    // Tăng like count
    // await Cooksnap.increment('likes_count', { where: { id: cooksnapId } });
    return { liked: true };
  }
};

module.exports = {
  createCooksnap,
  getCooksnapsByRecipe,
  getCooksnapById,
  updateCooksnap,
  deleteCooksnap,
  toggleLike,
};
