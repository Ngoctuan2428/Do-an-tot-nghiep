const express = require("express");
const recipeController = require("../controllers/recipe.controller");
const { protect } = require("../middlewares/auth.middleware");
const commentRouter = require("./comment.routes"); // Import router của comment

const router = express.Router();

// Gắn commentRouter vào recipeRouter
// Mọi request đến /:recipeId/comments sẽ được xử lý bởi commentRouter
router.use("/:recipeId/comments", commentRouter);

router
  .route("/")
  .get(recipeController.getAllRecipes) // Lấy danh sách công thức
  .post(protect, recipeController.createRecipe); // Tạo công thức mới

router.route("/counts").get(protect, recipeController.getRecipeCounts);

// Lấy "Món của tôi"
router.route("/mine").get(protect, recipeController.getMyRecipes);

router.route("/published").get(protect, recipeController.getPublishedRecipes);

router.route("/drafts").get(protect, recipeController.getDraftRecipes);

router.get("/cooked", protect, recipeController.getCookedRecipes);

router.route("/saved").get(protect, recipeController.getSavedRecipes);

router.get("/liked-ids", protect, recipeController.getLikedRecipesIds);

router.get("/user/:userId/public", recipeController.getPublicRecipesByUserId);

router.get("/:id/reacters", recipeController.getRecipeReacters);

router
  .route("/:id")
  .get(recipeController.getRecipeById) // Xem chi tiết công thức
  .patch(protect, recipeController.updateRecipe) // Cập nhật (chủ sở hữu)
  .delete(protect, recipeController.deleteRecipe); // Xóa (chủ sở hữu hoặc admin)

router.route("/:id/save").post(protect, recipeController.saveRecipe);

router.post("/:id/like", protect, recipeController.likeRecipe);

router.post("/:id/cooksnap", protect, recipeController.sendCooksnap);

module.exports = router;
