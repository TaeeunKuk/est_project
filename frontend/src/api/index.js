// frontend/src/api/index.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // [필수] 쿠키 전송
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 1. 이미 '토큰 갱신 요청'이 실패한 경우 (재시도 금지)
    if (originalRequest.url.includes("/auth/refresh")) {
      // [핵심 수정] 현재 페이지가 로그인 페이지가 아닐 때만 이동
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    // 2. 401 에러이고, 아직 재시도를 안 했다면?
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 토큰 갱신 시도
        await apiClient.post("/auth/refresh");

        // 갱신 성공 시 원래 요청 재시도
        return apiClient(originalRequest);
      } catch (refreshError) {
        // 갱신 실패 시 로그아웃 처리
        console.error("세션 만료, 로그아웃");

        // [핵심 수정] 현재 페이지가 로그인 페이지가 아닐 때만 이동 (무한 루프 방지)
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
