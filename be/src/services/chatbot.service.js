const { NlpManager } = require('node-nlp');
const path = require('path');
const { Recipe } = require('../models');
const { Op } = require('sequelize');

// 1. Tải "bộ não" đã được huấn luyện
const manager = new NlpManager();
const modelPath = path.join(__dirname, '../config/chatbot-model.json');
manager.load(modelPath);

// Hàm chính để xử lý tin nhắn
const processMessage = async (userMessage) => {
    // 2. Phân tích tin nhắn của người dùng bằng model đã tải
    const result = await manager.process('vi', userMessage);

    const intent = result.intent; // Ý định
    const entities = result.entities; // Các thực thể (từ khóa)
    const answer = result.answer; // Câu trả lời tĩnh (nếu có)

    console.log('Chatbot analysis:', result); // In ra để debug

    // 3. Xử lý logic dựa trên Ý định (Intent)
    switch (intent) {
        
        // Trường hợp: Chào hỏi
        case 'intent.chao_hoi':
            return answer; // Trả về câu trả lời tĩnh đã dạy

        // Trường hợp: Tìm kiếm công thức
        case 'intent.tim_kiem':
            const entity = entities.find(e => e.entity === 'nguyen_lieu');
            if (entity) {
                const keyword = entity.sourceText;
                
                // Truy vấn CSDL của bạn
                const recipes = await Recipe.findAll({
                    where: { title: { [Op.like]: `%${keyword}%` } },
                    limit: 3
                });
                
                if (recipes.length > 0) {
                    const titles = recipes.map(r => r.title).join('; ');
                    return `Tôi tìm thấy vài món với '${keyword}': ${titles}.`;
                }
                return `Rất tiếc, tôi không tìm thấy món nào với nguyên liệu '${keyword}'.`;
            }
            return "Bạn muốn tìm công thức về nguyên liệu gì ạ?";

        // Trường hợp: Hỏi thời gian
        case 'intent.hoi_thoi_gian':
            const monAnEntity = entities.find(e => e.entity === 'ten_mon_an');
            if (monAnEntity) {
                const keyword = monAnEntity.sourceText;
                const recipe = await Recipe.findOne({ where: { title: { [Op.like]: `%${keyword}%` } } });
                
                if (recipe) {
                    return `Món ${recipe.title} có thời gian nấu khoảng ${recipe.cook_time || 'chưa rõ'} phút.`;
                }
                return `Xin lỗi, tôi không tìm thấy côngs thức cho món '${keyword}'.`;
            }
            return "Bạn muốn hỏi thời gian nấu cho món nào ạ?";

        // Trường hợp: Không hiểu
        default:
            return "Xin lỗi, tôi chưa hiểu ý bạn. Bạn có thể hỏi tôi về cách tìm công thức nhé.";
    }
};

module.exports = { 
    processMessage
};