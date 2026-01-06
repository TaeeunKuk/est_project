// src/api/mockData.js

// 로그인 테스트용 계정
export const mockAccount = {
  email: "test@example.com",
  password: "password123", // 실제로는 해시된 값이어야 함
  name: "김인턴",
  token: "mock-jwt-token-xyz" // 가짜 토큰
};

// ... (기존 mockTodos, mockCategories 등은 그대로 유지)
export const mockCategories = [
  { id: 1, title: "업무", color: "#3182ce" },
  { id: 2, title: "개인", color: "#38a169" },
  { id: 3, title: "긴급", color: "#e53e3e" },
];

export const mockTodos = [
  { id: 1, title: "DB 스키마 작성", date: "2024-05-20", isCompleted: true, categoryId: 1 },
  { id: 2, title: "프론트엔드 구현", date: "2024-05-20", isCompleted: false, categoryId: 1 },
];