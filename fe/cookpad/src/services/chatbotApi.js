// src/services/chatbotApi.js
import axios from "axios";

// URL Ngrok của bạn (Giữ nguyên, không có dấu / ở cuối)
const API_URL = "https://inaccessible-shirly-herbaceously.ngrok-free.dev";

export const sendChatbotQuery = async (message) => {
  try {
    const response = await axios.post(
      `${API_URL}/chat`,
      {
        message: message, // Dữ liệu gửi đi
        temperature: 0.1, // Tham số nhiệt độ
      },
      {
        headers: {
          "Content-Type": "application/json",
          // 👇 DÒNG QUAN TRỌNG NHẤT: Bắt buộc phải có để bypass Ngrok
          "ngrok-skip-browser-warning": "69420",
        },
      }
    );

    // Xử lý dữ liệu trả về cho khớp với Chatbox.jsx
    // API trả về: { "response": "Nội dung..." } -> Chuyển thành: { data: { reply: "Nội dung..." } }
    return { data: { reply: response.data.response } };
  } catch (error) {
    console.error("API Error:", error);
    // Ném lỗi ra để Chatbox.jsx bắt được và hiện thông báo lỗi
    throw error;
  }
};

export default {
  sendChatbotQuery,
};
