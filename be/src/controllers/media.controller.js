// src/controllers/media.controller.js
const ApiError = require("../utils/ApiError");

const uploadMedia = (req, res, next) => {
  if (!req.file) {
    return next(new ApiError(400, "Vui lòng chọn một file để upload."));
  }

  // File đã được lưu bởi multer (trong middleware)
  // Trả về URL để truy cập file (đã cấu hình static ở server.js)
  const fileUrl = `${req.protocol}://${req.get("host")}/public/uploads/${
    req.file.filename
  }`;

  res.status(201).json({
    status: "success",
    message: "File uploaded successfully.",
    url: fileUrl, // ⬅️ CreateRecipe.jsx sẽ đọc 'url' này
  });
};

module.exports = {
  uploadMedia,
};
