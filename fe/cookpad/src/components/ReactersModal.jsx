import { useEffect, useState } from 'react';
import { X, Check, Heart } from 'lucide-react';
import { getRecipeReacters } from '../services/recipeApi';
import { followUser, getCurrentUser } from '../services/userApi';
import { Link } from 'react-router-dom'; // ✅ Import Link

function UserRow({ user, currentUserId }) {
  const [isFollowing, setIsFollowing] = useState(user.is_following || false);
  const [isLoading, setIsLoading] = useState(false);

  const profileUrl = user.id ? `/user/${user.id}` : '#';

  const isMe = currentUserId && currentUserId == user.id;

  const handleFollowClick = async () => {
    setIsLoading(true);
    try {
      const response = await followUser(user.id);
      setIsFollowing(response.data.data.is_following);
    } catch (error) {
      console.error('Lỗi kết bạn:', error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(error.response.data.message);
      } else {
        alert('Vui lòng đăng nhập để thực hiện chức năng này.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3 py-2">
      {/* ✅ Avatar có Link */}
      <Link
        to={profileUrl}
        className="flex-shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={user?.avatar_url || 'https://placehold.co/64x64?text=U'}
          alt={user?.username}
          className="w-10 h-10 rounded-full object-cover border hover:opacity-80 transition-opacity"
          onError={(e) => (e.target.src = 'https://placehold.co/64x64?text=U')}
        />
      </Link>

      <div className="flex-1 min-w-0">
        {/* ✅ Tên có Link */}
        <Link
          to={profileUrl}
          className="font-semibold text-gray-900 truncate text-sm md:text-base hover:text-cookpad-orange hover:underline block"
          onClick={(e) => e.stopPropagation()}
        >
          {user?.username || 'Người dùng ẩn danh'}
          {isMe && (
            <span className="text-gray-500 font-normal text-xs ml-2">
              (Bạn)
            </span>
          )}
        </Link>
        <p className="text-xs text-gray-500 truncate">@{user?.username}</p>
      </div>

      {/* ✅ Nút Kết bạn: Chỉ hiện nếu KHÔNG PHẢI là chính mình (!isMe) */}
      {!isMe && (
        <button
          onClick={handleFollowClick}
          disabled={isLoading}
          className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors flex items-center gap-1 flex-shrink-0 ${
            isFollowing
              ? 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
              : 'bg-orange-500 text-white border border-transparent hover:bg-orange-600'
          } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isFollowing ? (
            <>
              <Check size={14} /> Bạn bếp
            </>
          ) : (
            'Kết bạn'
          )}
        </button>
      )}
    </div>
  );
}

export default function ReactersModal({ recipeId, onClose }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await getCurrentUser();
        setCurrentUserId(res.data.data.id);
      } catch (e) {
        console.warn('Chưa đăng nhập hoặc lỗi lấy thông tin user.');
      }
    };
    fetchCurrentUser();

    // lấy danh sách người thả tim
    const fetchReacters = async () => {
      try {
        setLoading(true);
        const res = await getRecipeReacters(recipeId);
        setUsers(res.data.data.users || []);
        setTotal(res.data.data.total || 0);
      } catch (err) {
        console.error('Failed to fetch reacters:', err);
        setError('Không thể tải danh sách.');
      } finally {
        setLoading(false);
      }
    };

    if (recipeId) {
      fetchReacters();
    }
  }, [recipeId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
      {/* Overlay để đóng khi click ra ngoài */}
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[80vh] relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Tất Cả</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:bg-gray-100 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b bg-gray-50 text-sm">
          <button className="flex-1 py-3 text-orange-600 border-b-2 border-orange-600 font-medium text-center flex items-center justify-center gap-2">
            <Heart size={16} className="fill-current text-orange-600" /> Đã
            thích ({total})
          </button>
        </div>

        {/* Danh sách User */}
        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          {loading && (
            <p className="text-center text-gray-500 py-4">Đang tải...</p>
          )}

          {error && <p className="text-center text-red-500 py-4">{error}</p>}

          {!loading && !error && users.length === 0 && (
            <p className="text-center text-gray-500 py-6">
              Chưa có ai thả tim món này.
            </p>
          )}

          {!loading &&
            users.map((user) => (
              <UserRow
                key={user?.id || Math.random()}
                user={user}
                currentUserId={currentUserId}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
