const express = require("express");
const userController = require("../controllers/user.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

// Lấy thông tin của user đang đăng nhập
router.get("/me", protect, userController.getCurrentUserProfile);
router.put("/me", protect, userController.updateCurrentUserProfile); // ✅ Route cập nhật
router.get("/me/stats", protect, userController.getUserStats); // ✅ Route thống kê của tôi

// Lấy thông tin công khai của một user bất kỳ bằng ID
router.get("/:id", userController.getPublicUserProfile);

// POST /api/users/:id/follow -> Follow/Unfollow người có id là :id
router.post("/:id/follow", protect, userController.toggleFollow);

// GET /api/users/:id/followers -> Xem ai đang follow user này
router.get("/:id/followers", userController.getFollowers);

// GET /api/users/:id/following -> Xem user này đang follow ai
router.get("/:id/following", userController.getFollowing);

// GET /api/users/:id/stats -> Lấy số lượng follow/following
router.get("/:id/stats", userController.getUserStats); // ✅ Đổi getFollowStats thành getUserStats

// Lấy thông tin công khai (Đặt route này cuối cùng để tránh xung đột)
router.get("/:id", userController.getPublicUserProfile);

module.exports = router;
