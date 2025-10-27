import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginModal from './LoginModal';
import { ChevronLeft, ArrowDownToLine, Plus } from 'lucide-react';

const backPathMap = {
  '/challenge/': '/challenges', // Quay về trang ds challenges
  '/recipe/': '/', // Quay về trang chủ (hoặc /search)
  '/profile': '/', // Đây là trang tĩnh, nên để '/profile'
  '/create-recipe': '/', // Thêm ví dụ cho trang "Tạo mới"
  '/search/': '/search',
  '/recipes/': '/',
};

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const backPath = useMemo(() => {
    const matchingPrefix = Object.keys(backPathMap).find((prefix) =>
      location.pathname.startsWith(prefix) && location.pathname !== prefix
    );
    return backPathMap[matchingPrefix] || null;
  }, [location.pathname]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null); // Giả lập user login

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
            <div className="w-9 h-9" /> // Placeholder để giữ layout
          )}
        </div>

        <div className="flex-1 flex justify-center px-4">
        </div>

        {/* Actions */}
        <div className="flex-1 flex items-center justify-end space-x-4">
          <div className="hidden md:flex items-center space-x-2">
            <ArrowDownToLine size={20} className="text-gray-600" />
            <button className="text-sm text-gray-600 hover:text-cookpad-orange">
              Tải ứng dụng
            </button>
          </div>
          {user ? (
            <div className="flex items-center space-x-2">
              <img
                src="https://placehold.co/32x32/E88413/FFFFFF?text=A"
                alt="Avatar"
                className="w-8 h-8 rounded-full"
                onError={(e) => { e.target.src = 'https://placehold.co/32x32'; }}
              />
              <span className="text-sm hidden lg:block">Xin chào!</span>
            </div>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-cookpad-orange text-white text-sm font-medium rounded-md hover:bg-orange-500 transition-colors"
            >
              Đăng nhập
            </button>
          )}
          <LoginModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
          <button
            onClick={() => navigate('/create-recipe')}
            className="flex items-center px-4 py-2 bg-cookpad-orange text-white rounded-md hover:bg-orange-500 text-sm font-medium transition-colors"
          >
            <Plus size={16} className="inline mr-1" /> Thêm mới
          </button>
        </div>
      </div>
    </header>
  );
}

