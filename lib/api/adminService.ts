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

  /** Get items with status filter */
  getItems: async (params: { status?: string; search?: string } = {}) => {
    const res = await apiClient.get("/admin/items", { params });
    return res.data;
  },

  /** Categories */
  createCategory: async (data: FormData | any) => {
    const res = await apiClient.post("/admin/categories", data);
    return res.data;
  },
  updateCategory: async (id: number, data: FormData | any) => {
    // Laravel requires POST with _method=PUT for multipart/form-data updates
    if (data instanceof FormData) {
      data.append("_method", "PUT");
      const res = await apiClient.post(`/admin/categories/${id}`, data);
      return res.data;
    } else {
      const res = await apiClient.put(`/admin/categories/${id}`, data);
      return res.data;
    }
  },
  deleteCategory: async (id: number) => {
    const res = await apiClient.delete(`/admin/categories/${id}`);
    return res.data;
  },
};
