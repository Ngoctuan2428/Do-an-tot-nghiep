import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const LoginSuccessHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 1. Phân tích token từ URL
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      // 2. Lưu token vào Local Storage (hoặc nơi bạn muốn lưu)
      localStorage.setItem('accessToken', token);
      console.log('Token nhận được và đã lưu:', token);
      
      // 3. Chuyển hướng đến trang chính/dashboard
      navigate('/', { replace: true });
    } else {
      // Xử lý lỗi nếu Backend không trả về token
      console.error('Đăng nhập thất bại: Không tìm thấy token trong URL.');
      navigate('/login', { replace: true });
    }
  }, [location, navigate]); // Dependencies đảm bảo chạy lại khi URL thay đổi

  // Hiển thị thông báo chờ trong khi xử lý
  return <div>Đang xác thực và chuyển hướng...</div>; 
};

export default LoginSuccessHandler;