// Import thư viện dotenv để đọc file .env
require('dotenv').config();

// Tạo một object config để quản lý các biến môi trường
const config = {
    // Cấu hình server
    port: process.env.PORT || 8080,
    
    // Cấu hình database
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'your_password',
        database: process.env.DB_NAME || 'cooking'
    },

    // Cấu hình JWT (JSON Web Token)
    jwt: {
        secret: process.env.JWT_SECRET || 'a-very-strong-secret-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '1d' // Ví dụ: 1 ngày
    }
};

module.exports = config;