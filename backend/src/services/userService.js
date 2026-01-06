// backend/src/services/userService.js
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // 암호화 모듈
const redisClient = require('../config/redis'); // Redis (없으면 주석 처리하거나 빼셔도 됩니다)

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// 1. 회원가입
const registerUser = async (userData) => {
  const existingUser = await userModel.findByEmail(userData.email);
  if (existingUser) {
    throw new Error('EMAIL_EXISTS');
  }

  // 비밀번호 암호화
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const newUser = await userModel.createUser({
    ...userData,
    password: hashedPassword,
  });

  // 토큰 발급
  const { accessToken, refreshToken } = generateTokens(newUser);

  // Redis 저장
  await saveRefreshToken(newUser.id, refreshToken);

  return { user: newUser, accessToken, refreshToken };
};

// 2. 로그인 (★ 이 함수가 없어서 500 에러가 났습니다)
const loginUser = async ({ email, password }) => {
  // 유저 찾기
  const user = await userModel.findByEmail(email);
  if (!user) {
    throw new Error('USER_NOT_FOUND');
  }

  // 비밀번호 확인 (입력된 비번 vs DB의 암호화된 비번)
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('INVALID_PASSWORD');
  }

  // 토큰 발급
  const { accessToken, refreshToken } = generateTokens(user);

  // Redis 저장
  await saveRefreshToken(user.id, refreshToken);

  return { user, accessToken, refreshToken };
};

// --- 공통 내부 함수 ---

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

const saveRefreshToken = async (userId, token) => {
  // Redis가 연결되어 있다고 가정
  if (redisClient) {
    await redisClient.set(
      `refresh_token:${userId}`, 
      token, 
      { EX: 7 * 24 * 60 * 60 } // 7일
    );
  }
};

module.exports = { registerUser, loginUser };