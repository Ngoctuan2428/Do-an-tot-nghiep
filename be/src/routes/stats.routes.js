const express = require("express");
const statsController = require("../controllers/stats.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

// Tất cả các route này đều cần đăng nhập
router.use(protect);

router.get("/me", statsController.getMyStats);
router.get("/me/chart", statsController.getMyChart);

router.get("/recipes/:id", statsController.getRecipeStats);
router.get("/recipes/:id/chart", statsController.getRecipeChart);

module.exports = router;
