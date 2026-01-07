// frontend/src/services/todoService.js
import apiClient from '../api';

export const todoService = {
  // 투두 목록 조회 (날짜 필터링 포함)
  getTodos: (date) => {
    // params를 사용하면 주소 뒤에 ?date=2024-01-01 형식으로 자동 변환됨
    return apiClient.get('/todos', { params: { date } });
  },

  // 투두 생성
  createTodo: (data) => apiClient.post('/todos', data),

  // 투두 수정 (완료 여부 등)
  updateTodo: (id, data) => apiClient.put(`/todos/${id}`, data),

  // 투두 삭제
  deleteTodo: (id) => apiClient.delete(`/todos/${id}`),
};