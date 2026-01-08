// frontend/src/services/todoService.js
import apiClient from "../api"; // 기존 index.js 혹은 apiClient.js 경로

// 할 일 목록 조회
export const fetchTodos = async () => {
  const response = await apiClient.get("/todos");
  return response.data;
};

// 할 일 생성
export const createTodo = async (todoData) => {
  const response = await apiClient.post("/todos", todoData);
  return response.data;
};

// 할 일 수정
export const updateTodo = async (id, todoData) => {
  const response = await apiClient.put(`/todos/${id}`, todoData);
  return response.data;
};

// 완료 상태 토글
export const toggleTodoStatus = async (id) => {
  const response = await apiClient.patch(`/todos/${id}/complete`);
  return response.data;
};

// 할 일 삭제
export const deleteTodo = async (id) => {
  const response = await apiClient.delete(`/todos/${id}`);
  return response.data;
};
