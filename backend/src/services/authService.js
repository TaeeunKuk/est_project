// backend/src/services/authService.js
const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel"); // DB 접근은 Model 사용
const tokenUtils = require("../utils/tokenUtils"); // 토큰 생성은 Utils 사용
const redisClient = require("../config/redis"); // Redis

/**
 * 회원가입 서비스
 */
exports.signUp = async (userInfo) => {
  // 1. 이메일 중복 확인
  const existingUser = await userModel.findByEmail(userInfo.email);
  if (existingUser) {
    const error = new Error("EMAIL_EXISTS");
    error.statusCode = 400;
    throw error;
  }

  // 2. 비밀번호 암호화
  const hashedPassword = await bcrypt.hash(userInfo.password, 10);

  // 3. 유저 생성 (Model 사용)
  const newUser = await userModel.createUser({
    ...userInfo,
    password: hashedPassword,
  });

  // 4. 토큰 발급 (Utils 사용)
  const { accessToken, refreshToken } = tokenUtils.generateTokens(newUser);

  // 5. Redis에 Refresh Token 저장
  if (redisClient) {
    await redisClient.set(newUser.id.toString(), refreshToken, {
      EX: 7 * 24 * 60 * 60,
    });
  }

  return { accessToken, refreshToken, user: newUser };
};

/**
 * 로그인 서비스
 */
exports.login = async (email, password) => {
  // 1. 유저 조회
  const user = await userModel.findByEmail(email);
  if (!user) {
    const error = new Error("USER_NOT_FOUND");
    error.statusCode = 404;
    throw error;
  }

  // 2. 비밀번호 확인
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("INVALID_PASSWORD");
    error.statusCode = 400;
    throw error;
  }

  // 3. 토큰 발급 (Utils 사용)
  const { accessToken, refreshToken } = tokenUtils.generateTokens(user);

  // 4. Redis 저장
  if (redisClient) {
    await redisClient.set(user.id.toString(), refreshToken, {
      EX: 7 * 24 * 60 * 60,
    });
  }

  return { accessToken, refreshToken, user };
};

/**
 * 토큰 재발급 서비스
 */
exports.refresh = async (refreshToken) => {
  // 1. 토큰 검증 (Utils 사용)
  const decoded = tokenUtils.verifyRefreshToken(refreshToken);
  const userId = decoded.id;

  // 2. Redis 토큰 확인
  if (redisClient) {
    const storedToken = await redisClient.get(userId.toString());
    if (!storedToken || storedToken !== refreshToken) {
      const error = new Error("INVALID_REFRESH_TOKEN");
      error.statusCode = 403;
      throw error;
    }
  }

  // 3. 새 토큰 생성 (Access Token만 갱신)
  // userModel을 통해 최신 정보를 가져와서 토큰 생성 (선택 사항)
  const user = (await userModel.findById(userId)) || {
    id: userId,
    email: decoded.email,
  };
  const { accessToken } = tokenUtils.generateTokens(user);

  return accessToken;
};

/**
 * 로그아웃 서비스
 */
exports.logout = async (userId) => {
  if (redisClient) {
    await redisClient.del(userId.toString());
  }
};

/**
 * 유저 정보 조회 (내 정보 가져오기용)
 */
exports.findUserById = async (userId) => {
  const user = await userModel.findById(userId);
  return user;
};
