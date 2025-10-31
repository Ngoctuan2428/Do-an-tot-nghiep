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
} from "lucide-react";

export default function RecipeHeader({ recipe }) {
  const [isSaved, setIsSaved] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
  const author = recipe.User || {
    username: "Ẩn danh",
    avatar_url: "/default-avatar.png",
    location: "Không rõ địa điểm",
  };

  return (
    <section className="bg-white pb-8">
      <div className="max-w-6xl mx-auto px-4 pt-8">
        {/* 1. Bố cục 2 cột (Grid) */}
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
            {/* ✅ 1. Tiêu đề (Đã nằm ở cột phải) */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 pb-4">
              {recipe.title}
            </h1>

            {/* ✅ 2. Phần cảm xúc (Đã nằm ở cột phải) */}
            <div className="flex items-center text-sm text-gray-600 mb-6">
              <span className="flex items-center mr-3">
                <Heart size={16} className="text-red-500 mr-1" />
                {recipe.hearts_count || 6}
              </span>
              <span className="flex items-center mr-3">
                <ThumbsUp size={16} className="text-blue-500 mr-1" />
                {recipe.likes || 12}
              </span>
              <span className="flex items-center mr-4">
                <Hand size={16} className="text-yellow-500 mr-1" />
                {recipe.claps_count || 8}
              </span>
              <span className="text-gray-500">
                Minh Hayes và các bạn khác đã thích
              </span>
            </div>

            {/* Nút mở hàng (Modal) */}
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold mb-3 hover:bg-orange-600 w-fit"
            >
              <Soup className="w-5 h-5" />
              Mở hàng cooksnap cho món này!
            </button>

            {/* Thông tin số người */}
            <p className="text-gray-600 flex items-center gap-2 mb-4">
              <User className="w-4 h-4" />{" "}
              {recipe.interestedCount
                ? `${recipe.interestedCount} bếp khác đang định nấu món này`
                : "11 bếp khác đang định nấu món này"}{" "}
            </p>

            {/* Thông tin tác giả */}
            <div className="flex items-center gap-3 p-3 rounded-lg">
              <img
                src={author.avatar_url}
                alt={author.username}
                className="w-12 h-12 rounded-full"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-avatar.png";
                }}
              />
              <div>
                <p className="font-semibold text-gray-800">
                  {author.username}{" "}
                  <span className="text-gray-500 font-normal">
                    @{author.username}
                  </span>
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {author.location}
                </p>
              </div>
            </div>

            {/* Hashtag + mô tả */}
            {recipe.hashtag && (
              <p className="mt-3 text-orange-500 font-medium">
                {recipe.hashtag}
              </p>
            )}
            <p className="text-gray-700 text-sm mt-1">{recipe.description}</p>

            {/* Nút hành động (Đẩy xuống cuối) */}
            <div className="flex items-center gap-3 mt-auto pt-5 relative">
              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`px-4 py-2 rounded-lg font-medium border flex items-center gap-2 transition ${
                  isSaved
                    ? "bg-orange-500 text-white border-orange-500"
                    : "border-orange-500 text-orange-500 hover:bg-orange-50"
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span className="text-cookpad-16 font-medium">
                  {isSaved ? "Đã lưu" : "Lưu món"}
                </span>
              </button>
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

      {/* Modal Cooksnap */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 relative shadow-lg">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-center font-semibold text-lg mb-4">
              Chọn Hình
            </h2>
            <button
              onClick={handleChooseFile}
              className="mx-auto block border px-4 py-2 rounded-lg hover:bg-gray-50 font-medium text-gray-700"
            >
              Chọn Hình
            </button>
            <input
              ref={fileInputRef}
              id="file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
      )}
    </section>
  );
}
