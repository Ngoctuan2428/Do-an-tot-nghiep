// src/pages/LoginCallback.jsx
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function LoginCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      // 1. Lưu token vào localStorage
      localStorage.setItem("token", token);

      // 2. Chuyển hướng về trang chủ và TẢI LẠI TRANG
      // Dùng window.location.replace để buộc tải lại,
      // giúp Header và các component khác nhận biết trạng thái đăng nhập mới
      window.location.replace("/");
    } else {
      // 3. Xử lý lỗi (nếu không có token)
      console.error("Đăng nhập thất bại, không tìm thấy token.");
      navigate("/?login=failed"); // Chuyển về trang chủ báo lỗi
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg">Đang xử lý đăng nhập, vui lòng chờ...</p>
    </div>
  );
}
