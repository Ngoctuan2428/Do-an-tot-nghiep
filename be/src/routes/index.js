const express = require("express");
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const categoryRoutes = require("./category.routes");
const recipeRoutes = require("./recipe.routes");
const adminRoutes = require("./admin.routes");
const chatbotRoutes = require("./chatbot.routes");
const searchRoutes = require("./search.routes");
const mediaRoutes = require("./media.routes");

const router = express.Router();

// Gắn các router con vào router chính với các tiền tố (prefix) tương ứng
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/recipes", recipeRoutes);
router.use("/admin", adminRoutes);
router.use("/chatbot", chatbotRoutes);
router.use("/search", searchRoutes);
router.use("/media", mediaRoutes);

module.exports = router;
