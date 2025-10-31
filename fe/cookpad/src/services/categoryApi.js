import axiosInstance from "./axiosClient";

/**
 * @typedef {Object} Category
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string} description
 * @property {string} imageUrl
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * Get all categories
 * @param {Object} params Query parameters for filtering and pagination
 */
export const getAllCategories = (params = {}) => {
  return axiosInstance.get("/categories", { params });
};

/**
 * Get category by ID
 * @param {string} id Category ID
 */
export const getCategoryById = (id) => {
  return axiosInstance.get(`/categories/${id}`);
};

/**
 * Get category by slug
 * @param {string} slug Category slug
 */
export const getCategoryBySlug = (slug) => {
  return axiosInstance.get(`/categories/slug/${slug}`);
};

/**
 * Get recipes by category
 * @param {string} categoryId Category ID
 * @param {Object} params Query parameters for filtering and pagination
 */
export const getRecipesByCategory = (categoryId, params = {}) => {
  return axiosInstance.get(`/categories/${categoryId}/recipes`, { params });
};

/**
 * Create new category (Admin only)
 * @param {Object} data Category data
 */
export const createCategory = (data) => {
  return axiosInstance.post("/categories", data);
};

/**
 * Update category (Admin only)
 * @param {string} id Category ID
 * @param {Object} data Updated category data
 */
export const updateCategory = (id, data) => {
  return axiosInstance.put(`/categories/${id}`, data);
};

/**
 * Delete category (Admin only)
 * @param {string} id Category ID
 */
export const deleteCategory = (id) => {
  return axiosInstance.delete(`/categories/${id}`);
};

/**
 * Get category statistics
 */
export const getCategoryStats = () => {
  return axiosInstance.get("/categories/stats");
};

/**
 * Get featured categories
 */
export const getFeaturedCategories = () => {
  return axiosInstance.get("/categories/featured");
};

/**
 * Get category suggestions based on user preferences
 */
export const getCategorySuggestions = () => {
  return axiosInstance.get("/categories/suggestions");
};

import { getAllCategories, getRecipesByCategory } from '../services/categoryApi';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [categoryRecipes, setCategoryRecipes] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = async (categoryId) => {
    try {
      const response = await getRecipesByCategory(categoryId, {
        page: 1,
        limit: 10
      });
      setCategoryRecipes(response.data);
    } catch (error) {
      console.error('Failed to fetch category recipes:', error);
    }
  };

  return (
    // Component JSX
  );
};
