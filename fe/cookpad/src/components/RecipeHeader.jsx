import { useState, useEffect, useRef } from 'react';
import {
  Soup,
  Bookmark,
  MoreHorizontal,
  Share2,
  Printer,
  X,
  User,
  MapPin,
} from 'lucide-react';

/**
 * RecipeHeader Component
 * @param {Object} props
 * @param {Object} props.recipe - Thông tin món ăn
 */
export default function RecipeHeader({ recipe }) {
  const [isSaved, setIsSaved] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null);
  const menuRef = useRef(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Chức năng chia sẻ
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
        console.log('Chia sẻ bị hủy:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Đã sao chép link vào clipboard!');
    }
  };

  // Chức năng in
  const handlePrint = () => {
    window.print();
  };

  // Mở file picker khi click nút “Chọn hình”
  const handleChooseFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Xử lý file được chọn
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      alert(`Đã chọn hình: ${file.name}`);
      // Tại đây bạn có thể upload hoặc preview file
    }
  };

  if (!recipe) return null; // tránh lỗi nếu chưa có dữ liệu

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
      {/* 2 cột: ảnh bên trái - nội dung bên phải */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_5fr] gap-6">
        {/* Cột trái: ảnh món ăn */}
        <div className="relative">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-80 object-cover rounded-lg"
          />
          <div className="absolute bottom-2 right-3 bg-black/60 text-white text-sm px-2 py-1 rounded">
            {recipe.logoText || 'BON BON'}
          </div>
        </div>

        {/* Cột phải: thông tin */}
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              {recipe.title}
            </h1>

            {/* Nút mở hàng */}
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold mb-3 hover:bg-orange-600"
            >
              <Soup className="w-5 h-5" />
              Mở hàng cooksnap cho món này!
            </button>

            {/* Thông tin số người */}
            <p className="text-gray-600 flex items-center gap-2 mb-4">
              <User className="w-4 h-4" />{' '}
              {recipe.interestedCount
                ? `${recipe.interestedCount} bếp khác đang định nấu món này`
                : 'Chưa có ai định nấu'}
            </p>

            {/* Thông tin tác giả */}
            <div className="flex items-center gap-3 p-3 rounded-lg">
              <img
                src={recipe.author.avatar}
                alt={recipe.author.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-semibold text-gray-800">
                  {recipe.author.name}{' '}
                  <span className="text-gray-500 font-normal">
                    @{recipe.author.username}
                  </span>
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {recipe.author.location}
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
          </div>

          {/* Nút hành động */}
          <div className="flex items-center gap-3 mt-5 relative">
            {/* Nút Lưu Món */}
            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`px-2 py-2 rounded-lg font-medium border flex items-center gap-2 transition ${
                isSaved
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'border-orange-500 text-orange-500 hover:bg-orange-50'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span class="hidden md:block text-cookpad-16 font-medium">
                {isSaved ? 'Đã lưu' : 'Lưu món'}
              </span>
            </button>

            <button
              onClick={() => setIsFavourite(!isFavourite)}
              className={`px-2 py-2 rounded-lg font-medium border flex items-center gap-2 transition ${
                isFavourite
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'border-orange-500 text-orange-500 hover:bg-orange-50'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span class="hidden md:block text-cookpad-16 font-medium">
                {isFavourite ? 'Đã thêm vào BST ' : 'Thêm vào BST '}
              </span>
            </button>

            <button
              className="border px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4" /> Chia sẻ
            </button>

            <button
              className="border px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              onClick={handlePrint}
            >
              <Printer className="w-4 h-4" /> In
            </button>

            {/* Nút menu dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="border px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <MoreHorizontal className="w-4 h-4" /> Menu
              </button>

              {showMenu && (
                <div className="absolute right-0 top-12 w-48 bg-white border rounded-lg shadow-md py-2 z-50">
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                    onClick={handleChooseFile}
                  >
                    <Soup className="w-4 h-4" /> Thêm Cooksnap{' '}
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
    </div>
  );
}
