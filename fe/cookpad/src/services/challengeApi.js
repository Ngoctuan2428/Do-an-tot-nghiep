// src/services/challengeApi.js
import axiosInstance from "./axiosClient";

// Lấy tất cả thử thách
export const getAllChallenges = () => {
  return axiosInstance.get("/challenges");
};

// Lấy chi tiết 1 thử thách (bằng hashtag, không có #)
export const getChallengeByHashtag = (hashtag) => {
  return axiosInstance.get(`/challenges/${hashtag}`);
};

// Lấy danh sách món tham gia
export const getChallengeParticipants = (hashtag) => {
  return axiosInstance.get(`/challenges/${hashtag}/participants`);
};

// (Admin) Tạo thử thách mới
export const createChallenge = (data) => {
  return axiosInstance.post("/challenges", data);
};

export default {
  getAllChallenges,
  getChallengeByHashtag,
  getChallengeParticipants,
  createChallenge,
};
