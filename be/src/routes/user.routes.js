const express = require("express");
const userController = require("../controllers/user.controller");
const { protect } = require("../middlewares/auth.middleware");

// 🔥 Middleware để check user nếu đã login (không bắt buộc)
const optionalAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    // Import jwt helper
    const jwtHelper = require("../utils/jwt.helper");
    const decoded = jwtHelper.verifyToken(token);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

const router = express.Router();

// Lấy thông tin của user đang đăng nhập
router.get("/me", protect, userController.getCurrentUserProfile);
router.put("/me", protect, userController.updateCurrentUserProfile); // ✅ Route cập nhật
router.get("/me/stats", protect, userController.getUserStats); // ✅ Route thống kê của tôi

// 🔥 THÊM optionalAuth để có thể check follow status khi load user
// Lấy thông tin công khai của một user bất kỳ bằng ID (có thể check follow nếu đã login)
router.get("/:id", optionalAuth, userController.getPublicUserProfile);

// POST /api/users/:id/follow -> Follow/Unfollow người có id là :id
router.post("/:id/follow", protect, userController.toggleFollow);

// GET /api/users/:id/followers -> Xem ai đang follow user này
router.get("/:id/followers", userController.getFollowers);

// GET /api/users/:id/following -> Xem user này đang follow ai
router.get("/:id/following", userController.getFollowing);

// GET /api/users/:id/stats -> Lấy số lượng follow/following
router.get("/:id/stats", userController.getUserStats); // ✅ Đổi getFollowStats thành getUserStats

module.exports = router;
