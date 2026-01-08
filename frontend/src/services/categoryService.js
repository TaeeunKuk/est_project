// frontend/src/services/categoryService.js
import apiClient from "../api"; // 위에서 만든 axios 인스턴스 import

// 기본 경로 (baseURL이 /api 이므로 여기선 그 뒤 경로만 작성)
const BASE_URL = "/categories";

const getCategories = async () => {
  // apiClient가 baseURL과 인증 처리를 담당하므로 간단하게 호출
  const response = await apiClient.get(BASE_URL);
  return response.data.categories;
};

const createCategory = async (name, color) => {
  const response = await apiClient.post(BASE_URL, { name, color });
  return response.data.category;
};

const updateCategory = async (id, name, color) => {
  const response = await apiClient.put(`${BASE_URL}/${id}`, { name, color });
  return response.data.category;
};

const deleteCategory = async (id) => {
  const response = await apiClient.delete(`${BASE_URL}/${id}`);
  return response.data;
};

const categoryService = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default categoryService;
