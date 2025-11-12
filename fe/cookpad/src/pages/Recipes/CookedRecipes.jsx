import { useState, useEffect } from "react";
import RecipeSubPageLayout from "../../components/RecipeSubPageLayout";
import RecipeListItem from "../../components/RecipeListItem";
import { khoMonItems } from "../../data/sidebarData";
import { getCookedRecipes } from "../../services/recipeApi";
import { useRecipeCounts } from "../../contexts/RecipeCountContext";

const currentItem = khoMonItems.find((item) => item.path === "/recipes/cooked");

export default function CookedRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("Mới nhất");
  const { counts } = useRecipeCounts();
  const dynamicCount = counts.cooked || 0;

  // 🟠 Lấy danh sách món đã nấu từ API
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const response = await getCookedRecipes();
        const rows = response.data.data.rows || [];
        setRecipes(rows);
        setFilteredRecipes(rows);
      } catch (error) {
        console.error("❌ Lỗi khi tải món đã nấu:", error);
        setRecipes([]);
        setFilteredRecipes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  // 🟢 Hàm tìm kiếm món
  const handleSearch = (keyword) => {
    setSearchTerm(keyword);
  };

  // 🟢 Hàm thay đổi sắp xếp
  const handleSortChange = (option) => {
    setSortOption(option);
  };

  // 🧠 Lọc và sắp xếp lại danh sách khi search hoặc sort thay đổi
  useEffect(() => {
    let results = [...recipes];

    // 🔍 Lọc theo từ khóa
    if (searchTerm.trim() !== "") {
      results = results.filter((recipe) =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 🔄 Sắp xếp
    if (sortOption === "Mới nhất") {
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOption === "Đã xem gần nhất") {
      results.sort(
        (a, b) =>
          new Date(b.updatedAt || b.createdAt) -
          new Date(a.updatedAt || a.createdAt)
      );
    }

    setFilteredRecipes(results);
  }, [searchTerm, sortOption, recipes]);

  // 🟡 Hiển thị trạng thái loading
  if (loading) {
    return (
      <RecipeSubPageLayout title={currentItem.label} count={dynamicCount}>
        <p>Đang tải danh sách món đã nấu...</p>
      </RecipeSubPageLayout>
    );
  }

  // 🟢 Giao diện chính
  return (
    <RecipeSubPageLayout
      title={currentItem.label}
      count={filteredRecipes.length}
      descriptionEmpty="Bạn chưa đánh dấu món nào là 'Đã nấu'."
      onSearchSubmit={handleSearch}
      onSortChange={handleSortChange}
    >
      {filteredRecipes.length > 0 ? (
        <ul className="space-y-4">
          {filteredRecipes.map((recipe) => (
            <RecipeListItem
              key={recipe.cooked_id || recipe.id}
              recipe={recipe}
            />
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm">
          Không tìm thấy món nào phù hợp với từ khóa hoặc bộ lọc.
        </p>
      )}
    </RecipeSubPageLayout>
  );
}
