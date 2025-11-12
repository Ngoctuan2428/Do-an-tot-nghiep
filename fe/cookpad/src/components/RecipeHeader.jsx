// src/components/RecipeHeader.jsx
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
// ✅ 1. Import API
import { saveRecipe, likeRecipe, sendCooksnap } from "../services/recipeApi"; // ✅ Import sendCooksnap
import { uploadMedia } from "../services/uploadApi"; // ✅ Import uploadMedia
import { useRecipeCounts } from "../contexts/RecipeCountContext";
import ReactersModal from "./ReactersModal";
import { Link } from "react-router-dom";

export default function RecipeHeader({ recipe }) {
  // ✅ 2. State 'isSaved' sẽ được cập nhật động
  // const [isSaved, setIsSaved] = useState(false);
  const { savedRecipeIds, likedRecipeIds, refreshCounts } = useRecipeCounts();
  const isSaved = savedRecipeIds.has(recipe?.id);
  const isLiked = likedRecipeIds.has(recipe?.id);
  const [likeCount, setLikeCount] = useState(recipe?.likes || 0);
  const [isLikedTemp, setIsLikedTemp] = useState(false);
  const [showReacters, setShowReacters] = useState(false);

  const [isFavourite, setIsFavourite] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null);
  const menuRef = useRef(null);

  const [uploadingCooksnap, setUploadingCooksnap] = useState(false); // State loading cho cooksnap

  useEffect(() => {
    if (recipe) {
      setLikeCount(recipe.likes || 0);
    }
  }, [recipe]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (menuRef.current && !menuRef.current.contains(event.target)) {
  //       setShowMenu(false);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

  // ✅ 3. Thêm useEffect để kiểm tra trạng thái "Đã lưu" khi tải trang
  // useEffect(() => {
  //   // Reset trạng thái khi công thức thay đổi
  //   setIsSaved(false);

  //   if (recipe?.id) {
  //     const checkSavedStatus = async () => {
  //       try {
  //         // Gọi API lấy danh sách các món đã lưu
  //         const response = await getSavedRecipes();
  //         // Tạo một Set (tập hợp) các ID đã lưu để kiểm tra nhanh
  //         const savedIds = new Set(response.data.data.rows.map((r) => r.id));
  //         if (savedIds.has(recipe.id)) {
  //           setIsSaved(true);
  //         }
  //       } catch (error) {
  //         // Lỗi này thường xảy ra nếu user chưa đăng nhập
  //         console.warn(
  //           "Không thể kiểm tra trạng thái đã lưu (user có thể chưa đăng nhập)"
  //         );
  //       }
  //     };
  //     checkSavedStatus();
  //   }
  // }, [recipe]); // Chạy lại khi 'recipe' prop thay đổi

  const handleLike = async () => {
    if (!recipe?.id) return;
    try {
      // Gọi API toggle
      const response = await likeRecipe(recipe.id);
      // API trả về: { status: 'success', data: { liked: true/false, likes: 10 } }
      const { likes } = response.data.data;

      // Cập nhật số lượng like hiển thị ngay lập tức
      setLikeCount(likes);

      // Cập nhật Context để đồng bộ trạng thái trái tim trên toàn app
      await refreshCounts();
    } catch (error) {
      console.error("Lỗi khi like:", error);
      alert("Vui lòng đăng nhập để thể hiện cảm xúc!");
    }
  };

  // ✅ 4. Thêm hàm xử lý Lưu/Bỏ lưu (gọi API)
  const handleSaveToggle = async () => {
    if (!recipe?.id) return;
    try {
      // 1. Gọi API (giữ nguyên)
      await saveRecipe(recipe.id);

      // 2. Yêu cầu Context cập nhật lại TOÀN BỘ
      // (Bao gồm counts cho Sidebar VÀ savedRecipeIds cho các component khác)
      await refreshCounts();
    } catch (error) {
      console.error("Lỗi khi lưu món:", error);
      alert("Đã xảy ra lỗi. Bạn vui lòng đăng nhập để thực hiện thao tác này.");
    }
  };

  const handleShare = async () => {
    // ... (Giữ nguyên hàm handleShare)
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

  const handlePrint = () => {
    window.print();
  };

  const handleChooseFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      alert(`Đã chọn hình: ${file.name}`);
    }
  };

  if (!recipe) return null;

  const imageUrl =
    recipe.image_url || "https://via.placeholder.com/600x400?text=No+Image";
  const author = recipe.User || {};
  const authorProfileUrl = author.id ? `/user/${author.id}` : "#";

  // ✅ HÀM XỬ LÝ MỚI KHI CHỌN FILE COOKSNAP
  const handleCooksnapFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!recipe?.id) return;

    try {
      setUploadingCooksnap(true);

      // 1. Upload ảnh lên server trước
      const uploadRes = await uploadMedia(file);
      const imageUrl = uploadRes.data.url;

      // 2. Gọi API gửi Cooksnap (đánh dấu đã nấu)
      await sendCooksnap(recipe.id, imageUrl, "Món này ngon tuyệt!"); // Có thể thêm input cho user nhập comment sau

      // 3. Cập nhật lại số lượng trên Sidebar (quan trọng!)
      await refreshCounts();

      alert("Gửi Cooksnap thành công! Món ăn đã được thêm vào 'Đã nấu'.");
      setShowModal(false); // Đóng modal
    } catch (error) {
      console.error("Lỗi gửi Cooksnap:", error);
      alert("Gửi Cooksnap thất bại. Vui lòng thử lại.");
    } finally {
      setUploadingCooksnap(false);
      // Reset input file để có thể chọn lại cùng 1 file nếu muốn
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <section className="bg-white pb-8">
      <div className="max-w-6xl mx-auto px-4 pt-8">
        {/* (Toàn bộ phần Grid, ảnh, tiêu đề, tác giả... giữ nguyên) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Cột trái: ảnh món ăn */}
          <div className="relative overflow-hidden rounded-lg shadow-lg">
            <img
              src={imageUrl}
              alt={recipe.title}
              className="w-full h-auto object-cover max-h-[500px] lg:max-h-[600px]"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://via.placeholder.com/600x400?text=Image+Not+Found";
              }}
            />
            <div className="absolute bottom-3 right-4 bg-black/60 text-white text-sm px-2 py-1 rounded">
              {author.username.substring(0, 10) || "BON BON"}
            </div>
          </div>

          {/* Cột phải: thông tin */}
          <div className="flex flex-col h-full">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 pb-4">
              {recipe.title}
            </h1>
            {/* ✅ CẬP NHẬT PHẦN REACTION */}
            <div id="reactions_section" className="mb-6">
              {/* Dòng text thống kê -> Click để mở modal */}
              <button
                onClick={() => setShowReacters(true)}
                className="text-sm text-gray-600 mb-2 hover:underline focus:outline-none"
                disabled={likeCount === 0} // Không mở nếu chưa có ai like
              >
                {likeCount > 0
                  ? `${likeCount} người đã bày tỏ cảm xúc`
                  : "Hãy là người đầu tiên thả tim!"}
              </button>

              <ul className="flex items-center gap-2">
                {/* Nút Thả Tim (Hoạt động) */}
                <li>
                  <button
                    onClick={handleLike}
                    className={`flex items-center h-8 rounded-full px-3 text-sm border-transparent transition-colors ${
                      isLikedTemp
                        ? "bg-red-100 text-red-600" // Style khi vừa bấm like
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <span className="mr-1">❤️</span>
                    <span className="font-medium">{likeCount}</span>
                  </button>
                </li>

                {/* Các nút khác (Tạm ẩn hoặc để static cho đẹp đội hình nếu muốn) */}
                {/* Nếu muốn hiển thị cho giống Cookpad nhưng không bấm được thì bỏ comment ra: */}
                {/*
                    <li className="opacity-50 cursor-not-allowed" title="Tính năng đang phát triển">
                        <div className="flex items-center h-8 rounded-full px-3 text-sm bg-gray-100 text-gray-400">
                            <span className="mr-1">😋</span>
                            <span>0</span>
                        </div>
                    </li>
                    <li className="opacity-50 cursor-not-allowed" title="Tính năng đang phát triển">
                        <div className="flex items-center h-8 rounded-full px-3 text-sm bg-gray-100 text-gray-400">
                            <span className="mr-1">👏</span>
                            <span>0</span>
                        </div>
                    </li>
                    */}
              </ul>
            </div>
            {/* ✅ KẾT THÚC PHẦN REACTION MỚI */}
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold mb-3 hover:bg-orange-600 w-fit"
            >
              <Soup className="w-5 h-5" />
              Mở hàng cooksnap cho món này!
            </button>
            {/* ✅ CẬP NHẬT PHẦN HIỂN THỊ SỐ NGƯỜI LƯU */}
            <p className="text-gray-600 flex items-center gap-2 mb-4">
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
            <div className="flex items-center gap-3 p-3 rounded-lg border border-transparent hover:border-gray-100 transition-colors">
              <Link to={authorProfileUrl} className="flex-shrink-0">
                <img
                  src={author.avatar_url || "/default-avatar.png"}
                  alt={author.username || "Tác giả"}
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-avatar.png";
                  }}
                />
              </Link>
              <div>
                <Link
                  to={authorProfileUrl}
                  className="font-semibold text-gray-800 hover:text-cookpad-orange hover:underline"
                >
                  {author.username || "Ẩn danh"}
                </Link>
                {/* ... (phần location giữ nguyên) */}
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />{" "}
                  {author.location || "Không rõ nơi chốn"}
                </p>
              </div>
            </div>
            {recipe.hashtag && (
              <p className="mt-3 text-orange-500 font-medium">
                {recipe.hashtag}
              </p>
            )}
            <p className="text-gray-700 text-sm mt-1">{recipe.description}</p>

            {/* Nút hành động (Đẩy xuống cuối) */}
            <div className="flex items-center gap-3 mt-auto pt-5 relative">
              {/* ✅ 5. CẬP NHẬT NÚT LƯU MÓN */}
              <button
                onClick={handleSaveToggle} // Thay đổi onClick
                className={`px-4 py-2 rounded-lg font-medium border flex items-center gap-2 transition ${
                  isSaved
                    ? "bg-orange-500 text-white border-orange-500" // Trạng thái đã lưu
                    : "border-orange-500 text-orange-500 hover:bg-orange-50" // Trạng thái chưa lưu
                }`}
              >
                <Bookmark
                  className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} // Tô màu icon nếu đã lưu
                />
                <span className="text-cookpad-16 font-medium">
                  {isSaved ? "Đã lưu" : "Lưu món"}
                </span>
              </button>
              {/* (Các nút khác giữ nguyên) */}
              <button
                onClick={() => setIsFavourite(!isFavourite)}
                className={`px-4 py-2 rounded-lg font-medium border flex items-center gap-2 transition ${
                  isFavourite
                    ? "bg-orange-500 text-white border-orange-500"
                    : "border-orange-500 text-orange-500 hover:bg-orange-50"
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span className="text-cookpad-16 font-medium">
                  {isFavourite ? "Đã thêm" : "Thêm vào BST"}
                </span>
              </button>
              <button
                className="border p-2 rounded-lg hover:bg-gray-50 text-gray-700"
                onClick={handleShare}
                title="Chia sẻ"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                className="border p-2 rounded-lg hover:bg-gray-50 text-gray-700"
                onClick={handlePrint}
                title="In"
              >
                <Printer className="w-5 h-5" />
              </button>
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="border p-2 rounded-lg hover:bg-gray-50 text-gray-700"
                  title="Menu"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-12 w-48 bg-white border rounded-lg shadow-md py-2 z-50">
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                      onClick={handleChooseFile}
                    >
                      <Soup className="w-4 h-4" /> Thêm Cooksnap{" "}
                      <input
                        ref={fileInputRef}
                        id="file"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-gray-700">
                      🚩 Báo cáo món này
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000]">
          <div className="bg-white rounded-xl p-6 w-96 relative shadow-2xl animate-fade-in">
            <button
              onClick={() => !uploadingCooksnap && setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={uploadingCooksnap}
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Soup className="w-8 h-8 text-orange-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Gửi Cooksnap
              </h2>
              <p className="text-gray-600 text-sm mb-6">
                Chia sẻ hình ảnh thành phẩm của bạn để truyền cảm hứng cho cộng
                đồng!
              </p>

              <button
                onClick={handleChooseFile}
                disabled={uploadingCooksnap}
                className="w-full bg-orange-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 disabled:bg-orange-300"
              >
                {uploadingCooksnap ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Đang tải lên...
                  </>
                ) : (
                  "Chọn Hình"
                )}
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleCooksnapFileChange} // ✅ Gọi hàm xử lý mới
              className="hidden"
            />
          </div>
        </div>
      )}
      {showReacters && (
        <ReactersModal
          recipeId={recipe?.id}
          onClose={() => setShowReacters(false)}
        />
      )}
    </section>
  );
}
