import axiosInstance from "./axiosClient";

// Lấy danh sách thông báo (có hỗ trợ lọc theo type)
export const getNotifications = async (type = "") => {
  const params = type === "all" ? {} : { type };
  return await axiosInstance.get("/notifications", { params });
};

// Đánh dấu 1 thông báo là đã đọc
export const markNotificationAsRead = async (id) => {
  return await axiosInstance.put(`/notifications/${id}/read`);
};

// Đánh dấu tất cả là đã đọc
export const markAllNotificationsAsRead = async () => {
  return await axiosInstance.put("/notifications/read-all");
};
