// backend/src/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "secret";

const verifyToken = (req, res, next) => {
  // [수정] 헤더가 아닌 쿠키에서 토큰을 찾습니다.
  // req.cookies가 없으면 cookie-parser가 동작하지 않은 것입니다.
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: "UNAUTHORIZED" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    // 토큰 만료 시 프론트엔드 인터셉터가 419/401을 잡아 재발급 요청을 보낼 수 있도록 함
    if (err.name === "TokenExpiredError") {
      return res.status(419).json({ code: 419, message: "TOKEN_EXPIRED" });
    }
    return res.status(401).json({ message: "INVALID_TOKEN" });
  }
};

module.exports = verifyToken;
