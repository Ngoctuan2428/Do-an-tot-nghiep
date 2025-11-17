// src/services/challenge.service.js

// ⚡ SỬA LỖI IMPORT TẠI ĐÂY
// 1. Import models VÀ sequelize instance từ file index
const { Challenge, Recipe, User, sequelize } = require('../models');
// 2. Import Op (Operators) từ chính thư viện 'sequelize'
const { Op } = require('sequelize'); 

const ApiError = require('../utils/ApiError');

// ===================================
// ⚡ HÀM CHO ADMIN (CRUD)
// ===================================

/**
 * [Admin] Tạo thử thách mới
 */
const createChallenge = async (challengeData) => {
  // Slug sẽ được tự động tạo bởi hook trong model
  const newChallenge = await Challenge.create(challengeData);
  return newChallenge;
};

/**
 * [Admin] Cập nhật thử thách
 */
const updateChallenge = async (challengeId, updateData) => {
  const challenge = await Challenge.findByPk(challengeId);
  if (!challenge) {
    throw new ApiError(404, 'Challenge not found');
  }
  
  await challenge.update(updateData);
  return challenge;
};

/**
 * [Admin] Xóa thử thách
 */
const deleteChallenge = async (challengeId) => {
  const challenge = await Challenge.findByPk(challengeId);
  if (!challenge) {
    throw new ApiError(404, 'Challenge not found');
  }
  
  // Bảng ChallengeRecipe sẽ tự động xóa theo (nhờ 'ON DELETE CASCADE' trong CSDL)
  await challenge.destroy();
  return { message: 'Challenge deleted successfully' };
};

// ===================================
// ⚡ HÀM CÔNG KHAI (PUBLIC)
// ===================================

/**
 * Lấy tất cả thử thách, phân loại theo trạng thái
 */
const getAllChallenges = async () => {
  const now = new Date();

  // 1. Lấy thử thách đang diễn ra
  // Code này bây giờ sẽ chạy đúng vì 'Op' đã được định nghĩa
  const ongoing = await Challenge.findAll({
    where: {
      start_date: { [Op.lte]: now }, 
      end_date: { [Op.gte]: now } 
    },
    order: [['end_date', 'ASC']] 
  });

  // 2. Lấy thử thách sắp diễn ra
  const upcoming = await Challenge.findAll({
    where: {
      start_date: { [Op.gt]: now } 
    },
    order: [['start_date', 'ASC']]
  });

  // 3. (Tùy chọn) Lấy thử thách đã kết thúc
  const ended = await Challenge.findAll({
    where: {
      end_date: { [Op.lt]: now } 
    },
    order: [['end_date', 'DESC']],
    limit: 5 
  });

  return { ongoing, upcoming, ended };
};

/**
 * Lấy chi tiết 1 thử thách (và đếm số món ăn)
 */
const getChallengeDetails = async (challengeId) => {
  const challenge = await Challenge.findByPk(challengeId, {
    attributes: {
      include: [
        [
      	// Sửa cú pháp SQL cho MySQL (dùng backtick ``)
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM \`ChallengeRecipe\` AS cr
            WHERE cr.challenge_id = \`Challenge\`.\`id\`
          )`),
          'recipeCount'
        ]
      ]
    }
  });
  if (!challenge) {
    throw new ApiError(404, 'Challenge not found');
  }
  return challenge;
};

/**
 * Lấy các món ăn của 1 thử thách (phân trang)
 */
const getRecipesForChallenge = async (challengeId, queryOptions) => {
  const { page = 1, limit = 10 } = queryOptions;
  const offset = (page - 1) * limit;

  const challenge = await Challenge.findByPk(challengeId);
  if (!challenge) {
    throw new ApiError(404, 'Challenge not found');
  }

  // Dùng hàm getRecipes() mà Sequelize tự tạo
  const recipes = await challenge.getRecipes({
    limit: parseInt(limit),
    offset: parseInt(offset),
    joinTableAttributes: [], // Không lấy thông tin bảng trung gian
    // Thêm include để lấy thông tin tác giả món ăn
    include: [
      { model: User, attributes: ['id', 'username'] }
    ]
  });
  
  return recipes;
};

module.exports = {
  // Hàm cho Admin
  createChallenge,
  updateChallenge,
  deleteChallenge,
  // Hàm công khai
  getAllChallenges,
  getChallengeDetails,
  getRecipesForChallenge,
};