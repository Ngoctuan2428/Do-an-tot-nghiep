const authService = require("../services/auth.service");
const { generateToken } = require("../utils/jwt.helper");
const ApiError = require("../utils/ApiError");

/**
 * @desc    Đăng ký người dùng mới
 * @route   POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const { newUser, accessToken } = await authService.registerUser({
      username,
      email,
      password,
    });

    res.status(201).json({
      status: "success",
      message: "User registered successfully.",
      data: { user: newUser, accessToken },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Đăng nhập
 * @route   POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken } = await authService.loginUser({
      email,
      password,
    });

    res.status(200).json({
      status: "success",
      message: "User logged in successfully.",
      data: { user, accessToken },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Callback xử lý sau khi đăng nhập Mạng xã hội thành công
 * @route   GET /api/auth/google/callback, /api/auth/facebook/callback
 */
const socialLoginCallback = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      throw new ApiError(401, "Xác thực qua mạng xã hội thất bại.");
    }

    const accessToken = generateToken(user.id);
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    
    // Redirect về trang thành công
    res.redirect(`${frontendUrl}/login-success?token=${accessToken}`);
  } catch (error) {
    next(error);
  }
};

// ✅ HÀM MỚI: Middleware chuyên xử lý lỗi cho Social Login
// Hàm này phải có đủ 4 tham số (err, req, res, next) để Express nhận diện là Error Handler
const socialLoginErrorHandler = (err, req, res, next) => {
  if (err.errorCode === "EMAIL_ALREADY_LOCAL") {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    
    // Redirect về trang Login kèm thông báo lỗi
    return res.redirect(`${frontendUrl}/login?error=email_exist_local`);
  }
  
  // Nếu là lỗi khác, chuyển tiếp cho bộ xử lý lỗi chung của App
  next(err);
};

/**
 * @desc    Quên mật khẩu
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Đặt lại mật khẩu
 */
const resetPassword = async (req, res, next) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;
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
  socialLoginErrorHandler, // Nhớ export hàm này
  forgotPassword,
  resetPassword,
};