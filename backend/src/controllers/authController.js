// backend/src/controllers/authController.js
const authService = require('../services/authService');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    // accessToken, refreshToken, user 정보를 모두 반환
    res.json(result);
  } catch (error) {
    console.error(error);
    const status = error.statusCode || 500;
    res.status(status).json({ message: error.message || '서버 에러' });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body; // body에서 받음
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh Token 필요' });
    }
    const newAccessToken = await authService.refresh(refreshToken);
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error(error);
    res.status(403).json({ message: '토큰 검증 실패' });
  }
};

exports.logout = async (req, res) => {
  try {
    const userId = req.user.id;
    await authService.logout(userId);
    res.json({ message: '로그아웃 성공' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '에러 발생' });
  }
};

// [추가] 내 정보 조회
exports.getMe = async (req, res) => {
  try {
    // verifyToken 미들웨어가 req.user에 { id, email }을 넣어줌
    const userId = req.user.id; 
    const user = await authService.findUserById(userId);
    if (!user) return res.status(404).json({ message: '유저 없음' });
    
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 에러' });
  }
};