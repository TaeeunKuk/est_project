// src/middleware/authMiddleware.js
const { verifyAccessToken } = require("../utils/tokenUtils");

const verifyToken = (req, res, next) => {
  // 1. 헤더에서 토큰 추출 (Authorization: Bearer <token>)
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "UNAUTHORIZED" });
  }

  try {
    // 2. 유틸리티를 통해 토큰 검증
    const decoded = verifyAccessToken(token);

    // 3. 검증 성공 시 요청 객체에 유저 정보 담기
    req.user = decoded;
    next();
  } catch (err) {
    // 4. 에러 처리
    if (err.name === "TokenExpiredError") {
      // 419: 토큰 만료 (프론트엔드 인터셉터가 재발급 요청을 보내기 위함)
      return res.status(419).json({ code: 419, message: "TOKEN_EXPIRED" });
    }
    return res.status(401).json({ message: "INVALID_TOKEN" });
  }
};

module.exports = verifyToken;
