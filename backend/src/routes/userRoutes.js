// backend/src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware'); // src/middleware 경로

// 1. 회원가입
router.post('/signup', userController.createUser);

// 2. 로그인 (POST /login)
router.post('/login', userController.login);

// 3. 토큰 재발급 (POST /refresh)
router.post('/refresh', userController.refresh);

// 4. 로그아웃 (POST /logout)
router.post('/logout', verifyToken, userController.logout);

module.exports = router;