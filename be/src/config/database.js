const { Sequelize } = require('sequelize');
const config = require('./environment'); // Import cấu hình từ file environment.js

// Lấy thông tin kết nối từ object config
const { host, port, user, password, database } = config.db;

// Khởi tạo một đối tượng Sequelize mới
const sequelize = new Sequelize(database, user, password, {
    host: host,
    port: port,
    dialect: 'mysql',
    logging: false // Tắt log các câu lệnh SQL ra console, bật (true) nếu cần debug
});

// Hàm để kiểm tra kết nối đến database
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ MySQL Connection has been established successfully.');
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
        // Thoát khỏi tiến trình nếu không thể kết nối DB
        process.exit(1); 
    }
};

// Xuất ra sequelize instance và hàm connectDB
module.exports = {
    sequelize,
    connectDB
};