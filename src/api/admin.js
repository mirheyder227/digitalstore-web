import { instance } from ".";


// api/admin.js
export const fetchDashboardStats = async (token) => {
  try {
    const response = await instance.get("/admin/dashboard-stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("fetchDashboardStats xətası:", error.response?.data || error.message);
    throw error.response?.data?.error?.message || error.message;
  }
};

export const fetchRecentActivities = async (token) => {
  try {
    const response = await instance.get("/admin/recent-activities", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("fetchRecentActivities xətası:", error.response?.data || error.message);
    throw error.response?.data?.error?.message || error.message;
  }
};
