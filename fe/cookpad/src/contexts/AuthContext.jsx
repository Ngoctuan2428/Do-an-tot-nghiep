import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../services/userApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // kiem tra token & tai profile khi app load
  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    const loadUserProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getCurrentUser();

        const userData = response.data?.data;
        if (userData.user) {
          setUser(userData.user);
        } else {
          setUser(userData);
        }
      } catch (error) {
        console.error('Lỗi khi tải profile bằng token:', error);
        localStorage.removeItem('accessToken');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  // luu token va user data
  const login = (userData, token) => {
    localStorage.setItem('accessToken', token);
    setUser(userData);
  };

  // xoa token va user data
  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  // hien thi loading trong khi cho tai
  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
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

export const useAuth = () => useContext(AuthContext);
