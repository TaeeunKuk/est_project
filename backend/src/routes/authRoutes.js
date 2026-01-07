// backend/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware'); 

// POST /api/auth/login
router.post('/login', authController.login);

// POST /api/auth/refresh
router.post('/refresh', authController.refreshToken);

// POST /api/auth/logout (로그인 필요)
router.post('/logout', verifyToken, authController.logout);

// [추가] GET /api/auth/me (로그인 필요 - 새로고침 시 호출됨)
router.get('/me', verifyToken, authController.getMe);

module.exports = router;