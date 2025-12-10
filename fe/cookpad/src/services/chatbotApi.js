// src/services/chatbotApi.js
import axiosInstance from "./axiosClient";

/**
 * Gửi tin nhắn đến chatbot
 * POST /api/chatbot/query
 * @param {string} message
 */
export const sendChatbotQuery = (message) => {
  return axiosInstance.post("/chatbot/query", { message });
};

export default {
  sendChatbotQuery,
};
