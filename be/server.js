const express = require("express");
const cors = require("cors");
const config = require("./src/config/environment");
const { connectDB } = require("./src/config/database");
const mainRouter = require("./src/routes");
const errorHandler = require("./src/middlewares/error.middleware");
const ApiError = require("./src/utils/ApiError");

const app = express();

// 1. Kết nối database
connectDB();

// 2. Middlewares cơ bản
// Cấu hình CORS: cho phép FE tại http://localhost:5173
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Routes
app.use("/api", mainRouter); // Gắn router chính vào /api

// 4. Xử lý route không tồn tại (404)
app.use((req, res, next) => {
  next(new ApiError(404, "Not Found"));
});

// 5. Middleware xử lý lỗi tập trung (PHẢI đặt ở cuối cùng)
app.use(errorHandler);

// 6. Khởi chạy server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
