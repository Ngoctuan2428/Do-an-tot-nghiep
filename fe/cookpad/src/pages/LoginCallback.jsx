import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // ✅ IMPORT CONTEXT
import { getCurrentUser } from "../services/userApi"; // ✅ IMPORT HÀM LẤY PROFILE

const LoginCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      // ✅ [2] LƯU TOKEN VÀ GỌI API PROFILE (SỬ DỤNG TOKEN MỚI)

      // Bước 2a: Lưu token vào localStorage (Để Context có thể đọc được sau này)
      localStorage.setItem("accessToken", token);

      // Bước 2b: Gọi API để lấy dữ liệu User thực tế
      const fetchAndLogin = async () => {
        try {
          // getCurrentUser sẽ dùng token vừa lưu qua interceptor
          const response = await getCurrentUser();
          const userData = response.data?.data;
          // ✅ [3] CẬP NHẬT CONTEXT: BƯỚC QUAN TRỌNG NHẤT
          login(userData, token);

          // Chuyển hướng thành công
          // ✅ THÊM LOGIC KIỂM TRA QUYỀN
          if (userData.role === "admin") {
            window.location.href = `http://localhost:3001/login-sso?token=${token}`;
          } else {
            navigate("/search", { replace: true });
          }
        } catch (error) {
          console.error("Login callback error:", error);
          localStorage.removeItem("accessToken");
          navigate("/login", { replace: true });
        }
      };

      fetchAndLogin();
    } else {
      console.error("Login failed: Token not found in URL.");
      navigate("/login", { replace: true });
    }
  }, [location, navigate, login]); // Đã thêm login vào dependency

  return <div>Đang hoàn tất đăng nhập...</div>;
};

export default LoginCallback;
