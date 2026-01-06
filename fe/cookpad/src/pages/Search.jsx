import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Crown, ArrowRight, Flame } from 'lucide-react';
import pCook from '../../public/pCook.png';

import { getPremiumRecipes } from '../services/recipeApi';
import SearchBar from '../components/SearchBar';
import KeywordCard from '../components/KeywordCard';
import RecipeCard from '../components/RecipeCard';

// Danh sách từ khóa mẫu
const keywords = [
  {
    id: 1,
    title: 'Thịt',
    image:
      'https://spicyfoodstudio.com/wp-content/uploads/2023/03/chup-anh-do-an-02.jpg',
  },
  {
    id: 2,
    title: 'Bánh mì',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAknClSjZDs61TvQURlzDASUnuJ1YTrUXAI4fegJEl6D4jkIE9sCtx1GnOPuV23bld-X8&usqp=CAU',
  },
  {
    id: 3,
    title: 'Cá',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-UcWvavWqUdsUTeb8wNp_eJ-qwUsPcaeAXvvmQbri6BcgjyXh_9eflk2ifhMSEEZfc2k&usqp=CAU',
  },
  {
    id: 4,
    title: 'Đậu hũ',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpt5UtC_8kYFm52vw4fMA0NxcBBQ7Z_wkA8g&s',
  },
  {
    id: 5,
    title: 'Cá tầm',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsVVy6lcBU8KFdy06tNmQgOFryd_-Htv7V_w&s',
  },
  {
    id: 6,
    title: 'Trứng',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReLhbbCEAGduomuDYEn3PHufu9yoG-FchdbQ&s',
  },
  {
    id: 7,
    title: 'Món ngon mỗi ngày',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgircv16aYN3FPY4ae9t-JEBWBMcVIIfYzUw&s',
  },
  {
    id: 8,
    title: 'Spaghetti',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmieI6GUbehVX6sK9g4PWyrN4Y7-1IVQfFQw&s',
  },
];

export default function Search() {
  const navigate = useNavigate();
  const [premiumRecipes, setPremiumRecipes] = useState([]); // State lưu danh sách món Premium
  const [loadingPremium, setLoadingPremium] = useState(true);

  // Load dữ liệu Premium ngay khi vào trang
  useEffect(() => {
    const fetchPremium = async () => {
      try {
        const res = await getPremiumRecipes();
        setPremiumRecipes(res.data.data || []);
      } catch (error) {
        console.error('Lỗi tải món premium:', error);
      } finally {
        setLoadingPremium(false);
      }
    };
    fetchPremium();
  }, []);

  // Xử lý khi user nhập từ khóa vào SearchBar
  const handleSearchSubmit = (searchTerm) => {
    if (searchTerm.trim()) {
      navigate(`/search/${encodeURIComponent(searchTerm.toLowerCase())}`);
    }
  };

  return (
    <main className="max-w-7xl mx-auto p-6 min-h-screen bg-gray-50">
      {/* Banner Logo */}
      <div className="flex justify-center mb-8">
        <img
          src={pCook}
          className="w-40 md:w-56 object-contain"
          alt="pCook Logo"
        />
      </div>

      {/* Search Bar */}
      <div className="flex flex-row justify-center mb-10">
        <div className="w-full max-w-2xl">
          <SearchBar onSearch={handleSearchSubmit} />
        </div>
      </div>

      {/* Grid Keywords (Danh mục nhanh) */}
      <div className="mb-10">
        <h3 className="text-xl font-bold text-gray-800 mb-4 ml-1">
          Khám phá nhanh
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {keywords.map((keyword) => (
            <KeywordCard key={keyword.id} {...keyword} />
          ))}
        </div>
      </div>

      {/* Premium Section (Dữ liệu thật từ API) */}
      {/* <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-lg text-sm shadow-sm flex items-center gap-1">
              <Crown size={16} fill="currentColor" /> Premium
            </span>
            <span className="text-gray-900">Top Món Ăn Yêu Thích</span>
          </h3>
        </div>

        {loadingPremium ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-orange-500 w-8 h-8" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {premiumRecipes.length > 0 ? (
              premiumRecipes.map((recipe, index) => (
                <div key={recipe.id} className="relative group">
                  {index < 3 && (
                    <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-md flex items-center gap-1">
                      <Flame size={12} fill="currentColor" /> Top {index + 1}
                    </div>
                  )}
                  <RecipeCard
                    id={recipe.id}
                    title={recipe.title}
                    image={recipe.image_url}
                    premium={true}
                    views={recipe.view_count || 0}
                    likes={recipe.likes || 0}
                    user={recipe.User}
                  />
                </div>
              ))
            ) : (
              <p className="col-span-3 text-center text-gray-500 py-10">
                Chưa có dữ liệu nổi bật.
              </p>
            )}
          </div>
        )}
      </section> */}

      {/* Banner Quảng cáo Premium (Optional - Trang trí thêm cho đẹp) */}
      {/* <div className="mt-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 md:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
        <div>
          <h3 className="text-xl md:text-2xl font-bold mb-2 flex items-center gap-2">
            <Crown className="text-yellow-400" /> Trải nghiệm PCook Premium
          </h3>
          <p className="text-gray-300 text-sm md:text-base">
            Mở khóa công thức độc quyền và loại bỏ quảng cáo ngay hôm nay.
          </p>
        </div>
        <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition transform text-sm md:text-base whitespace-nowrap">
          Dùng thử miễn phí
        </button>
      </div> */}
    </main>
  );
}
