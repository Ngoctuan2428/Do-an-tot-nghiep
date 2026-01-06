import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getCurrentUser } from '../services/userApi';

const LoginCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      // LƯU TOKEN VÀ GỌI API PROFILE (SỬ DỤNG TOKEN MỚI)
      localStorage.setItem('accessToken', token);
      const fetchAndLogin = async () => {
        try {
          // getCurrentUser sẽ dùng token vừa lưu qua interceptor
          const response = await getCurrentUser();
          const userData = response.data?.data;
          // cap nhat context
          login(userData, token);

          if (userData.role === 'admin') {
            window.location.href = `http://localhost:3001/login-sso?token=${token}`;
          } else {
            navigate('/search', { replace: true });
          }
        } catch (error) {
          console.error('Login callback error:', error);
          localStorage.removeItem('accessToken');
          navigate('/login', { replace: true });
        }
      };

      fetchAndLogin();
    } else {
      console.error('Login failed: Token not found in URL.');
      navigate('/login', { replace: true });
    }
  }, [location, navigate, login]); // Đã thêm login vào dependency

  return <div>Đang hoàn tất đăng nhập...</div>;
};

export default LoginCallback;
