import React, { createContext, useState, useContext } from 'react';
import { login as apiLogin, logout as apiLogout } from '../api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await apiLogin({ email, password });
      const userData = response.data.user || response.data;
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || '로그인 실패' };
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
    } finally {
      setUser(null);
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);