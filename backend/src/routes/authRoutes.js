// backend/src/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const verifyToken = require("../middleware/authMiddleware");

// [추가] POST /api/auth/signup (회원가입)
router.post("/signup", authController.signup);

// POST /api/auth/login
router.post("/login", authController.login);

// POST /api/auth/refresh
router.post("/refresh", authController.refreshToken);

// POST /api/auth/logout
router.post("/logout", verifyToken, authController.logout);

// GET /api/auth/me
router.get("/me", verifyToken, authController.getMe);

module.exports = router;
