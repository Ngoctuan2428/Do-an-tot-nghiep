const { Category } = require('../models');
const ApiError = require('../utils/ApiError');
const generateSlug = require('../utils/slugify');

const createCategory = async (categoryData) => {
    const { name, description, image_url } = categoryData;
    const slug = generateSlug(name);
    return await Category.create({ name, slug, description, image_url });
};

const getAllCategories = async () => {
    return await Category.findAll();
};

const getCategoryById = async (categoryId) => {
    const category = await Category.findByPk(categoryId);
    if (!category) {
        throw new ApiError(404, 'Category not found');
    }
    return category;
};

const updateCategory = async (categoryId, updateData) => {
    const category = await getCategoryById(categoryId); // Dùng lại hàm trên để kiểm tra

    // Nếu tên danh mục thay đổi, tạo lại slug
    if (updateData.name) {
        updateData.slug = generateSlug(updateData.name);
    }

    await category.update(updateData);
    return category;
};

const deleteCategory = async (categoryId) => {
    const category = await getCategoryById(categoryId);
    await category.destroy();
    return { message: 'Category deleted successfully.' };
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};