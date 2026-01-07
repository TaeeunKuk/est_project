// backend/src/index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser"); // [추가]
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// [핵심 수정] CORS 설정: Credentials(쿠키)를 허용하려면 origin을 명시해야 함
app.use(
  cors({
    origin: "http://localhost:3000", // 프론트엔드 주소 (정확히 일치해야 함)
    credentials: true, // 쿠키 주고받기 허용
  })
);

app.use(cookieParser()); // [추가] 쿠키 파싱 미들웨어
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
