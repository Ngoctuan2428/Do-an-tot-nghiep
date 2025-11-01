// src/config/passport.config.js
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models');
const config = require('./environment'); // File config của bạn

module.exports = function(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.google.clientId, // Lấy từ .env
        clientSecret: config.google.clientSecret, // Lấy từ .env
        callbackURL: '/api/auth/google/callback', // Phải khớp với Google Console
        proxy: true
      },
      async (accessToken, refreshToken, profile, done) => {
        // Đây là hàm 'verify', chạy sau khi Google xác thực thành công
        try {
          // 1. Lấy thông tin người dùng từ Google
          const googleId = profile.id;
          const email = profile.emails[0].value;
          const username = profile.displayName;
          const avatar = profile.photos[0].value;

          // 2. Tìm người dùng trong CSDL bằng google_id
          let user = await User.findOne({ where: { google_id: googleId } });

          if (user) {
            // Nếu tìm thấy, trả về user
            return done(null, user);
          }

          // 3. Nếu không có google_id, tìm bằng email
          // (Trường hợp họ đã đăng ký bằng email, giờ đăng nhập bằng Google)
          user = await User.findOne({ where: { email: email } });

          if (user) {
            // Nếu email tồn tại, cập nhật google_id cho họ
            user.google_id = googleId;
            await user.save();
            return done(null, user);
          }

          // 4. Nếu không tìm thấy ai, tạo người dùng mới
          const newUser = await User.create({
            google_id: googleId,
            email: email,
            username: username,
            avatar_url: avatar,
            // password_hash sẽ là NULL (vì đã cho phép ở Bước 3)
          });

          return done(null, newUser);
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );
};