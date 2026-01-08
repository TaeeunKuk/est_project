// frontend/src/services/authService.js
import apiClient from "../api";

export const authService = {
  // [수정] 백엔드 라우트(/api/auth/signup)에 맞춰 경로 수정
  signUp: async (userInfo) => {
    // API 주소: http://localhost:8080/api/auth/signup
    return await apiClient.post("/auth/signup", userInfo);
  },

  login: async (credentials) => {
    return await apiClient.post("/auth/login", credentials);
  },

  logout: async () => {
    return await apiClient.post("/auth/logout");
  },
};
