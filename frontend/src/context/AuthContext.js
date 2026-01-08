import React, { createContext, useState, useContext, useEffect } from "react";
import { authService } from "../services/authService";
import apiClient from "../api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. 초기화 (새로고침 시 내 정보 가져오기)
  useEffect(() => {
    const initAuth = async () => {
      try {
        // 쿠키가 자동으로 전송되므로 별도 설정 없이 호출
        const response = await apiClient.get("/auth/me");
        setUser(response.data.user);
      } catch (error) {
        // 에러 발생 시(쿠키 없음 등) 로그아웃 상태로 간주
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
      // [중요] 토큰 저장 로직 삭제됨 (쿠키가 자동 처리)
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "로그인 실패",
      };
    }
  };

  // 3. 회원가입
  const signup = async (userInfo) => {
    try {
      const response = await authService.signUp(userInfo);
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "가입 실패",
      };
    }
  };

  // 4. 로그아웃
  const logout = async () => {
    try {
      await authService.logout(); // 백엔드가 쿠키 삭제함
    } catch (e) {
      console.warn(e);
    } finally {
      setUser(null);
      // 로컬 스토리지 삭제 로직 필요 없음
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
