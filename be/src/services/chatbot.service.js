// services/chatbot.service.js
const fs = require("fs");
const path = require("path");

// 1. KẾT NỐI DATABASE
const { Recipe, Category, Tag, RecipeStep, sequelize } = require("../models");

// Import 'Op' từ 'sequelize'
const { Op } = require("sequelize");

// 2. TẢI DỮ LIỆU JSON (AN TOÀN)
const dataPath = path.join(__dirname, "../config/chatbot-data.json");
let trainingData = [];

try {
  if (fs.existsSync(dataPath)) {
    const fileContent = fs.readFileSync(dataPath, "utf8");
    if (fileContent.trim().length > 0) {
      trainingData = JSON.parse(fileContent);
      console.log(
        `✅ Chatbot: Đã tải ${trainingData.length} mẫu JSON (cho các intent nhanh).`
      );
    } else {
      console.warn("⚠️ CHATBOT: File 'chatbot-data.json' bị rỗng.");
    }
  } else {
    console.error("❌ LỖI CHATBOT: Không tìm thấy file 'chatbot-data.json'.");
  }
} catch (err) {
  console.error(
    "🔥🔥 LỖI CHATBOT: File 'chatbot-data.json' bị lỗi cú pháp.",
    err.message
  );
}

// 3. HÀM TÌM KIẾM TRONG JSON (NHANH)
function findResponse(intent, entity) {
  if (!entity || trainingData.length === 0) return null;
  const searchTerm = entity.toLowerCase().replace(/\s+/g, " ");

  const found = trainingData.find(
    (item) =>
      (item.intent === intent ||
        (intent === "ask_steps" && item.intent === "ask_recipe") ||
        (intent === "ask_servings" && item.intent === "ask_servings")) &&
      item.input.toLowerCase().replace(/\s+/g, " ").includes(searchTerm)
  );
  return found ? found.output : null;
}

// 4. HÀM NHẬN DIỆN INTENT (ĐÃ CẬP NHẬT)
function detectIntent(message) {
  const text = message.toLowerCase();

  const greetings = ["hi", "hello", "xin chào", "chào bạn", "chào shop"];
  const farewells = ["tạm biệt", "bye", "pp", "bye bye"];
  if (
    greetings.some((g) => text.startsWith(g)) ||
    farewells.some((f) => text.includes(f))
  ) {
    return "ask_greeting";
  }

  const thanks = ["cảm ơn", "thank you", "thanks", "c.ơn", "cam on"];
  if (thanks.some((t) => text.includes(t))) {
    return "ask_thanks";
  }

  // Ưu tiên hỏi khẩu phần
  if (
    text.includes("khẩu phần") ||
    text.includes("mấy người ăn") ||
    text.includes("bao nhiêu người")
  )
    return "ask_servings";

  // Ưu tiên hỏi "Nguyên liệu LÀM món..."
  if (
    text.includes("nguyên liệu của món") ||
    text.includes("nguyên liệu món") ||
    text.includes("nguyên liệu làm")
  )
    return "ask_list_ingredients";

  // Intent (tìm MÓN theo nguyên liệu)
  if (text.includes("nguyên liệu") || text.includes("có"))
    return "ask_ingredient";

  if (text.includes("danh mục") || text.includes("loại món"))
    return "ask_category";
  if (text.includes("tag") || text.includes("#")) return "ask_tag";

  // Hợp nhất "cách nấu", "làm món" v.v. vào ask_steps
  if (
    text.includes("bước") ||
    text.includes("làm món") ||
    text.includes("cách làm") ||
    text.includes(" làm ") ||
    text.includes("cách nấu") ||
    text.includes("món")
  ) {
    return "ask_steps";
  }

  return "unknown";
}

