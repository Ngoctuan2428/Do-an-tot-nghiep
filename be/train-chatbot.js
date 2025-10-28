require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");

console.log("🚀 Bắt đầu huấn luyện 'bộ não' chatbot...");

// ====================
// 1️⃣ KẾT NỐI DATABASE
// ====================
const sequelize = new Sequelize(
  process.env.DB_NAME || "cooking",
  process.env.DB_USER || "tuan",
  process.env.DB_PASSWORD || "123456",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    logging: false,
  }
);

// ====================
// 2️⃣ KHAI BÁO MODEL
// ====================
const Recipe = sequelize.define(
  "Recipe",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    ingredients: DataTypes.JSON,
  },
  { tableName: "recipes", timestamps: false }
);

const Category = sequelize.define(
  "Category",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    name: DataTypes.STRING,
  },
  { tableName: "categories", timestamps: false }
);

const Tag = sequelize.define(
  "Tag",
  {
    name: { type: DataTypes.STRING(100), primaryKey: true },
  },
  { tableName: "tags", timestamps: false }
);

// ➕ Thêm bảng recipe_steps
const RecipeStep = sequelize.define(
  "RecipeStep",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    recipe_id: DataTypes.INTEGER,
    step_order: DataTypes.INTEGER,
    instruction: DataTypes.TEXT,
    image_url: DataTypes.STRING(500),
  },
  { tableName: "recipe_steps", timestamps: false }
);

// ====================
// 3️⃣ HÀM HUẤN LUYỆN
// ====================
async function trainChatbot() {
  try {
    console.log("📥 Đang tải dữ liệu từ CSDL...");

    const recipes = await Recipe.findAll({ raw: true });
    const categories = await Category.findAll({ raw: true });
    const tags = await Tag.findAll({ attributes: ["name"], raw: true });
    const steps = await RecipeStep.findAll({ raw: true });

    console.log(`✅ Đã nạp ${recipes.length} món ăn.`);
    console.log(`✅ Đã nạp ${categories.length} danh mục.`);
    console.log(`✅ Đã nạp ${tags.length} tag.`);
    console.log(`✅ Đã nạp ${steps.length} bước nấu ăn.`);

    const trainingData = [];

    // ====================
    // Xử lý dữ liệu món ăn
    // ====================
    for (const recipe of recipes) {
      // --- Ingredients ---
      let ingredients = [];
      try {
        const parsed =
          typeof recipe.ingredients === "string"
            ? JSON.parse(recipe.ingredients)
            : recipe.ingredients;

        if (Array.isArray(parsed)) {
          parsed.forEach((i) => {
            if (typeof i === "string") {
              ingredients.push(i.trim().toLowerCase());
            } else if (i && typeof i === "object" && i.name) {
              ingredients.push(i.name.trim().toLowerCase());
            }
          });
        }
      } catch {
        console.warn(`⚠️ Không thể parse ingredients cho món ${recipe.title}`);
      }

      // --- Description ---
      trainingData.push({
        intent: "ask_recipe",
        input: `Cách nấu món ${recipe.title} như thế nào?`,
        output: recipe.description || "",
      });

      // --- Tìm món theo nguyên liệu ---
      if (ingredients.length > 0) {
        trainingData.push({
          intent: "ask_ingredient",
          input: `Tìm món có nguyên liệu ${ingredients.join(", ")}`,
          output: `Các món có thể dùng nguyên liệu ${ingredients.join(", ")} bao gồm: ${recipe.title}`,
        });
      }

      // --- Các bước nấu ăn kèm ảnh ---
      const recipeSteps = steps
        .filter((s) => s.recipe_id === recipe.id)
        .sort((a, b) => a.step_order - b.step_order);

      if (recipeSteps.length > 0) {
        const stepTexts = recipeSteps
          .map((s, idx) => {
            let text = `Bước ${idx + 1}: ${s.instruction}`;
            if (s.image_url) {
              text += `\n🖼️ Ảnh minh họa: ${s.image_url}`;
            }
            return text;
          })
          .join("\n\n");

        trainingData.push({
          intent: "ask_steps",
          input: `Các bước làm món ${recipe.title}`,
          output: `Dưới đây là các bước để làm món ${recipe.title}:\n\n${stepTexts}`,
        });
      }
    }

    // ====================
    // Xử lý danh mục
    // ====================
    categories.forEach((cat) => {
      trainingData.push({
        intent: "ask_category",
        input: `Cho tôi xem các món trong danh mục ${cat.name}`,
        output: `Đây là các món trong danh mục ${cat.name}.`,
      });
    });

    // ====================
    // Xử lý tag
    // ====================
    tags.forEach((tag) => {
      trainingData.push({
        intent: "ask_tag",
        input: `Tìm món có tag ${tag.name}`,
        output: `Các món có tag ${tag.name}.`,
      });
    });

    // ====================
    // Ghi ra file JSON
    // ====================
    const filePath = path.join(__dirname, "chatbot-data.json");
    fs.writeFileSync(filePath, JSON.stringify(trainingData, null, 2), "utf8");

    console.log(`✅ Huấn luyện hoàn tất. Đã lưu vào ${filePath}`);
  } catch (err) {
    console.error("❌ Lỗi huấn luyện chatbot:", err);
  } finally {
    await sequelize.close();
  }
}

// ====================
// 4️⃣ CHẠY
// ====================
trainChatbot();
