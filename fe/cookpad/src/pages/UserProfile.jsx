import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Edit3, FileText, Loader2, Camera, Users } from 'lucide-react';

import {
  getCurrentUser,
  getUserStats,
  getFollowers,
  getFollowing,
} from '../services/userApi';
import { getMyRecipes, getCookedRecipes } from '../services/recipeApi';

import RecipeListItem from '../components/RecipeListItem';
import EditProfileModal from '../components/EditProfileModal';
import UserListItem from '../components/UserListItem';

export default function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    recipes: 0,
    followers: 0,
    following: 0,
  });

  const [recipes, setRecipes] = useState([]);
  const [cooksnaps, setCooksnaps] = useState([]); // State mới lưu cooksnaps

  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('recipes');
  const [showEditModal, setShowEditModal] = useState(false);

  // Hàm tải dữ liệu
  const fetchData = async () => {
    try {
      //  Gọi thêm getCookedRecipes trong Promise.all
      const [userRes, statsRes, recipesRes, cooksnapsRes] = await Promise.all([
        getCurrentUser(),
        getUserStats('me'),
        getMyRecipes(),
        getCookedRecipes(), // API lấy danh sách đã nấu (cooksnaps)
      ]);

      setUser(userRes.data.data);
      setStats(statsRes.data.data);
      setRecipes(recipesRes.data.data.rows || []);
      // Lưu dữ liệu cooksnaps
      setCooksnaps(cooksnapsRes.data.data.rows || []);
    } catch (error) {
      console.error('Lỗi tải profile:', error);
      if (error.response && error.response.status === 401) {
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatClick = async (tabName) => {
    setActiveTab(tabName);
    setListLoading(true);
    setUserList([]);

    try {
      let res;
      if (tabName === 'following') {
        res = await getFollowing(user.id);
      } else if (tabName === 'followers') {
        res = await getFollowers(user.id);
      }

      if (res) {
        const users = res.data.data.map((u) => ({
          ...u,
          is_following: tabName === 'following',
        }));
        setUserList(users);
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

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* --- Header Thông tin --- */}
      <div className="flex flex-col items-center text-center mb-8">
        <img
          src={user.avatar_url || 'https://placehold.co/100x100?text=U'}
          alt={user.username}
          className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-sm mb-4"
          onError={(e) =>
            (e.target.src = 'https://placehold.co/100x100?text=U')
          }
        />
        <h2 className="text-2xl font-bold text-gray-900">{user.username}</h2>
        <p className="text-gray-500 text-sm mt-1">@{user.username}</p>

        {user.bio && (
          <p className="text-gray-700 mt-3 max-w-lg leading-relaxed">
            {user.bio}
          </p>
        )}

        <div className="flex gap-8 text-sm text-gray-600 my-6 bg-gray-50 px-8 py-3 rounded-full">
          <button
            onClick={() => handleStatClick('following')}
            className={`text-center hover:text-orange-600 transition-colors ${activeTab === 'following' ? 'text-orange-600 font-bold' : ''}`}
          >
            <span className="block font-bold text-lg">{stats.following}</span>
            <span>Bạn bếp</span>
          </button>

          <div className="w-px bg-gray-300 h-10 self-center mx-2"></div>

          <button
            onClick={() => handleStatClick('followers')}
            className={`text-center hover:text-orange-600 transition-colors ${activeTab === 'followers' ? 'text-orange-600 font-bold' : ''}`}
          >
            <span className="block font-bold text-lg">{stats.followers}</span>
            <span>Quan tâm</span>
          </button>
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
      {activeTab === 'recipes' || activeTab === 'cooksnaps' ? (
        <div className="flex justify-center border-b border-gray-200 mb-8 sticky top-[64px] bg-gray-50 z-10">
          <button
            onClick={() => setActiveTab('recipes')}
            className={`px-8 py-3 font-medium transition-colors relative ${
              activeTab === 'recipes'
                ? 'text-orange-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Món của tôi ({recipes.length})
            {activeTab === 'recipes' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600 rounded-t-full"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('cooksnaps')}
            className={`px-8 py-3 font-medium transition-colors relative ${
              activeTab === 'cooksnaps'
                ? 'text-orange-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {/* Cập nhật số lượng Cooksnaps */}
            Psnaps ({cooksnaps.length})
            {activeTab === 'cooksnaps' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600 rounded-t-full"></span>
            )}
          </button>
        </div>
      ) : (
        <div className="border-b border-gray-200 mb-6 pb-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('recipes')}
              className="text-sm text-gray-500 hover:text-orange-500"
            >
              ← Quay lại món ăn
            </button>
            <h3 className="text-lg font-bold text-gray-800">
              {activeTab === 'following'
                ? 'Danh sách Bạn Bếp'
                : 'Người Quan Tâm'}
            </h3>
          </div>
        </div>
      )}

      {/* --- Nội dung chính --- */}
      <div className="min-h-[200px]">
        {/* Tab Món ăn */}
        {activeTab === 'recipes' && (
          <>
            {recipes.length > 0 ? (
              <ul className="space-y-4">
                {recipes.map((recipe) => (
                  <RecipeListItem key={recipe.id} recipe={recipe} />
                ))}
              </ul>
            ) : (
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
                  với cộng đồng.
                </p>
                <button
                  onClick={() => navigate('/create-recipe')}
                  className="bg-orange-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors flex items-center gap-2 mx-auto shadow-sm"
                >
                  <Edit3 size={20} />
                  Viết món mới ngay
                </button>
              </div>
            )}
          </>
        )}

        {/* Tab Cooksnaps (Hiển thị dạng lưới ảnh) */}
        {activeTab === 'cooksnaps' && (
          <>
            {cooksnaps.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cooksnaps.map((item) => (
                  <div
                    key={item.cooksnap_id}
                    className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition flex gap-4"
                  >
                    {/* Ảnh Cooksnap */}
                    <Link
                      to={`/recipes/${item.id}`}
                      className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32"
                    >
                      <img
                        src={item.cooksnap_image || item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover rounded-lg border bg-gray-100"
                        onError={(e) =>
                          (e.target.src =
                            'https://placehold.co/150?text=No+Image')
                        }
                      />
                    </Link>

                    {/* Thông tin bên phải */}
                    <div className="flex flex-col flex-1 min-w-0">
                      {/* User Info */}
                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src={user.avatar_url || 'https://placehold.co/32'}
                          alt={user.username}
                          className="w-6 h-6 rounded-full object-cover border"
                        />
                        <span className="text-xs font-bold text-gray-700 truncate">
                          {user.username}
                        </span>
                      </div>

                      {/* Comment */}
                      {item.cooksnap_comment ? (
                        <p className="text-sm text-gray-800 italic mb-2 line-clamp-2">
                          "{item.cooksnap_comment}"
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400 italic mb-2">
                          Đã gửi psnap
                        </p>
                      )}

                      {/* Link đến món ăn gốc */}
                      <div className="mt-auto pt-2 border-t border-dashed">
                        <p className="text-xs text-gray-500">Psnaps cho món:</p>
                        <Link
                          to={`/recipes/${item.id}`}
                          className="text-sm font-medium text-orange-600 hover:underline line-clamp-1"
                        >
                          {item.title}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-500 bg-white rounded-xl border border-gray-100">
                <Camera className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">Bạn chưa có Psnaps nào.</p>
                <p className="text-sm mt-2">
                  Hãy thử nấu món của người khác và chia sẻ hình ảnh nhé!
                </p>
              </div>
            )}
          </>
        )}

        {/* Danh sách Bạn bè / Follower */}
        {(activeTab === 'following' || activeTab === 'followers') && (
          <div>
            {listLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-orange-500" />
              </div>
            ) : userList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userList.map((u) => (
                  <UserListItem key={u.id} user={u} currentUserId={user.id} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-500 bg-white rounded-xl border border-gray-100">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">
                  {activeTab === 'following'
                    ? 'Bạn chưa kết bạn với ai.'
                    : 'Chưa có ai quan tâm bạn.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        currentUser={user}
        onUpdateSuccess={fetchData}
      />
    </div>
  );
}
