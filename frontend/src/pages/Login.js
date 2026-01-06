import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../assets/styles/main.scss';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 로그인 시도
    const result = await login(email, password);
    
    if (result.success) {
      navigate('/'); // 대시보드로 이동
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>로그인</h2>
        {error && <p className="error-msg">{error}</p>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <input 
            type="email" 
            placeholder="이메일 (test@example.com)" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="비밀번호 (password123)" 
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