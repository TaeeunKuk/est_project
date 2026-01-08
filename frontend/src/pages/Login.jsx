// frontend/src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../assets/styles/main.scss";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const success = await login(email, password);
      if (success) {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "이메일 또는 비밀번호를 확인해주세요."
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* 브랜딩 헤더 추가 */}
        <div className="brand">
          <h1>My Scheduler</h1>
        </div>

        <h2>로그인</h2>
        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">로그인</button>
        </form>

        <div className="auth-footer">
          계정이 없으신가요?
          <Link to="/signup">회원가입</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
