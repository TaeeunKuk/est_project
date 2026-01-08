// frontend/src/api/index.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api", // 백엔드 주소 확인
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// // [추가] 요청 인터셉터: 모든 요청 헤더에 Access Token 탑재
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('accessToken');
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // 응답 인터셉터 (토큰 만료 시 자동 갱신 로직)
// apiClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // 401(Unauthorized) 또는 419(Custom) 에러 발생 시
//     if ((error.response?.status === 401 || error.response?.status === 419) && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         // 로컬 스토리지에서 Refresh Token 가져오기
//         const refreshToken = localStorage.getItem('refreshToken');

//         // [수정] 경로를 /auth/refresh로 통일하고, body에 refreshToken 전달
//         const { data } = await apiClient.post('/auth/refresh', { refreshToken });

//         // 새 Access Token 저장
//         localStorage.setItem('accessToken', data.accessToken);

//         // 실패했던 요청의 헤더를 새 토큰으로 교체 후 재요청
//         originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
//         return apiClient(originalRequest);

//       } catch (refreshError) {
//         console.error('Refresh Token expired or invalid', refreshError);
//         // 갱신 실패 시 로그아웃 처리
//         localStorage.removeItem('accessToken');
//         localStorage.removeItem('refreshToken');
//         window.location.href = '/login';
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default apiClient;
