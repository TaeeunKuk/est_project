// src/controllers/authController.js
const authService = require('../services/authService');

// 1. 로그인
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 서비스 호출
    const tokenData = await authService.login(email, password);

    res.json({
      message: '로그인 성공',
      ...tokenData
    });
  } catch (error) {
    console.error(error);
    const status = error.statusCode || 500;
    res.status(status).json({ message: error.message || '서버 에러 발생' });
  }
};

// 2. 토큰 재발급
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh Token이 필요합니다.' });
    }

    // 서비스 호출
    const newAccessToken = await authService.refresh(refreshToken);

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error(error);
    // JWT Verify 에러이거나 비즈니스 로직 에러일 경우 403 처리
    res.status(403).json({ message: 'Refresh Token 검증 실패' });
  }
};

// 3. 로그아웃
exports.logout = async (req, res) => {
  try {
    // 미들웨어(verifyToken)를 통과했다면 req.user에 정보가 있음
    const userId = req.user.id;

    // 서비스 호출
    await authService.logout(userId);

    res.json({ message: '로그아웃 되었습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '로그아웃 처리 중 에러 발생' });
  }
};