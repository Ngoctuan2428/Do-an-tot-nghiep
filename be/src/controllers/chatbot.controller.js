const chatbotService = require('../services/chatbot.service');
const ApiError = require('../utils/ApiError');

const handleQuery = async (req, res, next) => {
    try {
        const { message } = req.body; // Chỉ cần "message"

        if (!message) {
            throw new ApiError(400, 'Message is required.');
        }

        const botResponse = await chatbotService.processMessage(message); 
        res.status(200).json({ reply: botResponse });
    } catch (error) {
        next(error);
    }
};

module.exports = { handleQuery };