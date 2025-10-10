const jwt = require('jsonwebtoken');
const config = require('../config/environment');
const { User } = require('../models'); // Import từ /models/index.js
const ApiError = require('../utils/ApiError'); // Import class lỗi tùy chỉnh

/**
 * @desc Middleware để bảo vệ route. Kiểm tra JWT token có hợp lệ không.
 */
const protect = async (req, res, next) => {
    let token;

    // 1. Lấy token từ header "Authorization: Bearer <token>"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new ApiError(401, 'You are not logged in! Please log in to get access.'));
    }

    try {
        // 2. Xác thực token
        const decoded = jwt.verify(token, config.jwt.secret);

        // 3. Kiểm tra xem người dùng ứng với token có còn tồn tại không
        const currentUser = await User.findByPk(decoded.id, {
            attributes: { exclude: ['password_hash'] } // Không lấy mật khẩu
        });

        if (!currentUser) {
            return next(new ApiError(401, 'The user belonging to this token does no longer exist.'));
        }

        // 4. Gắn thông tin người dùng vào đối tượng request để các xử lý sau có thể sử dụng
        req.user = currentUser;
        next(); // Chuyển sang middleware/controller tiếp theo
    } catch (error) {
        return next(new ApiError(401, 'Invalid token. Please log in again.'));
    }
};

/**
 * @desc Middleware để kiểm tra vai trò admin
 */
const isAdmin = (req, res, next) => {
    // Middleware này phải được dùng SAU middleware 'protect'
    if (req.user && req.user.role === 'admin') {
        next(); // Nếu là admin, cho qua
    } else {
        return next(new ApiError(403, 'Access denied. You do not have permission to perform this action.'));
    }
};


module.exports = {
    protect,
    isAdmin,
};