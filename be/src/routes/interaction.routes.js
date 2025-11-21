// src/routes/interaction.routes.js
const express = require("express");
const { protect } = require("../middlewares/auth.middleware");
const controller = require("../controllers/interaction.controller");

const router = express.Router();

// GET /api/interactions/ (Yêu cầu đăng nhập)
router.get("/", protect, controller.getInteractionFeed);

module.exports = router;
