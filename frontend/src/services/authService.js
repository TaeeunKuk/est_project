// frontend/src/services/authService.js
import apiClient from '../api';

export const authService = {
  // 회원가입
  signUp: (data) => apiClient.post('/users/signup', data),
  
  // 로그인
  login: (data) => apiClient.post('/users/login', data),
  
  // 로그아웃
  logout: () => apiClient.post('/users/logout'),
};