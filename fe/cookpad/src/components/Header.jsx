import { useState } from 'react';
import SearchBar from './SearchBar';
import LoginModal from './LoginModal';

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null); // Giả lập user login

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-cookpad-orange">🍳 Cookpad</h1>
        </div>

        {/* Search */}
        <SearchBar />

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <button className="text-sm text-gray-600 hover:text-cookpad-orange">
            Premium
          </button>
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
          <button className="text-sm text-gray-600">🇻🇳 Việt món</button>
        </div>
      </div>
    </header>
  );
}
