// src/routes/media.routes.js
const express = require("express");
const mediaController = require("../controllers/media.controller");
const { uploadSingleFile } = require("../middlewares/upload.middleware");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

// Định nghĩa route: POST /api/media/
// 1. 'protect': Yêu cầu user phải đăng nhập
// 2. 'uploadSingleFile': Middleware của Multer xử lý file
// 3. 'mediaController.uploadMedia': Controller trả về URL
router.post("/", protect, uploadSingleFile, mediaController.uploadMedia);

module.exports = router;
