// src/pages/Recipes/DraftRecipes.jsx

import { useState, useEffect, useMemo } from "react";
import RecipeSubPageLayout from "../../components/RecipeSubPageLayout";
import RecipeListItem from "../../components/RecipeListItem";
import { khoMonItems } from "../../data/sidebarData";
// ✅ THAY ĐỔI 1: Import hàm getDraftRecipes
import { getDraftRecipes } from "../../services/recipeApi";
import { useRecipeCounts } from "../../contexts/RecipeCountContext";

// ✅ THAY ĐỔI 2: Trỏ currentItem đến 'drafts'
const currentItem = khoMonItems.find((item) => item.path === "/recipes/drafts");

// ✅ THAY ĐỔI 3: Đổi tên component (để cho đúng)
export default function DraftRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("Đã xem gần nhất");
  const { counts } = useRecipeCounts();
  // ✅ THAY ĐỔI 4: Lấy count của 'drafts'
  const dynamicCount = counts.drafts || 0;

  // 🟠 Lấy danh sách món từ API
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        // ✅ THAY ĐỔI 5 (Quan trọng): Gọi API getDraftRecipes()
        const response = await getDraftRecipes();
        const rows = response.data.data.rows || [];
        setRecipes(rows);
        setFilteredRecipes(rows);
      } catch (error) {
        // Sửa lại log lỗi cho đúng
        console.error("Failed to fetch 'Draft Recipes':", error);
        setRecipes([]);
        setFilteredRecipes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  // 🟢 Hàm tìm kiếm
  const handleSearch = (keyword) => {
    setSearchTerm(keyword);
  };

  // 🟢 Hàm chọn sắp xếp
  const handleSortChange = (option) => {
    setSortOption(option);
  };

  // 🧠 Tự động lọc và sắp xếp lại khi search hoặc sort thay đổi
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

  // 🟡 Trạng thái loading
  if (loading) {
    return (
      <RecipeSubPageLayout title={currentItem.label} count={dynamicCount}>
        <p>Đang tải món nháp của bạn...</p>
      </RecipeSubPageLayout>
    );
  }

  // 🟢 Giao diện chính
  return (
    <RecipeSubPageLayout
      title={currentItem.label}
      count={filteredRecipes.length}
      descriptionEmpty="Bạn chưa có món nháp nào."
      onSearchSubmit={handleSearch}
      onSortChange={handleSortChange}
    >
      {filteredRecipes.length > 0 ? (
        <ul className="space-y-4">
          {filteredRecipes.map((recipe) => (
            <RecipeListItem key={recipe.id} recipe={recipe} />
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm">Không tìm thấy món nháp nào.</p>
      )}
    </RecipeSubPageLayout>
  );
}
