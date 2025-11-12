// src/pages/Recipes/SavedRecipes.jsx
import { useState, useEffect } from "react";
import RecipeSubPageLayout from "../../components/RecipeSubPageLayout";
// ✅ IMPORT COMPONENT DÙNG CHUNG
import RecipeListItem from "../../components/RecipeListItem";
import { khoMonItems } from "../../data/sidebarData";
import { getSavedRecipes } from "../../services/recipeApi";
import { useRecipeCounts } from "../../contexts/RecipeCountContext";

const currentItem = khoMonItems.find((item) => item.path === "/recipes/saved");

export default function SavedRecipes() {
  const [recipes, setRecipes] = useState([]);
  // ✅ THÊM STATE LỌC
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  // ✅ THÊM STATE TÌM KIẾM + SẮP XẾP
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("Đã xem gần nhất");

  const { counts } = useRecipeCounts();
  const dynamicCount = counts.saved || 0; // 'saved' là key

  // 🟠 Gọi API
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const response = await getSavedRecipes();
        const rows = response.data.data.rows || [];
        setRecipes(rows);
        // ✅ CẬP NHẬT: Set cho cả state gốc và state đã lọc
        setFilteredRecipes(rows);
      } catch (error) {
        console.error("Failed to fetch 'Saved Recipes':", error);
        setRecipes([]);
        setFilteredRecipes([]); // ✅ CẬP NHẬT
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // 🟢 THÊM: Hàm tìm kiếm
  const handleSearch = (keyword) => {
    setSearchTerm(keyword);
  };

  // 🟢 THÊM: Hàm chọn sắp xếp
  const handleSortChange = (option) => {
    setSortOption(option);
  };

  // 🧠 THÊM: Tự động lọc và sắp xếp lại khi search hoặc sort thay đổi
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
      // ✅ CẬP NHẬT: Hiển thị count đã lọc
      count={filteredRecipes.length}
      descriptionEmpty="Bạn chưa lưu món nào. Hãy duyệt công thức và lưu những món yêu thích!"
      // ✅ CẬP NHẬT: Truyền props cho layout
      onSearchSubmit={handleSearch}
      onSortChange={handleSortChange}
    >
      {/* ✅ CẬP NHẬT: Render 'filteredRecipes' */}
      {filteredRecipes.length > 0 ? (
        <ul className="space-y-4">
          {filteredRecipes.map((recipe) => (
            // ✅ CẬP NHẬT: Dùng component đã import
            <RecipeListItem key={recipe.id} recipe={recipe} />
          ))}
        </ul>
      ) : (
        // ✅ CẬP NHẬT: Hiển thị khi không có kết quả lọc
        <p className="text-gray-500 text-sm">Không tìm thấy món nào phù hợp.</p>
      )}
    </RecipeSubPageLayout>
  );
}

// ❌ XÓA BỎ COMPONENT NỘI TUYẾN (RecipeListItem) Ở ĐÂY
