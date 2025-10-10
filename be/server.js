const express = require('express');
const cors = require('cors');
const config = require('./src/config/environment');
const { connectDB } = require('./src/config/database');
const mainRouter = require('./src/routes');
const errorHandler = require('./src/middlewares/error.middleware');
const ApiError = require('./src/utils/ApiError');

const app = express();

// 1. Kết nối database
connectDB();

// 2. Middlewares cơ bản
app.use(cors()); // Cho phép cross-origin requests
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// 3. Routes
app.use('/api', mainRouter); // Gắn router chính vào /api

// 4. Xử lý route không tồn tại (404)
app.use((req, res, next) => {
    next(new ApiError(404, 'Not Found'));
});

// 5. Middleware xử lý lỗi tập trung (PHẢI đặt ở cuối cùng)
app.use(errorHandler);

// 6. Khởi chạy server
const PORT = config.port;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});