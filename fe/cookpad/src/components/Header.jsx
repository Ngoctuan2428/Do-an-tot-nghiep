import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import LoginModal from './LoginModal';
// Đã thêm LogOut và Settings
import { ChevronLeft, ArrowDownToLine, Plus, LogOut, Settings } from 'lucide-react'; 

export default function Header() {
  const navigate = useNavigate();
  const handleAdd = () => {
    console.log('Chuyển đến trang thêm món');
    navigate('/create-recipe'); 
  };

  // ✅ [FIX] MOCK USER: Dùng URL ổn định và tên người dùng
  const [user, setUser] = useState({ 
      username: 'AnhTuan', 
      avatar_url: 'https://picsum.photos/32/32?random=1' 
  }); 
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const handleLogout = () => {
    // Xử lý logic đăng xuất thực tế (xóa token) ở đây
    setUser(null); // Giả lập đăng xuất
    setIsMenuOpen(false);
    navigate('/');
  };

  const handleEditProfile = () => {
      setIsMenuOpen(false);
      navigate('/setting/account'); // Chuyển đến trang sửa thông tin
  };


  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Back */}
        <div className="flex items-center space-x-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer">
          <button onClick={() => navigate(-1)}>
            <ChevronLeft size={20} />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          
          {user ? (
            // ----------------------------------------------------
            // HIỂN THỊ USERNAME VÀ DROPDOWN MENU KHI ĐÃ ĐĂNG NHẬP
            // ----------------------------------------------------
            <div className="relative z-50">
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    // ✅ [FIX] Sửa padding (px-4 py-2) và màu nền (bg-cookpad-orange)
                    className="flex items-center space-x-2 px-4 py-2 rounded-md bg-cookpad-orange text-white hover:bg-orange-600 transition focus:outline-none"
                >
                    <img 
                        src={user.avatar_url}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium hidden sm:block">{user.username}</span> 
                </button>
                
                {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl py-1 transform transition-all duration-150 origin-top-right z-50">
                        
                        {/* Mục Sửa thông tin cá nhân */}
                        <button 
                            onClick={handleEditProfile}
                            className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            <Settings size={16} className="mr-3 text-cookpad-orange" /> Sửa thông tin cá nhân
                        </button>
                        
                        {/* Mục Đăng xuất */}
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
            // HIỂN THỊ NÚT ĐĂNG NHẬP KHI CHƯA ĐĂNG NHẬP
            <button
              onClick={() => navigate('/login')} // Chuyển hướng trực tiếp
              className="px-4 py-2 bg-cookpad-orange text-white rounded-md hover:bg-orange-500 transition"
            >
              Đăng nhập
            </button>
          )}

          {/* Nút Thêm mới */}
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