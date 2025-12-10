// src/components/RelatedRecipes.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { getRelatedRecipes } from "../services/recipeApi";

// ✅ Nhận props là currentRecipeId chứ không phải recipes
export default function RelatedRecipes({ currentRecipeId }) {
  const [recipes, setRecipes] = useState([]); // Khởi tạo mảng rỗng để tránh lỗi map
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      if (!currentRecipeId) return;
      try {
        setLoading(true);
        const res = await getRelatedRecipes(currentRecipeId);
        // Đảm bảo dữ liệu là mảng, nếu không thì fallback về mảng rỗng
        setRecipes(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (error) {
        console.error("Lỗi lấy món tương tự:", error);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();
  }, [currentRecipeId]);

  if (loading)
    return (
      <div className="py-10 text-center">
        <Loader2 className="animate-spin inline text-orange-500" />
      </div>
    );

  if (!recipes || recipes.length === 0) return null; // Không có món thì ẩn luôn

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 border-t border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Có thể bạn sẽ thích
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((r) => (
          <Link
            to={`/recipes/${r.id}`}
            key={r.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition group overflow-hidden border border-gray-100"
            onClick={() => window.scrollTo(0, 0)}
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={
                  r.image_url || "https://placehold.co/600x400?text=No+Image"
                }
                alt={r.title}
                className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                onError={(e) =>
                  (e.target.src = "https://placehold.co/600x400?text=No+Image")
                }
              />
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1 text-gray-900 group-hover:text-orange-600 transition line-clamp-1">
                {r.title}
              </h3>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2 h-10">
                {r.description || "Món ăn ngon hấp dẫn..."}
              </p>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <img
                  src={r.User?.avatar_url || "https://placehold.co/30"}
                  className="w-6 h-6 rounded-full object-cover"
                  onError={(e) => (e.target.src = "https://placehold.co/30")}
                />
                <span>{r.User?.username || "Ẩn danh"}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
