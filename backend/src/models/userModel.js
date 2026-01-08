// backend/src/models/userModel.js
const pool = require("../config/db");

// 이메일로 유저 찾기
const findByEmail = async (email) => {
  const query = "SELECT * FROM users WHERE email = $1";
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

// ID로 유저 찾기
const findById = async (id) => {
  const query = "SELECT * FROM users WHERE id = $1";
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// 유저 생성
const createUser = async (userInfo) => {
  const { email, password, name } = userInfo;
  const query = `
    INSERT INTO users (email, password, name)
    VALUES ($1, $2, $3)
    RETURNING id, email, name, created_at
  `;
  const result = await pool.query(query, [email, password, name]);
  return result.rows[0];
};

module.exports = { findByEmail, findById, createUser };
