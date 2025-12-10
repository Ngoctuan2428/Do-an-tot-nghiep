const statsService = require("../services/stats.service");

// API lấy tổng quan (KPI)
const getMyStats = async (req, res, next) => {
  try {
    const stats = await statsService.getUserStats(req.user.id);
    res.status(200).json({ status: "success", data: stats });
  } catch (error) {
    next(error);
  }
};

// API lấy dữ liệu biểu đồ
const getMyChart = async (req, res, next) => {
  try {
    const chartData = await statsService.getViewsChartData(req.user.id);
    res.status(200).json({ status: "success", data: chartData });
  } catch (error) {
    next(error);
  }
};

// ✅ Controller mới
const getRecipeStats = async (req, res, next) => {
  try {
    const { id } = req.params; // Recipe ID
    const stats = await statsService.getRecipeStats(id, req.user.id);
    res.status(200).json({ status: "success", data: stats });
  } catch (error) {
    next(error);
  }
};

const getRecipeChart = async (req, res, next) => {
  try {
    const { id } = req.params;
    const chart = await statsService.getRecipeChartData(id, req.user.id);
    res.status(200).json({ status: "success", data: chart });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMyStats, getMyChart, getRecipeStats, getRecipeChart };
