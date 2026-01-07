// fr
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService'; // 서비스 연결
import apiClient from '../api';

// 컨텍스트 생성
const AuthContext = createContext(null);

// 프로바이더 컴포넌트
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 새로고침 해도 로그인 유지하기 (초기화)
  useEffect(() => {
    const initAuth = async () => {
      try {
        // 내 정보 가져오기 API 호출 (쿠키 인증)
        const response = await apiClient.get('/users/me');
        // 백엔드 응답 형태에 따라 user 필드가 있거나 전체가 user일 수 있음
        setUser(response.data?.user ?? response.data ?? null);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  // 로그인 함수
  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password });
      setUser(response.data?.user ?? response.data ?? null);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || '로그인 실패' };
    }
  };

  // 회원가입 함수
  const signup = async (userInfo) => {
    try {
      const response = await authService.signUp(userInfo);
      setUser(response.data?.user ?? response.data ?? null);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || '가입 실패' };
    }
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      // 로그아웃 후 로그인 페이지로 이동
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

// 훅으로 만들어서 내보내기 (이걸 Dashboard에서 씀)
export const useAuth = () => useContext(AuthContext);