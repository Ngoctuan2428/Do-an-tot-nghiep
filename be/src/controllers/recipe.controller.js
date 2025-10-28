const recipeService = require('../services/recipe.service');

const getRecipeCount = async (req, res, next) => {
    try {
        const count = await recipeService.getRecipeCount();
        res.status(200).json({ status: 'success', data: { count } });
    } catch (error) {
        next(error);
    }
};
// =====================

const createRecipe = async (req, res, next) => {
    try {
        const newRecipe = await recipeService.createRecipe(req.user.id, req.body);
        res.status(201).json({ status: 'success', data: newRecipe });
    } catch (error) {
        next(error);
    }
};

const getAllRecipes = async (req, res, next) => {
    try {
        const recipes = await recipeService.getAllRecipes(req.query);
        res.status(200).json({ status: 'success', data: recipes });
    } catch (error) {
        next(error);
    }
};

const getRecipeById = async (req, res, next) => {
    try {
        const recipe = await recipeService.getRecipeById(req.params.id);
        res.status(200).json({ status: 'success', data: recipe });
    } catch (error) {
        next(error);
    }
};

const updateRecipe = async (req, res, next) => {
    try {
        const updatedRecipe = await recipeService.updateRecipe(req.params.id, req.user.id, req.user.role, req.body);
        
        res.status(200).json({ status: 'success', data: updatedRecipe });
    } catch (error) {
        next(error);
    }
};

const deleteRecipe = async (req, res, next) => {
    try {
        await recipeService.deleteRecipe(req.params.id, req.user.id, req.user.role);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getRecipeCount,
    createRecipe,
    getAllRecipes,
    getRecipeById,
    updateRecipe,
    deleteRecipe,
};