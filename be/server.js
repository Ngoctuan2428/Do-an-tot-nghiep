const express = require('express');
const cors = require('cors');
const passport = require('passport'); // 1. Import passport
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

// 3. ⚡ Cấu hình Passport (THÊM MỚI)
app.use(passport.initialize());
require('./src/config/passport.config')(passport); // Gọi file config và truyền passport vào

// 4. Routes 
app.use('/api', mainRouter); // Gắn router chính vào /api

// 5. Xử lý route không tồn tại (404)(Số thứ tự cũ là 4)
app.use((req, res, next) => {
    next(new ApiError(404, 'Not Found'));
});

// 6. Middleware xử lý lỗi tập trung 
app.use(errorHandler);

// 7. Khởi chạy server
const PORT = config.port;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});