// src/routes/challenge.routes.js
const express = require("express");
const challengeController = require("../controllers/challenge.controller");
const { protect, isAdmin } = require("../middlewares/auth.middleware");

const router = express.Router();

// GET /api/challenges/ (Public) - Lấy danh sách
router.get("/", challengeController.getAllChallenges);

// POST /api/challenges/ (Admin) - Tạo mới
router.post("/", protect, isAdmin, challengeController.createChallenge);

// GET /api/challenges/monchay7ngay (Public) - Lấy chi tiết
router.get("/:hashtag", challengeController.getChallengeDetail);

// GET /api/challenges/monchay7ngay/participants (Public) - Lấy danh sách món tham gia
router.get("/:hashtag/participants", challengeController.getParticipants);

module.exports = router;
