// train-chatbot.js (Chạy từ thư mục gốc BE/)

// 1. Cấu hình .env (File .env ở cùng thư mục nên không cần path)
require("dotenv").config(); 
const fs = require("fs");
const path = require("path");
const { Sequelize, DataTypes, Op } = require("sequelize"); 

console.log("🚀 Bắt đầu huấn luyện 'bộ não' chatbot...");

// ====================
// 2️⃣ KẾT NỐI DATABASE
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
// 3️⃣ KHAI BÁO MODEL
// ====================
// Khai báo Recipe, bao gồm cột 'servings'
const Recipe = sequelize.define(
  "Recipe",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    ingredients: DataTypes.JSON,
    servings: DataTypes.STRING, // Khẩu phần ăn
  },
  { tableName: "recipes", timestamps: false }
);

// Khai báo Category
const Category = sequelize.define(
  "Category",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    name: DataTypes.STRING,
  },
  { tableName: "categories", timestamps: false }
);

// Khai báo Tag
const Tag = sequelize.define(
  "Tag",
  {
    name: { type: DataTypes.STRING(100), primaryKey: true },
  },
  { tableName: "tags", timestamps: false }
);

// Khai báo RecipeStep
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
// 4️⃣ HÀM HUẤN LUYỆN
// ====================
async function trainChatbot() {
  try {
    const trainingData = [];
    const BATCH_SIZE = 100; // Xử lý 100 món mỗi lần

    // --- Tải dữ liệu tĩnh (Categories và Tags) ---
    console.log("📥 Đang tải Categories và Tags...");
    const categories = await Category.findAll({ raw: true });
    const tags = await Tag.findAll({ attributes: ["name"], raw: true });

    categories.forEach((cat) => {
      trainingData.push({
        intent: "ask_category",
        input: `Cho tôi xem các món trong danh mục ${cat.name}`,
        output: `Đây là các món trong danh mục ${cat.name}.`,
      });
    });
    tags.forEach((tag) => {
      trainingData.push({
        intent: "ask_tag",
        input: `Tìm món có tag ${tag.name}`,
        output: `Các món có tag ${tag.name}.`,
      });
    });

    // --- Xử lý Recipes và Steps theo từng batch ---
    const { count } = await Recipe.findAndCountAll();
    console.log(`🔄 Tìm thấy ${count} món ăn. Bắt đầu xử lý theo batch...`);

    for (let offset = 0; offset < count; offset += BATCH_SIZE) {
        // 1. Lấy 100 món
        const recipes = await Recipe.findAll({
            offset: offset,
            limit: BATCH_SIZE,
            raw: true,
        });
        
        const recipeIds = recipes.map(r => r.id);

        // 2. Lấy các bước của 100 món này
        const steps = await RecipeStep.findAll({
            where: { recipe_id: { [Op.in]: recipeIds } },
            raw: true,
        });

        // 3. Xử lý từng món
        for (const recipe of recipes) {
            // Parse ingredients (để huấn luyện 'ask_ingredient')
            let ingredients = [];
            try {
              const parsed = typeof recipe.ingredients === "string" ? JSON.parse(recipe.ingredients) : recipe.ingredients;
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
            
            if (ingredients.length > 0) {
              trainingData.push({
                intent: "ask_ingredient",
                input: `Tìm món có nguyên liệu ${ingredients.join(", ")}`,
                output: `Các món có thể dùng nguyên liệu ${ingredients.join(", ")} bao gồm: ${recipe.title}`,
              });
            }
            
            // --- Logic 'ask_steps' / 'ask_recipe' (ĐÃ SỬA) ---
            const recipeSteps = steps
              .filter((s) => s.recipe_id === recipe.id)
              .sort((a, b) => a.step_order - b.step_order);
            
            let baseOutput = ""; 
            let intent = "";
            
            // Nếu CÓ CÁC BƯỚC, lưu các bước
            if (recipeSteps.length > 0) {
              const stepTexts = recipeSteps.map((s, idx) => {
                    let text = `Bước ${idx + 1}: ${s.instruction}`;
                    if (s.image_url) {
                      text += `\n🖼️ Ảnh minh họa: ${s.image_url}`;
                    }
                    return text;
                  }).join("\n\n");
              baseOutput = `Dưới đây là các bước để làm món ${recipe.title}:\n\n${stepTexts}`;
              intent = "ask_steps";
            
            // Nếu KHÔNG CÓ BƯỚC, lưu mô tả
            } else {
              baseOutput = `👩‍🍳 Món ${recipe.title}:\n${recipe.description || "Hiện chưa có mô tả."}`;
              intent = "ask_recipe"; // Dùng intent 'ask_recipe' cho mô tả
            }

            // Thêm khẩu phần vào output (nếu có)
            if (recipe.servings) {
              baseOutput += `\n\n🍽️ Khẩu phần: ${recipe.servings} người ăn.`;
            }
            
            // Push data (cách nấu / các bước)
            trainingData.push({
                intent: intent, // intent sẽ là 'ask_steps' hoặc 'ask_recipe'
                input: `Cách nấu món ${recipe.title} như thế nào?`,
                output: baseOutput,
            });
            trainingData.push({
                intent: intent,
                input: `Các bước làm món ${recipe.title}`,
                output: baseOutput, 
            });
            
            // Push 'ask_servings' (cho câu hỏi riêng về khẩu phần)
            if (recipe.servings) {
              const output = `Món '${recipe.title}' này dành cho ${recipe.servings} người ăn.`;
              trainingData.push({
                intent: "ask_servings",
                input: `Khẩu phần món ${recipe.title}`,
                output: output,
              });
              trainingData.push({
                intent: "ask_servings",
                input: `Món ${recipe.title} cho mấy người ăn`,
                output: output,
              });
            }
        }
        console.log(`... Đã xử lý ${offset + recipes.length}/${count} món.`);
    }

    // ====================
    // 5️⃣ GHI RA FILE JSON
    // ====================
    const configDir = path.join(__dirname, "src", "config");
    if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
    }

    // Đường dẫn trỏ vào 'src/config/chatbot-data.json'
    const filePath = path.join(configDir, "chatbot-data.json"); 
    fs.writeFileSync(filePath, JSON.stringify(trainingData, null, 2), "utf8");

    console.log(`✅ Huấn luyện hoàn tất. Đã lưu vào ${filePath}`);
  } catch (err) {
    console.error("❌ Lỗi huấn luyện chatbot:", err);
  } finally {
    await sequelize.close();
    console.log("Đã đóng kết nối CSDL.");
  }
}

// ====================
// 6️⃣ CHẠY
// ====================
trainChatbot();