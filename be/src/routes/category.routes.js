const express = require('express');
const categoryController = require('../controllers/category.controller');
// 1. Sửa 'isAdmin' thành 'restrictTo'
const { protect, restrictTo } = require('../middlewares/auth.middleware');

const router = express.Router();

router.route('/')
    .get(categoryController.getAllCategories) // Mọi người dùng đều có thể xem danh sách danh mục
    // 2. Sửa 'isAdmin' thành 'restrictTo('admin')'
    .post(protect, restrictTo('admin'), categoryController.createCategory); // Chỉ admin được tạo danh mục mới

router.route('/:id')
    .get(categoryController.getCategoryById) // Mọi người dùng đều có thể xem chi tiết
    // 3. Sửa 'isAdmin' thành 'restrictTo('admin')'
    .patch(protect, restrictTo('admin'), categoryController.updateCategory) // Chỉ admin được cập nhật
    // 4. Sửa 'isAdmin' thành 'restrictTo('admin')'
    .delete(protect, restrictTo('admin'), categoryController.deleteCategory); // Chỉ admin được xóa

module.exports = router;