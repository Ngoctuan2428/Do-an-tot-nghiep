const express = require("express");
const router = express.Router();
const searchController = require("../controllers/search.controller");

// GET /api/search/recipes?q=...&page=1&limit=20&sortBy=views
router.get("/recipes", searchController.searchRecipes);

// GET /api/search/suggestions?q=...
router.get("/suggestions", searchController.suggestions);

// GET /api/search/trending?limit=10
router.get("/trending", searchController.trending);

router.get("/trending-tags", searchController.trendingTags);

module.exports = router;
