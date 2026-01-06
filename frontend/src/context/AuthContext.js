// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { mockAccount } from '../api/mockData';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // 로그인한 유저 정보
  const [loading, setLoading] = useState(true);

  // 앱 실행 시 로컬 스토리지에서 토큰 확인 (로그인 유지)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // --- 로그인 기능 ---
  const login = async (email, password) => {
    /* TODO: [Backend Integration] 로그인 API 호출
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        
        // 성공 시
        setUser(data.user);
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    */

    // [Mock Logic] 더미 데이터와 비교
    if (email === mockAccount.email && password === mockAccount.password) {
      const userInfo = { email: mockAccount.email, name: mockAccount.name };
      setUser(userInfo);
      localStorage.setItem('user', JSON.stringify(userInfo)); // 세션 유지용
      localStorage.setItem('token', mockAccount.token);     // JWT 토큰 저장용
      return { success: true };
    } else {
      return { success: false, message: '이메일 또는 비밀번호가 일치하지 않습니다.' };
    }
  };

  // --- 회원가입 기능 ---
  const signup = async (email, password, name) => {
    /*
      TODO: [Backend Integration] 회원가입 API 호출
      const response = await fetch('/api/auth/register', { ... });
    */
    
    // [Mock Logic] 성공했다고 가정
    console.log(`회원가입 요청: ${email}, ${name}`);
    return { success: true };
  };

  // --- 로그아웃 기능 ---
  const logout = () => {
    /* TODO: [Optional] Redis에서 Refresh Token 삭제 요청 (Backend) */
    
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};