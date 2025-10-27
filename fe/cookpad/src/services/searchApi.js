import axiosInstance from "./axiosClient";

/**
 * @typedef {Object} SearchParams
 * @property {string} [keyword] - Search keyword/query
 * @property {string} [category] - Category filter
 * @property {string} [difficulty] - Difficulty level filter
 * @property {string} [sortBy] - Sort field
 * @property {number} [page] - Page number
 * @property {number} [limit] - Items per page
 */

/**
 * Search recipes with filters and pagination
 * @param {SearchParams} params
 */
export const searchRecipes = (params = {}) => {
  return axiosInstance.get("/search/recipes", { params });
};

/**
 * Get search suggestions/autocomplete
 * @param {string} keyword
 */
export const getSearchSuggestions = (keyword) => {
  return axiosInstance.get("/search/suggestions", {
    params: { keyword },
  });
};

/**
 * Search by category
 * @param {string} categorySlug
 * @param {SearchParams} params
 */
export const searchByCategory = (categorySlug, params = {}) => {
  return axiosInstance.get(`/categories/${categorySlug}/recipes`, { params });
};

/**
 * Search by tag
 * @param {string} tag
 * @param {SearchParams} params
 */
export const searchByTag = (tag, params = {}) => {
  return axiosInstance.get(`/tags/${tag}/recipes`, { params });
};

/**
 * Get trending searches
 */
export const getTrendingSearches = () => {
  return axiosInstance.get("/search/trending");
};

/**
 * Save search history
 * @param {string} keyword
 */
export const saveSearchHistory = (keyword) => {
  return axiosInstance.post("/search/history", { keyword });
};

/**
 * Get user's search history
 */
export const getSearchHistory = () => {
  return axiosInstance.get("/search/history");
};

/**
 * Clear search history
 */
export const clearSearchHistory = () => {
  return axiosInstance.delete("/search/history");
};
