// frontend/src/api/index.js
import axios from 'axios';

const apiClient = axios.create({
  // baseURL: '/api', // Proxy 사용 시
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // [필수] HttpOnly 쿠키 전송
});

// 응답 인터셉터 (토큰 만료 시 자동 갱신 로직)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // 419: 토큰 만료, 401: 인증 실패
    if ((error.response?.status === 419 || error.response?.status === 401) && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // 토큰 갱신 요청
        await apiClient.post('/users/refresh'); 
        // 갱신 성공 시 원래 요청 다시 시도
        return apiClient(originalRequest);
      } catch (refreshError) {
        // 갱신 실패 시 로그인 페이지로 이동
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;