// 5. HÀM XỬ LÝ CHÍNH (HYBRID)
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
      // ⚡️ INTENT DÙNG JSON (NHANH)
      // ==========================
      case "ask_greeting": {
        const lowerMsg = message.toLowerCase();
        if (lowerMsg.includes("tạm biệt") || lowerMsg.includes("bye")) {
          return "Tạm biệt! Hẹn gặp lại bạn nhé! 👋";
        }
        return "Chào bạn! 🤖 Tôi có thể giúp gì cho bạn về công thức nấu ăn?";
      }

      case "ask_thanks": {
        return "Không có gì ạ! Rất vui vì đã giúp được bạn. 😊";
      }

      // ==========================
      // ⚡️ INTENT HYBRID (JSON + DB FALLBACK)
      // ==========================
      case "ask_steps": {
        const match = message.match(
          /(?:bước|làm món|cách làm|làm|cách nấu|món)\s+(.+?)(?:\s+(?:như thế nào|ra sao)|$)/i
        );
        const recipeName = match ? match[1].trim() : null;

        if (!recipeName) return "Bạn muốn hỏi cách nấu món nào ạ?";

        // 1. Tìm trong JSON (nhanh)
        const response = findResponse("ask_steps", recipeName);
        if (response) return response;

        // 2. Fallback tìm CSDL
        console.log(
          `Fallback: Đang tìm steps cho '${recipeName}' trong CSDL...`
        );
        const recipe = await Recipe.findOne({
          where: sequelize.where(
            sequelize.fn("LOWER", sequelize.col("title")),
            { [Op.like]: `%${recipeName.toLowerCase()}%` }
          ),
          attributes: ["id", "title", "description", "servings"], // Lấy cả khẩu phần
        });
        if (!recipe)
          return `Món '${recipeName}' hiện chưa có hướng dẫn chi tiết các bước.`;

        // 3. Lấy các bước từ CSDL
        const steps = await RecipeStep.findAll({
          where: { recipe_id: recipe.id },
          order: [["step_order", "ASC"]],
        });

        let outputText = "";
        // 4. Nếu không có bước, trả về mô tả
        if (steps.length === 0) {
          outputText = `👩‍🍳 Món ${recipe.title}:\n${
            recipe.description || "Hiện chưa có hướng dẫn chi tiết."
          }`;
        } else {
          // 5. Nếu có bước, format các bước
          const formattedSteps = steps
            .map(
              (s, i) =>
                `Bước ${i + 1}: ${s.instruction}${
                  s.image_url ? `\n🖼️ Ảnh minh họa: ${s.image_url}` : ""
                }`
            )
            .join("\n\n");
          outputText = `Dưới đây là các bước để làm món '${recipe.title}':\n\n${formattedSteps}`;
        }

        // 6. Thêm khẩu phần vào (nếu có)
        if (recipe.servings) {
          outputText += `\n\n🍽️ Khẩu phần: ${recipe.servings} người ăn.`;
        }

        return outputText;
      }

      // ==========================
      // ⚡️ INTENT DÙNG CSDL (TÌM KIẾM)
      // ==========================
      case "ask_list_ingredients": {
        const match = message.match(
          /(?:nguyên liệu của món|nguyên liệu món|nguyên liệu làm)\s+(.+)/i
        );
        const recipeName = match ? match[1].trim() : null;
        if (!recipeName) return "Bạn muốn hỏi nguyên liệu cho món nào ạ?";

        console.log(`Đang tìm nguyên liệu cho món: ${recipeName}`);

        const recipe = await Recipe.findOne({
          where: sequelize.where(
            sequelize.fn("LOWER", sequelize.col("title")),
            { [Op.like]: `%${recipeName.toLowerCase()}%` }
          ),
          attributes: ["title", "ingredients", "servings"], // Lấy cả khẩu phần
        });

        if (!recipe) return `😢 Không tìm thấy món '${recipeName}'.`;

        // Xử lý cột JSON 'ingredients'
        let ingredientsList = [];
        try {
          const parsed =
            typeof recipe.ingredients === "string"
              ? JSON.parse(recipe.ingredients)
              : recipe.ingredients;

          if (Array.isArray(parsed) && parsed.length > 0) {
            ingredientsList = parsed
              .map((item) => {
                if (typeof item === "object" && item.name) {
                  return (
                    `• ${item.name}` +
                    (item.quantity ? `: ${item.quantity}` : "")
                  );
                }
                if (typeof item === "string") {
                  return `• ${item}`;
                }
                return null;
              })
              .filter(Boolean);
          }
        } catch (e) {
          console.error("Lỗi parse nguyên liệu:", e);
        }

        let outputText = "";
        if (ingredientsList.length === 0) {
          outputText = `Món '${recipe.title}' hiện chưa có thông tin nguyên liệu chi tiết.`;
        } else {
          outputText = `📝 Nguyên liệu để làm món '${
            recipe.title
          }':\n${ingredientsList.join("\n")}`;
        }

        // Thêm khẩu phần vào (nếu có)
        if (recipe.servings) {
          outputText += `\n\n🍽️ Khẩu phần: ${recipe.servings} người ăn.`;
        }

        return outputText;
      }

      case "ask_servings": {
        let match = message.match(/(?:khẩu phần)\s+(?:món\s+)?(.+)/i);
        let recipeName = match ? match[1].trim() : null;

        if (!recipeName) {
          match = message.match(
            /(?:món\s+)?(.+?)\s+(?:cho\s+)?(?:mấy người ăn|bao nhiêu người)/i
          );
          recipeName = match ? match[1].trim() : null;
        }

        if (!recipeName) return "Bạn muốn hỏi khẩu phần cho món nào ạ?";

        // 1. Tìm trong JSON (nhanh)
        const response = findResponse("ask_servings", recipeName);
        if (response) return response;

        // 2. Fallback tìm CSDL
        console.log(
          `Fallback: Đang tìm khẩu phần cho '${recipeName}' trong CSDL...`
        );
        const recipe = await Recipe.findOne({
          where: sequelize.where(
            sequelize.fn("LOWER", sequelize.col("title")),
            { [Op.like]: `%${recipeName.toLowerCase()}%` }
          ),
          attributes: ["title", "servings"],
        });

        if (!recipe) return `Không tìm thấy món '${recipeName}'.`;
        if (!recipe.servings)
          return `Món '${recipe.title}' chưa có thông tin về khẩu phần ăn.`;

        return `Món '${recipe.title}' này dành cho ${recipe.servings} người ăn.`;
      }

      case "ask_ingredient": {
        let match;
        let ingredient = null;
        const endRegex = /(?:\s+(?:làm|nấu|được)|$)/i;

        match = message.match(
          new RegExp(`(?:nguyên liệu là)\\s+(.+?)${endRegex.source}`, "i")
        );
        if (match) {
          ingredient = match[1].trim();
        } else {
          match = message.match(
            new RegExp(
              `(?:nguyên liệu)\\s+(?:làm\\s+)?(.+?)${endRegex.source}`,
              "i"
            )
          );
          if (match) {
            ingredient = match[1].trim();
          } else {
            match = message.match(
              new RegExp(`(?:có)\\s+(.+?)${endRegex.source}`, "i")
            );
            if (match) {
              ingredient = match[1].trim();
            }
          }
        }

        if (!ingredient) return "Bạn muốn tìm món với nguyên liệu gì ạ?";

        const whereClause = {
          title: { [Op.like]: `%${ingredient}%` },
        };

        if (ingredient.toLowerCase() === "gà") {
          whereClause.title = {
            [Op.like]: `%${ingredient}%`,
            [Op.notLike]: "%trứng gà%",
          };
        }

        const recipes = await Recipe.findAll({
          where: whereClause,
          limit: 10,
        });

        if (recipes.length === 0)
          return `😢 Không tìm thấy món nào có nguyên liệu '${ingredient}'.`;

        const titles = recipes.map((r) => `• ${r.title}`).join("\n");
        return `🍗 Tôi tìm thấy ${recipes.length} món có nguyên liệu '${ingredient}':\n${titles}`;
      }

      case "ask_category": {
        const match = message.match(/(?:danh mục|loại món)\s+(.+)/i);
        const catName = match ? match[1].trim() : null;
        if (!catName) return "Bạn muốn xem món trong danh mục nào ạ?";

        const category = await Category.findOne({
          where: sequelize.where(sequelize.fn("LOWER", sequelize.col("name")), {
            [Op.like]: `%${catName.toLowerCase()}%`,
          }),
        });
        if (!category) return `Không tìm thấy danh mục '${catName}'.`;

        const recipes = await category.getRecipes({ limit: 10 });
        if (!recipes || recipes.length === 0)
          return `Danh mục '${category.name}' hiện chưa có món nào.`;

        const titles = recipes.map((r) => `• ${r.title}`).join("\n");
        return `📂 Các món trong danh mục '${category.name}':\n${titles}`;
      }

      case "ask_tag": {
        const match = message.match(/(?:tag|#)\s*(.+)/i);
        const tagName = match ? match[1].trim() : null;
        if (!tagName) return "Bạn muốn tìm món theo tag nào ạ?";

        const tag = await Tag.findOne({
          where: sequelize.where(sequelize.fn("LOWER", sequelize.col("name")), {
            [Op.like]: `%${tagName.toLowerCase()}%`,
          }),
        });
        if (!tag) return `Không tìm thấy tag '${tagName}'.`;

        const recipes = await tag.getRecipes({ limit: 10 });
        if (!recipes || recipes.length === 0)
          return `Tag '${tag.name}' hiện chưa có món nào.`;

        const titles = recipes.map((r) => `• ${r.title}`).join("\n");
        return `🏷️ Các món có tag '${tag.name}':\n${titles}`;
      }

      // ==========================
      // 🔹 KHÔNG NHẬN DIỆN ĐƯỢC
      // ==========================
      default:
        return (
          "Xin lỗi, tôi chưa hiểu ý bạn 😅. Bạn có thể hỏi như:\n" +
          "• Tìm món có nguyên liệu gà\n" +
          "• Nguyên liệu làm món bò kho\n" +
          "• Các bước làm món bò kho\n" +
          "• Món bò kho cho mấy người ăn"
        );
    }
  } catch (err) {
    console.error("❌ Lỗi xử lý chatbot:", err);
    return "Đã xảy ra lỗi khi xử lý câu hỏi. Bạn thử lại giúp tôi nhé!";
  }
}

module.exports = { processMessage };
