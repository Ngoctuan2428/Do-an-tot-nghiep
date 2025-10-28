// services/chatbot.service.js
const fs = require("fs");
const path = require("path");
const { Recipe, Category, Tag, RecipeStep, sequelize } = require("../models");
const { Op } = require("sequelize");

// === (Tùy chọn) Bỏ qua load training nếu không cần ===
const dataPath = path.join(__dirname, "../config/chatbot-data.json");
let trainingData = [];
if (fs.existsSync(dataPath)) {
  trainingData = JSON.parse(fs.readFileSync(dataPath, "utf8"));
}

// === Nhận diện intent thủ công ===
function detectIntent(message) {
  const text = message.toLowerCase();

  if (text.includes("bước") || text.includes("làm món")) return "ask_steps";
  if (text.includes("nguyên liệu") || text.includes("có")) return "ask_ingredient";
  if (text.includes("danh mục") || text.includes("loại món")) return "ask_category";
  if (text.includes("tag") || text.includes("#")) return "ask_tag";
  if (text.includes("cách nấu") || text.includes("món") || text.includes("như thế nào"))
    return "ask_recipe";

  return "unknown";
}

// === Hàm xử lý chính ===
async function processMessage(userMessage) {
  try {
    if (!userMessage || userMessage.trim().length === 0) {
      return "Bạn hãy nhập câu hỏi nhé!";
    }

    const message = userMessage.trim();
    const intent = detectIntent(message);
    console.log("🎯 Intent:", intent, "| Message:", message);

    switch (intent) {
      // ==========================
      // 🔹 TÌM MÓN THEO NGUYÊN LIỆU
      // ==========================
      case "ask_ingredient": {
        const match = message.match(/(?:nguyên liệu|có)\s+(.+)/i);
        const ingredient = match ? match[1].trim() : null;
        if (!ingredient) return "Bạn muốn tìm món với nguyên liệu gì ạ?";

        const recipes = await Recipe.findAll({
          where: {
            [Op.or]: [
              { title: { [Op.like]: `%${ingredient}%` } },
              { description: { [Op.like]: `%${ingredient}%` } },
              // nếu cột ingredients là JSON/text
              { ingredients: { [Op.like]: `%${ingredient}%` } },
            ],
          },
          limit: 25,
        });

        if (recipes.length === 0)
          return `😢 Không tìm thấy món nào có nguyên liệu '${ingredient}'.`;

        const titles = recipes.map((r) => `• ${r.title}`).join("\n");
        return `🍗 Tôi tìm thấy ${recipes.length} món có nguyên liệu '${ingredient}':\n${titles}`;
      }

      // ==========================
      // 🔹 TÌM MÓN THEO DANH MỤC
      // ==========================
      case "ask_category": {
        const match = message.match(/(?:danh mục|loại món)\s+(.+)/i);
        const catName = match ? match[1].trim() : null;
        if (!catName) return "Bạn muốn xem món trong danh mục nào ạ?";

        const category = await Category.findOne({
          where: sequelize.where(
            sequelize.fn("LOWER", sequelize.col("name")),
            catName.toLowerCase()
          ),
        });
        if (!category) return `Không tìm thấy danh mục '${catName}'.`;

        const recipes = await category.getRecipes({ limit: 5 });
        if (!recipes || recipes.length === 0)
          return `Danh mục '${category.name}' hiện chưa có món nào.`;

        const titles = recipes.map((r) => `• ${r.title}`).join("\n");
        return `📂 Các món trong danh mục '${category.name}':\n${titles}`;
      }

      // ==========================
      // 🔹 TÌM MÓN THEO TAG
      // ==========================
      case "ask_tag": {
        const match = message.match(/(?:tag|#)\s*(.+)/i);
        const tagName = match ? match[1].trim() : null;
        if (!tagName) return "Bạn muốn tìm món theo tag nào ạ?";

        const tag = await Tag.findOne({
          where: sequelize.where(
            sequelize.fn("LOWER", sequelize.col("name")),
            tagName.toLowerCase()
          ),
        });
        if (!tag) return `Không tìm thấy tag '${tagName}'.`;

        const recipes = await tag.getRecipes({ limit: 5 });
        if (!recipes || recipes.length === 0)
          return `Tag '${tag.name}' hiện chưa có món nào.`;

        const titles = recipes.map((r) => `• ${r.title}`).join("\n");
        return `🏷️ Các món có tag '${tag.name}':\n${titles}`;
      }

      // ==========================
      // 🔹 HỎI CÁCH NẤU MÓN ĂN
      // ==========================
      case "ask_recipe": {
        const match = message.match(/món\s+(.+?)(?:\s+(?:như thế nào|ra sao|cách nấu)|$)/i);
        const recipeName = match ? match[1].trim() : null;
        if (!recipeName) return "Bạn muốn hỏi cách nấu món nào ạ?";

        const recipe = await Recipe.findOne({
          where: { title: { [Op.like]: `%${recipeName}%` } },
        });
        if (!recipe) return `Không tìm thấy công thức cho món '${recipeName}'.`;

        return (
          `👩‍🍳 Cách nấu món ${recipe.title}:\n` +
          (recipe.description || "Hiện chưa có mô tả chi tiết.")
        );
      }

      // ==========================
      // 🔹 HỎI CÁC BƯỚC NẤU ĂN
      // ==========================
      case "ask_steps": {
        const match = message.match(/(?:bước|làm món)\s+(.+)/i);
        const recipeName = match ? match[1].trim() : null;
        if (!recipeName) return "Bạn muốn xem các bước làm món nào ạ?";

        const recipe = await Recipe.findOne({
          where: { title: { [Op.like]: `%${recipeName}%` } },
        });
        if (!recipe) return `Không tìm thấy món '${recipeName}' trong cơ sở dữ liệu.`;

        const steps = await RecipeStep.findAll({
          where: { recipe_id: recipe.id },
          order: [["step_order", "ASC"]],
        });

        if (steps.length === 0)
          return `Món '${recipe.title}' hiện chưa có hướng dẫn chi tiết các bước.`;

        const formattedSteps = steps
          .map(
            (s, i) =>
              `Bước ${i + 1}: ${s.instruction}${
                s.image_url ? `\n🖼️ Ảnh minh họa: ${s.image_url}` : ""
              }`
          )
          .join("\n\n");

        return `Dưới đây là các bước để làm món '${recipe.title}':\n\n${formattedSteps}`;
      }

      // ==========================
      // 🔹 KHÔNG NHẬN DIỆN ĐƯỢC
      // ==========================
      default:
        return (
          "Xin lỗi, tôi chưa hiểu ý bạn 😅. Bạn có thể hỏi như:\n" +
          "• Tìm món có nguyên liệu gà\n" +
          "• Cách nấu món canh chua\n" +
          "• Các bước làm món bò kho"
        );
    }
  } catch (err) {
    console.error("❌ Lỗi xử lý chatbot:", err);
    return "Đã xảy ra lỗi khi xử lý câu hỏi. Bạn thử lại giúp tôi nhé!";
  }
}

module.exports = { processMessage };
