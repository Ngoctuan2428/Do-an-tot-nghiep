const bcrypt = require("bcryptjs");
const { User } = require("../models");
const ApiError = require("../utils/ApiError");
const { generateToken } = require("../utils/jwt.helper");

// Hàm kiểm tra và tạo User mới (Không đổi)
const registerUser = async (userData) => {
  const { username, email, password } = userData;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new ApiError(400, "Email already in use.");
  }

  const password_hash = await bcrypt.hash(password, 10);
  const newUser = await User.create({ username, email, password_hash });
  const accessToken = generateToken(newUser.id);
  newUser.password_hash = undefined;

  return { newUser, accessToken };
};

// Hàm đăng nhập User (Không đổi)
const loginUser = async (loginData) => {
  const { email, password } = loginData;

  const user = await User.findOne({ where: { email } });
  if (!user || !user.password_hash) { // Kiểm tra user hoặc nếu user đăng nhập MXH mà không có pass
    throw new ApiError(401, "Invalid email or password.");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordMatch) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const accessToken = generateToken(user.id);
  user.password_hash = undefined;
  return { user, accessToken };
};

/**
 * Tìm user dựa trên provider_id, hoặc tạo mới/liên kết nếu chưa tồn tại.
 */
const findOrCreateUser = async (profile) => {
  // Đổi tên id thành provider_id cho rõ ràng trong hàm
  const { provider, id: provider_id, email, displayName, avatar_url } = profile; 

  // 1. TÌM USER BẰNG provider_id (Ưu tiên kiểm tra xem đã từng đăng nhập MXH này chưa)
  let user = await User.findOne({
    where: { provider: provider, provider_id: provider_id },
  });

  if (user) {
    user.password_hash = undefined;
    return user; 
  }

  // 2. LOGIC MỚI: TÌM USER BẰNG EMAIL VÀ LIÊN KẾT TÀI KHOẢN (ACCOUNT LINKING)
  if (email) {
    const existingEmailUser = await User.findOne({
      where: { email },
    });

    if (existingEmailUser) {
      // ✅ [ĐÃ SỬA] LIÊN KẾT TÀI KHOẢN TỒN TẠI (LOCAL)
      
      // Nếu tài khoản tồn tại nhưng chưa từng đăng nhập MXH này (provider là 'local' hoặc null)
      if (existingEmailUser.provider === "local" || !existingEmailUser.provider) {
        
        // CẬP NHẬT: Gán thông tin MXH mới (provider_id và provider) vào tài khoản cũ
        await existingEmailUser.update({
          provider: provider,           
          provider_id: provider_id,     
          // Chỉ cập nhật avatar nếu tài khoản local chưa có avatar
          avatar_url: existingEmailUser.avatar_url || avatar_url, 
        });

        existingEmailUser.password_hash = undefined;
        return existingEmailUser; // Trả về user đã được liên kết
      } 
      
      // Nếu tài khoản tồn tại, đã đăng nhập MXH khác, nhưng người dùng cố gắng login bằng MXH mới.
      // Ta vẫn trả về user cũ (ngầm định cho phép đăng nhập qua bất kỳ MXH nào có cùng email)
      existingEmailUser.password_hash = undefined;
      return existingEmailUser; 
    }

    // 3. Email chưa tồn tại: TẠO MỚI HOÀN TOÀN
    user = await User.create({
      provider: provider,
      provider_id: provider_id,
      email: email,
      username: displayName,
      avatar_url: avatar_url,
      password_hash: null, // Không có mật khẩu cho tài khoản MXH
    });
    
    user.password_hash = undefined;
    return user;
  }

  // 4. Trường hợp không có email
  throw new ApiError(
    400,
    "Không thể đăng nhập do không có thông tin email từ nhà cung cấp."
  );
};

module.exports = {
  registerUser,
  loginUser,
  findOrCreateUser,
};