// src/services/commentApi.js
import axiosClient from "./axiosClient";

/**
 * Lấy danh sách bình luận của một công thức
 * GET /api/recipes/:recipeId/comments
 */
export const getComments = (recipeId, params = {}) => {
  return axiosClient.get(`/recipes/${recipeId}/comments`, { params });
};

/**
 * Gửi bình luận mới
 * POST /api/recipes/:recipeId/comments
 */
export const createComment = (recipeId, data) => {
  return axiosClient.post(`/recipes/${recipeId}/comments`, data);
};

// (Các hàm update/delete nếu cần sau này)
export const deleteComment = (recipeId, commentId) => {
  return axiosClient.delete(`/recipes/${recipeId}/comments/${commentId}`);
};

export default {
  getComments,
  createComment,
  deleteComment,
};
