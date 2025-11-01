const express = require('express');
const adminController = require('../controllers/admin.controller');
// 1. Sửa 'isAdmin' thành 'restrictTo'
const { protect, restrictTo } = require('../middlewares/auth.middleware');

const router = express.Router();

// Yêu cầu tất cả các route trong file này phải đăng nhập và là admin
// 2. Sửa 'isAdmin' thành 'restrictTo('admin')'
router.use(protect, restrictTo('admin'));

// Quản lý người dùng
router.route('/users')
    .get(adminController.getAllUsers);

router.route('/users/:id')
    .patch(adminController.updateUser)
    .delete(adminController.deleteUser);
    
// Admin cũng có thể xóa bất kỳ công thức nào
router.delete('/recipes/:id', adminController.deleteRecipeAdmin);

module.exports = router;