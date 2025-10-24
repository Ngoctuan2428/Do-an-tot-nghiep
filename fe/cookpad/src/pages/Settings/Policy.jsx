import SettingItem from '../../components/SettingItem';
import { useNavigate } from 'react-router-dom';

export default function Policy() {
  const navigate = useNavigate();

  const items = [
    { label: 'Chính Sách Bảo Mật', route: '/setting' },
    {
      label: 'Điều Khoản Dịch Vụ',
      route: '/setting',
    },
    {
      label: 'Hướng Dẫn Dành Cho Cộng Đồng Sử Dụng Cookpad',
      route: '/setting',
    },
    {
      label: 'Chính Sách Sử Dụng Cookies và Điều Chỉnh',
      route: '/setting',
    },
    {
      label: 'Bảo mật',
      route: '/setting',
    },
  ];

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn thoát không?')) {
      // xóa token, chuyển về trang đăng nhập
      localStorage.removeItem('userToken');
      navigate('/login');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-8 text-center">
      {/* Title */}
      <h2 className="text-gray-400 font-semibold text-lg mb-4 text-left">
        Điều khoản Dịch Vụ và Chính sách
      </h2>

      {/* List */}
      <div className="bg-white rounded-md shadow-sm border-bottom border-gray-100 divide-y divide-gray-100 mb-8">
        {items.map((item, index) => (
          <SettingItem
            key={index}
            label={item.label}
            onClick={() => navigate(item.route)}
          />
        ))}
      </div>
    </div>
  );
}
