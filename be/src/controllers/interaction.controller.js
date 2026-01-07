// src/controllers/interaction.controller.js
const interactionService = require("../services/interaction.service");
const notificationService = require("../services/notification.service");
const { Like, Follow, Recipe, User } = require("../models");
const ApiError = require("../utils/ApiError");

// 1. Lấy feed hoạt động
const getInteractionFeed = async (req, res, next) => {
  try {
    const feed = await interactionService.getInteractionFeed(req.user.id);
    res.status(200).json({ status: "success", data: feed });
  } catch (error) {
    next(error);
  }
};

// 2. Xử lý Like/Unlike Món ăn
const toggleLikeRecipe = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { recipeId } = req.params;

    // Kiểm tra món ăn tồn tại
    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) {
      throw new ApiError(404, "Món ăn không tồn tại");
    }

    // Kiểm tra đã like chưa
    const existingLike = await Like.findOne({
      where: { user_id: userId, recipe_id: recipeId },
    });

    if (existingLike) {
      // Đã like -> Xóa (Unlike)
      await existingLike.destroy();
      return res
        .status(200)
        .json({ status: "success", message: "Đã bỏ thích", liked: false });
    } else {
      // Chưa like -> Tạo mới (Like)
      await Like.create({ user_id: userId, recipe_id: recipeId });

      // 🔥 TẠO THÔNG BÁO (Nếu không phải tự like bài mình)
      if (recipe.user_id !== userId) {
        await notificationService.createNotification({
          recipient_id: recipe.user_id,
          sender_id: userId,
          type: "like",
          reference_id: recipeId,
          message: `đã thích món ăn "${recipe.title}" của bạn`,
        });
      }

      return res
        .status(201)
        .json({ status: "success", message: "Đã thích món ăn", liked: true });
    }
  } catch (error) {
    next(error);
  }
};

// 3. Xử lý Follow/Unfollow User
const toggleFollowUser = async (req, res, next) => {
  try {
    const followerId = req.user.id;
    const { userId: followingId } = req.params;

    if (parseInt(followerId) === parseInt(followingId)) {
      throw new ApiError(400, "Bạn không thể tự theo dõi chính mình");
    }

    const targetUser = await User.findByPk(followingId);
    if (!targetUser) {
      throw new ApiError(404, "Người dùng không tồn tại");
    }

    const existingFollow = await Follow.findOne({
      where: { follower_id: followerId, following_id: followingId },
    });

    if (existingFollow) {
      // Đã follow -> Hủy follow
      await existingFollow.destroy();
      return res.status(200).json({
        status: "success",
        message: "Đã hủy theo dõi",
        following: false,
      });
    } else {
      // Chưa follow -> Tạo follow
      await Follow.create({
        follower_id: followerId,
        following_id: followingId,
      });

      // 🔥 TẠO THÔNG BÁO
      try {
        await notificationService.createNotification({
          recipient_id: followingId,
          sender_id: followerId,
          type: "follow",
          reference_id: followerId,
          message: `đã bắt đầu theo dõi bạn`,
        });
      } catch (notifError) {
        console.error("Lỗi tạo thông báo follow:", notifError);
        // Không throw lỗi để tránh ảnh hưởng luồng chính
      }

      return res.status(201).json({
        status: "success",
        message: "Đã theo dõi người dùng",
        following: true,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInteractionFeed,
  toggleLikeRecipe,
  toggleFollowUser,
};
