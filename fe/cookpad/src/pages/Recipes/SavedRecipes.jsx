// src/pages/Recipes/SavedRecipes.jsx
import { useState, useEffect } from "react";
import RecipeSubPageLayout from "../../components/RecipeSubPageLayout";
import RecipeCard from "../../components/RecipeCard";
import { khoMonItems } from "../../data/sidebarData";
import { getSavedRecipes } from "../../services/recipeApi"; // 1. Import API
import { useRecipeCounts } from "../../contexts/RecipeCountContext"; // 2. Import Context

const currentItem = khoMonItems.find((item) => item.path === "/recipes/saved");

export default function SavedRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // 3. Lấy count động
  const { counts } = useRecipeCounts();
  const dynamicCount = counts.saved || 0; // 'saved' là key

  // 4. Gọi API
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const response = await getSavedRecipes();
        setRecipes(response.data.rows || []);
      } catch (error) {
        console.error("Failed to fetch 'Saved Recipes':", error);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) {
    return (
      <RecipeSubPageLayout title={currentItem.label} count={dynamicCount}>
        <p>Đang tải món ăn đã lưu...</p>
      </RecipeSubPageLayout>
    );
  }

  return (
    <RecipeSubPageLayout
      title={currentItem.label}
      count={dynamicCount} // 5. Dùng count động
      descriptionEmpty="Bạn chưa lưu món nào. Hãy duyệt công thức và lưu những món yêu thích!"
    >
      {recipes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              title={recipe.title}
              image={recipe.image_url}
              views={recipe.views}
              likes={recipe.likes}
            />
          ))}
        </div>
      )}
    </RecipeSubPageLayout>
  );
}
