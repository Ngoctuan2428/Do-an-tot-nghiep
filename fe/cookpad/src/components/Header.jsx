import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import LoginModal from './LoginModal';
import { ChevronLeft, ArrowDownToLine, Plus } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();
  const handleAdd = () => {
    console.log('Thêm mới món');
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null); // Giả lập user login

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Back */}
        <div className="flex items-center space-x-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer">
          <button onClick={() => navigate(-1)}>
            <ChevronLeft size={20} />
          </button>
        </div>

        {/* Search */}
        {/* <SearchBar /> */}

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <ArrowDownToLine />
            <button className="text-sm text-gray-600 hover:text-cookpad-orange">
              Tải ứng dụng
            </button>
          </div>
          {user ? (
            <div className="flex items-center space-x-2">
              <img
                src="https://via.placeholder.com/32"
                alt="Avatar"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm">Xin chào!</span>
              <button className="text-sm text-gray-600">↓ Tải lên</button>
            </div>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-cookpad-orange text-white rounded-md hover:bg-orange-500"
            >
              Đăng nhập
            </button>
          )}
          <LoginModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-cookpad-orange text-white rounded-md hover:bg-orange-500 text-sm"
          >
            <Plus size={16} className="inline mr-1" /> Thêm mới
          </button>
        </div>
      </div>
    </header>
  );
}
