import SettingItem from '../../components/SettingItem';
import { useNavigate } from 'react-router-dom';

export default function AllSettings() {
  const navigate = useNavigate();

  const items = [
    { label: 'Tài khoản', route: '/setting/account' },
    {
      label: 'Điều chỉnh chức năng thông báo',
      route: '/setting/notification',
    },
    { label: 'Điều khoản Dịch Vụ và Chính sách', route: '/setting/policy' },
    { label: 'Những câu hỏi thường gặp', route: '/setting/faq' },
    { label: 'Góp Ý', route: '/setting/feedback' },
    {
      label:
        'Tải ứng dụng Cookpad để tham gia cộng đồng nấu ăn tại gia lớn nhất Việt Nam!',
      route: '/download',
    },
    { label: 'Cộng tác với Cookpad', route: '/setting/collaboration' },
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
        Cài đặt ứng dụng
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

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="mx-auto block bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-8 py-2 rounded-lg transition"
      >
        Thoát
      </button>
    </div>
  );
}
