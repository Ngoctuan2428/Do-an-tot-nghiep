// src/routes/challenge.routes.js
const express = require('express');
const challengeController = require('../controllers/challenge.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

const router = express.Router();

// === Route công khai cho người dùng ===

// GET /api/challenges
// Lấy danh sách tất cả thử thách (đang diễn ra, sắp diễn ra)
router.get('/', challengeController.getAllChallenges);

// GET /api/challenges/:id
// Lấy chi tiết 1 thử thách
router.get('/:id', challengeController.getChallengeDetails);

// GET /api/challenges/:id/recipes
// Lấy danh sách món ăn đã tham gia thử thách này (có phân trang)
router.get('/:id/recipes', challengeController.getRecipesForChallenge);


// === Route cho Admin (tạo/sửa/xóa thử thách) ===
router.use(protect, restrictTo('admin'));

// POST /api/challenges
router.post('/', challengeController.createChallenge);

// PATCH /api/challenges/:id
router.patch('/:id', challengeController.updateChallenge);

// DELETE /api/challenges/:id
router.delete('/:id', challengeController.deleteChallenge);

module.exports = router;