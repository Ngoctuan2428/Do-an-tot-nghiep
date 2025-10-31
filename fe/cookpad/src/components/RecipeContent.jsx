import { Users, Clock } from "lucide-react";

export default function RecipeContent({ recipe }) {
  if (!recipe) {
    return (
      <p className="text-center text-gray-500 py-10">Đang tải công thức...</p>
    );
  }

  // ---- ⬇️ SỬA LOGIC CHÍNH Ở ĐÂY ⬇️ ----

  let ingredients = [];
  let steps = [];

  // Xử lý 'ingredients' (đang là TEXT trong CSDL)
  if (Array.isArray(recipe.ingredients)) {
    // Trường hợp nó đã là mảng
    ingredients = recipe.ingredients;
  } else if (
    typeof recipe.ingredients === "string" &&
    recipe.ingredients.startsWith("[")
  ) {
    // Trường hợp nó là một chuỗi JSON (vd: '["item 1", "item 2"]')
    try {
      ingredients = JSON.parse(recipe.ingredients);
    } catch (e) {
      console.error("Lỗi parse JSON cột ingredients:", e);
      ingredients = []; // Gán mảng rỗng nếu parse lỗi
    }
  }

  // Xử lý 'steps' (đang là JSON trong CSDL)
  // (Cột steps là DataTypes.JSON trong model,
  // nên Sequelize sẽ tự động parse, chúng ta chỉ cần kiểm tra Array.isArray)
  if (Array.isArray(recipe.steps)) {
    steps = recipe.steps;
  } else if (typeof recipe.steps === "string" && recipe.steps.startsWith("[")) {
    // Dự phòng trường hợp steps cũng là chuỗi
    try {
      steps = JSON.parse(recipe.steps);
    } catch (e) {
      console.error("Lỗi parse JSON cột steps:", e);
      steps = [];
    }
  }

  // ---- ⬆️ KẾT THÚC SỬA LOGIC ⬆️ ----

  return (
    <section className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-[35%_65%] gap-8">
      {/* Cột 1: Nguyên Liệu */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Nguyên Liệu</h2>
          <div className="flex items-center text-gray-600">
            <Users className="w-4 h-4 mr-1" /> {recipe.servings || "—"}
          </div>
        </div>

        {/* Vòng lặp NGUYÊN LIỆU (dùng biến 'ingredients' đã xử lý) */}
        <ul className="space-y-3 text-gray-700">
          {ingredients.map((ingredientString, i) => (
            <li key={i} className="flex justify-between border-b pb-2">
              <span>{ingredientString}</span>
            </li>
          ))}
          {ingredients.length === 0 && (
            <li className="text-gray-500 italic">Chưa có nguyên liệu.</li>
          )}
        </ul>
      </div>

      {/* Cột 2: Hướng dẫn */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Hướng dẫn cách làm</h2>
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-1" /> {recipe.cook_time || "—"}
          </div>
        </div>

        {/* Vòng lặp CÁC BƯỚC (dùng biến 'steps' đã xử lý) */}
        <ol className="space-y-6">
          {steps.map((stepText, i) => (
            <li key={i}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-semibold flex-shrink-0">
                  {i + 1}
                </div>
                <p className="text-gray-800 flex-1">{stepText}</p>
              </div>
            </li>
          ))}
          {steps.length === 0 && (
            <li className="text-gray-500 italic">Chưa có hướng dẫn.</li>
          )}
        </ol>
      </div>
    </section>
  );
}
