import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Crown,
  ChefHat,
  Clock,
  Users,
  User,
} from "lucide-react";
import { searchRecipes } from "../services/searchApi";

// ✅ HÀM HỖ TRỢ: Chuyển đổi giữa chuỗi (API) và mảng (UI)
const stringToArray = (str) =>
  str
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
const arrayToString = (arr) => arr.join(",");

export default function SearchDetail() {
  const { query } = useParams();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [rankedRecipes, setRankedRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("mới nhất");
  const [sort, setSort] = useState("mới nhất");
  const [filterInclude, setFilterInclude] = useState("");
  const [filterExclude, setFilterExclude] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState(null);

  // ✅ THÊM STATE CHO INPUT TẠM THỜI (đang gõ)
  const [tempIncludeInput, setTempIncludeInput] = useState("");
  const [tempExcludeInput, setTempExcludeInput] = useState("");

  // ✅ Thêm State cho Infinite Scroll
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  // ✅ Mock suggestions tĩnh cho sidebar
  const mockSuggestions = [
    "bánh mì",
    "phở bò",
    "bánh cuốn",
    "bún chả",
    "cơm chiên",
    "chả giò",
    "canh chua",
    "bánh xèo",
  ];

  // ✅ Đồng bộ “sort” khi click tab
  useEffect(() => {
    setSort(activeTab);
  }, [activeTab]);

  // Fetch recipes khi query hoặc tab thay đổi (Sử dụng useCallback để tránh re-render không cần thiết)
  const fetchRecipes = useCallback(
    // ✅ Định nghĩa hàm fetchRecipes
    async (pageNum = 1, append = false) => {
      if (!query) return;
      setLoading(true);
      setError(null);

      try {
        const params = {
          q: query,
          // ✅ Dùng “sort” thay vì chỉ activeTab
          sortBy: sort.toLowerCase().includes("phổ biến") ? "views" : "newest",
          page: pageNum,
          limit: 10,
        };

        // Giả lập filter (Cần update searchRecipes API để hỗ trợ lọc thực tế)
        if (filterInclude) params.include = filterInclude;
        if (filterExclude) params.exclude = filterExclude;

        const recipesRes = await searchRecipes(params);
        const newRecipes = recipesRes.data.rows || [];

        setRecipes((prev) => (append ? [...prev, ...newRecipes] : newRecipes));
        setTotalCount(recipesRes.data.count || 0);
        setHasMore(newRecipes.length > 0);
      } catch (error) {
        console.error("Search failed:", error.response?.data || error);
        setError(error.response?.data?.message || "Có lỗi xảy ra khi tìm kiếm");
      } finally {
        setLoading(false);
      }
    },
    [query, sort, filterInclude, filterExclude] // ✅ Thêm dependencies đầy đủ
  );

  // 🧩 Lần đầu load + khi query/tab/filter/sort/filter thay đổi
  useEffect(() => {
    setPage(1);
    setRecipes([]); // Reset danh sách khi thay đổi query/tab/filter
    fetchRecipes(1, false);
  }, [query, sort, filterInclude, filterExclude, fetchRecipes]); // ✅ Thêm dependencies cho Filter

  // 🏆 Lấy top 3 công thức phổ biến
  useEffect(() => {
    const fetchRanked = async () => {
      try {
        const rankedRes = await searchRecipes({
          q: query,
          sortBy: "views",
          limit: 3,
        });
        setRankedRecipes(rankedRes.data.rows || []);
      } catch (err) {
        console.error("Fetch ranked failed:", err);
      }
    };
    fetchRanked();
  }, [query]);

  // 👇 Infinite scroll
  const lastRecipeRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // ⏭ Khi page tăng thì gọi thêm API
  useEffect(() => {
    if (page > 1) fetchRecipes(page, true);
  }, [page, fetchRecipes]); // ✅ Thêm fetchRecipes vào dependency

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      // ✅ Trim giá trị nhập vào để tránh lỗi URL
      const searchValue = e.target.value.trim();
      if (searchValue) {
        navigate(`/search/${searchValue}`);
      }
    }
  };

  // 🛑 HÀM XỬ LÝ LỌC BẰNG TAGS

  // Hàm thêm từ khóa 'Chứa nguyên liệu'
  const handleAddInclude = (e) => {
    if (e.key === "Enter" && tempIncludeInput.trim()) {
      const currentKeywords = stringToArray(filterInclude);
      const newKeywords = stringToArray(tempIncludeInput);
      const uniqueKeywords = [...new Set([...currentKeywords, ...newKeywords])];

      setFilterInclude(arrayToString(uniqueKeywords)); // Cập nhật state chính (trigger API call)
      setTempIncludeInput(""); // Reset input tạm thời
    }
  };

  // Hàm xóa tag 'Chứa nguyên liệu'
  const handleRemoveInclude = (keywordToRemove) => {
    const currentKeywords = stringToArray(filterInclude);
    const newKeywords = currentKeywords.filter(
      (k) => k.toLowerCase() !== keywordToRemove.toLowerCase()
    );
    setFilterInclude(arrayToString(newKeywords)); // Cập nhật state chính (trigger API call)
  };

  // Hàm thêm từ khóa 'Không chứa nguyên liệu'
  const handleAddExclude = (e) => {
    if (e.key === "Enter" && tempExcludeInput.trim()) {
      const currentKeywords = stringToArray(filterExclude);
      const newKeywords = stringToArray(tempExcludeInput);
      const uniqueKeywords = [...new Set([...currentKeywords, ...newKeywords])];

      setFilterExclude(arrayToString(uniqueKeywords)); // Cập nhật state chính (trigger API call)
      setTempExcludeInput(""); // Reset input tạm thời
    }
  };

  // Hàm xóa tag 'Không chứa nguyên liệu'
  const handleRemoveExclude = (keywordToRemove) => {
    const currentKeywords = stringToArray(filterExclude);
    const newKeywords = currentKeywords.filter(
      (k) => k.toLowerCase() !== keywordToRemove.toLowerCase()
    );
    setFilterExclude(arrayToString(newKeywords)); // Cập nhật state chính (trigger API call)
  };

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }
  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Thanh tìm kiếm */}
        <div className="relative mb-6">
          <input
            type="text"
            defaultValue={query || ""}
            onKeyDown={handleSearch}
            className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cookpad-orange text-lg"
            placeholder="Tìm kiếm công thức..."
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-cookpad-orange">
            <Search size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-4">
          <button
            className={`text-sm font-medium pb-2 border-b-2 ${
              activeTab === "mới nhất"
                ? "border-cookpad-orange text-cookpad-orange"
                : "border-transparent text-gray-600"
            }`}
            onClick={() => setActiveTab("mới nhất")}
          >
            Mới Nhất
          </button>
          <button
            className={`text-sm font-medium pb-2 border-b-2 ${
              activeTab === "phổ biến"
                ? "border-cookpad-orange text-cookpad-orange"
                : "border-transparent text-gray-600"
            }`}
            onClick={() => setActiveTab("phổ biến")}
          >
            Phổ Biến
          </button>
        </div>

        {/* Tiêu đề */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {query} ({totalCount})
        </h1>

        {/* Top công thức phổ biến */}
        {rankedRecipes.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Công thức phổ biến</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {rankedRecipes.map((recipe, index) => {
                const imgs =
                  Array.isArray(recipe.images) && recipe.images.length
                    ? recipe.images
                    : recipe.image_url
                      ? [recipe.image_url]
                      : [];
                const mainSrc =
                  (imgs[0] && (imgs[0].url || imgs[0])) ||
                  "/placeholder-recipe.jpg";

                return (
                  <div
                    key={recipe.id}
                    onClick={() => navigate(`/recipes/${recipe.id}`)}
                    className="bg-white rounded-lg shadow p-0 overflow-hidden cursor-pointer hover:shadow-md transition"
                  >
                    <div className="relative">
                      <img
                        src={mainSrc}
                        alt={recipe.title}
                        className="w-full h-40 object-cover"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2 flex items-center gap-2 bg-white/80 rounded-full px-2 py-1">
                        <Crown className="text-yellow-500" />
                        <span className="text-sm font-medium">
                          #{index + 1}
                        </span>
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-sm line-clamp-2">
                        {recipe.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {recipe.short_description ||
                          (recipe.description || "").slice(0, 80)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Kết quả */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-6">
            {recipes.length === 0 && !loading && (
              <div className="text-center py-10 text-gray-500">
                Không tìm thấy món ăn nào phù hợp.
              </div>
            )}

            {recipes.map((recipe, index) => {
              const isLast = index === recipes.length - 1;
              return (
                <div
                  ref={isLast ? lastRecipeRef : null}
                  key={recipe.id}
                  className="flex items-start space-x-4 bg-white p-4 rounded-md shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/recipes/${recipe.id}`)}
                >
                  {(() => {
                    const imgs =
                      Array.isArray(recipe.images) && recipe.images.length
                        ? recipe.images
                        : recipe.image_url
                          ? [recipe.image_url]
                          : [];
                    const mainSrc =
                      (imgs[0] && (imgs[0].url || imgs[0])) ||
                      "/placeholder-recipe.jpg";

                    return (
                      <div className="w-32 flex-shrink-0">
                        <img
                          src={mainSrc}
                          alt={recipe.title}
                          loading="lazy"
                          className="w-32 h-32 object-cover rounded-md"
                        />
                        {imgs.length > 1 && (
                          <div className="mt-2 grid grid-cols-3 gap-1">
                            {imgs.slice(0, 3).map((it, i) => {
                              const src = it.url || it;
                              return (
                                <img
                                  key={i}
                                  src={src}
                                  alt={`${recipe.title} ${i + 1}`}
                                  loading="lazy"
                                  className="w-full h-10 object-cover rounded-sm"
                                />
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 hover:text-cookpad-orange">
                      {recipe.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {recipe.short_description ||
                        recipe.description?.slice(0, 150) ||
                        "Không có mô tả."}
                      ...
                    </p>
                    <div className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Nguyên liệu: </span>
                      {Array.isArray(recipe.ingredients)
                        ? recipe.ingredients.slice(0, 3).join(", ")
                        : recipe.ingredients}
                    </div>

                    <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {recipe.total_time || "30"} phút
                      </span>
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {recipe.servings || "2"} người
                      </span>
                      <span className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {recipe.User?.username || "Anonymous"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="text-center py-6 text-gray-500">
                Đang tải thêm...
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-4 lg:w-64 lg:sticky lg:top-6 lg:h-fit">
            {/* Gợi ý tương tự */}
            <div className="bg-white rounded-md p-4 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-2">
                Tìm kiếm tương tự
              </h3>
              <div className="flex flex-wrap gap-2">
                {mockSuggestions.map((sug) => (
                  <button
                    key={sug}
                    className="px-3 py-1 bg-gray-100 rounded-md text-xs hover:bg-gray-200"
                    onClick={() => navigate(`/search/${sug}`)}
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Sắp xếp */}
            <div className="bg-white rounded-md p-4 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-2">Sắp xếp</h3>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-cookpad-orange"
              >
                <option value="mới nhất">Mới nhất</option>
                <option value="phổ biến">Phổ biến</option>
              </select>
            </div>

            {/* Bộ lọc */}
            <div className="bg-white rounded-md p-4 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-2">Bộ lọc</h3>

              {/* 🛑 Sàng lọc CHỨA NGUYÊN LIỆU */}
              <p className="text-xs font-medium text-gray-500 mb-2">
                Hiển thị các món với:
              </p>
              <input
                type="text"
                value={tempIncludeInput} // Dùng state tạm thời
                onChange={(e) => setTempIncludeInput(e.target.value)}
                onKeyDown={handleAddInclude} // Bắt sự kiện Enter
                placeholder="Gõ vào tên các nguyên liệu..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-cookpad-orange mb-2"
              />

              {/* Hiển thị các tag đã chọn */}
              <div className="flex flex-wrap gap-2 mb-4">
                {stringToArray(filterInclude).map((keyword) => (
                  <span
                    key={keyword}
                    className="flex items-center bg-cookpad-orange text-white text-xs px-3 py-1 rounded-full cursor-pointer"
                    onClick={() => handleRemoveInclude(keyword)}
                  >
                    {keyword}
                    <span className="ml-1 font-bold">×</span>
                  </span>
                ))}
              </div>

              {/* 🛑 Sàng lọc KHÔNG CHỨA NGUYÊN LIỆU */}
              <p className="text-xs font-medium text-gray-500 mb-2">
                Hiển thị các món không có:
              </p>
              <input
                type="text"
                value={tempExcludeInput} // Dùng state tạm thời
                onChange={(e) => setTempExcludeInput(e.target.value)}
                onKeyDown={handleAddExclude} // Bắt sự kiện Enter
                placeholder="Gõ vào tên các nguyên liệu..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-cookpad-orange"
              />

              {/* Hiển thị các tag đã chọn */}
              <div className="flex flex-wrap gap-2 mt-2">
                {stringToArray(filterExclude).map((keyword) => (
                  <span
                    key={keyword}
                    className="flex items-center bg-gray-400 text-white text-xs px-3 py-1 rounded-full cursor-pointer"
                    onClick={() => handleRemoveExclude(keyword)}
                  >
                    {keyword}
                    <span className="ml-1 font-bold">×</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Premium Filter */}
            <div className="bg-yellow-50 rounded-md p-4 shadow-sm text-center">
              <p className="text-sm font-bold text-yellow-800 mb-2">
                Bộ lọc Premium
              </p>
              <button className="w-full bg-yellow-400 text-yellow-800 py-2 rounded-md hover:bg-yellow-500 transition-colors text-sm flex items-center justify-center">
                <Crown size={16} className="mr-1" />
                Bỏ lọc Premium
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
