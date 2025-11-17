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
        user: process.env.DB_USER || 'tuan',
        password: process.env.DB_PASSWORD || '123456',
        database: process.env.DB_NAME || 'cooking'
    },

    // Cấu hình JWT (JSON Web Token)
    jwt: {
        secret: process.env.JWT_SECRET || 'a-very-strong-secret-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '1d' // Ví dụ: 1 ngày
    },

    // ==========================================
    // ⚡️ SỬA LỖI: THÊM CÁC CẤU HÌNH CÒN THIẾU
    // ==========================================

    // Cấu hình Google OAuth (để sửa lỗi 'clientId is undefined')
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
    },
    
    // Cấu hình URL của Frontend (cho việc redirect)
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000'
};

module.exports = config;