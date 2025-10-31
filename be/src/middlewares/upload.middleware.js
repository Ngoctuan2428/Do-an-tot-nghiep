// src/middlewares/upload.middleware.js
const multer = require("multer");
const path = require("path");
const ApiError = require("../utils/ApiError");
const fs = require("fs");

// Đảm bảo thư mục 'public/uploads' tồn tại
const uploadDir = path.join(__dirname, "../../public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình nơi lưu file (diskStorage)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Lưu vào thư mục public/uploads
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Tạo tên file duy nhất: fieldname-timestamp.ext
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// Bộ lọc file: chỉ chấp nhận ảnh
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new ApiError(400, "Chỉ chấp nhận file ảnh (image)."), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // Giới hạn 5MB
});

// Middleware để xử lý 1 file có tên field là 'file'
// (Giống trong uploadApi.js: form.append("file", file))
const uploadSingleFile = upload.single("file");

module.exports = { uploadSingleFile };
