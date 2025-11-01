// services/recipe.service.js
const { Recipe, User, Category, Tag, Challenge } = require('../models'); // 1. Thêm Challenge
const ApiError = require('../utils/ApiError');
const generateSlug = require('../utils/slugify');

/**
 * Đếm tổng số công thức
 */
const getRecipeCount = async () => {
    const count = await Recipe.count();
    return count;
};

const createRecipe = async (userId, recipeData) => {
    // 2. Thêm challengeIds vào
    const { title, categoryIds, tags, challengeIds, ...rest } = recipeData;
    const slug = generateSlug(title) + '-' + Date.now();
    const newRecipe = await Recipe.create({ user_id: userId, title, slug, ...rest });

    if (categoryIds && categoryIds.length > 0) await newRecipe.setCategories(categoryIds);
    if (tags && tags.length > 0) {
        const tagInstances = await Promise.all(tags.map(tagName => Tag.findOrCreate({ where: { name: tagName } })));
        await newRecipe.setTags(tagInstances.map(t => t[0]));
    }
    // 3. Thêm logic setChallenges
    if (challengeIds && challengeIds.length > 0) {
        await newRecipe.setChallenges(challengeIds);
    }
    
    return getRecipeById(newRecipe.id);
};

const getRecipeById = async (recipeId) => {
    const recipe = await Recipe.findByPk(recipeId, {
        include: [
            { model: User, attributes: ['id', 'username'] },
            { model: Category, through: { attributes: [] } },
            { model: Tag, through: { attributes: [] } },
            { model: Challenge, through: { attributes: [] }, as: 'challenges' } // 4. Include Challenge
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


const updateRecipe = async (recipeId, userId, userRole, updateData) => {
    const recipe = await getRecipeById(recipeId);
    
    if (recipe.user_id !== userId && userRole !== 'admin') {
        throw new ApiError(403, 'You are not authorized to update this recipe');
    }

    // 5. Thêm challengeIds vào
    const { categoryIds, tags, challengeIds, ...rest } = updateData;
    if (rest.title) rest.slug = generateSlug(rest.title) + '-' + Date.now();
    
    await recipe.update(rest);
    
    // Dùng 'if (varName)' thay vì 'if (varName && varName.length > 0)'
    // để cho phép gửi mảng rỗng (xóa hết)
    if (categoryIds) await recipe.setCategories(categoryIds);
    
    if (tags) {
        const tagInstances = await Promise.all(tags.map(tagName => Tag.findOrCreate({ where: { name: tagName } })));
        // 6. SỬA LỖI: Dùng 'recipe' (đối tượng đã lấy) thay vì 'newRecipe'
        await recipe.setTags(tagInstances.map(t => t[0]));
    }

    // 7. Thêm logic setChallenges
    if (challengeIds) {
        await recipe.setChallenges(challengeIds);
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

module.exports = { 
    getRecipeCount, 
    createRecipe, 
    getRecipeById, 
    getAllRecipes, 
    updateRecipe, 
    deleteRecipe 
};