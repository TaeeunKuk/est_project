// src/utils/tokenUtils.js
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret";

/**
 * Access Token과 Refresh Token을 생성하여 반환
 */
exports.generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "30m" } // 30분
  );

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email },
    JWT_REFRESH_SECRET,
    { expiresIn: "7d" } // 7일
  );

  return { accessToken, refreshToken };
};

/**
 * Access Token 검증
 * - 성공 시: decoded payload 반환
 * - 실패 시: throw Error
 */
exports.verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    // 호출하는 쪽(미들웨어)에서 에러 종류를 구분할 수 있도록 에러를 그대로 던짐
    throw error;
  }
};

/**
 * Refresh Token 검증
 */
exports.verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  } catch (error) {
    throw error;
  }
};
