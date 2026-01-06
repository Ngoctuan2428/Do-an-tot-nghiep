const express = require('express');
const router = express.Router();
const cooksnapController = require('../controllers/cooksnap.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// --- PUBLIC ROUTES (Ai cũng xem được) ---

// GET: /api/cooksnaps/recipe/:recipeId 
// Lấy danh sách cooksnap của một công thức cụ thể
router.get('/recipe/:recipeId', cooksnapController.getCooksnapsByRecipe);

// GET: /api/cooksnaps/:id
// Xem chi tiết một cooksnap cụ thể
router.get('/:id', cooksnapController.getCooksnapById);


// --- PROTECTED ROUTES (Cần đăng nhập) ---
// Lưu ý: Đã đổi authMiddleware.verifyToken thành authMiddleware.protect

// POST: /api/cooksnaps 
// Tạo mới Cooksnap (Thường kèm theo upload ảnh từ client)
router.post('/', 
    authMiddleware.protect, // <--- Sửa ở đây
    cooksnapController.createCooksnap
);

// PUT: /api/cooksnaps/:id
// Cập nhật Cooksnap (Sửa caption, đổi ảnh...)
router.put('/:id', 
    authMiddleware.protect, // <--- Sửa ở đây
    cooksnapController.updateCooksnap
);

// DELETE: /api/cooksnaps/:id
// Xóa Cooksnap
router.delete('/:id', 
    authMiddleware.protect, // <--- Sửa ở đây
    cooksnapController.deleteCooksnap
);

// POST: /api/cooksnaps/:id/like
// Like hoặc Unlike Cooksnap
router.post('/:id/like', 
    authMiddleware.protect, // <--- Sửa ở đây
    cooksnapController.toggleLikeCooksnap
);

module.exports = router;