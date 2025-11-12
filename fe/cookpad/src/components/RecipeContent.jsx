// src/components/RecipeContent.jsx
import { Users, Clock } from "lucide-react";

export default function RecipeContent({ recipe }) {
  if (!recipe) {
    return (
      <p className="text-center text-gray-500 py-10">Đang tải công thức...</p>
    );
  }

  // --- Logic parse (chuyển đổi) dữ liệu ---
  let ingredients = [];
  let steps = [];

  // Xử lý 'ingredients' (là TEXT trong CSDL)
  try {
    if (
      typeof recipe.ingredients === "string" &&
      recipe.ingredients.startsWith("[")
    ) {
      ingredients = JSON.parse(recipe.ingredients);
    } else if (Array.isArray(recipe.ingredients)) {
      ingredients = recipe.ingredients;
    }
  } catch (e) {
    console.error("Lỗi parse JSON cột ingredients:", e, recipe.ingredients);
    ingredients = [];
  }

  // Xử lý 'steps' (là JSON trong CSDL)
  try {
    if (Array.isArray(recipe.steps)) {
      steps = recipe.steps;
    } else if (
      typeof recipe.steps === "string" &&
      recipe.steps.startsWith("[")
    ) {
      steps = JSON.parse(recipe.steps);
    }
  } catch (e) {
    console.error("Lỗi parse JSON cột steps:", e, recipe.steps);
    steps = [];
  }
  // --- (Kết thúc logic parse) ---

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
        <ul className="space-y-3 text-gray-700">
          {ingredients.map((ingredient, i) => {
            // ✅ KIỂM TRA KIỂU DỮ LIỆU ĐỂ RENDER PHÙ HỢP
            return (
              <li key={i} className="flex justify-between border-b pb-2">
                {typeof ingredient === "object" && ingredient !== null ? (
                  // Nếu là object {name, amount}
                  <span>
                    {ingredient.name}{" "}
                    {ingredient.amount && `- ${ingredient.amount}`}
                  </span>
                ) : (
                  // Nếu là chuỗi bình thường
                  <span>{ingredient}</span>
                )}
              </li>
            );
          })}
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

        {/* ✅ SỬA LỖI VÒNG LẶP STEPS */}
        <ol className="space-y-6">
          {steps.map((step, i) => {
            // Kiểm tra xem 'step' là 'string' (dữ liệu cũ)
            // hay 'object' (dữ liệu mới)
            const isString = typeof step === "string";
            const stepText = isString ? step : step.text;
            const stepImage = isString ? null : step.image;

            return (
              <li key={i}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-semibold flex-shrink-0">
                    {i + 1}
                  </div>
                  {/* Hiển thị 'stepText' (đã kiểm tra) */}
                  <p className="text-gray-800 flex-1">{stepText}</p>
                </div>

                {/* Hiển thị 'stepImage' (đã kiểm tra) */}
                {stepImage && (
                  <img
                    src={stepImage}
                    alt={`Bước ${i + 1}`}
                    className="mt-3 ml-11 w-full max-w-sm h-auto object-cover rounded-lg shadow-sm"
                  />
                )}
              </li>
            );
          })}

          {steps.length === 0 && (
            <li className="text-gray-500 italic">Chưa có hướng dẫn.</li>
          )}
        </ol>
      </div>
    </section>
  );
}
