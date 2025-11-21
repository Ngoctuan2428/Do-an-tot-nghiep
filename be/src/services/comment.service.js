const { Comment, User } = require("../models");
const ApiError = require("../utils/ApiError");

// ✅ CẬP NHẬT: Nhận thêm parent_id
const createComment = async (userId, recipeId, commentData) => {
  const { content, rating, parent_id } = commentData; // Lấy parent_id từ request
  return await Comment.create({
    user_id: userId,
    recipe_id: recipeId,
    content,
    rating,
    parent_id: parent_id || null, // Nếu không có thì là null (bình luận gốc)
  });
};

// ✅ CẬP NHẬT: Lấy bình luận kèm theo các phản hồi (Replies)
const getCommentsByRecipeId = async (recipeId, queryOptions) => {
  const { page = 1, limit = 10 } = queryOptions;
  const offset = (page - 1) * limit;

  return await Comment.findAndCountAll({
    where: {
      recipe_id: recipeId,
      parent_id: null, // ✅ CHỈ LẤY BÌNH LUẬN GỐC ở cấp cao nhất
    },
    include: [
      {
        model: User,
        attributes: ["id", "username", "avatar_url"],
      },
      // ✅ KÈM THEO CÁC PHẢN HỒI
      {
        model: Comment,
        as: "Replies",
        include: [
          {
            // Phản hồi cũng cần thông tin người dùng
            model: User,
            attributes: ["id", "username", "avatar_url"],
          },
        ],
        order: [["created_at", "ASC"]], // Phản hồi cũ xếp trước
      },
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [["created_at", "DESC"]], // Bình luận mới nhất xếp trước
    distinct: true, // Quan trọng khi dùng include hasMany để đếm đúng
  });
};

const updateComment = async (commentId, userId, updateData) => {
  const comment = await Comment.findByPk(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }
  // Chỉ chủ sở hữu mới được sửa comment
  if (comment.user_id !== userId) {
    throw new ApiError(403, "You are not authorized to update this comment");
  }
  await comment.update(updateData);
  return comment;
};

const deleteComment = async (commentId, userId, userRole) => {
  const comment = await Comment.findByPk(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }
  // Chủ sở hữu hoặc admin mới được xóa
  if (comment.user_id !== userId && userRole !== "admin") {
    throw new ApiError(403, "You are not authorized to delete this comment");
  }
  await comment.destroy();
  return { message: "Comment deleted successfully" };
};

module.exports = {
  createComment,
  getCommentsByRecipeId,
  updateComment,
  deleteComment,
};
