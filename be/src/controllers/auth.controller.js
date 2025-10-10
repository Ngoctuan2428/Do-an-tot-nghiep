// Giả định bạn sẽ tạo auth.service.js để xử lý logic
const authService = require('../services/auth.service');

/**
 * @desc    Đăng ký người dùng mới
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
    try {
        // Lấy username, email, password từ body của request
        const { username, email, password } = req.body;

        // Gọi service để xử lý nghiệp vụ đăng ký
        const { newUser, accessToken } = await authService.registerUser({ username, email, password });

        // Trả về response thành công
        res.status(201).json({
            status: 'success',
            message: 'User registered successfully.',
            data: {
                user: newUser,
                accessToken,
            },
        });
    } catch (error) {
        // Chuyển lỗi cho middleware xử lý lỗi tập trung
        next(error);
    }
};

/**
 * @desc    Đăng nhập
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Gọi service để xử lý nghiệp vụ đăng nhập
        const { user, accessToken } = await authService.loginUser({ email, password });

        res.status(200).json({
            status: 'success',
            message: 'User logged in successfully.',
            data: {
                user,
                accessToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
};