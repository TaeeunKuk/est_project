// backend/src/controllers/userController.js
const userService = require('../services/userService');

// 쿠키 옵션 설정 (중복 제거용)
const cookieOptions = {
  httpOnly: true, // 자바스크립트로 접근 불가 (XSS 방지)
  secure: process.env.NODE_ENV === 'production', // 배포 시에는 true (HTTPS 필요)
  sameSite: 'strict', // CSRF 방지
};

const createUser = async (req, res) => {
  try {
    const { user, accessToken, refreshToken } = await userService.registerUser(req.body);

    // [수정] 토큰을 쿠키에 담아 보냄
    res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 60 * 60 * 1000 }); // 1시간
    res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7일

    // Body에는 유저 정보만 보냄 (토큰 제외)
    res.status(201).json({ message: 'CREATED', user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    // userService에 loginUser 함수가 있다고 가정 (기존 registerUser 로직 활용 또는 분리)
    // 여기서는 registerUser와 동일한 구조라고 가정하고 작성합니다.
    const { user, accessToken, refreshToken } = await userService.loginUser(req.body); // loginUser 구현 필요

    // [수정] 쿠키 설정
    res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 60 * 60 * 1000 });
    res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.status(200).json({ message: 'LOGIN_SUCCESS', user });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

const logout = (req, res) => {
  // [수정] 로그아웃 시 쿠키 삭제
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.status(200).json({ message: 'LOGOUT_SUCCESS' });
};

const refresh = async (req, res) => {
  try {
    // [수정] 쿠키에서 리프레시 토큰을 가져옴
    const refreshToken = req.cookies.refreshToken; 
    
    if (!refreshToken) throw new Error('NO_REFRESH_TOKEN');

    // 서비스 로직 호출 (userService.refreshUser 등 구현 필요)
    // 예시: const newAccessToken = await userService.refresh(refreshToken);
    
    // 임시 예시 로직
    const newAccessToken = 'new_generated_token_example'; 

    // 새 액세스 토큰을 쿠키로 재발급
    res.cookie('accessToken', newAccessToken, { ...cookieOptions, maxAge: 60 * 60 * 1000 });
    
    res.status(200).json({ message: 'REFRESH_SUCCESS' });
  } catch (err) {
    res.status(401).json({ message: 'REFRESH_FAILED' });
  }
};



module.exports = { createUser, login, logout, refresh };