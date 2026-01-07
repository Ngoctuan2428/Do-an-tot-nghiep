// src/services/interaction.service.js
const { Like, Comment, Follow, Cooked, Recipe, User } = require("../models");
const { Op } = require("sequelize");

const getInteractionFeed = async (userId) => {
  // 1. Lấy ID các món ăn của người dùng này
  const myRecipes = await Recipe.findAll({
    where: { user_id: userId },
    attributes: ["id"],
  });
  const myRecipeIds = myRecipes.map((r) => r.id);

  // 2. Lấy 10 hoạt động gần nhất cho mỗi loại
  const [likes, comments, follows, cooksnaps] = await Promise.all([
    // Ai đó (không phải tôi) LIKED món của tôi
    Like.findAll({
      where: {
        recipe_id: { [Op.in]: myRecipeIds },
        user_id: { [Op.ne]: userId }, // Loại trừ hành động của chính mình
      },
      include: [
        { model: User, attributes: ["id", "username", "avatar_url"] },
        { model: Recipe, attributes: ["id", "title"] },
      ],
      order: [["created_at", "DESC"]],
      limit: 10,
    }),

    // Ai đó FOLLOWED tôi
    Follow.findAll({
      where: { following_id: userId }, // Tìm ai đang theo dõi TÔI
      include: [
        {
          model: User,
          as: "Follower",
          attributes: ["id", "username", "avatar_url"],
        },
      ],
      order: [["createdAt", "DESC"]], // Bảng Follow dùng createdAt
      limit: 10,
    }),

    // Ai đó COMMENTED món của tôi
    Comment.findAll({
      where: {
        recipe_id: { [Op.in]: myRecipeIds },
        user_id: { [Op.ne]: userId },
        parent_id: null, // Chỉ lấy comment gốc, không lấy reply
      },
      include: [
        { model: User, attributes: ["id", "username", "avatar_url"] },
        { model: Recipe, attributes: ["id", "title"] },
      ],
      order: [["created_at", "DESC"]],
      limit: 10,
    }),

    // Ai đó COOKSNAPPED món của tôi
    Cooked.findAll({
      where: {
        recipe_id: { [Op.in]: myRecipeIds },
        user_id: { [Op.ne]: userId },
      },
      include: [
        { model: User, attributes: ["id", "username", "avatar_url"] },
        { model: Recipe, attributes: ["id", "title"] },
      ],
      order: [["created_at", "DESC"]],
      limit: 10,
    }),
  ]);

  // 3. Chuẩn hóa và gộp tất cả hoạt động
  const feed = [
    ...likes.map((i) => ({ type: "like", item: i, time: i.created_at })),
    ...comments.map((i) => ({ type: "comment", item: i, time: i.created_at })),
    ...follows.map((i) => ({ type: "follow", item: i, time: i.createdAt })),
    ...cooksnaps.map((i) => ({
      type: "cooksnap",
      item: i,
      time: i.created_at,
    })),
  ];

  // 4. Sắp xếp lại tất cả theo thời gian
  feed.sort((a, b) => new Date(b.time) - new Date(a.time));

  // Trả về 20 hoạt động mới nhất
  return feed.slice(0, 20);
};

const toggleLikeRecipe = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { recipeId } = req.params;

    // Kiểm tra món ăn
    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) throw new ApiError(404, "Món ăn không tồn tại");

    // Kiểm tra đã like chưa
    const existingLike = await Like.findOne({
      where: { user_id: userId, recipe_id: recipeId },
    });

    if (existingLike) {
      await existingLike.destroy(); // Unlike
      return res
        .status(200)
        .json({ status: "success", message: "Đã bỏ thích", liked: false });
    } else {
      await Like.create({ user_id: userId, recipe_id: recipeId }); // Like

      // 🔥 TẠO THÔNG BÁO LIKE (Nếu không phải tự like bài mình)
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

const toggleFollowUser = async (req, res, next) => {
  try {
    const followerId = req.user.id; // Người đi follow
    const { userId: followingId } = req.params; // Người được follow

    if (parseInt(followerId) === parseInt(followingId)) {
      throw new ApiError(400, "Không thể tự theo dõi chính mình");
    }

    const targetUser = await User.findByPk(followingId);
    if (!targetUser) throw new ApiError(404, "Người dùng không tồn tại");

    const existingFollow = await Follow.findOne({
      where: { follower_id: followerId, following_id: followingId },
    });

    if (existingFollow) {
      await existingFollow.destroy(); // Unfollow
      return res
        .status(200)
        .json({
          status: "success",
          message: "Đã hủy theo dõi",
          following: false,
        });
    } else {
      await Follow.create({
        follower_id: followerId,
        following_id: followingId,
      }); // Follow

      // 🔥 TẠO THÔNG BÁO FOLLOW
      await notificationService.createNotification({
        recipient_id: followingId,
        sender_id: followerId,
        type: "follow",
        reference_id: followerId, // Link về trang cá nhân người follow
        message: `đã bắt đầu theo dõi bạn`,
      });

      return res
        .status(201)
        .json({ status: "success", message: "Đã theo dõi", following: true });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getInteractionFeed };
