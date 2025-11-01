// src/controllers/chatbot.controller.js
const chatbotService = require('../services/chatbot.service');

// THAY ĐỔI 1: Thêm 'async' vào hàm
const handleQuery = async (req, res, next) => { 
  try {
    const { message } = req.body;
    
    const reply = await chatbotService.processMessage(message);
    
    res.status(200).json({ 
      status: 'success', 
      data: { reply } // 'reply' bây giờ sẽ là một chuỗi (string)
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { handleQuery };