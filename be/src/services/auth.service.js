const bcrypt = require("bcryptjs");
const { User } = require("../models");
const ApiError = require("../utils/ApiError");
const { generateToken } = require("../utils/jwt.helper");

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
      // User đã đăng ký bằng email/pass, không thể đăng nhập bằng MXH
      throw new ApiError(
        400,
        "Email này đã được đăng ký bằng mật khẩu. Vui lòng đăng nhập bằng mật khẩu."
      );
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

module.exports = {
  registerUser,
  loginUser,
  findOrCreateUser,
};
