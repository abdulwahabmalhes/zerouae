import apiClient from "./apiClient";
import { DEMO_LISTINGS, DEMO_CATEGORIES } from "@/lib/data/demoData";

function applyFilters(items: any[], params: any) {
  let r = [...items];
  if (params.search)      r = r.filter(i => i.name.toLowerCase().includes(params.search.toLowerCase()));
  if (params.category_id) r = r.filter(i => i.category_id === Number(params.category_id));
  if (params.min_price)   r = r.filter(i => i.price >= Number(params.min_price));
  if (params.max_price)   r = r.filter(i => i.price <= Number(params.max_price));
  if (params.is_featured) r = r.filter(i => i.is_featured === 1);
  if (params.sort === "price_asc")  r.sort((a,b) => a.price - b.price);
  else if (params.sort === "price_desc") r.sort((a,b) => b.price - a.price);
  else r.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return r;
}

export const listingService = {
  getListings: async (params: any = {}) => {
    try {
      const res = await apiClient.get("/get-item", { params });
      if (res.data?.success && res.data?.data?.length) return res.data;
    } catch {}
    return { success: true, data: applyFilters(DEMO_LISTINGS, params) };
  },

  getListing: async (id: string | number) => {
    try {
      const res = await apiClient.get("/get-item", { params: { id } });
      if (res.data?.success && res.data?.data) return res.data;
    } catch {}
    const item = DEMO_LISTINGS.find(i => i.id === Number(id));
    return item ? { success: true, data: item } : { success: false, data: null };
  },

  getFeatured: async () => {
    try {
      const res = await apiClient.get("/get-featured-section");
      if (res.data?.success && res.data?.data?.length) return res.data;
    } catch {}
    return { success: true, data: DEMO_LISTINGS.filter(i => i.is_featured) };
  },

  createListing: async (payload: FormData) => {
    const res = await apiClient.post("/add-item", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  updateListing: async (payload: FormData) => {
    const res = await apiClient.post("/update-item", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  deleteListing: async (id: number) => {
    const res = await apiClient.post("/delete-item", { id });
    return res.data;
  },

  getMyListings: async () => {
    try {
      const res = await apiClient.get("/my-items");
      if (res.data?.success) return res.data;
    } catch {}
    return { success: true, data: DEMO_LISTINGS.slice(0, 4) };
  },

  registerView: async (id: number) => {
    try { await apiClient.post("/set-item-total-click", { id }); } catch {}
  },

  updateStatus: async (id: number, status: string) => {
    try {
      const res = await apiClient.post("/admin/update-item-status", { id, status });
      return res.data;
    } catch {}
    return { success: true };
  },

  toggleFavourite: async (item_id: number) => {
    const res = await apiClient.post("/manage-favourite", { item_id });
    return res.data;
  },

  getFavourites: async () => {
    try {
      const res = await apiClient.get("/get-favourite-item");
      if (res.data?.success) return res.data;
    } catch {}
    return { success: true, data: [] };
  },
};
