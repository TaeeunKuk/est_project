// src/controllers/userController.js
const pool = require('../config/db');

// 회원가입 로직
exports.createUser = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // 1. 데이터 입력 (INSERT)
    const query = `
      INSERT INTO users (email, password, name)
      VALUES ($1, $2, $3)
      RETURNING id, email, name, created_at
    `;
    const values = [email, password, name];
    
    const result = await pool.query(query, values);

    // 2. 성공 응답
    res.status(201).json({
      message: '회원가입 성공!',
      user: result.rows[0]
    });

  } catch (err) {
    console.error(err);
    // 이메일 중복 에러 처리 (PostgreSQL 에러코드 23505)
    if (err.code === '23505') {
      return res.status(409).json({ message: '이미 존재하는 이메일입니다.' });
    }
    res.status(500).json({ message: '서버 에러 발생' });
  }
};