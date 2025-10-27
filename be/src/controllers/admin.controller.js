const userService = require('../services/user.service');
const recipeService = require('../services/recipe.service');

const getAllUsers = async (req, res, next) => {
    try {
        const queryOptions = req.query;
        const users = await userService.getAllUsers(queryOptions);
        res.status(200).json({ status: 'success', data: users });
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const updateData = req.body;
        const updatedUser = await userService.updateUserById(userId, updateData);
        res.status(200).json({
            status: 'success',
            message: `User ${userId} updated successfully.`,
            data: updatedUser,
        });
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        await userService.deleteUserById(userId);
        // Sửa lại: Chuẩn response cho 204 là không có body
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

const getAllRecipesAdmin = async (req, res, next) => {
    try {
        const queryOptions = req.query;
        // Bây giờ hàm này đã tồn tại trong service
        const recipes = await recipeService.getAllRecipesAdmin(queryOptions); 
        res.status(200).json({ status: 'success', data: recipes });
    } catch(error) {
        next(error);
    }
}

const deleteRecipeAdmin = async (req, res, next) => {
    try {
        // Sửa lại: Gọi đúng hàm deleteRecipe và truyền đủ tham số
        await recipeService.deleteRecipe(
            req.params.id, 
            req.user.id, 
            req.user.role
        );
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllUsers,
    updateUser,
    deleteUser,
    getAllRecipesAdmin,
    deleteRecipeAdmin,
};