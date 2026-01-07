// src/routes/interaction.routes.js
const express = require("express");
const { protect } = require("../middlewares/auth.middleware");
const controller = require("../controllers/interaction.controller");

const router = express.Router();

router.use(protect);

router.get("/", controller.getInteractionFeed);

router.post("/like/:recipeId", controller.toggleLikeRecipe);
router.post("/follow/:userId", controller.toggleFollowUser);

module.exports = router;
