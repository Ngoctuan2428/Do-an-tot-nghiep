// src/config/passport.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const config = require("./environment");
const { User } = require("../models");
const authService = require("../services/auth.service");

/**
 * Hàm callback chung cho cả Google và Facebook
 * Sẽ tìm hoặc tạo user mới trong CSDL
 */
const socialLoginCallback = async (profile, done) => {
  try {
    const user = await authService.findOrCreateUser(profile);
    return done(null, user); // Gửi user cho bước tiếp theo
  } catch (err) {
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
      // Chuẩn hóa 'profile' object từ Google
      const normalizedProfile = {
        provider: profile.provider,
        id: profile.id,
        email: profile.emails[0].value,
        displayName: profile.displayName,
        avatar: profile.photos[0].value,
      };
      socialLoginCallback(normalizedProfile, done);
    }
  )
);

// Cấu hình Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: config.facebook.clientID,
      clientSecret: config.facebook.clientSecret,
      callbackURL: config.facebook.callbackURL,
      profileFields: ["id", "displayName", "emails", "picture.type(large)"],
    },
    (accessToken, refreshToken, profile, done) => {
      // Chuẩn hóa 'profile' object từ Facebook
      const normalizedProfile = {
        provider: profile.provider,
        id: profile.id,
        email: profile.emails ? profile.emails[0].value : null,
        displayName: profile.displayName,
        avatar: profile.photos ? profile.photos[0].value : null,
      };
      socialLoginCallback(normalizedProfile, done);
    }
  )
);
