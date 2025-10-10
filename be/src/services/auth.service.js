const bcrypt = require('bcryptjs');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const { generateToken } = require('../utils/jwt.helper');

const registerUser = async (userData) => {
    const { username, email, password } = userData;

    // 1. Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw new ApiError(400, 'Email already in use.');
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
        throw new ApiError(401, 'Invalid email or password.');
    }

    // 2. So sánh mật khẩu
    const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordMatch) {
        throw new ApiError(401, 'Invalid email or password.');
    }

    // 3. Tạo token
    const accessToken = generateToken(user.id);

    user.password_hash = undefined;
    return { user, accessToken };
};

module.exports = {
    registerUser,
    loginUser,
};