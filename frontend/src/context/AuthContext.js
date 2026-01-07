// frontend/src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';
import apiClient from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. 앱 실행(새로고침) 시 초기화 로직
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      
      // 토큰이 없으면 로딩 끝내고 리턴
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // 토큰이 있다면 내 정보 가져오기 시도 (/auth/me)
        // api/index.js의 인터셉터가 헤더에 토큰을 자동으로 넣어줌
        const response = await apiClient.get('/auth/me');
        setUser(response.data.user);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        // 에러 나면 토큰 삭제 (로그아웃 처리)
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // 2. 로그인
  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password });
      // 백엔드에서 { accessToken, refreshToken, user }를 준다고 가정
      const { accessToken, refreshToken, user: userData } = response.data;

      // 토큰 저장
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || '로그인 실패' };
    }
  };

  // 3. 회원가입
  const signup = async (userInfo) => {
    try {
      await authService.signUp(userInfo);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || '가입 실패' };
    }
  };

  // 4. 로그아웃
  const logout = async () => {
    try {
      await authService.logout(); // 백엔드 로그아웃 (Redis 삭제 등)
    } catch (e) {
      console.warn(e);
    } finally {
      // 클라이언트 정리
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);