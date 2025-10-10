const Joi = require('joi');

// Định nghĩa các quy tắc cho việc đăng ký
const registerSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

// Định nghĩa các quy tắc cho việc đăng nhập
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

module.exports = {
    registerSchema,
    loginSchema,
};