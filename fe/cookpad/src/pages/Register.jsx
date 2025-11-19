import { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
  const navigate = useNavigate(); 
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  });
  
  const [errors, setErrors] = useState({}); 

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const validateForm = (data) => {
    const newErrors = {};

    if (!data.name) {
      newErrors.name = 'Vui lòng điền tên của bạn.';
    }

    if (!data.email) {
      newErrors.email = 'Vui lòng điền địa chỉ email.';
    } else if (!EMAIL_REGEX.test(data.email)) {
      newErrors.email = 'Email không hợp lệ.';
    }

    if (!data.password) {
      newErrors.password = 'Vui lòng điền mật khẩu.';
    } else if (data.password.length < 6) {
      newErrors.password = 'Mật khẩu phải từ 6 ký tự trở lên.';
    }

    if (!data.confirm) {
      newErrors.confirm = 'Vui lòng xác nhận mật khẩu.';
    } else if (data.confirm !== data.password) {
      newErrors.confirm = 'Mật khẩu xác nhận không khớp.';
    }

    return newErrors;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm(form);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setErrors({});
    console.log('Đăng ký thành công với dữ liệu:', form);
    alert('Đăng ký thành công! Đang chuyển hướng...'); 
    navigate('/login');
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
          "url('https://file3.qdnd.vn/data/images/14/2023/04/05/haily/amthucvn661115714am-111.jpg?dpi=150&quality=100&w=870')",
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 bg-black/60 p-10 rounded-xl shadow-2xl w-full max-w-4xl text-white flex flex-col md:flex-row gap-10 backdrop-blur-sm">
        
        {/* Left Image Box */}
        <div className="flex-1 hidden md:block">
          <div className="w-full h-full bg-black/30 rounded-lg flex items-center justify-center overflow-hidden">
            <img
              src="https://image.tinnhanhchungkhoan.vn/w660/Uploaded/2025/wpxlcdjwi/2023_12_05/1-4666.jpg"
              alt="Food"
              className="h-full w-full object-cover opacity-80 hover:scale-110 transition-transform duration-700"
            />
          </div>
        </div>

        {/* Right Form Box */}
        <div className="flex-1">
          <h2 className="text-center text-3xl font-bold mb-6 tracking-wide uppercase">
            Đăng ký
          </h2>

          <form className="space-y-4" onSubmit={handleRegister}>
            {/* Name */}
            <div>
              <div 
                className={`flex items-center bg-white/10 border ${
                  errors.name ? 'border-red-500' : 'border-gray-400'
                } rounded-md px-3 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all`}
              >
                <User className="text-gray-300 w-5 h-5 mr-3" />
                <input
                  name="name"
                  type="text"
                  placeholder="Họ và tên"
                  value={form.name}
                  onChange={handleChange}
                  className="flex-1 bg-transparent placeholder-gray-300 focus:outline-none"
                />
              </div>
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <div 
                className={`flex items-center bg-white/10 border ${
                  errors.email ? 'border-red-500' : 'border-gray-400'
                } rounded-md px-3 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all`}
              >
                <Mail className="text-gray-300 w-5 h-5 mr-3" />
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="flex-1 bg-transparent placeholder-gray-300 focus:outline-none"
                />
              </div>
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div 
                className={`flex items-center bg-white/10 border ${
                  errors.password ? 'border-red-500' : 'border-gray-400'
                } rounded-md px-3 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all`}
              >
                <Lock className="text-gray-300 w-5 h-5 mr-3" />
                <input
                  name="password"
                  type="password"
                  placeholder="Mật khẩu"
                  value={form.password}
                  onChange={handleChange}
                  className="flex-1 bg-transparent placeholder-gray-300 focus:outline-none"
                />
              </div>
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <div 
                className={`flex items-center bg-white/10 border ${
                  errors.confirm ? 'border-red-500' : 'border-gray-400'
                } rounded-md px-3 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all`}
              >
                <Lock className="text-gray-300 w-5 h-5 mr-3" />
                <input
                  name="confirm"
                  type="password"
                  placeholder="Xác nhận mật khẩu"
                  value={form.confirm}
                  onChange={handleChange}
                  className="flex-1 bg-transparent placeholder-gray-300 focus:outline-none"
                />
              </div>
              {errors.confirm && <p className="text-red-400 text-sm mt-1">{errors.confirm}</p>}
            </div>

            <button className="w-full bg-blue-600 py-3 rounded-md mt-2 font-bold text-lg hover:bg-blue-500 transition-transform transform active:scale-95">
              Đăng ký
            </button>
          </form>

          {/* Phần Social Login */}
          <div className="mt-6">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-500"></div>
              <span className="flex-shrink-0 mx-4 text-gray-300 text-sm">Hoặc đăng ký với</span>
              <div className="flex-grow border-t border-gray-500"></div>
            </div>

            <div className="mt-4">
              <button 
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center bg-white text-gray-800 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/2048px-Google_%22G%22_logo.svg.png"
                  alt="Google"
                  className="w-5 h-5 mr-3"
                />
                Đăng ký bằng Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}