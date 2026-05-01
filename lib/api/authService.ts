import apiClient from "./apiClient";

export const authService = {
  /** Request OTP via mobile number */
  requestOtp: async (mobile: string) => {
    const res = await apiClient.get("/get-otp", { params: { mobile } });
    return res.data;
  },

  /** Verify OTP → returns { success, token, data: user } */
  verifyOtp: async (mobile: string, otp: string) => {
    const res = await apiClient.get("/verify-otp", { params: { mobile, otp } });
    const d = res.data;
    if (d?.success && d?.data?.token) {
      return { success: true, token: d.data.token, data: d.data.data, message: d.message };
    }
    return d;
  },

  /** Register new user */
  register: async (payload: {
    name: string; email: string; mobile: string;
    password: string; password_confirmation: string;
  }) => {
    const res = await apiClient.post("/user-signup", payload);
    const d = res.data;
    if (d?.success && d?.data?.token) {
      return { success: true, token: d.data.token, data: d.data.data, message: d.message };
    }
    return d;
  },

  /** Email + password login */
  loginEmail: async (email: string, password: string) => {
    const res = await apiClient.post("/login", { email, password });
    const d = res.data;
    // Normalize: API returns { success, data: { token, data: user } }
    if (d?.success && d?.data?.token) {
      return { success: true, token: d.data.token, data: d.data.data, message: d.message };
    }
    return d;
  },

  /** Get authenticated user profile */
  getProfile: async () => {
    const res = await apiClient.get("/get-profile");
    return res.data;
  },

  /** Update profile */
  updateProfile: async (payload: FormData) => {
    const res = await apiClient.post("/update-profile", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
};
