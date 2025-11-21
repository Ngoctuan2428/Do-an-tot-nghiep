const userService = require("../services/user.service");

/**
 * @desc    Lấy thông tin cá nhân của người dùng đang đăng nhập
 * @route   GET /api/users/me
 * @access  Private
 */
const getCurrentUserProfile = async (req, res, next) => {
  try {
    // req.user được gắn từ middleware xác thực
    const userId = req.user.id;

    // Gọi service để lấy thông tin chi tiết
    const userProfile = await userService.getUserProfile(userId);

    res.status(200).json({
      status: "success",
      data: userProfile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Lấy thông tin công khai của một người dùng khác
 * @route   GET /api/users/:id
 * @access  Public
 */
const getPublicUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params; // ID của chủ hồ sơ
    const currentUserId = req.user?.id || null; // ID của người đang xem (lấy từ token, có thể null)

    // ✅ Sửa lại: Truyền cả 2 ID xuống service
    const publicProfile = await userService.getUserProfile(id, currentUserId);

    res.status(200).json({
      status: "success",
      data: publicProfile,
    });
  } catch (error) {
    next(error);
  }
};

const toggleFollow = async (req, res, next) => {
  try {
    const followerId = req.user.id; // Lấy từ token người đang đăng nhập
    const followingId = req.params.id; // Lấy từ URL (người muốn follow)
    const result = await userService.toggleFollowUser(followerId, followingId);
    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    next(error);
  }
};

const getFollowers = async (req, res, next) => {
  try {
    const followers = await userService.getFollowersList(
      req.params.id,
      req.query
    );
    res.status(200).json({ status: "success", data: followers });
  } catch (error) {
    next(error);
  }
};

const getFollowing = async (req, res, next) => {
  try {
    const following = await userService.getFollowingList(
      req.params.id,
      req.query
    );
    res.status(200).json({ status: "success", data: following });
  } catch (error) {
    next(error);
  }
};

// ✅ CONTROLLER MỚI: Cập nhật profile bản thân
const updateCurrentUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const updatedUser = await userService.updateUserProfile(userId, req.body);
    res.status(200).json({ status: "success", data: updatedUser });
  } catch (error) {
    next(error);
  }
};

// ✅ CONTROLLER MỚI: Lấy thống kê (hỗ trợ cả /me/stats và /:id/stats)
const getUserStats = async (req, res, next) => {
  try {
    // Nếu có params.id thì lấy của người đó, nếu không thì lấy của chính mình (từ token)
    const userId = req.params.id || req.user?.id;
    const stats = await userService.getUserStats(userId);
    res.status(200).json({ status: "success", data: stats });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCurrentUserProfile,
  getPublicUserProfile,
  toggleFollow,
  getFollowers,
  getFollowing,
  updateCurrentUserProfile, // ✅ Export
  getUserStats, // ✅ Export
};
