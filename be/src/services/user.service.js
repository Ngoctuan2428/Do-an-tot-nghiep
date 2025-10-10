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

// Hàm này cho admin
const getAllUsers = async (queryOptions) => {
    // Thêm logic phân trang...
    return await User.findAll({ attributes: { exclude: ['password_hash'] } });
};

// Hàm này cho admin
const updateUserById = async (userId, updateData) => {
    const user = await getUserProfile(userId); // Dùng lại hàm trên để kiểm tra user tồn tại
    
    // Chỉ cho phép admin cập nhật các trường nhất định, ví dụ: role
    const { role } = updateData;
    if (role) {
        user.role = role;
    }
    await user.save();
    return user;
};


module.exports = {
    getUserProfile,
    getAllUsers,
    updateUserById
};