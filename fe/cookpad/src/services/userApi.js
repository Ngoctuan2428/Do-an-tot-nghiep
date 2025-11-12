import axiosInstance from "./axiosClient";

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} username
 * @property {string} email
 * @property {string} avatarUrl
 * @property {string} bio
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * Get current authenticated user profile
 * @returns {Promise<AxiosResponse>}
 */
export const getCurrentUser = () => {
  return axiosInstance.get("/users/me"); // ⬅️ Sửa thành /users/me
};

/**
 * Get user by id
 * @param {string} userId
 * @returns {Promise<AxiosResponse>}
 */
export const getUserById = (userId) => {
  return axiosInstance.get(`/users/${userId}`);
};

/**
 * Update current user profile
 * @param {Object} data
 * @returns {Promise<AxiosResponse>}
 */
export const updateUser = (data) => {
  return axiosInstance.put("/users/me", data);
};

/**
 * Update another user (admin)
 * @param {string} userId
 * @param {Object} data
 * @returns {Promise<AxiosResponse>}
 */
export const updateUserById = (userId, data) => {
  return axiosInstance.put(`/users/${userId}`, data);
};

/**
 * Upload/change avatar for current user
 * @param {File} file
 * @returns {Promise<AxiosResponse>}
 */
export const uploadAvatar = (file) => {
  const form = new FormData();
  form.append("avatar", file);
  return axiosInstance.post("/users/me/avatar", form);
};

/**
 * Follow a user
 * @param {string} userId
 * @returns {Promise<AxiosResponse>}
 */
export const followUser = (userId) => {
  return axiosInstance.post(`/users/${userId}/follow`);
};

/**
 * Unfollow a user
 * @param {string} userId
 * @returns {Promise<AxiosResponse>}
 */
export const unfollowUser = (userId) => {
  return axiosInstance.post(`/users/${userId}/unfollow`);
};

/**
 * Get user's recipes (with optional params: page, limit, status)
 * @param {string} userId
 * @param {Object} params
 * @returns {Promise<AxiosResponse>}
 */
export const getUserRecipes = (userId, params = {}) => {
  return axiosInstance.get(`/users/${userId}/recipes`, { params });
};

/**
 * Get user's saved/favorite recipes
 * @param {string} userId
 * @param {Object} params
 * @returns {Promise<AxiosResponse>}
 */
export const getUserFavorites = (userId, params = {}) => {
  return axiosInstance.get(`/users/${userId}/favorites`, { params });
};

/**
 * Get followers list for a user
 * @param {string} userId
 * @param {Object} params
 * @returns {Promise<AxiosResponse>}
 */
export const getFollowers = (userId, params = {}) => {
  return axiosInstance.get(`/users/${userId}/followers`, { params });
};

/**
 * Get following list for a user
 * @param {string} userId
 * @param {Object} params
 * @returns {Promise<AxiosResponse>}
 */
export const getFollowing = (userId, params = {}) => {
  return axiosInstance.get(`/users/${userId}/following`, { params });
};

/**
 * Change password for current user
 * @param {Object} payload { currentPassword, newPassword }
 * @returns {Promise<AxiosResponse>}
 */
export const changePassword = (payload) => {
  return axiosInstance.post("/users/me/change-password", payload);
};

/**
 * Get basic user stats (recipes count, followers, following, etc.)
 * @param {string} userId
 * @returns {Promise<AxiosResponse>}
 */
export const getUserStats = (userId) => {
  return axiosInstance.get(`/users/${userId}/stats`);
};

/**
 * Search users by keyword
 * @param {string} keyword
 * @param {Object} params
 * @returns {Promise<AxiosResponse>}
 */
export const searchUsers = (keyword, params = {}) => {
  return axiosInstance.get("/users/search", {
    params: { q: keyword, ...params },
  });
};

/**
 * Admin: delete user by id
 * @param {string} userId
 * @returns {Promise<AxiosResponse>}
 */
export const deleteUserById = (userId) => {
  return axiosInstance.delete(`/users/${userId}`);
};

export default {
  getCurrentUser,
  getUserById,
  updateUser,
  updateUserById,
  uploadAvatar,
  followUser,
  unfollowUser,
  getUserRecipes,
  getUserFavorites,
  getFollowers,
  getFollowing,
  changePassword,
  getUserStats,
  searchUsers,
  deleteUserById,
};
