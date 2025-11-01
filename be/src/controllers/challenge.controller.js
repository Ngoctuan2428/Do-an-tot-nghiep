// src/controllers/challenge.controller.js
const challengeService = require('../services/challenge.service');
const ApiError = require('../utils/ApiError'); // Giả sử bạn có file này

// Wrapper để bắt lỗi async (nếu bạn có, nếu không thì dùng try-catch)
// const catchAsync = require('../utils/catchAsync');

// Hàm helper (nếu không có catchAsync)
const handleAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// ===================================
// ⚡ HÀM CHO ADMIN (CRUD)
// ===================================

const createChallenge = handleAsync(async (req, res, next) => {
  const newChallenge = await challengeService.createChallenge(req.body);
  res.status(201).json({ status: 'success', data: newChallenge });
});

const updateChallenge = handleAsync(async (req, res, next) => {
  const updatedChallenge = await challengeService.updateChallenge(
    req.params.id,
    req.body
  );
  res.status(200).json({ status: 'success', data: updatedChallenge });
});

const deleteChallenge = handleAsync(async (req, res, next) => {
  await challengeService.deleteChallenge(req.params.id);
  res.status(204).send();
});

// ===================================
// ⚡ HÀM CÔNG KHAI (PUBLIC)
// ===================================

const getAllChallenges = handleAsync(async (req, res, next) => {
  const challenges = await challengeService.getAllChallenges();
  res.status(200).json({ status: 'success', data: challenges });
});

const getChallengeDetails = handleAsync(async (req, res, next) => {
  const challenge = await challengeService.getChallengeDetails(req.params.id);
  res.status(200).json({ status: 'success', data: challenge });
});

const getRecipesForChallenge = handleAsync(async (req, res, next) => {
  const recipes = await challengeService.getRecipesForChallenge(
    req.params.id,
    req.query // Gửi query (ví dụ: ?page=1&limit=10)
  );
  res.status(200).json({ status: 'success', data: recipes });
});

module.exports = {
  createChallenge,
  updateChallenge,
  deleteChallenge,
  getAllChallenges,
  getChallengeDetails,
  getRecipesForChallenge,
};