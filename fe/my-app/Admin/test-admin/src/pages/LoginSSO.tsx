// src/pages/LoginSSO.tsx
import { useEffect } from "react";
import { useRedirect } from "react-admin";

export const LoginSSO = () => {
  const redirect = useRedirect();

  useEffect(() => {
    // 1. Lấy token từ URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // 2. Lưu vào LocalStorage theo đúng cấu trúc mà authProvider của bạn đang dùng
      // (Dựa vào file authProvider.ts bạn gửi trước đó)
      localStorage.setItem("auth", JSON.stringify({ token: token }));

      // 3. Chuyển hướng vào trang chủ Admin
      redirect("/");
    } else {
      // Nếu không có token, đá về trang login thường
      redirect("/login");
    }
  }, [redirect]);

  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
    >
      <h2>Đang đăng nhập vào hệ thống quản trị...</h2>
    </div>
  );
};
