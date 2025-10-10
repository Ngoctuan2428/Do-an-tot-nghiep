const ApiError = require("../utils/ApiError");

const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = 'Internal Server Error';

    // Nếu lỗi là một instance của class ApiError (lỗi có chủ đích)
    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
    } else {
        // Nếu là lỗi không xác định, log ra để dev biết
        // Không nên gửi chi tiết lỗi cho client ở môi trường production
        console.error('UNHANDLED ERROR:', err);
    }

    res.status(statusCode).json({
        status: 'error',
        message: message,
        // Chỉ gửi stack trace khi đang ở môi trường dev
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

module.exports = errorHandler;