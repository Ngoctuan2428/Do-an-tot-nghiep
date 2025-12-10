// Giả định bạn sẽ tạo auth.service.js để xử lý logic
const authService = require("../services/auth.service");
const { generateToken } = require("../utils/jwt.helper");
const ApiError = require("../utils/ApiError");

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
    const { newUser, accessToken } = await authService.registerUser({
      username,
      email,
      password,
    });

    // Trả về response thành công
    res.status(201).json({
      status: "success",
      message: "User registered successfully.",
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
    const { user, accessToken } = await authService.loginUser({
      email,
      password,
    });

    res.status(200).json({
      status: "success",
      message: "User logged in successfully.",
      data: {
        user,
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Callback xử lý sau khi đăng nhập Mạng xã hội thành công
 * @route   GET /api/auth/google/callback, /api/auth/facebook/callback
 * @access  Public
 */
const socialLoginCallback = async (req, res, next) => {
  try {
    // Passport đã xác thực và gắn user vào req.user
    const user = req.user;

    if (!user) {
      throw new ApiError(401, "Xác thực qua mạng xã hội thất bại.");
    }

    // Tạo JWT token giống như đăng nhập thường
    const accessToken = generateToken(user.id);

    // ❗️ Quan trọng: Redirect về FE và gửi kèm token qua URL
    // FE sẽ lấy token này từ URL, lưu vào localStorage và hoàn tất đăng nhập
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${frontendUrl}/login-success?token=${accessToken}`);
  } catch (error) {
    next(error);
  }
};

// ✅ Controller Quên mật khẩu
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    next(error);
  }
};

// ✅ Controller Đặt lại mật khẩu
const resetPassword = async (req, res, next) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body; // Mật khẩu mới
    const result = await authService.resetPassword(id, token, password);
    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  socialLoginCallback,
  forgotPassword,
  resetPassword,
};
