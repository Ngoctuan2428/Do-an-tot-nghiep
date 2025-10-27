const { Recipe, User, Category, Tag } = require('../models');
const ApiError = require('../utils/ApiError');
const generateSlug = require('../utils/slugify');

const createRecipe = async (userId, recipeData) => {
    const { title, categoryIds, tags, ...rest } = recipeData;
    const slug = generateSlug(title) + '-' + Date.now();
    const newRecipe = await Recipe.create({ user_id: userId, title, slug, ...rest });

    if (categoryIds && categoryIds.length > 0) await newRecipe.setCategories(categoryIds);
    if (tags && tags.length > 0) {
        const tagInstances = await Promise.all(tags.map(tagName => Tag.findOrCreate({ where: { name: tagName } })));
        await newRecipe.setTags(tagInstances.map(t => t[0]));
    }
    return getRecipeById(newRecipe.id);
};

const getRecipeById = async (recipeId) => {
    const recipe = await Recipe.findByPk(recipeId, {
        include: [
            { model: User, attributes: ['id', 'username'] },
            { model: Category, through: { attributes: [] } },
            { model: Tag, through: { attributes: [] } }
        ]
    });
    if (!recipe) throw new ApiError(404, 'Recipe not found');
    return recipe;
};

const getAllRecipes = async (queryOptions) => {
    const { page = 1, limit = 10 } = queryOptions;
    const offset = (page - 1) * limit;
    return await Recipe.findAndCountAll({
        limit: parseInt(limit),
        offset: parseInt(offset),
        include: [{ model: User, attributes: ['id', 'username'] }],
        order: [['created_at', 'DESC']]
    });
};


// Thêm `userRole` vào tham số của hàm
const updateRecipe = async (recipeId, userId, userRole, updateData) => {
    const recipe = await getRecipeById(recipeId);
    
    //Nếu user không phải chủ sở hữu VÀ cũng không phải admin -> báo lỗi
    if (recipe.user_id !== userId && userRole !== 'admin') {
        throw new ApiError(403, 'You are not authorized to update this recipe');
    }

    const { categoryIds, tags, ...rest } = updateData;
    if (rest.title) rest.slug = generateSlug(rest.title) + '-' + Date.now();
    
    await recipe.update(rest);
    if (categoryIds) await recipe.setCategories(categoryIds);
    if (tags) {
        const tagInstances = await Promise.all(tags.map(tagName => Tag.findOrCreate({ where: { name: tagName } })));
        await recipe.setTags(tagInstances.map(t => t[0]));
    }
    return getRecipeById(recipeId);
};

const deleteRecipe = async (recipeId, userId, userRole) => {
    const recipe = await getRecipeById(recipeId);
    if (userRole !== 'admin' && recipe.user_id !== userId) {
        throw new ApiError(403, 'You are not authorized to delete this recipe');
    }
    await recipe.destroy();
    return { message: 'Recipe deleted successfully' };
};

module.exports = { createRecipe, getRecipeById, getAllRecipes, updateRecipe, deleteRecipe };