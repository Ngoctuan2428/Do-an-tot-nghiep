// src/services/statsApi.js
import axiosClient from "./axiosClient";

/**
 * Lấy số liệu tổng quan (KPIs)
 * GET /api/stats/me
 */
export const getMyStats = () => {
  return axiosClient.get("/stats/me");
};

/**
 * Lấy dữ liệu biểu đồ lượt xem
 * GET /api/stats/me/chart
 */
export const getMyChart = () => {
  return axiosClient.get("/stats/me/chart");
};

export const getRecipeStats = (id) => axiosClient.get(`/stats/recipes/${id}`);
export const getRecipeChart = (id) =>
  axiosClient.get(`/stats/recipes/${id}/chart`);
