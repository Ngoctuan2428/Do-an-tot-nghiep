const { Op } = require("sequelize");
const db = require("../models");
const { Recipe, User } = db;

async function searchRecipes(params = {}) {
  try {
    const {
      q = "",
      page = 1,
      limit = 20,
      sortBy = "newest", // ✅ LẤY THAM SỐ FILTER
      include = "",
      exclude = "",
    } = params; // Điều kiện tìm kiếm cơ bản (query chính)

    const where = {
      [Op.or]: [
        { title: { [Op.like]: `%${q}%` } },
        { ingredients: { [Op.like]: `%${q}%` } },
        { description: { [Op.like]: `%${q}%` } },
      ],
    }; // 🛑 BỘ LỌC NGUYÊN LIỆU (INCLUDE)

    if (include) {
      const includeKeywords = include
        .split(",")
        .map((keyword) => keyword.trim())
        .filter(Boolean); // Lấy các từ khóa không rỗng

      if (includeKeywords.length > 0) {
        // Yêu cầu CỘT ingredients PHẢI chứa TẤT CẢ các từ khóa
        const includeConditions = includeKeywords.map((keyword) => ({
          ingredients: { [Op.like]: `%${keyword}%` },
        })); // Thêm điều kiện AND cho tất cả include conditions
        where[Op.and] = [...(where[Op.and] || []), ...includeConditions];
      }
    } // 🛑 BỘ LỌC NGUYÊN LIỆU (EXCLUDE)

    if (exclude) {
      const excludeKeywords = exclude
        .split(",")
        .map((keyword) => keyword.trim())
        .filter(Boolean); // Lấy các từ khóa không rỗng

      if (excludeKeywords.length > 0) {
        // Yêu cầu CỘT ingredients KHÔNG được chứa BẤT KỲ từ khóa nào
        const excludeConditions = excludeKeywords.map((keyword) => ({
          ingredients: { [Op.notLike]: `%${keyword}%` },
        })); // Thêm điều kiện AND cho tất cả exclude conditions
        where[Op.and] = [...(where[Op.and] || []), ...excludeConditions];
      }
    } // ✅ Kiểm tra cột 'status' và chỉ thêm điều kiện published nếu cần

    const desc = await Recipe.describe();
    if (desc.status) {
      const hasPublished = await Recipe.count({
        where: { status: "published" },
      });
      if (hasPublished > 0) {
        where.status = "published";
      }
    }

    console.log("Final where clause:", JSON.stringify(where, null, 2)); // Logic sắp xếp

    let order = [["created_at", "DESC"]];
    if (sortBy === "views") {
      order = [["views", "DESC"]];
    }

    const result = await Recipe.findAndCountAll({
      where,
      include: [
        {
          model: User,
          attributes: ["id", "username", "avatar_url"],
        },
      ],
      order, // Áp dụng order
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
      distinct: true,
      logging: (sql) => console.log("Executing SQL:", sql),
    });

    console.log(`Found ${result.count} recipes after applying all conditions`);

    return {
      rows: result.rows,
      count: result.count,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(result.count / Number(limit)),
    };
  } catch (error) {
    console.error("Search service error:", error);
    throw error;
  }
}

async function getSuggestions(q) {
  if (!q) return { suggestions: [] };

  const limit = 8; // tag suggestions
  const tagRows = await Tag.findAll({
    where: { name: { [Op.like]: `%${q}%` } },
    attributes: ["name"],
    limit,
  }); // recipe title suggestions

  const recipeRows = await Recipe.findAll({
    where: { title: { [Op.like]: `%${q}%` } },
    attributes: ["title"],
    limit,
  });

  const suggestions = [
    ...new Set([
      ...tagRows.map((t) => t.name),
      ...recipeRows.map((r) => r.title),
    ]),
  ].slice(0, limit);

  return { suggestions };
}

async function getTrending(limit = 10) {
  // trending by views (fallback)
  const rows = await Recipe.findAll({
    limit: Number(limit),
    order: [["views", "DESC"]],
    attributes: ["id", "title", "slug", "image_url", "views"],
    include: [{ model: User, attributes: ["id", "username"] }],
  });
  return rows;
}

module.exports = {
  searchRecipes,
  getSuggestions,
  getTrending,
};
