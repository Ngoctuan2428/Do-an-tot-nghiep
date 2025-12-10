// src/routes/auth.routes.js
const express = require("express");
const passport = require("passport"); // ⬅️ Thêm passport
const authController = require("../controllers/auth.controller");
const validate = require("../middlewares/validator.middleware");
const {
  registerSchema,
  loginSchema,
} = require("../validations/auth.validation");

const router = express.Router();

// Routes đăng ký, đăng nhập cũ
router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);

// ---- ⬇️ THÊM CÁC ROUTE MỚI CHO GOOGLE VÀ FACEBOOK ----

// --- GOOGLE ---
// Bước 1: FE gọi link này -> điều hướng sang Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false, // Không dùng session
    prompt: "select_account",
  })
);

// Bước 2: Google redirect về đây sau khi user đăng nhập
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect:
      process.env.FRONTEND_URL || "http://localhost:5173/login-failed", // ⬅️ Sửa link FE
    session: false,
  }),
  authController.socialLoginCallback // ⬅️ Hàm controller mới
);

// --- FACEBOOK ---
router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["email", "public_profile"],
    session: false,
  })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect:
      process.env.FRONTEND_URL || "http://localhost:5173/login-failed", // ⬅️ Sửa link FE
    session: false,
  }),
  authController.socialLoginCallback // ⬅️ Dùng chung hàm
);

// ✅ Route gửi yêu cầu quên mật khẩu
router.post("/forgot-password", authController.forgotPassword);

// ✅ Route đặt lại mật khẩu (có ID và Token trên URL)
router.post("/reset-password/:id/:token", authController.resetPassword);

module.exports = router;
