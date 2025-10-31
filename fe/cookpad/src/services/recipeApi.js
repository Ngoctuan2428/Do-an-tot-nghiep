import axiosInstance from "./axiosClient";

/**
 * @typedef {Object} Recipe
 * @property {string} id
 * @property {string} title
 * @property {string} description
 */

/**
 * @typedef {Object} RecipePayload
 * @property {string} title
 * @property {string} description
 * @property {string[]} ingredients
 * @property {string[]} steps
 */

// Recipe APIs
export const getAllRecipes = (params = {}) => {
  return axiosInstance.get("/recipes", { params });
};

export const getSavedRecipes = () => {
  return axiosInstance.get("/recipes/saved");
};

export const getCookedRecipes = () => {
  return axiosInstance.get("/recipes/cooked");
};

export const getMyRecipes = () => {
  return axiosInstance.get("/recipes/mine");
};

export const getPublishedRecipes = () => {
  return axiosInstance.get("/recipes/published");
};

export const getDraftRecipes = () => {
  return axiosInstance.get("/recipes/drafts");
};

// CRUD operations
export const getRecipeById = (id) => {
  return axiosInstance.get(`/recipes/${id}`);
};

export const createRecipe = (data) => {
  return axiosInstance.post("/recipes", data);
};

export const updateRecipe = (id, data) => {
  return axiosInstance.put(`/recipes/${id}`, data);
};

export const deleteRecipe = (id) => {
  return axiosInstance.delete(`/recipes/${id}`);
};

// Recipe actions
export const saveRecipe = (id) => {
  return axiosInstance.post(`/recipes/${id}/save`);
};

export const markAsCooked = (id) => {
  return axiosInstance.post(`/recipes/${id}/cook`);
};

export const publishRecipe = (id) => {
  return axiosInstance.post(`/recipes/${id}/publish`);
};

export const unpublishRecipe = (id) => {
  return axiosInstance.post(`/recipes/${id}/unpublish`);
};

// Recipe stats/counts
export const getRecipeCounts = () => {
  return axiosInstance.get("/recipes/counts");
};
