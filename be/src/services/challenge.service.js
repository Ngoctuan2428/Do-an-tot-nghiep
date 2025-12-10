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

const getAllChallenges = async (queryOptions = {}) => {
  const { page = 1, limit = 10 } = queryOptions;
  const offset = (page - 1) * limit;

  return await Challenge.findAndCountAll({
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [["created_at", "DESC"]],
  });
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

const getChallengeById = async (id) => {
  const challenge = await Challenge.findByPk(id);
  if (!challenge) throw new ApiError(404, "Challenge not found");
  return challenge;
};

const updateChallenge = async (id, data) => {
  const challenge = await getChallengeById(id);

  // Đảm bảo hashtag có dấu #
  if (data.hashtag && !data.hashtag.startsWith("#")) {
    data.hashtag = `#${data.hashtag}`;
  }

  await challenge.update(data);
  return challenge;
};

const deleteChallenge = async (id) => {
  const challenge = await getChallengeById(id);
  await challenge.destroy();
  return { message: "Challenge deleted successfully" };
};

module.exports = {
  createChallenge,
  getAllChallenges,
  getChallengeByHashtag,
  getChallengeParticipants,
  getChallengeById,
  updateChallenge, // Export thêm
  deleteChallenge, // Export thêm
};
