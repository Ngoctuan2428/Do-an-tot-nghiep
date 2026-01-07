// src/components/RecipeHeader.jsx
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  Soup,
  Bookmark,
  MoreHorizontal,
  Share2,
  Printer,
  X,
  User,
  MapPin,
  ThumbsUp,
  Heart,
  Hand,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";

// Import API
import {
  saveRecipe, // sendCooksnap,
  likeRecipe,
  getRecipeCooksnaps,
} from "../services/recipeApi";
// import { uploadMedia } from "../services/uploadApi";
import { useRecipeCounts } from "../contexts/RecipeCountContext";

// Import Components
import ReactersModal from "./ReactersModal";
import CooksnapModal from "./CooksnapModal";

export default function RecipeHeader({ recipe }) {
  const navigate = useNavigate();
  const { savedRecipeIds, likedRecipeIds, refreshCounts } = useRecipeCounts();

  // State kiểm tra trạng thái từ Context
  const isSaved = savedRecipeIds.has(recipe?.id);
  const isLiked = likedRecipeIds.has(recipe?.id);

  // Các state nội bộ
  const [likeCount, setLikeCount] = useState(recipe?.likes || 0);
  // const [isLikedTemp, setIsLikedTemp] = useState(false);
  const [showReacters, setShowReacters] = useState(false);

  const [isFavourite, setIsFavourite] = useState(false); // State cho "Thêm vào BST" (nếu cần logic riêng)
  const [showMenu, setShowMenu] = useState(false);

  // State điều khiển Modal Cooksnap
  const [showCooksnap, setShowCooksnap] = useState(false);

  // State lưu danh sách Cooksnap
  const [cooksnaps, setCooksnaps] = useState([]);

  const menuRef = useRef(null);
  // const fileInputRef = useRef(null); // Dùng cho input file trong menu dropdown (nếu còn dùng)

  // Hàm tải danh sách Cooksnap từ API
  const fetchCooksnaps = async () => {
    if (!recipe?.id) return;
    try {
      const res = await getRecipeCooksnaps(recipe.id);
      setCooksnaps(res.data.data || []);
    } catch (error) {
      console.error("Lỗi tải cooksnap:", error);
    }
  };

  // Effect: Cập nhật khi recipe thay đổi
  useEffect(() => {
    if (recipe) {
      setLikeCount(recipe.likes || 0);
      fetchCooksnaps(); // Tải cooksnap ngay khi có thông tin món ăn
    }
  }, [recipe]);

  // Effect: Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Xử lý Thích món ăn
  const handleLike = async () => {
    if (!recipe?.id) return;
    try {
      // Tạm thời update UI
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));

      const response = await likeRecipe(recipe.id);
      const { likes } = response.data.data;

      setLikeCount(likes); // Cập nhật lại số thật từ server
      await refreshCounts(); // Đồng bộ Context
    } catch (error) {
      console.error("Lỗi khi like:", error);
      // Revert nếu lỗi (có thể thêm logic revert setLikeCount ở đây)
      alert("Vui lòng đăng nhập để thể hiện cảm xúc!");
    }
  };

  // Xử lý Lưu món ăn
  const handleSaveToggle = async () => {
    if (!recipe?.id) return;
    try {
      await saveRecipe(recipe.id);
      await refreshCounts();
    } catch (error) {
      console.error("Lỗi khi lưu món:", error);
      alert("Đã xảy ra lỗi. Bạn vui lòng đăng nhập để thực hiện thao tác này.");
    }
  };

  // Xử lý Chia sẻ
  const handleShare = async () => {
    const shareData = {
      title: recipe.title,
      text: `Hãy xem món ăn này trên Cookpad: ${recipe.title}`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Chia sẻ bị hủy:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Đã sao chép link vào clipboard!");
    }
  };

  // Xử lý In
  const handlePrint = () => {
    window.print();
  };

  // Xử lý chọn file từ menu dropdown (nếu dùng)
  // const handleChooseFile = () => {
  //   if (fileInputRef.current) {
  //     fileInputRef.current.click();
  //   }
  // };

  // Callback khi gửi Cooksnap thành công từ Modal
  const handleCooksnapSuccess = () => {
    console.log("Cooksnap sent via Header!");
    fetchCooksnaps(); // Tải lại danh sách để hiển thị ngay lập tức
  };

  if (!recipe) return null;

  const imageUrl =
    recipe.image_url || "https://placehold.co/600x400?text=No+Image";
  const author = recipe.User || {};
  const authorProfileUrl = author.id ? `/user/${author.id}` : "#";

  return (
    <section className="bg-white pb-8">
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* --- CỘT TRÁI: ẢNH MÓN ĂN --- */}
          <div className="relative overflow-hidden rounded-lg shadow-lg">
            <img
              src={imageUrl}
              alt={recipe.title}
              className="w-full h-auto object-cover max-h-[500px] lg:max-h-[600px]"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/600x400?text=Image+Not+Found";
              }}
            />
            <div className="absolute bottom-3 right-4 bg-black/60 text-white text-sm px-2 py-1 rounded">
              {author.username?.substring(0, 10) || "PCook"}
            </div>
          </div>

          {/* --- CỘT PHẢI: THÔNG TIN --- */}
          <div className="flex flex-col h-full">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 pb-4">
              {recipe.title}
            </h1>

            {/* Phần Reaction (Thả tim) */}
            <div id="reactions_section" className="mb-6">
              <button
                onClick={() => setShowReacters(true)}
                className="text-sm text-gray-600 mb-2 hover:underline focus:outline-none"
                disabled={likeCount === 0}
              >
                {likeCount > 0
                  ? `${likeCount} người đã bày tỏ cảm xúc`
                  : "Hãy là người đầu tiên thả tim!"}
              </button>

              <ul className="flex items-center gap-2">
                <li>
                  <button
                    onClick={handleLike}
                    className={`flex items-center h-8 rounded-full px-3 text-sm border transition-colors ${
                      isLiked
                        ? "bg-red-50 text-red-600 border-red-200"
                        : "bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200"
                    }`}
                  >
                    <span className="mr-1">{isLiked ? "❤️" : "🤍"}</span>
                    <span className="font-medium">{likeCount}</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* ✅ PHẦN HIỂN THỊ COOKSNAP */}
            {cooksnaps.length > 0 ? (
              // TRƯỜNG HỢP 1: ĐÃ CÓ COOKSNAP -> HIỂN THỊ DANH SÁCH & NÚT GỬI THÊM
              <div className="mb-6 p-4 bg-orange-50 rounded-xl border border-orange-100">
                <div
                  className="flex items-center justify-between mb-3 cursor-pointer group"
                  onClick={() => navigate(`/recipes/${recipe.id}/cooksnaps`)} // ✅ Điều hướng
                >
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2 overflow-hidden">
                      {cooksnaps.slice(0, 3).map((snap, i) => (
                        <img
                          key={i}
                          className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover bg-gray-200"
                          src={
                            snap.User?.avatar_url || "https://placehold.co/32"
                          }
                          alt="user"
                          onError={(e) =>
                            (e.target.src = "https://placehold.co/32")
                          }
                        />
                      ))}
                    </div>
                    <span className="text-gray-800 font-bold text-sm">
                      {cooksnaps.length} Cooksnap
                    </span>
                  </div>
                </div>

                {/* Grid danh sách Cooksnap (Hiện tối đa 2 cái mới nhất) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  {cooksnaps.slice(0, 2).map((snap) => (
                    <div
                      key={snap.id}
                      className="bg-white p-2 rounded-lg flex items-start gap-3 border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition"
                      onClick={() =>
                        navigate(`/recipes/${recipe.id}/cooksnaps`)
                      } // ✅ Điều hướng
                    >
                      {/* Ảnh Cooksnap */}
                      <img
                        src={snap.image_url}
                        className="w-16 h-16 object-cover rounded-md flex-shrink-0 bg-gray-100 border border-gray-100"
                        alt="cooksnap"
                        onError={(e) =>
                          (e.target.src = "https://placehold.co/64")
                        }
                      />
                      <div className="flex flex-col min-w-0 justify-center h-full">
                        <div className="flex items-center gap-1.5 mb-1">
                          <img
                            src={
                              snap.User?.avatar_url || "https://placehold.co/20"
                            }
                            className="w-5 h-5 rounded-full object-cover border border-gray-100"
                            alt="user"
                            onError={(e) =>
                              (e.target.src = "https://placehold.co/20")
                            }
                          />
                          <span className="text-xs font-bold text-gray-800 truncate max-w-[100px]">
                            {snap.User?.username}
                          </span>
                        </div>
                        {snap.comment && (
                          <p className="text-xs text-gray-600 line-clamp-2 italic">
                            "{snap.comment}"
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Nút gửi thêm */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Ngăn click lan ra ngoài div cha
                    setShowCooksnap(true);
                  }}
                  className="w-full mt-2 text-sm text-orange-600 font-semibold hover:text-orange-700 hover:bg-orange-100 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Soup size={18} /> Gửi thêm Cooksnap của bạn
                </button>
              </div>
            ) : (
              // TRƯỜNG HỢP 2: CHƯA CÓ -> HIỂN THỊ NÚT MỞ HÀNG
              <button
                onClick={() => setShowCooksnap(true)}
                className="flex items-center gap-2 bg-orange-500 text-white px-5 py-3 rounded-lg font-bold mb-6 hover:bg-orange-600 w-fit transition-all shadow-sm hover:shadow-md"
              >
                <Soup className="w-6 h-6" />
                Mở hàng cooksnap cho món này!
              </button>
            )}

            {/* Số người lưu */}
            <p className="text-gray-600 flex items-center gap-2 mb-4 text-sm">
              <User className="w-4 h-4" />{" "}
              {recipe.favorites_count > 0 ? (
                <span>
                  Có <strong>{recipe.favorites_count}</strong> bếp khác đang
                  định nấu món này
                </span>
              ) : (
                <span>Hãy là người đầu tiên lưu món này nhé!</span>
              )}
            </p>

            {/* Thông tin tác giả */}
            <div className="flex items-center gap-3 p-3 rounded-lg border border-transparent hover:border-gray-100 hover:bg-gray-50 transition-all cursor-pointer group">
              <Link to={authorProfileUrl} className="flex-shrink-0">
                <img
                  src={author.avatar_url || "https://placehold.co/64x64?text=U"}
                  alt={author.username || "Tác giả"}
                  className="w-12 h-12 rounded-full object-cover border border-gray-200 group-hover:border-orange-200 transition-colors"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/64x64?text=U";
                  }}
                />
              </Link>
              <div>
                <Link
                  to={authorProfileUrl}
                  className="font-bold text-gray-900 hover:text-orange-600 hover:underline transition-colors"
                >
                  {author.username || "Ẩn danh"}
                </Link>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" />{" "}
                  {author.location || "Không rõ nơi chốn"}
                </p>
              </div>
            </div>

            {/* Hashtag & Mô tả */}
            {recipe.hashtag && (
              <p className="mt-4 text-orange-600 font-medium text-sm hover:underline cursor-pointer">
                {recipe.hashtag}
              </p>
            )}
            <p className="text-gray-700 text-sm mt-2 leading-relaxed">
              {recipe.description}
            </p>

            {/* Nút hành động dưới cùng */}
            <div className="flex items-center gap-3 mt-auto pt-6 border-t border-gray-100">
              <button
                onClick={handleSaveToggle}
                className={`flex-1 px-4 py-2.5 rounded-lg font-semibold border flex items-center justify-center gap-2 transition-all ${
                  isSaved
                    ? "bg-orange-50 text-orange-600 border-orange-200"
                    : "border-orange-500 text-orange-600 hover:bg-orange-50"
                }`}
              >
                <Bookmark
                  className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`}
                />
                <span className="text-sm">
                  {isSaved ? "Đã lưu" : "Lưu món"}
                </span>
              </button>

              <button
                onClick={() => setIsFavourite(!isFavourite)}
                className={`px-4 py-2.5 rounded-lg font-semibold border flex items-center gap-2 transition-all ${
                  isFavourite
                    ? "bg-gray-100 text-gray-700 border-gray-300"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
                title="Thêm vào Bộ sưu tập"
              >
                <Bookmark className="w-5 h-5" />
              </button>

              <button
                className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
                onClick={handleShare}
                title="Chia sẻ"
              >
                <Share2 className="w-5 h-5" />
              </button>

              <button
                className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
                onClick={handlePrint}
                title="In công thức"
              >
                <Printer className="w-5 h-5" />
              </button>

              {/* Menu Dropdown */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 bottom-full mb-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50 overflow-hidden">
                    <button
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700 transition-colors"
                      onClick={() => {
                        setShowMenu(false);
                        setShowCooksnap(true);
                      }}
                    >
                      <Soup className="w-4 h-4 text-orange-500" /> Thêm Cooksnap
                    </button>
                    <div className="h-px bg-gray-100 my-1"></div>
                    <button className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm text-red-600 transition-colors">
                      🚩 Báo cáo món này
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Cooksnap (Mới) */}
      {showCooksnap && (
        <CooksnapModal
          recipeId={recipe.id}
          recipeAuthorName={recipe.User?.username || "Đầu bếp"}
          onClose={() => setShowCooksnap(false)}
          onSuccess={handleCooksnapSuccess}
        />
      )}

      {/* Modal Reacters (Người thả tim) */}
      {showReacters && (
        <ReactersModal
          recipeId={recipe?.id}
          onClose={() => setShowReacters(false)}
        />
      )}
    </section>
  );
}
