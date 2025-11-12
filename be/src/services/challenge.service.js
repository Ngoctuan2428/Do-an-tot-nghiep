// src/services/challenge.service.js
const { Challenge, Recipe, User } = require("../models");
const { Op } = require("sequelize");
const ApiError = require("../utils/ApiError");

// (Admin) Tạo thử thách mới
const createChallenge = async (data) => {
  // Đảm bảo hashtag luôn bắt đầu bằng dấu #
  if (data.hashtag && !data.hashtag.startsWith("#")) {
    data.hashtag = `#${data.hashtag}`;
  }
  return await Challenge.create(data);
};

// (Public) Lấy tất cả thử thách
const getAllChallenges = async () => {
  return await Challenge.findAll({ order: [["created_at", "DESC"]] });
};

// (Public) Lấy chi tiết 1 thử thách bằng hashtag
const getChallengeByHashtag = async (hashtag) => {
  const challenge = await Challenge.findOne({
    where: { hashtag: `#${hashtag}` }, // Đảm bảo tìm đúng hashtag
  });
  if (!challenge) throw new ApiError(404, "Không tìm thấy thử thách");
  return challenge;
};

// (Public) Lấy các món đã tham gia thử thách (Tìm theo hashtag)
const getChallengeParticipants = async (hashtag) => {
  const tag = `#${hashtag}`;

  const recipes = await Recipe.findAndCountAll({
    where: {
      status: "public", // Chỉ món đã lên sóng
      description: { [Op.like]: `%${tag}%` }, // Có hashtag trong mô tả
    },
    include: [{ model: User, attributes: ["id", "username", "avatar_url"] }],
    order: [["created_at", "DESC"]],
    limit: 50, // Giới hạn 50 món mới nhất
  });
  return recipes;
};

module.exports = {
  createChallenge,
  getAllChallenges,
  getChallengeByHashtag,
  getChallengeParticipants,
};
