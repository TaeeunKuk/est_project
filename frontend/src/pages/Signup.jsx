// frontend/src/pages/Signup.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Context 사용
import '../assets/styles/main.scss';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  
  const { signup } = useAuth(); // Context에서 signup 가져오기
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    // Context의 signup 함수 호출 (자동 로그인 처리됨)
    const result = await signup({
      email: formData.email,
      password: formData.password,
      name: formData.name
    });

    if (result.success) {
      alert('회원가입을 환영합니다!'); 
      navigate('/dashboard'); // [핵심] 로그인 페이지가 아닌 대시보드로 바로 이동
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>회원가입</h2>
        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <input 
            type="email" 
            name="email"
            placeholder="이메일" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
          <input 
            type="text" 
            name="name"
            placeholder="이름 (닉네임)" 
            value={formData.name} 
            onChange={handleChange} 
            required 
          />
          <input 
            type="password" 
            name="password"
            placeholder="비밀번호" 
            value={formData.password} 
            onChange={handleChange} 
            required 
          />
          <input 
            type="password" 
            name="confirmPassword"
            placeholder="비밀번호 확인" 
            value={formData.confirmPassword} 
            onChange={handleChange} 
            required 
          />
          <button type="submit">가입하기</button>
        </form>

        <div className="auth-footer">
          이미 계정이 있으신가요? 
          <Link to="/login">로그인</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;