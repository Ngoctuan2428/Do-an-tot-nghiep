const { NlpManager } = require('node-nlp');

async function trainChatbot() {
    console.log('🚀 Bắt đầu quá trình huấn luyện "bộ não" chatbot...');
    const manager = new NlpManager({ languages: ['vi'], forceNER: true });

    // --- 1. Dạy cho bot các Ý ĐỊNH (Intents) ---

    // Ý định: Chào hỏi
    manager.addDocument('vi', 'chào bạn', 'intent.chao_hoi');
    manager.addDocument('vi', 'hello', 'intent.chao_hoi');
    manager.addDocument('vi', 'hi bot', 'intent.chao_hoi');

    // Ý định: Tìm kiếm công thức
    manager.addDocument('vi', 'tìm công thức món gà', 'intent.tim_kiem');
    manager.addDocument('vi', 'chỉ tôi cách làm bò kho', 'intent.tim_kiem');
    manager.addDocument('vi', 'có món nào nấu từ cá không', 'intent.tim_kiem');
    manager.addDocument('vi', 'công thức nấu ăn với thịt heo', 'intent.tim_kiem');
    manager.addDocument('vi', 'tìm món chay', 'intent.tim_kiem');

    // Ý định: Hỏi chi tiết (ví dụ: thời gian nấu)
    manager.addDocument('vi', 'món phở bò nấu bao lâu', 'intent.hoi_thoi_gian');
    manager.addDocument('vi', 'thời gian chuẩn bị của món gà nướng', 'intent.hoi_thoi_gian');
    manager.addDocument('vi', 'nấu món cá kho mất bao lâu', 'intent.hoi_thoi_gian');


    // --- 2. Dạy cho bot các THỰC THỂ (Entities) ---
    // Sửa lại tên hàm thành "addNamedEntityText"

    // Entity: Nguyên liệu
    manager.addNamedEntityText('vi', 'nguyen_lieu', 'gà', ['gà', 'thịt gà']);
    manager.addNamedEntityText('vi', 'nguyen_lieu', 'bò', ['bò', 'thịt bò']);
    manager.addNamedEntityText('vi', 'nguyen_lieu', 'cá', ['cá']);
    manager.addNamedEntityText('vi', 'nguyen_lieu', 'heo', ['heo', 'thịt heo']);
    manager.addNamedEntityText('vi', 'nguyen_lieu', 'chay', ['chay', 'đồ chay']);

    // Entity: Tên món ăn (ví dụ)
    manager.addNamedEntityText('vi', 'ten_mon_an', 'phở bò', ['phở bò']);
    manager.addNamedEntityText('vi', 'ten_mon_an', 'gà nướng', ['gà nướng']);
    manager.addNamedEntityText('vi', 'ten_mon_an', 'cá kho', ['cá kho', 'cá kho tộ']);

    // Entity: Loại chi tiết
    manager.addNamedEntityText('vi', 'chi_tiet', 'thời gian', ['thời gian', 'bao lâu']);
    manager.addNamedEntityText('vi', 'chi_tiet', 'nguyên liệu', ['nguyên liệu', 'cần gì']);

    // --- 3. Dạy bot các câu trả lời TĨNH (không cần database) ---
    manager.addAnswer('vi', 'intent.chao_hoi', 'Chào bạn! Tôi là trợ lý ảo nấu ăn, tôi có thể giúp bạn tìm công thức.');


    // --- 4. Bắt đầu huấn luyện ---
    console.log('Đang xử lý dữ liệu huấn luyện...');
    await manager.train();
    console.log('✅ Huấn luyện hoàn thành!');
    
    // 5. Lưu "bộ não" ra file
    manager.save('./src/config/chatbot-model.json');
    console.log('💾 Đã lưu "bộ não" vào file /src/config/chatbot-model.json');
}

trainChatbot();