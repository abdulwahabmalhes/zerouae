import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api",
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  timeout: 15000,
});

// Attach auth token
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("zoro_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("zoro_token");
      localStorage.removeItem("zoro_user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default apiClient;
