import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Lock } from 'lucide-react';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    alert('Login clicked!');
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://sgtt.thesaigontimes.vn/wp-content/uploads/2025/03/mon-ngon-3-mien-abbe.jpg')",
      }}
    >
      <div className="bg-black/70 p-10 rounded-xl shadow-lg w-full max-w-md text-white">
        <h2 className="text-center text-3xl font-semibold mb-6 tracking-wide">
          ĐĂNG NHẬP NGAY
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-300 w-5 h-5" />
            <input
              name="username"
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className="w-full bg-white/10 border border-gray-400 rounded-md px-10 py-3 placeholder-gray-300 focus:outline-none"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-300 w-5 h-5" />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-white/10 border border-gray-400 rounded-md px-10 py-3 placeholder-gray-300 focus:outline-none"
            />
          </div>

          <div className="flex justify-between text-sm">
            <p>
              Quên mật khẩu?{' '}
              <span className="text-blue-300 cursor-pointer">Bấm vào đây</span>
            </p>
            <p>
              <Link to="/register" className="text-green-300">
                Đăng ký tại đây
              </Link>
            </p>
          </div>

          <button className="w-full bg-white text-black py-3 rounded-md mt-4 font-semibold hover:bg-gray-200 transition">
            Đăng nhập
          </button>
        </form>

        {/* Social login */}
        <p className="text-center my-4">Hoặc đăng nhập với</p>

        <div className="flex justify-center gap-3">
          <button>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
              alt="Facebook"
              className="w-5 h-5 mr-2"
            />
          </button>
          <button className=" rounded-full">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/2048px-Google_%22G%22_logo.svg.png"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
          </button>
          <button>
            <img
              src="https://images.seeklogo.com/logo-png/49/2/twitter-x-logo-png_seeklogo-492396.png"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
          </button>
          <button>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Instagram_logo_2022.svg/2048px-Instagram_logo_2022.svg.png"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
