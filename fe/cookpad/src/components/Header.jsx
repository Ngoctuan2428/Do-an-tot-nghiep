import { useState, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Plus, LogOut, Settings } from 'lucide-react';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const backPathMap = {
  '/challenge/': '/challenges',
  '/recipe/': '/',
  '/profile': '/',
  '/create-recipe': '/',
  '/search/': '/search',
  '/recipes/': '/',
};

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const ADMIN_URL = 'http://localhost:3001';

  const handleGoToAdmin = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    // redirect sang admin
    window.location.href = `${ADMIN_URL}/login-sso?token=${token}`;
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const backPath = useMemo(() => {
    const matchingPrefix = Object.keys(backPathMap).find(
      (prefix) =>
        location.pathname.startsWith(prefix) && location.pathname !== prefix
    );
    return backPathMap[matchingPrefix] || null;
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  const handleEditProfile = () => {
    setIsMenuOpen(false);
    navigate('/setting/account');
  };

  const handleAdd = () => {
    navigate('/create-recipe');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex-1 flex justify-start">
          {backPath ? (
            <button
              onClick={() => navigate(backPath)}
              className="flex items-center space-x-2 p-2 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors"
              aria-label="Quay lại"
            >
              <ChevronLeft size={20} />
            </button>
          ) : (
            <div className="w-9 h-9" />
          )}
        </div>

        <div className="flex-1 flex justify-center px-4"></div>

        {/* Actions */}
        <div className="flex-1 flex items-center justify-end space-x-4">
          {/* CHỈ HIỆN NÚT NÀY NẾU LÀ ADMIN */}
          {user && user.role === 'admin' && (
            <button
              onClick={handleGoToAdmin}
              className="flex items-center gap-2 px-3 py-1 bg-gray-800 text-white rounded-full text-sm hover:bg-gray-700 transition"
            >
              <ShieldCheck size={16} />
              Trang Quản Trị
            </button>
          )}

          {user ? (
            <div className="relative z-50">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-2 px-3 py-1 rounded-full border border-gray-300 bg-white shadow-sm hover:bg-gray-100 transition focus:outline-none text-gray-800"
              >
                <img
                  src={user.avatar_url || 'https://placehold.co/100x100?text=U'}
                  alt={user.username}
                  className="w-8 h-8 rounded-full object-cover border border-gray-200"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/100x100?text=U';
                  }}
                />
                {/* Username text */}
                {/* <span className="text-sm font-medium hidden sm:block truncate max-w-[80px]">
                  {user.username}
                </span> */}
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl py-1 transform transition-all duration-150 origin-top-right z-50">
                  <button
                    onClick={handleEditProfile}
                    className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings size={16} className="mr-3 text-cookpad-orange" />{' '}
                    Sửa thông tin cá nhân
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition border-t mt-1 pt-1 border-gray-100"
                  >
                    <LogOut size={16} className="mr-3" /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-cookpad-orange text-white text-sm font-medium rounded-md hover:bg-orange-500 transition-colors"
            >
              Đăng nhập
            </button>
          )}

          <button
            onClick={handleAdd}
            className="flex items-center px-4 py-2 bg-cookpad-orange text-white rounded-md hover:bg-orange-500 text-sm font-medium transition-colors"
          >
            <Plus size={16} className="inline mr-1" /> Thêm mới
          </button>
        </div>
      </div>
    </header>
  );
}
