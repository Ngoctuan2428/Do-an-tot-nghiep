// src/services/interactionApi.js
import axiosInstance from "./axiosClient";

export const getInteractions = () => {
  return axiosInstance.get("/interactions");
};
