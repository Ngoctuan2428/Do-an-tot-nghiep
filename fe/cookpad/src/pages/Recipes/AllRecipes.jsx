import { useState, useEffect, useMemo } from 'react';
import RecipeSubPageLayout from '../../components/RecipeSubPageLayout';
import RecipeListItem from '../../components/RecipeListItem';
import { khoMonItems } from '../../data/sidebarData';
import { getMyRecipes } from '../../services/recipeApi';
import { useRecipeCounts } from '../../contexts/RecipeCountContext';

const currentItem = khoMonItems.find((item) => item.path === '/recipes/all');

export default function AllRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('Đã xem gần nhất');
  const { counts } = useRecipeCounts();
  const dynamicCount = counts.all || 0;

  // 🟠 Lấy danh sách món từ API
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const response = await getMyRecipes();
        const rows = response.data.data.rows || [];
        setRecipes(rows);
        setFilteredRecipes(rows);
      } catch (error) {
        console.error("Failed to fetch 'All Recipes':", error);
        setRecipes([]);
        setFilteredRecipes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  //  Hàm tìm kiếm
  const handleSearch = (keyword) => {
    setSearchTerm(keyword);
  };

  //  Hàm chọn sắp xếp
  const handleSortChange = (option) => {
    setSortOption(option);
  };

  //  Tự động lọc và sắp xếp lại khi search hoặc sort thay đổi
  useEffect(() => {
    let results = [...recipes];

    // 🔍 Lọc theo từ khóa
    if (searchTerm.trim() !== '') {
      results = results.filter((recipe) =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    //  Sắp xếp
    if (sortOption === 'Mới nhất') {
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOption === 'Đã xem gần nhất') {
      // Nếu có trường `updatedAt` thì dùng, không thì fallback về `createdAt`
      results.sort(
        (a, b) =>
          new Date(b.updatedAt || b.createdAt) -
          new Date(a.updatedAt || a.createdAt)
      );
    }

    setFilteredRecipes(results);
  }, [searchTerm, sortOption, recipes]);

  //  Trạng thái loading
  if (loading) {
    return (
      <RecipeSubPageLayout title={currentItem.label} count={dynamicCount}>
        <p>Đang tải món ăn của bạn...</p>
      </RecipeSubPageLayout>
    );
  }

  // Giao diện chính
  return (
    <RecipeSubPageLayout
      title={currentItem.label}
      count={filteredRecipes.length}
      descriptionEmpty="Bạn chưa có món nào. Hãy tạo món ăn và lưu lại công thức của bạn!"
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
        <p className="text-gray-500 text-sm">Không tìm thấy món nào phù hợp.</p>
      )}
    </RecipeSubPageLayout>
  );
}
