const jwt = require('jsonwebtoken');
const config = require('../config/environment');

const generateToken = (userId) => {
    const payload = { id: userId };
    return jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
    });
};

module.exports = { generateToken };