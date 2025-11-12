// src/pages/User.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom"; // ✅ THÊM 'Link' VÀO ĐÂY
import {
  MapPin,
  MoreHorizontal,
  Search,
  Clock,
  Users,
  Loader2,
  Check,
  Camera,
} from "lucide-react";
// Import API
import { getUserById, getUserStats, followUser } from "../services/userApi";
import { getPublicRecipesByUserId } from "../services/recipeApi";

export default function User() {
  const { id: userId } = useParams(); // Lấy ID user từ URL
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("recipes");
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    recipes: 0,
    followers: 0,
    following: 0,
  });
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // State cho nút Follow
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  // Hàm tải dữ liệu
  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Gọi song song API lấy thông tin và thống kê
        const [userRes, statsRes, recipesRes] = await Promise.all([
          getUserById(userId), // Lấy thông tin user (đã có is_following)
          getUserStats(userId), // Lấy thống kê (số món, follow...)
          getPublicRecipesByUserId(userId), // Lấy các món public
        ]);

        setUser(userRes.data.data);
        setStats(statsRes.data.data);
        setRecipes(recipesRes.data.data.rows || []);
        setFilteredRecipes(recipesRes.data.data.rows || []);

        // Cập nhật trạng thái follow ban đầu
        setIsFollowing(userRes.data.data.is_following || false);
      } catch (error) {
        console.error("Lỗi tải trang cá nhân:", error);
        // Có thể redirect về 404 nếu user ko tồn tại
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]); // Tải lại nếu ID trên URL thay đổi

  // Hàm xử lý tìm kiếm (phía client)
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredRecipes(recipes);
    } else {
      setFilteredRecipes(
        recipes.filter((r) =>
          r.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, recipes]);

  // Hàm xử lý nút Kết Bạn Bếp (Follow)
  const handleFollowToggle = async () => {
    setIsFollowLoading(true);
    try {
      const res = await followUser(userId);
      setIsFollowing(res.data.data.is_following);
      // Tải lại thống kê để cập nhật số người quan tâm
      const statsRes = await getUserStats(userId);
      setStats(statsRes.data.data);
    } catch (error) {
      console.error("Lỗi khi follow:", error);
      alert("Vui lòng đăng nhập để thực hiện.");
    } finally {
      setIsFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center p-10">Không tìm thấy người dùng này.</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      {/* Header thông tin đầu bếp */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6 relative">
        <img
          src={user.avatar_url || "https://placehold.co/112x112?text=U"}
          alt={user.username}
          className="w-28 h-28 rounded-full border-4 border-white shadow-md"
          onError={(e) =>
            (e.target.src = "https://placehold.co/112x112?text=U")
          }
        />
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
          <p className="text-gray-600">@{user.username}</p>
          {user.location && (
            <p className="flex items-center justify-center sm:justify-start text-gray-500 mt-1 text-sm">
              <MapPin className="w-4 h-4 mr-1" /> {user.location}
            </p>
          )}
          {user.bio && (
            <p className="mt-3 text-gray-700 max-w-2xl text-sm leading-relaxed">
              {user.bio}
            </p>
          )}
          <div className="flex gap-6 mt-4 text-gray-600 justify-center sm:justify-start text-sm">
            <span>
              <strong className="text-gray-900">{stats.following || 0}</strong>{" "}
              Bạn Bếp
            </span>
            <span>
              <strong className="text-gray-900">{stats.followers || 0}</strong>{" "}
              Người quan tâm
            </span>
          </div>
          <button
            onClick={handleFollowToggle}
            disabled={isFollowLoading}
            className={`mt-4 px-5 py-2 rounded-lg font-medium transition-colors ${
              isFollowing
                ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                : "bg-orange-500 text-white hover:bg-orange-600"
            } ${isFollowLoading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {isFollowLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isFollowing ? (
              <>
                <Check className="w-5 h-5 inline mr-1" /> Bạn Bếp
              </>
            ) : (
              "Kết Bạn Bếp"
            )}
          </button>
        </div>
        <div className="absolute top-2 right-2">
          <button className="border rounded-lg p-2 hover:bg-gray-50">
            <MoreHorizontal className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b flex items-center justify-center gap-8 mb-6 sticky top-[64px] bg-gray-50/90 z-10 backdrop-blur-sm">
        <button
          onClick={() => setActiveTab("recipes")}
          className={`py-3 font-medium ${
            activeTab === "recipes"
              ? "text-orange-600 border-b-2 border-orange-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Món ăn ({stats.recipes || 0})
        </button>
        <button
          onClick={() => setActiveTab("cooksnaps")}
          className={`py-3 font-medium ${
            activeTab === "cooksnaps"
              ? "text-orange-600 border-b-2 border-orange-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Cooksnaps (0)
        </button>
      </div>

      {/* Ô tìm kiếm */}
      <div className="flex items-center gap-2 mb-6 max-w-sm">
        <div className="flex items-center border rounded-lg w-full px-3 bg-white shadow-sm">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={`Tìm trong món ăn của ${user.username}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-2 py-2.5 outline-none text-sm bg-transparent"
          />
        </div>
      </div>

      {/* Danh sách */}
      <div className="space-y-4">
        {activeTab === "recipes" && (
          <>
            {filteredRecipes.length > 0 ? (
              filteredRecipes.map((r) => <RecipeCard key={r.id} recipe={r} />)
            ) : (
              <p className="text-center text-gray-500 py-10">
                {user.username} chưa đăng món ăn nào.
              </p>
            )}
          </>
        )}

        {activeTab === "cooksnaps" && (
          <div className="text-center py-16 text-gray-500 bg-white rounded-xl border border-gray-100">
            <Camera className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">{user.username} chưa có Cooksnap nào.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Component thẻ Recipe (giữ nguyên như trong file User.jsx gốc của bạn)
function RecipeCard({ recipe }) {
  return (
    <div className="flex items-start gap-4 border-b pb-4 last:border-b-0">
      <div className="flex-1">
        <Link
          to={`/recipes/${recipe.id}`}
          className="font-semibold text-lg text-gray-800 hover:text-orange-500 cursor-pointer line-clamp-2"
        >
          {recipe.title}
        </Link>
        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
          {recipe.description || "Chưa có mô tả"}
        </p>
        <div className="flex items-center gap-4 text-gray-500 text-sm mt-2">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" /> {recipe.total_time || 30} phút
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" /> {recipe.servings || "2 người"}
          </span>
        </div>
      </div>
      <Link to={`/recipes/${recipe.id}`}>
        <img
          src={recipe.image_url || "https://placehold.co/112x112?text=No+Image"}
          alt={recipe.title}
          className="w-28 h-28 object-cover rounded-lg shadow-sm"
          onError={(e) =>
            (e.target.src = "https://placehold.co/112x112?text=No+Image")
          }
        />
      </Link>
    </div>
  );
}
