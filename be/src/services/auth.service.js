const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const { User } = require("../models");
const ApiError = require("../utils/ApiError");
const { generateToken } = require("../utils/jwt.helper");

// Cấu hình transporter để gửi mail
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const registerUser = async (userData) => {
  const { username, email, password } = userData;

  // 1. Kiểm tra email đã tồn tại chưa
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new ApiError(400, "Email already in use.");
  }

  // 2. Hash mật khẩu
  const password_hash = await bcrypt.hash(password, 10);

  // 3. Tạo người dùng mới
  const newUser = await User.create({ username, email, password_hash });

  // 4. Tạo token
  const accessToken = generateToken(newUser.id);

  // Không trả về password_hash
  newUser.password_hash = undefined;

  return { newUser, accessToken };
};

const loginUser = async (loginData) => {
  const { email, password } = loginData;

  // 1. Tìm người dùng theo email
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  // 2. So sánh mật khẩu
  const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordMatch) {
    throw new ApiError(401, "Invalid email or password.");
  }

  // 3. Tạo token
  const accessToken = generateToken(user.id);

  user.password_hash = undefined;
  return { user, accessToken };
};

/**
 * Tìm user dựa trên provider_id,
 * hoặc tạo mới nếu chưa tồn tại.
 */
const findOrCreateUser = async (profile) => {
  const { provider, id, email, displayName, avatar } = profile;

  // 1. Tìm user bằng provider_id
  let user = await User.findOne({
    where: { provider: provider, provider_id: id },
  });

  if (user) {
    return user; // User đã đăng nhập bằng MXH này rồi -> trả về user
  }

  // 2. Nếu không tìm thấy, kiểm tra xem email đã tồn tại với 'local' provider chưa
  if (email) {
      const existingEmailUser = await User.findOne({
        where: { email },
      });

      if (existingEmailUser && existingEmailUser.provider === "local") {
        // Tạo lỗi nhưng gắn thêm mã code để Controller nhận biết và Redirect
        const error = new ApiError(
          400,
          "Email này đã được đăng ký bằng mật khẩu."
        );
        error.errorCode = "EMAIL_ALREADY_LOCAL"; // Thêm cờ này để nhận diện
        throw error;
      }

    // 3. Email chưa tồn tại (hoặc đã đăng nhập bằng MXH khác)
    // Tạo user mới
    user = await User.create({
      provider: provider,
      provider_id: id,
      email: email,
      username: displayName,
      avatar_url: avatar,
      password_hash: null, // Không có mật khẩu
    });

    return user;
  }

  // 4. Trường hợp đặc biệt (vd: Facebook không trả email)
  if (!email) {
    throw new ApiError(
      400,
      "Không thể đăng nhập do không có thông tin email từ nhà cung cấp."
    );
  }
};

// ✅ 1. HÀM MỚI: Yêu cầu quên mật khẩu
const forgotPassword = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new ApiError(404, "Email không tồn tại trong hệ thống.");
  }

  // Tạo token reset password (hết hạn sau 15 phút)
  // Dùng mật khẩu hiện tại làm secret để khi đổi pass xong token cũ sẽ vô hiệu hóa ngay
  const secret = process.env.JWT_SECRET + user.password_hash;
  const token = jwt.sign({ id: user.id, email: user.email }, secret, {
    expiresIn: "15m",
  });

  // Link reset password gửi về email
  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${user.id}/${token}`;

  // Gửi email
  await transporter.sendMail({
    from: '"PCook Support" <noreply@pcook.com>',
    to: user.email,
    subject: "Yêu cầu đặt lại mật khẩu PCook",
    html: `
            <h3>Xin chào ${user.username},</h3>
            <p>Bạn vừa yêu cầu đặt lại mật khẩu. Vui lòng bấm vào link dưới đây để tiếp tục:</p>
            <a href="${resetLink}" target="_blank">Đặt lại mật khẩu</a>
            <p>Link này sẽ hết hạn sau 15 phút.</p>
            <p>Nếu không phải bạn yêu cầu, hãy bỏ qua email này.</p>
        `,
  });

  return { message: "Email đặt lại mật khẩu đã được gửi." };
};

// ✅ 2. HÀM MỚI: Đặt lại mật khẩu mới
const resetPassword = async (id, token, newPassword) => {
  const user = await User.findByPk(id);
  if (!user) throw new ApiError(404, "User not found.");

  // Verify token
  const secret = process.env.JWT_SECRET + user.password_hash;
  try {
    jwt.verify(token, secret);
  } catch (error) {
    throw new ApiError(400, "Link không hợp lệ hoặc đã hết hạn.");
  }

  // Hash mật khẩu mới
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Cập nhật vào DB
  await user.update({ password_hash: hashedPassword });

  return { message: "Mật khẩu đã được thay đổi thành công." };
};

module.exports = {
  registerUser,
  loginUser,
  findOrCreateUser,
  forgotPassword,
  resetPassword,
};
