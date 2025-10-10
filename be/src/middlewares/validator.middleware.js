const Joi = require('joi');
const ApiError = require('../utils/ApiError');

/**
 * Middleware để kiểm tra dữ liệu của req.body dựa trên một Joi schema.
 * @param {Joi.ObjectSchema} schema - Schema của Joi để kiểm tra.
 */
const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
        abortEarly: false, // Báo cáo tất cả các lỗi thay vì dừng ở lỗi đầu tiên
        allowUnknown: true, // Cho phép các trường không được định nghĩa trong schema
    });

    if (error) {
        // Nếu có lỗi validation, tạo một message lỗi rõ ràng từ Joi
        const errorMessage = error.details.map((details) => details.message).join(', ');
        // Trả về lỗi 400 Bad Request
        return next(new ApiError(400, errorMessage));
    }

    // Nếu dữ liệu hợp lệ, gán giá trị đã được Joi làm sạch vào req.body và tiếp tục
    req.body = value;
    return next();
};

module.exports = validate;