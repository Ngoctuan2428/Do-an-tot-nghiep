// src/pages/User.jsx
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  MoreHorizontal,
  Search,
  Clock,
  Users,
  Loader2,
  Check,
  Camera,
} from 'lucide-react';
// Import API
import {
  getUserById,
  getUserStats,
  followUser,
  getFollowers,
  getFollowing,
  getCurrentUser, // ✅ Import thêm
} from '../services/userApi';
import { getPublicRecipesByUserId } from '../services/recipeApi';
import UserListItem from '../components/UserListItem'; // ✅ Import component

export default function User() {
  const { id: userId } = useParams();
  const navigate = useNavigate();

  // activeTab có thể là: 'recipes', 'cooksnaps', 'following', 'followers'
  const [activeTab, setActiveTab] = useState('recipes');

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    recipes: 0,
    followers: 0,
    following: 0,
  });
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // State cho nút Follow chính
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  // ✅ State cho danh sách bạn bè
  const [userList, setUserList] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  // toggle chặn
  const [openBlock, setOpenBlock] = useState(false);
  const menuRef = useRef();

  // Đóng menu khi bấm ra ngoài
  useEffect(() => {
    const handleClickOutsideBlock = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenBlock(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideBlock);
    return () =>
      document.removeEventListener('mousedown', handleClickOutsideBlock);
  }, []);

  // Hàm tải dữ liệu
  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Lấy thông tin user, thống kê, và danh sách món ăn
        const [userRes, statsRes, recipesRes] = await Promise.all([
          getUserById(userId),
          getUserStats(userId),
          getPublicRecipesByUserId(userId),
        ]);

        setUser(userRes.data.data);
        setStats(statsRes.data.data);
        setRecipes(recipesRes.data.data.rows || []);
        setFilteredRecipes(recipesRes.data.data.rows || []);
        setIsFollowing(userRes.data.data.is_following || false);

        // 2. Lấy ID người dùng hiện tại (nếu đã đăng nhập) để xử lý nút kết bạn trong list
        try {
          const currentUserRes = await getCurrentUser();
          setCurrentUserId(currentUserRes.data.data.id);
        } catch (e) {
          // Không sao nếu chưa đăng nhập
        }
      } catch (error) {
        console.error('Lỗi tải trang cá nhân:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // Hàm xử lý tìm kiếm món ăn
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredRecipes(recipes);
    } else {
      setFilteredRecipes(
        recipes.filter((r) =>
          r.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, recipes]);

  // Toggle follow user này
  const handleFollowToggle = async () => {
    setIsFollowLoading(true);
    try {
      const res = await followUser(userId);
      setIsFollowing(res.data.data.is_following);
      const statsRes = await getUserStats(userId);
      setStats(statsRes.data.data);
    } catch (error) {
      console.error('Lỗi khi follow:', error);
      alert('Vui lòng đăng nhập để thực hiện.');
    } finally {
      setIsFollowLoading(false);
    }
  };

  // ✅ Xử lý khi click vào số lượng Bạn bếp/Người quan tâm
  const handleStatClick = async (tabName) => {
    setActiveTab(tabName);
    setListLoading(true);
    setUserList([]);

    try {
      let res;
      if (tabName === 'following') {
        res = await getFollowing(userId);
      } else if (tabName === 'followers') {
        res = await getFollowers(userId);
      }

      if (res) {
        setUserList(res.data.data || []);
      }
    } catch (error) {
      console.error(`Lỗi tải danh sách ${tabName}:`, error);
    } finally {
      setListLoading(false);
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

  const isMe =
    currentUserId && userId && currentUserId.toString() === userId.toString();

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      {/* Header thông tin đầu bếp */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6 relative">
        <img
          src={user.avatar_url || 'https://placehold.co/112x112?text=U'}
          alt={user.username}
          className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover" // Thêm object-cover để ảnh không bị méo
          onError={(e) => {
            e.target.onerror = null; // ✅ QUAN TRỌNG: Ngắt vòng lặp nếu ảnh thay thế cũng lỗi
            e.target.src = 'https://placehold.co/112x112?text=U';
          }}
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

          {/* ✅ THỐNG KÊ (CLICKABLE) */}
          <div className="flex gap-6 mt-4 text-gray-600 justify-center sm:justify-start text-sm">
            <button
              onClick={() => handleStatClick('following')}
              className={`hover:text-orange-600 transition-colors ${activeTab === 'following' ? 'text-orange-600 font-bold' : ''}`}
            >
              <strong className="text-gray-900 text-lg">
                {stats.following || 0}
              </strong>{' '}
              Bạn Bếp
            </button>
            <button
              onClick={() => handleStatClick('followers')}
              className={`hover:text-orange-600 transition-colors ${activeTab === 'followers' ? 'text-orange-600 font-bold' : ''}`}
            >
              <strong className="text-gray-900 text-lg">
                {stats.followers || 0}
              </strong>{' '}
              Người quan tâm
            </button>
          </div>

          {!isMe && (
            <button
              onClick={handleFollowToggle}
              disabled={isFollowLoading}
              className={`mt-4 px-5 py-2 rounded-lg font-medium transition-colors ${
                isFollowing
                  ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  : 'bg-orange-500 text-white hover:bg-orange-600'
              } ${isFollowLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isFollowLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isFollowing ? (
                <>
                  <Check className="w-5 h-5 inline mr-1" /> Bạn Bếp
                </>
              ) : (
                'Kết Bạn Bếp'
              )}
            </button>
          )}
        </div>
        <div className="absolute top-2 right-2" ref={menuRef}>
          <button
            className="border rounded-lg p-2 hover:bg-gray-50"
            onClick={() => setOpenBlock((prev) => !prev)}
          >
            <MoreHorizontal className="w-5 h-5 text-gray-600" />
          </button>
          {openBlock && (
            <div
              className="
            absolute top-10 right-0 
            bg-white shadow-lg border border-gray-200 
            rounded-lg w-28 py-1
            animate-fade-in
          "
            >
              <button
                className="
              w-full text-left px-3 py-2 text-sm text-gray-700
              hover:bg-gray-100 rounded-md
            "
              >
                Chặn
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ✅ NAVIGATION / TABS */}
      {activeTab === 'recipes' || activeTab === 'cooksnaps' ? (
        <div className="border-b flex items-center justify-center gap-8 mb-6 sticky top-[64px] bg-gray-50/90 z-10 backdrop-blur-sm">
          <button
            onClick={() => setActiveTab('recipes')}
            className={`py-3 font-medium ${
              activeTab === 'recipes'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Món ăn ({stats.recipes || 0})
          </button>
          <button
            onClick={() => setActiveTab('cooksnaps')}
            className={`py-3 font-medium ${
              activeTab === 'cooksnaps'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Cooksnaps (0)
          </button>
        </div>
      ) : (
        // Header khi xem danh sách
        <div className="border-b border-gray-200 mb-6 pb-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('recipes')}
              className="text-sm text-gray-500 hover:text-orange-500 flex items-center gap-1"
            >
              ← Quay lại món ăn
            </button>
            <h3 className="text-lg font-bold text-gray-800">
              {activeTab === 'following'
                ? `Bạn Bếp của ${user.username}`
                : `Người quan tâm ${user.username}`}
            </h3>
          </div>
        </div>
      )}

      {/* ✅ CONTENT */}
      {/* Ô tìm kiếm chỉ hiện khi ở tab Recipes */}
      {activeTab === 'recipes' && (
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
      )}

      <div className="space-y-4">
        {/* Tab Món ăn */}
        {activeTab === 'recipes' && (
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

        {/* Tab Cooksnaps */}
        {activeTab === 'cooksnaps' && (
          <div className="lg:min-w-[800px] md:min-w-[600px] text-center py-16 text-gray-500 bg-white rounded-xl border border-gray-100">
            <Camera className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">{user.username} chưa có Cooksnap nào.</p>
          </div>
        )}

        {/* ✅ Tab Danh sách User */}
        {(activeTab === 'following' || activeTab === 'followers') && (
          <div>
            {listLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-orange-500" />
              </div>
            ) : userList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userList.map((u) => (
                  <UserListItem
                    key={u.id}
                    user={u}
                    currentUserId={currentUserId}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-500 bg-white rounded-xl border border-gray-100">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">
                  {activeTab === 'following'
                    ? 'Người dùng này chưa theo dõi ai.'
                    : 'Chưa có ai quan tâm người dùng này.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Component thẻ Recipe
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
          {recipe.description || 'Chưa có mô tả'}
        </p>
        <div className="flex items-center gap-4 text-gray-500 text-sm mt-2">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" /> {recipe.total_time || 30} phút
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" /> {recipe.servings || '2 người'}
          </span>
        </div>
      </div>
      <Link to={`/recipes/${recipe.id}`}>
        <img
          src={recipe.image_url || 'https://placehold.co/112x112?text=No+Image'}
          alt={recipe.title}
          className="w-28 h-28 object-cover rounded-lg shadow-sm"
          onError={(e) =>
            (e.target.src = 'https://placehold.co/112x112?text=No+Image')
          }
        />
      </Link>
    </div>
  );
}
