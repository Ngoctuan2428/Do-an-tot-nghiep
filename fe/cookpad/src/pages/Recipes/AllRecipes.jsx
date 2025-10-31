// src/pages/Recipes/AllRecipes.jsx
import { useState, useEffect } from "react";
import RecipeSubPageLayout from "../../components/RecipeSubPageLayout";
import RecipeCard from "../../components/RecipeCard";
import { khoMonItems } from "../../data/sidebarData";
import { getMyRecipes } from "../../services/recipeApi"; // 1. Import API
import { useRecipeCounts } from "../../contexts/RecipeCountContext"; // 2. Import Context

// Lấy thông tin tĩnh (icon, label)
const currentItem = khoMonItems.find((item) => item.path === "/recipes/all");

export default function AllRecipes() {
  // 3. State để lưu món ăn và trạng thái loading
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // 4. Lấy count động từ context
  const { counts } = useRecipeCounts();
  const dynamicCount = counts.all || 0; // 'all' là key từ getRecipeCounts

  // 5. Gọi API khi component được tải
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        // API getMyRecipes trả về { data: { rows: [...] } }
        const response = await getMyRecipes();
        setRecipes(response.data.rows || []);
      } catch (error) {
        console.error("Failed to fetch 'All Recipes':", error);
        setRecipes([]); // Đặt mảng rỗng nếu lỗi
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []); // [] = Chạy 1 lần

  // 6. Hiển thị trạng thái loading
  if (loading) {
    return (
      <RecipeSubPageLayout
        title={currentItem.label}
        count={dynamicCount} // Vẫn hiển thị count động
      >
        <p>Đang tải món ăn của bạn...</p>
      </RecipeSubPageLayout>
    );
  }

  // 7. Hiển thị dữ liệu
  return (
    <RecipeSubPageLayout
      title={currentItem.label}
      count={dynamicCount} // 8. Truyền count động
      descriptionEmpty="Bạn chưa lưu món nào. Hãy duyệt công thức và lưu những món yêu thích!"
    >
      {recipes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            // 9. Truyền props vào RecipeCard
            <RecipeCard
              key={recipe.id}
              title={recipe.title}
              image={recipe.image_url} // Đảm bảo CSDL có 'image_url'
              views={recipe.views}
              likes={recipe.likes}
              premium={recipe.status === "premium"}
            />
          ))}
        </div>
      )}
    </RecipeSubPageLayout>
  );
}
