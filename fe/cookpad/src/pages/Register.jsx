import { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    alert('Register clicked!');
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://file3.qdnd.vn/data/images/14/2023/04/05/haily/amthucvn661115714am-111.jpg?dpi=150&quality=100&w=870')",
      }}
    >
      <div className="bg-black/50 p-10 rounded-xl shadow-lg w-full max-w-4xl text-white flex flex-col md:flex-row gap-10">
        {/* Left Image Box */}
        <div className="flex-1 hidden md:block">
          <div className="w-full h-full bg-black/30 rounded-lg flex items-center justify-center">
            <img
              src="https://image.tinnhanhchungkhoan.vn/w660/Uploaded/2025/wpxlcdjwi/2023_12_05/1-4666.jpg"
              alt=""
              className="h-full object-cover"
            />
          </div>
        </div>

        {/* Right Form Box */}
        <div className="flex-1">
          <h2 className="text-center text-3xl font-semibold mb-6 tracking-wide">
            ĐĂNG KÝ
          </h2>

          <form className="space-y-4" onSubmit={handleRegister}>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-300 w-5 h-5" />
              <input
                name="name"
                type="text"
                placeholder="First Name"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-white/10 border border-gray-400 rounded-md px-10 py-3 placeholder-gray-300 focus:outline-none"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-300 w-5 h-5" />
              <input
                name="email"
                type="email"
                placeholder="mail@example.com"
                value={form.email}
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

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-300 w-5 h-5" />
              <input
                name="confirm"
                type="password"
                placeholder="Confirm Password"
                value={form.confirm}
                onChange={handleChange}
                className="w-full bg-white/10 border border-gray-400 rounded-md px-10 py-3 placeholder-gray-300 focus:outline-none"
              />
            </div>

            <button className="w-full bg-blue-600 py-3 rounded-md mt-2 font-semibold hover:bg-blue-500 transition">
              Đăng ký
            </button>
          </form>

          <p className="text-center mt-6">Hoặc đăng nhập với</p>

          <div className="flex justify-center gap-3 mt-3">
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
    </div>
  );
}
