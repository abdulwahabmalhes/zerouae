import apiClient from "./apiClient";

export const adminService = {
  /** Dashboard stats */
  getStats: async () => {
    const res = await apiClient.get("/admin/stats");
    return res.data;
  },

  /** Get all users */
  getUsers: async (params: { search?: string; page?: number } = {}) => {
    const res = await apiClient.get("/admin/users", { params });
    return res.data;
  },

  /** Block / unblock user */
  blockUser: async (userId: number) => {
    const res = await apiClient.post("/block-user", { blocked_user_id: userId });
    return res.data;
  },

  /** Delete user */
  deleteUser: async () => {
    const res = await apiClient.delete("/delete-user");
    return res.data;
  },

  /** Revenue / analytics data */
  getAnalytics: async () => {
    const res = await apiClient.get("/admin/analytics");
    return res.data;
  },
};
