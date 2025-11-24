import React from 'react'; // ✅ Phải import React
import { createRoot } from 'react-dom/client'; // ✅ Import createRoot
import './index.css';
import App from './App.jsx';

// ⚠️ Đảm bảo bạn đã tạo file này và đường dẫn đúng
import { AuthProvider } from './contexts/AuthContext'; 

// Xác định Root Element
const container = document.getElementById('root');
const root = createRoot(container); // Sử dụng createRoot

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);