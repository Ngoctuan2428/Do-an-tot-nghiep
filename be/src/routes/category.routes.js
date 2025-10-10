const express = require('express');
const categoryController = require('../controllers/category.controller');
const { protect, isAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

router.route('/')
    .get(categoryController.getAllCategories) // Mọi người dùng đều có thể xem danh sách danh mục
    .post(protect, isAdmin, categoryController.createCategory); // Chỉ admin được tạo danh mục mới

router.route('/:id')
    .get(categoryController.getCategoryById) // Mọi người dùng đều có thể xem chi tiết
    .patch(protect, isAdmin, categoryController.updateCategory) // Chỉ admin được cập nhật
    .delete(protect, isAdmin, categoryController.deleteCategory); // Chỉ admin được xóa

module.exports = router;