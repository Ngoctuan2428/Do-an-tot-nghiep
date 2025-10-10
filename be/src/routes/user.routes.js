const express = require('express');
const userController = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

// Lấy thông tin của user đang đăng nhập
router.get('/me', protect, userController.getCurrentUserProfile);

// Lấy thông tin công khai của một user bất kỳ bằng ID
router.get('/:id', userController.getPublicUserProfile);

module.exports = router;