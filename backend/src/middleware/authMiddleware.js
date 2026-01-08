// backend/src/middleware/authMiddleware.js
const { verifyAccessToken } = require("../utils/tokenUtils");

const verifyToken = (req, res, next) => {
  // 헤더가 아니라 쿠키(req.cookies)에서 찾습니다.
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: "UNAUTHORIZED" });
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(419).json({ code: 419, message: "TOKEN_EXPIRED" });
    }
    return res.status(401).json({ message: "INVALID_TOKEN" });
  }
};

module.exports = verifyToken;
