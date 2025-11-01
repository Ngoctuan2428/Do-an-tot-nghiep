// src/routes/auth.routes.js

const express = require('express');
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validator.middleware');
const { registerSchema, loginSchema } = require('../validations/auth.validation');

// --- THÊM CÁC IMPORT CHO GOOGLE OAUTH ---
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/environment'); // Import file config của bạn
// ----------------------------------------

const router = express.Router();

// === CÁC ROUTE LOCAL (Email/Password) ===
// (Đây là code cũ của bạn, giữ nguyên)
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);

// ===================================
// ⚡ GOOGLE OAUTH ROUTES (THÊM MỚI)
// ===================================

// Route 1: Khi người dùng nhấn nút "Tiếp tục với Google"
// (Frontend sẽ gọi GET /api/auth/google)
// Passport sẽ tự động chuyển hướng người dùng sang trang đăng nhập của Google.
router.get(
  '/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'], // Yêu cầu Google trả về profile và email
    session: false // Chúng ta dùng JWT, không dùng session
  })
);

// Route 2: Route Callback (Google gọi lại sau khi đăng nhập thành công)
// URL này (GET /api/auth/google/callback) phải khớp với URL bạn đã đăng ký trên Google Console
router.get(
  '/google/callback',
  passport.authenticate('google', { 
    // Nếu thất bại, chuyển hướng về trang login-failed của frontend
    failureRedirect: `${config.clientUrl}/login-failed`, 
    session: false 
  }),
  (req, res) => {
    // ĐÃ XÁC THỰC THÀNH CÔNG!
    // 'req.user' bây giờ chính là user (đã tìm thấy hoặc vừa tạo mới bởi passport.config.js)

    // 1. Tạo JWT Token cho user này
    const token = jwt.sign(
      { id: req.user.id, role: req.user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    // 2. Gửi token này về cho Frontend qua query param
    // (Frontend sẽ đọc token từ URL: /login-success?token=...)
    res.redirect(`${config.clientUrl}/login-success?token=${token}`);
  }
);

module.exports = router;