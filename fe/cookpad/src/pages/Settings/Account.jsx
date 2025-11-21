import SettingItem from '../../components/SettingItem';
import { useNavigate } from 'react-router-dom';

export default function Account() {
  const navigate = useNavigate();

  const items = [
    { label: 'Danh sách bếp đã bị chặn', route: '/setting/blocked' },
    {
      label: 'Xóa tài khoản của bạn',
      route: '/setting/delete-account',
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
        Tài khoản
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
