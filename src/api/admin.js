// src/api/admin.js
import { instance } from "./index";

export const fetchDashboardStats = async () => {
  try {
    const response = await instance.get("/admin/dashboard-stats");
    return response.data;
  } catch (error) {
    // This part is good, it tries to get a specific error message
    throw error.response?.data?.error?.message || error.message;
  }
};

export const fetchRecentActivities = async () => {
  try {
    const response = await instance.get("/admin/recent-activities");
    return response.data;
  } catch (error) {
    // Consistent error handling, good.
    throw error.response?.data?.error?.message || error.message;
  }
};