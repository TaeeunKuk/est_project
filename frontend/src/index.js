// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/main.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/AuthContext'; // 👈 import 추가

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 👇 AuthProvider로 App 전체를 감싸야 하위 컴포넌트에서 useAuth 사용 가능 */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();