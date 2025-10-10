const userService = require('../services/user.service');
const recipeService = require('../services/recipe.service');
// Bạn có thể tạo một adminService riêng nếu logic phức tạp
// const adminService = require('../services/admin.service'); 

/**
 * @desc    (Admin) Lấy danh sách tất cả người dùng
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
const getAllUsers = async (req, res, next) => {
    try {
        const queryOptions = req.query; // Để phân trang, sắp xếp...
        const users = await userService.getAllUsers(queryOptions);

        res.status(200).json({
            status: 'success',
            data: users,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    (Admin) Cập nhật thông tin hoặc vai trò của người dùng
 * @route   PATCH /api/admin/users/:id
 * @access  Private/Admin
 */
const updateUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const updateData = req.body; // vd: { role: 'admin' } hoặc { isActive: false }

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

/**
 * @desc    (Admin) Xóa một người dùng
 * @route   DELETE /api/admin/users/:id
 * @access  Private/Admin
 */
const deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        await userService.deleteUserById(userId);

        res.status(204).json({ // 204 No Content là response chuẩn cho việc xóa thành công
            status: 'success',
            message: `User ${userId} deleted successfully.`,
            data: null
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    (Admin) Lấy tất cả công thức (bao gồm cả bản nháp, riêng tư)
 * @route   GET /api/admin/recipes
 * @access  Private/Admin
 */
const getAllRecipesAdmin = async (req, res, next) => {
    try {
        const queryOptions = req.query;
        // Gọi một hàm service đặc biệt cho admin
        const recipes = await recipeService.getAllRecipesAdmin(queryOptions); 
        
        res.status(200).json({
            status: 'success',
            data: recipes,
        });
    } catch(error) {
        next(error);
    }
}

/**
 * @desc    (Admin) Xóa bất kỳ công thức nào
 * @route   DELETE /api/admin/recipes/:id
 * @access  Private/Admin
 */
const deleteRecipeAdmin = async (req, res, next) => {
    try {
        const recipeId = req.params.id;
        await recipeService.deleteRecipeById(recipeId);

        res.status(204).json({
            status: 'success',
            message: `Recipe ${recipeId} deleted successfully.`,
            data: null,
        });
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