// src/services/userService.js
const userModel = require("../models/userModel");

// 회원가입, 로그인, 토큰 로직은 모두 authService.js로 이동했습니다.
// 이곳에는 인증을 제외한 순수 유저 비즈니스 로직(예: 프로필 수정, 회원 탈퇴, 유저 검색 등)을 작성합니다.

/**
 * (예시) 유저 프로필 조회
 */
const getUserProfile = async (userId) => {
  const user = await userModel.findById(userId);
  if (!user) throw new Error("USER_NOT_FOUND");
  // 민감한 정보 제외 후 반환
  const { password, ...userInfo } = user;
  return userInfo;
};

module.exports = {
  getUserProfile,
  // 추후 필요한 유저 관련 서비스 함수 추가
};
