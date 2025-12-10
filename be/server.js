const express = require("express");
const cors = require("cors");
const config = require("./src/config/environment");
const { connectDB } = require("./src/config/database");
const passport = require("passport");
require("./src/config/passport");
const mainRouter = require("./src/routes");
const errorHandler = require("./src/middlewares/error.middleware");
const ApiError = require("./src/utils/ApiError");
const path = require("path");
const db = require("./src/models"); // Đảm bảo đường dẫn đúng tới file models/index.js

// 1. Import file config của passport (để nó chạy và đăng ký strategies)

const app = express();

// 1. Kết nối database
connectDB();

// 2. Middlewares cơ bản
// Cấu hình CORS: cho phép FE tại http://localhost:5173
const corsOptions = {
  origin: [
    "http://localhost:5173", // Client
    "http://localhost:3001", // Admin (hoặc 5174 tùy máy bạn)
  ],
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize()); // ✅ Dòng này bây giờ sẽ hoạt động
app.use("/public", express.static(path.join(__dirname, "public")));

// 3. Routes
app.use("/api", mainRouter); // Gắn router chính vào /api

// 4. Xử lý route không tồn tại (404)
app.use((req, res, next) => {
  next(new ApiError(404, "Not Found"));
});

// 5. Middleware xử lý lỗi tập trung (PHẢI đặt ở cuối cùng)
app.use(errorHandler);

// { alter: true } sẽ tự động cập nhật bảng nếu có thay đổi mà không xóa dữ liệu cũ
const PORT = config.port;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

db.sequelize.sync({}).then(() => {
  console.log("✅ Database & tables synced!");

  // Khởi động server sau khi đã sync DB thành công
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
