// src/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');
const config = require('../config/environment');
const { User } = require('../models'); // Import từ /models/index.js
const ApiError = require('../utils/ApiError'); // Import class lỗi tùy chỉnh

/**
 * @desc Middleware để bảo vệ route. Kiểm tra JWT token có hợp lệ không.
 * (Hàm này của bạn đã đúng, giữ nguyên)
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

        // 4. Gắn thông tin người dùng vào đối tượng request
        req.user = currentUser;
        next(); // Chuyển sang middleware/controller tiếp theo
    } catch (error) {
        return next(new ApiError(401, 'Invalid token. Please log in again.'));
    }
};


/**
 * @desc Middleware để giới hạn vai trò (role)
 * @param  {...string} roles - Danh sách các vai trò được phép (vd: 'admin', 'user')
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles là một mảng (ví dụ: ['admin'] khi gọi restrictTo('admin'))
    // req.user.role được lấy từ middleware 'protect' ở trên
    if (!roles.includes(req.user.role)) {
      // Nếu vai trò của user (vd: 'user') không nằm trong mảng roles (vd: ['admin'])
      return next(
        new ApiError(403, 'You do not have permission to perform this action')
      );
    }
    // Nếu vai trò hợp lệ, cho qua
    next();
  };
};

module.exports = {
    protect,
    restrictTo, // Sửa 'isAdmin' thành 'restrictTo'
};