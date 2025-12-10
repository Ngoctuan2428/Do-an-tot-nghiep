// src/components/RecipeCard.jsx
import { Link } from "react-router-dom"; // ✅ Import Link

export default function RecipeCard({
  id, // ✅ Thêm prop id
  title,
  image,
  premium = false,
  views = 0,
  likes = 0,
  user, // Nhận thêm thông tin user nếu cần hiển thị
}) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative group">
      {/* ✅ LINK BAO PHỦ TOÀN BỘ CARD (Nếu có ID) */}
      {id && (
        <Link
          to={`/recipes/${id}`}
          className="absolute inset-0 z-10"
          title={title}
        />
      )}

      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {premium && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold z-20">
            Premium
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-base group-hover:text-orange-600 transition-colors">
          {title}
        </h3>

        {/* Thông tin người đăng (nếu có) */}
        {user && (
          <div className="flex items-center gap-2 mb-3">
            <img
              src={user.avatar_url || "https://placehold.co/20"}
              alt={user.username}
              className="w-5 h-5 rounded-full object-cover"
            />
            <span className="text-xs text-gray-600 truncate">
              {user.username}
            </span>
          </div>
        )}

        <div className="flex justify-between text-xs text-gray-500 border-t pt-3 mt-auto">
          <span>{views} lượt xem</span>
          <span>{likes} lượt thích</span>
        </div>
      </div>
    </div>
  );
}
