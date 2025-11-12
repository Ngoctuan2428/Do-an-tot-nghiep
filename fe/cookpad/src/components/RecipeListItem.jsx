// src/components/RecipeListItem.jsx
import { Lock, MapPin } from "lucide-react"; // Thêm MapPin nếu muốn hiện location
import { Link } from "react-router-dom"; // Import Link

// Component này render item với ảnh bên trái, nội dung bên phải
export default function RecipeListItem({ recipe }) {
  // Định dạng ngày tháng
  const formattedDate = new Intl.DateTimeFormat("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(recipe.created_at));

  const author = recipe.User || {};
  // ✅ Tạo URL đến trang cá nhân
  const authorProfileUrl = author.id ? `/user/${author.id}` : "#";

  return (
    // Bố cục flex (Ảnh Trái, Nội dung Phải)
    <li className="flex bg-white p-4 rounded-lg shadow-sm border border-gray-200 gap-5 overflow-hidden hover:bg-gray-50">
      {/* 1. ✅ BỌC ẢNH TRONG THẺ <Link> */}
      <Link
        to={`/recipes/${recipe.id}`}
        className="flex-none relative w-32 h-44 lg:w-40 lg:h-auto lg:min-h-[170px]"
      >
        <img
          src={recipe.image_url || "https://placehold.co/160x170?text=No+Image"}
          alt={recipe.title}
          className="object-cover h-full w-full rounded-md"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/160x170?text=Error";
          }}
        />

        {/* ĐÁNH DẤU MÓN NHÁP (status='draft') */}
        {recipe.status === "draft" && (
          <div className="absolute z-10 bottom-2 left-2 p-1 bg-gray-600 rounded-md text-white text-xs leading-none flex items-center gap-1">
            <Lock size={12} />
            <span>Món Nháp</span>
          </div>
        )}

        {/* ĐÁNH DẤU MÓN ĐÃ ĐĂNG (status='public') */}
        {recipe.status === "public" && (
          <div className="absolute z-10 bottom-2 left-2 p-1 bg-green-600 rounded-md text-white text-xs leading-none flex items-center gap-1">
            <span>Đã đăng</span>
          </div>
        )}
      </Link>{" "}
      {/* 1. ✅ ĐÓNG THẺ <Link> */}
      {/* Cột nội dung (Bên phải) */}
      <div className="flex-auto flex flex-col">
        {/* Phần trên: Tiêu đề */}
        <div className="flex justify-between items-start gap-2 w-full">
          <h2 className="text-lg lg:text-xl font-semibold line-clamp-2 break-words">
            {/* 2. Tiêu đề cũng là 1 Link (Giữ nguyên) */}
            <Link to={`/recipes/${recipe.id}`} className="hover:underline">
              {recipe.title}
            </Link>
          </h2>
        </div>

        {/* Mô tả (nếu có) */}
        <div className="text-sm text-gray-600 line-clamp-2 break-words my-1">
          {recipe.description || "Chưa có mô tả..."}
        </div>

        {/* ✅ CẬP NHẬT TÁC GIẢ CÓ LINK */}
        <div className="mt-auto pt-2">
          <div className="flex items-center gap-2">
            <Link to={authorProfileUrl} className="flex-shrink-0">
              <img
                alt={author.username}
                loading="lazy"
                className="rounded-full w-6 h-6 object-cover border border-gray-100"
                src={author.avatar_url || "https://placehold.co/24"}
                onError={(e) => (e.target.src = "https://placehold.co/24")}
              />
            </Link>
            <Link
              to={authorProfileUrl}
              className="text-sm text-gray-700 font-medium hover:text-cookpad-orange hover:underline truncate"
            >
              {author.username || "Ẩn danh"}
            </Link>
          </div>
        </div>

        {/* Đẩy ngày tạo xuống dưới cùng */}
        <div className="flex-grow"></div>

        <div className="mt-2 text-xs text-gray-500">
          Tạo ngày {formattedDate}
        </div>
      </div>
    </li>
  );
}
