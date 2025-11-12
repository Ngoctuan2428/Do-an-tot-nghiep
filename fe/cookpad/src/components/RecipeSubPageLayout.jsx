// src/components/RecipeSubPageLayout.jsx
import { useState } from "react";
import { Search, ArrowDownUp, ChevronDown } from "lucide-react";
import EmptyState from "./EmptyState";
import { khoMonItems } from "../data/sidebarData";

function FeedbackCard() {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Feedback submitted:", message);
    alert("Cảm ơn bạn đã gửi góp ý!");
    setMessage("");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24 h-fit">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Giúp chúng tôi cải thiện dịch vụ
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Cookpad luôn không ngừng hoàn thiện dịch vụ để khiến bạn hài lòng hơn.
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full h-24 border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-cookpad-orange"
          placeholder="Vui lòng ghi góp ý của bạn ở đây"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="mt-2 bg-cookpad-orange text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-orange-500"
        >
          Gửi
        </button>
      </form>
      <p className="text-xs text-gray-500 mt-4">
        Bằng cách gửi phản hồi, bạn đồng ý với{" "}
        <a href="#" className="underline">
          Chính Sách Bảo Mật
        </a>{" "}
        và{" "}
        <a href="#" className="underline">
          Điều Khoản Dịch Vụ
        </a>
        .
      </p>
    </div>
  );
}

export default function RecipeSubPageLayout({
  title,
  count = 0,
  children,
  descriptionEmpty = "Bạn chưa có món nào ở đây. Hãy thêm món yêu thích để lưu lại!",
  onSearchSubmit,
  onSortChange, // ✅ callback mới để xử lý sắp xếp
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("Đã xem gần nhất");
  const [showSortMenu, setShowSortMenu] = useState(false);

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearchSubmit?.(searchTerm);
    }
  };

  const handleSortSelect = (option) => {
    setSortOption(option);
    setShowSortMenu(false);
    onSortChange?.(option);
  };

  const currentItem = khoMonItems.find((item) => item.label === title);

  return (
    <div className="flex-1 w-full bg-gray-50">
      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-[1fr_minmax(auto,30%)] gap-6">
        <div className="flex-1">
          {/* Tiêu đề */}
          <div className="flex gap-4 items-center mb-4">
            <span className="text-2xl font-semibold">{title}</span>
            <span className="text-xl text-gray-500">({count})</span>
          </div>

          {/* Thanh tìm kiếm + sắp xếp */}
          <div className="flex items-center gap-4 mb-6 relative">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={`Tìm trong ${title.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-white lg:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-cookpad-orange"
              />
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            {/* Dropdown sắp xếp */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-cookpad-orange border border-gray-300 rounded-md px-3 py-2 bg-white"
                onClick={() => setShowSortMenu(!showSortMenu)}
              >
                <ArrowDownUp size={16} />
                {sortOption}
                <ChevronDown size={16} />
              </button>

              {showSortMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <button
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                      sortOption === "Đã xem gần nhất"
                        ? "text-cookpad-orange"
                        : ""
                    }`}
                    onClick={() => handleSortSelect("Đã xem gần nhất")}
                  >
                    Đã xem gần nhất
                  </button>
                  <button
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                      sortOption === "Mới nhất" ? "text-cookpad-orange" : ""
                    }`}
                    onClick={() => handleSortSelect("Mới nhất")}
                  >
                    Mới nhất
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Danh sách món ăn */}
          {count === 0 ? (
            <EmptyState
              title={`Chưa có gì ở ${title.toLowerCase()}`}
              description={descriptionEmpty}
              buttonText="Khám phá món ăn"
              onButtonClick={() => {}}
            />
          ) : (
            children
          )}
        </div>

        {/* Sidebar Feedback */}
        <aside className="w-full lg:w-80 hidden lg:block">
          <FeedbackCard />
        </aside>
      </main>
    </div>
  );
}
