// src/pages/RecipeDetail.jsx
import { useEffect, useState, useRef } from "react"; // 1. Import thêm useRef
import { useParams } from "react-router-dom";
import RecipeHeader from "../components/RecipeHeader";
import RecipeContent from "../components/RecipeContent";
import CooksnapSection from "../components/CooksnapSection";
import RelatedRecipes from "../components/RelatedRecipes";
import { getRecipeById } from "../services/recipeApi";
import RecipeDraftView from "../components/RecipeDraftView";

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState(null);

  // 2. Tạo một ref để lưu lại ID của món ăn đã load gần nhất
  const fetchedIdRef = useRef(null);

  useEffect(() => {
    if (!id) return;

    // 3. Logic chặn gọi 2 lần (Anti-Double-Fetch):
    // Nếu ID hiện tại giống hệt ID đã fetch trước đó -> Dừng lại, không gọi API nữa.
    if (fetchedIdRef.current === id) {
      return;
    }

    // Đánh dấu là đã bắt đầu fetch ID này
    fetchedIdRef.current = id;

    const fetchRecipe = async () => {
      setLoading(true);
      try {
        const res = await getRecipeById(id);
        setRecipe(res.data.data);
      } catch (err) {
        console.error("Failed to load recipe:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();

    // Lưu ý: Không cần cleanup function reset ref ở đây
    // vì chúng ta so sánh trực tiếp với ID mới.
  }, [id]);

  if (loading) return <div className="p-6">Đang tải công thức...</div>;
  if (error || !recipe)
    return <div className="p-6">Không tìm thấy công thức hoặc đã có lỗi.</div>;

  // Kiểm tra trạng thái Draft
  if (recipe.status === "draft") {
    return (
      <div className="bg-white text-gray-900">
        <RecipeDraftView recipe={recipe} />
      </div>
    );
  }

  // Hiển thị chi tiết (Public)
  return (
    <div className="bg-white text-gray-900">
      <RecipeHeader recipe={recipe} />
      <RecipeContent recipe={recipe} />
      <CooksnapSection recipe={recipe} />
      <RelatedRecipes currentRecipeId={id} />
    </div>
  );
}
