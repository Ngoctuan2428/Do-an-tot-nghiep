// src/services/interactionApi.js
import axiosInstance from "./axiosClient";

export const getInteractions = () => {
  return axiosInstance.get("/interactions");
};

export const toggleLike = (recipeId) => {
  return axiosInstance.post(`/interactions/like/${recipeId}`);
};

export const toggleFollow = (userId) => {
  return axiosInstance.post(`/interactions/follow/${userId}`);
};
