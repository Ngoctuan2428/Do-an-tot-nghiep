import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Flame, TrendingUp } from "lucide-react";
import pCook from "../../public/pCook.png";
import { getPremiumRecipes } from "../services/recipeApi";
import SearchBar from "../components/SearchBar";
import KeywordCard from "../components/KeywordCard";
import RecipeCard from "../components/RecipeCard";

const keywords = [
  {
    id: 1,
    title: "Thịt",
    image:
      "https://spicyfoodstudio.com/wp-content/uploads/2023/03/chup-anh-do-an-02.jpg",
  },
  {
    id: 2,
    title: "Bánh mì",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAknClSjZDs61TvQURlzDASUnuJ1YTrUXAI4fegJEl6D4jkIE9sCtx1GnOPuV23bld-X8&usqp=CAU",
  },
  {
    id: 3,
    title: "Cá",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-UcWvavWqUdsUTeb8wNp_eJ-qwUsPcaeAXvvmQbri6BcgjyXh_9eflk2ifhMSEEZfc2k&usqp=CAU",
  },
  {
    id: 4,
    title: "Đậu hũ",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpt5UtC_8kYFm52vw4fMA0NxcBBQ7Z_wkA8g&s",
  },
  {
    id: 5,
    title: "Cá tầm",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsVVy6lcBU8KFdy06tNmQgOFryd_-Htv7V_w&s",
  },
  {
    id: 6,
    title: "Trứng",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReLhbbCEAGduomuDYEn3PHufu9yoG-FchdbQ&s",
  },
  {
    id: 7,
    title: "Món ngon mỗi ngày",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgircv16aYN3FPY4ae9t-JEBWBMcVIIfYzUw&s",
  },
  {
    id: 8,
    title: "Spaghetti",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmieI6GUbehVX6sK9g4PWyrN4Y7-1IVQfFQw&s",
  },
];

export default function Search() {
  const navigate = useNavigate();
  const [topRecipes, setTopRecipes] = useState([]);
  const [loadingTop, setLoadingTop] = useState(true);

  // Load dữ liệu Top Like
  useEffect(() => {
    const fetchTopRecipes = async () => {
      try {
        const res = await getPremiumRecipes();
        // Mẹo debug: Bạn có thể bỏ comment dòng dưới để xem chính xác tên biến là gì
        // console.log("Data tu API:", res.data.data); 
        setTopRecipes(res.data.data || []);
      } catch (error) {
        console.error("Lỗi tải món nổi bật:", error);
      } finally {
        setLoadingTop(false);
      }
    };
    fetchTopRecipes();
  }, []);

  const handleSearchSubmit = (searchTerm) => {
    if (searchTerm.trim()) {
      navigate(`/search/${encodeURIComponent(searchTerm.toLowerCase())}`);
    }
  };

  return (
    <main className="max-w-7xl mx-auto p-6 min-h-screen bg-gray-50">
      <div className="flex justify-center mb-8">
        <img
          src={pCook}
          className="w-40 md:w-56 object-contain"
          alt="pCook Logo"
        />
      </div>

      <div className="flex flex-row justify-center mb-10">
        <div className="w-full max-w-2xl">
          <SearchBar onSearch={handleSearchSubmit} />
        </div>
      </div>

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

      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2 text-gray-900">
            <TrendingUp className="text-red-500" />
            <span>Món Ăn Được Yêu Thích Nhất</span>
          </h3>
        </div>

        {loadingTop ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-orange-500 w-8 h-8" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topRecipes.length > 0 ? (
              topRecipes.map((recipe, index) => (
                <div key={recipe.id} className="relative group">
                  {index < 3 && (
                    <div className="absolute top-3 left-3 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-md flex items-center gap-1">
                      <Flame size={12} fill="currentColor" /> Top {index + 1}
                    </div>
                  )}

                  <RecipeCard
                    id={recipe.id}
                    title={recipe.title}
                    image={recipe.image_url}
                    premium={false}
                    // --- SỬA Ở ĐÂY ---
                    // Ưu tiên lấy 'views', nếu không có thì thử 'view_count'
                    views={recipe.views || recipe.view_count || 0}
                    // ----------------
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
      </section>
    </main>
  );
}