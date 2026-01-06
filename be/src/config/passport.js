// src/config/passport.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const config = require("./environment");
// const { User } = require("../models"); // Dòng này có thể bỏ nếu không dùng trực tiếp ở đây
const authService = require("../services/auth.service");

/**
 * Hàm callback xử lý logic: Tìm hoặc Tạo user
 */
const socialLoginCallback = async (profile, done) => {
  try {
    // Gọi service (nơi sẽ ném lỗi nếu trùng email local)
    const user = await authService.findOrCreateUser(profile);
    return done(null, user); // Thành công
  } catch (err) {
    // QUAN TRỌNG: Chuyền lỗi ra ngoài cho Controller xử lý
    return done(err, null);
  }
};

// Cấu hình Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: config.google.clientID,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackURL,
    },
    (accessToken, refreshToken, profile, done) => {
      // Chuẩn hóa dữ liệu từ Google
      const normalizedProfile = {
        provider: profile.provider,
        id: profile.id,
        email: profile.emails?.[0]?.value, // Thêm ?. để tránh lỗi crash nếu google không trả về email
        displayName: profile.displayName,
        avatar: profile.photos?.[0]?.value,
      };
      
      socialLoginCallback(normalizedProfile, done);
    }
  )
);

// Lưu ý: Nếu bạn dùng session: false hoàn toàn thì không cần serialize/deserialize
// Nhưng nếu Passport yêu cầu, bạn có thể thêm đoạn cơ bản này để tránh lỗi:
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

module.exports = passport;