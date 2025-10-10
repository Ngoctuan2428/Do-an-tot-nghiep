const express = require('express');
const commentController = require('../controllers/comment.controller');
const { protect } = require('../middlewares/auth.middleware');

// mergeParams: true cho phép truy cập params từ router cha (vd: :recipeId)
const router = express.Router({ mergeParams: true });

router.route('/')
    .get(commentController.getCommentsByRecipe) // Lấy comment của 1 recipe
    .post(protect, commentController.createComment); // Tạo comment (cần đăng nhập)

router.route('/:commentId')
    .patch(protect, commentController.updateComment) // Sửa comment (chủ sở hữu)
    .delete(protect, commentController.deleteComment); // Xóa comment (chủ sở hữu hoặc admin)

module.exports = router;