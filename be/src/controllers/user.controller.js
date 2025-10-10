const userService = require('../services/user.service');

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
            status: 'success',
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
        const { id } = req.params;
        const publicProfile = await userService.getUserProfile(id);
        
        res.status(200).json({
            status: 'success',
            data: publicProfile,
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    getCurrentUserProfile,
    getPublicUserProfile,
};