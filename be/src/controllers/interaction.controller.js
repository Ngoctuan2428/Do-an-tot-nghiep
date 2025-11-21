// src/controllers/interaction.controller.js
const interactionService = require("../services/interaction.service");

const getInteractionFeed = async (req, res, next) => {
  try {
    const feed = await interactionService.getInteractionFeed(req.user.id);
    res.status(200).json({ status: "success", data: feed });
  } catch (error) {
    next(error);
  }
};

module.exports = { getInteractionFeed };
