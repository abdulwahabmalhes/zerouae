import apiClient from "./apiClient";

export const categoryService = {
  getAll: async () => {
    const res = await apiClient.get("/get-parent-categories");
    return res.data;
  },

  getChildren: async (category_id: number) => {
    const res = await apiClient.get("/get-categories", { params: { category_id } });
    return res.data;
  },

  getCustomFields: async (category_id: number) => {
    const res = await apiClient.get("/get-customfields", { params: { category_id } });
    return res.data;
  },
};
