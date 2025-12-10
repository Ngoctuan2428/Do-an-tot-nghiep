// src/controllers/challenge.controller.js
const challengeService = require("../services/challenge.service.js");

const createChallenge = async (req, res, next) => {
  try {
    const challenge = await challengeService.createChallenge(req.body);
    res.status(201).json({ status: "success", data: challenge });
  } catch (error) {
    next(error);
  }
};

const getAllChallenges = async (req, res, next) => {
  try {
    const queryOptions = req.query; // Lấy tham số từ URL (?page=1&limit=10)
    const challenges = await challengeService.getAllChallenges(queryOptions);

    // React Admin thường cần header này để hiển thị phân trang đúng
    res.set("X-Total-Count", challenges.count);
    res.set(
      "Content-Range",
      `challenges 0-${challenges.rows.length}/${challenges.count}`
    );

    res.status(200).json({ status: "success", data: challenges });
  } catch (error) {
    next(error);
  }
};

const getChallengeDetail = async (req, res, next) => {
  try {
    const { hashtag } = req.params;

    // Nếu tham số là số (ID) -> Gọi hàm tìm theo ID (phải thêm hàm này ở service)
    if (/^\d+$/.test(hashtag)) {
      const challenge = await challengeService.getChallengeById(hashtag);
      return res.status(200).json({ status: "success", data: challenge });
    }

    // Nếu là chữ (Hashtag) -> Gọi hàm cũ
    const challenge = await challengeService.getChallengeByHashtag(hashtag);
    res.status(200).json({ status: "success", data: challenge });
  } catch (error) {
    next(error);
  }
};

const getParticipants = async (req, res, next) => {
  try {
    const { hashtag } = req.params;
    const recipes = await challengeService.getChallengeParticipants(hashtag);
    res.status(200).json({ status: "success", data: recipes });
  } catch (error) {
    next(error);
  }
};

const getChallenge = async (req, res, next) => {
  try {
    const { id } = req.params; // Lấy tham số từ URL

    // Kiểm tra: Nếu là số nguyên -> Tìm theo ID (Dành cho Admin)
    if (/^\d+$/.test(id)) {
      const challenge = await challengeService.getChallengeById(id);
      return res.status(200).json({ status: "success", data: challenge });
    }

    // Ngược lại -> Tìm theo Hashtag (Dành cho User)
    // (Lưu ý: service getChallengeByHashtag mong đợi hashtag không có dấu # nếu logic của bạn đã xử lý việc thêm #)
    const challenge = await challengeService.getChallengeByHashtag(id);
    return res.status(200).json({ status: "success", data: challenge });
  } catch (error) {
    next(error);
  }
};

const updateChallenge = async (req, res, next) => {
  try {
    const updated = await challengeService.updateChallenge(
      req.params.id,
      req.body
    );
    res.status(200).json({ status: "success", data: updated });
  } catch (error) {
    next(error);
  }
};

// ✅ 3. CONTROLLER MỚI: Xóa
const deleteChallenge = async (req, res, next) => {
  try {
    await challengeService.deleteChallenge(req.params.id);
    // React Admin cần status 200 hoặc 204 và data trả về là ID đã xóa hoặc null
    res.status(200).json({ status: "success", data: { id: req.params.id } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createChallenge,
  getAllChallenges,
  getChallengeDetail,
  getParticipants,
  getChallenge,
  updateChallenge, // Admin Update
  deleteChallenge, // Admin Delete
};
