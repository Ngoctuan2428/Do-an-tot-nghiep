import { useState } from 'react';
import { CheckCircle2, Lock } from 'lucide-react';

function DeleteAccount() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    if (!password) {
      alert('Vui lòng nhập mật khẩu');
      return;
    }
    // Xử lý xóa tài khoản
    console.log('Xóa tài khoản với mật khẩu:', password);
    alert('Yêu cầu xóa tài khoản đã được gửi');
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Yêu cầu xóa tài khoản
        </h1>

        {/* Warning Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <p className="text-gray-700 mb-4">
            Chúng tôi rất buồn vì bạn muốn ngừng sử dụng PCook. Nếu bạn muốn
            thay đổi cài đặt cho các thông báo, bạn có thể vào phần{' '}
            <a href="#" className="text-blue-600 hover:underline">
              Cài Đặt Tin Nhắn
            </a>
            .
          </p>

          <p className="text-gray-700 mb-4">
            Nếu bạn đã đăng ký Gói Premium, đăng ký của bạn sẽ bị hủy khi bạn
            yêu cầu xóa tài khoản.
          </p>

          <p className="text-gray-700 mb-6">
            Nếu bạn chắc chắn muốn xóa tài khoản, vui lòng nhập mật khẩu của
            bạn. Khi xóa tài khoản có nghĩa là bạn đã chấp thuận những điều sau
            đây:
          </p>

          {/* Checklist */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">
                Bạn sẽ không còn có thể mở lại tài khoản này
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">
                Tất cả các món bạn đã lên sóng và mọi thông tin khác trong tài
                khoản cá nhân của bạn sẽ bị xóa vĩnh viễn và{' '}
                <span className="font-semibold">
                  bạn không thể khôi phục lại được
                </span>
                .
              </p>
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Vui lòng xác nhận mật khẩu của bạn để tiến hành"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Tiếp theo
            </button>
            <button
              onClick={handleCancel}
              className="px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Bỏ qua
            </button>
          </div>

          {/* Forgot Password Link */}
          <div className="text-center mt-4">
            <a href="#" className="text-blue-600 hover:underline text-sm">
              Không có hoặc quên mật khẩu?
            </a>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-8 border-gray-300" />

        {/* Contact Support */}
        <div className="text-center">
          <p className="text-gray-600">
            Liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi nào
          </p>
        </div>
      </div>
    </div>
  );
}

export default DeleteAccount;
