import React, { createContext, useState, useContext, useEffect } from "react";
import { authService } from "../services/authService";
import apiClient from "../api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. 앱 실행(새로고침) 시 초기화 로직
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await apiClient.get("/auth/me");
        setUser(response.data.user);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
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
      // 백엔드 구조: { accessToken, refreshToken, user, ... }
      const { accessToken, refreshToken, user: userData } = response.data;

      // 토큰 저장
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      setUser(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "로그인 실패",
      };
    }
  };

  // 3. 회원가입 (수정됨: 가입 후 바로 로그인 상태 처리)
  const signup = async (userInfo) => {
    try {
      // 백엔드가 회원가입 성공 시 토큰과 유저 정보를 함께 반환합니다.
      const response = await authService.signUp(userInfo);
      const { accessToken, refreshToken, user: userData } = response.data;

      // [핵심 수정] 로그인 함수처럼 토큰을 저장하고 상태를 업데이트합니다.
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      setUser(userData);
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
      await authService.logout();
    } catch (e) {
      console.warn(e);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      // window.location.href는 컴포넌트 레벨에서 navigate로 처리하는 것이 더 깔끔하지만,
      // Context 내부에서 강제 리다이렉트가 필요하다면 유지해도 됩니다.
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
