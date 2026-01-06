import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../assets/styles/main.scss';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 유효성 검사
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 회원가입 시도
    const result = await signup(formData.email, formData.password, formData.name);

    if (result.success) {
      alert('회원가입이 완료되었습니다. 로그인해주세요.');
      navigate('/login');
    } else {
      setError('회원가입 실패: 다시 시도해주세요.');
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