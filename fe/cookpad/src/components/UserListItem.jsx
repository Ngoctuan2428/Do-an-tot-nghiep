// src/components/UserListItem.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { followUser } from "../services/userApi";

export default function UserListItem({ user, currentUserId, onUpdate }) {
  // Vì là danh sách "Bạn bếp" hoặc "Quan tâm", trạng thái follow có thể khác nhau
  // Tuy nhiên, để đơn giản, ta tạm giả định danh sách trả về chưa có trường is_following
  // Ta sẽ xử lý nút bấm dựa trên ngữ cảnh (nếu cần thiết sau này)

  const [isFollowing, setIsFollowing] = useState(user.is_following || false);
  const [isLoading, setIsLoading] = useState(false);
  const isMe = currentUserId && currentUserId === user.id;

  const handleFollowClick = async () => {
    setIsLoading(true);
    try {
      const res = await followUser(user.id);
      setIsFollowing(res.data.data.is_following);
      if (onUpdate) onUpdate(); // Gọi callback nếu cần cập nhật lại danh sách cha
    } catch (error) {
      console.error("Lỗi follow:", error);
      alert("Có lỗi xảy ra.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-3">
        <Link to={`/user/${user.id}`}>
          <img
            src={user.avatar_url || "https://placehold.co/64x64?text=U"}
            alt={user.username}
            className="w-12 h-12 rounded-full object-cover border"
            onError={(e) =>
              (e.target.src = "https://placehold.co/64x64?text=U")
            }
          />
        </Link>
        <div>
          <Link
            to={`/user/${user.id}`}
            className="font-semibold text-gray-900 hover:text-orange-500 hover:underline"
          >
            {user.username}
          </Link>
          <p className="text-xs text-gray-500">@{user.username}</p>
          {user.bio && (
            <p className="text-xs text-gray-600 mt-1 line-clamp-1">
              {user.bio}
            </p>
          )}
        </div>
      </div>

      {!isMe && (
        <button
          onClick={handleFollowClick}
          disabled={isLoading}
          className={`px-4 py-1.5 text-xs font-medium rounded-full transition-colors flex items-center gap-1 ${
            isFollowing
              ? "bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200"
              : "bg-orange-500 text-white border border-transparent hover:bg-orange-600"
          }`}
        >
          {isLoading ? (
            "..."
          ) : isFollowing ? (
            <>
              <Check size={14} /> Bạn bếp
            </>
          ) : (
            "Kết bạn"
          )}
        </button>
      )}
    </div>
  );
}
