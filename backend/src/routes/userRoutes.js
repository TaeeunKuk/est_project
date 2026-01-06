// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// POST /api/users/signup 주소로 요청이 오면 createUser 실행
router.post('/signup', userController.createUser);

module.exports = router;