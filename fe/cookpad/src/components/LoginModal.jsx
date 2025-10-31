const API_URL = "http://localhost:8000/api";

export default function LoginModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Đăng nhập Cookpad</h2>
          <button onClick={onClose} className="text-gray-500">
            &times;
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          Đăng nhập để lưu công thức yêu thích của bạn!
        </p>
        <div className="space-y-3">
          <a
            href={`${API_URL}/auth/google`} // ⬅️ Trỏ đến backend
            className="w-full flex items-center justify-center py-2 border border-gray-300 rounded-md"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Tiếp tục với Google
          </a>
          <a
            href={`${API_URL}/auth/facebook`} // ⬅️ Trỏ đến backend
            className="w-full flex items-center justify-center py-2 border border-gray-300 rounded-md"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
              alt="Facebook"
              className="w-5 h-5 mr-2"
            />
            Tiếp tục với Facebook
          </a>
          <button className="w-full py-2 border border-gray-300 rounded-md">
            Tiếp tục với email
          </button>
          <button className="w-full py-2 border border-gray-300 rounded-md">
            Tiếp tục với Apple
          </button>
        </div>
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Bằng cách tiếp tục, bạn đồng ý với{" "}
            <a href="#" className="text-cookpad-orange">
              Điều khoản dịch vụ
            </a>{" "}
            của chúng tôi.
          </p>
          <a href="#" className="text-xs text-cookpad-orange">
            Tạo tài khoản mới
          </a>
        </div>
      </div>
    </div>
  );
}
