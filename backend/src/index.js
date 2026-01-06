const express = require('express');
const pool = require('./config/db');
require('dotenv').config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server Running!');
});

// 예시: DB에서 데이터 조회
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('DB Error');
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});