import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../services/axiosClient';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth(); 
  
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false); 
  
  const [error, setError] = useState(null); 
  const [isLoading, setIsLoading] = useState(false); 

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError(null); 
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!form.email || !form.password) {
        setError('Vui lòng điền đầy đủ email và mật khẩu.');
        return;
    }

    setIsLoading(true);
    
    try {
        const response = await axiosInstance.post('/auth/login', {
            email: form.email, 
            password: form.password,
        });

        // ✅ [SỬA LỖI] ĐIỀU CHỈNH ĐỂ ĐỌC CẤU TRÚC LỒNG NHAU (response.data.data)
        const { user: userData, accessToken } = response.data.data; 

        // CẬP NHẬT TRẠNG THÁI TOÀN CỤC SAU KHI ĐĂNG NHẬP THÀNH CÔNG
        login(userData, accessToken); 

        // Chuyển hướng thành công -> Về trang chủ
        navigate('/', { replace: true }); 
        
    } catch (err) {
        // Xử lý lỗi API (Lỗi 401, 404, 500)
        const errorMessage = err.response?.data?.message || 'Lỗi: Email hoặc mật khẩu không đúng.';
        setError(errorMessage);
        
    } finally {
        setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log("Đang chuyển hướng đến trang đăng nhập Google...");
    window.location.href = "http://localhost:8000/api/auth/google"; 
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center relative"
      style={{
        backgroundImage:
          "url('https://sgtt.thesaigontimes.vn/wp-content/uploads/2025/03/mon-ngon-3-mien-abbe.jpg')",
      }}
    >
      <div className="bg-black/70 p-10 rounded-xl shadow-lg w-full max-w-md text-white relative z-10">
        <h2 className="text-center text-3xl font-semibold mb-6 tracking-wide uppercase">
          Đăng nhập ngay
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* HIỂN THỊ LỖI CHUNG */}
          {error && (
              <div className="p-3 bg-red-600/80 rounded-md text-sm font-medium">
                  {error}
              </div>
          )}
          
          {/* TRƯỜNG EMAIL */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className={`w-full bg-white/10 border border-gray-400 rounded-md pl-10 pr-4 py-3 placeholder-gray-300 focus:outline-none`}
            />
          </div>

          {/* TRƯỜNG PASSWORD (CÓ TOGGLE) */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Mật khẩu"
              value={form.password}
              onChange={handleChange}
              className={`w-full bg-white/10 border border-gray-400 rounded-md pl-10 pr-10 py-3 placeholder-gray-300 focus:outline-none`}
            />
             {/* NÚT TOGGLE MẬT KHẨU */}
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition focus:outline-none"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex justify-between text-sm">
            <p>
              Quên mật khẩu?{' '}
              <span className="text-blue-300 cursor-pointer hover:text-blue-200 transition">Bấm vào đây</span>
            </p>
            <p>
              <Link to="/register" className="text-green-300 hover:text-green-200 transition">
                Đăng ký tại đây
              </Link>
            </p>
          </div>

          {/* Nút Đăng nhập chính */}
          <button 
            className="w-full bg-cookpad-orange text-white py-3 rounded-md mt-4 font-bold text-lg hover:bg-orange-600 transition disabled:bg-gray-500"
            disabled={isLoading}
          >
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <p className="text-center my-4 text-gray-300">Hoặc đăng nhập với</p>

        <div className="flex justify-center">
          <button 
            onClick={handleGoogleLogin} 
            className="flex items-center justify-center bg-white text-gray-800 py-2 px-4 rounded-md font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/2048px-Google_%22G%22_logo.svg.png"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Google
          </button>
        </div>
      </div>
    </div>
  );
}