// src/routes/challenge.routes.js
const express = require("express");
const challengeController = require("../controllers/challenge.controller");
const { protect, isAdmin } = require("../middlewares/auth.middleware");

const router = express.Router();

// 1. Lấy danh sách
router.get("/", challengeController.getAllChallenges);

// 2. Tạo mới (Admin)
router.post("/", protect, isAdmin, challengeController.createChallenge);

// 3. Lấy người tham gia (QUAN TRỌNG: Đặt trước route /:id để tránh nhầm lẫn)
// Route này khớp với /mon-ngon/participants
router.get("/:hashtag/participants", challengeController.getParticipants);

router.get("/:hashtag", challengeController.getChallengeDetail);

// 4. ✅ Route duy nhất lấy chi tiết (Xử lý cả ID và Hashtag)
// Route này sẽ khớp với /1 (Admin) HOẶC /mon-ngon (User)
router.get("/:id", challengeController.getChallenge);

// 5. ✅ Route Cập nhật (Admin)
router.put("/:id", protect, isAdmin, challengeController.updateChallenge);

// 6. ✅ Route Xóa (Admin)
router.delete("/:id", protect, isAdmin, challengeController.deleteChallenge);

module.exports = router;
