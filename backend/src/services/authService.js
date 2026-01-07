// src/services/authService.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');       // PostgreSQL
const redisClient = require('../config/redis'); // Redis

/**
 * 로그인 서비스
 */
exports.login = async (email, password) => {
  // 1. DB에서 유저 조회
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  
  if (result.rows.length === 0) {
    const error = new Error('존재하지 않는 사용자입니다.');
    error.statusCode = 404;
    throw error;
  }

  const user = result.rows[0];

  // 2. 비밀번호 비교
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('비밀번호가 일치하지 않습니다.');
    error.statusCode = 400;
    throw error;
  }

  // 3. Access Token 발급 (30분)
  const accessToken = jwt.sign(
    { id: user.id, email: user.email }, 
    process.env.JWT_SECRET, 
    { expiresIn: '30m' }
  );

  // 4. Refresh Token 발급 (7일)
  const refreshToken = jwt.sign(
    { id: user.id, email: user.email }, 
    process.env.JWT_REFRESH_SECRET, 
    { expiresIn: '7d' }
  );

  // 5. Redis에 Refresh Token 저장 (7일 후 자동 삭제)
  await redisClient.set(user.id.toString(), refreshToken, {
    EX: 7 * 24 * 60 * 60 
  });

  // [수정] 프론트엔드 상태 업데이트를 위해 user 정보도 반환 (비밀번호 제외)
  const userInfo = { id: user.id, email: user.email, name: user.name }; // name 등 필요한 필드 추가
  return { accessToken, refreshToken, user: userInfo };
};

/**
 * 토큰 재발급 서비스
 */
exports.refresh = async (refreshToken) => {
  // 1. 토큰 자체 유효성 검증
  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  const userId = decoded.id;

  // 2. Redis에서 저장된 토큰 가져오기
  const storedToken = await redisClient.get(userId.toString());

  // 3. Redis 토큰과 비교
  if (!storedToken || storedToken !== refreshToken) {
    const error = new Error('유효하지 않거나 만료된 Refresh Token입니다.');
    error.statusCode = 403;
    throw error;
  }

  // 4. 새로운 Access Token 발급
  const newAccessToken = jwt.sign(
    { id: userId, email: decoded.email },
    process.env.JWT_SECRET,
    { expiresIn: '30m' }
  );

  return newAccessToken;
};

/**
 * 로그아웃 서비스
 */
exports.logout = async (userId) => {
  await redisClient.del(userId.toString());
};

/**
 * [추가] ID로 유저 조회 (내 정보 가져오기용)
 */
exports.findUserById = async (userId) => {
  const result = await pool.query('SELECT id, email, name FROM users WHERE id = $1', [userId]);
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0];
};