// src/pages/UserProfile.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit3, FileText, Loader2, Camera } from "lucide-react";
// Import các API cần thiết
import { getCurrentUser, getUserStats } from "../services/userApi";
import { getMyRecipes, getPublishedRecipes } from "../services/recipeApi";
// Import components
import RecipeListItem from "../components/RecipeListItem";
import EditProfileModal from "../components/EditProfileModal";

export default function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  // State thống kê: recipes, followers, following
  const [stats, setStats] = useState({
    recipes: 0,
    followers: 0,
    following: 0,
  });
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("recipes");
  const [showEditModal, setShowEditModal] = useState(false);

  // Hàm tải toàn bộ dữ liệu trang
  const fetchData = async () => {
    try {
      // Gọi song song 3 API để tiết kiệm thời gian
      const [userRes, statsRes, recipesRes] = await Promise.all([
        getCurrentUser(), // Lấy info user hiện tại
        getUserStats("me"), // Lấy thống kê của "me"
        getPublishedRecipes(), // Lấy danh sách món ăn
      ]);

      setUser(userRes.data.data);
      setStats(statsRes.data.data);
      setRecipes(recipesRes.data.data.rows || []);
    } catch (error) {
      console.error("Lỗi tải profile:", error);
      // Nếu lỗi 401 (chưa đăng nhập), có thể redirect về home hoặc hiện thông báo
      if (error.response && error.response.status === 401) {
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!user) return null; // Hoặc hiển thị lỗi nếu không lấy được user

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* --- Header Thông tin --- */}
      <div className="flex flex-col items-center text-center mb-8">
        <img
          src={user.avatar_url || "https://placehold.co/100x100?text=U"}
          alt={user.username}
          className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-sm mb-4"
          onError={(e) =>
            (e.target.src = "https://placehold.co/100x100?text=U")
          }
        />
        <h2 className="text-2xl font-bold text-gray-900">{user.username}</h2>
        <p className="text-gray-500 text-sm mt-1">@{user.username}</p>

        {/* Bio */}
        {user.bio && (
          <p className="text-gray-700 mt-3 max-w-lg leading-relaxed">
            {user.bio}
          </p>
        )}

        {/* Thống kê */}
        <div className="flex gap-8 text-sm text-gray-600 my-6 bg-gray-50 px-6 py-3 rounded-full">
          <div className="text-center">
            <span className="block font-bold text-gray-900 text-lg">
              {stats.recipes}
            </span>
            <span>Món</span>
          </div>
          <div className="text-center">
            <span className="block font-bold text-gray-900 text-lg">
              {stats.following}
            </span>
            <span>Bạn bếp</span>
          </div>
          <div className="text-center">
            <span className="block font-bold text-gray-900 text-lg">
              {stats.followers}
            </span>
            <span>Quan tâm</span>
          </div>
        </div>

        <button
          onClick={() => setShowEditModal(true)}
          className="border-2 border-gray-200 px-5 py-2 rounded-full text-gray-700 font-medium hover:border-gray-300 hover:bg-gray-50 flex items-center gap-2 transition-all"
        >
          <Edit3 className="w-4 h-4" />
          Sửa hồ sơ
        </button>
      </div>

      {/* --- Tabs --- */}
      <div className="flex justify-center border-b border-gray-200 mb-8 sticky top-[64px] bg-gray-50 z-10">
        <button
          onClick={() => setActiveTab("recipes")}
          className={`px-8 py-3 font-medium transition-colors relative ${
            activeTab === "recipes"
              ? "text-orange-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Món của tôi
          {activeTab === "recipes" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600 rounded-t-full"></span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("cooksnaps")}
          className={`px-8 py-3 font-medium transition-colors relative ${
            activeTab === "cooksnaps"
              ? "text-orange-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Cooksnaps
          {activeTab === "cooksnaps" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600 rounded-t-full"></span>
          )}
        </button>
      </div>

      {/* --- Nội dung Tabs --- */}
      <div>
        {activeTab === "recipes" && (
          <>
            {recipes.length > 0 ? (
              // 🟢 Có bài viết -> Hiển thị danh sách
              <ul className="space-y-4">
                {recipes.map((recipe) => (
                  <RecipeListItem key={recipe.id} recipe={recipe} />
                ))}
              </ul>
            ) : (
              // ⚪ Chưa có bài viết -> Hiển thị Empty State
              <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-200">
                <div className="flex justify-center mb-4">
                  <div className="bg-orange-50 p-5 rounded-full">
                    <FileText className="w-10 h-10 text-orange-500" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Bắt đầu hành trình nấu nướng!
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                  Lưu giữ những công thức tâm đắc của bạn và chia sẻ niềm vui
                  với cộng đồng yêu bếp.
                </p>
                <button
                  onClick={() => navigate("/create-recipe")}
                  className="bg-orange-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors flex items-center gap-2 mx-auto shadow-sm hover:shadow-md"
                >
                  <Edit3 size={20} />
                  Viết món mới ngay
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === "cooksnaps" && (
          <div className="text-center py-16 text-gray-500 bg-white rounded-xl border border-gray-100">
            <Camera className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">Bạn chưa có Cooksnap nào.</p>
            <p className="text-sm mt-2">
              Hãy thử nấu món của người khác và chia sẻ hình ảnh nhé!
            </p>
          </div>
        )}
      </div>

      {/* Modal chỉnh sửa profile */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        currentUser={user}
        onUpdateSuccess={fetchData} // Quan trọng: Tải lại data sau khi update thành công
      />
    </div>
  );
}
