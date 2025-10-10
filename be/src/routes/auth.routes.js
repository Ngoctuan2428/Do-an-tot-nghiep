const express = require('express');
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validator.middleware');
const { registerSchema, loginSchema } = require('../validations/auth.validation'); // Giả định bạn đã tạo file này

const router = express.Router();

// Sử dụng middleware validate để kiểm tra req.body trước khi tới controller
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);

module.exports = router;