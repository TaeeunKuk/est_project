import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api', 
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // [필수] HttpOnly 쿠키 전송
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if ((error.response?.status === 419 || error.response?.status === 401) && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await apiClient.post('/users/refresh'); 
        return apiClient(originalRequest);
      } catch (refreshError) {
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// 인증 관련
export const signUp = (data) => apiClient.post('/users/signup', data);
export const login = (data) => apiClient.post('/users/login', data);
export const logout = () => apiClient.post('/users/logout');

// 투두 관련
export const getTodos = () => apiClient.get('/todos');
export const createTodo = (data) => apiClient.post('/todos', data);
export const updateTodo = (id, data) => apiClient.put(`/todos/${id}`, data);
export const deleteTodo = (id) => apiClient.delete(`/todos/${id}`);

export default apiClient;