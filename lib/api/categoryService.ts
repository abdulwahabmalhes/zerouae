import apiClient from "./apiClient";
import { DEMO_CATEGORIES } from "@/lib/data/demoData";

export const categoryService = {
  getAll: async () => {
    try {
      const res = await apiClient.get("/get-parent-categories");
      if (res.data?.success && res.data?.data?.length) return res.data;
    } catch {}
    return { success: true, data: DEMO_CATEGORIES };
  },

  getChildren: async (category_id: number) => {
    try {
      const res = await apiClient.get("/get-categories", { params: { category_id } });
      if (res.data?.success) return res.data;
    } catch {}
    return { success: true, data: [] };
  },

  getCustomFields: async (category_id: number) => {
    try {
      const res = await apiClient.get("/get-customfields", { params: { category_id } });
      if (res.data?.success) return res.data;
    } catch {}
    return { success: true, data: [] };
  },
};
