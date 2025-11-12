const { User, Follow, Recipe } = require("../models"); // ✅ Đảm bảo import đủ User, Follow, Recipe
const ApiError = require("../utils/ApiError");

const getUserProfile = async (targetUserId, currentUserId = null) => {
  const user = await User.findByPk(targetUserId, {
    attributes: { exclude: ["password_hash"] },
  });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  // Nếu người xem đã đăng nhập (có currentUserId)
  if (currentUserId) {
    // Kiểm tra xem có đang follow không
    const isFollowing = await Follow.count({
      where: {
        follower_id: currentUserId,
        following_id: targetUserId,
      },
    });
    // Gán cờ is_following vào kết quả trả về
    user.dataValues.is_following = isFollowing > 0;
  }

  return user;
};

// --- CẢI TIẾN ---
// Thêm logic phân trang đầy đủ
const getAllUsers = async (queryOptions) => {
  const { page = 1, limit = 10 } = queryOptions;
  const offset = (page - 1) * limit;

  return await User.findAndCountAll({
    attributes: { exclude: ["password_hash"] },
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [["created_at", "DESC"]],
  });
};

// --- CẢI TIẾN ---
// Cho phép admin cập nhật nhiều trường hơn
const updateUserById = async (userId, updateData) => {
  const user = await getUserProfile(userId); // Dùng lại hàm trên để kiểm tra user tồn tại

  // Admin có thể cập nhật các trường này
  const allowedUpdates = ["username", "bio", "role"];
  const updates = {};

  Object.keys(updateData).forEach((key) => {
    if (allowedUpdates.includes(key)) {
      updates[key] = updateData[key];
    }
  });

  await user.update(updates);
  return user;
};

const deleteUserById = async (userId) => {
  const user = await getUserProfile(userId);
  await user.destroy();
  return { message: "User deleted successfully." };
};

const toggleFollowUser = async (followerId, followingId) => {
  if (parseInt(followerId) === parseInt(followingId)) {
    throw new ApiError(400, "You cannot follow yourself.");
  }

  // Kiểm tra người được follow có tồn tại không
  const targetUser = await User.findByPk(followingId);
  if (!targetUser) throw new ApiError(404, "User not found.");

  const existingFollow = await Follow.findOne({
    where: {
      follower_id: followerId,
      following_id: followingId,
    },
  });

  if (existingFollow) {
    await existingFollow.destroy();
    return { is_following: false };
  } else {
    await Follow.create({
      follower_id: followerId,
      following_id: followingId,
    });
    return { is_following: true };
  }
};

/**
 * Lấy danh sách những người mà userId đang theo dõi
 */
const getFollowingList = async (userId, query) => {
  const { page = 1, limit = 20 } = query;
  const offset = (page - 1) * limit;

  const user = await User.findByPk(userId);
  if (!user) throw new ApiError(404, "User not found.");

  const following = await user.getFollowing({
    limit: parseInt(limit),
    offset: parseInt(offset),
    attributes: ["id", "username", "avatar_url", "bio"], // Chỉ lấy thông tin cần thiết
    joinTableAttributes: [], // Không lấy thông tin bảng trung gian
  });

  return following;
};

/**
 * Lấy danh sách những người đang theo dõi userId
 */
const getFollowersList = async (userId, query) => {
  const { page = 1, limit = 20 } = query;
  const offset = (page - 1) * limit;

  const user = await User.findByPk(userId);
  if (!user) throw new ApiError(404, "User not found.");

  const followers = await user.getFollowers({
    limit: parseInt(limit),
    offset: parseInt(offset),
    attributes: ["id", "username", "avatar_url", "bio"],
    joinTableAttributes: [],
  });

  return followers;
};

// ✅ 2. CẬP NHẬT HÀM THỐNG KÊ (Thay thế hàm getUserFollowStats cũ nếu có)
const getUserStats = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) throw new ApiError(404, "User not found.");

  // Lấy song song 3 chỉ số
  const [recipes, followers, following] = await Promise.all([
    Recipe.count({ where: { user_id: userId } }),
    user.countFollowers(),
    user.countFollowing(),
  ]);

  return { recipes, followers, following };
};

// ✅ 1. HÀM MỚI: Người dùng tự cập nhật profile
const updateUserProfile = async (userId, updateData) => {
  const user = await User.findByPk(userId);
  if (!user) throw new ApiError(404, "User not found.");

  // Chỉ cho phép cập nhật các trường an toàn
  const { bio, avatar_url, username } = updateData;
  await user.update({ bio, avatar_url, username });
  return user;
};

module.exports = {
  getUserProfile,
  getAllUsers,
  updateUserById,
  deleteUserById,
  toggleFollowUser, // Mới
  getFollowingList, // Mới
  getFollowersList, // Mới
  updateUserProfile, // ✅ Export mới
  getUserStats, // ✅ Export mới (thay cho getUserFollowStats)
};
