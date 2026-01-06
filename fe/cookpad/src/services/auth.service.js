import axiosInstance from './axiosClient';

export const forgotPassword = (email) => {
  return axiosInstance.post('/auth/forgot-password', { email });
};

export const resetPassword = (id, token, newPassword) => {
  return axiosInstance.post(`/auth/reset-password/${id}/${token}`, {
    password: newPassword,
  });
};

export default {
  forgotPassword,
  resetPassword,
};
