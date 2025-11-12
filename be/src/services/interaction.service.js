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

module.exports = { getInteractionFeed };
