const express = require('express');
const recipeController = require('../controllers/recipe.controller');
const { protect } = require('../middlewares/auth.middleware');
const commentRouter = require('./comment.routes'); // Import router của comment

const router = express.Router();

// Gắn commentRouter vào recipeRouter
// Mọi request đến /:recipeId/comments sẽ được xử lý bởi commentRouter
router.use('/:recipeId/comments', commentRouter);

router.route('/')
    .get(recipeController.getAllRecipes) // Lấy danh sách công thức
    .post(protect, recipeController.createRecipe); // Tạo công thức mới

router.route('/:id')
    .get(recipeController.getRecipeById) // Xem chi tiết công thức
    .patch(protect, recipeController.updateRecipe) // Cập nhật (chủ sở hữu)
    .delete(protect, recipeController.deleteRecipe); // Xóa (chủ sở hữu hoặc admin)

module.exports = router;