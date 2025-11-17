// routes/recipe.routes.js

const express = require('express');
const recipeController = require('../controllers/recipe.controller');
const { protect } = require('../middlewares/auth.middleware');
const commentRouter = require('./comment.routes');

const router = express.Router();

// Gắn commentRouter vào recipeRouter
// Mọi request đến /:recipeId/comments sẽ được xử lý bởi commentRouter
// Đây là route động nhưng nó đủ khác biệt (vì có /comments)
router.use('/:recipeId/comments', commentRouter);

router.route('/')
    .get(recipeController.getAllRecipes) // Lấy danh sách công thức
    .post(protect, recipeController.createRecipe); // Tạo công thức mới

// =======================================================
// SỬA LỖI TẠI ĐÂY
// 1. Đặt route TĨNH (/counts) lên TRƯỚC
router.get('/counts', recipeController.getRecipeCount);

// 2. Đặt route ĐỘNG (/:id) ở SAU
router.route('/:id')
    .get(recipeController.getRecipeById) // Xem chi tiết công thức
    .patch(protect, recipeController.updateRecipe) // Cập nhật (chủ sở hữu)
    .delete(protect, recipeController.deleteRecipe); // Xóa (chủ sở hữu hoặc admin)
// =======================================================

module.exports = router;