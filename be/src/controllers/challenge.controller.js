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
    const challenges = await challengeService.getAllChallenges();
    res.status(200).json({ status: "success", data: challenges });
  } catch (error) {
    next(error);
  }
};

const getChallengeDetail = async (req, res, next) => {
  try {
    const { hashtag } = req.params;
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

module.exports = {
  createChallenge,
  getAllChallenges,
  getChallengeDetail,
  getParticipants,
};
