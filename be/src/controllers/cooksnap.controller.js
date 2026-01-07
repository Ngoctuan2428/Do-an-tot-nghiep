// src/controllers/cooksnap.controller.js
const cooksnapService = require("../services/cooksnap.service");
const { Recipe } = require("../models");

// 1. Controller tạo Cooksnap
const createCooksnap = async (req, res) => {
  try {
    const userId = req.user.id;
    const { recipeId, imageUrl, caption } = req.body;

    if (!recipeId || !imageUrl) {
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp ID công thức và hình ảnh." });
    }

    const data = { imageUrl, caption };
    const newCooksnap = await cooksnapService.createCooksnap(
      userId,
      recipeId,
      data
    );

    // --- 🔥 PHẦN THÊM VÀO: TẠO THÔNG BÁO ---
    try {
      // Tìm thông tin bài viết gốc để lấy ID tác giả (user_id)
      const recipe = await Recipe.findByPk(recipeId);

      // Nếu tác giả tồn tại và người gửi cooksnap KHÔNG PHẢI là tác giả
      if (recipe && recipe.user_id !== userId) {
        await notificationService.createNotification({
          recipient_id: recipe.user_id, // Gửi cho chủ bài viết
          sender_id: userId, // Người gửi cooksnap
          type: "cooksnap", // Loại thông báo
          reference_id: recipeId, // Link đến bài viết
          message: `đã gửi Cooksnap cho món "${recipe.title}"`,
        });
      }
    } catch (notifError) {
      console.error("Lỗi tạo thông báo cooksnap:", notifError);
      // Không return lỗi ở đây để tránh ảnh hưởng luồng chính
    }
    // ----------------------------------------

    return res.status(201).json({
      message: "Đăng Cooksnap thành công!",
      data: newCooksnap,
    });
  } catch (error) {
    console.error("Error creating cooksnap:", error);
    return res.status(500).json({ message: "Lỗi server khi tạo cooksnap." });
  }
};

// 2. Controller lấy danh sách Cooksnap theo món ăn
const getCooksnapsByRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params; // Lấy ID món ăn từ URL
    const { limit, page } = req.query; // Lấy phân trang (nếu có)

    const cooksnaps = await cooksnapService.getCooksnapsByRecipe(
      recipeId,
      page,
      limit
    );

    return res.status(200).json({
      message: "Lấy danh sách cooksnap thành công.",
      data: cooksnaps,
    });
  } catch (error) {
    console.error("Error fetching cooksnaps:", error);
    return res
      .status(500)
      .json({ message: "Lỗi server khi lấy danh sách cooksnap." });
  }
};

// 3. Controller lấy chi tiết 1 Cooksnap
const getCooksnapById = async (req, res) => {
  try {
    const { id } = req.params;
    const cooksnap = await cooksnapService.getCooksnapById(id);

    if (!cooksnap) {
      return res.status(404).json({ message: "Không tìm thấy Cooksnap." });
    }

    return res.status(200).json({
      data: cooksnap,
    });
  } catch (error) {
    console.error("Error fetching cooksnap detail:", error);
    return res.status(500).json({ message: "Lỗi server." });
  }
};

// 4. Controller cập nhật Cooksnap (Caption, Image)
const updateCooksnap = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const updates = req.body; // { caption: '...', imageUrl: '...' }

    // Gọi service để update (Service cần check xem userId có phải chủ sở hữu không)
    const updatedCooksnap = await cooksnapService.updateCooksnap(
      id,
      userId,
      updates
    );

    if (!updatedCooksnap) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy hoặc bạn không có quyền sửa." });
    }

    return res.status(200).json({
      message: "Cập nhật thành công!",
      data: updatedCooksnap,
    });
  } catch (error) {
    console.error("Error updating cooksnap:", error);
    return res.status(500).json({ message: "Lỗi server." });
  }
};

// 5. Controller xóa Cooksnap
const deleteCooksnap = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Gọi service xóa (Service cần check quyền chủ sở hữu)
    const result = await cooksnapService.deleteCooksnap(id, userId);

    if (!result) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy hoặc bạn không có quyền xóa." });
    }

    return res.status(200).json({ message: "Xóa Cooksnap thành công." });
  } catch (error) {
    console.error("Error deleting cooksnap:", error);
    return res.status(500).json({ message: "Lỗi server." });
  }
};

// 6. Controller Like/Unlike Cooksnap
const toggleLikeCooksnap = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params; // Cooksnap ID

    const result = await cooksnapService.toggleLike(id, userId);

    return res.status(200).json({
      message: "Thao tác thành công",
      data: result, // Trả về trạng thái đã like chưa và tổng số like mới
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    return res.status(500).json({ message: "Lỗi server." });
  }
};

module.exports = {
  createCooksnap,
  getCooksnapsByRecipe,
  getCooksnapById,
  updateCooksnap,
  deleteCooksnap,
  toggleLikeCooksnap,
};
