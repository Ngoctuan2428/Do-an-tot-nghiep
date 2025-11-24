// src/components/Sidebar.jsx
import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Search,
  BookOpen,
  BarChart3,
  Award,
  GraduationCap,
  ChevronDown,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowDownToLine,
  Plus,
} from "lucide-react";
import { khoMonItems } from "../data/sidebarData"; 
import { useRecipeCounts } from "../contexts/RecipeCountContext";
import { useAuth } from '../contexts/AuthContext'; // ✅ ĐÃ IMPORT useAuth

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuth(); // 👈 LẤY TRẠNG THÁI ĐĂNG NHẬP
  
  const [isKhoMonOpen, setIsKhoMonOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false); 

  // Lấy 'counts' động từ Context (sẽ là rỗng nếu chưa đăng nhập)
  const { counts } = useRecipeCounts(); 

  const handleDownloadApp = () => {
    console.log("Tải ứng dụng");
  };
  const handleAddRecipe = () => {
    console.log("Thêm món"); // TODO: Navigate to create recipe page
  };

  const mainMenu = [
    { path: "/search", label: "Tìm kiếm", icon: Search, active: location.pathname === "/search" },
    { path: "/stats", label: "Thống kê bếp", icon: BarChart3, active: location.pathname === "/stats" },
    { path: "/challenges", label: "Thử thách", icon: Award, active: location.pathname === "/challenges" },
    { path: "/interactions", label: "Tương tác", icon: GraduationCap, active: location.pathname === "/interactions" },
  ];

  const effectiveCollapsed = isCollapsed || window.innerWidth < 1024;
  const bottomBarIcons = mainMenu.slice(0, 3); 

  return (
    <>
      {/* Top bar (md) và Bottom bar (sm) giữ nguyên, không cần sửa */}
      {/* ... (Đã lược bỏ phần JSX không cần sửa) ... */}
      
      {/* Top bar cho md (768-1023px) */}
      <div className="md:block lg:hidden sticky top-0 z-40">
        <aside className="w-full h-auto bg-white border-b border-gray-200 flex flex-row justify-between items-center px-4 py-2 overflow-x-auto">
          {/* Logo + Download */}
          <div className="flex-shrink-0 flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-1">
              <img src="/pCook.png" className="w-8 h-8" alt="logo" />
            </Link>
            <button
              onClick={handleDownloadApp}
              className="px-3 py-1 bg-cookpad-orange text-white rounded-md hover:bg-orange-500 text-xs flex items-center whitespace-nowrap"
            >
              <ArrowDownToLine size={14} className="mr-1" />
              Tải app
            </button>
          </div>
          {/* Main icons với labels ngắn */}
          <nav className="flex flex-row space-x-2 flex-1 justify-end">
            {mainMenu.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-2 py-1 rounded-md text-xs transition-colors ${
                    item.active
                      ? "bg-cookpad-orange text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  } flex-shrink-0`}
                >
                  <Icon
                    size={16}
                    className={`mr-1 ${
                      item.active ? "text-white" : "text-gray-500"
                    }`}
                  />
                  <span className="truncate max-w-16">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>
      </div>

      {/* Bottom bar cho <md (sm-): Minimal 3 icons */}
      <div className="block md:hidden sticky bottom-0 z-40">
        <aside className="w-full h-14 bg-white border-t border-gray-200 flex flex-row justify-between items-center px-3">
          {/* Logo trái */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img src="/pCook.png" className="w-8 h-8" alt="logo" />
            </Link>
          </div>
          {/* 3 icons chính giữa/phải (không labels, chỉ icons để gọn) */}
          <nav className="flex flex-row space-x-4 flex-1 justify-center">
            {bottomBarIcons.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center p-2 rounded-md transition-colors ${
                    item.active
                      ? "bg-cookpad-orange text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  title={item.label}
                >
                  <Icon
                    size={20}
                    className={item.active ? "text-white" : "text-gray-500"}
                  />
                </Link>
              );
            })}
          </nav>
          {/* Spacer phải (nếu cần align) */}
          <div className="w-8" /> 
        </aside>
      </div>
      
      {/* Desktop vertical sidebar */}
      <aside
        className={` lg:block sticky top-0 z-40 h-screen bg-white border-r border-gray-200 flex flex-col justify-between items-center overflow-y-auto transition-all duration-300 ${
          effectiveCollapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Logo + Toggle */}
        <div
          className={`p-2 ${
            effectiveCollapsed
              ? "border-b flex-col-reverse space-y-4 gap-2 justify-stretch items-center"
              : "border-b p-4"
          } border-gray-200 flex items-center justify-between`}
        >
          <Link
            to="/"
            className={`flex items-center ${
              effectiveCollapsed ? "space-x-0" : "space-x-2"
            }`}
          >
            <img src="/pCook.png" className="w-10" alt="logo" />
            {!effectiveCollapsed && (
              <span className="text-lg ml-2 font-bold text-gray-900">
                PCook
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`text-gray-500 hover:text-gray-700  ${
              effectiveCollapsed ? "m-0" : "ml-2"
            }`}
          >
            {effectiveCollapsed ? (
              <ChevronsRight size={24} />
            ) : (
              <ChevronsLeft size={24} />
            )}
          </button>
        </div>

        {/* Main Menu */}
        <nav
          className={`flex-1 justify-between items-center p-2 space-y-1 ${
            effectiveCollapsed ? "pt-4" : ""
          }`}
        >
          {mainMenu.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-2 lg:px-3 py-2 rounded-md text-sm transition-colors ${
                  item.active
                    ? "bg-cookpad-orange text-white"
                    : "text-gray-700 hover:bg-gray-100"
                } ${effectiveCollapsed ? "justify-center px-2" : ""}`}
              >
                <Icon
                  size={18}
                  className={`mr-0 flex-shrink-0 ${
                    item.active ? "text-white" : "text-gray-500"
                  }`}
                />
                {!effectiveCollapsed && (
                  <span className="truncate lg:ml-3">{item.label}</span>
                )}
              </Link>
            );
          })}

          {/* 👈 [3] PHẦN KHO MÓN NGON - LOGIC CHÍNH ĐÃ SỬA */}
          {!effectiveCollapsed && (
            <div className="mt-4 p-2">
              <h3 className="flex items-center text-sm font-semibold text-gray-800 mb-3">
                <BookOpen size={18} className="mr-3 text-gray-500" />
                Kho Món Ngon Của Bạn
              </h3>
              
              {user ? (
                // ----------------------------------------------------
                // HIỂN THỊ NỘI DUNG KHO MÓN KHI ĐÃ ĐĂNG NHẬP
                // ----------------------------------------------------
                <div>
                  <button
                    onClick={() => setIsKhoMonOpen(!isKhoMonOpen)}
                    className="w-full flex items-center justify-between px-1 py-1 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      <Search size={16} className="mr-3 text-gray-500" />
                      <span className="truncate">Tìm trong kho món</span>
                    </div>
                    {isKhoMonOpen ? (
                      <ChevronDown size={18} />
                    ) : (
                      <ChevronRight size={18} />
                    )}
                  </button>

                  {isKhoMonOpen && (
                    <div className="ml-6 space-y-1 mt-1">
                      <input
                        type="text"
                        placeholder="Tìm trong kho món"
                        className="w-full px-3 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-cookpad-orange"
                      />

                      {/* Lặp qua kho món và hiển thị count động */}
                      {khoMonItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        const key = item.path.split("/").pop();
                        const count = counts[key] !== undefined ? counts[key] : item.count; 

                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center px-2 py-1 rounded text-xs transition-colors ${
                              isActive
                                ? "bg-cookpad-orange text-white"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            <Icon
                              size={14}
                              className={`mr-2 flex-shrink-0 ${
                                isActive ? "text-white" : "text-gray-500"
                              }`}
                            />
                            <span className="truncate flex-1">{item.label}</span>
                            <span
                              className={`ml-auto text-xs ${
                                isActive ? "text-white" : "text-gray-400"
                              }`}
                            >
                              {count} món
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                // ----------------------------------------------------
                // HIỂN THỊ THÔNG BÁO ĐĂNG NHẬP KHI CHƯA ĐĂNG NHẬP
                // ----------------------------------------------------
                <p className="text-sm text-gray-600 px-2">
                    Để bắt đầu tạo kho lưu trữ món ngon của riêng bạn, vui lòng 
                    <Link to="/register" className="text-cookpad-orange hover:underline mx-1 font-medium">đăng ký</Link>
                    hoặc 
                    <Link to="/login" className="text-cookpad-orange hover:underline ml-1 font-medium">đăng nhập</Link>.
                </p>
              )}
            </div>
          )}
        </nav>

        {/* Floating + button (Giữ nguyên) */}
        <button
          onClick={handleAddRecipe}
          className="md:hidden fixed bottom-4 right-4 z-50 w-14 h-14 bg-cookpad-orange text-white rounded-full shadow-lg flex items-center justify-center hover:bg-orange-500 transition-colors"
          title="Thêm món"
        >
          <Plus size={24} />
        </button>
      </aside>
    </>
  );
}