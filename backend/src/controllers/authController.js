// backend/src/controllers/authController.js
const authService = require("../services/authService");

// 쿠키 옵션 (보안 설정)
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
};

const accessTokenOptions = {
  ...cookieOptions,
  maxAge: 60 * 60 * 1000, // 1시간
};

exports.signup = async (req, res) => {
  try {
    const userInfo = req.body;
    const result = await authService.signUp(userInfo);

    // [핵심] 쿠키 굽기
    res.cookie("accessToken", result.accessToken, accessTokenOptions);
    res.cookie("refreshToken", result.refreshToken, cookieOptions);

    res.status(201).json({
      message: "회원가입 성공",
      user: result.user, // 토큰 제외하고 유저 정보만 보냄
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "가입 실패" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    // [핵심] 쿠키 굽기
    res.cookie("accessToken", result.accessToken, accessTokenOptions);
    res.cookie("refreshToken", result.refreshToken, cookieOptions);

    res.json({
      message: "로그인 성공",
      user: result.user, // 토큰 제외
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "로그인 실패" });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    // 쿠키에서 리프레시 토큰 꺼내기
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh Token 필요" });
    }

    const newAccessToken = await authService.refresh(refreshToken);

    // 새 액세스 토큰도 쿠키로 굽기
    res.cookie("accessToken", newAccessToken, accessTokenOptions);

    res.json({ message: "토큰 갱신 성공" });
  } catch (error) {
    // 리프레시 실패 시 쿠키 삭제 (로그아웃 처리)
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(403).json({ message: "토큰 검증 실패" });
  }
};

exports.logout = async (req, res) => {
  try {
    if (req.user) await authService.logout(req.user.id);

    // [핵심] 쿠키 삭제
    res.clearCookie("accessToken", accessTokenOptions);
    res.clearCookie("refreshToken", cookieOptions);

    res.json({ message: "로그아웃 성공" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "에러 발생" });
  }
};

// getMe는 그대로 (미들웨어에서 처리)
exports.getMe = async (req, res) => {
  const userId = req.user.id;
  const user = await authService.findUserById(userId);
  if (!user) return res.status(404).json({ message: "유저 없음" });
  res.json({ user });
};
