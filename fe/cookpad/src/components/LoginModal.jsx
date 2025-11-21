export default function LoginModal({ isOpen, onClose, onGoogleLogin, onEmailLogin }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 relative">
        {/* Nút đóng modal */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Đăng nhập PCook</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Đăng nhập để lưu công thức yêu thích của bạn!
        </p>

        <div className="space-y-3">
          {/* Nút Google - GÁN ONCLICK CHO CHUYỂN HƯỚNG OAUTH */}
          <button 
            type="button"
            onClick={onGoogleLogin} 
            className="w-full flex items-center justify-center py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Tiếp tục với Google
          </button>

          {/* Nút Email - GÁN ONCLICK CHO CHUYỂN TRẠNG THÁI/FORM */}
          <button 
            type="button"
            className="w-full py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium text-gray-700"
            onClick={onEmailLogin} 
          >
            Tiếp tục với email
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 mb-2">
            Bằng cách tiếp tục, bạn đồng ý với{' '}
            <a href="#" className="text-cookpad-orange hover:underline">
              Điều khoản dịch vụ
            </a>{' '}
            của chúng tôi.
          </p>
          
          <div className="border-t pt-4 mt-4">
            <span className="text-sm text-gray-600">Chưa có tài khoản? </span>
            <a href="/register" className="text-sm font-semibold text-cookpad-orange hover:underline">
              Tạo tài khoản mới
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}