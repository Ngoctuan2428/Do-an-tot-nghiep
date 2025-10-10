// File: update_tags.js

// Import các model cần thiết
const { Recipe, Tag, sequelize } = require('./src/models');

// Danh sách các từ khóa bạn muốn tự động nhận diện làm tag
// Bạn có thể mở rộng danh sách này
const KEYWORD_TAGS = [
    'bò', 'gà', 'heo', 'cá', 'tôm', 'chay', 'trứng',
    'nướng', 'chiên', 'xào', 'hấp', 'luộc', 'canh', 'lẩu', 'gỏi',
    'khai vị', 'tráng miệng', 'ăn vặt', 'bữa sáng', 'bữa trưa', 'bữa tối'
];

async function generateTagsForExistingRecipes() {
    console.log('🚀 Bắt đầu quá trình tạo tags cho dữ liệu cũ...');

    try {
        // 1. Lấy tất cả công thức chưa có tag (để tránh chạy lại nhiều lần)
        const recipes = await Recipe.findAll({
            include: [{
                model: Tag,
                // required: false để lấy cả những recipe chưa có tag
                required: false 
            }]
        });

        // Lọc ra những recipes thực sự chưa có tag
        const recipesWithoutTags = recipes.filter(recipe => !recipe.Tags || recipe.Tags.length === 0);

        if (recipesWithoutTags.length === 0) {
            console.log('✅ Tất cả công thức đã có tags. Không cần cập nhật.');
            return;
        }

        console.log(`🔍 Tìm thấy ${recipesWithoutTags.length} công thức cần thêm tags.`);

        let updatedCount = 0;
        // 2. Lặp qua từng công thức
        for (const recipe of recipesWithoutTags) {
            const title = recipe.title.toLowerCase();
            const tagsToAssociate = [];

            // 3. Tìm các từ khóa trong tiêu đề
            for (const keyword of KEYWORD_TAGS) {
                if (title.includes(keyword)) {
                    tagsToAssociate.push(keyword);
                }
            }
            
            if (tagsToAssociate.length > 0) {
                console.log(`- Công thức "${recipe.title}" -> Gắn tags: [${tagsToAssociate.join(', ')}]`);

                // 4. Tìm hoặc tạo các tag trong bảng `tags` và tạo liên kết
                const tagInstances = await Promise.all(
                    tagsToAssociate.map(tagName => Tag.findOrCreate({ where: { name: tagName } }))
                );

                // Gắn các tag vào công thức (Sequelize sẽ tự động tạo bản ghi trong recipe_tags)
                await recipe.setTags(tagInstances.map(t => t[0]));
                updatedCount++;
            }
        }
        
        console.log(`\n✅ Hoàn thành! Đã cập nhật tags cho ${updatedCount} công thức.`);

    } catch (error) {
        console.error('❌ Đã xảy ra lỗi:', error);
    } finally {
        // Đóng kết nối database
        await sequelize.close();
    }
}

// Chạy hàm chính
generateTagsForExistingRecipes();