const { User } = require('../models');
const ApiError = require('../utils/ApiError');

const getUserProfile = async (userId) => {
    const user = await User.findByPk(userId, {
        attributes: { exclude: ['password_hash'] }
    });
    if (!user) {
        throw new ApiError(404, 'User not found.');
    }
    return user;
};

// --- CẢI TIẾN ---
// Thêm logic phân trang đầy đủ
const getAllUsers = async (queryOptions) => {
    const { page = 1, limit = 10 } = queryOptions;
    const offset = (page - 1) * limit;

    return await User.findAndCountAll({
        attributes: { exclude: ['password_hash'] },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']],
    });
};

// --- CẢI TIẾN ---
// Cho phép admin cập nhật nhiều trường hơn
const updateUserById = async (userId, updateData) => {
    const user = await getUserProfile(userId); // Dùng lại hàm trên để kiểm tra user tồn tại
    
    // Admin có thể cập nhật các trường này
    const allowedUpdates = ['username', 'bio', 'role'];
    const updates = {};

    Object.keys(updateData).forEach(key => {
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
    return { message: 'User deleted successfully.' };
};


module.exports = {
    getUserProfile,
    getAllUsers,
    updateUserById,
    deleteUserById,
};