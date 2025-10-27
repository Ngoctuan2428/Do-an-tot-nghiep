import axiosInstance from "./axiosClient";

/**
 * @typedef {Object} Comment
 * @property {string} id
 * @property {string} content
 * @property {string} userId
 * @property {string} recipeId
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} CommentPayload
 * @property {string} content
 * @property {string} recipeId
 */

// Get comments for a recipe
export const getRecipeComments = (recipeId) => {
  return axiosInstance.get(`/recipes/${recipeId}/comments`);
};

// Create a new comment
export const createComment = (data) => {
  return axiosInstance.post(`/recipes/${data.recipeId}/comments`, data);
};

// Update a comment
export const updateComment = (commentId, data) => {
  return axiosInstance.put(`/comments/${commentId}`, data);
};

// Delete a comment
export const deleteComment = (commentId) => {
  return axiosInstance.delete(`/comments/${commentId}`);
};

// Get replies for a comment
export const getCommentReplies = (commentId) => {
  return axiosInstance.get(`/comments/${commentId}/replies`);
};

// Create a reply to a comment
export const createReply = (commentId, data) => {
  return axiosInstance.post(`/comments/${commentId}/replies`, data);
};

// Like/unlike a comment
export const toggleCommentLike = (commentId) => {
  return axiosInstance.post(`/comments/${commentId}/like`);
};

// Get comment counts for a recipe
export const getCommentCounts = (recipeId) => {
  return axiosInstance.get(`/recipes/${recipeId}/comments/count`);
};

import { getRecipeComments, createComment } from "../services/commentApi";

// Trong component
const fetchComments = async () => {
  try {
    const response = await getRecipeComments(recipeId);
    setComments(response.data);
  } catch (error) {
    console.error("Failed to fetch comments:", error);
  }
};

const handleAddComment = async (content) => {
  try {
    await createComment({
      recipeId,
      content,
    });
    await fetchComments(); // Refresh comments
  } catch (error) {
    console.error("Failed to add comment:", error);
  }
};
