import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Search,
  Crown,
  BarChart3,
  Award,
  BookOpen,
  GraduationCap,
  Refrigerator,
  ShoppingBag,
  ChevronDown,
  ChevronRight,
  Bookmark,
  CheckCircle,
  User,
  FileText,
  Edit3,
  Clock,
  Globe,
  Lock,
} from 'lucide-react';
import { khoMonItems } from '../data/sidebarData';

export default function Sidebar() {
  const location = useLocation();
  const [isKhoMonOpen, setIsKhoMonOpen] = useState(true);

  const mainMenu = [
    {
      path: '/premium',
      label: 'Premium',
      icon: Crown,
      active: location.pathname === '/premium',
    },
    {
      path: '/stats',
      label: 'Thống kê bếp',
      icon: BarChart3,
      active: location.pathname === '/stats',
    },
    {
      path: '/challenges',
      label: 'Thử thách',
      icon: Award,
      active: location.pathname === '/challenges',
    },
    {
      path: '/recipes',
      label: 'Thức ăn',
      icon: BookOpen,
      active: location.pathname === '/recipes',
    },
    {
      path: '/interactions',
      label: 'Tương tác',
      icon: GraduationCap,
      active: location.pathname === '/interactions',
    },
  ];

  const khoMonItems2 = khoMonItems;

  return (
    <aside className="w-full lg:w-64 h-auto lg:h-screen bg-white border-b lg:border-r lg:border-b-0 border-gray-200 flex flex-row lg:flex-col overflow-x-auto lg:overflow-y-auto p-2 lg:p-4">
      {/* Logo - Horizontal: nhỏ gọn; Vertical: full */}
      <div className="flex-shrink-0 flex items-center space-x-2 mr-4 lg:mr-0 lg:border-b lg:border-gray-200 lg:pb-4 lg:mb-4 lg:w-full lg:justify-between">
        <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
          <div className="w-8 h-8 bg-cookpad-orange rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">🍳</span>
          </div>
          <span className="hidden lg:block text-lg font-bold text-gray-900 whitespace-nowrap">
            Cookpad
          </span>
          <span className="lg:hidden text-sm font-bold text-gray-900 whitespace-nowrap">
            Cookpad
          </span>{' '}
          {/* Giữ label nhỏ trên horizontal */}
        </Link>
        <button className="lg:hidden text-gray-500 hover:text-gray-700 flex-shrink-0">
          <ChevronDown size={16} />
        </button>
      </div>

      {/* Main Menu - Horizontal: inline flex; Vertical: space-y */}
      <nav className="flex-1 flex flex-row lg:flex-col space-x-1 lg:space-x-0 lg:space-y-1 overflow-x-auto lg:overflow-x-hidden">
        {mainMenu.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-2 lg:px-3 py-1 lg:py-2 rounded-md text-xs lg:text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
                item.active
                  ? 'bg-cookpad-orange text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon
                size={14} // Nhỏ hơn trên horizontal
                className={`mr-1 lg:mr-3 flex-shrink-0 ${
                  item.active ? 'text-white' : 'text-gray-500'
                }`}
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}

        {/* Phần Kho Món Ngon - Collapsible: Trên horizontal, ẩn hoặc simplify */}
        {isKhoMonOpen && (
          <div className="flex items-center space-x-1 lg:mt-4 lg:ml-0">
            <button
              onClick={() => setIsKhoMonOpen(!isKhoMonOpen)}
              className="flex items-center px-2 py-1 rounded-md text-xs text-gray-700 hover:bg-gray-100 whitespace-nowrap flex-shrink-0"
            >
              <Search size={14} className="mr-1 text-gray-500" />
              <span className="truncate">Kho món</span>
            </button>
            {/* Sub-items chỉ hiện trên vertical; horizontal: chỉ button toggle hoặc ẩn */}
            {khoMonItems2.slice(0, 2).map(
              (
                subItem,
                index // Giới hạn 2 items trên horizontal để tránh dài
              ) => (
                <Link
                  key={subItem.path}
                  to={subItem.path}
                  className={`flex items-center px-2 py-1 rounded text-xs transition-colors whitespace-nowrap flex-shrink-0 ${
                    location.pathname === subItem.path
                      ? 'bg-cookpad-orange text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <subItem.icon
                    size={12}
                    className={`mr-1 ${
                      location.pathname === subItem.path
                        ? 'text-white'
                        : 'text-gray-500'
                    }`}
                  />
                  <span className="truncate max-w-[60px]">{subItem.label}</span>
                </Link>
              )
            )}
          </div>
        )}
      </nav>

      {/* Gợi ý dưới cùng - Horizontal: Ẩn hoặc nhỏ; Vertical: Giữ nguyên */}
      <div className="hidden lg:block p-4 border-t border-gray-200 bg-gray-50 lg:flex-shrink-0">
        <p className="text-xs text-gray-500 mb-2">
          Gợi ý dựa trên tủ lạnh của bạn
        </p>
        <button className="w-full text-xs text-cookpad-orange hover:underline">
          Bỏ qua
        </button>
      </div>
    </aside>
  );
}
