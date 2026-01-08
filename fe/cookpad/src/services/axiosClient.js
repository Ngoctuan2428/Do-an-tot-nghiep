import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    // ✅ Dùng 'accessToken'
    const accessToken = localStorage.getItem("accessToken"); 
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
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
      // ✅ Dùng 'accessToken'
      localStorage.removeItem("accessToken"); 

      // Chuyển hướng về trang Home (route gốc) để kích hoạt đăng nhập lại
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;