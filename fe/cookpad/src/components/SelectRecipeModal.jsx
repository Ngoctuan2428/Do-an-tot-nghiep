// src/components/SelectRecipeModal.jsx
import { useState, useEffect } from "react";
import { X, Search, Loader2, ChefHat } from "lucide-react";
import { getMyRecipes, updateRecipe } from "../services/recipeApi";

export default function SelectRecipeModal({
  isOpen,
  onClose,
  challengeHashtag,
  onSuccess,
}) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Tải danh sách món của tôi khi mở modal
  useEffect(() => {
    if (isOpen) {
      fetchMyRecipes();
    }
  }, [isOpen]);

  const fetchMyRecipes = async () => {
    setLoading(true);
    try {
      const res = await getMyRecipes();
      // Chỉ lấy các món đã public (status='public')
      const publicRecipes = (res.data.data.rows || []).filter(
        (r) => r.status === "public"
      );
      setRecipes(publicRecipes);
    } catch (error) {
      console.error("Lỗi tải món ăn:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Xử lý chọn món -> Thêm hashtag vào mô tả -> Update
  const handleSelect = async (recipe) => {
    if (submitting) return;

    // Kiểm tra xem món này đã có hashtag chưa
    if (recipe.description && recipe.description.includes(challengeHashtag)) {
      alert(`Món "${recipe.title}" đã tham gia thử thách này rồi!`);
      return;
    }

    if (!window.confirm(`Gửi món "${recipe.title}" tham gia thử thách này?`))
      return;

    setSubmitting(true);
    try {
      // Thêm hashtag vào cuối mô tả hiện tại
      const newDescription = recipe.description
        ? `${recipe.description}\n\n${challengeHashtag}`
        : challengeHashtag;

      await updateRecipe(recipe.id, { description: newDescription });

      alert("Tham gia thành công!");
      if (onSuccess) onSuccess(); // Callback để tải lại danh sách bên ngoài
      onClose();
    } catch (error) {
      console.error("Lỗi tham gia:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Lọc món ăn theo từ khóa tìm kiếm
  const filteredRecipes = recipes.filter((r) =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/60 px-4 animate-fade-in">
      {/* Overlay đóng modal */}
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="bg-white w-full max-w-lg rounded-xl flex flex-col max-h-[80vh] relative z-10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Chọn món tham gia
            </h3>
            <p className="text-xs text-orange-600 font-medium">
              {challengeHashtag}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b bg-gray-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm món của bạn..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Recipe List */}
        <div className="overflow-y-auto flex-1 p-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <Loader2 className="animate-spin text-orange-500" />
              <span className="text-sm text-gray-500">
                Đang tải món của bạn...
              </span>
            </div>
          ) : filteredRecipes.length === 0 ? (
            <div className="text-center py-12 px-4">
              <p className="text-gray-500 mb-2">
                Bạn chưa có món ăn nào phù hợp.
              </p>
              <p className="text-sm text-gray-400">
                Hãy viết món mới và "Lên sóng" để tham gia nhé!
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  onClick={() => handleSelect(recipe)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-orange-50 cursor-pointer transition-colors border border-transparent hover:border-orange-200 group"
                >
                  <img
                    src={recipe.image_url || "https://placehold.co/60"}
                    alt={recipe.title}
                    className="w-14 h-14 rounded-md object-cover bg-gray-200 border"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-800 truncate group-hover:text-orange-700">
                      {recipe.title}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {recipe.description || "Không có mô tả"}
                    </p>
                  </div>
                  <div className="p-2 text-gray-300 group-hover:text-orange-500">
                    <ChefHat size={20} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
