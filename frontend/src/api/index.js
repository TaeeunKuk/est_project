// src/api/index.js
import axios from 'axios';

// 1. Axios 인스턴스 생성 (기본 설정)
// 백엔드 주소: http://localhost:3000/api
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==============================================
//  Auth (회원가입/로그인) API
// ==============================================

/**
 * 회원가입 함수
 * @param {Object} userData - { email, password, name }
 * @returns {Promise} 백엔드 응답 데이터
 */
export const signUp = async (userData) => {
  try {
    // POST http://localhost:3000/api/users/signup 요청 전송
    const response = await apiClient.post('/users/signup', userData);
    return response.data;
  } catch (error) {
    // 에러 발생 시 더 명확한 메시지를 반환
    throw error.response ? error.response.data : error;
  }
};

/**
 * 로그인 함수 (추후 구현 예정 시 사용)
 * @param {Object} loginData - { email, password }
 */
export const login = async (loginData) => {
  try {
    const response = await apiClient.post('/users/login', loginData);
    return response.data; // 보통 여기에 { token, user } 정보가 들어옴
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// ==============================================
//  Todos (할 일) API - (mockData 대체용 추후 구현)
// ==============================================
export const getTodos = async () => {
  // const response = await apiClient.get('/todos');
  // return response.data;
  return []; // 지금은 빈 배열 반환 (백엔드 구현 전까지 임시)
};

export default apiClient;