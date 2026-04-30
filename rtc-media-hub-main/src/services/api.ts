import axios from "axios";

// =====================================
// Configuração base da API
// =====================================

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

console.log("🔧 API Configuration:");
console.log("  - VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);
console.log("  - API_BASE_URL:", API_BASE_URL);

// Instância principal do Axios
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

console.log("✅ Axios client criado com baseURL:", API_BASE_URL);

// Interceptor de request (token, logs, etc.)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    console.log("📤 Request:", config.method?.toUpperCase(), config.url);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("  - Token presente");
    }
    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

// Interceptor de response (erros, 401, etc.)
apiClient.interceptors.response.use(
  (response) => {
    console.log(
      "✅ Response:",
      response.config.method?.toUpperCase(),
      response.config.url,
      "- Status:",
      response.status
    );
    return response;
  },
  (error) => {
    console.error("❌ Response error:", {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });

    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// =====================================
// Endpoints específicos (ex: gruposApi)
// =====================================

export const gruposApi = {
  getAll: (params?: any) =>
    apiClient.get("/grupo_pecas/", { params }),

  create: (data: any) =>
    apiClient.post("/grupo_pecas/", data),

  update: (id: number, data: any) =>
    apiClient.put(`/grupo_pecas/${id}/`, data),

  delete: (id: number) =>
    apiClient.delete(`/grupo_pecas/${id}/`),

  uploadPdf: (id: number, formData: FormData) =>
    apiClient.patch(`/grupo_pecas/${id}/upload-pdf/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};
