// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware');

// 1. 로그인
router.post('/login', authController.login);

// 2. 토큰 재발급
router.post('/refresh', authController.refreshToken);

// 3. 로그아웃
// verifyToken 미들웨어를 먼저 거치도록 설정
router.post('/logout', verifyToken, authController.logout);

module.exports = router;