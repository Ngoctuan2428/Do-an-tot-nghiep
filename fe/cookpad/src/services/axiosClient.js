import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 1. Chỉ xử lý lỗi 401 nếu không phải là lỗi đăng nhập/đăng ký
    if (
      error.response?.status === 401 &&
      !error.config.url.includes("/auth/")
    ) {
      // Handle unauthorized access
      localStorage.removeItem("token");

      // ✅ SỬA: Chuyển hướng về trang Home (route gốc)
      // Nếu không có token, trang Home sẽ mở LoginModal
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
