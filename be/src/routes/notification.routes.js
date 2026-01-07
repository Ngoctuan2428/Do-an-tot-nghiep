const express = require("express");
const notificationController = require("../controllers/notification.controller");
const authMiddleware = require("../middlewares/auth.middleware"); // Middleware xác thực

const router = express.Router();

router.use(authMiddleware.protect);

router.get("/", notificationController.getNotifications);
router.put("/:id/read", notificationController.markRead);
router.put("/read-all", notificationController.markAllRead);

module.exports = router;
