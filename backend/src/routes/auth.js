// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');       // PostgreSQL
const redisClient = require('../config/redis'); // Redis

// 1. 로그인 (Login)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1-1. DB에서 이메일로 유저 찾기
    // (users 테이블과 컬럼명은 실제 DB에 맞춰주세요)
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: '존재하지 않는 사용자입니다.' });
    }

    const user = result.rows[0];

    // 1-2. 비밀번호 비교 (bcrypt)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    // 1-3. Access Token 발급 (30분)
    const accessToken = jwt.sign(
      { id: user.id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '30m' }
    );

    // 1-4. Refresh Token 발급 (7일)
    const refreshToken = jwt.sign(
      { id: user.id, email: user.email }, 
      process.env.JWT_REFRESH_SECRET, 
      { expiresIn: '7d' }
    );

    // 1-5. Redis에 Refresh Token 저장 (Key: 유저ID, Value: 토큰)
    // EX 옵션으로 7일(604800초) 뒤 자동 삭제 설정
    await redisClient.set(user.id.toString(), refreshToken, {
      EX: 7 * 24 * 60 * 60 
    });

    // 1-6. 응답
    res.json({
      message: '로그인 성공',
      accessToken,
      refreshToken
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 에러 발생' });
  }
});

// 2. 토큰 재발급 (Reissue)
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh Token이 필요합니다.' });
  }

  try {
    // 2-1. 토큰 자체 유효성 검증 (위변조/만료 체크)
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const userId = decoded.id;

    // 2-2. Redis에 저장된 토큰 값 가져오기
    const storedToken = await redisClient.get(userId.toString());

    // 2-3. Redis에 없거나, 요청받은 토큰과 다르면 실패 처리
    if (!storedToken || storedToken !== refreshToken) {
      return res.status(403).json({ message: '유효하지 않거나 만료된 Refresh Token입니다.' });
    }

    // 2-4. 새로운 Access Token 발급
    const newAccessToken = jwt.sign(
      { id: userId, email: decoded.email },
      process.env.JWT_SECRET,
      { expiresIn: '30m' }
    );

    res.json({ accessToken: newAccessToken });

  } catch (error) {
    console.error(error);
    res.status(403).json({ message: 'Refresh Token 검증 실패' });
  }
});

// 3. 로그아웃 (Logout)
router.post('/logout', verifyToken, async (req, res) => {
    // verifyToken 미들웨어를 거쳤으므로 req.user에 정보가 있음
    const userId = req.user.id;

    // Redis에서 해당 유저의 Refresh Token 삭제
    await redisClient.del(userId.toString());

    res.json({ message: '로그아웃 되었습니다.' });
});

module.exports = router;