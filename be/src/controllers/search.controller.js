const searchService = require("../services/search.service");
const ApiError = require("../utils/ApiError");
const { Recipe } = require("../models"); // Adjust the path as necessary
const { Op } = require("sequelize");

async function searchRecipes(req, res, next) {
  try {
    const params = {
      q: req.query.q?.trim() || "",
      category: req.query.category,
      tag: req.query.tag,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
      sortBy: req.query.sortBy || "newest",
    };

    console.log("Search params:", params); // Debug log

    const result = await searchService.searchRecipes(params);
    return res.json(result);
  } catch (err) {
    console.error("Search error:", err); // Debug log
    return next(new ApiError(500, `Search failed: ${err.message}`));
  }
}

async function suggestions(req, res, next) {
  try {
    const q = req.query.q || "";
    const result = await searchService.getSuggestions(q);
    return res.json(result);
  } catch (err) {
    return next(ApiError.internal(err.message));
  }
}

async function trending(req, res, next) {
  try {
    const limit = req.query.limit || 10;
    const rows = await searchService.getTrending(limit);
    return res.json({ rows });
  } catch (err) {
    return next(ApiError.internal(err.message));
  }
}

// Add this temporary debug endpoint
async function debugSearch(req, res, next) {
  try {
    const results = await Recipe.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: "%thịt%" } },
          { ingredients: { [Op.like]: "%thịt%" } },
          { description: { [Op.like]: "%thịt%" } },
        ],
      },
      attributes: ["id", "title", "ingredients"],
      raw: true,
    });

    console.log("Debug search results:", results);
    res.json(results);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  searchRecipes,
  suggestions,
  trending,
  debugSearch, // Export the debug function
};
