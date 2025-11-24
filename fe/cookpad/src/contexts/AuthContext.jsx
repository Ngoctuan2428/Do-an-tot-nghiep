// src/contexts/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
// ✅ [SỬA LỖI] Đổi tên fetchUserProfile thành getCurrentUser
import { getCurrentUser } from '../services/userApi'; 


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);

  // [1] LOGIC KHỞI TẠO: Kiểm tra token và tải profile
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    
    const loadUserProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        // ✅ [SỬA LỖI] GỌI HÀM getCurrentUser() 
        // Token sẽ được tự động đính kèm qua interceptor của axios
        const response = await getCurrentUser(); 
        
        // Giả định backend trả về user data trực tiếp (response.data)
        // Chúng ta cần lấy data.user nếu backend đóng gói response
        const userData = response.data; 
        
        // Kiểm tra xem dữ liệu user có phải là user: {...} không
        if (userData.user) {
            setUser(userData.user); // Nếu backend trả về { user: {...} }
        } else {
            setUser(userData); // Nếu backend trả về user object trực tiếp
        }
        
      } catch (error) {
        console.error("Lỗi khi tải profile bằng token:", error);
        localStorage.removeItem('accessToken'); 
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserProfile();
    
  }, []); 

  // [2] HÀM LOGIN: Lưu token và user data
  const login = (userData, token) => {
    localStorage.setItem('accessToken', token);
    setUser(userData); 
  };

  // [3] HÀM LOGOUT: Xóa token và user data
  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  // [4] RENDER: Hiển thị loading trong khi chờ tải
  if (loading) {
      return (
          <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              Đang tải dữ liệu người dùng...
          </div>
      );
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};